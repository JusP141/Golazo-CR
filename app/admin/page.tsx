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
    <main className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Panel de administración</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Golazo CR — Gestión del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { href: '/admin/partidos', icon: '⚽', title: 'Partidos', desc: 'Cargar y actualizar resultados de partidos' },
            { href: '/admin/jugadores', icon: '👤', title: 'Jugadores', desc: 'Gestionar plantillas y estadísticas' },
            { href: '/admin/usuarios', icon: '👥', title: 'Usuarios', desc: 'Ver usuarios y gestionar roles' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl p-6 transition-all hover:shadow-md hover:-translate-y-1"
              style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}
            >
              <p className="text-3xl mb-3">{item.icon}</p>
              <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}