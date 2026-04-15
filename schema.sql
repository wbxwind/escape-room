-- WARNING: This schema is for context only and is not meant to be run directly.
-- Apply changes via the files in /migrations/.

-- Enum type for board zones
-- CREATE TYPE board_zone AS ENUM ('DECK', 'PLAYER_AREA', 'PANORAMA', 'DISCARD', 'CHARACTER_ZONE', 'STORY_ZONE', 'OBJECTIVE');

CREATE TABLE public.room_state (
  id               uuid        NOT NULL DEFAULT gen_random_uuid(),
  room_code        text        UNIQUE,
  current_step     integer     DEFAULT 1,
  is_finished      boolean     DEFAULT false,
  last_action_text text,
  voice_channel_id text,
  CONSTRAINT room_state_pkey PRIMARY KEY (id)
);

CREATE TABLE public.game_assets (
  id            uuid  NOT NULL DEFAULT gen_random_uuid(),
  room_code     text,
  card_number   text  NOT NULL UNIQUE,
  type          text,
  title         text,
  content_front text,
  content_back  text,
  default_zone  text  DEFAULT 'DECK',
  image_url     text,
  CONSTRAINT game_assets_pkey         PRIMARY KEY (id),
  CONSTRAINT game_assets_room_code_fk FOREIGN KEY (room_code) REFERENCES public.room_state(room_code)
);

-- Tracks the live position of every card in every room.
-- One row per (room_code, asset_id) pair — upserted on every move.
CREATE TABLE public.card_positions (
  id            uuid        NOT NULL DEFAULT gen_random_uuid(),
  room_code     text        NOT NULL,
  asset_id      uuid        NOT NULL,
  current_zone  text        NOT NULL DEFAULT 'DECK',
  panorama_slot integer,
  attached_to   uuid,
  locked_by     uuid,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT card_positions_pkey             PRIMARY KEY (id),
  CONSTRAINT card_positions_room_asset_unique UNIQUE (room_code, asset_id),
  CONSTRAINT card_positions_room_code_fk     FOREIGN KEY (room_code)   REFERENCES public.room_state(room_code) ON DELETE CASCADE,
  CONSTRAINT card_positions_asset_id_fk      FOREIGN KEY (asset_id)    REFERENCES public.game_assets(id)      ON DELETE CASCADE,
  CONSTRAINT card_positions_attached_to_fk   FOREIGN KEY (attached_to) REFERENCES public.game_assets(id)
);

CREATE TABLE public.interactions (
  id                  uuid                   NOT NULL DEFAULT gen_random_uuid(),
  action_card_id      uuid,
  situation_card_id   uuid,
  result_type         text                   NOT NULL,
  target_card_number  character varying,
  has_magnifying_glass boolean               DEFAULT false,
  CONSTRAINT interactions_pkey                    PRIMARY KEY (id),
  CONSTRAINT interactions_action_card_id_fk       FOREIGN KEY (action_card_id)    REFERENCES public.game_assets(id),
  CONSTRAINT interactions_situation_card_id_fk    FOREIGN KEY (situation_card_id) REFERENCES public.game_assets(id)
);

CREATE TABLE public.room_participants (
  id          uuid        NOT NULL DEFAULT gen_random_uuid(),
  room_code   text,
  user_id     uuid        NOT NULL,
  username    text,
  is_muted    boolean     DEFAULT false,
  is_deafened boolean     DEFAULT false,
  last_seen   timestamptz DEFAULT now(),
  CONSTRAINT room_participants_pkey         PRIMARY KEY (id),
  CONSTRAINT room_participants_room_code_fk FOREIGN KEY (room_code) REFERENCES public.room_state(room_code)
);
