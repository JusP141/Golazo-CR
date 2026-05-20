/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPartidos } from '../lib/partidos'
import Image from 'next/image'

export default async function Calendario() {
  const partidos = await getPartidos()

  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <h1 className="text-3xl font-bold text-green-500 mb-2">⚽ Golazo CR</h1>
      <p className="text-gray-400 mb-6">Calendario — Primera División 2024</p>

      <div className="flex flex-col gap-3">
        {partidos.map((partido: any) => (
          <div
            key={partido.fixture.id}
            className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between"
          >
            {/* Equipo local */}
            <div className="flex items-center gap-3 w-1/3 justify-end">
              <span className="text-white font-medium text-sm text-right">
                {partido.teams.home.name}
              </span>
              <Image
                src={partido.teams.home.logo}
                alt={partido.teams.home.name}
                width={28}
                height={28}
              />
            </div>

            {/* Marcador / Estado */}
            <div className="flex flex-col items-center w-1/3">
              {partido.fixture.status.short === 'FT' ? (
                <span className="text-white font-bold text-lg">
                  {partido.goals.home} - {partido.goals.away}
                </span>
              ) : (
                <span className="text-gray-400 text-xs text-center">
                  {new Date(partido.fixture.date).toLocaleDateString('es-CR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
              <span className="text-xs text-gray-500 mt-1">
                Jornada {partido.league.round.replace('Regular Season - ', '')}
              </span>
            </div>

            {/* Equipo visitante */}
            <div className="flex items-center gap-3 w-1/3 justify-start">
              <Image
                src={partido.teams.away.logo}
                alt={partido.teams.away.name}
                width={28}
                height={28}
              />
              <span className="text-white font-medium text-sm">
                {partido.teams.away.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}