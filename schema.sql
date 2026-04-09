-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.board_assets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  room_code text,
  asset_id text NOT NULL,
  asset_type text,
  x_pos integer DEFAULT 0,
  y_pos integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  attached_to text,
  CONSTRAINT board_assets_pkey PRIMARY KEY (id),
  CONSTRAINT board_assets_room_code_fkey FOREIGN KEY (room_code) REFERENCES public.escape_room_state(room_code)
);
CREATE TABLE public.escape_room_state (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  room_code text UNIQUE,
  current_step integer DEFAULT 1,
  is_finished boolean DEFAULT false,
  last_action_text text,
  CONSTRAINT escape_room_state_pkey PRIMARY KEY (id)
);