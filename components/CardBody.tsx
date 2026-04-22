'use client'

import { JoinedAsset, resolveCardType, PANORAMA_TYPES, ACTION_TYPES } from '@/types'
import { TTSButton } from '@/components/TTSButton'

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

  const widthClass = enlarged ? 'w-[var(--card-w-lg)]' : 'w-[var(--card-w)]'
  const ttsText    = [asset.title, asset.content_front].filter(Boolean).join('. ')

  return (
    <div
      className={`card-base flex-none border-[2px] ${isWindow ? 'border-dashed' : 'border-solid'} ${typeClass} ${widthClass} rounded-xl flex flex-col shadow-2xl relative overflow-hidden select-none`}
      style={enlarged ? { overflowY: 'auto' } : undefined}
    >
      {isNotch && <div className="notch-cutout" />}
      <CardTypeRenderer asset={asset} cardType={cardType} enlarged={enlarged} />
      <TTSButton cardId={asset.state_id} text={ttsText} enlarged={enlarged} />
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
        <div className="card-number-badge bg-rose-900/80 text-rose-200">#{asset.card_number}</div>
      </div>
      <div
        className="absolute z-20 italic leading-tight text-right text-rose-200/60"
        style={{ top: '3cqi', right: '3cqi', fontSize: '4cqi', maxWidth: '55%' }}
      >
        {enlarged ? 'Slide Status cards beneath this card.' : 'Status cards below'}
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="parchment-area text-center" style={{ padding: '3cqi 3cqi 5cqi' }}>
          <div
            className="parchment-text font-bold tracking-wide uppercase leading-tight line-clamp-2"
            style={{ fontSize: '6cqi' }}
          >
            {asset.title}
          </div>
          <div className="card-type-badge bg-rose-800/60 text-rose-200 inline-block" style={{ marginTop: '1.5cqi' }}>Character</div>
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
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(200,50,80,0.3) 0px, rgba(200,50,80,0.3) 1px, transparent 1px, transparent 6cqi)',
      }} />
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: '45cqi',
          height: '45cqi',
          borderWidth: '0.5cqi',
          borderStyle: 'solid',
          borderColor: 'rgba(159,18,57,0.5)',
          boxShadow: '0 0 30px rgba(159,18,57,0.4)',
          background: 'linear-gradient(135deg, #7f1d3a 0%, #3d0a18 100%)',
        }}
      >
        <span
          className="font-bold text-rose-200"
          style={{ fontSize: '20cqi', fontFamily: 'var(--font-playfair)' }}
        >
          {initial}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// SITUATION / PANORAMA
// ─────────────────────────────────────────────────────────────────────
const SITUATION_PATTERNS = [
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='24'%3E%3Cpath d='M14 2 L26 9 L26 21 L14 28 L2 21 L2 9 Z' fill='none' stroke='rgba(200,160,50,0.12)' stroke-width='1'/%3E%3C/svg%3E")`,
  `repeating-linear-gradient(45deg, rgba(180,130,30,0.08) 0px, rgba(180,130,30,0.08) 1px, transparent 1px, transparent 5cqi)`,
  `linear-gradient(rgba(180,140,40,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(180,140,40,0.07) 1px, transparent 1px)`,
  `radial-gradient(rgba(200,160,60,0.15) 1px, transparent 1px)`,
]
const SITUATION_BG_SIZES = ['14cqi 12cqi', '5cqi 5cqi', '10cqi 10cqi', '8cqi 8cqi']

function SituationCard({ asset, enlarged = false }: { asset: JoinedAsset; enlarged?: boolean }) {
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
        <div className="card-number-badge bg-[#c9a227] text-[#1a0f00] font-bold">{asset.card_number}</div>
      </div>
      <div className="absolute top-0 right-0 z-20" style={{ padding: '1.5cqi 3cqi 0' }}>
        <div className="card-type-badge bg-yellow-900/70 text-yellow-200">Situation</div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{ padding: '2cqi', background: 'linear-gradient(to top, rgba(10,6,2,0.92) 60%, transparent)' }}
      >
        <div
          className={`font-semibold text-amber-50 leading-snug text-center ${enlarged ? '' : 'line-clamp-3'}`}
          style={{ fontSize: '4.5cqi', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
        >
          {asset.content_front}
        </div>
        {asset.title && (
          <div
            className={`italic text-amber-400/80 text-center ${enlarged ? '' : 'line-clamp-1'}`}
            style={{ fontSize: '4cqi', marginTop: '1cqi', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
          >
            {asset.title}
          </div>
        )}
      </div>
    </>
  )
}

function SituationPlaceholder({ title, pattern }: { title: string; pattern: number }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #1a1005 0%, #0e0a04 100%)' }}>
      <div className="absolute inset-0 opacity-100" style={{
        backgroundImage: SITUATION_PATTERNS[pattern],
        backgroundSize: SITUATION_BG_SIZES[pattern],
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(100,70,20,0.15) 0%, rgba(0,0,0,0.7) 100%)',
      }} />
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{
          top: '30%',
          width: '32cqi',
          height: '32cqi',
          background: 'radial-gradient(circle, rgba(200,162,39,0.8) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STORY
// ─────────────────────────────────────────────────────────────────────
function StoryCard({ asset, enlarged = false }: { asset: JoinedAsset; enlarged?: boolean }) {
  const p = seedPattern(asset.card_number)
  const num = parseInt(asset.card_number ?? '0', 10)
  const act = num <= 65 ? 'I' : num <= 140 ? 'II' : 'III'

  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #12154a 0%, #0a0c32 100%)' }}>
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: p % 2 === 0
            ? 'radial-gradient(rgba(160,150,255,0.3) 1px, transparent 1px)'
            : 'repeating-linear-gradient(135deg, rgba(100,90,200,0.08) 0px, rgba(100,90,200,0.08) 1px, transparent 1px, transparent 7cqi)',
          backgroundSize: p % 2 === 0 ? '9cqi 9cqi' : '7cqi 7cqi',
        }} />
        {asset.image_url && (
          <img src={asset.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
      </div>

      <div className="absolute border border-[rgba(201,162,39,0.18)] rounded-lg pointer-events-none z-10" style={{ inset: '1.5cqi' }} />

      <div className="relative z-20 flex items-center" style={{ gap: '2cqi', padding: '4cqi 4cqi 2cqi' }}>
        <div className="card-number-badge bg-indigo-900/80 text-indigo-300">#{asset.card_number}</div>
        <div className="flex-1 text-center">
          <span
            className="font-mono text-indigo-400/60 tracking-widest uppercase"
            style={{ fontSize: '4cqi' }}
          >
            Act {act}
          </span>
        </div>
        <div className="card-type-badge bg-indigo-800/70 text-indigo-200">Story</div>
      </div>

      <div
        className={`relative z-20 font-bold text-white leading-tight ${enlarged ? '' : 'line-clamp-2'}`}
        style={{ padding: '0 6cqi', marginBottom: '4cqi', fontSize: '6cqi', fontFamily: 'var(--font-playfair)' }}
      >
        {asset.title}
      </div>

      <div className="relative z-20 h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.4)] to-transparent" style={{ margin: '0 6cqi 4cqi' }} />

      <div className={`relative z-20 flex-1 parchment-area rounded-lg ${enlarged ? 'overflow-y-auto' : 'overflow-hidden'}`} style={{ margin: '0 4cqi 4cqi', padding: '4cqi' }}>
        <p className="parchment-text leading-snug" style={{ fontSize: '4.5cqi' }}>
          {asset.content_front}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.25)] to-transparent z-20" style={{ margin: '0 4cqi' }} />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ISSUE
// ─────────────────────────────────────────────────────────────────────
function IssueCard({ asset, enlarged = false }: { asset: JoinedAsset; enlarged?: boolean }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #2a1400 0%, #170c00 100%)' }}>
        <div className="absolute inset-0 opacity-100" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 7cqi, rgba(180,120,30,0.12) 7cqi, rgba(180,120,30,0.12) 7.5cqi)',
          backgroundPositionY: '16cqi',
        }} />
        <div
          className="absolute top-0 bottom-0 opacity-30"
          style={{ left: '12cqi', width: '0.5cqi', background: 'rgba(180,80,30,0.5)' }}
        />
        {asset.image_url && (
          <img src={asset.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        )}
      </div>

      <div
        className="relative z-20 border-b border-amber-800/30"
        style={{ padding: '3cqi 4cqi 2cqi' }}
      >
        <div className="flex items-center justify-between">
          <div className="card-type-badge bg-amber-900/70 text-amber-200">Evidence</div>
          <span className="font-mono text-amber-600/60" style={{ fontSize: '4cqi' }}>#{asset.card_number}</span>
        </div>
      </div>

      <div
        className={`relative z-20 font-bold text-amber-200 leading-tight ${enlarged ? '' : 'line-clamp-2'}`}
        style={{ padding: '3cqi 4cqi 2cqi', fontSize: '5cqi', fontFamily: 'var(--font-playfair)' }}
      >
        {asset.title}
      </div>

      <div
        className={`relative z-20 flex-1 text-amber-100/80 leading-[1.45] ${enlarged ? 'overflow-y-auto min-h-0' : 'line-clamp-8'}`}
        style={{ fontSize: '4cqi', padding: '0 4cqi 0 14cqi', fontFamily: 'var(--font-crimson)' }}
      >
        {asset.content_front}
      </div>

      <div className="relative z-20 flex items-center justify-between" style={{ padding: '2cqi 4cqi 3cqi' }}>
        <div className="font-mono text-amber-800/50 uppercase tracking-widest" style={{ fontSize: '3.5cqi' }}>Meridian Protocol</div>
        <div
          className="rounded-full border border-amber-800/30 flex items-center justify-center"
          style={{ width: '10cqi', height: '10cqi' }}
        >
          <div className="rounded-full bg-amber-700/20" style={{ width: '4cqi', height: '4cqi' }} />
        </div>
      </div>

      <div
        className="absolute top-0 right-0 z-30 pointer-events-none"
        style={{
          width: '10cqi',
          height: '10cqi',
          background: 'linear-gradient(225deg, rgba(100,60,10,0.6) 50%, transparent 50%)',
        }}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ACTION_WINDOW / WINDOW
// ─────────────────────────────────────────────────────────────────────
function WindowCard({ asset, enlarged = false }: { asset: JoinedAsset; enlarged?: boolean }) {
  return (
    <>
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #041f2e 0%, #021420 100%)',
        backgroundImage: 'linear-gradient(rgba(0,220,240,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,240,0.07) 1px, transparent 1px)',
        backgroundSize: '8cqi 8cqi',
      }} />

      {/* Corner brackets */}
      {[
        { top: '4cqi', left: '4cqi', borderTop: '0.5cqi solid rgba(0,220,240,0.4)', borderLeft: '0.5cqi solid rgba(0,220,240,0.4)' },
        { top: '4cqi', right: '4cqi', borderTop: '0.5cqi solid rgba(0,220,240,0.4)', borderRight: '0.5cqi solid rgba(0,220,240,0.4)' },
        { bottom: '4cqi', left: '4cqi', borderBottom: '0.5cqi solid rgba(0,220,240,0.4)', borderLeft: '0.5cqi solid rgba(0,220,240,0.4)' },
        { bottom: '4cqi', right: '4cqi', borderBottom: '0.5cqi solid rgba(0,220,240,0.4)', borderRight: '0.5cqi solid rgba(0,220,240,0.4)' },
      ].map((s, i) => (
        <div key={i} className="absolute z-10" style={{ width: '6cqi', height: '6cqi', ...s }} />
      ))}

      <div className="relative z-20 flex items-center justify-between" style={{ padding: '4cqi 4cqi 2cqi' }}>
        <div className="card-number-badge bg-cyan-900/80 text-cyan-300">#{asset.card_number}</div>
        <div className="card-type-badge bg-cyan-800/70 text-cyan-100">Window</div>
      </div>

      <div
        className={`relative z-20 font-bold text-cyan-100 leading-tight ${enlarged ? '' : 'line-clamp-2'}`}
        style={{ padding: '0 4cqi', fontSize: '5cqi' }}
      >
        {asset.title}
      </div>

      <div className="window-cutout" />

      <div className="absolute bottom-0 left-0 right-0 z-20 text-center" style={{ padding: '0 4cqi 4cqi' }}>
        <p className={`text-cyan-300/50 leading-snug ${enlarged ? '' : 'line-clamp-2'}`} style={{ fontSize: '3.75cqi' }}>
          {asset.content_front}
        </p>
      </div>

      <div className="absolute inset-0 ring-1 ring-inset ring-cyan-400/15 rounded-xl pointer-events-none" />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// NOTCH / ACTION_NOTCH
// ─────────────────────────────────────────────────────────────────────
function NotchCard({ asset, enlarged = false }: { asset: JoinedAsset; enlarged?: boolean }) {
  return (
    <>
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #0d2206 0%, #071502 100%)',
        backgroundImage: 'linear-gradient(rgba(132,204,22,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(132,204,22,0.07) 1px, transparent 1px)',
        backgroundSize: '8cqi 8cqi',
      }} />

      <div
        className="absolute z-20 rounded-r"
        style={{
          left: 0,
          top: '8cqi',
          bottom: '8cqi',
          width: '1.5cqi',
          background: 'linear-gradient(to bottom, transparent, rgba(132,204,22,0.5), transparent)',
        }}
      />

      <div className="relative z-20 flex items-center justify-between" style={{ padding: '4cqi 4cqi 2cqi' }}>
        <div className="card-number-badge bg-lime-900/80 text-lime-300">#{asset.card_number}</div>
        <div className="card-type-badge bg-lime-800/70 text-lime-100">Notch</div>
      </div>

      <div
        className={`relative z-20 font-bold text-lime-100 leading-tight ${enlarged ? '' : 'line-clamp-2'}`}
        style={{ padding: '0 4cqi', marginBottom: '2cqi', fontSize: '5cqi' }}
      >
        {asset.title}
      </div>

      <div
        className="relative z-20 h-px bg-gradient-to-r from-lime-600/40 via-lime-500/20 to-transparent"
        style={{ margin: '0 4cqi 4cqi' }}
      />

      <div className={`relative z-20 flex-1 ${enlarged ? 'overflow-y-auto min-h-0' : ''}`} style={{ padding: '0 4cqi' }}>
        <p
          className={`text-lime-200/65 leading-snug ${enlarged ? '' : 'line-clamp-6'}`}
          style={{ fontSize: '4cqi', fontFamily: 'var(--font-crimson)' }}
        >
          {asset.content_front}
        </p>
      </div>

      <div className="relative z-20 flex justify-end items-center" style={{ gap: '2cqi', padding: '2cqi 4cqi 4cqi' }}>
        <div className="font-mono text-lime-700/60 uppercase tracking-widest" style={{ fontSize: '3.5cqi' }}>align notch →</div>
        <div
          className="rounded-full border border-lime-600/40"
          style={{ width: '4cqi', height: '4cqi' }}
        />
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STATUS
// ─────────────────────────────────────────────────────────────────────
function StatusCard({ asset, enlarged = false }: { asset: JoinedAsset; enlarged?: boolean }) {
  const icon = statusIcon(asset.title ?? '')
  const p    = seedPattern(asset.card_number)

  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #1a1660 0%, #0e0b3a 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: p % 2 === 0
            ? 'repeating-linear-gradient(45deg, rgba(160,140,255,0.2) 0px, rgba(160,140,255,0.2) 1px, transparent 1px, transparent 4cqi)'
            : 'radial-gradient(rgba(140,120,255,0.2) 1px, transparent 1px)',
          backgroundSize: p % 2 === 0 ? '4cqi 4cqi' : '6cqi 6cqi',
        }} />
      </div>

      <div className="absolute border border-indigo-500/20 rounded-lg pointer-events-none z-10" style={{ inset: '1.5cqi' }} />
      <div className="absolute border border-indigo-500/10 rounded-md pointer-events-none z-10" style={{ inset: '3cqi' }} />

      {/* Corner ornaments */}
      {[
        { top: '5cqi', left: '5cqi', borderTop: '0.5cqi solid rgba(165,180,252,0.3)', borderLeft: '0.5cqi solid rgba(165,180,252,0.3)' },
        { top: '5cqi', right: '5cqi', borderTop: '0.5cqi solid rgba(165,180,252,0.3)', borderRight: '0.5cqi solid rgba(165,180,252,0.3)' },
        { bottom: '5cqi', left: '5cqi', borderBottom: '0.5cqi solid rgba(165,180,252,0.3)', borderLeft: '0.5cqi solid rgba(165,180,252,0.3)' },
        { bottom: '5cqi', right: '5cqi', borderBottom: '0.5cqi solid rgba(165,180,252,0.3)', borderRight: '0.5cqi solid rgba(165,180,252,0.3)' },
      ].map((s, i) => (
        <div key={i} className="absolute z-20" style={{ width: '5cqi', height: '5cqi', ...s }} />
      ))}

      <div
        className={`relative z-20 flex flex-col items-center h-full text-center ${enlarged ? 'justify-start pt-[6cqi]' : 'justify-center'}`}
        style={{ padding: `0 6cqi`, gap: '4cqi' }}
      >
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: '28cqi',
            height: '28cqi',
            borderWidth: '0.5cqi',
            borderStyle: 'solid',
            borderColor: 'rgba(165,180,252,0.3)',
            boxShadow: '0 0 20px rgba(99,102,241,0.35)',
            background: 'linear-gradient(135deg, #2d2880 0%, #1a1660 100%)',
          }}
        >
          <span style={{ fontSize: '14cqi' }}>{icon}</span>
        </div>

        <div className="card-type-badge bg-indigo-800/60 text-indigo-300 border border-indigo-600/20">Status</div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.3)] to-transparent" />

        <div
          className="font-bold text-indigo-100 leading-tight"
          style={{ fontSize: '5cqi', fontFamily: 'var(--font-playfair)' }}
        >
          {asset.title}
        </div>

        <div className="parchment-area rounded w-full" style={{ padding: '2cqi 4cqi' }}>
          <p className={`parchment-text leading-snug ${enlarged ? '' : 'line-clamp-3'}`} style={{ fontSize: '3.75cqi' }}>
            {asset.content_front}
          </p>
        </div>

        <div className="font-mono text-indigo-600/50" style={{ fontSize: '3.5cqi' }}>#{asset.card_number}</div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ENDING
// ─────────────────────────────────────────────────────────────────────
function EndingCard({ asset, enlarged = false }: { asset: JoinedAsset; enlarged?: boolean }) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #3d0505 0%, #1f0303 100%)' }}>
        {asset.image_url
          ? <img src={asset.image_url} alt={asset.title} className="absolute inset-0 w-full h-full object-cover opacity-35" />
          : <EndingPattern />
        }
      </div>

      <div className="gold-frame" />

      {/* Corner ornaments */}
      {[
        { top: '6cqi', left: '6cqi', borderTop: '0.5cqi solid rgba(201,162,39,0.45)', borderLeft: '0.5cqi solid rgba(201,162,39,0.45)' },
        { top: '6cqi', right: '6cqi', borderTop: '0.5cqi solid rgba(201,162,39,0.45)', borderRight: '0.5cqi solid rgba(201,162,39,0.45)' },
        { bottom: '6cqi', left: '6cqi', borderBottom: '0.5cqi solid rgba(201,162,39,0.45)', borderLeft: '0.5cqi solid rgba(201,162,39,0.45)' },
        { bottom: '6cqi', right: '6cqi', borderBottom: '0.5cqi solid rgba(201,162,39,0.45)', borderRight: '0.5cqi solid rgba(201,162,39,0.45)' },
      ].map((s, i) => (
        <div key={i} className="absolute z-20" style={{ width: '6cqi', height: '6cqi', ...s }} />
      ))}

      <div
        className={`relative z-20 flex flex-col items-center h-full text-center ${enlarged ? 'justify-start pt-[6cqi]' : 'justify-center'}`}
        style={{ padding: '0 8cqi', gap: '4cqi' }}
      >
        <div className="card-type-badge bg-red-900/70 text-red-200 border border-red-700/30">Ending</div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.45)] to-transparent" />

        <div
          className="font-bold text-amber-100 leading-tight"
          style={{ fontSize: '7cqi', fontFamily: 'var(--font-playfair)', textShadow: '0 0 20px rgba(201,162,39,0.4)' }}
        >
          {asset.title}
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0.45)] to-transparent" />

        <p
          className={`text-red-200/70 leading-snug italic ${enlarged ? '' : 'line-clamp-4'}`}
          style={{ fontSize: '4cqi', fontFamily: 'var(--font-crimson)' }}
        >
          {asset.content_front}
        </p>

        <div className="font-mono text-amber-800/50 mt-auto" style={{ fontSize: '3.5cqi' }}>#{asset.card_number}</div>
      </div>
    </>
  )
}

function EndingPattern() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 60%, rgba(180,20,20,0.3) 0%, transparent 70%)',
      }} />
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
function DefaultCard({ asset, enlarged = false }: { asset: JoinedAsset; enlarged?: boolean }) {
  const cardType = resolveCardType(asset)
  const label    = TYPE_LABEL[cardType] ?? cardType
  const badge    = BADGE_BG[cardType]   ?? 'bg-slate-700 text-white'
  return (
    <div className="relative z-10 flex flex-col" style={{ gap: '2cqi', padding: '4cqi' }}>
      <div className="flex items-center justify-between">
        <span className={`card-type-badge ${badge}`}>{label}</span>
        <span className="font-mono text-white/40" style={{ fontSize: '4.5cqi' }}>#{asset.card_number}</span>
      </div>
      <div className={`font-bold text-white leading-tight ${enlarged ? '' : 'line-clamp-2'}`} style={{ fontSize: '5.5cqi' }}>{asset.title}</div>
      <p className={`text-white/60 leading-snug ${enlarged ? '' : 'line-clamp-5'}`} style={{ fontSize: '4.5cqi' }}>{asset.content_front}</p>
    </div>
  )
}
