'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UMKM, Product } from '@/types'
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ManageProducts() {
    const [umkm, setUmkm] = useState<UMKM | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        status: 'AVAILABLE'
    })
    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        const session = localStorage.getItem('admin_session')
        if (!session) {
            router.push('/admin')
            return
        }

        fetchData()
    }, [router])

    const fetchData = async () => {
        const supabase = createClient()

        // Fetch UMKM
        const { data: umkmData, error: umkmError } = await supabase
            .from('umkm')
            .select('*')
            .eq('id', params.id)
            .single()

        if (umkmError || !umkmData) {
            alert('UMKM tidak ditemukan!')
            router.push('/admin/dashboard')
            return
        }

        setUmkm(umkmData as UMKM)

        // Fetch Products
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('umkm_id', params.id)
            .order('created_at', { ascending: false })

        if (!productsError) {
            setProducts(productsData as Product[])
        }

        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const supabase = createClient()
        const productData = {
            name: formData.name,
            description: formData.description || null,
            price: parseFloat(formData.price),
            image_url: formData.image_url || null,
            status: formData.status,
            umkm_id: params.id
        }

        let error

        if (editingProduct) {
            // Update
            const result = await supabase
                .from('products')
                .update({ ...productData, updated_at: new Date().toISOString() })
                .eq('id', editingProduct.id)
            error = result.error
        } else {
            // Insert
            const result = await supabase
                .from('products')
                .insert([productData])
            error = result.error
        }

        if (error) {
            alert('Gagal menyimpan produk!')
            console.error(error)
        } else {
            alert('Produk berhasil disimpan!')
            setShowForm(false)
            setEditingProduct(null)
            resetForm()
            fetchData()
        }
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            image_url: product.image_url || '',
            status: product.status
        })
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus produk ini?')) return

        const supabase = createClient()
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) {
            alert('Gagal menghapus produk!')
            console.error(error)
        } else {
            alert('Produk berhasil dihapus!')
            fetchData()
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            image_url: '',
            status: 'AVAILABLE'
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
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
            <header className="bg-emerald-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/admin/dashboard" className="inline-flex items-center hover:text-emerald-100">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Dashboard
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Produk</h1>
                    <p className="text-gray-600">UMKM: {umkm?.name}</p>
                </div>

                {/* Add Product Button */}
                {!showForm && (
                    <button
                        onClick={() => {
                            setEditingProduct(null)
                            resetForm()
                            setShowForm(true)
                        }}
                        className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition mb-6"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Produk
                    </button>
                )}

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Nama Produk <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Harga <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="15000"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    URL Gambar
                                </label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                >
                                    <option value="AVAILABLE">AVAILABLE</option>
                                    <option value="UNAVAILABLE">UNAVAILABLE</option>
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
                                >
                                    Simpan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false)
                                        setEditingProduct(null)
                                        resetForm()
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Daftar Produk ({products.length})</h2>

                    {products.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-500">Belum ada produk</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="relative h-40 bg-gray-200">
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <span className="text-4xl">🍽️</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                                        {product.description && (
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                                        )}
                                        <p className="text-emerald-600 font-bold mb-2">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </p>
                                        <span className={`inline-block text-xs px-2 py-1 rounded mb-3 ${product.status === 'AVAILABLE'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.status}
                                        </span>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="flex items-center bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition"
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="flex items-center bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}