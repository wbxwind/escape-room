# Agent Directive: Game UI Responsiveness & Interaction Overhaul

## 1. Zero Vertical Scrolling (Board & Hand)
- The main game board area (middle panel) must **NEVER** have a vertical scrollbar.
- All components within the board must scale to fit the available vertical space perfectly.

## 2. Dynamic Card & Slot Scaling
- **Aspect Ratio Integrity**: Cards must resize based on container height. They must **NEVER** be squished or compressed horizontally (no "sliver" cards).
- **Unified Sizing**: Cards in the Board/Panorama, Player Hand, and Discard Pile must share the same calculated size for consistency.
- **Troubleshooting**: Use `flex-shrink: 0` and ensure parent containers respect the card's aspect-ratio-derived width. Scale by **height** first.

## 3. Player Hand Improvements
- **Horizontal Scroll Only**: Horizontal scrolling is allowed in the hand area **ONLY** when the card count exceeds the available width.
- **Rotation Padding**: Ensure enough internal padding/margin in the hand container so card corners are not cropped when rotated.
- **Full Visibility**: Cards in the hand must be 100% visible from top to bottom.

## 4. Side Panels & Discard Pile
- **Right Panel Width**: The right panel width should be derived from the **unified card width** plus padding. It must not force cards to squish.
- **Discard Stacking Effect**: 
    - Replace the vertical list with a **stacking system**.
    - Apply a slight "slide" offset to stacked cards so the **Number** and **Type** remain visible.
    - Reference the existing "Situation + Action" stacking effect as a template.
- **Padding**: Add internal padding to the Discard container so cards don't touch the edges.

## 5. Card Detailed View (Inspection)
- **Full Text Display**: Ensure the entire narrative text string is displayed. 
- **Remove Truncation**: Remove all `line-clamp`, `text-overflow: ellipsis`, and fixed-height constraints on text containers in the detailed view (check `CardBody.tsx` and similar).
- **Internal Scroll**: Implement a vertical scrollbar within the beige/content area of the card to allow reading long texts in full.

## 6. Implementation Checklist
- [ ] No vertical scrollbar on the main board.
- [ ] Unified card sizes across all areas.
- [ ] Cards maintain aspect ratio (no squishing).
- [ ] Hand rotation does not clip corners.
- [ ] Discard pile uses the slide-stacking effect.
- [ ] Inspection view shows full text with internal scrolling.
