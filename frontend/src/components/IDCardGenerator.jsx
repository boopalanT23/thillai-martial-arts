import React, { useMemo, useRef, useState } from 'react'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import PrintIcon from '@mui/icons-material/Print'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const BACKEND_URL = 'http://localhost:8080'

/*
  Fixed export canvas size: 1080 x 680 (Standard 3:2 ID-card proportion)
*/
const CARD_WIDTH = 1080
const CARD_HEIGHT = 680

function getPhotoUrl(photo) {
  if (!photo) return null
  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo
  }
  return `${BACKEND_URL}${photo.startsWith('/') ? photo : `/${photo}`}`
}

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

/* -------------------------------------------------------------
   Reusable Info Field Component (Spacious 2-column grid layout)
------------------------------------------------------------- */
function InfoField({ label, value, left, top, width = 360, isBadge = false }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontFamily: "'Inter', Arial, sans-serif",
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: 700,
          color: '#64748B',
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>

      {isBadge ? (
        <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
          <div
            style={{
              display: 'inline-block',
              height: '32px',
              lineHeight: '29px',
              padding: '0 16px',
              borderRadius: '8px',
              background: '#DBE2EF',
              border: '1.5px solid #3F72AF',
              color: '#112D4E',
              fontFamily: "'Inter', Arial, sans-serif",
              fontSize: '17px',
              fontWeight: 800,
              letterSpacing: '1px',
              boxSizing: 'border-box',
              textAlign: 'center',
            }}
          >
            {value || '—'}
          </div>
        </div>
      ) : (
        <div
          style={{
            fontFamily: "'Inter', Arial, sans-serif",
            fontSize: '21px',
            lineHeight: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 800,
            color: '#112D4E',
            wordBreak: 'break-word',
          }}
        >
          {value || '—'}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------
   Pure Card Layout Component
------------------------------------------------------------- */
function CardLayout({
  student,
  photoUrl,
  photoError,
  setPhotoError,
  initials,
}) {
  const coursesText = Array.isArray(student?.courses)
    ? student.courses.join(', ')
    : student?.courses || 'General Martial Arts'

  return (
    <div
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        position: 'relative',
        background: '#FFFFFF',
        border: '3px solid #112D4E',
        borderRadius: '24px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: "'Inter', Arial, sans-serif",
        color: '#112D4E',
      }}
    >
      {/* ── Background Geometric Accents ─────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '340px',
          height: '340px',
          background: '#DBE2EF',
          opacity: 0.7,
          borderRadius: '0 0 0 100%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-140px',
          left: '-140px',
          width: '360px',
          height: '360px',
          background: '#EEF3F8',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* ── Header (120px) ────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '120px',
          borderBottom: '2px solid #DBE2EF',
          boxSizing: 'border-box',
          background: '#FFFFFF',
          zIndex: 10,
        }}
      >
        {/* Club Logo */}
        <div
          style={{
            position: 'absolute',
            left: '40px',
            top: '18px',
            width: '84px',
            height: '84px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/images/club-emblem.png"
            alt="Thillai Martial Arts Club"
            style={{
              width: '84px',
              height: '84px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 2px 8px rgba(17,45,78,0.2))',
            }}
          />
        </div>

        {/* Club Title */}
        <div
          style={{
            position: 'absolute',
            left: '142px',
            top: '32px',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              lineHeight: '33px',
              fontWeight: 900,
              color: '#112D4E',
              letterSpacing: '-0.3px',
              whiteSpace: 'nowrap',
            }}
          >
            THILLAI MARTIAL ARTS CLUB
          </div>

          <div
            style={{
              marginTop: '4px',
              fontSize: '13px',
              lineHeight: '16px',
              fontWeight: 800,
              color: '#3F72AF',
              letterSpacing: '2.5px',
            }}
          >
            OFFICIAL STUDENT IDENTITY CARD
          </div>
        </div>

        {/* Status Badge */}
        <div
          style={{
            position: 'absolute',
            right: '40px',
            top: '41px',
            height: '38px',
            lineHeight: '35px',
            padding: '0 24px',
            borderRadius: '9999px',
            background: '#DBE2EF',
            border: '1.5px solid #3F72AF',
            color: '#112D4E',
            fontFamily: "'Inter', Arial, sans-serif",
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          STUDENT
        </div>
      </div>

      {/* ── Photo Box (200px x 245px) ─────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          left: '40px',
          top: '146px',
          width: '200px',
          height: '245px',
          border: '3.5px solid #3F72AF',
          borderRadius: '20px',
          background: '#F9F7F7',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(63,114,175,0.2)',
          zIndex: 5,
        }}
      >
        {photoUrl && !photoError ? (
          <img
            src={photoUrl}
            alt={student.name || 'Student Photo'}
            crossOrigin="anonymous"
            onError={() => setPhotoError(true)}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              color: '#3F72AF',
              fontSize: '60px',
              fontWeight: 900,
            }}
          >
            {initials}
          </div>
        )}
      </div>

      {/* ── Spacious 2-Column Symmetrical Student Details Grid ─────── */}
      {/* Row 1: Full Name & Student ID */}
      <InfoField
        label="FULL NAME"
        value={student.name}
        left={275}
        top={146}
        width={370}
      />

      <InfoField
        label="STUDENT ID"
        value={student.studentId}
        left={680}
        top={146}
        width={360}
        isBadge={true}
      />

      {/* Row 2: Date of Birth & Mobile Number */}
      <InfoField
        label="DATE OF BIRTH"
        value={formatDateDDMMYYYY(student.dob)}
        left={275}
        top={228}
        width={370}
      />

      <InfoField
        label="MOBILE NUMBER"
        value={student.mobile}
        left={680}
        top={228}
        width={360}
      />

      {/* Row 3: Batch & Joining Date */}
      <InfoField
        label="BATCH"
        value={student.batchName}
        left={275}
        top={310}
        width={370}
      />

      <InfoField
        label="JOINING DATE"
        value={formatDateDDMMYYYY(student.joiningDate)}
        left={680}
        top={310}
        width={360}
      />

      {/* ── Course + Training Section (96px) ──────────────────────── */}
      <div
        style={{
          position: 'absolute',
          left: '40px',
          right: '40px',
          top: '410px',
          height: '96px',
          border: '2px solid #DBE2EF',
          borderRadius: '16px',
          background: '#F9F7F7',
          boxSizing: 'border-box',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 5,
        }}
      >
        {/* Course details */}
        <div style={{ maxWidth: '580px' }}>
          <div
            style={{
              fontSize: '12px',
              lineHeight: '15px',
              color: '#64748B',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            ENROLLED COURSES
          </div>

          <div
            style={{
              marginTop: '4px',
              fontSize: '22px',
              lineHeight: '28px',
              color: '#3F72AF',
              fontWeight: 800,
              paddingTop: '2px',
              paddingBottom: '2px',
            }}
          >
            {coursesText}
          </div>
        </div>

        {/* Training schedule */}
        <div style={{ textAlign: 'right', minWidth: '360px' }}>
          <div
            style={{
              fontSize: '12px',
              lineHeight: '15px',
              color: '#64748B',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            TRAINING SCHEDULE
          </div>

          <div
            style={{
              marginTop: '4px',
              fontSize: '16px',
              lineHeight: '20px',
              color: '#1E293B',
              fontWeight: 700,
              paddingTop: '1px',
              paddingBottom: '1px',
            }}
          >
            {student.days || 'Regular Training'}
          </div>

          <div
            style={{
              marginTop: '2px',
              fontSize: '17px',
              lineHeight: '21px',
              color: '#3F72AF',
              fontWeight: 800,
              paddingTop: '1px',
              paddingBottom: '1px',
            }}
          >
            {student.time || 'Batch Timings'}
          </div>
        </div>
      </div>

      {/* ── Security & Authentic Founder Signature (82px) ─────────── */}
      <div
        style={{
          position: 'absolute',
          left: '40px',
          right: '40px',
          top: '516px',
          height: '82px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          zIndex: 5,
        }}
      >
        {/* Security Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#DBE2EF',
              border: '1.5px solid #3F72AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxSizing: 'border-box',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3F72AF"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ display: 'block' }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              style={{
                fontSize: '13px',
                lineHeight: '18px',
                fontWeight: 800,
                color: '#112D4E',
                letterSpacing: '1px',
              }}
            >
              VERIFIED STUDENT MEMBERSHIP
            </div>
            <div
              style={{
                fontSize: '12px',
                lineHeight: '16px',
                fontWeight: 600,
                color: '#64748B',
                marginTop: '2px',
              }}
            >
              Affiliated & Certified Martial Arts Academy
            </div>
          </div>
        </div>

        {/* Real Founder Signature */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '200px',
          }}
        >
          {/* Authentic Signature Graphic using img tag */}
          <div style={{ height: '52px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <img
              src="/images/founder-signature.png"
              alt="Founder Signature"
              style={{
                width: '150px',
                height: '46px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              width: '160px',
              borderTop: '1.5px solid #3F72AF',
              marginTop: '4px',
              paddingTop: '3px',
              textAlign: 'center',
              fontSize: '10px',
              lineHeight: '12px',
              fontWeight: 800,
              color: '#3F72AF',
              letterSpacing: '1px',
            }}
          >
            FOUNDER / INSTRUCTOR
          </div>
        </div>
      </div>

      {/* ── Footer Bar (60px) ──────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '60px',
          background: '#112D4E',
          color: '#F9F7F7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          boxSizing: 'border-box',
          zIndex: 20,
        }}
      >
        {/* Club name */}
        <div
          style={{
            fontSize: '14px',
            lineHeight: '18px',
            fontWeight: 800,
            letterSpacing: '0.8px',
          }}
        >
          THILLAI MARTIAL ARTS CLUB
        </div>

        {/* Academy Motto */}
        <div
          style={{
            fontSize: '11px',
            lineHeight: '14px',
            fontWeight: 700,
            color: '#DBE2EF',
            letterSpacing: '2px',
          }}
        >
          ✦ DISCIPLINE • STRENGTH • HONOR ✦
        </div>

        {/* Phone */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            lineHeight: '18px',
            fontWeight: 800,
            whiteSpace: 'nowrap',
          }}
        >
          {/* Inline Phone SVG Icon */}
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ display: 'inline-block' }}
          >
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          80720 89377
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------
   Main IDCardGenerator Component
------------------------------------------------------------- */
export default function IDCardGenerator({ student }) {
  const previewRef = useRef(null)
  const exportRef = useRef(null)

  const [photoError, setPhotoError] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const photoUrl = useMemo(
    () => getPhotoUrl(student?.photo),
    [student?.photo]
  )

  const initials =
    student?.name
      ?.trim()
      ?.split(/\s+/)
      ?.map(word => word[0])
      ?.join('')
      ?.slice(0, 2)
      ?.toUpperCase() || 'TM'

  /* -----------------------------------------------------------
     Wait for all images to complete loading
  ----------------------------------------------------------- */
  const waitForImages = async element => {
    if (!element) return
    const images = Array.from(element.querySelectorAll('img'))

    await Promise.all(
      images.map(img => {
        if (img.complete && img.naturalWidth > 0) {
          return Promise.resolve()
        }

        return new Promise(resolve => {
          const finish = () => {
            img.removeEventListener('load', finish)
            img.removeEventListener('error', finish)
            resolve()
          }

          img.addEventListener('load', finish)
          img.addEventListener('error', finish)
          setTimeout(resolve, 3000)
        })
      })
    )
  }

  /* -----------------------------------------------------------
     DOWNLOAD PDF (High-Resolution CR80 Landscape Format)
  ----------------------------------------------------------- */
  const handleDownloadPDF = async () => {
    if (!exportRef.current || !student || downloading) {
      return
    }

    setDownloading(true)

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready
      }

      await waitForImages(exportRef.current)

      // Allow browser layout and rasterization to settle
      await new Promise(resolve => setTimeout(resolve, 300))

      const element = exportRef.current

      const canvas = await html2canvas(element, {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        scale: 3, // 3x ultra-high-resolution (3240 x 2040)
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: CARD_WIDTH,
        windowHeight: CARD_HEIGHT,
      })

      const imgData = canvas.toDataURL('image/png', 1.0)

      // ISO Standard CR80 ID Card dimensions in millimeters: 85.6mm x 53.98mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98],
      })

      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98, undefined, 'FAST')
      pdf.save(`${student.studentId || 'student'}-id-card.pdf`)
    } catch (error) {
      console.error('ID card PDF generation failed:', error)
      alert('Unable to generate the PDF ID card. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  /* -----------------------------------------------------------
     PRINT
  ----------------------------------------------------------- */
  const handlePrint = () => {
    if (!exportRef.current) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups to print the ID card.')
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${student?.studentId || 'student'}-id-card</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: 3.375in 2.125in;
            margin: 0;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 3.375in;
            height: 2.125in;
            overflow: hidden;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .card-scaler {
            width: ${CARD_WIDTH}px;
            height: ${CARD_HEIGHT}px;
            transform: scale(0.3);
            transform-origin: center center;
          }
        </style>
      </head>
      <body>
        <div class="card-scaler">
          ${exportRef.current.innerHTML}
        </div>
      </body>
      </html>
    `)

    printWindow.document.close()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 800)
  }

  if (!student) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* ═════════════════════════════════════════════════════════
          OFF-SCREEN UNTRANSFORMED EXPORT CONTAINER (FOR PDF & PRINT)
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          zIndex: -99999,
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div ref={exportRef} style={{ width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }}>
          <CardLayout
            student={student}
            photoUrl={photoUrl}
            photoError={photoError}
            setPhotoError={setPhotoError}
            initials={initials}
          />
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════
          CARD PREVIEW (SCALED FOR BROWSER UI)
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          padding: '20px 0',
        }}
      >
        {/* Scaled preview container: 540px x 340px */}
        <div
          style={{
            width: '540px',
            height: '340px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div
            ref={previewRef}
            id="id-card-preview"
            style={{
              position: 'absolute',
              width: `${CARD_WIDTH}px`,
              height: `${CARD_HEIGHT}px`,
              transform: 'scale(0.5)',
              transformOrigin: 'top left',
            }}
          >
            <CardLayout
              student={student}
              photoUrl={photoUrl}
              photoError={photoError}
              setPhotoError={setPhotoError}
              initials={initials}
            />
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════
          COURSE BADGES
      ══════════════════════════════════════════════════════════ */}
      {student.courses?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {student.courses.map(course => (
            <span
              key={course}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: '#DBE2EF',
                color: '#112D4E',
                border: '1px solid #3F72AF',
              }}
            >
              {course}
            </span>
          ))}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════
          ACTION BUTTONS
      ══════════════════════════════════════════════════════════ */}
      <div className="flex justify-center gap-3 font-sans">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold text-xs tracking-wider uppercase transition-all hover:bg-slate-100"
          style={{
            background: '#FFFFFF',
            color: '#112D4E',
            borderColor: '#DBE2EF',
          }}
        >
          <PrintIcon sx={{ fontSize: 18 }} />
          PRINT CARD
        </button>

        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase text-white disabled:opacity-60 transition-all hover:opacity-95 shadow-md"
          style={{
            background: '#3F72AF',
          }}
        >
          <PictureAsPdfIcon sx={{ fontSize: 18 }} />
          {downloading ? 'GENERATING PDF...' : 'DOWNLOAD PDF'}
        </button>
      </div>
    </div>
  )
}