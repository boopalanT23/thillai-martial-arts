/* ─────────────────────────────────────────────────────────────
   api.js – Centralised Axios service layer
   ───────────────────────────────────────────────────────────── */
import axios from 'axios'
import { BACKEND_URL } from '../utils/imageUtils.js'

const API = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
})

/* Attach token automatically */
API.interceptors.request.use(config => {
  const token = sessionStorage.getItem('thillai_token') || localStorage.getItem('thillai_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* ── Auth ─────────────────────────────────────────────────── */
export const authAPI = {
  login:        (identifier, password, role) => API.post('/api/auth/login', { identifier, password, role }),
  studentLogin: (identifier, password)       => API.post('/api/auth/student-login', { identifier, password }),
  adminLogin:   (username, password)         => API.post('/api/auth/admin-login', { username, password }),
  refreshToken: ()                           => API.post('/api/auth/refresh'),
}

/* ── Students ─────────────────────────────────────────────── */
export const studentAPI = {
  register:         (formData)          => API.post('/api/students/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getProfile:       ()                  => API.get('/api/students/me'),
  getById:          (id)                => API.get(`/api/students/${id}`),
  search:           (query)             => API.get('/api/students/search', { params: { q: query } }),
  getIdCard:        (id)                => API.get(`/api/students/${id}/id-card`),
  getAttendance:    (id)                => API.get(`/api/students/${id}/attendance`),
  // Admin only
  getAll:           (params)            => API.get('/api/admin/students', { params }),
  update:           (id, data)          => API.put(`/api/admin/students/${id}`, data),
  uploadAadhaar:    (id, formData)      => API.post(`/api/admin/students/${id}/aadhaar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete:           (id)                => API.delete(`/api/admin/students/${id}`),
  resetPassword:    (id, newPassword)   => API.put(`/api/admin/students/${id}/reset-password`, { newPassword }),
  exportExcel:      ()                  => API.get('/api/admin/students/export/excel', { responseType: 'blob' }),
}

/* ── Payments ─────────────────────────────────────────────── */
export const paymentAPI = {
  createOrder:      (data)          => API.post('/api/payments/create-order', data),
  verifyPayment:    (data)          => API.post('/api/payments/verify', data),
  getHistory:       (studentId)     => API.get(`/api/payments/history/${studentId}`),
  getDue:           (studentId)     => API.get(`/api/payments/due/${studentId}`),
  downloadInvoice:  (paymentId)     => API.get(`/api/payments/${paymentId}/invoice`, { responseType: 'blob' }),
  // Admin
  getAll:           (params)        => API.get('/api/admin/payments', { params }),
  getDashboardStats:()              => API.get('/api/admin/payments/stats'),
}

/* ── Gallery ──────────────────────────────────────────────── */
export const galleryAPI = {
  getAll:           (category)      => API.get('/api/gallery', { params: category ? { category } : {} }),
  getCategories:    ()              => API.get('/api/gallery/categories'),
  // Admin
  upload:           (formData)      => API.post('/api/admin/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete:           (id)            => API.delete(`/api/admin/gallery/${id}`),
}

/* ── Contact ──────────────────────────────────────────────── */
export const contactAPI = {
  submit:           (data)          => API.post('/api/contact', data),
  // Admin
  getAll:           (params)        => API.get('/api/admin/contacts', { params }),
  markRead:         (id)            => API.patch(`/api/admin/contacts/${id}/read`),
  delete:           (id)            => API.delete(`/api/admin/contacts/${id}`),
}

/* ── Courses & Batches ────────────────────────────────────── */
export const courseAPI = {
  getAll:           ()              => API.get('/api/courses'),
  getBySlug:        (slug)          => API.get(`/api/courses/${slug}`),
  getOne:           (slug)          => API.get(`/api/courses/${slug}`),
  // Admin
  create:           (data)          => API.post('/api/admin/courses', data),
  update:           (id, data)      => API.put(`/api/admin/courses/${id}`, data),
  delete:           (id)            => API.delete(`/api/admin/courses/${id}`),
}

export const batchAPI = {
  getAll:           ()              => API.get('/api/batches'),
  getById:          (id)            => API.get(`/api/batches/${id}`),
  // Admin
  create:           (data)          => API.post('/api/admin/batches', data),
  update:           (id, data)      => API.put(`/api/admin/batches/${id}`, data),
  delete:           (id)            => API.delete(`/api/admin/batches/${id}`),
  getStudents:      (id)            => API.get(`/api/admin/batches/${id}/students`),
}

/* ── Trainers ─────────────────────────────────────────────── */
export const trainerAPI = {
  getAll:           ()              => API.get('/api/trainers'),
  // Admin
  create:           (formData)      => API.post('/api/admin/trainers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update:           (id, formData)  => API.put(`/api/admin/trainers/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete:           (id)            => API.delete(`/api/admin/trainers/${id}`),
}

/* ── Affiliations ─────────────────────────────────────────── */
export const affiliationAPI = {
  getAll:           ()              => API.get('/api/affiliations'),
  // Admin
  update:           (id, formData)  => API.put(`/api/admin/affiliations/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

/* ── Notifications ────────────────────────────────────────── */
export const notificationAPI = {
  getForStudent:    (id)            => API.get(`/api/notifications/${id}`),
  markRead:         (id)            => API.patch(`/api/notifications/${id}/read`),
  // Admin
  send:             (data)          => API.post('/api/admin/notifications', data),
}

/* ── Admin Dashboard ──────────────────────────────────────── */
export const adminAPI = {
  getDashboard:     ()              => API.get('/api/admin/dashboard'),
  getMonthlyRevenue:(year)          => API.get('/api/admin/revenue/monthly', { params: { year } }),
  exportStudentsPDF:()              => API.get('/api/admin/students/export/pdf', { responseType: 'blob' }),
  exportPaymentsPDF:()              => API.get('/api/admin/payments/export/pdf', { responseType: 'blob' }),
  uploadLogo:       (formData)      => API.post('/api/admin/settings/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateSocialLinks:(data)          => API.put('/api/admin/settings/social', data),
  getSocialLinks:   ()              => API.get('/api/settings/social'),
}

/* ── Attendance ───────────────────────────────────────────── */
export const attendanceAPI = {
  mark:             (data)          => API.post('/api/admin/attendance', data),
  getReport:        (batchId, month)=> API.get(`/api/admin/attendance/report`, { params: { batchId, month } }),
}

export default API
