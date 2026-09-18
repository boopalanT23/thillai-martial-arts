import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const TOKEN_KEY  = 'thillai_token'
const USER_KEY   = 'thillai_user'

/* Axios base URL */
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

/* Interceptor: attach JWT to every request */
axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* Interceptor: handle 401 globally */
axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(USER_KEY)
      // Redirect to unified portal login
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/portal-login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user,    setUser]    = useState(() => {
    const stored = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [token,   setToken]   = useState(() => sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(false)

  const saveSession = useCallback((tokenVal, userVal) => {
    sessionStorage.setItem(TOKEN_KEY, tokenVal)
    sessionStorage.setItem(USER_KEY, JSON.stringify(userVal))
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(tokenVal)
    setUser(userVal)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  /* Unified Portal Login (supports both Students and Admins) */
  const login = async (identifier, password, role = null) => {
    setLoading(true)

    try {
      const payload = {
        identifier: identifier.trim(),
        password: password,
      }
      if (role) payload.role = role

      const { data } = await axios.post('/api/auth/login', payload)

      const userObj = {
        role: data.role,
        name: data.name,
        studentId: data.studentId,
        username: data.username,
      }

      saveSession(data.token, userObj)
      toast.success(`Welcome back, ${userObj.name || userObj.username || 'Member'}!`)

      return {
        success: true,
        role: userObj.role,
        user: userObj,
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.message === 'Network Error' || !err.response
          ? 'Cannot connect to server. Please try again in a few moments.'
          : 'Invalid credentials or password. Please try again.')
      toast.error(msg)
      return {
        success: false,
        message: msg,
      }
    } finally {
      setLoading(false)
    }
  }

  /* Student login */
  const studentLogin = async (identifier, password) => {
    setLoading(true)

    try {
      const { data } = await axios.post('/api/auth/student-login', {
        identifier: identifier.trim(),
        password: password,
      })

      const userObj = {
        role: data.role,
        name: data.name,
        studentId: data.studentId,
      }

      saveSession(data.token, userObj)
      toast.success(`Welcome back, ${userObj.name}!`)

      return {
        success: true,
        role: userObj.role,
      }
    } catch (err) {
      console.error('Student Login Error:', err)
      const msg =
        err.response?.data?.message ||
        'Invalid Student ID/mobile or password.'
      toast.error(msg)
      return {
        success: false,
      }
    } finally {
      setLoading(false)
    }
  }

  /* Admin login */
  const adminLogin = async (username, password) => {
    setLoading(true)

    try {
      const { data } = await axios.post('/api/auth/admin-login', {
        username: username.trim(),
        password: password,
      })

      const userObj = {
        role: data.role,
        name: data.name,
        username: data.username,
      }

      saveSession(data.token, userObj)
      toast.success(`Welcome, ${userObj.name}!`)

      return {
        success: true,
        role: userObj.role,
      }
    } catch (err) {
      console.error('Admin Login Error:', err)
      const msg =
        err.response?.data?.message ||
        'Invalid username or password.'
      toast.error(msg)
      return {
        success: false,
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(() => {
    clearSession()
    toast.success('Logged out successfully')
    navigate('/', { replace: true })
  }, [clearSession, navigate])

  const isAuthenticated = Boolean(token && user)
  const isAdmin   = user?.role === 'ADMIN'
  const isStudent = user?.role === 'STUDENT'

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAuthenticated, isAdmin, isStudent,
      login, studentLogin, adminLogin, logout,
      clearSession,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
