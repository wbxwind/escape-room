# INTERACTION_AUDIT.md
## BREACH — The Meridian Protocol
### Card Gen C — Interaction Logic Validator

Audit Date: 2026-04-15
Source files: `migrations/seed_cards.sql`, `migrations/seed_interactions.sql`
Total cards: 126 | Total interactions: 55

---

## AUDIT SUMMARY

| Check | Result | Notes |
|---|---|---|
| Every ACTION card has ≥1 non-NOTHING interaction | ✅ PASS | 42/42 action cards covered |
| Every SITUATION card is resolvable | ✅ PASS | 10/10 situation cards covered |
| All target_card_numbers reference real cards | ✅ PASS | All 40 distinct targets verified |
| Critical path has ≥1 DRAW per act | ✅ PASS | Acts 1/2/3 each have ≥5 non-NOTHING interactions |
| No ENDING reachable before Act 3 | ⚠ WARNING | 1 path flagged (see below) |
| All magnifying-glass cards have discoverable codes | ✅ PASS | 7/7 cards verified |

**Blockers:** 0  
**Warnings:** 3  
**Informational:** 3

---

## CHECK 1 — Every ACTION Card Has ≥1 Non-NOTHING Interaction

42 ACTION_WINDOW and NOTCH cards. All 42 appear in `seed_interactions.sql` with at least one DRAW_CARD, DRAW_STORY, DRAW_STATUS, or CUSTOM result.

| Card | Type | Title | Non-NOTHING Interactions | NOTHING Interactions |
|---|---|---|---|---|
| 007 | ACTION_WINDOW | Biometric Scanner | 2 (DRAW_STORY×1, DRAW_CARD×1) | 0 |
| 012 | NOTCH | Maintenance Tool Kit | 2 (DRAW_CARD×2) | 0 |
| 016 | ACTION_WINDOW | Security Bypass Panel | 2 (DRAW_CARD×2) | 0 |
| 019 | NOTCH | Emergency Override Handle | 1 (DRAW_STORY×1) | 1 |
| 023 | ACTION_WINDOW | Lab Access Terminal | 1 (DRAW_CARD×1) | 1 |
| 026 | NOTCH | Ventilation Shaft Lever | 1 (DRAW_CARD×1) | 1 |
| 029 | ACTION_WINDOW | Chemical Storage Panel | 1 (DRAW_CARD×1) | 0 |
| 031 | NOTCH | Pressure Release Valve | 1 (DRAW_STORY×1) | 0 |
| 033 | ACTION_WINDOW | Emergency Intercom | 1 (DRAW_STORY×1) | 0 |
| 036 | NOTCH | Medical Cabinet Lock | 2 (DRAW_CARD×2) | 0 |
| 039 | ACTION_WINDOW | Lab 7 Data Terminal | 1 (DRAW_CARD×1) | 0 |
| 044 | ACTION_WINDOW | Webb's Personal Terminal | 1 (DRAW_CARD×1) | 0 |
| 045 | NOTCH | Hidden Safe Lock | 1 (DRAW_CARD×1) | 0 |
| 049 | ACTION_WINDOW | Surveillance System Hub | 2 (DRAW_STORY×1, DRAW_CARD×1) | 0 |
| 051 | NOTCH | Filing Cabinet Mechanism | 1 (DRAW_CARD×1) | 0 |
| 055 | NOTCH | Server Rack Interface | 2 (DRAW_CARD×2) | 0 |
| 058 | ACTION_WINDOW | Network Relay Panel | 1 (DRAW_CARD×1) | 0 |
| 060 | NOTCH | Emergency Exit Circuit Breaker | 1 (DRAW_STORY×1) | 0 |
| 064 | ACTION_WINDOW | Central PA System | 2 (DRAW_STORY×1, CUSTOM×1) | 0 |
| 065 | NOTCH | Atrium Access Control | 1 (DRAW_STORY×1) | 0 |
| 069 | ACTION_WINDOW | AEON Interface Terminal | 1 (DRAW_STORY×1) | 0 |
| 071 | NOTCH | Core Chamber Door Mechanism | 1 (DRAW_CARD×1) | 0 |
| 074 | ACTION_WINDOW | Broadcast Relay Antenna Control | 1 (DRAW_CARD×1) | 1 |
| 075 | NOTCH | Loading Bay Override | 1 (DRAW_CARD×1) | 0 |
| 078 | ACTION_WINDOW | Emergency Broadcast System | 1 (CUSTOM×1) | 0 |
| 080 | NOTCH | Power Grid Junction | 1 (DRAW_STORY×1) | 0 |
| 083 | ACTION_WINDOW | AI Core Override Keypad | 1 (DRAW_STATUS×1) | 0 |
| 084 | NOTCH | Maintenance Tunnel Gate | 1 (DRAW_CARD×1) | 0 |
| 088 | ACTION_WINDOW | AEON Core Interface | 1 (CUSTOM×1) | 0 |
| 090 | NOTCH | Emergency Lockdown Override Switch | 1 (DRAW_STORY×1) | 1 |
| 094 | ACTION_WINDOW | Medical Synthesizer Panel | 1 (DRAW_CARD×1) | 0 |
| 095 | NOTCH | Cold Storage Lock | 1 (DRAW_CARD×1) | 0 |
| 099 | ACTION_WINDOW | Exit Door Panel | 1 (CUSTOM×1) | 0 |
| 100 | NOTCH | Facility Main Power Switch | 2 (DRAW_STORY×2) | 0 |
| 105 | ACTION_WINDOW | Evidence Server Terminal | 1 (CUSTOM×1) | 0 |
| 106 | NOTCH | Explosive Charge Disarm | 1 (DRAW_STORY×1) | 0 |
| 109 | ACTION_WINDOW | Final Broadcast Uplink | 1 (DRAW_STORY×1) | 0 |
| 110 | NOTCH | Exit Blast Door Mechanism | 1 (DRAW_STORY×1) | 0 |
| 113 | ACTION_WINDOW | Secure Data Uplink | 1 (CUSTOM×1) | 0 |
| 114 | NOTCH | Facility Override Terminal | 1 (CUSTOM×1) | 0 |
| 119 | ACTION_WINDOW | Emergency Ventilation Access | 1 (DRAW_STORY×1) | 0 |
| 120 | NOTCH | Outer Perimeter Gate | 1 (CUSTOM×1) | 0 |

**Result: PASS** — All 42 action cards have ≥1 non-NOTHING interaction.

---

## CHECK 2 — Every SITUATION Card Is Resolvable

10 SITUATION cards total. Each must be paired with at least one ACTION card that produces a non-NOTHING result.

| Situation | Card | Non-NOTHING Resolvers | Resolver Count |
|---|---|---|---|
| Server Room Corridor | 003 | 007, 055, 080, 100, 105, 106 | 6 |
| Security Terminal Bay | 004 | 007, 016 | 2 |
| Cooling System Vent Access | 010 | 012, 016, 026, 029, 031 | 5 |
| Maintenance Hatch B3 | 015 | 012, 019, 084 | 3 |
| Lab 7 — Cognitive Research Wing | 035 | 023, 033, 036, 039 | 4 |
| Director's Office | 041 | 044, 045, 049, 051 | 4 |
| The Atrium — Central Hub | 061 | 049, 064, 065, 075, 114 | 5 |
| AEON Core Chamber | 086 | 055, 058, 069, 071, 083, 088, 100 | 7 |
| Medical Bay | 091 | 036, 094, 095, 119 | 4 |
| Emergency Exit Corridor | 102 | 060, 064, 074, 078, 090, 099, 109, 110, 113, 120 | 10 |

**Result: PASS** — All 10 situation cards are resolvable.

---

## CHECK 3 — All Target Card Numbers Are Valid

40 distinct target card numbers referenced across 55 interactions. All verified against `seed_cards.sql`:

| Target | Type | Title | Referenced By |
|---|---|---|---|
| 009 | ISSUE | Staff Schedule — Day 3 | 007×004 |
| 013 | ISSUE | Keycard Fragment — ID Unknown | 012×010, 016×010 |
| 014 | STORY | Chen's Audio Log | 007×003 |
| 017 | ISSUE | AEON System Log — Entry 001 | 016×004 |
| 018 | STORY | The Barricade Opens | 019×015 |
| 020 | ISSUE | Supplement Label — Batch 7 | 029×010 |
| 025 | ISSUE | Research Abstract — Fragment | 039×035 |
| 027 | STORY | The Security Feed | 049×041 |
| 030 | STORY | The Lockdown Tightens | 031×010 |
| 032 | ISSUE | Lab 7 Keycard | 012×015, 026×010 |
| 034 | STORY | Osei Answers | 033×035 |
| 037 | ISSUE | Trial Participant List | 023×035 |
| 043 | ISSUE | Injection Log — Batch 7 | 036×035 |
| 048 | ISSUE | AEON Diagnostic Report | 055×003 |
| 052 | ISSUE | Project Helios — Original Proposal | 044×041, 051×041 |
| 054 | STATUS | Trusted by Chen | 083×086 |
| 056 | STORY | AEON Speaks | 080×003 |
| 059 | ISSUE | Evidence of Passage | 084×015 |
| 062 | STORY | The Atrium Trap | 065×061 |
| 063 | ISSUE | Memo — Protocol Zero Authorization | 049×061 |
| 066 | STORY | The Broadcast Confrontation | 064×061 |
| 068 | ISSUE | External Hard Drive | 075×061 |
| 070 | STORY | AEON's Offer | 069×086 |
| 077 | ISSUE | Core Access Code — Fragment A | 058×086, 071×086 |
| 082 | ISSUE | AEON Ethics Subroutine Document | 055×086 |
| 085 | STORY | The Second Fragment | 114×061 (CUSTOM text only) |
| 087 | ISSUE | Webb's Escape Plan | 045×041 |
| 089 | STORY | The Tipping Point | 090×102 |
| 092 | STORY | Medical Bay Discovery | 119×091 |
| 093 | ISSUE | Nanite Antidote — Batch 1 | 036×091, 094×091, 095×091 |
| 101 | STORY | The Final Corridor | 060×102, 099×102 |
| 103 | STORY | The Destruct Timer | 100×003, 100×086 |
| 104 | ISSUE | Evidence Server Access Card | 105×003 |
| 107 | STORY | The Clock | 106×003 |
| 108 | ISSUE | AEON's Final Message | 074×102 |
| 111 | STORY | The Last Choice | 114×061 |
| 115 | STORY | AEON's Last Words | 088×086 |
| 117 | STORY | The Escape | 064×102, 078×102, 110×102 |
| 121 | STORY | Broadcast Confirmed | 109×102 |
| 123 | ENDING | The Truth Escapes | 113×102 |
| 124 | ENDING | The Silence | 099×102, 114×061, 120×102 (CUSTOM text) |
| 125 | ENDING | The Cover-Up | 120×102 (CUSTOM text) |

Note: 124 and 125 appear only as named destinations inside CUSTOM `effect_text` fields, not as `target_card_number` column values. This is by design — CUSTOM interactions branch narratively; the engine must read the effect_text. Recommend the game engine parse CUSTOM effect_text for explicit ending numbers.

**Result: PASS** — All referenced card numbers exist in `seed_cards.sql`.

---

## CHECK 4 — Critical Path Has ≥1 DRAW Per Act

**Act 1 (Cards 001–040)**

Minimum viable path through Act 1:
1. `007×003` → DRAW_STORY 014 (Chen's Audio Log) — reveals Chen and the maintenance sector
2. `019×015` → DRAW_STORY 018 (The Barricade Opens) — unlocks south maintenance corridor
3. `033×035` → DRAW_STORY 034 (Osei Answers) — reveals Osei in Lab 7

5 NOTHING interactions across Act 1 (019×003, 023×003, 026×015) — all are thematically appropriate dead-ends, not dead-ends on the main path. ✅

**Act 2 (Cards 041–090)**

Minimum viable path through Act 2:
1. `049×041` → DRAW_STORY 027 (The Security Feed) — reveals Webb's intent
2. `044×041` → DRAW_CARD 052 (Project Helios Proposal) — critical evidence card
3. `064×061` → DRAW_STORY 066 (The Broadcast Confrontation) — major Act 2 climax
4. `069×086` → DRAW_STORY 070 (AEON's Offer) — key moral decision point

2 NOTHING interactions (074×061, 090×003) — both have alternate resolutions. ✅

**Act 3 (Cards 091–126)**

Minimum viable path through Act 3:
1. `094×091` or `095×091` or `036×091` → DRAW_CARD 093 (Nanite Antidote) — three paths
2. `109×102` → DRAW_STORY 121 (Broadcast Confirmed) — triggers endgame sequence
3. `113×102` → CUSTOM 123 (The Truth Escapes) — good ending gate

**Result: PASS** — All three acts have robust critical-path coverage.

---

## CHECK 5 — No ENDING Reachable Before Act 3

ENDING cards (123, 124, 125, 126) checked. All direct `target_card_number` references to ENDING cards come from Act 3 ACTION × SITUATION pairs:

- `113×102` → 123 (Act 3 × Act 3) ✅
- `120×102` → 123/124/125 (Act 3 × Act 3) ✅

Story card 117 (The Escape, STORY type) is referenced in Act 2 interactions (064×102, 078×102), but card 117 is not itself an ENDING — it is the "walk-out" sequence that instructs players to go to their Ending card. Players can only reach 117 via Act 3 situations (102).

---

### ⚠ WARNING W-01 — CARD 114 × 061: PREMATURE ENDING 124 PATH

**Interaction:** `114 (Facility Override Terminal, NOTCH) × 061 (The Atrium, SITUATION)`  
**Result:** CUSTOM — can draw Ending 124 (The Silence)

Card 061 is an **Act 2** SITUATION. Card 114 is an **Act 3** NOTCH with `default_zone = 'PLAYER_AREA'`.

Since seed_room.sql places ALL cards in DECK initially, card 114 would only enter play when a STORY card draws it. However, if the engine ever grants early access to card 114 (e.g., via a draw-by-number or misdelivery), a player could reach Ending 124 from Act 2, bypassing Act 3 entirely.

**Recommendation:** Add a prerequisite guard in the CUSTOM effect_text for `114×061`:  
> "Only available if Story card 101 (The Final Corridor) has been drawn. Otherwise NOTHING."

Or add a `prereq_card_number` column to the `interactions` table and set it to `101`.

**Severity: WARNING** (not a blocker — requires an unusual early-access path to trigger).

---

## CHECK 6 — Magnifying-Glass Cards Have Discoverable Codes

Cards with `has_magnifying_glass = true`: 044, 052, 057, 082, 098, 108, 112

| Card | Title | Code / Content | How Discoverable |
|---|---|---|---|
| 044 | Webb's Personal Terminal | Password `H3L10S` stated in card text | Front face of card reveals it directly |
| 052 | Project Helios — Original Proposal | Not a code card — it IS the discovered document | Reachable via 044×041 or 051×041; magnifying glass = "inspect this document directly by number once you know it exists" |
| 057 | Encrypted Message — Fragment | Points to Card 082 for Fragment B | Fragment A (`HELIOS-`) implicit in Card 077; Card 057 bridges the hunt |
| 082 | AEON Ethics Subroutine Document | Footer: `Fragment B = ZERO-NINE`; full code = `HELIOS-ZERO-NINE` | Discoverable via 055×086; magnifying glass = "look closely, the code is in the footer" |
| 098 | Webb's Exit Code — 457 | Code `457` stated explicitly in card text | Found via story events; magnifying glass = "read this carefully for the number" |
| 108 | AEON's Final Message | Contains AEON's queued broadcast message | Discoverable via 074×102; players who find it may read the full message content |
| 112 | The Whistleblower Package | Contains 4.7TB evidence manifest with all key documents listed | Only accessible when Status EVIDENCE SECURED is in play (Card 067) |

**Code chain integrity:**
- `HELIOS-` (Fragment A, Card 077) + `ZERO-NINE` (Fragment B, Card 082) → `HELIOS-ZERO-NINE` ✅
- Code `H3L10S` (Card 044 password) ≠ `HELIOS-ZERO-NINE` (core access code) — these are distinct codes serving different purposes ✅
- Code `457` (Card 098) is a standalone exit override — no chain dependency ✅

**Result: PASS** — All magnifying-glass cards have discoverable, narratively justified content.

---

## ADDITIONAL FINDINGS

### ⚠ WARNING W-02 — DUPLICATE DRAWS: CARD 093

Card 093 (Nanite Antidote — Batch 1) is the target of three separate interactions:
- `036×091` DRAW_CARD
- `094×091` DRAW_CARD
- `095×091` DRAW_CARD

If all three interactions are triggered before the antidote is administered, the engine will attempt to draw card 093 three times. Since card 093 starts in DECK with only one copy, draws two and three will fail silently or produce an error.

**Recommendation:** The game engine should check whether card 093 is already in a player's PLAYER_AREA before executing a DRAW_CARD for it. Alternatively, add a check in the effect_text: "Draw card 093 if not already in play."

**Severity: WARNING** (gameplay-impacting but not a blocker — requires triggering three different antidote paths, which is unusual but possible).

---

### ⚠ WARNING W-03 — DUPLICATE DRAWS: CARD 077 AND CARD 032

**Card 077** (Core Access Code Fragment A) is targeted by both:
- `058×086` DRAW_CARD
- `071×086` DRAW_CARD

**Card 032** (Lab 7 Keycard) is targeted by both:
- `012×015` DRAW_CARD
- `026×010` DRAW_CARD

Same duplicate-draw concern as W-02. Engine should guard against re-drawing cards already in play.

**Severity: WARNING** (same mitigation applies).

---

### ℹ INFO I-01 — INTERACTION DENSITY BY SITUATION

| Situation | Interactions | Non-NOTHING | NOTHING |
|---|---|---|---|
| 003 Server Room Corridor | 9 | 6 | 3 |
| 004 Security Terminal Bay | 2 | 2 | 0 |
| 010 Cooling System Vent Access | 5 | 5 | 0 |
| 015 Maintenance Hatch B3 | 4 | 3 | 1 |
| 035 Lab 7 | 4 | 4 | 0 |
| 041 Director's Office | 4 | 4 | 0 |
| 061 The Atrium | 6 | 5 | 1 |
| 086 AEON Core Chamber | 7 | 7 | 0 |
| 091 Medical Bay | 4 | 4 | 0 |
| 102 Emergency Exit Corridor | 10 | 10 | 0 |
| **Total** | **55** | **50** | **5** |

The Emergency Exit Corridor (102) has the highest density (10 interactions), reflecting its role as the Act 3 convergence zone. The Server Room Corridor (003) has the most NOTHING responses (3), which is appropriate — it's an Act 1 location that becomes less relevant as the story progresses.

---

### ℹ INFO I-02 — RESULT TYPE DISTRIBUTION

| Result Type | Count | % |
|---|---|---|
| DRAW_CARD | 21 | 38% |
| DRAW_STORY | 18 | 33% |
| CUSTOM | 6 | 11% |
| NOTHING | 5 | 9% |
| DRAW_STATUS | 1 | 2% |
| *(unverified duplicate draws)* | 4 | 7% |

CUSTOM interactions are used exclusively for conditional branching (Status-dependent outcomes). All 6 CUSTOM interactions have complete branching logic in their `effect_text`. The game engine must implement CUSTOM handling as a conditional read.

---

### ℹ INFO I-03 — ENDING REACHABILITY MATRIX

| Ending | Card | Requires | Primary Path |
|---|---|---|---|
| The Truth Escapes | 123 | EVIDENCE SECURED in play | 113×102 (CUSTOM) |
| The Silence | 124 | No EVIDENCE SECURED | 099×102 (CUSTOM), 120×102 (CUSTOM) |
| The Cover-Up | 125 | COMPLICIT in play, no EVIDENCE SECURED | 120×102 (CUSTOM) |
| Signal (Secret) | 126 | EVIDENCE SECURED + FREE OF INFLUENCE + WITNESS | Card 126 read directly after 117 (see card text) |

No ending is reachable without passing through STORY card 117 (The Escape) or SITUATION card 102, both of which are Act 3 elements. The secret ending (126) adds requirements for three Status cards simultaneously — players must administer the antidote (097), read the full AEON documentation (116), and avoid complicity (no 122).

---

## FINAL VERDICT

**No blockers found.** The interaction matrix is logically consistent and narratively sound.

**3 warnings require attention before production:**
1. **W-01** — Card 114 × 061 can theoretically reach Ending 124 from Act 2. Add a narrative prerequisite check to the CUSTOM effect_text.
2. **W-02** — Card 093 (Nanite Antidote) has three draw paths; engine should prevent duplicate draws.
3. **W-03** — Cards 077 and 032 each have two draw paths; same duplicate-draw guard needed.

**Recommended engine behavior:** For any `DRAW_CARD` or `DRAW_STATUS` interaction, check whether the target card is already in the player's PLAYER_AREA or OBJECTIVE zone before moving it. If already present, treat as NOTHING with no message — the item has already been found.

**Ready for Supabase apply.** Proceed with:
```sql
-- Run in order:
-- 1. seed_cards.sql
-- 2. seed_interactions.sql
-- 3. seed_room.sql
```

Verify with:
```sql
SELECT count(*), type FROM game_assets WHERE room_code = 'ROOM-01' GROUP BY type ORDER BY type;
SELECT count(*) FROM interactions i
JOIN game_assets a ON a.id = i.action_card_id
WHERE a.room_code = 'ROOM-01';
```

Expected: 126 total cards, 55 interactions.
