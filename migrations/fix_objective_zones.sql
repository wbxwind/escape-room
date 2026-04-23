-- Fix zone assignments for OBJECTIVE type cards
-- OBJECTIVE type cards now go to OBJECTIVE_ZONE (the "Objective" slot)
-- rather than OBJECTIVE zone (which is the "Character" area).

-- 1. Update default_zone for all OBJECTIVE type assets
UPDATE public.game_assets
SET default_zone = 'OBJECTIVE_ZONE'
WHERE type = 'OBJECTIVE';

-- 2. Fix any live card_positions where OBJECTIVE type cards are in the OBJECTIVE zone
UPDATE public.card_positions cp
SET current_zone = 'OBJECTIVE_ZONE'
FROM public.game_assets ga
WHERE cp.asset_id = ga.id
  AND ga.type = 'OBJECTIVE'
  AND cp.current_zone = 'OBJECTIVE';

-- 3. Move any STORY type cards stuck in STORY_ZONE to DISCARD
--    (Story cards should be discarded after reading, not left in the transit zone)
UPDATE public.card_positions
SET current_zone = 'DISCARD'
WHERE current_zone = 'STORY_ZONE';

-- Verify
SELECT type, default_zone, COUNT(*) AS count
FROM public.game_assets
WHERE type IN ('OBJECTIVE', 'CHARACTER', 'STATUS', 'STORY')
GROUP BY type, default_zone
ORDER BY type, default_zone;
