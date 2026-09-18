import React from 'react'
import { Link } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { scrollToPageTop } from './ScrollToTop.jsx'

const COURSES = [
  { name: 'Taekwondo',       slug: 'taekwondo' },
  { name: 'Boxing',          slug: 'boxing' },
  { name: 'Silambam',        slug: 'silambam' },
  { name: 'Yoga',            slug: 'yoga' },
  { name: 'Fitness',         slug: 'fitness' },
  { name: 'Guitar',          slug: 'guitar' },
  { name: 'Chess',           slug: 'chess' },
  { name: 'Hindi',           slug: 'hindi' },
  { name: 'English Grammar', slug: 'english-grammar' },
]

export default function Footer() {
  return (
    <footer className="bg-[#112D4E] text-[#DBE2EF] border-t border-[#1F4473]">
      <div className="container-pad py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link to="/" onClick={scrollToPageTop} className="flex items-center gap-3 group inline-flex">
              <div className="w-11 h-11 rounded-full overflow-hidden p-0.5 bg-white shadow-sm border border-[#3F72AF] group-hover:border-[#F59E0B] group-hover:scale-105 transition-all duration-200 flex items-center justify-center flex-shrink-0">
                <img
                  src="/images/club-emblem.png"
                  alt="Thillai Martial Arts Club Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col justify-center leading-none">
                <p className="font-display font-extrabold text-base text-white tracking-wider uppercase group-hover:text-[#DBE2EF] transition-colors">
                  THILLAI MARTIAL ARTS
                </p>
                <p className="font-sans text-[9px] font-bold text-[#DBE2EF] uppercase tracking-[0.2em] mt-1">
                  Est. 2004 · Chidambaram
                </p>
              </div>
            </Link>

            <p className="font-sans text-xs text-[#DBE2EF]/80 leading-relaxed">
              Premier martial arts academy in Chidambaram with 20+ years of dedicated coaching, developing Olympic martial arts champions and disciplined citizens.
            </p>

            <div className="pt-2">
              <span className="inline-block text-[10px] font-sans font-semibold text-[#DBE2EF] bg-[#1F4473] px-2.5 py-1 rounded uppercase tracking-wider">
                Govt. Recognised Academy
              </span>
            </div>

            {/* Social Media Icons */}
            <div className="pt-1">
              <p className="font-sans text-[10px] font-bold text-[#DBE2EF]/70 uppercase tracking-widest mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-2">
                {[
                  {
                    name: 'Instagram',
                    icon: InstagramIcon,
                    href: 'https://www.instagram.com/hartzone2000?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
                    gradient: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-pink-500/20 hover:shadow-pink-500/40',
                  },
                  {
                    name: 'YouTube',
                    icon: YouTubeIcon,
                    href: 'https://www.youtube.com/@hariharan-dc3gb',
                    gradient: 'bg-gradient-to-tr from-[#E60000] to-[#FF3333] shadow-red-500/20 hover:shadow-red-500/40',
                  },
                  {
                    name: 'WhatsApp',
                    icon: WhatsAppIcon,
                    href: 'https://wa.me/918072089377',
                    gradient: 'bg-gradient-to-tr from-[#25D366] to-[#128C7E] shadow-emerald-500/20 hover:shadow-emerald-500/40',
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
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-sm hover:-translate-y-1 hover:scale-110 active:scale-95 transition-all duration-200 ${s.gradient}`}
                    >
                      <Icon sx={{ fontSize: 19 }} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4 pb-2 border-b border-[#1F4473]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              {[
                { label: 'Home',         to: '/' },
                { label: 'Our Mission',  to: '/mission' },
                { label: 'All Courses',  to: '/training' },
                { label: 'Photo Gallery',to: '/gallery' },
                { label: 'Club Location',to: '/location' },
                { label: 'Get in Touch', to: '/contact' },
                { label: 'Pay Fees',     to: '/monthly-fees' },
                { label: 'New Admission',to: '/register' },
              ].map(item => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={scrollToPageTop}
                    className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Disciplines */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4 pb-2 border-b border-[#1F4473]">
              Training Disciplines
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs font-sans">
              {COURSES.map(c => (
                <li key={c.slug}>
                  <Link
                    to={`/training/${c.slug}`}
                    onClick={scrollToPageTop}
                    className="hover:text-white transition-colors duration-150 block truncate"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3.5 text-xs font-sans">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4 pb-2 border-b border-[#1F4473]">
              Contact Details
            </h4>
            <div className="flex items-start gap-2.5 text-[#DBE2EF]/90">
              <LocationOnIcon sx={{ fontSize: 16, color: '#3F72AF', flexShrink: 0, marginTop: '2px' }} />
              <p className="leading-relaxed">
                2nd Floor, Top of National Supermarket, Sivapuri Main Road, Annamalai Nagar, Chidambaram - 608001
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <PhoneIcon sx={{ fontSize: 16, color: '#3F72AF', flexShrink: 0 }} />
              <a href="tel:+918072089377" className="hover:text-white transition-colors font-medium">
                +91 80720 89377 / 94432 08937
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <EmailIcon sx={{ fontSize: 16, color: '#3F72AF' }} />
              <a href="mailto:hartzone1974@gmail.com" className="hover:text-white transition-colors truncate">
                hartzone1974@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-2.5 pt-2 text-[#DBE2EF]/70 text-[11px]">
              <AccessTimeIcon sx={{ fontSize: 15, color: '#3F72AF', flexShrink: 0 }} />
              <div>
                <p>Mon–Sat: 6:30 PM – 9:00 PM</p>
                <p>Chess &amp; English: Sat &amp; Sun (Morning / Evening)</p>
                <p className="text-amber-300/90 text-[10px] mt-0.5">Sunday Holiday for all except English Grammar &amp; Chess</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#1F4473] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#DBE2EF]/60">
          <p>© {new Date().getFullYear()} Thillai Martial Arts Club. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/login" className="hover:text-white transition-colors flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F72AF]"></span>
              Academy Portal Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
