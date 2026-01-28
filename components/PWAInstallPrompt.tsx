'use client'

import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'
import Image from 'next/image'

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [showPrompt, setShowPrompt] = useState(false)

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return
        }

        // Check if user already dismissed
        const dismissed = localStorage.getItem('pwa-prompt-dismissed')
        if (dismissed) {
            return
        }

        // Listen for beforeinstallprompt event
        const handler = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)

            // Show prompt after 3 seconds
            setTimeout(() => {
                setShowPrompt(true)
            }, 3000)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
        }
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) {
            return
        }

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt')
        }

        setDeferredPrompt(null)
        setShowPrompt(false)
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        localStorage.setItem('pwa-prompt-dismissed', 'true')
    }

    if (!showPrompt) {
        return null
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-2xl border-2 border-emerald-500 z-50 animate-slide-up">
            <div className="p-4">
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-3 mb-4">
                    <Image
                        src="/logo.png"
                        alt="UMKM-GO"
                        width={60}
                        height={60}
                        className="flex-shrink-0"
                    />
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg mb-1">
                            Install UMKM-GO
                        </h3>
                        <p className="text-sm text-gray-600">
                            Install aplikasi untuk akses lebih cepat dan mudah!
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleInstall}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                >
                    <Download className="w-5 h-5" />
                    Install Sekarang
                </button>
            </div>
        </div>
    )
}