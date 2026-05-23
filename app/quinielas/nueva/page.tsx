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
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Nueva quiniela</h1>
          <p className="text-gray-400 mt-1">Predecí los resultados del Apertura 2024</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Nombre de tu quiniela</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mi quiniela del Apertura"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            onClick={handleCrear}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear quiniela'}
          </button>

          <Link href="/quinielas" className="text-gray-400 text-sm text-center hover:text-white transition-colors">
            Cancelar
          </Link>
        </div>
      </div>
    </main>
  )
}