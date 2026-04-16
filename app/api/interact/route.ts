import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { actionId, panoramaId, roomCode } = await req.json()

    if (!actionId || !panoramaId || !roomCode) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Fetch the action card and situation card in parallel
    const [{ data: actionCard }, { data: situationCard }, { data: interaction }] = await Promise.all([
      supabase.from('game_assets').select('type, title').eq('id', actionId).maybeSingle(),
      supabase.from('game_assets').select('title, content_back').eq('id', panoramaId).maybeSingle(),
      supabase.from('interactions')
        .select('*')
        .eq('action_card_id', actionId)
        .eq('situation_card_id', panoramaId)
        .maybeSingle(),
    ])

    // The action card stays in the panorama overlaid on the situation card.
    // Players drag it away manually when done — do NOT auto-discard.

    // Determine what to reveal:
    // 1. Use the interaction table's effect_text if defined
    // 2. Fall back to the situation card's content_back
    // 3. Last resort: a generic type-based message
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

    return NextResponse.json({ success: true, message: reveal, interaction })
  } catch (err) {
    console.error('Interact route error:', err)
    return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 })
  }
}
