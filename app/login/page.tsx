'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

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
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Onjuiste inloggegevens. Probeer opnieuw.')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--cream)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo / brand */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <span className="text-lg font-bold" style={{ fontFamily: 'DM Serif Display, serif' }}>F</span>
          </div>
          <h1 className="text-3xl" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--ink)' }}>
            Mr Fris CRM
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-4)' }}>
            Inloggen met je account
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--cream-border)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--ink-4)' }}
              >
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--cream)',
                  border: '1px solid var(--cream-border)',
                  color: 'var(--ink)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--cream-border)')}
                placeholder="klaas@mrfris.nl"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--ink-4)' }}
              >
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--cream)',
                  border: '1px solid var(--cream-border)',
                  color: 'var(--ink)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--cream-border)')}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: 'var(--red)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity flex items-center justify-center gap-2"
              style={{
                background: 'var(--accent)',
                color: '#fff',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Inloggen…
                </>
              ) : (
                'Inloggen'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
