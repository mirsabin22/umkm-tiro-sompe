export interface Coordinates {
    latitude: number
    longitude: number
}

export async function parseGoogleMapsLink(url: string): Promise<Coordinates | null> {
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

        // Pattern 3: https://www.google.com/maps?q=-4.0098,119.6231
        const pattern3 = /maps\?q=(-?\d+\.?\d*),(-?\d+\.?\d*)/
        const match3 = url.match(pattern3)
        if (match3) {
            return {
                latitude: parseFloat(match3[1]),
                longitude: parseFloat(match3[2])
            }
        }

        if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
            try {
                // Fetch the URL to follow redirects
                const response = await fetch(url, {
                    method: 'HEAD',
                    redirect: 'follow'
                })
                const finalUrl = response.url

                // Try parsing the final URL with previous patterns
                return parseGoogleMapsLink(finalUrl)
            } catch (error) {
                console.error('Error following shortened link:', error)
                return null
            }
        }

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

// Helper function for client-side that doesn't use fetch
export function parseGoogleMapsLinkSync(url: string): Coordinates | null {
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

        // Pattern 3: https://www.google.com/maps?q=-4.0098,119.6231
        const pattern3 = /maps\?q=(-?\d+\.?\d*),(-?\d+\.?\d*)/
        const match3 = url.match(pattern3)
        if (match3) {
            return {
                latitude: parseFloat(match3[1]),
                longitude: parseFloat(match3[2])
            }
        }

        return null
    } catch (error) {
        console.error('Error parsing maps link:', error)
        return null
    }
}