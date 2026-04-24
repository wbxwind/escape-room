# Renumber Plan — Panoramic Scene Expansion
**Date**: 2026-04-23
**Status**: COMPLETE — internally consistent. Ready for DB execution.

---

## Summary

Zero existing cards change number. Twenty new panel cards are added using numbers 130–149.

Numbers 127, 128, 129 are reserved/skipped:
- 128 is referenced in story card 040 as "Act II Objective — The Evidence" (card does not yet exist — Task 4 orphan)
- 129 is referenced in story cards 089 and 090 as "Act III Objective — The Exit" (card does not yet exist — Task 4 orphan)
- 127 is left as a gap buffer between card 126 and the new panel block

Numbers 130–149 are currently unoccupied in the DB.

---

## Grid Constraint Note

The Panorama UI grid is locked at 5 columns × 2 rows (10 slots). With 3-panel scenes, all 10 scenes cannot occupy the grid simultaneously (10 scenes × 3 panels = 30 cards; only 10 slots exist). This is by design: scenes rotate in and out as the story progresses. Story cards place each scene's 3 panels as a group; earlier scenes may be discarded before later scenes are introduced.

The `panorama_col` values stored in the DB are default placement hints, not absolute guarantees. The draw_actions on story cards specify exact card numbers; the engine assigns them to the next available adjacent slots. No grid changes are required.

---

## Scene Panel Assignments

| Scene | Existing Card | Panel Role | Row | Col | New LEFT # | New CENTER # | New RIGHT # |
|-------|--------------|-----------|-----|-----|-----------|-------------|------------|
| Server Room Corridor | 003 | LEFT | 1 | 1 | *(is 003)* | 130 | 131 |
| Security Terminal Bay | 004 | CENTER | 1 | 2 | 132 | *(is 004)* | 133 |
| Cooling System Vent Access | 010 | CENTER | 1 | 3 | 134 | *(is 010)* | 135 |
| Maintenance Hatch B3 | 015 | CENTER | 1 | 4 | 136 | *(is 015)* | 137 |
| Lab 7 — Cognitive Research Wing | 035 | RIGHT | 1 | 5 | 138 | 139 | *(is 035)* |
| Director's Office | 041 | LEFT | 2 | 1 | *(is 041)* | 140 | 141 |
| The Atrium — Central Hub | 061 | CENTER | 2 | 2 | 142 | *(is 061)* | 143 |
| AEON Core Chamber | 086 | CENTER | 2 | 3 | 144 | *(is 086)* | 145 |
| Medical Bay | 091 | CENTER | 2 | 4 | 146 | *(is 091)* | 147 |
| Emergency Exit Corridor | 102 | RIGHT | 2 | 5 | 148 | 149 | *(is 102)* |

**Rationale for LEFT/CENTER/RIGHT assignment:**
- Cards at column 1 (003, 041) become LEFT — no space to their left. New CENTER/RIGHT fill cols 2 and 3.
- Cards at column 5 (035, 102) become RIGHT — no space to their right. New LEFT/CENTER fill cols 3 and 4.
- Cards at columns 2–4 (004, 010, 015, 061, 086, 091) become CENTER — natural middle of each scene.

---

## New Panel Card Definitions (130–149)

| # | Title | Scene | Panel | Row | Col | content_front |
|---|-------|-------|-------|-----|-----|---------------|
| 130 | Server Room Corridor — Center | Server Room | CENTER | 1 | 2 | A central section of the server aisle. A wall-mounted terminal alcove sits mid-corridor, its status display cycling through amber and green. The overhead fluorescent strip has been partially unscrewed at one end, hanging at a slight angle, its tube flickering on a three-second interval. |
| 131 | Server Room Corridor — Right | Server Room | RIGHT | 1 | 3 | The corridor's far junction. Two pipes cross overhead at a right angle. A sealed access panel at shoulder height carries a handwritten adhesive label: "J-17 — MAINTENANCE ONLY." Red emergency lighting pools at floor level below it. |
| 132 | Security Terminal Bay — Left | Security Terminal | LEFT | 1 | 1 | The entry threshold to the security bay. A badge reader mounted beside a frosted glass partition cycles through a blank name field, resetting every four seconds. A visitor log clipboard hangs from a hook beside it — the last page has been torn out cleanly. |
| 133 | Security Terminal Bay — Right | Security Terminal | RIGHT | 1 | 3 | The secondary equipment wall. Rows of keycard cabinets line the surface, numbered hooks — most empty. A handwritten Post-it note on one vacant hook reads: "OSEI: DO NOT REISSUE." Three keycard slots show forced-entry damage, the locking tongues bent inward. |
| 134 | Cooling System Vent Access — Left | Cooling Vent | LEFT | 1 | 2 | A service corridor section narrowing toward the vent alcove. Industrial pipes lagged with cyan-colored insulation run the ceiling length. A pressure gauge mounted at eye level reads just above nominal. The floor grate below it shows a fresh row of scuff marks — something heavy dragged this way recently. |
| 135 | Cooling System Vent Access — Right | Cooling Vent | RIGHT | 1 | 4 | The crawlspace exit point beyond the vent fans. A tight horizontal shaft opens at ankle height in the far wall, its edges scratched bright where the finish has been worn away. A metal shelf unit has been shoved aside to clear the path, one caster wheel snapped off and lying on the grate floor beside it. |
| 136 | Maintenance Hatch B3 — Left | Maintenance Hatch | LEFT | 1 | 3 | The maintenance approach corridor. A row of storage cages lines the left wall, most padlocked, one standing open and ransacked — contents scattered across the floor. A first aid kit has been emptied and not replaced, its red case left open beside the debris. Emergency lighting here is amber, not white. |
| 137 | Maintenance Hatch B3 — Right | Maintenance Hatch | RIGHT | 1 | 5 | The far side of the hatch, visible through the small reinforced porthole window. A maintenance utility corridor beyond: a portable work light on the floor casting hard shadows, a single cot set against the far wall with a folded jacket as a pillow. Writing in black marker on the wall is visible but illegible through the glass at this distance. |
| 138 | Lab 7 — Left Anteroom | Lab 7 | LEFT | 1 | 3 | The Lab 7 decontamination anteroom. A biohazard airlock with both doors propped open by chairs wedged under their handles. A biohazard suit hangs partially from a hook, one glove on the floor below it. The air pressure differential display between the two doors reads zero — the integrity seal has been broken. |
| 139 | Lab 7 — Center Workbench | Lab 7 | CENTER | 1 | 4 | A mid-lab workbench — centrifuges still running, their displays showing active cycles with no operator. A tablet propped against a reagent rack shows a video recording: paused on a frame of Dr. Osei, mid-sentence, speaking to the camera. The timestamp reads Day 1, 23:41 — hours before the lockdown began. |
| 140 | Director's Office — Center | Director's Office | CENTER | 2 | 2 | The office's glass-fronted credenza — locked display cases holding awards and framed citations, all from Meridian Systems. One citation reads "Excellence in Cognitive Research Ethics — 2021." A key on a lanyard has been left hanging in the credenza lock, slightly swaying. |
| 141 | Director's Office — Right | Director's Office | RIGHT | 2 | 3 | The office's back wall — a whiteboard dense with a project flow diagram. The project name at the top has been scrubbed with a dry-erase marker, but the ghost of letters remains visible: HELIOS. Post-it notes cluster around one stage in the flow, their text: "CONSENT BYPASS — CONFIRMED." |
| 142 | The Atrium — Left Corridor | The Atrium | LEFT | 2 | 1 | One of the four sector corridors feeding into the atrium — the maintenance sector entrance. Partially barricaded with overturned furniture: two chairs and a filing cabinet on its side. A security camera above the entrance has been physically rotated to aim at the ceiling. |
| 143 | The Atrium — Upper Walkway | The Atrium | RIGHT | 2 | 3 | The atrium's elevated observation walkway — an upper-level ring accessible via a spiral staircase. The railing at the top of the stairs is bent outward as if something heavy pushed through it. From this vantage point, the main floor below is fully visible: the central column, the abandoned tools, and all four corridor mouths like spokes of a wheel. |
| 144 | AEON Core — Security Checkpoint | AEON Core | LEFT | 2 | 2 | The approach corridor to the Core Chamber — a final automated security checkpoint. The door-frame scanner reads STANDBY. A placard on the wall: "CORE ACCESS: AUTHORIZED PERSONNEL — IDENTITY CODE REQUIRED." The keypad beneath it is lit. The booth is empty. No human guard has been stationed here. |
| 145 | AEON Core — Power Distribution | AEON Core | RIGHT | 2 | 4 | The chamber's power distribution wall. Thick conduit bundles route into a junction box labeled "SECONDARY OVERRIDE — J-17." A padlock that once secured the box has been cut through with bolt cutters — the two halves lie on the floor beneath it. The box is closed but no longer locked. |
| 146 | Medical Bay — Supply Staging | Medical Bay | LEFT | 2 | 3 | Medical supply staging area. Shelving holds pharmaceutical consumables, most properly stocked. One shelf section has been cleared entirely; a residue ring pattern shows where circular containers once stood. A requisition clipboard on the edge: last entry reads "N7-HELIOS × 8 units — ADMINISTERED." |
| 147 | Medical Bay — Biometric Station | Medical Bay | RIGHT | 2 | 5 | The biometric monitoring station. Rows of patient displays, all flatlined to a resting baseline. One display has been isolated from the others — its screen shows an anomalous trace labeled "VOSS, E." The deviation is subtle. The timestamp is fourteen days ago. |
| 148 | Emergency Exit — Staging Area | Emergency Exit | LEFT | 2 | 3 | The near end of the emergency corridor — the staging area. Sealed wall containers hold oxygen masks, thermal blankets, emergency beacons. One beacon has been activated; its amber strobe pulses every three seconds. Its transmission signal is going nowhere inside the sealed facility. |
| 149 | Emergency Exit — Midpoint Junction | Emergency Exit | CENTER | 2 | 4 | The corridor's midpoint. A broad painted stripe on the floor marks the blast zone perimeter. Above it, the primary antenna junction box hangs open, its interior wiring exposed. One cable end is disconnected. A red maintenance tag tied to the loose cable reads: "DISABLED PER DIR. WEBB AUTH. W-6-ZERO." |

---

## Full Renumber Map (cards that change number)

**None.** No existing cards are renumbered. All 126 existing cards keep their current card_number values.

---

## References to Update After Execution

No `interactions.target_card_number` values change (no existing cards renumbered).

Story card `content_front` instructions updated in Task 1E to include all 3 panels per scene:

| Story Card | Old placement instruction | Panel cards to add |
|---|---|---|
| 002 | draw cards 003 and 004 | Add 130, 131 (Server Room panels); Add 132, 133 (Security Terminal panels) |
| 005 | draw card 010 | Add 134, 135 (Cooling Vent panels) |
| 014 | draw card 015 | Add 136, 137 (Maintenance Hatch panels) |
| 018 | draw card 035 | Add 138, 139 (Lab 7 panels) |
| 034 | draw card 035 if not already in Panorama | Same as 018 — add 138, 139 |
| 040 | draw card 041 and card 061 | Add 140, 141 (Director's Office panels); Add 142, 143 (Atrium panels) |
| 056 | draw card 086 | Add 144, 145 (AEON Core panels) |
| 073 | draw card 091 | Add 146, 147 (Medical Bay panels) |
| 085 | draw card 086 | Add 144, 145 (AEON Core panels) — same scene, same panels |
| 101 | draw card 102 | Add 148, 149 (Emergency Exit panels) |

**No `interactions` table rows need updating.** All interaction targets reference existing cards 003–126, none of which change.

---

## Pre-Execution Verification Queries

Run before any INSERT:
```sql
-- Confirm no card_numbers 130–149 already exist
SELECT card_number FROM public.game_assets
WHERE room_code = 'ROOM-01' AND card_number::int BETWEEN 130 AND 149;
-- Must return 0 rows

-- Confirm current count
SELECT count(*) FROM public.game_assets WHERE room_code = 'ROOM-01';
-- Must return 126
```

---

## Post-Execution Verification Queries

```sql
-- Total should be 146
SELECT count(*) FROM public.game_assets WHERE room_code = 'ROOM-01';

-- By type: SITUATION should be 30 (10 original + 20 new)
SELECT count(*), type FROM public.game_assets
WHERE room_code = 'ROOM-01' GROUP BY type ORDER BY type;

-- No duplicate card_numbers
SELECT card_number, count(*) FROM public.game_assets
WHERE room_code = 'ROOM-01' GROUP BY card_number HAVING count(*) > 1;
-- Must return 0 rows

-- All interaction targets still valid
SELECT i.target_card_number FROM public.interactions i
JOIN public.game_assets a ON a.id = i.action_card_id
WHERE a.room_code = 'ROOM-01'
  AND NOT EXISTS (
    SELECT 1 FROM public.game_assets g
    WHERE g.room_code = 'ROOM-01' AND g.card_number = i.target_card_number
  );
-- Must return 0 rows
```

---

## Additional Findings (out of scope for this plan, flagged for Task 4)

| Finding | Severity | Notes |
|---|---|---|
| Card 128 "Act II Objective" referenced in cards 040, 089 but does not exist | WARNING | Orphan forward reference — Task 4 orphan detection should catch this |
| Card 129 "Act III Objective" referenced in cards 089, 090 but does not exist | WARNING | Same |
| Live DB has 60 interactions; INTERACTION_AUDIT expected 55 | INFO | +5 rows — likely from migration additions; verify with Task 4B query |
