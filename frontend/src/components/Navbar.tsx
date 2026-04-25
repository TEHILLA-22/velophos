'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 48px',
      height: '68px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      backdropFilter: scrolled ? 'blur(28px)' : 'blur(0px)',
      background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
    }}>
      <Link href="/" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '26px', letterSpacing: '4px',
        color: 'var(--white)', textDecoration: 'none',
      }}>
        VELOPHOS
      </Link>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        {[
          { label: 'Docs', href: '/docs' },
          { label: 'Login', href: '/login' },
        ].map(({ label, href }) => (
          <Link key={href} href={href} style={{
            color: 'var(--white-70)', fontSize: '14px',
            fontWeight: 500, letterSpacing: '0.5px',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          >
            {label}
          </Link>
        ))}

        <Link href="/signup" style={{
          padding: '10px 28px',
          borderRadius: '100px',
          background: 'var(--white)',
          color: '#000',
          fontSize: '13px', fontWeight: 600,
          letterSpacing: '0.5px',
          textDecoration: 'none',
          transition: 'opacity 0.2s, transform 0.2s',
          display: 'inline-block',
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Get Early Access
        </Link>
      </div>
    </nav>
  )
}