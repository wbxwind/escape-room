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

/** -- Seed Data -- */
const DUMMY_ASSETS = [
  { card_number: '1', type_string: 'PANORAMA', title: 'Rusty Door', content_front: 'A heavy iron door locked tight.', content_back: 'The door opens to reveal another hallway.', default_zone: 'DECK' },
  { card_number: '2', type_string: 'PANORAMA', title: 'Wall Panel', content_front: 'Strange markings on the wall.', content_back: 'Hidden compartment found!', default_zone: 'DECK' },
  { card_number: '3', type_string: 'ITEM', title: 'Key', content_front: 'An old rusted key.', content_back: '', default_zone: 'DECK' },
  { card_number: '4', type_string: 'ACTION', title: 'Unlock', content_front: 'Try to unlock a door.', content_back: '', default_zone: 'DECK' },
  { card_number: '5', type_string: 'WINDOW', title: 'Magnifying Glass', content_front: 'Inspect closely. 🔍', content_back: '', default_zone: 'DECK' },
]

/** -- Components -- */

function CardBody({ asset }: { asset: JoinedAsset }) {
  const computedType = (asset.type_string || asset.type || 'UNKNOWN').toUpperCase()
  const isPanorama = computedType === 'PANORAMA' || computedType === 'SITUATION'
  const isWindow = computedType === 'WINDOW' || computedType === 'ACTION_WINDOW'

  return (
    <div className={`card-base ${isPanorama ? 'card-panorama w-[200px] h-[300px]' : 'card-item w-[150px] h-[225px]'} 
      ${isWindow ? 'bg-cyan-900 border-dashed border-2 border-cyan-400' : 'bg-slate-800'} 
      rounded-xl flex flex-col p-3 shadow-xl relative overflow-hidden select-none`}>
      {isWindow && (
        <div className="absolute inset-4 border border-cyan-400/50 bg-black/50 rounded-lg backdrop-blur-sm pointer-events-none" />
      )}
      <div className="z-10 text-[10px] text-zinc-400 font-mono tracking-widest">{computedType.replace('_', ' ')} #{asset.card_number}</div>
      <div className="z-10 text-lg font-bold text-white mt-1 leading-tight">{asset.title}</div>
      <div className="z-10 text-xs text-zinc-300 mt-2">{asset.content_front}</div>
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
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.3 : 1,
    transition: transform ? 'none' : 'transform 0.2s',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab hover:scale-[1.02] active:cursor-grabbing">
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
      if (localParticipant.isMicrophoneEnabled === isMicMuted) {
        localParticipant.setMicrophoneEnabled(!isMicMuted).catch(console.error)
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
    <div className="absolute bottom-[20rem] md:bottom-28 right-4 bg-black/80 border border-slate-700/50 p-4 rounded-xl shadow-2xl z-50 min-w-[200px] backdrop-blur-md">
      <h3 className="text-[10px] font-mono tracking-widest text-emerald-500/80 mb-3 uppercase flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${!isMicMuted && !isDeafened ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}/>
        Voice Comms
      </h3>
      <div className="flex flex-col gap-3">
        {participants.map(p => {
           const isMe = p.identity === localParticipant?.identity
           return (
           <div key={p.identity} className="flex gap-3 items-center">
             <div className="relative">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${p.isSpeaking && !isDeafened ? 'text-white ring-2' : 'text-slate-400'} ${isMe ? (p.isSpeaking && !isDeafened ? 'bg-blue-600 ring-blue-400' : 'bg-slate-800') : (p.isSpeaking && !isDeafened ? 'bg-emerald-600 ring-emerald-400' : 'bg-slate-800')}`}>
                 {p.name?.substring(0, 2).toUpperCase() || '??'}
               </div>
               <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
                  <TrackMutedIndicator trackRef={{ participant: p, source: Track.Source.Microphone }} show={'muted'} className="!w-3 !h-3" />
               </div>
             </div>
             <span className={`text-sm font-semibold pl-1 ${p.isSpeaking && !isDeafened ? 'text-white' : 'text-slate-400'} ${isMe ? 'opacity-80' : ''}`}>{p.name || p.identity} {isMe ? '(You)' : ''}</span>
           </div>
        )})}
        {participants.length === 0 && (
          <div className="text-xs text-slate-500 italic">Waiting for players...</div>
        )}
      </div>
      
      <div className="mt-4 flex gap-2 w-full">
        <button onClick={handleMuteToggle} className={`flex-1 transition-colors py-2 rounded flex items-center justify-center ${isMicMuted ? 'bg-rose-900/50 hover:bg-rose-900 border border-rose-500/30' : 'bg-slate-800 hover:bg-slate-700'}`}>
          {isMicMuted ? <MicOffIcon className="w-4 h-4 text-rose-300" /> : <MicIcon className="w-4 h-4 text-slate-200" />}
        </button>
        <button onClick={handleDeafenToggle} className={`flex-1 transition-colors py-2 rounded flex items-center justify-center ${isDeafened ? 'bg-rose-900/50 hover:bg-rose-900 border border-rose-500/30' : 'bg-slate-800 hover:bg-slate-700'}`}>
          {isDeafened ? <AudioOffIcon className="w-4 h-4 text-rose-300" /> : <AudioIcon className="w-4 h-4 text-slate-200" />}
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
  const [cachedId, setCachedId] = useState<string | null>(localStorage.getItem('escape-room-id'))

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

        // Seed dummy assets if table is completely empty for demo
        if (!assets || assets.length === 0) {
          const seed = DUMMY_ASSETS.map(d => ({ ...d, room_code: roomCode }))
          const { data: insertedAssets } = await supabase.from('game_assets').insert(seed).select()
          assets = insertedAssets || []
        }

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

    const draggedAsset = items.find(i => i.state_id === active.id)
    if (!draggedAsset) return

    const overId = String(over.id)

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
      // Check if occupied to trigger an interaction instead!
      const occupant = items.find(i => i.current_zone === 'PANORAMA' && i.panorama_slot === slotNum)

      if (occupant) {
        // Evaluate interaction
        await triggerInteract(draggedAsset.id, occupant.id)
      } else {
        // Move to slot
        await moveAsset(draggedAsset.state_id, 'PANORAMA', slotNum)
      }
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

        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          
          {/* Room Navigator Sidebar */}
          <div className="hidden md:flex w-48 bg-[#0a0a0a] border-r border-white/5 p-4 flex-col items-start gap-4 overflow-y-auto">
            <h3 className="text-xs font-mono tracking-widest text-slate-500 border-b border-slate-800 pb-2 w-full uppercase">Lobby Rooms</h3>
            <div className="flex flex-col gap-2 w-full">
              {availableRooms.map(r => (
                 <div key={r} className="w-full flex flex-col gap-1">
                   <button 
                      onClick={() => setRoomCode(r)}
                      className={`w-full text-left px-3 py-2 rounded text-sm font-semibold transition ${r === roomCode ? 'bg-cyan-950 border border-cyan-400/30 text-cyan-200' : 'bg-slate-900 hover:bg-slate-800 text-slate-400'}`}
                    >
                     Room: {r}
                   </button>
                   {roomParticipants[r] && roomParticipants[r].length > 0 && (
                     <div className="flex flex-col pl-3 mt-1 ml-1 border-l-2 border-slate-800 space-y-1">
                        {roomParticipants[r].map(p => (
                           <div key={p.user_id} className="flex items-center gap-2 text-xs font-medium text-slate-400 py-0.5 group">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-700"></div>
                             <span className="truncate flex-1">{p.username}</span>
                             <div className="flex gap-1 items-center opacity-40 group-hover:opacity-100 transition-opacity">
                               {p.is_muted && <MicOffIcon className="w-2.5 h-2.5 text-slate-500" />}
                               {p.is_deafened && <AudioOffIcon className="w-2.5 h-2.5 text-slate-500" />}
                             </div>
                           </div>
                        ))}
                     </div>
                   )}
                 </div>
              ))}
              {availableRooms.length === 0 && <span className="text-xs text-slate-600 italic">No rooms loaded...</span>}
            </div>
          </div>

          {/* Panorama Area */}
          <div className="flex-1 bg-gradient-to-b from-[#0A0A0A] to-[#0A0F15] p-4 md:p-8 overflow-auto">
            <h2 className="text-xs font-mono tracking-widest text-cyan-800 mb-6 uppercase">The Panorama</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 md:gap-6 content-start max-w-5xl mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(slot => {
                const occupant = items.find(i => i.current_zone === 'PANORAMA' && i.panorama_slot === slot)
                return (
                  <DropZone key={slot} id={`panorama-${slot}`} label={`[ SLOT ${slot} ]`} className="h-[250px] aspect-[2/3]">
                    {occupant && <DraggableCard asset={occupant} />}
                  </DropZone>
                )
              })}
            </div>
          </div>

          {/* Discard & Log */}
          <DropZone id="zone-DISCARD" className="w-full md:w-64 h-48 md:h-auto bg-black/50 border-t md:border-t-0 md:border-l border-white/5 p-4 flex flex-col items-center overflow-hidden flex-none">
            <h2 className="text-xs font-mono tracking-widest text-rose-800 mb-2 md:mb-4 uppercase self-start w-full text-center flex-none">Discard</h2>
            <div className="flex flex-row md:flex-col w-full items-center flex-1 overflow-x-auto md:overflow-y-auto overflow-y-hidden md:overflow-x-hidden md:pb-10 pt-4 md:pt-0 pr-4 md:pr-2 pl-16 md:pl-0">
                {items.filter(i => i.current_zone === 'DISCARD').map((item, idx) => (
                  <div key={item.state_id} className={`scale-[0.55] md:scale-[0.65] origin-center md:origin-top ${idx > 0 ? 'md:-mt-[140px] -ml-[90px] md:-ml-0' : ''} transition-transform hover:translate-y-[-10px]`} style={{ zIndex: idx }}>
                    <CardBody asset={item} />
                  </div>
                ))}
            </div>
          </DropZone>
        </div>

        {/* Player Bottom Area */}
        <DropZone id="zone-PLAYER_AREA" className="flex-none h-48 md:h-72 border-t border-white/10 bg-slate-900/50 p-4 md:p-6 !rounded-none !border-0 flex items-end overflow-x-auto">
          <div className="flex gap-4 items-end mx-auto">
            {items.filter(i => i.current_zone === 'PLAYER_AREA').map(item => (
              <DraggableCard key={item.state_id} asset={item} />
            ))}
            {items.filter(i => i.current_zone === 'PLAYER_AREA').length === 0 && (
              <div className="h-48 flex items-center justify-center text-slate-500 font-mono text-sm w-full">
                Your hand is empty. Draw cards to begin.
              </div>
            )}
          </div>
        </DropZone>

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
      <LiveKitRoom serverUrl={liveKitUrl} token={liveKitToken} connect={true} audio={true}>
         {viewBase}
         <VoiceHUD 
            isMicMuted={isMicMuted} 
            setIsMicMuted={(val: boolean) => { setIsMicMuted(val); localStorage.setItem('is-mic-muted', String(val)); }}
            isDeafened={isDeafened}
            setIsDeafened={(val: boolean) => { setIsDeafened(val); localStorage.setItem('is-deafened', String(val)); }}
            cachedId={cachedId}
          />
         {!isDeafened && <RoomAudioRenderer />}
      </LiveKitRoom>
    )
  }

  return viewBase
}