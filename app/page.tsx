'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  rectIntersection,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'

import { LiveKitRoom, RoomAudioRenderer, useParticipants, TrackMutedIndicator, useTrackToggle, useLocalParticipant } from '@livekit/components-react'
import { Track } from 'livekit-client'
import '@livekit/components-styles'

/** -- Types -- */
interface GameAsset {
  id: string
  room_code: string
  card_number: string
  type_string?: string | null
  type?: string | null
  title: string
  content_front: string
  content_back: string
  default_zone: string
}

interface RoomState {
  id: string
  room_code: string
  asset_id: string
  current_zone: 'DECK' | 'PLAYER' | 'PANORAMA' | 'DISCARD'
  panorama_slot: number | null
  attached_to: string | null
}

export type JoinedAsset = GameAsset & {
  state_id: string
  current_zone: 'DECK' | 'PLAYER_AREA' | 'PANORAMA' | 'DISCARD' | 'OBJECTIVE' | string
  panorama_slot: number | null
  attached_to: string | null
}



/** -- Components -- */

function CardBody({ asset }: { asset: JoinedAsset }) {
  const computedType = (asset.type_string || asset.type || 'UNKNOWN').toUpperCase()
  const isPanorama = computedType === 'PANORAMA' || computedType === 'SITUATION'
  const isAction = computedType === 'ACTION'
  const isWindow = computedType === 'WINDOW' || computedType === 'ACTION_WINDOW'
  const isCharacter = computedType === 'CHARACTER'
  const isStatus = computedType === 'STATUS'
  const isStory = computedType === 'STORY'

  let borderColor = 'border-white/10'
  if (isCharacter) borderColor = 'border-rose-600'
  if (isStatus) borderColor = 'border-orange-500'
  if (isStory) borderColor = 'border-purple-500'
  if (isPanorama) borderColor = 'border-blue-500'
  if (isAction || isWindow) borderColor = 'border-cyan-400'

  return (
    <div className={`card-base w-[140px] h-[210px] md:w-[150px] md:h-[225px] flex-none border-[3px] border-solid
      ${isWindow ? 'bg-cyan-950/80 border-dashed' : 'bg-slate-900/90'} 
      ${borderColor}
      rounded-xl flex flex-col p-2 md:p-3 shadow-2xl relative overflow-hidden select-none`}>
      {(isWindow || isAction) && (
        <div className={`absolute inset-0 bg-cyan-400/5 pointer-events-none`} />
      )}
      <div className="z-10 text-[10px] text-zinc-400 font-mono tracking-widest">{computedType.replace('_', ' ')} #{asset.card_number}</div>
      <div className="z-10 text-lg font-bold text-white mt-1 leading-tight line-clamp-2">{asset.title}</div>
      <div className="z-10 text-xs text-zinc-300 mt-2 line-clamp-4">{asset.content_front}</div>
    </div>
  )
}

function DraggableCard({ asset }: { asset: JoinedAsset }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: asset.state_id,
    data: asset,
  })

  // We only translate during drag
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <CardBody asset={asset} />
    </div>
  )
}

function DropZone({ id, label, className, children }: { id: string, label?: string, className?: string, children?: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className={`relative flex items-center justify-center rounded-xl transition-all ${isOver ? 'ring-2 ring-cyan-400 bg-cyan-950/20' : 'bg-black/20 border border-slate-800'} ${className}`}>
      {label && !children && <span className="text-xs font-mono text-zinc-600 uppercase">{label}</span>}
      {children}
    </div>
  )
}

const MicIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
)
const MicOffIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="2" x2="22" y1="2" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
)
const AudioIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
)
const AudioOffIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
)

function VoiceHUD({ isMicMuted, setIsMicMuted, isDeafened, setIsDeafened, cachedId }: any) {
  const participants = useParticipants()
  const { localParticipant } = useLocalParticipant()
  
  // Enforce consistent mute state across unmounts/lobby jumps natively
  useEffect(() => {
    if (localParticipant) {
      // Force hardware state to match our React state explicitly
      const shouldBeMuted = isMicMuted;
      if (localParticipant.isMicrophoneEnabled !== !shouldBeMuted) {
        localParticipant.setMicrophoneEnabled(!shouldBeMuted).catch(console.error);
      }
    }
  }, [localParticipant, isMicMuted])

  const handleMuteToggle = async () => {
    const nextVal = !isMicMuted
    setIsMicMuted(nextVal)
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(!nextVal).catch(console.error)
    }
    await supabase.from('room_participants').update({ is_muted: nextVal }).eq('user_id', cachedId)
  }

  const handleDeafenToggle = async () => {
    const nextVal = !isDeafened
    setIsDeafened(nextVal)
    await supabase.from('room_participants').update({ is_deafened: nextVal }).eq('user_id', cachedId)
  }

  return (
    <div className="mt-auto w-full bg-black/40 border-t border-white/5 p-4 flex-col gap-3 flex">
      <h3 className="text-[10px] font-mono tracking-widest text-emerald-500/80 mb-2 uppercase flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${!isMicMuted && !isDeafened ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}/>
        Voice Comms
      </h3>
      <div className="flex flex-col gap-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
        {participants.map(p => {
           const isMe = p.identity === localParticipant?.identity
           const isSpeakingVisible = p.isSpeaking && !isDeafened && (isMe ? !isMicMuted : true);
           
           return (
           <div key={p.identity} className="flex gap-2 items-center">
             <div className="relative flex-none">
               <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isSpeakingVisible ? 'text-white ring-1' : 'text-zinc-500'} ${isMe ? (isSpeakingVisible ? 'bg-blue-600 ring-blue-400' : 'bg-zinc-800') : (isSpeakingVisible ? 'bg-emerald-600 ring-emerald-400' : 'bg-zinc-800')}`}>
                 {p.name?.substring(0, 2).toUpperCase() || '??'}
               </div>
               <div className="absolute -bottom-0.5 -right-0.5 bg-black rounded-full p-0.5">
                  <TrackMutedIndicator trackRef={{ participant: p, source: Track.Source.Microphone }} show={'muted'} className="!w-2 !h-2" />
               </div>
             </div>
             <span className={`text-[11px] font-medium truncate flex-1 ${isSpeakingVisible ? 'text-white' : 'text-zinc-400'}`}>{p.name || p.identity} {isMe ? '(You)' : ''}</span>
           </div>
        )})}
      </div>
      
      <div className="mt-2 flex gap-2 w-full">
        <button onClick={handleMuteToggle} className={`flex-1 transition-colors py-1.5 rounded flex items-center justify-center ${isMicMuted ? 'bg-rose-900/40 hover:bg-rose-900/60 border border-rose-500/20' : 'bg-white/5 hover:bg-white/10 border border-white/5'}`}>
          {isMicMuted ? <MicOffIcon className="w-3 h-3 text-rose-300" /> : <MicIcon className="w-3 h-3 text-zinc-300" />}
        </button>
        <button onClick={handleDeafenToggle} className={`flex-1 transition-colors py-1.5 rounded flex items-center justify-center ${isDeafened ? 'bg-rose-900/40 hover:bg-rose-900/60 border border-rose-500/20' : 'bg-white/5 hover:bg-white/10 border border-white/5'}`}>
          {isDeafened ? <AudioOffIcon className="w-3 h-3 text-rose-300" /> : <AudioIcon className="w-3 h-3 text-zinc-300" />}
        </button>
      </div>
    </div>
  )
}

/** -- Main Page -- */
export default function EscapeRoom() {
  const [items, setItems] = useState<JoinedAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [liveKitToken, setLiveKitToken] = useState<string | null>(null)
  const [liveKitUrl, setLiveKitUrl] = useState<string | null>(null)
  
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [availableRooms, setAvailableRooms] = useState<string[]>([])
  const [roomParticipants, setRoomParticipants] = useState<Record<string, any[]>>({})

  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isDeafened, setIsDeafened] = useState(false)
  const [cachedId, setCachedId] = useState<string | null>(null)

  // Realtime dragging ghost positions from other clients
  const [externalGhosts, setExternalGhosts] = useState<Record<string, { x: number, y: number, assetId: string }>>({})

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  useEffect(() => {
    async function loadRoomsAndParticipants() {
      // 1. Fetch Rooms
      const { data: roomsData } = await supabase.from('room_state').select('room_code')
      if (roomsData) {
        const codes = Array.from(new Set(roomsData.map(r => r.room_code).filter(Boolean)))
        setAvailableRooms(codes)
        setRoomCode(current => {
          if (!current && codes.length > 0) return codes[0]
          return current
        })
      }

      // 2. Fetch Presence
      const { data: pData } = await supabase.from('room_participants').select('*')
      if (pData) {
         const map: Record<string, any[]> = {}
         pData.forEach(p => {
           if (p.room_code) {
             if (!map[p.room_code]) map[p.room_code] = []
             map[p.room_code].push(p)
           }
         })
         setRoomParticipants(map)
      }
    }
    
    loadRoomsAndParticipants()

    // Listen passively for anyone anywhere dropping into rooms
    const channel = supabase.channel('global-participants-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_participants' }, () => {
         loadRoomsAndParticipants()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!roomCode) return
    let cancelled = false
    let handleUnload: () => void;
    setLoading(true)

    async function init() {
      try {
        // Init Local Player Session
        let cid = localStorage.getItem('escape-room-id')
        let cname = localStorage.getItem('escape-room-name')
        if (!cid || !cname) {
           cid = crypto.randomUUID()
           cname = `Player-${Math.floor(Math.random() * 1000)}`
           localStorage.setItem('escape-room-id', cid)
           localStorage.setItem('escape-room-name', cname)
        }
        setCachedId(cid)

        // Load persisted audio state
        const savedMute = localStorage.getItem('is-mic-muted') === 'true'
        const savedDeafen = localStorage.getItem('is-deafened') === 'true'
        setIsMicMuted(savedMute)
        setIsDeafened(savedDeafen)

        handleUnload = () => {
          fetch('/api/leave-room', {
            method: 'POST',
            keepalive: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: cid })
          }).catch(console.error)
        }
        window.addEventListener('beforeunload', handleUnload)

        // Connect to LiveKit via Token Generation
        try {
           const res = await fetch('/api/get-voice-token', {
              method: 'POST',
              body: JSON.stringify({ roomCode, participantId: cid, participantName: cname })
           })
           const data = await res.json()
           if (data.token) {
              setLiveKitToken(data.token)
              setLiveKitUrl(process.env.NEXT_PUBLIC_LIVEKIT_URL || null)
           }
        } catch (e) {
           console.error("LiveKit connection errored:", e)
        }

        // Register presence deeply into Supabase participants
        const { data: presence } = await supabase.from('room_participants').select('*').eq('user_id', cid).maybeSingle()
        if (!presence) {
           await supabase.from('room_participants').insert({ user_id: cid, username: cname, room_code: roomCode, is_muted: savedMute, is_deafened: savedDeafen })
        } else {
           await supabase.from('room_participants').update({ last_seen: new Date().toISOString(), room_code: roomCode, is_muted: savedMute, is_deafened: savedDeafen }).eq('user_id', cid)
        }

        // Fetch game_assets
        let { data: assets, error: assetsErr } = await supabase.from('game_assets').select('*').or(`room_code.is.null,room_code.eq.${roomCode}`)

        if (assetsErr) console.error('Error fetching assets:', assetsErr)

        if (!cancelled && assets) {
          let nextPanoramaSlot = 1
          const localItems: JoinedAsset[] = assets.map(a => {
            let z = a.default_zone || 'DECK'
            if (z === 'PLAYER' || z === 'OBJECTIVE') z = 'PLAYER_AREA'
            
            let assignedSlot = null
            if (z === 'PANORAMA') {
              assignedSlot = nextPanoramaSlot <= 8 ? nextPanoramaSlot : null
              nextPanoramaSlot++
            }
            
            return {
              ...a,
              state_id: a.id,
              current_zone: z,
              panorama_slot: assignedSlot,
              attached_to: null
            }
          })
          
          setItems(localItems)
        }
      } catch (err) {
        console.error('Init exception:', err)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    init()

    // Listen to realtime transient dragging broadcasts
    const cursorChannel = supabase.channel(`cursor-${roomCode}`)
      .on('broadcast', { event: 'move' }, (payload) => {
        const { id, current_zone, panorama_slot } = payload.payload
        setItems(prev => prev.map(i => i.state_id === id ? { ...i, current_zone, panorama_slot } : i))
      })
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(cursorChannel)
      if (handleUnload) window.removeEventListener('beforeunload', handleUnload)
    }
  }, [roomCode])

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string)
  }

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over) return

    const overId = String(over.id)
    const draggedAsset = items.find(i => i.state_id === active.id)
    if (!draggedAsset) return

    // Scenario 1: Dropped onto Player hand
    if (overId === 'zone-PLAYER_AREA') {
      await moveAsset(draggedAsset.state_id, 'PLAYER_AREA', null)
      return
    }

    // Scenario 2: Dropped onto Discard
    if (overId === 'zone-DISCARD') {
      await moveAsset(draggedAsset.state_id, 'DISCARD', null)
      return
    }

    // Scenario 3: Dropped onto a Panorama Slot (Format: "panorama-X")
    if (overId.startsWith('panorama-')) {
      const slotNum = parseInt(overId.replace('panorama-', ''))
      const occupant = items.find(i => i.current_zone === 'PANORAMA' && i.panorama_slot === slotNum)
      const computedType = (draggedAsset.type_string || draggedAsset.type || '').toUpperCase()
      const isPanorama = computedType === 'PANORAMA' || computedType === 'SITUATION'

      if (occupant) {
        const occupantType = (occupant.type_string || occupant.type || '').toUpperCase()
        const isOccupantPanorama = occupantType === 'PANORAMA' || occupantType === 'SITUATION'

        if (isOccupantPanorama && !isPanorama) {
          // Check if there is already an action card attached to this panorama
          const existingAction = items.find(i => i.current_zone === 'PANORAMA' && i.panorama_slot === slotNum && i.state_id !== occupant.state_id)
          
          if (!existingAction) {
            // Move action to this slot (stacking) and trigger interaction
            await moveAsset(draggedAsset.state_id, 'PANORAMA', slotNum)
            await triggerInteract(draggedAsset.id, occupant.id)
          } else {
            await moveAsset(draggedAsset.state_id, 'PLAYER_AREA', null)
            setToast('Only one action card can be on a Panorama at a time.')
          }
        } else {
          // Both are panoramas or occupant is an action -> Trigger interaction normally
          await triggerInteract(draggedAsset.id, occupant.id)
        }
      } else if (isPanorama && !occupant) {
        // Drop Panorama in empty slot -> Move
        await moveAsset(draggedAsset.state_id, 'PANORAMA', slotNum)
      } else if (!isPanorama && !occupant) {
        // Drop non-panorama in empty slot -> Return to player area (invalid)
        await moveAsset(draggedAsset.state_id, 'PLAYER_AREA', null)
        setToast('Place action cards directly onto Panoramas to use them.')
      }
      return
    }

    // Scenario 4: Dropped onto Character Slot
    if (overId === 'character-slot') {
      const computedType = (draggedAsset.type_string || draggedAsset.type || '').toUpperCase()
      const isCharacter = computedType === 'CHARACTER'
      const isStatus = computedType === 'STATUS'
      
      const occupant = items.find(i => i.current_zone === 'CHARACTER_ZONE')
      
      if (isCharacter && !occupant) {
        await moveAsset(draggedAsset.state_id, 'CHARACTER_ZONE', 99)
      } else if (isStatus && occupant) {
        const existingStatus = items.find(i => i.current_zone === 'CHARACTER_ZONE' && (i.type_string === 'STATUS' || i.type === 'STATUS'))
        if (!existingStatus) {
           await moveAsset(draggedAsset.state_id, 'CHARACTER_ZONE', 99)
           await triggerInteract(draggedAsset.id, occupant.id)
        } else {
           await moveAsset(draggedAsset.state_id, 'PLAYER_AREA', null)
           setToast('Only one status card allowed per character.')
        }
      } else if (isCharacter && occupant) {
         setToast('Character slot is already occupied.')
         await moveAsset(draggedAsset.state_id, 'PLAYER_AREA', null)
      } else {
         setToast('Only Character cards or Status effects can go here.')
         await moveAsset(draggedAsset.state_id, 'PLAYER_AREA', null)
      }
      return
    }

    // Scenario 5: Dropped onto Story Slot
    if (overId === 'story-slot') {
      const computedType = (draggedAsset.type_string || draggedAsset.type || '').toUpperCase()
      if (computedType === 'STORY') {
        await moveAsset(draggedAsset.state_id, 'STORY_ZONE', 100)
      } else {
        setToast('Only Story cards can go here.')
        await moveAsset(draggedAsset.state_id, 'PLAYER_AREA', null)
      }
      return
    }
  }

  const moveAsset = async (state_id: string, zone: string, slot: number | null) => {
    // Optimistic / Real-time channel fallback
    setItems(prev => prev.map(i => i.state_id === state_id ? { ...i, current_zone: zone as any, panorama_slot: slot } : i))

    // Broadcast via channel
    supabase.channel(`cursor-${roomCode}`).send({
      type: 'broadcast',
      event: 'move',
      payload: { id: state_id, current_zone: zone, panorama_slot: slot }
    })
  }

  const drawCard = async () => {
    const deckCards = items.filter(i => i.current_zone === 'DECK')
    if (deckCards.length === 0) return setToast('Deck is empty!')
    const toDraw = deckCards[0]
    await moveAsset(toDraw.state_id, 'PLAYER_AREA', null)
    setToast(`Drawn ${toDraw.title}`)
  }

  const triggerInteract = async (actionId: string, panoramaId: string) => {
    setToast('Resolving interaction...')
    const res = await fetch('/api/interact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionId, panoramaId, roomCode })
    })
    const data = await res.json()
    if (data.message) setToast(data.message)
    // Server should ideally have updated the room_state in db, postgres_changes picks it up!
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#050505] text-cyan-500 font-mono text-sm uppercase">Initializing board...</div>

  const activeAsset = items.find(i => i.state_id === activeId)
  const deckCount = items.filter(i => i.current_zone === 'DECK').length

  const viewBase = (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
<style jsx global>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`}</style>
      <main className="h-screen w-screen bg-[#0A0A0A] flex flex-col text-slate-200 overflow-hidden relative font-sans">

        {/* Header */}
        <header className="flex-none p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-xl tracking-wide">BACK STORIES engine</h1>
            {/* Mobile Select */}
            <select className="md:hidden bg-slate-900 border border-slate-700 text-sm px-2 py-1 rounded" value={roomCode || ''} onChange={(e) => setRoomCode(e.target.value)}>
               {availableRooms.map(r => (
                 <option key={r} value={r}>
                   {r} {roomParticipants[r] ? `(${roomParticipants[r].length})` : ''}
                 </option>
               ))}
            </select>
            <span className="hidden md:inline-block text-cyan-500 text-sm font-mono bg-cyan-900/30 px-2 py-1 border border-cyan-500/20 rounded-md">[{roomCode}]</span>
          </div>
          <button className="px-4 py-2 bg-slate-800 text-white font-semibold rounded hover:bg-slate-700 transition" onClick={drawCard}>
            Draw Card ({deckCount})
          </button>
        </header>

        <div className="flex-1 flex flex-row min-h-0 overflow-hidden">
          
          {/* Room Navigator Sidebar (Left) */}
          <div className="flex w-32 md:w-56 bg-[#0a0a0a] border-r border-white/5 flex-col items-start gap-4 overflow-hidden flex-none">
            <div className="p-4 flex-1 flex flex-col w-full overflow-y-auto custom-scrollbar">
              <h3 className="text-[10px] font-mono tracking-widest text-slate-500 border-b border-white/5 pb-2 w-full uppercase mb-4">Lobby Rooms</h3>
              <div className="flex flex-col gap-2 w-full">
                {availableRooms.map(r => (
                   <div key={r} className="w-full flex flex-col gap-1">
                     <button 
                        onClick={() => setRoomCode(r)}
                        className={`w-full text-left px-2 md:px-3 py-2 rounded text-[11px] md:text-sm font-semibold transition ${r === roomCode ? 'bg-cyan-950 border border-cyan-400/30 text-cyan-200' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}
                      >
                       Room: {r}
                     </button>
                     {roomParticipants[r] && roomParticipants[r].length > 0 && (
                       <div className="flex flex-col pl-2 mt-1 ml-1 border-l border-white/10 space-y-1">
                          {roomParticipants[r].map(p => (
                             <div key={p.user_id} className="flex items-center gap-2 text-[10px] font-medium text-slate-500 py-0.5 group">
                               <div className="w-1 h-1 rounded-full bg-emerald-700"></div>
                               <span className="truncate flex-1">{p.username}</span>
                               <div className="flex gap-1 items-center opacity-40 group-hover:opacity-100 transition-opacity">
                                 {p.is_muted && <MicOffIcon className="w-2 h-2 text-slate-600" />}
                                 {p.is_deafened && <AudioOffIcon className="w-2 h-2 text-slate-600" />}
                               </div>
                             </div>
                          ))}
                       </div>
                     )}
                   </div>
                ))}
              </div>
            </div>
            
            <VoiceHUD 
              isMicMuted={isMicMuted} 
              setIsMicMuted={(val: boolean) => { setIsMicMuted(val); localStorage.setItem('is-mic-muted', String(val)); }}
              isDeafened={isDeafened}
              setIsDeafened={(val: boolean) => { setIsDeafened(val); localStorage.setItem('is-deafened', String(val)); }}
              cachedId={cachedId}
            />
          </div>

          {/* Center Content: Board & Hand */}
          <div className="flex-1 flex flex-col min-w-[500px] bg-gradient-to-b from-[#0A0A0A] to-[#0D0D0D] overflow-hidden">
            {/* Board Area */}
            <div className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-hidden">
              <div className="flex items-center gap-16">
                
                {/* Fixed Character & Story Column */}
                <div className="flex flex-col gap-8 flex-none">
                  {/* Character Slot */}
                  <div>
                    <h2 className="text-[9px] font-mono tracking-[0.2em] text-cyan-800/60 mb-3 uppercase text-center">Character</h2>
                    <DropZone id="character-slot" label="[ CHAR ]" className="w-[140px] h-[210px] md:w-[150px] md:h-[225px]">
                      <div className="relative w-full h-full flex items-center justify-center">
                        {(() => {
                          const charItems = items.filter(i => i.current_zone === 'CHARACTER_ZONE')
                          const sortedChar = [...charItems].sort((a, b) => {
                            const isStatusA = (a.type_string || a.type || '').toUpperCase() === 'STATUS'
                            return isStatusA ? -1 : 1
                          })
                          return sortedChar.map((item, idx) => {
                            const isPeek = activeId === item.state_id
                            return (
                              <div key={item.state_id} className={`${(idx > 0 && !isPeek) ? 'absolute top-[28px] left-0 right-0' : (isPeek ? 'relative z-50' : 'relative')}`}>
                                <DraggableCard asset={item} />
                              </div>
                            )
                          })
                        })()}
                      </div>
                    </DropZone>
                  </div>
                  {/* Story Slot */}
                  <div>
                    <h2 className="text-[9px] font-mono tracking-[0.2em] text-cyan-800/60 mb-3 uppercase text-center">Story</h2>
                    <DropZone id="story-slot" label="[ STORY ]" className="w-[140px] h-[210px] md:w-[150px] md:h-[225px]">
                      {items.find(i => i.current_zone === 'STORY_ZONE') && (
                        <DraggableCard asset={items.find(i => i.current_zone === 'STORY_ZONE')!} />
                      )}
                    </DropZone>
                  </div>
                </div>

                {/* Main Panorama Grid */}
                <div className="flex flex-col items-center">
                  <h2 className="text-[10px] font-mono tracking-widest text-cyan-800 mb-6 uppercase flex-none">The Panorama</h2>
                  <div className="grid grid-cols-4 grid-rows-2 gap-4 md:gap-8 w-fit h-fit">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(slot => {
                      const slotItems = items.filter(i => i.current_zone === 'PANORAMA' && i.panorama_slot === slot)
                      const sortedItems = [...slotItems].sort((a, b) => {
                        const typeA = (a.type_string || a.type || '').toUpperCase()
                        const isPanA = typeA === 'PANORAMA' || typeA === 'SITUATION'
                        return isPanA ? -1 : 1
                      })

                      return (
                        <DropZone key={slot} id={`panorama-${slot}`} label={`[ ${slot} ]`} className="w-[140px] h-[210px] md:w-[150px] md:h-[225px]">
                          <div className="relative w-full h-full flex items-center justify-center">
                            {sortedItems.map((item, idx) => (
                              <div key={item.state_id} className={`${idx > 0 ? 'absolute top-[28px] left-0 right-0 z-10 shadow-2xl' : 'relative'}`}>
                                <DraggableCard asset={item} />
                              </div>
                            ))}
                          </div>
                        </DropZone>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Player Hand Area */}
            <DropZone id="zone-PLAYER_AREA" className="flex-none h-48 md:h-64 border-t border-white/5 bg-black/40 p-4 md:p-6 !rounded-none !border-0 flex items-center overflow-x-auto custom-scrollbar">
              <div className="flex gap-4 items-center mx-auto px-4">
                {items.filter(i => i.current_zone === 'PLAYER_AREA').map(item => (
                  <DraggableCard key={item.state_id} asset={item} />
                ))}
                {items.filter(i => i.current_zone === 'PLAYER_AREA').length === 0 && (
                  <div className="text-slate-600 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
                    Your hand is empty. Draw cards to begin.
                  </div>
                )}
              </div>
            </DropZone>
          </div>

          {/* Discard Sidebar (Right) */}
          <DropZone id="zone-DISCARD" className="flex-none w-32 md:w-48 bg-[#0a0a0a] border-l border-white/5 p-4 flex flex-col items-center overflow-hidden">
            <h2 className="text-[10px] font-mono tracking-widest text-rose-800 mb-6 uppercase flex-none">Discard</h2>
            <div className="flex flex-col w-full items-center flex-1 overflow-y-auto custom-scrollbar pt-4 px-2 pb-20">
                {items.filter(i => i.current_zone === 'DISCARD').map((item, idx) => (
                  <div key={item.state_id} className={`transition-transform hover:translate-y-[-10px] ${idx > 0 ? '-mt-[160px]' : ''}`} style={{ zIndex: idx }}>
                    <DraggableCard asset={item} />
                  </div>
                ))}
            </div>
          </DropZone>
        </div>

        {/* Drag overlay ghost */}
        <DragOverlay dropAnimation={null}>
          {activeAsset ? <div className="opacity-80 rotate-[3deg] scale-105 transition-transform"><CardBody asset={activeAsset} /></div> : null}
        </DragOverlay>

        {toast && (
          <div className="fixed bottom-6 top-auto left-1/2 -translate-x-1/2 bg-cyan-950/80 backdrop-blur-md text-cyan-200 px-6 py-3 rounded-full border border-cyan-500/30 text-sm font-medium animate-in slide-in-from-bottom-5 fade-in z-[100]">
            {toast}
          </div>
        )}
      </main>
    </DndContext>
  )

  if (liveKitToken && liveKitUrl) {
    return (
      <LiveKitRoom serverUrl={liveKitUrl} token={liveKitToken} connect={true} audio={!isMicMuted}>
         {viewBase}
         {!isDeafened && <RoomAudioRenderer />}
      </LiveKitRoom>
    )
  }

  return viewBase
}