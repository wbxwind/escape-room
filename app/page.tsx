'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface BoardAsset {
  id: string
  room_code: string
  asset_id: string
  asset_type: 'panorama' | 'item' | 'action'
  x_pos: number
  y_pos: number
  is_visible: boolean
  attached_to: string | null
}

/* ------------------------------------------------------------------ */
/*  Seed data (auto-inserted if the board is empty)                    */
/* ------------------------------------------------------------------ */
const SEED_ASSETS: Omit<BoardAsset, 'id'>[] = [
  { room_code: 'DEMO-1', asset_id: 'P1', asset_type: 'panorama', x_pos: 80,  y_pos: 100, is_visible: true, attached_to: null },
  { room_code: 'DEMO-1', asset_id: 'P2', asset_type: 'panorama', x_pos: 560, y_pos: 100, is_visible: true, attached_to: null },
  { room_code: 'DEMO-1', asset_id: 'I1', asset_type: 'item',     x_pos: 200, y_pos: 480, is_visible: true, attached_to: null },
  { room_code: 'DEMO-1', asset_id: 'A1', asset_type: 'action',   x_pos: 400, y_pos: 500, is_visible: true, attached_to: null },
  { room_code: 'DEMO-1', asset_id: 'A2', asset_type: 'action',   x_pos: 550, y_pos: 500, is_visible: true, attached_to: null },
]

const ASSET_LABELS: Record<string, string> = {
  P1: 'The Dark Server Room',
  P2: "The CEO's Desk",
  I1: 'Rusty Key',
  A1: 'Inspect',
  A2: 'Hack',
}

const ASSET_ICONS: Record<string, string> = {
  A1: '🔍',
  A2: '💻',
  I1: '🗝️',
}

const ROOM_CODE = 'DEMO-1'

/* ------------------------------------------------------------------ */
/*  DraggableCard                                                      */
/* ------------------------------------------------------------------ */
function DraggableCard({
  asset,
  isDraggingThis,
}: {
  asset: BoardAsset
  isDraggingThis: boolean
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: asset.id,
    data: asset,
  })

  const typeClass =
    asset.asset_type === 'panorama'
      ? 'card-panorama'
      : asset.asset_type === 'item'
        ? 'card-item'
        : 'card-action'

  const sizeClass =
    asset.asset_type === 'panorama'
      ? 'w-[400px] h-[225px]'
      : asset.asset_type === 'item'
        ? 'w-[120px] h-[120px]'
        : 'w-[100px] h-[100px]'

  const style: React.CSSProperties = {
    position: 'absolute',
    left: asset.x_pos,
    top: asset.y_pos,
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDraggingThis ? 0.4 : 1,
    zIndex: isDraggingThis ? 0 : asset.asset_type === 'panorama' ? 1 : 10,
    cursor: 'grab',
    touchAction: 'none',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card-base ${typeClass} ${sizeClass} rounded-xl select-none animate-fade-in flex flex-col items-center justify-center gap-2 p-3`}
      {...listeners}
      {...attributes}
    >
      {asset.asset_type === 'panorama' && (
        <>
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/50 font-semibold">
            Panorama
          </div>
          <div className="text-sm font-bold text-cyan-300 text-center leading-tight">
            {ASSET_LABELS[asset.asset_id] ?? asset.asset_id}
          </div>
          <div className="mt-1 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="text-[10px] text-cyan-500/40 mt-1">
            [{asset.asset_id}]
          </div>
        </>
      )}

      {asset.asset_type === 'item' && (
        <>
          <span className="text-3xl">{ASSET_ICONS[asset.asset_id] ?? '📦'}</span>
          <div className="text-xs font-bold text-amber-300 text-center">
            {ASSET_LABELS[asset.asset_id] ?? asset.asset_id}
          </div>
          <div className="text-[9px] text-amber-500/50 uppercase tracking-wider">
            Item
          </div>
        </>
      )}

      {asset.asset_type === 'action' && (
        <>
          <span className="text-2xl">{ASSET_ICONS[asset.asset_id] ?? '⚡'}</span>
          <div className="text-xs font-bold text-fuchsia-300 text-center">
            {ASSET_LABELS[asset.asset_id] ?? asset.asset_id}
          </div>
          <div className="text-[9px] text-fuchsia-500/50 uppercase tracking-wider">
            Action
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  DroppablePanorama (invisible drop-zone overlay)                     */
/* ------------------------------------------------------------------ */
function DroppablePanorama({ asset }: { asset: BoardAsset }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${asset.id}`,
    data: asset,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: asset.x_pos,
        top: asset.y_pos,
        width: 400,
        height: 225,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      className={`rounded-xl transition-all duration-300 ${
        isOver ? 'drop-target-active' : ''
      }`}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  DragOverlayCard (ghost preview while dragging)                     */
/* ------------------------------------------------------------------ */
function DragOverlayCard({ asset }: { asset: BoardAsset }) {
  const typeClass =
    asset.asset_type === 'panorama'
      ? 'card-panorama'
      : asset.asset_type === 'item'
        ? 'card-item'
        : 'card-action'

  const sizeClass =
    asset.asset_type === 'panorama'
      ? 'w-[400px] h-[225px]'
      : asset.asset_type === 'item'
        ? 'w-[120px] h-[120px]'
        : 'w-[100px] h-[100px]'

  return (
    <div
      className={`card-base ${typeClass} ${sizeClass} card-dragging rounded-xl flex flex-col items-center justify-center gap-2 p-3`}
    >
      {asset.asset_type === 'panorama' && (
        <>
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/50 font-semibold">
            Panorama
          </div>
          <div className="text-sm font-bold text-cyan-300 text-center leading-tight">
            {ASSET_LABELS[asset.asset_id] ?? asset.asset_id}
          </div>
          <div className="mt-1 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="text-[10px] text-cyan-500/40 mt-1">
            [{asset.asset_id}]
          </div>
        </>
      )}

      {asset.asset_type === 'item' && (
        <>
          <span className="text-3xl">{ASSET_ICONS[asset.asset_id] ?? '📦'}</span>
          <div className="text-xs font-bold text-amber-300 text-center">
            {ASSET_LABELS[asset.asset_id] ?? asset.asset_id}
          </div>
        </>
      )}

      {asset.asset_type === 'action' && (
        <>
          <span className="text-2xl">{ASSET_ICONS[asset.asset_id] ?? '⚡'}</span>
          <div className="text-xs font-bold text-fuchsia-300 text-center">
            {ASSET_LABELS[asset.asset_id] ?? asset.asset_id}
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Toast Component                                                    */
/* ------------------------------------------------------------------ */
function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className="toast fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-gradient-to-r from-cyan-900/90 via-emerald-900/90 to-cyan-900/90 backdrop-blur-xl border border-cyan-500/30 text-cyan-200 px-6 py-3 rounded-xl text-sm font-mono shadow-lg">
      {message}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Board Component                                               */
/* ------------------------------------------------------------------ */
export default function EscapeRoom() {
  const [assets, setAssets] = useState<BoardAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [activeAsset, setActiveAsset] = useState<BoardAsset | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  /* -- Sensors (pointer + touch) ----------------------------------- */
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  })
  const sensors = useSensors(pointerSensor, touchSensor)

  /* -- Fetch + Subscribe ------------------------------------------- */
  useEffect(() => {
    let cancelled = false

    const init = async () => {
      // Fetch existing assets
      const { data, error } = await supabase
        .from('board_assets')
        .select('*')
        .eq('room_code', ROOM_CODE)

      if (error) {
        console.error('Fetch error:', error)
        setLoading(false)
        return
      }

      // Auto-seed if the board is empty
      if (!data || data.length === 0) {
        const { data: inserted, error: seedErr } = await supabase
          .from('board_assets')
          .insert(SEED_ASSETS)
          .select()

        if (seedErr) {
          console.error('Seed error:', seedErr)
        } else if (!cancelled && inserted) {
          setAssets(inserted as BoardAsset[])
        }
      } else if (!cancelled) {
        setAssets(data as BoardAsset[])
      }

      setLoading(false)
    }

    init()

    // Realtime subscription
    const channel = supabase
      .channel('board-assets-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'board_assets',
          filter: `room_code=eq.${ROOM_CODE}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAssets((prev) => {
              if (prev.find((a) => a.id === (payload.new as BoardAsset).id)) return prev
              return [...prev, payload.new as BoardAsset]
            })
          } else if (payload.eventType === 'UPDATE') {
            setAssets((prev) =>
              prev.map((a) =>
                a.id === (payload.new as BoardAsset).id
                  ? (payload.new as BoardAsset)
                  : a
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setAssets((prev) =>
              prev.filter((a) => a.id !== (payload.old as { id: string }).id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [])

  /* -- Drag Handlers ----------------------------------------------- */
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const draggedAsset = assets.find((a) => a.id === event.active.id)
      if (draggedAsset) setActiveAsset(draggedAsset)
    },
    [assets]
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveAsset(null)

      const { active, delta, over } = event
      const movedAsset = assets.find((a) => a.id === active.id)
      if (!movedAsset) return

      const newX = Math.max(0, movedAsset.x_pos + Math.round(delta.x))
      const newY = Math.max(0, movedAsset.y_pos + Math.round(delta.y))

      // Optimistic update
      setAssets((prev) =>
        prev.map((a) =>
          a.id === movedAsset.id ? { ...a, x_pos: newX, y_pos: newY } : a
        )
      )

      // Persist to Supabase
      const { error } = await supabase
        .from('board_assets')
        .update({ x_pos: newX, y_pos: newY })
        .eq('id', movedAsset.id)

      if (error) console.error('Update error:', error)

      // Check if action was dropped on a panorama
      if (
        movedAsset.asset_type === 'action' &&
        over &&
        String(over.id).startsWith('drop-')
      ) {
        const panoramaAsset = assets.find(
          (a) => `drop-${a.id}` === String(over.id) && a.asset_type === 'panorama'
        )

        if (panoramaAsset) {
          setToast(
            `⚡ ${ASSET_LABELS[movedAsset.asset_id]} → ${ASSET_LABELS[panoramaAsset.asset_id]}`
          )

          // Fire the /api/interact call
          try {
            const res = await fetch('/api/interact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                actionId: movedAsset.asset_id,
                panoramaId: panoramaAsset.asset_id,
                roomCode: ROOM_CODE,
              }),
            })
            const data = await res.json()
            if (data.message) {
              setToast(data.message)
            }
          } catch (err) {
            console.error('Interact error:', err)
          }
        }
      }
    },
    [assets]
  )

  /* -- Panoramas for drop zones ------------------------------------ */
  const panoramas = assets.filter((a) => a.asset_type === 'panorama')

  /* -- Render ------------------------------------------------------ */
  if (loading) {
    return (
      <main className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-[#0a0b0f]">
        <div className="loading-spinner" />
        <p className="text-sm text-cyan-500/60 font-mono tracking-widest uppercase">
          Initializing system…
        </p>
      </main>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="h-screen w-screen relative overflow-hidden board-grid">
        {/* Header bar */}
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-gradient-to-b from-[#0a0b0f] via-[#0a0b0fcc] to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400/80">
              Escape Room — {ROOM_CODE}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-cyan-600/50 font-mono">
              {assets.length} assets loaded
            </span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
            </div>
          </div>
        </header>

        {/* Board area */}
        <div ref={boardRef} className="absolute inset-0" id="game-board">
          {/* Drop zones (invisible overlays on panoramas) */}
          {panoramas.map((p) => (
            <DroppablePanorama key={`drop-${p.id}`} asset={p} />
          ))}

          {/* All draggable cards */}
          {assets
            .filter((a) => a.is_visible)
            .map((asset) => (
              <DraggableCard
                key={asset.id}
                asset={asset}
                isDraggingThis={activeAsset?.id === asset.id}
              />
            ))}
        </div>

        {/* Drag overlay (the ghost that follows the cursor) */}
        <DragOverlay dropAnimation={null}>
          {activeAsset ? <DragOverlayCard asset={activeAsset} /> : null}
        </DragOverlay>

        {/* Bottom legend */}
        <footer className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-8 py-3 bg-gradient-to-t from-[#0a0b0f] via-[#0a0b0fcc] to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border border-cyan-500/40 bg-cyan-500/10" />
            <span className="text-[10px] text-cyan-400/60 font-mono uppercase">Panorama</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border border-amber-500/40 bg-amber-500/10" />
            <span className="text-[10px] text-amber-400/60 font-mono uppercase">Item</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border border-fuchsia-500/40 bg-fuchsia-500/10" />
            <span className="text-[10px] text-fuchsia-400/60 font-mono uppercase">Action</span>
          </div>
          <span className="text-[9px] text-white/20 font-mono ml-4">
            Drop an Action onto a Panorama to interact
          </span>
        </footer>

        {/* Toast */}
        {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      </main>
    </DndContext>
  )
}