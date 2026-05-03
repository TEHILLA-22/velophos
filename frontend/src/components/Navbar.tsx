'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Features', href: '/#features-heading' },
  { label: 'Docs', href: '/docs' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Login', href: '/login' },
] as const

const DRAWER_LINKS = [
  { label: 'Features', href: '/#features-heading', num: '01' },
  { label: 'Docs', href: '/docs', num: '02' },
  { label: 'Pricing', href: '/pricing', num: '03' },
  { label: 'Login', href: '/login', num: '04' },
  { label: 'Sign Up', href: '/signup', num: '05' },
] as const

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* ── NAV BAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 64,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(20px,5vw,48px)',
        backdropFilter: scrolled ? 'blur(32px)' : 'none',
        background: scrolled ? 'rgba(0,0,0,0.9)' : 'transparent',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid transparent',
        transition: 'background 0.5s, border-color 0.5s',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: 'clamp(18px,3vw,22px)',
          letterSpacing: '5px',
          color: '#fff',
          textDecoration: 'none',
          flexShrink: 0,
          lineHeight: 1,
        }}>
          VELOPHOS
        </Link>

        {/* Desktop links — hidden on mobile via CSS class */}
        <div className="vp-desktop-links" style={{
          display: 'flex', gap: 36, alignItems: 'center',
        }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} style={{
              fontFamily: "'Outfit', sans-serif",
              color: 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: 400,
              letterSpacing: '0.3px',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              {label}
            </Link>
          ))}

          <Link href="/signup" style={{
            fontFamily: "'Outfit', sans-serif",
            padding: '9px 22px',
            borderRadius: 100,
            background: '#fff',
            color: '#000',
            fontSize: 13, fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Get Access
          </Link>
        </div>

        {/* Hamburger — visible on mobile only */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="vp-hamburger"
          style={{
            width: 42, height: 42,
            border: 'none',
            background: 'transparent',
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-end', justifyContent: 'center',
            gap: 6, cursor: 'pointer', padding: 0,
            flexShrink: 0,
          }}
        >
          <span style={{
            display: 'block', width: 22, height: 1, background: '#fff',
            transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)',
            transformOrigin: 'center',
          }} />
          <span style={{
            display: 'block', width: 14, height: 1, background: '#fff',
            opacity: menuOpen ? 0 : 1,
            transition: 'opacity 0.2s, width 0.3s',
          }} />
          <span style={{
            display: 'block', width: 22, height: 1, background: '#fff',
            transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)',
            transformOrigin: 'center',
          }} />
        </button>
      </nav>

      {/* ── BACKDROP ── */}
      <div
        onClick={() => setMenuOpen(false)}
        className="vp-hamburger"
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 1001,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.4s',
        }}
      />

      {/* ── DRAWER — slides in from right ── */}
      <aside
        className="vp-hamburger"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          zIndex: 1002,
          width: 'min(320px, 86vw)',
          background: '#070707',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
        }}
      >
        {/* Drawer header */}
        <div style={{
          height: 64, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 18, letterSpacing: '4px', color: '#fff',
          }}>
            VELOPHOS
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              width: 34, height: 34,
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              background: 'transparent',
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, lineHeight: 1,
              fontWeight: 300,
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
            }}
          >
            ×
          </button>
        </div>

        {/* Links */}
        <nav style={{ flex: 1, padding: '24px 24px 0' }}>
          {DRAWER_LINKS.map(({ label, href, num }, i) => (
            <DrawerLink
              key={href}
              href={href}
              label={label}
              num={num}
              index={i}
              open={menuOpen}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </nav>

        {/* CTA + footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
          opacity: menuOpen ? 1 : 0,
          transition: `transform 0.55s cubic-bezier(0.16,1,0.3,1) ${DRAWER_LINKS.length * 55 + 80}ms,
                       opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${DRAWER_LINKS.length * 55 + 80}ms`,
        }}>
          <Link
            href="/signup"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', height: 48,
              borderRadius: 12,
              background: '#fff', color: '#000',
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Get Early Access
          </Link>

          <p style={{
            marginTop: 18,
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.15)',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            © 2025 Velophos
          </p>
        </div>
      </aside>

      <style>{`
        @media (min-width: 769px) {
          .vp-hamburger { display: none !important; }
          .vp-desktop-links { display: flex !important; }
        }
        @media (max-width: 768px) {
          .vp-hamburger { display: flex !important; }
          .vp-desktop-links { display: none !important; }
        }
      `}</style>
    </>
  )
}

/* ─── Drawer link row ─── */
interface DrawerLinkProps {
  href: string
  label: string
  num: string
  index: number
  open: boolean
  onClick: () => void
}

function DrawerLink({ href, label, num, index, open, onClick }: DrawerLinkProps) {
  const [hovered, setHovered] = useState(false)
  const delay = index * 55 + 100

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        textDecoration: 'none',
        transform: open ? 'translateX(0)' : 'translateX(28px)',
        opacity: open ? 1 : 0,
        transition: `transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     opacity 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, letterSpacing: '2px',
          color: hovered ? 'rgba(59,130,246,0.7)' : 'rgba(255,255,255,0.18)',
          transition: 'color 0.2s',
          flexShrink: 0,
        }}>
          {num}
        </span>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 20, fontWeight: 500,
          letterSpacing: '-0.2px',
          color: hovered ? '#fff' : 'rgba(255,255,255,0.6)',
          transition: 'color 0.2s',
        }}>
          {label}
        </span>
      </div>

      <span style={{
        color: hovered ? 'rgba(59,130,246,0.8)' : 'rgba(255,255,255,0.12)',
        fontSize: 15,
        transform: hovered ? 'translateX(3px)' : 'translateX(0)',
        transition: 'color 0.2s, transform 0.25s cubic-bezier(0.23,1,0.32,1)',
        display: 'inline-block',
        flexShrink: 0,
      }}>
        →
      </span>
    </Link>
  )
}
