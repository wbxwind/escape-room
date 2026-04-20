---
name: ui-ux-pro-max
description: Comprehensive design intelligence for building professional UI/UX across web and mobile platforms. Use when tasks involve UI structure, visual aesthetics, interaction design, or experience quality — designing pages, creating components, selecting design systems, reviewing code for usability, or making product-level design choices. Skip for pure backend work.
---

# UI/UX Pro Max

Comprehensive design intelligence system for web and mobile applications. Covers 50+ design styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 technology stacks.

## When to Activate

Use this skill when tasks involve UI structure, visual aesthetics, interaction design, or experience quality:
- Designing new pages or layouts
- Creating UI components
- Selecting design systems or visual direction
- Reviewing code for usability problems
- Implementing navigation patterns
- Making product-level design choices

Skip for pure backend work, database design, infrastructure tasks, or non-visual automation.

## Priority-Based Rule Framework

Apply rules in priority order — higher priority rules override lower ones when they conflict:

### Priority 1 — Accessibility (Critical)
- Minimum contrast ratios: 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- All interactive elements keyboard navigable
- ARIA labels on all controls lacking visible text
- Color is never the sole conveyor of information
- Focus states always visible

### Priority 2 — Touch & Interaction (Critical)
- Touch targets ≥ 44×44pt (iOS) / 48×48dp (Android)
- Interaction feedback < 100ms for perceived immediacy
- Gesture handling: swipe, pinch, long-press where platform-appropriate
- Thumb zone placement for primary actions (bottom 1/3 on mobile)

### Priority 3 — Performance (High)
- Image optimization: WebP/AVIF, lazy loading below fold
- No layout shift (CLS < 0.1)
- Skeleton screens > spinners for content loading
- Optimistic UI updates for instant perceived response

### Priority 4 — Style Selection (High)
- Match visual style to product type and audience
- Maintain pattern consistency — don't mix glassmorphism with brutalism
- Platform adaptation: iOS conventions on iOS, Material on Android
- Supported styles: glassmorphism, minimalism, brutalism, neumorphism, bento grids, dark mode, skeuomorphism, flat, claymorphism, and 40+ more

### Priority 5 — Layout & Responsive (High)
- Mobile-first: design at 375px, then expand
- Safe area insets on mobile (notch, home indicator)
- Breakpoints: 375 → 768 → 1024 → 1440 → 1920
- Viewport: use `dvh` for full-screen layouts on mobile
- Grid: 4-column on mobile, 8–12 on desktop

### Priority 6 — Typography & Color (Medium)
- Semantic color tokens (not hardcoded hex values)
- Body text ≥ 16px, line height 1.4–1.6
- Heading scale: 1.3–1.6× per level
- Font pairings: display font for headings, readable sans for body
- 60/30/10 color rule: 60% neutral, 30% complement, 10% accent

### Priority 7 — Animation (Medium)
- Duration: 150–300ms for micro-interactions, 300–500ms for transitions
- Easing: ease-out for entrances, ease-in for exits, ease-in-out for loops
- Every animation must have semantic meaning (not decorative-only)
- Always implement `prefers-reduced-motion` support

### Priority 8 — Forms & Feedback (Medium)
- Inline validation on blur (never during typing)
- Error messages placed next to the offending field
- Progressive disclosure: show advanced options only when needed
- Success states are as designed as error states

### Priority 9 — Navigation Patterns (High)
- Maximum 7±2 top-level navigation items
- Current location always visible
- Mobile: bottom tab bar preferred over hamburger
- Deep linking support for all major states
- Consistent back navigation

### Priority 10 — Charts & Data (Low)
- Match chart type to data relationship (bar=comparison, line=trend, pie=proportion <5 slices)
- Legends always present and accessible
- Colorblind-safe palettes (avoid red+green alone)
- Always provide data table alternative to charts

## Implementation Workflow

1. **Extract context**: product type, audience, style preference, tech stack
2. **Generate design system**: establish color tokens, type scale, spacing scale, component library
3. **Apply domain-specific patterns**: use product-type conventions (SaaS, e-commerce, dashboard, etc.)
4. **Implement stack-specific**: Tailwind utilities, shadcn/ui components, or native primitives
5. **Validate against checklist** before delivery

## Technology Stack Guidance

| Stack | Key Notes |
|-------|-----------|
| Tailwind CSS | Use semantic custom properties in `@layer base`, 8pt spacing scale via `spacing` config |
| Next.js | Use `Image` component for all images, layout shift prevention, font optimization |
| shadcn/ui | Extend primitives, don't override — use `cn()` for conditional classes |
| React Native | Use `StyleSheet.create`, platform-specific shadows, safe area context |
| Flutter | Material 3 tokens, adaptive widgets, `MediaQuery` for breakpoints |

## Pre-Delivery Checklist

Before shipping any UI work, verify:
- [ ] No emoji icons — use SVG icon library (Lucide, Heroicons, Phosphor)
- [ ] Consistent icon family throughout (don't mix icon sets)
- [ ] Interaction states don't cause layout shift (use `min-h`, `min-w` on buttons)
- [ ] Semantic color tokens used (not hardcoded hex)
- [ ] Touch targets ≥ 44×44pt on all interactive elements
- [ ] Micro-interaction timing 150–300ms
- [ ] Text contrast 4.5:1 in both light and dark modes
- [ ] Safe area compliance on mobile
- [ ] Spacing follows 4/8dp rhythm (all values divisible by 4 or 8)
- [ ] Accessibility traits implemented (roles, labels, live regions)
