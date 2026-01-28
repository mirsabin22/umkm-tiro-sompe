import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UMKM } from '@/types'
import UMKMCard from '@/components/public/UMKMCard'
import StatCard from '@/components/public/StatCard'
import { Store, Package, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getUMKMs() {
  const supabase = await createClient()

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

async function getStats() {
  const supabase = await createClient()

  const { count: totalUMKM } = await supabase
    .from('umkm')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ACTIVE')

  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'AVAILABLE')

  const { data: categories } = await supabase
    .from('umkm')
    .select('category')
    .eq('status', 'ACTIVE')
    .not('category', 'is', null)

  const uniqueCategories = new Set(categories?.map(c => c.category))

  return {
    totalUMKM: totalUMKM || 0,
    totalProducts: totalProducts || 0,
    totalCategories: uniqueCategories.size
  }
}

export default async function Home() {
  const umkms = await getUMKMs()
  const stats = await getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow-md border-b-4 border-emerald-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="UMKM-GO Logo"
              width={120}
              height={120}
              priority
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">
                UMKM-GO
              </h1>
              <p className="text-gray-600 text-sm">
                Kelurahan Tiro Sompe
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Dukung UMKM Lokal Tiro Sompe
            </h2>
            <p className="text-lg md:text-xl text-emerald-100 mb-8">
              Platform digitalisasi UMKM untuk memudahkan Anda menemukan dan
              memesan produk lokal terbaik dari Kelurahan Tiro Sompe, Kota Parepare
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#umkm-list"
                className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-bold hover:bg-emerald-50 transition shadow-lg"
              >
                Lihat UMKM
              </Link>

              <Link
                href="#statistics"
                className="bg-emerald-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-900 transition border-2 border-white"
              >
                Statistik Platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATISTICS ===== */}
      <section id="statistics" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Statistik Platform
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <StatCard
              icon={<Store className="w-12 h-12 opacity-80" />}
              value={stats.totalUMKM}
              label="UMKM Aktif"
              description="Usaha Mikro, Kecil, dan Menengah yang terdaftar"
              color="emerald"
            />

            <StatCard
              icon={<Package className="w-12 h-12 opacity-80" />}
              value={stats.totalProducts}
              label="Produk Tersedia"
              description="Produk lokal yang dapat Anda pesan"
              color="blue"
            />

            <StatCard
              icon={<MapPin className="w-12 h-12 opacity-80" />}
              value={stats.totalCategories}
              label="Kategori"
              description="Beragam jenis usaha di Tiro Sompe"
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* ===== UMKM LIST ===== */}
      <main id="umkm-list" className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Daftar UMKM
          </h2>
          <p className="text-gray-600">
            Temukan produk lokal terbaik dari Kelurahan Tiro Sompe
          </p>
        </div>

        {umkms.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Belum ada UMKM terdaftar
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {umkms.map(umkm => (
              <UMKMCard key={umkm.id} umkm={umkm} />
            ))}
          </div>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">
            © 2025 Kelurahan Tiro Sompe, Kota Parepare
          </p>
          <p className="text-sm text-gray-400">
            Dikembangkan dalam Program KKN Unhas Gelombang 115
          </p>
        </div>
      </footer>
    </div>
  )
}

