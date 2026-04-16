# Task Checklist — Back Stories Digital Engine

Last updated: 2026-04-16

---

## UI Revamp Pipeline

- [x] **Agent 1** — Design System & Board Revamp ✅
  - Felt/velvet tabletop texture (SVG noise + radial gradient on body)
  - Animated board grid that pulses during drag (`board-grid-active`)
  - Game HUD header with frosted glass, amber glow on "Back Stories" wordmark
  - Left sidebar with initials avatars, green pulse for active speakers
  - Discard pile with alternating rotation (±2-4°) for physical stacked look
  - Zone labels in parchment/gold serif using Playfair Display
  - Smoother drag ghost (1.08x scale, seeded ±3° tilt per card ID)
  - Design tokens in `globals.css` (felt colors, card type accents, glows)

- [x] **Agent 2** — Card Visual Revamp ✅
  - `CardBody.tsx` rebuilt with per-type sub-components: CharacterCard, SituationCard, StoryCard, IssueCard, WindowCard, NotchCard, StatusCard, EndingCard
  - Window cards: transparent CSS cutout rectangle in center with cyan glow
  - Notch cards: physical right-edge semicircle cutout using `.notch-cutout` CSS
  - Character cards: portrait top, name banner at bottom (parchment bg)
  - Situation/Panorama: card number in top-left gold badge, parchment text area
  - Elegant typography (Playfair Display headings, Crimson Text for card body text)
  - Card shine/gloss sweep animation on hover via `::after` pseudo-element
  - Google Fonts added: `Playfair Display`, `Crimson Text`

- [x] **Agent 3** — Board Mechanics & Interaction Logic ✅
  - Deterministic card rotation seeded from card ID (same card always tilts same way)
  - Fan/arc layout for Player Area cards (cards spread like held in hand)
  - Double-click to inspect: opens modal with enlarged card view
  - Draw by Number: styled modal/popover with gold border instead of bare header input
  - Panorama grid animates during drag (`board-grid-active` class)
  - Discard pile with alternating physical tilt per card index
  - Click-away for draw modal overlay

- [x] **Agent 4** — Typography & Polish ✅
  - Playfair Display + Crimson Text added to `layout.tsx` via `next/font/google`
  - All zone labels use `zone-label` class (Playfair Display, gold/amber)
  - Micro-animations: `btn-game` hover lift, `.animate-slide-in` for sidebar items
  - Toast redesigned as physical note card (parchment bg, slight rotation, serif font)
  - Loading/splash screen with spinner and typewriter effect on subtitle
  - Custom amber-tinted scrollbar
  - Inspect modal with scale-in animation

---

## Story Pipeline

- [x] **Story Agent** — Write scenario `story/STORY_BIBLE.md` ✅
  - Scenario: BREACH — The Meridian Protocol
  - 126 cards total
  - Acts 1/2/3 complete with interaction matrix defined
- [x] **IMAGE_STATUS.md** written — 4 EXISTING, 122 PENDING_MANUAL ✅

- [x] **Card Gen A** — SQL seed migrations ✅
  - [x] `migrations/seed_room.sql`
  - [x] `migrations/seed_cards.sql` (126 rows)
  - [x] `migrations/seed_interactions.sql` (55 interaction pairs)
  - [ ] Apply to Supabase & verify count query

- [ ] **Card Gen B** — Card art
  - [x] `story/LEONARDO_PROMPTS.md` (prompts for all 122 PENDING_MANUAL cards) ✅
  - [ ] `app/assets/cards/*.jpg` (auto-generation or manual via Leonardo.ai)
  - [ ] Update `seed_cards.sql` with `image_url` values

- [x] **Card Gen C** — Interaction audit ✅
  - [x] `story/INTERACTION_AUDIT.md` (validate interaction matrix)

---

## Quality Gates (run after all agents complete)

- [x] `npm run build` — TypeScript clean, no errors ✅
- [ ] Visual check — all card types distinct (needs browser review)
- [ ] Drag-and-drop works across all zones (needs browser review)
- [ ] Realtime sync works (two browser windows)
- [ ] No regressions (voice HUD, room switching, draw-by-number)
- [ ] Apply Supabase migrations + verify card counts
