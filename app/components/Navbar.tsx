/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [usuario, setUsuario] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUsuario(user)
      if (user) {
        const { data } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setPerfil(data)
      }
    }
    getUsuario()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUsuario(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setPerfil(data)
      } else {
        setPerfil(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={{ backgroundColor: 'var(--navbar)' }} className="px-8 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center gap-2" style={{ color: 'var(--primary-light)' }}>
           Golazo CR
        </Link>
        <div className="flex items-center gap-6">
          {['Tabla', 'Calendario', 'Clubes', 'Goleadores', 'Quinielas'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: '#D4C5A9' }}
            >
              {item}
            </Link>
          ))}
          {perfil?.rol === 'admin' && (
            <Link href="/admin" className="text-sm font-medium transition-colors" style={{ color: 'var(--accent-2)' }}>
              ⚙️ Admin
            </Link>
          )}
          {usuario ? (
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: '#D4C5A9' }}>{usuario.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-sm transition-colors" style={{ color: '#D4C5A9' }}>
                Iniciar sesión
              </Link>
              <Link
                href="/auth/registro"
                className="text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--primary-light)', color: 'var(--text-primary)' }}
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}