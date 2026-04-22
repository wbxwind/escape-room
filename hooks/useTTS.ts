import { useState, useEffect } from 'react'

// ── Voice presets for Groq TTS ────────────────────────────────────────────────
export type TTSPreset = 'autumn' | 'hannah' | 'daniel' | 'diana' | 'troy' | 'austin' // Orpheus voices
export const TTS_PRESETS: Record<TTSPreset, { label: string }> = {
  autumn: { label: 'Autumn (Female)' },
  hannah: { label: 'Hannah (Female)' },
  daniel: { label: 'Daniel (Male)' },
  diana: { label: 'Diana (Female)' },
  troy: { label: 'Troy (Male)' },
  austin: { label: 'Austin (Male)' },
}

// ── Module-level singleton — one utterance across all card instances ──────────
let _playingId: string | null = null
let _currentAudio: HTMLAudioElement | null = null
const _subs = new Set<() => void>()

function _notify() {
  _subs.forEach(fn => fn())
}

function _getEnabled(): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem('backstories-tts') !== 'false'
}

export function setTTSEnabled(val: boolean) {
  if (typeof window === 'undefined') return
  localStorage.setItem('backstories-tts', String(val))
  if (!val) _stop()
  _notify()
}

function _getPreset(): TTSPreset {
  if (typeof window === 'undefined') return 'autumn'
  const stored = localStorage.getItem('backstories-tts-preset')
  return (stored && stored in TTS_PRESETS) ? (stored as TTSPreset) : 'autumn'
}

export function setTTSPreset(preset: TTSPreset) {
  if (typeof window === 'undefined') return
  localStorage.setItem('backstories-tts-preset', preset)
  _notify()
}

export async function speakCard(id: string, text: string) {
  if (typeof window === 'undefined' || !_getEnabled() || !text.trim()) return

  if (_playingId === id) {
    _stop()
    return
  }

  _stop()

  _playingId = id
  _notify() // Update UI to show "loading" or playing state immediately

  try {
    const voice = _getPreset()
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Failed to fetch TTS:', errorData)
      _playingId = null
      _notify()
      return
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    _currentAudio = new Audio(url)

    _currentAudio.onended = () => {
      _playingId = null
      _notify()
      URL.revokeObjectURL(url) // Cleanup
    }

    _currentAudio.onerror = () => {
      _playingId = null
      _notify()
      URL.revokeObjectURL(url) // Cleanup
    }

    await _currentAudio.play()
  } catch (error) {
    console.error('TTS Playback Error:', error)
    _playingId = null
    _notify()
  }
}

export function _stop() {
  if (typeof window === 'undefined') return
  if (_currentAudio) {
    _currentAudio.pause()
    _currentAudio.currentTime = 0
    _currentAudio = null
  }
  _playingId = null
  _notify()
}

export function isCardPlaying(id: string): boolean {
  return _playingId === id
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useTTS() {
  const [, rerender] = useState(0)
  const [enabled, setEnabled] = useState(_getEnabled)
  const [preset, setPresetState] = useState(_getPreset)

  useEffect(() => {
    const update = () => {
      rerender(n => n + 1)
      setEnabled(_getEnabled())
      setPresetState(_getPreset())
    }
    _subs.add(update)
    return () => { _subs.delete(update) }
  }, [])

  return {
    enabled,
    preset,
    isPlaying: isCardPlaying,
    speak: speakCard,
    stop: _stop,
    toggleEnabled: () => setTTSEnabled(!_getEnabled()),
    setPreset: setTTSPreset,
  }
}
