import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import PhoneIcon from '@mui/icons-material/Phone'
import { COURSES, getCourseBySlugMerged } from '../data/courses.js'
import { getBatchForCourse, getBatchById } from '../data/batches.js'
import { courseAPI } from '../services/api.js'
import { getCategoryLabel } from './Training.jsx'

export default function CourseDetail() {
  const params = useParams()
  const activeSlug = params.slug || params.courseSlug
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeSlug) {
      setLoading(false)
      return
    }
    const loaded = getCourseBySlugMerged(activeSlug)
    courseAPI.getOne(activeSlug)
      .then(res => {
        if (res.data) {
          const apiData = res.data
          const parsedBenefits = typeof apiData.benefits === 'string'
            ? apiData.benefits.split('\n').filter(Boolean)
            : (apiData.benefits || loaded?.benefits || [])

          let parsedCurriculum = loaded?.curriculum
          if (typeof apiData.curriculum === 'string') {
            try {
              parsedCurriculum = JSON.parse(apiData.curriculum)
            } catch {
              parsedCurriculum = apiData.curriculum.split('\n').filter(Boolean).map((line, idx) => ({
                stage: `Stage ${idx + 1}`,
                focus: line,
              }))
            }
          } else if (Array.isArray(apiData.curriculum)) {
            parsedCurriculum = apiData.curriculum
          }

          setCourse({
            ...loaded,
            ...apiData,
            benefits: parsedBenefits,
            curriculum: parsedCurriculum,
            feePerMonth: apiData.feePerMonth ?? loaded?.feePerMonth,
          })
        } else {
          setCourse(loaded)
        }
      })
      .catch(() => {
        setCourse(loaded)
      })
      .finally(() => setLoading(false))
  }, [activeSlug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#DBE2EF] border-t-[#3F72AF] rounded-full animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-[#F9F7F7]">
        <h2 className="font-display text-3xl font-extrabold text-[#112D4E] mb-2 uppercase tracking-tight">COURSE NOT FOUND</h2>
        <p className="font-sans text-xs text-[#112D4E]/70 mb-6">The requested training program does not exist.</p>
        <Link to="/training" className="btn-primary font-sans font-semibold text-xs tracking-wider">BACK TO ALL COURSES</Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Course Banner */}
      <div className="py-16 md:py-20 bg-white border-b border-[#DBE2EF]">
        <div className="container-pad">
          <div className="flex items-center gap-2 text-xs font-sans text-[#112D4E]/60 mb-4">
            <Link to="/" className="hover:text-[#3F72AF]">Home</Link>
            <span>/</span>
            <Link to="/training" className="hover:text-[#3F72AF]">Training</Link>
            <span>/</span>
            <span className="text-[#112D4E] font-semibold">{course.name}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="section-eyebrow mb-2">
                {course.icon} {getCategoryLabel(course)}
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#112D4E] uppercase tracking-tight">
                {course.name}
              </h1>
              <p className="font-sans text-[#3F72AF] text-sm font-semibold uppercase tracking-wider mt-1">
                {course.tagline}
              </p>
            </div>

            <div className="bg-[#F9F7F7] border border-[#DBE2EF] px-5 py-3 rounded-lg text-right">
              <span className="font-sans text-xs text-[#112D4E]/60 block font-medium">Monthly Fee</span>
              <span className="font-display font-bold text-2xl text-[#112D4E]">₹{course.feePerMonth ?? 300}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="section-pad bg-[#F9F7F7]">
        <div className="container-pad">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Image banner */}
              <div className="h-64 sm:h-96 w-full rounded-xl overflow-hidden border border-[#DBE2EF] bg-[#DBE2EF] shadow-sm">
                <img
                  src={course.imageUrl || `/images/courses/${course.slug}.jpg`}
                  alt={course.name}
                  className="w-full h-full object-cover"
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
                <div className="hidden w-full h-full items-center justify-center text-7xl bg-[#DBE2EF]">
                  {course.icon}
                </div>
              </div>

              {/* Overview */}
              <div className="card-tma p-8">
                <h3 className="font-display font-bold text-2xl text-[#112D4E] uppercase tracking-tight mb-4 pb-2 border-b border-[#DBE2EF]">
                  Program Overview
                </h3>
                <p className="font-sans text-sm sm:text-base text-[#112D4E]/80 leading-relaxed">
                  {course.overview}
                </p>
              </div>

              {/* Benefits */}
              <div className="card-tma p-8">
                <h3 className="font-display font-bold text-2xl text-[#112D4E] uppercase tracking-tight mb-5 pb-2 border-b border-[#DBE2EF]">
                  Key Training Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(course.benefits || []).map((b, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded bg-[#F9F7F7] border border-[#DBE2EF]">
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#3F72AF', flexShrink: 0, marginTop: '2px' }} />
                      <span className="font-sans text-xs sm:text-sm text-[#112D4E]/85 font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Belt / Progression or Details */}
              {course.curriculum && (
                <div className="card-tma p-8">
                  <h3 className="font-display font-bold text-2xl text-[#112D4E] uppercase tracking-tight mb-5 pb-2 border-b border-[#DBE2EF]">
                    Curriculum &amp; Progression
                  </h3>
                  <div className="space-y-3">
                    {course.curriculum.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded bg-[#F9F7F7] border border-[#DBE2EF] text-xs font-sans">
                        <span className="font-display font-bold text-[#112D4E] uppercase text-sm tracking-wide">{c.stage}</span>
                        <span className="text-[#112D4E]/70 font-medium">{c.focus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sticky Sidebar (4 cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">

                {/* Admission card */}
                <div className="card-tma p-6 sm:p-8 shadow-md">
                  <div className="text-center pb-6 border-b border-[#DBE2EF]">
                    <span className="text-xs font-sans text-[#112D4E]/60 uppercase font-semibold">Monthly Training Fee</span>
                    <p className="font-display font-black text-3xl sm:text-4xl text-[#112D4E] mt-1">₹{course.feePerMonth ?? 300}<span className="text-sm font-sans font-normal text-[#112D4E]/60"> /month</span></p>
                  </div>

                  <div className="space-y-4 py-6 text-xs font-sans text-[#112D4E]/80 border-b border-[#DBE2EF]">
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex items-center gap-2 text-[#112D4E]/60 font-medium">
                        <span>{getBatchForCourse(course.slug)?.icon || '🥋'}</span> Batch Type
                      </span>
                      <strong className="text-[#112D4E] font-sans uppercase text-xs text-right max-w-[55%]">
                        {getBatchForCourse(course.slug)?.name || getBatchById(course.batchId)?.name || 'Regular Batch'}
                      </strong>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex items-center gap-2 text-[#112D4E]/60 font-medium">
                        <CalendarTodayIcon sx={{ fontSize: 15, color: '#3F72AF' }} /> Batch Days
                      </span>
                      <strong className="text-[#112D4E] font-sans uppercase text-xs text-right max-w-[55%]">
                        {course.schedule?.days || 'Weekly'}
                      </strong>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex items-center gap-2 text-[#112D4E]/60 font-medium">
                        <AccessTimeIcon sx={{ fontSize: 15, color: '#3F72AF' }} /> Timings
                      </span>
                      <strong className="text-[#3F72AF] font-display text-xs sm:text-sm font-bold tracking-wide text-right max-w-[60%]">
                        {course.schedule?.time || '6:30 PM – 9:00 PM'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-[#112D4E]/60 font-medium">
                        <span>🗓️</span> Sunday Status
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        course.slug === 'chess' || course.slug === 'english-grammar'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {course.slug === 'chess' || course.slug === 'english-grammar' ? 'Classes Active' : 'Holiday'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[#112D4E]/60 font-medium">
                        <WorkspacePremiumIcon sx={{ fontSize: 15, color: '#3F72AF' }} /> Certificate
                      </span>
                      <strong className="text-[#112D4E] font-sans uppercase text-xs">Official Academy Certificate</strong>
                    </div>
                  </div>

                  {/* Schedule Note */}
                  <div className="my-4 p-3 bg-[#DBE2EF]/40 rounded-lg border border-[#DBE2EF] text-xs font-sans space-y-1">
                    {course.slug === 'chess' || course.slug === 'english-grammar' ? (
                      <>
                        <p className="font-semibold text-[#112D4E] flex items-center gap-1.5 text-[11px]">
                          <span>⏰</span> Timings: Morning / Evening (According to school presence)
                        </p>
                        <p className="text-[10px] text-[#112D4E]/70 leading-relaxed">
                          Held on Saturday &amp; Sunday. Morning or evening timing is scheduled according to school presence. Sunday classes are active (no holiday).
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-[#112D4E] flex items-center gap-1.5 text-[11px]">
                          <span>⏰</span> Regular Evening Batch: 6:30 PM – 9:00 PM
                        </p>
                        <p className="text-[10px] text-[#112D4E]/70 leading-relaxed">
                          Sunday is a weekly holiday for this program (Sunday holiday for all except English Grammar &amp; Chess).
                        </p>
                      </>
                    )}
                  </div>

                  <div className="pt-6 space-y-3">
                    <Link
                      to={`/register?course=${course.slug}`}
                      className="btn-primary w-full justify-center !py-3.5 text-xs font-sans font-semibold tracking-wider shadow-sm"
                    >
                      REGISTER FOR THIS PROGRAM
                    </Link>
                    <a
                      href="tel:+918072089377"
                      className="btn-secondary w-full justify-center !py-3 text-xs font-sans font-semibold tracking-wider"
                    >
                      <PhoneIcon sx={{ fontSize: 15, color: '#3F72AF' }} /> CALL TO INQUIRE
                    </a>
                  </div>
                </div>

                {/* Trainer summary */}
                <div className="card-tma p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#DBE2EF] flex items-center justify-center font-display font-black text-lg text-[#112D4E] flex-shrink-0">
                    RH
                  </div>
                  <div>
                    <p className="font-display font-bold text-base text-[#112D4E] uppercase tracking-tight">Master R. HariHaran</p>
                    <p className="font-sans text-xs text-[#3F72AF] font-semibold">Chief Master · Dan 4 Black Belt</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </motion.div>
  )
}
