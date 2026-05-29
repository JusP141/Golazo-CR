/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFootball, LIGA_CR_ID, SEASON } from './lib/api-football'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const [standingsData, fixturesData, scorersData] = await Promise.all([
    fetchFootball('standings', { league: String(LIGA_CR_ID), season: String(SEASON) }),
    fetchFootball('fixtures', { league: String(LIGA_CR_ID), season: String(SEASON), status: 'FT' }),
    fetchFootball('players/topscorers', { league: String(LIGA_CR_ID), season: String(SEASON) })
  ])

  const tabla = standingsData.response[0]?.league?.standings[0]?.slice(0, 5) ?? []
  const partidos = fixturesData.response?.slice(-5).reverse() ?? []
  const goleadores = scorersData.response?.slice(0, 5) ?? []

  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Primera División <span style={{ color: 'var(--primary)' }}>Costa Rica</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Temporada 2024 — Estadísticas, resultados y más</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Tabla de posiciones */}
          <div className="lg:col-span-1 rounded-xl p-6 shadow-sm" style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Tabla de posiciones</h2>
              <Link href="/tabla" className="text-sm hover:opacity-80" style={{ color: 'var(--primary)' }}>Ver completa</Link>
            </div>
            <div className="flex flex-col gap-2">
              {tabla.map((equipo: any) => (
                <div key={equipo.team.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-4" style={{ color: 'var(--text-secondary)' }}>{equipo.rank}</span>
                    <Image src={equipo.team.logo} alt={equipo.team.name} width={20} height={20} />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{equipo.team.name}</span>
                  </div>
                  <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>{equipo.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Últimos resultados */}
          <div className="lg:col-span-1 rounded-xl p-6 shadow-sm" style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Últimos resultados</h2>
              <Link href="/calendario" className="text-sm hover:opacity-80" style={{ color: 'var(--primary)' }}>Ver todos</Link>
            </div>
            <div className="flex flex-col gap-3">
              {partidos.map((partido: any) => (
                <div key={partido.fixture.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-xs text-right" style={{ color: 'var(--text-primary)' }}>{partido.teams.home.name}</span>
                    <Image src={partido.teams.home.logo} alt={partido.teams.home.name} width={18} height={18} />
                  </div>
                  <span className="font-bold text-sm mx-3" style={{ color: 'var(--text-primary)' }}>
                    {partido.goals.home} - {partido.goals.away}
                  </span>
                  <div className="flex items-center gap-2 flex-1">
                    <Image src={partido.teams.away.logo} alt={partido.teams.away.name} width={18} height={18} />
                    <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{partido.teams.away.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goleadores */}
          <div className="lg:col-span-1 rounded-xl p-6 shadow-sm" style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Goleadores</h2>
              <Link href="/goleadores" className="text-sm hover:opacity-80" style={{ color: 'var(--primary)' }}>Ver todos</Link>
            </div>
            <div className="flex flex-col gap-3">
              {goleadores.map((item: any, index: number) => (
                <div key={item.player.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs w-4" style={{ color: 'var(--text-secondary)' }}>{index + 1}</span>
                    <Image src={item.player.photo} alt={item.player.name} width={28} height={28} className="rounded-full" />
                    <div>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.player.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.statistics[0]?.team?.name}</p>
                    </div>
                  </div>
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>⚽ {item.statistics[0]?.goals?.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Links rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { href: '/tabla', icon: '', label: 'Tabla' },
            { href: '/calendario', icon: '', label: 'Calendario' },
            { href: '/clubes', icon: '', label: 'Clubes' },
            { href: '/goleadores', icon: '', label: 'Goleadores' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl p-4 text-center transition-all hover:shadow-md hover:-translate-y-1"
              style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}
            >
              <p className="text-2xl mb-1">{item.icon}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}