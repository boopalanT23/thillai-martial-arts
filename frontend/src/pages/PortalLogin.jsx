import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SecurityIcon from '@mui/icons-material/Security'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import SchoolIcon from '@mui/icons-material/School'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useAuth } from '../context/AuthContext.jsx'

export default function PortalLogin() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, isAuthenticated, isStudent, isAdmin } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin', { replace: true })
      } else if (isStudent) {
        const from = location.state?.from?.pathname || '/student-dashboard'
        navigate(from, { replace: true })
      }
    }
  }, [isAuthenticated, isAdmin, isStudent, navigate, location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!identifier.trim() || !password) return

    setSubmitting(true)
    const result = await login(identifier.trim(), password)
    setSubmitting(false)

    if (result.success) {
      if (result.role === 'ADMIN') {
        const from = location.state?.from?.pathname || '/admin'
        navigate(from, { replace: true })
      } else {
        const from = location.state?.from?.pathname || '/student-dashboard'
        navigate(from, { replace: true })
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[90vh] flex items-center justify-center py-16 px-4 bg-[#F9F7F7] relative overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#3F72AF]/10 to-[#112D4E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* Portal Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link
            to="/"
            className="group flex flex-col items-center mb-3.5 transition-transform hover:scale-105"
            aria-label="Thillai Martial Arts Club Home"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden p-0.5 bg-white border-2 border-[#3F72AF] shadow-md flex items-center justify-center">
              <img
                src="/images/club-emblem.png"
                alt="Thillai Martial Arts Club Official Logo"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling.style.display = 'block'
                }}
              />
              <span className="hidden font-display font-black text-2xl text-[#112D4E]">T</span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#DBE2EF] border border-[#DBE2EF] text-[#112D4E] text-[11px] font-sans font-bold tracking-[0.18em] uppercase rounded-full mb-3 shadow-xs">
            <SecurityIcon sx={{ fontSize: 14, color: '#3F72AF' }} />
            <span>SECURE ACADEMY PORTAL</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#112D4E] uppercase tracking-tight">
            PORTAL LOGIN
          </h1>
          <p className="font-sans text-[#112D4E]/70 text-xs sm:text-sm mt-1.5 max-w-sm mx-auto leading-relaxed">
            Unified access for Students, Guardians, Instructors &amp; Management
          </p>
        </div>

        {/* Unified Card */}
        <div className="card-tma p-7 sm:p-9 shadow-xl border border-[#DBE2EF] bg-white relative rounded-2xl">

          {/* Quick Guidance Badge */}
          <div className="mb-6 p-3 bg-[#F9F7F7] rounded-xl border border-[#DBE2EF] flex items-center justify-between text-xs text-[#112D4E]/80">
            <div className="flex items-center gap-2">
              <SchoolIcon sx={{ fontSize: 18, color: '#3F72AF' }} />
              <span className="font-medium font-sans">Students: ID or Mobile</span>
            </div>
            <div className="h-4 w-px bg-[#DBE2EF]" />
            <div className="flex items-center gap-2">
              <AdminPanelSettingsIcon sx={{ fontSize: 18, color: '#112D4E' }} />
              <span className="font-medium font-sans">Admin: Username</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Identifier Input */}
            <div>
              <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1.5">
                Student ID / Mobile / Username
              </label>
              <div className="relative">
                <PersonIcon
                  sx={{ fontSize: 20, color: '#3F72AF' }}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. TMA0001, 9876543210, or admin"
                  required
                  autoFocus
                  className="input-tma pl-11 font-sans text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] font-sans text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
                  <CheckCircleOutlineIcon sx={{ fontSize: 11 }} /> Encrypted
                </span>
              </div>
              <div className="relative">
                <LockIcon
                  sx={{ fontSize: 20, color: '#3F72AF' }}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  required
                  className="input-tma pl-11 pr-11 font-sans text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#112D4E]/50 hover:text-[#3F72AF] transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <VisibilityOffIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <VisibilityIcon sx={{ fontSize: 18 }} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !identifier.trim() || !password}
              className="w-full !py-3.5 mt-3 text-xs font-sans font-bold tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 shadow-md transition-all bg-[#112D4E] hover:bg-[#0B1B30] text-white disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  AUTHENTICATING…
                </>
              ) : (
                <>
                  SIGN IN TO PORTAL
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </>
              )}
            </button>
          </form>

          {/* Registration Notice for New Students */}
          <div className="mt-6 pt-5 border-t border-[#DBE2EF] text-center">
            <p className="font-sans text-xs text-[#112D4E]/60 mb-1.5">
              New student joining Thillai Martial Arts Club?
            </p>
            <Link
              to="/register"
              className="font-sans text-xs text-[#3F72AF] hover:text-[#112D4E] font-bold uppercase tracking-wider inline-flex items-center gap-1 hover:underline transition-colors"
            >
              Register Admission Online →
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-5 pt-4 border-t border-[#DBE2EF]/60 flex items-center justify-center gap-2 text-[11px] font-sans text-[#112D4E]/60">
            <SecurityIcon sx={{ fontSize: 14, color: '#3F72AF' }} />
            <span>BCrypt Secure Authentication · Auto-detects Account Role</span>
          </div>

        </div>

        {/* Back Link */}
        <p className="text-center mt-6">
          <Link
            to="/"
            className="font-sans text-xs text-[#112D4E]/60 hover:text-[#3F72AF] font-medium transition-colors"
          >
            ← Back to Club Home
          </Link>
        </p>

      </div>
    </motion.div>
  )
}
