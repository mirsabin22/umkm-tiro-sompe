'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Authenticate with Supabase
        const supabase = createClient()
        const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .eq('password_hash', password) // Note: In production, use proper password hashing
            .single()

        if (error || !data) {
            toast.error('Email atau password salah!')
            setLoading(false)
            return
        }

        // Set session
        localStorage.setItem('admin_session', 'true')
        localStorage.setItem('admin_email', data.email)
        localStorage.setItem('admin_name', data.name)

        toast.success('Login berhasil!')
        router.push('/admin/dashboard')

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
                    <p className="text-gray-600 mt-2">UMKM TiroSompe</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Admin"
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 text-base font-medium bg-white placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Memproses...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                        ← Kembali ke Beranda
                    </a>
                </div>
            </div>
        </div>
    )
}