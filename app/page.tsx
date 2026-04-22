'use client'

import { useState, useCallback } from 'react'
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core'
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react'
import '@livekit/components-styles'

import { useGameBoard } from '@/hooks/useGameBoard'
import { CardBody } from '@/components/CardBody'
import { DraggableCard, DropZone } from '@/components/board'
import { VoiceHUD } from '@/components/VoiceHUD'
import { MicOffIcon, AudioOffIcon, SpeakerPlayIcon } from '@/components/icons'
import { useTTS, TTS_PRESETS, type TTSPreset } from '@/hooks/useTTS'
import { resolveCardType, OBJECTIVE_TYPES } from '@/types'
import { Deck } from '@/components/Deck'

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
    drawCard, drawCardByNumber, resetGame,
  } = game

  const [resetOpen, setResetOpen]   = useState(false)
  const [inspectAsset, setInspectAsset] = useState<typeof items[0] | null>(null)
  const tts = useTTS()

  const deckCount   = items.filter(i => i.current_zone === 'DECK').length
  const activeAsset = items.find(i => i.state_id === activeId)
  const isDragging  = activeId !== null

  return (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="h-dvh w-screen flex flex-col overflow-hidden relative" style={{ background: 'var(--felt-bg)' }}>

        {/* ── HUD Header ──────────────────────────────────────────── */}
        <header className="game-hud flex-none px-4 py-2.5 flex items-center justify-between z-50">

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

          {/* Right: TTS toggle + reset */}
          <div className="flex items-center gap-2">

            {/* TTS controls: toggle + voice preset */}
            <div className="flex items-center gap-1">
              <button
                onClick={tts.toggleEnabled}
                className={`btn-game flex items-center gap-1.5 px-3 py-1.5 border rounded-l-lg text-xs font-mono transition-all ${
                  tts.enabled
                    ? 'bg-amber-900/20 border-amber-700/30 text-amber-400 hover:border-amber-600/40'
                    : 'bg-black/30 border-[rgba(255,255,255,0.08)] text-zinc-600 hover:text-zinc-400'
                }`}
                title={tts.enabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
              >
                <SpeakerPlayIcon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{tts.enabled ? 'TTS' : 'TTS'}</span>
              </button>
              <select
                disabled={!tts.enabled}
                value={tts.preset}
                onChange={e => tts.setPreset(e.target.value as TTSPreset)}
                className={`py-1.5 pr-2 pl-1.5 border border-l-0 rounded-r-lg text-xs font-mono transition-all outline-none cursor-pointer ${
                  tts.enabled
                    ? 'bg-amber-900/20 border-amber-700/30 text-amber-400 hover:border-amber-600/40'
                    : 'bg-black/30 border-[rgba(255,255,255,0.08)] text-zinc-600 opacity-50 cursor-not-allowed'
                }`}
                title="Voice preset"
              >
                {(Object.entries(TTS_PRESETS) as [TTSPreset, typeof TTS_PRESETS[TTSPreset]][]).map(([key, p]) => (
                  <option key={key} value={key}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Reset Game */}
            <div className="relative">
              <button
                onClick={() => setResetOpen(o => !o)}
                className="btn-game flex items-center gap-1.5 px-3 py-1.5 bg-black/30 border border-[rgba(255,255,255,0.1)] rounded-lg text-zinc-400 hover:text-red-400 hover:border-red-800/40 text-xs font-mono"
                title="Reset game — return all cards to deck"
              >
                <span>↻</span>
                <span className="hidden md:inline">Reset</span>
              </button>

              {resetOpen && (
                <div className="fixed top-14 right-0 draw-modal rounded-xl p-4 z-50 w-52">
                  <div className="zone-label text-center mb-1" style={{ color: 'rgba(239,68,68,0.7)' }}>Reset Game</div>
                  <p className="text-[10px] font-mono text-zinc-500 text-center leading-snug mb-4">
                    All cards return to the deck. This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setResetOpen(false)}
                      className="btn-game flex-1 py-1.5 bg-black/40 border border-[rgba(255,255,255,0.1)] text-zinc-400 text-xs font-mono rounded-lg hover:text-zinc-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { resetGame(); setResetOpen(false) }}
                      className="btn-game flex-1 py-1.5 bg-red-950/60 border border-red-800/40 text-red-300 text-xs font-bold rounded-lg hover:bg-red-900/60"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
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

                      {roomParticipants[r]?.length > 0 && (
                        <div className="mt-1 pl-1 flex flex-col gap-1 border-l-2 border-[rgba(255,255,255,0.06)] ml-1">
                          {roomParticipants[r].map(p => {
                            const isSelf = p.user_id === cachedId
                            return (
                              <div key={p.user_id} className="flex items-center gap-1.5 py-0.5 group">
                                <div
                                  className="player-avatar text-[9px] flex-none"
                                  style={avatarStyle(p.username)}
                                >
                                  {initials(p.username)}
                                </div>
                                <span className={`truncate flex-1 text-[10px] font-medium ${isSelf ? 'text-amber-300/80' : 'text-slate-400'}`}>
                                  {isSelf ? 'You' : p.username}
                                </span>
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

            {/* Board area — no scrollbars, cards scale to fit */}
            <div className={`flex-1 board-grid overflow-hidden flex items-center justify-center p-3 md:p-6 ${isDragging ? 'board-grid-active' : ''}`}>
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

            {/* Player Area — horizontal scrollable hand */}
            <div className="flex-none border-t border-[rgba(255,255,255,0.05)]" style={{ background: 'rgba(5,10,15,0.6)', paddingBottom: 'var(--safe-bottom)' }}>
              <div className="px-4 pt-2 pb-0 flex items-center justify-between">
                <span className="zone-label text-[9px]">Player Area</span>
                <span className="text-[9px] font-mono text-zinc-600">Action &amp; Issue cards</span>
              </div>
              <DropZone
                id="zone-PLAYER_AREA"
                className="!rounded-none !border-0 !bg-transparent"
                style={{ height: 'calc(var(--card-h) + 28px)' }}
              >
                {/* pt-3 / pb-1 gives clearance so rotated card corners don't clip at container edge */}
                <div className="flex flex-row items-center overflow-x-auto gap-4 px-4 h-full" style={{ paddingTop: '10px', paddingBottom: '4px' }}>
                  {items.filter(i => i.current_zone === 'PLAYER_AREA').map(item => (
                    <div
                      key={item.state_id}
                      className="flex-shrink-0"
                      onDoubleClick={() => setInspectAsset(item)}
                    >
                      <DraggableCard asset={item} />
                    </div>
                  ))}
                  {items.filter(i => i.current_zone === 'PLAYER_AREA').length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-zinc-700 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
                      Your hand is empty — draw cards to begin
                    </div>
                  )}
                </div>
              </DropZone>
            </div>
          </div>

          {/* Right sidebar — width driven by card size so cards never squish */}
          <div
            id="zone-DISCARD-wrapper"
            className="flex-none border-l border-[rgba(255,255,255,0.05)] flex flex-col h-full overflow-hidden"
            style={{ width: 'calc(var(--card-w) + 32px)', background: 'rgba(7,13,20,0.6)', paddingRight: 'var(--safe-right)' }}
          >
            {/* Deck section — flex-1 (top 1/4) */}
            <div className="flex-1 flex flex-col items-center justify-center p-2 border-b border-[rgba(255,255,255,0.05)]">
              <div className="zone-label text-[9px] mb-2 text-center">Deck</div>
              <Deck deckCount={deckCount} onDraw={drawCard} onDrawByNumber={drawCardByNumber} />
            </div>

            {/* Discard section — stacked physical pile, scrollable */}
            <DropZone
              id="zone-DISCARD"
              className="flex-[3] flex flex-col overflow-hidden !rounded-none !border-0 !bg-transparent"
            >
              <h2 className="zone-label text-[9px] text-rose-900/70 mb-1 text-center flex-none pt-2">Discard</h2>
              <div className="text-[8px] font-mono text-zinc-700 mb-2 text-center leading-tight flex-none">
                Story cards after<br />reading aloud
              </div>
              <DiscardStack items={items} onInspect={setInspectAsset} />
            </DropZone>
          </div>
        </div>

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

        {/* Click-away for reset modal */}
        {resetOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setResetOpen(false)} />
        )}
      </main>
    </DndContext>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

/** Peek offset matches the PanoramaSlot stacking (absolute top-[28px] per layer). */
const DISCARD_PEEK = 28

function DiscardStack({
  items,
  onInspect,
}: {
  items: ReturnType<typeof useGameBoard>['items']
  onInspect: (a: ReturnType<typeof useGameBoard>['items'][0]) => void
}) {
  const discardItems = items.filter(i => i.current_zone === 'DISCARD')

  if (discardItems.length === 0) {
    return (
      <div className="flex-1 flex items-start justify-center pt-4">
        <span className="text-[8px] font-mono text-zinc-800">Empty</span>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden pt-1 pb-6 flex justify-center">
      {/* Explicit card-width container — cards never squish regardless of panel width */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: 'var(--card-w)',
          height: `calc(var(--card-h) + ${(discardItems.length - 1) * DISCARD_PEEK}px)`,
        }}
      >
        {discardItems.map((item, idx) => (
          <div
            key={item.state_id}
            className="absolute inset-x-0 flex-shrink-0 shadow-2xl discard-stack-card"
            style={{
              top: `${idx * DISCARD_PEEK}px`,
              zIndex: idx + 1,
            }}
            onDoubleClick={() => onInspect(item)}
          >
            <DraggableCard asset={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

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
