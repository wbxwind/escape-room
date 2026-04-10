# UI Specification: Back Stories Digital Engine

## 1. Objective
[cite_start]Create a collaborative digital board that replicates the "Back Stories" tabletop experience[cite: 8, 68, 69].

## 2. Technical Stack & State
- **Framework:** Next.js 15+ (App Router), Tailwind CSS.
- **Persistence:** Supabase (PostgreSQL + Realtime).
- **RTC (Voice):** LiveKit SDK for sub-second latency audio.
- **Schema Reference:**
    - `game_assets`: Stores card data (Panoramas, Items, Actions, Clues).
    - `interactions`: Defines valid Notch/Window combinations and results.
    - `room_state`: Tracks live position and status of every card.
    - `room_participants`: Tracks active voice users and mute status.

## 3. Core Mechanics to Implement
### A. The Panorama Area (Center Board)
- [cite_start]Dedicated space for **Situation cards**[cite: 16, 42].
- [cite_start]Support specific "slots" or layout diagrams indicated on cards to build a scene[cite: 43, 45].
- [cite_start]Automatic logic: When a Situation card replaces an old one, move the previous card to the "Discard Area"[cite: 46].

### B. The Player Area (Hand/Inventory)
- [cite_start]Holds **Action cards** (Window/Notch), **Clue cards**, and **Character cards**[cite: 33, 36, 53].
- [cite_start]Supports **Status cards** attached to Character cards (e.g., "Frozen")[cite: 56, 126].

### C. Interaction Logic (The "Flip")
- [cite_start]**Window Actions:** Dragging a Window Action card over a Situation card simulates an "overlay," showing the back of the Situation card through the Action card's window[cite: 70].
- [cite_start]**Notch Actions:** Dragging a Notch Action card to a Situation card's edge triggers a "Draw Card" effect if a match exists in the `interactions` table[cite: 73, 87].
- **Manual Codes:** A UI input for "Guessing the Number." [cite_start]Only allow drawing if the target card has `has_magnifying_glass` enabled[cite: 120, 121].

## 4. Voice Communication Layer (Discord-Style)
- **Infrastructure:** LiveKit WebRTC.
- **API Requirement:** `/api/get-voice-token` route to issue access tokens per user session.
- **Room Isolation:**
    - Players isolated into voice channels based on `room_code`.
    - Automatic connection/disconnection on initialization.
- **UI HUD:** Overlay indicating active speakers, with mute/unmute/deafen controls.

## 5. Component Requirements
- [cite_start]**Card Component:** Front/Back states with transparent SVG masks for Windows/Notches[cite: 52].
- [cite_start]**Shared Deck:** Sidebar or modal for the remaining deck; cards drawn by number[cite: 21, 87].
- [cite_start]**The Log:** Narrative feed displaying "Story Card" text upon discovery[cite: 19, 38].

## 6. Realtime Sync Constraints
- **Supabase Realtime:** Sync `x_pos`, `y_pos`, and `current_zone` (DECK, PLAYER, PANORAMA, DISCARD).
- [cite_start]**Concurrency:** Implement a "Lock" mechanism where dragging a card visually locks it for other users[cite: 61].
- **Voice State:** Voice room membership derived from `room_state` as the source of truth.