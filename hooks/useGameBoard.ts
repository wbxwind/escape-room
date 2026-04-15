import { useState, useEffect, useCallback } from 'react'
import { useSensors, useSensor, PointerSensor, TouchSensor, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { supabase } from '@/lib/supabase'
import { JoinedAsset, CardPosition, RoomParticipant, PANORAMA_TYPES, resolveCardType } from '@/types'

export interface GameBoardState {
  items: JoinedAsset[]
  loading: boolean
  toast: string | null
  setToast: (msg: string | null) => void
  activeId: string | null
  roomCode: string | null
  setRoomCode: (code: string) => void
  availableRooms: string[]
  roomParticipants: Record<string, RoomParticipant[]>
  isMicMuted: boolean
  setIsMicMuted: (val: boolean) => void
  isDeafened: boolean
  setIsDeafened: (val: boolean) => void
  cachedId: string | null
  liveKitToken: string | null
  liveKitUrl: string | null
  sensors: ReturnType<typeof useSensors>
  handleDragStart: (e: DragStartEvent) => void
  handleDragEnd: (e: DragEndEvent) => Promise<void>
  drawCard: () => Promise<void>
}

export function useGameBoard(): GameBoardState {
  const [items, setItems]                       = useState<JoinedAsset[]>([])
  const [loading, setLoading]                   = useState(true)
  const [toast, setToast]                       = useState<string | null>(null)
  const [activeId, setActiveId]                 = useState<string | null>(null)
  const [roomCode, setRoomCode]                 = useState<string | null>(null)
  const [availableRooms, setAvailableRooms]     = useState<string[]>([])
  const [roomParticipants, setRoomParticipants] = useState<Record<string, RoomParticipant[]>>({})
  const [isMicMuted, setIsMicMuted]             = useState(false)
  const [isDeafened, setIsDeafened]             = useState(false)
  const [cachedId, setCachedId]                 = useState<string | null>(null)
  const [liveKitToken, setLiveKitToken]         = useState<string | null>(null)
  const [liveKitUrl, setLiveKitUrl]             = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  // Auto-dismiss toasts
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  // ── Load rooms + participant sidebar ───────────────────────

  useEffect(() => {
    async function loadRooms() {
      const [{ data: roomsData }, { data: pData }] = await Promise.all([
        supabase.from('room_state').select('room_code'),
        supabase.from('room_participants').select('*'),
      ])

      if (roomsData) {
        const codes = Array.from(new Set(roomsData.map(r => r.room_code).filter(Boolean))) as string[]
        setAvailableRooms(codes)
        setRoomCode(current => current ?? codes[0] ?? null)
      }

      if (pData) {
        const map: Record<string, RoomParticipant[]> = {}
        for (const p of pData) {
          if (p.room_code) (map[p.room_code] ??= []).push(p as RoomParticipant)
        }
        setRoomParticipants(map)
      }
    }

    loadRooms()

    const ch = supabase
      .channel('global-participants-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_participants' }, loadRooms)
      .subscribe()

    return () => { supabase.removeChannel(ch) }
  }, [])

  // ── Initialise board for the current room ─────────────────

  useEffect(() => {
    if (!roomCode) return

    let cancelled = false
    setLoading(true)

    async function init() {
      try {
        // Resolve or create local player identity
        let cid   = localStorage.getItem('escape-room-id')
        let cname = localStorage.getItem('escape-room-name')
        if (!cid || !cname) {
          cid   = crypto.randomUUID()
          cname = `Player-${Math.floor(Math.random() * 1000)}`
          localStorage.setItem('escape-room-id',   cid)
          localStorage.setItem('escape-room-name', cname)
        }
        setCachedId(cid)

        const savedMute   = localStorage.getItem('is-mic-muted') === 'true'
        const savedDeafen = localStorage.getItem('is-deafened')  === 'true'
        setIsMicMuted(savedMute)
        setIsDeafened(savedDeafen)

        // Fire-and-forget leave call on tab close
        const handleUnload = () => {
          fetch('/api/leave-room', {
            method: 'POST', keepalive: true,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: cid }),
          }).catch(console.error)
        }
        window.addEventListener('beforeunload', handleUnload)

        // LiveKit token
        try {
          const res  = await fetch('/api/get-voice-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomCode, participantId: cid, participantName: cname }),
          })
          const data = await res.json()
          if (data.token) {
            setLiveKitToken(data.token)
            setLiveKitUrl(process.env.NEXT_PUBLIC_LIVEKIT_URL ?? null)
          }
        } catch (e) {
          console.error('LiveKit token fetch failed:', e)
        }

        // Upsert presence record
        const { data: presence } = await supabase
          .from('room_participants').select('*').eq('user_id', cid).maybeSingle()

        if (!presence) {
          await supabase.from('room_participants').insert({
            user_id: cid, username: cname, room_code: roomCode,
            is_muted: savedMute, is_deafened: savedDeafen,
          })
        } else {
          await supabase.from('room_participants').update({
            last_seen: new Date().toISOString(), room_code: roomCode,
            is_muted: savedMute, is_deafened: savedDeafen,
          }).eq('user_id', cid)
        }

        // Load assets + persisted card positions
        const [{ data: assets, error: assetsErr }, { data: positions, error: posErr }] = await Promise.all([
          supabase.from('game_assets').select('*').or(`room_code.is.null,room_code.eq.${roomCode}`),
          supabase.from('card_positions').select('*').eq('room_code', roomCode),
        ])
        if (assetsErr) console.error('Assets fetch error:', assetsErr)
        if (posErr)    console.error('Positions fetch error:', posErr)

        if (!cancelled && assets) {
          const sorted = [...assets].sort((a, b) =>
            (a.card_number ?? '').localeCompare(b.card_number ?? '', undefined, { numeric: true })
          )

          let fallbackSlot = 1
          const joined: JoinedAsset[] = sorted.map(a => {
            const pos = positions?.find(p => p.asset_id === a.id) as CardPosition | undefined

            let zone = pos?.current_zone ?? a.default_zone ?? 'DECK'
            if (zone === 'PLAYER' || zone === 'OBJECTIVE') zone = 'PLAYER_AREA'

            let slot = pos?.panorama_slot ?? null
            if (zone === 'PANORAMA' && !slot) slot = fallbackSlot <= 8 ? fallbackSlot++ : null

            return {
              ...a,
              state_id:      pos?.id ?? a.id,
              current_zone:  zone,
              panorama_slot: slot,
              attached_to:   pos?.attached_to ?? null,
            }
          })
          setItems(joined)
        }

        return () => window.removeEventListener('beforeunload', handleUnload)
      } catch (err) {
        console.error('Board init error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    const cleanupPromise = init()

    // Realtime: sync card position changes made by other clients via DB writes
    const posChannel = supabase
      .channel(`card-positions-${roomCode}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'card_positions', filter: `room_code=eq.${roomCode}` },
        ({ eventType, new: row }) => {
          if (eventType === 'DELETE') return
          const pos = row as CardPosition
          setItems(prev => prev.map(i =>
            i.id === pos.asset_id
              ? { ...i, state_id: pos.id, current_zone: pos.current_zone, panorama_slot: pos.panorama_slot, attached_to: pos.attached_to }
              : i
          ))
        },
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(posChannel)
      cleanupPromise.then(cleanup => cleanup?.())
    }
  }, [roomCode])

  // ── Helpers ───────────────────────────────────────────────

  const moveAsset = useCallback(async (stateId: string, zone: string, slot: number | null) => {
    // 1. Optimistic local update
    setItems(prev => prev.map(i =>
      i.state_id === stateId
        ? { ...i, current_zone: zone as JoinedAsset['current_zone'], panorama_slot: slot }
        : i
    ))

    // 2. Persist — triggers postgres_changes for all other connected clients
    setItems(prev => {
      const asset = prev.find(i => i.state_id === stateId)
      if (asset && roomCode) {
        supabase
          .from('card_positions')
          .upsert(
            { room_code: roomCode, asset_id: asset.id, current_zone: zone, panorama_slot: slot, updated_at: new Date().toISOString() },
            { onConflict: 'room_code,asset_id' },
          )
          .then(({ error }) => { if (error) console.error('moveAsset persist error:', error) })
      }
      return prev
    })
  }, [roomCode])

  const triggerInteract = useCallback(async (actionId: string, panoramaId: string) => {
    setToast('Resolving interaction...')
    const res  = await fetch('/api/interact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionId, panoramaId, roomCode }),
    })
    const data = await res.json()
    if (data.message) setToast(data.message)
  }, [roomCode])

  const drawCard = useCallback(async () => {
    const deck = items.filter(i => i.current_zone === 'DECK')
    if (deck.length === 0) return setToast('Deck is empty!')
    await moveAsset(deck[0].state_id, 'PLAYER_AREA', null)
    setToast(`Drawn: ${deck[0].title}`)
  }, [items, moveAsset])

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveId(e.active.id as string)
  }, [])

  const handleDragEnd = useCallback(async (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over) return

    const overId  = String(over.id)
    const dragged = items.find(i => i.state_id === active.id)
    if (!dragged) return

    const cardType          = resolveCardType(dragged)
    const isDraggedPanorama = PANORAMA_TYPES.has(cardType)

    if (overId === 'zone-PLAYER_AREA') {
      await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
      return
    }

    if (overId === 'zone-DISCARD') {
      await moveAsset(dragged.state_id, 'DISCARD', null)
      return
    }

    if (overId.startsWith('panorama-')) {
      const slot     = parseInt(overId.replace('panorama-', ''), 10)
      const occupant = items.find(i => i.current_zone === 'PANORAMA' && i.panorama_slot === slot)

      if (!occupant) {
        if (isDraggedPanorama) {
          await moveAsset(dragged.state_id, 'PANORAMA', slot)
        } else {
          await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
          setToast('Place action cards directly onto Panoramas to use them.')
        }
        return
      }

      const occupantIsPanorama = PANORAMA_TYPES.has(resolveCardType(occupant))

      if (occupantIsPanorama && !isDraggedPanorama) {
        const existingAction = items.find(i =>
          i.current_zone === 'PANORAMA' && i.panorama_slot === slot && i.state_id !== occupant.state_id
        )
        if (existingAction) {
          await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
          setToast('Only one action card can be on a Panorama at a time.')
        } else {
          await moveAsset(dragged.state_id, 'PANORAMA', slot)
          await triggerInteract(dragged.id, occupant.id)
        }
      } else {
        await triggerInteract(dragged.id, occupant.id)
      }
      return
    }

    if (overId === 'character-slot') {
      const isCharacter = cardType === 'CHARACTER'
      const isStatus    = cardType === 'STATUS'
      const occupant    = items.find(i => i.current_zone === 'CHARACTER_ZONE')

      if (isCharacter && !occupant) {
        await moveAsset(dragged.state_id, 'CHARACTER_ZONE', 99)
      } else if (isStatus && occupant) {
        const existingStatus = items.find(i =>
          i.current_zone === 'CHARACTER_ZONE' && resolveCardType(i) === 'STATUS'
        )
        if (existingStatus) {
          await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
          setToast('Only one status card allowed per character.')
        } else {
          await moveAsset(dragged.state_id, 'CHARACTER_ZONE', 99)
          await triggerInteract(dragged.id, occupant.id)
        }
      } else if (isCharacter && occupant) {
        setToast('Character slot is already occupied.')
        await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
      } else {
        setToast('Only Character or Status cards can go here.')
        await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
      }
      return
    }

    if (overId === 'story-slot') {
      if (cardType === 'STORY') {
        await moveAsset(dragged.state_id, 'STORY_ZONE', 100)
      } else {
        setToast('Only Story cards can go here.')
        await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
      }
    }
  }, [items, moveAsset, triggerInteract])

  return {
    items, loading, toast, setToast,
    activeId, roomCode, setRoomCode,
    availableRooms, roomParticipants,
    isMicMuted, setIsMicMuted,
    isDeafened, setIsDeafened,
    cachedId, liveKitToken, liveKitUrl,
    sensors, handleDragStart, handleDragEnd, drawCard,
  }
}
