import { supabase } from './lib/supabase'

export default async function Home() {
  const { error } = await supabase.from('clubes').select('*')

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-green-600">⚽ Golazo CR</h1>
      <p className="mt-4 text-gray-400">
        {error ? `Error: ${error.message}` : 'Conexión con Supabase exitosa ✅'}
      </p>
    </main>
  )
}