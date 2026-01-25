'use client'

import { UMKM } from '@/types'
import { Edit, Trash2, Eye, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface UMKMListProps {
    umkms: UMKM[]
    onDelete: (id: string) => void
}

export default function UMKMList({ umkms, onDelete }: UMKMListProps) {
    if (umkms.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 text-lg">Belum ada UMKM terdaftar</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {umkms.map((umkm) => (
                <div key={umkm.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="relative w-full md:w-48 h-48 bg-gray-200 flex-shrink-0">
                            {umkm.image_url ? (
                                <Image
                                    src={umkm.image_url}
                                    alt={umkm.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <span className="text-5xl">🏪</span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{umkm.name}</h3>
                                    {umkm.category && (
                                        <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
                                            {umkm.category}
                                        </span>
                                    )}
                                    <span className={`inline-block ml-2 text-xs px-2 py-1 rounded ${umkm.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {umkm.status}
                                    </span>
                                </div>
                            </div>

                            {umkm.description && (
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {umkm.description}
                                </p>
                            )}

                            <div className="space-y-1 mb-4">
                                <div className="flex items-center text-gray-600 text-sm">
                                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span className="line-clamp-1">{umkm.address}</span>
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span>{umkm.phone}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href={`/umkm/${umkm.id}`}
                                    target="_blank"
                                    className="flex items-center bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition"
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Lihat
                                </Link>
                                <Link
                                    href={`/admin/umkm/${umkm.id}/edit`}
                                    className="flex items-center bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700 transition"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </Link>
                                <Link
                                    href={`/admin/umkm/${umkm.id}/products`}
                                    className="flex items-center bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition"
                                >
                                    Kelola Produk
                                </Link>
                                <button
                                    onClick={() => onDelete(umkm.id)}
                                    className="flex items-center bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}