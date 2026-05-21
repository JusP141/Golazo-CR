/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFootball, LIGA_CR_ID, SEASON } from '@/app/lib/api-football'
import Image from 'next/image'

export default async function Calendario({ searchParams }: { searchParams: Promise<{ jornada?: string }> }) {
  const { jornada } = await searchParams
  const jornadaActual = jornada ? parseInt(jornada) : 1

  const data = await fetchFootball('fixtures', {
    league: String(LIGA_CR_ID),
    season: String(SEASON),
    round: `Apertura - ${jornadaActual}`
  })

  const partidos = data.response ?? []
  const totalJornadas = 22

  return (
    <main className="min-h-screen bg-gray-950 p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-green-500 mb-2">Calendario</h1>
      <p className="text-gray-400 mb-6">Primera División de Costa Rica — 2024</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {Array.from({ length: totalJornadas }, (_, i) => i + 1).map((j) => (
          <a key={j} href={`/calendario?jornada=${j}`} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${j === jornadaActual ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            J{j}
          </a>
        ))}
      </div>
      <h2 className="text-white font-bold text-xl mb-4">Jornada {jornadaActual}</h2>
      <div className="flex flex-col gap-3">
        {partidos.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No hay partidos disponibles para esta jornada.</p>
        ) : (
          partidos.map((partido: any) => (
            <div key={partido.fixture.id} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-3 w-2/5 justify-end">
                <span className={`font-medium text-sm text-right ${partido.teams.home.winner ? 'text-green-400' : 'text-white'}`}>
                  {partido.teams.home.name}
                </span>
                <Image src={partido.teams.home.logo} alt={partido.teams.home.name} width={32} height={32} />
              </div>
              <div className="flex flex-col items-center w-1/5">
                {partido.fixture.status.short === 'FT' ? (
                  <>
                    <span className="text-white font-bold text-xl">{partido.goals.home} - {partido.goals.away}</span>
                    <span className="text-gray-500 text-xs mt-1">Final</span>
                  </>
                ) : partido.fixture.status.short === 'LIVE' ? (
                  <>
                    <span className="text-green-400 font-bold text-xl animate-pulse">{partido.goals.home} - {partido.goals.away}</span>
                    <span className="text-green-400 text-xs mt-1">En vivo</span>
                  </>
                ) : (
                  <>
                    <span className="text-white font-bold text-lg">VS</span>
                    <span className="text-gray-400 text-xs mt-1 text-center">
                      {new Date(partido.fixture.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(partido.fixture.date).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 w-2/5 justify-start">
                <Image src={partido.teams.away.logo} alt={partido.teams.away.name} width={32} height={32} />
                <span className={`font-medium text-sm ${partido.teams.away.winner ? 'text-green-400' : 'text-white'}`}>
                  {partido.teams.away.name}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}