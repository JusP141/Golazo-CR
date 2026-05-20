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
    <main className="min-h-screen bg-gray-950 p-8">
      <div className="flex items-center gap-6 mb-8">
        {equipo && (
          <Image src={equipo.logo} alt={equipo.name} width={80} height={80} />
        )}
        <div>
          <h1 className="text-3xl font-bold text-white">{equipo?.name}</h1>
          <p className="text-gray-400 mt-1">Primera División de Costa Rica — 2024</p>
        </div>
      </div>

      {stats && stats.fixtures && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Partidos jugados</p>
            <p className="text-white font-bold text-2xl">{stats.fixtures.played?.total ?? 0}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Victorias</p>
            <p className="text-green-400 font-bold text-2xl">{stats.fixtures.wins?.total ?? 0}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Goles anotados</p>
            <p className="text-white font-bold text-2xl">{stats.goals?.for?.total?.total ?? 0}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Goles recibidos</p>
            <p className="text-red-400 font-bold text-2xl">{stats.goals?.against?.total?.total ?? 0}</p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-white mb-4">Plantel</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {plantel.map((jugador: any) => (
          <Link
            key={jugador.id}
            href={`/jugadores/${jugador.id}`}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3 hover:border-green-500 transition-colors"
          >
            <Image
              src={jugador.photo}
              alt={jugador.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="text-white text-sm font-medium">{jugador.name}</p>
              <p className="text-gray-400 text-xs">{jugador.position}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}