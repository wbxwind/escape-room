# Implementation Plan — Physical Card Mechanics Revamp

> **Status:** IN PROGRESS — Phases 1–5, 7–8 complete; Phase 6 pending; data seeding pending
> **Branch:** main → new branch recommended before starting
> **Reference files:** `CARD_CATALOG.md`, `WINDOW_NOTCH_CARD_SPECS.md`

---

## Design Philosophy (digital-first)

This is a **digital adaptation**, not a pixel-perfect replica of physical cards.
Physical mechanics are abstracted into clean digital equivalents:

| Physical | Digital equivalent |
|---|---|
| Window card held over situation card, cutout reveals one text band | Drop action card on situation card → resolved text appears in **toast/modal** |
| Notch card tab points at a number on situation card edge | Drop action card on situation card → draw that card number, confirmation in **toast** |
| Cards 8+9 placed side by side forming panorama | `panorama_row` + `panorama_col` encodes intended board position; minimap indicator on card face guides player placement |
| Grid minimap on card corner | Board position indicator — player reads it and places card manually. App never forces position. |

**No CSS replication of physical features** (no positional cutouts, no edge number columns, no visual band dividers). All interaction outcomes surface as text in toast or modal. Band assignment is internal app logic — never shown to players.

---

## Mechanics decoded

### Mechanic 1 — Action cards (unified: reveal or draw)

**Window and Notch cards are unified into a single ACTION card type.**

Both card types drop onto a Situation card and resolve via the same `window_band` field. The only difference is what the band resolves to:

- `action_subtype = 'reveal'` → reads `back_[band]` text from the Situation card and displays it (toast/modal)
- `action_subtype = 'draw'` → reads `notch_draw_[band]` card number from the Situation card and draws it

Visual distinction is preserved through card art and color:
- Cyan/teal cards → reveal-type actions (explore, query, examine)
- Green/lime cards → draw-type actions (items, artefacts, documents that point somewhere)

**Band assignment is internal.** Players see only the `window_action` verb on the card face (e.g., "Query V.I.C.T.O.R.", "Use plasma cutter"). They never see Band A/B/C labels — the band is resolved silently by the app based on which card was used.

**Both types use the same drop interaction.** Player drops any ACTION card onto a Situation card in the Panorama → system resolves band → executes result → toast/modal appears.

---

### Mechanic 2 — Situation card bands (A / B / C)

Situation card has 3 text bands corresponding to 3 levels of narrative revelation:
- `back_a` — Band A: safe version (Act 1 tone, V.I.C.T.O.R.'s curated reality)
- `back_b` — Band B: contradictions surfacing (Act 2 tone, cracks in the narrative)
- `back_c` — Band C: loop truth (Act 3 tone, direct horror)

All three bands describe **the same room at three depths of revelation** — not three unrelated facts.

Situation card also has notch draw targets for draw-type actions:
- `notch_draw_a`, `notch_draw_b`, `notch_draw_c` — card numbers to draw when a draw-type action resolves on this band

Every band must end with a concrete instruction: Draw X, Set this card down, or Gain STATUS.

---

### Mechanic 3 — Board grid positioning (panoramic continuity)

Each Situation card has a canonical `(panorama_row, panorama_col)` position representing its intended place on the Panorama board.

**Players place cards manually — no forced positioning by code.**
The minimap indicator on the card face shows where the card belongs. Players read it and place accordingly. The app does not validate placement or auto-correct it. Scene continuity emerges when players follow the indicators naturally.

`panorama_row` and `panorama_col` on `game_assets` are used for:
- Story content design (adjacent rooms get artistically continuous art)
- The minimap indicator rendered on the card face
- Art direction (neighbouring cards share a compositional boundary)

Not used for: slot locking, placement validation, forced DnD targets.

---

### Mechanic 4 — Status gates

STATUS cards a player holds can change interaction outcomes.
`status_gate` on Situation cards flags which STATUS types trigger alternate results.
Checked automatically at interaction resolution time — no visual indicator required, no player action needed.

---

## Mechanics Refined — From Physical Card Analysis (Cards 1–50)

> Source: `CARD_CATALOG.md` — 50 physical cards catalogued in detail.
> These mechanics are present in the original game but were absent from the earlier plan. All must be reflected in the Icarus-7 implementation.

---

### Refined Mechanic A — Chapter / Objective Lifecycle

The original game has an OBJECTIVE card per chapter. It:
1. Stays face-up in the OBJECTIVE zone throughout the chapter
2. Can **flip mid-chapter** (new sub-objective revealed without ending the chapter)
3. Is **replaced** when a new chapter begins (old Objective discarded, new one drawn)

Physical example: Card 7 starts face-up ("Find out what happened to your brother"), flips to 7* ("Find a way to open your brother's locker"), then is replaced by card 37 ("Find your brother on the mountain") when chapter 2 begins.

**Digital design:**
- OBJECTIVE zone already exists. Treat the Objective card as a pinned card in that zone.
- Add `objective_chapter INT` to `game_assets` (which act this objective belongs to).
- Add `flip_state: 'front' | 'back'` to `card_positions` (tracks flip state for objectives, statuses, story cards).
- When interaction result is `FLIP_OBJECTIVE` → auto-flip the active objective card; display new objective text in modal.
- When interaction result is `NEW_CHAPTER` → discard current objective, draw next chapter objective.
- UI: Objective card in OBJECTIVE zone always shows current chapter name + goal text prominently.

---

### Refined Mechanic B — Character Health State (Two-Stage)

The player CHARACTER card is two-sided:
- Front: healthy state with name and portrait
- Back (marked N*): weakened state
- Third trigger: major consequence (death card drawn, or game-altering event)

Physical example: Card 2 (Sophie): healthy → "Sophie is weak" → Draw 79 (death card).

**Digital design:**
- CHARACTER card in OBJECTIVE zone tracks `health_state: 'healthy' | 'weak' | 'critical'` via `flip_state` in `card_positions`.
- When interaction result is `DAMAGE_CHARACTER` → auto-advance health state.
- Display current health state visually on character card in OBJECTIVE zone (colour-coded).
- "Turn over your Character" = trigger `DAMAGE_CHARACTER` result type.
- Toast: "[Character name] is now [weak/critical]."

---

### Refined Mechanic C — Living Panorama (Situation Card Replacement)

Situation cards in the Panorama grid are not permanent. New Situation cards **replace** old ones:
- Replacement triggers shown as a "Discard X" instruction on the new card's front
- Both old and new card share the same `(panorama_row, panorama_col)` position
- The board slot is now occupied by the new card showing the updated scene state

Physical examples: Card 11 replaces Card 9 (same room, man now suspicious). Card 20 replaces Card 8. Card 21 replaces Card 10. Card 31 replaces Card 26.

**Digital design:**
- Add `replaces_card_number TEXT` to `game_assets` — when this card enters PANORAMA, auto-discard the specified card if currently in that zone.
- `PLACE_TO_PANORAMA` consequence: system finds old card in PANORAMA → moves to DISCARD → places new card in same slot.
- Fully automatic — player never manually discards the replaced card.
- Toast: "[New situation title] replaces [old situation title] in the board."

---

### Refined Mechanic D — Status Escalation (Two-Stage Automatic)

STATUS cards are two-sided with an automatic escalation rule:
- Front: first status (e.g., PARANOID, FROZEN, INJURED)
- Back (marked N*): escalated status (COMPLIANT, HYPOTHERMIA, WOUNDED)
- Gaining a status already held → auto-escalate (flip to back)
- Gaining escalated status again → `DAMAGE_CHARACTER`

**Digital design:**
- `flip_state: 'front' | 'back'` on `card_positions` tracks escalation level.
- When `GAIN_STATUS [N]` fires and card N is already in OBJECTIVE zone at `front` → set `flip_state = 'back'`.
- If already escalated → trigger `DAMAGE_CHARACTER`.
- Toast: "PARANOID escalated to COMPLIANT." / "Status critical. Character damaged."
- STATUS cards displayed in OBJECTIVE zone beneath character card.
- STATUS cleared via `REMOVE_STATUS [N]` → card moves back to DECK.

---

### Refined Mechanic E — Automatic Consequence Execution

All card consequences are executed automatically by the system. No player needs to manually draw, discard, or return cards. Consequences are stored as a JSONB array on the `interactions` table row and executed in order after resolution.

| Physical instruction | Consequence type | Digital behavior |
|---|---|---|
| Draw [N] | `DRAW_CARD` | Move card N from DECK → PLAYER_AREA; toast |
| Draw [N] and [M] | `DRAW_CARDS` | Multi-draw; all cards moved simultaneously |
| Draw [N] to [M] | `DRAW_RANGE` | Draw all cards in number range |
| Discard [N] | `DISCARD_CARD` | Move card N (wherever it is) → DISCARD; toast |
| Discard this card | `DISCARD_SELF` | Triggering story card auto-discards after resolution |
| Discard all Panorama cards | `DISCARD_PANORAMA` | Clear every card from PANORAMA zone |
| Return [N] to the deck | `RETURN_TO_DECK` | Move card N → DECK (reusable) |
| Turn over this card | `FLIP_CARD_SELF` | Story card flips to show back text in modal |
| Turn over Objective | `FLIP_OBJECTIVE` | Active objective flips; new sub-objective shown |
| Turn over Character | `DAMAGE_CHARACTER` | Character health state advances |
| Gain status | `GAIN_STATUS` | Status card placed in OBJECTIVE zone; auto-escalates if already held |
| Remove status | `REMOVE_STATUS` | Status card returned to DECK |
| Place to panorama | `PLACE_TO_PANORAMA` | Card placed in panorama; replaces old card if `replaces_card_number` set |
| New chapter | `NEW_CHAPTER` | Current objective discarded; next chapter objective drawn |

**"Without reading on" flag:**
Some draws skip the drawn card's front text and resolve from the back immediately. `skip_front: true` on the DRAW consequence handles this.

**Inline gate markers in card text:**
Story/situation card text may contain `[GATE:card_N:zone]...[/GATE]` sections. Renderer evaluates gate conditions and shows only the applicable branch. Players see only what applies to their current state.

---

### Refined Mechanic F — Story Card Two-Sidedness

Many STORY cards have narrative content on BOTH sides:
- Front: initial event or decision prompt
- Back: continuation, resolution, or alternate path

**Digital design:**
- Story cards displayed in a modal when drawn.
- Front text shown first.
- If card has `content_back` populated → show "Continue →" button after player reads front.
- Clicking Continue reveals back text in the same modal.
- After reading: execute consequences attached to that face.
- Player never needs to physically flip anything.

---

### Refined Mechanic G — Item Gate Checks (Held Items)

Beyond STATUS gates, interactions also gate on **item possession** and **zone presence**:
- "If you have the stolen jacket (card 19): Read on."
- "If card 10 is in play (in any zone)..."
- "If card 30 has not been drawn yet..."

**Digital design:**
The `status_gate` JSONB column is extended to support three gate types:

```jsonb
{ "type": "status", "card_number": "18" }
{ "type": "item", "card_number": "19", "zone": "PLAYER_AREA" }
{ "type": "zone_presence", "card_number": "10", "zone": "PANORAMA" }
```

Interaction resolution evaluates all gate conditions before determining the outcome branch.

---

### Refined Mechanic H — Consumable Item Auto-Discard

Consumable items (single-use resources like override codes, patches, flares) discard automatically after use:
- Add `consumable: boolean` to `game_assets`.
- When a consumable ACTION card is used in an interaction → auto-execute `DISCARD_SELF` after resolution.
- Toast: "[Card title] used and discarded."

**"Anytime" consumables** (usable outside normal interaction flow, e.g., coffee → clear FROZEN status):
- Button rendered directly on the card in PLAYER_AREA.
- Clicking it triggers the item's passive effect immediately without needing to drop on a Situation card.

---

### Refined Mechanic I — Progress HUD

Players need persistent visibility of game state. Digital removes the physical overhead of tracking everything manually.

**Required persistent UI elements:**
1. **Current chapter name + Objective text** — from active Objective card, always visible in OBJECTIVE zone
2. **Character health indicator** — current state of character card (healthy / weak / critical), colour-coded
3. **Active STATUS cards** — row of badges beneath character card in OBJECTIVE zone
4. **Cards in hand count** — number badge on PLAYER_AREA zone label
5. **Panorama occupancy** — which board slots are filled (already implemented via DnD)
6. **Consequence log** — last 10 events in a collapsible sidebar; acts as the "read aloud to the group" feed

**Not needed:** Chapter progress bar, card count in deck, timer. Keep it minimal.

---

## Open questions

- [x] **Window overlay UX** — RESOLVED: toast/modal output only, no visual overlay
- [x] **Panorama visual join** — RESOLVED: no visual join, metadata only
- [x] **Status gates** — RESOLVED: item and zone-presence gates added alongside status gates
- [x] **Window vs Notch unification** — RESOLVED: single ACTION card type with `action_subtype: 'reveal' | 'draw'`; visual color distinction preserved
- [x] **Board forced positioning** — RESOLVED: minimap on card face is player hint only; app never enforces placement
- [x] **Band labels on cards** — RESOLVED: band assignment is internal logic; players see only `window_action` verb, never A/B/C label
- [ ] **Notch positions** — always 3 (a/b/c), or can situation cards have fewer? (Physical evidence suggests 3 is universal)
- [ ] **Chapter count** — Icarus-7 has 3 acts. Confirm: one Objective card per act (3 total), each two-sided?
- [ ] **"Anytime" consumable UX** — button on card face vs. right-click context menu?

---

## Phase 1 — Database schema migration

**Additive only. No existing columns changed or removed.**

### Migration: `add_physical_card_mechanics`

Add to `public.game_assets`:

```sql
-- All action cards (reveal + draw): which band this card targets (internal only)
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS window_band TEXT; -- 'a' | 'b' | 'c'

-- All action cards: subtype determines resolution (reveal text vs draw card)
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS action_subtype TEXT; -- 'reveal' | 'draw'

-- Action cards: verb phrase shown on card face (e.g. "Query V.I.C.T.O.R.")
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS window_action TEXT;

-- Action cards: single-use flag
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS consumable BOOLEAN DEFAULT false;

-- Situation cards: 3 band back texts (reveal-type actions resolve here)
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS back_a TEXT;
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS back_b TEXT;
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS back_c TEXT;

-- Situation cards: notch draw targets (draw-type actions resolve here)
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS notch_draw_a TEXT;
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS notch_draw_b TEXT;
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS notch_draw_c TEXT;

-- Situation cards: board grid position (player hint only — not enforced by code)
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS panorama_row INT; -- 1-based row index
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS panorama_col INT; -- 1-based column index

-- Situation cards: atmospheric caption shown on card face
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS caption TEXT;

-- Situation/Story cards: gate conditions (status, item, zone-presence)
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS status_gate JSONB;

-- Situation cards: card to auto-discard from Panorama when this card enters (Living Board)
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS replaces_card_number TEXT;

-- Objective cards: chapter number
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS objective_chapter INT;

-- Scenario identity card (stays on top of deck always)
ALTER TABLE public.game_assets ADD COLUMN IF NOT EXISTS is_scenario_card BOOLEAN DEFAULT false;
```

Add to `public.card_positions`:

```sql
-- Flip state for two-sided cards: objectives, statuses, story cards, character
ALTER TABLE public.card_positions ADD COLUMN IF NOT EXISTS flip_state TEXT DEFAULT 'front'; -- 'front' | 'back'
```

Add to `public.interactions`:

```sql
-- Band this interaction row applies to (null = band-independent)
ALTER TABLE public.interactions ADD COLUMN IF NOT EXISTS window_band TEXT; -- 'a' | 'b' | 'c'

-- STATUS/item/zone gate that triggers this row (null = default)
ALTER TABLE public.interactions ADD COLUMN IF NOT EXISTS status_modifier TEXT;

-- Consequence payload: ordered array of consequence objects executed after resolution
-- Types: DRAW_CARD, DRAW_CARDS, DRAW_RANGE, DISCARD_CARD, DISCARD_SELF,
--        DISCARD_PANORAMA, RETURN_TO_DECK, FLIP_CARD_SELF, FLIP_OBJECTIVE,
--        DAMAGE_CHARACTER, GAIN_STATUS, REMOVE_STATUS, PLACE_TO_PANORAMA, NEW_CHAPTER
ALTER TABLE public.interactions ADD COLUMN IF NOT EXISTS consequences JSONB;
```

**Existing `content_back`** kept as Story card back-face text. `consequences` column encodes all card outcomes as structured data — no hardcoded result logic in application code.

---

## Phase 2 — Story content (Crucible re-write)

### Primary references
- **`CARD_CATALOG.md`** — 50 physical cards fully documented. Read before writing any card content. Understand narrative patterns, NPC voice, consequence structures, and how bands escalate across the same room.
- **`WINDOW_NOTCH_CARD_SPECS.md`** — all ACTION card subtypes, design rules, chapter relevance, and band content template. Read before writing any ACTION card.

### Goal
Extend `story/STORY_BIBLE.md`. Populate all new fields for SITUATION, ACTION, OBJECTIVE, STATUS, STORY, and CLUE cards.

### Per SITUATION card:
- `back_a` — Band A: V.I.C.T.O.R.'s safe version. Ends with Draw X, Set this card down, or Gain STATUS.
- `back_b` — Band B: contradiction surfaces. Ends with concrete instruction.
- `back_c` — Band C: loop truth, direct horror. Ends with concrete instruction.
- `caption` — one atmospheric sentence for card face
- `notch_draw_a / b / c` — card numbers to draw when a draw-type action resolves on this band
- `panorama_row` + `panorama_col` — 2D board position (defines minimap indicator and art adjacency)
- `status_gate` — gate conditions modifying outcomes (status, item, zone-presence)
- `replaces_card_number` — if set: auto-discard that card from Panorama when this card enters

All three bands describe the same room at three depths of revelation. Bands are not three unrelated facts.

### Per ACTION card (reveal-type, cyan):
- `window_band` — internal band assignment (`'a'` | `'b'` | `'c'`)
- `action_subtype` — `'reveal'`
- `window_action` — 2–4 word verb phrase shown on card face (player-facing, not the band)
- Band A verbs: scan, query, access, observe (Act 1 — exploratory)
- Band B verbs: confront, trace, decrypt, investigate (Act 2 — investigative)
- Band C verbs: override, force, sever, expose (Act 3 — forceful/truth-revealing)
- `consumable` — true for single-use cards

### Per ACTION card (draw-type, green):
- `window_band` — internal band assignment
- `action_subtype` — `'draw'`
- Card text is the narrative primary content (document, letter, artefact the player holds)
- The draw resolution is the mechanism; the card content is the story beat
- `consumable` — usually false (items persist unless explicitly discarded)

### Panorama pairs (adjacency planning)
Define all 15 `(panorama_row, panorama_col)` positions in the Story Bible before writing art prompts. Adjacent cards share a compositional boundary — plan rooms that are spatially/narratively connected to sit next to each other on the grid.

---

## Phase 3 — Card rendering (minimal, digital-first)

### ACTION cards (all types)
- Display `window_action` verb on card face — this is what the player reads and uses
- No band label displayed — band is internal logic only
- Consumable cards show a "×1" indicator
- Color distinction: cyan gradient for reveal-type, green gradient for draw-type (existing card base styles)

### Situation cards
- Display `caption` text on card face (small, atmospheric)
- Display minimap grid indicator showing canonical board position
- Minimap is informational only — no code enforces placement

### Situation card inspect modal (enlarged view — game-master reference)
When a situation card is double-clicked:
- Show all three bands as labelled sections: Band A / Band B / Band C
- Shows full back text for all bands regardless of which band player's current actions would resolve
- This is a reference view — game master uses it to understand the full card state

### OBJECTIVE zone
- Active Objective card shown prominently with chapter name and current objective text
- Flip state determines which face is shown (front = first sub-objective, back = second sub-objective)
- CHARACTER card shown beneath with health-state colour coding
- STATUS badges shown as a compact row beneath character card

---

## Phase 4 — Panorama board layout

### Board grid design
The Panorama board is a 2D grid. Canonical dimensions to be confirmed in the Story Bible alongside room definitions. For 15 Situation cards, a 3-row × 5-column grid is a natural fit.

### Player-driven placement
Players place cards manually by following the minimap indicator on each card's face. The app renders an empty grid with numbered/labelled slots to guide placement. No validation, no auto-correction, no forced DnD constraints.

### Scene continuity through adjacency
Cards that are horizontally or vertically adjacent should have art that continues across the shared boundary. This is an art direction constraint, not a code constraint.

Art direction rule: when assigning `(panorama_row, panorama_col)`, flag neighbouring cards and ensure image prompts describe a wide scene cropped at that boundary.

---

## Phase 5 — Interaction system

### 5.1 — ACTION card drop resolution (unified: reveal and draw)

1. Player drops any ACTION card onto a Situation card in the Panorama
2. System reads `window_band` and `action_subtype` from ACTION card
3. System collects player's STATUS cards and held items from OBJECTIVE + PLAYER_AREA zones
4. Evaluate `status_gate` on Situation card — if gate condition met, use alternate interaction row
5. Lookup interaction row: `action_card_id + situation_card_id + window_band + status_modifier`
6. Fallback chain:
   ```
   action + situation + band + status  → use (highest priority)
   action + situation + band           → use
   action + situation + status         → use
   action + situation                  → use (default)
   no match                            → NOTHING
   ```
7. Resolve based on `action_subtype`:
   - `reveal` → display `back_[band]` text from Situation card in modal
   - `draw` → execute `DRAW_CARD` for `notch_draw_[band]` value from Situation card
8. Execute all entries in `consequences` array from the matched interaction row

### 5.2 — Consequence execution engine

All entries in `consequences` JSONB are executed in order after step 8 above. Each consequence is atomic and server-synced via Supabase realtime:

```
DRAW_CARD { card_number, skip_front? }
  → Move card N from DECK to PLAYER_AREA
  → If skip_front: open modal at back face directly
  → Toast: "Drew: [card title]"

DRAW_CARDS { card_numbers: [N, M, ...] }
  → Move all listed cards from DECK to PLAYER_AREA simultaneously

DRAW_RANGE { from, to }
  → Move all cards with card_number between from and to to PLAYER_AREA

DISCARD_CARD { card_number }
  → Find card N in any zone → move to DISCARD
  → Toast: "Discarded: [card title]"

DISCARD_SELF
  → Move the triggering story/action card to DISCARD

DISCARD_PANORAMA
  → Move all cards in PANORAMA zone to DISCARD
  → Toast: "Board cleared."

RETURN_TO_DECK { card_number }
  → Find card N wherever it is → move to DECK

FLIP_CARD_SELF
  → Set flip_state = 'back' on triggering card in card_positions
  → Display content_back in modal

FLIP_OBJECTIVE
  → Set flip_state = 'back' on active OBJECTIVE card in OBJECTIVE zone
  → Display new objective text in prominent modal
  → Toast: "New objective: [back text]"

NEW_CHAPTER
  → Move current OBJECTIVE card to DISCARD
  → Move next chapter's OBJECTIVE card (by objective_chapter) to OBJECTIVE zone
  → Toast: "Chapter [N] begins."

DAMAGE_CHARACTER
  → If flip_state = 'front' on CHARACTER card → set flip_state = 'back'
  → If flip_state = 'back' → trigger end-game consequence
  → Toast: "[Character name] is now [weak/critical]."

GAIN_STATUS { card_number }
  → If card N not in OBJECTIVE zone: move from DECK → OBJECTIVE zone
  → If card N in OBJECTIVE zone at flip_state = 'front': set flip_state = 'back' (escalate)
  → If already escalated: trigger DAMAGE_CHARACTER
  → Toast: "Status: [name] gained" / "Escalated to: [escalated name]"

REMOVE_STATUS { card_number }
  → Find card N in OBJECTIVE zone → move to DECK (reset)
  → Toast: "[Status] cleared."

PLACE_TO_PANORAMA { card_number }
  → If card has replaces_card_number: find that card in PANORAMA → move to DISCARD
  → Move card N to PANORAMA
  → Toast: "[New situation] replaces [old situation] in the board."
```

### 5.3 — Story card display (modal)

When a STORY card is drawn or activated:
1. Open modal with card's `content_front`
2. If `content_back` is populated: show "Continue →" button
3. Player clicks Continue → show `content_back` in same modal
4. After reading: execute consequences for that face
5. Modal closes; game state synced

Inline gate markers in story text (`[GATE:card_N:zone]...[/GATE]`) are evaluated at render time — players see only the branch that applies to their current state.

### 5.4 — Item/status gate evaluation

Before displaying gated content or resolving any interaction:
1. Collect held items: all cards in PLAYER_AREA
2. Collect active statuses: all cards in OBJECTIVE zone (excluding CHARACTER + active OBJECTIVE)
3. Collect panorama state: which card numbers are currently in PANORAMA
4. Evaluate all gate conditions from `status_gate` JSONB
5. Use matching branch; use default branch if no gate matches

### 5.5 — Consumable auto-discard

After any interaction where an ACTION card with `consumable = true` was used:
- Execute `DISCARD_SELF` for that action card automatically
- Toast: "[Card title] used and discarded."

"Anytime" consumables render a button on the card in PLAYER_AREA — clicking it triggers the passive effect without a drop interaction.

---

## Phase 6 — Art prompts update

Panorama pairs require compositionally matched art:
- Render as one wide landscape image, then crop to individual card sizes
- Adjacent cards (same row or column boundary) share a continuous composition
- Document in `story/LEONARDO_PROMPTS.md` under a `## Panorama Adjacency` section
- Style lock token unchanged

---

## Phase 7 — Progress HUD

Player state must be visible at all times without disrupting the board.

### OBJECTIVE zone
- Active OBJECTIVE card shown prominently: chapter name + current objective text
- `flip_state` determines which face is shown
- CHARACTER card beneath, health state colour-coded (green / amber / red)
- STATUS badges displayed as compact row beneath character

### Toast system
- Toasts stack (max 3 visible), auto-dismiss after 6 seconds
- Severity levels: `info` (draw/reveal), `warning` (status gained), `danger` (character damaged), `success` (status cleared)
- Each toast shows: result text + consequence sub-list

### Consequence log (collapsible sidebar)
- Last 10 consequence events with timestamps
- Does not cover the board
- Acts as the "read aloud to the group" narrative feed
- Players narrate from this log during play

### Player hand
- Cards in PLAYER_AREA fan-displayed (arc layout)
- Item vs Story/Clue cards distinguished by color spool badge
- Count badge on zone label

---

## Phase 8 — Story revamp (agent instruction)

### Goal
Produce a fully revised and complete version of `story/STORY_BIBLE.md` that:
1. Coherently uses **every mechanic** defined in this plan
2. Achieves the narrative quality and immersion of the original Back Stories physical game
3. Populates all card fields required for database seeding

### Mandatory reading before writing a single card
- **`CARD_CATALOG.md`** — study how the original game writes narrative beats, NPC voice, consequence chains, and status escalation. Match that quality of craft.
- **`WINDOW_NOTCH_CARD_SPECS.md`** — card subtypes, band content templates, design rules.
- **`IMPLEMENTATION_PLAN.md`** (this file) — full mechanic spec. Every card must be designed to work with the consequence engine.

### Story revamp constraints

**Narrative:**
- V.I.C.T.O.R. must never be overtly evil. Patronizing warmth, not menace. Study the manager NPC in `CARD_CATALOG.md` (cards 26, 28, 31, 41, 50) — that warmth-masking-limits register is the template.
- Every room (Situation card) presents a binary failure state: V.I.C.T.O.R.'s safe explanation (Band A) vs. the loop's eroding truth (Band C). Band B is the crack that makes Band C believable.
- Every STATUS card must have a concrete mechanical effect on at least 2 interaction outcomes. No flavor-only statuses.
- Every CLUE/NOTCH card text must narratively foreshadow where the card points (the draw target).

**Mechanics integration:**
- Every Situation card must have populated `back_a`, `back_b`, `back_c`, `notch_draw_a/b/c`, `caption`, `panorama_row`, `panorama_col`.
- Every ACTION card must have `window_band`, `action_subtype`, `window_action`.
- Every STORY card that has a physical "turn over" moment must have `content_back` populated.
- Every interaction that draws or discards cards must have a `consequences` JSONB array — not narrative description alone.
- STATUS escalation paths must be explicit: what triggers the escalation, what the escalated state changes.
- At least 3 STORY cards in each act must use the Living Panorama mechanic (`PLACE_TO_PANORAMA` + `replaces_card_number`) — the board must visibly evolve.

**Structure:**
- Define all 15 Situation cards with `(panorama_row, panorama_col)` before writing art prompts. Adjacency must be intentional — spatially connected rooms sit next to each other.
- Three acts, each anchored by one OBJECTIVE card (two-sided: sub-objective flip mid-chapter).
- Critical path completable in ~90 minutes. Full exploration ~3 hours.
- The Anchor card must exist and be reachable through at least one non-obvious path.

**Output format:** Every card entry must include all database-relevant fields, not just narrative prose. The story agent's output is both the narrative design document and the seed data spec.

---

## Execution order

```
Phase 1 (DB migration)        ── run first, unblocks all phases
        │
        ├── Phase 8 (Story revamp)        ── complete revised story + all card fields
        │           │
        │           ├── Phase 2 (Story content)        ── confirm all fields populated
        │           │
        │           ├── Phase 3 (Card rendering)       ── window_action, caption, inspect modal
        │           │
        │           ├── Phase 5 (Interaction engine)   ── consequence engine, gate checks, replacement
        │           │
        │           └── Phase 7 (Progress HUD)         ── objective/character/status display
        │
        ├── Phase 4 (Panorama board)       ── grid UI, minimap indicator on cards
        │
        └── Phase 6 (Art prompts)          ── last, needs panorama positions from story revamp
```

---

## Files affected

```
migrations/
  add_physical_card_mechanics.sql     ← Phase 1 (extended schema)

story/
  STORY_BIBLE.md                      ← Phase 8 + Phase 2 (complete revamp)
  LEONARDO_PROMPTS.md                 ← Phase 6 (panorama adjacency section)

components/
  CardBody.tsx                        ← Phase 3 (window_action, caption, minimap, inspect modal)
  StoryModal.tsx                      ← Phase 5 (new — two-sided story card display + gate rendering)
  ObjectivePanel.tsx                  ← Phase 7 (new — objective + character + status HUD)
  ConsequenceLog.tsx                  ← Phase 7 (new — collapsible consequence history sidebar)

hooks/
  useGameBoard.ts                     ← Phase 5 (consequence engine, gate checks, panorama replacement)
  useConsequences.ts                  ← Phase 5 (new — consequence execution logic)

types/
  index.ts                            ← Phase 1 (JoinedAsset + GameAsset extended with all new fields)
```

**Not touched:** `app/globals.css`, `app/layout.tsx`
**Touched minimally:** `app/page.tsx` (mount Phase 7 components, wire consequence log toggle)

---

## Definition of done

### Core mechanics
- [x] Drop reveal-type ACTION card on Situation card → correct band text in modal, consequences auto-execute *(code done; requires DB seeding of `back_a/b/c` and `interactions.consequences`)*
- [x] Drop draw-type ACTION card on Situation card → correct card drawn automatically *(code done; requires DB seeding of `notch_draw_a/b/c`)*
- [x] Band assignment never shown to player — only `window_action` text visible on card face
- [x] Consumable ACTION card auto-discards after use *(auto-appends `DISCARD_SELF` when `consumable = true`)*
- [x] `DISCARD_PANORAMA` clears all Panorama slots in one consequence
- [x] `DRAW_RANGE` draws all cards in range simultaneously
- [x] Story card with `content_back` shows Continue → button and reveals back text on click

### Status system
- [x] Gaining a STATUS already held → auto-escalates (`flip_state` front → back)
- [x] Gaining escalated STATUS → `DAMAGE_CHARACTER` triggered
- [x] STATUS badges visible in OBJECTIVE zone beneath character card *(ObjectivePanel — icon, name, red border when escalated)*
- [x] STATUS cleared by `REMOVE_STATUS` → returns to DECK

### Living board
- [x] Situation card with `replaces_card_number` set → auto-discards old card from Panorama on placement *(PLACE_TO_PANORAMA consequence)*
- [x] OBJECTIVE card flips to show new sub-objective text when `FLIP_OBJECTIVE` fires *(ObjectivePanel reads flip_state)*
- [x] CHARACTER card shows health state and updates when `DAMAGE_CHARACTER` fires *(green/amber/red health indicator)*
- [x] `NEW_CHAPTER` consequence transitions objective card correctly

### Progress HUD
- [x] Current objective text always visible in OBJECTIVE zone *(ObjectivePanel — chapter name + goal text)*
- [x] Character health state colour-coded (healthy / weak / critical)
- [x] Active statuses visible as badges
- [x] Consequence log shows last 10 events; collapsible *(ConsequenceLog — stores up to 50, collapsible LOG button in HUD)*
- [ ] Toast stack (max 3) with appropriate severity colours *(interact route returns severity; UI still single-string toast — not upgraded yet)*

### Non-regression
- [x] No TypeScript errors, no hydration warnings *(`npx tsc --noEmit` — clean)*
- [ ] DnD, voice HUD, Supabase realtime all still work *(code unchanged; not browser-tested since last changes)*
- [ ] Supabase security advisors remain clear *(additive migration only — likely clear, not verified)*

---

## Remaining work

| Item | Blocked on |
|------|-----------|
| DB seed — card data from story bible | Manual seeding task (story/STORY_BIBLE.md exists, SQL not written) |
| Toast stack UI upgrade (max 3, severity colours) | Nothing — straightforward UI change in `app/page.tsx` |
| Phase 6 — Art prompts (`LEONARDO_PROMPTS.md`) | Nothing — can run anytime |
| Browser regression test | Nothing — run `npm run dev` and test DnD + realtime |
| Supabase security advisor check | Re-auth then `mcp__supabase__get_advisors` |
