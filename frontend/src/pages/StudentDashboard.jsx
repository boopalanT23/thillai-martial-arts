import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import PersonIcon from '@mui/icons-material/Person'
import BadgeIcon from '@mui/icons-material/Badge'
import PaymentsIcon from '@mui/icons-material/Payments'
import HistoryIcon from '@mui/icons-material/History'
import SchoolIcon from '@mui/icons-material/School'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import DownloadIcon from '@mui/icons-material/Download'
import { useAuth } from '../context/AuthContext.jsx'
import { studentAPI, paymentAPI, notificationAPI } from '../services/api.js'
import IDCardGenerator from '../components/IDCardGenerator.jsx'
import PageLoader from '../components/PageLoader.jsx'
import { getFullPhotoUrl } from '../utils/imageUtils.js'

const TABS = [
  { key: 'profile',      label: 'Profile',          icon: PersonIcon },
  { key: 'id-card',       label: 'Identity Card',     icon: BadgeIcon },
  { key: 'fees',          label: 'Fee Status',        icon: PaymentsIcon },
  { key: 'history',       label: 'Payment History',   icon: HistoryIcon },
  { key: 'courses',       label: 'Course Details',    icon: SchoolIcon },
  { key: 'attendance',    label: 'Attendance',        icon: EventAvailableIcon },
  { key: 'notifications', label: 'Notifications',     icon: NotificationsIcon },
]

function formatDateDDMMYYYY(val) {
  if (!val) return '—'
  if (typeof val === 'string') {
    const match = val.trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
    if (match) {
      const yyyy = match[1]
      const mm = match[2].padStart(2, '0')
      const dd = match[3].padStart(2, '0')
      return `${dd}-${mm}-${yyyy}`
    }
  }
  const d = new Date(val)
  if (!isNaN(d.getTime())) {
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }
  return val
}

/* ── Profile Tab ───────────────────────────────────────────── */
function ProfileTab({ student }) {
  const [photoError, setPhotoError] = useState(false)
  const fields = [
    { label: 'Full Name', value: student.name },
    { label: 'Student ID', value: student.studentId },
    { label: 'Date of Birth', value: formatDateDDMMYYYY(student.dob) },
    { label: 'Mobile Number', value: student.mobile },
    { label: 'Joining Date', value: formatDateDDMMYYYY(student.joiningDate) },
    { label: 'Batch', value: student.batchName },
  ]
  return (
    <div className="card-tma p-8">
      <h2 className="font-display font-extrabold text-[#112D4E] text-2xl tracking-tight uppercase mb-6 pb-2 border-b border-[#DBE2EF] flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#3F72AF]"></span> My Student Profile
      </h2>
      <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
        <div className="w-28 h-28 bg-[#DBE2EF] border border-[#DBE2EF] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs">
          {student.photo && !photoError ? (
            <img
              src={getFullPhotoUrl(student.photo)}
              alt={student.name}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              onError={() => setPhotoError(true)}
            />
          ) : (
            <span className="font-display text-[#112D4E] text-3xl font-extrabold">
              {student.name?.[0]?.toUpperCase() || 'T'}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1 font-sans">
          {fields.map(f => (
            <div key={f.label} className="border-b border-[#DBE2EF] pb-3">
              <p className="font-sans text-[11px] text-[#112D4E]/60 font-semibold tracking-wider uppercase mb-1">{f.label}</p>
              <p className="font-sans text-sm text-[#112D4E] font-medium">{f.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="font-sans text-xs text-[#112D4E] font-bold uppercase tracking-wider mb-2.5">Enrolled Disciplines</p>
        <div className="flex flex-wrap gap-2">
          {(student.courses || []).map(c => (
            <span key={c} className="badge-tma font-sans text-xs">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Fees Tab ──────────────────────────────────────────────── */
function FeesTab({ due, student, onPaymentSuccess }) {
  const [paying, setPaying] = useState(false)

  if (!due) return <p className="font-sans text-xs text-[#112D4E]/70">No fee data available.</p>

  const handlePay = async () => {
    if (!due || !student || due.amount <= 0) return
    if (!window.Razorpay) {
      toast.error('Payment gateway is loading. Please refresh the page.')
      return
    }

    setPaying(true)
    try {
      const orderRes = await paymentAPI.createOrder({
        amount: due.amount * 100,
        currency: 'INR',
        receipt: `FEE_${student.studentId}_${Date.now()}`,
        notes: {
          studentId: student.studentId,
          name: student.name,
        },
      })

      const orderData = orderRes.data

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'Thillai Martial Arts Club',
        description: `Monthly Fee - ${student.name}`,
        prefill: {
          name: student.name,
          contact: student.mobile,
        },
        theme: {
          color: '#3F72AF',
        },
        handler: async (response) => {
          try {
            await paymentAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              studentId: student.studentId,
            })
            toast.success('Payment successful!')
            if (onPaymentSuccess) onPaymentSuccess()
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError)
            toast.error(verifyError.response?.data?.message || 'Payment verification failed.')
          } finally {
            setPaying(false)
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false)
            toast.error('Payment cancelled.')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', (response) => {
        console.error('Razorpay payment failed:', response.error)
        toast.error(response.error?.description || 'Payment failed.')
        setPaying(false)
      })
      razorpay.open()
    } catch (err) {
      console.error('Create order error:', err)
      toast.error(err.response?.data?.message || 'Could not initiate payment.')
      setPaying(false)
    }
  }

  const courseList = (due.courseDetails && due.courseDetails.length > 0)
    ? due.courseDetails
    : (student?.courseFeeDetails || [])

  return (
    <div className="space-y-6">
      <div className={`p-8 rounded-xl border ${due.amount > 0 ? 'border-[#3F72AF] bg-[#DBE2EF]/40' : 'border-emerald-300 bg-emerald-50/50'}`}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <p className="font-sans text-xs font-bold text-[#112D4E] uppercase tracking-wider">
            {due.amount > 0 ? 'Monthly Dues Outstanding' : 'Fee Status'}
          </p>
          {due.totalMonthlyFee && (
            <p className="font-sans text-xs text-[#112D4E]/70">
              Total Fee: <strong className="text-[#112D4E]">₹{due.totalMonthlyFee}</strong>
              {due.paidAmount ? ` | Paid: ₹${due.paidAmount}` : ''}
            </p>
          )}
        </div>

        {due.amount > 0 ? (
          <>
            <p className="font-display text-4xl sm:text-5xl font-extrabold text-[#112D4E] mb-1 leading-none">₹{due.amount}</p>
            <p className="font-sans text-xs text-[#112D4E]/60 mb-6">For {due.month || 'current month'}</p>
            <button
              onClick={handlePay}
              disabled={paying}
              className="btn-primary text-xs !py-3.5 !px-8 shadow-sm font-sans font-semibold tracking-wider"
            >
              {paying ? 'PROCESSING…' : `PAY ₹${due.amount} NOW`}
            </button>
          </>
        ) : (
          <p className="font-display text-2xl font-bold text-emerald-700 uppercase tracking-wide">All Fees Paid — You're All Set! ✓</p>
        )}
      </div>

      {courseList.length > 0 && (
        <div className="card-tma p-6">
          <h3 className="font-sans text-[#112D4E] text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b border-[#DBE2EF]">
            Course-by-Course Payment Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courseList.map((c, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-[#DBE2EF] bg-[#F9F7F7] flex items-center justify-between font-sans"
              >
                <div>
                  <p className="font-display font-bold text-[#112D4E] text-lg uppercase tracking-tight">{c.courseName}</p>
                  <p className="font-sans text-xs text-[#112D4E]/60">Fee: ₹{c.fee}/month</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-sans font-bold tracking-wider uppercase ${
                    c.status === 'PAID'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {c.status === 'PAID' ? 'PAID ✓' : 'UNPAID ⏳'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Payment History Tab ───────────────────────────────────── */
function HistoryTab({ history }) {
  if (!history?.length) return <div className="card-tma p-8 text-center text-xs font-sans text-[#112D4E]/60">No payment history recorded yet.</div>
  return (
    <div className="card-tma p-6 overflow-hidden">
      <h2 className="font-display font-extrabold text-[#112D4E] text-2xl tracking-tight uppercase mb-6 pb-2 border-b border-[#DBE2EF] flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#3F72AF]"></span> Payment History
      </h2>
      <div className="overflow-x-auto rounded-lg border border-[#DBE2EF]">
        <table className="admin-table font-sans">
          <thead>
            <tr><th>Date</th><th>Month</th><th>Amount</th><th>Status</th><th>Invoice</th></tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h.id}>
                <td className="font-sans text-xs text-[#112D4E]/80">{h.date}</td>
                <td className="font-sans text-xs font-semibold text-[#112D4E] uppercase">{h.month}</td>
                <td className="font-display font-bold text-base text-[#112D4E]">₹{h.amount}</td>
                <td>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    {h.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={async () => {
                      try {
                        const res = await paymentAPI.downloadInvoice(h.id)
                        const blob = new Blob([res.data], { type: 'application/pdf' })
                        const url = window.URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `invoice-${h.id}.pdf`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        window.URL.revokeObjectURL(url)
                        toast.success('Invoice downloaded')
                      } catch {
                        toast.error('Could not download invoice')
                      }
                    }}
                    className="text-[#3F72AF] hover:text-[#112D4E] p-1 rounded hover:bg-[#DBE2EF] transition-colors"
                    aria-label="Download invoice"
                  >
                    <DownloadIcon sx={{ fontSize: 18 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Courses Tab ───────────────────────────────────────────── */
function CoursesTab({ student }) {
  const courseDetails = student?.courseFeeDetails || []
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {(student?.courses || []).map((c, i) => {
        const detail = courseDetails.find(cd => cd.courseName?.toLowerCase() === c.toLowerCase() || cd.slug?.toLowerCase() === c.toLowerCase())
        const isPaid = detail ? detail.status === 'PAID' : (student.feeStatus === 'PAID')

        return (
          <div key={i} className="card-tma p-6 flex flex-col justify-between font-sans">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-display font-bold text-[#112D4E] text-xl uppercase tracking-tight">{c}</p>
                <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase ${
                  isPaid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {isPaid ? 'PAID ✓' : 'UNPAID ⏳'}
                </span>
              </div>
              <p className="font-sans text-xs text-[#3F72AF] font-semibold">{student.batchName}</p>
              <p className="font-sans text-xs text-[#112D4E]/70 mt-1">{student.days} · {student.time}</p>
            </div>
            {detail?.fee && (
              <div className="mt-4 pt-3 border-t border-[#DBE2EF] flex items-center justify-between text-xs font-sans text-[#112D4E]/70">
                <span>Monthly Fee</span>
                <span className="font-display font-bold text-[#112D4E] text-base">₹{detail.fee}/mo</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Attendance Tab ────────────────────────────────────────── */
function AttendanceTab({ attendance }) {
  if (!attendance?.length) return <div className="card-tma p-8 text-center text-xs font-sans text-[#112D4E]/60">No attendance records recorded yet.</div>
  const present = attendance.filter(a => a.status === 'PRESENT').length
  const pct = Math.round((present / attendance.length) * 100)
  return (
    <div className="space-y-6">
      <div className="card-tma p-6 flex items-center gap-6">
        <div className="w-16 h-16 rounded-xl bg-[#DBE2EF] flex items-center justify-center font-display text-3xl font-extrabold text-[#112D4E]">
          {pct}%
        </div>
        <div>
          <p className="font-display font-bold text-xl text-[#112D4E] uppercase tracking-tight">Attendance Rate</p>
          <p className="font-sans text-xs text-[#112D4E]/70 mt-0.5">{present} of {attendance.length} sessions attended</p>
        </div>
      </div>
      <div className="card-tma p-6">
        <p className="font-sans text-xs font-bold text-[#112D4E] uppercase tracking-wider mb-4 pb-2 border-b border-[#DBE2EF]">Daily Attendance Log</p>
        <div className="grid grid-cols-7 gap-2">
          {attendance.map(a => (
            <div
              key={a.date}
              title={`${a.date}: ${a.status}`}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-sans font-bold transition-all
                ${a.status === 'PRESENT' ? 'bg-[#DBE2EF] text-[#112D4E] border border-[#3F72AF]' : 'bg-[#F9F7F7] text-[#112D4E]/40 border border-[#DBE2EF]'}`}
            >
              {new Date(a.date).getDate()}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Notifications Tab ─────────────────────────────────────── */
function NotificationsTab({ notifications }) {
  if (!notifications?.length) return <div className="card-tma p-8 text-center text-xs font-sans text-[#112D4E]/60">No notifications yet.</div>
  return (
    <div className="space-y-3 font-sans">
      {notifications.map(n => (
        <div key={n.id} className={`p-5 rounded-lg border ${n.read ? 'bg-white border-[#DBE2EF]' : 'bg-[#DBE2EF]/40 border-[#3F72AF]'}`}>
          <p className="font-display font-bold text-base text-[#112D4E] uppercase mb-1 tracking-tight">{n.title}</p>
          <p className="font-sans text-xs text-[#112D4E]/80 leading-relaxed">{n.message}</p>
          <p className="font-sans text-[10px] text-[#112D4E]/50 mt-2">{n.date}</p>
        </div>
      ))}
    </div>
  )
}

/* ── Main Student Dashboard ────────────────────────────────── */
export default function StudentDashboard() {
  const { user, loading: authLoading, logout, clearSession } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'STUDENT')) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  // Automatically log out student whenever navigating away / leaving the Student Portal
  useEffect(() => {
    return () => {
      if (!window.location.pathname.startsWith('/student-dashboard')) {
        clearSession()
      }
    }
  }, [clearSession])
  const [student, setStudent]     = useState(null)
  const [due, setDue]             = useState(null)
  const [history, setHistory]     = useState([])
  const [attendance, setAttendance] = useState([])
  const [notifications, setNotifications] = useState([])
  const [sidebarPhotoError, setSidebarPhotoError] = useState(false)

  const reloadData = useCallback(async () => {
    try {
      const [profileRes] = await Promise.all([studentAPI.getProfile()])
      const s = profileRes.data
      setStudent(s)
      const [dueRes, historyRes, attendanceRes, notifRes] = await Promise.allSettled([
        paymentAPI.getDue(s.studentId),
        paymentAPI.getHistory(s.studentId),
        studentAPI.getAttendance(s.studentId),
        notificationAPI.getForStudent(s.studentId),
      ])
      if (dueRes.status === 'fulfilled') setDue(dueRes.value.data)
      if (historyRes.status === 'fulfilled') setHistory(historyRes.value.data || [])
      if (attendanceRes.status === 'fulfilled') setAttendance(attendanceRes.value.data || [])
      if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data || [])
    } catch (err) {
      console.error('Reload student error:', err)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [profileRes] = await Promise.all([studentAPI.getProfile()])
        if (!mounted) return
        const s = profileRes.data
        setStudent(s)
        const [dueRes, historyRes, attendanceRes, notifRes] = await Promise.allSettled([
          paymentAPI.getDue(s.studentId),
          paymentAPI.getHistory(s.studentId),
          studentAPI.getAttendance(s.studentId),
          notificationAPI.getForStudent(s.studentId),
        ])
        if (!mounted) return
        if (dueRes.status === 'fulfilled') setDue(dueRes.value.data)
        if (historyRes.status === 'fulfilled') setHistory(historyRes.value.data || [])
        if (attendanceRes.status === 'fulfilled') setAttendance(attendanceRes.value.data || [])
        if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data || [])
      } catch {
        toast.error('Could not load student profile. Please login again.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <PageLoader />
  if (!student) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F7]">
      <p className="font-sans text-xs text-[#112D4E]/70">Unable to load profile.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F9F7F7] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-[#DBE2EF] flex-shrink-0">
        <div className="p-6 border-b border-[#DBE2EF] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#112D4E] flex items-center justify-center font-display font-black text-white text-lg overflow-hidden flex-shrink-0 border border-[#DBE2EF]">
            {student.photo && !sidebarPhotoError ? (
              <img
                src={getFullPhotoUrl(student.photo)}
                alt={student.name}
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                onError={() => setSidebarPhotoError(true)}
              />
            ) : (
              student.name?.[0]?.toUpperCase() || 'T'
            )}
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-[#112D4E] text-base uppercase truncate">
              {student.name}
            </p>
            <p className="font-sans text-[#3F72AF] text-[11px] font-semibold">
              {student.studentId}
            </p>
          </div>
        </div>

        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded font-sans text-xs uppercase tracking-wider whitespace-nowrap transition-all duration-150 ${
                  active
                    ? 'bg-[#DBE2EF] text-[#112D4E] font-bold border-l-4 border-[#3F72AF]'
                    : 'text-[#112D4E]/80 font-medium hover:text-[#3F72AF] hover:bg-[#F9F7F7]'
                }`}
              >
                <Icon sx={{ fontSize: 18, color: active ? '#3F72AF' : '#8CA0B8' }} />
                <span>{tab.label}</span>
              </button>
            )
          })}

          <div className="pt-4 mt-4 border-t border-[#DBE2EF]">
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded font-sans text-xs uppercase tracking-wider font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogoutIcon sx={{ fontSize: 18, color: '#DC2626' }} />
              <span>Log Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile'       && <ProfileTab student={student} />}
            {activeTab === 'id-card'        && <IDCardGenerator student={student} />}
            {activeTab === 'fees'           && <FeesTab due={due} student={student} onPaymentSuccess={reloadData} />}
            {activeTab === 'history'        && <HistoryTab history={history} />}
            {activeTab === 'courses'        && <CoursesTab student={student} />}
            {activeTab === 'attendance'     && <AttendanceTab attendance={attendance} />}
            {activeTab === 'notifications'  && <NotificationsTab notifications={notifications} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
