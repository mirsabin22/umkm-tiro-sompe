import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://umkm-go-tirosompe.vercel.app/'

    const supabase = await createClient()

    // Get all active UMKMs
    const { data: umkms } = await supabase
        .from('umkm')
        .select('id, updated_at')
        .eq('status', 'ACTIVE')

    const umkmPages = umkms?.map((umkm) => ({
        url: `${baseUrl}/umkm/${umkm.id}`,
        lastModified: new Date(umkm.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    })) || []

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...umkmPages,
    ]
}