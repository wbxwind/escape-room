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

import { LiveKitRoom, useParticipants, TrackMutedIndicator } from '@livekit/components-react'
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

const ROOM_CODE = 'DEMO-1'

/** -- Seed Data -- */
const DUMMY_ASSETS = [
  { room_code: ROOM_CODE, card_number: '1', type_string: 'PANORAMA', title: 'Rusty Door', content_front: 'A heavy iron door locked tight.', content_back: 'The door opens to reveal another hallway.', default_zone: 'DECK' },
  { room_code: ROOM_CODE, card_number: '2', type_string: 'PANORAMA', title: 'Wall Panel', content_front: 'Strange markings on the wall.', content_back: 'Hidden compartment found!', default_zone: 'DECK' },
  { room_code: ROOM_CODE, card_number: '3', type_string: 'ITEM', title: 'Key', content_front: 'An old rusted key.', content_back: '', default_zone: 'DECK' },
  { room_code: ROOM_CODE, card_number: '4', type_string: 'ACTION', title: 'Unlock', content_front: 'Try to unlock a door.', content_back: '', default_zone: 'DECK' },
  { room_code: ROOM_CODE, card_number: '5', type_string: 'WINDOW', title: 'Magnifying Glass', content_front: 'Inspect closely. 🔍', content_back: '', default_zone: 'DECK' },
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

function VoiceHUD() {
  const participants = useParticipants()

  return (
    <div className="absolute top-20 right-4 bg-black/80 border border-slate-700/50 p-4 rounded-xl shadow-2xl z-50 min-w-[200px] backdrop-blur-md">
      <h3 className="text-[10px] font-mono tracking-widest text-emerald-500/80 mb-3 uppercase flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
        Voice Comms
      </h3>
      <div className="flex flex-col gap-3">
        {participants.map(p => (
           <div key={p.identity} className="flex gap-3 items-center">
             <div className="relative">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${p.isSpeaking ? 'bg-emerald-600 text-white ring-2 ring-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                 {p.name?.substring(0, 2).toUpperCase() || '??'}
               </div>
               <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
                  <TrackMutedIndicator trackRef={{ participant: p, source: Track.Source.Microphone }} show={'muted'} className="!w-3 !h-3" />
               </div>
             </div>
             <span className={`text-sm font-semibold pl-1 ${p.isSpeaking ? 'text-white' : 'text-slate-400'}`}>{p.name || p.identity}</span>
           </div>
        ))}
        {participants.length === 0 && (
          <div className="text-xs text-slate-500 italic">Waiting for players...</div>
        )}
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

  // Realtime dragging ghost positions from other clients
  const [externalGhosts, setExternalGhosts] = useState<Record<string, { x: number, y: number, assetId: string }>>({})

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        // Init Local Player Session
        let cachedId = localStorage.getItem('escape-room-id')
        let cachedName = localStorage.getItem('escape-room-name')
        if (!cachedId || !cachedName) {
           cachedId = crypto.randomUUID()
           cachedName = `Player-${Math.floor(Math.random() * 1000)}`
           localStorage.setItem('escape-room-id', cachedId)
           localStorage.setItem('escape-room-name', cachedName)
        }

        // Connect to LiveKit via Token Generation
        try {
           const res = await fetch('/api/get-voice-token', {
              method: 'POST',
              body: JSON.stringify({ roomCode: ROOM_CODE, participantId: cachedId, participantName: cachedName })
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
        const { data: presence } = await supabase.from('room_participants').select('*').eq('user_id', cachedId).maybeSingle()
        if (!presence) {
           await supabase.from('room_participants').insert({ user_id: cachedId, username: cachedName, room_code: ROOM_CODE })
        } else {
           await supabase.from('room_participants').update({ last_seen: new Date().toISOString() }).eq('user_id', cachedId)
        }

        // Fetch game_assets
        let { data: assets, error: assetsErr } = await supabase.from('game_assets').select('*').or(`room_code.is.null,room_code.eq.${ROOM_CODE}`)

        if (assetsErr) console.error('Error fetching assets:', assetsErr)

        // Seed dummy assets if table is completely empty for demo
        if (!assets || assets.length === 0) {
          const { data: insertedAssets } = await supabase.from('game_assets').insert(DUMMY_ASSETS).select()
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
    const cursorChannel = supabase.channel(`cursor-${ROOM_CODE}`)
      .on('broadcast', { event: 'move' }, (payload) => {
        const { id, current_zone, panorama_slot } = payload.payload
        setItems(prev => prev.map(i => i.state_id === id ? { ...i, current_zone, panorama_slot } : i))
      })
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(cursorChannel)
    }
  }, [])

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
    supabase.channel(`cursor-${ROOM_CODE}`).send({
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
      body: JSON.stringify({ actionId, panoramaId, roomCode: ROOM_CODE })
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
          <h1 className="font-bold text-xl tracking-wide">BACK STORIES engine <span className="text-cyan-500 text-sm ml-2">[{ROOM_CODE}]</span></h1>
          <button className="px-4 py-2 bg-slate-800 text-white font-semibold rounded hover:bg-slate-700 transition" onClick={drawCard}>
            Draw Card ({deckCount})
          </button>
        </header>

        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          
          {/* Deck Sidebar */}
          <div className="hidden md:flex w-48 bg-black/20 border-r border-white/5 p-4 flex-col items-center justify-center">
            <div className="w-[120px] h-[180px] bg-indigo-950 rounded-xl border border-indigo-400/30 flex items-center justify-center font-mono text-indigo-400/50 rotate-[-2deg] shadow-lg">
              DECK
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
         <VoiceHUD />
      </LiveKitRoom>
    )
  }

  return viewBase
}