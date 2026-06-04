/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { fetchFootball, LIGA_CR_ID, SEASON } from '@/app/lib/api-football'
import Image from 'next/image'
import Link from 'next/link'

export default async function Goleadores() {
  const data = await fetchFootball('players/topscorers', {
    league: String(LIGA_CR_ID),
    season: String(SEASON)
  })

  const goleadores = data.response ?? []

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--background)' }}>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>Goleadores</h1>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Primera División de Costa Rica — 2024</p>

      <div className="flex flex-col gap-3">
        {goleadores.map((item: any, index: number) => (
          <Link
            key={item.player.id}
            href={`/jugadores/${item.player.id}`}
            className="rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1"
            style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}
          >
            {/* Posición */}
            <span className="text-xl font-bold w-8 text-center" style={{
              color: index === 0 ? '#F4C430' :
                     index === 1 ? '#A8A9AD' :
                     index === 2 ? '#CD7F32' :
                     'var(--text-secondary)'
            }}>
              {index + 1}
            </span>

            {/* Foto */}
            <Image
              src={item.player.photo}
              alt={item.player.name}
              width={48}
              height={48}
              className="rounded-full"
              style={{ border: '2px solid var(--border)' }}
            />

            {/* Info */}
            <div className="flex-1">
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.player.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Image
                  src={item.statistics[0]?.team?.logo}
                  alt={item.statistics[0]?.team?.name}
                  width={16}
                  height={16}
                />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {item.statistics[0]?.team?.name}
                </p>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="flex gap-6 text-center">
              <div>
                <p className="font-bold text-xl" style={{ color: 'var(--primary)' }}>
                  {item.statistics[0]?.goals?.total ?? 0}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Goles</p>
              </div>
              <div>
                <p className="font-bold text-xl" style={{ color: 'var(--primary-light)' }}>
                  {item.statistics[0]?.goals?.assists ?? 0}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Asist.</p>
              </div>
              <div>
                <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                  {item.statistics[0]?.games?.appearences ?? 0}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>PJ</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}