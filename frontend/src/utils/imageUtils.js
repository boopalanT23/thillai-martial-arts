/**
 * Centralized utility for resolving backend URLs, student photos, and media assets.
 * Seamlessly supports:
 * - Build-time environment variable (import.meta.env.VITE_API_URL)
 * - Production on Vercel connecting to Render (https://thillai-martial-arts.onrender.com)
 * - Local development on localhost (http://localhost:8080)
 */

export const BACKEND_URL = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
   window.location.hostname !== 'localhost' &&
   window.location.hostname !== '127.0.0.1'
    ? 'https://thillai-martial-arts.onrender.com'
    : 'http://localhost:8080')
).replace(/\/$/, '')

/**
 * Returns the fully-qualified URL for a student's photo.
 * If the photo path is relative (e.g. /uploads/photos/xyz.jpg), prepends the live backend origin.
 */
export function getFullPhotoUrl(photo) {
  if (!photo || typeof photo !== 'string') return null
  const trimmed = photo.trim()
  if (!trimmed) return null
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed
  }
  const clean = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${BACKEND_URL}${clean}`
}

/**
 * Returns the fully-qualified URL for any uploaded or static media asset.
 */
export function getImageUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed
  }
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const clean = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
    return `${BACKEND_URL}${clean}`
  }
  if (trimmed.startsWith('/')) return trimmed
  return `${BACKEND_URL}/${trimmed}`
}
