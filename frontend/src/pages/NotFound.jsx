import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomeIcon from '@mui/icons-material/Home'

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-[#F9F7F7]"
    >
      <p className="font-display text-[#112D4E] text-8xl md:text-9xl font-black mb-4 opacity-20">404</p>
      <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#112D4E] mb-3 uppercase tracking-tight">PAGE NOT FOUND</h1>
      <p className="font-sans text-[#112D4E]/70 text-sm max-w-md mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary font-sans font-semibold text-xs tracking-wider">
        <HomeIcon sx={{ fontSize: 18 }} /> BACK TO HOME
      </Link>
    </motion.div>
  )
}
