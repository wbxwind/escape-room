# Agent Directive: Responsive Board & Panel Layout

## Objective
Refactor the play table layout primarily within `app/page.tsx` to ensure 100% visibility of cards, perfect layout fitting without scrollbars on the main playmat, and precise architectural reconstruction of the Deck, Discard Pile, and Player Hand.

---

## 1. Top HUD Modifications
- **Reset Button**: Add a "Reset Game" button (e.g., a "↻" or "Reset" icon/text) to the **left** of the "Draw #" button (the magnifying glass) in the header. Hook this up to a reset action from the game logic (or stub it if the hook method is missing).
- **Remove Global Draw Button**: The "Draw" button currently located in the top-right of the header (which shows the `deckCount`) must be completely removed. The drawing action will move to the right panel.

## 2. Right Sidebar Revamp: The Deck & Discard
The existing right sidebar (`zone-DISCARD-wrapper`) must be divided into a highly-structural layout containing both the Deck and the Discards.

### Vertical Ratio: 1 to 3
- Transform the wrapper into a strict `flex flex-col h-full`.
- **Top Section (The Deck)**: Must be `flex-1` (1/4 of the height).
- **Bottom Section (The Discard)**: Must be `flex-[3]` (3/4 of the height).

### The Deck Section
- Create a visual interactive deck. 
- Display the `deckCount`.
- Hook the component's `onClick` to the `drawCard()` function.
- It must visually sit directly "on top" of the discard pile area (separated by a border or margin).

### The Discard Section
- **Critical Change - No Cropping**: Strip all the `absolute`, `top: Xpx`, and `transform: rotate` inline styles currently applied to discarding cards.
- **Scrollable List**: Map the discarded `items` into a vertical flex column (`flex flex-col gap-3 overflow-y-auto px-2 pb-6`).
- **100% Visibility**: Every card in the discard pile must render stacked inline, fully visible without hiding the rest of the card beneath another.

## 3. The Player Hand (Bottom Area)
- **Critical Change - No Fan Layout**: Remove the fan-rotation absolute transforms (`transform: rotate(X) translateY(X)`).
- **Scrollable Strip**: Cards must be rendered in a standard horizontal scrollable flex container: `flex flex-row overflow-x-auto gap-4 py-2 px-4`.
- **100% Visibility**: Ensure the flex parent doesn't squash the cards (use `flex-shrink-0` on card wrappers if needed). If 15 cards are in the hand, the container scrolls left-to-right, and each card is perfectly visible in its entirety without intersecting.

## 4. The Board Playmat (The Panorama)
- **No Scrollbars**: The central `board-grid` wrapper must not scroll. Swap `overflow-auto` to `overflow-hidden`.
- **Perfect Scaling Fit**: Since the `board-grid` now strictly forbids scrollbars, it must expand its contents dynamically to fill, but never overflow, the available `width` and `height`.
- **Space Optimization**: The 4x2 Panorama grid and the Objective/Story slots must maximize the horizontal and vertical space provided by the DOM, ensuring tight, appropriate spacing (`gap-X`) without wasted structural gaps.
- *Agent Hint for Scaling*: You may need to dynamically override the `--card-w` CSS variable on the `.board-grid` level using pure CSS relative clamp sizes (`min(vw, vh)` style metrics or grid fractionals) so that cards automatically shrink to fit the non-scrolling container grid tightly.

## Execution Sequence for the Agent
1. **`app/page.tsx`**: Update the HUD header to add Reset and remove Draw.
2. **`app/page.tsx`**: Completely rewrite the Right Sidebar to implement the 1:3 Deck/Discard split. Remove absolute positioning from discard mapping. Add `overflow-y-auto`.
3. **`app/page.tsx`**: Rewrite the `zone-PLAYER_AREA` map logic. Remove fan-out transforms. Add `flex-row items-end overflow-x-auto gap-4`.
4. Implement board-scaling structural checks to guarantee the `board-grid` never triggers a scrollbar and fills optimally.
