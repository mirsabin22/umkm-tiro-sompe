export interface Coordinates {
    latitude: number
    longitude: number
}

export function parseGoogleMapsLink(url: string): Coordinates | null {
    try {
        // Pattern 1: https://maps.google.com/?q=-4.0098,119.6231
        const pattern1 = /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/
        const match1 = url.match(pattern1)
        if (match1) {
            return {
                latitude: parseFloat(match1[1]),
                longitude: parseFloat(match1[2])
            }
        }

        // Pattern 2: https://www.google.com/maps/place/@-4.0098,119.6231,17z
        const pattern2 = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/
        const match2 = url.match(pattern2)
        if (match2) {
            return {
                latitude: parseFloat(match2[1]),
                longitude: parseFloat(match2[2])
            }
        }

        // Pattern 3: https://maps.app.goo.gl/... (shortened links)
        // Pattern 4: https://goo.gl/maps/... (old shortened links)

        return null
    } catch (error) {
        console.error('Error parsing maps link:', error)
        return null
    }
}

export function isValidGoogleMapsLink(url: string): boolean {
    const patterns = [
        /maps\.google\.com/,
        /google\.com\/maps/,
        /maps\.app\.goo\.gl/,
        /goo\.gl\/maps/
    ]

    return patterns.some(pattern => pattern.test(url))
}