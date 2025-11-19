import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import Lobby from './components/Lobby'
import Game from './components/Game'

function App() {
  const [user, setUser] = useState(null)
  const [currentGame, setCurrentGame] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    // try restore session
    fetch(`${baseUrl}/api/auth/me`, { credentials: 'include' })
      .then(r=> r.ok ? r.json() : null)
      .then(u=> u && setUser(u))
      .catch(()=>{})
  }, [])

  const logout = async () => {
    await fetch(`${baseUrl}/api/auth/logout`, { method:'POST', credentials:'include' })
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Hero />

      <main className="max-w-5xl mx-auto px-4 py-8 -mt-20 relative z-10">
        <div className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 backdrop-blur">
          {!user ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Sign in to play</h2>
                <p className="text-white/80 mb-4">Create public or private matches, spectate friends, or play vs AI. Your history and stats are saved to your profile.</p>
                <Auth onAuth={setUser} />
              </div>
              <div className="text-white/80">
                <h3 className="text-xl font-semibold mb-2">How it works</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Real-time moves update instantly for all players.</li>
                  <li>Create private games and share the room code.</li>
                  <li>Challenge the AI for a perfect opponent.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="text-white/80">Signed in as <span className="font-semibold">{user.email}</span></div>
                <button onClick={logout} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded">Logout</button>
              </div>

              {!currentGame ? (
                <Lobby user={user} onEnterGame={setCurrentGame} />
              ) : (
                <Game user={user} game={currentGame} onLeave={()=>setCurrentGame(null)} />
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-white/60 py-8">Built with love • Tic-Tac-Toe</footer>
    </div>
  )
}

export default App
