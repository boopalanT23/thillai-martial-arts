import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import VerifiedIcon from '@mui/icons-material/Verified'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { trainerAPI } from '../services/api.js'
import { getImageUrl } from '../pages/Gallery.jsx'

const DEFAULT_TRAINERS = [
  {
    id: 1,
    name: 'Master R. HariHaran',
    role: 'Founder & Head Coach',
    image: '/images/founder.jpeg',
    fallbackImage: '/images/founder.jpeg',
    badge: 'Dan 4 Black Belt',
    badgeIcon: '🥋',
    accentColor: '#3F72AF',
    experience: '20+ Years Legacy',
    highlightStats: [
      { label: 'Dan Rank', val: 'Dan 4' },
      { label: 'Students', val: '5,000+' },
      { label: 'Medals', val: '50+' },
    ],
    bio: 'Founder and guiding mentor of Thillai Martial Arts Club. Devoted over two decades to shaping disciplined champions with physical mastery, mental calm, and tournament excellence.',
    specialties: [
      { icon: '🥋', text: 'Taekwondo (Dan 4)' },
      { icon: '🧘', text: 'Yoga & Meditation' },
      { icon: '💪', text: 'Strength & Conditioning' },
      { icon: '🗣️', text: 'Hindi Instruction' },
    ],
    whatsappMsg: 'Hello Master HariHaran, I would like to enquire about training batches and admissions at Thillai Martial Arts Club.',
    buttonText: 'TALK TO COACH',
    isMaster: true,
  },
  {
    id: 2,
    name: 'H. Thillai Nayagi',
    role: 'Senior Coach & National Referee',
    image: '/images/coach.jpeg',
    fallbackImage: '/images/coach.jpeg',
    badge: 'National Referee',
    badgeIcon: '🏆',
    accentColor: '#E63946',
    experience: '5+ Years Coaching',
    highlightStats: [
      { label: 'Referee', val: 'National' },
      { label: 'Experience', val: '5+ Yrs' },
      { label: 'Focus', val: 'Taekwondo & Defense' },
    ],
    bio: 'Certified National Referee and senior tournament coach. Dedicated to empowering women and children through athletic Taekwondo, practical self-defense, and championship conditioning.',
    specialties: [
      { icon: '🥋', text: 'Precision Taekwondo' },
      { icon: '🛡️', text: 'Practical Self-Defense' },
      { icon: '👦', text: 'Kids Martial Arts' },
      { icon: '🥇', text: 'Tournament Preparation' },
    ],
    whatsappMsg: 'Hello Coach Thillai Nayagi, I would like to enquire about boxing and self-defense training at Thillai Martial Arts Club.',
    buttonText: 'TALK TO COACH',
    isMaster: true,
  },
  {
    id: 7,
    name: 'Mrs. Shanthi Hariharan',
    role: 'Legal Advisor, Thillai Martial Arts Club',
    image: '/images/advisor.jpeg',
    fallbackImage: '/images/advisor.jpeg',
    badge: 'Supporting Hand',
    badgeIcon: '🤝',
    accentColor: '#D4AF37',
    experience: '10+ Years Experience',
    highlightStats: [
      { label: 'Experience', val: '10+ Yrs' },
      { label: 'Role', val: 'Supporting Hand' },
      { label: 'Domain', val: 'Legal & Ethics' },
    ],
    bioLines: [
      'Senior advocate offering steadfast legal counsel and governance to Thillai Martial Arts Club.',
      'Devoted over a decade of legal practice ensuring complete institutional integrity and athlete safety.',
      'Serves as a trusted supporting hand and protective mentor for all academy students and coaches.',
      'Upholds ethical compliance, organizational welfare, and constitutional sports standards.',
      'Passionate about fostering a secure, disciplined environment where future champions thrive.',
    ],
    qualifications: ['B.Com LLB', 'Senior Advocate - District Court, Chidambaram'],
    whatsappMsg: 'Hello Mrs. Shanthi Hariharan, I would like to consult with you regarding Thillai Martial Arts Club.',
    buttonText: 'TALK TO ADVISOR',
    isMaster: false,
  },
]

function getPermanentFallback(name = '', role = '') {
  const n = name.toLowerCase()
  const r = role.toLowerCase()
  if (n.includes('shanthi') || r.includes('legal') || r.includes('advocate')) {
    return '/images/advisor.jpeg'
  }
  if (n.includes('thillai') || n.includes('nayagi')) {
    return '/images/coach.jpeg'
  }
  return '/images/founder.jpeg'
}

function findDefaultMaster(apiT) {
  if (!apiT) return null
  if (apiT.id === 1) return DEFAULT_TRAINERS[0]
  if (apiT.id === 2) return DEFAULT_TRAINERS[1]
  if (apiT.id === 7) return DEFAULT_TRAINERS[2]

  const cleanName = (apiT.name || '').trim().toLowerCase()
  const cleanRole = (apiT.designation || '').trim().toLowerCase()

  if (cleanName.includes('shanthi') || cleanRole.includes('legal') || cleanRole.includes('advocate')) {
    return DEFAULT_TRAINERS[2]
  }
  if (cleanName.includes('thillai') || cleanName.includes('nayagi')) {
    return DEFAULT_TRAINERS[1]
  }
  if (cleanName.includes('hariharan') || cleanName.includes('founder')) {
    return DEFAULT_TRAINERS[0]
  }
  return null
}

function formatTrainer(apiT, defaultMaster) {
  if (defaultMaster) {
    return {
      ...defaultMaster,
      id: apiT.id,
      name: apiT.name || defaultMaster.name,
      role: apiT.designation || defaultMaster.role,
      image: apiT.imageUrl ? getImageUrl(apiT.imageUrl) : defaultMaster.image,
      fallbackImage: defaultMaster.fallbackImage || defaultMaster.image,
      qualifications: (Array.isArray(apiT.qualifications) && apiT.qualifications.length > 0)
        ? apiT.qualifications
        : (defaultMaster.qualifications || []),
      isMaster: defaultMaster.isMaster,
    }
  }

  const quals = Array.isArray(apiT.qualifications) ? apiT.qualifications : []
  const roleLower = (apiT.designation || '').toLowerCase()
  const nameLower = (apiT.name || '').toLowerCase()
  const fallback = getPermanentFallback(apiT.name, apiT.designation)
  const photo = apiT.imageUrl ? getImageUrl(apiT.imageUrl) : fallback
  const isLegal = roleLower.includes('legal') || roleLower.includes('advocate') || nameLower.includes('shanthi')

  if (isLegal) {
    return {
      id: apiT.id,
      name: apiT.name,
      role: apiT.designation || 'Legal Advisor',
      image: photo,
      fallbackImage: '/images/advisor.jpeg',
      qualifications: quals.length > 0 ? quals : ['B.Com LLB', 'Senior Advocate - District Court, Chidambaram'],
      isMaster: false,
      badge: 'Supporting Hand',
      badgeIcon: '🤝',
      accentColor: '#D4AF37',
      experience: '10+ Years Experience',
      highlightStats: [
        { label: 'Experience', val: '10+ Yrs' },
        { label: 'Role', val: 'Supporting Hand' },
        { label: 'Domain', val: 'Legal & Ethics' },
      ],
      bioLines: [
        'Senior advocate offering steadfast legal counsel and governance to Thillai Martial Arts Club.',
        'Devoted over a decade of legal practice ensuring complete institutional integrity and athlete safety.',
        'Serves as a trusted supporting hand and protective mentor for all academy students and coaches.',
        'Upholds ethical compliance, organizational welfare, and constitutional sports standards.',
        'Passionate about fostering a secure, disciplined environment where future champions thrive.',
      ],
      whatsappMsg: `Hello ${apiT.name}, I would like to consult with you regarding Thillai Martial Arts Club.`,
      buttonText: 'TALK TO ADVISOR',
    }
  }

  // General new trainer/instructor
  return {
    id: apiT.id,
    name: apiT.name,
    role: apiT.designation || 'Club Coach',
    image: photo,
    fallbackImage: fallback,
    qualifications: quals,
    isMaster: false,
    badge: 'Faculty Member',
    badgeIcon: '🥋',
    accentColor: '#3F72AF',
    experience: 'Certified Instructor',
    highlightStats: [
      { label: 'Role', val: (apiT.designation || 'Coach').split(' ')[0] },
      { label: 'Status', val: 'Certified' },
      { label: 'Academy', val: 'Faculty' },
    ],
    bioLines: [
      'Dedicated instructor at Thillai Martial Arts Club guiding students with discipline and athletic focus.',
      'Passionate about champion conditioning and physical excellence.',
    ],
    whatsappMsg: `Hello ${apiT.name}, I would like to enquire about training batches at Thillai Martial Arts Club.`,
    buttonText: 'TALK TO COACH',
  }
}

export default function Trainers() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 })
  const [trainersList, setTrainersList] = useState(DEFAULT_TRAINERS)

  useEffect(() => {
    trainerAPI.getAll()
      .then(res => {
        if (res.data && res.data.length > 0) {
          const formatted = res.data.map(apiT => {
            const defaultMaster = findDefaultMaster(apiT)
            return formatTrainer(apiT, defaultMaster)
          })
          setTrainersList(formatted)
        }
      })
      .catch(() => {
        // Fallback gracefully to DEFAULT_TRAINERS
      })
  }, [])

  const gridClass = trainersList.length === 1
    ? 'grid grid-cols-1 max-w-md mx-auto'
    : trainersList.length === 2
    ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'

  return (
    <section id="trainers-section" className="section-pad bg-[#F9F7F7] border-b border-[#DBE2EF] scroll-mt-20">
      <div className="container-pad">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#DBE2EF] text-[#112D4E] text-[11px] font-sans font-semibold tracking-[0.16em] uppercase mb-3 rounded-full shadow-2xs">
            <WorkspacePremiumIcon sx={{ fontSize: 14, color: '#3F72AF' }} />
            <span>CERTIFIED MASTERS &amp; REFEREES</span>
          </div>
          <h2 className="section-title-center mb-3">MEET OUR MASTER INSTRUCTORS</h2>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/75 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Train directly under certified national masters with decades of tournament and teaching experience in Olympic martial arts, self-defense, and fitness.
          </p>
        </div>

        {/* Master Showcase Grid */}
        <div ref={ref} className={gridClass}>
          {trainersList.map((trainer, i) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.16, ease: 'easeOut' }}
              className="group bg-white rounded-2xl border border-[#DBE2EF] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Accent Stripe */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#3F72AF] via-[#D4AF37] to-[#112D4E]" />

              {/* ── Portrait Showcase Window ── */}
              <div className="h-80 sm:h-96 w-full relative overflow-hidden bg-[#112D4E] flex items-center justify-center">
                {trainer.image ? (
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover object-[50%_15%] group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={e => {
                      e.target.onerror = null
                      e.target.src = trainer.fallbackImage || getPermanentFallback(trainer.name, trainer.role)
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#112D4E] via-[#1B3B6F] to-[#0D1F36]">
                    <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-display font-extrabold text-4xl text-amber-300 shadow-inner">
                      {trainer.name ? trainer.name[0]?.toUpperCase() : '🥋'}
                    </div>
                  </div>
                )}

                {/* Ambient vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#112D4E] via-[#112D4E]/40 to-transparent pointer-events-none" />



                {/* Floating Badge (Right): Experience */}
                {trainer.experience && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/60 text-[#112D4E] text-[11px] font-sans font-bold uppercase tracking-wider shadow-sm">
                    <VerifiedIcon sx={{ fontSize: 13, color: '#3F72AF' }} />
                    <span>{trainer.experience}</span>
                  </div>
                )}

                {/* Title Overlay at Bottom of Portrait */}
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 bg-gradient-to-t from-[#112D4E] via-[#112D4E]/90 to-transparent">
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl text-white uppercase tracking-tight mb-1 group-hover:text-amber-200 transition-colors">
                    {trainer.name}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
                    {trainer.role}
                  </p>
                </div>
              </div>

              {/* ── Content & Narrative Section ── */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 bg-white space-y-6">
                {/* 1. Highlight Credential Metrics */}
                {trainer.highlightStats && trainer.highlightStats.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 p-3.5 bg-[#F9F7F7] border border-[#DBE2EF] rounded-xl text-center">
                    {trainer.highlightStats.map((st, idx) => (
                      <div key={idx} className={idx !== 0 ? 'border-l border-[#DBE2EF]' : ''}>
                        <p className="font-display font-extrabold text-lg sm:text-xl text-[#112D4E] leading-tight">{st.val}</p>
                        <p className="font-sans text-[10px] text-[#112D4E]/65 uppercase tracking-wider font-semibold mt-0.5">{st.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Narrative Bio / Description */}
                {trainer.bioLines && trainer.bioLines.length > 0 ? (
                  <div className="font-sans text-xs sm:text-sm text-[#112D4E]/85 leading-relaxed italic pl-3.5 border-l-2 border-[#3F72AF] space-y-1">
                    {trainer.bioLines.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                ) : trainer.bio ? (
                  <p className="font-sans text-xs sm:text-sm text-[#112D4E]/80 leading-relaxed italic pl-3.5 border-l-2 border-[#3F72AF]">
                    "{trainer.bio}"
                  </p>
                ) : null}

                {/* 3. Original Specialties & Training Focus (For original masters) */}
                {trainer.specialties && trainer.specialties.length > 0 && (
                  <div>
                    <p className="font-sans text-[11px] font-bold text-[#112D4E] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <EmojiEventsIcon sx={{ fontSize: 15, color: '#3F72AF' }} />
                      <span>Specialties &amp; Training Focus</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trainer.specialties.map((s, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DBE2EF]/40 hover:bg-[#DBE2EF]/70 border border-[#DBE2EF] text-[#112D4E] text-xs font-sans font-semibold transition-colors shadow-2xs"
                        >
                          <span className="text-sm">{s.icon}</span>
                          <span>{s.text}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Qualifications & Credentials (For Legal Advisor / New Trainers) */}
                {trainer.qualifications && trainer.qualifications.length > 0 && (
                  <div>
                    <p className="font-sans text-[11px] font-bold text-[#112D4E] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <WorkspacePremiumIcon sx={{ fontSize: 15, color: '#3F72AF' }} />
                      <span>Qualifications &amp; Credentials</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trainer.qualifications.map((q, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#DBE2EF]/40 hover:bg-[#DBE2EF]/70 border border-[#DBE2EF] text-[#112D4E] text-xs font-sans font-semibold transition-colors shadow-2xs"
                        >
                          <span className="text-sm">
                            {q.toLowerCase().includes('advocate') || q.toLowerCase().includes('court') || q.toLowerCase().includes('law')
                              ? '⚖️'
                              : q.toLowerCase().includes('llb') || q.toLowerCase().includes('degree') || q.toLowerCase().includes('b.com')
                              ? '🎓'
                              : '🏅'}
                          </span>
                          <span>{q}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Footer */}
                <div className="pt-4 border-t border-[#DBE2EF] flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={`https://wa.me/918072089377?text=${encodeURIComponent(trainer.whatsappMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center !py-2.5 text-xs font-sans font-semibold tracking-wider group"
                  >
                    <span>{trainer.buttonText || 'TALK TO COACH'}</span>
                    <WhatsAppIcon sx={{ fontSize: 16 }} className="ml-1 text-emerald-300" />
                  </a>
                  <Link
                    to="/training"
                    className="btn-secondary w-full justify-center !py-2.5 text-xs font-sans font-semibold tracking-wider hover:bg-[#F9F7F7]"
                  >
                    <span>VIEW BATCHES</span>
                    <ArrowForwardIcon sx={{ fontSize: 14 }} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
