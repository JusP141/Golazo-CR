'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="rounded-xl p-8 w-full max-w-md shadow-sm"
        style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>⚽ Golazo CR</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Iniciá sesión en tu cuenta</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-lg px-4 py-3 outline-none transition-colors"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg px-4 py-3 outline-none transition-colors"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {error && <p className="text-sm text-center" style={{ color: 'var(--accent)' }}>{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid var(--border)' }}></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 text-sm" style={{ backgroundColor: 'var(--background-card)', color: 'var(--text-secondary)' }}>
                O continuá con
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 font-medium py-3 rounded-lg transition-colors"
            style={{ backgroundColor: 'white', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="Google" />
            Continuar con Google
          </button>

          <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
            ¿No tenés cuenta?{' '}
            <Link href="/auth/registro" style={{ color: 'var(--primary)' }} className="hover:underline">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}