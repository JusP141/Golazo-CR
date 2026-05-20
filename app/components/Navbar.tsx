import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-green-500 font-bold text-xl">
          ⚽ Golazo CR
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            Tabla
          </Link>
          <Link href="/calendario" className="text-gray-400 hover:text-white transition-colors text-sm">
            Calendario
          </Link>
          <Link href="/clubes" className="text-gray-400 hover:text-white transition-colors text-sm">
            Clubes
          </Link>
        </div>
      </div>
    </nav>
  )
}