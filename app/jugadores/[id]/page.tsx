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
      <main className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Jugador no encontrado.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--background)' }}>

      {/* Header */}
      <div className="flex items-center gap-6 mb-8 p-6 rounded-xl shadow-sm"
        style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
        <Image
          src={jugador.photo}
          alt={jugador.name}
          width={100}
          height={100}
          className="rounded-full"
          style={{ border: '3px solid var(--primary-light)' }}
        />
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{jugador.name}</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            {jugador.nationality} · {jugador.age} años
          </p>
          {stats && (
            <p className="text-sm mt-1 font-medium" style={{ color: 'var(--primary)' }}>
              {stats.team.name} — {stats.games.position}
            </p>
          )}
        </div>
      </div>

      {/* Info personal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Altura', value: jugador.height ?? 'N/D' },
          { label: 'Peso', value: jugador.weight ?? 'N/D' },
          { label: 'Edad', value: `${jugador.age} años` },
          { label: 'Nacionalidad', value: jugador.nationality },
        ].map((info) => (
          <div key={info.label} className="rounded-xl p-4 text-center shadow-sm"
            style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{info.label}</p>
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{info.value}</p>
          </div>
        ))}
      </div>

      {/* Estadísticas */}
      {stats && (
        <>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Estadísticas 2024</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Partidos', value: stats.games.appearences ?? 0, color: 'var(--text-primary)' },
              { label: 'Goles', value: stats.goals.total ?? 0, color: 'var(--primary)' },
              { label: 'Asistencias', value: stats.goals.assists ?? 0, color: 'var(--primary-light)' },
              { label: 'Minutos', value: stats.games.minutes ?? 0, color: 'var(--text-primary)' },
              { label: 'Tarjetas amarillas', value: stats.cards.yellow ?? 0, color: '#E9C46A' },
              { label: 'Tarjetas rojas', value: stats.cards.red ?? 0, color: 'var(--accent)' },
              { label: 'Tiros al arco', value: stats.shots?.on ?? 0, color: 'var(--text-primary)' },
              { label: 'Duelos ganados', value: stats.duels?.won ?? 0, color: 'var(--text-primary)' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-4 text-center shadow-sm"
                style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                <p className="font-bold text-2xl" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}