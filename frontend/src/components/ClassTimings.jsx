import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { BATCHES } from '../data/batches.js'

export default function ClassTimings() {
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

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
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
                  <span className="flex items-center gap-1.5 text-[#112D4E]/60 font-medium">
                    <CalendarTodayIcon sx={{ fontSize: 13, color: '#3F72AF' }} /> Days
                  </span>
                  <span className="font-sans font-semibold text-xs text-[#112D4E] uppercase text-right">{batch.days}</span>
                </div>
                <div className="flex items-start justify-between text-xs font-sans gap-1">
                  <span className="flex items-center gap-1.5 text-[#112D4E]/60 font-medium">
                    <AccessTimeIcon sx={{ fontSize: 13, color: '#3F72AF' }} /> Time
                  </span>
                  <span className="font-display font-bold text-[#3F72AF] text-xs text-right">{batch.time}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-sans pt-1">
                  <span className="text-[#112D4E]/60 font-medium text-[11px]">Sunday</span>
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

        {/* Schedule highlight notice */}
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
            ENROLL IN A BATCH <ArrowForwardIcon sx={{ fontSize: 14 }} />
          </Link>
        </div>
      </div>
    </section>
  )
} 

