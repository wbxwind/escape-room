'use client'

import { useState } from 'react'
import type { ConsequenceEvent } from '@/types'

interface ConsequenceLogProps {
  events: ConsequenceEvent[]
}

const SEVERITY_STYLES = {
  info:    { bar: '#06b6d4', text: 'text-cyan-300',    label: '›' },
  warning: { bar: '#f59e0b', text: 'text-amber-300',   label: '!' },
  danger:  { bar: '#ef4444', text: 'text-red-400',     label: '✕' },
  success: { bar: '#22c55e', text: 'text-emerald-400', label: '✓' },
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`
}

export function ConsequenceLog({ events }: ConsequenceLogProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center rounded-lg border border-[rgba(201,162,39,0.2)] transition-colors hover:border-[rgba(201,162,39,0.4)]"
        style={{
          padding: '5px 10px',
          gap: '6px',
          background: 'rgba(10,6,2,0.9)',
          fontSize: '11px',
          color: 'rgba(201,162,39,0.7)',
          fontFamily: 'var(--font-geist-mono)',
        }}
        title="Game event log"
      >
        <span>LOG</span>
        {events.length > 0 && (
          <span
            className="rounded-full flex items-center justify-center font-bold"
            style={{ width: '16px', height: '16px', background: 'rgba(201,162,39,0.2)', fontSize: '9px', color: '#c9a227' }}
          >
            {Math.min(events.length, 99)}
          </span>
        )}
        <span style={{ fontSize: '9px' }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 rounded-xl border border-[rgba(201,162,39,0.2)] overflow-hidden"
          style={{
            top: 'calc(100% + 6px)',
            width: '280px',
            maxHeight: '320px',
            overflowY: 'auto',
            background: 'rgba(8,4,1,0.97)',
            zIndex: 50,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}
        >
          <div
            className="sticky top-0 flex items-center justify-between border-b border-[rgba(201,162,39,0.15)]"
            style={{ padding: '8px 12px', background: 'rgba(8,4,1,0.99)' }}
          >
            <span className="font-mono text-amber-600/70 uppercase tracking-widest" style={{ fontSize: '9px' }}>
              Event Log
            </span>
            <span className="font-mono text-amber-800/50" style={{ fontSize: '9px' }}>
              {events.length} event{events.length !== 1 ? 's' : ''}
            </span>
          </div>

          {events.length === 0 ? (
            <div className="text-center text-amber-900/50" style={{ padding: '16px', fontSize: '11px' }}>
              No events yet.
            </div>
          ) : (
            <div className="flex flex-col">
              {[...events].reverse().map(ev => {
                const s = SEVERITY_STYLES[ev.severity]
                return (
                  <div
                    key={ev.id}
                    className="flex"
                    style={{
                      padding: '6px 12px',
                      gap: '8px',
                      borderBottom: '1px solid rgba(201,162,39,0.06)',
                      borderLeft: `2px solid ${s.bar}`,
                    }}
                  >
                    <span className={`font-bold flex-none ${s.text}`} style={{ fontSize: '10px', marginTop: '1px' }}>
                      {s.label}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-amber-100/80 leading-snug" style={{ fontSize: '11px' }}>
                        {ev.description}
                      </span>
                      <span className="font-mono text-amber-900/50" style={{ fontSize: '9px', marginTop: '2px' }}>
                        {formatTime(ev.timestamp)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
