/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminUsuarios() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') redirect('/')

  const { data: usuarios } = await supabase
    .from('perfiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-sm hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>← Volver</Link>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Usuarios</h1>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-sm" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-center">Rol</th>
              <th className="px-4 py-3 text-center">Registrado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios?.map((u: any, index: number) => (
              <tr
                key={u.id}
                style={{
                  backgroundColor: index % 2 === 0 ? 'var(--background-card)' : 'var(--background)',
                  borderBottom: '1px solid var(--border)'
                }}
              >
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{u.email}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{u.nombre ?? 'Sin nombre'}</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: u.rol === 'admin' ? 'var(--primary)' : 'var(--border)',
                      color: u.rol === 'admin' ? 'white' : 'var(--text-secondary)'
                    }}>
                    {u.rol}
                  </span>
                </td>
                <td className="px-4 py-3 text-center" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(u.created_at).toLocaleDateString('es-CR')}
                </td>
                <td className="px-4 py-3 text-center">
                  <form action={`/api/admin/cambiar-rol`} method="POST">
                    <input type="hidden" name="userId" value={u.id} />
                    <input type="hidden" name="rolActual" value={u.rol} />
                    <button
                      type="submit"
                      className="text-xs px-3 py-1 rounded-lg transition-colors hover:opacity-80"
                      style={{ backgroundColor: 'var(--border)', color: 'var(--text-primary)' }}
                    >
                      {u.rol === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}