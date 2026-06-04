'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Registro() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegistro = async () => {
    setLoading(true)
    setError('')

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } }
    })

    if (error) {
      setError(error.message)
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
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Creá tu cuenta</p>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { label: 'Nombre', value: nombre, setter: setNombre, type: 'text', placeholder: 'Tu nombre' },
            { label: 'Correo electrónico', value: email, setter: setEmail, type: 'email', placeholder: 'tu@correo.com' },
            { label: 'Contraseña', value: password, setter: setPassword, type: 'password', placeholder: '••••••••' },
            { label: 'Confirmar contraseña', value: confirmar, setter: setConfirmar, type: 'password', placeholder: '••••••••' },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                {field.label}
              </label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-lg px-4 py-3 outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          ))}

          {error && <p className="text-sm text-center" style={{ color: 'var(--accent)' }}>{error}</p>}

          <button
            onClick={handleRegistro}
            disabled={loading}
            className="w-full font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid var(--border)' }}></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 text-sm" style={{ backgroundColor: 'var(--background-card)', color: 'var(--text-secondary)' }}>
                O registrate con
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
            ¿Ya tenés cuenta?{' '}
            <Link href="/auth/login" style={{ color: 'var(--primary)' }} className="hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}