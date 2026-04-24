# AGENT DIRECTIVE — Back Stories: BREACH — Game Coherence Pass
**Date**: 2026-04-23
**Scope**: Content and logic pass for beta stability. Zero visual/design changes.
**Executing agent**: Read every source of truth listed below before writing a single line of SQL or code.

---

## SOURCES OF TRUTH — Read First, In This Order

1. `backstories_rules.txt` — canonical physical game rules. All game logic must conform to this.
2. `story/STORY_BIBLE.md` — full card manifest (126 cards).
3. `story/INTERACTION_AUDIT.md` — validated interaction matrix. Do not break any passing check.
4. `physical_card_examples/situation_cards_together.jpeg` — visual reference: cards 8 and 9 placed side-by-side form ONE continuous scene. This is the panoramic mechanic you are implementing.
5. Supabase (via MCP) — live game data. All database changes go through MCP only.

**DO NOT touch**: visual styling, Tailwind classes, design tokens, DnD drag/drop logic, LiveKit voice integration, Supabase realtime subscription setup.

---

## OVERVIEW

Three interconnected tasks, to be executed in order:

1. **Panoramic Situation Scenes** — Redesign each of the 10 Situation card locations into a 3-card panoramic scene. Each scene maps to one 16:9 landscape image sliced into three vertical thirds, each third becoming one Situation card. All three cards are equal in design and standing — any may have interactions, each has its own caption and card number. Add 20 new Situation cards to the database. Renumber cards where needed so scene panels are logically ordered. Update all references when numbers change.

2. **Story Card Draw Buttons** — Every Story card that instructs drawing or placing a specific card must expose individual labeled action buttons in the UI. Add a `draw_actions` JSONB column to `game_assets`. Populate it for all Story cards. Render the buttons in the frontend where the Story card is displayed.

3. **Story Card Content Polish** — Every Story card must end with at least one explicit, imperative instruction. Review all Story cards from the database and fix any that leave the player without a clear next step.

---

## TASK 1 — Panoramic Situation Scenes

### Background

In the physical game (`situation_cards_together.jpeg`), Situation cards placed side-by-side in the Panorama share one continuous image across their borders. The digital game has 10 isolated Situation cards with individual images. This makes locations feel thin.

The goal: each of the 10 locations becomes a 3-card panoramic scene. All three cards are placed in adjacent Panorama slots left-to-right. The art comes from one 16:9 landscape image sliced vertically into thirds — one image per scene, three cards per scene. **All three cards are equal**: each may have interactions, each has its own descriptive caption, none is primary or secondary.

### 1A — Build the Renumbering Plan First

Before touching the database, produce a complete plan.

**Step 1**: Query the live schema to understand column names:
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'game_assets' ORDER BY ordinal_position;
```

**Step 2**: Query all existing cards to understand current numbering and what slot each card occupies in the story:
```sql
SELECT card_number, type, title, default_zone FROM public.game_assets
WHERE room_code = 'ROOM-01' ORDER BY card_number::int;
```

**Step 3**: Read `story/STORY_BIBLE.md` in full to understand narrative context for each situation location.

**Step 4**: For each of the 10 existing Situation cards, design a 3-card scene:
- Decide what the LEFT panel depicts (one third of the scene, one atmospheric caption)
- Decide what the CENTER panel depicts (the heart of the location — typically aligns with the existing card's content)
- Decide what the RIGHT panel depicts (one third of the scene, one atmospheric caption)
- The existing card's content is revised to reflect whichever panel position it occupies (usually CENTER)
- The existing card keeps its number OR gets a new number — your choice, based on what produces the most logical deck order
- The two new panels need new numbers inserted near the existing card in the sequence

**Step 5**: Decide on new card numbers for all 20 new panels. Assign numbers that place them adjacent to their scene's anchor card in narrative order. It is acceptable to renumber OTHER cards to make room. It is also acceptable to assign new panels numbers that come after 126 — but if you do, give them numbers that reflect their narrative position (e.g., a scene that enters play in Act 1 should not be numbered 145 if that implies Act 3).

**Step 6**: Write `story/RENUMBER_PLAN.md` with this content before executing any database change:

```markdown
# Renumber Plan — Panoramic Scene Expansion

## Scene Panel Assignments
| Scene | LEFT # | CENTER # | RIGHT # | Existing Card # | Existing card keeps which panel? |
|---|---|---|---|---|---|
| Server Room Corridor | [new] | [new or existing] | [new] | 003 | CENTER |
| Security Terminal Bay | ... | ... | ... | 004 | ... |
| (one row per scene) |

## Full Renumber Map (only cards that change number)
| Old # | New # | Type | Title | Why changed |
|---|---|---|---|---|
| 003 | 004 | SITUATION | Server Room Corridor | Shifted right to make room for left panel 003 |
| (one row per affected card) |

## References to Update After Renumbering
For each card that changes number, list every place its old number appears:
| Old # | Found in | Field | Note |
|---|---|---|---|
| 003 | interactions | target_card_number | 1 row: action 007 × situation 003 |
| 003 | game_assets 002 | content_front | "Place Situation cards 003 and 004 in the Panorama" |
```

**Do not proceed to Step 1B until this plan file is complete and internally consistent.**

### 1B — Write Scene Definitions into STORY_BIBLE.md

For each of the 10 scenes, append entries for the two new panel cards under a new section in `story/STORY_BIBLE.md`:

```
## SECTION 4 — PANORAMIC SCENE PANELS (Cards added in coherence pass)
```

**Entry format for each new panel card**:

```markdown
### Card [NUMBER]
- **type**: SITUATION
- **title**: [Location Name] — [Left Panel / Right Panel]
- **scene_group**: [SCREAMING_SNAKE_CASE location name, e.g. SERVER_ROOM_CORRIDOR]
- **scene_position**: LEFT | RIGHT
- **default_zone**: DECK
- **panorama_row**: [same row as scene's center card]
- **panorama_col**: [center_col - 1 for LEFT, center_col + 1 for RIGHT]
- **content_front**: "[One specific atmospheric sentence describing what occupies this third of the scene. Must be concrete — name a visible object or environmental detail. Not: 'The room feels cold.' Yes: 'A wall-mounted fire suppression canister hangs above an unlocked equipment locker, door slightly ajar.']"
- **has_magnifying_glass**: false
- **image_prompt**: "[Scene name] — [LEFT/RIGHT] third slice of the 16:9 scene. [One-line description of what appears in this slice, referencing specific objects and lighting.]"
- **interactions**: [list only if the narrative warrants it — see rules below]
```

Also update the existing center card's STORY_BIBLE entry to add:
- `scene_group`: [same scene ID]
- `scene_position`: CENTER
- Update `image_prompt` to note it is the center third slice

**Rules for new panel card interactions**:
- Zero interactions is fine — purely visual panels are valid and common in the physical game
- Add an interaction ONLY if there is a clearly motivated narrative reason (e.g., a panel depicting a locked cabinet the player could pry open)
- Any interaction on a new panel must draw a card that does NOT already appear as a `target_card_number` in the interactions for that same scene's center card — prevents duplicate-draw collisions per INTERACTION_AUDIT W-02/W-03

### 1C — Write 16:9 Scene Prompts into LEONARDO_PROMPTS.md

Add a new section at the bottom of `story/LEONARDO_PROMPTS.md`:

```markdown
---

## PANORAMIC SCENE PROMPTS — 16:9 Slices

> Generate at **1920×1080 or 2560×1440**, landscape orientation.
> After generation, slice the image into three equal vertical thirds.
> Each third becomes the card art for one Situation card in the scene.
> Use the same negative prompt as above (applied to all cards).

Style Lock Token (same as above — prepend to every prompt):
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere,
electric cyan and crimson red practical lighting, near-black shadows, film grain,
industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling,
no people visible, implied human absence
```

For each of the 10 scenes, one entry:

```markdown
### SCENE: [Location Name] (Cards [LEFT#] | [CENTER#] | [RIGHT#])

**16:9 Prompt**:
[style lock token], [full scene description written as one wide establishing shot that reads
naturally left-to-right. Each third of the frame must contain a distinct focal element so
that slicing feels intentional. The scene must match the story narrative. Reference the
existing center card's image_prompt and extend the environment outward in both directions.
Match the visual style of app/assets/server_room.jpg, security_terminal.jpg, cooling_vent.jpg,
maintenance_hatch.jpg — deep teal-cyan, crimson red accents, near-black, industrial, no people.]

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix, Aspect Ratio: 16:9

**Slice Guide** (what appears in each third after slicing):
- LEFT THIRD (Card [LEFT#]): [specific element — e.g., "server rack row receding into darkness, one amber indicator blinking out of sequence"]
- CENTER THIRD (Card [CENTER#]): [specific element — must align with existing card content]
- RIGHT THIRD (Card [RIGHT#]): [specific element — e.g., "sealed blast door at corridor end, red emergency strip at floor level"]

**Card Captions**:
- Card [LEFT#]: "[one-sentence caption — verbatim as content_front]"
- Card [CENTER#]: "[existing or updated center caption]"
- Card [RIGHT#]: "[one-sentence caption — verbatim as content_front]"
```

### 1D — Execute Database Changes (Safe Renumbering Procedure)

Execute changes in this exact order to prevent reference conflicts. Do not skip steps.

**Step 1 — Verify current state**:
```sql
SELECT card_number, type, title FROM public.game_assets
WHERE room_code = 'ROOM-01' ORDER BY card_number::int;
SELECT count(*) FROM public.interactions i
JOIN public.game_assets a ON a.id = i.action_card_id
WHERE a.room_code = 'ROOM-01';
```

**Step 2 — Insert new scene panel cards with TEMPORARY numbers (9001–9020)**:

Using temp numbers avoids collisions if any target number is currently occupied.
```sql
INSERT INTO public.game_assets
  (room_code, card_number, type, title, content_front, default_zone,
   has_magnifying_glass, panorama_row, panorama_col)
VALUES
  ('ROOM-01', '9001', 'SITUATION', 'Server Room — Left Panel', '[caption]', 'DECK', false, 1, 0),
  ('ROOM-01', '9002', 'SITUATION', 'Server Room — Right Panel', '[caption]', 'DECK', false, 1, 2),
  -- ... all 20 new panels with temp numbers 9001–9020
```

**Step 3 — Update `interactions.target_card_number` for any card being renumbered**:

For every card whose `card_number` is changing (per the RENUMBER_PLAN.md map):
```sql
UPDATE public.interactions
SET target_card_number = '[new_number]'
WHERE target_card_number = '[old_number]';
```
Run one UPDATE per changed card. Verify after each batch:
```sql
SELECT target_card_number, count(*) FROM public.interactions GROUP BY target_card_number;
```

**Step 4 — Update `content_front` text in Story cards** for any card number referenced in prose:

For each old card number that appears in Story card text:
```sql
UPDATE public.game_assets
SET content_front = REPLACE(content_front, 'card [OLD]', 'card [NEW]')
WHERE room_code = 'ROOM-01' AND type = 'STORY'
  AND content_front ILIKE '%card [OLD]%';
```
Verify changes match intent — REPLACE is literal, check for false positives (e.g., 'card 003' vs 'cards 003').

**Step 5 — Rename existing cards to their new numbers** (only cards in RENUMBER_PLAN.md that change):
```sql
UPDATE public.game_assets
SET card_number = '[new_number]'
WHERE room_code = 'ROOM-01' AND card_number = '[old_number]';
```
Run one UPDATE per renumbered card. Execute in an order that avoids temporary collisions:
if card A moves from 003→004 and card B moves from 004→005, do B first, then A.

**Step 6 — Rename temp cards to final numbers**:
```sql
UPDATE public.game_assets SET card_number = '[final_number]'
WHERE room_code = 'ROOM-01' AND card_number = '9001';
-- repeat for each temp card
```

**Step 7 — Verify final state**:
```sql
SELECT count(*), type FROM public.game_assets
WHERE room_code = 'ROOM-01' GROUP BY type ORDER BY type;
-- Expected: 146 total (126 original + 20 new scene panels)

-- Confirm no duplicate card_numbers:
SELECT card_number, count(*) FROM public.game_assets
WHERE room_code = 'ROOM-01' GROUP BY card_number HAVING count(*) > 1;
-- Must return 0 rows.

-- Confirm all interaction targets still exist:
SELECT i.target_card_number FROM public.interactions i
JOIN public.game_assets a ON a.id = i.action_card_id
WHERE a.room_code = 'ROOM-01'
  AND NOT EXISTS (
    SELECT 1 FROM public.game_assets g
    WHERE g.room_code = 'ROOM-01' AND g.card_number = i.target_card_number
  );
-- Must return 0 rows.
```

If any verification fails, STOP and diagnose before continuing.

### 1E — Update Story Cards to Place Full Scene Groups

Story cards that instruct placing a Situation card into the Panorama must also place the two new scene panels for that scene. All three panels are placed together, left-to-right.

Find all affected Story cards:
```sql
SELECT card_number, title, content_front FROM public.game_assets
WHERE room_code = 'ROOM-01' AND type = 'STORY'
  AND (content_front ILIKE '%in the Panorama%'
    OR content_front ILIKE '%Place Situation card%'
    OR content_front ILIKE '%place card%');
```

For each result, update `content_front` to name all three cards of the scene in left-to-right order with explicit slot assignments.

**Example** — Card 002 currently says (after renumbering, numbers may differ):
> "Place Situation cards 003 and 004 in the Panorama."

After update:
> "Place Situation cards [LEFT-003], [CENTER-003], and [RIGHT-003] in the Panorama (slots 1, 2, 3 — Server Room scene). Place Situation cards [LEFT-004], [CENTER-004], and [RIGHT-004] in the Panorama (slots 4, 5, 6 — Security Terminal scene)."

Use the final card numbers from RENUMBER_PLAN.md — not the original numbers.

Preserve all existing narrative prose. Only modify the instruction paragraph.

---

## TASK 2 — Story Card Draw Buttons

### Background

Story cards frequently instruct players to draw or place specific numbered cards. The current UI has only one generic "Draw (N)" button in the header that draws the top card of the deck. Players must manually use "Draw #" to find specific cards, which breaks narrative flow.

**The fix**: Every Story card with specific card references must show dedicated, labeled draw buttons directly on the card. These buttons draw the referenced card and move it to the correct zone.

### 2A — Database: Add `draw_actions` Column

Run via Supabase MCP:
```sql
ALTER TABLE public.game_assets
ADD COLUMN IF NOT EXISTS draw_actions JSONB DEFAULT NULL;
```

**`draw_actions` schema** — an array of action objects:
```json
[
  {
    "label": "Place card 003 in Panorama (slot 1 — Server Room Left)",
    "card_number": "003",
    "target_zone": "PANORAMA"
  },
  {
    "label": "Draw card 006 (Emergency Bulletin) to Player Area",
    "card_number": "006",
    "target_zone": "PLAYER_AREA"
  }
]
```

`target_zone` must be one of: `PANORAMA`, `PLAYER_AREA`, `OBJECTIVE`, `DISCARD`.

`label` must be human-readable. Not just "Draw 006" — write "Draw card 006 (Emergency Bulletin) to Player Area." Use final card numbers from Task 1's renumbering.

### 2B — Populate `draw_actions` for All Story Cards

Read every Story card:
```sql
SELECT card_number, title, content_front FROM public.game_assets
WHERE room_code = 'ROOM-01' AND type = 'STORY'
ORDER BY card_number::int;
```

Parse `content_front` for explicit draw/place instructions:

| Text pattern in content_front | Action to generate |
|---|---|
| "Place Situation card(s) X [and Y] in the Panorama" | `target_zone: "PANORAMA"` for each card number |
| "Place card X in the Panorama" | `target_zone: "PANORAMA"` |
| "Draw card X" (no zone specified) | `target_zone: "PLAYER_AREA"` |
| "Draw card X and place it in your Player Area" | `target_zone: "PLAYER_AREA"` |
| "Place card X in the Objective Area" | `target_zone: "OBJECTIVE"` |
| "Add Status card X to the Objective Area" | `target_zone: "OBJECTIVE"` |
| "Discard card X" | skip — discard is separate, not a draw action |

After Task 1E updates Story card prose, the draw_actions for panorama placements must include ALL THREE panel cards of each scene.

Run one UPDATE per Story card that has draw instructions. Story cards with no draw instructions: `draw_actions` stays NULL.

**Verify after all updates**:
```sql
SELECT card_number, title,
  jsonb_array_length(draw_actions) AS action_count
FROM public.game_assets
WHERE room_code = 'ROOM-01'
  AND type = 'STORY'
  AND draw_actions IS NOT NULL
ORDER BY card_number::int;
```

### 2C — Frontend: Render Draw Buttons on Active Story Card

The Story card is displayed in the "STORY — READ ALOUD" zone. Check `components/board.tsx` and `app/page.tsx` for the component that renders a card in the `STORY_ZONE` or story staging area.

**Changes required**:

1. **Supabase query**: In `hooks/useGameBoard.ts`, find the query fetching `game_assets` and confirm `draw_actions` is in the select list (add it if the query does not use `*`).

2. **TypeScript type**: In `types/`, add to the card type:
   ```typescript
   draw_actions?: Array<{
     label: string;
     card_number: string;
     target_zone: 'PANORAMA' | 'PLAYER_AREA' | 'OBJECTIVE' | 'DISCARD';
   }> | null;
   ```

3. **Button rendering**: Below `content_front` text on the active Story card, render one button per draw action when `draw_actions` is non-null:

   ```tsx
   {card.draw_actions && card.draw_actions.length > 0 && (
     <div className="draw-actions-panel">
       {card.draw_actions.map((action) => {
         const alreadyInPlay = /* card_number not in DECK zone */;
         return (
           <button
             key={action.card_number}
             onClick={() => handleDrawSpecificCard(action.card_number, action.target_zone)}
             disabled={alreadyInPlay}
             className={/* match existing header Draw button style — no new CSS classes */}
           >
             {alreadyInPlay ? `✓ ${action.label} (already in play)` : action.label}
           </button>
         );
       })}
     </div>
   )}
   ```

4. **`handleDrawSpecificCard` function** in `hooks/useGameBoard.ts`:
   - Find the card with the given `card_number` in the current room
   - If card is in `DECK`: move it to `target_zone` using the same Supabase update pattern already used elsewhere in the hook. Do not invent a new pattern.
   - If card is NOT in `DECK`: do nothing — button shows disabled
   - If `target_zone` is `PANORAMA`: assign the card to the next available panorama slot (lowest-numbered empty slot, left-to-right top-to-bottom)
   - Do NOT bypass Supabase realtime broadcast — other players must see the move

5. **"Move to Discard" button**: Show this button once ALL draw_actions have been executed (all referenced cards are out of DECK):
   ```
   draw_actions.every(action => getCardByNumber(action.card_number)?.zone !== 'DECK')
   ```
   Clicking moves the Story card to DISCARD zone. Story cards always go to DISCARD after reading, per `backstories_rules.txt`.

---

## TASK 3 — Story Card Content Polish

### Background

Story cards are the heart of the story. Every one must give players a clear, executable next step. Atmospheric text with no instruction leaves players stuck.

**Rule from `backstories_rules.txt`**: "You cannot start a new action until you have completely finished the previous action (resolved all effects, placed all cards, etc.)"

### 3A — Fetch and Audit All Story Cards

```sql
SELECT card_number, title, content_front FROM public.game_assets
WHERE room_code = 'ROOM-01' AND type = 'STORY'
ORDER BY card_number::int;
```

For each card, check:

1. **Does it end with an explicit instruction?**

   Acceptable endings:
   - "Draw card X [to zone Y]."
   - "Place card X in [zone]."
   - "Add Status card X to the Objective Area beneath your Character card."
   - "No card draw — use an Action card on a Situation card to continue."
   - "Move this card to Discard. No further action."

   Unacceptable endings:
   - Pure atmosphere with no follow-up instruction
   - "Something is hidden here." — with no draw reference
   - Any sentence that ends mid-thought (truncated text)
   - "The situation has changed." — what does the player DO?

2. **Does every card number mentioned in prose have a matching `draw_actions` entry?** If not, flag for Task 2B.

3. **Is the card's game purpose clear?** Every Story card must trigger a concrete game state change (a draw, a placement, a status card) OR explicitly confirm "no draw — proceed with actions." Mood-only cards are not acceptable.

### 3B — Fix Deficient Story Cards

For each card that fails the audit:
- Preserve all existing narrative prose exactly — story text is canon, do not alter it
- Append a closing instruction paragraph on a new line, written in direct imperative voice
- Name specific card numbers. If multiple cards: list each as a separate sentence.

Run UPDATEs for fixed cards and update `draw_actions` simultaneously.

### 3C — Multi-Draw Formatting

Any Story card that draws two or more cards must list each as a separate sentence:

**Correct**:
> "Draw card 006 (Emergency Bulletin) and place it in your Player Area. Draw card 022 (Status: Watched) and add it to the Objective Area beneath your Character card."

**Incorrect**:
> "Draw cards 006 and 022 and place them as appropriate."

Fix any card using the incorrect pattern.

---

## TASK 4 — Critical Path Verification

### 4A — Every Situation Card Must Be Placeable

```sql
SELECT card_number, title FROM public.game_assets
WHERE room_code = 'ROOM-01' AND type = 'SITUATION'
ORDER BY card_number::int;
```

For each card number, confirm it appears in `draw_actions` of at least one Story card:
```sql
SELECT
  da->>'card_number' AS placed_card,
  g.card_number AS story_card,
  g.title
FROM public.game_assets g,
  jsonb_array_elements(g.draw_actions) AS da
WHERE g.room_code = 'ROOM-01'
  AND g.type = 'STORY'
  AND da->>'target_zone' = 'PANORAMA'
ORDER BY placed_card::int;
```

Any Situation card not in this result set is an orphan — players can never place it. Assign it to the logically appropriate Story card (consult STORY_BIBLE for narrative fit) and update both `content_front` and `draw_actions`.

### 4B — No Unresolved Interaction References

```sql
-- All target_card_numbers in interactions must exist in game_assets
SELECT i.target_card_number FROM public.interactions i
JOIN public.game_assets a ON a.id = i.action_card_id
WHERE a.room_code = 'ROOM-01'
  AND NOT EXISTS (
    SELECT 1 FROM public.game_assets g
    WHERE g.room_code = 'ROOM-01' AND g.card_number = i.target_card_number
  );
-- Must return 0 rows
```

### 4C — Verify No Duplicate Card Numbers

```sql
SELECT card_number, count(*) FROM public.game_assets
WHERE room_code = 'ROOM-01'
GROUP BY card_number HAVING count(*) > 1;
-- Must return 0 rows
```

### 4D — Output Report

Write `story/PLAYTHROUGH_AUDIT.md`:
- Total cards in database: N (expected: 146)
- Story cards reviewed: N
- Story cards with draw_actions populated: N
- Story cards with no instruction (flag): list
- Situation cards orphaned (no Story card places them): list
- Interaction target_card_number references that are broken: N (must be 0)
- Duplicate card numbers: N (must be 0)
- New scene panel cards inserted: 20 / 20
- Renumbering executed per RENUMBER_PLAN.md: YES / NO / PARTIAL
- Overall verdict: READY FOR BETA | NEEDS FIXES (list blockers)

---

## EXECUTION ORDER

```
1.  Read all sources of truth (backstories_rules.txt, STORY_BIBLE.md, INTERACTION_AUDIT.md)
2.  TASK 1A — Query live DB schema + card list; read STORY_BIBLE; design 10 scenes
3.  TASK 1A — Write story/RENUMBER_PLAN.md (complete before any DB change)
4.  TASK 1B — Write scene definitions into STORY_BIBLE.md (20 new panel cards)
5.  TASK 1C — Write 16:9 scene prompts into LEONARDO_PROMPTS.md
6.  TASK 1D — Execute database changes in safe order (temp→renumber refs→rename)
7.  TASK 1E — UPDATE Story card content_front to include all scene panels in panorama instructions
8.  TASK 2A — ALTER TABLE: add draw_actions column
9.  TASK 2B — UPDATE all Story cards with draw_actions (using final numbers from step 6)
10. TASK 2C — Frontend: add draw buttons to Story card read-aloud component
11. TASK 3A/3B/3C — Audit and fix Story card content_front
12. TASK 4A/4B/4C/4D — Verification queries + write PLAYTHROUGH_AUDIT.md
```

Steps 1–7 (planning + data) must be complete before frontend code (step 10). Do not start Task 2C until 2A and 2B are verified.

---

## HARD CONSTRAINTS

- **When any card number changes, update ALL four reference points**: (1) `game_assets.card_number`, (2) `interactions.target_card_number`, (3) Story card `content_front` text, (4) `draw_actions` JSONB. Missing any one breaks the game.
- **Use the safe temp-number procedure (Step 2 of Task 1D).** Never overwrite a card_number that another card currently occupies.
- **Verify after every renaming batch.** Run the zero-duplicate and zero-broken-reference queries before proceeding.
- **Never modify `schema.sql` directly.** Use Supabase MCP for all DDL and DML.
- **Do not apply changes to production without Task 4 audit passing.**
- **Do not add scene panel interactions that duplicate an existing center card's draw targets.** This triggers the duplicate-draw bug documented in INTERACTION_AUDIT W-02/W-03.
- **Do not change the Panorama grid dimensions.** Board UI is design-locked (5×2 = 10 slots). All `panorama_col` values must fit within the existing grid bounds.
- **Story card narrative prose is canon.** Append instructions; never alter existing prose.
- **Scene panels with zero interactions are valid.** Do not invent interactions to fill them — only add what the narrative clearly supports.
