'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function EscapeRoom() {
  const [roomState, setRoomState] = useState<{ current_step: number; last_action_text: string } | null>(null)
  const [input, setInput] = useState('')
  const roomCode = 'DEMO-1' // Use the code you inserted in your SQL table

  useEffect(() => {
    // Initial fetch
    const fetchState = async () => {
      const { data } = await supabase
        .from('escape_room_state')
        .select('*')
        .eq('room_code', roomCode)
        .single()
      if (data) setRoomState(data)
    }

    fetchState()

    // Real-time subscription
    const channel = supabase
      .channel('room-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'escape_room_state', filter: `room_code=eq.${roomCode}` },
        (payload) => {
          setRoomState(payload.new as any)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const handleAction = async () => {
    let nextStep = roomState?.current_step || 1
    let correct = false

    // Simple hardcoded logic for the demo
    if (roomState?.current_step === 1 && input === '2023') correct = true
    if (roomState?.current_step === 2 && input === '42') correct = true
    if (roomState?.current_step === 3 && input.toLowerCase() === 'language processing unit') correct = true

    if (correct) {
      const { error } = await supabase
        .from('escape_room_state')
        .update({
          current_step: nextStep + 1,
          last_action_text: `Correct! Moving to stage ${nextStep + 1}.`
        })
        .eq('room_code', roomCode)

      if (error) console.error(error)
      setInput('')
    } else {
      alert("Invalid code.")
    }
  }

  if (!roomState) return <div className="p-10 font-mono text-white bg-black h-screen">Loading System...</div>

  return (
    <main className="p-10 font-mono text-green-500 bg-black h-screen flex flex-col gap-4">
      <div className="border border-green-800 p-4">
        <h1 className="text-xl underline">TERMINAL: {roomCode}</h1>
        <p className="mt-2">STATUS: {roomState.current_step > 3 ? 'SYSTEM ESCAPED' : `LEVEL ${roomState.current_step}`}</p>
        <p className="text-sm opacity-50 italic">{roomState.last_action_text}</p>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center gap-6">
        {roomState.current_step === 1 && <p>"The server is overheating. Password is the year the first 'Llama' was released."</p>}
        {roomState.current_step === 2 && <p>"Fragment found: [4, 8, 15, 16, 23, ?]"</p>}
        {roomState.current_step === 3 && <p>"What does LPU stand for?"</p>}
        {roomState.current_step > 3 && <p className="text-4xl">ACCESS GRANTED. YOU ARE OUT.</p>}

        {roomState.current_step <= 3 && (
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-zinc-900 border border-green-800 p-2 text-green-400 outline-none"
              placeholder="Enter code..."
            />
            <button onClick={handleAction} className="bg-green-900 text-white px-4 hover:bg-green-700 transition">EXECUTE</button>
          </div>
        )}
      </div>
    </main>
  )
}