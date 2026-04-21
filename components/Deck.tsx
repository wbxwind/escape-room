'use client'

import React, { useState, useRef } from 'react'

interface DeckProps {
  deckCount: number
  onDraw: () => void
  onDrawByNumber: (num: string) => void
}

export function Deck({ deckCount, onDraw, onDrawByNumber }: DeckProps) {
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const submitDraw = () => {
    const val = inputValue.trim()
    if (val === '' || val === '000') {
      onDraw()
    } else {
      onDrawByNumber(val)
    }
    setInputValue('')
    inputRef.current?.blur()
    setIsFocused(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitDraw()
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // If the click is on the input itself, let the user type, don't draw.
    if ((e.target as HTMLElement).tagName === 'INPUT') {
      return
    }

    if (!isFocused) {
      inputRef.current?.focus()
    } else {
      submitDraw()
    }
  }

  return (
    <div
      className={`card-base flex-none flex flex-col items-center justify-center relative shadow-2xl transition-all duration-300 rounded-xl border-[2px] border-[rgba(255,255,255,0.15)] overflow-hidden select-none ${isFocused ? 'ring-2 ring-[rgba(201,162,39,0.6)]' : ''}`}
      style={{
        width: 'min(var(--card-w), 100%)',
        background: 'linear-gradient(160deg, #3f3f46 0%, #18181b 100%)',
        cursor: 'pointer'
      }}
      onClick={handleCardClick}
    >
      {/* Decorative gold border frame */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          margin: '4%',
          border: '1px solid rgba(201,162,39,0.2)',
          borderRadius: '0.5rem'
        }}
      />

      {/* Main Logo Content */}
      <div className={`relative z-10 flex flex-col items-center transition-opacity duration-300 ${isFocused || inputValue ? 'opacity-10' : 'opacity-100'}`}>
        <span 
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontWeight: 700,
            fontSize: '11cqi',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#fff',
            textShadow: '0 0 10cqi rgba(201, 162, 39, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8)',
            textAlign: 'center',
            lineHeight: '1.1',
            marginBottom: '4cqi'
          }}
        >
          Back<br/>Stories
        </span>
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: '4cqi',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(201, 162, 39, 0.55)'
          }}
        >
          Deck
        </span>

        <div style={{ marginTop: '8cqi', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <span style={{ color: 'rgba(201,162,39,0.9)', fontFamily: 'var(--font-geist-mono)', fontSize: '10cqi', fontWeight: 'bold' }}>{deckCount}</span>
           <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-geist-mono)', fontSize: '3.5cqi', textTransform: 'uppercase', letterSpacing: '0.1em' }}>cards</span>
        </div>
      </div>

      {/* Invisible Input & Active State Overlay */}
      <form
        onSubmit={handleSubmit}
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-300 ${isFocused || inputValue ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <span style={{ fontSize: '4.5cqi', color: 'rgba(201,162,39,0.8)', fontFamily: 'var(--font-geist-mono)', marginBottom: '4cqi', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Draw Card</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Top"
          className="bg-black/50 border border-[rgba(201,162,39,0.4)] text-amber-100 text-center font-mono placeholder:text-zinc-600 focus:outline-none focus:border-[rgba(201,162,39,0.8)] shadow-[0_0_15px_rgba(201,162,39,0.2)]"
          style={{
             width: '60cqi',
             fontSize: '8cqi',
             padding: '2.5cqi',
             borderRadius: '3cqi'
          }}
        />
        <div style={{ marginTop: '4cqi', fontSize: '3.5cqi', color: 'rgba(255,255,255,0.6)', textAlign: 'center', fontFamily: 'var(--font-geist-sans)', padding: '0 4cqi' }}>
          Click again to draw
        </div>
      </form>
    </div>
  )
}
