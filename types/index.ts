export type Zone =
  | 'DECK'
  | 'PLAYER_AREA'
  | 'PANORAMA'
  | 'DISCARD'
  | 'OBJECTIVE'       // "Character" area — Character card + Status cards (stacked beneath it)
  | 'OBJECTIVE_ZONE'  // "Objective" slot — current chapter Objective card (two-sided flip)
  | 'STORY_ZONE'      // Transit zone — Story card shown in modal, then discarded

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
  has_magnifying_glass: boolean

  // Action cards (both reveal and draw types)
  window_band: 'a' | 'b' | 'c' | null       // internal band — never shown to player
  action_subtype: 'reveal' | 'draw' | null   // reveal = show text, draw = draw a card
  window_action: string | null               // verb phrase shown on card face
  consumable: boolean                         // auto-discard after one use

  // Situation cards — band back texts
  back_a: string | null
  back_b: string | null
  back_c: string | null

  // Situation cards — notch draw targets per band
  notch_draw_a: string | null  // card number to draw when draw-type action resolves on band A
  notch_draw_b: string | null
  notch_draw_c: string | null

  // Situation cards — board grid position (player hint only, never enforced by code)
  panorama_row: number | null
  panorama_col: number | null

  // Situation cards — face caption, gate conditions, living board
  caption: string | null
  status_gate: GateCondition[] | null
  replaces_card_number: string | null        // discard this card from Panorama when entering

  // Objective / chapter
  objective_chapter: number | null           // which act this objective belongs to (1 | 2 | 3)
  is_scenario_card: boolean                  // stays on top of deck always

  // Story card draw actions — structured buttons rendered below card text
  draw_actions: Array<{
    label: string
    card_number: string
    target_zone: 'PANORAMA' | 'PLAYER_AREA' | 'OBJECTIVE' | 'DISCARD'
  }> | null
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
  flip_state: 'front' | 'back'              // two-sided card state: objectives, statuses, story cards
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

// ── Gate conditions ─────────────────────────────────────────────────────────

export type GateCondition =
  | { type: 'status';       card_number: string }
  | { type: 'item';         card_number: string; zone: Zone }
  | { type: 'zone_presence'; card_number: string; zone: Zone }

// ── Consequence types ────────────────────────────────────────────────────────

export type ConsequenceType =
  | 'DRAW_CARD'
  | 'DRAW_CARDS'
  | 'DRAW_RANGE'
  | 'DISCARD_CARD'
  | 'DISCARD_SELF'
  | 'DISCARD_PANORAMA'
  | 'RETURN_TO_DECK'
  | 'FLIP_CARD_SELF'
  | 'FLIP_OBJECTIVE'
  | 'NEW_CHAPTER'
  | 'DAMAGE_CHARACTER'
  | 'GAIN_STATUS'
  | 'REMOVE_STATUS'
  | 'PLACE_TO_PANORAMA'

export type Consequence =
  | { type: 'DRAW_CARD';        card_number: string; skip_front?: boolean }
  | { type: 'DRAW_CARDS';       card_numbers: string[] }
  | { type: 'DRAW_RANGE';       from: string; to: string }
  | { type: 'DISCARD_CARD';     card_number: string }
  | { type: 'DISCARD_SELF' }
  | { type: 'DISCARD_PANORAMA' }
  | { type: 'RETURN_TO_DECK';   card_number: string }
  | { type: 'FLIP_CARD_SELF' }
  | { type: 'FLIP_OBJECTIVE' }
  | { type: 'NEW_CHAPTER' }
  | { type: 'DAMAGE_CHARACTER' }
  | { type: 'GAIN_STATUS';      card_number: string }
  | { type: 'REMOVE_STATUS';    card_number: string }
  | { type: 'PLACE_TO_PANORAMA'; card_number: string }

// ── Consequence log entry ────────────────────────────────────────────────────

export interface ConsequenceEvent {
  id: string
  timestamp: number
  description: string
  severity: 'info' | 'warning' | 'danger' | 'success'
}

// ── Toast severity ───────────────────────────────────────────────────────────

export type ToastSeverity = 'info' | 'warning' | 'danger' | 'success'

export interface Toast {
  id: string
  message: string
  severity: ToastSeverity
  sticky?: boolean
}

// ── JoinedAsset ──────────────────────────────────────────────────────────────

export type JoinedAsset = GameAsset & {
  /** card_positions.id (or asset.id when no position record exists yet) */
  state_id: string
  current_zone: Zone | string
  panorama_slot: number | null
  attached_to: string | null
  flip_state: 'front' | 'back'
}

/** Resolves the normalised upper-case card type. */
export function resolveCardType(asset: Pick<GameAsset, 'type'>): string {
  return (asset.type || 'UNKNOWN').toUpperCase()
}

// Cards that live in the Panorama area (scene slots)
export const PANORAMA_TYPES = new Set(['PANORAMA', 'SITUATION'])

// Cards that can be played as actions (dropped onto Situation cards)
export const ACTION_TYPES = new Set(['ACTION', 'ACTION_WINDOW', 'WINDOW', 'NOTCH', 'ACTION_NOTCH'])

// Cards that live in the Character area (CHARACTER + STATUS stacked under it)
export const OBJECTIVE_TYPES = new Set(['CHARACTER', 'ENDING', 'STATUS'])

// Cards that go to the Objective slot (chapter objectives, two-sided)
export const OBJECTIVE_ZONE_TYPES = new Set(['OBJECTIVE'])

// Cards that go directly to the Player Area (hand)
export const PLAYER_AREA_TYPES = new Set(['ISSUE', 'ACTION', 'ACTION_WINDOW', 'WINDOW', 'NOTCH', 'ACTION_NOTCH'])

// Cards that go to Story Zone after being drawn
export const STORY_TYPES = new Set(['STORY'])
