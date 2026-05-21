/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFootball, LIGA_CR_ID, SEASON } from '@/app/lib/api-football'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default async function Goleadores() {
  const data = await fetchFootball('players/topscorers', {
    league: String(LIGA_CR_ID),
    season: String(SEASON)
  })

  const goleadores = data.response ?? []

  return (
    <main className="min-h-screen bg-gray-950 p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-green-500 mb-2">Goleadores</h1>
      <p className="text-gray-400 mb-6">Primera División de Costa Rica — 2024</p>

      <div className="flex flex-col gap-3">
        {goleadores.map((item: any, index: number) => (
          <Link
            key={item.player.id}
            href={`/jugadores/${item.player.id}`}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-green-500 transition-colors"
          >
            {/* Posición */}
            <span className={`text-xl font-bold w-8 text-center ${
              index === 0 ? 'text-yellow-400' :
              index === 1 ? 'text-gray-300' :
              index === 2 ? 'text-amber-600' :
              'text-gray-500'
            }`}>
              {index + 1}
            </span>

            {/* Foto */}
            <Image
              src={item.player.photo}
              alt={item.player.name}
              width={48}
              height={48}
              className="rounded-full border-2 border-gray-700"
            />

            {/* Info */}
            <div className="flex-1">
              <p className="text-white font-medium">{item.player.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Image
                  src={item.statistics[0]?.team?.logo}
                  alt={item.statistics[0]?.team?.name}
                  width={16}
                  height={16}
                />
                <p className="text-gray-400 text-sm">{item.statistics[0]?.team?.name}</p>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-green-400 font-bold text-xl">{item.statistics[0]?.goals?.total ?? 0}</p>
                <p className="text-gray-500 text-xs">Goles</p>
              </div>
              <div>
                <p className="text-blue-400 font-bold text-xl">{item.statistics[0]?.goals?.assists ?? 0}</p>
                <p className="text-gray-500 text-xs">Asist.</p>
              </div>
              <div>
                <p className="text-white font-bold text-xl">{item.statistics[0]?.games?.appearences ?? 0}</p>
                <p className="text-gray-500 text-xs">PJ</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}