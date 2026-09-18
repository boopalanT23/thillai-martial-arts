import React from 'react'

export default function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 bg-[#112D4E]">
      <div className="relative w-12 h-12">
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: '3px solid rgba(63, 114, 175, 0.25)', borderTopColor: '#3F72AF', animation: 'spin .8s linear infinite' }}
        />
      </div>
      <div className="text-center">
        <p className="font-display font-extrabold text-base text-[#F9F7F7] uppercase tracking-wider">Thillai Martial Arts Club</p>
        <p className="font-sans text-xs font-semibold tracking-widest uppercase mt-1 text-[#3F72AF]">Loading…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
