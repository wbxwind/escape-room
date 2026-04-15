import { JoinedAsset, resolveCardType, PANORAMA_TYPES, ACTION_TYPES } from '@/types'

const BORDER_BY_TYPE: Record<string, string> = {
  CHARACTER:     'border-rose-600',
  STATUS:        'border-orange-500',
  STORY:         'border-purple-500',
  PANORAMA:      'border-blue-500',
  SITUATION:     'border-blue-500',
  ACTION:        'border-cyan-400',
  ACTION_WINDOW: 'border-cyan-400',
  WINDOW:        'border-cyan-400',
}

export function CardBody({ asset }: { asset: JoinedAsset }) {
  const cardType   = resolveCardType(asset)
  const isPanorama = PANORAMA_TYPES.has(cardType)
  const isAction   = ACTION_TYPES.has(cardType)
  const isWindow   = cardType === 'WINDOW' || cardType === 'ACTION_WINDOW'
  const isCharacter = cardType === 'CHARACTER'

  const borderColor = BORDER_BY_TYPE[cardType] ?? 'border-white/10'

  return (
    <div className={`card-base w-[140px] h-[210px] md:w-[150px] md:h-[225px] flex-none border-[3px] border-solid
      ${isWindow ? 'bg-cyan-950/80 border-dashed' : 'bg-slate-900/90'}
      ${borderColor}
      rounded-xl flex flex-col shadow-2xl relative overflow-hidden select-none ${asset.image_url ? 'p-0' : 'p-2 md:p-3'}`}
    >
      {asset.image_url ? (
        <ImageCard asset={asset} isPanorama={isPanorama} isCharacter={isCharacter} isAction={isAction} isWindow={isWindow} />
      ) : (
        <TextCard asset={asset} cardType={cardType} isAction={isAction} isWindow={isWindow} />
      )}
    </div>
  )
}

// --- sub-renderers ---

interface ImageCardProps {
  asset: JoinedAsset
  isPanorama: boolean
  isCharacter: boolean
  isAction: boolean
  isWindow: boolean
}

function ImageCard({ asset, isPanorama, isCharacter, isAction, isWindow }: ImageCardProps) {
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col">
      <img
        src={asset.image_url!}
        alt={asset.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlays */}
      <div className="relative z-20 flex flex-col h-full pointer-events-none">
        {/* Top section */}
        <div className="flex justify-between items-start w-full">
          {(isCharacter || isPanorama) && (
            <div className={`${isCharacter ? 'bg-[#5e17eb]' : 'bg-[#175beb]'} text-white text-[11px] font-bold px-2 py-1 rounded-br-xl shadow-lg border-r border-b border-white/20`}>
              {asset.card_number}
            </div>
          )}

          {isCharacter && (
            <div className="flex-1 px-4 py-1 text-[8px] leading-[1.1] text-white text-right font-medium drop-shadow-md">
              Slide any Status cards (red cards) <br/> you receive beneath this card.
            </div>
          )}

          {isPanorama && (
            <div className="flex-1 flex justify-center pt-2">
              <div className="bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/30 text-[9px] text-white font-mono">
                {asset.card_number}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-auto">
          {isCharacter && (
            <div className="w-full bg-white/95 backdrop-blur-sm py-1.5 border-t border-black/10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
              <div className="text-black text-center text-sm font-bold tracking-tight uppercase line-clamp-1 px-2">
                {asset.content_front}
              </div>
            </div>
          )}
          {isPanorama && (
            <div className="mx-2 mb-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-black/5 shadow-lg">
              <div className="text-zinc-800 text-center text-[10px] leading-snug font-medium line-clamp-3">
                {asset.content_front}
              </div>
            </div>
          )}
        </div>
      </div>

      {(isWindow || isAction) && (
        <div className="absolute inset-0 ring-1 ring-inset ring-cyan-400/30 pointer-events-none" />
      )}
    </div>
  )
}

interface TextCardProps {
  asset: JoinedAsset
  cardType: string
  isAction: boolean
  isWindow: boolean
}

function TextCard({ asset, cardType, isAction, isWindow }: TextCardProps) {
  return (
    <>
      {(isAction || isWindow) && (
        <div className="absolute inset-0 bg-cyan-400/5 pointer-events-none" />
      )}
      <div className="z-10 text-[10px] text-zinc-400 font-mono tracking-widest">
        {cardType.replace('_', ' ')} #{asset.card_number}
      </div>
      <div className="z-10 text-lg font-bold text-white mt-1 leading-tight line-clamp-2">
        {asset.title}
      </div>
      <div className="z-10 text-xs text-zinc-300 mt-2 line-clamp-4">
        {asset.content_front}
      </div>
    </>
  )
}
