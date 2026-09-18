import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import PageLoader from './PageLoader.jsx'

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  // While authentication state is being checked
  if (loading) {
    return <PageLoader />
  }

  // Not logged in
  if (!isAuthenticated) {
    const loginPath = role === 'ADMIN' ? '/login?role=admin' : '/login?role=student'

    return (
      <Navigate
        to={loginPath}
        state={{ from: location }}
        replace
      />
    )
  }

  // Logged in, but wrong role
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />
  }

  // Everything is correct → render the protected page
  return children
}