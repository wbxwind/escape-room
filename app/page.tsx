'use client'

import { useState, useCallback } from 'react'
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core'
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react'
import '@livekit/components-styles'

import { useGameBoard } from '@/hooks/useGameBoard'
import { CardBody } from '@/components/CardBody'
import { DraggableCard, DropZone } from '@/components/board'
import { VoiceHUD } from '@/components/VoiceHUD'
import { MicOffIcon, AudioOffIcon } from '@/components/icons'
import { resolveCardType, OBJECTIVE_TYPES } from '@/types'

/** Seeded rotation: same card always tilts the same angle. */
function seedRotation(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  return ((h % 600) - 300) / 100
}

/** Avatar initials (up to 2 chars) + seeded background color. */
const AVATAR_PALETTE = [
  ['#1e3a5f','#93c5fd'], ['#3b1f5a','#d8b4fe'], ['#1a3f2a','#86efac'],
  ['#5a2a1a','#fdba74'], ['#3f1a1a','#fca5a5'], ['#1a3a3a','#5eead4'],
]
function avatarStyle(name: string) {
  const idx = (name.charCodeAt(0) ?? 0) % AVATAR_PALETTE.length
  const [bg, fg] = AVATAR_PALETTE[idx]
  return { backgroundColor: bg, color: fg, border: `1.5px solid ${fg}33` }
}
function initials(name: string) {
  const parts = name.trim().split(/[-_\s]+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

// ─────────────────────────────────────────────────────────────────────
export default function BackstoriesApp() {
  const game = useGameBoard()

  if (game.loading) {
    return (
      <div className="splash-screen h-screen flex flex-col items-center justify-center gap-6">
        <div className="loading-spinner" />
        <div className="flex flex-col items-center gap-1">
          <span className="game-title text-xl tracking-[0.2em]">Back Stories</span>
          <span className="game-subtitle typewriter">Initializing engine...</span>
        </div>
      </div>
    )
  }

  const board = <BoardView game={game} />

  if (game.liveKitToken && game.liveKitUrl) {
    return (
      <LiveKitRoom serverUrl={game.liveKitUrl} token={game.liveKitToken} connect audio={!game.isMicMuted}>
        {board}
        {!game.isDeafened && <RoomAudioRenderer />}
      </LiveKitRoom>
    )
  }

  return board
}

// ─────────────────────────────────────────────────────────────────────
// BoardView
// ─────────────────────────────────────────────────────────────────────
function BoardView({ game }: { game: ReturnType<typeof useGameBoard> }) {
  const {
    items, activeId, toast,
    roomCode, setRoomCode,
    availableRooms, roomParticipants,
    isMicMuted, setIsMicMuted,
    isDeafened, setIsDeafened,
    cachedId, sensors,
    handleDragStart, handleDragEnd,
    drawCard, drawCardByNumber,
  } = game

  const [drawOpen, setDrawOpen]   = useState(false)
  const [drawInput, setDrawInput] = useState('')
  const [inspectAsset, setInspectAsset] = useState<typeof items[0] | null>(null)

  const deckCount   = items.filter(i => i.current_zone === 'DECK').length
  const activeAsset = items.find(i => i.state_id === activeId)
  const isDragging  = activeId !== null

  const handleDrawSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!drawInput.trim()) return
    await drawCardByNumber(drawInput.trim())
    setDrawInput('')
    setDrawOpen(false)
  }, [drawInput, drawCardByNumber])

  return (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="h-dvh w-screen flex flex-col overflow-hidden relative" style={{ background: 'var(--felt-bg)' }}>

        {/* ── HUD Header ──────────────────────────────────────────── */}
        <header className="game-hud flex-none px-4 py-2.5 flex items-center justify-between z-10">

          {/* Left: brand + room */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col leading-none">
              <span className="game-title text-[17px]">Back Stories</span>
              <span className="game-subtitle mt-0.5">Digital Engine</span>
            </div>

            {/* Room chip */}
            <div className="hidden md:flex items-center gap-1.5 bg-black/30 border border-[rgba(201,162,39,0.15)] rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
              <span className="font-mono text-[11px] text-amber-300/70 tracking-widest">{roomCode}</span>
            </div>

            {/* Mobile room picker */}
            <select
              className="md:hidden bg-black/40 border border-[rgba(255,255,255,0.1)] text-sm px-2 py-1 rounded text-amber-200"
              value={roomCode || ''}
              onChange={e => setRoomCode(e.target.value)}
            >
              {availableRooms.map(r => (
                <option key={r} value={r}>{r} {roomParticipants[r]?.length ? `(${roomParticipants[r].length})` : ''}</option>
              ))}
            </select>
          </div>

          {/* Right: draw controls */}
          <div className="flex items-center gap-2">
            {/* Draw by number — magnifying glass */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setDrawOpen(d => !d)}
                className="btn-game flex items-center gap-1.5 px-3 py-1.5 bg-black/30 border border-[rgba(255,255,255,0.1)] rounded-lg text-zinc-400 hover:text-zinc-200 hover:border-[rgba(255,255,255,0.2)] text-xs font-mono"
                title="Draw by card number (magnifying glass rule)"
              >
                <span>🔍</span>
                <span>Draw #</span>
              </button>

              {drawOpen && (
                <div className="absolute top-full right-0 mt-2 draw-modal rounded-xl p-4 z-50 w-56">
                  <div className="zone-label text-center mb-3">Draw by Number</div>
                  <form onSubmit={handleDrawSubmit} className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={drawInput}
                      onChange={e => setDrawInput(e.target.value)}
                      placeholder="Card number..."
                      autoFocus
                      className="w-full bg-black/50 border border-[rgba(201,162,39,0.2)] text-amber-100 text-sm px-3 py-2 rounded-lg text-center font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[rgba(201,162,39,0.5)]"
                    />
                    <div className="text-[10px] font-mono text-zinc-600 text-center leading-snug">
                      Only cards with a magnifying glass icon can be drawn this way.
                    </div>
                    <button
                      type="submit"
                      className="btn-game w-full py-1.5 bg-amber-900/50 border border-amber-700/30 text-amber-200 text-xs font-bold rounded-lg hover:bg-amber-900/70"
                    >
                      Draw Card
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Draw next */}
            <button
              className="btn-game flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-amber-900/60 to-amber-950/60 border border-amber-700/30 text-amber-200 font-bold rounded-lg hover:from-amber-900/80 hover:to-amber-950/80 text-sm shadow-[0_0_12px_rgba(180,100,20,0.2)]"
              onClick={drawCard}
            >
              <span>Draw</span>
              <span className="font-mono text-amber-400/70 text-xs">({deckCount})</span>
            </button>
          </div>
        </header>

        {/* ── Main layout ─────────────────────────────────────────── */}
        <div className="flex-1 flex min-h-0 overflow-hidden">

          {/* Left sidebar — sessions + voice HUD */}
          <aside className="flex-none w-[80px] sm:w-[116px] md:w-[200px] border-r border-[rgba(255,255,255,0.05)] flex flex-col overflow-hidden" style={{ background: 'rgba(7,13,20,0.6)', paddingLeft: 'var(--safe-left)' }}>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">

              <div>
                <div className="zone-label text-[9px] mb-2 pb-1.5 border-b border-[rgba(255,255,255,0.06)]">Sessions</div>
                <div className="flex flex-col gap-1.5">
                  {availableRooms.map(r => (
                    <div key={r}>
                      <button
                        onClick={() => setRoomCode(r)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 animate-slide-in
                          ${r === roomCode ? 'session-active' : 'session-inactive'}`}
                      >
                        <span className="truncate block">{r}</span>
                        {roomParticipants[r]?.length > 0 && (
                          <span className="text-[9px] font-mono opacity-60">{roomParticipants[r].length} online</span>
                        )}
                      </button>

                      {/* Player list with avatars */}
                      {roomParticipants[r]?.length > 0 && (
                        <div className="mt-1 pl-1 flex flex-col gap-1 border-l-2 border-[rgba(255,255,255,0.06)] ml-1">
                          {roomParticipants[r].map(p => {
                            const isSelf = p.user_id === cachedId
                            return (
                              <div key={p.user_id} className="flex items-center gap-1.5 py-0.5 group">
                                {/* Avatar with initials */}
                                <div
                                  className="player-avatar text-[9px] flex-none"
                                  style={avatarStyle(p.username)}
                                >
                                  {initials(p.username)}
                                </div>
                                <span className={`truncate flex-1 text-[10px] font-medium ${isSelf ? 'text-amber-300/80' : 'text-slate-400'}`}>
                                  {isSelf ? 'You' : p.username}
                                </span>
                                {/* Mute/deafen icons */}
                                <div className="flex gap-0.5 items-center shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                                  {p.is_muted    && <MicOffIcon   className="w-2.5 h-2.5 text-red-500" />}
                                  {p.is_deafened && <AudioOffIcon className="w-2.5 h-2.5 text-orange-500" />}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Voice HUD at bottom */}
            <VoiceHUD
              isMicMuted={isMicMuted}
              setIsMicMuted={val => { setIsMicMuted(val); localStorage.setItem('backstories-mic-muted', String(val)) }}
              isDeafened={isDeafened}
              setIsDeafened={val => { setIsDeafened(val); localStorage.setItem('backstories-deafened', String(val)) }}
              cachedId={cachedId}
            />
          </aside>

          {/* Center — board + player hand */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Board area */}
            <div className={`flex-1 board-grid overflow-auto flex items-center justify-center p-4 md:p-8 ${isDragging ? 'board-grid-active' : ''}`}>
              <div className="flex items-start flex-wrap justify-center" style={{ gap: 'calc(var(--card-gap) * 3)' }}>

                {/* Left column: Objective + Story zone */}
                <div className="flex flex-col flex-none" style={{ gap: 'var(--card-gap)' }}>
                  <SlotColumn label="Objective">
                    <DropZone id="zone-OBJECTIVE" label="[ OBJECTIVE ]" className="w-[var(--card-w)] h-[var(--card-h)]">
                      <ObjectiveSlot items={items} activeId={activeId} onInspect={setInspectAsset} />
                    </DropZone>
                  </SlotColumn>

                  <SlotColumn label="Story — read aloud">
                    <DropZone id="zone-STORY" label="[ STORY ]" className="w-[var(--card-w)] h-[var(--card-h)]">
                      {(() => {
                        const storyCard = items.find(i => i.current_zone === 'STORY_ZONE')
                        return storyCard ? (
                          <div onDoubleClick={() => setInspectAsset(storyCard)}>
                            <DraggableCard asset={storyCard} />
                          </div>
                        ) : null
                      })()}
                    </DropZone>
                  </SlotColumn>
                </div>

                {/* Panorama — 8 Situation card slots in 4×2 grid */}
                <div className="flex flex-col items-center">
                  <h2 className="zone-label text-center mb-3">The Panorama</h2>
                  <p className="text-[9px] text-zinc-600 font-mono mb-4 text-center max-w-[380px] leading-snug">
                    Place Situation cards in slots · Drop Action cards onto them to interact
                  </p>
                  <div className="grid grid-cols-4 grid-rows-2 w-fit" style={{ gap: 'var(--card-gap)' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(slot => (
                      <PanoramaSlot key={slot} slot={slot} items={items} onInspect={setInspectAsset} />
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Player Area — hand of action/issue cards */}
            <div className="flex-none border-t border-[rgba(255,255,255,0.05)]" style={{ background: 'rgba(5,10,15,0.6)', paddingBottom: 'var(--safe-bottom)' }}>
              <div className="px-4 pt-2 pb-0 flex items-center justify-between">
                <span className="zone-label text-[9px]">Player Area</span>
                <span className="text-[9px] font-mono text-zinc-600">Action &amp; Issue cards</span>
              </div>
              <DropZone
                id="zone-PLAYER_AREA"
                className="p-3 md:p-4 !rounded-none !border-0 !bg-transparent flex items-end overflow-x-auto"
                style={{ height: 'calc(var(--card-h) * 0.85 + 24px)' }}
              >
                <div className="hand-fan-container flex gap-2 items-end mx-auto px-4 w-full">
                  {items.filter(i => i.current_zone === 'PLAYER_AREA').map((item, idx, arr) => {
                    const center = (arr.length - 1) / 2
                    const fanAngle = (idx - center) * 2.5
                    const fanOffset = Math.abs(idx - center) * -4
                    return (
                      <div
                        key={item.state_id}
                        style={{
                          transform: `rotate(${fanAngle}deg) translateY(${fanOffset}px)`,
                          transformOrigin: 'bottom center',
                          transition: 'transform 0.2s ease',
                          zIndex: idx,
                        }}
                        onDoubleClick={() => setInspectAsset(item)}
                      >
                        <DraggableCard asset={item} />
                      </div>
                    )
                  })}
                  {items.filter(i => i.current_zone === 'PLAYER_AREA').length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-zinc-700 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
                      Your hand is empty — draw cards to begin
                    </div>
                  )}
                </div>
              </DropZone>
            </div>
          </div>

          {/* Right sidebar — discard pile */}
          <div
            id="zone-DISCARD-wrapper"
            className="flex-none w-[72px] sm:w-[100px] md:w-[140px] border-l border-[rgba(255,255,255,0.05)] flex flex-col items-center overflow-hidden"
            style={{ background: 'rgba(7,13,20,0.6)', paddingRight: 'var(--safe-right)' }}
          >
          <DropZone
            id="zone-DISCARD"
            className="w-full flex-1 p-3 flex flex-col items-center overflow-hidden !rounded-none !border-0 !bg-transparent"
          >
            <h2 className="zone-label text-[9px] text-rose-900/70 mb-1 text-center">Discard</h2>
            <div className="text-[8px] font-mono text-zinc-700 mb-3 text-center leading-tight">
              Story cards after<br />reading aloud
            </div>

            {/* Stacked cards with rotation */}
            <div className="relative flex-1 w-full flex flex-col items-center pt-2">
              {items.filter(i => i.current_zone === 'DISCARD').map((item, idx) => {
                const rot = ((idx % 2 === 0) ? 1 : -1) * (2 + (idx % 3))
                return (
                  <div
                    key={item.state_id}
                    className="discard-stack-card absolute"
                    style={{
                      top: `${idx * 14}px`,
                      zIndex: idx,
                      transform: `rotate(${rot}deg)`,
                    }}
                    onDoubleClick={() => setInspectAsset(item)}
                  >
                    <DraggableCard asset={item} />
                  </div>
                )
              })}
              {items.filter(i => i.current_zone === 'DISCARD').length === 0 && (
                <div className="text-[8px] font-mono text-zinc-800 text-center mt-4 leading-snug">Empty</div>
              )}
            </div>
          </DropZone>
          </div>
        </div>{/* end flex-1 flex min-h-0 row */}

        {/* ── Drag ghost overlay ──────────────────────────────────── */}
        <DragOverlay dropAnimation={null}>
          {activeAsset && (
            <div
              className="pointer-events-none"
              style={{ transform: `rotate(${seedRotation(activeAsset.state_id)}deg) scale(1.08)`, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))' }}
            >
              <CardBody asset={activeAsset} />
            </div>
          )}
        </DragOverlay>

        {/* ── Inspect modal ────────────────────────────────────────── */}
        {inspectAsset && (
          <div className="inspect-backdrop" onClick={() => setInspectAsset(null)}>
            <div className="inspect-card" onClick={e => e.stopPropagation()}>
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setInspectAsset(null)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors"
                >
                  [ close ]
                </button>
              </div>
              <CardBody asset={inspectAsset} enlarged />
              <div className="mt-3 text-center">
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  Double-click any card to inspect
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Toast ────────────────────────────────────────────────── */}
        {toast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] max-w-xs text-center">
            <div className="toast-card px-5 py-3 inline-block text-sm">
              {toast}
            </div>
          </div>
        )}

        {/* Click-away for draw modal */}
        {drawOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setDrawOpen(false)} />
        )}
      </main>
    </DndContext>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function SlotColumn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="zone-label text-center">{label}</div>
      {children}
    </div>
  )
}

function ObjectiveSlot({
  items, activeId, onInspect,
}: {
  items: ReturnType<typeof useGameBoard>['items']
  activeId: string | null
  onInspect: (a: ReturnType<typeof useGameBoard>['items'][0]) => void
}) {
  const objItems = items
    .filter(i => i.current_zone === 'OBJECTIVE')
    .sort((a, b) => {
      const aIsChar = resolveCardType(a) === 'CHARACTER'
      const bIsChar = resolveCardType(b) === 'CHARACTER'
      if (aIsChar && !bIsChar) return 1
      if (!aIsChar && bIsChar) return -1
      return (b.panorama_slot ?? 0) - (a.panorama_slot ?? 0)
    })

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {objItems.map((item, idx) => {
        const isPeek = activeId === item.state_id
        return (
          <div
            key={item.state_id}
            className={idx > 0 && !isPeek ? 'absolute top-[28px] left-0 right-0' : isPeek ? 'relative z-50' : 'relative'}
            onDoubleClick={() => onInspect(item)}
          >
            <DraggableCard asset={item} />
          </div>
        )
      })}
    </div>
  )
}

function PanoramaSlot({
  slot, items, onInspect,
}: {
  slot: number
  items: ReturnType<typeof useGameBoard>['items']
  onInspect: (a: ReturnType<typeof useGameBoard>['items'][0]) => void
}) {
  const slotItems = items
    .filter(i => i.current_zone === 'PANORAMA' && i.panorama_slot === slot)
    .sort(a => {
      const t = resolveCardType(a)
      return (t === 'PANORAMA' || t === 'SITUATION') ? -1 : 1
    })

  return (
    <DropZone id={`panorama-${slot}`} label={`[ ${slot} ]`} className="w-[var(--card-w)] h-[var(--card-h)]">
      <div className="relative w-full h-full flex items-center justify-center">
        {slotItems.map((item, idx) => (
          <div
            key={item.state_id}
            className={idx > 0 ? 'absolute top-[28px] left-0 right-0 z-10 shadow-2xl' : 'relative'}
            onDoubleClick={() => onInspect(item)}
          >
            <DraggableCard asset={item} />
          </div>
        ))}
      </div>
    </DropZone>
  )
}
