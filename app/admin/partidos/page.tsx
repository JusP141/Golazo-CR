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
    <main className="min-h-screen bg-gray-950 p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Volver</Link>
        <h1 className="text-3xl font-bold text-white">Gestión de partidos</h1>
      </div>

      {/* Selector de jornadas */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: totalJornadas }, (_, i) => i + 1).map((j) => (
          <a key={j} href={`/admin/partidos?jornada=${j}`}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              j === jornadaActual ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}>
            J{j}
          </a>
        ))}
      </div>

      <h2 className="text-white font-bold text-lg mb-4">Jornada {jornadaActual}</h2>

      <div className="flex flex-col gap-3">
        {partidos.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No hay partidos para esta jornada.</p>
        ) : (
          partidos.map((partido: any) => (
            <div key={partido.fixture.id} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 w-2/5 justify-end">
                  <span className={`font-medium text-sm text-right ${partido.teams.home.winner ? 'text-green-400' : 'text-white'}`}>
                    {partido.teams.home.name}
                  </span>
                  <Image src={partido.teams.home.logo} alt={partido.teams.home.name} width={28} height={28} />
                </div>

                <div className="flex flex-col items-center w-1/5">
                  {partido.fixture.status.short === 'FT' ? (
                    <>
                      <span className="text-white font-bold text-xl">{partido.goals.home} - {partido.goals.away}</span>
                      <span className="text-gray-500 text-xs mt-1">Final</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white font-bold">VS</span>
                      <span className="text-gray-400 text-xs mt-1">
                        {new Date(partido.fixture.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 w-2/5 justify-start">
                  <Image src={partido.teams.away.logo} alt={partido.teams.away.name} width={28} height={28} />
                  <span className={`font-medium text-sm ${partido.teams.away.winner ? 'text-green-400' : 'text-white'}`}>
                    {partido.teams.away.name}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                <span className="text-gray-500 text-xs">ID: {partido.fixture.id}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  partido.fixture.status.short === 'FT' ? 'bg-green-500 text-black' :
                  partido.fixture.status.short === 'LIVE' ? 'bg-red-500 text-white animate-pulse' :
                  'bg-gray-700 text-gray-300'
                }`}>
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