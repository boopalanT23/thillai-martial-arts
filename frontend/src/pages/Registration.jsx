import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import SecurityIcon from '@mui/icons-material/Security'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { COURSES, getAllCoursesMerged } from '../data/courses.js'
import { BATCHES, getBatchForCourse, getBatchById } from '../data/batches.js'
import { studentAPI, paymentAPI, courseAPI } from '../services/api.js'

const STEPS = ['Personal Info', 'Select Courses', 'ID Documents', 'Review & Pay']
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const GENDERS = ['Male', 'Female', 'Other']

function FileDropzone({ label, sublabel, accept, file, onFileSelect, onRemove, required, fileType }) {
  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) onFileSelect(droppedFile)
  }

  const handleChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) onFileSelect(selectedFile)
  }

  const previewUrl = useMemo(() => {
    if (!file || fileType !== 'image') return null
    try { return URL.createObjectURL(file) } catch { return null }
  }, [file, fileType])

  return (
    <div>
      <label className="block text-xs font-sans font-semibold text-[#112D4E] tracking-wider uppercase mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {file ? (
        <div className="flex items-center gap-3 p-3 bg-white border border-[#DBE2EF] rounded-lg shadow-xs">
          {fileType === 'image' && previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-md border border-[#DBE2EF] flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-md bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] flex-shrink-0">
              <PictureAsPdfIcon sx={{ fontSize: 24 }} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-sans text-xs text-[#112D4E] font-semibold truncate">{file.name}</p>
            <p className="font-sans text-[11px] text-[#112D4E]/60">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors font-sans text-xs font-medium"
            aria-label="Remove file"
          >
            Remove
          </button>
        </div>
      ) : (
        <label
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#DBE2EF] hover:border-[#3F72AF] rounded-xl bg-white/70 hover:bg-white cursor-pointer transition-colors"
        >
          <CloudUploadIcon sx={{ fontSize: 32, color: '#3F72AF' }} className="mb-2" />
          <span className="font-sans text-xs font-bold text-[#112D4E] uppercase tracking-wider">
            Click or drag file to upload
          </span>
          {sublabel && <span className="font-sans text-[11px] text-[#112D4E]/60 mt-1">{sublabel}</span>}
          <input type="file" accept={accept} onChange={handleChange} className="hidden" />
        </label>
      )}
    </div>
  )
}

export default function Registration() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const urlCourseParam = searchParams.get('course')

  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [coursesList, setCoursesList] = useState(() => getAllCoursesMerged())

  const getCourseBatchInfo = (course) => {
    if (!course) {
      return {
        name: 'Martial Arts Batch',
        icon: '🥋',
        days: 'Monday, Wednesday, Friday',
        time: '6:30 PM – 9:00 PM',
        holiday: 'Sunday Holiday',
      }
    }
    const b = getBatchForCourse(course.slug) || getBatchById(course.batchId)
    if (b) {
      return {
        name: b.name,
        icon: b.icon,
        days: b.days,
        time: b.time,
        holiday: b.holiday,
      }
    }
    return {
      name: 'Regular Batch',
      icon: course.icon || '🥋',
      days: course.schedule?.days || 'Monday, Wednesday, Friday',
      time: course.schedule?.time || '6:30 PM – 9:00 PM',
      holiday: course.schedule?.holiday || 'Sunday Holiday',
    }
  }

  useEffect(() => {
    courseAPI.getAll()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setCoursesList(getAllCoursesMerged(res.data))
        } else {
          setCoursesList(getAllCoursesMerged())
        }
      })
      .catch(() => setCoursesList(getAllCoursesMerged()))

    const handleUpdate = () => setCoursesList(getAllCoursesMerged())
    window.addEventListener('tma:courses-updated', handleUpdate)
    return () => window.removeEventListener('tma:courses-updated', handleUpdate)
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    dob: '',
    joiningDate: new Date().toISOString().split('T')[0],
    gender: 'Male',
    bloodGroup: 'O+',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: '',
    selectedCourses: [],
    photoFile: null,
    aadhaarFile: null,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const updateField = (k, v) => setFormData(p => ({ ...p, [k]: v }))

  const toggleCourse = (name) => {
    setFormData(prev => {
      const exists = prev.selectedCourses.includes(name)
      return {
        ...prev,
        selectedCourses: exists
          ? prev.selectedCourses.filter(c => c !== name)
          : [...prev.selectedCourses, name],
      }
    })
  }

  const selectedBatchesInfo = useMemo(() => {
    return formData.selectedCourses.map(courseName => {
      const course = coursesList.find(c => c.name.toLowerCase() === courseName.toLowerCase())
      const batch = getCourseBatchInfo(course)
      return {
        courseName,
        course,
        ...batch,
      }
    })
  }, [formData.selectedCourses, coursesList])

  const monthlyFee = useMemo(() => {
    return formData.selectedCourses.reduce((sum, name) => {
      const found = coursesList.find(c => c.name.toLowerCase() === name.toLowerCase())
      return sum + (found?.feePerMonth ?? 300)
    }, 0)
  }, [formData.selectedCourses, coursesList])

  const validateStep = (step) => {
    if (step === 0) {
      if (!formData.name.trim()) { toast.error('Please enter student name.'); return false }
      if (!formData.mobile.trim() || formData.mobile.length !== 10) { toast.error('Enter valid 10-digit mobile number.'); return false }
      if (!formData.fatherName.trim()) { toast.error('Please enter father/guardian name.'); return false }
      if (!formData.joiningDate) { toast.error('Please select joining date.'); return false }
      if (!formData.dob) { toast.error('Please select date of birth.'); return false }
      if (!formData.address.trim()) { toast.error('Please enter residential address.'); return false }
      if (!formData.password || formData.password.trim().length < 6) {
        toast.error('Please create an account password (minimum 6 characters).')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match. Please re-enter your password.')
        return false
      }
    }
    if (step === 1) {
      if (!formData.selectedCourses || formData.selectedCourses.length === 0) {
        toast.error('Please select at least one course to continue.')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const handlePrev = () => setCurrentStep(s => Math.max(s - 1, 0))

  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1)) return
    if (!window.Razorpay) {
      toast.error('Razorpay SDK is loading. Please check internet connection.')
      return
    }

    setSubmitting(true)
    try {
      // Pre-check if mobile number is already registered before charging payment
      try {
        const checkRes = await studentAPI.search(formData.mobile.trim())
        if (checkRes.data && checkRes.data.id) {
          toast.error('A student with this mobile number is already registered. Please use Student Login.')
          setSubmitting(false)
          return
        }
      } catch (err) {
        // HTTP 404 is expected for fresh registrations
      }

      // 1. Create order on server first
      const orderRes = await paymentAPI.createOrder({
        amount: monthlyFee * 100,
        currency: 'INR',
        receipt: `ADM_${formData.mobile}_${Date.now()}`.slice(0, 40),
        notes: {
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          type: 'ADMISSION',
        },
      })

      const orderData = orderRes.data

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID?.trim(),
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'Thillai Martial Arts Club',
        description: `Admission & First Month Fee - ${formData.name.trim()}`,
        prefill: {
          name: formData.name.trim(),
          contact: formData.mobile.trim(),
        },
        theme: {
          color: '#3F72AF',
        },
        handler: async (response) => {
          try {
            const data = new FormData()
            data.append('name', formData.name.trim())
            data.append('fatherName', formData.fatherName.trim())
            data.append('dob', formData.dob)
            data.append('joiningDate', formData.joiningDate)
            data.append('gender', formData.gender)
            data.append('bloodGroup', formData.bloodGroup)
            data.append('mobile', formData.mobile.trim())
            data.append('address', formData.address.trim())
            const derivedBatchName = [...new Set(selectedBatchesInfo.map(b => b.name))].join(', ') || 'Martial Arts Batch'
            data.append('batchName', derivedBatchName)
            data.append('monthlyFee', monthlyFee)

            // Map selected courses to slugs
            const slugs = formData.selectedCourses.map((name) => {
              const found = coursesList.find((c) => c.name.toLowerCase() === name.toLowerCase())
              return found?.slug || name.toLowerCase().replace(/\s+/g, '-')
            })
            slugs.forEach((slug) => data.append('courses', slug))

            // File uploads with minimal fallback if not provided
            let photoFile = formData.photoFile
            if (!photoFile) {
              photoFile = new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], 'student-photo.png', { type: 'image/png' })
            }
            data.append('photo', photoFile)

            if (formData.aadhaarFile) {
              data.append('aadhaarPdf', formData.aadhaarFile)
            }

            // Verified payment tokens
            data.append('razorpayOrderId', response.razorpay_order_id)
            data.append('razorpayPaymentId', response.razorpay_payment_id)
            data.append('razorpaySignature', response.razorpay_signature)
            data.append('password', formData.password.trim())

            const regRes = await studentAPI.register(data)
            const createdStudent = regRes.data?.student || regRes.data

            toast.success('Admission & Payment Completed Successfully! You can now login to your portal.')
            navigate('/login', { replace: true })
          } catch (regErr) {
            console.error('Registration completion error:', regErr)
            const errorMsg = regErr.response?.data?.message || 'Payment completed but registration failed.'
            const payId = response?.razorpay_payment_id ? ` (Payment ID: ${response.razorpay_payment_id})` : ''
            toast.error(`${errorMsg}${payId}. Please contact admin if this persists.`, { duration: 10000 })
          } finally {
            setSubmitting(false)
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false)
            toast.error('Payment cancelled. Please complete payment to secure admission.')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', (response) => {
        console.error('Razorpay payment failed:', response.error)
        toast.error(response.error?.description || 'Payment failed.')
        setSubmitting(false)
      })
      razorpay.open()
    } catch (err) {
      console.error('Registration init error:', err)
      toast.error(err.response?.data?.message || 'Could not initiate payment. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

      {/* Banner */}
      <div className="py-20 md:py-24 bg-white border-b border-[#DBE2EF] text-center">
        <div className="container-pad max-w-3xl mx-auto">
          <p className="section-eyebrow">Join Thillai MAC</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#112D4E] mb-3 uppercase tracking-tight">
            ONLINE ADMISSION FORM
          </h1>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/80 text-sm sm:text-base leading-relaxed">
            Fill in the applicant details, choose your training programs, and complete admission securely.
          </p>
        </div>
      </div>

      <section className="section-pad bg-[#F9F7F7]">
        <div className="container-pad max-w-3xl mx-auto">

          {/* Stepper Progress */}
          <div className="mb-10 flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const isDone = idx < currentStep
              const isCurr = idx === currentStep
              return (
                <div key={step} className="flex-1 flex flex-col items-center relative">
                  {idx !== 0 && (
                    <div
                      className={`absolute top-4 -left-1/2 right-1/2 h-0.5 -translate-y-1/2 transition-colors duration-200 ${
                        idx <= currentStep ? 'bg-[#3F72AF]' : 'bg-[#DBE2EF]'
                      }`}
                    />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-xs font-bold relative z-10 transition-colors duration-200 ${
                      isDone
                        ? 'bg-[#112D4E] text-white'
                        : isCurr
                        ? 'bg-[#3F72AF] text-white ring-4 ring-[#DBE2EF]'
                        : 'bg-white text-[#112D4E]/50 border border-[#DBE2EF]'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`font-sans text-[11px] uppercase tracking-wider mt-2 text-center font-semibold ${
                      isCurr ? 'text-[#3F72AF]' : 'text-[#112D4E]/60'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Form Card */}
          <div className="card-tma p-8 sm:p-10 shadow-md">
            <AnimatePresence mode="wait">

              {/* Step 0: Profile */}
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h3 className="font-display font-extrabold text-2xl text-[#112D4E] uppercase tracking-tight pb-2 border-b border-[#DBE2EF]">
                    1. Student Personal Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={formData.name}
                        onChange={e => updateField('name', e.target.value)}
                        placeholder="Student full name"
                        className="input-tma font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={formData.mobile}
                        onChange={e => updateField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10-digit mobile number"
                        className="input-tma font-sans"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">
                        Father / Guardian Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={formData.fatherName}
                        onChange={e => updateField('fatherName', e.target.value)}
                        placeholder="Parent / Guardian name"
                        className="input-tma font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">
                        Joining Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.joiningDate}
                        onChange={e => updateField('joiningDate', e.target.value)}
                        className="input-tma font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={e => updateField('dob', e.target.value)}
                        className="input-tma font-sans"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={e => updateField('gender', e.target.value)}
                          className="input-tma font-sans"
                        >
                          {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">Blood Group</label>
                        <select
                          value={formData.bloodGroup}
                          onChange={e => updateField('bloodGroup', e.target.value)}
                          className="input-tma font-sans"
                        >
                          {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">
                      Residential Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={e => updateField('address', e.target.value)}
                      rows={3}
                      placeholder="Street, area, city, pincode"
                      className="input-tma font-sans resize-none"
                    />
                  </div>

                  {/* Account Security & Password Setup */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#DBE2EF] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#DBE2EF] pb-2">
                      <div className="flex items-center gap-2">
                        <SecurityIcon sx={{ fontSize: 18, color: '#3F72AF' }} />
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#112D4E]">
                          Student Portal Security Setup
                        </span>
                      </div>
                      <span className="text-[10px] font-sans text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                        Encrypted Account
                      </span>
                    </div>

                    <p className="font-sans text-[11px] text-[#112D4E]/70">
                      Create a desirable password for your student portal. You will use this password to log in and securely access your ID card, attendance, and fee receipts.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Password */}
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">
                          Create Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <LockIcon sx={{ fontSize: 18, color: '#3F72AF' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={e => updateField('password', e.target.value)}
                            placeholder="Min. 6 characters"
                            className="input-tma pl-9 pr-9 font-sans text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#112D4E]/40 hover:text-[#3F72AF]"
                          >
                            {showPassword ? <VisibilityOffIcon sx={{ fontSize: 16 }} /> : <VisibilityIcon sx={{ fontSize: 16 }} />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="mt-1 flex items-center gap-1.5">
                            <div className={`h-1 flex-1 rounded-full ${
                              formData.password.length < 6
                                ? 'bg-red-400'
                                : formData.password.length < 9
                                ? 'bg-amber-400'
                                : 'bg-emerald-500'
                            }`} />
                            <span className="text-[10px] font-sans text-[#112D4E]/60">
                              {formData.password.length < 6 ? 'Too short' : formData.password.length < 9 ? 'Good' : 'Strong'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">
                          Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <LockIcon sx={{ fontSize: 18, color: '#3F72AF' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={e => updateField('confirmPassword', e.target.value)}
                            placeholder="Re-enter password"
                            className="input-tma pl-9 pr-9 font-sans text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(v => !v)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#112D4E]/40 hover:text-[#3F72AF]"
                          >
                            {showConfirmPassword ? <VisibilityOffIcon sx={{ fontSize: 16 }} /> : <VisibilityOffIcon sx={{ fontSize: 16 }} />}
                          </button>
                        </div>
                        {formData.confirmPassword && (
                          <p className={`text-[10px] font-sans mt-1 ${
                            formData.password === formData.confirmPassword ? 'text-emerald-600 font-semibold' : 'text-red-500'
                          }`}>
                            {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Courses */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#DBE2EF] gap-1">
                    <h3 className="font-display font-extrabold text-2xl text-[#112D4E] uppercase tracking-tight">
                      2. Choose Training Programs
                    </h3>
                    <span className={`font-sans text-xs font-bold uppercase ${formData.selectedCourses.length > 0 ? 'text-[#3F72AF]' : 'text-slate-400'}`}>
                      {formData.selectedCourses.length === 0 ? 'None Selected' : `${formData.selectedCourses.length} Program${formData.selectedCourses.length > 1 ? 's' : ''} Selected`}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-[#112D4E]/70 -mt-2 leading-relaxed">
                    Select the martial arts or educational programs you want to enroll in. Each discipline's designated batch type, training days, and session timings are shown below.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {coursesList.map(course => {
                      const selected = formData.selectedCourses.includes(course.name)
                      const batch = getCourseBatchInfo(course)

                      return (
                        <button
                          key={course.slug}
                          type="button"
                          onClick={() => toggleCourse(course.name)}
                          className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 ${
                            selected
                              ? 'bg-[#DBE2EF]/50 border-[#3F72AF] shadow-xs'
                              : 'bg-white border-[#DBE2EF] hover:border-[#3F72AF]'
                          }`}
                        >
                          <div>
                            {/* Course Title & Fee */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl flex-shrink-0">{course.icon || '🥋'}</span>
                                <div>
                                  <p className="font-display font-bold text-lg text-[#112D4E] uppercase tracking-tight leading-tight">
                                    {course.name}
                                  </p>
                                  <p className="font-sans text-[11px] text-[#112D4E]/60">
                                    {course.tagline}
                                  </p>
                                </div>
                              </div>
                              <span className="font-display font-bold text-base text-[#112D4E] whitespace-nowrap flex-shrink-0">
                                ₹{course.feePerMonth ?? 300}<span className="text-[11px] font-sans font-normal text-[#112D4E]/60">/mo</span>
                              </span>
                            </div>

                            {/* Batch Type & Timing Details */}
                            <div className="mt-3 pt-2.5 border-t border-[#DBE2EF] text-xs font-sans space-y-1.5 text-[#112D4E]/80">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="text-[#112D4E]/60 text-[11px]">Batch Type:</span>
                                <strong className="text-[#112D4E] font-semibold text-right">{batch.name}</strong>
                              </div>
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="text-[#112D4E]/60 text-[11px]">Days:</span>
                                <span className="text-[#112D4E] text-right font-medium">{batch.days}</span>
                              </div>
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="text-[#112D4E]/60 text-[11px]">Timing:</span>
                                <strong className="text-[#3F72AF] text-right">{batch.time}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Selection indicator bar */}
                          <div className="mt-3 pt-2 border-t border-[#DBE2EF] flex items-center justify-between text-xs font-sans">
                            <span className="text-[11px] text-[#112D4E]/50">
                              {batch.holiday}
                            </span>
                            <span className={`font-bold ${selected ? 'text-[#3F72AF]' : 'text-slate-400'}`}>
                              {selected ? '✓ Selected' : '+ Add Course'}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Informative Academy Timings Note */}
                  <div className="p-3 bg-[#DBE2EF]/30 rounded-lg border border-[#DBE2EF] font-sans text-xs text-[#112D4E]/80">
                    ⏰ <strong>Schedule Note:</strong> Regular weekday batches run 6:30 PM – 9:00 PM (Sunday is a holiday). Weekend batches (Chess &amp; English Grammar) run on Saturday &amp; Sunday.
                  </div>
                </motion.div>
              )}

              {/* Step 2: Documents */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h3 className="font-display font-extrabold text-2xl text-[#112D4E] uppercase tracking-tight pb-2 border-b border-[#DBE2EF]">
                    3. Upload Identity Documents (Optional)
                  </h3>

                  <FileDropzone
                    label="Passport Size Photo (For Academy ID Card)"
                    sublabel="JPG, JPEG or PNG (Max 5MB)"
                    accept="image/*"
                    file={formData.photoFile}
                    onFileSelect={f => updateField('photoFile', f)}
                    onRemove={() => updateField('photoFile', null)}
                    fileType="image"
                  />

                  <FileDropzone
                    label="Aadhaar Card / ID Proof (Optional)"
                    sublabel="PDF or Image (Max 5MB)"
                    accept="image/*,.pdf"
                    file={formData.aadhaarFile}
                    onFileSelect={f => updateField('aadhaarFile', f)}
                    onRemove={() => updateField('aadhaarFile', null)}
                    fileType={formData.aadhaarFile?.type?.includes('pdf') ? 'pdf' : 'image'}
                  />
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="font-display font-extrabold text-2xl text-[#112D4E] uppercase tracking-tight pb-2 border-b border-[#DBE2EF]">
                    4. Review &amp; Secure Admission
                  </h3>

                  <div className="bg-[#F9F7F7] border border-[#DBE2EF] rounded-lg p-5 space-y-3 text-xs font-sans">
                    <div className="flex justify-between">
                      <span className="text-[#112D4E]/60">Student Name:</span>
                      <strong className="text-[#112D4E]">{formData.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#112D4E]/60">Mobile Number:</span>
                      <strong className="text-[#112D4E]">{formData.mobile}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#112D4E]/60">Joining Date:</span>
                      <strong className="text-[#3F72AF] font-bold">{formData.joiningDate || '—'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#112D4E]/60">Date of Birth:</span>
                      <strong className="text-[#112D4E]">{formData.dob || '—'}</strong>
                    </div>
                    <div className="pt-2 border-t border-[#DBE2EF] space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#112D4E]/60 font-medium">Enrolled Courses ({formData.selectedCourses.length}):</span>
                        <strong className="text-[#3F72AF] font-bold">{formData.selectedCourses.join(', ')}</strong>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {selectedBatchesInfo.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between bg-white p-2.5 rounded border border-[#DBE2EF]">
                            <div>
                              <p className="font-bold text-[#112D4E]">{item.courseName}</p>
                              <p className="text-[11px] text-[#112D4E]/60">{item.days}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[11px] font-bold text-[#3F72AF] block">{item.name}</span>
                              <span className="text-[11px] text-[#112D4E]/75 font-medium">{item.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-lg border border-[#3F72AF] bg-[#DBE2EF]/40 flex items-center justify-between font-sans">
                    <div>
                      <p className="font-sans text-xs font-bold uppercase text-[#112D4E]">Monthly Fee Due</p>
                      <p className="font-sans text-[11px] text-[#112D4E]/70">For {formData.selectedCourses.length} course(s)</p>
                    </div>
                    <p className="font-display font-extrabold text-3xl text-[#112D4E]">₹{monthlyFee}</p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#DBE2EF]">
              {currentStep > 0 ? (
                <button type="button" onClick={handlePrev} className="btn-secondary font-sans font-semibold text-xs tracking-wider">
                  <ArrowBackIcon sx={{ fontSize: 16 }} /> PREVIOUS
                </button>
              ) : <div />}

              {currentStep < STEPS.length - 1 ? (
                <button type="button" onClick={handleNext} className="btn-primary font-sans font-semibold text-xs tracking-wider">
                  CONTINUE <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary !bg-[#3F72AF] !py-3.5 !px-8 text-xs font-sans font-semibold tracking-wider"
                >
                  <LockIcon sx={{ fontSize: 16 }} />
                  {submitting ? 'PROCESSING…' : `PAY ₹${monthlyFee} & COMPLETE ADMISSION`}
                </button>
              )}
            </div>
          </div>

        </div>
      </section>
    </motion.div>
  )
}
