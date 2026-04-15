export type Zone =
  | 'DECK'
  | 'PLAYER_AREA'
  | 'PANORAMA'
  | 'DISCARD'
  | 'CHARACTER_ZONE'
  | 'STORY_ZONE'
  | 'OBJECTIVE'

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

export const PANORAMA_TYPES = new Set(['PANORAMA', 'SITUATION'])
export const ACTION_TYPES   = new Set(['ACTION', 'ACTION_WINDOW', 'WINDOW'])
