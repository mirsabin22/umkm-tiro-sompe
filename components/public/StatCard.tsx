import { ReactNode } from 'react'

type StatCardProps = {
    icon: ReactNode
    value: number
    label: string
    description: string
    color: 'emerald' | 'blue' | 'orange'
}

export default function StatCard({
    icon,
    value,
    label,
    description,
    color
}: StatCardProps) {
    const colors = {
        emerald: 'from-emerald-500 to-emerald-600',
        blue: 'from-blue-500 to-blue-600',
        orange: 'from-orange-500 to-orange-600'
    }

    return (
        <div className={`bg-gradient-to-br ${colors[color]} rounded-lg shadow-lg p-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
                {icon}
                <div className="text-right">
                    <p className="text-4xl font-bold">{value}</p>
                    <p className="text-sm opacity-90">{label}</p>
                </div>
            </div>
            <p className="text-sm opacity-90">{description}</p>
        </div>
    )
}
