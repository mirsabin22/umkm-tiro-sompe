'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { UMKM, Product } from '@/types'
import { Plus, LogOut, Store, Package } from 'lucide-react'
import Link from 'next/link'
import UMKMList from '@/components/admin/UMKMList'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
    const [umkms, setUmkms] = useState<UMKM[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check authentication
        const session = localStorage.getItem('admin_session')
        if (!session) {
            router.push('/admin')
            return
        }

        fetchUMKMs()
    }, [router])

    const fetchUMKMs = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('umkm')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching UMKMs:', error)
        } else {
            setUmkms(data as UMKM[])
        }
        setLoading(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('admin_session')
        router.push('/admin')
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus UMKM ini?')) return

        const supabase = createClient()
        const { error } = await supabase
            .from('umkm')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error('Gagal menghapus UMKM!')
            console.error(error)
        } else {
            toast.success('UMKM berhasil dihapus!')
            fetchUMKMs()
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            {/* Header */}
            <header className="bg-white shadow-md border-b-4 border-emerald-500">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Image
                                src="/logo.png"
                                alt="UMKM-GO Logo"
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-emerald-700">Admin Dashboard</h1>
                                <p className="text-gray-600 text-sm">Kelola UMKM-GO Tiro Sompe</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total UMKM</p>
                                <p className="text-3xl font-bold text-gray-800">{umkms.length}</p>
                            </div>
                            <Store className="w-12 h-12 text-emerald-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">UMKM Aktif</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {umkms.filter(u => u.status === 'ACTIVE').length}
                                </p>
                            </div>
                            <Package className="w-12 h-12 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Daftar UMKM</h2>
                    <Link
                        href="/admin/umkm/add"
                        className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah UMKM
                    </Link>
                </div>

                {/* UMKM List */}
                <UMKMList umkms={umkms} onDelete={handleDelete} />
            </main>
        </div>
    )
}