import { OrderData } from '@/types'

export function generateWhatsAppMessage(orderData: OrderData): string {
    const { umkm, products, deliveryAddress } = orderData

    let message = 'Halo Kak,\n\nSaya ingin memesan:\n\n'
    message += `UMKM: ${umkm.name}\n`

    products.forEach(item => {
        message += `Produk: ${item.product.name} (${item.quantity} porsi)\n`
    })

    message += `\nAlamat Pengantaran: ${deliveryAddress}\n\n`

    if (umkm.latitude && umkm.longitude) {
        message += `Lokasi UMKM:\n`
        message += `https://maps.google.com/?q=${umkm.latitude},${umkm.longitude}\n\n`
    }

    message += 'Terima kasih.'

    return encodeURIComponent(message)
}

export function openWhatsApp(phone: string, message: string) {
    const cleanPhone = phone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`
    window.open(whatsappUrl, '_blank')
}