-- ============================================================
-- Migration 001: card_positions + schema cleanup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ── 1. card_positions ────────────────────────────────────────
-- Tracks the live position of every card in every room.
-- Replaces the broken single-row-per-room pattern in room_state.

CREATE TABLE IF NOT EXISTS public.card_positions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code     text        NOT NULL REFERENCES public.room_state(room_code) ON DELETE CASCADE,
  asset_id      uuid        NOT NULL REFERENCES public.game_assets(id)       ON DELETE CASCADE,
  current_zone  text        NOT NULL DEFAULT 'DECK',
  panorama_slot integer,
  attached_to   uuid        REFERENCES public.game_assets(id),
  locked_by     uuid,       -- future: drag-lock for concurrency (spec §6)
  updated_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT card_positions_room_asset_unique UNIQUE (room_code, asset_id)
);


-- ── 2. Row-Level Security ─────────────────────────────────────
-- Permissive for now; tighten once auth is wired up.

ALTER TABLE public.card_positions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "card_positions_allow_all" ON public.card_positions;
CREATE POLICY "card_positions_allow_all"
  ON public.card_positions
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- ── 3. Realtime ───────────────────────────────────────────────
-- Lets clients subscribe to postgres_changes on this table.

ALTER PUBLICATION supabase_realtime ADD TABLE public.card_positions;


-- ── 4. Drop the legacy type_string column ────────────────────
-- Always NULL in every row; the `type` column (enum) is the source of truth.

ALTER TABLE public.game_assets DROP COLUMN IF EXISTS type_string;


-- ── 5. Ensure image_url exists ────────────────────────────────
-- Already present in live data but missing from the original schema definition.

ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS image_url text;


-- ── 6. Updated-at trigger ─────────────────────────────────────
-- Keeps updated_at current whenever a row changes.

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS card_positions_touch_updated_at ON public.card_positions;
CREATE TRIGGER card_positions_touch_updated_at
  BEFORE UPDATE ON public.card_positions
  FOR EACH ROW EXECUTE PROCEDURE public.touch_updated_at();
