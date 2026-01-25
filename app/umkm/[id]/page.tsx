import { createClient } from '@/lib/supabase/server'
import { UMKM, Product } from '@/types'
import { notFound } from 'next/navigation'
import UMKMDetail from '@/components/public/UMKNDetails'

export const dynamic = 'force-dynamic'

async function getUMKMWithProducts(id: string) {
    const supabase = await createClient()
    const { data: umkm, error: umkmError } = await supabase
        .from('umkm')
        .select('*')
        .eq('id', id)
        .single()

    if (umkmError || !umkm) {
        return null
    }

    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('umkm_id', id)
        .eq('status', 'AVAILABLE')
        .order('created_at', { ascending: false })

    return {
        umkm: umkm as UMKM,
        products: (products || []) as Product[]
    }
}

export default async function UMKMPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const data = await getUMKMWithProducts(id)
    if (!data) {
        notFound()
    }

    return <UMKMDetail umkm={data.umkm} products={data.products} />
}