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
    <main className="min-h-screen p-8 max-w-5xl mx-auto" style={{ backgroundColor: 'var(--background)' }}>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>Tabla de posiciones</h1>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Primera División de Costa Rica — 2024</p>

      <div className="overflow-x-auto rounded-xl shadow-sm" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
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
              <th className="px-4 py-3 text-center font-bold">PTS</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((equipo: any, index: number) => (
              <tr
                key={equipo.team.id}
                className="transition-colors hover:opacity-90"
                style={{
                  backgroundColor: index % 2 === 0 ? 'var(--background-card)' : 'var(--background)',
                  borderLeft: index < 4 ? '4px solid var(--primary)' : '4px solid transparent',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{equipo.rank}</td>
                <td className="px-4 py-3">
                  <Link href={`/clubes/${equipo.team.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <Image src={equipo.team.logo} alt={equipo.team.name} width={24} height={24} />
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{equipo.team.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-primary)' }}>{equipo.all.played}</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-primary)' }}>{equipo.all.win}</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-primary)' }}>{equipo.all.draw}</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-primary)' }}>{equipo.all.lose}</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-primary)' }}>{equipo.all.goals.for}</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-primary)' }}>{equipo.all.goals.against}</td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-primary)' }}>{equipo.goalsDiff}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-1 justify-center">
                    {equipo.form?.split('').slice(-5).map((resultado: string, i: number) => (
                      <span
                        key={i}
                        className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold text-white"
                        style={{
                          backgroundColor: resultado === 'W' ? 'var(--primary)' :
                            resultado === 'D' ? 'var(--accent-2)' : 'var(--accent)'
                        }}
                      >
                        {resultado === 'W' ? 'G' : resultado === 'D' ? 'E' : 'P'}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-bold" style={{ color: 'var(--primary)' }}>{equipo.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-6 mt-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--primary)' }}></div>
          <span>Clasificado a playoffs</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: 'var(--primary)' }}>G</span>
          <span>Victoria</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: 'var(--accent-2)', color: 'var(--text-primary)' }}>E</span>
          <span>Empate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: 'var(--accent)' }}>P</span>
          <span>Derrota</span>
        </div>
      </div>
    </main>
  )
}