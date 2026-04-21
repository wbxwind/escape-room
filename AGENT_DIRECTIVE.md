# Agent Directive: Responsive Game Board & Player Hand Optimization

## Objective
Implement a fully dynamic, height-aware responsive layout for the game board and player hand. The goal is to eliminate vertical scrollbars on the main area and ensure that all cards and slots fit perfectly within the viewport, regardless of screen resolution.

## Core Requirements

### 1. Zero Vertical Scrolling (Middle Panel)
- The main game board area (middle panel) must NEVER have a vertical scrollbar.
- All components within the board must scale to fit the available vertical space.

### 2. Dynamic Card & Slot Scaling
- Cards and slots must dynamically resize based on the container's height.
- **Maintain Aspect Ratio**: Scaling must preserve the card's designed aspect ratio. 
- **IMPORTANT**: Cards must **NEVER** be squished or compressed horizontally. They must maintain their width relative to their height at all times.
- **Unified Sizing**: Cards in the Board/Panorama, the Player Hand, and the Discard Pile must share the same calculated size for visual consistency.
- Use the current card design definition as the baseline for scaling logic.

### 3. Player Hand Improvements
- **Horizontal Overflow**: Horizontal scrolling is permitted for the player hand area ONLY when the number of cards exceeds the available width.
- **Rotation Clipping Fix**: The hand uses a slight rotation for visual appeal. You MUST ensure there is enough internal padding/margin in the hand container so that card corners are not cropped when they rotate "upwards."
- **Full Visibility**: Cards in the hand must be fully visible from top to bottom.

### 4. Side Panels & Discard Pile
- **Right Panel Width**: The width of the right panel must be flexible but wide enough to accommodate the **unified card width** plus internal padding. It should not "squish" the card to fit a fixed sidebar width.
- **Discard Pile Stacking Effect**: 
    - **Remove current layout**: Replace the simple vertical list with a stacking system.
    - **Stacking Logic**: Stack discarded cards on top of each other using a slight "slide" or offset.
    - **Visibility**: The offset must be sufficient to allow the user to see the **Number** and **Type** of each card in the stack.
    - **Reference**: Follow the current "Situation + Action" card stacking effect used elsewhere in the app.
    - **Aspect Ratio Integrity**: Ensure the stacking container does not force the cards to lose their aspect ratio (no "sliver" cards).

### 5. Layout Logic
- Prioritize fitting the cards to the height of their respective sections (Board/Panorama and Hand).
- Ensure the "Board" and "Hand" sections share the vertical space correctly so neither pushes the other off-screen or creates a scrollbar.

## Troubleshooting: Avoiding "Sliver" Cards
A common failure mode is cards being compressed into thin vertical lines. To avoid this:
1.  Ensure cards have `flex-shrink: 0`.
2.  Ensure containers (especially in the Right Panel) are allowed to expand to fit the card's width.
3.  Always scale by **height** and let the **width** follow automatically based on the card's aspect ratio.

## Implementation Notes
- Do not use fixed pixel heights for card containers.
- Leverage Flexbox or Grid with `min-content` / `max-content` or relative units (`vh`, `%`, `container queries`) to ensure fit.
- Test with many cards in hand to verify the horizontal scroll and rotation padding.
- For the Discard Pile, ensure the stacking effect is responsive and handles many cards gracefully.
