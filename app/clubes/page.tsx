/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFootball, LIGA_CR_ID, SEASON } from '@/app/lib/api-football'
import Image from 'next/image'
import Link from 'next/link'

export default async function Clubes() {
  const data = await fetchFootball('standings', {
    league: String(LIGA_CR_ID),
    season: String(SEASON)
  })

  const equipos = data.response[0]?.league?.standings[0] ?? []

  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>Clubes</h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Primera División de Costa Rica — 2024</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {equipos.map((equipo: any) => (
            <Link
              key={equipo.team.id}
              href={`/clubes/${equipo.team.id}`}
              className="rounded-xl p-6 flex flex-col items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1"
              style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}
            >
              <Image src={equipo.team.logo} alt={equipo.team.name} width={64} height={64} />
              <span className="font-medium text-center text-sm" style={{ color: 'var(--text-primary)' }}>
                {equipo.team.name}
              </span>
              <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>
                {equipo.points} pts
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}