import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VerifiedIcon from '@mui/icons-material/Verified'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'

/* ── Interactive Martial Arts Animation Component (Right Side - Cardless & Balanced) ── */
function MartialHeroAnimation() {
  const [activeTab, setActiveTab] = useState(0)

  const DISCIPLINES = [
    {
      id: 'taekwondo',
      name: 'Olympic Taekwondo',
      short: 'Taekwondo',
      icon: '🥋',
      tag: 'Dynamic Kicks & Striking Power',
      stat: 'Dan 4 Black Belt',
      color: '#3F72AF',
      bgGlow: 'from-[#3F72AF]/25 via-[#112D4E]/10 to-transparent',
      quote: 'High-speed spinning kicks, agility, and world championship precision.',
    },
    {
      id: 'boxing',
      name: 'Precision Boxing',
      short: 'Boxing',
      icon: '🥊',
      tag: 'Speed & Striking Combos',
      stat: 'Reflex Combat',
      color: '#E63946',
      bgGlow: 'from-rose-500/25 via-[#112D4E]/10 to-transparent',
      quote: 'Lightning jabs, defensive evasions, and athletic cardiovascular endurance.',
    },
    {
      id: 'silambam',
      name: 'Ancient Silambam',
      short: 'Silambam',
      icon: '🥢',
      tag: 'Tamil Martial Heritage',
      stat: 'Staff Mastery',
      color: '#D4AF37',
      bgGlow: 'from-amber-500/25 via-[#112D4E]/10 to-transparent',
      quote: 'Traditional 360° rapid bamboo staff maneuvers and ancient footwork.',
    },
    {
      id: 'yoga',
      name: 'Yoga & Wellness',
      short: 'Yoga',
      icon: '🧘',
      tag: 'Mind & Body Equilibrium',
      stat: 'Flexibility & Focus',
      color: '#2A9D8F',
      bgGlow: 'from-teal-500/25 via-[#112D4E]/10 to-transparent',
      quote: 'Deep breath control, core alignment, mental stillness, and full-body vitality.',
    },
  ]

  // Auto-cycle between disciplines every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab(prev => (prev + 1) % DISCIPLINES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [DISCIPLINES.length])

  const current = DISCIPLINES[activeTab]

  return (
    <div className="relative w-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
      {/* Ambient Pulsing Aura Glow (No Card Container) */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr ${current.bgGlow} blur-3xl pointer-events-none -z-10`}
      />

      {/* ── Animated Central SVG Arena ── */}
      <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex items-center justify-center">
        {/* Rotating Arena Target Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-[#3F72AF]/35"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 sm:inset-5 rounded-full border border-dotted border-[#112D4E]/25"
        />
        <div className="absolute inset-6 sm:inset-9 rounded-full bg-gradient-to-b from-white/90 to-[#DBE2EF]/40 border border-[#DBE2EF]/80 backdrop-blur-2xs shadow-inner" />

        {/* Dynamic SVG Visual by Active Discipline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.84, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.84, rotate: 4 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-10 flex items-center justify-center w-full h-full"
          >
            {current.id === 'taekwondo' && (
              <svg viewBox="0 0 220 220" className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 drop-shadow-md select-none">
                {/* Shockwave Rings */}
                <motion.circle
                  cx="165" cy="64" r="12"
                  fill="none" stroke="#3F72AF" strokeWidth="2.5"
                  initial={{ r: 12, opacity: 0.9 }}
                  animate={{ r: [12, 38, 54], opacity: [0.9, 0.4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.circle
                  cx="165" cy="64" r="14"
                  fill="none" stroke="#112D4E" strokeWidth="1.5" strokeDasharray="4 3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                />
                {/* Fighter High Kick Silhouette */}
                <g fill="#112D4E">
                  <circle cx="95" cy="56" r="10" />
                  {/* Dobok Uniform Torso */}
                  <path d="M86 68 L110 70 L116 106 L88 104 Z" />
                  {/* Black Belt at Waist */}
                  <rect x="86" y="102" width="30" height="5.5" rx="2" fill="#112D4E" stroke="#3F72AF" strokeWidth="1.2" />
                  {/* Fluttering Belt Ends from waist */}
                  <motion.path
                    d="M86 105 Q72 108 58 118"
                    stroke="#3F72AF" strokeWidth="3" fill="none" strokeLinecap="round"
                    initial={{ d: "M86 105 Q72 108 58 118" }}
                    animate={{ d: [
                      "M86 105 Q72 108 58 118",
                      "M86 105 Q74 100 58 108",
                      "M86 105 Q72 108 58 118"
                    ] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                  />
                  {/* Standing Leg */}
                  <path d="M94 106 L88 144 L82 178 L93 180 L99 146 L105 107 Z" />
                  {/* Kicking Leg */}
                  <motion.path
                    d="M116 104 L136 84 L168 64 L173 72 L142 94 L118 110 Z"
                    initial={{ d: "M116 104 L136 84 L168 64 L173 72 L142 94 L118 110 Z" }}
                    animate={{
                      d: [
                        "M116 104 L136 84 L168 64 L173 72 L142 94 L118 110 Z",
                        "M116 104 L138 80 L176 56 L181 64 L144 90 L118 110 Z",
                        "M116 104 L136 84 L168 64 L173 72 L142 94 L118 110 Z"
                      ]
                    }}
                    transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Guard Arms */}
                  <path d="M90 72 L72 88 L80 94 L96 80 Z" />
                  <path d="M104 72 L122 84 L116 90 L98 78 Z" />
                </g>
                {/* Impact Sparks */}
                <motion.circle
                  cx="168" cy="64" r="5" fill="#3F72AF"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              </svg>
            )}

            {current.id === 'boxing' && (
              <svg viewBox="0 0 220 220" className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 drop-shadow-md select-none">
                {/* Pulsing Shockwave */}
                <motion.circle
                  cx="110" cy="110" r="16"
                  fill="none" stroke="#E63946" strokeWidth="2.5"
                  initial={{ r: 16, opacity: 0.9 }}
                  animate={{ r: [16, 52, 74], opacity: [0.9, 0.35, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                />
                {/* Left Glove Strike */}
                <motion.g
                  animate={{ x: [-8, 12, -8] }}
                  transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <rect x="40" y="98" width="46" height="24" rx="10" fill="#112D4E" />
                  <ellipse cx="80" cy="110" rx="20" ry="16" fill="#E63946" />
                  <path d="M75 96 C85 96 96 102 94 118 C92 126 78 126 71 122 Z" fill="#D62828" />
                </motion.g>
                {/* Right Glove Counter */}
                <motion.g
                  animate={{ x: [8, -12, 8] }}
                  transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut', delay: 0.38 }}
                >
                  <rect x="134" y="90" width="46" height="24" rx="10" fill="#112D4E" />
                  <ellipse cx="134" cy="102" rx="20" ry="16" fill="#112D4E" />
                  <path d="M130 88 C119 88 108 94 111 110 C113 118 127 118 136 114 Z" fill="#3F72AF" />
                </motion.g>
                {/* Spark Lines */}
                <motion.g
                  animate={{ scale: [0.8, 1.35, 0.8], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.75, repeat: Infinity }}
                >
                  <line x1="110" y1="82" x2="110" y2="66" stroke="#E63946" strokeWidth="3" strokeLinecap="round" />
                  <line x1="110" y1="138" x2="110" y2="154" stroke="#E63946" strokeWidth="3" strokeLinecap="round" />
                  <line x1="84" y1="110" x2="68" y2="110" stroke="#E63946" strokeWidth="3" strokeLinecap="round" />
                  <line x1="136" y1="110" x2="152" y2="110" stroke="#E63946" strokeWidth="3" strokeLinecap="round" />
                </motion.g>
              </svg>
            )}

            {current.id === 'silambam' && (
              <svg viewBox="0 0 220 220" className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 drop-shadow-md select-none">
                {/* Orbiting Staff Trails */}
                <motion.circle
                  cx="110" cy="110" r="64"
                  fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="18 12"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                />
                {/* Staff 1 */}
                <motion.g
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '110px 110px' }}
                >
                  <line x1="32" y1="32" x2="188" y2="188" stroke="#8B5A2B" strokeWidth="8" strokeLinecap="round" />
                  <line x1="32" y1="32" x2="188" y2="188" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
                </motion.g>
                {/* Staff 2 Counter-Rotating */}
                <motion.g
                  animate={{ rotate: [360, 180, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '110px 110px' }}
                >
                  <line x1="32" y1="188" x2="188" y2="32" stroke="#112D4E" strokeWidth="6.5" strokeLinecap="round" />
                  <line x1="32" y1="188" x2="188" y2="32" stroke="#3F72AF" strokeWidth="2" strokeLinecap="round" />
                </motion.g>
                {/* Center Brass Hub */}
                <circle cx="110" cy="110" r="14" fill="#112D4E" stroke="#D4AF37" strokeWidth="2.5" />
                <circle cx="110" cy="110" r="5" fill="#D4AF37" />
              </svg>
            )}

            {current.id === 'yoga' && (
              <svg viewBox="0 0 220 220" className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 drop-shadow-md select-none">
                {/* Breathing Chakra Glow */}
                <motion.circle
                  cx="110" cy="110" r="34"
                  fill="none" stroke="#2A9D8F" strokeWidth="2.5"
                  initial={{ r: 34, opacity: 0.35 }}
                  animate={{ r: [34, 64, 34], opacity: [0.35, 0.8, 0.35] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Meditating Figure */}
                <g fill="#112D4E">
                  <circle cx="110" cy="68" r="12" />
                  <path d="M102 82 L118 82 L125 118 L95 118 Z" />
                  <path d="M95 116 C82 120 72 134 84 144 C96 147 124 147 136 144 C148 134 138 120 125 116 Z" />
                  <path d="M102 86 L80 105 L87 110 L105 97 Z" />
                  <path d="M118 86 L140 105 L133 110 L115 97 Z" />
                </g>
                {/* Rising Energy Node */}
                <motion.circle
                  cx="110" cy="52" r="4" fill="#2A9D8F"
                  animate={{ y: [0, -18, 0], opacity: [1, 0.1, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Animation Description (Directly Below, Clean & Borderless) ── */}
      <div className="mt-3 text-center max-w-md w-full">
        <div className="inline-flex items-center justify-center gap-2 mb-0.5">
          <span className="text-xl sm:text-2xl">{current.icon}</span>
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#112D4E] uppercase tracking-tight">
            {current.name}
          </h3>
        </div>
        <p className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#3F72AF] mb-1.5">
          {current.tag}
        </p>
        <p className="font-sans text-xs text-[#112D4E]/80 leading-relaxed max-w-sm mx-auto line-clamp-2">
          {current.quote}
        </p>

        {/* Minimalist Discipline Selector Buttons */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3.5 flex-wrap">
          {DISCIPLINES.map((disc, idx) => (
            <button
              key={disc.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full transition-all text-xs font-sans font-semibold cursor-pointer ${
                activeTab === idx
                  ? 'bg-[#112D4E] text-white shadow-xs scale-105'
                  : 'bg-white hover:bg-[#F9F7F7] text-[#112D4E] border border-[#DBE2EF] hover:border-[#3F72AF]'
              }`}
            >
              <span>{disc.icon}</span>
              <span>{disc.short}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Main Hero Section ──────────────────────────────────────────── */
export default function Hero() {

  const scrollToNext = () => {
    const el = document.getElementById('about-thillai-mac')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex items-center bg-[#F9F7F7] border-b border-[#DBE2EF] overflow-hidden">
      {/* Subtle athletic dot background pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#112D4E 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container-pad relative z-10 py-8 sm:py-10 lg:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── Left Column: Quotes & Academy Presentation (7 cols) ── */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Section Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 border border-[#DBE2EF] text-[#112D4E] text-[11px] font-sans font-semibold tracking-[0.16em] uppercase mb-4 rounded-full shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3F72AF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3F72AF]"></span>
              </span>
              <VerifiedIcon sx={{ fontSize: 14, color: '#3F72AF' }} />
              <span>THILLAI MARTIAL ARTS CLUB · EST. 2004</span>
            </div>

            {/* Hero Heading: Barlow Condensed 800 */}
            <h1 className="font-display font-extrabold text-[clamp(2.4rem,4.5vw,4.4rem)] text-[#112D4E] leading-[0.96] tracking-[-0.02em] mb-4 uppercase">
              BUILD STRENGTH.<br />
              <span className="text-[#3F72AF]">BUILD DISCIPLINE.</span><br />
              BUILD YOURSELF.
            </h1>

            {/* Subheading: Inter 400 */}
            <p className="font-sans text-[#112D4E]/80 text-sm sm:text-base leading-[1.65] mb-6 max-w-xl font-normal">
              Chidambaram's premier martial arts academy with over 20 years of dedicated excellence. From Olympic Taekwondo to Boxing, Silambam, and Yoga — we forge champions with discipline, physical fitness, and unbreakable character.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link
                to="/register"
                className="btn-primary !py-3.5 !px-8 text-xs font-sans font-bold tracking-wider group inline-flex items-center gap-2 shadow-sm whitespace-nowrap min-w-[170px] justify-center"
              >
                <span>REGISTER NOW</span>
                <ArrowForwardIcon sx={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/training"
                className="btn-secondary !py-3.5 !px-8 text-xs font-sans font-bold tracking-wider hover:bg-white shadow-2xs whitespace-nowrap min-w-[170px] justify-center"
              >
                EXPLORE TRAINING
              </Link>
            </div>
          </motion.div>

          {/* ── Right Column: Cardless Martial Arts Animation (5 cols) ── */}
          <motion.div
            className="lg:col-span-5 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <MartialHeroAnimation />
          </motion.div>

        </div>

        {/* Subtle Scroll Down Indicator */}
        <div className="flex justify-center mt-6 lg:mt-8">
          <button
            onClick={scrollToNext}
            className="flex flex-col items-center text-[11px] font-sans font-semibold text-[#112D4E]/60 hover:text-[#3F72AF] transition-colors uppercase tracking-widest gap-0.5 cursor-pointer"
            aria-label="Scroll down"
          >
            <span>Explore Academy</span>
            <KeyboardDoubleArrowDownIcon sx={{ fontSize: 16 }} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  )
}

