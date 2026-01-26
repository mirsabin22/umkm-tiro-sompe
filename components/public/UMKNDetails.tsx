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
                                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                                    {/* Image - Fixed Height */}
                                    <div className="relative w-full h-40 bg-gray-200 flex-shrink-0">
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                                            <p className="text-emerald-600 font-bold mb-3">
                                                Rp {product.price.toLocaleString('id-ID')}
                                            </p>
                                        </div>

                                        {/* Quantity Control - Fixed at Bottom */}
                                        <div className="flex items-center gap-2 mt-auto">
                                            <button
                                                onClick={() => handleQuantityChange(product.id, (selectedProducts.get(product.id) || 0) - 1)}
                                                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-semibold">{selectedProducts.get(product.id) || 0}</span>
                                            <button
                                                onClick={() => handleQuantityChange(product.id, (selectedProducts.get(product.id) || 0) + 1)}
                                                className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition"
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

                {/* Floating Order Button */}
                {selectedProducts.size > 0 && !showOrderForm && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-emerald-600 shadow-2xl p-4 z-40">
                        <div className="container mx-auto max-w-4xl">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">
                                        {Array.from(selectedProducts.values()).reduce((a, b) => a + b, 0)} item dipilih
                                    </p>
                                    <p className="font-bold text-lg text-emerald-600">
                                        Rp {Array.from(selectedProducts.entries()).reduce((total, [productId, quantity]) => {
                                            const product = products.find(p => p.id === productId)
                                            return total + (product ? product.price * quantity : 0)
                                        }, 0).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowOrderForm(true)}
                                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition flex items-center shadow-lg"
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Pesan Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Form Modal */}
                {showOrderForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center p-4">
                        <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <ShoppingCart className="w-6 h-6 mr-2 text-emerald-600" />
                                    Konfirmasi Pesanan
                                </h3>
                                <button
                                    onClick={() => setShowOrderForm(false)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Selected Products Summary */}
                                <div className="mb-6">
                                    <p className="font-semibold text-gray-800 mb-3 text-base">Pesanan Anda:</p>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        {Array.from(selectedProducts.entries()).map(([productId, quantity]) => {
                                            const product = products.find(p => p.id === productId)
                                            if (!product) return null
                                            return (
                                                <div key={productId} className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800">{product.name}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {quantity} x Rp {product.price.toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold text-emerald-600">
                                                        Rp {(product.price * quantity).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            )
                                        })}
                                        <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between items-center">
                                            <span className="font-bold text-gray-800 text-lg">Total:</span>
                                            <span className="font-bold text-xl text-emerald-600">
                                                Rp {Array.from(selectedProducts.entries()).reduce((total, [productId, quantity]) => {
                                                    const product = products.find(p => p.id === productId)
                                                    return total + (product ? product.price * quantity : 0)
                                                }, 0).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div className="mb-6">
                                    <label className="block text-gray-800 font-bold mb-2 text-base">
                                        Alamat Pengantaran <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="Masukkan alamat lengkap pengantaran...&#10;Contoh: Jl. Veteran No.10, Kelurahan Tiro Sompe"
                                        className="w-full border-2 border-gray-300 rounded-lg p-3 text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                        rows={4}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Pastikan alamat lengkap dan jelas agar pesanan dapat diantar dengan tepat
                                    </p>
                                </div>

                                {/* Order Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowOrderForm(false)}
                                        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleOrder()
                                            setShowOrderForm(false)
                                        }}
                                        disabled={!deliveryAddress.trim()}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Kirim Pesanan
                                    </button>
                                </div>
                                <p className="text-xs text-center text-gray-500 mt-3">
                                    Anda akan diarahkan ke WhatsApp untuk menyelesaikan pesanan
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}