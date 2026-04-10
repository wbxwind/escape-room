import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { roomCode, participantName, participantId } = await req.json();

    if (!roomCode || !participantName || !participantId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: 'LiveKit credentials missing from environment' }, { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantId,
      name: participantName,
    });

    at.addGrant({ roomJoin: true, room: roomCode, canPublish: true, canSubscribe: true });

    const token = await at.toJwt();
    return NextResponse.json({ token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
