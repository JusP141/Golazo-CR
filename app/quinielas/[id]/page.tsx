/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'
import { fetchFootball, LIGA_CR_ID, SEASON } from '@/app/lib/api-football'
import Link from 'next/link'
import Image from 'next/image'
import PrediccionForm from './PrediccionForm'

export default async function QuinielaDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: quiniela } = await supabase
    .from('quinielas')
    .select('*')
    .eq('id', id)
    .eq('usuario_id', user.id)
    .single()

  if (!quiniela) redirect('/quinielas')

  const { data: predicciones } = await supabase
    .from('predicciones')
    .select('*')
    .eq('quiniela_id', id)

  const data = await fetchFootball('fixtures', {
    league: String(LIGA_CR_ID),
    season: String(SEASON),
    round: 'Apertura - 1'
  })

  const partidos = data.response ?? []
  const totalPuntos = predicciones?.reduce((acc: number, p: any) => acc + (p.puntos || 0), 0) ?? 0

  return (
    <main className="min-h-screen bg-gray-950 p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/quinielas" className="text-gray-400 hover:text-white text-sm">← Volver</Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{quiniela.nombre}</h1>
          <p className="text-gray-400 mt-1">{quiniela.torneo}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-3 text-center">
          <p className="text-green-400 font-bold text-2xl">{totalPuntos}</p>
          <p className="text-gray-400 text-xs">puntos totales</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {partidos.map((partido: any) => {
          const prediccion = predicciones?.find((p: any) => p.fixture_id === partido.fixture.id)
          const finalizado = partido.fixture.status.short === 'FT'

          return (
            <div key={partido.fixture.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <span className="text-white font-medium text-sm text-right">{partido.teams.home.name}</span>
                  <Image src={partido.teams.home.logo} alt={partido.teams.home.name} width={28} height={28} />
                </div>
                <div className="flex flex-col items-center mx-4">
                  {finalizado ? (
                    <span className="text-white font-bold text-lg">
                      {partido.goals.home} - {partido.goals.away}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">VS</span>
                  )}
                  <span className="text-gray-500 text-xs mt-1">
                    {finalizado ? 'Final' : new Date(partido.fixture.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-1 justify-start">
                  <Image src={partido.teams.away.logo} alt={partido.teams.away.name} width={28} height={28} />
                  <span className="text-white font-medium text-sm">{partido.teams.away.name}</span>
                </div>
              </div>

              <PrediccionForm
                partido={partido}
                quinielaId={id}
                prediccionExistente={prediccion}
                finalizado={finalizado}
              />

              {prediccion && finalizado && (
                <div className="mt-3 pt-3 border-t border-gray-800 flex justify-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    prediccion.puntos === 3 ? 'bg-green-500 text-black' :
                    prediccion.puntos === 1 ? 'bg-yellow-500 text-black' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {prediccion.puntos === 3 ? '✓ 3 pts — Exacto' :
                     prediccion.puntos === 1 ? '~ 1 pt — Resultado correcto' :
                     '✗ 0 pts'}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}