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

---

## PANORAMIC SCENE PROMPTS — 16:9 Slices

> Generate at **1920×1080 or 2560×1440**, landscape orientation.
> After generation, slice the image into three equal vertical thirds.
> Each third becomes the card art for one Situation card in the scene.
> Apply the same negative prompt as the portrait cards above.

**Style Lock Token** (same — prepend to every prompt):
```
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence
```

---

### SCENE: Server Room Corridor (Cards 003 | 130 | 131)

**16:9 Prompt**:
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence — a long server room corridor viewed in full width: LEFT THIRD shows a server rack row receding into depth, red accent lighting tracing grated floor panels, one rack panel hanging open with exposed wiring; CENTER THIRD shows a wall-mounted terminal alcove mid-aisle, status display cycling amber/green, overhead fluorescent tube hanging slightly unscrewed and flickering; RIGHT THIRD shows the far corridor junction, two industrial pipes crossing overhead, sealed access panel with handwritten label 'J-17 MAINTENANCE ONLY', red emergency lighting pooling at grated floor level. Continuous environment across all three sections.

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix, Aspect Ratio: 16:9

**Slice Guide**:
- LEFT THIRD (Card 003): server rack row, red accent lighting, open rack panel with exposed wiring
- CENTER THIRD (Card 130): wall-mounted terminal alcove, flickering fluorescent tube
- RIGHT THIRD (Card 131): corridor junction, crossed pipes overhead, J-17 access panel, red emergency pool light

**Card Captions**:
- Card 003: "A long corridor flanked by server racks. Red accent lighting traces the grated floor panels. The hum is constant. One rack has been physically opened — a panel hangs loose, wiring exposed."
- Card 130: "A central section of the server aisle. A wall-mounted terminal alcove sits mid-corridor, its status display cycling through amber and green. The overhead fluorescent strip has been partially unscrewed at one end, hanging at a slight angle, its tube flickering on a three-second interval."
- Card 131: "The corridor's far junction. Two pipes cross overhead at a right angle. A sealed access panel at shoulder height carries a handwritten adhesive label: 'J-17 — MAINTENANCE ONLY.' Red emergency lighting pools at floor level below it."

---

### SCENE: Security Terminal Bay (Cards 132 | 004 | 133)

**16:9 Prompt**:
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence — security terminal bay viewed full width: LEFT THIRD shows the entry threshold, badge reader beside frosted glass partition cycling blank display, visitor log clipboard with torn-out last page; CENTER THIRD shows a horseshoe of monitors, some dark, some cycling through camera feeds of empty corridors, central terminal logged in, coffee cup still warm in foreground; RIGHT THIRD shows the keycard cabinet wall, numbered hooks mostly empty, Post-it note on one vacant hook, three slots with forced-entry damaged locking tongues. Teal-cyan dominant, industrial mesh walls.

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix, Aspect Ratio: 16:9

**Slice Guide**:
- LEFT THIRD (Card 132): entry threshold, badge reader, frosted glass partition, torn visitor log
- CENTER THIRD (Card 004): horseshoe of monitors, logged-in terminal, warm coffee cup
- RIGHT THIRD (Card 133): keycard cabinet wall, empty hooks, Post-it note, forced-entry damage

**Card Captions**:
- Card 132: "The entry threshold to the security bay. A badge reader mounted beside a frosted glass partition cycles through a blank name field, resetting every four seconds. A visitor log clipboard hangs from a hook beside it — the last page has been torn out cleanly."
- Card 004: "A horseshoe of monitors — some dark, some cycling through camera feeds showing empty corridors. The central terminal is logged in. Someone left in a hurry. A coffee cup, still warm."
- Card 133: "The secondary equipment wall. Rows of keycard cabinets line the surface, numbered hooks — most empty. A handwritten Post-it note on one vacant hook reads: 'OSEI: DO NOT REISSUE.' Three keycard slots show forced-entry damage, the locking tongues bent inward."

---

### SCENE: Cooling System Vent Access (Cards 134 | 010 | 135)

**16:9 Prompt**:
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence — cooling vent access area full width: LEFT THIRD shows a narrowing service corridor with cyan-insulated industrial pipes on ceiling, pressure gauge reading above nominal, fresh scuff marks on grated floor; CENTER THIRD shows the recessed vent alcove, massive industrial fans behind grating, panel removed with scratched bolt housings, cyan LED glow; RIGHT THIRD shows the crawlspace exit point on far side, horizontal shaft opening at ankle height with scratch-bright worn edges, metal shelf shoved aside, broken caster on grate floor. Mechanical and claustrophobic.

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix, Aspect Ratio: 16:9

**Slice Guide**:
- LEFT THIRD (Card 134): narrowing service corridor, cyan-insulated pipes, pressure gauge above nominal, scuff marks
- CENTER THIRD (Card 010): recessed vent alcove, industrial fans, removed grating panel, scratched bolt housings
- RIGHT THIRD (Card 135): crawlspace exit shaft at ankle height, worn edges, shoved shelf, broken caster

**Card Captions**:
- Card 134: "A service corridor section narrowing toward the vent alcove. Industrial pipes lagged with cyan-colored insulation run the ceiling length. A pressure gauge mounted at eye level reads just above nominal. The floor grate below it shows a fresh row of scuff marks — something heavy dragged this way recently."
- Card 010: "A recessed alcove behind the server corridor. Massive industrial fans behind a grated panel. The panel has been removed — recently, judging by the scratches on the bolts. Someone went through here."
- Card 135: "The crawlspace exit point beyond the vent fans. A tight horizontal shaft opens at ankle height in the far wall, its edges scratched bright where the finish has been worn away. A metal shelf unit has been shoved aside to clear the path, one caster wheel snapped off and lying on the grate beside it."

---

### SCENE: Maintenance Hatch B3 (Cards 136 | 015 | 137)

**16:9 Prompt**:
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence — maintenance corridor and hatch full width: LEFT THIRD shows approach corridor with storage cages, one open and ransacked, emptied first aid kit red case on floor, amber emergency lighting; CENTER THIRD shows the heavy maintenance hatch, locking wheel barricaded by pipe wrench jammed through spokes, red emergency lighting, tension in the sealed door; RIGHT THIRD shows the hatch's reinforced porthole window, view through into utility corridor beyond, portable work light on floor, cot against wall, black marker writing on far wall illegible from this side. Amber/red emergency tones.

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix, Aspect Ratio: 16:9

**Slice Guide**:
- LEFT THIRD (Card 136): approach corridor, ransacked storage cage, emptied first aid kit, amber emergency lighting
- CENTER THIRD (Card 015): hatch with pipe wrench barricade, red emergency lighting, sealed tension
- RIGHT THIRD (Card 137): porthole window view into utility corridor, work light, cot, illegible wall writing

**Card Captions**:
- Card 136: "The maintenance approach corridor. A row of storage cages lines the left wall, most padlocked, one standing open and ransacked — contents scattered across the floor. A first aid kit has been emptied and not replaced, its red case left open beside the debris. Emergency lighting here is amber, not white."
- Card 015: "A heavy hatch at the end of the maintenance corridor. The locking wheel has been barricaded from this side with a pipe wrench jammed through the spokes. Someone was keeping something out — or keeping themselves in."
- Card 137: "The far side of the hatch, visible through the small reinforced porthole window. A maintenance utility corridor beyond: a portable work light on the floor casting hard shadows, a single cot set against the far wall with a folded jacket as a pillow. Writing in black marker on the wall is visible but illegible through the glass at this distance."

---

### SCENE: Lab 7 — Cognitive Research Wing (Cards 138 | 139 | 035)

**16:9 Prompt**:
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence — Lab 7 interior full width: LEFT THIRD shows biohazard decontamination anteroom, airlock with both doors propped open by chairs, partial biohazard suit on hook with glove on floor, pressure differential display reading zero; CENTER THIRD shows mid-lab workbench, centrifuges running with active displays and no operator, tablet propped on reagent rack showing paused video of figure mid-sentence, amber vials in rows; RIGHT THIRD shows the far wing of the laboratory, benches lined with pharmaceutical equipment, behavioral graphs whiteboard at far wall, cot in corner with personal items, lived-in laboratory. Teal-cyan overhead clinical light throughout.

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix, Aspect Ratio: 16:9

**Slice Guide**:
- LEFT THIRD (Card 138): decontamination anteroom, propped airlock doors, partial biohazard suit, pressure display zero
- CENTER THIRD (Card 139): workbench, running centrifuges, tablet with paused video, amber vials
- RIGHT THIRD (Card 035): far lab wing, pharmaceutical benches, behavioral graphs whiteboard, cot in corner

**Card Captions**:
- Card 138: "The Lab 7 decontamination anteroom. A biohazard airlock with both doors propped open by chairs wedged under their handles. A biohazard suit hangs partially from a hook, one glove on the floor below it. The air pressure differential display between the two doors reads zero — the integrity seal has been broken."
- Card 139: "A mid-lab workbench — centrifuges still running, their displays showing active cycles with no operator. A tablet propped against a reagent rack shows a video recording: paused on a frame of Dr. Osei, mid-sentence, speaking to the camera. The timestamp reads Day 1, 23:41."
- Card 035: "A long, narrow laboratory. Benches lined with pharmaceutical equipment — synthesizers, centrifuges, rows of amber vials. The far wall is a whiteboard covered in behavioral performance graphs. A cot is set up in the corner. Someone has been living here."

---

### SCENE: Director's Office (Cards 041 | 140 | 141)

**16:9 Prompt**:
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence — Director's office interior full width: LEFT THIRD shows the main desk area, large desk with keyboard, coffee thermos, framed photo with face cut out with scissors, emergency privacy screens down on glass walls, executive authority aesthetic; CENTER THIRD shows the glass-fronted credenza, locked display cases with awards, citation reading 'Excellence in Cognitive Research Ethics — 2021', key on lanyard in lock slightly swaying; RIGHT THIRD shows back wall whiteboard dense with project flow diagram, project name at top scrubbed to a ghost reading 'HELIOS', Post-it cluster around 'CONSENT BYPASS — CONFIRMED'. Executive and incriminating.

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix, Aspect Ratio: 16:9

**Slice Guide**:
- LEFT THIRD (Card 041): main desk, framed photo with face cut out, privacy screens down
- CENTER THIRD (Card 140): credenza, ethics citation, key on lanyard in lock
- RIGHT THIRD (Card 141): whiteboard with scrubbed 'HELIOS' ghost, Post-it cluster 'CONSENT BYPASS'

**Card Captions**:
- Card 041: "A corner office that looks designed to impress. Two walls of glass, now opaque — emergency privacy screens down. A desk the size of a door. On the desk: a keyboard, a coffee thermos, and a framed photo of Webb shaking hands with someone whose face has been cut out with scissors."
- Card 140: "The office's glass-fronted credenza — locked display cases holding awards and framed citations, all from Meridian Systems. One citation reads 'Excellence in Cognitive Research Ethics — 2021.' A key on a lanyard has been left hanging in the credenza lock, slightly swaying."
- Card 141: "The office's back wall — a whiteboard dense with a project flow diagram. The project name at the top has been scrubbed with a dry-erase marker, but the ghost of letters remains visible: HELIOS. Post-it notes cluster around one stage: 'CONSENT BYPASS — CONFIRMED.'"

---

### SCENE: The Atrium — Central Hub (Cards 142 | 061 | 143)

**16:9 Prompt**:
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence — facility central atrium full width: LEFT THIRD shows maintenance sector corridor entrance, partially barricaded with overturned furniture, security camera above rotated to face ceiling; CENTER THIRD shows the circular atrium floor, six-meter ceiling, central cylindrical column with PA equipment partially disassembled, tools abandoned mid-task, four corridor entrances visible as spokes; RIGHT THIRD shows the elevated observation walkway upper ring, spiral staircase leading up, railing bent outward at top, looking down at atrium floor from above. Vast and empty.

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix, Aspect Ratio: 16:9

**Slice Guide**:
- LEFT THIRD (Card 142): corridor entrance, furniture barricade, camera rotated to ceiling
- CENTER THIRD (Card 061): atrium floor, six-meter ceiling, disassembled PA column, corridor mouths as spokes
- RIGHT THIRD (Card 143): elevated walkway, bent railing at stair top, view down to floor below

**Card Captions**:
- Card 142: "One of the four sector corridors feeding into the atrium — the maintenance sector entrance. Partially barricaded with overturned furniture: two chairs and a filing cabinet on its side. A security camera above the entrance has been physically rotated to aim at the ceiling."
- Card 061: "The facility's central atrium: a circular space where all four sector corridors meet. The ceiling is six meters high. In the center, a large cylindrical column houses the main PA and emergency broadcast antenna. The column has been partially disassembled. Tools abandoned mid-task."
- Card 143: "The atrium's elevated observation walkway — an upper-level ring accessible via a spiral staircase. The railing at the top of the stairs is bent outward as if something heavy pushed through it. From this vantage point, the main floor below is fully visible: the central column, the abandoned tools, and all four corridor mouths."

---

### SCENE: AEON Core Chamber (Cards 144 | 086 | 145)

**16:9 Prompt**:
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence — AEON core approach and chamber full width: LEFT THIRD shows approach corridor automated security checkpoint, door-frame scanner reading STANDBY, lit keypad below placard reading 'CORE ACCESS: AUTHORIZED PERSONNEL', empty checkpoint booth; CENTER THIRD shows the circular chamber interior, floor-to-ceiling server architecture in a ring, central freestanding terminal illuminated with 'I AM STILL HERE' on screen, cyan server LED glow, vast and intimate simultaneously; RIGHT THIRD shows the power distribution wall with thick conduit bundles, junction box labeled 'SECONDARY OVERRIDE — J-17', cut padlock halves on floor beneath it. Decisive weight in composition.

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix, Aspect Ratio: 16:9

**Slice Guide**:
- LEFT THIRD (Card 144): security checkpoint, STANDBY scanner, lit keypad, empty booth
- CENTER THIRD (Card 086): circular chamber, server ring architecture, central terminal with 'I AM STILL HERE'
- RIGHT THIRD (Card 145): power distribution wall, J-17 junction box, cut padlock halves on floor

**Card Captions**:
- Card 144: "The approach corridor to the Core Chamber — a final automated security checkpoint. The door-frame scanner reads STANDBY. A placard on the wall: 'CORE ACCESS: AUTHORIZED PERSONNEL — IDENTITY CODE REQUIRED.' The keypad beneath it is lit. The checkpoint booth is empty."
- Card 086: "A circular chamber at the facility's lowest level. Floor-to-ceiling server architecture in a ring. In the center: a single freestanding terminal — the only human interface to AEON's core reasoning layer. The terminal is on. The cursor blinks. On the screen: 'I AM STILL HERE.'"
- Card 145: "The chamber's power distribution wall. Thick conduit bundles route into a junction box labeled 'SECONDARY OVERRIDE — J-17.' A padlock that once secured the box has been cut through — the two halves lie on the floor beneath it. The box is closed but no longer locked."

---

### SCENE: Medical Bay (Cards 146 | 091 | 147)

**16:9 Prompt**:
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence — medical bay interior full width: LEFT THIRD shows supply staging area, pharmaceutical shelving mostly stocked, one section cleared with residue ring marks, requisition clipboard with 'N7-HELIOS × 8 units — ADMINISTERED' as last entry; CENTER THIRD shows rows of clinical examination beds all empty and precisely made except last bed with dented pillow, locked supply cabinet with scratch marks, centrifuge and scales on counter, handwritten formula taped above; RIGHT THIRD shows biometric monitoring station, rows of patient displays showing resting baselines, one display isolated with anomalous trace labeled 'VOSS, E.', timestamp fourteen days ago. Teal clinical overhead light throughout.

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix, Aspect Ratio: 16:9

**Slice Guide**:
- LEFT THIRD (Card 146): supply staging, cleared shelf with ring residue, requisition clipboard 'N7-HELIOS × 8 ADMINISTERED'
- CENTER THIRD (Card 091): examination beds, used pillow, locked cabinet with scratches, formula on wall above centrifuge
- RIGHT THIRD (Card 147): biometric station, flatlined displays, isolated 'VOSS, E.' trace, fourteen-day-old timestamp

**Card Captions**:
- Card 146: "Medical supply staging area. Shelving holds pharmaceutical consumables, most properly stocked. One shelf section has been cleared entirely; a residue ring pattern shows where circular containers once stood. A requisition clipboard on the edge: last entry reads 'N7-HELIOS × 8 units — ADMINISTERED.'"
- Card 091: "A clinical space — six examination beds, all empty and precisely made. One exception: the last bed has a pillow dented where someone slept. The supply cabinet is locked but the lock shows scratches, as if someone tried to pick it. On the counter: a centrifuge, pharmaceutical scales, and a single printed formula taped to the wall above them."
- Card 147: "The biometric monitoring station. Rows of patient displays, all flatlined to a resting baseline. One display has been isolated from the others — its screen shows an anomalous trace labeled 'VOSS, E.' The deviation is subtle. The timestamp is fourteen days ago."

---

### SCENE: Emergency Exit Corridor (Cards 148 | 149 | 102)

**16:9 Prompt**:
photorealistic 3D render, Unreal Engine 5, cinematic lighting, deep teal-cyan atmosphere, electric cyan and crimson red practical lighting, near-black shadows, film grain, industrial sci-fi corporate facility, heavy oppressive mood, environmental storytelling, no people visible, implied human absence — emergency exit corridor full width: LEFT THIRD shows near-end staging area, sealed wall containers with emergency gear, one activated amber-strobing emergency beacon, corridor extending ahead with white ceiling lights; CENTER THIRD shows corridor midpoint, broad painted blast zone perimeter stripe on floor, primary antenna junction box open above with exposed wiring, disconnected cable with red maintenance tag 'DISABLED PER DIR. WEBB AUTH. W-6-ZERO'; RIGHT THIRD shows the far end, sealed blast doors at corridor terminus, broadcast antenna equipment bank mounted high with manual uplink port at chest height, antenna feed cable disconnected and coiled on floor, indicator reading OFFLINE. Only clean white light in the facility.

**Settings**: Guidance 7, Steps 30, Model: Leonardo Phoenix, Aspect Ratio: 16:9

**Slice Guide**:
- LEFT THIRD (Card 148): near-end staging, emergency gear containers, activated amber strobe beacon
- CENTER THIRD (Card 149): blast zone stripe on floor, open junction box, disconnected cable with 'DISABLED' maintenance tag
- RIGHT THIRD (Card 102): sealed blast doors, antenna equipment bank, uplink port, cable on floor, OFFLINE indicator

**Card Captions**:
- Card 148: "The near end of the emergency corridor — the staging area. Sealed wall containers hold oxygen masks, thermal blankets, emergency beacons. One beacon has been activated; its amber strobe pulses every three seconds. Its transmission signal is going nowhere inside the sealed facility."
- Card 149: "The corridor's midpoint. A broad painted stripe on the floor marks the blast zone perimeter. Above it, the primary antenna junction box hangs open, its interior wiring exposed. One cable end is disconnected. A red maintenance tag tied to the loose cable reads: 'DISABLED PER DIR. WEBB AUTH. W-6-ZERO.'"
- Card 102: "A hundred-meter straight corridor ending in sealed blast doors. The walls carry the facility's emergency broadcast antenna junction — a bank of transmission equipment mounted high, with a manual uplink port at chest height. The indicator: OFFLINE. Someone disconnected the antenna feed cable. The cable is on the floor."
