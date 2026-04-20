# Agent Directive: Strict Card UI Proportional Refactor

## Objective
Refactor the digital card designs in `components/CardBody.tsx` and `app/globals.css` to implement a **strict Container Query architecture**. The board is a Canvas, and cards must maintain a perfect 1:1 proportion on their internal layout when dynamically resizing up to fullscreen or down to pocket sizes.

## Current Flaw (Do Not Repeat)
Currently, `CardBody.tsx` relies on fixed Tailwind units (`text-[11px]`, `px-3`, `p-2`, `w-20`). When the card frame shrinks on a smaller display or zoomed-out canvas, `11px` remains `11px`. This drastically breaks word wrapping, overlap margins, and kills the aesthetic layout.

---

## The Immutable Rules for Execution

### Rule 1: The Card is the Container
In `globals.css`, the `.card-base` class must become a query container.
```css
.card-base {
  container-type: inline-size;
  container-name: card;
  aspect-ratio: 2 / 3; /* Replace calculated heights */
  width: var(--card-w); /* Height automatically follows */
}
```

### Rule 2: Zero Absolute Units Inside Cards
**You are strictly forbidden from placing fixed `px`, `rem`, or absolute Tailwind spacing/typography classes inside `CardBody.tsx`.**
- Use **`cqi` (Container Query Inline)** units for EVERYTHING inside the card to ensure layout integrity. 
- 1 `cqi` = 1% of the card's width.
- You must apply these using React `style={{}}` attributes or via custom pure CSS token mapping.

**Agent Translation Guide:**
- Tailwind Padding `p-2` (8px)  →  `style={{ padding: '4cqi' }}`
- Standard Title `text-base` (16px) → `style={{ fontSize: '8cqi', lineHeight: '1.2' }}`
- Micro Text `text-[9px]` → `style={{ fontSize: '4.5cqi' }}`
- Border Radius `rounded-xl` → `style={{ borderRadius: '6cqi' }}`
- General Borders `border-[2px]` → `style={{ borderWidth: '1cqi' }}`

### Rule 3: Mechanical Scaling (Grids & Cutouts)
Currently, window cutouts rely on static bounds. 
- Instead of the `notch-cutout` using `width: 22px`, calculate it using percentage bounding boxes or `cqi` coordinates.
- Do not use `background-size: 10px 10px` for grid rules. Use `background-size: 8cqi 8cqi` so grids natively align with camera scale.

---

## Component Targeting Blueprint

Refactor the components in `CardBody.tsx` strictly against these target models:

### 1. Character Card (`#001`)
- **Avatar Render/Placeholder**: Strip `w-20 h-20`. Use `width: 45cqi; height: 45cqi`.
- **Top Badge (#001)**: `padding: 1.5cqi 3cqi; border-bottom-right-radius: 4cqi`.
- **Title Nameplate**: Bottom anchored. `padding: 3cqi; padding-bottom: 5cqi`. Font styling must convert to relative sizes.

### 2. Story Card (`#002`)
- **Header Structure**: Limit the top header block to `%` heights.
- **Title**: Font size should scale equivalently to `7cqi` with `margin-top: 2cqi`.
- **Parchment Body**: Remove hard padding classes (`p-2`). Format exactly as: `width: 90cqi; margin: 0 auto; padding: 4cqi`.

### 3. Window Card (`#007`)
- **The Transparent Box**: Establish exact `%` boundaries: `left: 15%; right: 15%; top: 25%; bottom: 25%`. 
- **Borders**: The dashed border on the window must be proportional: `border-width: 1cqi`.

## Summary of Agent Steps
1. Go into `globals.css` and configure `.card-base` as a CSS intrinsic container.
2. Open `components/CardBody.tsx`. Systematically navigate through `<CharacterCard>`, `<SituationCard>`, etc.
3. Decouple absolute Tailwind classes and migrate them to `cqi` or `%` based inline-styles. 
4. DO NOT mark this task complete until all fixed DOM measures (`w-`, `h-`, `p-`, `m-`, `text-`, `border-`) inside `.card-base` children have been structurally eradicated in favor of relative proportions.
