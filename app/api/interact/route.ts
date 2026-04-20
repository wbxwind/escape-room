import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

const ZONE_FOR_RESULT: Record<string, string> = {
  DRAW_STORY:  'STORY_ZONE',
  DRAW_CARD:   'PLAYER_AREA',
  DRAW_STATUS: 'PLAYER_AREA',
}

export async function POST(req: NextRequest) {
  try {
    const { actionId, panoramaId, roomCode } = await req.json()

    if (!actionId || !panoramaId || !roomCode) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 })
    }

    const supabase = createServerClient()

    const [{ data: actionCard }, { data: situationCard }, { data: interaction }] = await Promise.all([
      supabase.from('game_assets').select('type, title').eq('id', actionId).maybeSingle(),
      supabase.from('game_assets').select('title, content_back').eq('id', panoramaId).maybeSingle(),
      supabase.from('interactions')
        .select('*')
        .eq('action_card_id', actionId)
        .eq('situation_card_id', panoramaId)
        .maybeSingle(),
    ])

    const isWindow = (actionCard?.type ?? '').includes('WINDOW')
    const isNotch  = (actionCard?.type ?? '').includes('NOTCH')

    let reveal: string | null = null
    if (interaction?.effect_text) {
      reveal = interaction.effect_text
    } else if (situationCard?.content_back) {
      reveal = situationCard.content_back
    } else if (isWindow) {
      reveal = `The window shows nothing unusual about ${situationCard?.title ?? 'this location'}.`
    } else if (isNotch) {
      reveal = `The notch finds no matching mechanism at ${situationCard?.title ?? 'this location'}.`
    } else {
      reveal = `No result defined for this combination.`
    }

    // If the interaction specifies a card to draw, move it to the appropriate zone
    let drawnCard: { id: string; title: string; zone: string } | null = null
    const resultType    = interaction?.result_type as string | undefined
    const targetCardNum = interaction?.target_card_number as string | undefined

    if (resultType && targetCardNum && ZONE_FOR_RESULT[resultType]) {
      const destZone = ZONE_FOR_RESULT[resultType]

      const { data: target } = await supabase
        .from('game_assets')
        .select('id, title')
        .eq('card_number', targetCardNum)
        .maybeSingle()

      if (target) {
        await supabase
          .from('card_positions')
          .upsert(
            {
              room_code:    roomCode,
              asset_id:     target.id,
              current_zone: destZone,
              panorama_slot: null,
              updated_at:   new Date().toISOString(),
            },
            { onConflict: 'room_code,asset_id' },
          )
        drawnCard = { id: target.id, title: target.title, zone: destZone }
      }
    }

    return NextResponse.json({ success: true, message: reveal, interaction, drawnCard })
  } catch (err) {
    console.error('Interact route error:', err)
    return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 })
  }
}
