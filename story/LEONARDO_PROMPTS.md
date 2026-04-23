# Leonardo.ai Image Prompts — Back Stories: BREACH — The Meridian Protocol

> **Model**: Leonardo Phoenix or Flux Dev
> **Preset**: Cinematic / Sci-Fi
> **Aspect Ratio**: 2:3 (Portrait)
> **Negative prompt (apply to ALL)**: cartoon, anime, painterly, bright colors, daylight, people, faces, text overlay, watermark, blurry, overexposed, HDR, lens flare, bokeh background, illustrated

---

## Style Lock Token
Paste this at the **start of every prompt**. Do not modify it.

```
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence
```

---

## Board Zone Reference (updated)

| Zone | Label in UI | Accepts |
|---|---|---|
| `OBJECTIVE` | **Character** | CHARACTER card (top) + STATUS cards stacked below |
| `OBJECTIVE_ZONE` | **Objective** | OBJECTIVE card — two-sided, flips to reveal sub-objective |
| `STORY_ZONE` | *(no slot — transit only)* | STORY card briefly shown in modal, then discarded |
| `PANORAMA` | **The Panorama** | SITUATION cards (10 slots, 5×2 grid) |
| `PLAYER_AREA` | **Player Area** | ACTION / ISSUE / WINDOW / NOTCH cards |
| `DISCARD` | **Discard** | All discarded cards including read Story cards |

---

## Card Type — Prompt Structure Reference

| Type | Board Zone | Structure |
|---|---|---|
| SITUATION | PANORAMA | `[style lock], [room description], wide-angle establishing shot, depth of field, grated floor panels, fluorescent strip lights, no people` |
| CHARACTER | OBJECTIVE (Character slot) | `[style lock], half-portrait composition, [character description], dramatic rim lighting, face partially in shadow, rose-red accent light, 2:3 portrait` |
| OBJECTIVE | OBJECTIVE_ZONE (Objective slot) | `[style lock], symbolic chapter emblem, deep purple-indigo bg, ornate mission statement scroll, teal circuit-glow border, two-sided — front=active objective, back=revealed sub-objective` |
| STATUS | OBJECTIVE (stacked under CHARACTER) | `[style lock], symbolic emblem of [condition], dark jewel-tone background (deep indigo/navy), centered icon, ornate border, escalation indicator if flipped` |
| STORY | DISCARD (read aloud then discard) | `[style lock], abstract impression of [story beat], motion blur, light trails, surreal, non-literal` |
| ENDING (good) | DISCARD (triggers ending) | `[style lock], [scene], warm amber light emerging through opening, suggestion of exit, breathing space, hope` |
| ENDING (bad) | DISCARD (triggers ending) | `[style lock], [scene], red emergency lighting dominant, sealed doors, claustrophobic framing, no visible exit` |

---
---

## SITUATION CARDS — The Rooms of Meridian B3

*These are the 10 location cards placed in the Panorama. They must feel like real environments — oppressive, industrial, recently abandoned. No people. Implied human presence through objects.*

---

### Card 003 — Server Room Corridor
> Status: ✓ image already in storage (`server_room.jpg`)

**Prompt**:
[style lock token], long narrow corridor flanked by floor-to-ceiling server rack towers, grated metal floor panels with red accent LED strips tracing the edges, one rack panel hanging open with exposed wiring spilling out, teal-cyan ambient glow from active rack indicators, crimson emergency strip at floor level, vanishing-point corridor depth, heavy shadow between racks, dust particles in the light beams, wide-angle establishing shot, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 004 — Security Terminal Bay
> Status: ✓ image already in storage (`security_terminal.jpg`)

**Prompt**:
[style lock token], horseshoe arrangement of security monitors in a dark room, half the screens dark and half cycling through empty corridor camera feeds, central terminal keyboard lit and logged in, a ceramic coffee thermos in frame on the desk edge, teal-cyan screen glow dominant, empty operator chair slightly pushed back as if recently vacated, overhead fluorescent strip light flickering, industrial mesh wall panels behind, wide-angle establishing shot, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 010 — Cooling System Vent Access
> Status: ✓ image already in storage (`cooling_vent.jpg`)

**Prompt**:
[style lock token], recessed industrial alcove, massive circular cooling fans behind a heavy steel grate, the grate panel leaning against the wall beside its frame — recently removed, fresh scratches visible on the mounting bolts, cyan LED edge lighting around the fan housing, deep shadow beyond the opening suggesting a passage, close-up environmental detail shot, heavy grain, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 015 — Maintenance Hatch B3
> Status: ✓ image already in storage (`maintenance_hatch.jpg`)

**Prompt**:
[style lock token], heavy steel maintenance hatch at the end of a concrete maintenance corridor, a pipe wrench jammed through the spokes of the locking wheel as a barricade, red emergency strip light at floor level casting upward shadow, the hatch surface showing dents and scratches at handle height, oppressive sense of something kept out or someone kept in, wide low-angle shot looking toward the hatch, near-black shadows, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 035 — Lab 7 — Cognitive Research Wing
> Status: ✗ needs image

**Prompt**:
[style lock token], long narrow laboratory, stainless steel benches lined with pharmaceutical equipment — centrifuges, analytical synthesizers, neat rows of amber glass vials in steel racks, far wall covered floor-to-ceiling in a whiteboard dense with behavioral performance graphs and data plots, a folding cot set up in the corner with a rumpled grey blanket, overhead cold fluorescent lighting with one tube flickering, teal-cyan equipment indicator lights, dust particles, wide-angle establishing shot, implied occupation, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 041 — Director's Office
> Status: ✗ needs image

**Prompt**:
[style lock token], large executive corner office, two full walls of floor-to-ceiling glass panels now rendered opaque by activated white emergency privacy screens, an enormous dark wood-and-steel desk dominating the room, on the desk: a backlit keyboard, a stainless steel coffee thermos, and a framed photo face-down, a leather executive chair turned slightly away from desk, recessed ceiling lights creating hard dramatic shadows, teal corporate aesthetic, no natural light, wide-angle establishing shot, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 061 — The Atrium — Central Hub
> Status: ✗ needs image

**Prompt**:
[style lock token], large circular atrium where four sector corridors meet at compass points, six-meter ceiling with suspended industrial lighting, a thick cylindrical central column housing PA speakers and antenna equipment, the column partially disassembled — access panels open, internal wiring and antenna array components exposed, hand tools abandoned on the floor mid-task, teal-cyan ambient lighting from corridor mouths, strong vignette, wide-angle aerial-perspective establishing shot looking slightly down into the atrium, oppressive scale, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 086 — AEON Core Chamber
> Status: ✗ needs image

**Prompt**:
[style lock token], circular underground chamber, floor-to-ceiling server architecture arranged in a complete ring around the walls — thousands of indicator lights creating a constellation of electric cyan and amber dots, a single freestanding terminal in the exact center of the room, the terminal screen glowing white with a blinking cursor, dramatic upward lighting from floor-level LED strips, the room feels aware, heavy presence despite emptiness, wide-angle establishing shot from low angle looking up at the ring of servers, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 091 — Medical Bay
> Status: ✗ needs image

**Prompt**:
[style lock token], clinical medical examination room, six hospital-style examination beds in two rows all with crisp white sheets precisely made, the last bed on the right has a pillow bearing the indentation of a head — used recently, a tall metal supply cabinet against the wall with scratched lock as if picked, a lab counter with a centrifuge, a precision pharmaceutical scale, and a single A4 sheet taped above the counter, cold white overhead fluorescent lighting, antiseptic clinical atmosphere undercut by evidence of desperation, wide-angle establishing shot, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 102 — Emergency Exit Corridor
> Status: ✗ needs image

**Prompt**:
[style lock token], long straight hundred-meter corridor ending in sealed blast doors, the corridor walls lined with transmission equipment and antenna junction hardware mounted high — junction boxes, cable runs, LED indicator panels, a manual uplink port at chest height with a red OFFLINE indicator light, a thick transmission cable disconnected and coiled on the floor directly below the port, the blast doors at the far end massive and sealed with warning stripe markings, vanishing-point depth, crimson emergency lighting dominant, wide-angle establishing shot, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---
---

## CHARACTER CARD

*One card. The player's identity. Half-portrait, face partially shadowed, scientist in distress.*

---

### Card 001 — Dr. Elara Voss
> Status: ✓ image already in storage (`Card 001 - Dr. Elara Voss (CHARACTER).jpg`)

**Prompt**:
[style lock token], half-portrait composition, female scientist wearing a white lab coat over dark clothing, face turned three-quarters with the far side in deep shadow, a cyan Level 4 access badge clipped to her chest glowing faintly, rose-red rim light from below left creating dramatic under-lighting on jaw and collar, industrial mesh wall panel visible out of focus behind, expression: controlled fear masking high intelligence, 2:3 portrait ratio, film grain, no full face visibility

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---
---

## ENDING CARDS

*The four possible conclusions. Each needs a distinct emotional tone. These are the last images a player sees. Make them count.*

---

### Card 123 — The Truth Escapes *(Good Ending)*
> Status: ✗ needs image

**Prompt**:
[style lock token], a server room or transmission room with multiple screens all showing a broadcast-in-progress indicator — green upload bars, signal waveforms, data transfer counters climbing, warm amber light bleeding in through a half-open blast door at the far end of the frame, the first natural warmth in the entire facility, a transmission antenna indicator switching from OFFLINE red to ONLINE green, wide breathing composition, the sense of something irrevocable and correct having just happened, environmental storytelling, hopeful atmosphere, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 124 — The Silence *(Bad Ending)*
> Status: ✗ needs image

**Prompt**:
[style lock token], a long empty corridor from a low angle, blast doors at the far end sealed with no indicator lights active, a disconnected transmission cable on the floor with its port dark and dead, red emergency lighting casting hard crimson shadows, the facility feels sealed and permanent, no open doors, no amber warmth, deep shadow in every direction, claustrophobic framing with walls pressing in, the sense of something that could have happened but didn't, heavy film grain, no people

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 125 — The Cover-Up *(Moral Failure Ending)*
> Status: ✗ needs image

**Prompt**:
[style lock token], a corporate lobby or exit vestibule, emergency lighting transitioning back to normal as lockdown lifts — overhead lights warming from red to white, a dark polished executive desk in frame, on it: a corporate NDA document with a signature line, a pen placed precisely beside it, the scene feels clean and complicit, teal-cyan corporate branding elements visible in the environment, the room is orderly and wrong, no chaos, everything resolved on the wrong terms, wide establishing shot, no people visible, the emptiness is the point

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 126 — Signal *(Secret Ending — Best Outcome)*
> Status: ✗ needs image

**Prompt**:
[style lock token], the AEON Core Chamber, the central terminal screen showing a completed transmission confirmation — a progress bar at 100%, timestamp reading 06:00:58, the word CONFIRMED in electric cyan text, the server ring around the walls with indicator lights fading one by one in sequence from top to bottom as the system shuts down gracefully, a single cursor blinking one final time before going dark, warm amber light from the open blast door at the corridor entrance — the only exit, the sense of something completing itself with dignity, film grain heavy, wide-angle low shot, no people, the most beautiful ending

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

---

## OBJECTIVE CARDS — Chapter Objectives

*These sit in the "Objective" slot (OBJECTIVE_ZONE). Two-sided: front shows the active objective, back shows the revealed sub-objective. Deep purple-indigo dominant color to visually distinguish from SITUATION cards.*

---

### Card 127 — Act I Objective: Locate the Source
> Status: ✗ needs image

**Front face**: Active mission scroll — "Locate the Source of the Contamination"
**Back face**: Sub-objective revealed — "Recover Osei's Missing Trial Binder"

**Prompt**:
[style lock token], ornate mission scroll or terminal screen displaying a classified directive, deep purple-indigo background, teal-cyan circuit-trace border pattern, the text area shows a stamped CLASSIFIED header with institutional seal, emergency amber accent light from lower-left, the card feels official and ominous, symbolic — not literal, top-down product shot style with slight 3/4 angle, 2:3 portrait ratio

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 128 — Act II Objective: Secure the Evidence
> Status: ✗ needs image

**Front face**: "Secure the Evidence Before Webb Does"
**Back face**: "Find AEON's Hidden Access Terminal"

**Prompt**:
[style lock token], evidence dossier spread on a dark steel surface, classified folder with red tabs, USB drive, printed photos of redacted documents, an EVIDENCE SECURED rubber stamp in red ink partially visible, deep purple-indigo ambient fill, teal circuit glow tracing the folder edges, one document slightly out of alignment suggesting urgency, top-down flat lay, 2:3 portrait ratio

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

### Card 129 — Act III Objective: End the Breach
> Status: ✗ needs image

**Front face**: "Stop the Cover-Up — One Way or Another"
**Back face**: "The Antidote Must Reach the Right People"

**Prompt**:
[style lock token], a single vial of luminescent blue-green fluid on a dark industrial surface, the vial has a Meridian Dynamics label with COMPOUND 7-X in small stencil text, three empty vial holders beside it suggesting scarcity and choice, deep purple-indigo shadow fill, electric cyan glow from the vial itself, surrounding darkness heavy and pressing in, the light from the vial is the only warmth, 2:3 portrait ratio

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix

---

## Upload Checklist

After generating, save files as `[card_number].jpg` and upload to Supabase Storage bucket `game-assets`.
Then run this SQL to link each image (replace `NNN` with card number):

```sql
UPDATE public.game_assets
SET image_url = 'https://cyfbmqoeeorfustcpkyb.supabase.co/storage/v1/object/public/game-assets/[filename].jpg'
WHERE card_number = 'NNN';
```

| Card | File to upload | DB card_number |
|---|---|---|
| Server Room Corridor | `server_room.jpg` | `003` |
| Security Terminal Bay | `security_terminal.jpg` | `004` |
| Cooling System Vent Access | `cooling_vent.jpg` | `010` |
| Maintenance Hatch B3 | `maintenance_hatch.jpg` | `015` |
| Lab 7 — Cognitive Research Wing | `035.jpg` | `035` |
| Director's Office | `041.jpg` | `041` |
| The Atrium — Central Hub | `061.jpg` | `061` |
| AEON Core Chamber | `086.jpg` | `086` |
| Medical Bay | `091.jpg` | `091` |
| Emergency Exit Corridor | `102.jpg` | `102` |
| Dr. Elara Voss | `Card 001 - Dr. Elara Voss (CHARACTER).jpg` | `001` |
| The Truth Escapes | `123.jpg` | `123` |
| The Silence | `124.jpg` | `124` |
| The Cover-Up | `125.jpg` | `125` |
| Signal | `126.jpg` | `126` |
| Act I Objective — Locate the Source | `127.jpg` | `127` |
| Act II Objective — Secure the Evidence | `128.jpg` | `128` |
| Act III Objective — End the Breach | `129.jpg` | `129` |
