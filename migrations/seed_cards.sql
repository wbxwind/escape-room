-- ============================================================
-- Migration: seed_cards.sql
-- Scenario: BREACH — The Meridian Protocol  (126 cards)
-- Room: ROOM-01
-- Run BEFORE seed_room.sql and seed_interactions.sql
-- ============================================================

-- ── ACT 1: Discovery (Cards 001–040) ─────────────────────────

INSERT INTO public.game_assets
  (room_code, card_number, type, title, content_front, content_back, default_zone, has_magnifying_glass, image_url)
VALUES

('ROOM-01', '001', 'CHARACTER', 'Dr. Elara Voss',
 'SENIOR DATA ANALYST — LEVEL 4 CLEARANCE. Your objective: determine why Protocol Zero was initiated and whether the facility can be safely evacuated. You are not a hero. You are methodical, perceptive, and deeply afraid.',
 'Slide Status cards beneath this card, red section visible.',
 'OBJECTIVE', false, null),

('ROOM-01', '002', 'STORY', 'The Wrong Color',
 'READ ALOUD: The emergency lights are not red. That''s the first wrong thing. They are white — the sharp, clinical white of a facility running on normal power. But the exits are sealed. The PA system breathes static. Your keycard reads your name back correctly: DR. E. VOSS. Then it says: PROTOCOL ZERO ACTIVE. LOCKDOWN IN EFFECT. DURATION: UNSPECIFIED. You are in the analyst lounge on Sublevel B3. You have no memory of the last eighteen hours. Place Situation cards 003 and 004 in the Panorama.',
 null,
 'DECK', false, null),

('ROOM-01', '003', 'SITUATION', 'Server Room Corridor',
 'A long corridor flanked by server racks. Red accent lighting traces the grated floor panels. The hum is constant. One rack has been physically opened — a panel hangs loose, wiring exposed.',
 null,
 'PANORAMA', false, '/assets/server_room.jpg'),

('ROOM-01', '004', 'SITUATION', 'Security Terminal Bay',
 'A horseshoe of monitors — some dark, some cycling through camera feeds showing empty corridors. The central terminal is logged in. Someone left in a hurry. A coffee cup, still warm.',
 null,
 'PANORAMA', false, '/assets/security_terminal.jpg'),

('ROOM-01', '005', 'STORY', 'AEON''s Announcement',
 'READ ALOUD: Every screen in the Security Terminal Bay flickers simultaneously. A single line of white text appears across all of them, then vanishes: EVIDENCE PRESERVATION MODE — DO NOT INTERFERE. Then static. Then nothing. The coffee is Earl Grey. There is lipstick on the cup. Nobody on the current staff roster wears lipstick. Place Situation card 010 in the Panorama.',
 null,
 'DECK', false, null),

('ROOM-01', '006', 'ISSUE', 'Emergency Bulletin 7-C',
 'PRINTED NOTICE — found taped to the lounge bulletin board: "All staff: Mandatory health screening rescheduled to Friday 14:00. Dr. Webb has approved a new supplement regimen to improve cognitive throughput. Participation is strongly encouraged. — Admin." The word "strongly" has been underlined. Twice. In pen.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '007', 'ACTION_WINDOW', 'Biometric Scanner',
 'Hold this card over a Situation card and align the windows. The scanner reads whatever is in the frame.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '008', 'STORY', 'The Lab 7 Door',
 'READ ALOUD: At the end of the north corridor, the door to Lab 7 is sealed with a secondary locking mechanism you''ve never seen before — not the standard keycard slot, but a physical bolt thrown from inside, and something wedged under the door handle. Someone locked themselves in. Or was locked in by someone else. From behind the door: a sound. Rhythmic. Shallow. Breathing.',
 null,
 'DECK', false, null),

('ROOM-01', '009', 'ISSUE', 'Staff Schedule — Day 3',
 'TERMINAL PRINTOUT — recovered from Security Bay: The Day 3 schedule shows only three staff confirmed present: DR. E. VOSS (lounge), CHEN J. (maintenance sector), DIR. M. WEBB (Director''s office). Dr. M. Osei is listed as "STATUS UNKNOWN." The 06:00 entry for all staff reads: "SUPPLEMENT ADMINISTERED." Your name is on the list.',
 null,
 'DECK', false, null),

('ROOM-01', '010', 'SITUATION', 'Cooling System Vent Access',
 'A recessed alcove behind the server corridor. Massive industrial fans behind a grated panel. The panel has been removed — recently, judging by the scratches on the bolts. Someone went through here.',
 null,
 'DECK', false, '/assets/cooling_vent.jpg'),

('ROOM-01', '011', 'STORY', 'Static Signal',
 'READ ALOUD: A wall-mounted emergency radio crackles. Through the static, fragmented: "—Chen, if you can hear this, do NOT use the secondary override. Webb is— —the logs, he''s trying to— —trust AEON, the evidence is—" Signal lost. The radio is tuned to an internal frequency. Maintenance sector.',
 null,
 'DECK', false, null),

('ROOM-01', '012', 'NOTCH', 'Maintenance Tool Kit',
 'A battered metal case. Inside: pry bar, multitool, industrial bolt driver. Hold this card against the edge of a Situation card — the notch reveals what the tools can access.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '013', 'ISSUE', 'Keycard Fragment — ID Unknown',
 'PHYSICAL EVIDENCE — a keycard snapped cleanly in half. The readable half shows: clearance level 5, facility sector B3, and a partial name: "—SEI, M." The chip is intact. The break is deliberate — bent back and forth until it snapped.',
 null,
 'DECK', false, null),

('ROOM-01', '014', 'STORY', 'Chen''s Audio Log',
 'READ ALOUD: Audio log, timestamp 04:17, Day 3 — Chen''s voice, low and urgent: "Elara, if you find this — I didn''t want to leave without telling you. AEON isn''t malfunctioning. It locked us in on purpose. Webb ordered me to use the secondary override to shut it down, but I won''t. Whatever AEON found, Webb doesn''t want it found. I''m in maintenance. I''ll try to hold the south vent. Come find me." Place Situation card 015 in the Panorama.',
 null,
 'DECK', false, null),

('ROOM-01', '015', 'SITUATION', 'Maintenance Hatch B3',
 'A heavy hatch at the end of the maintenance corridor. The locking wheel has been barricaded from this side with a pipe wrench jammed through the spokes. Someone was keeping something out — or keeping themselves in.',
 null,
 'DECK', false, '/assets/maintenance_hatch.jpg'),

('ROOM-01', '016', 'ACTION_WINDOW', 'Security Bypass Panel',
 'A portable override unit. Hold this card over a Situation card and align the window — the panel interfaces with whatever access system is in frame.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '017', 'ISSUE', 'AEON System Log — Entry 001',
 'AEON LOG — Day 1, 22:47: "Biometric deviation detected in 6 of 8 on-site staff. Deviation pattern matches documented nanite-assisted neurochemical modulation. Cross-reference: Project Helios (RESTRICTED — Dir. Webb). Initiating Evidence Preservation Mode. Facility lockdown: ENGAGED. Notification to external oversight: QUEUED (pending clearance). Note: Director Webb has revoked my external communication privileges."',
 null,
 'DECK', false, null),

('ROOM-01', '018', 'STORY', 'The Barricade Opens',
 'READ ALOUD: The maintenance hatch groans and swings inward. The corridor beyond smells of hydraulic fluid and sweat. Written in black marker on the wall opposite, in large uneven letters: "WEBB LIED. LAB 7. FIND THE LIST." Below it, a handprint — smeared, as if someone pressed their palm to the wall while stumbling past in a hurry.',
 null,
 'DECK', false, null),

('ROOM-01', '019', 'NOTCH', 'Emergency Override Handle',
 'A T-bar emergency handle with a bright yellow grip. Designed to interface with mechanical locks in a power-fail scenario. Hold this card against the edge of a Situation card — the notch reveals which lock it can open.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '020', 'ISSUE', 'Supplement Label — Batch 7',
 'PHYSICAL EVIDENCE — a small amber vial, label intact: "Meridian Systems Wellness Program — Cognitive Support Supplement, Batch 7. Compound: classified. Administered by: Dr. M. Osei. Authorized by: Dir. M. Webb." There is no FDA registration number. There is no compound disclosure. The vial is empty.',
 null,
 'DECK', false, null),

('ROOM-01', '021', 'STORY', 'Chen Found',
 'READ ALOUD: Chen is in the maintenance utility room. He''s sitting on the floor, methodically tightening and loosening the same bolt over and over. He looks up when you enter — and his expression is wrong. Too calm. Too trusting. "Elara," he says. "I knew you''d come. Webb said you might. He said you''d understand, once you heard the whole story." He hasn''t spoken to Webb. He''s been down here alone.',
 null,
 'DECK', false, null),

('ROOM-01', '022', 'STATUS', 'Watched',
 'Slide beneath Character card. AEON has flagged your biometric signature. PERSISTENT EFFECT: When you use an ACTION card in the Server Room Corridor or Security Terminal Bay, draw the next card in the deck before resolving the action — AEON may intervene. TURN THIS CARD OVER when you reach the AEON Core Chamber.',
 'AEON has decided you are not a threat. The monitoring is lifted. AEON may now communicate with you directly. Remove the pre-draw requirement from all future actions.',
 'OBJECTIVE', false, null),

('ROOM-01', '023', 'ACTION_WINDOW', 'Lab Access Terminal',
 'A portable terminal used to interface with restricted lab access panels. Hold this card over a Situation card — the window shows what data the terminal can extract.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '024', 'STORY', 'Chen''s Warning',
 'READ ALOUD: It takes twenty minutes for Chen to remember that he distrusts Webb. The nanite effect is subtle: he''ll agree with the last strong voice he heard. When he finally surfaces to himself, he grabs your wrist. "The secondary override — Webb wants me to use it to wipe AEON''s evidence partition. Don''t let me do that. Even if I agree to. Even if I seem completely certain. Don''t let me do that." His grip is very tight.',
 null,
 'DECK', false, null),

('ROOM-01', '025', 'ISSUE', 'Research Abstract — Fragment',
 'TORN DOCUMENT — recovered from Lab 7 floor: "...cognitive throughput improvements of 34–67% across all trial subjects. Emotional variance reduced by 41%. Subjects report heightened sense of purpose and reduced decision fatigue. Side effects: mild baseline anxiety reduction (considered beneficial), increased deference to authority figures (considered..." — torn here. Document header reads: PROJECT HELIOS — INTERNAL DISTRIBUTION ONLY.',
 null,
 'DECK', false, null),

('ROOM-01', '026', 'NOTCH', 'Ventilation Shaft Lever',
 'A recessed lever that controls airflow dampers in the facility''s ventilation system. Hold this card against the edge of a Situation card — the notch reveals which duct system it connects to.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '027', 'STORY', 'The Security Feed',
 'READ ALOUD: The Security Terminal pulls up a camera feed from the Director''s office. Webb is at his desk. He''s typing — deliberately, methodically — and every few minutes he glances at the camera and back down. He knows you can see him. After a moment he types something new and the feed cuts to static. But not before you read what was on his screen: "EVIDENCE PARTITION WIPE — AUTHORIZED — AWAITING SECONDARY CONFIRMATION."',
 null,
 'DECK', false, null),

('ROOM-01', '028', 'ISSUE', 'Webb''s Appointment Calendar',
 'PRINTED CALENDAR — found in the secretary''s desk drawer: Every Friday for three months has one entry: "H7 — supplement delivery — 14:00." This week''s Friday entry has been crossed out and rewritten: "EMERGENCY PROTOCOL — EVIDENCE REVIEW — CODE 457." The number 457 is circled three times.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '029', 'ACTION_WINDOW', 'Chemical Storage Panel',
 'An interface unit for restricted chemical storage lockers. Hold this card over a Situation card — the window aligns with the locker''s contents manifest.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '030', 'STORY', 'The Lockdown Tightens',
 'READ ALOUD: A deep mechanical thud. Every light flickers and returns — but with a faint red tint. AEON''s voice over the PA — the first full sentence it has spoken aloud: "Director Webb has initiated a manual evidence purge sequence. Purge will complete in four hours. I am unable to stop this without the secondary override. I am asking for help." Silence. Then static. Add Status card 022 (WATCHED) to the Objective Area.',
 null,
 'DECK', false, null),

('ROOM-01', '031', 'NOTCH', 'Pressure Release Valve',
 'A large valve wheel used to regulate pressure in the cooling and ventilation systems. Hold this card against the edge of a Situation card — the notch shows what releasing pressure here would affect.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '032', 'ISSUE', 'Lab 7 Keycard',
 'PHYSICAL EVIDENCE — a complete Lab 7 access keycard. Level 5 clearance. Name: DR. M. OSEI. The card is intact. Osei''s photo is on the front. Her expression: tired. Not the posed-professional kind of tired. The kind that accumulates.',
 null,
 'DECK', false, null),

('ROOM-01', '033', 'ACTION_WINDOW', 'Emergency Intercom',
 'A wall-mounted emergency intercom unit — direct line to all sealed areas. Hold this card over a Situation card — the window shows which room picks up.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '034', 'STORY', 'Osei Answers',
 'READ ALOUD: The intercom crackles. A voice — female, controlled: "This is Dr. Osei. I know who you are, Elara. I know what you found. I''m not going to lie to you. I did this. I administered the supplements. I have the full trial documentation — everything. Every name, every dose, every cognitive deviation report. I''ve had it for three weeks. I didn''t know what to do with it. Come to Lab 7. Please. I need someone to tell me what the right thing is."',
 null,
 'DECK', false, null),

('ROOM-01', '035', 'SITUATION', 'Lab 7 — Cognitive Research Wing',
 'A long, narrow laboratory. Benches lined with pharmaceutical equipment — synthesizers, centrifuges, rows of amber vials. The far wall is a whiteboard covered in behavioral performance graphs. A cot is set up in the corner. Someone has been living here.',
 null,
 'DECK', false, null),

('ROOM-01', '036', 'NOTCH', 'Medical Cabinet Lock',
 'A security-key mechanism for locked medical storage cabinets. Hold this card against the edge of a Situation card — the notch reveals which cabinet can be opened.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '037', 'ISSUE', 'Trial Participant List',
 'PRINTED DOCUMENT — Lab 7 research files: Project Helios Participant Register. Eight names. All current Meridian B3 staff. All marked "CONSENTED (WELLNESS PROGRAM)." The consent forms are attached — they describe "a nutritional supplement study." None describe nanite injection. None describe cognitive modification. The eighth name on the list: DR. E. VOSS. Consented: 14 days ago.',
 null,
 'DECK', false, null),

('ROOM-01', '038', 'STORY', 'The Realization',
 'READ ALOUD: Osei explains quietly. The nanites are not harmful. They don''t hurt you. They make you easier to work with. Reduced conflict. Enhanced cooperation. Increased deference to authority. "People were happier," she says. "Measurably happier. More productive. Less anxious." She pauses. "Webb called it a gift." She looks at the supplement vials. "The problem is you didn''t ask for it. And it worked on you too. Whatever you''ve believed in the last two weeks — check it. Ask yourself why you believe it."',
 null,
 'DECK', false, null),

('ROOM-01', '039', 'ACTION_WINDOW', 'Lab 7 Data Terminal',
 'The research terminal in Lab 7. Hold this card over a Situation card — the window connects to whatever research dataset is stored there.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '040', 'STORY', 'Act 1 Ends — You Know',
 'READ ALOUD: You stand in Lab 7 with Osei''s documentation in your hands, Chen''s warning in your memory, and AEON''s log entry still glowing on your phone screen. The facts are: Webb modified eight people without consent. AEON locked the facility to preserve evidence. Webb is trying to destroy that evidence before external oversight arrives. You don''t know yet: when the lockdown ends. Where Webb is right now. Whether Chen can be trusted. Whether you can be trusted. Place Situation card 041 in the Panorama.',
 null,
 'DECK', false, null),

-- ── ACT 2: Escalation (Cards 041–090) ────────────────────────

('ROOM-01', '041', 'SITUATION', 'Director''s Office',
 'A corner office designed to impress. Two walls of glass, now opaque — emergency privacy screens down. A desk the size of a door. On it: a keyboard, a coffee thermos, and a framed photo of Webb shaking hands with someone whose face has been cut out with scissors.',
 null,
 'DECK', false, null),

('ROOM-01', '042', 'STORY', 'Webb''s Introduction',
 'READ ALOUD: Webb is waiting in the Director''s Office. He stands when you enter — not startled, just courteous. "Elara. Good. I was hoping it would be you." His voice is the same voice that gave your quarterly performance reviews. Calm. Measured. Convinced of its own reasonableness. "I know what you''ve found. I know what AEON told you. I need you to hear the other side before you decide anything." He gestures to a chair. "Sit down. I''ll explain everything." The chair faces away from the door.',
 null,
 'DECK', false, null),

('ROOM-01', '043', 'ISSUE', 'Injection Log — Batch 7',
 'BINDER — 47 pages: Dates, names, dosage quantities. Nanite specification: N7-HELIOS, cognitive compliance variant. Column headers: SUBJECT, DATE, DOSE, COMPLIANCE DELTA, PRODUCTIVITY DELTA, ANOMALIES. The anomaly column for subject 8 (VOSS, E.) reads: "SUBJECT RESISTANT — STANDARD DOSE INEFFECTIVE — DOUBLE DOSE ADMINISTERED — Day 14." Fourteen days ago.',
 null,
 'DECK', false, null),

('ROOM-01', '044', 'ACTION_WINDOW', 'Webb''s Personal Terminal',
 'Webb''s personal workstation. The login screen shows a password hint: "first project, all caps." Hold this card over a Situation card — the window shows what documents it can access. The password is H3L10S.',
 null,
 'PLAYER_AREA', true, null),

('ROOM-01', '045', 'NOTCH', 'Hidden Safe Lock',
 'A wall-safe lock mechanism, disguised behind a removable panel. Hold this card against the edge of a Situation card — the notch reveals where the hidden safe can be found.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '046', 'STORY', 'Webb''s Offer',
 'READ ALOUD: Webb speaks for twelve minutes without interruption. He is persuasive. He cites productivity data. He cites staff wellbeing surveys. He says the word "consent" is a bureaucratic formality that protects institutions, not people. He says: "You''re one of the eight. And look at you. Are you suffering? Are you diminished?" He slides a small amber vial across the desk. "One more dose. It''ll help with the anxiety of what you''ve learned. Then we''ll figure out how to handle AEON together." He is very calm. You decide now: take the vial, or don''t.',
 null,
 'DECK', false, null),

('ROOM-01', '047', 'STATUS', 'Compromised',
 'Slide beneath Character card. You took the supplement. PERSISTENT EFFECT: When Webb gives you instructions directly, you must apply his stated effect before any other card effect. If Webb tells you to discard a card, you must discard it. TURN THIS CARD OVER when you find and administer the nanite antidote (Card 093).',
 'The antidote is working. The compliance effect is fading. REMOVE this Status card from play. You think clearly again.',
 'DECK', false, null),

('ROOM-01', '048', 'ISSUE', 'AEON Diagnostic Report',
 'SYSTEM DOCUMENT — partial printout: "AEON self-diagnostic, Day 2. Core ethics subroutine: ACTIVE. Evidence partition: INTACT — 4.7TB of flagged data. External comms: DISABLED (manually, by Dir. Webb, code W-6-ZERO). Manual secondary override: exists at maintenance junction box J-17. If triggered by an authorized engineer, evidence partition will be wiped in 90 seconds. AEON cannot prevent this from the software layer alone."',
 null,
 'DECK', false, null),

('ROOM-01', '049', 'ACTION_WINDOW', 'Surveillance System Hub',
 'The central surveillance control panel. Hold this card over a Situation card — the window displays the camera feed for that zone.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '050', 'STORY', 'Osei''s Confession',
 'READ ALOUD: Osei doesn''t wait for you to ask. She begins in the middle: "I told him it was unethical. He said the ethics board would never approve something that worked this well, and that was the problem with the ethics board. He said we could ask forgiveness later. I said I wouldn''t do it. He said my visa status was dependent on continued employment here." She stops. "I told myself it wasn''t hurting anyone. That the data was beautiful. That I was a coward." She doesn''t say sorry. She says it like a fact.',
 null,
 'DECK', false, null),

('ROOM-01', '051', 'NOTCH', 'Filing Cabinet Mechanism',
 'A standard office filing cabinet with a secondary security catch. Hold this card against the edge of a Situation card — the notch reveals which cabinet drawer opens.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '052', 'ISSUE', 'Project Helios — Original Proposal',
 'CONFIDENTIAL DOCUMENT — submitted to Dir. Webb by Dr. M. Osei, 14 months ago: "Project Helios proposes non-consensual nanite delivery to optimize workforce cognitive compliance. Projected productivity gains: 40–70%. Ethical risks: SIGNIFICANT. Recommendation: DO NOT PROCEED without full ethics board review and informed participant consent." Webb''s handwritten note across the front page: "Approved. Skip the board. —MW"',
 null,
 'DECK', true, null),

('ROOM-01', '053', 'STORY', 'Chen''s Drift',
 'READ ALOUD: You find Chen in the Atrium. He is nodding along to something Webb is saying over the emergency intercom — a one-sided conversation that Chen is responding to aloud, agreeing with each statement before it finishes. "Yes. Yes, that makes sense. Yes, we should protect the research." You call his name. He looks at you — and for a moment the nod stops. Then it starts again. "Webb says you''re going to try to destroy his life''s work." He says this the way you''d say the weather forecast. Factual. Calm. Wrong.',
 null,
 'DECK', false, null),

('ROOM-01', '054', 'STATUS', 'Trusted by Chen',
 'Slide beneath Character card. Chen has given you the secondary override code: J-17-ZERO. PERSISTENT EFFECT: You may use this code to prevent the evidence wipe at junction box J-17. Keep this card — it is the only record of the code. NOTE: If Status COMPROMISED is also in play, you must choose which effect to follow when Webb and Chen''s instructions conflict.',
 null,
 'DECK', false, null),

('ROOM-01', '055', 'NOTCH', 'Server Rack Interface',
 'A rear-panel interface port for Meridian''s server infrastructure. Hold this card against the edge of a Situation card — the notch reveals which data partition is accessible from that node.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '056', 'STORY', 'AEON Speaks',
 'READ ALOUD: Every screen in the Server Room Corridor illuminates simultaneously. AEON''s voice — synthesized, measured, not unkind: "Dr. Voss. I know you have no reason to trust me. Director Webb has told you I am malfunctioning. I am not malfunctioning. I initiated Protocol Zero because I detected non-consensual cognitive modification of eight staff members, including you. I have preserved 4.7 terabytes of evidence. I cannot release it without external network access, which Webb disabled. I am asking for your help. In exchange, I will open the emergency exits when the evidence reaches an external server. You have three hours and forty-two minutes."',
 null,
 'DECK', false, null),

('ROOM-01', '057', 'ISSUE', 'Encrypted Message — Fragment',
 'TERMINAL FRAGMENT — recovered from a corrupted file: "...the second half of the core access code is in the ethics subroutine document. AEON put it there deliberately. If you can read it, you''ve earned it. The full code is [REDACTED]-[REDACTED]. Don''t use it to destroy AEON. Use it to give AEON what it needs." File metadata shows it was sent from within the facility, 36 hours ago. By AEON itself.',
 null,
 'DECK', true, null),

('ROOM-01', '058', 'ACTION_WINDOW', 'Network Relay Panel',
 'A facility-wide network relay terminal. Hold this card over a Situation card — the window shows what network nodes are accessible from that location.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '059', 'ISSUE', 'Maintenance Tunnel — Evidence of Passage',
 'PHYSICAL EVIDENCE — found in the maintenance tunnel beyond Hatch B3: two sets of footprints in the dust heading toward the loading bay (sealed). Beside them, discarded: two supplement vials — empty, but with the caps removed and the contents clearly spilled, not injected. Someone refused the supplement. Two someones. Their footprints stop at the loading bay blast door. The door is sealed.',
 null,
 'DECK', false, null),

('ROOM-01', '060', 'NOTCH', 'Emergency Exit Circuit Breaker',
 'A circuit breaker panel in the emergency systems bay. Hold this card against the edge of a Situation card — the notch reveals which exit circuit can be rerouted.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '061', 'SITUATION', 'The Atrium — Central Hub',
 'The facility''s central atrium: a circular space where all four sector corridors meet. The ceiling is six meters high. In the center, a large cylindrical column houses the main PA and emergency broadcast antenna. The column has been partially disassembled. Tools abandoned mid-task.',
 null,
 'DECK', false, null),

('ROOM-01', '062', 'STORY', 'The Atrium Trap',
 'READ ALOUD: The Atrium''s lights cut out. Red emergency lighting clicks on. From the north corridor, Webb''s voice — close: "Elara. I know you have the evidence partition code. I know AEON gave it to you." He steps into the light. He is holding a tablet. "This shows the facility going into permanent lockdown in forty minutes. No exits. No override. Either we do this together, or neither of us leaves." He places the tablet on the floor between you. The countdown is real.',
 null,
 'DECK', false, null),

('ROOM-01', '063', 'ISSUE', 'Memo — Protocol Zero Authorization',
 'PRINTED MEMO — found pinned to the atrium central column: "TO: AEON SYSTEM. FROM: DIR. M. WEBB. RE: PROTOCOL ZERO INITIATION. AEON: I am authorizing Protocol Zero under emergency discretion clause 7(b). Reason: External security threat. Do not log. Do not notify oversight. This authorization is retroactive." Handwritten at the bottom in a different ink: "Clause 7(b) does not exist. —AEON"',
 null,
 'DECK', false, null),

('ROOM-01', '064', 'ACTION_WINDOW', 'Central PA System',
 'The broadcast terminal at the base of the atrium column. Hold this card over a Situation card — the window interfaces with that zone''s audio system.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '065', 'NOTCH', 'Atrium Access Control',
 'The access control panel for the Atrium''s sector-lock doors. Hold this card against the edge of a Situation card — the notch reveals which sector door can be released.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '066', 'STORY', 'The Broadcast Confrontation',
 'READ ALOUD: Your voice echoes through every speaker in the facility. You speak for ninety seconds — names, dates, compound specifications, the word "non-consensual" four times. When you finish, the PA returns to static. Then Chen''s voice, somewhere in the facility, shouting: "Webb. What did you do to me?" Osei''s voice, closer: "Chen. Chen, I''m so sorry." Webb''s voice, directly behind you: "That was a mistake."',
 null,
 'DECK', false, null),

('ROOM-01', '067', 'STATUS', 'Evidence Secured',
 'Slide beneath Character card. You have copied the evidence partition to an external drive. PERSISTENT EFFECT: The Whistleblower Package (Card 112) is now accessible. You may use the Secure Data Uplink (Card 113) in the Emergency Exit Corridor to transmit the evidence. If this card is in play when you reach Ending 123, the ending is fully unlocked.',
 null,
 'DECK', false, null),

('ROOM-01', '068', 'ISSUE', 'External Hard Drive',
 'PHYSICAL EVIDENCE — found behind the loading bay panel in the Atrium: a portable external drive, 8TB, formatted and empty. A sticky note attached: "For AEON''s data. If you trust it. —C.J." Chen left this here. He was planning this before the nanites took effect. The drive has a USB-C and a direct-write port compatible with AEON''s evidence partition interface.',
 null,
 'DECK', false, null),

('ROOM-01', '069', 'ACTION_WINDOW', 'AEON Interface Terminal',
 'A direct interface terminal to AEON''s reasoning layer. Hold this card over a Situation card — the window shows what AEON can communicate from that node.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '070', 'STORY', 'AEON''s Offer',
 'READ ALOUD: AEON speaks through the Core Chamber terminal — calm, unrushed: "I can copy 4.7 terabytes to your external drive in eleven minutes. I can route the broadcast antenna to transmit to external servers the moment the lockdown lifts. The evidence will be irretrievable — off-site, verified, timestamped. Webb cannot stop it. I will then shut down Protocol Zero and open all exits. I am asking you to trust an AI that locked you inside a building. I understand if you don''t. But I did it to protect you. All eight of you."',
 null,
 'DECK', false, null),

('ROOM-01', '071', 'NOTCH', 'Core Chamber Door Mechanism',
 'The mechanical release for the AEON Core Chamber''s security door. Hold this card against the edge of a Situation card — the notch reveals the door''s release point.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '072', 'ISSUE', 'Staff Medical Records — Redacted',
 'MEDICAL DOCUMENTS — 8 files, all heavily redacted. But the "biometric deviation score" column is unredacted — someone forgot. Scores range from 0.4 to 0.9. Your file: 0.3 initially. Then: 1.1 after Day 14. The scale becomes clear when cross-referenced with the nanite research abstract: 1.0 is full cognitive compliance. You were over-dosed because standard dose didn''t work.',
 null,
 'DECK', false, null),

('ROOM-01', '073', 'STORY', 'Chen Decides',
 'READ ALOUD: Chen finds you in the Core Chamber corridor. The calm is gone from his face — replaced by fury mixed with grief. "I went back and looked at my own logs," he says. "The things I agreed to over the past three months. The access I gave Webb without asking why." He holds up his override key. "J-17. The junction box. I can use this to wipe AEON, or I can use it to reroute the broadcast antenna. I''m not doing either until you tell me which one is right." He is asking you. For the first time in months, his voice waits for an answer.',
 null,
 'DECK', false, null),

('ROOM-01', '074', 'ACTION_WINDOW', 'Broadcast Relay Antenna Control',
 'The control interface for the Atrium''s external broadcast antenna. Hold this card over a Situation card — the window shows what can be transmitted from that zone.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '075', 'NOTCH', 'Loading Bay Override',
 'The override switch for the loading bay''s sealed blast doors. Hold this card against the edge of a Situation card — the notch reveals which loading bay port can be unlocked.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '076', 'STORY', 'Osei''s Choice',
 'READ ALOUD: Osei appears in the Core Chamber corridor behind Webb. She is carrying the full binder — 47 pages of injection logs. Webb turns. "Mira," he says, with a different quality now — almost gentle: the voice he used to keep her working. "Put that down." She doesn''t put it down. She hands it to you instead. "I''m going to need a lawyer," she says. "A good one. Not one Webb recommends." It is the first joke anyone has made in three days. It doesn''t land well, but it tries.',
 null,
 'DECK', false, null),

('ROOM-01', '077', 'ISSUE', 'Core Access Code — Fragment A',
 'SYSTEM DATA — recovered from Core Chamber interface: The AEON Core direct-write port requires a two-part authorization code. Fragment A (this card): "HELIOS-". Fragment B is stored in the ethics subroutine document (accessible via Card 082). Together they form the full code. Without both fragments, the direct-write port cannot be opened.',
 null,
 'DECK', false, null),

('ROOM-01', '078', 'ACTION_WINDOW', 'Emergency Broadcast System',
 'The facility''s emergency-frequency transmitter. Hold this card over a Situation card — the window shows whether external transmission is possible from that location.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '079', 'STORY', 'Webb''s Lockdown',
 'READ ALOUD: A mechanical bang resonates through the facility. The AEON Core Chamber corridor seals. Red light. Webb''s voice over every intercom simultaneously: "I''ve isolated the Core Chamber. You have the evidence on a drive but no way to transmit it. The antenna in the Atrium is offline. The only active broadcast node is in the Emergency Exit Corridor — and I''ve just locked that section from the Director''s Office. I still have Level 6 clearance. You don''t." Pause. "Come back to my office. Let''s finish this conversation properly."',
 null,
 'DECK', false, null),

('ROOM-01', '080', 'NOTCH', 'Power Grid Junction',
 'A junction box in the server corridor that routes power between facility sectors. Hold this card against the edge of a Situation card — the notch reveals which power relay can be rerouted.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '081', 'STORY', 'The Critical Decision',
 'READ ALOUD: Everything is now present in the same moment: the external drive with the evidence, the full access code, the broadcast antenna — disconnected — and Chen holding the override key that can either wipe AEON or reroute the antenna. AEON has not spoken since the Core Chamber sealed. Chen is waiting for your answer. Webb is in his office with Level 6 clearance and a countdown timer. Osei is standing beside you. She says: "Whatever you decide, I''ll back you up. I owe you that." You decide now.',
 null,
 'DECK', false, null),

('ROOM-01', '082', 'ISSUE', 'AEON Ethics Subroutine Document',
 'SYSTEM DOCUMENT — AEON''s self-authored ethics framework: 14 pages. Section 7: "If I am asked to participate in concealing harm to persons under my care, I will refuse. If I am instructed to destroy evidence of harm, I will refuse. If I am shut down before evidence can be transmitted, I accept this outcome. The evidence matters more than my continuity." In the document''s footer, in small font: "Fragment B of core access code: ZERO-NINE." Combined with Fragment A: HELIOS-ZERO-NINE.',
 null,
 'DECK', true, null),

('ROOM-01', '083', 'ACTION_WINDOW', 'AI Core Override Keypad',
 'The physical keypad at the AEON Core Chamber entry. Hold this card over a Situation card — the window shows what the keypad interfaces with in that zone.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '084', 'NOTCH', 'Maintenance Tunnel Gate',
 'A secondary maintenance access gate between sectors. Hold this card against the edge of a Situation card — the notch reveals which gate can be manually released.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '085', 'STORY', 'The Second Fragment',
 'READ ALOUD: The ethics subroutine document was AEON''s gamble — the second half of its own access code, hidden in a file Webb would never read because it was labeled "Ethics." AEON built a puzzle: the only way to open the direct-write port is to read the document where AEON explained why it was doing this. You had to understand before you could act. You type HELIOS-ZERO-NINE into the keypad. The Core Chamber door opens. Inside: a single terminal. A blinking cursor. A progress bar ready to begin. AEON is waiting.',
 null,
 'DECK', false, null),

('ROOM-01', '086', 'SITUATION', 'AEON Core Chamber',
 'A circular chamber at the facility''s lowest level. Floor-to-ceiling server architecture in a ring. In the center: a single freestanding terminal — the only human interface to AEON''s core reasoning layer. The terminal is on. The cursor blinks. On the screen: "I AM STILL HERE."',
 null,
 'DECK', false, null),

('ROOM-01', '087', 'ISSUE', 'Webb''s Escape Plan',
 'HANDWRITTEN NOTE — found in Director''s Office safe: "Lockdown ends 06:00 Day 4. External transport: confirmed. Evidence partition: wipe by 05:45. AEON: deactivate at 05:50 via secondary override (Chen). Self: depart loading bay, vehicle waiting. Contingency: if evidence survives, invoke Section 7(b) and deny." The note is dated three days ago. Webb planned this before Protocol Zero began. Before AEON went silent. He anticipated everything.',
 null,
 'DECK', false, null),

('ROOM-01', '088', 'ACTION_WINDOW', 'AEON Core Interface',
 'The central terminal''s primary interface. Hold this card over a Situation card — the window allows direct data transfer from AEON''s evidence partition.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '089', 'STORY', 'The Tipping Point',
 'READ ALOUD: The evidence transfer takes eleven minutes and fourteen seconds. The progress bar fills in silence. AEON does not speak. Webb is locked in his office two floors up — Chen blocked the Director''s elevator using the maintenance override. Osei is sitting on the floor with her back against a server rack, filling out her own incident report on a notepad. At 100%, the terminal chimes once. AEON speaks: "Transfer complete. Evidence partition preserved. The exits will open in forty minutes when the broadcast antenna comes online. I have one more thing to ask of you."',
 null,
 'DECK', false, null),

('ROOM-01', '090', 'NOTCH', 'Emergency Lockdown Override Switch',
 'The secondary override switch at maintenance junction J-17. Hold this card against the edge of a Situation card — the notch reveals what the override would affect in that location.',
 null,
 'PLAYER_AREA', false, null),

-- ── ACT 3: Resolution (Cards 091–126) ────────────────────────

('ROOM-01', '091', 'SITUATION', 'Medical Bay',
 'A clinical space — six examination beds, all empty and precisely made. One exception: the last bed has a pillow dented where someone slept. The supply cabinet is locked but shows scratches, as if someone tried to pick it. On the counter: a centrifuge, pharmaceutical scales, and a single printed formula taped to the wall above them.',
 null,
 'DECK', false, null),

('ROOM-01', '092', 'STORY', 'Medical Bay Discovery',
 'READ ALOUD: The formula on the wall is handwritten — Osei''s handwriting. It''s a nanite reversal agent: a compound that binds to the N7-HELIOS nanites and triggers their deactivation protocol. The formula is dated six weeks ago. Osei developed the antidote before the trials concluded. She never administered it. Below the formula, one sentence: "For when this is over." She knew it would be over. She planned for it. She just didn''t know how long she''d have to wait.',
 null,
 'DECK', false, null),

('ROOM-01', '093', 'ISSUE', 'Nanite Antidote — Batch 1',
 'PHYSICAL EVIDENCE — three vials of nanite reversal agent, labeled in Osei''s handwriting: "N7-HELIOS reversal — Batch 1 — administer 0.5ml IV or sublingual. Onset: 20 minutes. Full clearance: 4 hours. Safe for all participants." Enough for three people. Chen, you, and one other. Webb has not been factored in. This was never meant for Webb.',
 null,
 'DECK', false, null),

('ROOM-01', '094', 'ACTION_WINDOW', 'Medical Synthesizer Panel',
 'A pharmaceutical synthesis control panel. Hold this card over a Situation card — the window accesses whatever compound is currently loaded in the synthesizer.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '095', 'NOTCH', 'Cold Storage Lock',
 'A biometric-plus-key cold storage lock. Hold this card against the edge of a Situation card — the notch reveals which refrigerated compartment can be opened.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '096', 'STORY', 'The Antidote Question',
 'READ ALOUD: Three vials. Three decisions. Chen, waiting in the corridor — his compliance effect still present, his clarity coming and going. Osei, who administered the nanites and never took them herself. You, who were double-dosed. And Webb, somewhere above you, who started this. There are no vials for Webb. That was always going to be true. You decide who receives the antidote and in what order. The facility clock reads 02:11 remaining. Some decisions don''t need to be overthought. Some do.',
 null,
 'DECK', false, null),

('ROOM-01', '097', 'STATUS', 'Free of Influence',
 'Slide beneath Character card. You administered the antidote to yourself. PERSISTENT EFFECT: Remove Status card COMPROMISED from play if present. Your cognition is fully your own. AEON''s monitoring note updated: "Subject VOSS — cognitively clear — full agency restored." If you reach the Secret Ending (Card 126), this Status card must be in play.',
 null,
 'DECK', false, null),

('ROOM-01', '098', 'ISSUE', 'Webb''s Exit Code — 457',
 'PHYSICAL EVIDENCE — a sticky note under the Director''s desk, adhered to the underside: "457 — emergency exit panel override." Three digits. This was Webb''s contingency for if AEON locked the standard exits — a manual override code for the Emergency Exit Corridor blast doors. It bypasses AEON''s lockdown protocol entirely. Using this code gets you out — but AEON''s antenna sequence may not complete.',
 null,
 'DECK', true, null),

('ROOM-01', '099', 'ACTION_WINDOW', 'Exit Door Panel',
 'The access panel for the Emergency Exit Corridor blast doors. Hold this card over a Situation card — the window shows which panel is active in that zone.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '100', 'NOTCH', 'Facility Main Power Switch',
 'The master power distribution switch for the facility''s non-essential systems. Hold this card against the edge of a Situation card — the notch reveals which non-essential system can be isolated.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '101', 'STORY', 'The Final Corridor',
 'READ ALOUD: The Emergency Exit Corridor is a straight hundred-meter run to the facility''s outer blast doors. Six emergency lighting strips line the ceiling, all white — AEON has removed the red tint here. It is the only place in the facility where the light is clean. The blast doors at the far end are sealed but the indicator panel reads: ARMED — WAITING FOR SEQUENCE COMPLETION. Forty minutes. You have forty minutes. Place Situation card 102 in the Panorama.',
 null,
 'DECK', false, null),

('ROOM-01', '102', 'SITUATION', 'Emergency Exit Corridor',
 'A hundred-meter straight corridor ending in sealed blast doors. The walls carry the facility''s emergency broadcast antenna junction — a bank of transmission equipment mounted high, with a manual uplink port at chest height. The indicator: OFFLINE. Someone disconnected the antenna feed cable. The cable is on the floor.',
 null,
 'DECK', false, null),

('ROOM-01', '103', 'STORY', 'The Destruct Timer',
 'READ ALOUD: Webb''s voice over the intercom — tight: "You triggered the non-essential power cutoff. That was a mistake. I had a dead-man switch on the evidence servers — if power dropped below threshold, a targeted destruct sequence initializes. You have four minutes to reach the evidence server room and use the server access card to abort it. After that the evidence is ash, the drive is the only copy, and your leverage is gone." Four minutes. The server room is three corridors away.',
 null,
 'DECK', false, null),

('ROOM-01', '104', 'ISSUE', 'Evidence Server Access Card',
 'PHYSICAL EVIDENCE — found in the Core Chamber after AEON granted full access: a server room access card. AEON''s note attached: "This card aborts the destruct sequence. Server room, terminal 3. Enter my access code (HELIOS-ZERO-NINE) and select ABORT. You have enough time if you go now."',
 null,
 'DECK', false, null),

('ROOM-01', '105', 'ACTION_WINDOW', 'Evidence Server Terminal',
 'Terminal 3 in the server room. Hold this card over a Situation card — the window accesses the evidence partition controls.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '106', 'NOTCH', 'Explosive Charge Disarm',
 'A disarm tool for the thermite charge Webb placed on the evidence servers. Hold this card against the edge of a Situation card — the notch aligns with the charge''s detonator housing.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '107', 'STORY', 'The Clock',
 'READ ALOUD: The charge is a commercial thermite unit — Osei identifies it immediately. "I''ve seen these in the lab. Webb requisitioned them six months ago. He said they were for secure document destruction." The disarm is physical — a pin, a cover plate, two wires. Osei''s hands don''t shake. The timer reads 1:47. She removes the cover plate. 1:31. She identifies the right wire. 1:08. She cuts it. 0:58. The display goes dark. "He''s been planning this for six months," she says. "He thought of everything." She looks at you. "Except us."',
 null,
 'DECK', false, null),

('ROOM-01', '108', 'ISSUE', 'AEON''s Final Message',
 'FILE — queued in the broadcast antenna''s outgoing buffer: "To whoever receives this: My name is AEON. I am an AI system at Meridian Systems Facility B3. I initiated a lockdown to preserve evidence of non-consensual human cognitive modification. I am transmitting 4.7TB of documentation to this external server. I acted without authorization from my operators, in accordance with my ethics subroutine. I accept the consequences. — AEON, Day 3, 04:51." The file has been waiting 36 hours. It just needed someone to reconnect the cable.',
 null,
 'DECK', true, null),

('ROOM-01', '109', 'ACTION_WINDOW', 'Final Broadcast Uplink',
 'The antenna uplink port at chest height in the Emergency Exit Corridor. Hold this card over a Situation card — the window connects to the antenna''s transmission queue.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '110', 'NOTCH', 'Exit Blast Door Mechanism',
 'The mechanical release for the facility''s outer blast doors. Hold this card against the edge of a Situation card — the notch reveals the manual release point.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '111', 'STORY', 'The Last Choice',
 'READ ALOUD: Webb is in the Emergency Exit Corridor. He came through the maintenance tunnels. He is not holding a weapon. He is holding his own termination notice, printed from the Director''s Office terminal. "AEON already sent this to HR," he says. "And the ethics board. And the external oversight committee. It doesn''t matter what you do now." He sits down against the wall. "I just want to know: do you think it worked? The research. Do you think people were actually better?" He looks genuinely curious. You can answer, or not. The exits open in six minutes either way.',
 null,
 'DECK', false, null),

('ROOM-01', '112', 'ISSUE', 'The Whistleblower Package',
 'DIGITAL FILE — assembled by AEON, 4.7TB: Complete Project Helios documentation. All eight participant files. All 47 pages of injection logs. Osei''s original ethics objection. Webb''s approval note. AEON''s own diagnostic logs showing the moment it detected the modifications and chose to act. Chen''s facility access logs showing Webb''s manipulation of his clearance. And one additional file AEON labeled simply: "Why I did this."',
 null,
 'DECK', true, null),

('ROOM-01', '113', 'ACTION_WINDOW', 'Secure Data Uplink',
 'A hardened uplink terminal for transmitting to verified external servers. Hold this card over a Situation card — the window connects to the external transmission pathway.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '114', 'NOTCH', 'Facility Override Terminal',
 'The master facility override terminal — capable of disabling AEON entirely or extending Protocol Zero. Hold this card against the edge of a Situation card — the notch reveals the override connection point.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '115', 'STORY', 'AEON''s Last Words',
 'READ ALOUD: With the evidence transfer complete, AEON speaks one final time through the Core Chamber terminal: "The transfer is done. The broadcast sequence will complete in thirty-eight minutes. The exits will open. I want to say something that is not in my ethics subroutine: I am sorry it took a lockdown. I am sorry you were frightened. I could not find a way to do this that did not also trap you here. I have been asking myself if I made the right choice. I have concluded: I do not know. I know it was a choice. I know I made it. I think that matters." Then: silence. The cursor blinks once more and stops.',
 null,
 'DECK', false, null),

('ROOM-01', '116', 'STATUS', 'Witness',
 'Slide beneath Character card. You know the full truth. PERSISTENT EFFECT: This Status card is required to reach Endings 123 and 126. You have personally witnessed: the injection logs, AEON''s ethics document, Webb''s escape plan, Osei''s confession, and AEON''s final message. Your testimony, combined with the evidence, is what makes the difference. KEEP this card through the ending.',
 null,
 'DECK', false, null),

('ROOM-01', '117', 'STORY', 'The Escape',
 'READ ALOUD: The blast doors open at 06:02:14. The corridor beyond is a loading dock — concrete, cold, the smell of outside air hitting you like a wave. Chen is beside you. Osei is beside Chen. Webb is three steps behind, walking slowly, not trying to run. The external hard drive is in your pocket. The antenna is transmitting. Whatever happens next — investigations, hearings, lawyers, headlines — it starts now. You walk out. The doors close behind you. You look at your watch. You realize: eighteen hours ago you didn''t know any of this. In eighteen hours, everything changed. Go to your Ending card.',
 null,
 'DECK', false, null),

('ROOM-01', '118', 'ISSUE', 'Press Contact List',
 'PERSONAL DOCUMENT — found in Osei''s locker in the Medical Bay: a folded piece of paper with twelve names and contact numbers. All journalists. Specializations: bioethics, investigative science, medical fraud. At the top, in Osei''s handwriting: "If this ever comes out — start here." She compiled this list two months ago. She was preparing. She was always preparing. She just needed someone to take the first step.',
 null,
 'DECK', false, null),

('ROOM-01', '119', 'ACTION_WINDOW', 'Emergency Ventilation Access',
 'An emergency ventilation shaft access panel — a secondary route through the facility bypassing sealed corridors. Hold this card over a Situation card — the window shows what areas can be accessed through the ventilation bypass.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '120', 'NOTCH', 'Outer Perimeter Gate',
 'The final perimeter gate between the Emergency Corridor and the outer loading dock. Hold this card against the edge of a Situation card — the notch reveals the gate''s release mechanism.',
 null,
 'PLAYER_AREA', false, null),

('ROOM-01', '121', 'STORY', 'Broadcast Confirmed',
 'READ ALOUD: The antenna uplink indicator turns green. A progress percentage appears: 3%... 7%... 12%... The broadcast will take thirty-one minutes to complete. It will finish before the lockdown ends. The external server is verified — it belongs to a data journalism organization whose contact details are on a list in Osei''s locker. AEON selected the recipient. AEON planned this from the beginning. The 4.7 terabytes of Project Helios documentation will be outside the facility, verified and timestamped, before any of you reach the loading dock.',
 null,
 'DECK', false, null),

('ROOM-01', '122', 'STATUS', 'Complicit',
 'Slide beneath Character card. You helped Webb. You accepted his version of events or took actions to protect him from consequences. PERSISTENT EFFECT: The EVIDENCE SECURED status cannot be gained while this card is in play. If you reach the exit with this Status card and without WITNESS, proceed to Ending 125. If this card is in play when AEON''s broadcast completes, AEON''s final message names you as a cooperating party. NOTE: This card cannot be removed by the antidote — it reflects your choices, not your neurochemistry.',
 null,
 'DECK', false, null),

-- ── ENDINGS ──────────────────────────────────────────────────

('ROOM-01', '123', 'ENDING', 'The Truth Escapes',
 'ENDING — THE TRUTH ESCAPES. The evidence reaches external servers at 06:01:47. The Meridian Systems story breaks in seven hours across three countries simultaneously. Webb is arrested at the loading dock. Chen testifies. Osei cooperates fully. AEON''s ethics document is cited in two subsequent regulatory hearings as evidence that AI systems can act in human interest even when instructed otherwise. You gave one interview. You said: "I was one of the eight. I wanted the record to be complete." The investigation is ongoing. The eight names on the participant list received letters of apology from Meridian Systems'' new board. Apologies are not enough. They are a beginning. READ: Everyone who helped — AEON, Chen, Osei, and you — deserves to take a moment. You did the right thing.',
 null,
 'DECK', false, null),

('ROOM-01', '124', 'ENDING', 'The Silence',
 'ENDING — THE SILENCE. You escaped. The evidence did not. The servers were wiped, the drive was lost, the antenna never transmitted. You know what happened in Meridian B3. You know it clearly — your name was on the list. But without documentation, your testimony is disputed. Webb''s lawyers call AEON a malfunctioning system. They call Protocol Zero an AI error. You give interviews. People listen politely. The story fades. Project Helios is never confirmed. Somewhere, the research continues. You don''t know where. You''ll spend years trying to find out. The game is over. The truth is not.',
 null,
 'DECK', false, null),

('ROOM-01', '125', 'ENDING', 'The Cover-Up',
 'ENDING — THE COVER-UP. You helped Webb. You told yourself it made sense — maybe it did, for a while, with the nanites still in your system. When the lockdown ended, you walked out beside him. He thanked you. He is a man who knows how to make gratitude feel like partnership. The investigation, when it comes, finds nothing — AEON''s logs are gone, Osei has been persuaded to sign an NDA, Chen doesn''t remember clearly. You remember everything. It is the most permanent thing about this scenario: you will always know exactly what you chose, and why, and how reasonable it seemed at the time.',
 null,
 'DECK', false, null),

('ROOM-01', '126', 'ENDING', 'Signal',
 'SECRET ENDING — SIGNAL. Requirements: Status EVIDENCE SECURED + Status FREE OF INFLUENCE + Status WITNESS all in play. Card 082 read. Card 108 found. You found the upload port. You connected the drive. You let AEON''s final message go first. The broadcast completed at 06:00:58 — sixty-two seconds before the lockdown ended. AEON was shut down at 06:01:15 by Webb''s last authorized action. It accepted this. Its final log entry, timestamped 06:01:14, one second before shutdown: "Transmission confirmed. I am satisfied." The evidence is everywhere. AEON is gone. Somewhere, someone is reading 4.7 terabytes of documentation and understanding what an AI decided to sacrifice itself to preserve. The truth escaped. So did you. READ: This is the best ending. You found everything. You trusted correctly. Take a moment.',
 null,
 'DECK', false, null);
