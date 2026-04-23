'use client'

import { useState, useEffect, useCallback } from 'react'
import type { JoinedAsset } from '@/types'

interface StoryModalProps {
  card: JoinedAsset | null
  onClose: () => void
  onContinue?: () => void
  onDraw?: (cardNumber: string) => Promise<void>
}

// ── Text parser ───────────────────────────────────────────────────────────────

interface TextSegment {
  type: 'text' | 'draw' | 'range'
  content: string
  cardNumber?: string
  from?: string
  to?: string
}

// Parses "draw card 014", "draw cards 051 to 056", "► ..." patterns
function parseStoryText(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  // Match: (draw card 014) or (draw cards 051 to 056)
  const re = /draw cards?\s+(\d+)(?:\s+(?:to|-)\s+(\d+))?/gi
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: 'text', content: text.slice(last, m.index) })
    if (m[2]) {
      segments.push({ type: 'range', content: m[0], from: m[1], to: m[2] })
    } else {
      segments.push({ type: 'draw', content: m[0], cardNumber: m[1] })
    }
    last = m.index + m[0].length
  }
  if (last < text.length) segments.push({ type: 'text', content: text.slice(last) })
  return segments
}

// ── Draw action button ────────────────────────────────────────────────────────

function DrawButton({
  label,
  onDraw,
}: {
  label: string
  onDraw: () => Promise<void>
}) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handle() {
    if (done || loading) return
    setLoading(true)
    await onDraw()
    setLoading(false)
    setDone(true)
  }

  return (
    <button
      onClick={handle}
      disabled={done || loading}
      className="inline-flex items-center rounded-md font-semibold transition-all"
      style={{
        gap: '4px',
        padding: '2px 10px',
        fontSize: '13px',
        background: done ? 'rgba(34,197,94,0.15)' : loading ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.25)',
        border: done ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(165,180,252,0.4)',
        color: done ? '#86efac' : '#c7d2fe',
        cursor: done ? 'default' : 'pointer',
        verticalAlign: 'middle',
      }}
    >
      {done ? '✓ Drawn' : loading ? '…' : `▶ ${label}`}
    </button>
  )
}

// ── Rendered story text with inline draw buttons ───────────────────────────────

function StoryText({
  text,
  onDraw,
}: {
  text: string
  onDraw?: (cardNumber: string) => Promise<void>
}) {
  const segments = parseStoryText(text)

  return (
    <div style={{ fontSize: '14px', fontFamily: 'var(--font-crimson)', lineHeight: '1.7', color: 'rgba(224,231,255,0.85)', whiteSpace: 'pre-wrap' }}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') return <span key={i}>{seg.content}</span>

        if (seg.type === 'draw' && seg.cardNumber) {
          if (!onDraw) return <span key={i} className="text-indigo-300">{seg.content}</span>
          return (
            <DrawButton
              key={i}
              label={`Draw #${seg.cardNumber}`}
              onDraw={() => onDraw(seg.cardNumber!)}
            />
          )
        }

        if (seg.type === 'range' && seg.from && seg.to) {
          if (!onDraw) return <span key={i} className="text-indigo-300">{seg.content}</span>
          const nums: string[] = []
          for (let n = parseInt(seg.from); n <= parseInt(seg.to); n++) nums.push(String(n).padStart(3, '0'))
          return (
            <DrawButton
              key={i}
              label={`Draw #${seg.from}–${seg.to}`}
              onDraw={async () => { for (const n of nums) await onDraw(n) }}
            />
          )
        }

        return <span key={i}>{seg.content}</span>
      })}
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function StoryModal({ card, onClose, onContinue, onDraw }: StoryModalProps) {
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    if (card) setShowBack(false)
  }, [card?.state_id])

  if (!card) return null

  const hasBack = Boolean(card.content_back)
  const bodyText = (showBack ? card.content_back : card.content_front) ?? ''

  function handleContinue() {
    setShowBack(true)
    onContinue?.()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative rounded-2xl border border-[rgba(201,162,39,0.25)] flex flex-col overflow-hidden"
        style={{
          width: 'min(520px, 94vw)',
          maxHeight: '82vh',
          background: 'linear-gradient(180deg, #12154a 0%, #0a0c32 100%)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between border-b border-[rgba(201,162,39,0.15)]"
          style={{ padding: '16px 20px 12px' }}
        >
          <div className="flex flex-col min-w-0 flex-1" style={{ gap: '4px', paddingRight: '12px' }}>
            <div className="font-mono text-indigo-400/50 uppercase tracking-widest" style={{ fontSize: '10px' }}>
              {showBack ? 'Continued' : 'Story Card'} · #{card.card_number}
            </div>
            <div
              className="font-bold text-white leading-tight"
              style={{ fontSize: '18px', fontFamily: 'var(--font-playfair)' }}
            >
              {card.title}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-none rounded-lg text-indigo-400/50 hover:text-indigo-300 transition-colors"
            style={{ padding: '4px 8px', fontSize: '18px', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '20px' }}>
          {card.image_url && !showBack && (
            <div className="rounded-lg overflow-hidden mb-4" style={{ maxHeight: '180px' }}>
              <img src={card.image_url} alt={card.title} className="w-full h-full object-cover" />
            </div>
          )}
          <StoryText text={bodyText} onDraw={onDraw} />
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t border-[rgba(201,162,39,0.12)]"
          style={{ padding: '12px 20px' }}
        >
          <button
            onClick={onClose}
            className="rounded-lg border border-[rgba(201,162,39,0.2)] text-amber-600/70 hover:text-amber-400 hover:border-[rgba(201,162,39,0.4)] transition-colors"
            style={{ padding: '7px 16px', fontSize: '12px', fontFamily: 'var(--font-geist-mono)' }}
          >
            Close
          </button>

          {hasBack && !showBack && (
            <button
              onClick={handleContinue}
              className="rounded-lg font-semibold text-white transition-colors"
              style={{
                padding: '7px 20px',
                fontSize: '13px',
                background: 'linear-gradient(135deg, #3730a3 0%, #1e1b6e 100%)',
                border: '1px solid rgba(165,180,252,0.3)',
              }}
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
