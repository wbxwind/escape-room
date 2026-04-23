'use client'

import { JoinedAsset, resolveCardType } from '@/types'

interface ObjectivePanelProps {
  items: JoinedAsset[]
}

const HEALTH_COLORS = {
  front:    { ring: 'rgba(34,197,94,0.5)',  label: 'Healthy',  dot: '#22c55e' },
  back:     { ring: 'rgba(251,146,60,0.5)', label: 'Weakened', dot: '#fb923c' },
  critical: { ring: 'rgba(239,68,68,0.5)',  label: 'Critical', dot: '#ef4444' },
}

const STATUS_ICONS: Record<string, string> = {
  watched:     '👁',
  compromised: '⚠',
  trusted:     '🤝',
  evidence:    '📁',
  free:        '🔓',
  witness:     '👤',
  complicit:   '🔗',
  paranoid:    '🌀',
  lucid:       '💡',
  compliant:   '✔',
  memory:      '🧠',
  origin:      '🌐',
  crew:        '👥',
  frozen:      '❄',
  injured:     '🩹',
  mistrust:    '😞',
  outcast:     '😠',
}

function getStatusIcon(title: string): string {
  const lower = title.toLowerCase()
  for (const [key, icon] of Object.entries(STATUS_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return '◈'
}

export function ObjectivePanel({ items }: ObjectivePanelProps) {
  const objectiveZone = items.filter(i => i.current_zone === 'OBJECTIVE')

  const character = objectiveZone.find(i => resolveCardType(i) === 'CHARACTER')
  const objective = objectiveZone.find(i => resolveCardType(i) === 'OBJECTIVE')
  const statuses  = objectiveZone.filter(i => resolveCardType(i) === 'STATUS')

  // Derive health state from character card flip_state
  const healthKey = !character ? null
                  : character.flip_state === 'back' ? 'back'
                  : 'front'
  const health = healthKey ? HEALTH_COLORS[healthKey] : null

  // Current objective text depends on flip_state
  const objectiveText = objective
    ? (objective.flip_state === 'back' ? objective.content_back : objective.content_front) || objective.title
    : null
  const chapterNum = objective?.objective_chapter ?? null

  if (!character && !objective && statuses.length === 0) return null

  return (
    <div
      className="flex flex-col rounded-xl border border-[rgba(201,162,39,0.2)] overflow-hidden"
      style={{ background: 'linear-gradient(180deg, rgba(10,6,2,0.95) 0%, rgba(5,3,1,0.98) 100%)', gap: 0 }}
    >
      {/* Chapter / Objective header */}
      {objective && (
        <div
          className="flex flex-col"
          style={{ padding: '8px 10px 6px', borderBottom: '1px solid rgba(201,162,39,0.15)' }}
        >
          {chapterNum && (
            <div
              className="font-mono uppercase tracking-widest text-amber-600/60"
              style={{ fontSize: '9px', marginBottom: '3px' }}
            >
              Act {chapterNum}
            </div>
          )}
          <div
            className="font-semibold text-amber-100 leading-snug"
            style={{ fontSize: '11px', fontFamily: 'var(--font-playfair)' }}
          >
            {objectiveText}
          </div>
        </div>
      )}

      {/* Character health */}
      {character && health && (
        <div
          className="flex items-center"
          style={{ padding: '6px 10px', gap: '8px', borderBottom: statuses.length > 0 ? '1px solid rgba(201,162,39,0.1)' : undefined }}
        >
          <div
            className="rounded-full flex-none"
            style={{
              width: '28px',
              height: '28px',
              background: character.image_url ? undefined : 'linear-gradient(135deg, #3d0a1a 0%, #1a0509 100%)',
              border: `1.5px solid ${health.ring}`,
              overflow: 'hidden',
            }}
          >
            {character.image_url
              ? <img src={character.image_url} alt={character.title} className="w-full h-full object-cover object-top" />
              : <div className="w-full h-full flex items-center justify-center text-rose-200 font-bold" style={{ fontSize: '12px' }}>
                  {character.title?.charAt(0) ?? '?'}
                </div>
            }
          </div>
          <div className="flex flex-col min-w-0">
            <div className="font-semibold text-rose-200 truncate" style={{ fontSize: '11px' }}>
              {character.title}
            </div>
            <div className="flex items-center" style={{ gap: '4px', marginTop: '1px' }}>
              <div className="rounded-full flex-none" style={{ width: '6px', height: '6px', background: health.dot }} />
              <span style={{ fontSize: '9px', color: health.dot }}>{health.label}</span>
            </div>
          </div>
        </div>
      )}

      {/* Status badges */}
      {statuses.length > 0 && (
        <div
          className="flex flex-wrap"
          style={{ padding: '6px 10px', gap: '4px' }}
        >
          {statuses.map(s => (
            <div
              key={s.state_id}
              className="flex items-center rounded-full border"
              style={{
                gap: '3px',
                padding: '2px 6px',
                background: 'rgba(99,102,241,0.15)',
                borderColor: s.flip_state === 'back' ? 'rgba(239,68,68,0.5)' : 'rgba(165,180,252,0.3)',
              }}
              title={s.content_front ?? s.title}
            >
              <span style={{ fontSize: '9px' }}>{getStatusIcon(s.title ?? '')}</span>
              <span
                className="font-mono uppercase tracking-wide truncate"
                style={{ fontSize: '8px', color: s.flip_state === 'back' ? '#fca5a5' : '#a5b4fc', maxWidth: '60px' }}
              >
                {s.title}
              </span>
              {s.flip_state === 'back' && (
                <span style={{ fontSize: '8px', color: '#fca5a5' }}>!</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
