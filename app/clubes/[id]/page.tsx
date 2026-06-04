/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFootball, LIGA_CR_ID, SEASON } from '@/app/lib/api-football'
import Image from 'next/image'
import Link from 'next/link'

export default async function ClubDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [squadData, statsData] = await Promise.all([
    fetchFootball('players/squads', { team: id }),
    fetchFootball('teams/statistics', {
      league: String(LIGA_CR_ID),
      season: String(SEASON),
      team: id
    })
  ])

  const plantel = squadData.response[0]?.players ?? []
  const equipo = squadData.response[0]?.team
  const stats = statsData.response

  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header del club */}
        <div className="flex items-center gap-6 mb-8 p-6 rounded-xl shadow-sm"
          style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
          {equipo && <Image src={equipo.logo} alt={equipo.name} width={80} height={80} />}
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{equipo?.name}</h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Primera División de Costa Rica — 2024</p>
          </div>
        </div>

        {/* Estadísticas del equipo */}
        {stats && stats.fixtures && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Partidos jugados', value: stats.fixtures.played?.total ?? 0, color: 'var(--text-primary)' },
              { label: 'Victorias', value: stats.fixtures.wins?.total ?? 0, color: 'var(--primary)' },
              { label: 'Goles anotados', value: stats.goals?.for?.total?.total ?? 0, color: 'var(--primary-light)' },
              { label: 'Goles recibidos', value: stats.goals?.against?.total?.total ?? 0, color: 'var(--accent)' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-4 text-center shadow-sm"
                style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                <p className="font-bold text-2xl" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Plantel */}
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Plantel</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {plantel.map((jugador: any) => (
            <Link
              key={jugador.id}
              href={`/jugadores/${jugador.id}`}
              className="rounded-xl p-4 flex items-center gap-3 transition-all hover:shadow-md hover:-translate-y-1"
              style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}
            >
              <Image
                src={jugador.photo}
                alt={jugador.name}
                width={40}
                height={40}
                className="rounded-full"
                style={{ border: '2px solid var(--border)' }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{jugador.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{jugador.position}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}