import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import BadgeIcon from '@mui/icons-material/Badge'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SchoolIcon from '@mui/icons-material/School'
import PaymentsIcon from '@mui/icons-material/Payments'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LoginIcon from '@mui/icons-material/Login'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LogoutIcon from '@mui/icons-material/Logout'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SecurityIcon from '@mui/icons-material/Security'
import { useAuth } from '../context/AuthContext.jsx'

export default function PortalHub() {
  const { user, isAuthenticated, isStudent, isAdmin, login, logout } = useAuth()
  const navigate = useNavigate()

  // Student inline login state
  const [studentIdInput, setStudentIdInput] = useState('')
  const [studentPassInput, setStudentPassInput] = useState('')
  const [studentLoading, setStudentLoading] = useState(false)

  // Admin inline login state
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)
  const [showAdminForm, setShowAdminForm] = useState(false)

  const handleStudentSubmit = async (e) => {
    e.preventDefault()
    if (!studentIdInput.trim() || !studentPassInput) return
    setStudentLoading(true)
    const res = await login(studentIdInput.trim(), studentPassInput)
    setStudentLoading(false)
    if (res?.success) {
      if (res.role === 'ADMIN') navigate('/admin')
      else navigate('/student-dashboard')
    }
  }

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    if (!adminUser.trim() || !adminPass) return
    setAdminLoading(true)
    const res = await login(adminUser.trim(), adminPass)
    setAdminLoading(false)
    if (res?.success) {
      if (res.role === 'ADMIN') navigate('/admin')
      else navigate('/student-dashboard')
    }
  }

  return (
    <section id="portal-hub" className="py-16 bg-[#F9F7F7] border-b border-[#DBE2EF] relative overflow-hidden">
      {/* Background geometric accents */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-[#3F72AF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-[#112D4E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-pad relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DBE2EF] border border-[#DBE2EF] text-[#112D4E] text-xs font-sans font-semibold tracking-[0.16em] uppercase mb-3 rounded">
            <SecurityIcon sx={{ fontSize: 15, color: '#3F72AF' }} />
            SECURE ACADEMY PORTALS
          </div>
          <h2 className="section-title-center mb-3">
            DIRECT PORTAL ACCESS
          </h2>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/70 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Easily manage your martial arts journey. Students &amp; parents can view ID cards, fees &amp; attendance, while coaches &amp; administrators manage academy operations.
          </p>
        </div>

        {/* Portals Grid (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* =========================================================
              1. STUDENT LOGIN PORTAL CARD
          ========================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border-2 border-[#3F72AF]/30 rounded-2xl p-7 sm:p-9 shadow-lg flex flex-col justify-between hover:border-[#3F72AF] transition-all relative overflow-hidden group"
          >
            {/* Top Accent Strip */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-[#3F72AF]" />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-xl bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] p-3 shadow-inner">
                    <SchoolIcon sx={{ fontSize: 28 }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#3F72AF] font-bold bg-[#DBE2EF]/60 px-2 py-0.5 rounded">
                      Learners &amp; Parents
                    </span>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#112D4E] uppercase tracking-tight mt-1">
                      Student Portal
                    </h3>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  24/7 Access
                </span>
              </div>

              {/* Quick Feature Badges */}
              <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs font-sans">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F9F7F7] border border-[#DBE2EF]/80 text-[#112D4E]">
                  <BadgeIcon sx={{ fontSize: 16, color: '#3F72AF' }} />
                  <span className="font-medium">Digital ID Card</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F9F7F7] border border-[#DBE2EF]/80 text-[#112D4E]">
                  <PaymentsIcon sx={{ fontSize: 16, color: '#3F72AF' }} />
                  <span className="font-medium">Fee Dues &amp; Receipts</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F9F7F7] border border-[#DBE2EF]/80 text-[#112D4E]">
                  <EventAvailableIcon sx={{ fontSize: 16, color: '#3F72AF' }} />
                  <span className="font-medium">Attendance &amp; Belts</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F9F7F7] border border-[#DBE2EF]/80 text-[#112D4E]">
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#3F72AF' }} />
                  <span className="font-medium">Batch Updates</span>
                </div>
              </div>

              {/* Auth Status / Interactive Form */}
              {isAuthenticated && isStudent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-sans text-emerald-800 font-semibold">
                        Logged in as Active Student
                      </p>
                      <p className="font-display font-bold text-lg text-[#112D4E]">
                        {user?.name} {user?.studentId ? `(${user.studentId})` : ''}
                      </p>
                    </div>
                    <button
                      onClick={logout}
                      className="text-xs font-sans text-rose-700 hover:text-rose-900 font-bold uppercase tracking-wider flex items-center gap-1"
                    >
                      <LogoutIcon sx={{ fontSize: 14 }} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleStudentSubmit} className="space-y-2 mb-6">
                  <label className="block text-xs font-sans font-bold text-[#112D4E] uppercase tracking-wider">
                    Student Login (ID / Mobile &amp; Password)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative">
                      <BadgeIcon sx={{ fontSize: 18, color: '#3F72AF' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={studentIdInput}
                        onChange={(e) => setStudentIdInput(e.target.value)}
                        placeholder="ID or Mobile"
                        className="input-tma pl-9 !py-2 text-xs bg-[#F9F7F7] font-sans"
                      />
                    </div>
                    <div className="relative">
                      <LockIcon sx={{ fontSize: 18, color: '#3F72AF' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={studentPassInput}
                        onChange={(e) => setStudentPassInput(e.target.value)}
                        placeholder="Password"
                        className="input-tma pl-9 !py-2 text-xs bg-[#F9F7F7] font-sans"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={studentLoading || !studentIdInput.trim() || !studentPassInput}
                    className="btn-primary w-full !py-2 text-xs font-sans font-bold whitespace-nowrap shadow-sm disabled:opacity-50 mt-1"
                  >
                    {studentLoading ? 'AUTHENTICATING…' : 'LOGIN TO STUDENT PORTAL'} <LoginIcon sx={{ fontSize: 15 }} />
                  </button>
                </form>
              )}
            </div>

            {/* Actions / Direct Links */}
            <div className="pt-4 border-t border-[#DBE2EF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <Link
                to={isAuthenticated && isStudent ? '/student-dashboard' : '/login'}
                className="btn-primary w-full sm:w-auto justify-center !py-2.5 !px-5 text-xs font-sans font-semibold"
              >
                {isAuthenticated && isStudent ? 'OPEN STUDENT DASHBOARD' : 'OPEN ACADEMY PORTAL'}
                <ArrowForwardIcon sx={{ fontSize: 14 }} />
              </Link>

              <Link
                to="/register"
                className="font-sans text-[#3F72AF] hover:underline font-semibold text-xs"
              >
                New Student? Register Admission →
              </Link>
            </div>
          </motion.div>

          {/* =========================================================
              2. ADMIN & COACH PORTAL CARD
          ========================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white border-2 border-[#112D4E]/30 rounded-2xl p-7 sm:p-9 shadow-lg flex flex-col justify-between hover:border-[#112D4E] transition-all relative overflow-hidden group"
          >
            {/* Top Accent Strip */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-[#112D4E]" />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-xl bg-[#112D4E] flex items-center justify-center text-[#F9F7F7] p-3 shadow-inner">
                    <AdminPanelSettingsIcon sx={{ fontSize: 28 }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#112D4E] font-bold bg-[#DBE2EF] px-2 py-0.5 rounded">
                      Staff &amp; Instructors
                    </span>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#112D4E] uppercase tracking-tight mt-1">
                      Admin Portal
                    </h3>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-sans font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                  <SecurityIcon sx={{ fontSize: 13, color: '#3F72AF' }} />
                  Restricted
                </span>
              </div>

              {/* Quick Feature Badges */}
              <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs font-sans">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F9F7F7] border border-[#DBE2EF]/80 text-[#112D4E]">
                  <PersonIcon sx={{ fontSize: 16, color: '#112D4E' }} />
                  <span className="font-medium">Student Registry</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F9F7F7] border border-[#DBE2EF]/80 text-[#112D4E]">
                  <PaymentsIcon sx={{ fontSize: 16, color: '#112D4E' }} />
                  <span className="font-medium">Fee Collection &amp; Due</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F9F7F7] border border-[#DBE2EF]/80 text-[#112D4E]">
                  <SchoolIcon sx={{ fontSize: 16, color: '#112D4E' }} />
                  <span className="font-medium">Batches &amp; Courses</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F9F7F7] border border-[#DBE2EF]/80 text-[#112D4E]">
                  <AssessmentIcon sx={{ fontSize: 16, color: '#112D4E' }} />
                  <span className="font-medium">Reports &amp; Analytics</span>
                </div>
              </div>

              {/* Auth Status / Quick Admin Action */}
              {isAuthenticated && isAdmin ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-sans text-blue-800 font-semibold">
                        Logged in as Academy Administrator
                      </p>
                      <p className="font-display font-bold text-lg text-[#112D4E]">
                        {user?.name || user?.username || 'Master HariHaran'}
                      </p>
                    </div>
                    <button
                      onClick={logout}
                      className="text-xs font-sans text-rose-700 hover:text-rose-900 font-bold uppercase tracking-wider flex items-center gap-1"
                    >
                      <LogoutIcon sx={{ fontSize: 14 }} /> Logout
                    </button>
                  </div>
                </div>
              ) : showAdminForm ? (
                <form onSubmit={handleAdminSubmit} className="space-y-3 mb-6 bg-[#F9F7F7] p-3.5 rounded-xl border border-[#DBE2EF]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="relative">
                      <PersonIcon sx={{ fontSize: 16, color: '#112D4E' }} className="absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        placeholder="Admin username"
                        className="input-tma pl-8 !py-2 text-xs bg-white font-sans"
                      />
                    </div>
                    <div className="relative">
                      <LockIcon sx={{ fontSize: 16, color: '#112D4E' }} className="absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        placeholder="Password"
                        className="input-tma pl-8 !py-2 text-xs bg-white font-sans"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAdminForm(false)}
                      className="font-sans text-xs text-[#112D4E]/70 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={adminLoading || !adminUser.trim() || !adminPass}
                      className="btn-gold-solid !py-2 !px-4 text-xs font-sans font-bold disabled:opacity-50"
                    >
                      {adminLoading ? 'AUTHENTICATING…' : 'SIGN IN'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-6 p-4 rounded-xl bg-[#F9F7F7] border border-[#DBE2EF] flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-base text-[#112D4E] uppercase">
                      Coach &amp; Admin Panel
                    </p>
                    <p className="font-sans text-[12px] text-[#112D4E]/70">
                      Login to access attendance, fee collections &amp; reports.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdminForm(true)}
                    className="font-sans text-xs bg-white hover:bg-[#DBE2EF] text-[#112D4E] font-semibold px-3 py-1.5 rounded border border-[#DBE2EF] transition-colors uppercase tracking-wider"
                  >
                    Quick Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Actions / Direct Links */}
            <div className="pt-4 border-t border-[#DBE2EF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <Link
                to={isAuthenticated && isAdmin ? '/admin' : '/login'}
                className="btn-gold-solid w-full sm:w-auto justify-center !py-2.5 !px-5 text-xs font-sans font-bold"
              >
                {isAuthenticated && isAdmin ? 'OPEN ADMIN PANEL' : 'ACCESS ADMIN PORTAL'}
                <ArrowForwardIcon sx={{ fontSize: 14 }} />
              </Link>

              <span className="font-sans text-[#112D4E]/60 text-xs">
                Restricted to Academy Personnel
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
