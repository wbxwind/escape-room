# Task Checklist — Back Stories Digital Engine

Last updated: 2026-04-16

---

## UI Revamp Pipeline

- [ ] **Agent 1** — Design System & Board Revamp (`globals.css`, `page.tsx`, `layout.tsx`)
- [ ] **Agent 2** — Card Visual Revamp (`CardBody.tsx`, `globals.css`)
- [ ] **Agent 3** — Board Mechanics & Interaction Logic (`page.tsx`, `board.tsx`, `useGameBoard.ts`)
- [ ] **Agent 4** — Typography & Polish (`layout.tsx`, `globals.css`, `page.tsx`)

---

## Story Pipeline

- [x] **Story Agent** — Write scenario `story/STORY_BIBLE.md` ✅
  - Scenario: BREACH — The Meridian Protocol
  - 126 cards total (Character ×1, Ending ×4, Situation ×10, Issue ×17, Story ×28, Action_Window ×18, Notch ×19, Status ×6, + supporting)
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

- [ ] `npm run dev` — no TypeScript errors, no hydration warnings
- [ ] Visual check — all card types distinct
- [ ] Drag-and-drop works across all zones
- [ ] Realtime sync works (two browser windows)
- [ ] No regressions (voice HUD, room switching, draw-by-number)
