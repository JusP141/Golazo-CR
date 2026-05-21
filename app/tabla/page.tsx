/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFootball, LIGA_CR_ID, SEASON } from '@/app/lib/api-football'
import Image from 'next/image'
import Link from 'next/link'

export default async function Tabla() {
  const data = await fetchFootball('standings', {
    league: String(LIGA_CR_ID),
    season: String(SEASON)
  })

  const tabla = data.response[0]?.league?.standings[0] ?? []

  return (
    <main className="min-h-screen bg-gray-950 p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-green-500 mb-2">Tabla de posiciones</h1>
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
              <th className="px-4 py-3 text-center">Forma</th>
              <th className="px-4 py-3 text-center font-bold text-white">PTS</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((equipo: any, index: number) => (
              <tr
                key={equipo.team.id}
                className={`border-t border-gray-800 hover:bg-gray-900 transition-colors ${
                  index < 4 ? 'border-l-2 border-l-green-500' : ''
                }`}
              >
                <td className="px-4 py-3 text-gray-400">{equipo.rank}</td>
                <td className="px-4 py-3">
                  <Link href={`/clubes/${equipo.team.id}`} className="flex items-center gap-3 hover:text-green-400 transition-colors">
                    <Image src={equipo.team.logo} alt={equipo.team.name} width={24} height={24} />
                    <span className="font-medium text-white">{equipo.team.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-center">{equipo.all.played}</td>
                <td className="px-4 py-3 text-center">{equipo.all.win}</td>
                <td className="px-4 py-3 text-center">{equipo.all.draw}</td>
                <td className="px-4 py-3 text-center">{equipo.all.lose}</td>
                <td className="px-4 py-3 text-center">{equipo.all.goals.for}</td>
                <td className="px-4 py-3 text-center">{equipo.all.goals.against}</td>
                <td className="px-4 py-3 text-center">{equipo.goalsDiff}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-1 justify-center">
                    {equipo.form?.split('').slice(-5).map((resultado: string, i: number) => (
                      <span
                        key={i}
                        className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                          resultado === 'W' ? 'bg-green-500 text-white' :
                          resultado === 'D' ? 'bg-yellow-500 text-black' :
                          'bg-red-500 text-white'
                        }`}
                      >
                        {resultado === 'W' ? 'G' : resultado === 'D' ? 'E' : 'P'}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-bold text-green-400">{equipo.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Clasificado a playoffs</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs">G</span>
          <span>Victoria</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-xs">E</span>
          <span>Empate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">P</span>
          <span>Derrota</span>
        </div>
      </div>
    </main>
  )
}