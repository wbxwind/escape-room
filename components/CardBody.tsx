'use client'

import { JoinedAsset, resolveCardType, PANORAMA_TYPES, ACTION_TYPES } from '@/types'

/** Deterministic card rotation seeded from card ID — consistent per card, not random on every drag. */
function seedRotation(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  return ((h % 600) - 300) / 100 // −3° to +3°
}

// ─── Avatar color palette (seeded by first char of id) ───────────────
const AVATAR_COLORS = [
  ['#1e3a5f', '#60a5fa'], ['#3b1f5a', '#c084fc'], ['#1a3f2a', '#4ade80'],
  ['#5a2a1a', '#fb923c'], ['#3f1a1a', '#f87171'], ['#1a3a3a', '#2dd4bf'],
]
function avatarColors(name: string) {
  const idx = (name.charCodeAt(0) ?? 0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

// ─── Card type class map ──────────────────────────────────────────────
const TYPE_CLASS: Record<string, string> = {
  CHARACTER:     'card-character',
  ENDING:        'card-ending',
  ISSUE:         'card-issue',
  STORY:         'card-story',
  PANORAMA:      'card-situation',
  SITUATION:     'card-situation',
  ACTION:        'card-window',
  ACTION_WINDOW: 'card-window',
  WINDOW:        'card-window',
  NOTCH:         'card-notch',
  ACTION_NOTCH:  'card-notch',
  STATUS:        'card-status',
}

const TYPE_LABEL: Record<string, string> = {
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

// Badge background colors for type chips
const BADGE_BG: Record<string, string> = {
  CHARACTER:     'bg-rose-800 text-rose-100',
  ENDING:        'bg-red-900 text-amber-200',
  ISSUE:         'bg-amber-800 text-amber-100',
  STORY:         'bg-indigo-800 text-indigo-100',
  PANORAMA:      'bg-yellow-900 text-yellow-100',
  SITUATION:     'bg-yellow-900 text-yellow-100',
  ACTION:        'bg-cyan-800 text-cyan-100',
  ACTION_WINDOW: 'bg-cyan-800 text-cyan-100',
  WINDOW:        'bg-cyan-800 text-cyan-100',
  NOTCH:         'bg-lime-800 text-lime-100',
  ACTION_NOTCH:  'bg-lime-800 text-lime-100',
  STATUS:        'bg-indigo-900 text-indigo-200',
}

// ─────────────────────────────────────────────────────────────────────
// Main CardBody export
// ─────────────────────────────────────────────────────────────────────
interface CardBodyProps {
  asset: JoinedAsset
  /** True when rendered in the inspect modal (larger size). */
  enlarged?: boolean
}

export function CardBody({ asset, enlarged = false }: CardBodyProps) {
  const cardType  = resolveCardType(asset)
  const typeClass = TYPE_CLASS[cardType] ?? ''
  const isWindow  = cardType === 'WINDOW' || cardType === 'ACTION_WINDOW'
  const isNotch   = cardType === 'NOTCH' || cardType === 'ACTION_NOTCH'

  const sizeClass = enlarged
    ? 'w-[280px] h-[420px]'
    : 'w-[140px] h-[210px] md:w-[150px] md:h-[225px]'

  const borderStyle = isWindow ? 'border-dashed' : 'border-solid'

  return (
    <div
      className={`card-base flex-none border-[2px] ${borderStyle} ${typeClass} ${sizeClass} rounded-xl flex flex-col shadow-2xl relative overflow-hidden select-none`}
    >
      {/* Notch cutout on right edge */}
      {isNotch && <div className="notch-cutout" />}

      {/* Dispatch to per-type renderer */}
      <CardTypeRenderer asset={asset} cardType={cardType} enlarged={enlarged} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Per-type router
// ─────────────────────────────────────────────────────────────────────
interface RendererProps {
  asset: JoinedAsset
  cardType: string
  enlarged: boolean
}

function CardTypeRenderer({ asset, cardType, enlarged }: RendererProps) {
  switch (cardType) {
    case 'CHARACTER':                   return <CharacterCard asset={asset} enlarged={enlarged} />
    case 'SITUATION':
    case 'PANORAMA':                    return <SituationCard asset={asset} enlarged={enlarged} />
    case 'STORY':                       return <StoryCard     asset={asset} enlarged={enlarged} />
    case 'ISSUE':                       return <IssueCard     asset={asset} enlarged={enlarged} />
    case 'ACTION_WINDOW':
    case 'WINDOW':
    case 'ACTION':                      return <WindowCard    asset={asset} enlarged={enlarged} />
    case 'NOTCH':
    case 'ACTION_NOTCH':                return <NotchCard     asset={asset} enlarged={enlarged} />
    case 'STATUS':                      return <StatusCard    asset={asset} enlarged={enlarged} />
    case 'ENDING':                      return <EndingCard    asset={asset} enlarged={enlarged} />
    default:                            return <DefaultCard   asset={asset} enlarged={enlarged} />
  }
}

// ─────────────────────────────────────────────────────────────────────
// CHARACTER — Portrait fills top 70%, name banner at bottom
// ─────────────────────────────────────────────────────────────────────
function CharacterCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  const textScale = enlarged ? '' : 'text-[10px]'
  return (
    <>
      {asset.image_url ? (
        <img
          src={asset.image_url}
          alt={asset.title}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-rose-900/60 border border-rose-700/40 flex items-center justify-center">
            <span className="text-2xl text-rose-300 font-playfair font-bold">
              {asset.title?.charAt(0) ?? '?'}
            </span>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none" />

      {/* Card number top-left */}
      <div className="relative z-20 p-1.5">
        <div className="card-number-badge bg-rose-900/80 text-rose-200 inline-block">
          #{asset.card_number}
        </div>
      </div>

      {/* Hint text top-right */}
      <div className={`absolute top-1.5 right-1.5 z-20 text-rose-200/70 ${textScale} italic text-right leading-tight max-w-[55%] drop-shadow`}>
        {enlarged ? 'Slide Status cards beneath this card.' : 'Status cards below'}
      </div>

      {/* Name banner bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="parchment-area px-3 py-2 text-center">
          <div className={`parchment-text font-bold tracking-wide ${enlarged ? 'text-base' : 'text-[11px]'} uppercase leading-tight line-clamp-2`}>
            {asset.title}
          </div>
          <div className="card-type-badge bg-rose-800/60 text-rose-200 inline-block mt-1">Character</div>
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// SITUATION / PANORAMA — Parchment bg, landscape image top half
// ─────────────────────────────────────────────────────────────────────
function SituationCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {/* Image fills top ~55% */}
      {asset.image_url ? (
        <div className="absolute inset-0 z-0">
          <img
            src={asset.image_url}
            alt={asset.title}
            className="w-full h-[58%] object-cover object-center"
          />
          <div className="absolute top-0 left-0 right-0 h-[58%] bg-gradient-to-b from-transparent to-[rgba(28,14,5,0.6)]" />
        </div>
      ) : (
        <div className="absolute top-0 left-0 right-0 h-[58%] bg-gradient-to-b from-[#2c1f0e]/80 to-[#1a1208] z-0" />
      )}

      {/* Warm lower parchment area */}
      <div className="absolute bottom-0 left-0 right-0 h-[44%] bg-gradient-to-t from-[#1e1308] to-transparent z-0" />

      {/* Card number badge — top-left corner */}
      <div className="absolute top-0 left-0 z-20">
        <div className="card-number-badge bg-[#c9a227] text-[#1a0f00] font-bold rounded-br-lg px-2 py-1">
          {asset.card_number}
        </div>
      </div>

      {/* Situation label — top center */}
      <div className="absolute top-1.5 right-1.5 z-20">
        <div className="card-type-badge bg-yellow-900/70 text-yellow-200">Situation</div>
      </div>

      {/* Text area bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-2 pb-2 pt-1">
        <div className={`parchment-text font-semibold text-amber-100 ${enlarged ? 'text-sm' : 'text-[9px]'} leading-snug line-clamp-3 text-center drop-shadow`}>
          {asset.content_front}
        </div>
        {asset.title && (
          <div className={`parchment-text italic text-amber-300/70 ${enlarged ? 'text-xs' : 'text-[8px]'} text-center mt-0.5 line-clamp-1`}>
            {asset.title}
          </div>
        )}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STORY — Deep navy, parchment text area, gold borders
// ─────────────────────────────────────────────────────────────────────
function StoryCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {asset.image_url && (
        <>
          <img src={asset.image_url} alt={asset.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#16195a]/70 to-[#0c0e38]/90" />
        </>
      )}

      {/* Gold inner border accent */}
      <div className="absolute inset-[3px] border border-[rgba(201,162,39,0.2)] rounded-lg pointer-events-none z-10" />

      {/* Card header */}
      <div className="relative z-20 flex items-center gap-1 px-2 pt-2 pb-1">
        <div className="card-number-badge bg-indigo-900/80 text-indigo-200">#{asset.card_number}</div>
        <div className="flex-1" />
        <div className="card-type-badge bg-indigo-800/70 text-indigo-200">Story</div>
      </div>

      {/* Title */}
      <div className={`relative z-20 px-2 mb-1 font-[var(--font-playfair)] font-bold text-white ${enlarged ? 'text-base' : 'text-[11px]'} leading-tight line-clamp-2`}>
        {asset.title}
      </div>

      {/* Parchment text area */}
      <div className="relative z-20 mx-2 mb-2 flex-1 parchment-area rounded-lg p-2 overflow-hidden">
        <p className={`parchment-text ${enlarged ? 'text-sm' : 'text-[9px]'} leading-snug line-clamp-6`}>
          {asset.content_front}
        </p>
      </div>

      {/* Gold bottom accent line */}
      <div className="absolute bottom-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.3)] to-transparent z-20" />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ISSUE — Warm amber, evidence document feel
// ─────────────────────────────────────────────────────────────────────
function IssueCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {asset.image_url ? (
        <>
          <img src={asset.image_url} alt={asset.title} className="absolute inset-0 w-full h-[50%] object-cover object-top" />
          <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-transparent to-[#231203]/80" />
        </>
      ) : (
        <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-[#3d1f05]/60 to-[#231203] flex items-center justify-center z-0">
          <span className="text-2xl opacity-30">📋</span>
        </div>
      )}

      {/* Bottom warm area */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#231203] via-transparent to-transparent z-0" />

      <div className="absolute top-0 left-0 z-20">
        <div className="card-number-badge bg-amber-800/80 text-amber-200">#{asset.card_number}</div>
      </div>
      <div className="absolute top-1.5 right-1.5 z-20">
        <div className="card-type-badge bg-amber-900/70 text-amber-200">Issue</div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 px-2 pb-2 pt-1">
        <div className={`font-[var(--font-playfair)] font-bold text-amber-200 ${enlarged ? 'text-sm' : 'text-[10px]'} leading-tight line-clamp-2 mb-1`}>
          {asset.title}
        </div>
        <div className="parchment-area rounded p-1.5">
          <p className={`parchment-text ${enlarged ? 'text-xs' : 'text-[8px]'} leading-snug line-clamp-3`}>
            {asset.content_front}
          </p>
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// WINDOW — Cyan-tinted, transparent cutout rectangle in center
// ─────────────────────────────────────────────────────────────────────
function WindowCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {/* Subtle cyan grid background */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,220,240,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,240,0.15) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* Top section */}
      <div className="relative z-20 flex items-center gap-1 px-2 pt-2 pb-1">
        <div className="card-number-badge bg-cyan-900/80 text-cyan-200">#{asset.card_number}</div>
        <div className="flex-1" />
        <div className="card-type-badge bg-cyan-800/70 text-cyan-100">Window</div>
      </div>

      <div className={`relative z-20 px-2 font-bold text-cyan-100 ${enlarged ? 'text-sm' : 'text-[10px]'} leading-tight line-clamp-2`}>
        {asset.title}
      </div>

      {/* The transparent window cutout — core mechanic */}
      <div className="window-cutout" />

      {/* Bottom text */}
      <div className="absolute bottom-2 left-2 right-2 z-20">
        <p className={`text-cyan-300/60 ${enlarged ? 'text-[11px]' : 'text-[8px]'} text-center leading-snug line-clamp-2`}>
          {asset.content_front}
        </p>
      </div>

      {/* Cyan edge glow */}
      <div className="absolute inset-0 ring-1 ring-inset ring-cyan-400/20 rounded-xl pointer-events-none" />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// NOTCH — Lime-tinted, right-edge semicircle notch (see CSS .notch-cutout)
// ─────────────────────────────────────────────────────────────────────
function NotchCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {/* Subtle lime-green grid */}
      <div className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'linear-gradient(rgba(132,204,22,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(132,204,22,0.2) 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      />

      <div className="relative z-20 flex items-center gap-1 px-2 pt-2 pb-1">
        <div className="card-number-badge bg-lime-900/80 text-lime-200">#{asset.card_number}</div>
        <div className="flex-1" />
        <div className="card-type-badge bg-lime-800/70 text-lime-100">Notch</div>
      </div>

      <div className={`relative z-20 px-2 font-bold text-lime-100 ${enlarged ? 'text-sm' : 'text-[10px]'} leading-tight line-clamp-2 mb-2`}>
        {asset.title}
      </div>

      <div className="relative z-20 mx-2 flex-1">
        <p className={`text-lime-200/70 ${enlarged ? 'text-[11px]' : 'text-[8px]'} leading-snug line-clamp-5`}>
          {asset.content_front}
        </p>
      </div>

      {/* Lime-green left accent bar */}
      <div className="absolute left-0 top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-lime-500/40 to-transparent z-20" />

      <div className="absolute bottom-2 right-4 z-20">
        <div className="w-4 h-4 rounded-full border border-lime-500/40 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-lime-500/60" />
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STATUS — Indigo/dark with ornate status badge
// ─────────────────────────────────────────────────────────────────────
function StatusCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {/* Ornate diagonal pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(160,140,255,0.2) 0px, rgba(160,140,255,0.2) 1px, transparent 1px, transparent 8px)',
        }}
      />

      {/* Double-border frame for ornate feel */}
      <div className="absolute inset-[4px] border border-indigo-500/15 rounded-lg pointer-events-none z-10" />
      <div className="absolute inset-[7px] border border-indigo-500/08 rounded-md pointer-events-none z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center h-full px-3 text-center gap-2">
        {/* Large status icon orb */}
        <div className={`${enlarged ? 'w-16 h-16' : 'w-10 h-10'} rounded-full bg-indigo-900/70 border border-indigo-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]`}>
          <span className={`${enlarged ? 'text-2xl' : 'text-base'} font-bold text-indigo-300`}>
            {asset.title?.charAt(0) ?? 'S'}
          </span>
        </div>

        <div>
          <div className="card-type-badge bg-indigo-800/60 text-indigo-200 mb-1">Status</div>
          <div className={`font-[var(--font-playfair)] font-bold text-indigo-100 ${enlarged ? 'text-base' : 'text-[10px]'} leading-tight`}>
            {asset.title}
          </div>
        </div>

        <div className="parchment-area rounded px-2 py-1 w-full">
          <p className={`parchment-text ${enlarged ? 'text-xs' : 'text-[8px]'} leading-snug line-clamp-3`}>
            {asset.content_front}
          </p>
        </div>

        <div className="text-[8px] font-mono text-indigo-500">#{asset.card_number}</div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ENDING — Crimson with gold ornamental frame
// ─────────────────────────────────────────────────────────────────────
function EndingCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {asset.image_url && (
        <>
          <img src={asset.image_url} alt={asset.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#450a0a]/60 to-[#270606]/90" />
        </>
      )}

      {/* Gold ornamental frame */}
      <div className="gold-frame" />

      {/* Corner ornaments */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[rgba(201,162,39,0.4)] z-20" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[rgba(201,162,39,0.4)] z-20" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[rgba(201,162,39,0.4)] z-20" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[rgba(201,162,39,0.4)] z-20" />

      <div className="relative z-20 flex flex-col items-center justify-center h-full px-3 text-center gap-2">
        <div className="card-type-badge bg-red-900/70 text-red-200 border border-red-700/30">Ending</div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.4)] to-transparent" />

        <div className={`font-[var(--font-playfair)] font-bold text-amber-100 ${enlarged ? 'text-xl' : 'text-[12px]'} leading-tight`}>
          {asset.title}
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.4)] to-transparent" />

        <p className={`text-red-200/70 ${enlarged ? 'text-sm' : 'text-[8px]'} leading-snug line-clamp-4 italic font-[var(--font-crimson)]`}>
          {asset.content_front}
        </p>

        <div className="text-[8px] font-mono text-amber-700/60 mt-auto">#{asset.card_number}</div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// DEFAULT fallback
// ─────────────────────────────────────────────────────────────────────
function DefaultCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  const cardType = resolveCardType(asset)
  const label    = TYPE_LABEL[cardType] ?? cardType
  const badge    = BADGE_BG[cardType] ?? 'bg-slate-700 text-white'

  return (
    <div className="relative z-10 flex flex-col gap-1 p-2">
      <div className="flex items-center justify-between">
        <span className={`card-type-badge ${badge}`}>{label}</span>
        <span className="text-[9px] font-mono text-white/40">#{asset.card_number}</span>
      </div>
      <div className={`font-bold text-white ${enlarged ? 'text-base' : 'text-[11px]'} leading-tight line-clamp-2`}>
        {asset.title}
      </div>
      <p className={`text-white/60 ${enlarged ? 'text-xs' : 'text-[9px]'} leading-snug line-clamp-5`}>
        {asset.content_front}
      </p>
    </div>
  )
}
