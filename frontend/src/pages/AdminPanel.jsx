import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import SchoolIcon from '@mui/icons-material/School'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import BadgeIcon from '@mui/icons-material/Badge'
import PaymentsIcon from '@mui/icons-material/Payments'
import MailIcon from '@mui/icons-material/Mail'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DownloadIcon from '@mui/icons-material/Download'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import VideocamIcon from '@mui/icons-material/Videocam'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import LinkIcon from '@mui/icons-material/Link'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import PrintIcon from '@mui/icons-material/Print'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ImageIcon from '@mui/icons-material/Image'
import { useAuth } from '../context/AuthContext.jsx'
import {
  adminAPI, studentAPI, paymentAPI, galleryAPI, trainerAPI,
  contactAPI, courseAPI, batchAPI,
} from '../services/api.js'
import {
  downloadStudentsExcel, downloadStudentsPDF, downloadPaymentsPDF,
} from '../utils/exportUtils.js'
import { COURSES, getAllCoursesMerged, saveCustomCourse, deleteCourse, restoreDefaultCourses, getDeletedCourses } from '../data/courses.js'
import { BATCHES } from '../data/batches.js'
import { GALLERY_CATEGORIES } from '../data/gallery.js'
import { getImageUrl, isVideoItem, getVideoEmbedInfo, MediaThumbnail } from './Gallery.jsx'

const NAV = [
  { key: 'dashboard',  label: 'Dashboard',        icon: DashboardIcon },
  { key: 'students',   label: 'Students',          icon: GroupIcon },
  { key: 'courses',    label: 'Courses',           icon: SchoolIcon },
  { key: 'batches',    label: 'Batches',           icon: CalendarMonthIcon },
  { key: 'gallery',    label: 'Gallery',           icon: PhotoLibraryIcon },
  { key: 'trainers',   label: 'Trainers',          icon: BadgeIcon },
  { key: 'payments',   label: 'Fee Management',    icon: PaymentsIcon },
  { key: 'messages',   label: 'Contact Messages',  icon: MailIcon },
  { key: 'reports',    label: 'Reports & Analytics', icon: AssessmentIcon },
]

/* Generic async loader hook to keep tabs short */
function useAsync(fetcher, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const reload = useCallback(() => {
    setLoading(true)
    fetcher()
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { reload() }, [reload])
  return { data, loading, error, reload }
}

/* ── Dashboard tab ────────────────────────────────────────────── */
function DashboardTab() {
  const { data, loading } = useAsync(() => adminAPI.getDashboard())

  const stats = data || { totalStudents: 0, totalRevenue: 0, monthlyRevenue: 0, pendingPayments: 0 }
  const revenueTrend = data?.revenueTrend || []
  const enrollmentByBatch = data?.enrollmentByBatch || BATCHES.map(b => ({ name: b.name.split(' ')[0], students: 0 }))

  const STAT_CARDS = [
    { label: 'Total Students',    value: stats.totalStudents,                  icon: GroupIcon,    prefix: '',  color: 'text-blue-600',  bg: 'bg-blue-50' },
    { label: 'Total Revenue',     value: stats.totalRevenue,                   icon: PaymentsIcon, prefix: '₹', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Monthly Revenue',   value: stats.monthlyRevenue,                 icon: PaymentsIcon, prefix: '₹', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Pending Payments',  value: stats.pendingPayments,                icon: PaymentsIcon, prefix: '',  color: 'text-rose-600',  bg: 'bg-rose-50' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="card-light p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon sx={{ fontSize: 24 }} className={card.color} />
                </div>
              </div>
              <p className="font-display text-3xl font-extrabold text-slate-900 leading-none">
                {loading ? '—' : `${card.prefix}${(card.value ?? 0).toLocaleString('en-IN')}`}
              </p>
              <p className="font-inter text-xs text-slate-500 mt-1 font-medium tracking-wide">{card.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-light p-6">
          <h3 className="font-display text-slate-900 font-bold text-base uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span> Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" fill="url(#gold)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card-light p-6">
          <h3 className="font-display text-slate-900 font-bold text-base uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span> Enrollment by Batch
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={enrollmentByBatch}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)' }} />
              <Bar dataKey="students" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

/* ── Aadhaar Card Viewer Modal ────────────────────────────────────── */
function AadhaarViewerModal({ student, onClose, onAadhaarUpdated }) {
  const [uploading, setUploading] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  if (!student) return null

  const aadhaarUrl = student.aadhaarPdfUrl ? getImageUrl(student.aadhaarPdfUrl) : ''
  const isPdf = aadhaarUrl.toLowerCase().includes('.pdf') || aadhaarUrl.toLowerCase().includes('/pdf')
  const ext = isPdf ? 'pdf' : (aadhaarUrl.split('.').pop()?.split('?')[0] || 'jpg')
  const cleanName = (student.name || 'Student').replace(/[^a-zA-Z0-9_-]/g, '_')
  const downloadFileName = `${student.studentId || 'STUDENT'}_${cleanName}_Aadhaar.${ext}`

  const handleZoomIn = () => setZoom(z => Math.min(Number((z + 0.25).toFixed(2)), 3))
  const handleZoomOut = () => setZoom(z => Math.max(Number((z - 0.25).toFixed(2)), 0.5))
  const handleRotate = () => setRotation(r => (r + 90) % 360)
  const handleReset = () => { setZoom(1); setRotation(0) }

  const handleFileUpload = async (file) => {
    if (!file) return
    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size must be under 15MB')
      return
    }

    const fd = new FormData()
    fd.append('aadhaarPdf', file)

    setUploading(true)
    try {
      const res = await studentAPI.uploadAadhaar(student.id, fd)
      toast.success('Aadhaar document uploaded successfully!')
      setZoom(1)
      setRotation(0)
      if (onAadhaarUpdated) {
        onAadhaarUpdated(res.data)
      }
    } catch (err) {
      console.error('Upload aadhaar error:', err)
      toast.error(err?.response?.data?.message || 'Failed to upload Aadhaar document')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(aadhaarUrl)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = downloadFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
      toast.success('Download started')
    } catch {
      const a = document.createElement('a')
      a.href = aadhaarUrl
      a.target = '_blank'
      a.download = downloadFileName
      a.click()
    }
  }

  const handlePrint = () => {
    const printWindow = window.open(aadhaarUrl, '_blank')
    if (printWindow) {
      printWindow.focus()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-linear-to-r from-slate-50 to-blue-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
              <BadgeIcon sx={{ fontSize: 24 }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-extrabold text-slate-900 text-lg uppercase tracking-tight">
                  Aadhaar Card / ID Proof
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                  {student.studentId}
                </span>
                {aadhaarUrl && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isPdf ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {isPdf ? <PictureAsPdfIcon sx={{ fontSize: 13 }} /> : <ImageIcon sx={{ fontSize: 13 }} />}
                    {isPdf ? 'PDF Document' : 'Image File'}
                  </span>
                )}
              </div>
              <p className="font-inter text-xs text-slate-500 mt-0.5">
                Student: <strong className="text-slate-800 font-semibold">{student.name}</strong> · Mobile: <span className="text-slate-700 font-medium">{student.mobile}</span>
                {student.batchName ? ` · Batch: ${student.batchName}` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
            title="Close viewer"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Modal Controls Bar for Document Viewing */}
        {aadhaarUrl && (
          <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="text-slate-400">Preview:</span>
              <span className="text-slate-700 font-bold truncate max-w-[200px] sm:max-w-[300px]">
                {downloadFileName}
              </span>
            </div>

            {/* Image zoom & rotate controls */}
            {!isPdf && (
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  title="Zoom Out"
                  className="p-1 rounded text-slate-600 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  <ZoomOutIcon sx={{ fontSize: 18 }} />
                </button>
                <span className="text-[11px] font-bold text-slate-600 min-w-[42px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  title="Zoom In"
                  className="p-1 rounded text-slate-600 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  <ZoomInIcon sx={{ fontSize: 18 }} />
                </button>
                <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={handleRotate}
                  title="Rotate 90° Clockwise"
                  className="p-1 rounded text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                >
                  <RotateRightIcon sx={{ fontSize: 18 }} />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset Zoom & Rotation"
                  className="p-1 rounded text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                >
                  <RestartAltIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Body / Viewer Canvas */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100/90 flex flex-col items-center justify-center min-h-[420px] max-h-[65vh]">
          {aadhaarUrl ? (
            isPdf ? (
              <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-300 bg-white shadow-sm flex flex-col">
                <object
                  data={aadhaarUrl}
                  type="application/pdf"
                  className="w-full h-full min-h-[500px] flex-1 border-0"
                >
                  <iframe
                    src={aadhaarUrl}
                    title={`${student.name} Aadhaar PDF`}
                    className="w-full h-full min-h-[500px] border-0"
                  >
                    <div className="p-8 text-center bg-white flex flex-col items-center justify-center">
                      <PictureAsPdfIcon sx={{ fontSize: 48, color: '#DC2626' }} className="mb-2" />
                      <p className="text-sm font-bold text-slate-800">PDF Document Ready</p>
                      <p className="text-xs text-slate-500 mb-4">Click below to view or download</p>
                      <a
                        href={aadhaarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Open PDF in New Window
                      </a>
                    </div>
                  </iframe>
                </object>
              </div>
            ) : (
              <div className="w-full h-full min-h-[460px] overflow-auto flex items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <img
                  src={aadhaarUrl}
                  alt={`${student.name} Aadhaar`}
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease',
                  }}
                  className="max-h-[480px] w-auto max-w-full object-contain rounded-lg shadow-sm select-none"
                />
              </div>
            )
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`w-full max-w-lg p-8 rounded-2xl border-2 border-dashed transition-all text-center ${
                isDragOver ? 'border-blue-500 bg-blue-50/70 scale-[1.01]' : 'border-slate-300 bg-white shadow-xs'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                <BadgeIcon sx={{ fontSize: 36 }} />
              </div>
              <h4 className="font-display font-extrabold text-slate-800 text-lg uppercase tracking-tight mb-1.5">
                No Aadhaar Card Uploaded
              </h4>
              <p className="font-inter text-xs text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
                This student did not upload an Aadhaar card file during online registration.
                You can drag and drop or browse below to upload an Aadhaar scan or ID proof (PDF or Image) now.
              </p>

              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#3F72AF] hover:bg-[#112D4E] text-white shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <CloudUploadIcon sx={{ fontSize: 18 }} />
                {uploading ? 'Uploading Aadhaar...' : 'Upload Aadhaar File (PDF / Image)'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files?.[0])}
              accept="image/*,.pdf"
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CloudUploadIcon sx={{ fontSize: 16, color: '#3F72AF' }} />
              {uploading ? 'Uploading...' : aadhaarUrl ? 'Replace Aadhaar File' : 'Upload Aadhaar File'}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {aadhaarUrl && (
              <>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  title="Print Document"
                >
                  <PrintIcon sx={{ fontSize: 16 }} />
                  Print
                </button>
                <a
                  href={aadhaarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                  Open in New Tab
                </a>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#3F72AF] hover:bg-[#112D4E] text-white transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <DownloadIcon sx={{ fontSize: 16 }} />
                  Download
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Edit Student Modal ────────────────────────────────────────── */
function EditStudentModal({ student, onClose, onSaved }) {
  const [name, setName] = useState(student?.name || '')
  const [mobile, setMobile] = useState(student?.mobile || '')
  const [dob, setDob] = useState(student?.dob || '')
  const [joiningDate, setJoiningDate] = useState(student?.joiningDate || '')
  const [selectedCourses, setSelectedCourses] = useState(student?.courses || [])
  const [batchName, setBatchName] = useState(student?.batchName || BATCHES[0]?.name)
  const [newPassword, setNewPassword] = useState('')
  const [viewingAadhaar, setViewingAadhaar] = useState(false)
  const [saving, setSaving] = useState(false)
  const [coursesList, setCoursesList] = useState(COURSES)

  useEffect(() => {
    courseAPI.getAll()
      .then(res => {
        if (res.data && res.data.length > 0) {
          const merged = COURSES.map(sc => {
            const apiC = res.data.find(ac => ac.slug?.toLowerCase() === sc.slug?.toLowerCase() || ac.id === sc.id)
            return apiC ? { ...sc, ...apiC, feePerMonth: apiC.feePerMonth ?? sc.feePerMonth } : sc
          })
          setCoursesList(merged)
        }
      })
      .catch(err => console.error('Error fetching courses in modal:', err))
  }, [])

  // Paid fee for current month from backend
  const paidFee = student?.paidFee ?? (student?.feeStatus === 'PAID' ? (student?.monthlyFee || 0) : 0)

  // Calculate monthly fee dynamically from selected courses
  const calculatedFee = selectedCourses.reduce((sum, cName) => {
    const courseObj = coursesList.find(
      c => c.name.toLowerCase() === cName.toLowerCase() || c.slug.toLowerCase() === cName.toLowerCase()
    )
    return sum + (courseObj?.feePerMonth || 300)
  }, 0)

  const dueAmount = Math.max(0, calculatedFee - paidFee)
  const [feeStatus, setFeeStatus] = useState(() => {
    if (dueAmount > 0) return 'PENDING'
    return student?.feeStatus || 'PAID'
  })

  // When selected courses change, auto-adjust feeStatus if there are unpaid courses
  const toggleCourse = (course) => {
    setSelectedCourses(prev => {
      const exists = prev.some(
        c => c.toLowerCase() === course.name.toLowerCase() || c.toLowerCase() === course.slug.toLowerCase()
      )
      let nextCourses
      if (exists) {
        if (prev.length <= 1) {
          toast.error('Student must be enrolled in at least one course')
          return prev
        }
        nextCourses = prev.filter(
          c => c.toLowerCase() !== course.name.toLowerCase() && c.toLowerCase() !== course.slug.toLowerCase()
        )
      } else {
        nextCourses = [...prev, course.name]
      }

      // Check if new courses cause dues
      const newCalculatedFee = nextCourses.reduce((sum, cName) => {
        const cObj = coursesList.find(
          c => c.name.toLowerCase() === cName.toLowerCase() || c.slug.toLowerCase() === cName.toLowerCase()
        )
        return sum + (cObj?.feePerMonth || 300)
      }, 0)

      if (newCalculatedFee > paidFee) {
        setFeeStatus('PENDING')
      } else {
        setFeeStatus('PAID')
      }

      return nextCourses
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter student name')
      return
    }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile.trim())) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }
    if (selectedCourses.length === 0) {
      toast.error('Please select at least one course')
      return
    }

    setSaving(true)
    try {
      await studentAPI.update(student.id, {
        name: name.trim(),
        mobile: mobile.trim(),
        dob: dob || null,
        joiningDate: joiningDate || null,
        courses: selectedCourses,
        batchName: batchName,
        feeStatus: feeStatus,
      })

      if (newPassword && newPassword.trim()) {
        if (newPassword.trim().length < 6) {
          toast.error('New password must be at least 6 characters')
          setSaving(false)
          return
        }
        await studentAPI.resetPassword(student.id, newPassword.trim())
      }

      toast.success('Student details updated successfully!')
      onSaved()
    } catch (err) {
      console.error('Update student error:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update student'
      toast.error(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
              <EditIcon sx={{ fontSize: 20 }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-slate-800 text-lg uppercase tracking-tight">Edit Student Details</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  {student.studentId}
                </span>
              </div>
              <p className="font-inter text-xs text-slate-400">Modify student information, batch, and course enrollment</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Personal Info Grid */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-teal-700 uppercase mb-3 flex items-center gap-1.5">
              <span>👤</span> Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Student Full Name"
                  className="input-dark"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="input-dark"
                  maxLength={10}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Joining Date
                </label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={e => setJoiningDate(e.target.value)}
                  className="input-dark"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Set / Reset Student Portal Password (Optional)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password to reset (min. 6 characters, leave blank to keep unchanged)"
                  className="input-dark text-xs"
                />
              </div>
            </div>
          </div>

          {/* Aadhaar / Identity Verification Documents */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold tracking-wider text-slate-700 uppercase flex items-center gap-1.5">
                <BadgeIcon sx={{ fontSize: 16, color: '#2563EB' }} /> Aadhaar Card / Identity Proof
              </h4>
              {student?.aadhaarPdfUrl ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Document On File
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Pending Upload
                </span>
              )}
            </div>

            {student?.aadhaarPdfUrl ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <BadgeIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {student.studentId}_Aadhaar_Proof
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      Uploaded student verification document
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewingAadhaar(true)}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <VisibilityIcon sx={{ fontSize: 15 }} /> View Card
                  </button>
                  <a
                    href={getImageUrl(student.aadhaarPdfUrl)}
                    download={`${student.studentId}_Aadhaar`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 inline-flex items-center gap-1 transition-colors"
                  >
                    <DownloadIcon sx={{ fontSize: 14 }} /> Download
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No Aadhaar card document was submitted during admission for this student.
              </p>
            )}

            {/* Admin Upload / Replace Option */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {student?.aadhaarPdfUrl ? 'Replace existing Aadhaar file:' : 'Upload Aadhaar document:'}
              </span>
              <label className="cursor-pointer px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 inline-flex items-center gap-1.5 shadow-2xs transition-colors">
                <CloudUploadIcon sx={{ fontSize: 15, color: '#2563EB' }} />
                <span>Upload Document (PDF/Image)</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const fd = new FormData()
                    fd.append('aadhaarPdf', file)
                    try {
                      const res = await studentAPI.uploadAadhaar(student.id, fd)
                      student.aadhaarPdfUrl = res.data.aadhaarPdfUrl
                      toast.success('Aadhaar document updated successfully!')
                      if (onSaved) onSaved()
                    } catch (err) {
                      toast.error(err?.response?.data?.message || 'Failed to upload document')
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Courses Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold tracking-wider text-teal-700 uppercase flex items-center gap-1.5">
                <span>🥋</span> Enrolled Courses <span className="text-red-500">*</span>
              </h4>
              <span className="text-xs font-semibold text-slate-500">
                Monthly Total: <strong className="text-teal-700 font-bold">₹{calculatedFee}</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {coursesList.map(course => {
                const isSelected = selectedCourses.some(
                  c => c.toLowerCase() === course.name.toLowerCase() || c.toLowerCase() === course.slug.toLowerCase()
                )
                const isOriginallyEnrolled = (student?.courses || []).some(
                  c => c.toLowerCase() === course.name.toLowerCase() || c.toLowerCase() === course.slug.toLowerCase()
                )
                const isPreviouslyPaid = isOriginallyEnrolled && paidFee >= (course.feePerMonth || 300)

                return (
                  <button
                    key={course.slug}
                    type="button"
                    onClick={() => toggleCourse(course)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all relative ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 text-teal-900 font-semibold shadow-sm ring-1 ring-teal-500'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">{course.icon}</span>
                    <div className="truncate flex-1 min-w-0">
                      <p className="truncate font-medium">{course.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-500">₹{course.feePerMonth}/mo</span>
                        {isSelected && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            isPreviouslyPaid
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}>
                            {isPreviouslyPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Fee Calculation Summary Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Fee Summary Breakdown:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                dueAmount > 0
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}>
                {dueAmount > 0 ? `₹${dueAmount} Unpaid / Due` : 'Fully Paid ✓'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-400">Total Fee</p>
                <p className="font-bold text-slate-800">₹{calculatedFee}</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-400">Paid This Month</p>
                <p className="font-bold text-emerald-700">₹{paidFee}</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-400">Remaining Due</p>
                <p className={`font-bold ${dueAmount > 0 ? 'text-amber-700' : 'text-slate-700'}`}>₹{dueAmount}</p>
              </div>
            </div>
            {dueAmount > 0 && (
              <p className="text-[11px] text-amber-700 italic">
                * Adding new course(s) leaves the new course fee unpaid until settled online or marked paid below.
              </p>
            )}
          </div>

          {/* Batch & Fee Status Grid */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-teal-700 uppercase mb-3 flex items-center gap-1.5">
              <span>📅</span> Batch & Payment Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Assigned Batch
                </label>
                <select
                  value={batchName}
                  onChange={e => setBatchName(e.target.value)}
                  className="input-dark"
                >
                  {BATCHES.map(b => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.daysShort?.join(', ') || b.days})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Current Month Fee Status
                </label>
                <select
                  value={feeStatus}
                  onChange={e => setFeeStatus(e.target.value)}
                  className="input-dark"
                >
                  <option value="PAID">PAID (All Courses Paid)</option>
                  <option value="PENDING">PENDING (Unpaid / Due: ₹{dueAmount})</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  {feeStatus === 'PAID' && dueAmount > 0
                    ? `Saving as PAID will record manual payment of ₹${dueAmount}.`
                    : feeStatus === 'PENDING'
                    ? `Student can pay the ₹${dueAmount} due online.`
                    : 'All enrolled course fees are covered.'}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="btn-secondary py-2.5 px-5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="animate-spin text-sm">⏳</span> Saving...
                </>
              ) : (
                <>
                  <SaveIcon sx={{ fontSize: 16 }} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {viewingAadhaar && (
          <AadhaarViewerModal
            student={student}
            onClose={() => setViewingAadhaar(false)}
            onAadhaarUpdated={(updated) => {
              student.aadhaarPdfUrl = updated.aadhaarPdfUrl
              if (onSaved) onSaved()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Students tab ─────────────────────────────────────────────── */
function StudentsTab() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [editingStudent, setEditingStudent] = useState(null)
  const [viewingAadhaarStudent, setViewingAadhaarStudent] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const { data, loading, reload } = useAsync(() => studentAPI.getAll({ q: search, page }), [search, page])
  const students = data?.content || []

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this student record? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await studentAPI.delete(id)
      toast.success('Student removed successfully')
      reload()
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Could not remove student'
      toast.error(errorMsg)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative w-full sm:w-72">
          <SearchIcon sx={{ fontSize: 18, color: '#6B6B6B' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…" className="input-dark pl-10" />
        </div>
        <button onClick={() => downloadStudentsExcel(studentAPI)} className="btn-gold">
          <DownloadIcon sx={{ fontSize: 16 }} /> EXPORT EXCEL
        </button>
      </div>

      <div className="overflow-x-auto card-dark">
        <table className="w-full admin-table">
          <thead>
            <tr>
              <th className="text-left">Student ID</th>
              <th className="text-left">Name</th>
              <th className="text-left">Mobile</th>
              <th className="text-left">Joining Date</th>
              <th className="text-left">Courses</th>
              <th className="text-left">Batch</th>
              <th className="text-left">Aadhaar Card</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={9} className="text-center py-8 text-gray-500">Loading…</td></tr>}
            {!loading && students.length === 0 && <tr><td colSpan={9} className="text-center py-8 text-gray-500">No students found.</td></tr>}
            {students.map(s => (
              <tr key={s.id}>
                <td className="text-gold-500 font-semibold">{s.studentId}</td>
                <td className="font-medium text-slate-800">{s.name}</td>
                <td>{s.mobile}</td>
                <td className="text-xs text-slate-600 whitespace-nowrap">{s.joiningDate || '—'}</td>
                <td className="max-w-[180px]">
                  <div className="flex flex-wrap gap-1">
                    {(s.courseFeeDetails && s.courseFeeDetails.length > 0) ? (
                      s.courseFeeDetails.map((c, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                            c.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                          title={`${c.courseName}: ₹${c.fee} (${c.status})`}
                        >
                          {c.courseName}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-600 truncate">{s.courses?.join(', ')}</span>
                    )}
                  </div>
                </td>
                <td>{s.batchName}</td>
                <td className="whitespace-nowrap">
                  {s.aadhaarPdfUrl ? (
                    <button
                      type="button"
                      onClick={() => setViewingAadhaarStudent(s)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all shadow-2xs group cursor-pointer"
                      title={`View ${s.name}'s Aadhaar Card`}
                    >
                      <BadgeIcon sx={{ fontSize: 16 }} className="text-blue-600 group-hover:scale-110 transition-transform" />
                      <span>View Aadhaar</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-wider uppercase ${
                        s.aadhaarPdfUrl.toLowerCase().includes('.pdf')
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-blue-200/80 text-blue-800'
                      }`}>
                        {s.aadhaarPdfUrl.toLowerCase().includes('.pdf') ? 'PDF' : 'IMG'}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setViewingAadhaarStudent(s)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-blue-700 bg-slate-100/70 hover:bg-blue-50 border border-dashed border-slate-300 hover:border-blue-300 transition-all cursor-pointer"
                      title="No document submitted · Click to upload Aadhaar"
                    >
                      <CloudUploadIcon sx={{ fontSize: 14 }} className="text-slate-400" />
                      <span className="text-[11px]">+ Upload</span>
                    </button>
                  )}
                </td>
                <td>
                  {s.feeStatus === 'PAID' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> PAID
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> UNPAID {s.dueFee ? `(₹${s.dueFee})` : ''}
                    </span>
                  )}
                </td>
                <td className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(s)}
                    title="Edit Student"
                    className="p-1 rounded text-teal-700 hover:text-teal-900 hover:bg-teal-50 transition-colors cursor-pointer"
                  >
                    <EditIcon sx={{ fontSize: 18 }} />
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === s.id}
                    onClick={() => handleDelete(s.id)}
                    title="Delete Student"
                    className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {deletingId === s.id ? (
                      <span className="inline-block w-[18px] h-[18px] border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-4 py-2 border border-martial-border text-xs text-gray-400 disabled:opacity-40">Prev</button>
        <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 border border-martial-border text-xs text-gray-400">Next</button>
      </div>

      <AnimatePresence>
        {editingStudent && (
          <EditStudentModal
            student={editingStudent}
            onClose={() => setEditingStudent(null)}
            onSaved={() => {
              setEditingStudent(null)
              reload()
            }}
          />
        )}
        {viewingAadhaarStudent && (
          <AadhaarViewerModal
            student={viewingAadhaarStudent}
            onClose={() => setViewingAadhaarStudent(null)}
            onAadhaarUpdated={(updatedStudent) => {
              setViewingAadhaarStudent(updatedStudent)
              reload()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Add / Edit Course Modal ────────────────────────────────────── */
function CourseModal({ course, onClose, onSaved }) {
  const isEdit = Boolean(course)
  const [name, setName] = useState(course?.name || '')
  const [slug, setSlug] = useState(course?.slug || '')
  const [feePerMonth, setFeePerMonth] = useState(course?.feePerMonth ?? 300)
  const [category, setCategory] = useState(course?.category || 'martial-arts')
  const [batchId, setBatchId] = useState(course?.batch?.id || course?.batchId || 1)
  const [icon, setIcon] = useState(course?.icon || '🥋')
  const [imageUrl, setImageUrl] = useState(course?.imageUrl || '')
  const [tagline, setTagline] = useState(course?.tagline || '')
  const [overview, setOverview] = useState(course?.overview || '')
  const [benefitsText, setBenefitsText] = useState(() => {
    if (Array.isArray(course?.benefits)) return course.benefits.join('\n')
    return course?.benefits || ''
  })
  const [curriculumStages, setCurriculumStages] = useState(() => {
    if (Array.isArray(course?.curriculum) && course.curriculum.length > 0) {
      return course.curriculum
    }
    return [
      { stage: 'Stage 1: Fundamentals', focus: 'Basic stances, foundational movements & discipline' },
      { stage: 'Stage 2: Technical Drills', focus: 'Combative sequences, counter-drills & agility' },
      { stage: 'Stage 3: Advanced Mastery', focus: 'High-level sparring, tactics & certification' },
    ]
  })
  const [activeTab, setActiveTab] = useState('basic') // 'basic', 'content', 'curriculum'
  const [saving, setSaving] = useState(false)

  const EMOJI_PALETTE = ['🥋', '🥊', '🥢', '🧘', '💪', '🎸', '♟️', '🏹', '⚔️', '🛡️', '🎯', '🏆', '🥇', '🔤', '📚', '🏅', '⚡']

  const handleNameChange = (e) => {
    const val = e.target.value
    setName(val)
    if (!isEdit) {
      const generatedSlug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setSlug(generatedSlug)
      if (!tagline) setTagline(`Master the art and discipline of ${val}`)
      if (!overview) setOverview(`Our comprehensive ${val} program at Thillai Martial Arts Club is designed to develop physical power, mental focus, athletic conditioning, and authentic martial discipline under certified master instructors.`)
      if (!benefitsText) {
        setBenefitsText(
          `Develops explosive physical agility, power and situational awareness\n` +
          `Builds superior cardiovascular endurance and athletic fitness\n` +
          `Cultivates unwavering mental discipline and focus under pressure\n` +
          `Opens pathways to state, national championships and certified grading`
        )
      }
    }
  }

  const handleCurriculumChange = (index, field, value) => {
    setCurriculumStages(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const handleAddStage = () => {
    setCurriculumStages(prev => [
      ...prev,
      { stage: `Stage ${prev.length + 1}`, focus: 'New progression level focus' }
    ])
  }

  const handleRemoveStage = (index) => {
    if (curriculumStages.length <= 1) return
    setCurriculumStages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Course name is required')
      return
    }
    const finalSlug = (slug.trim() || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '')
    if (!finalSlug) {
      toast.error('A valid slug identifier is required')
      return
    }
    if (feePerMonth === '' || Number(feePerMonth) < 0) {
      toast.error('Please enter a valid monthly fee')
      return
    }

    const benefitsList = benefitsText
      .split('\n')
      .map(b => b.trim())
      .filter(Boolean)

    const payload = {
      id: course?.id || Date.now(),
      slug: finalSlug,
      name: name.trim(),
      category,
      feePerMonth: Number(feePerMonth),
      batchId: Number(batchId),
      icon: icon.trim() || '🥋',
      imageUrl: imageUrl.trim() || (course?.imageUrl || `/images/courses/${finalSlug}.jpg`),
      tagline: tagline.trim() || `${name} Training Program`,
      overview: overview.trim() || `Comprehensive ${name} coaching at Thillai Martial Arts Club.`,
      benefits: benefitsList.length > 0 ? benefitsList : [
        'Builds stamina, strength, and agility',
        'Certified instructor coaching',
        'Official academy certification',
      ],
      curriculum: curriculumStages.filter(c => c.stage && c.focus),
      isCustom: true,
    }

    setSaving(true)
    try {
      saveCustomCourse(payload)

      try {
        if (isEdit && course?.id && typeof course.id === 'number' && course.id < 10000000000) {
          await courseAPI.update(course.id, payload)
        } else {
          await courseAPI.create(payload)
        }
      } catch (apiErr) {
        console.warn('Backend API note:', apiErr?.message)
      }

      toast.success(isEdit ? `Course "${name}" updated!` : `Course "${name}" created successfully!`)
      onSaved()
    } catch (err) {
      console.error('Course save error:', err)
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save course')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center text-2xl font-bold">
              {icon}
            </div>
            <div>
              <h3 className="font-display font-extrabold text-slate-900 text-xl uppercase tracking-tight">
                {isEdit ? 'Edit Course & Curriculum' : 'Add New Training Discipline'}
              </h3>
              <p className="font-sans text-xs text-slate-500">
                {isEdit ? `Editing details for ${course.name}` : 'Configure full curriculum, batch, fees, and training details'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/40 gap-4">
          {[
            { key: 'basic', label: '1. Basic Info & Fee' },
            { key: 'content', label: '2. Overview & Benefits' },
            { key: 'curriculum', label: '3. Curriculum Stages' },
          ].map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors -mb-[2px] ${
                activeTab === t.key
                  ? 'border-teal-600 text-teal-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="e.g. Krav Maga, Archery, Karate"
                    className="input-dark font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    URL Slug Identifier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="e.g. krav-maga"
                    className="input-dark font-sans"
                    required
                  />
                  <span className="text-[11px] text-slate-400">Preview: /training/{slug || '...'}</span>
                </div>
              </div>

              {/* Emoji Icon Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Course Icon / Symbol
                </label>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {EMOJI_PALETTE.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                        icon === emoji
                          ? 'bg-teal-600 text-white shadow-sm scale-110'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                    placeholder="Custom"
                    maxLength={4}
                    className="w-16 h-9 px-2 text-center text-base rounded-lg border border-slate-300 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="input-dark font-sans"
                  >
                    <option value="martial-arts">🥋 Martial Arts</option>
                    <option value="wellness">🧘 Health & Yoga</option>
                    <option value="creative">♟️ Creative & Mind</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Assigned Batch <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={batchId}
                    onChange={e => setBatchId(Number(e.target.value))}
                    className="input-dark font-sans"
                  >
                    {BATCHES.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Monthly Fee (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-teal-700 text-sm">₹</span>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={feePerMonth}
                      onChange={e => setFeePerMonth(e.target.value)}
                      placeholder="300"
                      className="input-dark pl-8 font-display font-bold text-teal-900 text-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="e.g. The Art of Tactical Combat Defense & Fitness"
                  className="input-dark font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Program Image URL / Path
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder={`/images/courses/${slug || 'discipline'}.jpg or https://...`}
                    className="input-dark font-sans flex-1"
                  />
                  <div className="w-14 h-10 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 bg-slate-100 shadow-2xs">
                    <img
                      src={imageUrl || `/images/courses/${slug || 'taekwondo'}.jpg`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={e => {
                        const cur = e.target.src
                        if (cur.endsWith('.jpg')) {
                          e.target.src = `/images/courses/${slug || 'taekwondo'}.webp`
                        } else {
                          e.target.style.display = 'none'
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                        }
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center text-sm bg-teal-50 text-teal-800">
                      {icon || '🥋'}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Default: <code className="text-teal-700">/images/courses/{slug || 'discipline'}.jpg</code>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Program Overview &amp; Description
                </label>
                <textarea
                  rows={4}
                  value={overview}
                  onChange={e => setOverview(e.target.value)}
                  placeholder="Explain the background, training philosophy, techniques, and what students will experience..."
                  className="input-dark font-sans resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">This text appears on the Training catalogue card and the Course Details overview.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Key Training Benefits (One per line)
                </label>
                <textarea
                  rows={5}
                  value={benefitsText}
                  onChange={e => setBenefitsText(e.target.value)}
                  placeholder="Improves cardiovascular stamina&#10;Develops tactical self-defense reflexes&#10;Builds mental resilience and emotional composure&#10;Prepares for tournament belts &amp; certificates"
                  className="input-dark font-sans resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Each line will be displayed with a verified checkmark badge on the course details page.</p>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-slate-800 text-base uppercase">Curriculum &amp; Progression Stages</h4>
                  <p className="font-sans text-xs text-slate-500">Define the belt stages or learning modules students will master.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="px-3 py-1.5 rounded-lg border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <AddIcon sx={{ fontSize: 16 }} /> Add Stage
                </button>
              </div>

              <div className="space-y-3">
                {curriculumStages.map((stageItem, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-display font-bold text-sm flex items-center justify-center flex-shrink-0 mt-1">
                      {idx + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Stage Title</label>
                        <input
                          type="text"
                          value={stageItem.stage}
                          onChange={e => handleCurriculumChange(idx, 'stage', e.target.value)}
                          placeholder="e.g. Stage 1: White Belt"
                          className="input-dark !py-1.5 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Training Focus</label>
                        <input
                          type="text"
                          value={stageItem.focus}
                          onChange={e => handleCurriculumChange(idx, 'focus', e.target.value)}
                          placeholder="e.g. Basic stances, footwork & balance"
                          className="input-dark !py-1.5 text-xs"
                        />
                      </div>
                    </div>
                    {curriculumStages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStage(idx)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors mt-4"
                        title="Remove stage"
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-6">
            <div className="flex gap-2">
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'curriculum' ? 'content' : 'basic')}
                  className="btn-secondary py-2 px-4 text-xs font-sans"
                >
                  Back
                </button>
              )}
              {activeTab !== 'curriculum' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'basic' ? 'content' : 'curriculum')}
                  className="btn-secondary py-2 px-4 text-xs font-sans text-teal-700 border-teal-200"
                >
                  Next Tab →
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="btn-secondary py-2.5 px-5 text-xs font-sans"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary py-2.5 px-6 text-xs font-sans flex items-center gap-2 shadow-sm"
              >
                {saving ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span> Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon sx={{ fontSize: 16 }} /> {isEdit ? 'Save Changes' : 'Create Course'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ── Edit Batch Modal ──────────────────────────────────────────── */
function EditBatchModal({ batch, onClose, onSaved }) {
  const [name, setName] = useState(batch?.name || '')
  const [days, setDays] = useState(batch?.days || '')
  const [time, setTime] = useState(batch?.time || '')
  const [description, setDescription] = useState(batch?.description || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !days.trim() || !time.trim()) {
      toast.error('All batch fields are required')
      return
    }

    setSaving(true)
    try {
      await batchAPI.update(batch.id, {
        name: name.trim(),
        days: days.trim(),
        time: time.trim(),
        description: description.trim(),
      })
      toast.success(`Batch ${name} updated successfully!`)
      onSaved()
    } catch (err) {
      console.error('Update batch error:', err)
      toast.error(err?.response?.data?.message || 'Failed to update batch')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center text-xl">
              {batch.icon || '📅'}
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-800 text-lg uppercase tracking-tight">Edit Batch Schedule</h3>
              <p className="font-inter text-xs text-slate-400">Modify training days and timings</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Batch Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-dark" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Training Days</label>
            <input type="text" value={days} onChange={e => setDays(e.target.value)} placeholder="e.g. Monday, Wednesday, Friday" className="input-dark" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Training Time</label>
            <input type="text" value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 6:30 PM – 9:00 PM" className="input-dark" required />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} disabled={saving} className="btn-secondary py-2.5 px-5 text-xs">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2">
              {saving ? 'Saving...' : 'Save Batch'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ── Courses tab ─────────────────────────────────────────────── */
function CoursesTab() {
  const { data: apiCourses, loading, reload } = useAsync(() => courseAPI.getAll())
  const [editingCourse, setEditingCourse] = useState(null)
  const [isAddingCourse, setIsAddingCourse] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [, setVersion] = useState(0)

  // Listen to course updates from localStorage or other tabs
  useEffect(() => {
    const handleUpdate = () => setVersion(v => v + 1)
    window.addEventListener('tma:courses-updated', handleUpdate)
    return () => window.removeEventListener('tma:courses-updated', handleUpdate)
  }, [])

  const coursesList = useMemo(() => {
    const merged = getAllCoursesMerged(apiCourses || [])
    return merged.map(c => ({
      ...c,
      batchName: c.batch?.name || BATCHES.find(b => b.id === (c.batchId || c.batch?.id))?.name || 'Martial Arts Batch',
      isCustom: !COURSES.some(sc => sc.slug.toLowerCase() === (c.slug || '').toLowerCase()),
    }))
  }, [apiCourses])

  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return coursesList
    const q = searchTerm.trim().toLowerCase()
    return coursesList.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.slug || '').toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q) ||
      (c.batchName || '').toLowerCase().includes(q)
    )
  }, [coursesList, searchTerm])

  const handleDelete = async (courseToDelete) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to remove the course "${courseToDelete.name}"?\n\nThis will remove it from active training programs, student enrollment, and batch schedules.`
    )
    if (!isConfirmed) return

    deleteCourse(courseToDelete.slug || courseToDelete.id)

    if (courseToDelete.id && typeof courseToDelete.id === 'number' && courseToDelete.id < 10000000000) {
      try {
        await courseAPI.delete(courseToDelete.id)
      } catch (err) {
        console.warn('Backend delete note:', err?.message)
      }
    }
    toast.success(`Course "${courseToDelete.name}" has been removed.`)
    reload()
  }

  const deletedCount = getDeletedCourses().length

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="font-display font-bold text-slate-800 text-lg uppercase tracking-tight">Active Academy Programs</h3>
          <p className="font-sans text-xs text-slate-500">
            <strong className="text-teal-700">{coursesList.length} total disciplines</strong> configured with live fee management, batch schedules, and curriculum.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 sm:w-60">
            <SearchIcon sx={{ fontSize: 18 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search programs..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500 font-sans"
            />
          </div>
          {deletedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Restore all default disciplines to the academy catalog?')) {
                  restoreDefaultCourses()
                  toast.success('Default academy courses restored!')
                  reload()
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-semibold transition-colors"
              title="Restore all default academy disciplines"
            >
              Restore Defaults
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsAddingCourse(true)}
            className="btn-primary !py-2 !px-4 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <AddIcon sx={{ fontSize: 18 }} /> ADD NEW COURSE
          </button>
        </div>
      </div>

      <div className="overflow-x-auto card-dark">
        <table className="w-full admin-table">
          <thead>
            <tr>
              <th className="text-left">Course</th>
              <th className="text-left">Category</th>
              <th className="text-left">Assigned Batch</th>
              <th className="text-left">Fee / Month</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading courses…</td></tr>}
            {!loading && filteredCourses.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">No courses match your search.</td></tr>
            )}
            {!loading && filteredCourses.map(c => (
              <tr key={c.slug || c.id}>
                <td className="font-semibold text-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 relative shadow-2xs">
                      <img
                        src={c.imageUrl || `/images/courses/${c.slug}.jpg`}
                        alt={c.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          const currentSrc = e.target.src
                          if (currentSrc.endsWith('.jpg')) {
                            e.target.src = `/images/courses/${c.slug}.webp`
                          } else {
                            e.target.style.display = 'none'
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                          }
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center text-sm bg-teal-50 text-teal-800 font-bold">
                        {c.icon || '🥋'}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{c.name}</span>
                        {c.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                            Custom
                          </span>
                        )}
                      </div>
                      {c.tagline && (
                        <p className="text-[11px] text-slate-400 font-normal line-clamp-1 max-w-xs">{c.tagline}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 capitalize border border-slate-200/60">
                    {c.category?.replace('-', ' ')}
                  </span>
                </td>
                <td className="text-xs text-slate-600 font-medium">{c.batchName}</td>
                <td>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 shadow-xs">
                    ₹{c.feePerMonth}/mo
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingCourse(c)}
                      title="Edit Course & Details"
                      className="p-1.5 rounded-lg text-teal-700 hover:text-teal-900 hover:bg-teal-50 border border-teal-200 transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <EditIcon sx={{ fontSize: 15 }} /> Edit
                    </button>
                    <Link
                      to={`/training/${c.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Preview public course page"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors inline-flex items-center"
                    >
                      <OpenInNewIcon sx={{ fontSize: 15 }} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(c)}
                      title={`Delete ${c.name} course`}
                      className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <DeleteIcon sx={{ fontSize: 15 }} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {(editingCourse || isAddingCourse) && (
          <CourseModal
            course={editingCourse}
            onClose={() => {
              setEditingCourse(null)
              setIsAddingCourse(false)
            }}
            onSaved={() => {
              setEditingCourse(null)
              setIsAddingCourse(false)
              reload()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Batches tab ──────────────────────────────────────────────── */
function BatchesTab() {
  const { data: apiBatches, loading, reload } = useAsync(() => batchAPI.getAll())
  const [editingBatch, setEditingBatch] = useState(null)

  const batchesList = (apiBatches && apiBatches.length > 0)
    ? apiBatches.map(ab => {
        const staticBatch = BATCHES.find(sb => sb.name.toLowerCase() === ab.name?.toLowerCase() || sb.id === ab.id)
        return {
          ...ab,
          icon: staticBatch?.icon || '🥋',
          courses: staticBatch?.courses || [],
        }
      })
    : BATCHES

  return (
    <div className="space-y-4">
      {loading && <p className="text-gray-500 text-sm">Loading batches…</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {batchesList.map(b => (
          <div key={b.id} className="card-dark p-6 flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-display font-bold text-slate-800 text-lg uppercase tracking-tight mb-1">{b.name}</h3>
              {b.courses && b.courses.length > 0 && (
                <p className="font-inter text-xs text-slate-400 mb-4">{b.courses.join(', ')}</p>
              )}
              <div className="space-y-1.5 text-xs font-inter mb-4">
                <p className="text-slate-500">Days: <span className="text-slate-800 font-medium">{b.days}</span></p>
                <p className="text-slate-500">Time: <span className="text-teal-700 font-bold">{b.time}</span></p>
                {b.holiday && (
                  <p className="text-slate-500">Sunday: <span className={`font-semibold ${b.id === 4 ? 'text-emerald-600' : 'text-rose-600'}`}>{b.holiday}</span></p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditingBatch(b)}
              className="btn-gold w-full justify-center text-xs py-2"
            >
              EDIT BATCH
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingBatch && (
          <EditBatchModal
            batch={editingBatch}
            onClose={() => setEditingBatch(null)}
            onSaved={() => {
              setEditingBatch(null)
              reload()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Gallery management tab ──────────────────────────────────── */
function GalleryTab() {
  const { data, loading, reload } = useAsync(() => galleryAPI.getAll())
  const items = data || []

  const [uploadMode, setUploadMode] = useState('photo') // 'photo' | 'video-file' | 'video-url'
  const [selectedCategory, setSelectedCategory] = useState('training')
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaFilter, setMediaFilter] = useState('all') // 'all' | 'photo' | 'video'

  const categories = [
    { value: 'competitions', label: 'Competitions' },
    { value: 'training', label: 'Training Sessions' },
    { value: 'championships', label: 'Championships' },
    { value: 'events', label: 'Events' },
    { value: 'yoga', label: 'Yoga Sessions' },
    { value: 'fitness', label: 'Fitness Sessions' },
    { value: 'celebrations', label: 'Celebrations' },
  ]

  // Photo upload handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fd = new FormData()
    fd.append('image', file)
    fd.append('category', selectedCategory)
    if (title.trim()) fd.append('title', title.trim())
    fd.append('mediaType', 'IMAGE')

    setIsSubmitting(true)
    try {
      await galleryAPI.upload(fd)
      toast.success('Photo uploaded successfully')
      window.dispatchEvent(new CustomEvent('tma:gallery-updated'))
      setTitle('')
      reload()
      e.target.value = ''
    } catch (error) {
      console.error('Gallery upload error:', error)
      toast.error('Photo upload failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Extract video frame thumbnail on the client
  const generateVideoThumbnailBlob = (file) => {
    return new Promise((resolve) => {
      try {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.muted = true
        video.playsInline = true
        const blobUrl = URL.createObjectURL(file)
        video.src = blobUrl
        video.currentTime = 0.5

        const cleanup = () => {
          try { URL.revokeObjectURL(blobUrl) } catch {}
          video.remove()
        }

        video.onloadeddata = () => {
          setTimeout(() => {
            try {
              const canvas = document.createElement('canvas')
              canvas.width = video.videoWidth || 640
              canvas.height = video.videoHeight || 360
              const ctx = canvas.getContext('2d')
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
              canvas.toBlob((blob) => {
                cleanup()
                resolve(blob)
              }, 'image/jpeg', 0.85)
            } catch {
              cleanup()
              resolve(null)
            }
          }, 150)
        }

        video.onerror = () => {
          cleanup()
          resolve(null)
        }

        setTimeout(() => {
          cleanup()
          resolve(null)
        }, 2500)
      } catch {
        resolve(null)
      }
    })
  }

  // Video file upload handler
  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fd = new FormData()
    fd.append('video', file)
    fd.append('category', selectedCategory)
    if (title.trim()) fd.append('title', title.trim())
    fd.append('mediaType', 'VIDEO')

    setIsSubmitting(true)
    const toastId = toast.loading('Generating thumbnail & uploading video... Please wait')
    try {
      // Auto-extract thumbnail frame from video file!
      const thumbBlob = await generateVideoThumbnailBlob(file)
      if (thumbBlob) {
        fd.append('thumbnail', thumbBlob, 'thumbnail.jpg')
      }

      await galleryAPI.upload(fd)
      toast.success('Video uploaded successfully with thumbnail', { id: toastId })
      window.dispatchEvent(new CustomEvent('tma:gallery-updated'))
      setTitle('')
      reload()
      e.target.value = ''
    } catch (error) {
      console.error('Gallery video upload error:', error)
      toast.error('Video upload failed (file may be too large)', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Video URL submit handler (YouTube, Vimeo, MP4 URL)
  const handleVideoUrlSubmit = async (e) => {
    e.preventDefault()
    if (!videoUrl.trim()) {
      toast.error('Please enter a video URL')
      return
    }

    const fd = new FormData()
    fd.append('videoUrl', videoUrl.trim())
    fd.append('category', selectedCategory)
    if (title.trim()) fd.append('title', title.trim())
    fd.append('mediaType', 'VIDEO')

    setIsSubmitting(true)
    try {
      await galleryAPI.upload(fd)
      toast.success('Video link added to gallery!')
      window.dispatchEvent(new CustomEvent('tma:gallery-updated'))
      setTitle('')
      setVideoUrl('')
      reload()
    } catch (error) {
      console.error('Gallery video link error:', error)
      toast.error('Failed to add video link')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this media item?')) return
    try {
      await galleryAPI.delete(id)
      toast.success('Media item removed')
      window.dispatchEvent(new CustomEvent('tma:gallery-updated'))
      reload()
    } catch (error) {
      console.error('Gallery delete error:', error)
      toast.error('Could not remove item')
    }
  }

  // Live preview if YouTube URL entered
  const ytPreview = useMemo(() => {
    if (!videoUrl.trim()) return null
    return getVideoEmbedInfo(videoUrl)
  }, [videoUrl])

  // Media filtering
  const filteredItems = useMemo(() => {
    if (mediaFilter === 'photo') return items.filter(i => !isVideoItem(i))
    if (mediaFilter === 'video') return items.filter(i => isVideoItem(i))
    return items
  }, [items, mediaFilter])

  const photoCount = items.filter(i => !isVideoItem(i)).length
  const videoCount = items.filter(i => isVideoItem(i)).length

  return (
    <div className="space-y-6">

      {/* Upload section */}
      <div className="card-dark p-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-gray-800 pb-4">
          <div>
            <h3 className="font-display text-blue-500 text-base font-bold uppercase tracking-wider">
              Add Media to Gallery
            </h3>
            <p className="font-inter text-xs text-gray-400 mt-0.5">
              Upload photos, video clips, or paste YouTube/Vimeo tournament links.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex bg-gray-900 p-1 rounded-lg border border-gray-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setUploadMode('photo')}
              className={`px-3 py-1.5 rounded-md text-xs font-inter font-semibold transition-colors flex items-center gap-1.5 ${
                uploadMode === 'photo'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>📷</span> Photo
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('video-file')}
              className={`px-3 py-1.5 rounded-md text-xs font-inter font-semibold transition-colors flex items-center gap-1.5 ${
                uploadMode === 'video-file'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <VideocamIcon sx={{ fontSize: 14 }} /> Video File
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('video-url')}
              className={`px-3 py-1.5 rounded-md text-xs font-inter font-semibold transition-colors flex items-center gap-1.5 ${
                uploadMode === 'video-url'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LinkIcon sx={{ fontSize: 14 }} /> YouTube / URL
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Category */}
          <div>
            <label className="block font-inter text-xs text-gray-400 mb-2 font-semibold">
              CATEGORY
            </label>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-dark w-full"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block font-inter text-xs text-gray-400 mb-2 font-semibold">
              TITLE / DESCRIPTION
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. State Championship Sparring Finals"
              className="input-dark w-full"
            />
          </div>

        </div>

        {/* Form specific to Upload Mode */}
        <div className="mt-5 pt-4 border-t border-gray-800/80">

          {/* 1. PHOTO UPLOAD */}
          {uploadMode === 'photo' && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className={`btn-gold-solid w-fit cursor-pointer inline-flex items-center gap-2 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                <CloudUploadIcon sx={{ fontSize: 16 }} />
                {isSubmitting ? 'UPLOADING...' : 'SELECT & UPLOAD PHOTO'}

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isSubmitting}
                />
              </label>
              <span className="font-inter text-xs text-gray-400">
                Supports JPG, PNG, WebP up to 10MB.
              </span>
            </div>
          )}

          {/* 2. VIDEO FILE UPLOAD */}
          {uploadMode === 'video-file' && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className={`bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded font-inter font-bold text-xs uppercase tracking-wider cursor-pointer inline-flex items-center gap-2 transition-colors ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
                <VideocamIcon sx={{ fontSize: 16 }} />
                {isSubmitting ? 'UPLOADING VIDEO...' : 'SELECT & UPLOAD VIDEO FILE'}

                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/ogg"
                  className="hidden"
                  onChange={handleVideoFileUpload}
                  disabled={isSubmitting}
                />
              </label>
              <span className="font-inter text-xs text-gray-400">
                Supports MP4, WebM, MOV clips up to 100MB.
              </span>
            </div>
          )}

          {/* 3. VIDEO URL (YouTube, Vimeo, MP4 link) */}
          {uploadMode === 'video-url' && (
            <form onSubmit={handleVideoUrlSubmit} className="space-y-4">
              <div>
                <label className="block font-inter text-xs text-gray-400 mb-1.5 font-semibold">
                  VIDEO URL (YOUTUBE / VIMEO / MP4 LINK)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="input-dark flex-1"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !videoUrl.trim()}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded font-inter font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <SaveIcon sx={{ fontSize: 16 }} />
                    {isSubmitting ? 'SAVING...' : 'SAVE VIDEO'}
                  </button>
                </div>
              </div>

              {/* YouTube Thumbnail Preview */}
              {ytPreview?.thumbnailUrl && (
                <div className="flex items-center gap-3 p-3 bg-gray-900/80 border border-gray-800 rounded-lg max-w-md">
                  <img
                    src={ytPreview.thumbnailUrl}
                    alt="Video thumbnail"
                    className="w-24 h-16 object-cover rounded border border-gray-700"
                  />
                  <div>
                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider block">
                      ✓ Valid YouTube Video
                    </span>
                    <span className="text-xs text-gray-300 font-medium block truncate max-w-xs">
                      Thumbnail auto-detected and ready to save.
                    </span>
                  </div>
                </div>
              )}
            </form>
          )}

        </div>

      </div>

      {/* Existing Media List */}
      <div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-display text-blue-500 text-base font-bold uppercase tracking-wider">
            Uploaded Media ({items.length})
          </h3>

          {/* Media filter tabs */}
          <div className="inline-flex bg-gray-900 p-1 rounded-lg border border-gray-800">
            <button
              type="button"
              onClick={() => setMediaFilter('all')}
              className={`px-3 py-1 rounded text-xs font-inter font-medium transition-colors ${
                mediaFilter === 'all'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setMediaFilter('photo')}
              className={`px-3 py-1 rounded text-xs font-inter font-medium transition-colors ${
                mediaFilter === 'photo'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📷 Photos ({photoCount})
            </button>
            <button
              type="button"
              onClick={() => setMediaFilter('video')}
              className={`px-3 py-1 rounded text-xs font-inter font-medium transition-colors ${
                mediaFilter === 'video'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📹 Videos ({videoCount})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">

          {loading && (
            <p className="text-gray-500 text-sm col-span-full py-8 text-center">
              Loading media items...
            </p>
          )}

          {!loading && filteredItems.length === 0 && (
            <p className="text-gray-500 text-sm col-span-full py-8 text-center bg-gray-900/50 rounded-lg border border-gray-800">
              No {mediaFilter === 'video' ? 'videos' : mediaFilter === 'photo' ? 'photos' : 'media'} uploaded yet.
            </p>
          )}

          {filteredItems.map(item => {
            const isVid = isVideoItem(item)
            const itemImg = getImageUrl(item.imageUrl || item.url || item.src)

            return (
              <div
                key={item.id}
                className="relative aspect-square bg-martial-card border border-martial-border group overflow-hidden rounded-md shadow-xs"
              >
                <MediaThumbnail item={item} isVideo={isVid} />

                {/* Video Play Icon Overlay */}
                {isVid && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md">
                      <PlayArrowIcon sx={{ fontSize: 18, color: '#fff', marginLeft: '1px' }} />
                    </div>
                  </div>
                )}

                {/* Top media type badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider ${
                    isVid ? 'bg-red-600 text-white' : 'bg-black/70 text-white'
                  }`}>
                    {isVid ? 'VIDEO' : 'PHOTO'}
                  </span>
                </div>

                {/* Category badge */}
                <div className="absolute left-2 bottom-2 max-w-[80%] truncate">
                  <span className="px-2 py-0.5 text-[9px] bg-black/80 text-gray-300 uppercase tracking-wide rounded">
                    {item.category}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  title="Remove item"
                  className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 p-1.5 rounded text-red-400 hover:text-white transition-colors opacity-90 sm:opacity-0 group-hover:opacity-100"
                >
                  <DeleteIcon sx={{ fontSize: 14 }} />
                </button>

              </div>
            )
          })}

        </div>
      </div>

    </div>
  )
}

function getTrainerFallbackImage(name = '', designation = '') {
  const n = (name || '').toLowerCase()
  const d = (designation || '').toLowerCase()
  if (n.includes('shanthi') || d.includes('legal') || d.includes('advocate')) {
    return '/images/advisor.jpeg'
  }
  if (n.includes('thillai') || n.includes('nayagi')) {
    return '/images/coach.jpeg'
  }
  if (n.includes('hariharan') || n.includes('master') || d.includes('found')) {
    return '/images/founder.jpeg'
  }
  return null
}

/* ── Add / Edit Trainer Modal ──────────────────────────────────── */
function TrainerModal({ trainer, onClose, onSaved }) {
  const isEdit = Boolean(trainer?.id)
  const [name, setName] = useState(trainer?.name || '')
  const [designation, setDesignation] = useState(trainer?.designation || '')
  const [qualifications, setQualifications] = useState(trainer?.qualifications || [])
  const [newQual, setNewQual] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(() => {
    if (trainer?.imageUrl) return getImageUrl(trainer.imageUrl)
    return getTrainerFallbackImage(trainer?.name, trainer?.designation) || ''
  })
  const [saving, setSaving] = useState(false)

  const handleAddQual = () => {
    if (newQual.trim() && !qualifications.includes(newQual.trim())) {
      setQualifications([...qualifications, newQual.trim()])
      setNewQual('')
    }
  }

  const handleRemoveQual = (index) => {
    setQualifications(qualifications.filter((_, i) => i !== index))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Trainer name is required')
      return
    }
    if (!designation.trim()) {
      toast.error('Designation is required')
      return
    }

    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('designation', designation.trim())
      qualifications.forEach(q => {
        formData.append('qualifications', q)
      })
      if (imageFile) {
        formData.append('image', imageFile)
      }

      if (isEdit) {
        await trainerAPI.update(trainer.id, formData)
        toast.success(`Trainer "${name}" updated successfully!`)
      } else {
        await trainerAPI.create(formData)
        toast.success(`New trainer "${name}" added successfully!`)
      }
      onSaved()
    } catch (err) {
      console.error('Save trainer error:', err)
      toast.error(err?.response?.data?.message || 'Failed to save trainer details')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-8"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center text-xl font-bold">
              🥋
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-800 text-lg uppercase tracking-tight">
                {isEdit ? 'Edit Trainer' : 'Add New Trainer'}
              </h3>
              <p className="font-inter text-xs text-slate-400">
                {isEdit ? 'Update instructor details and qualifications' : 'Add an instructor or coach to the team'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Photo & Basic Info */}
          <div className="flex items-center gap-4 pb-2">
            <div className="relative w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 group">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-2xl font-bold text-teal-700">
                  {name ? name[0]?.toUpperCase() : '🥋'}
                </span>
              )}
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-semibold transition-opacity">
                <CloudUploadIcon sx={{ fontSize: 18 }} />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Profile Photo
              </label>
              <label className="btn-secondary py-1.5 px-3 text-xs inline-flex items-center gap-1.5 cursor-pointer">
                <CloudUploadIcon sx={{ fontSize: 16 }} />
                <span>{previewUrl ? 'Change Photo' : 'Select Photo'}</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, or WEBP up to 5MB</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Trainer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Master R. HariHaran"
              className="input-dark"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Designation / Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              placeholder="e.g. Founding Member & Head Coach"
              className="input-dark"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Qualifications & Certifications
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newQual}
                onChange={e => setNewQual(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddQual()
                  }
                }}
                placeholder="e.g. Black Belt Dan 4, MSc Yoga"
                className="input-dark flex-1 text-xs"
              />
              <button
                type="button"
                onClick={handleAddQual}
                className="btn-secondary py-2 px-3 text-xs font-semibold"
              >
                Add
              </button>
            </div>

            {qualifications.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {qualifications.map((q, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 shadow-sm"
                  >
                    <span>{q}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQual(idx)}
                      className="text-slate-400 hover:text-red-500 ml-1"
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No qualifications added yet. Type above and click Add.</p>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="btn-secondary py-2.5 px-5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="animate-spin text-sm">⏳</span> Saving...
                </>
              ) : (
                <>
                  <SaveIcon sx={{ fontSize: 16 }} /> {isEdit ? 'Save Changes' : 'Create Trainer'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ── Trainers tab ─────────────────────────────────────────────── */
function TrainersTab() {
  const { data: apiTrainers, loading, reload } = useAsync(() => trainerAPI.getAll())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState(null)

  const trainers = apiTrainers || []

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove trainer "${name}"?`)) return
    try {
      await trainerAPI.delete(id)
      toast.success(`Trainer "${name}" removed`)
      reload()
    } catch (err) {
      console.error('Delete trainer error:', err)
      toast.error('Failed to delete trainer')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-display font-bold text-slate-800 text-xl uppercase tracking-tight">Club Trainers & Coaches</h3>
          <p className="font-inter text-xs text-slate-500">Manage instructor profiles, certifications, and public listings</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingTrainer(null)
            setModalOpen(true)
          }}
          className="btn-gold flex items-center gap-2 text-xs py-2.5 px-4 shadow-sm"
        >
          <span>+ ADD NEW TRAINER</span>
        </button>
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading trainers…</p>}

      {!loading && trainers.length === 0 && (
        <div className="card-dark p-8 text-center space-y-3">
          <p className="font-inter text-sm text-slate-600">No trainers found in the database.</p>
          <button
            type="button"
            onClick={() => {
              setEditingTrainer(null)
              setModalOpen(true)
            }}
            className="btn-gold text-xs py-2 px-4 inline-flex items-center gap-2"
          >
            + Add First Trainer
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map(t => {
          const fallback = getTrainerFallbackImage(t.name, t.designation)
          const photoUrl = t.imageUrl ? getImageUrl(t.imageUrl) : fallback
          return (
            <div key={t.id} className="card-dark p-6 flex flex-col justify-between hover:border-teal-500 transition-all duration-300 shadow-sm group">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 overflow-hidden flex items-center justify-center font-display text-teal-800 font-bold text-xl flex-shrink-0 shadow-sm relative">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={t.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          if (fallback && e.target.src !== fallback) {
                            e.target.src = fallback
                          } else {
                            e.target.style.display = 'none'
                          }
                        }}
                      />
                    ) : (
                      t.name?.[0]?.toUpperCase() || '🥋'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-slate-800 text-lg uppercase tracking-tight truncate">{t.name}</h4>
                    <p className="font-inter text-xs text-teal-700 font-medium tracking-wide mt-0.5">{t.designation}</p>
                  </div>
                </div>

                {t.qualifications && t.qualifications.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Qualifications</p>
                    <div className="flex flex-wrap gap-1">
                      {t.qualifications.slice(0, 4).map((q, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {q}
                        </span>
                      ))}
                      {t.qualifications.length > 4 && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold">
                          +{t.qualifications.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTrainer(t)
                    setModalOpen(true)
                  }}
                  className="p-1.5 rounded-lg text-teal-700 hover:text-teal-900 hover:bg-teal-50 transition-colors text-xs font-semibold inline-flex items-center gap-1"
                >
                  <EditIcon sx={{ fontSize: 16 }} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id, t.name)}
                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors text-xs font-semibold inline-flex items-center gap-1"
                >
                  <DeleteIcon sx={{ fontSize: 16 }} /> Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <TrainerModal
            trainer={editingTrainer}
            onClose={() => {
              setModalOpen(false)
              setEditingTrainer(null)
            }}
            onSaved={() => {
              setModalOpen(false)
              setEditingTrainer(null)
              reload()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Payments tab ─────────────────────────────────────────────── */
function PaymentsTab() {
  const { data, loading } = useAsync(() => adminAPI.getDashboard())
  const { data: payments, loading: paymentsLoading } = useAsync(() => paymentAPI.getAll({}))
  const list = payments?.content || []

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => downloadPaymentsPDF(adminAPI)} className="btn-gold">
          <DownloadIcon sx={{ fontSize: 16 }} /> EXPORT PDF
        </button>
      </div>
      <div className="overflow-x-auto card-dark">
        <table className="w-full admin-table">
          <thead><tr><th className="text-left">Date</th><th className="text-left">Student</th><th className="text-left">Amount</th><th className="text-left">Method</th><th className="text-left">Status</th></tr></thead>
          <tbody>
            {paymentsLoading && <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading…</td></tr>}
            {!paymentsLoading && list.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-500">No payments recorded yet.</td></tr>}
            {list.map(p => (
              <tr key={p.id}>
                <td>{p.date}</td><td>{p.studentName}</td><td>₹{p.amount}</td><td>{p.method}</td>
                <td><span className="badge-gold">{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Contact messages tab ────────────────────────────────────── */
function MessagesTab() {
  const { data, loading, reload } = useAsync(() => contactAPI.getAll({}))
  const messages = data?.content || []

  const markRead = async (id) => { try { await contactAPI.markRead(id); reload() } catch {} }
  const remove   = async (id) => { try { await contactAPI.delete(id); toast.success('Deleted'); reload() } catch {} }

  return (
    <div className="space-y-3">
      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {!loading && messages.length === 0 && <p className="font-inter text-xs text-gray-500">No contact messages yet.</p>}
      {messages.map(m => (
        <div key={m.id} className={`card-dark p-6 ${!m.read ? 'border-gold-500/50' : ''}`}>
          <div className="flex justify-between items-start mb-2 gap-3">
            <div>
              <p className="font-display font-bold text-white text-base tracking-wide uppercase">{m.name}</p>
              <p className="font-inter text-xs text-gray-500">{m.email} · {m.phone} · {m.city}, {m.state}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {!m.read && <button onClick={() => markRead(m.id)} className="text-xs text-gold-500 hover:text-gold-400">Mark Read</button>}
              <button onClick={() => remove(m.id)} className="text-red-400 hover:text-red-300"><DeleteIcon sx={{ fontSize: 16 }} /></button>
            </div>
          </div>
          <p className="font-inter text-sm text-gray-300">{m.message}</p>
        </div>
      ))}
    </div>
  )
}

/* ── Reports tab ──────────────────────────────────────────────── */
function ReportsTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {[
        { label: 'Students Report (Excel)', action: () => downloadStudentsExcel(studentAPI) },
        { label: 'Students Report (PDF)',   action: () => downloadStudentsPDF(adminAPI) },
        { label: 'Payments Report (PDF)',   action: () => downloadPaymentsPDF(adminAPI) },
      ].map(r => (
        <button key={r.label} onClick={r.action} className="card-dark p-6 text-left hover:border-gold-500 transition-all duration-300 flex items-center justify-between">
          <span className="font-inter text-sm text-slate-800 font-semibold">{r.label}</span>
          <DownloadIcon sx={{ color: '#0d9488' }} />
        </button>
      ))}
    </div>
  )
}

/* ── Admin Panel shell ────────────────────────────────────────── */
export default function AdminPanel() {
  const { user, loading, logout, clearSession } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      navigate('/login', { replace: true })
    }
  }, [user, loading, navigate])

  // Automatically log out whenever navigating away / leaving the Admin Portal
  useEffect(() => {
    return () => {
      if (!window.location.pathname.startsWith('/admin')) {
        clearSession()
      }
    }
  }, [clearSession])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">

      {/* Sidebar */}
      <aside className="lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex-shrink-0">
        {/* Admin identity */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-display font-black text-blue-600 text-xl shadow-xs">
            T
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-slate-900 text-base uppercase tracking-wide">
              Admin Portal
            </p>
            <p className="font-inter text-blue-600 text-[11px] font-bold tracking-wide">
              {user?.name || 'Administrator'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {NAV.map(item => {
            const Icon = item.icon
            const active = activeTab === item.key

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <Icon
                  sx={{
                    fontSize: 20,
                    color: active ? '#2563EB' : '#64748B',
                  }}
                />
                <span>{item.label}</span>
              </button>
            )
          })}

          {/* Logout */}
          <div className="mt-4 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogoutIcon sx={{ fontSize: 20, color: '#DC2626' }} />
              <span>Log Out</span>
            </button>
          </div>
        </nav>
      </aside>
     
      {/* Content */}
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <div className="mb-8">
          <h1 className="font-display font-black text-2xl text-slate-800 uppercase tracking-tight">
            {NAV.find(n => n.key === activeTab)?.label}
          </h1>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'students'  && <StudentsTab />}
            {activeTab === 'courses'   && <CoursesTab />}
            {activeTab === 'batches'   && <BatchesTab />}
            {activeTab === 'gallery'   && <GalleryTab />}
            {activeTab === 'trainers'  && <TrainersTab />}
            {activeTab === 'payments'  && <PaymentsTab />}
            {activeTab === 'messages'  && <MessagesTab />}
            {activeTab === 'reports'   && <ReportsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
