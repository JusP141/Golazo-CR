/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFootball, LIGA_CR_ID, SEASON } from './lib/api-football'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const [standingsData, fixturesData, scorersData] = await Promise.all([
    fetchFootball('standings', { league: String(LIGA_CR_ID), season: String(SEASON) }),
    fetchFootball('fixtures', { league: String(LIGA_CR_ID), season: String(SEASON), round: 'Regular Season - 22' }),
    fetchFootball('players/topscorers', { league: String(LIGA_CR_ID), season: String(SEASON) })
  ])

  const tabla = standingsData.response[0]?.league?.standings[0]?.slice(0, 5) ?? []
  const partidos = fixturesData.response ?? []
  const goleadores = scorersData.response?.slice(0, 5) ?? []

  return (
    <main className="min-h-screen bg-gray-950 p-8 pl-12">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Primera División <span className="text-green-500">Costa Rica</span></h1>
          <p className="text-gray-400">Temporada 2024 — Estadísticas, resultados y más</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Tabla de posiciones resumida */}
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Tabla de posiciones</h2>
              <Link href="/tabla" className="text-green-500 text-sm hover:underline">Ver completa</Link>
            </div>
            <div className="flex flex-col gap-2">
              {tabla.map((equipo: any) => (
                <div key={equipo.team.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs w-4">{equipo.rank}</span>
                    <Image src={equipo.team.logo} alt={equipo.team.name} width={20} height={20} />
                    <span className="text-white text-sm">{equipo.team.name}</span>
                  </div>
                  <span className="text-green-400 font-bold text-sm">{equipo.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Últimos resultados */}
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Últimos resultados</h2>
              <Link href="/calendario" className="text-green-500 text-sm hover:underline">Ver todos</Link>
            </div>
            <div className="flex flex-col gap-3">
              {partidos.map((partido: any) => (
                <div key={partido.fixture.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-white text-xs text-right">{partido.teams.home.name}</span>
                    <Image src={partido.teams.home.logo} alt={partido.teams.home.name} width={18} height={18} />
                  </div>
                  <span className="text-white font-bold text-sm mx-3">
                    {partido.goals.home} - {partido.goals.away}
                  </span>
                  <div className="flex items-center gap-2 flex-1">
                    <Image src={partido.teams.away.logo} alt={partido.teams.away.name} width={18} height={18} />
                    <span className="text-white text-xs">{partido.teams.away.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goleadores */}
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Goleadores</h2>
              <Link href="/goleadores" className="text-green-500 text-sm hover:underline">Ver todos</Link>
            </div>
            <div className="flex flex-col gap-3">
              {goleadores.map((item: any, index: number) => (
                <div key={item.player.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs w-4">{index + 1}</span>
                    <Image src={item.player.photo} alt={item.player.name} width={28} height={28} className="rounded-full" />
                    <div>
                      <p className="text-white text-sm">{item.player.name}</p>
                      <p className="text-gray-400 text-xs">{item.statistics[0]?.team?.name}</p>
                    </div>
                  </div>
                  <span className="text-green-400 font-bold">⚽ {item.statistics[0]?.goals?.total}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Links rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Link href="/tabla" className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-green-500 transition-colors">
            <p className="text-2xl mb-1">📊</p>
            <p className="text-white text-sm font-medium">Tabla</p>
          </Link>
          <Link href="/calendario" className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-green-500 transition-colors">
            <p className="text-2xl mb-1">📅</p>
            <p className="text-white text-sm font-medium">Calendario</p>
          </Link>
          <Link href="/clubes" className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-green-500 transition-colors">
            <p className="text-2xl mb-1">🏟️</p>
            <p className="text-white text-sm font-medium">Clubes</p>
          </Link>
          <Link href="/goleadores" className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-green-500 transition-colors">
            <p className="text-2xl mb-1">👟</p>
            <p className="text-white text-sm font-medium">Goleadores</p>
          </Link>
        </div>

      </div>
    </main>
  )
}