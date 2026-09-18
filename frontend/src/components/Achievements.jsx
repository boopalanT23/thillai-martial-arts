import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupsIcon from '@mui/icons-material/Groups'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'

const STATS = [
  { icon: EmojiEventsIcon,      value: 50,   suffix: '+',  label: 'National Medals',       sub: 'Award winning students' },
  { icon: GroupsIcon,           value: 5000, suffix: '+',  label: 'Students Mentored',     sub: '20+ years journey' },
  { icon: FitnessCenterIcon,    value: 9,    suffix: '',   label: 'Training Disciplines',  sub: 'All under one roof' },
  { icon: WorkspacePremiumIcon, value: 20,   suffix: '+',  label: 'Years of Excellence',   sub: 'Established in 2004' },
]

export default function Achievements() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section className="py-16 md:py-20 bg-white border-b border-[#DBE2EF]">
      <div className="container-pad">
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-tma p-7 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-[#DBE2EF] rounded-lg flex items-center justify-center text-[#3F72AF]">
                  <Icon sx={{ fontSize: 24 }} />
                </div>
                <div className="font-display text-4xl sm:text-5xl font-extrabold text-[#112D4E] mb-1 tracking-tight leading-none">
                  {inView ? <CountUp end={stat.value} duration={2.5} separator="," /> : '0'}
                  <span className="text-[#3F72AF]">{stat.suffix}</span>
                </div>
                <p className="font-sans text-xs font-bold text-[#112D4E] tracking-wider uppercase mb-1 mt-2">{stat.label}</p>
                <p className="font-sans text-xs text-[#112D4E]/60">{stat.sub}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
