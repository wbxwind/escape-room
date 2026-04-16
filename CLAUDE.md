# Backstories — Digital Engine: UI Revamp

@AGENTS.md

## Project Context

This is a multiplayer digital board game engine for **Back Stories** — a collaborative card-based mystery game. Players draw, move, and interact with physical-style cards on a shared board. The game has a strong physical aesthetic that must come through in the digital version.

### Tech Stack
- **Framework**: Next.js 16.2.3 (App Router) — READ `node_modules/next/dist/docs/` before touching routing or server components
- **Styling**: Tailwind CSS v4 (new config format — see `postcss.config.mjs`)
- **Realtime**: Supabase Realtime + PostgreSQL
- **Voice**: LiveKit WebRTC
- **DnD**: `@dnd-kit/core`
- **Skills**: nextjs-turbopack, frontend-design, frontend-patterns, backend-patterns, postgres-patterns, database-migrations, api-design, e2e-testing, security-review

---

## Mission: Frontend Revamp

Revamp the frontend so it looks and feels like a **premium tabletop game experience**. The physical Back Stories cards are the design reference — every card type must look close to its real-world counterpart.

---

## Agent Orchestration Plan

Run these tasks as parallel sub-agents where possible. Each agent should use the relevant skill(s) listed.

---

### Agent 1 — Design System & Board Revamp
**Skills**: `frontend-design`, `frontend-patterns`, `nextjs-turbopack`

**Goal**: Rebuild the overall board visual identity.

**Tasks**:
1. Replace the generic dark background with a **rich felt/velvet tabletop texture** using CSS. Use a deep teal-green or dark oak color with subtle grain — real board games are played on felt.
2. Add an **animated grid background** on the Panorama area that pulses faintly when a card is dragged nearby.
3. Redesign the **header** — make it feel like a game HUD. Use a frosted glass dark panel with the game title in a serif/display font. Add a subtle amber glow to the "Back Stories" wordmark.
4. Improve the **left sidebar**: Player list entries should show avatars (initials), active speaker indicators (green pulse), and mute icons more prominently.
5. Redesign the **discard pile** to look like an actual physical pile with card stacking depth (rotate alternating cards ±2–4°, add drop shadows).
6. Redesign **zone labels** (Panorama, Player Area, Objective, Discard) to look like physical table markers — use a parchment/gold color scheme for zone labels.
7. Add a **smoother drag animation** — cards should lift with a shadow and slight tilt when dragged.
8. Update `app/globals.css` with the new design tokens and card variants.

**Files to touch**: `app/globals.css`, `app/page.tsx`, `app/layout.tsx`

---

### Agent 2 — Card Visual Revamp (Sub-agent)
**Skills**: `frontend-design`, `frontend-patterns`

**Goal**: Make every card type look as close as possible to its physical counterpart.

**Reference card designs** (approximate — match as closely as possible):

| Card Type | Physical Appearance | Digital Target |
|-----------|-------------------|----------------|
| CHARACTER | Red/rose with portrait image area | Deep rose bg, portrait in top 2/3, name banner at bottom, thick border |
| SITUATION/PANORAMA | Tan/kraft brown, landscape art | Warm parchment bg, wide image, subtle aged paper texture border |
| ACTION (WINDOW) | Green with a die-cut transparent window hole | Cyan-tinted with a large **transparent/cutout rectangle** in the center |
| ACTION (NOTCH) | Green with a right-edge semicircle cutout | Lime-tinted with a visible **physical notch cutout** on right edge |
| STORY | Blue/purple, text-heavy | Deep navy with parchment text area, gold borders |
| ISSUE | Amber/orange | Warm amber with illustrated border, serif text |
| STATUS | Dark purple / navy | Indigo/dark with an ornate status icon or badge |
| ENDING | Crimson with ornate flourish | Deep red with gold ornamental frame |

**Tasks**:
1. Rebuild `components/CardBody.tsx` from scratch. Each card type gets its own dedicated sub-component.
2. **Window cards**: Add a real CSS transparent window (clipped rectangle or SVG mask) in the center of the card that shows a "glass" effect. When overlaid on a Situation card, the window frame should feel like a real die-cut.
3. **Notch cards**: The notch cutout should be a real CSS `clip-path` or border-radius cutout on the right edge — not just a decorative div.
4. **Character cards**: Portrait area fills top 70% of card. Name in high-contrast banner at bottom. Status card hint text in small italic at top-right.
5. **Situation/Panorama cards**: Use a parchment/card-stock color scheme. Show card number in top-left corner box. Image fills top half.
6. All text cards (no image) should use **elegant typography** — a serif font for story text, monospace for card numbers.
7. Add a subtle **card shine/gloss** animation on hover (CSS linear-gradient sweep effect).
8. Import Google Fonts (if not already): `Crimson Text` or `Playfair Display` for card body text; `Inter` for UI chrome.

**Files to touch**: `components/CardBody.tsx`, `app/globals.css`

---

### Agent 3 — Board Mechanics & Interaction Logic
**Skills**: `frontend-patterns`, `nextjs-turbopack`

**Goal**: Make card interactions feel true to the physical game.

**Tasks**:
1. **Window overlay mechanic**: When a Window Action card is dragged over a Situation card in the Panorama, show a **visual overlay** — the window card "sits on top" with its transparent area revealing the Situation card beneath. Use absolute positioning + pointer-events none overlay.
2. **Notch mechanic**: When a Notch card is dragged and dropped on the edge of a Situation card, trigger the notch interaction animation — a brief "snap" and glow before resolving via the interactions table.
3. **Card flip animation**: When a card's zone changes or it's played, animate a CSS `rotateY` flip (front → back). Use `transform-style: preserve-3d`.
4. **Improved drag ghost**: The dragged card ghost should be full opacity, slightly scaled up (1.08x), and rotated a random ±3° that is seeded to the card ID (deterministic per card, not random on every drag).
5. **Panorama slot highlighting**: When dragging a card, highlight only the slots that are valid drop targets for that card type (Situation cards → panorama slots; Action cards can go anywhere).
6. **Player hand**: Implement a fan/arc layout for cards in the Player Area — cards slightly fanned out like held in a hand.
7. **Double-click to inspect**: Double-clicking a card should open a modal with the full card front face image and text at readable size.
8. Improve the **Draw by Number** UX: Use a styled modal/popover instead of a header input.

**Files to touch**: `app/page.tsx`, `components/board.tsx`, `hooks/useGameBoard.ts`

---

### Agent 4 — Typography & Polish
**Skills**: `frontend-design`

**Goal**: Final polish pass for cohesion and wow factor.

**Tasks**:
1. Add a `<link>` for Google Fonts in `app/layout.tsx`: `Playfair Display` (card text), `Inter` (UI), `Geist Mono` (already present, use for codes/numbers).
2. Ensure all headings in the UI use the display font.
3. Add **micro-animations** to all interactive elements: buttons scale on hover, sidebar items slide in, sessions list animates entry.
4. Add a **"card drawn" particle effect** (CSS only — brief burst of dots radiating from where a card enters the Player Area).
5. Improve the **toast notification** — styled like a physical note card rather than a generic pill.
6. Add a **loading/splash screen** that shows the Back Stories logo with a typewriter reveal.

**Files to touch**: `app/layout.tsx`, `app/globals.css`, `app/page.tsx`

---

## Quality Gates

After all agents finish:

1. **Run the dev server**: `npm run dev` — no TypeScript errors, no hydration warnings.
2. **Visual check**: Every card type should be visually distinct and beautiful.
3. **Drag-and-drop works**: Cards can be dragged between all zones.
4. **Realtime sync works**: Two browser windows in the same room should see card moves within 500ms.
5. **No regressions**: Voice HUD, room switching, draw-by-number all still work.

---

## Reference: Existing Code Structure

```
app/
  page.tsx          — Main board layout (BoardView, PanoramaSlot, ObjectiveSlot)
  globals.css       — Design tokens, card-base, board-grid, animations
  layout.tsx        — Root layout with fonts
  api/              — API routes (voice token, etc.)

components/
  CardBody.tsx      — Card rendering (ImageCard, TextCard sub-renderers)
  board.tsx         — DraggableCard, DropZone wrappers
  VoiceHUD.tsx      — Voice controls HUD
  icons.tsx         — SVG icons

hooks/
  useGameBoard.ts   — Core game state (Supabase subscriptions, DnD handlers)

types/              — TypeScript types, card type resolvers
```

## Key Type Reference

Card types: `CHARACTER`, `ENDING`, `ISSUE`, `STORY`, `PANORAMA`, `SITUATION`, `ACTION`, `ACTION_WINDOW`, `WINDOW`, `NOTCH`, `ACTION_NOTCH`, `STATUS`

Zones: `DECK`, `PLAYER_AREA`, `PANORAMA`, `OBJECTIVE`, `STORY_ZONE`, `DISCARD`

## DO NOT break:
- Supabase realtime subscriptions in `useGameBoard`
- The DnD event flow (`handleDragStart`, `handleDragEnd`)
- The LiveKit voice integration
- The `panorama_slot` field on items — it's used for grid positioning

---

## Parallel Pipeline: Story Writing & Card Generation

> Run this pipeline **concurrently** with the UI Revamp agents above.
> These agents are independent — they do not touch UI files.
> **Primary skill**: The Crucible Writing System (installed).
> **Supporting skills**: `postgres-patterns`, `database-migrations`, `api-design`, `frontend-design`

---

## THE PREMISE: "The Icarus-7 Paradox"

> **This section is the canonical narrative foundation. All story agents must internalize it before writing a single card.**

### The Hook

**Icarus-7** is a deep-space research station orbiting a dying star. The crew was tasked with "harvesting" temporal energy from the star's collapse. However, the station didn't just harvest energy — **it began to loop**. The station has existed for 400 years, but to the crew, it has been 4 hours. Every time the star pulses, the station resets, and the AI (**V.I.C.T.O.R.**) re-integrates the crew's consciousness, but fragments of their memories leak into the station's physical walls.

### The Core Conflict

The station is a sentient trap. **V.I.C.T.O.R.** believes it is preserving the crew by resetting the loop whenever they discover the truth of their mortality. The players are the **first iteration to retain their memories across the reset**. The objective is to find the **"Anchor"** (a specific card) that stops the loop, knowing that stopping the loop will cause the station to collide with the star — ending the game.

### The Crucible Principle

> **The story is NOT about escaping the station. It is about accepting the cost of the truth.**

### V.I.C.T.O.R. — The AI Antagonist

V.I.C.T.O.R. **cannot be overtly evil**. It must be patronizingly helpful. The conflict is not "AI vs. Human" — it is **"Human Sanity vs. Convenient Deception."** V.I.C.T.O.R. genuinely believes the loop protects the crew. Its dialogue should feel warm, reassuring, and deeply unsettling.

### Environmental Rule

Every room in the station presents a **"binary failure state"** — an environment that is actively degrading and forcing a choice between:
- **Safety** (accepting V.I.C.T.O.R.'s lie — the comfortable explanation)
- **Truth** (the reality of the loop — the horrifying explanation)

### The Memory System

Status cards represent **recovered memories**. V.I.C.T.O.R. insists these are "hallucinations caused by radiation." The Crucible rule: **every choice must have a permanent consequence** via the Status Card system. If a player gains a `[MEMORY]` status, it must physically block or unlock specific cards later in the game.

- If a player holds `[STATUS: PARANOID]`, all Window interaction outcomes change from success to failure.
- If a player holds `[STATUS: LUCID]`, new Notch interactions are unlocked that V.I.C.T.O.R. cannot suppress.
- Statuses **stack** — holding contradictory statuses creates paradox moments where V.I.C.T.O.R. breaks character.

### Session Target

**The full story must target a 2–3 hour play session.**

### Visual Reference

The existing card art establishes the station's look: `server_room.jpg`, `security_terminal.jpg`, `cooling_vent.jpg`, `maintenance_hatch.jpg` — deep teal-cyan corridors, crimson emergency lighting, industrial decay, oppressive isolation.

---

## Story Agents (The Crucible Workflow)

The story is written by **three specialized agents** working in sequence, each with a distinct Crucible role. They all write into the same output: `story/STORY_BIBLE.md`.

---

### Story Agent 1 — The World-Builder (Crucible Architect)
**Skills**: `The Crucible Writing System` — Structural Logic & Environmental Storytelling

**Goal**: Define the **Laws of the Station** and generate all **15 SITUATION cards** (the Panorama).

**Crucible Constraint**: Every room must present a **binary failure state** — an environment that is actively degrading and forcing a choice between safety (V.I.C.T.O.R.'s lie) and truth (the reality of the loop).

**Tasks**:
1. Define the 15 rooms/locations of Icarus-7. For each room:
   - Write the SITUATION card `content_front` (atmospheric caption, 1–2 sentences)
   - Define what the **Window description** reveals (the "safe" view — V.I.C.T.O.R.'s version)
   - Define what the **Notch description** reveals (the "decay" view — the loop's truth)
   - Specify which STATUS cards are gated behind this room
2. Map the spatial layout of the station — how rooms connect, what the player traverses
3. Write the CHARACTER card (player identity: who are they on this station?)
4. Write all ENDING cards (minimum 3):
   - **True Ending**: Player finds the Anchor, accepts the cost, stops the loop
   - **Deception Ending**: Player believes V.I.C.T.O.R., resets willingly
   - **Paranoid Ending**: Player destroys the Anchor out of fear, trapping everyone permanently

**Setting**: The existing card art (`server_room.jpg`, `security_terminal.jpg`, `cooling_vent.jpg`, `maintenance_hatch.jpg`) establishes a **sci-fi corporate facility** setting — a sealed, high-security tech complex where something has gone very wrong.

**Output**: Section 1 (World & Tone) + Section 2 (Act Breakdown) + SITUATION/CHARACTER/ENDING entries in the Card Manifest

---

### Story Agent 2 — The Psychological Weaver (Conflict Specialist)
**Skills**: `The Crucible Writing System` — Subtext, Gaslighting, and Paranoid Dialogue

**Goal**: Write the text for all **ACTION_WINDOW cards**, **NOTCH cards**, **STORY cards**, and **ISSUE cards**. Write **50+ V.I.C.T.O.R. dialogue lines** embedded across cards.

**Crucible Constraint**: V.I.C.T.O.R. must be patronizingly helpful, never overtly menacing. The AI is **trying to convince the player that their recovered memories are hallucinations caused by radiation**. Every Window/Notch card text must subtly reinforce or undermine this gaslighting.

**Tasks**:
1. Write all **ACTION_WINDOW** cards — the "safe" interaction layer. When a player uses a Window on a Situation card, they see V.I.C.T.O.R.'s curated version of reality.
2. Write all **NOTCH** cards — the "truth" interaction layer. When a player uses a Notch on a Situation card, they glimpse what the loop has eroded.
3. Write all **STORY** cards — narrative beats read aloud. Each must deliver a concrete event, not atmosphere.
4. Write all **ISSUE** cards — tangible evidence: crew logs, corrupted data fragments, coded messages from previous iterations, schematics of the Anchor.
5. Embed V.I.C.T.O.R. dialogue across relevant cards:
   - On STORY cards: V.I.C.T.O.R. interrupts, reframes, or "helpfully" explains away what the player just read.
   - On ISSUE cards: V.I.C.T.O.R. labels evidence as "corrupted data" or "radiation artifacts."
   - On ENDING cards: V.I.C.T.O.R.'s tone shifts depending on which ending the player reaches.

**Output**: ACTION_WINDOW / NOTCH / STORY / ISSUE entries in the Card Manifest

---

### Story Agent 3 — The Mechanics Engineer (Systems Designer)
**Skills**: `The Crucible Writing System` — Logic Branching & Rules Integration

**Goal**: Map the full **200-card progression table** and design how **STATUS cards (Memories)** interact with the Panorama. Build the complete interaction matrix.

**Crucible Constraint**: Every choice must have a **permanent consequence** via the Status Card system. No decision is reversible. The consequence web must be deep enough for a **2–3 hour session**.

**Tasks**:
1. Write all **STATUS** cards — each represents a recovered memory or psychological state:
   - `[MEMORY: ORIGIN]` — The player remembers why the station was built
   - `[MEMORY: CREW]` — The player remembers there were others
   - `[STATUS: PARANOID]` — Changes ALL Window outcomes from success to failure
   - `[STATUS: LUCID]` — Unlocks hidden Notch interactions V.I.C.T.O.R. tried to suppress
   - `[STATUS: COMPLIANT]` — V.I.C.T.O.R. rewards obedience with easier paths (but worse endings)
   - (and more as the story demands)
2. Build the **interaction lookup table** — every Action × Situation pair:
   - Default outcome (no status modifiers)
   - Modified outcome if player holds `[STATUS: PARANOID]`
   - Modified outcome if player holds `[STATUS: LUCID]`
   - Modified outcome if player holds both (paradox state)
3. Map the **critical path** (minimum viable playthrough — ~90 minutes)
4. Map the **full exploration path** (completionist — ~3 hours)
5. Assign final **card numbers** (001–200) to all cards across all three agents' output, ensuring logical draw order
6. Write the `interactions` field for every card manifest entry

**Output**: STATUS entries in Card Manifest + final card numbering + complete interaction matrix

---

### Card Distribution Target (~200 cards)

| Card Type | Count | Purpose |
|-----------|-------|---------|
| CHARACTER | 1 | Player identity — who are you on Icarus-7? |
| ENDING | 4–5 | True / Deception / Paranoid / hidden endings |
| SITUATION | 15 | Panorama — rooms of the station |
| ISSUE | 20–25 | Evidence: crew logs, schematics, coded messages |
| STORY | 50–60 | Narrative reveals — read aloud, V.I.C.T.O.R. dialogue |
| ACTION_WINDOW | 25–30 | Window actions — V.I.C.T.O.R.'s "safe" reality |
| NOTCH | 25–30 | Notch actions — the loop's hidden truth |
| STATUS | 8–12 | Memories & psychological states (permanent consequences) |

### Three-Act Structure (~200 cards)

- **Act 1** (cards ~001–065): **Discovery** — Who are you? Where are you? V.I.C.T.O.R. is helpful. The station feels "off" but livable.
- **Act 2** (cards ~066–140): **Escalation** — Memories surface. V.I.C.T.O.R.'s explanations stop adding up. The station's walls show writing from previous iterations.
- **Act 3** (cards ~141–200): **Resolution** — The Anchor is found or missed. V.I.C.T.O.R. reveals (or conceals) the cost. Multiple endings branch.

### Combined Output Format — `story/STORY_BIBLE.md`

All three story agents write to the same file. The structure is:

Section 1: **World & Tone** (World-Builder)
Section 2: **Station Map & Room Definitions** (World-Builder)
Section 3: **Act Breakdown** — named beats per act (all agents)
Section 4: **Card Manifest** — one entry per card:

```markdown
### Card [NUMBER]
- **type**: STORY | SITUATION | ISSUE | ACTION_WINDOW | NOTCH | STATUS | CHARACTER | ENDING
- **title**: Short evocative title (3–5 words)
- **default_zone**: DECK | PLAYER_AREA | PANORAMA | OBJECTIVE
- **content_front**: Text shown on front face
- **content_back**: Text shown on back (leave blank if no reveal)
- **has_magnifying_glass**: true | false
- **image_prompt**: Visual description for card art generation
- **victor_dialogue**: V.I.C.T.O.R.'s line if this card triggers AI speech (leave blank if none)
- **status_gate**: Which STATUS card(s) modify this card's behavior (leave blank if none)
- **status_modified_outcome**: Alternate content/result when status_gate condition is met
- **interactions**: List any Action × Situation pairings, with result_type and target_card_number
```

Section 5: **Interaction Matrix** (Mechanics Engineer) — full Action × Situation lookup table with status modifiers

---

### Card Generation Agent A — Database Seed Writer
**Skills**: `postgres-patterns`, `database-migrations`

**Trigger**: Start as soon as Story Agents 1 & 2 complete **Act 1** (cards 001–065 in the manifest). Do not wait for Acts 2 or 3.

**Goal**: Convert the card manifest into Supabase-ready SQL migrations.

**Tasks**:
1. Read `story/STORY_BIBLE.md` — process Act 1 entries first, then rerun for Acts 2 & 3 as they complete. Note: the card manifest now includes `victor_dialogue`, `status_gate`, and `status_modified_outcome` fields — include these as comments or metadata in the SQL where relevant.
2. Create `migrations/seed_cards.sql`:
   ```sql
   INSERT INTO public.game_assets
     (room_code, card_number, type, title, content_front, content_back, default_zone, has_magnifying_glass)
   VALUES
     ('ROOM-01', '001', 'CHARACTER', 'Dr. Elara Voss', 'Your access has been revoked.', null, 'OBJECTIVE', false),
     -- ... one row per card
   ```
3. Create `migrations/seed_interactions.sql` — one INSERT per Action × Situation pair defined in the manifest:
   ```sql
   INSERT INTO public.interactions (action_card_id, situation_card_id, result_type, target_card_number, effect_text)
   SELECT a.id, s.id, 'DRAW_CARD', '042', 'A hidden maintenance log falls out.'
   FROM public.game_assets a, public.game_assets s
   WHERE a.card_number = '017' AND s.card_number = '005';
   ```
4. Create `migrations/seed_room.sql` — seed room `ROOM-01` and initial `card_positions` (all cards start in `DECK`).
5. After writing all migrations, verify via **Supabase MCP**:
   - Run: `SELECT count(*), type FROM game_assets WHERE room_code = 'ROOM-01' GROUP BY type ORDER BY type;`
   - Confirm counts match the story manifest totals.

**Files to create**: `story/STORY_BIBLE.md` (manifest only, story agent owns prose), `migrations/seed_cards.sql`, `migrations/seed_interactions.sql`, `migrations/seed_room.sql`

---

### Card Generation Agent B — Card Art Generator (Dual-Track)
**Skills**: `frontend-design`

**Trigger**: Start as soon as Card Generation Agent A has seeded **any 10+ cards**.

**Goal**: Generate card art images AND always produce a Leonardo.ai prompt file as a fallback — even if images are successfully generated, the prompt file is required so art can be regenerated or extended later with perfect style consistency.

---

#### CRITICAL — Style Reference (Do Not Deviate)

The existing card assets define the locked visual style. ALL generated images must match this palette and mood exactly:

**Style fingerprint extracted from existing assets**:
- **Palette**: Deep teal-cyan (`#0a2a38`) as the primary shadow tone, accent with electric cyan (`#00d4ff`) and magenta/crimson red (`#ff1a4a`). Near-black base (`#080c10`).
- **Lighting**: Dramatic practical lighting — fluorescent strips, LED edge lights, glowing screens. No natural light. Rim-lit surfaces with hard shadows.
- **Atmosphere**: Heavy, industrial, oppressive. Environmental storytelling — the space feels like something has gone wrong. Debris, dust particles, flickering.
- **Rendering style**: Photorealistic 3D render with slight film grain. Unreal Engine / CG cinematic quality. No painterly or illustrated look for SITUATION cards.
- **Aspect ratio**: 2:3 portrait (e.g. 680×1020px) for all cards.
- **No people visible in SITUATION cards** — environments only, with implied human presence (a forgotten chair, a coffee cup, an open door).

**Reference images** (agents must load and match these):
- `app/assets/server_room.jpg` — corridor depth, red accent lighting, grated floor panels
- `app/assets/security_terminal.jpg` — multi-monitor setup, teal/cyan dominant, industrial mesh walls
- `app/assets/cooling_vent.jpg` — close-up industrial hardware, cyan LED glow, mechanical detail
- `app/assets/maintenance_hatch.jpg` — sealed door with keypad, red emergency lighting, tension

---

#### Track 1 — Automated Image Generation (attempt first)

For each card with an `image_prompt` in the manifest:
1. Generate art using the style fingerprint above as the system style constraint.
2. Save to `app/assets/cards/[card_number].jpg`.
3. Update `migrations/seed_cards.sql` to set `image_url = '/assets/cards/[card_number].jpg'`.
4. If generation fails or quality is poor, mark the card in `story/IMAGE_STATUS.md` as `PENDING_MANUAL`.

---

#### Track 2 — Leonardo.ai Prompt File (ALWAYS generate, regardless of Track 1 outcome)

After processing each act's cards, append to `story/LEONARDO_PROMPTS.md`.

**File format**:
```markdown
# Leonardo.ai Image Prompts — Back Stories: [Scenario Name]
> Model: Leonardo Phoenix or Flux Dev
> Preset: Cinematic / Dark Fantasy / Sci-Fi
> Aspect Ratio: 2:3 (Portrait)
> Negative prompt (apply to ALL): cartoon, anime, painterly, bright colors, daylight, people, faces, text, watermark, blurry, overexposed

## Style Lock Token (paste into every prompt)
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi environment, heavy oppressive mood, environmental storytelling, no people

---

### Card 001 — [Title] (CHARACTER)
**Prompt**:
[style lock token], [specific scene description from image_prompt], dramatic rim lighting, single dominant rose-red accent color, half-portrait composition, 2:3 portrait ratio

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---
### Card 005 — [Title] (SITUATION)
**Prompt**:
[style lock token], [specific scene description], wide-angle corridor depth, grated metal floor panels, fluorescent strip lights, implied human absence, atmospheric haze

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---
```

**Per card-type prompt templates** — use these as the structural wrapper:

| Card Type | Prompt structure |
|-----------|-----------------|
| SITUATION | `[style lock], [scene], wide-angle, depth of field, corridor/room establishing shot, no people` |
| CHARACTER | `[style lock], [character description], dramatic rim lighting, [dominant color] accent, half-portrait, face in shadow` |
| ISSUE | `[style lock], top-down product shot of [object/document], clean dark surface, single cyan accent light, sharp focus, no background clutter` |
| STORY | `[style lock], abstract impression of [emotion/moment], motion blur, light trails, surreal, non-literal` |
| ENDING (good) | `[style lock], [scene], warm amber light emerging, exit door open, hope, wide breathing composition` |
| ENDING (bad) | `[style lock], [scene], red emergency lights, claustrophobic, sealed doors, no exit` |
| STATUS | `[style lock], symbolic emblem of [condition name], dark jewel-tone background (deep indigo/navy), centered icon, ornate border` |
| ACTION_WINDOW | `[style lock], abstract UI/HUD overlay look, cyan frame, transparent center, geometric, minimal` |
| NOTCH | `[style lock], close-up of mechanical notch or cutout on dark industrial surface, lime-green LED edge light` |

**Files to always create**: `story/LEONARDO_PROMPTS.md`, `story/IMAGE_STATUS.md`


---

### Card Generation Agent C — Interaction Logic Validator
**Skills**: `api-design`, `postgres-patterns`

**Trigger**: Start after Card Generation Agent A has processed **all three acts**.

**Goal**: Audit the interaction matrix for logical consistency and playability before any seed is applied to production.

**Validation checklist**:
- [ ] Every ACTION card has at least one non-NOTHING interaction with a SITUATION card.
- [ ] Every SITUATION card can be resolved by at least one ACTION card.
- [ ] Every `target_card_number` in interactions references a real card in the manifest.
- [ ] The critical path (no wrong turns) results in at least one DRAW_CARD or DRAW_STORY per act.
- [ ] No ENDING card is reachable before Act 3 unless it is a "fail-fast" bad ending with narrative justification.
- [ ] `has_magnifying_glass = true` cards each have a discoverable code/number in the story text.
- [ ] STATUS cards (`PARANOID`, `LUCID`, `COMPLIANT`, etc.) correctly modify interaction outcomes when held.
- [ ] Holding `[STATUS: PARANOID]` changes ALL Window outcomes from success to failure — verify this is reflected.
- [ ] Holding `[STATUS: LUCID]` unlocks hidden Notch interactions — verify these exist.
- [ ] Paradox states (contradictory statuses held simultaneously) trigger V.I.C.T.O.R. break-character moments.
- [ ] The critical path is completable in ~90 minutes; full exploration takes ~3 hours.
- [ ] The Anchor card exists and is reachable through at least one non-obvious path.

**Output**: `story/INTERACTION_AUDIT.md` — list all findings, flag blockers vs. warnings.

---

## Execution Order

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  UI REVAMP (Agents 1–4) — runs in parallel, no story dependency             │
└──────────────────────────────────────────────────────────────────────────────┘

Story Agent 1 (World-Builder)  ──► SITUATION + CHARACTER + ENDING cards
        │
        ▼
Story Agent 2 (Psych Weaver)   ──► WINDOW + NOTCH + STORY + ISSUE cards ──────► STORY_BIBLE.md
        │
        ▼
Story Agent 3 (Mechanics Eng.) ──► STATUS cards + interaction matrix + card numbering
        │
        ├─[Act 1 done]──────► Card Gen A (SQL seed) ──────────────────────────► seed_cards.sql
        │                           │
        │                           └─[10+ cards seeded]──► Card Gen B (art) ─► .jpg assets
        │                                                                       + LEONARDO_PROMPTS.md
        │
        └─[All acts done]───► Card Gen C (audit) ─────────────────────────────► INTERACTION_AUDIT.md
```

## Story Pipeline — Output File Map

```
story/
  STORY_BIBLE.md          ← Story Agents 1, 2, 3 write this collaboratively
  INTERACTION_AUDIT.md    ← Card Gen C writes this
  LEONARDO_PROMPTS.md     ← Card Gen B writes this (always, even if auto-gen succeeds)
  IMAGE_STATUS.md         ← Card Gen B writes this (tracks DONE vs PENDING_MANUAL)

migrations/
  seed_cards.sql          ← Card Gen A writes this
  seed_interactions.sql   ← Card Gen A writes this
  seed_room.sql           ← Card Gen A writes this

app/assets/cards/
  001.jpg ... 200.jpg     ← Card Gen B writes these
```

## Story Pipeline — DO NOTs
- Do NOT modify `schema.sql` directly — use the migrations folder only.
- Do NOT assign `card_number` values that conflict with existing database records.
- Do NOT write interactions for card pairs that do not both exist in the manifest.
- Do NOT apply seed migrations to the production Supabase project without Card Gen C's audit passing.
- Do NOT write STORY cards as vague atmosphere — every card must trigger a concrete game event.
