'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NuevaQuiniela() {
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleCrear = async () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio')
      return
    }

    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data, error } = await supabase
      .from('quinielas')
      .insert({
        nombre: nombre.trim(),
        usuario_id: user.id,
        torneo: 'Apertura 2024'
      })
      .select()
      .single()

    if (error) {
      setError('Error al crear la quiniela')
      setLoading(false)
      return
    }

    router.push(`/quinielas/${data.id}`)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="rounded-xl p-8 w-full max-w-md shadow-sm"
        style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>

        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Nueva quiniela</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Predecí los resultados del Apertura 2024</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm mb-1 block" style={{ color: 'var(--text-secondary)' }}>
              Nombre de tu quiniela
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mi quiniela del Apertura"
              className="w-full rounded-lg px-4 py-3 outline-none transition-colors"
              style={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--accent)' }}>{error}</p>
          )}

          <button
            onClick={handleCrear}
            disabled={loading}
            className="w-full font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            {loading ? 'Creando...' : 'Crear quiniela'}
          </button>

          <Link
            href="/quinielas"
            className="text-sm text-center hover:underline"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cancelar
          </Link>
        </div>
      </div>
    </main>
  )
}