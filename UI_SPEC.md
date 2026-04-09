# UI Specification: Agentic Escape Room (Back Stories Style)

## 1. Objective
Create a React (Next.js 15+) game board where multiple users can drag and drop cards in real-time. Inspired by the board game "Back Stories," where "Action" cards are placed on "Panorama" cards to trigger events.

## 2. Technical Stack
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- State/Sync: Supabase Realtime (use @supabase/supabase-js)
- Drag & Drop Library: dnd-kit (recommended for performance)

## 3. UI Components to Build
- **The Board:** A full-screen container with a subtle dark, technical aesthetic (vaguely "hacker" or "industrial").
- **Card Types:**
    - Panoramas (Large 16:9 rectangles): The background scenes.
    - Items (Small square cards): Found objects.
    - Actions (Icon-based cards): "Search", "Use", "Talk".
- **Interaction Logic:**
    - Cards must be draggable anywhere on the board.
    - When an "Action" card is dropped onto a "Panorama", trigger a call to the `/api/interact` endpoint.

## 4. Supabase Integration Requirements
- **Subscription:** The component must subscribe to the `board_assets` table.
- **OnDragEnd:** When a user stops dragging, update the `x_pos` and `y_pos` in Supabase immediately. Use Throttle/Debounce on the drag updates. 
- **Conflict Resolution:** Ensure that if two users move the same card, the UI reconciles the position smoothly via the Realtime stream.

## 5. Visual Dummies
Please use the following placeholders:
- [P1] "The Dark Server Room"
- [P2] "The CEO's Desk"
- [I1] "Rusty Key"
- [A1] "Inspect"
- [A2] "Hack"

## 6. Goal
The user should be able to open the app on two different machines and see the cards moving on both screens simultaneously as they are dragged.