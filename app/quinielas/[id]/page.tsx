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
    <main className="min-h-screen p-8 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex items-center gap-4 mb-2">
        <Link href="/quinielas" className="text-sm hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
          ← Volver
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{quiniela.nombre}</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{quiniela.torneo}</p>
        </div>
        <div className="rounded-xl px-6 py-3 text-center shadow-sm"
          style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
          <p className="font-bold text-2xl" style={{ color: 'var(--primary)' }}>{totalPuntos}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>puntos totales</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {partidos.map((partido: any) => {
          const prediccion = predicciones?.find((p: any) => p.fixture_id === partido.fixture.id)
          const finalizado = partido.fixture.status.short === 'FT'

          return (
            <div key={partido.fixture.id} className="rounded-xl p-6 shadow-sm"
              style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <span className="font-medium text-sm text-right" style={{
                    color: partido.teams.home.winner ? 'var(--primary)' : 'var(--text-primary)'
                  }}>
                    {partido.teams.home.name}
                  </span>
                  <Image src={partido.teams.home.logo} alt={partido.teams.home.name} width={28} height={28} />
                </div>
                <div className="flex flex-col items-center mx-4">
                  {finalizado ? (
                    <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                      {partido.goals.home} - {partido.goals.away}
                    </span>
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>VS</span>
                  )}
                  <span className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {finalizado ? 'Final' : new Date(partido.fixture.date).toLocaleDateString('es-CR', {
                      day: '2-digit', month: 'short'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-1 justify-start">
                  <Image src={partido.teams.away.logo} alt={partido.teams.away.name} width={28} height={28} />
                  <span className="font-medium text-sm" style={{
                    color: partido.teams.away.winner ? 'var(--primary)' : 'var(--text-primary)'
                  }}>
                    {partido.teams.away.name}
                  </span>
                </div>
              </div>

              <PrediccionForm
                partido={partido}
                quinielaId={id}
                prediccionExistente={prediccion}
                finalizado={finalizado}
              />

              {prediccion && finalizado && (
                <div className="mt-3 pt-3 flex justify-end"
                  style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: prediccion.puntos === 3 ? 'var(--primary)' :
                        prediccion.puntos === 1 ? 'var(--accent-2)' : 'var(--border)',
                      color: prediccion.puntos === 3 ? 'white' :
                        prediccion.puntos === 1 ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}>
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