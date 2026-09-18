import React, { Suspense, lazy, useRef, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext.jsx'

import CustomToaster from './components/CustomToaster.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'


/* ============================================================
   LAZY LOADED PAGES
============================================================ */

const Home = lazy(() => import('./pages/Home.jsx'))
const Mission = lazy(() => import('./pages/Mission.jsx'))
const Training = lazy(() => import('./pages/Training.jsx'))
const CourseDetail = lazy(() => import('./pages/CourseDetail.jsx'))
const Gallery = lazy(() => import('./pages/Gallery.jsx'))
const Location = lazy(() => import('./pages/Location.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Registration = lazy(() => import('./pages/Registration.jsx'))
const MonthlyFees = lazy(() => import('./pages/MonthlyFees.jsx'))

const PortalLogin = lazy(() => import('./pages/PortalLogin.jsx'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard.jsx'))
const AdminPanel = lazy(() => import('./pages/AdminPanel.jsx'))

const NotFound = lazy(() => import('./pages/NotFound.jsx'))


/* ============================================================
   PAGE LOADER
============================================================ */

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#F9F7F7]">

      <div
        className="
          w-12
          h-12
          border-4
          border-[#DBE2EF]
          border-t-[#3F72AF]
          rounded-full
          animate-spin
        "
      />

    </div>
  )
}


/* ============================================================
   APP
============================================================ */

export default function App() {

  const location = useLocation()
  const { user, clearSession } = useAuth()
  const prevPathRef = useRef(location.pathname)

  // Automatically log out whenever leaving the Admin Portal or Student Portal
  useEffect(() => {
    const prev = prevPathRef.current
    const current = location.pathname

    if (prev.startsWith('/admin') && !current.startsWith('/admin')) {
      if (user?.role === 'ADMIN') {
        clearSession()
      }
    }

    if (prev.startsWith('/student-dashboard') && !current.startsWith('/student-dashboard')) {
      if (user?.role === 'STUDENT') {
        clearSession()
      }
    }

    prevPathRef.current = current
  }, [location.pathname, user, clearSession])

  const isAdmin =
    location.pathname.startsWith('/admin')

  const isStudent =
    location.pathname.startsWith('/student')


  return (

    <div
      className="
        min-h-screen
        flex
        flex-col
        bg-[#F9F7F7]
        text-[#112D4E]
      "
    >

      {/* =====================================================
          SCROLL TO TOP ON ROUTE CHANGE
      ===================================================== */}
      <ScrollToTop />

      {/* =====================================================
          GLOBAL TOAST (Custom Line-by-Line & Vertical Stack)
      ===================================================== */}
      <CustomToaster />


      {/* =====================================================
          PUBLIC NAVBAR
      ===================================================== */}

      {!isAdmin && !isStudent && (
        <Navbar />
      )}


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="flex-1">

        <ErrorBoundary>
          <Suspense
            fallback={<PageLoader />}
          >

            <AnimatePresence mode="wait">

              <Routes
                location={location}
                key={location.pathname}
              >

                <Route
                  path="/"
                  element={<Home />}
                />

                <Route
                  path="/mission"
                  element={<Mission />}
                />

                <Route
                  path="/training"
                  element={<Training />}
                />

                <Route
                  path="/training/:slug"
                  element={<CourseDetail />}
                />

                <Route
                  path="/training/:courseSlug"
                  element={<CourseDetail />}
                />

                <Route
                  path="/gallery"
                  element={<Gallery />}
                />

                <Route
                  path="/location"
                  element={<Location />}
                />

                <Route
                  path="/contact"
                  element={<Contact />}
                />

                <Route
                  path="/register"
                  element={<Registration />}
                />

                <Route
                  path="/fees"
                  element={<MonthlyFees />}
                />

                <Route
                  path="/monthly-fees"
                  element={<MonthlyFees />}
                />

                <Route
                  path="/login"
                  element={<PortalLogin />}
                />

                <Route
                  path="/portal-login"
                  element={<PortalLogin />}
                />

                <Route
                  path="/student-login"
                  element={<PortalLogin />}
                />

                <Route
                  path="/student-dashboard"
                  element={<StudentDashboard />}
                />

                <Route
                  path="/admin-login"
                  element={<PortalLogin />}
                />

                <Route
                  path="/admin"
                  element={<AdminPanel />}
                />

                <Route
                  path="/admin/*"
                  element={<AdminPanel />}
                />

                <Route
                  path="*"
                  element={<NotFound />}
                />

              </Routes>

            </AnimatePresence>

          </Suspense>
        </ErrorBoundary>

      </main>


      {/* =====================================================
          PUBLIC FOOTER & WHATSAPP
      ===================================================== */}

      {!isAdmin && !isStudent && (
        <>
          <WhatsAppButton />
          <Footer />
        </>
      )}

    </div>
  )
}