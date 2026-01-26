'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Upload, MapPin } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { uploadImage, validateImageFile } from '@/utils/imageupload'
import { parseGoogleMapsLink, isValidGoogleMapsLink } from '@/utils/mapsParser'
import Image from 'next/image'

export default function AddUMKM() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        phone: '',
        whatsapp: '',
        address: '',
        maps_link: '',
        latitude: '',
        longitude: '',
        image_url: '',
        status: 'ACTIVE'
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const session = localStorage.getItem('admin_session')
        if (!session) {
            router.push('/admin')
        }
    }, [router])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate image
        const error = validateImageFile(file)
        if (error) {
            toast.error(error)
            return
        }

        setImageFile(file)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleMapsLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const link = e.target.value
        setFormData({ ...formData, maps_link: link })

        // Auto-parse coordinates
        if (link && isValidGoogleMapsLink(link)) {
            const coords = parseGoogleMapsLink(link)
            if (coords) {
                setFormData(prev => ({
                    ...prev,
                    maps_link: link,
                    latitude: coords.latitude.toString(),
                    longitude: coords.longitude.toString()
                }))
                toast.success('Koordinat berhasil di-extract!')
            } else {
                toast.error('Gagal extract koordinat dari link. Silakan input manual.')
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = formData.image_url

            // Upload image if exists
            if (imageFile) {
                setUploadingImage(true)
                const uploadedUrl = await uploadImage(imageFile, 'umkm')
                setUploadingImage(false)

                if (!uploadedUrl) {
                    toast.error('Gagal upload gambar!')
                    setLoading(false)
                    return
                }
                imageUrl = uploadedUrl
            }

            const supabase = createClient()
            const { error } = await supabase.from('umkm').insert([{
                name: formData.name,
                description: formData.description || null,
                category: formData.category || null,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
                address: formData.address,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                image_url: imageUrl || null,
                status: formData.status
            }])

            if (error) {
                toast.error('Gagal menambah UMKM!')
                console.error(error)
            } else {
                toast.success('UMKM berhasil ditambahkan!')
                router.push('/admin/dashboard')
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Terjadi kesalahan!')
        }

        setLoading(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
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

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah UMKM Baru</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Gambar UMKM
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
                                Nama UMKM <span className="text-red-500">*</span>
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
                                Kategori
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Contoh: Kuliner, Fashion, Kerajinan"
                                className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
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
                                rows={3}
                                className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    No. Telepon <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="08123456789"
                                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    WhatsApp <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    placeholder="628123456789"
                                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Alamat <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={2}
                                className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* Google Maps Link */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                <MapPin className="inline w-4 h-4 mr-1" />
                                Link Google Maps
                            </label>
                            <input
                                type="text"
                                name="maps_link"
                                value={formData.maps_link}
                                onChange={handleMapsLinkChange}
                                placeholder="https://maps.google.com/?q=-4.0098,119.6231"
                                className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Paste link dari Google Maps, koordinat akan otomatis ter-extract
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Latitude
                                </label>
                                <input
                                    type="text"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    placeholder="-4.0098"
                                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Longitude
                                </label>
                                <input
                                    type="text"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    placeholder="119.6231"
                                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
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
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading || uploadingImage}
                                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:bg-gray-400"
                            >
                                {uploadingImage ? 'Uploading gambar...' : loading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <Link
                                href="/admin/dashboard"
                                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition text-center"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}