/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'
import { fetchFootball, LIGA_CR_ID, SEASON } from '@/app/lib/api-football'
import Image from 'next/image'
import Link from 'next/link'

export default async function AdminJugadores() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') redirect('/')

  const data = await fetchFootball('standings', {
    league: String(LIGA_CR_ID),
    season: String(SEASON)
  })

  const equipos = data.response[0]?.league?.standings[0] ?? []

  return (
    <main className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-sm hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>← Volver</Link>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Gestión de jugadores</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {equipos.map((equipo: any) => (
            <Link
              key={equipo.team.id}
              href={`/admin/jugadores/${equipo.team.id}`}
              className="rounded-xl p-4 flex flex-col items-center gap-3 transition-all hover:shadow-md hover:-translate-y-1"
              style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}
            >
              <Image src={equipo.team.logo} alt={equipo.team.name} width={48} height={48} />
              <span className="text-sm font-medium text-center" style={{ color: 'var(--text-primary)' }}>
                {equipo.team.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}