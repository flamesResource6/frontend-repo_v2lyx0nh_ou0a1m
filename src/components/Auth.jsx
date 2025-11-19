import { useState } from 'react'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed')
      onAuth(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{mode === 'login' ? 'Login' : 'Sign up'}</h3>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-blue-300 hover:text-blue-200">
          {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 bg-white/10 rounded outline-none" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 bg-white/10 rounded outline-none" />
        {error && <p className="text-red-300 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 rounded py-2 font-medium">{loading ? 'Please wait...' : (mode==='login'?'Login':'Register')}</button>
      </form>
    </div>
  )
}
