/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'

interface Props {
  partido: any
  quinielaId: string
  prediccionExistente: any
  finalizado: boolean
}

export default function PrediccionForm({ partido, quinielaId, prediccionExistente, finalizado }: Props) {
  const [local, setLocal] = useState(prediccionExistente?.goles_local ?? 0)
  const [visitante, setVisitante] = useState(prediccionExistente?.goles_visitante ?? 0)
  const [guardado, setGuardado] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleGuardar = async () => {
    setLoading(true)

    if (prediccionExistente) {
      await supabase
        .from('predicciones')
        .update({ goles_local: local, goles_visitante: visitante })
        .eq('id', prediccionExistente.id)
    } else {
      await supabase
        .from('predicciones')
        .insert({
          quiniela_id: quinielaId,
          fixture_id: partido.fixture.id,
          equipo_local: partido.teams.home.name,
          equipo_visitante: partido.teams.away.name,
          goles_local: local,
          goles_visitante: visitante
        })
    }

    setGuardado(true)
    setLoading(false)
    setTimeout(() => setGuardado(false), 2000)
  }

  if (finalizado) {
    return (
      <div className="flex items-center justify-center gap-4">
        <span className="text-gray-400 text-sm">Tu predicción:</span>
        <span className="text-white font-bold">
          {prediccionExistente
            ? `${prediccionExistente.goles_local} - ${prediccionExistente.goles_visitante}`
            : 'Sin predicción'}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <span className="text-gray-400 text-sm">Tu predicción:</span>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={0}
          max={20}
          value={local}
          onChange={(e) => setLocal(parseInt(e.target.value) || 0)}
          className="w-12 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-center focus:outline-none focus:border-green-500"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          min={0}
          max={20}
          value={visitante}
          onChange={(e) => setVisitante(parseInt(e.target.value) || 0)}
          className="w-12 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-center focus:outline-none focus:border-green-500"
        />
        <button
          onClick={handleGuardar}
          disabled={loading}
          className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
            guardado
              ? 'bg-green-500 text-black'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          {guardado ? '✓ Guardado' : loading ? '...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}