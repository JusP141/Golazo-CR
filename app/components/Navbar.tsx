/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [usuario, setUsuario] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUsuario(user)
    }
    getUsuario()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-green-500 font-bold text-xl">
          ⚽ Golazo CR
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/tabla" className="text-gray-400 hover:text-white transition-colors text-sm">
            Tabla
          </Link>
          <Link href="/calendario" className="text-gray-400 hover:text-white transition-colors text-sm">
            Calendario
          </Link>
          <Link href="/clubes" className="text-gray-400 hover:text-white transition-colors text-sm">
            Clubes
          </Link>
          <Link href="/goleadores" className="text-gray-400 hover:text-white transition-colors text-sm">
            Goleadores
          </Link>
          {usuario ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{usuario.email}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                Iniciar sesión
              </Link>
              <Link href="/auth/registro" className="bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-4 py-2 rounded-lg transition-colors">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}