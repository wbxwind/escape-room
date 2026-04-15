'use client'

import { useState } from 'react'
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core'
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react'
import '@livekit/components-styles'

import { useGameBoard } from '@/hooks/useGameBoard'
import { CardBody } from '@/components/CardBody'
import { DraggableCard, DropZone } from '@/components/board'
import { VoiceHUD } from '@/components/VoiceHUD'
import { MicOffIcon, AudioOffIcon } from '@/components/icons'
import { resolveCardType, OBJECTIVE_TYPES } from '@/types'

export default function BackstoriesApp() {
  const game = useGameBoard()

  if (game.loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505] text-cyan-500 font-mono text-sm uppercase tracking-widest">
        Initializing Backstories...
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

// --- Board layout ---

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

  const [drawInput, setDrawInput] = useState('')

  const deckCount   = items.filter(i => i.current_zone === 'DECK').length
  const activeAsset = items.find(i => i.state_id === activeId)

  const handleDrawByNumber = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!drawInput.trim()) return
    await drawCardByNumber(drawInput.trim())
    setDrawInput('')
  }

  return (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="h-screen w-screen bg-[#0A0A0A] flex flex-col text-slate-200 overflow-hidden relative font-sans">

        {/* Header */}
        <header className="flex-none px-4 py-3 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-4">
            <div className="flex flex-col leading-tight">
              <span className="font-black text-lg tracking-[0.15em] text-white uppercase">Back Stories</span>
              <span className="text-[10px] font-mono text-cyan-600 tracking-widest uppercase">Digital Engine</span>
            </div>
            <select
              className="md:hidden bg-slate-900 border border-slate-700 text-sm px-2 py-1 rounded"
              value={roomCode || ''}
              onChange={e => setRoomCode(e.target.value)}
            >
              {availableRooms.map(r => (
                <option key={r} value={r}>
                  {r} {roomParticipants[r] ? `(${roomParticipants[r].length})` : ''}
                </option>
              ))}
            </select>
            <span className="hidden md:inline-block text-cyan-500 text-sm font-mono bg-cyan-900/30 px-2 py-1 border border-cyan-500/20 rounded-md">
              [{roomCode}]
            </span>
          </div>

          {/* Draw controls */}
          <div className="flex items-center gap-3">
            {/* Draw by number (magnifying glass rule) */}
            <form onSubmit={handleDrawByNumber} className="hidden md:flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest">🔍</span>
              <input
                type="text"
                value={drawInput}
                onChange={e => setDrawInput(e.target.value)}
                placeholder="Card #"
                className="w-20 bg-slate-900 border border-slate-700 text-sm px-2 py-1 rounded text-center font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-600"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded hover:bg-slate-700 transition border border-white/10"
              >
                Draw
              </button>
            </form>

            <button
              className="px-4 py-2 bg-cyan-900/50 border border-cyan-500/30 text-cyan-200 font-semibold rounded hover:bg-cyan-900/80 transition text-sm"
              onClick={drawCard}
            >
              Draw Next ({deckCount})
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-row min-h-0 overflow-hidden">

          {/* Left sidebar — room navigator + voice HUD */}
          <div className="flex w-32 md:w-56 bg-[#0a0a0a] border-r border-white/5 flex-col items-start gap-4 overflow-hidden flex-none">
            <div className="p-4 flex-1 flex flex-col w-full overflow-y-auto custom-scrollbar">
              <h3 className="text-[10px] font-mono tracking-widest text-slate-500 border-b border-white/5 pb-2 w-full uppercase mb-4">
                Sessions
              </h3>
              <div className="flex flex-col gap-2 w-full">
                {availableRooms.map(r => (
                  <div key={r} className="w-full flex flex-col gap-1">
                    <button
                      onClick={() => setRoomCode(r)}
                      className={`w-full text-left px-2 md:px-3 py-2 rounded text-[11px] md:text-sm font-semibold transition
                        ${r === roomCode
                          ? 'bg-cyan-950 border border-cyan-400/30 text-cyan-200'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400'
                        }`}
                    >
                      {r} {roomParticipants[r] ? `(${roomParticipants[r].length})` : ''}
                    </button>
                    {roomParticipants[r]?.length > 0 && (
                      <div className="flex flex-col pl-2 mt-1 ml-1 border-l border-white/10 space-y-1">
                        {roomParticipants[r].map(p => (
                          <div key={p.user_id} className="flex items-center gap-2 text-[10px] font-medium text-slate-500 py-0.5 group">
                            <div className="w-1 h-1 rounded-full bg-emerald-700" />
                            <span className="truncate flex-1">{p.username}</span>
                            <div className="flex gap-1 items-center opacity-40 group-hover:opacity-100 transition-opacity">
                              {p.is_muted    && <MicOffIcon   className="w-2 h-2 text-slate-600" />}
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
              setIsMicMuted={val => { setIsMicMuted(val); localStorage.setItem('backstories-mic-muted', String(val)) }}
              isDeafened={isDeafened}
              setIsDeafened={val => { setIsDeafened(val); localStorage.setItem('backstories-deafened', String(val)) }}
              cachedId={cachedId}
            />
          </div>

          {/* Center — panorama board + player hand */}
          <div className="flex-1 flex flex-col min-w-[500px] bg-gradient-to-b from-[#0A0A0A] to-[#0D0D0D] overflow-hidden">

            {/* Board area */}
            <div className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-hidden">
              <div className="flex items-start gap-10 md:gap-14">

                {/* Left column: Objective + Story (read) */}
                <div className="flex flex-col gap-6 flex-none">

                  {/* Objective area — Character card + Status cards beneath it */}
                  <SlotColumn label="Objective">
                    <DropZone id="zone-OBJECTIVE" label="[ OBJECTIVE ]" className="w-[140px] h-[210px] md:w-[150px] md:h-[225px]">
                      <ObjectiveSlot items={items} activeId={activeId} />
                    </DropZone>
                  </SlotColumn>

                  {/* Story reading zone — place Story cards here to read aloud, then discard */}
                  <SlotColumn label="Story (read aloud)">
                    <DropZone id="zone-STORY" label="[ STORY ]" className="w-[140px] h-[210px] md:w-[150px] md:h-[225px]">
                      {items.find(i => i.current_zone === 'STORY_ZONE') && (
                        <DraggableCard asset={items.find(i => i.current_zone === 'STORY_ZONE')!} />
                      )}
                    </DropZone>
                  </SlotColumn>
                </div>

                {/* Panorama — 8 Situation card slots */}
                <div className="flex flex-col items-center">
                  <h2 className="text-[10px] font-mono tracking-widest text-cyan-800 mb-4 uppercase flex-none">
                    The Panorama
                  </h2>
                  <p className="text-[9px] text-zinc-700 font-mono mb-4 text-center max-w-[400px]">
                    Drag a Situation card to a slot · Drag an Action card onto a Situation card to use it
                  </p>
                  <div className="grid grid-cols-4 grid-rows-2 gap-3 md:gap-6 w-fit h-fit">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(slot => (
                      <PanoramaSlot key={slot} slot={slot} items={items} />
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Player Area (hand) — Action, Window, Notch, Issue cards */}
            <div className="flex-none border-t border-white/5">
              <div className="px-4 pt-2 text-[9px] font-mono tracking-widest text-zinc-600 uppercase">
                Player Area — Action &amp; Issue cards
              </div>
              <DropZone
                id="zone-PLAYER_AREA"
                className="h-44 md:h-56 bg-black/40 p-3 md:p-5 !rounded-none !border-0 flex items-center overflow-x-auto custom-scrollbar"
              >
                <div className="flex gap-3 items-center mx-auto px-4">
                  {items.filter(i => i.current_zone === 'PLAYER_AREA').map(item => (
                    <DraggableCard key={item.state_id} asset={item} />
                  ))}
                  {items.filter(i => i.current_zone === 'PLAYER_AREA').length === 0 && (
                    <div className="text-slate-600 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
                      Your hand is empty — draw cards to begin.
                    </div>
                  )}
                </div>
              </DropZone>
            </div>
          </div>

          {/* Right sidebar — discard pile */}
          <DropZone
            id="zone-DISCARD"
            className="flex-none w-32 md:w-44 bg-[#0a0a0a] border-l border-white/5 p-3 flex flex-col items-center overflow-hidden"
          >
            <h2 className="text-[10px] font-mono tracking-widest text-rose-900 mb-2 uppercase flex-none">Discard</h2>
            <div className="text-[8px] font-mono text-zinc-700 mb-4 text-center leading-tight">Story cards go here<br/>after reading aloud</div>
            <div className="flex flex-col w-full items-center flex-1 overflow-y-auto custom-scrollbar pt-2 px-2 pb-20">
              {items.filter(i => i.current_zone === 'DISCARD').map((item, idx) => (
                <div
                  key={item.state_id}
                  className="transition-transform hover:translate-y-[-10px]"
                  style={{ marginTop: idx > 0 ? '-160px' : undefined, zIndex: idx }}
                >
                  <DraggableCard asset={item} />
                </div>
              ))}
            </div>
          </DropZone>
        </div>

        {/* Drag ghost */}
        <DragOverlay dropAnimation={null}>
          {activeAsset && (
            <div className="opacity-80 rotate-[3deg] scale-105 transition-transform">
              <CardBody asset={activeAsset} />
            </div>
          )}
        </DragOverlay>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-slate-100 px-6 py-3 rounded-full border border-white/10 text-sm font-medium animate-in slide-in-from-bottom-5 fade-in z-[100] max-w-sm text-center">
            {toast}
          </div>
        )}
      </main>
    </DndContext>
  )
}

// --- Layout helpers ---

function SlotColumn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[9px] font-mono tracking-[0.2em] text-cyan-800/60 mb-3 uppercase text-center">{label}</h2>
      {children}
    </div>
  )
}

/** Objective area: Character card with Status cards stacked beneath it. */
function ObjectiveSlot({ items, activeId }: { items: ReturnType<typeof useGameBoard>['items']; activeId: string | null }) {
  // Character card on top, Status cards beneath (sorted by slot asc so status cards are lower)
  const objItems = items
    .filter(i => i.current_zone === 'OBJECTIVE')
    .sort((a, b) => {
      const aIsChar = resolveCardType(a) === 'CHARACTER'
      const bIsChar = resolveCardType(b) === 'CHARACTER'
      if (aIsChar && !bIsChar) return 1   // character goes on top (rendered last)
      if (!aIsChar && bIsChar) return -1
      return (b.panorama_slot ?? 0) - (a.panorama_slot ?? 0)
    })

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {objItems.map((item, idx) => {
        const isPeek    = activeId === item.state_id
        const isStatus  = resolveCardType(item) === 'STATUS'
        return (
          <div
            key={item.state_id}
            className={idx > 0 && !isPeek ? 'absolute top-[28px] left-0 right-0' : isPeek ? 'relative z-50' : 'relative'}
            title={isStatus ? 'Status card — stays until end of adventure' : undefined}
          >
            <DraggableCard asset={item} />
          </div>
        )
      })}
    </div>
  )
}

function PanoramaSlot({ slot, items }: { slot: number; items: ReturnType<typeof useGameBoard>['items'] }) {
  const slotItems = items
    .filter(i => i.current_zone === 'PANORAMA' && i.panorama_slot === slot)
    .sort(a => {
      const t = resolveCardType(a)
      return (t === 'PANORAMA' || t === 'SITUATION') ? -1 : 1
    })

  return (
    <DropZone id={`panorama-${slot}`} label={`[ ${slot} ]`} className="w-[140px] h-[210px] md:w-[150px] md:h-[225px]">
      <div className="relative w-full h-full flex items-center justify-center">
        {slotItems.map((item, idx) => (
          <div
            key={item.state_id}
            className={idx > 0 ? 'absolute top-[28px] left-0 right-0 z-10 shadow-2xl' : 'relative'}
          >
            <DraggableCard asset={item} />
          </div>
        ))}
      </div>
    </DropZone>
  )
}
