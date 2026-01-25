'use client'

import { UMKM } from '@/types'
import { MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface UMKMCardProps {
    umkm: UMKM
}

export default function UMKMCard({ umkm }: UMKMCardProps) {
    return (
        <Link href={`/umkm/${umkm.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                    {umkm.image_url ? (
                        <Image
                            src={umkm.image_url}
                            alt={umkm.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <span className="text-4xl">🏪</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{umkm.name}</h3>

                    {umkm.category && (
                        <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded mb-2">
                            {umkm.category}
                        </span>
                    )}

                    {umkm.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {umkm.description}
                        </p>
                    )}

                    <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{umkm.address}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm">
                        <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>{umkm.phone}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}