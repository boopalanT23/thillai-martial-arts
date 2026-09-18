/* ─────────────────────────────────────────────────────────
   gallery.js – Static gallery catalogue (replace src with
   real uploaded images, or fetch from /api/gallery in prod)
   ───────────────────────────────────────────────────────── */

export const GALLERY_CATEGORIES = [
  { key: 'all',           label: 'All Media' },
  { key: 'competitions',  label: 'Competitions' },
  { key: 'training',      label: 'Training Sessions' },
  { key: 'championships', label: 'Championships' },
  { key: 'events',        label: 'Events' },
  { key: 'yoga',          label: 'Yoga Sessions' },
  { key: 'fitness',       label: 'Fitness Sessions' },
  { key: 'celebrations',  label: 'Celebrations' },
]

export const GALLERY_ITEMS = []

export const getGalleryByCategory = (category) =>
  category === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.category === category)


