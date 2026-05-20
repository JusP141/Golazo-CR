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
    <main className="min-h-screen bg-gray-950 p-8">
      <h1 className="text-3xl font-bold text-green-500 mb-2">Clubes</h1>
      <p className="text-gray-400 mb-6">Primera División de Costa Rica — 2024</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {equipos.map((equipo: any) => (
          <Link
            key={equipo.team.id}
            href={`/clubes/${equipo.team.id}`}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center gap-4 hover:border-green-500 transition-colors"
          >
            <Image
              src={equipo.team.logo}
              alt={equipo.team.name}
              width={64}
              height={64}
            />
            <span className="text-white font-medium text-center text-sm">
              {equipo.team.name}
            </span>
            <span className="text-green-400 font-bold text-lg">
              {equipo.points} pts
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}