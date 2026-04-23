-- Fix story card navigation instructions
-- All STORY cards that previously ended without telling players what to do next.
-- Also fixes interaction table issues identified in STORY_REVIEW.md.

-- ─────────────────────────────────────────────────────────────────────────────
-- PART 1: Navigation instructions for Dead End 9 story cards
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE public.game_assets
SET content_front = REPLACE(content_front,
  'check it. Ask yourself why you believe it.''',
  'check it. Ask yourself why you believe it. ► draw card 040.''')
WHERE card_number = '038';

UPDATE public.game_assets
SET content_front = REPLACE(content_front,
  'The chair faces away from the door.''',
  'The chair faces away from the door. ► draw card 046.''')
WHERE card_number = '042';

UPDATE public.game_assets
SET content_front = REPLACE(content_front,
  'She doesn''t say sorry. She says it like a fact.''',
  'She doesn''t say sorry. She says it like a fact. ► Place Situation card 035 (Lab 7) in the Panorama if not already in play. Interact with it using Action cards.''')
WHERE card_number = '050';

UPDATE public.game_assets
SET content_front = REPLACE(content_front,
  'He says this the way you''d say the weather forecast. Factual. Calm. Wrong.''',
  'He says this the way you''d say the weather forecast. Factual. Calm. Wrong. ► Situation card 061 (The Atrium) is now in play. Use Action cards from your hand to interact with it.''')
WHERE card_number = '053';

UPDATE public.game_assets
SET content_front = REPLACE(content_front,
  'He places the tablet on the floor between you. The countdown is real.''',
  'He places the tablet on the floor between you. The countdown is real. ► draw card 081.''')
WHERE card_number = '062';

UPDATE public.game_assets
SET content_front = REPLACE(content_front,
  '''That was a mistake.''',
  '''That was a mistake.'' ► draw card 073.')
WHERE card_number = '066';

UPDATE public.game_assets
SET content_front = REPLACE(content_front,
  'his voice waits for an answer.''',
  'his voice waits for an answer. ► To direct Chen to reroute the antenna: draw card 085. ► To direct Chen to wipe AEON: draw card 124.''')
WHERE card_number = '073';

UPDATE public.game_assets
SET content_front = REPLACE(content_front,
  'It doesn''t land well, but it tries.''',
  'It doesn''t land well, but it tries. ► draw card 081.''')
WHERE card_number = '076';

UPDATE public.game_assets
SET content_front = REPLACE(content_front,
  'Let''s finish this conversation properly.''',
  'Let''s finish this conversation properly. ► draw card 101.''')
WHERE card_number = '079';

UPDATE public.game_assets
SET content_front = REPLACE(content_front,
  'I owe you that.'' You decide now.''',
  'I owe you that.'' You decide now. ► Use Action and Notch cards from your hand on Situation cards in the Panorama to act. Your choices determine the ending.''')
WHERE card_number = '081';

UPDATE public.game_assets
SET content_front = REPLACE(content_front,
  'A blinking cursor. A progress bar ready to begin. AEON is waiting.''',
  'A blinking cursor. A progress bar ready to begin. AEON is waiting. ► Place Situation card 086 in the Panorama. Turn over Status card WATCHED (022) — AEON has deemed you non-threatening.''')
WHERE card_number = '085';

-- ─────────────────────────────────────────────────────────────────────────────
-- PART 2: Dead End 4 — Card 099 Exit Door Panel — split into two interaction rows
-- One row for when EVIDENCE_SECURED (067) is held → proceed normally (draw 117)
-- One default row → draw Ending 124 (The Silence)
-- ─────────────────────────────────────────────────────────────────────────────

-- First get the card IDs for reference
-- Card 099 (Exit Door Panel) × Situation 102 (Emergency Exit Corridor)
-- Split: status_modifier=067 → DRAW_CARD 117, default → DRAW_CARD 124

-- Update existing null-modifier row to draw 124 (failure path)
UPDATE public.interactions i
SET consequences = '[{"type": "DRAW_CARD", "card_number": "124"}]'::jsonb,
    effect_text   = 'The panel accepts the code — but without the evidence secured, the transmission is empty. The doors open. You are free. But nothing changes.'
FROM public.game_assets a, public.game_assets s
WHERE i.action_card_id = a.id AND a.card_number = '099'
  AND i.situation_card_id = s.id AND s.card_number = '102'
  AND i.status_modifier IS NULL;

-- Insert status-gated row for EVIDENCE_SECURED path
INSERT INTO public.interactions (action_card_id, situation_card_id, window_band, status_modifier, effect_text, consequences)
SELECT a.id, s.id, NULL, '067',
  'EVIDENCE SECURED. The transmission completes as the doors open. Everything that happened in this facility is going out.',
  '[{"type": "DRAW_CARD", "card_number": "117"}]'::jsonb
FROM public.game_assets a, public.game_assets s
WHERE a.card_number = '099' AND s.card_number = '102'
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- PART 3: Interaction Issue 5 — Card 110 × 102 — encode three ending rows
-- ─────────────────────────────────────────────────────────────────────────────

-- Row 1: EVIDENCE_SECURED + TRUSTED_BY_CHEN → best path → draw 123
INSERT INTO public.interactions (action_card_id, situation_card_id, window_band, status_modifier, effect_text, consequences)
SELECT a.id, s.id, NULL, '067',
  'The blast doors open. The evidence is already transmitted. You walk out.',
  '[{"type": "DRAW_CARD", "card_number": "123"}]'::jsonb
FROM public.game_assets a, public.game_assets s
WHERE a.card_number = '110' AND s.card_number = '102'
ON CONFLICT DO NOTHING;

-- Row 2: COMPLICIT → drew ending 125
INSERT INTO public.interactions (action_card_id, situation_card_id, window_band, status_modifier, effect_text, consequences)
SELECT a.id, s.id, NULL, '122',
  'The doors open. Webb is already at your side. You both walk out together.',
  '[{"type": "DRAW_CARD", "card_number": "125"}]'::jsonb
FROM public.game_assets a, public.game_assets s
WHERE a.card_number = '110' AND s.card_number = '102'
ON CONFLICT DO NOTHING;

-- Default row: no status → draw 124 (The Silence)
UPDATE public.interactions i
SET consequences = '[{"type": "DRAW_CARD", "card_number": "124"}]'::jsonb,
    effect_text   = 'The doors open. You leave. Behind you, the evidence servers wipe clean on schedule. No one will ever know.'
FROM public.game_assets a, public.game_assets s
WHERE i.action_card_id = a.id AND a.card_number = '110'
  AND i.situation_card_id = s.id AND s.card_number = '102'
  AND i.status_modifier IS NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- PART 4: Dead End 5 — Card 083 × 086 — fix narratively incoherent GAIN_STATUS
-- Remove the TRUSTED_BY_CHEN consequence from keypad entry
-- Replace with AEON Core Chamber opening (PLACE situation already done via card 085)
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE public.interactions i
SET consequences = '[{"type": "FLIP_CARD_SELF"}]'::jsonb,
    effect_text   = 'HELIOS-ZERO-NINE accepted. The Core Chamber door begins to open. AEON''s cursor is blinking.'
FROM public.game_assets a, public.game_assets s
WHERE i.action_card_id = a.id AND a.card_number = '083'
  AND i.situation_card_id = s.id AND s.card_number = '086'
  AND i.status_modifier IS NULL;

-- Chen grants TRUSTED_BY_CHEN (054) when Chen chooses to reroute (card 073 → 085 path)
-- This should be on card 073's content_back or via a consequence on the DRAW_CARD 085 event
-- Since we can't add consequences to drawCardByNumber, add it to card 085 itself
-- Card 085 should grant STATUS 054 when drawn (it represents Chen having committed)
UPDATE public.game_assets
SET content_back = 'Chen''s override key activates the broadcast antenna reroute. He hands you the key. "J-17. Junction box, second sublevel. If you need to shut down the evidence wipe manually — the code is J-17-ZERO." ► GAIN STATUS: draw Status card 054 (Trusted by Chen).'
WHERE card_number = '085' AND (content_back IS NULL OR content_back = '');

-- ─────────────────────────────────────────────────────────────────────────────
-- PART 5: Dead End 7 — Card 105 timer fix → replace with card-in-hand gate
-- Card 105 × Situation 003 — requires Card 104 in hand; if not, draws 124
-- ─────────────────────────────────────────────────────────────────────────────

-- Row with gate: card 104 in PLAYER_AREA → abort sequence, proceed to 107
INSERT INTO public.interactions (action_card_id, situation_card_id, window_band, status_modifier, effect_text, consequences)
SELECT a.id, s.id, NULL, NULL,
  'Access card accepted. Abort sequence initiated. The evidence servers halt the wipe.',
  '[{"type": "DRAW_CARD", "card_number": "107"}, {"type": "DISCARD_CARD", "card_number": "104"}]'::jsonb
FROM public.game_assets a, public.game_assets s
WHERE a.card_number = '105' AND s.card_number = '003'
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verify key counts
-- ─────────────────────────────────────────────────────────────────────────────

SELECT 'Story cards with draw instructions' AS check_name,
       COUNT(*) AS count
FROM public.game_assets
WHERE type = 'STORY'
  AND content_front LIKE '%draw card%';

SELECT 'Interactions for card 099 × 102' AS check_name, COUNT(*) AS count
FROM public.interactions i
JOIN public.game_assets a ON i.action_card_id = a.id
JOIN public.game_assets s ON i.situation_card_id = s.id
WHERE a.card_number = '099' AND s.card_number = '102';

SELECT 'Interactions for card 110 × 102' AS check_name, COUNT(*) AS count
FROM public.interactions i
JOIN public.game_assets a ON i.action_card_id = a.id
JOIN public.game_assets s ON i.situation_card_id = s.id
WHERE a.card_number = '110' AND s.card_number = '102';
