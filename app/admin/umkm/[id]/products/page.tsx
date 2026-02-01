'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UMKM, Product } from '@/types'
import { ArrowLeft, Plus, Edit, Trash2, Upload } from 'lucide-react'
import { uploadImage, validateImageFile } from '@/utils/image/imageUpload'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

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
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')
    const [uploadingImage, setUploadingImage] = useState(false)
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
        const { id } = await params

        const { data: umkmData, error: umkmError } = await supabase
            .from('umkm')
            .select('*')
            .eq('id', id)
            .single()

        if (umkmError || !umkmData) {
            toast.error('UMKM tidak ditemukan!')
            router.push('/admin/dashboard')
            return
        }

        setUmkm(umkmData as UMKM)

        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('umkm_id', id)
            .order('created_at', { ascending: false })

        if (!productsError) {
            setProducts(productsData as Product[])
        }

        setLoading(false)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const error = validateImageFile(file)
        if (error) {
            toast.error(error)
            return
        }

        setImageFile(file)

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            let imageUrl = formData.image_url

            if (imageFile) {
                setUploadingImage(true)
                const uploadedUrl = await uploadImage(imageFile, 'products')
                setUploadingImage(false)

                if (!uploadedUrl) {
                    toast.error('Gagal upload gambar!')
                    return
                }
                imageUrl = uploadedUrl
            }

            const supabase = createClient()
            const { id } = await params
            const productData = {
                name: formData.name,
                description: formData.description || null,
                price: parseFloat(formData.price),
                image_url: imageUrl || null,
                status: formData.status,
                umkm_id: id
            }

            let error

            if (editingProduct) {
                const result = await supabase
                    .from('products')
                    .update({ ...productData, updated_at: new Date().toISOString() })
                    .eq('id', editingProduct.id)
                error = result.error
            } else {
                const result = await supabase
                    .from('products')
                    .insert([productData])
                error = result.error
            }

            if (error) {
                toast.error('Gagal menyimpan produk!')
                console.error(error)
            } else {
                toast.success('Produk berhasil disimpan!')
                setShowForm(false)
                setEditingProduct(null)
                resetForm()
                fetchData()
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Terjadi kesalahan!')
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
        if (product.image_url) {
            setImagePreview(product.image_url)
        }
        setImageFile(null)
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
            toast.error('Gagal menghapus produk!')
            console.error(error)
        } else {
            toast.success('Produk berhasil dihapus!')
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
        setImageFile(null)
        setImagePreview('')
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

                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Gambar Produk
                                </label>
                                <div className="flex flex-col items-center gap-4">
                                    {imagePreview && (
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <label className="w-full cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-600">
                                                {imageFile ? imageFile.name : 'Klik untuk upload gambar'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                JPG, PNG, atau WebP (max 5MB)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Nama Produk <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
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
                                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Harga <span className="text-red-500"></span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="15000"
                                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
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
                                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                >
                                    <option value="AVAILABLE">AVAILABLE</option>
                                    <option value="UNAVAILABLE">UNAVAILABLE</option>
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={uploadingImage}
                                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:bg-gray-400"
                                >
                                    {uploadingImage ? 'Uploading...' : 'Simpan'}
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

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Daftar Produk ({products.length})</h2>

                    {products.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-500">Belum ada produk</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                                    {/* Image - Fixed Height */}
                                    <div className="relative w-full h-40 bg-gray-200 flex-shrink-0">
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <span className="text-4xl">🍽️</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content - Flex Grow */}
                                    <div className="p-4 flex-grow flex flex-col">
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 min-h-[3rem]">
                                                {product.name}
                                            </h3>
                                            {product.description && (
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2 min-h-[2.5rem]">
                                                    {product.description}
                                                </p>
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
                                        </div>

                                        {/* Action Buttons - Fixed at Bottom */}
                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="flex items-center justify-center flex-1 bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700 transition"
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="flex items-center justify-center flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition"
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