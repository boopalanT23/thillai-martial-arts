import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,

            style: {
              background: '#F9F7F7',
              color: '#112D4E',
              border: '1px solid #DBE2EF',
              borderRadius: '10px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              boxShadow: '0 10px 30px rgba(17, 45, 78, 0.12)',
            },

            success: {
              iconTheme: {
                primary: '#3F72AF',
                secondary: '#F9F7F7',
              },
            },

            error: {
              iconTheme: {
                primary: '#112D4E',
                secondary: '#F9F7F7',
              },
            },
          }}
        />

      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)