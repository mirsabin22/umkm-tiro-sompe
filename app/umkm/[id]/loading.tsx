export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <header className="bg-emerald-600 shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="h-6 w-24 bg-emerald-500 rounded animate-pulse"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* UMKM Info Skeleton */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 animate-pulse">
                    <div className="h-64 bg-gray-300"></div>
                    <div className="p-6 space-y-4">
                        <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-20 bg-gray-300 rounded"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>

                {/* Products Skeleton */}
                <div className="mb-8">
                    <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                                <div className="h-40 bg-gray-300"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}