-- ============================================================
-- Migration 002: Backstories schema alignment
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================
-- Aligns the schema with the Backstories game mechanics:
--   • Converts game_assets.type from enum → text (must run first)
--   • Renames CHARACTER_ZONE → OBJECTIVE in existing card_positions rows
--   • Adds has_magnifying_glass to game_assets
--   • Adds effect_text to interactions
--   • Updates default_zone for known card types
-- ============================================================


-- ── 1. Convert type column from enum to text ─────────────────
-- The card_type enum is too restrictive — Backstories needs types like
-- NOTCH, ISSUE, ENDING that are not in the original enum.
-- Plain text matches what the TypeScript types already expect (string | null).
-- Must run BEFORE any UPDATE that writes new type values.

ALTER TABLE public.game_assets ALTER COLUMN type TYPE text;


-- ── 2. Rename legacy zone values in card_positions ───────────

UPDATE public.card_positions
SET    current_zone = 'OBJECTIVE'
WHERE  current_zone IN ('CHARACTER_ZONE', 'CHAR', 'OBJECTIVE_AREA');

UPDATE public.card_positions
SET    current_zone = 'PLAYER_AREA'
WHERE  current_zone IN ('PLAYER', 'HAND');

UPDATE public.card_positions
SET    current_zone = 'PANORAMA'
WHERE  current_zone = 'PANORAMA_AREA';


-- ── 3. Add has_magnifying_glass to game_assets ───────────────
-- Cards with this flag set to true can be drawn directly by number
-- (the "magnifying glass" rule in the rulebook).

ALTER TABLE public.game_assets
  ADD COLUMN IF NOT EXISTS has_magnifying_glass boolean DEFAULT false;


-- ── 4. Add effect_text to interactions ───────────────────────
-- Optional narrative text shown when a specific action×situation fires.

ALTER TABLE public.interactions
  ADD COLUMN IF NOT EXISTS effect_text text;


-- ── 5. Normalize legacy type strings ─────────────────────────
-- Now that type is plain text, these UPDATEs work without enum restrictions.

UPDATE public.game_assets SET type = 'SITUATION'
  WHERE UPPER(type) = 'PANORAMA' AND type != 'SITUATION';

UPDATE public.game_assets SET type = 'ACTION_WINDOW'
  WHERE UPPER(type) = 'WINDOW' AND type != 'ACTION_WINDOW';

UPDATE public.game_assets SET type = 'NOTCH'
  WHERE UPPER(type) IN ('ACTION_NOTCH', 'NOTCH_ACTION') AND type != 'NOTCH';


-- ── 6. Align default_zone for existing game_assets ───────────

-- Character / Ending cards → OBJECTIVE
UPDATE public.game_assets
SET    default_zone = 'OBJECTIVE'
WHERE  UPPER(type) IN ('CHARACTER', 'ENDING')
  AND  default_zone != 'OBJECTIVE';

-- Status cards → OBJECTIVE (slide beneath the Character card)
UPDATE public.game_assets
SET    default_zone = 'OBJECTIVE'
WHERE  UPPER(type) = 'STATUS'
  AND  default_zone != 'OBJECTIVE';

-- Issue cards → PLAYER_AREA
UPDATE public.game_assets
SET    default_zone = 'PLAYER_AREA'
WHERE  UPPER(type) = 'ISSUE'
  AND  default_zone = 'DECK';

-- Action Window cards → PLAYER_AREA
UPDATE public.game_assets
SET    default_zone = 'PLAYER_AREA'
WHERE  UPPER(type) IN ('ACTION', 'ACTION_WINDOW', 'WINDOW')
  AND  default_zone = 'DECK';

-- Notch cards → PLAYER_AREA
UPDATE public.game_assets
SET    default_zone = 'PLAYER_AREA'
WHERE  UPPER(type) IN ('NOTCH', 'ACTION_NOTCH')
  AND  default_zone = 'DECK';

-- Story and Situation cards stay in DECK until drawn — no change needed.


-- ── 7. Realtime publication (if not already included) ────────
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.game_assets;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
