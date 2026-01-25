import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { UMKM } from '@/types'
import UMKMCard from '@/components/public/UMKMCard'

export const dynamic = 'force-dynamic'

async function getUMKMs() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('umkm')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching UMKMs:', error)
    return []
  }

  return data as UMKM[]
}

export default async function Home() {
  const umkms = await getUMKMs()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">UMKM Tiro Sompe</h1>
              <p className="text-emerald-100 text-sm mt-1">Dukung UMKM Lokal Kami</p>
            </div>
            <Link
              href="/admin"
              className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Daftar UMKM</h2>
          <p className="text-gray-600">Temukan produk lokal terbaik dari Kelurahan Tiro Sompe</p>
        </div>

        {umkms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Belum ada UMKM terdaftar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {umkms.map((umkm) => (
              <UMKMCard key={umkm.id} umkm={umkm} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 UMKM Tiro Sompe - KKN Digitalisasi UMKM</p>
        </div>
      </footer>
    </div>
  )
}