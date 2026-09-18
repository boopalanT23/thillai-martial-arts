import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const PILLARS = [
  { title: 'Strength & Conditioning', desc: 'Developing physical power, speed, agility, and stamina through disciplined martial training.' },
  { title: 'Moral Discipline', desc: 'Teaching self-control, deep respect, humility, and moral integrity on and off the mat.' },
  { title: 'Mental Sharpness', desc: 'Fostering unwavering focus, emotional composure, confidence, and stress resilience.' },
  { title: 'Community & Trust', desc: 'Building lifelong friendships, mutual mentorship, and a proud culture of mutual respect.' },
]

const AWARDS = [
  { title: 'National Championship 2024', img: '/images/awards/award-3.jpeg' },
  { title: 'State Level Championship 2025', img: '/images/awards/award-2.jpeg' },
  { title: 'Best Club Award 2023 ', img: '/images/awards/award-1.jpeg' },
]

export default function Mission() {
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
          <p className="section-eyebrow">Founded in 2004</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#112D4E] mb-3 uppercase tracking-tight">
            OUR MISSION &amp; HERITAGE
          </h1>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/80 text-sm sm:text-base leading-relaxed">
            Building champions and cultivating leaders through 20+ years of dedicated, authentic martial arts coaching.
          </p>
        </div>
      </div>

      {/* Story & Philosophy */}
      <section className="section-pad bg-[#F9F7F7] border-b border-[#DBE2EF]">
        <div className="container-pad">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="section-eyebrow">20+ Years Journey</p>
              <h2 className="section-title mb-4">THE THILLAI MARTIAL ARTS STORY</h2>
              <div className="gold-divider-left" />
              <div className="space-y-4 font-sans text-sm sm:text-base text-[#112D4E]/80 leading-relaxed">
                <p>
                  Thillai Martial Arts Club was established in 2004 with a clear purpose: to bring Olympic-standard martial arts, discipline, and holistic fitness to students in Chidambaram and surrounding regions.
                </p>
                <p>
                  Over two decades, we have mentored more than 5,000 students across age groups. Our students have represented Tamil Nadu in district, state, and national tournaments, consistently bringing home prestigious medals and accolades.
                </p>
                <p>
                  Today, we offer a comprehensive academy encompassing Taekwondo, Boxing, Silambam, Yoga, Fitness, Guitar, Chess, Hindi, and English Grammar — fostering physical strength alongside mental brilliance.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary font-sans font-semibold text-xs tracking-wider">
                  ENROLL WITH US <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </Link>
                <Link to="/training" className="btn-secondary font-sans font-semibold text-xs tracking-wider">
                  VIEW DISCIPLINES
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PILLARS.map(p => (
                <div key={p.title} className="card-tma p-6">
                  <div className="w-9 h-9 rounded bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] mb-3">
                    <CheckCircleIcon sx={{ fontSize: 18 }} />
                  </div>
                  <h4 className="font-display font-bold text-xl text-[#112D4E] uppercase tracking-tight mb-1">{p.title}</h4>
                  <p className="font-sans text-xs sm:text-sm text-[#112D4E]/70 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Profile */}
      <section className="section-pad bg-white border-b border-[#DBE2EF]">
        <div className="container-pad max-w-5xl mx-auto">
          <div className="card-tma p-8 sm:p-12 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="w-48 h-48 rounded-xl border-2 border-[#3F72AF] bg-[#DBE2EF] overflow-hidden mb-4 shadow-sm">
                  <img
                    src="/images/founder.jpeg"
                    alt="Master R. HariHaran"
                    className="w-full h-full object-cover object-[50%_20%]"
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center font-display font-black text-5xl text-[#112D4E]">
                    RH
                  </div>
                </div>
                <h3 className="font-display font-bold text-2xl text-[#112D4E] uppercase tracking-tight">Master R. HariHaran</h3>
                <p className="font-sans text-xs text-[#3F72AF] font-bold uppercase tracking-wider mt-1">Founder &amp; Chief Master</p>
                <p className="font-sans text-[11px] text-[#112D4E]/60 mt-1">Black Belt Dan 4 · 20+ Years Experience</p>
              </div>

              <div className="lg:col-span-8 space-y-4 font-sans text-sm text-[#112D4E]/80 leading-relaxed">
                <p className="section-eyebrow">Message from the Founder</p>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#112D4E] uppercase tracking-tight">
                  "Every Child and Adult Has the Potential for Greatness."
                </h3>
                <p>
                  "When I established Thillai Martial Arts Club in 2004, my dream was to create a sanctuary where any individual — regardless of fitness level or background — could discover their inner strength."
                </p>
                <p>
                  "Martial arts is not about aggression; it is about self-control, mental calmness, and moral fortitude. When we teach a student how to strike, we simultaneously teach them the responsibility of when to yield and when to stand firm."
                </p>
                {/* Founder signature aligned to the right */}
                <div className="pt-4 flex flex-col items-end text-right">
                  <img
                    src="/images/founder-signature.png"
                    alt="Master HariHaran Signature"
                    className="h-12 w-auto object-contain opacity-95 mb-1"
                    onError={e => e.target.style.display = 'none'}
                  />
                  <p className="font-display font-bold text-sm text-[#112D4E] uppercase tracking-wide">
                    Master R. HariHaran
                  </p>
                  <p className="font-sans text-[11px] text-[#3F72AF] font-bold uppercase tracking-wider">
                    Founder &amp; Chief Master
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Showcase */}
      <section className="section-pad bg-[#F9F7F7] border-b border-[#DBE2EF]">
        <div className="container-pad">
          <div className="text-center mb-12">
            <p className="section-eyebrow">Proven Accolades</p>
            <h2 className="section-title-center mb-3">CHAMPIONSHIP HONORS</h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {AWARDS.map((award, i) => (
              <div key={award.title} className="card-tma overflow-hidden group">
                <div className="h-52 bg-[#DBE2EF] overflow-hidden">
                  <img
                    src={award.img}
                    alt={award.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => {
                      e.target.style.display = 'none'
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-4xl bg-[#DBE2EF]">
                    🏆
                  </div>
                </div>
                <div className="p-4 text-center">
                  <p className="font-display font-bold text-base text-[#112D4E] uppercase tracking-tight">{award.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  )
}
