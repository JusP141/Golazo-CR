/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/app/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Quinielas() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: quinielas } = await supabase
    .from('quinielas')
    .select('*')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-950 p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-500">Quinielas</h1>
          <p className="text-gray-400 mt-1">Predecí los resultados y competí con otros</p>
        </div>
        <Link
          href="/quinielas/nueva"
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition-colors"
        >
          + Nueva quiniela
        </Link>
      </div>

      {quinielas?.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-4xl mb-4">⚽</p>
          <p className="text-white font-bold text-lg mb-2">No tenés quinielas aún</p>
          <p className="text-gray-400 mb-6">Creá tu primera quiniela y predecí los resultados</p>
          <Link
            href="/quinielas/nueva"
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Crear quiniela
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {quinielas?.map((quiniela: any) => (
            <Link
              key={quiniela.id}
              href={`/quinielas/${quiniela.id}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-between hover:border-green-500 transition-colors"
            >
              <div>
                <h2 className="text-white font-bold text-lg">{quiniela.nombre}</h2>
                <p className="text-gray-400 text-sm mt-1">{quiniela.torneo}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Creada el {new Date(quiniela.created_at).toLocaleDateString('es-CR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  quiniela.activa ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'
                }`}>
                  {quiniela.activa ? 'Activa' : 'Cerrada'}
                </span>
                <span className="text-gray-400">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}