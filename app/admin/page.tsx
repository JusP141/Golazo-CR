/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') redirect('/')

  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Panel de administración</h1>
          <p className="text-gray-400 mt-1">Golazo CR — Gestión del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/partidos" className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500 transition-colors">
            <p className="text-3xl mb-3">⚽</p>
            <h2 className="text-white font-bold text-lg mb-1">Partidos</h2>
            <p className="text-gray-400 text-sm">Cargar y actualizar resultados de partidos</p>
          </Link>

          <Link href="/admin/jugadores" className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500 transition-colors">
            <p className="text-3xl mb-3">👤</p>
            <h2 className="text-white font-bold text-lg mb-1">Jugadores</h2>
            <p className="text-gray-400 text-sm">Gestionar plantillas y estadísticas</p>
          </Link>

          <Link href="/admin/usuarios" className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500 transition-colors">
            <p className="text-3xl mb-3">👥</p>
            <h2 className="text-white font-bold text-lg mb-1">Usuarios</h2>
            <p className="text-gray-400 text-sm">Ver usuarios y gestionar roles</p>
          </Link>
        </div>
      </div>
    </main>
  )
}