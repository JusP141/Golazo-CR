/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFootball, LIGA_CR_ID, SEASON } from '@/app/lib/api-football'
import Image from 'next/image'

export default async function JugadorDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const data = await fetchFootball('players', {
    id,
    league: String(LIGA_CR_ID),
    season: String(SEASON)
  })

  const jugador = data.response[0]?.player
  const stats = data.response[0]?.statistics[0]

  if (!jugador) {
    return (
      <main className="min-h-screen bg-gray-950 p-8">
        <p className="text-gray-400">Jugador no encontrado.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <Image
          src={jugador.photo}
          alt={jugador.name}
          width={100}
          height={100}
          className="rounded-full border-2 border-gray-700"
        />
        <div>
          <h1 className="text-3xl font-bold text-white">{jugador.name}</h1>
          <p className="text-gray-400 mt-1">{jugador.nationality} · {jugador.age} años</p>
          {stats && (
            <p className="text-green-400 text-sm mt-1">
              {stats.team.name} — {stats.games.position}
            </p>
          )}
        </div>
      </div>

      {/* Info personal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Altura</p>
          <p className="text-white font-bold">{jugador.height ?? 'N/D'}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Peso</p>
          <p className="text-white font-bold">{jugador.weight ?? 'N/D'}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Edad</p>
          <p className="text-white font-bold">{jugador.age} años</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Nacionalidad</p>
          <p className="text-white font-bold">{jugador.nationality}</p>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <>
          <h2 className="text-xl font-bold text-white mb-4">Estadísticas 2024</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Partidos</p>
              <p className="text-white font-bold text-2xl">{stats.games.appearences ?? 0}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Goles</p>
              <p className="text-green-400 font-bold text-2xl">{stats.goals.total ?? 0}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Asistencias</p>
              <p className="text-blue-400 font-bold text-2xl">{stats.goals.assists ?? 0}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Minutos</p>
              <p className="text-white font-bold text-2xl">{stats.games.minutes ?? 0}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Tarjetas amarillas</p>
              <p className="text-yellow-400 font-bold text-2xl">{stats.cards.yellow ?? 0}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Tarjetas rojas</p>
              <p className="text-red-400 font-bold text-2xl">{stats.cards.red ?? 0}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Tiros al arco</p>
              <p className="text-white font-bold text-2xl">{stats.shots?.on ?? 0}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Duelos ganados</p>
              <p className="text-white font-bold text-2xl">{stats.duels?.won ?? 0}</p>
            </div>
          </div>
        </>
      )}
    </main>
  )
}