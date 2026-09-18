import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import SearchIcon from '@mui/icons-material/Search'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import VideocamIcon from '@mui/icons-material/Videocam'
import CloseIcon from '@mui/icons-material/Close'
import { galleryAPI } from '../services/api.js'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

export function getImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const clean = url.startsWith('/') ? url : `/${url}`
    return `${API_BASE}${clean}`
  }
  if (url.startsWith('/')) return url
  return `${API_BASE}/${url}`
}

export function isVideoItem(item) {
  if (!item) return false
  if (item.mediaType && String(item.mediaType).toUpperCase() === 'VIDEO') return true
  const rawUrl = item.videoUrl || item.imageUrl || item.url || item.src || ''
  if (typeof rawUrl !== 'string') return false
  const lower = rawUrl.toLowerCase()
  return (
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('vimeo.com') ||
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.ogg') ||
    lower.endsWith('.mkv')
  )
}

export function getVideoEmbedInfo(url) {
  if (!url) return null
  const cleanUrl = url.trim()

  // YouTube
  const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/)
  if (ytMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
    }
  }

  // Vimeo
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/)
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`,
      thumbnailUrl: '',
    }
  }

  // Direct video file
  return {
    type: 'video',
    videoUrl: getImageUrl(cleanUrl),
  }
}

function VideoModal({ video, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!video) return null
  const targetUrl = video.videoUrl || video.imageUrl || video.url || video.src
  const embedInfo = getVideoEmbedInfo(targetUrl)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#112D4E] rounded-xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0c223c]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white">
              <VideocamIcon sx={{ fontSize: 13 }} /> Video
            </span>
            <span className="text-white/40 text-xs">|</span>
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              {video.category || 'Martial Arts'}
            </span>
            <h3 className="font-display text-white text-sm font-bold uppercase tracking-wide truncate ml-2">
              {video.title || 'Video Highlight'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-3"
            aria-label="Close modal"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Player Container */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {embedInfo?.type === 'youtube' || embedInfo?.type === 'vimeo' ? (
            <iframe
              src={embedInfo.embedUrl}
              title={video.title || 'Martial Arts Video'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : embedInfo?.type === 'video' ? (
            <video
              src={embedInfo.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            >
              Your browser does not support HTML5 video.
            </video>
          ) : (
            <div className="text-white/60 text-sm">Unable to load video playback.</div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export function MediaThumbnail({ item, isVideo }) {
  const [imgError, setImgError] = useState(false)
  const [videoFrameReady, setVideoFrameReady] = useState(false)
  const rawUrl = item.imageUrl || item.url || item.src || ''

  const isVideoFile = typeof rawUrl === 'string' && (
    rawUrl.endsWith('.mp4') || rawUrl.endsWith('.webm') || rawUrl.endsWith('.mov') || rawUrl.endsWith('.ogg')
  )

  // If item has an image or thumbnail (or extracted frame jpg), use it directly
  let targetImageUrl = null
  if (!imgError && rawUrl) {
    if (!isVideoFile) {
      targetImageUrl = getImageUrl(rawUrl)
    } else {
      // In case imageUrl ends in .mp4, check matching .jpg frame thumbnail
      targetImageUrl = getImageUrl(rawUrl.replace(/\.mp4$/i, '.jpg'))
    }
  }

  // 1. Valid static image (user uploaded photo or extracted video frame)
  if (targetImageUrl) {
    return (
      <img
        src={targetImageUrl}
        alt={item.title || 'Gallery media'}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => setImgError(true)}
      />
    )
  }

  // 2. Direct HTML5 video fallback (renders native frame directly from uploaded video file)
  const directVideoUrl = item.videoUrl || (isVideoFile ? rawUrl : null)
  if (directVideoUrl) {
    const videoSrc = getImageUrl(directVideoUrl)
    return (
      <div className="w-full h-full relative bg-[#0c223c] overflow-hidden flex items-center justify-center">
        <video
          src={videoSrc}
          preload="auto"
          muted
          playsInline
          onLoadedData={(e) => {
            try {
              e.target.currentTime = 0.5
              setVideoFrameReady(true)
            } catch {}
          }}
          onSeeked={() => setVideoFrameReady(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 pointer-events-none ${
            videoFrameReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!videoFrameReady && (
          <div className="text-center p-3">
            <span className="text-amber-400/90 font-display text-xs uppercase font-bold tracking-wider block">
              {item.title || 'Martial Arts Video'}
            </span>
          </div>
        )}
      </div>
    )
  }

  // 3. Fallback: Clean dojo dark card with title (NO stock images of other people)
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0c223c] flex items-center justify-center p-4 text-center">
      <p className="font-display font-bold text-xs uppercase tracking-wider text-amber-400/90 drop-shadow-sm">
        {item.title || 'Media item'}
      </p>
    </div>
  )
}

function GalleryTile({ item, onOpenPhoto, onOpenVideo }) {
  const isVideo = isVideoItem(item)

  const handleClick = () => {
    if (isVideo) {
      onOpenVideo(item)
    } else {
      onOpenPhoto(item)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      onClick={handleClick}
      className="relative aspect-square bg-slate-900 border border-[#DBE2EF] rounded-lg overflow-hidden cursor-pointer group hover:border-[#3F72AF] shadow-xs hover:shadow-lg transition-all duration-200"
    >
      <MediaThumbnail item={item} isVideo={isVideo} />

      {/* Category Pill Tag */}
      {item.category && (
        <div className="absolute top-2.5 left-2.5 z-10 bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-sans font-semibold uppercase tracking-wider shadow-sm">
          {item.category}
        </div>
      )}

      {/* Video Indicator Badge */}
      {isVideo && (
        <div className="absolute top-2.5 right-2.5 z-10 bg-gradient-to-r from-red-600 to-red-700 text-white px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1 shadow-md border border-white/20">
          <VideocamIcon sx={{ fontSize: 13 }} /> VIDEO
        </div>
      )}

      {/* Hover Overlay & Center Play Button for Videos */}
      <div className={`absolute inset-0 transition-colors duration-200 flex items-center justify-center ${
        isVideo ? 'bg-black/20 group-hover:bg-black/45' : 'bg-[#112D4E]/0 group-hover:bg-[#112D4E]/40'
      }`}>
        {isVideo ? (
          <div className="relative flex items-center justify-center">
            <div className="w-13 h-13 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#112D4E] flex items-center justify-center shadow-xl group-hover:scale-115 transition-transform duration-200 border-2 border-white/90">
              <PlayArrowIcon sx={{ fontSize: 32, color: '#112D4E', marginLeft: '3px' }} />
            </div>
          </div>
        ) : (
          <ZoomInIcon
            sx={{ fontSize: 32, color: '#F9F7F7', opacity: 0 }}
            className="group-hover:!opacity-100 transition-opacity duration-200"
          />
        )}
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <p className="font-display text-xs sm:text-sm text-white uppercase font-bold tracking-wider truncate drop-shadow-sm">
          {item.title || (isVideo ? 'Martial Arts Video' : 'Gallery Image')}
        </p>
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all') // 'all' | 'photo' | 'video'
  const [search, setSearch] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [activeVideo, setActiveVideo] = useState(null)
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchGallery = () => {
      setLoading(true)
      galleryAPI.getAll()
        .then(res => {
          if (!mounted) return
          const data = Array.isArray(res.data) ? res.data : res.data?.content || []
          const uploaded = data.map(item => ({
            ...item,
            src: item.imageUrl || item.url || item.src,
            isUploaded: true,
          }))
          // ONLY what the user uploaded from their device is presented!
          setGalleryItems(uploaded)
        })
        .catch(err => {
          console.warn('Gallery load error:', err?.message)
          if (mounted) setGalleryItems([])
        })
        .finally(() => {
          if (mounted) setLoading(false)
        })
    }

    fetchGallery()

    const handleUpdate = () => fetchGallery()
    window.addEventListener('tma:gallery-updated', handleUpdate)
    return () => {
      mounted = false
      window.removeEventListener('tma:gallery-updated', handleUpdate)
    }
  }, [])

  const filteredItems = useMemo(() => {
    let list = galleryItems

    // 1. Media Type Filter
    if (mediaTypeFilter === 'photo') {
      list = list.filter(item => !isVideoItem(item))
    } else if (mediaTypeFilter === 'video') {
      list = list.filter(item => isVideoItem(item))
    }

    // 2. Category Filter
    if (activeCategory !== 'all') {
      list = list.filter(item => String(item.category || '').toLowerCase() === activeCategory.toLowerCase())
    }

    // 3. Search Query
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(item => String(item.title || '').toLowerCase().includes(q))
    }

    return list
  }, [galleryItems, mediaTypeFilter, activeCategory, search])

  // Dynamic categories strictly derived from user-uploaded items
  const availableCategories = useMemo(() => {
    const map = new Map()
    galleryItems.forEach(item => {
      const cat = String(item.category || '').trim().toLowerCase()
      if (cat && !map.has(cat)) {
        const label = cat.charAt(0).toUpperCase() + cat.slice(1)
        map.set(cat, label)
      }
    })

    const list = [{ key: 'all', label: 'All Media' }]
    for (const [key, label] of map.entries()) {
      list.push({ key, label })
    }
    return list
  }, [galleryItems])

  // Photos for Lightbox
  const photoItems = useMemo(() => {
    return filteredItems.filter(item => !isVideoItem(item))
  }, [filteredItems])

  const photoSlides = useMemo(() => {
    return photoItems.map(item => ({
      src: getImageUrl(item.imageUrl || item.url || item.src),
      title: item.title || 'Gallery Image',
    }))
  }, [photoItems])

  const handleOpenPhoto = (item) => {
    const idx = photoItems.findIndex(p => p.id === item.id)
    if (idx >= 0) {
      setLightboxIndex(idx)
    }
  }

  const handleOpenVideo = (item) => {
    setActiveVideo(item)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

      {/* Banner */}
      <div className="py-20 md:py-24 bg-white border-b border-[#DBE2EF] text-center">
        <div className="container-pad max-w-3xl mx-auto">
          <p className="section-eyebrow">Moments Captured</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#112D4E] mb-3 uppercase tracking-tight">
            MEDIA GALLERY
          </h1>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/80 text-sm sm:text-base leading-relaxed">
            Tournaments, belt gradings, championships, daily training drills, celebration highlights, and action videos.
          </p>
        </div>
      </div>

      <section className="section-pad bg-[#F9F7F7]">
        <div className="container-pad">

          {/* Controls: Media type tabs + Search */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
            {/* Media type toggle */}
            <div className="inline-flex bg-white p-1 rounded-lg border border-[#DBE2EF] shadow-2xs w-fit">
              <button
                type="button"
                onClick={() => { setMediaTypeFilter('all'); setLightboxIndex(-1) }}
                className={`px-3.5 py-1.5 rounded-md font-sans text-xs uppercase tracking-wider font-semibold transition-all ${
                  mediaTypeFilter === 'all'
                    ? 'bg-[#112D4E] text-white shadow-xs'
                    : 'text-[#112D4E]/70 hover:text-[#112D4E] hover:bg-black/5'
                }`}
              >
                All Media
              </button>
              <button
                type="button"
                onClick={() => { setMediaTypeFilter('photo'); setLightboxIndex(-1) }}
                className={`px-3.5 py-1.5 rounded-md font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 ${
                  mediaTypeFilter === 'photo'
                    ? 'bg-[#112D4E] text-white shadow-xs'
                    : 'text-[#112D4E]/70 hover:text-[#112D4E] hover:bg-black/5'
                }`}
              >
                <span>📷</span> Photos
              </button>
              <button
                type="button"
                onClick={() => { setMediaTypeFilter('video'); setLightboxIndex(-1) }}
                className={`px-3.5 py-1.5 rounded-md font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 ${
                  mediaTypeFilter === 'video'
                    ? 'bg-[#112D4E] text-white shadow-xs'
                    : 'text-[#112D4E]/70 hover:text-[#112D4E] hover:bg-black/5'
                }`}
              >
                <span>📹</span> Videos
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72 flex-shrink-0">
              <SearchIcon sx={{ fontSize: 18, color: '#3F72AF' }} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search gallery..."
                className="input-tma pl-10 font-sans"
              />
            </div>
          </div>

          {/* Category Pills (Dynamically derived from real uploaded media) */}
          {availableCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {availableCategories.map(cat => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => { setActiveCategory(cat.key); setLightboxIndex(-1) }}
                  className={`px-4 py-2 rounded font-sans text-xs uppercase tracking-wider border transition-all duration-150 ${
                    activeCategory === cat.key
                      ? 'bg-[#3F72AF] text-white border-[#3F72AF] font-semibold shadow-xs'
                      : 'bg-white text-[#112D4E] border-[#DBE2EF] hover:border-[#3F72AF] hover:text-[#3F72AF] font-medium'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          <p className="font-sans text-xs text-[#112D4E]/60 mb-6 font-medium">
            Showing <strong className="text-[#3F72AF] font-bold">{filteredItems.length}</strong> item{filteredItems.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div className="text-center py-20 card-tma">
              <p className="font-sans text-sm text-[#112D4E]/60">Loading uploaded media...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <GalleryTile
                    key={item.id}
                    item={item}
                    onOpenPhoto={handleOpenPhoto}
                    onOpenVideo={handleOpenVideo}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20 card-tma">
              <p className="text-4xl mb-3">{mediaTypeFilter === 'video' ? '📹' : '📷'}</p>
              <p className="font-display font-bold text-xl text-[#112D4E] uppercase tracking-tight">
                No {mediaTypeFilter === 'video' ? 'Videos' : mediaTypeFilter === 'photo' ? 'Photos' : 'Media'} Found
              </p>
              <p className="font-sans text-xs text-[#112D4E]/60 mt-1">
                Upload photos or videos via the Admin Panel to display them here.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* Lightbox for photos */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={photoSlides}
      />

      {/* Video Modal for videos */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>

    </motion.div>
  )
}