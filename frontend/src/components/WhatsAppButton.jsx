import React from 'react'
import { motion } from 'framer-motion'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

export default function WhatsAppButton() {
  const whatsappUrl =
    'https://wa.me/918072089377?text=' +
    encodeURIComponent('Hello Master HariHaran, I would like to enquire about admissions and batch timings at Thillai Martial Arts Club.')

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5
                 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full
                 shadow-[0_4px_20px_rgb(16,185,129,0.35)] border border-emerald-400/40
                 transition-all duration-200 group"
      aria-label="Chat with Master HariHaran on WhatsApp"
    >
      <div className="relative flex items-center justify-center">
        <WhatsAppIcon sx={{ fontSize: 22 }} />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
      </div>
      <span className="hidden sm:inline font-sans text-xs font-semibold text-white tracking-wide whitespace-nowrap">
        WhatsApp Us
      </span>
    </motion.a>
  )
}
