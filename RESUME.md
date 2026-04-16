# Session Resume Guide — Back Stories Digital Engine

Use this file every time you start a new Claude Code session after hitting the usage limit.

---

## Step 1 — Open Terminal in the Project Folder

```powershell
cd "C:\Users\Serge\Documents\Vide Coding Projects\escape-room"
```

---

## Step 2 — Resume Claude Code

**Option A — Resume the most recent session (recommended)**
```bash
claude --continue
```

**Option B — Resume a specific session by ID**
(Claude prints the session ID when it exits — copy it and use it here)
```bash
claude --resume <paste-session-id-here>
```

**Option C — Fresh session** (use only if --continue fails)
```bash
claude
```

---

## Step 3 — Paste This Prompt to Reorient Claude

Copy and paste this exactly into Claude after it loads:

```
Read CLAUDE.md — this is the full project plan and agent orchestration guide.

Then check the current state of the project by reading:
- story/STORY_BIBLE.md       (if it exists — see how much story is written)
- story/IMAGE_STATUS.md      (if it exists — see which card images are done/pending)
- story/LEONARDO_PROMPTS.md  (if it exists — see which prompts have been generated)
- story/INTERACTION_AUDIT.md (if it exists — see if the interaction matrix was validated)
- migrations/                (list files — see which SQL seeds have been written)
- app/assets/cards/          (list files — see which card art has been generated)
- task.md                    (if it exists — see the task checklist)

Based on what you find, tell me:
1. Which agents have fully completed their work?
2. Which agents are partially done?
3. Which agents have not started?

Then create or update task.md with the current status of every agent task,
and continue with the next incomplete task.
```

---

## Step 4 — If Starting a Brand New Session (Option C)

Add this to the prompt above:

```
Also: run npm run dev to confirm the dev server starts with no errors
before changing any code.
```

---

## Quick Reference — What Each File Tells You

| File | Tells you |
|------|-----------|
| `task.md` | Overall task checklist — most reliable status indicator |
| `story/STORY_BIBLE.md` | How much of the story/card manifest is written |
| `story/IMAGE_STATUS.md` | Which cards have art (`DONE`) vs need manual gen (`PENDING_MANUAL`) |
| `story/LEONARDO_PROMPTS.md` | Ready-to-use prompts for Leonardo.ai — cards pending manual art |
| `migrations/seed_cards.sql` | Which cards have been converted to database entries |
| `migrations/seed_interactions.sql` | Whether interaction logic has been seeded |
| `app/assets/cards/` | Number of generated card images |
| `story/INTERACTION_AUDIT.md` | Whether Card Gen C has validated the interaction matrix |

---

## Session Pacing — Recommended Split

If you want to be deliberate about what you tackle each session:

| Session | What to run | Expected output |
|---------|-------------|-----------------|
| **1** | UI Agents 1 & 2 (board + card redesign) | Updated `globals.css`, `CardBody.tsx`, `page.tsx` |
| **2** | UI Agents 3 & 4 (mechanics + polish) | Updated `board.tsx`, animations, fonts |
| **3** | Story Agent | Complete `story/STORY_BIBLE.md` with all 126 cards |
| **4** | Card Gen A + C | `migrations/seed_*.sql`, `INTERACTION_AUDIT.md` |
| **5** | Card Gen B | `app/assets/cards/*.jpg` + `LEONARDO_PROMPTS.md` |

To target a specific session, tell Claude:
```
Focus only on [Session 1 / UI Agents 1 and 2] from CLAUDE.md.
Do not start any other agents. When done, update task.md.
```

---

## If Claude Seems Lost or Repeats Completed Work

Say:
```
Stop. Read task.md and tell me exactly which items are marked done [x].
Do not redo completed work. Find the first uncompleted item [ ] and start there.
```

---

## Using Leonardo.ai for Card Images

If images were not auto-generated (or you want better quality):

1. Open `story/LEONARDO_PROMPTS.md`
2. Go to [leonardo.ai](https://leonardo.ai)
3. Select model: **Leonardo Phoenix** or **Flux Dev**
4. Set ratio: **2:3 (Portrait)**
5. Copy the **Style Lock Token** from the top of the file and paste it at the start of every prompt
6. Use the **Negative Prompt** listed at the top of the file for every image
7. Download images and save to `app/assets/cards/[card_number].jpg`
8. Run the SQL update: `UPDATE public.game_assets SET image_url = '/assets/cards/[card_number].jpg' WHERE card_number = '[card_number]';`

---

## Verifying the App Still Works After Resuming

Before diving into new work, always sanity-check:

```bash
npm run dev
```

Then open `http://localhost:3000` and confirm:
- [ ] Board loads without errors
- [ ] Cards render in player area and panorama
- [ ] Drag and drop works
- [ ] Voice HUD visible in sidebar
- [ ] No red errors in browser console

---

## Emergency Reset (if something is badly broken)

```bash
# Restore last known good state from git
git status              # see what changed
git stash               # temporarily set aside broken changes
npm run dev             # confirm it works again
git stash pop           # bring changes back if you want to inspect them
```
