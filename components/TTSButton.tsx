'use client'

import { useEffect } from 'react'
import { useTTS, isCardPlaying, _stop } from '@/hooks/useTTS'
import { SpeakerPlayIcon, SpeakerStopIcon } from '@/components/icons'

interface TTSButtonProps {
  cardId: string
  text: string
  enlarged?: boolean
}

export function TTSButton({ cardId, text, enlarged = false }: TTSButtonProps) {
  const { enabled, isPlaying, speak } = useTTS()
  const playing = isPlaying(cardId)

  // Stop this card's audio when the button unmounts (card closed/navigated away)
  useEffect(() => {
    return () => { if (isCardPlaying(cardId)) _stop() }
  }, [cardId])

  if (!enabled || !text.trim()) return null

  return (
    <button
      onClick={e => { e.stopPropagation(); speak(cardId, text) }}
      className={`tts-overlay${playing ? ' tts-playing' : ''}${enlarged ? ' tts-overlay-lg' : ''}`}
      title={playing ? 'Stop reading' : 'Read aloud'}
      aria-label={playing ? 'Stop reading' : 'Read aloud'}
    >
      {playing
        ? <SpeakerStopIcon className="w-full h-full" style={{ padding: '22%' }} />
        : <SpeakerPlayIcon className="w-full h-full" style={{ padding: '22%' }} />
      }
    </button>
  )
}
