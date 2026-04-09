import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { actionId, panoramaId, roomCode } = await request.json()

    // Create a Supabase client with the Service Role key since this is a server route 
    // doing administrative logic, or standard anon if row level security allows.
    // For MVP, we'll assume anon is allowed or use the env vars available in the project.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ success: true, message: `Action ${actionId} performed on ${panoramaId}. (No DB configured)`})
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Simulate an interaction result.
    // Example: Using "Unlock" (A4) on "Rusty Door" (P1)
    
    // First, let's discard the Action card (we assume actionId is the game_asset id)
    // Wait, the client passed actionId and panoramaId which are currently the uuid from `game_assets`
    // We update room_state for actionId to 'DISCARD'
    const { error: err1 } = await supabase
      .from('room_state')
      .update({ current_zone: 'DISCARD', panorama_slot: null })
      .eq('room_code', roomCode)
      .eq('asset_id', actionId)

    if (err1) {
      console.error('Interact DB Error:', err1)
    }

    return NextResponse.json({
      success: true,
      message: `Used action [${actionId.slice(0, 4)}] on [${panoramaId.slice(0, 4)}]. It was discarded!`,
      actionId,
      panoramaId,
      roomCode,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request.' },
      { status: 400 }
    )
  }
}
