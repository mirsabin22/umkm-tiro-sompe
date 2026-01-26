export interface UMKM {
    id: string
    name: string
    description: string | null
    category: string | null
    phone: string
    whatsapp: string
    address: string
    latitude: number | null
    longitude: number | null
    image_url: string | null
    opening_hours: string | null
    status: 'ACTIVE' | 'INACTIVE'
    created_at: string
    updated_at: string
}

export interface Product {
    id: string
    umkm_id: string
    name: string
    description: string | null
    price: number
    image_url: string | null
    status: 'AVAILABLE' | 'UNAVAILABLE'
    created_at: string
    updated_at: string
}

export interface UMKMWithProducts extends UMKM {
    products: Product[]
}

export interface OrderData {
    umkm: UMKM
    products: Array<{
        product: Product
        quantity: number
    }>
    deliveryAddress: string
}