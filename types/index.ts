export type Zone =
  | 'DECK'
  | 'PLAYER_AREA'
  | 'PANORAMA'
  | 'DISCARD'
  | 'OBJECTIVE'      // Character card + Status cards (stacked beneath it)
  | 'STORY_ZONE'     // Staging zone: card displayed here while being read aloud

/** @deprecated Use OBJECTIVE instead */
export type LegacyZone = 'CHARACTER_ZONE'

export interface GameAsset {
  id: string
  room_code: string | null
  card_number: string
  type: string | null
  title: string
  content_front: string
  content_back: string
  default_zone: string
  image_url: string | null
}

export interface CardPosition {
  id: string
  room_code: string
  asset_id: string
  current_zone: string
  panorama_slot: number | null
  attached_to: string | null
  locked_by: string | null
  updated_at: string
}

export interface RoomParticipant {
  id: string
  user_id: string
  room_code: string
  username: string
  is_muted: boolean
  is_deafened: boolean
  last_seen: string
}

export type JoinedAsset = GameAsset & {
  /** The card_positions.id (or asset.id when no position record exists yet). */
  state_id: string
  current_zone: Zone | string
  panorama_slot: number | null
  attached_to: string | null
}

/** Resolves the normalised upper-case card type. */
export function resolveCardType(asset: Pick<GameAsset, 'type'>): string {
  return (asset.type || 'UNKNOWN').toUpperCase()
}

// Cards that live in the Panorama area (scene slots)
export const PANORAMA_TYPES = new Set(['PANORAMA', 'SITUATION'])

// Cards that can be played as actions (dragged onto Situation cards)
export const ACTION_TYPES = new Set(['ACTION', 'ACTION_WINDOW', 'WINDOW', 'NOTCH', 'ACTION_NOTCH'])

// Cards that live in the Objective area (character tracking)
export const OBJECTIVE_TYPES = new Set(['CHARACTER', 'ENDING', 'STATUS'])

// Cards that go directly to the Player Area (hand)
export const PLAYER_AREA_TYPES = new Set(['ISSUE', 'ACTION', 'ACTION_WINDOW', 'WINDOW', 'NOTCH', 'ACTION_NOTCH'])

// Cards that go to Discard after being read
export const STORY_TYPES = new Set(['STORY'])
