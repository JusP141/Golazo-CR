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
    <main className="min-h-screen p-8 max-w-4xl mx-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Quinielas</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Predecí los resultados y competí con otros</p>
        </div>
        <Link
          href="/quinielas/nueva"
          className="font-bold px-6 py-3 rounded-xl transition-all hover:opacity-90 hover:shadow-md"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          + Nueva quiniela
        </Link>
      </div>

      {quinielas?.length === 0 ? (
        <div className="rounded-xl p-12 text-center shadow-sm"
          style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}>
          <p className="text-4xl mb-4">⚽</p>
          <p className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
            No tenés quinielas aún
          </p>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Creá tu primera quiniela y predecí los resultados
          </p>
          <Link
            href="/quinielas/nueva"
            className="font-bold px-6 py-3 rounded-xl transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
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
              className="rounded-xl p-6 flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-1"
              style={{ backgroundColor: 'var(--background-card)', border: '1px solid var(--border)' }}
            >
              <div>
                <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{quiniela.nombre}</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{quiniela.torneo}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Creada el {new Date(quiniela.created_at).toLocaleDateString('es-CR')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: quiniela.activa ? 'var(--primary)' : 'var(--border)',
                    color: quiniela.activa ? 'white' : 'var(--text-secondary)'
                  }}>
                  {quiniela.activa ? 'Activa' : 'Cerrada'}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}