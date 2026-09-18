import React from 'react'
import { motion } from 'framer-motion'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import DirectionsIcon from '@mui/icons-material/Directions'

const CLUB_LAT = 11.39500586189654
const CLUB_LNG = 79.7059704226633
const ADDRESS = '2nd Floor, Top of National Supermarket, Near Flyover, Sivapuri Main Road, Annamalai Nagar, Chidambaram - 608001'
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${CLUB_LAT},${CLUB_LNG}`
const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${CLUB_LAT},${CLUB_LNG}&z=16&output=embed`

export default function Location() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

      {/* Banner */}
      <div className="py-20 md:py-24 bg-white border-b border-[#DBE2EF] text-center">
        <div className="container-pad max-w-3xl mx-auto">
          <p className="section-eyebrow">Find Our Dojo</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#112D4E] mb-3 uppercase tracking-tight">
            ACADEMY LOCATION
          </h1>
          <div className="gold-divider" />
          <p className="font-sans text-[#112D4E]/80 text-sm sm:text-base leading-relaxed">
            Conveniently situated in Annamalai Nagar, Chidambaram with ample parking and modern training amenities.
          </p>
        </div>
      </div>

      <section className="section-pad bg-[#F9F7F7]">
        <div className="container-pad">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Map Frame */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="border border-[#DBE2EF] rounded-xl overflow-hidden h-[440px] lg:h-full min-h-[440px] relative shadow-sm bg-white">
                <iframe
                  title="Thillai Martial Arts Club Location"
                  src={MAP_EMBED_SRC}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Info Card */}
            <div className="order-1 lg:order-2 space-y-4">
              <div className="card-tma p-8 shadow-sm">
                <div className="flex items-start gap-3.5 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] flex-shrink-0">
                    <LocationOnIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold text-[#112D4E] uppercase tracking-wider mb-1">Dojo Address</p>
                    <p className="font-sans text-xs text-[#112D4E]/80 leading-relaxed font-medium">{ADDRESS}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] flex-shrink-0">
                    <PhoneIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold text-[#112D4E] uppercase tracking-wider mb-1">Phone Numbers</p>
                    <a href="tel:+918072089377" className="font-sans text-xs text-[#3F72AF] font-bold hover:underline block">
                      +91 80720 89377 / 94432 08937
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] flex-shrink-0">
                    <EmailIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold text-[#112D4E] uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:hartzone1974@gmail.com" className="font-sans text-xs text-[#3F72AF] font-bold hover:underline break-all">
                      hartzone1974@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-[#DBE2EF] flex items-center justify-center text-[#3F72AF] flex-shrink-0">
                    <AccessTimeIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div className="text-xs font-sans space-y-1">
                    <p className="font-bold text-[#112D4E] uppercase tracking-wider mb-1.5">Batch Schedules &amp; Timings</p>
                    <p className="text-[#112D4E]/80"><strong>Taekwondo, Boxing, Silambam:</strong> Mon, Wed, Fri (6:30 PM – 9:00 PM)</p>
                    <p className="text-[#112D4E]/80"><strong>Yoga:</strong> Tue, Thu, Sat (6:30 PM – 9:00 PM)</p>
                    <p className="text-[#112D4E]/80"><strong>Hindi &amp; Fitness:</strong> Daily Mon–Sat (6:30 PM – 9:00 PM)</p>
                    <p className="text-[#112D4E]/80"><strong>Chess &amp; English Grammar:</strong> Sat &amp; Sun (Morning / Evening)</p>
                    <div className="pt-2 text-[11px] border-t border-[#DBE2EF] mt-2 space-y-0.5">
                      <p className="text-[#3F72AF] font-semibold">⏰ Chess &amp; English Grammar: Morning or Evening as per school presence</p>
                      <p className="text-rose-600 font-semibold">🗓️ Sunday: Holiday for all except English Grammar &amp; Chess</p>
                    </div>
                  </div>
                </div>

                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center !py-3 text-xs font-sans font-semibold tracking-wider"
                >
                  <DirectionsIcon sx={{ fontSize: 16 }} /> GET GOOGLE MAP DIRECTIONS
                </a>
              </div>

              <a
                href="tel:+918072089377"
                className="btn-secondary w-full justify-center !py-3 text-xs font-sans font-semibold tracking-wider"
              >
                <PhoneIcon sx={{ fontSize: 16, color: '#3F72AF' }} /> CALL TO VISIT
              </a>
            </div>

          </div>
        </div>
      </section>
    </motion.div>
  )
}
