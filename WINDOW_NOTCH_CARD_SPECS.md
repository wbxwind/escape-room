# Window & Notch Card Specs
## Knowledge Base — Physical Card Analysis

> Derived from 20 physical card examples (Back Stories original game).
> Purpose: Reference for story writing agents designing ACTION_WINDOW and NOTCH cards for The Icarus-7 Paradox.

---

## How Situation Cards Work (Front Face)

The front of each situation card shows:
- **Card number** (top-left corner, inside a category icon circle)
- **Illustration** filling most of the card face — the scene or location
- **Caption banner** at the bottom — one atmospheric sentence (e.g. "Someone is waiting upstairs in the lobby.")
- **Board position minimap** (top-right corner) — a small 2D grid with one cell highlighted. The highlighted cell indicates this card's intended `(row, col)` position on the panorama board.

**The board position minimap is NOT a status gate indicator.** It is a placement guide. When players place adjacent cards in their correct positions, their art forms one continuous wide scene. Card 8 (col 2, row 1) and card 9 (col 3, row 1) together show one continuous restaurant panorama.

**Design implication for story agents:** When assigning `panorama_row` and `panorama_col` to each situation card, plan adjacency intentionally. Cards that share a spatial narrative (e.g. two halves of one lab) must be placed next to each other on the grid. Art prompts for neighbouring cards must request a wide composition cropped at the shared edge.

---

## How Situation Cards Work (Back Side)

Before designing action cards, understand what they interact with.

A situation card's **back face** is divided into **3 text bands** (A / B / C). Each band is a self-contained narrative segment with its own conditions and outcome instruction.

**Band anatomy:**
```
[Band A — top]
  Narrative description of what the player observes.
  Conditional: "If you have [item/status]: Draw X and [continue]. Otherwise: Set this card down."

[Band B — middle]
  More involved scene. May branch on item possession.
  "If you have [icon]: Draw 20 without reading on. / [narrative text] ... Draw 20."

[Band C — bottom]
  Most specific action. Often tied to a particular tool.
  "If you want to [use tool]: Draw 15. Otherwise: Set this card down."
```

**Rules all bands follow:**
- Every band ends with a concrete instruction: **Draw X**, **Set this card down**, or **Gain STATUS**
- Status/item gates appear inline as emoji icons (physical) → in digital: text checks at resolution
- Bands are mutually exclusive per interaction — a window card reveals exactly one band

---

## Card Subtypes

### Subtype 1 — Standard Window Card

**What it is:** A card with a die-cut rectangular window. The window's vertical position on the card determines which band (A/B/C) it reveals on the target situation card.

**Band mapping (physical):**
- Window near top of card → reveals Band A
- Window in middle → reveals Band B
- Window near bottom → reveals Band C

**Digital equivalent:** `window_band` field (`'a'` / `'b'` / `'c'`). Band is fixed per card; position is not rendered.

**Action verb:** Every standard window card carries a short action phrase displayed on its front:
- "Search & Gather" (card 3, band A)
- "Ask about John" (card 4, band B)
- "Chat / Talk" (card 5, band C)
- "Feel around using feet" (card 51, band A)
- "Feel around using hands" (card 52, band B)
- "Crowbar" (card 65, band C)
- "Screwdriver" (card 94, band A/B)

**Design principle:** Action verb names the *method*, not the result. Players know what they are doing; the band text tells them what happens. The verb should be a natural human action or a tool use.

**Chapter relevance:**
- Band A cards ("Search", "Feel around with feet") → Act 1 tone: cautious, exploratory, V.I.C.T.O.R. is helpful
- Band B cards ("Ask", "Talk", "Feel around with hands") → Act 2 tone: social pressure, information-seeking, V.I.C.T.O.R. starts hedging
- Band C cards ("Crowbar", "Screwdriver") → Act 3 tone: physical force, desperation, bypassing V.I.C.T.O.R.'s gatekeeping

**Icarus-7 naming examples:**
- Band A: "Query V.I.C.T.O.R.", "Scan with tricorder", "Access public log"
- Band B: "Confront crew member", "Trace signal", "Open maintenance panel"
- Band C: "Override access", "Cut power relay", "Force bulkhead"

---

### Subtype 2 — Item Window Card

**What it is:** A window card that is also a named item the player carries. Double function: inventory object + interaction mechanism.

**Examples:** Ice pick (card 12, window at bottom → Band C), Crowbar (card 65)

**Key distinction from standard window:** The card has a proper name and illustration of the object. It reads as something the player *has*, not just something they *do*.

**Design principle:** Item window cards are weapons, tools, or equipment. The band they target (usually C) reflects that they enable forceful or specific interactions — not observation or conversation.

**Icarus-7 examples:**
- "Plasma cutter" (Band C) — cuts through sealed panels
- "Access card — Level 2" (Band B) — opens restricted areas, triggers mid-tier reveals
- "Emergency beacon" (Band A) — signals for response, V.I.C.T.O.R. intercepts and gives sanitized answer

---

### Subtype 3 — Consumable Window Card (Single Use)

**What it is:** A window card marked ×1 (or similar). Discarded after one use.

**Examples:** Match ×1 (cards 57, 58, 59) — all Band B, all identical mechanism

**Why multiple copies exist:** Physical game ships 3 matches because players may use one and another player needs the same mechanic in a different room. In digital: single card instance, but `quantity` field could track uses remaining.

**Design principle:** Consumables are scarce resources. Their scarcity creates tension: players must decide which situation card is worth spending the item on. Assign to interactions where the outcome is uniquely valuable and cannot be obtained another way.

**Digital field:** `consumable: true`, `uses_remaining: 1` (or handle via interaction resolution: discard card after REVEAL_TEXT result fires).

**Icarus-7 examples:**
- "Thermal patch ×1" (Band B) — seals a breach, reveals structural truth beneath
- "Override code ×1" (Band C) — bypasses V.I.C.T.O.R. on one terminal, one time
- "Flare ×1" (Band A) — illuminates a dark space, gives earliest-band reading

---

### Subtype 4 — Notch Card (Narrative + Draw Pointer)

**What it is:** A card with a semicircular notch cut from one edge. The notch's vertical position aligns to a numbered row on the situation card's edge, indicating which card number to draw.

**Examples:**
- Card 6 — "John's letter" (notch on right edge, mid position)
- Card 17 — "Coin" (notch on bottom edge)

**Critical distinction from window cards:** Notch cards carry *their own full narrative text*. They are story objects — letters, artefacts, messages — that players read. The notch mechanism is secondary; the card content is primary.

**How they interact:**
1. Player holds notch card (John's letter) in hand — they have already read it as a story beat
2. Player places notch card on situation card → notch position aligns to a draw number
3. System resolves: "Draw card [X]" — this is how the letter leads somewhere

**Digital equivalent:** `window_band` field reused (`'a'` / `'b'` / `'c'`); situation card has `notch_draw_a`, `notch_draw_b`, `notch_draw_c` → card number to draw.

**Design principle:** Notch cards are the game's narrative delivery mechanism. Use them for:
- Documents (logs, letters, memos, reports)
- Discovered artefacts with backstory
- Evidence fragments that reference a location → the notch shows *where this evidence leads*

The notch band should match the era/act of the document's origin. A Band A notch document leads to an early, safe draw. A Band C notch document leads deeper into the loop's truth.

**Icarus-7 examples:**
- "Crew manifest — Dr. Voss" (notch Band A) → draws a safe Act 1 card
- "Loop iteration log #312" (notch Band B) → draws a disturbing Act 2 reveal
- "V.I.C.T.O.R. internal directive — CLASSIFIED" (notch Band C) → draws the Anchor-adjacent card

---

### Subtype 5 — Dual-Notch Card (Multi-Position)

**What it is:** A card with notches at two different positions, enabling it to interact with two different draw targets on situation cards.

**Examples:**
- Card 14 — "Jacket Clothing" (left + right notch)
- Card 19 — "Stolen jacket Clothing" (right notch, variant of 14)
- Card 42 — "Padlock key" (bottom dual notch)
- Card 63 — "Vial of diethylzinc" (left + right notch)
- Card 69 — "Chain" (left notch)

**Why dual notch:** These items serve multiple narrative functions across different situation cards. A jacket might point to one person's room (Band A draw) and a different person's locker (Band B draw). The dual notch lets the same item have two independent uses.

**Important:** The two notch positions are not interchangeable. Each targets a specific numbered position on the situation card's edge. In digital: dual-notch cards carry two band values — `window_band_primary` and `window_band_secondary` — or are modelled as two separate `window_band` interaction rows.

**Recommendation for Icarus-7:** Model dual-notch as two `interactions` table rows with the same action card, different `window_band` values. Avoids schema complexity.

**Design principle:** Use dual-notch for pivotal items that appear across multiple acts. An item that was innocuous in Act 1 (Band A use → safe draw) becomes dangerous in Act 3 (Band C use → loop truth draw). The same physical object, recontextualised.

**Icarus-7 examples:**
- "Station badge — Dr. Chen" (Band A + Band C) — in Act 1 grants access; in Act 3 reveals Dr. Chen never existed in this iteration
- "Memory shard — fragmented" (Band B + Band C) — mid-game reveals partial truth; late-game reveals the full horror
- "Temporal anchor fragment" (Band A + Band B) — early use gives V.I.C.T.O.R.'s explanation; later use gives the real function

---

### Subtype 6 — Passive / Special Rule Card

**What it is:** A card with no window or notch cutout. Carries a special rule that activates outside the standard interaction flow.

**Example:** Card 49 — "Coffee" — "You may discard this card at any time to return card 24 to the deck."

**Design principle:** Passive cards give players agency over the game's card economy. They are not interaction mechanisms — they are circuit-breakers or reset valves. Use them sparingly. Each passive card should reference a *specific* card number (not a generic "any card") so its function is intentional and narratively tied.

**Icarus-7 examples:**
- "V.I.C.T.O.R. override passphrase" — "Discard at any time to return card [Anchor] to the deck" (loop reset metaphor)
- "Emergency ration" — "Discard to draw 3 cards from the Story pile without reading them, then place them under the deck"
- "Station schematic" — "While you hold this card, you may look at any face-down Situation card before placing a window card on it"

---

## Core Design Principles (For Story Agents)

### 1. Every band must end with a concrete instruction
No band can leave the player without a directive. Options:
- `Draw [card number]`
- `Draw [card number] without reading on` (skip the new card's front text, go straight to placing)
- `Set this card down` (discard from current context)
- `Gain STATUS: [name]`
- `Remove STATUS: [name]`

### 2. Window bands encode narrative revelation depth
Band A = V.I.C.T.O.R.'s curated reality (safe, comforting, early-game accessible)
Band B = Contradictions surfacing (V.I.C.T.O.R. gives incomplete answers, player notices gaps)
Band C = Loop truth, horror, the thing V.I.C.T.O.R. tried to hide

A situation card's three bands tell the same location's story at three levels of revelation. They are not three random facts — they are escalating versions of the same truth.

### 3. Notch cards carry their own story before they point
A player reads a notch card (the letter, the log, the badge) as a narrative beat. Then they use it as a mechanism. The card's story content should foreshadow where the notch will lead. A letter that describes a strange door should point (via notch) to a card about that door.

### 4. Consumables create scarcity pressure
Only one consumable of each type. The player must choose which situation card deserves it. Design the consumable's interaction so the "wrong" use is not punishing, but the "right" use is uniquely rewarding — drives exploration instinct.

### 5. Dual-notch items evolve across acts
If an item has two notch positions, design them for different acts. The Band A use should make sense early-game (hopeful, exploratory). The Band C use should only make sense once the player knows the loop truth. The item's dual nature mirrors the game's dual reality.

### 6. Passive cards are circuit-breakers, not shortcuts
Passive cards should not trivially skip encounter chains. They should restore or reset something that creates a strategic decision: "Do I reset this now or save it?" Reference specific card numbers — vague passives lose narrative meaning.

### 7. Window action verbs define the interaction layer
- Physical actions (search, examine, dig) → Band A or C
- Social/communication actions (ask, query, report) → Band B
- Forced/technical actions (cut, override, crowbar) → Band C

For Icarus-7: frame actions in sci-fi register.
- "Scan" / "Query V.I.C.T.O.R." / "Access terminal" → Band A
- "Confront crew" / "Trace signal" / "Decrypt log" → Band B
- "Override" / "Force access" / "Sever connection" → Band C

---

## Card Count Targets (Icarus-7)

Derived from physical game's ratio:

| Subtype | Recommended count | Notes |
|---------|-------------------|-------|
| Standard Window (Band A) | 8–10 | Discovery actions — early game |
| Standard Window (Band B) | 8–10 | Investigation actions — mid game |
| Standard Window (Band C) | 6–8 | Force/truth actions — late game |
| Item Window | 4–6 | Equipment the crew might carry on station |
| Consumable Window | 3–5 | One-use resources (override codes, patches) |
| Notch (narrative docs) | 10–12 | Logs, letters, memory fragments, orders |
| Dual-Notch (pivot items) | 5–8 | Items that cross-act, evolve in meaning |
| Passive | 2–4 | Circuit-breakers; use sparingly |
| **Total ACTION cards** | **~50–65** | Matches CLAUDE.md target (25–30 window + 25–30 notch) |

---

## What NOT to Do

- **Do not create generic "investigate" actions** — every action card names a specific method
- **Do not write bands as unrelated facts** — all three bands describe the same room at different revelation depths
- **Do not make consumables too powerful** — they should be useful, not game-breaking
- **Do not assign dual-notch bands from the same act** — span at least one act boundary
- **Do not write notch card text that is separate from where the notch points** — the document should narratively connect to its draw target
- **Do not create passive cards that reference "any card"** — always name a specific card number

---

## Situation Card Band — Content Template

For each situation card the story agent writes:

```
Band A (V.I.C.T.O.R.'s version):
  "[Atmospheric 1-2 sentence description of the room as V.I.C.T.O.R. presents it — safe, tidy, logical.]
  [Optional status/item check: If you hold STATUS:COMPLIANT — Draw [early card]. Otherwise:]
  Draw [Act 1 card number]."

Band B (Contradiction surfacing):
  "[Same room, but something is off. V.I.C.T.O.R.'s explanation doesn't quite cover it.]
  If you hold STATUS:LUCID: Draw [deeper card].
  Otherwise: Draw [mid-tier card] without reading on."

Band C (Loop truth):
  "[The room as it really is — evidence of previous iterations, horror, the thing that should not exist.]
  If you hold STATUS:PARANOID: Set this card down. [V.I.C.T.O.R. shuts down the interaction.]
  Otherwise: Draw [Act 3 card number]."
```

Notch draw targets follow same band logic:
```
notch_draw_a: card number → early-safe draw
notch_draw_b: card number → mid-investigation draw
notch_draw_c: card number → late-truth draw
```
