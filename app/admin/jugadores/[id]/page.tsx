/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'
import { fetchFootball } from '@/app/lib/api-football'
import Image from 'next/image'
import Link from 'next/link'

export default async function AdminJugadoresEquipo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') redirect('/')

  const squadData = await fetchFootball('players/squads', { team: id })
  const plantel = squadData.response[0]?.players ?? []
  const equipo = squadData.response[0]?.team

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/jugadores" className="text-sm hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>← Volver</Link>
        <div className="flex items-center gap-3">
          {equipo && <Image src={equipo.logo} alt={equipo.name} width={40} height={40} />}
          <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>{equipo?.name}</h1>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-sm" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <th className="px-4 py-3 text-left">Jugador</th>
              <th className="px-4 py-3 text-center">Edad</th>
              <th className="px-4 py-3 text-center">Posición</th>
              <th className="px-4 py-3 text-center">Número</th>
            </tr>
          </thead>
          <tbody>
            {plantel.map((jugador: any, index: number) => (
              <tr key={jugador.id}
                style={{
                  backgroundColor: index % 2 === 0 ? 'var(--background-card)' : 'var(--background)',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={jugador.photo}
                      alt={jugador.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                      style={{ border: '2px solid var(--border)' }}
                    />
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{jugador.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-secondary)' }}>{jugador.age}</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{
                      backgroundColor:
                        jugador.position === 'Goalkeeper' ? '#E9C46A' :
                        jugador.position === 'Defender' ? 'var(--primary-light)' :
                        jugador.position === 'Midfielder' ? 'var(--primary)' :
                        'var(--accent)'
                    }}>
                    {jugador.position === 'Goalkeeper' ? 'Portero' :
                     jugador.position === 'Defender' ? 'Defensa' :
                     jugador.position === 'Midfielder' ? 'Mediocampista' :
                     'Delantero'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-secondary)' }}>
                  {jugador.number ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}