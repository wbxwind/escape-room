# Building a Shaper, Ultra-Responsive Digital Board

This plan outlines the technical and design steps to transform the current "Back Stories" engine into a premium, responsive tabletop experience using your established "Claude Skills."

## User Review Required

> [!IMPORTANT]
> **Switch to Normalized Coordinates**: This is a major architectural change. Instead of `card.x = 500px`, we will use `card.x = virtualUnits(500)`. This ensures logic remains consistent while the visuals scale.
> **Tailwind v4 Integration**: We will utilize the new Tailwind v4 config style mentioned in your context to manage the "frosted glass" and "felt" design tokens globally.

## Proposed Changes

### [Component] Board View & Canvas Engine (`components/board.tsx`)

#### [MODIFY] [board.tsx](file:///c:/Users/Serge/Documents/Vide%20Coding%20Projects/escape-room/components/board.tsx)
- **Implement DPR Scaling**: Set canvas `width`/`height` attributes to `cssWidth * devicePixelRatio` and scale the context.
- **Virtual Coordinate System**: Establish a 2000-unit horizontal baseline.
- **Multi-Layer Rendering**:
  - **Layer 1 (Static)**: Tabletop texture (felt/oak), grid, and zone markers.
  - **Layer 2 (Dynamic)**: Cards, drag previews, and interaction glows.
  - **Layer 3 (HUD)**: React/HTML overlay for buttons and player list (for accessibility).

### [Component] Card Design System (`components/CardBody.tsx`)

#### [MODIFY] [CardBody.tsx](file:///c:/Users/Serge/Documents/Vide%20Coding%20Projects/escape-room/components/CardBody.tsx)
- **CSS Clip-Paths**: Use precise SVG paths for physical "Notch" and "Window" cutouts.
- **Physical Depth**: Implement variable drop shadows based on "lift" (e.g., a dragged card gains a larger, blurrier shadow).
- **Typography Hub**: Use `Playfair Display` for story text and `Inter` for technical HUD data.

### [Global Styles] Design Tokens (`app/globals.css`)

#### [MODIFY] [globals.css](file:///c:/Users/Serge/Documents/Vide%20Coding%20Projects/escape-room/app/globals.css)
- **Texture Overlays**: Add a global `.tabletop-surface` class with a subtle noise/grain filter over the deep teal base.
- **Safe Area Insets**: Use `env(safe-area-inset-bottom)` to ensure mobile home indicators don't block the Player area.
- **Frosted Glass (Glassmorphism)**: Define standard `backdrop-blur` and `bg-white/10` tokens for all UI panels.

## Open Questions

- **Mobile Orientation**: Do you want the mobile version to be locked to Landscape to preserve the board's aspect ratio, or should the Panorama stack vertically in Portrait? (Recommended: Landscape for best board readability).
- **Asset Resolution**: Should I optimize the `backstories2560x1600scale125.jpg` as a web-compressed background, or are we generating a dynamic CSS felt texture?

## Verification Plan

### Automated Tests
- **Responsive Audit**: Use the browser tool to capture screenshots at:
  - 2560x1600 (Desktop Ultra)
  - 1920x1080 (Desktop Standard)
  - 375x812 (Mobile Portrait - iPhone)
  - 812x375 (Mobile Landscape)

### Manual Verification
- **Sharpness Check**: Zoom in 200% on a card edge and verify there is no "Canvas Blur."
- **Touch Target Check**: Verify all sidebar buttons are tappable without mis-hits on mobile screens.
