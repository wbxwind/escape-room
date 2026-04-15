'use client'

import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core'
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react'
import '@livekit/components-styles'

import { useGameBoard } from '@/hooks/useGameBoard'
import { CardBody } from '@/components/CardBody'
import { DraggableCard, DropZone } from '@/components/board'
import { VoiceHUD } from '@/components/VoiceHUD'
import { MicOffIcon, AudioOffIcon } from '@/components/icons'
import { resolveCardType } from '@/types'

export default function EscapeRoom() {
  const game = useGameBoard()

  if (game.loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505] text-cyan-500 font-mono text-sm uppercase">
        Initializing board...
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

// --- Board layout (separated from LiveKit context wiring) ---

function BoardView({ game }: { game: ReturnType<typeof useGameBoard> }) {
  const {
    items, activeId, toast,
    roomCode, setRoomCode,
    availableRooms, roomParticipants,
    isMicMuted, setIsMicMuted,
    isDeafened, setIsDeafened,
    cachedId, sensors,
    handleDragStart, handleDragEnd,
    drawCard,
  } = game

  const deckCount   = items.filter(i => i.current_zone === 'DECK').length
  const activeAsset = items.find(i => i.state_id === activeId)

  return (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="h-screen w-screen bg-[#0A0A0A] flex flex-col text-slate-200 overflow-hidden relative font-sans">

        {/* Header */}
        <header className="flex-none p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-xl tracking-wide">BACK STORIES engine</h1>
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
          <button
            className="px-4 py-2 bg-slate-800 text-white font-semibold rounded hover:bg-slate-700 transition"
            onClick={drawCard}
          >
            Draw Card ({deckCount})
          </button>
        </header>

        <div className="flex-1 flex flex-row min-h-0 overflow-hidden">

          {/* Left sidebar — room navigator + voice HUD */}
          <div className="flex w-32 md:w-56 bg-[#0a0a0a] border-r border-white/5 flex-col items-start gap-4 overflow-hidden flex-none">
            <div className="p-4 flex-1 flex flex-col w-full overflow-y-auto custom-scrollbar">
              <h3 className="text-[10px] font-mono tracking-widest text-slate-500 border-b border-white/5 pb-2 w-full uppercase mb-4">
                Lobby Rooms
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
                      Room: {r}
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
              setIsMicMuted={val => { setIsMicMuted(val); localStorage.setItem('is-mic-muted', String(val)) }}
              isDeafened={isDeafened}
              setIsDeafened={val => { setIsDeafened(val); localStorage.setItem('is-deafened', String(val)) }}
              cachedId={cachedId}
            />
          </div>

          {/* Center — panorama board + player hand */}
          <div className="flex-1 flex flex-col min-w-[500px] bg-gradient-to-b from-[#0A0A0A] to-[#0D0D0D] overflow-hidden">

            {/* Board area */}
            <div className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-hidden">
              <div className="flex items-center gap-16">

                {/* Character + Story slots */}
                <div className="flex flex-col gap-8 flex-none">
                  <SlotColumn label="Character">
                    <DropZone id="character-slot" label="[ CHAR ]" className="w-[140px] h-[210px] md:w-[150px] md:h-[225px]">
                      <CharacterSlot items={items} activeId={activeId} />
                    </DropZone>
                  </SlotColumn>

                  <SlotColumn label="Story">
                    <DropZone id="story-slot" label="[ STORY ]" className="w-[140px] h-[210px] md:w-[150px] md:h-[225px]">
                      {items.find(i => i.current_zone === 'STORY_ZONE') && (
                        <DraggableCard asset={items.find(i => i.current_zone === 'STORY_ZONE')!} />
                      )}
                    </DropZone>
                  </SlotColumn>
                </div>

                {/* Panorama grid */}
                <div className="flex flex-col items-center">
                  <h2 className="text-[10px] font-mono tracking-widest text-cyan-800 mb-6 uppercase flex-none">The Panorama</h2>
                  <div className="grid grid-cols-4 grid-rows-2 gap-4 md:gap-8 w-fit h-fit">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(slot => (
                      <PanoramaSlot key={slot} slot={slot} items={items} />
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Player hand */}
            <DropZone
              id="zone-PLAYER_AREA"
              className="flex-none h-48 md:h-64 border-t border-white/5 bg-black/40 p-4 md:p-6 !rounded-none !border-0 flex items-center overflow-x-auto custom-scrollbar"
            >
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

          {/* Right sidebar — discard pile */}
          <DropZone
            id="zone-DISCARD"
            className="flex-none w-32 md:w-48 bg-[#0a0a0a] border-l border-white/5 p-4 flex flex-col items-center overflow-hidden"
          >
            <h2 className="text-[10px] font-mono tracking-widest text-rose-800 mb-6 uppercase flex-none">Discard</h2>
            <div className="flex flex-col w-full items-center flex-1 overflow-y-auto custom-scrollbar pt-4 px-2 pb-20">
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
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-cyan-950/80 backdrop-blur-md text-cyan-200 px-6 py-3 rounded-full border border-cyan-500/30 text-sm font-medium animate-in slide-in-from-bottom-5 fade-in z-[100]">
            {toast}
          </div>
        )}
      </main>
    </DndContext>
  )
}

// --- Small layout helpers (used only in this file) ---

function SlotColumn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[9px] font-mono tracking-[0.2em] text-cyan-800/60 mb-3 uppercase text-center">{label}</h2>
      {children}
    </div>
  )
}

function CharacterSlot({ items, activeId }: { items: ReturnType<typeof useGameBoard>['items']; activeId: string | null }) {
  const charItems = items
    .filter(i => i.current_zone === 'CHARACTER_ZONE')
    .sort(a => (resolveCardType(a) === 'STATUS' ? -1 : 1))

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {charItems.map((item, idx) => {
        const isPeek = activeId === item.state_id
        return (
          <div
            key={item.state_id}
            className={idx > 0 && !isPeek ? 'absolute top-[28px] left-0 right-0' : isPeek ? 'relative z-50' : 'relative'}
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
      const typeA = resolveCardType(a)
      return (typeA === 'PANORAMA' || typeA === 'SITUATION') ? -1 : 1
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
