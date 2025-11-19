import { useEffect, useState } from 'react'

export default function Lobby({ user, onEnterGame }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [publicGames, setPublicGames] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [privateCode, setPrivateCode] = useState('')

  const fetchPublic = async () => {
    const res = await fetch(`${baseUrl}/api/games/public`)
    const data = await res.json()
    setPublicGames(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchPublic() }, [])

  const createGame = async (mode, ai=false) => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/games`, {
        method: 'POST', credentials:'include', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ mode, ai })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create game')
      onEnterGame(data)
    } catch (e) { setError(e.message) } finally { setLoading(false); fetchPublic() }
  }

  const joinGame = async (g) => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/games/${g.id}/join`, {
        method:'POST', credentials:'include', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ room_code: g.room_code || (g.mode==='private'? privateCode : undefined) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Join failed')
      onEnterGame(data)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="text-white space-y-6">
      <div className="flex gap-3 flex-wrap">
        <button onClick={()=>createGame('public')} className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded">Create Public Game</button>
        <button onClick={()=>createGame('private')} className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded">Create Private Game</button>
        <button onClick={()=>createGame('public', true)} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded">Play vs AI</button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="font-semibold mb-3">Join Private Game</h3>
        <div className="flex gap-2">
          <input value={privateCode} onChange={e=>setPrivateCode(e.target.value.toUpperCase())} placeholder="ROOM6" className="px-3 py-2 bg-white/10 rounded outline-none" />
        </div>
      </div>

      {error && <p className="text-red-300">{error}</p>}

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="font-semibold mb-3">Public Games</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {publicGames.map(g=> (
            <div key={g.id} className="bg-white/5 rounded p-3 border border-white/10">
              <div className="text-sm text-white/80">{new Date(g.created_at).toLocaleString?.() || ''}</div>
              <div className="mt-2 text-sm">Players: {(g.players||[]).filter(Boolean).length}/2</div>
              <button onClick={()=>joinGame(g)} className="mt-3 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">Join</button>
            </div>
          ))}
          {publicGames.length===0 && <p className="text-white/70">No public games yet.</p>}
        </div>
      </div>

      {loading && <p>Working...</p>}
    </div>
  )
}
