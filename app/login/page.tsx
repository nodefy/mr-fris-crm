'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) setError('Onjuiste inloggegevens.')
    else router.push('/dashboard/leads')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-mark">F</div>
          <span className="login-brand-name">Mr. Fris CRM</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="login-label" htmlFor="email">E-mailadres</label>
            <input id="email" type="email" autoComplete="email" required value={email}
              onChange={e => setEmail(e.target.value)} className="login-input"
              placeholder="klaas@mrfris.nl" />
          </div>
          <div>
            <label className="login-label" htmlFor="password">Wachtwoord</label>
            <input id="password" type="password" autoComplete="current-password" required value={password}
              onChange={e => setPassword(e.target.value)} className="login-input"
              placeholder="••••••••" />
          </div>
          {error && <p style={{ fontSize: 12, color: '#c0392b', textAlign: 'center' }}>{error}</p>}
          <button type="submit" className="btn primary" disabled={loading}
            style={{ justifyContent: 'center', padding: '8px 14px', fontSize: 13 }}>
            {loading ? 'Inloggen…' : 'Inloggen'}
          </button>
        </form>
      </div>
    </div>
  )
}
