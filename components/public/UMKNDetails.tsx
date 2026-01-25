'use client'

import { useState } from 'react'
import { UMKM, Product } from '@/types'
import { ArrowLeft, MapPin, Phone, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { generateWhatsAppMessage, openWhatsApp } from '@/utils/whatsapp'

interface UMKMDetailProps {
    umkm: UMKM
    products: Product[]
}

export default function UMKMDetail({ umkm, products }: UMKMDetailProps) {
    const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map())
    const [deliveryAddress, setDeliveryAddress] = useState('')
    const [showOrderForm, setShowOrderForm] = useState(false)

    const handleQuantityChange = (productId: string, quantity: number) => {
        const newSelected = new Map(selectedProducts)
        if (quantity <= 0) {
            newSelected.delete(productId)
        } else {
            newSelected.set(productId, quantity)
        }
        setSelectedProducts(newSelected)
    }

    const handleOrder = () => {
        if (selectedProducts.size === 0 || !deliveryAddress.trim()) {
            alert('Pilih produk dan isi alamat pengantaran!')
            return
        }

        const orderData = {
            umkm,
            products: Array.from(selectedProducts.entries()).map(([productId, quantity]) => ({
                product: products.find(p => p.id === productId)!,
                quantity
            })),
            deliveryAddress
        }

        const message = generateWhatsAppMessage(orderData)
        openWhatsApp(umkm.whatsapp, message)
    }

    const openMap = () => {
        if (umkm.latitude && umkm.longitude) {
            window.open(`https://maps.google.com/?q=${umkm.latitude},${umkm.longitude}`, '_blank')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-emerald-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="inline-flex items-center text-white hover:text-emerald-100">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* UMKM Info */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="relative h-64 bg-gray-200">
                        {umkm.image_url ? (
                            <Image
                                src={umkm.image_url}
                                alt={umkm.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <span className="text-6xl">🏪</span>
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{umkm.name}</h1>

                        {umkm.category && (
                            <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded mb-4">
                                {umkm.category}
                            </span>
                        )}

                        {umkm.description && (
                            <p className="text-gray-600 mb-4">{umkm.description}</p>
                        )}

                        <div className="space-y-2 mb-4">
                            <div className="flex items-start text-gray-700">
                                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                <span>{umkm.address}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                                <span>{umkm.phone}</span>
                            </div>
                        </div>

                        {umkm.latitude && umkm.longitude && (
                            <button
                                onClick={openMap}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Lihat Lokasi di Peta
                            </button>
                        )}
                    </div>
                </div>

                {/* Products */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Produk</h2>

                    {products.length === 0 ? (
                        <p className="text-gray-500">Belum ada produk tersedia</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                                        )}
                                        <p className="text-emerald-600 font-bold mb-3">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(product.id, (selectedProducts.get(product.id) || 0) - 1)}
                                                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">{selectedProducts.get(product.id) || 0}</span>
                                            <button
                                                onClick={() => handleQuantityChange(product.id, (selectedProducts.get(product.id) || 0) + 1)}
                                                className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Form */}
                {selectedProducts.size > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Form Pemesanan</h3>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Alamat Pengantaran
                            </label>
                            <textarea
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder="Masukkan alamat lengkap pengantaran..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                rows={3}
                            />
                        </div>

                        <button
                            onClick={handleOrder}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center"
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Pesan via WhatsApp
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}