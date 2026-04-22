# Text-to-Speech (TTS) Implementation for Card Texts

**Goal:** Implement a Text-to-Speech (TTS) feature that allows users to hear the text written on the cards in the game.

## Context & Requirements:
1. **Audio Toggle on Cards:** 
   - Add a small, unobtrusive "Play Audio" icon/button to the card UI (e.g., in the header or footer of the card). 
   - Ensure the icon changes state (Play / Stop) when audio is actively playing.
2. **Audio Engine / API & Voice Selection:** 
   - **Native Web Speech API:** If using `window.speechSynthesis`, implement a function to fetch available voices (`speechSynthesis.getVoices()`). Select a specific voice that fits the game's theme (e.g., filtering for a specific locale like `en-GB` and a known, high-quality local voice). Use the `pitch` and `rate` properties to simulate a specific tone (e.g., slightly lower pitch for a dramatic, serious tone).
   - **Third-Party API (e.g., ElevenLabs, OpenAI):** If using a premium API, expose configuration variables for the `voice_id` or `model` to allow easy swapping of the voice actor/tone. Let the API handle the tonal nuances.
3. **State Management:**
   - Ensure only one audio snippet plays at a time. If a user clicks play on a new card, cancel the ongoing speech from the previous card.
   - Handle edge cases: automatically stop playback if the card is closed, unmounted, or if the user navigates away.
4. **Accessibility & Global Settings:**
   - Provide a global toggle in the UI (e.g., in a settings menu or navigation bar) to enable/disable the TTS feature globally.
   - Include a basic dropdown or selection menu in the settings allowing users to pick between a few voice options (e.g., "Narrator", "Computer", "Character") if supported by the chosen API.
5. **Responsive Design:**
   - Ensure the addition of the audio button does not disrupt the existing responsive card layout. It should scale smoothly alongside other card elements.

## Acceptance Criteria:
- Clicking the audio button reads the card's narrative text aloud.
- Visual feedback is clearly displayed during playback.
- Audio halts gracefully upon stopping or component unmounting.
- The implementation strictly adheres to the established visual design system without cluttering the card interface.
