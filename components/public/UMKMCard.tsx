'use client'

import { UMKM } from '@/types'
import { MapPin, Phone, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface UMKMCardProps {
    umkm: UMKM
}

export default function UMKMCard({ umkm }: UMKMCardProps) {
    return (
        <Link href={`/umkm/${umkm.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                {/* Image - Fixed Height */}
                <div className="relative w-full h-48 bg-gray-200 flex-shrink-0">
                    {umkm.image_url ? (
                        <Image
                            src={umkm.image_url}
                            alt={umkm.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <span className="text-4xl">🏪</span>
                        </div>
                    )}
                </div>

                {/* Content - Flex Grow */}
                <div className="p-4 flex-grow flex flex-col">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                            {umkm.name}
                        </h3>

                        {umkm.category && (
                            <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded mb-2">
                                {umkm.category}
                            </span>
                        )}

                        {umkm.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-3 min-h-[4.5rem]">
                                {umkm.description}
                            </p>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="space-y-2 mt-auto">
                        <div className="flex items-start text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{umkm.address}</span>
                        </div>

                        <div className="flex items-center text-gray-600 text-sm">
                            <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{umkm.phone}</span>
                        </div>
                        <div className="flex items-start text-gray-600 text-sm">
                            <Clock className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{umkm.opening_hours}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}