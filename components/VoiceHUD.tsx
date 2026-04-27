'use client'

import { useEffect, useRef } from 'react'
import { useParticipants, useLocalParticipant, TrackMutedIndicator } from '@livekit/components-react'
import { Track } from 'livekit-client'
import { supabase } from '@/lib/supabase'
import { MicIcon, MicOffIcon, AudioIcon, AudioOffIcon } from '@/components/icons'

const SILENCE_TIMEOUT_MS = 5 * 60 * 1000

interface VoiceHUDProps {
  isMicMuted: boolean
  setIsMicMuted: (val: boolean) => void
  isDeafened: boolean
  setIsDeafened: (val: boolean) => void
  cachedId: string | null
  isVoiceConnected: boolean
  onJoinVoice: () => Promise<void>
  onDisconnectVoice: () => void
}

export function VoiceHUD(props: VoiceHUDProps) {
  const { isVoiceConnected, onJoinVoice } = props

  return (
    <div className="mt-auto w-full bg-black/40 border-t border-white/5 p-4 flex flex-col gap-3">
      <h3 className="text-[10px] font-mono tracking-widest text-emerald-500/80 mb-2 uppercase flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isVoiceConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
        Voice Comms
      </h3>

      {isVoiceConnected
        ? <ConnectedVoicePanel {...props} />
        : (
          <button
            onClick={onJoinVoice}
            className="w-full py-2 rounded text-[11px] font-mono tracking-wider text-emerald-300 bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
          >
            Join Voice
          </button>
        )
      }
    </div>
  )
}

// Only rendered when inside <LiveKitRoom> — safe to use LiveKit hooks here
function ConnectedVoicePanel({
  isMicMuted, setIsMicMuted,
  isDeafened, setIsDeafened,
  cachedId, onDisconnectVoice,
}: VoiceHUDProps) {
  const participants = useParticipants()
  const { localParticipant } = useLocalParticipant()

  // Keep hardware mic in sync
  useEffect(() => {
    if (!localParticipant) return
    if (localParticipant.isMicrophoneEnabled === !isMicMuted) return
    localParticipant.setMicrophoneEnabled(!isMicMuted).catch(console.error)
  }, [localParticipant, isMicMuted])

  // Silence auto-disconnect
  const lastActivityRef = useRef(Date.now())
  const anySpeaking = participants.some(p => p.isSpeaking) || (localParticipant?.isSpeaking ?? false)

  useEffect(() => {
    if (anySpeaking) lastActivityRef.current = Date.now()
  }, [anySpeaking])

  useEffect(() => {
    lastActivityRef.current = Date.now()
    const timer = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= SILENCE_TIMEOUT_MS) {
        onDisconnectVoice()
      }
    }, 60_000)
    return () => clearInterval(timer)
  }, [onDisconnectVoice])

  const handleMuteToggle = async () => {
    const next = !isMicMuted
    setIsMicMuted(next)
    await localParticipant?.setMicrophoneEnabled(!next).catch(console.error)
    await supabase.from('room_participants').update({ is_muted: next }).eq('user_id', cachedId)
  }

  const handleDeafenToggle = async () => {
    const next = !isDeafened
    setIsDeafened(next)
    await supabase.from('room_participants').update({ is_deafened: next }).eq('user_id', cachedId)
  }

  return (
    <>
      <div className="flex flex-col gap-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
        {participants.map(p => {
          const isMe = p.identity === localParticipant?.identity
          const isSpeakingVisible = p.isSpeaking && !isDeafened && (isMe ? !isMicMuted : true)

          return (
            <div key={p.identity} className="flex gap-2 items-center">
              <div className="relative flex-none">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                  ${isSpeakingVisible
                    ? isMe ? 'bg-blue-600 ring-1 ring-blue-400 text-white' : 'bg-emerald-600 ring-1 ring-emerald-400 text-white'
                    : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {p.name?.substring(0, 2).toUpperCase() ?? '??'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 bg-black rounded-full p-0.5">
                  <TrackMutedIndicator
                    trackRef={{ participant: p, source: Track.Source.Microphone }}
                    show="muted"
                    className="!w-2 !h-2"
                  />
                </div>
              </div>
              <span className={`text-[11px] font-medium truncate flex-1 ${isSpeakingVisible ? 'text-white' : 'text-zinc-400'}`}>
                {p.name || p.identity}{isMe ? ' (You)' : ''}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex gap-2 w-full">
        <VoiceButton active={isMicMuted} onClick={handleMuteToggle}>
          {isMicMuted ? <MicOffIcon className="w-3 h-3 text-rose-300" /> : <MicIcon className="w-3 h-3 text-zinc-300" />}
        </VoiceButton>
        <VoiceButton active={isDeafened} onClick={handleDeafenToggle}>
          {isDeafened ? <AudioOffIcon className="w-3 h-3 text-rose-300" /> : <AudioIcon className="w-3 h-3 text-zinc-300" />}
        </VoiceButton>
        <VoiceButton active={false} onClick={onDisconnectVoice} title="Disconnect from voice">
          <span className="text-[9px] font-mono text-rose-400 leading-none">END</span>
        </VoiceButton>
      </div>
    </>
  )
}

function VoiceButton({ active, onClick, children, title }: {
  active: boolean; onClick: () => void; children: React.ReactNode; title?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex-1 transition-colors py-1.5 rounded flex items-center justify-center
        ${active
          ? 'bg-rose-900/40 hover:bg-rose-900/60 border border-rose-500/20'
          : 'bg-white/5 hover:bg-white/10 border border-white/5'
        }`}
    >
      {children}
    </button>
  )
}
