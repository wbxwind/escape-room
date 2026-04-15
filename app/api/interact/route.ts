import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { actionId, panoramaId, roomCode } = await req.json()

    if (!actionId || !panoramaId || !roomCode) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Look up a defined interaction for this action + situation pair
    const { data: interaction } = await supabase
      .from('interactions')
      .select('*')
      .eq('action_card_id', actionId)
      .eq('situation_card_id', panoramaId)
      .maybeSingle()

    // Discard the action card — persists via card_positions so all clients see it
    const { error } = await supabase
      .from('card_positions')
      .upsert(
        { room_code: roomCode, asset_id: actionId, current_zone: 'DISCARD', panorama_slot: null, updated_at: new Date().toISOString() },
        { onConflict: 'room_code,asset_id' },
      )

    if (error) console.error('Interact persist error:', error)

    const message = interaction
      ? `Interaction resolved: ${interaction.result_type}`
      : `Action used — discarded to the pile.`

    return NextResponse.json({ success: true, message, interaction })
  } catch (err) {
    console.error('Interact route error:', err)
    return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 })
  }
}
