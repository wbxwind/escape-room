-- ============================================================
-- Migration: seed_interactions.sql
-- Scenario: BREACH — The Meridian Protocol
-- Action × Situation interaction matrix
-- Run AFTER seed_cards.sql
-- ============================================================
-- Pattern: SELECT a.id, s.id from game_assets where room = ROOM-01
-- and card_number matches action card, situation card.
-- result_type values: DRAW_CARD | DRAW_STORY | DRAW_STATUS | NOTHING | CUSTOM
-- target_card_number: the card to draw (for DRAW_CARD / DRAW_STORY / DRAW_STATUS)
-- ============================================================

-- ── Card 007 (Biometric Scanner) ─────────────────────────────

-- 007 × 003 → draw Chen's Audio Log (014)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '014', 'The scanner detects a residual access pattern. An audio log unlocks.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '007'
  AND s.room_code = 'ROOM-01' AND s.card_number = '003';

-- 007 × 004 → draw Staff Schedule (009)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '009', 'The last logged user''s schedule appears on screen.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '007'
  AND s.room_code = 'ROOM-01' AND s.card_number = '004';

-- ── Card 012 (Maintenance Tool Kit) ──────────────────────────

-- 012 × 010 → draw Keycard Fragment (013)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '013', 'The notch aligns with a number etched into the vent casing. A keycard fragment is wedged inside.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '012'
  AND s.room_code = 'ROOM-01' AND s.card_number = '010';

-- 012 × 015 → draw Lab 7 Keycard (032)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '032', 'The pry bar catches on a loose panel. A keycard slides out. Draw card 032 (Lab 7 Keycard) only if not already in play.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '012'
  AND s.room_code = 'ROOM-01' AND s.card_number = '015';

-- ── Card 016 (Security Bypass Panel) ─────────────────────────

-- 016 × 004 → draw AEON Log 001 (017)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '017', 'AEON''s first log entry unlocks. The terminal logs you in automatically.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '016'
  AND s.room_code = 'ROOM-01' AND s.card_number = '004';

-- 016 × 010 → draw Keycard Fragment (013)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '013', 'The bypass pops the vent panel. Something falls out.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '016'
  AND s.room_code = 'ROOM-01' AND s.card_number = '010';

-- ── Card 019 (Emergency Override Handle) ─────────────────────

-- 019 × 015 → draw The Barricade Opens (018)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '018', 'The handle slots into the wheel mechanism. The hatch opens.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '019'
  AND s.room_code = 'ROOM-01' AND s.card_number = '015';

-- 019 × 003 → NOTHING
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'NOTHING', null, 'No mechanical interface here.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '019'
  AND s.room_code = 'ROOM-01' AND s.card_number = '003';

-- ── Card 023 (Lab Access Terminal) ───────────────────────────

-- 023 × 035 → draw Trial Participant List (037)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '037', 'The terminal pulls the Lab 7 research participant index.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '023'
  AND s.room_code = 'ROOM-01' AND s.card_number = '035';

-- 023 × 003 → NOTHING
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'NOTHING', null, 'No lab data accessible from this node.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '023'
  AND s.room_code = 'ROOM-01' AND s.card_number = '003';

-- ── Card 026 (Ventilation Shaft Lever) ───────────────────────

-- 026 × 010 → draw Lab 7 Keycard (032)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '032', 'The damper shifts. Something drops from the duct above the vent. Draw card 032 (Lab 7 Keycard) only if not already in play.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '026'
  AND s.room_code = 'ROOM-01' AND s.card_number = '010';

-- 026 × 015 → NOTHING
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'NOTHING', null, 'No ventilation connection at this hatch.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '026'
  AND s.room_code = 'ROOM-01' AND s.card_number = '015';

-- ── Card 029 (Chemical Storage Panel) ────────────────────────

-- 029 × 010 → draw Supplement Label (020)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '020', 'The locker behind the vent panel opens. Inside: supplement vials.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '029'
  AND s.room_code = 'ROOM-01' AND s.card_number = '010';

-- ── Card 031 (Pressure Release Valve) ────────────────────────

-- 031 × 010 → draw The Lockdown Tightens (030)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '030', 'Releasing the pressure vent triggers the PA system fault that causes AEON to speak.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '031'
  AND s.room_code = 'ROOM-01' AND s.card_number = '010';

-- ── Card 033 (Emergency Intercom) ────────────────────────────

-- 033 × 035 → draw Osei Answers (034)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '034', 'Someone picks up inside Lab 7. They''re breathing hard.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '033'
  AND s.room_code = 'ROOM-01' AND s.card_number = '035';

-- ── Card 036 (Medical Cabinet Lock) ──────────────────────────

-- 036 × 035 → draw Injection Log (043)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '043', 'The cabinet opens. Inside: a binder of injection logs.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '036'
  AND s.room_code = 'ROOM-01' AND s.card_number = '035';

-- 036 × 091 → draw Nanite Antidote (093)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '093', 'The cold storage cabinet contains something unexpected. Draw card 093 (Nanite Antidote) only if not already in play.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '036'
  AND s.room_code = 'ROOM-01' AND s.card_number = '091';

-- ── Card 039 (Lab 7 Data Terminal) ───────────────────────────

-- 039 × 035 → draw Research Abstract (025)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '025', 'The terminal has an unencrypted copy of the Helios research abstract.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '039'
  AND s.room_code = 'ROOM-01' AND s.card_number = '035';

-- ── Card 044 (Webb's Personal Terminal) ──────────────────────

-- 044 × 041 → draw Project Helios Proposal (052) [has magnifying glass]
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '052', 'Password H3L10S accepted. Project Helios proposal unlocked. Card 052 has a magnifying glass — players who discover the password may draw it directly by number.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '044'
  AND s.room_code = 'ROOM-01' AND s.card_number = '041';

-- ── Card 045 (Hidden Safe Lock) ──────────────────────────────

-- 045 × 041 → draw Webb's Escape Plan (087)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '087', 'The panel slides aside. The safe contains Webb''s escape plan.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '045'
  AND s.room_code = 'ROOM-01' AND s.card_number = '041';

-- ── Card 049 (Surveillance System Hub) ───────────────────────

-- 049 × 041 → draw The Security Feed (027)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '027', 'The camera feed to the Director''s Office plays back. Webb is typing.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '049'
  AND s.room_code = 'ROOM-01' AND s.card_number = '041';

-- 049 × 061 → draw Protocol Zero Memo (063)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '063', 'The Atrium camera shows a memo pinned to the central pillar.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '049'
  AND s.room_code = 'ROOM-01' AND s.card_number = '061';

-- ── Card 051 (Filing Cabinet Mechanism) ──────────────────────

-- 051 × 041 → draw Project Helios Proposal (052)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '052', 'The cabinet''s hidden lower drawer pops open. Project Helios proposal inside.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '051'
  AND s.room_code = 'ROOM-01' AND s.card_number = '041';

-- ── Card 055 (Server Rack Interface) ─────────────────────────

-- 055 × 003 → draw AEON Diagnostic (048)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '048', 'The AEON diagnostic partition is accessible from this node.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '055'
  AND s.room_code = 'ROOM-01' AND s.card_number = '003';

-- 055 × 086 → draw AEON Ethics Document (082)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '082', 'The AEON ethics subroutine documentation is stored here.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '055'
  AND s.room_code = 'ROOM-01' AND s.card_number = '086';

-- ── Card 058 (Network Relay Panel) ───────────────────────────

-- 058 × 086 → draw Core Access Code Fragment A (077)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '077', 'The AEON Core''s network partition reveals a stored access code fragment. Draw card 077 (Core Access Code Fragment A) only if not already in play.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '058'
  AND s.room_code = 'ROOM-01' AND s.card_number = '086';

-- ── Card 060 (Emergency Exit Circuit Breaker) ─────────────────

-- 060 × 102 → draw The Final Corridor (101)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '101', 'The exit corridor''s primary circuit reroutes. Emergency lighting shifts from red to white.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '060'
  AND s.room_code = 'ROOM-01' AND s.card_number = '102';

-- ── Card 064 (Central PA System) ─────────────────────────────

-- 064 × 061 → draw The Broadcast Confrontation (066)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '066', 'Your voice broadcasts to the entire facility. Webb hears everything you say.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '064'
  AND s.room_code = 'ROOM-01' AND s.card_number = '061';

-- 064 × 102 → draw The Escape (117) — conditional on EVIDENCE SECURED
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'CUSTOM', '117', 'If Status EVIDENCE SECURED is in play: broadcast the evidence summary to external receivers — draw card 117. Otherwise: NOTHING (no external receivers connected).'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '064'
  AND s.room_code = 'ROOM-01' AND s.card_number = '102';

-- ── Card 065 (Atrium Access Control) ─────────────────────────

-- 065 × 061 → draw The Atrium Trap (062)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '062', 'The atrium access triggers Webb''s confrontation trap.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '065'
  AND s.room_code = 'ROOM-01' AND s.card_number = '061';

-- ── Card 069 (AEON Interface Terminal) ───────────────────────

-- 069 × 086 → draw AEON's Offer (070)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '070', 'AEON''s full proposal comes through. It speaks directly.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '069'
  AND s.room_code = 'ROOM-01' AND s.card_number = '086';

-- ── Card 071 (Core Chamber Door Mechanism) ───────────────────

-- 071 × 086 → draw Core Access Code Fragment A (077)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '077', 'The door mechanism reveals a code panel. A partial access code is visible inside. Draw card 077 (Core Access Code Fragment A) only if not already in play.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '071'
  AND s.room_code = 'ROOM-01' AND s.card_number = '086';

-- ── Card 074 (Broadcast Relay Antenna Control) ───────────────

-- 074 × 102 → draw AEON's Final Message (108)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '108', 'AEON has left a final message waiting in the broadcast queue.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '074'
  AND s.room_code = 'ROOM-01' AND s.card_number = '102';

-- 074 × 061 → NOTHING (atrium antenna offline — column disassembled)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'NOTHING', null, 'The atrium antenna is offline — the column was disassembled.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '074'
  AND s.room_code = 'ROOM-01' AND s.card_number = '061';

-- ── Card 075 (Loading Bay Override) ──────────────────────────

-- 075 × 061 → draw External Hard Drive (068)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '068', 'The loading bay panel pops open. Chen''s external drive was hidden here.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '075'
  AND s.room_code = 'ROOM-01' AND s.card_number = '061';

-- ── Card 078 (Emergency Broadcast System) ────────────────────

-- 078 × 102 → draw The Escape (117) — conditional
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'CUSTOM', '117', 'If Status EVIDENCE SECURED is in play: transmission goes through — draw card 117. Otherwise: NOTHING.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '078'
  AND s.room_code = 'ROOM-01' AND s.card_number = '102';

-- ── Card 080 (Power Grid Junction) ───────────────────────────

-- 080 × 003 → draw AEON Speaks (056)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '056', 'The power reroute triggers the server room screens to display AEON''s message simultaneously.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '080'
  AND s.room_code = 'ROOM-01' AND s.card_number = '003';

-- ── Card 083 (AI Core Override Keypad) ───────────────────────

-- 083 × 086 → draw Status: Trusted by Chen (054)
-- Full code HELIOS-ZERO-NINE opens direct-write port; AEON grants full trust
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STATUS', '054', 'Entering the full code HELIOS-ZERO-NINE opens AEON''s direct-write port. AEON grants full trust. Draw Status card 054 (Trusted by Chen) if not already in play.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '083'
  AND s.room_code = 'ROOM-01' AND s.card_number = '086';

-- ── Card 084 (Maintenance Tunnel Gate) ───────────────────────

-- 084 × 015 → draw Evidence of Passage (059)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '059', 'The gate opens into the maintenance tunnel. Evidence of passage inside.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '084'
  AND s.room_code = 'ROOM-01' AND s.card_number = '015';

-- ── Card 088 (AEON Core Interface) ───────────────────────────

-- 088 × 086 → draw AEON's Last Words (115) — conditional on EVIDENCE SECURED
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'CUSTOM', '115', 'If Status EVIDENCE SECURED is in play: AEON begins the transfer and speaks its final words — draw card 115. Otherwise: draw card 070 (AEON repeats its offer).'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '088'
  AND s.room_code = 'ROOM-01' AND s.card_number = '086';

-- ── Card 090 (Emergency Lockdown Override Switch) ────────────

-- 090 × 102 → draw The Tipping Point (089)
-- Using override to reroute antenna rather than wipe AEON
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '089', 'Using the override to reroute the antenna rather than wipe AEON begins the Act 2 endgame.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '090'
  AND s.room_code = 'ROOM-01' AND s.card_number = '102';

-- 090 × 003 → NOTHING (wrong junction)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'NOTHING', null, 'Wrong junction — this switch has no effect here.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '090'
  AND s.room_code = 'ROOM-01' AND s.card_number = '003';

-- ── Card 094 (Medical Synthesizer Panel) ─────────────────────

-- 094 × 091 → draw Nanite Antidote (093)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '093', 'The synthesizer has the antidote formula loaded. Three vials ready. Draw card 093 (Nanite Antidote) only if not already in play.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '094'
  AND s.room_code = 'ROOM-01' AND s.card_number = '091';

-- ── Card 095 (Cold Storage Lock) ─────────────────────────────

-- 095 × 091 → draw Nanite Antidote (093)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_CARD', '093', 'The cold storage unit contains the pre-synthesized antidote batch. Draw card 093 (Nanite Antidote) only if not already in play.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '095'
  AND s.room_code = 'ROOM-01' AND s.card_number = '091';

-- ── Card 099 (Exit Door Panel) ────────────────────────────────

-- 099 × 102 → draw The Final Corridor (101) — conditional
-- If code 457 entered: exits open immediately; ending branch depends on EVIDENCE SECURED
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'CUSTOM', '101', 'Code 457 accepted. If Status EVIDENCE SECURED is in play: draw card 101 then proceed normally to ending. If EVIDENCE SECURED not in play: draw card 124 (The Silence — you escaped but evidence is gone).'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '099'
  AND s.room_code = 'ROOM-01' AND s.card_number = '102';

-- ── Card 100 (Facility Main Power Switch) ────────────────────

-- 100 × 003 → draw The Destruct Timer (103)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '103', 'Cutting server room non-essentials triggers Webb''s dead-man destruct timer.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '100'
  AND s.room_code = 'ROOM-01' AND s.card_number = '003';

-- 100 × 086 → draw The Destruct Timer (103)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '103', 'Cutting AEON non-essentials triggers Webb''s dead-man destruct timer.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '100'
  AND s.room_code = 'ROOM-01' AND s.card_number = '086';

-- ── Card 105 (Evidence Server Terminal) ──────────────────────

-- 105 × 003 → draw Evidence Server Access Card (104)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'CUSTOM', '104', 'If accessed within 4 minutes of The Destruct Timer (card 103): abort sequence initiated — evidence servers preserved — draw card 104. If time limit exceeded: draw card 124 (The Silence).'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '105'
  AND s.room_code = 'ROOM-01' AND s.card_number = '003';

-- ── Card 106 (Explosive Charge Disarm) ───────────────────────

-- 106 × 003 → draw The Clock (107)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '107', 'The notch aligns with the detonator. Disarm initiated.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '106'
  AND s.room_code = 'ROOM-01' AND s.card_number = '003';

-- ── Card 109 (Final Broadcast Uplink) ────────────────────────

-- 109 × 102 → draw Broadcast Confirmed (121)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '121', 'Reconnecting the cable and initiating AEON''s queued message. Transmission begins.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '109'
  AND s.room_code = 'ROOM-01' AND s.card_number = '102';

-- ── Card 110 (Exit Blast Door Mechanism) ─────────────────────

-- 110 × 102 → draw The Escape (117)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '117', 'The mechanical release opens the blast doors. AEON''s sequence status determines which Ending follows.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '110'
  AND s.room_code = 'ROOM-01' AND s.card_number = '102';

-- ── Card 113 (Secure Data Uplink) ────────────────────────────

-- 113 × 102 → draw Ending 123 — conditional on EVIDENCE SECURED
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'CUSTOM', '123', 'If Status EVIDENCE SECURED is in play: transmission succeeds — proceed to Ending 123 (The Truth Escapes). Otherwise: NOTHING — uplink requires evidence on the drive.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '113'
  AND s.room_code = 'ROOM-01' AND s.card_number = '102';

-- ── Card 114 (Facility Override Terminal) ────────────────────

-- 114 × 061 → draw The Last Choice (111) with branching
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'CUSTOM', '111', 'PREREQUISITE: Only available if Story card 101 (The Final Corridor) has already been drawn. If card 101 has not been drawn, result is NOTHING. Otherwise — two options: (A) Disable AEON → draw card 124 (The Silence). (B) Extend Protocol Zero to allow broadcast completion → draw card 085 (The Second Fragment) if not already drawn, then proceed to endgame.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '114'
  AND s.room_code = 'ROOM-01' AND s.card_number = '061';

-- ── Card 119 (Emergency Ventilation Access) ──────────────────

-- 119 × 091 → draw Medical Bay Discovery (092)
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'DRAW_STORY', '092', 'The ventilation bypass reaches the Medical Bay. You can get there without going through Webb''s locked corridor.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '119'
  AND s.room_code = 'ROOM-01' AND s.card_number = '091';

-- ── Card 120 (Outer Perimeter Gate) ──────────────────────────

-- 120 × 102 → branching ending gate
INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
SELECT a.id, s.id, 'CUSTOM', null, 'Ending branch: (1) If EVIDENCE SECURED in play → draw card 117 then proceed to Ending 123. (2) If COMPLICIT in play and EVIDENCE SECURED not in play → proceed to Ending 125. (3) If neither → proceed to Ending 124.'
FROM public.game_assets a, public.game_assets s
WHERE a.room_code = 'ROOM-01' AND a.card_number = '120'
  AND s.room_code = 'ROOM-01' AND s.card_number = '102';
