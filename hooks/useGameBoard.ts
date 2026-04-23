import { useState, useEffect, useCallback } from 'react'
import { useSensors, useSensor, PointerSensor, TouchSensor, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { supabase } from '@/lib/supabase'
import { JoinedAsset, CardPosition, RoomParticipant, ConsequenceEvent, PANORAMA_TYPES, ACTION_TYPES, OBJECTIVE_TYPES, OBJECTIVE_ZONE_TYPES, resolveCardType } from '@/types'

export interface GameBoardState {
  items: JoinedAsset[]
  loading: boolean
  toast: string | null
  toastSticky: boolean
  setToast: (msg: string | null) => void
  dismissToast: () => void
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
  drawCardByNumber: (cardNumber: string) => Promise<void>
  resetGame: () => Promise<void>
  clearStoryZone: () => Promise<void>
  consequenceLog: ConsequenceEvent[]
}

/** UUID v4 fallback for non-secure contexts (HTTP on local network). */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

/** Normalise zone strings from DB/legacy values to the canonical set. */
function normaliseZone(raw: string | null | undefined): string {
  const z = (raw ?? 'DECK').toUpperCase()
  // Legacy aliases
  if (z === 'PLAYER' || z === 'HAND') return 'PLAYER_AREA'
  if (z === 'CHARACTER_ZONE' || z === 'CHAR') return 'OBJECTIVE'
  if (z === 'PANORAMA_AREA') return 'PANORAMA'
  // OBJECTIVE_ZONE didn't exist before — no alias needed
  return z
}

/** Like normaliseZone but corrects OBJECTIVE cards that were stored under the CHARACTER zone. */
function resolveZone(raw: string | null | undefined, cardType: string): string {
  const zone = normaliseZone(raw)
  if (zone === 'OBJECTIVE' && OBJECTIVE_ZONE_TYPES.has(cardType)) return 'OBJECTIVE_ZONE'
  return zone
}

export function useGameBoard(): GameBoardState {
  const [items, setItems]                       = useState<JoinedAsset[]>([])
  const [loading, setLoading]                   = useState(true)
  const [toast, setToast]                       = useState<string | null>(null)
  const [toastSticky, setToastSticky]           = useState(false)
  const [activeId, setActiveId]                 = useState<string | null>(null)
  const [roomCode, setRoomCode]                 = useState<string | null>(null)
  const [availableRooms, setAvailableRooms]     = useState<string[]>([])
  const [roomParticipants, setRoomParticipants] = useState<Record<string, RoomParticipant[]>>({})
  const [isMicMuted, setIsMicMuted]             = useState(false)
  const [isDeafened, setIsDeafened]             = useState(false)
  const [cachedId, setCachedId]                 = useState<string | null>(null)
  const [liveKitToken, setLiveKitToken]         = useState<string | null>(null)
  const [liveKitUrl, setLiveKitUrl]             = useState<string | null>(null)
  const [consequenceLog, setConsequenceLog]     = useState<ConsequenceEvent[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  const dismissToast = useCallback(() => {
    setToast(null)
    setToastSticky(false)
  }, [])

  // Auto-dismiss only non-sticky toasts
  useEffect(() => {
    if (!toast || toastSticky) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast, toastSticky])

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
        // Resolve or create local player identity (backstories-prefixed keys)
        let cid   = localStorage.getItem('backstories-id')
        let cname = localStorage.getItem('backstories-name')
        // Migrate old escape-room keys if present
        if (!cid) cid = localStorage.getItem('escape-room-id') ?? null
        if (!cname) cname = localStorage.getItem('escape-room-name') ?? null
        if (!cid || !cname) {
          cid   = generateId()
          cname = `Player-${Math.floor(Math.random() * 1000)}`
        }
        localStorage.setItem('backstories-id',   cid)
        localStorage.setItem('backstories-name', cname)
        setCachedId(cid)

        const savedMute   = localStorage.getItem('backstories-mic-muted') === 'true'
        const savedDeafen = localStorage.getItem('backstories-deafened')  === 'true'
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

            const rawZone = pos?.current_zone ?? a.default_zone ?? 'DECK'
            const zone    = resolveZone(rawZone, resolveCardType(a))

            let slot = pos?.panorama_slot ?? null
            if (zone === 'PANORAMA' && !slot) slot = fallbackSlot <= 8 ? fallbackSlot++ : null

            return {
              ...a,
              state_id:      pos?.id ?? a.id,
              current_zone:  zone,
              panorama_slot: slot,
              attached_to:   pos?.attached_to ?? null,
              flip_state:    (pos?.flip_state ?? 'front') as 'front' | 'back',
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

    // Realtime: sync card position changes made by other clients
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
              ? {
                  ...i,
                  state_id:      pos.id,
                  current_zone:  normaliseZone(pos.current_zone),
                  panorama_slot: pos.panorama_slot,
                  attached_to:   pos.attached_to,
                  flip_state:    (pos.flip_state ?? 'front') as 'front' | 'back',
                }
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
    setToastSticky(false)
    setToast('Resolving...')
    const res  = await fetch('/api/interact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionId, panoramaId, roomCode }),
    })
    const data = await res.json()
    if (data.message) {
      setToastSticky(true)
      setToast(data.message)
    }

    // Append consequence events to log (keep last 50)
    if (data.consequences?.length) {
      const newEvents: ConsequenceEvent[] = data.consequences.map((c: { description: string; severity: ConsequenceEvent['severity'] }) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: Date.now(),
        description: c.description,
        severity: c.severity ?? 'info',
      }))
      setConsequenceLog(prev => [...prev, ...newEvents].slice(-50))
    }

    // Realtime subscription handles state sync — no manual local update needed
  }, [roomCode])

  /** If a STORY card is about to enter STORY_ZONE, discard any existing STORY_ZONE card. */
  const clearStoryZone = useCallback(async () => {
    const existing = items.filter(i => i.current_zone === 'STORY_ZONE')
    for (const old of existing) await moveAsset(old.state_id, 'DISCARD', null)
  }, [items, moveAsset])

  /** Draw the next card from the top of the sorted deck (lowest card_number). */
  const drawCard = useCallback(async () => {
    const deck = items.filter(i => i.current_zone === 'DECK')
    if (deck.length === 0) return setToast('The deck is empty!')
    const card     = deck[0]
    const type     = resolveCardType(card)
    const destZone = OBJECTIVE_ZONE_TYPES.has(type) ? 'OBJECTIVE_ZONE'
                   : OBJECTIVE_TYPES.has(type)      ? 'OBJECTIVE'
                   : type === 'STORY'               ? 'STORY_ZONE'
                   : 'PLAYER_AREA'
    if (destZone === 'STORY_ZONE') await clearStoryZone()
    await moveAsset(card.state_id, destZone, null)
    setToast(`Drawn: ${card.title || `Card #${card.card_number}`}`)
  }, [items, moveAsset, clearStoryZone])

  /**
   * Draw a specific card by its card_number (only valid if has_magnifying_glass is true).
   * Matches the "Discussing the Card Number" rule in the rulebook.
   */
  const drawCardByNumber = useCallback(async (rawInput: string) => {
    const inputNum = parseInt(rawInput.trim(), 10)
    if (isNaN(inputNum)) return setToast(`"${rawInput.trim()}" is not a valid card number.`)

    const card = items.find(i =>
      parseInt(i.card_number ?? '0', 10) === inputNum &&
      i.current_zone === 'DECK'
    )
    if (!card) {
      // Card already drawn — silently skip (common when story text draws same card twice)
      return
    }

    const type     = resolveCardType(card)
    const destZone = OBJECTIVE_ZONE_TYPES.has(type) ? 'OBJECTIVE_ZONE'
                   : OBJECTIVE_TYPES.has(type)      ? 'OBJECTIVE'
                   : type === 'STORY'               ? 'STORY_ZONE'
                   : 'PLAYER_AREA'
    if (destZone === 'STORY_ZONE') await clearStoryZone()
    await moveAsset(card.state_id, destZone, null)
    setToast(`Drew: ${card.title || `Card #${card.card_number}`}`)
  }, [items, moveAsset, clearStoryZone])

  const resetGame = useCallback(async () => {
    if (!roomCode) return
    // Delete all card_positions for this room — cards revert to their default_zone
    const { error } = await supabase
      .from('card_positions')
      .delete()
      .eq('room_code', roomCode)
    if (error) { console.error('resetGame error:', error); return }
    // Optimistic local reset
    setItems(prev => prev.map(a => ({
      ...a,
      current_zone:  resolveZone(a.default_zone, resolveCardType(a)) as JoinedAsset['current_zone'],
      panorama_slot: null,
      attached_to:   null,
    })))
    setToast('Game reset — all cards returned to the deck.')
  }, [roomCode])

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveId(e.active.id as string)
    // Dismiss any sticky interaction toast when the player picks up a new card
    setToast(null)
    setToastSticky(false)
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
    const isDraggedAction   = ACTION_TYPES.has(cardType)
    const isDraggedObjective = OBJECTIVE_TYPES.has(cardType)

    // ── Player Area ────────────────────────────────────────────
    if (overId === 'zone-PLAYER_AREA') {
      await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
      return
    }

    // ── Discard ────────────────────────────────────────────────
    if (overId === 'zone-DISCARD') {
      await moveAsset(dragged.state_id, 'DISCARD', null)
      return
    }

    // ── Objective Zone (chapter objectives — two-sided flip) ───
    if (overId === 'zone-OBJECTIVE_ZONE') {
      if (cardType !== 'OBJECTIVE') {
        setToast('Only Objective cards go in the Objective slot.')
        await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
      } else {
        await moveAsset(dragged.state_id, 'OBJECTIVE_ZONE', null)
      }
      return
    }

    // ── Panorama slots ─────────────────────────────────────────
    if (overId.startsWith('panorama-')) {
      const slot     = parseInt(overId.replace('panorama-', ''), 10)
      const occupant = items.find(i => i.current_zone === 'PANORAMA' && i.panorama_slot === slot)

      if (!occupant) {
        // Empty slot — only Situation cards can be placed here
        if (isDraggedPanorama) {
          await moveAsset(dragged.state_id, 'PANORAMA', slot)
        } else if (isDraggedAction) {
          setToast('Drop an Action card on top of a Situation card to use it.')
          await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
        } else {
          await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
        }
        return
      }

      // Occupied slot
      const occupantIsPanorama = PANORAMA_TYPES.has(resolveCardType(occupant))

      if (occupantIsPanorama && isDraggedAction) {
        // Action card dropped onto a Situation card → perform the interaction
        const existingAction = items.find(i =>
          i.current_zone === 'PANORAMA' && i.panorama_slot === slot && i.state_id !== occupant.state_id
        )
        if (existingAction) {
          setToast('Only one Action card can be played on a Situation at a time.')
          await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
        } else {
          await moveAsset(dragged.state_id, 'PANORAMA', slot)
          await triggerInteract(dragged.id, occupant.id)
        }
      } else if (isDraggedPanorama && occupantIsPanorama) {
        // Swapping situation cards — put new one in slot, send old to discard
        await moveAsset(occupant.state_id, 'DISCARD', null)
        await moveAsset(dragged.state_id, 'PANORAMA', slot)
      } else {
        await triggerInteract(dragged.id, occupant.id)
      }
      return
    }

    // ── Character Area (Character + Status cards) ──────────────
    if (overId === 'zone-OBJECTIVE') {
      if (!isDraggedObjective) {
        setToast('Only Character and Status cards go in the Character area.')
        await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
        return
      }

      const occupantChar = items.find(i => i.current_zone === 'OBJECTIVE' && resolveCardType(i) === 'CHARACTER')

      if (cardType === 'CHARACTER') {
        if (occupantChar) {
          setToast('A Character card is already in the Objective area.')
          await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
        } else {
          await moveAsset(dragged.state_id, 'OBJECTIVE', 99)
        }
      } else if (cardType === 'STATUS') {
        if (!occupantChar) {
          setToast('Place a Character card in the Objective area first.')
          await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
        } else {
          // Status cards slide beneath the Character card (same zone, stacked)
          await moveAsset(dragged.state_id, 'OBJECTIVE', 98)
          await triggerInteract(dragged.id, occupantChar.id)
        }
      } else if (cardType === 'ENDING') {
        // Ending card drawn → place in Objective area, game over
        await moveAsset(dragged.state_id, 'OBJECTIVE', 97)
        setToast('An Ending card has been drawn — the adventure concludes!')
      } else {
        await moveAsset(dragged.state_id, 'PLAYER_AREA', null)
      }
      return
    }
  }, [items, moveAsset, triggerInteract])

  return {
    items, loading, toast, toastSticky, setToast, dismissToast,
    activeId, roomCode, setRoomCode,
    availableRooms, roomParticipants,
    isMicMuted, setIsMicMuted,
    isDeafened, setIsDeafened,
    cachedId, liveKitToken, liveKitUrl,
    sensors, handleDragStart, handleDragEnd,
    drawCard, drawCardByNumber, resetGame, clearStoryZone,
    consequenceLog,
  }
}
