-- =============================================================================
-- seed_card_mechanics.sql
-- Populates new mechanic fields on existing game_assets and interactions.
-- Run AFTER add_physical_card_mechanics migration.
-- Safe to run multiple times (uses WHERE ... IS NULL guards).
-- =============================================================================

-- ── 1. Action card subtypes ───────────────────────────────────────────────────
-- All action cards use 'reveal': band text + interaction effect_text shown as toast.
-- Card draws happen via consequences JSONB, not action_subtype 'draw'.

UPDATE public.game_assets
SET action_subtype = 'reveal'
WHERE type IN ('ACTION_WINDOW', 'WINDOW', 'ACTION', 'NOTCH', 'ACTION_NOTCH')
  AND action_subtype IS NULL;

-- ── 2. Situation card captions ────────────────────────────────────────────────
-- Caption = atmospheric face text (same as content_front for existing cards).

UPDATE public.game_assets
SET caption = content_front
WHERE type IN ('SITUATION', 'PANORAMA')
  AND caption IS NULL
  AND content_front IS NOT NULL;

-- ── 3. Situation card board positions (5-column × 2-row panorama grid) ────────
-- Row 1: research corridor  |  Row 2: facility interior / endgame

UPDATE public.game_assets SET panorama_row = 1, panorama_col = 1 WHERE card_number = '003';
UPDATE public.game_assets SET panorama_row = 1, panorama_col = 2 WHERE card_number = '004';
UPDATE public.game_assets SET panorama_row = 1, panorama_col = 3 WHERE card_number = '010';
UPDATE public.game_assets SET panorama_row = 1, panorama_col = 4 WHERE card_number = '015';
UPDATE public.game_assets SET panorama_row = 1, panorama_col = 5 WHERE card_number = '035';
UPDATE public.game_assets SET panorama_row = 2, panorama_col = 1 WHERE card_number = '041';
UPDATE public.game_assets SET panorama_row = 2, panorama_col = 2 WHERE card_number = '061';
UPDATE public.game_assets SET panorama_row = 2, panorama_col = 3 WHERE card_number = '086';
UPDATE public.game_assets SET panorama_row = 2, panorama_col = 4 WHERE card_number = '091';
UPDATE public.game_assets SET panorama_row = 2, panorama_col = 5 WHERE card_number = '102';

-- ── 4. Convert interactions: result_type + target_card_number → consequences ──
-- New route reads consequences JSONB only; ignores old result_type field.

-- DRAW_CARD: move target card to player area (route resolves correct zone by type)
UPDATE public.interactions
SET consequences = jsonb_build_array(
  jsonb_build_object('type', 'DRAW_CARD', 'card_number', target_card_number)
)
WHERE result_type = 'DRAW_CARD'
  AND target_card_number IS NOT NULL
  AND consequences IS NULL;

-- DRAW_STORY: same mechanic — route resolves STORY type → STORY_ZONE automatically
UPDATE public.interactions
SET consequences = jsonb_build_array(
  jsonb_build_object('type', 'DRAW_CARD', 'card_number', target_card_number)
)
WHERE result_type = 'DRAW_STORY'
  AND target_card_number IS NOT NULL
  AND consequences IS NULL;

-- DRAW_STATUS: gain a status card into OBJECTIVE zone
UPDATE public.interactions
SET consequences = jsonb_build_array(
  jsonb_build_object('type', 'GAIN_STATUS', 'card_number', target_card_number)
)
WHERE result_type = 'DRAW_STATUS'
  AND target_card_number IS NOT NULL
  AND consequences IS NULL;

-- NOTHING: empty consequences — effect_text still shown as toast
UPDATE public.interactions
SET consequences = '[]'::jsonb
WHERE result_type = 'NOTHING'
  AND consequences IS NULL;

-- CUSTOM: conditional branching — effect_text explains the condition to players
-- Players self-execute using Draw # button. Consequences intentionally left empty.
UPDATE public.interactions
SET consequences = '[]'::jsonb
WHERE result_type = 'CUSTOM'
  AND consequences IS NULL;

-- ── 5. Status-gated CUSTOM rows: wire status_modifier for automatic routing ───
-- When player holds the specified STATUS card, the route finds this row first
-- and auto-executes the draw. status_modifier = card_number of the gate STATUS.

-- Card 067 = "Evidence Secured" status

-- Action 064 × Situation 102: "If Evidence Secured → draw card 117"
UPDATE public.interactions i
SET status_modifier = '067',
    consequences    = jsonb_build_array(jsonb_build_object('type', 'DRAW_CARD', 'card_number', '117'))
FROM public.game_assets ga_a, public.game_assets ga_s
WHERE i.action_card_id = ga_a.id
  AND i.situation_card_id = ga_s.id
  AND ga_a.card_number = '064'
  AND ga_s.card_number = '102'
  AND i.result_type = 'CUSTOM'
  AND i.status_modifier IS NULL;

-- Action 078 × Situation 102: "If Evidence Secured → draw card 117"
UPDATE public.interactions i
SET status_modifier = '067',
    consequences    = jsonb_build_array(jsonb_build_object('type', 'DRAW_CARD', 'card_number', '117'))
FROM public.game_assets ga_a, public.game_assets ga_s
WHERE i.action_card_id = ga_a.id
  AND i.situation_card_id = ga_s.id
  AND ga_a.card_number = '078'
  AND ga_s.card_number = '102'
  AND i.result_type = 'CUSTOM'
  AND i.status_modifier IS NULL;

-- Action 113 × Situation 102: "If Evidence Secured → proceed to Ending 123"
UPDATE public.interactions i
SET status_modifier = '067',
    consequences    = jsonb_build_array(jsonb_build_object('type', 'DRAW_CARD', 'card_number', '123'))
FROM public.game_assets ga_a, public.game_assets ga_s
WHERE i.action_card_id = ga_a.id
  AND i.situation_card_id = ga_s.id
  AND ga_a.card_number = '113'
  AND ga_s.card_number = '102'
  AND i.result_type = 'CUSTOM'
  AND i.status_modifier IS NULL;

-- ── 6. Fallback rows for status-gated pairs ───────────────────────────────────
-- Without Evidence Secured, these interactions resolve as NOTHING.
-- Route picks the null-status_modifier row when gate is not active.

INSERT INTO public.interactions
  (action_card_id, situation_card_id, result_type, effect_text, consequences, window_band, status_modifier)
SELECT ga_a.id, ga_s.id,
  'NOTHING',
  'Evidence Secured status required to proceed.',
  '[]'::jsonb, NULL, NULL
FROM public.game_assets ga_a, public.game_assets ga_s
WHERE ga_a.card_number = '064'
  AND ga_s.card_number = '102'
  AND NOT EXISTS (
    SELECT 1 FROM public.interactions x
    WHERE x.action_card_id = ga_a.id
      AND x.situation_card_id = ga_s.id
      AND x.status_modifier IS NULL
  );

INSERT INTO public.interactions
  (action_card_id, situation_card_id, result_type, effect_text, consequences, window_band, status_modifier)
SELECT ga_a.id, ga_s.id,
  'NOTHING',
  'Evidence Secured status required to proceed.',
  '[]'::jsonb, NULL, NULL
FROM public.game_assets ga_a, public.game_assets ga_s
WHERE ga_a.card_number = '078'
  AND ga_s.card_number = '102'
  AND NOT EXISTS (
    SELECT 1 FROM public.interactions x
    WHERE x.action_card_id = ga_a.id
      AND x.situation_card_id = ga_s.id
      AND x.status_modifier IS NULL
  );

INSERT INTO public.interactions
  (action_card_id, situation_card_id, result_type, effect_text, consequences, window_band, status_modifier)
SELECT ga_a.id, ga_s.id,
  'NOTHING',
  'Evidence Secured status required for broadcast.',
  '[]'::jsonb, NULL, NULL
FROM public.game_assets ga_a, public.game_assets ga_s
WHERE ga_a.card_number = '113'
  AND ga_s.card_number = '102'
  AND NOT EXISTS (
    SELECT 1 FROM public.interactions x
    WHERE x.action_card_id = ga_a.id
      AND x.situation_card_id = ga_s.id
      AND x.status_modifier IS NULL
  );

-- ── Verify ────────────────────────────────────────────────────────────────────
-- Run these after applying to confirm correct counts:
--
-- SELECT result_type, count(*), count(consequences) as seeded
-- FROM public.interactions GROUP BY result_type ORDER BY result_type;
-- Expected: every row should have consequences NOT NULL.
--
-- SELECT type, count(*), count(action_subtype) as has_subtype
-- FROM public.game_assets GROUP BY type ORDER BY type;
-- Expected: ACTION_WINDOW and NOTCH rows all have action_subtype.
--
-- SELECT card_number, panorama_row, panorama_col FROM public.game_assets
-- WHERE type = 'SITUATION' ORDER BY panorama_row, panorama_col;
-- Expected: 10 rows, positions 1-1 through 2-5.
