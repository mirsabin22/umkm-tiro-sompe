import { createClient } from '@/lib/supabase/client'

export async function uploadImage(file: File, folder: 'umkm' | 'products'): Promise<string | null> {
    const supabase = createClient()

    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from('umkm-images')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) {
        console.error('Upload error:', error)
        return null
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('umkm-images')
        .getPublicUrl(fileName)

    return urlData.publicUrl
}

export function validateImageFile(file: File): string | null {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
        return 'Format file harus JPG, PNG, atau WebP'
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
        return 'Ukuran file maksimal 5MB'
    }

    return null
}