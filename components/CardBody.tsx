'use client'

import { JoinedAsset, resolveCardType, PANORAMA_TYPES, ACTION_TYPES } from '@/types'

// ─────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────

/** Deterministic tilt seeded from card ID — same card, same angle, always. */
function seedAngle(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  return ((h % 600) - 300) / 100
}

/** Pick a repeating SVG pattern variant (0–3) seeded from card number. */
function seedPattern(n: string | null): number {
  let h = 0
  for (let i = 0; i < (n ?? '').length; i++) h = (Math.imul(31, h) + (n ?? '').charCodeAt(i)) | 0
  return Math.abs(h) % 4
}

// ─────────────────────────────────────────────────────────────────────
// Type → CSS class / label maps
// ─────────────────────────────────────────────────────────────────────
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

// STATUS card: icon per title keyword
const STATUS_ICONS: Record<string, string> = {
  watched:    '👁',
  compromised:'⚠',
  trusted:    '🤝',
  evidence:   '📁',
  free:       '🔓',
  witness:    '👤',
  complicit:  '🔗',
  paranoid:   '🌀',
  lucid:      '💡',
  compliant:  '✔',
  memory:     '🧠',
  origin:     '🌐',
  crew:       '👥',
}
function statusIcon(title: string): string {
  const lower = title.toLowerCase()
  for (const [key, icon] of Object.entries(STATUS_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return '◈'
}

// ─────────────────────────────────────────────────────────────────────
// CardBody — main export
// ─────────────────────────────────────────────────────────────────────
interface CardBodyProps {
  asset: JoinedAsset
  enlarged?: boolean
}

export function CardBody({ asset, enlarged = false }: CardBodyProps) {
  const cardType  = resolveCardType(asset)
  const typeClass = TYPE_CLASS[cardType] ?? ''
  const isWindow  = cardType === 'WINDOW' || cardType === 'ACTION_WINDOW'
  const isNotch   = cardType === 'NOTCH'  || cardType === 'ACTION_NOTCH'

  const sizeClass = enlarged
    ? 'w-[280px] h-[420px]'
    : 'w-[140px] h-[210px] md:w-[150px] md:h-[225px]'

  return (
    <div className={`card-base flex-none border-[2px] ${isWindow ? 'border-dashed' : 'border-solid'} ${typeClass} ${sizeClass} rounded-xl flex flex-col shadow-2xl relative overflow-hidden select-none`}>
      {isNotch && <div className="notch-cutout" />}
      <CardTypeRenderer asset={asset} cardType={cardType} enlarged={enlarged} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────────────
function CardTypeRenderer({ asset, cardType, enlarged }: { asset: JoinedAsset; cardType: string; enlarged: boolean }) {
  switch (cardType) {
    case 'CHARACTER':                return <CharacterCard  asset={asset} enlarged={enlarged} />
    case 'SITUATION':
    case 'PANORAMA':                 return <SituationCard  asset={asset} enlarged={enlarged} />
    case 'STORY':                    return <StoryCard      asset={asset} enlarged={enlarged} />
    case 'ISSUE':                    return <IssueCard      asset={asset} enlarged={enlarged} />
    case 'ACTION_WINDOW':
    case 'WINDOW':
    case 'ACTION':                   return <WindowCard     asset={asset} enlarged={enlarged} />
    case 'NOTCH':
    case 'ACTION_NOTCH':             return <NotchCard      asset={asset} enlarged={enlarged} />
    case 'STATUS':                   return <StatusCard     asset={asset} enlarged={enlarged} />
    case 'ENDING':                   return <EndingCard     asset={asset} enlarged={enlarged} />
    default:                         return <DefaultCard    asset={asset} enlarged={enlarged} />
  }
}

// ─────────────────────────────────────────────────────────────────────
// CHARACTER
// ─────────────────────────────────────────────────────────────────────
function CharacterCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {asset.image_url
        ? <img src={asset.image_url} alt={asset.title} className="absolute inset-0 w-full h-full object-cover object-top" />
        : <CharacterPlaceholder title={asset.title} />
      }
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 left-0 z-20">
        <div className="card-number-badge bg-rose-900/80 text-rose-200 rounded-br-lg px-2 py-1">#{asset.card_number}</div>
      </div>
      <div className="absolute top-1.5 right-1.5 z-20 text-rose-200/60 text-[8px] italic leading-tight text-right max-w-[55%] drop-shadow">
        {enlarged ? 'Slide Status cards beneath this card.' : 'Status cards below'}
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="parchment-area px-3 py-2 text-center">
          <div className={`parchment-text font-bold tracking-wide uppercase leading-tight line-clamp-2 ${enlarged ? 'text-base' : 'text-[11px]'}`}>{asset.title}</div>
          <div className="card-type-badge bg-rose-800/60 text-rose-200 inline-block mt-1">Character</div>
        </div>
      </div>
    </>
  )
}

function CharacterPlaceholder({ title }: { title: string }) {
  const initial = title?.charAt(0) ?? '?'
  return (
    <div className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #3d0a1a 0%, #1a0509 100%)' }}>
      {/* Subtle rose cross-hatch */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(200,50,80,0.3) 0px, rgba(200,50,80,0.3) 1px, transparent 1px, transparent 12px)',
      }} />
      <div className="w-20 h-20 rounded-full border-2 border-rose-700/50 flex items-center justify-center shadow-[0_0_30px_rgba(159,18,57,0.4)]"
        style={{ background: 'linear-gradient(135deg, #7f1d3a 0%, #3d0a18 100%)' }}>
        <span className="text-3xl font-bold text-rose-200" style={{ fontFamily: 'var(--font-playfair)' }}>{initial}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// SITUATION / PANORAMA
// ─────────────────────────────────────────────────────────────────────
function SituationCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  const p = seedPattern(asset.card_number)
  return (
    <>
      {asset.image_url ? (
        <div className="absolute inset-0 z-0">
          <img src={asset.image_url} alt={asset.title} className="w-full h-[58%] object-cover object-center" />
          <div className="absolute top-0 left-0 right-0 h-[58%] bg-gradient-to-b from-transparent to-[rgba(28,14,5,0.7)]" />
        </div>
      ) : (
        <SituationPlaceholder title={asset.title} pattern={p} />
      )}
      <div className="absolute bottom-0 left-0 right-0 h-[44%] bg-gradient-to-t from-[#1e1308] to-transparent z-0 pointer-events-none" />
      <div className="absolute top-0 left-0 z-20">
        <div className="card-number-badge bg-[#c9a227] text-[#1a0f00] font-bold rounded-br-lg px-2 py-1">{asset.card_number}</div>
      </div>
      <div className="absolute top-1.5 right-1.5 z-20">
        <div className="card-type-badge bg-yellow-900/70 text-yellow-200">Situation</div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 px-2 pb-2 pt-1"
        style={{ background: 'linear-gradient(to top, rgba(10,6,2,0.92) 60%, transparent)' }}>
        <div className={`font-semibold text-amber-50 leading-snug line-clamp-3 text-center ${enlarged ? 'text-sm' : 'text-[9px]'}`}
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
          {asset.content_front}
        </div>
        {asset.title && (
          <div className={`italic text-amber-400/80 text-center mt-0.5 line-clamp-1 ${enlarged ? 'text-xs' : 'text-[8px]'}`}
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
            {asset.title}
          </div>
        )}
      </div>
    </>
  )
}

const SITUATION_PATTERNS = [
  // Pattern 0 — hex grid
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='24'%3E%3Cpath d='M14 2 L26 9 L26 21 L14 28 L2 21 L2 9 Z' fill='none' stroke='rgba(200,160,50,0.12)' stroke-width='1'/%3E%3C/svg%3E")`,
  // Pattern 1 — diagonal lines
  `repeating-linear-gradient(45deg, rgba(180,130,30,0.08) 0px, rgba(180,130,30,0.08) 1px, transparent 1px, transparent 10px)`,
  // Pattern 2 — cross grid
  `linear-gradient(rgba(180,140,40,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(180,140,40,0.07) 1px, transparent 1px)`,
  // Pattern 3 — dot matrix
  `radial-gradient(rgba(200,160,60,0.15) 1px, transparent 1px)`,
]
const SITUATION_BG_SIZES = ['28px 24px', '10px 10px', '20px 20px', '16px 16px']

function SituationPlaceholder({ title, pattern }: { title: string; pattern: number }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #1a1005 0%, #0e0a04 100%)' }}>
      {/* Atmospheric pattern */}
      <div className="absolute inset-0 opacity-100" style={{
        backgroundImage: SITUATION_PATTERNS[pattern],
        backgroundSize: SITUATION_BG_SIZES[pattern],
      }} />
      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(100,70,20,0.15) 0%, rgba(0,0,0,0.7) 100%)',
      }} />
      {/* Amber glow spot */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(200,162,39,0.8) 0%, transparent 70%)' }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STORY — Deep navy, parchment text area, gold rule
// Pure CSS — no image needed. The card IS the text.
// ─────────────────────────────────────────────────────────────────────
function StoryCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  const p = seedPattern(asset.card_number)
  const acts = ['I', 'II', 'III']
  const num = parseInt(asset.card_number ?? '0', 10)
  const act = num <= 65 ? 'I' : num <= 140 ? 'II' : 'III'

  return (
    <>
      {/* Background — always CSS for STORY, image optional overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #12154a 0%, #0a0c32 100%)' }}>
        {/* Subtle star-field or diagonal stripe */}
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: p % 2 === 0
            ? 'radial-gradient(rgba(160,150,255,0.3) 1px, transparent 1px)'
            : 'repeating-linear-gradient(135deg, rgba(100,90,200,0.08) 0px, rgba(100,90,200,0.08) 1px, transparent 1px, transparent 14px)',
          backgroundSize: p % 2 === 0 ? '18px 18px' : '14px 14px',
        }} />
        {asset.image_url && (
          <img src={asset.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
      </div>

      {/* Gold inner frame */}
      <div className="absolute inset-[3px] border border-[rgba(201,162,39,0.18)] rounded-lg pointer-events-none z-10" />

      {/* Top bar */}
      <div className="relative z-20 flex items-center gap-1 px-2 pt-2 pb-1">
        <div className="card-number-badge bg-indigo-900/80 text-indigo-300">#{asset.card_number}</div>
        <div className="flex-1 text-center">
          <span className="text-[8px] font-mono text-indigo-400/60 tracking-widest uppercase">Act {act}</span>
        </div>
        <div className="card-type-badge bg-indigo-800/70 text-indigo-200">Story</div>
      </div>

      {/* Title */}
      <div className={`relative z-20 px-3 mb-2 font-bold text-white leading-tight line-clamp-2 ${enlarged ? 'text-base' : 'text-[11px]'}`}
        style={{ fontFamily: 'var(--font-playfair)' }}>
        {asset.title}
      </div>

      {/* Gold rule */}
      <div className="relative z-20 mx-3 mb-2 h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.4)] to-transparent" />

      {/* Parchment text area — the main content */}
      <div className="relative z-20 mx-2 mb-2 flex-1 parchment-area rounded-lg p-2 overflow-hidden">
        <p className={`parchment-text leading-snug ${enlarged ? 'text-sm line-clamp-[14]' : 'text-[8.5px] line-clamp-7'}`}>
          {asset.content_front}
        </p>
      </div>

      {/* Bottom gold rule */}
      <div className="absolute bottom-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.25)] to-transparent z-20" />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ISSUE — Evidence document feel. Lined paper, amber tones.
// Pure CSS — no image needed. These are physical documents.
// ─────────────────────────────────────────────────────────────────────
function IssueCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {/* Background — aged document */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #2a1400 0%, #170c00 100%)' }}>
        {/* Horizontal ruled lines */}
        <div className="absolute inset-0 opacity-100" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 13px, rgba(180,120,30,0.12) 13px, rgba(180,120,30,0.12) 14px)',
          backgroundPositionY: '32px',
        }} />
        {/* Left margin line */}
        <div className="absolute top-0 bottom-0 left-6 w-px opacity-30" style={{ background: 'rgba(180,80,30,0.5)' }} />
        {asset.image_url && (
          <img src={asset.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        )}
      </div>

      {/* Header strip */}
      <div className="relative z-20 px-2 pt-1.5 pb-1 border-b border-amber-800/30">
        <div className="flex items-center justify-between">
          <div className="card-type-badge bg-amber-900/70 text-amber-200 text-[8px]">Evidence</div>
          <span className="font-mono text-amber-600/60 text-[8px]">#{asset.card_number}</span>
        </div>
      </div>

      {/* Title — like a document heading */}
      <div className={`relative z-20 px-2 pt-1.5 pb-1 font-bold text-amber-200 leading-tight line-clamp-2 ${enlarged ? 'text-sm' : 'text-[10px]'}`}
        style={{ fontFamily: 'var(--font-playfair)' }}>
        {asset.title}
      </div>

      {/* Body — Crimson Text on lined paper */}
      <div className={`relative z-20 px-2 flex-1 text-amber-100/80 leading-[1.45] ${enlarged ? 'text-xs' : 'text-[8px]'} line-clamp-8`}
        style={{ fontFamily: 'var(--font-crimson)', paddingLeft: '28px' }}>
        {asset.content_front}
      </div>

      {/* Bottom stamp */}
      <div className="relative z-20 px-2 pb-1.5 flex items-center justify-between">
        <div className="text-[7px] font-mono text-amber-800/50 uppercase tracking-widest">Meridian Protocol</div>
        <div className="w-5 h-5 rounded-full border border-amber-800/30 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-700/20" />
        </div>
      </div>

      {/* Corner fold effect */}
      <div className="absolute top-0 right-0 w-5 h-5 z-30 pointer-events-none"
        style={{ background: 'linear-gradient(225deg, rgba(100,60,10,0.6) 50%, transparent 50%)' }} />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ACTION_WINDOW / WINDOW — Cyan-tinted, transparent cutout.
// Pure CSS — the window IS the mechanic.
// ─────────────────────────────────────────────────────────────────────
function WindowCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {/* Cyan scan-line grid */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #041f2e 0%, #021420 100%)',
        backgroundImage: 'linear-gradient(rgba(0,220,240,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,240,0.07) 1px, transparent 1px)',
        backgroundSize: '12px 12px',
      }} />

      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-500/40 z-10" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-500/40 z-10" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan-500/40 z-10" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-500/40 z-10" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-2 pt-2 pb-1">
        <div className="card-number-badge bg-cyan-900/80 text-cyan-300 text-[9px]">#{asset.card_number}</div>
        <div className="card-type-badge bg-cyan-800/70 text-cyan-100">Window</div>
      </div>

      {/* Title */}
      <div className={`relative z-20 px-2 font-bold text-cyan-100 leading-tight line-clamp-2 ${enlarged ? 'text-sm' : 'text-[10px]'}`}>
        {asset.title}
      </div>

      {/* The transparent window cutout — core mechanic visual */}
      <div className="window-cutout" />

      {/* Instruction text below window */}
      <div className="absolute bottom-2 left-2 right-2 z-20 text-center">
        <p className={`text-cyan-300/50 leading-snug line-clamp-2 ${enlarged ? 'text-[11px]' : 'text-[7.5px]'}`}>
          {asset.content_front}
        </p>
      </div>

      <div className="absolute inset-0 ring-1 ring-inset ring-cyan-400/15 rounded-xl pointer-events-none" />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// NOTCH / ACTION_NOTCH — Lime-tinted, physical right-edge notch.
// Pure CSS — the notch IS the mechanic.
// ─────────────────────────────────────────────────────────────────────
function NotchCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {/* Dark lime grid */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #0d2206 0%, #071502 100%)',
        backgroundImage: 'linear-gradient(rgba(132,204,22,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(132,204,22,0.07) 1px, transparent 1px)',
        backgroundSize: '10px 10px',
      }} />

      {/* Left accent bar */}
      <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r z-20"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(132,204,22,0.5), transparent)' }} />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-2 pt-2 pb-1">
        <div className="card-number-badge bg-lime-900/80 text-lime-300 text-[9px]">#{asset.card_number}</div>
        <div className="card-type-badge bg-lime-800/70 text-lime-100">Notch</div>
      </div>

      {/* Title */}
      <div className={`relative z-20 px-2 font-bold text-lime-100 leading-tight line-clamp-2 mb-1 ${enlarged ? 'text-sm' : 'text-[10px]'}`}>
        {asset.title}
      </div>

      {/* Divider */}
      <div className="relative z-20 mx-2 mb-2 h-px bg-gradient-to-r from-lime-600/40 via-lime-500/20 to-transparent" />

      {/* Content */}
      <div className="relative z-20 px-2 flex-1">
        <p className={`text-lime-200/65 leading-snug ${enlarged ? 'text-[11px] line-clamp-10' : 'text-[8px] line-clamp-6'}`}
          style={{ fontFamily: 'var(--font-crimson)' }}>
          {asset.content_front}
        </p>
      </div>

      {/* Bottom indicator */}
      <div className="relative z-20 px-2 pb-2 flex justify-end items-center gap-1">
        <div className="text-[7px] font-mono text-lime-700/60 uppercase tracking-widest">align notch →</div>
        <div className="w-2 h-2 rounded-full border border-lime-600/40" />
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STATUS — Condition token / medallion.
// Pure CSS — ornamental, symbolic. No photo needed.
// ─────────────────────────────────────────────────────────────────────
function StatusCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  const icon = statusIcon(asset.title ?? '')
  const p    = seedPattern(asset.card_number)

  return (
    <>
      {/* Background — deep indigo with subtle pattern */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #1a1660 0%, #0e0b3a 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: p % 2 === 0
            ? 'repeating-linear-gradient(45deg, rgba(160,140,255,0.2) 0px, rgba(160,140,255,0.2) 1px, transparent 1px, transparent 8px)'
            : 'radial-gradient(rgba(140,120,255,0.2) 1px, transparent 1px)',
          backgroundSize: p % 2 === 0 ? '8px 8px' : '12px 12px',
        }} />
      </div>

      {/* Ornamental double border */}
      <div className="absolute inset-[3px] border border-indigo-500/20 rounded-lg pointer-events-none z-10" />
      <div className="absolute inset-[6px] border border-indigo-500/10 rounded-md pointer-events-none z-10" />

      {/* Corner ornaments */}
      <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-indigo-400/30 z-20" />
      <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-indigo-400/30 z-20" />
      <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-indigo-400/30 z-20" />
      <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-indigo-400/30 z-20" />

      <div className="relative z-20 flex flex-col items-center justify-center h-full px-3 text-center gap-2">
        {/* Status medallion */}
        <div className={`rounded-full border border-indigo-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.35)] ${enlarged ? 'w-16 h-16' : 'w-10 h-10'}`}
          style={{ background: 'linear-gradient(135deg, #2d2880 0%, #1a1660 100%)' }}>
          <span className={`${enlarged ? 'text-2xl' : 'text-lg'}`}>{icon}</span>
        </div>

        {/* Type chip */}
        <div className="card-type-badge bg-indigo-800/60 text-indigo-300 border border-indigo-600/20">Status</div>

        {/* Gold rule */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.3)] to-transparent" />

        {/* Title — the status name is the card */}
        <div className={`font-bold text-indigo-100 leading-tight ${enlarged ? 'text-base' : 'text-[10px]'}`}
          style={{ fontFamily: 'var(--font-playfair)' }}>
          {asset.title}
        </div>

        {/* Effect description */}
        <div className="parchment-area rounded px-2 py-1 w-full">
          <p className={`parchment-text leading-snug line-clamp-3 ${enlarged ? 'text-xs' : 'text-[7.5px]'}`}>
            {asset.content_front}
          </p>
        </div>

        <div className="text-[7px] font-mono text-indigo-600/50">#{asset.card_number}</div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ENDING — Crimson with gold ornamental frame.
// ─────────────────────────────────────────────────────────────────────
function EndingCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #3d0505 0%, #1f0303 100%)' }}>
        {asset.image_url
          ? <img src={asset.image_url} alt={asset.title} className="absolute inset-0 w-full h-full object-cover opacity-35" />
          : <EndingPattern />
        }
      </div>

      {/* Gold ornamental frame */}
      <div className="gold-frame" />

      {/* Corner ornaments */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[rgba(201,162,39,0.45)] z-20" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[rgba(201,162,39,0.45)] z-20" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[rgba(201,162,39,0.45)] z-20" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[rgba(201,162,39,0.45)] z-20" />

      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center gap-2">
        <div className="card-type-badge bg-red-900/70 text-red-200 border border-red-700/30">Ending</div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.45)] to-transparent" />

        {/* Dramatic title */}
        <div className={`font-bold text-amber-100 leading-tight ${enlarged ? 'text-xl' : 'text-[13px]'}`}
          style={{ fontFamily: 'var(--font-playfair)', textShadow: '0 0 20px rgba(201,162,39,0.4)' }}>
          {asset.title}
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.45)] to-transparent" />

        <p className={`text-red-200/70 leading-snug line-clamp-4 italic ${enlarged ? 'text-sm' : 'text-[8px]'}`}
          style={{ fontFamily: 'var(--font-crimson)' }}>
          {asset.content_front}
        </p>

        <div className="text-[7px] font-mono text-amber-800/50 mt-auto">#{asset.card_number}</div>
      </div>
    </>
  )
}

function EndingPattern() {
  return (
    <div className="absolute inset-0">
      {/* Radial crimson glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 60%, rgba(180,20,20,0.3) 0%, transparent 70%)',
      }} />
      {/* Concentric ring pattern */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        {[40, 60, 80, 100].map(r => (
          <div key={r} className="absolute rounded-full border border-amber-500/60"
            style={{ width: `${r}%`, height: `${r}%` }} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// DEFAULT fallback
// ─────────────────────────────────────────────────────────────────────
function DefaultCard({ asset, enlarged }: { asset: JoinedAsset; enlarged: boolean }) {
  const cardType = resolveCardType(asset)
  const label    = TYPE_LABEL[cardType] ?? cardType
  const badge    = BADGE_BG[cardType]   ?? 'bg-slate-700 text-white'
  return (
    <div className="relative z-10 flex flex-col gap-1 p-2">
      <div className="flex items-center justify-between">
        <span className={`card-type-badge ${badge}`}>{label}</span>
        <span className="text-[9px] font-mono text-white/40">#{asset.card_number}</span>
      </div>
      <div className={`font-bold text-white leading-tight line-clamp-2 ${enlarged ? 'text-base' : 'text-[11px]'}`}>{asset.title}</div>
      <p className={`text-white/60 leading-snug line-clamp-5 ${enlarged ? 'text-xs' : 'text-[9px]'}`}>{asset.content_front}</p>
    </div>
  )
}
