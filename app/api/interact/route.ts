import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import type { Consequence, GateCondition } from '@/types'

// ── Types ─────────────────────────────────────────────────────────────────────

interface CardRow {
  id: string
  card_number: string
  type: string | null
  title: string
  window_band: string | null
  action_subtype: string | null
  consumable: boolean
  back_a: string | null
  back_b: string | null
  back_c: string | null
  notch_draw_a: string | null
  notch_draw_b: string | null
  notch_draw_c: string | null
  status_gate: GateCondition[] | null
  replaces_card_number: string | null
}

interface PositionRow {
  id: string
  asset_id: string
  current_zone: string
  flip_state: string
}

interface InteractionRow {
  id: string
  window_band: string | null
  status_modifier: string | null
  effect_text: string | null
  consequences: Consequence[] | null
}

interface ConsequenceResult {
  description: string
  severity: 'info' | 'warning' | 'danger' | 'success'
}

type Supa = ReturnType<typeof createServerClient>

// ── Helpers ───────────────────────────────────────────────────────────────────

async function upsertPosition(supabase: Supa, roomCode: string, assetId: string, zone: string, slot: number | null) {
  await supabase.from('card_positions').upsert(
    { room_code: roomCode, asset_id: assetId, current_zone: zone, panorama_slot: slot, updated_at: new Date().toISOString() },
    { onConflict: 'room_code,asset_id' },
  )
}

function zoneForType(type: string | null): string {
  if (!type) return 'PLAYER_AREA'
  if (type === 'STORY') return 'STORY_ZONE'
  if (['CHARACTER', 'STATUS', 'OBJECTIVE', 'ENDING'].includes(type)) return 'OBJECTIVE'
  return 'PLAYER_AREA'
}

// heldStatusNums: card_number strings of STATUS cards currently in OBJECTIVE zone
// positionsByAssetId: map of asset_id → PositionRow for item/zone_presence checks
function evaluateGates(
  gates: GateCondition[] | null,
  heldStatusNums: string[],
  positionsByAssetId: Map<string, PositionRow>,
): boolean {
  if (!gates || gates.length === 0) return false
  return gates.every(gate => {
    if (gate.type === 'status') return heldStatusNums.includes(gate.card_number)
    if (gate.type === 'item') {
      const pos = positionsByAssetId.get(gate.card_number)
      return pos?.current_zone === gate.zone
    }
    if (gate.type === 'zone_presence') {
      const pos = positionsByAssetId.get(gate.card_number)
      return pos?.current_zone === gate.zone
    }
    return false
  })
}

// ── Consequence executor ──────────────────────────────────────────────────────

async function executeConsequences(
  consequences: Consequence[],
  roomCode: string,
  supabase: Supa,
  triggeringAssetId: string,
): Promise<ConsequenceResult[]> {
  const results: ConsequenceResult[] = []

  for (const c of consequences) {
    switch (c.type) {

      case 'DRAW_CARD': {
        const { data: card } = await supabase.from('game_assets').select('id, title, type').eq('card_number', c.card_number).maybeSingle()
        if (card) {
          const zone = zoneForType(card.type)
          // STORY cards replace the current STORY_ZONE occupant — discard old first
          if (zone === 'STORY_ZONE') {
            const { data: storyZonePositions } = await supabase
              .from('card_positions').select('asset_id').eq('room_code', roomCode).eq('current_zone', 'STORY_ZONE')
            if (storyZonePositions) {
              for (const pos of storyZonePositions) await upsertPosition(supabase, roomCode, pos.asset_id, 'DISCARD', null)
            }
          }
          await upsertPosition(supabase, roomCode, card.id, zone, null)
          results.push({ description: `Drew: ${card.title}`, severity: 'info' })
        }
        break
      }

      case 'DRAW_CARDS': {
        for (const num of c.card_numbers) {
          const { data: card } = await supabase.from('game_assets').select('id, title, type').eq('card_number', num).maybeSingle()
          if (card) {
            await upsertPosition(supabase, roomCode, card.id, zoneForType(card.type), null)
            results.push({ description: `Drew: ${card.title}`, severity: 'info' })
          }
        }
        break
      }

      case 'DRAW_RANGE': {
        const from = parseInt(c.from, 10)
        const to   = parseInt(c.to, 10)
        const { data: cards } = await supabase.from('game_assets').select('id, title, type, card_number')
        if (cards) {
          const inRange = cards.filter(card => {
            const n = parseInt(card.card_number ?? '0', 10)
            return n >= from && n <= to
          })
          for (const card of inRange) await upsertPosition(supabase, roomCode, card.id, zoneForType(card.type), null)
          results.push({ description: `Drew cards ${c.from}–${c.to} (${inRange.length} cards)`, severity: 'info' })
        }
        break
      }

      case 'DISCARD_CARD': {
        const { data: card } = await supabase.from('game_assets').select('id, title').eq('card_number', c.card_number).maybeSingle()
        if (card) {
          await upsertPosition(supabase, roomCode, card.id, 'DISCARD', null)
          results.push({ description: `Discarded: ${card.title}`, severity: 'info' })
        }
        break
      }

      case 'DISCARD_SELF': {
        await upsertPosition(supabase, roomCode, triggeringAssetId, 'DISCARD', null)
        results.push({ description: 'Card discarded.', severity: 'info' })
        break
      }

      case 'DISCARD_PANORAMA': {
        const { data: positions } = await supabase.from('card_positions').select('asset_id').eq('room_code', roomCode).eq('current_zone', 'PANORAMA')
        if (positions) {
          for (const pos of positions) await upsertPosition(supabase, roomCode, pos.asset_id, 'DISCARD', null)
        }
        results.push({ description: 'Board cleared.', severity: 'warning' })
        break
      }

      case 'RETURN_TO_DECK': {
        const { data: card } = await supabase.from('game_assets').select('id, title').eq('card_number', c.card_number).maybeSingle()
        if (card) {
          await upsertPosition(supabase, roomCode, card.id, 'DECK', null)
          results.push({ description: `Returned ${card.title} to deck.`, severity: 'info' })
        }
        break
      }

      case 'FLIP_CARD_SELF': {
        await supabase.from('card_positions').update({ flip_state: 'back', updated_at: new Date().toISOString() })
          .eq('room_code', roomCode).eq('asset_id', triggeringAssetId)
        results.push({ description: 'Card flipped.', severity: 'info' })
        break
      }

      case 'FLIP_OBJECTIVE': {
        const { data: objPositions } = await supabase.from('card_positions').select('id, asset_id')
          .eq('room_code', roomCode).eq('current_zone', 'OBJECTIVE').eq('flip_state', 'front')
        if (objPositions) {
          for (const pos of objPositions) {
            const { data: asset } = await supabase.from('game_assets').select('type').eq('id', pos.asset_id).maybeSingle()
            if (asset?.type === 'OBJECTIVE') {
              await supabase.from('card_positions').update({ flip_state: 'back', updated_at: new Date().toISOString() }).eq('id', pos.id)
              break
            }
          }
        }
        results.push({ description: 'New objective revealed.', severity: 'warning' })
        break
      }

      case 'NEW_CHAPTER': {
        const { data: objPositions } = await supabase.from('card_positions').select('id, asset_id')
          .eq('room_code', roomCode).eq('current_zone', 'OBJECTIVE')
        if (objPositions) {
          for (const pos of objPositions) {
            const { data: asset } = await supabase.from('game_assets').select('type, objective_chapter').eq('id', pos.asset_id).maybeSingle()
            if (asset?.type === 'OBJECTIVE') {
              await upsertPosition(supabase, roomCode, pos.asset_id, 'DISCARD', null)
              const nextChapter = (asset.objective_chapter ?? 1) + 1
              const { data: nextObj } = await supabase.from('game_assets').select('id').eq('type', 'OBJECTIVE').eq('objective_chapter', nextChapter).maybeSingle()
              if (nextObj) {
                await upsertPosition(supabase, roomCode, nextObj.id, 'OBJECTIVE', null)
                results.push({ description: `Chapter ${nextChapter} begins.`, severity: 'warning' })
              }
              break
            }
          }
        }
        break
      }

      case 'DAMAGE_CHARACTER': {
        const { data: objPositions } = await supabase.from('card_positions').select('id, asset_id, flip_state')
          .eq('room_code', roomCode).eq('current_zone', 'OBJECTIVE')
        if (objPositions) {
          for (const pos of objPositions) {
            const { data: asset } = await supabase.from('game_assets').select('type').eq('id', pos.asset_id).maybeSingle()
            if (asset?.type === 'CHARACTER') {
              if (pos.flip_state === 'front') {
                await supabase.from('card_positions').update({ flip_state: 'back', updated_at: new Date().toISOString() }).eq('id', pos.id)
                results.push({ description: 'Character weakened.', severity: 'danger' })
              } else {
                results.push({ description: 'Character critically damaged.', severity: 'danger' })
              }
              break
            }
          }
        }
        break
      }

      case 'GAIN_STATUS': {
        const { data: statusCard } = await supabase.from('game_assets').select('id, title').eq('card_number', c.card_number).maybeSingle()
        if (statusCard) {
          const { data: existing } = await supabase.from('card_positions').select('id, flip_state')
            .eq('room_code', roomCode).eq('asset_id', statusCard.id).eq('current_zone', 'OBJECTIVE').maybeSingle()
          if (!existing) {
            await upsertPosition(supabase, roomCode, statusCard.id, 'OBJECTIVE', null)
            results.push({ description: `Status gained: ${statusCard.title}`, severity: 'warning' })
          } else if (existing.flip_state === 'front') {
            await supabase.from('card_positions').update({ flip_state: 'back', updated_at: new Date().toISOString() }).eq('id', existing.id)
            results.push({ description: `${statusCard.title} escalated.`, severity: 'danger' })
          } else {
            // already escalated — chain to damage character
            await executeConsequences([{ type: 'DAMAGE_CHARACTER' }], roomCode, supabase, triggeringAssetId)
            results.push({ description: `${statusCard.title} critical — character damaged.`, severity: 'danger' })
          }
        }
        break
      }

      case 'REMOVE_STATUS': {
        const { data: statusCard } = await supabase.from('game_assets').select('id, title').eq('card_number', c.card_number).maybeSingle()
        if (statusCard) {
          await upsertPosition(supabase, roomCode, statusCard.id, 'DECK', null)
          results.push({ description: `${statusCard.title} cleared.`, severity: 'success' })
        }
        break
      }

      case 'PLACE_TO_PANORAMA': {
        const { data: newCard } = await supabase.from('game_assets').select('id, title, replaces_card_number').eq('card_number', c.card_number).maybeSingle()
        if (newCard) {
          if (newCard.replaces_card_number) {
            const { data: oldCard } = await supabase.from('game_assets').select('id, title').eq('card_number', newCard.replaces_card_number).maybeSingle()
            if (oldCard) {
              const { data: oldPos } = await supabase.from('card_positions').select('id')
                .eq('room_code', roomCode).eq('asset_id', oldCard.id).eq('current_zone', 'PANORAMA').maybeSingle()
              if (oldPos) {
                await upsertPosition(supabase, roomCode, oldCard.id, 'DISCARD', null)
                results.push({ description: `${newCard.title} replaces ${oldCard.title} in the board.`, severity: 'info' })
              }
            }
          }
          await upsertPosition(supabase, roomCode, newCard.id, 'PANORAMA', null)
        }
        break
      }
    }
  }

  return results
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { actionId, panoramaId, roomCode } = await req.json()
    if (!actionId || !panoramaId || !roomCode) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Fetch cards + all room positions in parallel
    const [actionResult, situationResult, positionsResult] = await Promise.all([
      supabase.from('game_assets')
        .select('id, card_number, type, title, window_band, action_subtype, consumable, back_a, back_b, back_c, notch_draw_a, notch_draw_b, notch_draw_c, status_gate, replaces_card_number')
        .eq('id', actionId).maybeSingle(),
      supabase.from('game_assets')
        .select('id, card_number, type, title, window_band, action_subtype, consumable, back_a, back_b, back_c, notch_draw_a, notch_draw_b, notch_draw_c, status_gate, replaces_card_number')
        .eq('id', panoramaId).maybeSingle(),
      supabase.from('card_positions').select('id, asset_id, current_zone, flip_state').eq('room_code', roomCode),
    ])

    const actionCard    = actionResult.data    as CardRow | null
    const situationCard = situationResult.data as CardRow | null
    const positions     = (positionsResult.data ?? []) as PositionRow[]

    if (!actionCard || !situationCard) {
      return NextResponse.json({ success: false, message: 'Card not found.' }, { status: 404 })
    }

    // Build lookup structures for gate evaluation
    const positionsByAssetId = new Map(positions.map(p => [p.asset_id, p]))

    // Get card_numbers of STATUS cards held in OBJECTIVE zone
    const objectiveAssetIds = positions.filter(p => p.current_zone === 'OBJECTIVE').map(p => p.asset_id)
    let heldStatusNums: string[] = []
    if (objectiveAssetIds.length > 0) {
      const { data: statusAssets } = await supabase
        .from('game_assets').select('card_number, type').in('id', objectiveAssetIds)
      heldStatusNums = (statusAssets ?? []).filter(a => a.type === 'STATUS').map(a => a.card_number).filter(Boolean) as string[]
    }

    const band    = (actionCard.window_band ?? 'a') as 'a' | 'b' | 'c'
    const subtype = actionCard.action_subtype ?? 'reveal'
    const gateActive = evaluateGates(situationCard.status_gate, heldStatusNums, positionsByAssetId)

    // Interaction lookup chain:
    // 1. Status-gated row matching a held status (highest priority)
    // 2. Band-specific row (no status gate)
    // 3. Any row for this pair (null band, null status — catches all legacy rows)
    let interaction: InteractionRow | null = null
    const iBase = supabase.from('interactions')
      .select('id, window_band, status_modifier, effect_text, consequences')
      .eq('action_card_id', actionId).eq('situation_card_id', panoramaId)

    // Try status-gated rows — one per held status card
    for (const statusNum of heldStatusNums) {
      const r = await iBase.eq('status_modifier', statusNum).maybeSingle()
      if (r.data) { interaction = r.data as InteractionRow; break }
    }
    // Try band-specific no-gate row
    if (!interaction && actionCard.window_band) {
      const r = await iBase.eq('window_band', band).is('status_modifier', null).maybeSingle()
      interaction = r.data as InteractionRow | null
    }
    // Final fallback: any row with null window_band + null status_modifier (all legacy rows)
    if (!interaction) {
      const r = await iBase.is('window_band', null).is('status_modifier', null).maybeSingle()
      interaction = r.data as InteractionRow | null
    }

    // Determine reveal text
    let revealText: string

    if (subtype === 'reveal') {
      const bandText = band === 'a' ? situationCard.back_a
                     : band === 'b' ? situationCard.back_b
                     : situationCard.back_c
      revealText = interaction?.effect_text ?? bandText ?? `Nothing notable at ${situationCard.title ?? 'this location'}.`
    } else {
      const drawTarget = band === 'a' ? situationCard.notch_draw_a
                       : band === 'b' ? situationCard.notch_draw_b
                       : situationCard.notch_draw_c
      if (drawTarget) {
        const { data: targetCard } = await supabase.from('game_assets').select('id, title, type').eq('card_number', drawTarget).maybeSingle()
        if (targetCard) {
          await upsertPosition(supabase, roomCode, targetCard.id, zoneForType(targetCard.type), null)
          revealText = `${actionCard.title} → Drew: ${targetCard.title}`
        } else {
          revealText = `${actionCard.title} points somewhere, but the card isn't available.`
        }
      } else {
        revealText = `${actionCard.title} finds no connection here.`
      }
    }

    // Build consequence list from interaction row + consumable auto-discard
    const consequences: Consequence[] = [...(interaction?.consequences ?? [])]
    if (actionCard.consumable) consequences.push({ type: 'DISCARD_SELF' })

    const consequenceResults = await executeConsequences(consequences, roomCode, supabase, actionId)

    const allMessages = [revealText, ...consequenceResults.map(r => r.description)].filter(Boolean)
    const severity = consequenceResults.some(r => r.severity === 'danger') ? 'danger'
                   : consequenceResults.some(r => r.severity === 'warning') ? 'warning'
                   : 'info'

    return NextResponse.json({
      success: true,
      message: allMessages.join('\n'),
      severity,
      revealText,
      consequences: consequenceResults,
    })
  } catch (err) {
    console.error('Interact route error:', err)
    return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 })
  }
}
