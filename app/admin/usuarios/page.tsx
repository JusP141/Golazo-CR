/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'

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
    <main className="min-h-screen bg-gray-950 p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Usuarios</h1>
      <p className="text-gray-400 mb-6">Gestión de usuarios del sistema</p>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm text-gray-300">
          <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-center">Rol</th>
              <th className="px-4 py-3 text-center">Registrado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios?.map((u: any) => (
              <tr key={u.id} className="border-t border-gray-800 hover:bg-gray-900 transition-colors">
                <td className="px-4 py-3 text-white">{u.email}</td>
                <td className="px-4 py-3 text-gray-400">{u.nombre ?? 'Sin nombre'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.rol === 'admin'
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {u.rol}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-400">
                  {new Date(u.created_at).toLocaleDateString('es-CR')}
                </td>
                <td className="px-4 py-3 text-center">
                  <form action={`/api/admin/cambiar-rol`} method="POST">
                    <input type="hidden" name="userId" value={u.id} />
                    <input type="hidden" name="rolActual" value={u.rol} />
                    <button
                      type="submit"
                      className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-lg transition-colors"
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