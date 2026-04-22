import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { text, voice = 'autumn' } = await req.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY
    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not set' }, { status: 500 })
    }

    const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'canopylabs/orpheus-v1-english',
        input: text,
        voice: voice,
        response_format: 'wav',
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Groq TTS error:', errText)
      return NextResponse.json({ error: `Groq Error: ${errText}` }, { status: response.status })
    }

    const buffer = await response.arrayBuffer()
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/wav',
      },
    })
  } catch (error) {
    console.error('TTS Route Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
