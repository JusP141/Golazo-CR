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
    <main className="min-h-screen bg-gray-950 p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/jugadores" className="text-gray-400 hover:text-white text-sm">← Volver</Link>
        <div className="flex items-center gap-3">
          {equipo && <Image src={equipo.logo} alt={equipo.name} width={40} height={40} />}
          <h1 className="text-3xl font-bold text-white">{equipo?.name}</h1>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm text-gray-300">
          <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Jugador</th>
              <th className="px-4 py-3 text-center">Edad</th>
              <th className="px-4 py-3 text-center">Posición</th>
              <th className="px-4 py-3 text-center">Número</th>
            </tr>
          </thead>
          <tbody>
            {plantel.map((jugador: any) => (
              <tr key={jugador.id} className="border-t border-gray-800 hover:bg-gray-900 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={jugador.photo}
                      alt={jugador.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-white font-medium">{jugador.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-400">{jugador.age}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    jugador.position === 'Goalkeeper' ? 'bg-yellow-500 text-black' :
                    jugador.position === 'Defender' ? 'bg-blue-500 text-white' :
                    jugador.position === 'Midfielder' ? 'bg-green-500 text-black' :
                    'bg-red-500 text-white'
                  }`}>
                    {jugador.position === 'Goalkeeper' ? 'Portero' :
                     jugador.position === 'Defender' ? 'Defensa' :
                     jugador.position === 'Midfielder' ? 'Mediocampista' :
                     'Delantero'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-400">{jugador.number ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}