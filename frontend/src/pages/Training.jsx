import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { COURSES, getAllCoursesMerged } from '../data/courses.js'
import { BATCHES, getBatchForCourse, getBatchById } from '../data/batches.js'
import { courseAPI } from '../services/api.js'

const CATEGORIES = [
  { key: 'all',      label: 'All Disciplines' },
  { key: 'martial',  label: 'Martial Arts' },
  { key: 'wellness', label: 'Health & Yoga' },
  { key: 'creative', label: 'Creative & Mind' },
]

export const getCategoryLabel = (course) => {
  const slug = (course.slug || '').toLowerCase()
  const cat = (course.category || '').toLowerCase()

  if (['taekwondo', 'boxing', 'silambam'].includes(slug) || cat.includes('martial')) {
    return 'Martial Arts'
  }
  if (['yoga', 'fitness'].includes(slug) || cat.includes('wellness') || cat.includes('health')) {
    return 'Health & Yoga'
  }
  if (
    ['chess', 'guitar', 'hindi', 'english-grammar'].includes(slug) ||
    ['skill', 'language', 'creative', 'mind'].includes(cat)
  ) {
    return 'Creative & Mind'
  }
  return course.category ? course.category.replace('-', ' ') : 'Program'
}

export const matchesCategory = (course, catKey) => {
  if (!catKey || catKey === 'all') return true

  const slug = (course.slug || '').toLowerCase()
  const cat = (course.category || '').toLowerCase()

  // Martial Arts: Taekwondo, Boxing, Silambam + any martial discipline
  if (catKey === 'martial' || catKey === 'martial-arts') {
    return (
      ['taekwondo', 'boxing', 'silambam'].includes(slug) ||
      cat.includes('martial')
    )
  }

  // Health & Yoga: Yoga, Fitness + wellness
  if (catKey === 'wellness' || catKey === 'health') {
    return (
      ['yoga', 'fitness'].includes(slug) ||
      cat.includes('wellness') ||
      cat.includes('health')
    )
  }

  // Creative & Mind: Chess, Guitar, Hindi, English Grammar + skill / language / creative
  if (
    catKey === 'creative' ||
    catKey === 'skill' ||
    catKey === 'language'
  ) {
    return (
      ['chess', 'guitar', 'hindi', 'english-grammar'].includes(slug) ||
      ['skill', 'language', 'creative', 'mind'].includes(cat)
    )
  }

  return cat === catKey.toLowerCase()
}

export default function Training() {
  const [searchParams] = useSearchParams()
  const initialCat = searchParams.get('cat') || searchParams.get('category') || 'all'
  const [activeCat, setActiveCat] = useState(initialCat)
  const [coursesList, setCoursesList] = useState(() => getAllCoursesMerged())

  useEffect(() => {
    const refresh = (apiData) => {
      setCoursesList(getAllCoursesMerged(apiData || []))
    }

    courseAPI.getAll()
      .then(res => {
        if (res.data && res.data.length > 0) {
          refresh(res.data)
        } else {
          refresh()
        }
      })
      .catch(() => refresh())

    const handleUpdate = () => refresh()
    window.addEventListener('tma:courses-updated', handleUpdate)
    return () => window.removeEventListener('tma:courses-updated', handleUpdate)
  }, [])

  const filtered = coursesList.filter(c => matchesCategory(c, activeCat))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Banner */}
      <div className="py-20 md:py-24 bg-white border-b border-[#DBE2EF] text-center">
        <div className="container-pad max-w-3xl mx-auto">
          <p className="section-eyebrow">Olympic &amp; Academic Programs</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#112D4E] mb-3 uppercase tracking-tight">
            TRAINING DISCIPLINES
          </h1>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/80 text-sm sm:text-base leading-relaxed">
            Choose from our 9 specialized disciplines taught by certified master instructors for all age categories.
          </p>
        </div>
      </div>

      <section className="section-pad bg-[#F9F7F7]">
        <div className="container-pad">

          {/* Category Filter Pills: Inter font */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                type="button"
                onClick={() => setActiveCat(c.key)}
                className={`px-4 py-2 rounded font-sans text-xs uppercase tracking-wider transition-all duration-150 border
                  ${activeCat === c.key
                    ? 'bg-[#3F72AF] text-white border-[#3F72AF] shadow-sm font-semibold'
                    : 'bg-white text-[#112D4E] border-[#DBE2EF] hover:border-[#3F72AF] hover:text-[#3F72AF] font-medium'}`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Course Grid with smooth filter animation */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map(course => (
                <motion.div
                  layout
                  key={course.slug}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="course-card flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="h-52 w-full bg-[#DBE2EF] overflow-hidden relative border-b border-[#DBE2EF] group">
                      <img
                        src={course.imageUrl || `/images/courses/${course.slug}.jpg`}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => {
                          const currentSrc = e.target.src
                          if (currentSrc.endsWith('.jpg')) {
                            e.target.src = `/images/courses/${course.slug}.webp`
                          } else if (currentSrc.endsWith('.webp')) {
                            e.target.src = `/images/courses/${course.slug}.jpeg`
                          } else if (currentSrc.endsWith('.jpeg')) {
                            e.target.src = `/images/courses/${course.slug}.png`
                          } else {
                            e.target.style.display = 'none'
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                          }
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center text-5xl bg-[#DBE2EF]">
                        {course.icon}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded text-[11px] font-sans font-semibold text-[#112D4E] uppercase border border-[#DBE2EF] shadow-2xs">
                        {getCategoryLabel(course)}
                      </div>
                    </div>

                    {/* Body: Barlow Condensed 700 for Course Titles */}
                    <div className="p-6">
                      <h3 className="font-display font-bold text-2xl text-[#112D4E] uppercase tracking-tight mb-1">
                        {course.name}
                      </h3>
                      <p className="font-sans text-xs text-[#3F72AF] font-bold uppercase tracking-wider mb-3">
                        {course.tagline}
                      </p>
                      <p className="font-sans text-xs sm:text-sm text-[#112D4E]/75 leading-relaxed line-clamp-2 mb-4">
                        {course.overview}
                      </p>

                      <div className="space-y-1.5 pt-3 border-t border-[#DBE2EF] text-xs font-sans text-[#112D4E]/80">
                        <div className="flex items-center justify-between">
                          <span className="text-[#112D4E]/60">Batch Type</span>
                          <span className="font-sans text-xs font-semibold text-[#112D4E]">
                            {(getBatchForCourse(course.slug) || getBatchById(course.batchId))?.name || 'Martial Arts Batch'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#112D4E]/60">Monthly Fee</span>
                          <span className="font-display font-bold text-base text-[#112D4E]">₹{course.feePerMonth ?? 300}/mo</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#112D4E]/60">Batch Days</span>
                          <span className="font-sans text-xs font-semibold text-[#112D4E] uppercase">{course.schedule?.days || 'Regular'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#112D4E]/60">Timings</span>
                          <span className="font-sans text-[11px] font-semibold text-[#3F72AF]">
                            {course.slug === 'chess' || course.slug === 'english-grammar' ? 'Morning / Evening' : '6:30 PM – 9:00 PM'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#112D4E]/60">Sunday</span>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            course.slug === 'chess' || course.slug === 'english-grammar'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}>
                            {course.slug === 'chess' || course.slug === 'english-grammar' ? 'Classes Active' : 'Holiday'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-6 pt-0">
                    <Link
                      to={`/training/${course.slug}`}
                      className="btn-primary w-full justify-center !py-2.5 text-xs font-sans font-semibold tracking-wider"
                    >
                      PROGRAM DETAILS <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Schedule section */}
          <div className="mt-20 pt-16 border-t border-[#DBE2EF]">
            <div className="text-center mb-10">
              <p className="section-eyebrow">Timings</p>
              <h2 className="section-title-center mb-3">BATCH SCHEDULES</h2>
              <div className="gold-divider" />
              <p className="font-sans text-[#112D4E]/70 max-w-2xl mx-auto text-sm mt-2">
                Regular weekday training at 6:30 PM – 9:00 PM. Weekend Chess &amp; English Grammar scheduled Morning or Evening based on school presence. Sunday holiday for all except English Grammar &amp; Chess.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {BATCHES.map(b => (
                <div key={b.id} className="card-tma p-6 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded bg-[#DBE2EF] flex items-center justify-center text-xl mb-3">
                      {b.icon}
                    </div>
                    <h4 className="font-display font-bold text-lg text-[#112D4E] uppercase tracking-tight mb-1">{b.name}</h4>
                    <p className="font-sans text-xs text-[#112D4E]/70 mb-4">{b.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {b.courses.map(c => (
                        <span key={c} className="badge-tma text-[10px] font-sans">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#DBE2EF] text-xs font-sans space-y-1.5">
                    <p className="flex justify-between items-start gap-1">
                      <span className="text-[#112D4E]/60">Days:</span>
                      <strong className="text-[#112D4E] text-right font-semibold">{b.days}</strong>
                    </p>
                    <p className="flex justify-between items-start gap-1">
                      <span className="text-[#112D4E]/60">Time:</span>
                      <strong className="text-[#3F72AF] font-display text-xs text-right font-bold">{b.time}</strong>
                    </p>
                    <p className="flex justify-between items-center gap-1">
                      <span className="text-[#112D4E]/60">Sunday:</span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        b.id === 4
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        {b.holiday}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Notice banner */}
            <div className="mt-8 max-w-3xl mx-auto p-4 bg-white rounded-xl border border-[#DBE2EF] shadow-sm flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <span className="text-2xl flex-shrink-0">📢</span>
              <div className="text-xs font-sans text-[#112D4E]/80 space-y-0.5">
                <p className="font-bold text-[#112D4E]">
                  Batch Timings &amp; Sunday Policy
                </p>
                <p>
                  Regular batches run <strong>6:30 PM – 9:00 PM</strong> on weekdays.
                  <strong> Chess &amp; English Grammar</strong> run on Saturday &amp; Sunday with flexible <strong>Morning or Evening</strong> timings according to school presence.
                  <strong> Sunday is a holiday for all programs</strong> except English Grammar &amp; Chess.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </motion.div>
  )
}
