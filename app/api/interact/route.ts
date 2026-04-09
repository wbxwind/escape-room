import { NextResponse } from 'next/server'

/**
 * POST /api/interact
 *
 * Called when an Action card is dropped onto a Panorama card.
 * Currently a stub — returns a placeholder narrative response.
 */
export async function POST(request: Request) {
  try {
    const { actionId, panoramaId, roomCode } = await request.json()

    // Stub responses keyed by action+panorama combo
    const narratives: Record<string, string> = {
      'A1-P1': '🔍 You inspect the dark server room… blinking LEDs illuminate rows of humming racks. A loose cable catches your eye.',
      'A1-P2': "🔍 You inspect the CEO's desk… a half-open drawer reveals a sticky note with partial credentials.",
      'A2-P1': '💻 You attempt to hack the server room terminal… access logs scroll rapidly. A backdoor port is detected.',
      'A2-P2': "💻 You hack into the CEO's workstation… encrypted files begin to decrypt. A calendar entry marked 'URGENT' appears.",
    }

    const key = `${actionId}-${panoramaId}`
    const message =
      narratives[key] ??
      `⚡ Action [${actionId}] performed on [${panoramaId}] in room ${roomCode}.`

    return NextResponse.json({
      success: true,
      message,
      actionId,
      panoramaId,
      roomCode,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request.' },
      { status: 400 }
    )
  }
}
