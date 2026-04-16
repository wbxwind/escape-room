-- ============================================================
-- Migration: seed_room.sql
-- Scenario: BREACH — The Meridian Protocol
-- Run AFTER seed_cards.sql — requires game_assets to exist.
-- ============================================================

-- ── 1. Create the room ───────────────────────────────────────

INSERT INTO public.room_state (room_code)
VALUES ('ROOM-01')
ON CONFLICT (room_code) DO NOTHING;


-- ── 2. Initial card_positions — all cards start in DECK ──────
-- The story engine moves cards out of DECK as they are drawn.
-- Panorama starting slots (cards 003, 004) are set by Card 002
-- being read aloud at game start — not pre-set here.

INSERT INTO public.card_positions (room_code, asset_id, current_zone, panorama_slot)
SELECT
  'ROOM-01',
  ga.id,
  'DECK',
  NULL
FROM public.game_assets ga
WHERE ga.room_code = 'ROOM-01'
ON CONFLICT (room_code, asset_id) DO NOTHING;
