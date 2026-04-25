'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const LINKS = [
  { label: 'Sign Up', href: '/signup', icon: '→' },
  { label: 'Login', href: '/login', icon: '→' },
  { label: 'Docs', href: '/docs', icon: '→' },
]

export default function FlyingJet() {
  const jetRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [landed, setLanded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 900) return

    let x = window.innerWidth * 0.62
    let y = 180
    let angle = 0
    let phase = 0
    let scrollY = 0
    let isLanding = false
    let isLanded = false
    let rafId: number
    let modalAutoTimer: ReturnType<typeof setTimeout>

    const W = () => window.innerWidth
    const H = () => window.innerHeight

    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Auto-show modal once after delay
    modalAutoTimer = setTimeout(() => setModalOpen(true), 3200)

    function tick() {
      const docH = document.body.scrollHeight
      const progress = Math.min(scrollY / (docH - H()), 1)

      // Check if near footer
      const footer = document.getElementById('footer-base')
      if (footer) {
        const rect = footer.getBoundingClientRect()
        if (rect.top < H() * 0.72 && !isLanded) {
          isLanding = true
        }
        if (rect.top > H() * 0.85) {
          isLanding = false
          isLanded = false
          setLanded(false)
        }
      }

      if (isLanding) {
        const footer = document.getElementById('footer-base')
        if (footer) {
          const r = footer.getBoundingClientRect()
          const tx = r.left + r.width / 2 - 80
          const ty = r.top - 40
          x += (tx - x) * 0.045
          y += (ty - y) * 0.045
          angle += (0 - angle) * 0.06
          const dist = Math.hypot(tx - x, ty - y)
          if (dist < 12 && !isLanded) {
            isLanded = true
            setLanded(true)
            setModalOpen(true)
          }
        }
      } else {
        phase += 0.007
        const amp = 55 - progress * 20

        // Shift orbit zone based on scroll progress
        const zoneX = progress < 0.35
          ? W() * 0.65
          : progress < 0.65
            ? W() * 0.5
            : W() * 0.3

        const tx = zoneX + Math.cos(phase * 0.7) * amp * 0.6
        const ty = 160 + progress * (H() - 320) + Math.sin(phase) * amp

        const dx = tx - x
        const dy = ty - y
        x += dx * 0.018
        y += dy * 0.018

        angle = Math.atan2(dy, dx) * (180 / Math.PI) * 0.35
      }

      if (jetRef.current) {
        const flipX = x < window.innerWidth / 2 && !isLanding
        jetRef.current.style.transform =
          `translate(${x}px, ${y}px) rotate(${angle}deg) scaleX(${flipX ? -1 : 1})`
      }

      if (modalRef.current && modalOpen) {
        modalRef.current.style.left = `${x + 175}px`
        modalRef.current.style.top = `${y - 8}px`
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(modalAutoTimer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [modalOpen])

  return (
    <>
      {/* JET */}
      <div
        ref={jetRef}
        onClick={() => setModalOpen(v => !v)}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '160px', zIndex: 600,
          cursor: 'pointer', userSelect: 'none',
          pointerEvents: 'all',
          filter: 'drop-shadow(0 0 14px rgba(59,130,246,0.7))',
        }}
        className="jet-hide-mobile"
      >
        <svg viewBox="0 0 160 68" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main fuselage */}
          <path d="M8 34 Q52 14 138 33 Q52 52 8 34Z" fill="url(#fb)" opacity="0.93"/>
          {/* Cockpit */}
          <path d="M100 33 Q122 25 140 33 Q122 41 100 33Z" fill="rgba(59,130,246,0.55)" stroke="rgba(59,130,246,0.5)" strokeWidth="0.6"/>
          {/* Top wing */}
          <path d="M54 32 L82 8 L92 32Z" fill="rgba(59,130,246,0.22)" stroke="rgba(59,130,246,0.35)" strokeWidth="0.5"/>
          {/* Bottom wing */}
          <path d="M54 36 L82 60 L92 36Z" fill="rgba(59,130,246,0.14)" stroke="rgba(59,130,246,0.25)" strokeWidth="0.5"/>
          {/* Tail fins */}
          <path d="M18 33 L8 23 L16 33Z" fill="rgba(59,130,246,0.45)"/>
          <path d="M18 35 L8 45 L16 35Z" fill="rgba(59,130,246,0.35)"/>
          {/* Engine glow */}
          <ellipse cx="10" cy="34" rx="5" ry="3" fill="url(#eg)"/>
          {/* Highlight */}
          <path d="M70 27 Q110 23 136 31" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" strokeLinecap="round"/>
          <defs>
            <linearGradient id="fb" x1="8" y1="34" x2="145" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0d1929"/>
              <stop offset="50%" stopColor="#162540"/>
              <stop offset="100%" stopColor="#1e3a5f"/>
            </linearGradient>
            <radialGradient id="eg">
              <stop offset="0%" stopColor="#3b82f6"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* MODAL */}
      <div
        ref={modalRef}
        className="jet-hide-mobile"
        style={{
          position: 'fixed', top: 0, left: 0,
          zIndex: 601,
          background: 'rgba(4,8,16,0.92)',
          border: '1px solid rgba(59,130,246,0.28)',
          borderRadius: '16px',
          padding: '18px 22px',
          minWidth: '180px',
          backdropFilter: 'blur(32px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(59,130,246,0.1)',
          opacity: modalOpen ? 1 : 0,
          transform: modalOpen ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(8px)',
          pointerEvents: modalOpen ? 'all' : 'none',
          transition: 'opacity 0.25s cubic-bezier(0.23,1,0.32,1), transform 0.25s cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          letterSpacing: '3px', color: 'rgba(59,130,246,0.7)',
          textTransform: 'uppercase', marginBottom: '14px',
        }}>
          Quick Nav
        </p>
        {LINKS.map(({ label, href, icon }) => (
          <Link key={href} href={href} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0',
            color: 'rgba(255,255,255,0.75)',
            textDecoration: 'none',
            fontSize: '14px', fontWeight: 500,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          >
            <span>{label}</span>
            <span style={{ color: 'var(--blue)', fontSize: '12px' }}>{icon}</span>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) { .jet-hide-mobile { display: none !important; } }
      `}</style>
    </>
  )
}