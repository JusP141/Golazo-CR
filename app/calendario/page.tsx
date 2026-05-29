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
    <main className="min-h-screen p-8 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--background)' }}>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>Calendario</h1>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Primera División de Costa Rica — 2024</p>

      {/* Selector de jornadas */}
      <div className="flex flex-wrap gap-2 mb-8">
        {Array.from({ length: totalJornadas }, (_, i) => i + 1).map((j) => (
          <a key={j} href={`/calendario?jornada=${j}`}
            className="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: j === jornadaActual ? 'var(--primary)' : 'var(--background-card)',
              color: j === jornadaActual ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border)'
            }}>
            J{j}
          </a>
        ))}
      </div>

      <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--text-primary)' }}>
        Jornada {jornadaActual}
      </h2>

      <div className="flex flex-col gap-3">
        {partidos.length === 0 ? (
          <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
            No hay partidos disponibles para esta jornada.
          </p>
        ) : (
          partidos.map((partido: any) => (
            <div
              key={partido.fixture.id}
              className="rounded-xl px-6 py-4 flex items-center justify-between shadow-sm"
              style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3 w-2/5 justify-end">
                <span className="font-medium text-sm text-right" style={{
                  color: partido.teams.home.winner ? 'var(--primary)' : 'var(--text-primary)'
                }}>
                  {partido.teams.home.name}
                </span>
                <Image src={partido.teams.home.logo} alt={partido.teams.home.name} width={32} height={32} />
              </div>

              <div className="flex flex-col items-center w-1/5">
                {partido.fixture.status.short === 'FT' ? (
                  <>
                    <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                      {partido.goals.home} - {partido.goals.away}
                    </span>
                    <span className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Final</span>
                  </>
                ) : partido.fixture.status.short === 'LIVE' ? (
                  <>
                    <span className="font-bold text-xl animate-pulse" style={{ color: 'var(--accent)' }}>
                      {partido.goals.home} - {partido.goals.away}
                    </span>
                    <span className="text-xs mt-1" style={{ color: 'var(--accent)' }}>En vivo</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>VS</span>
                    <span className="text-xs mt-1 text-center" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(partido.fixture.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(partido.fixture.date).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 w-2/5 justify-start">
                <Image src={partido.teams.away.logo} alt={partido.teams.away.name} width={32} height={32} />
                <span className="font-medium text-sm" style={{
                  color: partido.teams.away.winner ? 'var(--primary)' : 'var(--text-primary)'
                }}>
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