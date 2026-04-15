import { JoinedAsset, resolveCardType, PANORAMA_TYPES, ACTION_TYPES } from '@/types'

/**
 * Color-coded card borders matching the physical Backstories card types:
 *   CHARACTER / ENDING  → red/rose    (pink-red cards)
 *   ISSUE               → amber       (orange/yellow cards)
 *   STORY               → purple/blue (blue cards)
 *   SITUATION/PANORAMA  → blue        (brown/tan in print, blue in digital)
 *   ACTION_WINDOW/WINDOW→ cyan        (green cards — window sub-type)
 *   NOTCH/ACTION_NOTCH  → lime/green  (green cards — notch sub-type, side cutout)
 *   STATUS              → indigo      (dark purple/navy cards)
 */
const BORDER_BY_TYPE: Record<string, string> = {
  CHARACTER:     'border-rose-600',
  ENDING:        'border-rose-500',
  ISSUE:         'border-amber-500',
  STORY:         'border-purple-500',
  PANORAMA:      'border-blue-500',
  SITUATION:     'border-blue-500',
  ACTION:        'border-cyan-400',
  ACTION_WINDOW: 'border-cyan-400',
  WINDOW:        'border-cyan-400',
  NOTCH:         'border-lime-500',
  ACTION_NOTCH:  'border-lime-500',
  STATUS:        'border-indigo-500',
}

const BADGE_BY_TYPE: Record<string, string> = {
  CHARACTER:     'bg-rose-700 text-white',
  ENDING:        'bg-rose-600 text-white',
  ISSUE:         'bg-amber-600 text-white',
  STORY:         'bg-purple-700 text-white',
  PANORAMA:      'bg-blue-700 text-white',
  SITUATION:     'bg-blue-700 text-white',
  ACTION:        'bg-cyan-700 text-white',
  ACTION_WINDOW: 'bg-cyan-700 text-white',
  WINDOW:        'bg-cyan-700 text-white',
  NOTCH:         'bg-lime-700 text-white',
  ACTION_NOTCH:  'bg-lime-700 text-white',
  STATUS:        'bg-indigo-700 text-white',
}

const LABEL_BY_TYPE: Record<string, string> = {
  CHARACTER:     'Character',
  ENDING:        'Ending',
  ISSUE:         'Issue',
  STORY:         'Story',
  PANORAMA:      'Situation',
  SITUATION:     'Situation',
  ACTION:        'Action',
  ACTION_WINDOW: 'Window',
  WINDOW:        'Window',
  NOTCH:         'Notch',
  ACTION_NOTCH:  'Notch',
  STATUS:        'Status',
}

export function CardBody({ asset }: { asset: JoinedAsset }) {
  const cardType    = resolveCardType(asset)
  const isPanorama  = PANORAMA_TYPES.has(cardType)
  const isAction    = ACTION_TYPES.has(cardType)
  const isWindow    = cardType === 'WINDOW' || cardType === 'ACTION_WINDOW'
  const isNotch     = cardType === 'NOTCH' || cardType === 'ACTION_NOTCH'
  const isCharacter = cardType === 'CHARACTER'
  const isStatus    = cardType === 'STATUS'
  const isEnding    = cardType === 'ENDING'
  const isIssue     = cardType === 'ISSUE'
  const isStory     = cardType === 'STORY'

  const borderColor = BORDER_BY_TYPE[cardType] ?? 'border-white/10'

  return (
    <div className={`card-base w-[140px] h-[210px] md:w-[150px] md:h-[225px] flex-none border-[3px] border-solid
      ${isWindow ? 'bg-cyan-950/80 border-dashed' : isNotch ? 'bg-lime-950/80' : 'bg-slate-900/90'}
      ${borderColor}
      rounded-xl flex flex-col shadow-2xl relative overflow-hidden select-none ${asset.image_url ? 'p-0' : 'p-2 md:p-3'}`}
    >
      {/* Notch visual indicator — notch cut on the right side */}
      {isNotch && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-8 bg-[#0A0A0A] rounded-l-full z-30 border-l border-lime-500/40" />
      )}

      {asset.image_url ? (
        <ImageCard
          asset={asset}
          cardType={cardType}
          isPanorama={isPanorama}
          isCharacter={isCharacter}
          isStatus={isStatus}
          isAction={isAction}
          isWindow={isWindow}
          isNotch={isNotch}
          isEnding={isEnding}
          isIssue={isIssue}
          isStory={isStory}
        />
      ) : (
        <TextCard asset={asset} cardType={cardType} isAction={isAction} isWindow={isWindow} isNotch={isNotch} />
      )}
    </div>
  )
}

// --- sub-renderers ---

interface ImageCardProps {
  asset: JoinedAsset
  cardType: string
  isPanorama: boolean
  isCharacter: boolean
  isStatus: boolean
  isAction: boolean
  isWindow: boolean
  isNotch: boolean
  isEnding: boolean
  isIssue: boolean
  isStory: boolean
}

function ImageCard({ asset, cardType, isPanorama, isCharacter, isStatus, isAction, isWindow, isNotch, isEnding, isIssue, isStory }: ImageCardProps) {
  const badgeColor = BADGE_BY_TYPE[cardType] ?? 'bg-slate-700 text-white'
  const showTopBadge = isCharacter || isPanorama || isStatus || isEnding || isIssue || isStory

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
          {showTopBadge && (
            <div className={`${badgeColor} text-[11px] font-bold px-2 py-1 rounded-br-xl shadow-lg border-r border-b border-white/20`}>
              {asset.card_number}
            </div>
          )}

          {isCharacter && (
            <div className="flex-1 px-4 py-1 text-[8px] leading-[1.1] text-white text-right font-medium drop-shadow-md">
              Slide any Status cards (purple cards) <br/> you receive beneath this card.
            </div>
          )}

          {isPanorama && (
            <div className="flex-1 flex justify-center pt-2">
              <div className="bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/30 text-[9px] text-white font-mono">
                {LABEL_BY_TYPE[cardType] ?? cardType}
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
          {isIssue && (
            <div className="mx-2 mb-2 bg-amber-50/90 backdrop-blur-sm p-2 rounded-lg border border-amber-200/20 shadow-lg">
              <div className="text-zinc-800 text-center text-[9px] leading-snug font-medium line-clamp-3">
                {asset.content_front}
              </div>
            </div>
          )}
          {isStory && (
            <div className="mx-2 mb-2 bg-purple-50/90 backdrop-blur-sm p-2 rounded-lg border border-purple-200/20 shadow-lg">
              <div className="text-zinc-800 text-center text-[9px] leading-snug font-medium line-clamp-3">
                {asset.content_front}
              </div>
            </div>
          )}
        </div>
      </div>

      {(isWindow || isAction) && !isNotch && (
        <div className="absolute inset-0 ring-1 ring-inset ring-cyan-400/30 pointer-events-none" />
      )}
      {isNotch && (
        <div className="absolute inset-0 ring-1 ring-inset ring-lime-400/30 pointer-events-none" />
      )}
    </div>
  )
}

interface TextCardProps {
  asset: JoinedAsset
  cardType: string
  isAction: boolean
  isWindow: boolean
  isNotch: boolean
}

function TextCard({ asset, cardType, isAction, isWindow, isNotch }: TextCardProps) {
  const label = LABEL_BY_TYPE[cardType] ?? cardType.replace('_', ' ')
  const badgeColor = BADGE_BY_TYPE[cardType] ?? 'bg-slate-700 text-white'

  return (
    <>
      {(isAction || isWindow) && !isNotch && (
        <div className="absolute inset-0 bg-cyan-400/5 pointer-events-none" />
      )}
      {isNotch && (
        <div className="absolute inset-0 bg-lime-400/5 pointer-events-none" />
      )}
      <div className={`z-10 text-[9px] font-bold px-1.5 py-0.5 rounded self-start ${badgeColor}`}>
        {label}
      </div>
      <div className="z-10 text-[10px] text-zinc-500 font-mono mt-0.5">
        #{asset.card_number}
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
