import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PhoneIcon from '@mui/icons-material/Phone'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SchoolIcon from '@mui/icons-material/School'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LogoutIcon from '@mui/icons-material/Logout'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useAuth } from '../context/AuthContext.jsx'
import { getAllCoursesMerged } from '../data/courses.js'
import { scrollToPageTop } from './ScrollToTop.jsx'

const NAV_LINKS = [
  { label: 'Home',         to: '/',             exact: true },
  { label: 'Mission',      to: '/mission' },
  { label: 'Training',     to: '/training',     hasSub: true },
  { label: 'Gallery',      to: '/gallery' },
  { label: 'Location',     to: '/location' },
  { label: 'Contact',      to: '/contact' },
  { label: 'Monthly Fees', to: '/monthly-fees' },
]

function TrainingDropdown({ pathname }) {
  const [open, setOpen] = useState(false)
  const [courses, setCourses] = useState(() => getAllCoursesMerged())
  const isActive = pathname.startsWith('/training')

  useEffect(() => {
    const handleUpdate = () => setCourses(getAllCoursesMerged())
    window.addEventListener('tma:courses-updated', handleUpdate)
    return () => window.removeEventListener('tma:courses-updated', handleUpdate)
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to="/training"
        onClick={() => {
          setOpen(false)
          scrollToPageTop()
        }}
        className={`flex items-center gap-1 font-sans text-[13.5px] 2xl:text-[14px] font-medium tracking-[0.015em] whitespace-nowrap transition-colors duration-150 px-2.5 2xl:px-3.5 py-2 rounded
          ${isActive ? 'text-[#3F72AF] font-semibold bg-[#DBE2EF]/60' : 'text-[#112D4E] hover:text-[#3F72AF] hover:bg-[#DBE2EF]/30'}`}
      >
        Training
        <KeyboardArrowDownIcon sx={{ fontSize: 16, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-white border border-[#DBE2EF] rounded-xl shadow-xl z-50 p-2 overflow-hidden"
          >
            <div className="px-3 py-1.5 border-b border-[#DBE2EF] mb-1 flex items-center justify-between">
              <span className="font-sans text-[11px] text-[#112D4E] font-bold tracking-wider uppercase">
                {courses.length} Disciplines
              </span>
              <Link
                to="/training"
                onClick={() => {
                  setOpen(false)
                  scrollToPageTop()
                }}
                className="text-[10px] font-sans bg-[#DBE2EF] hover:bg-[#3F72AF] hover:text-white text-[#112D4E] px-2 py-0.5 rounded font-semibold transition-colors"
              >
                All Programs →
              </Link>
            </div>
            <div className="space-y-0.5 max-h-72 overflow-y-auto">
              {courses.map(c => {
                const to = `/training/${c.slug}`
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => {
                      setOpen(false)
                      scrollToPageTop()
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 font-sans text-xs rounded transition-colors duration-150
                      ${pathname === to
                        ? 'text-[#3F72AF] bg-[#DBE2EF]/60 font-semibold'
                        : 'text-[#112D4E] hover:text-[#3F72AF] hover:bg-[#DBE2EF]/30'}`}
                  >
                    <span className="text-base">{c.icon || '🥋'}</span>
                    <span className="truncate">{c.name}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AcademyPortalNav({ pathname, user, isStudent, isAdmin, logout }) {
  const [open, setOpen] = useState(false)
  const isPortalActive = pathname.startsWith('/login') || pathname.startsWith('/portal') || pathname.startsWith('/student') || pathname.startsWith('/admin')

  if (!isStudent && !isAdmin) {
    return (
      <Link
        to="/login"
        onClick={scrollToPageTop}
        className={`flex items-center gap-1.5 font-sans text-xs tracking-wider transition-all duration-200 px-3 py-1.5 rounded-lg font-bold uppercase ${
          isPortalActive
            ? 'text-white bg-[#112D4E] shadow-sm'
            : 'text-[#112D4E] bg-[#DBE2EF]/70 hover:bg-[#112D4E] hover:text-white'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#3F72AF] animate-pulse"></span>
        Login
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={isAdmin ? '/admin' : '/student-dashboard'}
        onClick={scrollToPageTop}
        className="flex items-center gap-2 font-sans text-xs font-bold text-white bg-[#112D4E] hover:bg-[#0B1B30] px-3.5 py-2 rounded-lg shadow-sm uppercase tracking-wider"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span className="truncate max-w-[130px]">{user?.name || user?.username}</span>
        <KeyboardArrowDownIcon sx={{ fontSize: 16, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-1 w-64 bg-white border border-[#DBE2EF] rounded-xl shadow-2xl z-50 p-3 overflow-hidden"
          >
            <div className="border-b border-[#DBE2EF] pb-2 mb-2">
              <span className="text-[10px] font-sans bg-[#DBE2EF] text-[#112D4E] px-2 py-0.5 rounded font-bold uppercase">
                {isAdmin ? 'Administrator' : 'Student Account'}
              </span>
              <p className="font-display font-bold text-sm text-[#112D4E] mt-1 truncate">
                {user?.name || user?.username}
              </p>
              {user?.studentId && (
                <p className="font-sans text-[11px] text-[#3F72AF] font-semibold">
                  ID: {user.studentId}
                </p>
              )}
            </div>

            <Link
              to={isAdmin ? '/admin' : '/student-dashboard'}
              onClick={() => {
                setOpen(false)
                scrollToPageTop()
              }}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#F9F7F7] hover:bg-[#DBE2EF] text-[#112D4E] font-sans text-xs font-semibold mb-2 transition-colors"
            >
              {isAdmin ? <AdminPanelSettingsIcon sx={{ fontSize: 16 }} /> : <SchoolIcon sx={{ fontSize: 16 }} />}
              {isAdmin ? 'Open Admin Panel' : 'Open Student Dashboard'}
            </Link>

            <button
              onClick={() => {
                logout()
                setOpen(false)
              }}
              className="w-full text-left font-sans text-xs text-rose-600 hover:bg-rose-50 p-2 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <LogoutIcon sx={{ fontSize: 14 }} /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileTraining, setMobileTraining] = useState(false)
  const [navCourses, setNavCourses] = useState(() => getAllCoursesMerged())
  const location = useLocation()
  const { user, isStudent, isAdmin, logout } = useAuth()

  useEffect(() => {
    const handleCourses = () => setNavCourses(getAllCoursesMerged())
    window.addEventListener('tma:courses-updated', handleCourses)
    return () => window.removeEventListener('tma:courses-updated', handleCourses)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setMobileTraining(false) }, [location.pathname])

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 bg-white/95 backdrop-blur-md border-b border-[#DBE2EF] ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="container-pad">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Official Club Logo: Circular badge with double-triangle & serif T */}
            <Link
              to="/"
              onClick={scrollToPageTop}
              className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0 mr-3 xl:mr-6 2xl:mr-8"
              aria-label="Thillai Martial Arts Club Home"
            >
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden p-0.5 bg-white shadow-sm border-2 border-[#3F72AF]/50 group-hover:border-[#3F72AF] group-hover:shadow-md group-hover:scale-105 transition-all duration-200 flex items-center justify-center flex-shrink-0">
                <img
                  src="/images/club-emblem.png"
                  alt="Thillai Martial Arts Club Official Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col justify-center leading-none">
                <div className="font-display font-extrabold text-lg sm:text-[19px] text-[#112D4E] tracking-wider uppercase group-hover:text-[#3F72AF] transition-colors">
                  THILLAI
                </div>
                <div className="font-sans text-[9px] sm:text-[9.5px] font-bold text-[#3F72AF] uppercase tracking-[0.2em] mt-1">
                  Martial Arts Club
                </div>
              </div>
            </Link>

            {/* Desktop Nav: Inter 500/600 13.5px-14px */}
            <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1">
              {NAV_LINKS.map(link =>
                link.hasSub ? (
                  <TrainingDropdown key="training" pathname={location.pathname} />
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.exact}
                    onClick={scrollToPageTop}
                    className={({ isActive }) =>
                      `font-sans text-[13.5px] 2xl:text-[14px] tracking-[0.015em] whitespace-nowrap px-2.5 2xl:px-3.5 py-2 rounded transition-colors duration-150
                       ${isActive
                         ? 'text-[#3F72AF] font-semibold bg-[#DBE2EF]/60'
                         : 'text-[#112D4E] font-medium hover:text-[#3F72AF] hover:bg-[#DBE2EF]/30'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden xl:flex items-center gap-3.5">
              {/* Unified Academy Portal */}
              <AcademyPortalNav
                pathname={location.pathname}
                user={user}
                isStudent={isStudent}
                isAdmin={isAdmin}
                logout={logout}
              />

              <a
                href="tel:+918072089377"
                className="flex items-center gap-1.5 font-sans text-xs font-semibold text-[#112D4E] hover:text-[#3F72AF] transition-colors tracking-wide px-2 py-1"
              >
                <PhoneIcon sx={{ fontSize: 16, color: '#3F72AF' }} />
                8072089377
              </a>
              <Link
                to="/register"
                onClick={scrollToPageTop}
                className="nav-register-btn whitespace-nowrap !py-2.5 !px-5 group flex-shrink-0"
              >
                {/* Subtle light sweep shimmer */}
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-nav-shimmer z-10" />

                {/* Content */}
                <div className="relative z-20 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                  </span>
                  <span className="font-sans text-[12.5px] font-bold tracking-wider">REGISTER NOW</span>
                  <ArrowForwardIcon sx={{ fontSize: 14 }} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="xl:hidden p-2 text-[#112D4E] hover:text-[#3F72AF] hover:bg-[#DBE2EF] rounded transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#112D4E]/40 backdrop-blur-xs xl:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[290px] bg-[#F9F7F7] border-l border-[#DBE2EF] shadow-2xl flex flex-col xl:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#DBE2EF] bg-white">
                <Link
                  to="/"
                  onClick={() => {
                    setMobileOpen(false)
                    scrollToPageTop()
                  }}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden p-0.5 bg-white shadow-xs border border-[#3F72AF]/50 flex items-center justify-center flex-shrink-0">
                    <img
                      src="/images/club-emblem.png"
                      alt="Thillai Martial Arts Club Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col justify-center leading-none">
                    <p className="font-display font-bold text-sm text-[#112D4E] tracking-wide uppercase">THILLAI MAC</p>
                    <p className="font-sans text-[9px] text-[#3F72AF] font-bold uppercase tracking-wider mt-0.5">Est. 2004</p>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-[#112D4E] hover:text-[#3F72AF] hover:bg-[#DBE2EF] rounded"
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {/* Unified Portal Quick Bar in Mobile */}
                <div className="mb-4 p-3 bg-white rounded-xl border border-[#DBE2EF] space-y-2">
                  <p className="font-sans text-[10px] font-bold text-[#112D4E] uppercase tracking-widest text-center border-b border-[#DBE2EF] pb-1">
                    Academy Portal
                  </p>
                  {isStudent || isAdmin ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="font-sans text-xs font-bold text-[#112D4E] truncate max-w-[150px]">
                          {user?.name || user?.username}
                        </span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          {isAdmin ? 'Admin' : 'Student'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to={isAdmin ? '/admin' : '/student-dashboard'}
                          onClick={() => {
                            setMobileOpen(false)
                            scrollToPageTop()
                          }}
                          className="flex items-center justify-center gap-1.5 p-2 rounded bg-[#112D4E] text-white font-sans text-xs font-semibold uppercase tracking-wider"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setMobileOpen(false)
                          }}
                          className="flex items-center justify-center gap-1.5 p-2 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-sans text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => {
                        setMobileOpen(false)
                        scrollToPageTop()
                      }}
                      className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#112D4E] hover:bg-[#0B1B30] text-white font-sans text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3F72AF] animate-pulse"></span>
                      Login
                    </Link>
                  )}
                </div>

                {NAV_LINKS.map(link =>
                  link.hasSub ? (
                    <div key="training" className="space-y-1">
                      <div className="flex items-center justify-between w-full p-2.5 rounded font-sans text-[14px] font-medium text-[#112D4E] hover:bg-white transition-colors">
                        <Link
                          to="/training"
                          onClick={() => {
                            setMobileOpen(false)
                            scrollToPageTop()
                          }}
                          className="flex-1 text-[#112D4E] hover:text-[#3F72AF]"
                        >
                          Training
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileTraining(v => !v)}
                          className="p-1 text-[#112D4E] hover:text-[#3F72AF] -mr-1"
                          aria-label="Toggle training courses"
                        >
                          <KeyboardArrowDownIcon sx={{ fontSize: 18, transform: mobileTraining ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                      </div>
                      <AnimatePresence>
                        {mobileTraining && (
                          <div className="ml-3 pl-3 border-l-2 border-[#3F72AF] space-y-0.5 max-h-60 overflow-y-auto">
                            <Link
                              to="/training"
                              onClick={() => {
                                setMobileOpen(false)
                                scrollToPageTop()
                              }}
                              className="flex items-center justify-between p-2 font-sans text-xs text-[#3F72AF] font-bold hover:bg-white rounded"
                            >
                              <span>All Training Programs</span>
                              <span>→</span>
                            </Link>
                            {navCourses.map(c => {
                              const to = `/training/${c.slug}`
                              return (
                                <Link
                                  key={to}
                                  to={to}
                                  onClick={() => {
                                    setMobileOpen(false)
                                    scrollToPageTop()
                                  }}
                                  className="flex items-center gap-2 p-2 font-sans text-xs text-[#112D4E] hover:text-[#3F72AF] hover:bg-white rounded"
                                >
                                  <span>{c.icon || '🥋'}</span> <span>{c.name}</span>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.exact}
                      onClick={() => {
                        setMobileOpen(false)
                        scrollToPageTop()
                      }}
                      className={({ isActive }) =>
                        `block p-2.5 font-sans text-[14px] rounded transition-colors
                         ${isActive
                           ? 'text-[#3F72AF] font-semibold bg-white border border-[#DBE2EF]'
                           : 'text-[#112D4E] font-medium hover:text-[#3F72AF] hover:bg-white'}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                )}
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#DBE2EF] space-y-2.5 bg-white">
                <a
                  href="tel:+918072089377"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#F9F7F7] border border-[#DBE2EF] rounded font-sans text-xs text-[#112D4E] font-semibold hover:text-[#3F72AF] transition-colors"
                >
                  <PhoneIcon sx={{ fontSize: 15, color: '#3F72AF' }} /> Call: 8072089377
                </a>
                <Link
                  to="/register"
                  onClick={() => {
                    setMobileOpen(false)
                    scrollToPageTop()
                  }}
                  className="nav-register-btn w-full justify-center !py-3 !px-5 group"
                >
                  {/* Subtle light sweep shimmer */}
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-nav-shimmer z-10" />

                  {/* Content */}
                  <div className="relative z-20 flex items-center justify-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                    </span>
                    <span className="font-sans text-xs font-bold tracking-wider">REGISTER NOW</span>
                    <ArrowForwardIcon sx={{ fontSize: 15 }} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16 sm:h-20" />
    </>
  )
}
