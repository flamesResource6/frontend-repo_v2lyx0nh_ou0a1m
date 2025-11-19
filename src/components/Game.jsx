import { useEffect, useMemo, useRef, useState } from 'react'

const emptyBoard = Array(9).fill(null)

export default function Game({ user, game, onLeave }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [state, setState] = useState(game)
  const wsRef = useRef(null)

  const symbol = useMemo(() => {
    if (!state) return null
    const me = user?.id
    if (!me) return null
    if (state.players?.[0] === me) return 'X'
    if (state.players?.[1] === me) return 'O'
    return null
  }, [state, user])

  const their = symbol === 'X' ? 'O' : 'X'

  useEffect(() => {
    setState(game)
    const socket = new WebSocket(`${baseUrl.replace('http', 'ws')}/ws`)
    wsRef.current = socket
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'join', gameId: game.id }))
    }
    socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'game:update') setState(msg.data)
      } catch {}
    }
    socket.onclose = () => {}
    return () => socket.close()
  }, [game.id])

  const move = async (i) => {
    if (!state) return
    if (state.result) return
    if (state.board[i]) return
    if (symbol !== state.turn) return
    // optimistic UI
    const optimistic = { ...state, board: state.board.slice(), moves: [...state.moves], turn: their }
    optimistic.board[i] = symbol
    optimistic.moves.push(i)
    setState(optimistic)
    const res = await fetch(`${baseUrl}/api/games/${state.id}/move`, {
      method: 'POST', credentials:'include', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ position: i })
    })
    const data = await res.json()
    if (res.ok) setState(data)
    else {
      // revert
      setState(state)
      alert(data.detail || 'Move failed')
    }
  }

  const cellClasses = (i) => `w-20 h-20 md:w-28 md:h-28 flex items-center justify-center text-4xl md:text-5xl font-extrabold rounded-lg cursor-pointer transition transform active:scale-95 ${state.board[i] ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'} border border-white/10`

  const status = () => {
    if (state.result === 'draw') return 'It\'s a draw!'
    if (state.result) return `${state.result} wins!`
    return `${state.turn}'s turn`
  }

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-white/70">Room</div>
          <div className="font-mono">{state.room_code || state.id}</div>
        </div>
        <button onClick={onLeave} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded">Leave</button>
      </div>

      <div className="grid grid-cols-3 gap-3 place-items-center">
        {Array.from({length:9}).map((_,i)=> (
          <button key={i} className={cellClasses(i)} onClick={()=>move(i)} aria-label={`Cell ${i}`}>{state.board[i] || ''}</button>
        ))}
      </div>

      <div className="mt-4 font-semibold">{status()}</div>

      <div className="mt-2 text-sm text-white/80">You: {symbol || 'Spectator'} | Opponent: {their}</div>

      {state.moves?.length>0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Moves</h4>
          <div className="flex flex-wrap gap-2">
            {state.moves.map((m, idx)=> (
              <span key={idx} className="px-2 py-1 bg-white/10 rounded text-sm">{idx%2===0?'X':'O'}→{m}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
