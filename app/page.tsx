/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFootball, LIGA_CR_ID, SEASON } from './lib/api-football'
import Image from 'next/image'

export default async function Home() {
  const data = await fetchFootball('standings', {
    league: String(LIGA_CR_ID),
    season: String(SEASON)
  })

  const tabla = data.response[0]?.league?.standings[0] ?? []

  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <h1 className="text-3xl font-bold text-green-500 mb-2">⚽ Golazo CR</h1>
      <p className="text-gray-400 mb-6">Primera División de Costa Rica — 2024</p>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm text-gray-300">
          <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Equipo</th>
              <th className="px-4 py-3 text-center">PJ</th>
              <th className="px-4 py-3 text-center">PG</th>
              <th className="px-4 py-3 text-center">PE</th>
              <th className="px-4 py-3 text-center">PP</th>
              <th className="px-4 py-3 text-center">GF</th>
              <th className="px-4 py-3 text-center">GC</th>
              <th className="px-4 py-3 text-center">DG</th>
              <th className="px-4 py-3 text-center font-bold text-white">PTS</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((equipo: any, index: number) => (
              <tr
                key={equipo.team.id}
                className={`border-t border-gray-800 hover:bg-gray-900 transition-colors ${index < 4 ? 'border-l-2 border-l-green-500' : ''}`}
              >
                <td className="px-4 py-3 text-gray-400">{equipo.rank}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image src={equipo.team.logo} alt={equipo.team.name} width={24} height={24} />
                    <span className="font-medium text-white">{equipo.team.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">{equipo.all.played}</td>
                <td className="px-4 py-3 text-center">{equipo.all.win}</td>
                <td className="px-4 py-3 text-center">{equipo.all.draw}</td>
                <td className="px-4 py-3 text-center">{equipo.all.lose}</td>
                <td className="px-4 py-3 text-center">{equipo.all.goals.for}</td>
                <td className="px-4 py-3 text-center">{equipo.all.goals.against}</td>
                <td className="px-4 py-3 text-center">{equipo.goalsDiff}</td>
                <td className="px-4 py-3 text-center font-bold text-green-400">{equipo.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}