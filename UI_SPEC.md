# UI Specification: Back Stories Digital Engine

## 1. Objective
Create a collaborative digital board that replicates the "Back Stories" tabletop experience. [cite_start]Users interact by physically placing Action cards onto Situation cards to "peek" at results or draw new cards from a shared deck[cite: 8, 68, 69].

## 2. Technical Stack & State
- **Framework:** Next.js 15+ (App Router), Tailwind CSS.
- **Persistence:** Supabase (PostgreSQL + Realtime).
- **Schema Reference:**
    - [cite_start]`game_assets`: Stores card data (Panoramas, Items, Actions, Clues)[cite: 27, 34, 40, 50].
    - `interactions`: Defines valid Notch/Window combinations and their results.
    - `room_state`: Tracks the live position and status of every card on the board.

## 3. Core Mechanics to Implement
### A. The Panorama Area (Center Board)
- [cite_start]Dedicated space for **Situation cards**[cite: 16, 42].
- [cite_start]Must support specific "slots" or layout diagrams indicated on the cards to build a cohesive scene[cite: 43, 45].
- [cite_start]When a new Situation card replaces an old one, the UI must automatically move the previous card to the "Discard Area"[cite: 46].

### B. The Player Area (Hand/Inventory)
- [cite_start]Holds the user's **Action cards** (Window/Notch), **Clue cards**, and **Character cards**[cite: 33, 36, 53].
- [cite_start]Supports **Status cards** that attach to Character cards, showing active modifiers (e.g., "Frozen")[cite: 56, 126].

### C. Interaction Logic (The "Flip")
- [cite_start]**Window Actions:** When a user drags a Window Action card over a Situation card, simulate the "overlay" by showing a small preview of the Situation card's back through the Action card's window[cite: 70].
- **Notch Actions:** Dragging a Notch Action card to a Situation card's edge checks the `interactions` table. [cite_start]If a match exists, it triggers a "Draw Card" effect[cite: 73, 87].
- **Manual Codes:** A UI input for "Guessing the Number." [cite_start]Only allow drawing the result if the target card in the database has the `has_magnifying_glass` flag enabled[cite: 120, 121].

## 4. Component Requirements
- **Card Component:** Needs a 'front' and 'back' state. [cite_start]Action cards require transparent SVG masks for Windows/Notches[cite: 52].
- **Shared Deck:** A sidebar or modal representing the remaining deck. [cite_start]Cards are drawn by number as instructed by interactions[cite: 21, 87].
- [cite_start]**The Log:** A narrative feed that reads the "Story Card" text out loud (or displays it) whenever a card is moved to the Discard area[cite: 19, 38].

## 5. Realtime Sync Constraints
- Use **Supabase Realtime** to sync `x_pos`, `y_pos`, and `current_zone` (DECK, PLAYER, PANORAMA, DISCARD).
- [cite_start]Implement a "Lock" mechanism: When a user starts dragging a card, it is visually locked for others to prevent race conditions during complex interactions[cite: 61].