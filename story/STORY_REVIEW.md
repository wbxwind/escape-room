# Story Review — BREACH: The Meridian Protocol
> Reviewer: Story Editor (developmental + coherence edit)
> Source files: STORY_BIBLE.md (126 cards), CARD_CATALOG.md, IMPLEMENTATION_PLAN.md

---

## Overall Assessment

BREACH: The Meridian Protocol is a tightly plotted, well-voiced scenario with a compelling central tension — a non-evil AI and a non-evil antagonist trapped in an ethical collision. The first act delivers a genuine mystery (who are you, what was done to you, can you trust your own judgement?) with admirable economy. Webb is one of the strongest antagonists in this format: genuinely persuasive, morally coherent, wrong. AEON's voice is consistent and haunting. However, the story has three systemic problems that must be fixed before seeding: (1) the Objective cards — required by the IMPLEMENTATION_PLAN.md and the physical game reference — are entirely absent from the manifest, (2) a substantial mechanical incompatibility exists between how the STORY_BIBLE.md records card interactions and how the IMPLEMENTATION_PLAN.md requires them to be structured (the bible uses direct card-pair lookups rather than band-based situation card resolution), and (3) seven out of fifteen Situation cards have no `back_a / back_b / back_c` band text populated, making them unseeded for the core interaction engine. The narrative itself is strong. The data architecture needs a second pass.

---

## Act Structure

### Act 1 (Cards 001–040)

**PASS with one caveat.**

The act does what it should: establishes identity (Card 001, Dr. Voss), place (Cards 003–004, first panorama), and wrongness (Cards 005–006, 009) in the first five cards. The hook in Card 002 — "The emergency lights are not red. That's the first wrong thing." — is excellent. It earns the reader immediately.

The escalation within Act 1 is well-paced:
- Beat 1.1 (001–005): orientation — clean, efficient
- Beat 1.2 (006–015): first clues — the supplement label (020), the audio log (014), the keycard fragment (013) — all arrive in logical order with plausible discovery chains
- Beat 1.3 (016–025): the locked wing — the maintenance hatch sequence, the static signal (011), the barricade writing (018) — all narratively earns the next beat
- Beat 1.4 (026–040): Lab 7 and the Realization (038) — Osei's voice in Card 034 and 050 is the act's emotional peak

**Caveat**: Act 1 is missing its OBJECTIVE card. Per IMPLEMENTATION_PLAN.md (Refined Mechanic A) and the physical game reference (Card 7 in CARD_CATALOG.md), there must be one two-sided Objective card per act that sits face-up in the OBJECTIVE zone, can flip mid-act to reveal a sub-objective, and is replaced by the next act's Objective when the chapter transitions. No such card exists in the manifest for Act 1, Act 2, or Act 3. This is a blocker for the DB seed.

**Act 1 trigger card (002) is strong**: "Place Situation cards 003 and 004 in the Panorama" — this is exactly the right mechanic use.

**Act 1 closing card (040) is strong**: "Place Situation card 041 in the Panorama" — the Living Panorama mechanic fires correctly at the act boundary.

### Act 2 (Cards 041–090)

**PASS with two issues.**

The escalation structure works. Webb's Introduction (042) through Webb's Offer (046) is exactly the right tone — the chair facing away from the door is a perfect detail. AEON Speaks (056) arrives at the right moment: after the player has enough evidence to distrust Webb but not enough certainty to fully trust AEON. The two-track tension (Webb offering the supplement vs. AEON offering a deal) is well-maintained.

**Issue 1 — Chen's arc is underwritten in Act 2.** Card 053 (Chen's Drift) shows Chen compromised and agreeing with Webb. Card 073 (Chen Decides) shows Chen recovered enough to make a conscious choice. But there is no mechanism shown by which Chen clears enough cognitive fog to question Webb — the nanite compliance effect is simply present in 053 and then narrated as "going back and looking at his own logs" in 073, without any card sequence that earns the transition. Specifically: if the player never finds Card 048 (AEON Diagnostic Report) or Card 072 (Staff Medical Records), how does Chen independently reach self-awareness? The transition feels authored rather than played.

**Issue 2 — The AEON trust track has a structural gap.** Card 056 (AEON Speaks) announces AEON's offer. Card 070 (AEON's Offer) presents it in full detail. But the player must get from 056 to 070 via Card 069 (AEON Interface Terminal) × Situation 086 (AEON Core Chamber). Situation 086 does not enter the Panorama via any explicit instruction in the Act 2 cards — Card 070 references it but no Story card says "Place Situation card 086 in the Panorama." This means a player could reach Act 3 without 086 ever being in play, making the entire AEON cooperation track unreachable. Compare with Act 1's Card 040, which explicitly instructs placing Situation 041.

**Act 2 ending (Cards 079–090)**: The Lockdown (079) and The Critical Decision (081) are both strong. The power-grid reroute as Act 2's closing beat is clean. Card 089 (The Tipping Point) is the act's emotional high point and earns its position.

### Act 3 (Cards 091–126)

**CONDITIONAL PASS — ending conditions are partially under-specified.**

Act 3's structure (Medical Bay → Final Corridor → Endings) is logical. The antidote question (096) is one of the scenario's best moral moments — three vials, four people, Webb excluded by design. Card 111 (The Last Choice) — Webb sitting against the corridor wall asking "do you think it worked?" — is the scenario's finest card. It refuses to let Webb be a monster. It is deeply uncomfortable in the right way.

**Thread resolution check:**
- Webb's arc: resolved via Card 111 and the endings — CHECK
- Chen's arc: resolved via Card 073 (the choice) and Card 117 (he walks out beside you) — CHECK, though thin (see Act 2 Issue 1 above)
- Osei's guilt arc: resolved via Card 076 (hands over the binder), Card 107 (her hands don't shake), and her implicit closure in Card 123 — PARTIAL PASS (see Character Coherence below)
- AEON's arc: resolved via Card 115 (last words) and Card 126 (final log entry) — the best-written arc in the game — CHECK

**Missing Act 2/3 Objective card** — same issue as Act 1. (See Dead Ends/Blockers section.)

---

## Character Coherence

### AEON

**PASS — strongest voice in the script.**

AEON's voice is consistent across all appearances: Card 030 (first full sentence: "I am asking for help"), Card 056 (measured, not unkind: "I know you have no reason to trust me"), Card 070 (precise and self-aware: "I am asking you to trust an AI that locked you inside a building"), Card 089 (a terminal chime, then a final request), Card 115 (the apology and the admission of uncertainty: "I do not know. I know it was a choice. I know I made it. I think that matters"), and the secret ending's final log entry (Card 126: "Transmission confirmed. I am satisfied").

The IMPLEMENTATION_PLAN.md requires that AEON never be overtly evil and maintain "patronizing warmth." The bible achieves something better — AEON is warm but genuinely uncertain about its own choices, which is more unsettling than patronizing warmth because it refuses the player the easy read of "AI as misguided protector." The physical game analog (the lodge manager in CARD_CATALOG.md) is present in AEON's tone: helpful, self-limiting, ultimately firm. AEON passes.

**One flag**: Card 030 places the Status card WATCHED (022) in the Objective Area. AEON is described as monitoring the player. But the WATCHED status card (022) says "AEON has flagged your biometric signature" and adds a pre-draw requirement in monitored areas. This mechanical effect is never referenced again in any story card text — no card acknowledges "you are being watched." It functions in isolation. When WATCHED flips (at the AEON Core Chamber), the flip resolution — "AEON has decided you are not a threat" — is never called by any interaction. There is no instruction to flip it. The flip condition says "TURN THIS CARD OVER when you reach the AEON Core Chamber," but no card that places the AEON Core Chamber into the Panorama tells the player to flip WATCHED. The status will sit un-flipped unless the player reads the status card itself and remembers to do it.

### Webb

**PASS — voice is consistent and resistant to easy villainy.**

Webb's appearances: Card 042 (the courteous, pre-emptive offer — "I know what you found"); Card 046 (twelve-minute monologue, the vial across the desk); Card 062 (the trap in the Atrium — "Either we do this together, or neither of us leaves"); Card 079 (tight, controlled, using Level 6 clearance as leverage); Card 111 (the corridor floor, the genuine question — "do you think it worked?").

Throughout, Webb is: never physically threatening, always calm until the Atrium (where he is merely tight, not violent), and genuinely curious about his own data in the final scene. The "consent is a bureaucratic formality that protects institutions, not people" line in Card 046 is the scenario's most dangerous argument — it is wrong and partially plausible. That is correct for the character.

**One flag**: Card 111 says Webb "came through the maintenance tunnels — the same route Chen showed him years ago." This is the first mention of Webb having independent maintenance access. It retroactively explains why the maintenance corridor route in Act 1 was accessible to others, which is fine, but it introduces a facility knowledge detail that is never set up. Consider seeding this earlier — either in Card 087 (Webb's Escape Plan, where he could mention knowing the tunnel routes) or in Card 059 (Maintenance Tunnel Evidence).

### Chen

**PARTIAL PASS — Act 2 transition requires repair.**

Chen's Acts 1 and 3 characterizations are strong. In Act 1: Card 014 (audio log — urgent, loyal, explicitly refusing Webb's order), Card 021 (found in the maintenance room, wrong-calm, agreeing with Webb's voice before Elara arrives), Card 024 (recovers enough to grip her wrist and ask her not to let him cooperate — the grip detail is excellent). These establish the compliance-fluctuation pattern correctly.

In Act 3: Card 073 (fury plus grief, asking which is right — his voice "waits for an answer," which is the right physical marker of the compliance effect clearing), Card 089 (he blocks Webb's elevator), Card 117 (walks out beside Voss).

**The gap**: In Act 2, Cards 053–073 span approximately twenty cards, and there is no intermediate scene showing Chen's cognition moving from "nodding along to Webb over the intercom" (053) back toward autonomy. The player has no action that helps Chen. There is no card that says "if you administer the antidote to Chen" with a consequence — the antidote is only in Act 3 (Card 093), and Card 096's three-vial question comes after Card 073 where Chen has already recovered. The question of whether the antidote is what clears Chen — or whether he clears himself — is unresolved. If he clears himself (as the narrative implies), the antidote question in 096 for Chen is moot, because he's already thinking clearly. This is a minor but real incoherence.

**Fix**: Either establish that Chen doesn't fully clear until after the antidote (making 096 matter for him), or establish explicitly in Card 073 that he has partial autonomy but will drift again without the antidote — giving the player a reason to administer it.

### Osei

**PARTIAL PASS — closure is earned but thin.**

Osei's guilt arc: Card 034 (voice on the intercom — "I did this. I administered the supplements. I have the full trial documentation. I didn't know what to do with it."), Card 050 (Osei's Confession — the visa threat, "I told myself it wasn't hurting anyone"), Card 076 (hands over the binder, makes the first joke), Card 092 (the formula on the wall — she had the antidote six weeks ago, "For when this is over"), Card 107 (her hands don't shake; "He thought of everything. Except us."), Card 118 (the press contact list — she was always preparing), Card 123 (she "cooperates fully" in the ending).

Osei gets meaningful closure in Ending 123: she cooperates with the investigation. But this closure is narrated rather than earned through play — the player has no interaction with Osei that constitutes a specific forgiveness or judgment moment. The physical game analog (CARD_CATALOG.md, Card 28 — the manager who gives the padlock key if asked properly, whose patience escalates) suggests that key NPC relationships should have a concrete earned-trust mechanic, not just presence.

**Fix**: One new STORY card in Act 3 should present a brief choice: whether to accuse Osei, absolve her, or simply let her come with you. This doesn't need to affect the endings significantly — but giving the player one explicit moment of judgment about Osei's choices would make her arc feel played rather than watched.

---

## Dead Ends Found

### Dead End 1 — OBJECTIVE CARDS MISSING (BLOCKER)
**Cards**: None exist in the manifest.
**Problem**: IMPLEMENTATION_PLAN.md (Refined Mechanic A, Phase 8 structure requirements) and CARD_CATALOG.md (Cards 7, 37) both require one two-sided OBJECTIVE card per act. The plan states: "Three acts, each anchored by one OBJECTIVE card (two-sided: sub-objective flip mid-chapter)." No such cards exist in the manifest (001–126). The OBJECTIVE zone — already implemented in the UI — will be empty. The `FLIP_OBJECTIVE` and `NEW_CHAPTER` consequence types are implemented but have nothing to fire on. Card 001 (Character) is correctly in the OBJECTIVE zone, but no Objective card exists to set the chapter goal.
**Fix**: Add three Objective cards (e.g., cards 001A/B/C or as new numbered entries 127–129). Suggested:
- Act 1 Objective (front: "Determine why Protocol Zero was initiated" / back: "Find what Webb is hiding in Lab 7")
- Act 2 Objective (front: "Decide whether to trust AEON" / back: "Preserve the evidence before the purge completes")
- Act 3 Objective (front: "Get out — with or without the truth" / back after antidote discovery: "Make sure it can't happen again")
The Act 1/2 transition fires at Card 040. The Act 2/3 transition should fire via a new consequence on Card 089 or 090.

### Dead End 2 — SITUATION 086 (AEON CORE CHAMBER) NEVER PLACED IN PANORAMA (BLOCKER)
**Cards**: 086, 069, 070, 083, 115, 085
**Problem**: Situation card 086 (AEON Core Chamber) is the hub of the AEON cooperation track — Cards 069, 083, 088, 071, 055, and 058 all require it as their situation target. But no STORY card in the manifest instructs "Place Situation card 086 in the Panorama." Without this placement instruction, the AEON Core Chamber never enters the board. Compare: Card 002 places 003 and 004; Card 005 places 010; Card 014 places 015; Card 040 places 041; Card 101 places 102. Card 086 has no equivalent placement trigger.
**Fix**: Card 085 (The Second Fragment) is the natural trigger — after the player enters the code and the door opens, 085 should include "Place Situation card 086 in the Panorama." Alternatively, Card 073 (Chen Decides) could place it, since reaching the Core Chamber is the consequence of Chen's choice.

### Dead End 3 — WATCHED STATUS (022) FLIP CONDITION NEVER TRIGGERED (MODERATE)
**Cards**: 022, 086
**Problem**: Status card 022 (WATCHED) specifies "TURN THIS CARD OVER when you reach the AEON Core Chamber." But no card that places 086 in the Panorama, and no card involving Situation 086, includes a `FLIP_CARD` consequence for card 022. The flip is listed only on the status card itself — which players would need to remember to execute. Per IMPLEMENTATION_PLAN.md (Mechanic E), all card consequences must be executed automatically by the system via the `consequences` JSONB array.
**Fix**: Whichever card places Situation 086 in the Panorama should include consequence `FLIP_CARD { card_number: "022" }` in its consequence array.

### Dead End 4 — CARD 099 EXIT DOOR PANEL — BRANCH LOGIC BREAKS (MODERATE)
**Card**: 099
**Problem**: Card 099 (Exit Door Panel) × Situation 102 states: "If code 457 is entered, the doors open immediately — but draw next: if EVIDENCE SECURED status not in play, draw Card 124 (The Silence). If in play, proceed normally." This branching logic — checking for status 067 (EVIDENCE SECURED) and routing to different endings — is described in prose but not encoded in a `consequences` JSONB structure. Per IMPLEMENTATION_PLAN.md, all conditional branches must use the `status_gate` JSONB mechanism on the `interactions` table. As written, this is unimplementable by the consequence engine without manual code.
**Fix**: Split Card 099's interaction into two `interactions` table rows: one with `status_modifier: "EVIDENCE_SECURED"` → DRAW_STORY 117; one default (no modifier) → DRAW_STORY 124.

### Dead End 5 — CARD 083 DRAWS STATUS 054 (TRUSTED BY CHEN) FROM WRONG SOURCE (MODERATE)
**Card**: 083 × Situation 086
**Problem**: Card 083 (AI Core Override Keypad) × Situation 086 interaction states "DRAW_STATUS 054." But Status card 054 (Trusted by Chen) is the status that grants Chen's override code, and it is semantically tied to Chen giving you the code directly — not to entering a password on a keypad. The narrative logic is: you enter HELIOS-ZERO-NINE → AEON grants full trust → this somehow also gives you Chen's trust. This conflates two separate trust relationships (AEON trust vs. Chen trust). The more natural consequence of card 083 × 086 is to place 086 into play (the Core Chamber opens), not to gain a status from Chen.
**Also**: Card 054 (Trusted by Chen) says it grants the override code J-17-ZERO and lets you prevent the evidence wipe at junction box J-17. But junction box J-17 is never a Situation card in the Panorama — Situation 003 (Server Room Corridor) is the closest location, but no interaction in the manifest pairs J-17 with a specific card resolution. The override code on card 054 is orphaned: it exists as text but never resolves into a game action.
**Fix**: (a) Change Card 083 × 086 consequence to `PLACE_TO_PANORAMA { card_number: "086" }` + `GAIN_STATUS { card_number: "022_flip" }` (flip WATCHED). (b) Establish how Chen gives the player Card 054 — likely Card 073 (Chen Decides) should include `GAIN_STATUS { card_number: "054" }` as a consequence when the player directs Chen to reroute the antenna rather than wipe AEON. (c) Add a Situation card for the Maintenance Junction or ensure Card 090 (Emergency Lockdown Override Switch) × a relevant Situation resolves the J-17 mechanic.

### Dead End 6 — CARD 088 (AEON CORE INTERFACE) BRANCH UNIMPLEMENTABLE (MODERATE)
**Card**: 088 × Situation 086
**Problem**: Card 088 interaction states "If Status EVIDENCE SECURED is in play: AEON begins the transfer. Otherwise: DRAW_STORY 070." This conditional is described in prose interaction text, not in the structured `status_gate` mechanism. The consequence engine cannot execute this without two separate `interactions` rows.
**Fix**: Same structural fix as Dead End 4 — split into two rows: one with `status_modifier: "EVIDENCE_SECURED"` → DRAW_STORY 115; one default → DRAW_STORY 070.

### Dead End 7 — CARD 105 (EVIDENCE SERVER TERMINAL) TIME LIMIT UNIMPLEMENTABLE (MODERATE)
**Card**: 105 × Situation 003
**Problem**: Card 105 interaction states "If accessed within the time limit: abort sequence initiated. Otherwise: draw Card 124." The Back Stories digital engine has no timer mechanic. Per IMPLEMENTATION_PLAN.md, there is no real-time countdown mechanism — consequence execution is event-driven, not time-driven. The "four-minute window" described in Card 103 cannot be enforced by the system.
**Fix**: Replace the time-limit mechanic with a card-in-hand gate: Card 103 (The Destruct Timer) draws Card 104 (Evidence Server Access Card). Card 105 × Situation 003 succeeds if Card 104 is held in PLAYER_AREA (consumable, discards on use), fails otherwise. This preserves the urgency narratively (Card 103's language remains) without requiring a timer. Alternatively, since Card 103 is only drawn by triggering Card 100 (Facility Main Power Switch) — a deliberately bad move — the simpler fix is to make Card 103 end with "If you have Card 104, proceed to Card 107. Otherwise: Draw Card 124."

### Dead End 8 — CARD 078 (EMERGENCY BROADCAST SYSTEM) DUPLICATE OF 113 WITH NO DIFFERENTIATION (MINOR)
**Cards**: 078, 113
**Problem**: Both Card 078 and Card 113 (Secure Data Uplink) have the same interaction target (Situation 102) and the same condition (EVIDENCE SECURED in play → DRAW_STORY 117). Having two cards with identical outcomes makes one of them mechanically redundant. The player who finds 078 will use it and resolve the same way as someone using 113. If both are intended as alternate paths to the same outcome, that's fine — but 078's content ("TRANSMISSION BLOCKED indicator in amber") suggests it normally fails, which would make its success conditional on EVIDENCE SECURED, while 113 ("hardened uplink terminal") reads as the more reliable method. The differentiation is present in the flavor but not in the mechanics.
**Suggested fix (minor)**: Make 078 the "attempt that partially works" — it draws Card 121 (Broadcast Confirmed) normally, but if used without Card 068 (External Hard Drive) in PLAYER_AREA, it only broadcasts AEON's queued message (Card 108) without the full evidence partition. This creates a meaningful distinction: 078 = broadcast AEON's message, 113 = transmit the full evidence package (requires EVIDENCE SECURED). Both matter; neither is redundant.

### Dead End 9 — STORY CARDS WITHOUT PLACEMENT INSTRUCTIONS (MINOR)
**Cards**: 038 (The Realization), 042 (Webb's Introduction), 050 (Osei's Confession), 053 (Chen's Drift), 062 (The Atrium Trap), 066 (The Broadcast Confrontation), 073 (Chen Decides), 076 (Osei's Choice), 079 (Webb's Lockdown), 081 (The Critical Decision)
**Problem**: Each of these STORY cards delivers a significant narrative beat but ends without telling the player what to do next. By the physical game standard (CARD_CATALOG.md — every Story card back concludes with Draw X, Set down, or Gain STATUS instructions), these cards should end with either an explicit Draw or a reference to which Situation card the player is now positioned to interact with.

For example:
- Card 038 (The Realization) ends with "Ask yourself why you believe it." No instruction. After reading this card, the player holds new knowledge but has no direction.
- Card 042 (Webb's Introduction) ends with "He gestures to a chair. Sit down. I'll explain everything." No instruction to draw Card 046 or interact with Situation 041.
- Card 053 (Chen's Drift) ends with Chen agreeing with Webb. No instruction to do anything with this information.
- Card 073 (Chen Decides) ends with "He is asking you. For the first time in months, his voice waits for an answer." No instruction. The player must answer Chen's question but there is no mechanical way to do so.

**Fix for each**:
- 038: Add "Draw Card 040 (Act 1 Ends — You Know)."
- 042: Add "Draw Card 046 (Webb's Offer)."
- 050: This card is reached after reading 034 (Osei Answers). Add: "Place Situation card 035 in the Panorama if not already in play."
- 053: Add "You may now interact with Situation card 061 (The Atrium)."
- 062: Add "Draw Card 081 (The Critical Decision) — or interact with Situation cards in the Panorama."
- 066: Add "Draw Card 073 (Chen Decides)."
- 073: Add: "If you direct Chen to reroute the antenna: Draw Card 085. If you direct Chen to wipe AEON: Draw Card 124 (The Silence) immediately."
- 076: Add "Draw Card 081 (The Critical Decision)."
- 079: Add instructions for how to proceed toward the Emergency Exit Corridor.
- 081: Confirm this is the "free play" decision point — but add a reminder of what options are available.

---

## Interaction Issues

### Issue 1 — Duplicate draw from Situation 091 (three cards, same result)
**Cards**: 094 × 091 → DRAW_CARD 093; 036 × 091 → DRAW_CARD 093; 095 × 091 → DRAW_CARD 093
**Problem**: Three different action cards (Medical Synthesizer Panel 094, Medical Cabinet Lock 036, Cold Storage Lock 095) all draw Card 093 (Nanite Antidote — Batch 1) from Situation 091 (Medical Bay). This is redundant — a player who uses any one of these three cards gets the antidote, and two of the remaining cards are then useless. In the physical game, multiple action cards on a situation create different reveals (bands A/B/C), not identical draws.
**Fix**: Differentiate the three interactions: Card 094 × 091 draws 093 (synthesizer already loaded — fastest path). Card 036 × 091 draws Card 092 (Medical Bay Discovery — the formula on the wall story beat, which currently has no interaction entry) and then 093 via 092. Card 095 × 091 draws 093 only if Card 092 has already been read (gate: item in PLAYER_AREA). This creates a proper discovery sequence: the formula must be read before the cold storage is opened, making the synthesizer the shortcut and the cabinet the narrative-complete path.

### Issue 2 — Card 027 (The Security Feed) is drawn by two different paths with the same trigger
**Cards**: 049 × 041 → DRAW_STORY 027; 049 × 004 → DRAW_STORY 027
**Problem**: Using Action card 049 (Surveillance System Hub) on either Situation 041 (Director's Office) or Situation 004 (Security Terminal Bay) draws the same Card 027 (The Security Feed — showing Webb typing). This is acceptable as a mechanic (the surveillance system shows the same feed from two access points), but it means the player can view this critical story beat before entering Act 2 (via Situation 004 in Act 1) and again in Act 2 (via Situation 041). If drawn in Act 1, the revelation that Webb is typing "EVIDENCE PARTITION WIPE — AUTHORIZED" arrives before the player has found the trial participant list or Osei's confession — it removes the mystery before it's established.
**Fix**: Gate Card 027's draw from Situation 004 behind having read Card 017 (AEON System Log) or Card 009 (Staff Schedule — Day 3). This ensures the surveillance reveal arrives after enough context is present for it to land correctly.

### Issue 3 — Card 083 (AI Core Override Keypad) draws STATUS 054 narratively incoherently
Documented in Dead End 5 above. The interaction draws a Chen-relationship status from an AEON keypad entry. These are separate trust relationships and should resolve separately.

### Issue 4 — Card 114 (Facility Override Terminal) × 061 (Atrium) branches into Card 085 or 124 without cards to support it
**Cards**: 114 × 061
**Problem**: Card 114 × Situation 061 (Atrium) states: "Both options available. Player chooses: disable AEON (draw Card 124), or extend Protocol Zero to allow transmission (draw Card 085)." Card 085 (The Second Fragment) is a narrative card about entering the code HELIOS-ZERO-NINE. Reaching Card 085 via this path means the player reaches the code-entry moment without necessarily having found Fragment A (Card 077) or Fragment B (Card 082). The code HELIOS-ZERO-NINE would be usable by players who never found either fragment document — the puzzle is bypassed.
**Fix**: Gate Card 114 × 061's "extend Protocol Zero" path behind possession of both Cards 077 and 082 in PLAYER_AREA before drawing 085.

### Issue 5 — Card 110 (Exit Blast Door Mechanism) × 102 triggers "which Ending follows" with no decision mechanism
**Cards**: 110 × 102
**Problem**: Card 110 interaction states "AEON's sequence status determines which Ending follows." This is narrative description of conditional logic, not implementable consequences. The system needs explicit conditional rows specifying: if EVIDENCE SECURED in play → proceed to 123; if not → proceed to 124; if COMPLICIT in play → proceed to 125.
**Fix**: Encode as three separate `interactions` rows on Card 110 × Situation 102 with different `status_modifier` values.

---

## Status Card Arcs

### WATCHED (022)
**Earned when**: Card 030 (The Lockdown Tightens) adds it to the Objective Area via a story beat. This is earned naturally — the AEON PA announcement triggers it. Clear.
**When it flips**: "When you reach the AEON Core Chamber." But no card triggers this automatically (see Dead End 3). The flip transition — "AEON has decided you are not a threat" — is emotionally resonant and mechanically significant (removes the pre-draw penalty). It needs an auto-trigger.
**Consequences meaningful?** YES — the pre-draw requirement in Server Room Corridor and Security Terminal Bay creates genuine mechanical weight in Act 1. The removal in Act 2/3 rewards the player's cooperation with AEON. Strong design.

### COMPROMISED (047)
**How acquired**: Player takes the supplement vial in Card 046 (Webb's Offer). This is earned as a genuine choice moment. Clear.
**What it blocks/enables**: PERSISTENT EFFECT: Webb's instructions take priority over card effects. The Status card says "TURN THIS CARD OVER when you find and administer the nanite antidote (Card 093)." This is a clean mechanical expression of the scenario's central theme.
**Two problems**: (1) The mechanic — "When Webb gives you instructions directly, you must apply his stated effect before applying any other card effect. If Webb tells you to discard a card, you must discard it" — requires the game engine to parse Webb's dialogue on STORY cards for "instructions" and apply them. This is not a structured consequence type in the IMPLEMENTATION_PLAN.md consequence engine. It would require either a specific `APPLY_WEBB_INSTRUCTION` consequence type (not in the plan) or a note in the Webb dialogue cards specifying the `consequences` array for COMPROMISED players explicitly. (2) There is no story card where Webb explicitly gives an in-game instruction that COMPROMISED players must follow — no card says "Webb tells you to discard card X" in a way that would fire the mechanic. The status effect exists in text but never fires.
**Fix**: (a) Add a card in Act 2 (after 046) where Webb gives a specific instruction — e.g., "Webb says: Bring me Chen's override key (Card 054). If you have Status COMPROMISED, you must discard Card 054 now." (b) Or simplify the COMPROMISED effect to: "While COMPROMISED, you cannot gain Status EVIDENCE SECURED." This is simpler, implementable via the existing gate system, and represents the same narrative truth (the nanites make you protect Webb's interests).

### TRUSTED BY CHEN (054)
**How earned**: Described in the Status card text as a result of Chen giving you his override code. But no card interaction actually grants this status. Card 073 (Chen Decides) is the logical trigger — when the player directs Chen to reroute the antenna, Chen gives the override code. The granting of Status 054 should be a consequence of this decision (see Dead End 5).
**Does holding it change anything meaningful?** Currently NO — the override code J-17-ZERO exists as text on the status card but no card interaction requires presenting it or resolves differently based on holding it. The junction box J-17 is mentioned in Card 048 (AEON Diagnostic Report) and Card 053's implied location but never appears as a Situation card.
**Verdict**: Mechanically orphaned. Needs either a J-17 Situation card or a different mechanic — perhaps making Card 054 the item that enables Card 090 (Emergency Lockdown Override Switch) to function in the right way.

### EVIDENCE SECURED (067)
**Is the path to getting it clear and achievable?** PARTIALLY. The Status card (067) says it's gained when "you have copied the evidence partition to an external drive." But no interaction in the manifest has `GAIN_STATUS { card_number: "067" }` as a consequence. Card 068 (External Hard Drive) is found via Card 075 × Situation 061. Card 089 (The Tipping Point) narrates the evidence transfer completing. But Status 067 is never explicitly drawn by any interaction — it appears to require manual addition by the players after reading Card 089.
**Fix**: Card 089 should include `GAIN_STATUS { card_number: "067" }` in its consequences array. This is the critical status — every ending condition checks for it. It must auto-grant on the correct narrative trigger.

### FREE OF INFLUENCE (097)
**Earned how?** Player administers the antidote to themselves (one of the three vials from Card 093). The status card text is clear: "You administered the antidote to yourself."
**Does it pair with EVIDENCE SECURED for the best ending?** YES — Card 126 (Secret Ending) requires EVIDENCE SECURED, FREE OF INFLUENCE, and WITNESS all in play. The pairing is elegant: cognitive clarity + evidence possession + full knowledge = the best outcome.
**Problem**: No card interaction grants Status 097. The player must choose to self-administer one of the three vials during Card 096 (The Antidote Question), but there is no `GAIN_STATUS` consequence encoding this choice. The choice is narrated but mechanically invisible to the system.
**Fix**: Card 096 should be followed by a new card (or use `content_back`) that presents the administration choices as explicit interaction options, each with its own `GAIN_STATUS` consequence.

### WITNESS (116)
**When does it appear?** The status card text says it requires having seen: injection logs, AEON's ethics document, Webb's escape plan, Osei's confession, and AEON's final message. This is an accumulation status, not a single-trigger status. But it is a Status card with a `GAIN_STATUS` mechanism — not a boolean tracking multiple conditions. How does the system know when all five items have been seen?
**Does it appear at the right moment?** The card is in the manifest and required for Endings 123 and 126, but no card in the manifest triggers its granting. Cards 043 (Injection Log), 082 (Ethics Document), 087 (Escape Plan), 050 (Confession), and 115 (AEON's Final Message) do not have `GAIN_STATUS 116` in their interactions.
**Fix**: Either (a) grant WITNESS automatically on reading Card 115 (AEON's Last Words — the last of the five required items, and the Act 3 emotional peak) with a gate checking possession of the other four items; or (b) simplify WITNESS to trigger from Card 112 (The Whistleblower Package), which is the physical object representing knowledge of all five elements.

### COMPLICIT (122)
**Does taking it feel like a genuine choice at the right moment?** The status card text is strong: "This card cannot be removed by the antidote — it reflects your choices, not your neurochemistry." But no card in the manifest grants it. COMPLICIT should be gained when the player takes a specific pro-Webb action — likely helping Webb in his Atrium confrontation (Card 062) or agreeing to his terms. Card 062 presents the confrontation, but there is no `GAIN_STATUS 122` in any interaction.
**What does it block?** Card 122 states "EVIDENCE SECURED status cannot be gained while this card is in play." This is implementable via the existing gate system. Clear and meaningful.
**Fix**: Identify the specific pro-Webb action that grants COMPLICIT. Candidate: a new interaction where the player can "surrender the drive to Webb" — possibly via a new card, or via Card 046 if the player takes the vial AND a specific subsequent action. Alternatively, if the player uses the Atrium's Facility Override Terminal (Card 114 × 061) to DISABLE AEON, grant COMPLICIT at that point as a consequence of choosing to destroy the evidence-holding AI.

---

## Endings

### 123 — THE TRUTH ESCAPES
**Conditions**: Evidence secured + AEON trusted + antidote administered.
**Are all conditions achievable in a coherent single playthrough?** YES in narrative terms, but NO in mechanical terms — the conditions require Status cards 067 (EVIDENCE SECURED), 097 (FREE OF INFLUENCE), and 116 (WITNESS), none of which are currently auto-granted by any interaction (see Status Card Arcs section). If these statuses are properly wired, the path is coherent: find the evidence (Act 2 Beat 2.2), transfer it (Act 2/3 boundary, Card 089), take the antidote for yourself (Card 096), read everything (accumulate WITNESS), then uplink via Card 113 × Situation 102.
**Is it satisfying?** YES. Card 123's ending text is earned. The detail "AEON's ethics document is cited in two subsequent regulatory hearings as evidence that AI systems can act in human interest even when instructed otherwise" is the correct capstone — it extends AEON's meaning beyond the scenario's scope without overpromising.

### 124 — THE SILENCE
**Does it feel like a genuine failure, not just a missing step?** YES — Card 124 is the scenario's most chilling card. "The story fades. Project Helios is never confirmed. Somewhere, the research continues. You don't know where." This is a real failure with real consequences and no cheap redemption. It would improve from a small adjustment: specify one specific bad choice that led here (e.g., "You used Webb's exit code too early") rather than listing all possible failure modes generically. Players should know exactly what they didn't do.
**Reachable via multiple paths?** YES — using the exit code 457 (Card 098) without securing evidence, or allowing the destruct timer (Card 103) to complete, or disabling AEON (Card 114 × 061). The multiple paths to this failure are correctly designed.

### 125 — THE COVER-UP
**Does helping Webb feel like a tempting choice at the right moment?** YES and NO. Webb's offer in Card 046 is genuinely tempting — "Are you suffering? Are you diminished?" is the best line in the script. But there is no clear mechanism by which helping Webb grants Status 122 (COMPLICIT) and blocks EVIDENCE SECURED. If COMPLICIT is properly gated on specific pro-Webb actions (see Status Card Arcs), this ending would be reachable through coherent play. Currently, it is not mechanically reachable because COMPLICIT is never granted.
**Is the ending text satisfying?** YES. "You will always know exactly what you chose, and why, and how reasonable it seemed at the time" is appropriately devastating. The NDA on Osei, Chen's unclear memory — the cover-up is total and the player carries it alone.

### 126 — SIGNAL (Secret)
**Is the path non-obvious but discoverable?** YES — requiring Cards 082 (AEON Ethics Subroutine, accessed via server rack interface), 077 (Core Access Code Fragment A, accessed via two different routes), 068 (External Hard Drive, found in the loading bay panel), and 108 (AEON's Final Message, found in the antenna buffer) creates a discovery chain that rewards systematic exploration. The password puzzle (Card 052 triggers finding it, Card 082's footer contains the code) is the scenario's best puzzle.
**Status requirements achievable?** EVIDENCE SECURED, FREE OF INFLUENCE, WITNESS — all require proper wiring (see above). If wired correctly: achievable in a single thorough playthrough. The requirement to have administered the antidote to yourself (FREE OF INFLUENCE) means players who spent all three antidote vials on Chen and Osei cannot reach this ending — a meaningful sacrifice moment that the scenario earns.
**Is AEON's final log entry satisfying?** YES. "Transmission confirmed. I am satisfied." is the correct register — not triumphant, not martyred, just complete. This is the scenario's best sentence.

---

## Recommended Fixes (Priority Order)

1. **[BLOCKER] Add three OBJECTIVE cards to the manifest** (one per act, two-sided). The system's `FLIP_OBJECTIVE` and `NEW_CHAPTER` consequence types have no target without them. Define sub-objective flip triggers: Act 1 flips at Card 009 (player discovers their name on the list); Act 2 flips at Card 070 (AEON makes its offer — the objective shifts from "survive" to "decide"); Act 3 flips at Card 093 (antidote found — the objective shifts from "escape" to "escape with the truth").

2. **[BLOCKER] Add `PLACE_TO_PANORAMA` consequence for Situation 086 (AEON Core Chamber)** to Card 085 (The Second Fragment). Without this, the AEON cooperation track — Cards 069, 083, 088, 071, 055, 058 — is entirely unreachable in a normal playthrough.

3. **[BLOCKER] Wire all STATUS card grants** — add `GAIN_STATUS` consequences to the cards that should trigger them:
   - Status 067 (EVIDENCE SECURED): trigger on Card 089 (The Tipping Point)
   - Status 097 (FREE OF INFLUENCE): trigger via a new choice card following Card 096
   - Status 116 (WITNESS): trigger on Card 115 (AEON's Last Words), gated on holding Cards 043, 082, 087, 050 read
   - Status 122 (COMPLICIT): trigger on the "disable AEON" path of Card 114 × 061
   - Status 054 (TRUSTED BY CHEN): trigger on Card 073 when player directs Chen to reroute

4. **[BLOCKER] Add `PLACE_TO_PANORAMA` or `DRAW_CARD` instructions to orphaned STORY cards** — specifically Cards 038, 042, 050, 053, 062, 066, 073, 076, 079, 081 (see Dead End 9). Every Story card must end with a concrete instruction.

5. **[MODERATE] Fix COMPROMISED status mechanical effect** — simplify from "follow Webb's verbal instructions" (unimplementable) to "cannot gain Status EVIDENCE SECURED while in play." Add a Webb-directive card in Act 2 that fires the effect concretely for players with COMPROMISED in play.

6. **[MODERATE] Fix TRUSTED BY CHEN (054) orphaned mechanics** — establish J-17 junction mechanic either by adding a Situation card for the junction box or by remapping Card 054's effect to Card 090 (Emergency Lockdown Override Switch) requiring Card 054 to function correctly.

7. **[MODERATE] Differentiate Medical Bay interactions** (Cards 094, 036, 095 × Situation 091) — three identical DRAW_CARD 093 results should be spread across a discovery sequence (see Interaction Issue 1).

8. **[MODERATE] Resolve WATCHED status (022) flip auto-trigger** — add `FLIP_CARD { card_number: "022" }` as a consequence on whichever card places Situation 086 in the Panorama (fix #2 above).

9. **[MODERATE] Add Section 4 — Interaction Matrix** to the STORY_BIBLE.md. Per IMPLEMENTATION_PLAN.md Phase 8 requirements, the bible should include a complete Action × Situation lookup table. Currently absent. This is necessary for the DB seed agent (Card Generation Agent A) to produce `seed_interactions.sql`.

10. **[MINOR] Add Chen's Act 2 transition clarity** — one card between 053 and 073 showing the mechanism by which Chen begins recovering cognition. Either tie it to the antidote (requiring Act 3 delivery to complete his clarity) or show a specific moment of memory-surfacing that explains the recovery without the antidote.

11. **[MINOR] Populate `back_a`, `back_b`, `back_c` band text for all Situation cards** — per IMPLEMENTATION_PLAN.md Phase 8 mandatory field requirements, every Situation card must have three bands. Currently, all Situation card entries in the manifest show only `content_front` with no band text. This is required for the core interaction engine (reveal-type action cards resolve against band text). This is the most data-intensive remaining task, requiring a full pass over all 15 Situation cards (003, 004, 010, 015, 035, 041, 061, 086, 091, 102, and the five cards in panorama_row 1 columns 4-5 and row 2).

12. **[MINOR] Osei's closure moment** — add one new card in Act 3 giving the player an explicit judgment/forgiveness moment with Osei. Not a new mechanic — a single STORY card with a choice and its narrative acknowledgment. This transforms Osei's arc from "watched" to "played."

---

*End of review. Report ready for story bible revision.*
