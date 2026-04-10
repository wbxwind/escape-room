-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.game_assets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  room_code text,
  card_number text NOT NULL UNIQUE,
  type_string text,
  type USER-DEFINED,
  title text,
  content_front text,
  content_back text,
  default_zone USER-DEFINED DEFAULT 'DECK'::board_zone,
  CONSTRAINT game_assets_pkey PRIMARY KEY (id),
  CONSTRAINT board_assets_room_code_fkey FOREIGN KEY (room_code) REFERENCES public.room_state(room_code)
);
CREATE TABLE public.interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  action_card_id uuid,
  situation_card_id uuid,
  result_type text NOT NULL,
  target_card_number character varying,
  has_magnifying_glass boolean DEFAULT false,
  CONSTRAINT interactions_pkey PRIMARY KEY (id),
  CONSTRAINT interactions_action_card_id_fkey FOREIGN KEY (action_card_id) REFERENCES public.game_assets(id),
  CONSTRAINT interactions_situation_card_id_fkey FOREIGN KEY (situation_card_id) REFERENCES public.game_assets(id)
);
CREATE TABLE public.room_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  room_code text,
  user_id uuid NOT NULL,
  username text,
  is_muted boolean DEFAULT false,
  is_deafened boolean DEFAULT false,
  last_seen timestamp with time zone DEFAULT now(),
  CONSTRAINT room_participants_pkey PRIMARY KEY (id),
  CONSTRAINT room_participants_room_code_fkey FOREIGN KEY (room_code) REFERENCES public.room_state(room_code)
);
CREATE TABLE public.room_state (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  room_code text UNIQUE,
  current_step integer DEFAULT 1,
  is_finished boolean DEFAULT false,
  last_action_text text,
  asset_id uuid,
  current_zone USER-DEFINED DEFAULT 'DECK'::board_zone,
  attached_to uuid,
  panorama_slot integer,
  voice_channel_id text,
  CONSTRAINT room_state_pkey PRIMARY KEY (id),
  CONSTRAINT room_state_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.game_assets(id),
  CONSTRAINT room_state_attached_to_fkey FOREIGN KEY (attached_to) REFERENCES public.game_assets(id)
);