import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import SendIcon from '@mui/icons-material/Send'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { contactAPI } from '../services/api.js'

const STATES = [
  'Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Kerala', 'Puducherry',
  'Telangana', 'Maharashtra', 'Delhi', 'Other',
]

const schema = yup.object({
  name:    yup.string().required('Name is required').min(2, 'Too short'),
  phone:   yup.string().matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit number').required('Phone number is required'),
  email:   yup.string().email('Enter a valid email').required('Email is required'),
  city:    yup.string().required('City is required'),
  state:   yup.string().required('Please select a state'),
  message: yup.string().required('Message is required').min(10, 'Please add a few more details'),
})

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await contactAPI.submit(data)
      setSubmitted(true)
      reset()
      toast.success('Message sent! Our masters will contact you shortly.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please call us directly.')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

      {/* Banner */}
      <div className="py-20 md:py-24 bg-white border-b border-[#DBE2EF] text-center">
        <div className="container-pad max-w-3xl mx-auto">
          <p className="section-eyebrow">Get in Touch</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#112D4E] mb-3 uppercase tracking-tight">
            CONTACT ACADEMY
          </h1>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/80 text-sm sm:text-base leading-relaxed">
            Have questions about training programs, batch timings, or admissions? Send us a message or call directly.
          </p>
        </div>
      </div>

      <section className="section-pad bg-[#F9F7F7]">
        <div className="container-pad">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Info Cards (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              {[
                { icon: LocationOnIcon, label: 'Dojo Location', value: '2nd Floor, Top of National Supermarket, Sivapuri Main Road, Annamalai Nagar, Chidambaram - 608001' },
                { icon: PhoneIcon, label: 'Direct Phone', value: '+91 80720 89377 / 94432 08937', href: 'tel:+918072089377' },
                { icon: EmailIcon, label: 'Email Address', value: 'hartzone1974@gmail.com', href: 'mailto:hartzone1974@gmail.com' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="card-tma p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] flex-shrink-0">
                    <Icon sx={{ fontSize: 20 }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans text-xs font-bold text-[#112D4E] uppercase tracking-wider mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="font-sans text-xs font-semibold text-[#3F72AF] hover:underline break-words block">
                        {value}
                      </a>
                    ) : (
                      <p className="font-sans text-xs text-[#112D4E]/80 leading-relaxed font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="card-tma p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-sans text-xs font-bold text-[#112D4E] uppercase tracking-wider">Connect On Social</p>
                  <span className="text-[10px] font-sans font-semibold text-[#3F72AF] uppercase tracking-wider bg-[#DBE2EF]/60 px-2 py-0.5 rounded">Official Channels</span>
                </div>
                <p className="font-sans text-xs text-[#112D4E]/70 mb-4 leading-relaxed">
                  Follow us for championship highlights, tournament videos, and academy announcements.
                </p>
                <div className="flex items-center gap-3">
                  {[
                    {
                      name: 'Instagram',
                      icon: InstagramIcon,
                      href: 'https://www.instagram.com/hartzone2000?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
                      gradient: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-pink-500/25 hover:shadow-pink-500/50',
                    },
                    {
                      name: 'YouTube',
                      icon: YouTubeIcon,
                      href: 'https://www.youtube.com/@hariharan-dc3gb',
                      gradient: 'bg-gradient-to-tr from-[#E60000] to-[#FF3333] shadow-red-500/25 hover:shadow-red-500/50',
                    },
                    {
                      name: 'WhatsApp',
                      icon: WhatsAppIcon,
                      href: 'https://wa.me/918072089377',
                      gradient: 'bg-gradient-to-tr from-[#25D366] to-[#128C7E] shadow-emerald-500/25 hover:shadow-emerald-500/50',
                    },
                  ].map(s => {
                    const Icon = s.icon
                    return (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.name}
                        title={s.name}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md hover:-translate-y-1 hover:scale-110 active:scale-95 transition-all duration-200 ${s.gradient}`}
                      >
                        <Icon sx={{ fontSize: 24 }} />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Form (3 cols) */}
            <div className="lg:col-span-3">
              <div className="card-tma p-8 sm:p-10 shadow-md">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#112D4E] uppercase mb-2 tracking-tight">Message Received!</h3>
                    <p className="font-sans text-[#112D4E]/80 text-xs sm:text-sm mb-6 leading-relaxed max-w-md mx-auto">
                      Thank you for contacting Thillai Martial Arts Club. Our master trainers will get back to you within 24 hours.
                    </p>
                    <button onClick={() => setSubmitted(false)} className="btn-secondary font-sans font-semibold text-xs tracking-wider">SEND ANOTHER MESSAGE</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <h3 className="font-display font-extrabold text-2xl text-[#112D4E] uppercase tracking-tight pb-2 border-b border-[#DBE2EF]">
                      Send Us an Enquiry
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">Name *</label>
                        <input {...register('name')} placeholder="Your full name" className={`input-tma font-sans ${errors.name ? '!border-red-500' : ''}`} />
                        {errors.name && <p className="font-sans text-[11px] text-red-600 mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">Phone Number *</label>
                        <input {...register('phone')} type="tel" placeholder="10-digit mobile number" className={`input-tma font-sans ${errors.phone ? '!border-red-500' : ''}`} />
                        {errors.phone && <p className="font-sans text-[11px] text-red-600 mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">Email *</label>
                        <input {...register('email')} type="email" placeholder="you@example.com" className={`input-tma font-sans ${errors.email ? '!border-red-500' : ''}`} />
                        {errors.email && <p className="font-sans text-[11px] text-red-600 mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">City *</label>
                        <input {...register('city')} placeholder="e.g. Chidambaram" className={`input-tma font-sans ${errors.city ? '!border-red-500' : ''}`} />
                        {errors.city && <p className="font-sans text-[11px] text-red-600 mt-1">{errors.city.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">State *</label>
                        <select {...register('state')} className={`input-tma font-sans ${errors.state ? '!border-red-500' : ''}`}>
                          <option value="">Select State</option>
                          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.state && <p className="font-sans text-[11px] text-red-600 mt-1">{errors.state.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#112D4E] uppercase tracking-wider mb-1">Message *</label>
                      <textarea
                        {...register('message')}
                        rows={4}
                        placeholder="Tell us what you'd like to know or which courses interest you..."
                        className={`input-tma font-sans resize-none ${errors.message ? '!border-red-500' : ''}`}
                      />
                      {errors.message && <p className="font-sans text-[11px] text-red-600 mt-1">{errors.message.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full justify-center !py-3.5 text-xs font-sans font-semibold tracking-wider shadow-sm"
                    >
                      {isSubmitting ? 'SENDING…' : 'SEND MESSAGE'} <SendIcon sx={{ fontSize: 16 }} />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </motion.div>
  )
}
