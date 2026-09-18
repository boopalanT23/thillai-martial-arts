import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import Hero           from '../components/Hero.jsx'
import Trainers       from '../components/Trainers.jsx'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import GroupsIcon from '@mui/icons-material/Groups'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import SecurityIcon from '@mui/icons-material/Security'
import PsychologyIcon from '@mui/icons-material/Psychology'
import SchoolIcon from '@mui/icons-material/School'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { COURSES, getAllCoursesMerged } from '../data/courses.js'
import { BATCHES } from '../data/batches.js'
import { courseAPI, galleryAPI } from '../services/api.js'
import { getCategoryLabel } from './Training.jsx'
import { getImageUrl, isVideoItem, MediaThumbnail } from './Gallery.jsx'

/* ── Section 2: Trust / Credibility Strip ───────────────────── */
function CredibilityStrip() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const ITEMS = [
    { icon: WorkspacePremiumIcon, title: '20+ YEARS EXPERIENCE', sub: 'Established in 2004' },
    { icon: GroupsIcon,           title: '5,000+ STUDENTS',     sub: 'Trained with discipline' },
    { icon: EmojiEventsIcon,      title: '50+ NATIONAL MEDALS', sub: 'Championship record' },
    { icon: FitnessCenterIcon,    title: '9 TRAINING PROGRAMS', sub: 'All under one roof' },
    { icon: SecurityIcon,         title: 'GOVT. RECOGNISED',    sub: 'Affiliated academy' },
  ]
  return (
    <section id="credibility-strip" className="py-12 bg-white border-b border-[#DBE2EF]">
      <div className="container-pad">
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {ITEMS.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3.5 p-3 rounded-lg hover:bg-[#F9F7F7] transition-colors"
              >
                <div className="w-11 h-11 rounded bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] flex-shrink-0">
                  <Icon sx={{ fontSize: 22 }} />
                </div>
                <div>
                  <p className="font-display font-bold text-base text-[#112D4E] tracking-tight uppercase leading-tight">{item.title}</p>
                  <p className="font-sans text-xs text-[#112D4E]/70 mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Section 3: About / Mission ──────────────────────────────── */
function MissionSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  return (
    <section id="about-thillai-mac" className="section-pad bg-[#F9F7F7] border-b border-[#DBE2EF] scroll-mt-20">
      <div className="container-pad">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="section-eyebrow">About Thillai MAC</p>
            <h2 className="section-title mb-4">DEDICATED TO DEVELOPING STRENGTH, DISCIPLINE &amp; CHARACTER</h2>
            <div className="gold-divider-left" />
            <p className="font-sans text-[#112D4E]/80 text-base leading-relaxed mb-5">
              Founded in 2004 by Master R. HariHaran, <strong>THILLAI MARTIAL ARTS CLUB</strong> is Chidambaram's premier training academy. We spend quality, dedicated time with every student — building discipline, confidence, emotional balance, leadership, and lifelong physical fitness.
            </p>
            <p className="font-sans text-[#112D4E]/80 text-base leading-relaxed mb-8">
              We believe martial arts is far more than physical combat: it is a proven path to developing an unstoppable spirit and lifelong self-mastery.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/mission" className="btn-secondary">
                MORE ABOUT OUR STORY <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="grid grid-cols-1 gap-4"
          >
            {[
              { icon: '🎯', title: 'Our Mission',    text: 'To develop strong, disciplined, confident, and healthy individuals through world-class martial arts instruction.' },
              { icon: '🏆', title: 'Our Goal',       text: 'To produce state and national medalists while empowering every student to achieve excellence in life.' },
              { icon: '☯️', title: 'Our Philosophy', text: 'Martial arts is about self-control, respect, perseverance, humility, and lifelong personal development.' },
            ].map((item, i) => (
              <div
                key={item.title}
                className="card-tma p-6 flex gap-4 items-start"
              >
                <span className="text-3xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <h4 className="font-display font-bold text-xl text-[#112D4E] uppercase tracking-tight mb-1.5">{item.title}</h4>
                  <p className="font-sans text-xs sm:text-sm text-[#112D4E]/80 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── Section 4: Training Programs ────────────────────────────── */
function TrainingProgramsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
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
      .catch(err => {
        console.error('Could not fetch courses in home:', err)
        refresh()
      })

    const handleUpdate = () => refresh()
    window.addEventListener('tma:courses-updated', handleUpdate)
    return () => window.removeEventListener('tma:courses-updated', handleUpdate)
  }, [])

  return (
    <section className="section-pad bg-white border-b border-[#DBE2EF]">
      <div className="container-pad">
        <div className="text-center mb-14">
          <p className="section-eyebrow">Comprehensive Academy</p>
          <h2 className="section-title-center mb-3">OUR TRAINING PROGRAMS</h2>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            From traditional martial arts to wellness, music, mental sports and languages — 9 disciplines under certified guidance.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesList.map((course, i) => (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                to={`/training/${course.slug}`}
                className="course-card group block h-full flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="h-44 w-full bg-[#DBE2EF] overflow-hidden relative border-b border-[#DBE2EF]">
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
                    <div className="hidden w-full h-full items-center justify-center text-4xl bg-[#DBE2EF]">
                      {course.icon}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-0.5 rounded text-[11px] font-sans font-semibold text-[#112D4E] uppercase border border-[#DBE2EF]">
                      {course.icon} {getCategoryLabel(course)}
                    </div>
                  </div>

                  {/* Body: Course Titles in Barlow Condensed 700 24px–28px */}
                  <div className="p-6">
                    <h3 className="font-display font-bold text-2xl text-[#112D4E] uppercase tracking-tight group-hover:text-[#3F72AF] transition-colors mb-1">
                      {course.name}
                    </h3>
                    <p className="font-sans text-xs text-[#3F72AF] font-semibold uppercase tracking-wider mb-3">
                      {course.tagline}
                    </p>
                    <p className="font-sans text-xs sm:text-sm text-[#112D4E]/70 leading-relaxed line-clamp-2">
                      {Array.isArray(course.benefits) && course.benefits.length > 0
                        ? `${course.benefits[0]}${course.benefits[1] ? ` • ${course.benefits[1]}` : ''}`
                        : (course.tagline || course.overview || '')}
                    </p>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="px-6 py-3.5 border-t border-[#DBE2EF] bg-[#F9F7F7] flex items-center justify-between">
                  <span className="font-display text-base sm:text-lg font-bold text-[#112D4E]">₹{course.feePerMonth ?? 300}/mo</span>
                  <span className="flex items-center gap-1 font-sans text-xs uppercase font-semibold text-[#3F72AF] group-hover:translate-x-0.5 transition-transform">
                    Learn More <ArrowForwardIcon sx={{ fontSize: 13 }} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/training" className="btn-secondary">
            VIEW ALL 9 DISCIPLINES <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Section 5: Why Choose Thillai MAC ───────────────────────── */
function WhyChooseSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  const BENEFITS = [
    { icon: WorkspacePremiumIcon, title: 'Experienced Masters',    text: 'Learn directly from Dan 4 certified coaches with 20+ years of proven national experience.' },
    { icon: SecurityIcon,         title: 'Disciplined Environment',text: 'A safe, structured, and respectful atmosphere fostering focus, courage, and lifelong values.' },
    { icon: FitnessCenterIcon,    title: 'Fitness & Strength',     text: 'Custom conditioning drills that enhance cardiovascular health, stamina, agility, and power.' },
    { icon: PsychologyIcon,       title: 'Mental Development',    text: 'Cultivate sharp mental focus, emotional calmness, stress control, and leadership qualities.' },
    { icon: SchoolIcon,           title: 'Multiple Programs',      text: 'Train in martial arts, music, chess, and languages all under one convenient, professional roof.' },
    { icon: EmojiEventsIcon,      title: 'Championship Track',     text: 'Proven pathway to district, state, and national tournaments with official certification.' },
  ]
  return (
    <section className="section-pad bg-[#F9F7F7] border-b border-[#DBE2EF]">
      <div className="container-pad">
        <div className="text-center mb-14">
          <p className="section-eyebrow">The Thillai Advantage</p>
          <h2 className="section-title-center mb-3">WHY CHOOSE THILLAI MARTIAL ARTS CLUB</h2>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            We provide a world-class training foundation that transforms beginners into disciplined, confident achievers.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-tma p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] mb-5">
                    <Icon sx={{ fontSize: 24 }} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#112D4E] uppercase tracking-tight mb-2.5">{b.title}</h3>
                  <p className="font-sans text-xs sm:text-sm text-[#112D4E]/80 leading-relaxed">{b.text}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Section 6: Training Schedule ────────────────────────────── */
function ScheduleSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  return (
    <section className="section-pad bg-white border-b border-[#DBE2EF]">
      <div className="container-pad">
        <div className="text-center mb-14">
          <p className="section-eyebrow">Flexible Batches</p>
          <h2 className="section-title-center mb-3">TRAINING SCHEDULE &amp; BATCHES</h2>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Regular training runs 6:30 PM – 9:00 PM. Weekend Chess &amp; English Grammar batches are scheduled Morning or Evening based on school presence. Sunday holiday for all except English Grammar &amp; Chess.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BATCHES.map((batch, i) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-tma p-6 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded bg-[#DBE2EF] flex items-center justify-center text-2xl mb-4">
                  {batch.icon}
                </div>
                <h3 className="font-display font-extrabold text-lg text-[#112D4E] uppercase tracking-tight mb-1.5">{batch.name}</h3>
                <p className="font-sans text-xs text-[#112D4E]/70 leading-relaxed mb-4">{batch.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {batch.courses.map(c => (
                    <span key={c} className="badge-tma font-sans text-[11px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#DBE2EF]">
                <div className="flex items-start justify-between text-xs font-sans gap-1">
                  <span className="flex items-center gap-1.5 text-[#112D4E]/70 font-medium">
                    <CalendarTodayIcon sx={{ fontSize: 13, color: '#3F72AF' }} /> Days
                  </span>
                  <span className="font-sans font-semibold text-xs text-[#112D4E] uppercase text-right">{batch.days}</span>
                </div>
                <div className="flex items-start justify-between text-xs font-sans gap-1">
                  <span className="flex items-center gap-1.5 text-[#112D4E]/70 font-medium">
                    <AccessTimeIcon sx={{ fontSize: 13, color: '#3F72AF' }} /> Time
                  </span>
                  <span className="font-display font-bold text-[#3F72AF] text-xs text-right">{batch.time}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-sans pt-1">
                  <span className="text-[#112D4E]/70 font-medium text-[11px]">Sunday</span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    batch.id === 4
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>
                    {batch.holiday}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Notice banner */}
        <div className="mt-8 max-w-3xl mx-auto p-4 bg-[#F9F7F7] rounded-xl border border-[#DBE2EF] flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="text-2xl flex-shrink-0">⏰</span>
          <div className="text-xs font-sans text-[#112D4E]/80 space-y-0.5">
            <p className="font-bold text-[#112D4E]">
              Schedule &amp; Timings Policy
            </p>
            <p>
              Regular weekday batches run <strong>6:30 PM – 9:00 PM</strong>.
              Weekend batches (<strong>Chess &amp; English Grammar</strong>) have <strong>Morning or Evening</strong> timings arranged according to school presence.
              <strong> Sunday is a holiday for all programs</strong> except English Grammar &amp; Chess.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/register" className="btn-primary">
            ENROLL IN A BATCH <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Section 7: Gallery Preview ──────────────────────────────── */
function GalleryPreviewSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  const [previewItems, setPreviewItems] = useState([])

  useEffect(() => {
    galleryAPI.getAll()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content || []
        const uploaded = data.map(item => ({
          ...item,
          src: item.imageUrl || item.url || item.src,
          isUploaded: true,
        }))
        setPreviewItems(uploaded.slice(0, 6))
      })
      .catch(() => {})
  }, [])

  if (previewItems.length === 0) return null

  return (
    <section className="section-pad bg-[#F9F7F7] border-b border-[#DBE2EF]">
      <div className="container-pad">
        <div className="text-center mb-14">
          <p className="section-eyebrow">Moments of Excellence</p>
          <h2 className="section-title-center mb-3">ACADEMY IN ACTION</h2>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Tournaments, black belt belt-gradings, intense training drills, and celebration milestones.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {previewItems.map((item, i) => {
            const isVid = isVideoItem(item)
            const imgSrc = getImageUrl(item.imageUrl || item.url || item.src)
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="relative aspect-square rounded-lg border border-[#DBE2EF] bg-white overflow-hidden group shadow-xs cursor-pointer"
              >
                <Link to="/gallery" className="block w-full h-full">
                  <MediaThumbnail item={item} isVideo={isVid} />
                  {isVid && (
                    <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-red-600 to-red-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm border border-white/20">
                      VIDEO
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[#112D4E]/0 group-hover:bg-[#112D4E]/50 transition-colors duration-200 flex flex-col justify-between p-2.5">
                    <div className="flex justify-center items-center h-full">
                      {isVid && (
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-[#112D4E] flex items-center justify-center shadow-md">
                          <PlayArrowIcon sx={{ fontSize: 20, color: '#112D4E', marginLeft: '2px' }} />
                        </div>
                      )}
                    </div>
                    <p className="font-display text-xs text-white uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 truncate">
                      {item.title}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/gallery" className="btn-secondary">
            VIEW FULL GALLERY <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Section 8: Founder Section ──────────────────────────────── */
function FounderSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })
  return (
    <section className="section-pad bg-white border-b border-[#DBE2EF]">
      <div className="container-pad max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="card-tma p-8 sm:p-12 shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Founder portrait */}
            <div className="flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-xl border-2 border-[#3F72AF] bg-[#DBE2EF] overflow-hidden mb-4 shadow-sm">
                <img
                  src="/images/founder.jpeg"
                  alt="Founder Master R. HariHaran"
                  className="w-full h-full object-cover object-[50%_20%]"
                  onError={e => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center font-display font-black text-4xl text-[#112D4E]">
                  RH
                </div>
              </div>
              <p className="font-display font-bold text-lg text-[#112D4E] uppercase tracking-tight">Master R. HariHaran</p>
              <p className="font-sans text-xs text-[#3F72AF] font-bold uppercase tracking-wider">Founder · Dan 4 Black Belt</p>
            </div>

            {/* Quote content */}
            <div className="md:col-span-2">
              <p className="section-eyebrow mb-3">Founder's Message</p>
              <blockquote className="font-sans text-[#112D4E]/80 text-sm sm:text-base leading-relaxed mb-6 space-y-3">
                <p className="font-bold text-[#112D4E]">"Success begins with discipline."</p>
                <p>
                  Every champion was once a beginner who refused to quit. Real strength comes not from physical force alone, but from consistency, courage, and moral character.
                </p>
                <p className="text-[#3F72AF] font-semibold">
                  At Thillai Martial Arts Club, we train students not only to win championship medals, but to win in life.
                </p>
              </blockquote>
              <div className="pt-2 flex flex-col items-end text-right">
                <img
                  src="/images/founder-signature.png"
                  alt="Master HariHaran Signature"
                  className="h-11 w-auto object-contain opacity-95 mb-1"
                  onError={e => e.target.style.display = 'none'}
                />
                <cite className="font-sans text-xs uppercase tracking-wider text-[#112D4E] font-bold not-italic">
                  — Master R. HariHaran, Founder &amp; Head Coach
                </cite>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Section 9: Location & Quick Contact ─────────────────────── */
function LocationSection() {
  return (
    <section className="section-pad bg-[#F9F7F7] border-b border-[#DBE2EF]">
      <div className="container-pad">
        <div className="text-center mb-14">
          <p className="section-eyebrow">Visit Our Dojo</p>
          <h2 className="section-title-center mb-3">LOCATION &amp; CONTACT</h2>
          <div className="gold-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="card-tma p-6 text-center">
            <div className="w-11 h-11 rounded bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] mx-auto mb-4">
              <LocationOnIcon sx={{ fontSize: 22 }} />
            </div>
            <h4 className="font-display font-bold text-lg uppercase text-[#112D4E] tracking-tight mb-2">Our Academy</h4>
            <p className="font-sans text-xs sm:text-sm text-[#112D4E]/80 leading-relaxed mb-4">
              2nd Floor, Top of National Supermarket, Sivapuri Main Road, Annamalai Nagar, Chidambaram - 608001
            </p>
            <Link to="/location" className="font-sans text-xs text-[#3F72AF] uppercase font-bold hover:underline">
              View on Map →
            </Link>
          </div>

          <div className="card-tma p-6 text-center">
            <div className="w-11 h-11 rounded bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] mx-auto mb-4">
              <PhoneIcon sx={{ fontSize: 22 }} />
            </div>
            <h4 className="font-display font-bold text-lg uppercase text-[#112D4E] tracking-tight mb-2">Direct Phone</h4>
            <p className="font-sans text-xs sm:text-sm text-[#112D4E]/80 leading-relaxed mb-4">
              Speak with Master HariHaran or senior instructors.
            </p>
            <a href="tel:+918072089377" className="font-display text-lg font-bold text-[#3F72AF] hover:underline block">
              +91 80720 89377
            </a>
          </div>

          <div className="card-tma p-6 text-center">
            <div className="w-11 h-11 rounded bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] mx-auto mb-4">
              <EmailIcon sx={{ fontSize: 22 }} />
            </div>
            <h4 className="font-display font-bold text-lg uppercase text-[#112D4E] tracking-tight mb-2">Online Enquiry</h4>
            <p className="font-sans text-xs sm:text-sm text-[#112D4E]/80 leading-relaxed mb-4">
              Send us questions regarding admissions, batches, or fees.
            </p>
            <Link to="/contact" className="font-sans text-xs text-[#3F72AF] uppercase font-bold hover:underline">
              Contact Form →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Section 10: Strong Final CTA ────────────────────────────── */
function FinalCTABanner() {
  return (
    <section className="py-20 bg-[#112D4E] text-[#F9F7F7] relative overflow-hidden text-center">
      <div className="container-pad relative z-10">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-[#DBE2EF] mb-3 font-semibold">
          Admissions Open for All Age Groups
        </p>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-4 leading-tight">
          READY TO BEGIN YOUR JOURNEY?<br />
          <span className="text-[#3F72AF]">TRAIN WITH DISCIPLINE. LIVE WITH CONFIDENCE.</span>
        </h2>
        <p className="font-sans text-[#DBE2EF] text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Join thousands of students who have built strength, character, and championship medals at Thillai Martial Arts Club.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/register"
            className="btn-primary !py-4 !px-8 text-xs sm:text-sm font-sans font-bold tracking-wider whitespace-nowrap min-w-[170px] justify-center"
          >
            REGISTER NOW
          </Link>
          <a
            href="tel:+918072089377"
            className="btn-secondary !bg-transparent !border-[#DBE2EF] !text-[#F9F7F7] hover:!bg-[#DBE2EF] hover:!text-[#112D4E] !py-4 !px-8 text-xs sm:text-sm font-sans font-semibold tracking-wider"
          >
            CALL 8072089377
          </a>
        </div>
      </div>
    </section>
  )
}

/* ── Main Home Page ──────────────────────────────────────────── */
export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />
      <CredibilityStrip />
      <MissionSection />
      <TrainingProgramsSection />
      <WhyChooseSection />
      <ScheduleSection />
      <Trainers />
      <GalleryPreviewSection />
      <FounderSection />
      <LocationSection />
      <FinalCTABanner />
    </motion.div>
  )
}
