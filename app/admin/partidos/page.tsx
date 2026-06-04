/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'
import { fetchFootball, LIGA_CR_ID, SEASON } from '@/app/lib/api-football'
import Image from 'next/image'
import Link from 'next/link'

export default async function AdminPartidos({ searchParams }: { searchParams: Promise<{ jornada?: string }> }) {
  const { jornada } = await searchParams
  const jornadaActual = jornada ? parseInt(jornada) : 1

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') redirect('/')

  const data = await fetchFootball('fixtures', {
    league: String(LIGA_CR_ID),
    season: String(SEASON),
    round: `Apertura - ${jornadaActual}`
  })

  const partidos = data.response ?? []
  const totalJornadas = 22

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-sm hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>← Volver</Link>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Gestión de partidos</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: totalJornadas }, (_, i) => i + 1).map((j) => (
          <a key={j} href={`/admin/partidos?jornada=${j}`}
            className="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: j === jornadaActual ? 'var(--primary)' : 'var(--background-card)',
              color: j === jornadaActual ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border)'
            }}>
            J{j}
          </a>
        ))}
      </div>

      <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Jornada {jornadaActual}</h2>

      <div className="flex flex-col gap-3">
        {partidos.length === 0 ? (
          <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>No hay partidos para esta jornada.</p>
        ) : (
          partidos.map((partido: any) => (
            <div key={partido.fixture.id} className="rounded-xl p-6 shadow-sm"
              style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 w-2/5 justify-end">
                  <span className="font-medium text-sm text-right" style={{
                    color: partido.teams.home.winner ? 'var(--primary)' : 'var(--text-primary)'
                  }}>
                    {partido.teams.home.name}
                  </span>
                  <Image src={partido.teams.home.logo} alt={partido.teams.home.name} width={28} height={28} />
                </div>

                <div className="flex flex-col items-center w-1/5">
                  {partido.fixture.status.short === 'FT' ? (
                    <>
                      <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                        {partido.goals.home} - {partido.goals.away}
                      </span>
                      <span className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Final</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>VS</span>
                      <span className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(partido.fixture.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 w-2/5 justify-start">
                  <Image src={partido.teams.away.logo} alt={partido.teams.away.name} width={28} height={28} />
                  <span className="font-medium text-sm" style={{
                    color: partido.teams.away.winner ? 'var(--primary)' : 'var(--text-primary)'
                  }}>
                    {partido.teams.away.name}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 flex items-center justify-between"
                style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>ID: {partido.fixture.id}</span>
                <span className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: partido.fixture.status.short === 'FT' ? 'var(--primary)' :
                      partido.fixture.status.short === 'LIVE' ? 'var(--accent)' : 'var(--border)',
                    color: partido.fixture.status.short === 'FT' || partido.fixture.status.short === 'LIVE'
                      ? 'white' : 'var(--text-secondary)'
                  }}>
                  {partido.fixture.status.short === 'FT' ? 'Finalizado' :
                   partido.fixture.status.short === 'LIVE' ? 'En vivo' : 'Programado'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}