'use client'
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
interface RevealProps {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
}

interface FeatureCardProps {
  icon: string
  title: string
  desc: string
  delay?: number
}

interface StepItem {
  n: string
  title: string
  body: string
}

/* ══════════════════════════════════════════
   SCROLL REVEAL HOOK
══════════════════════════════════════════ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({ children, delay = 0, style = {} }: RevealProps) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.9s cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 0.9s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════
   WORD SCRAMBLE
══════════════════════════════════════════ */
function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const onEnter = useCallback(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplay(
        text.split('').map((c, j) =>
          c === ' ' ? ' ' : j <= i ? text[j] : chars[Math.floor(Math.random() * 26)]
        ).join('')
      )
      if (i++ >= text.length) clearInterval(interval)
    }, 38)
  }, [text])
  return <span onMouseEnter={onEnter} style={{ cursor: 'default', display: 'block' }}>{display}</span>
}

/* ══════════════════════════════════════════
   FEATURE CARD
══════════════════════════════════════════ */
function FeatureCard({ icon, title, desc, delay }: FeatureCardProps) {
  const { ref, visible } = useReveal()
  const [hovered, setHovered] = useState(false)
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.9s cubic-bezier(0.23,1,0.32,1) ${delay ?? 0}ms,
                     transform 0.9s cubic-bezier(0.23,1,0.32,1) ${delay ?? 0}ms,
                     background 0.3s, border-color 0.3s`,
        padding: 'clamp(24px, 4vw, 36px) clamp(20px, 3vw, 32px)',
        background: hovered ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '20px',
        backdropFilter: 'blur(20px)',
        cursor: 'default',
      }}
    >
      <div style={{ fontSize: '26px', marginBottom: '18px' }}>{icon}</div>
      <h3 style={{ fontSize: 'clamp(15px,2vw,18px)', fontWeight: 600, marginBottom: '10px', color: '#fff' }}>{title}</h3>
      <p style={{ fontSize: 'clamp(13px,1.5vw,14px)', lineHeight: 1.75, color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
    </div>
  )
}

/* ══════════════════════════════════════════
   MARQUEE
══════════════════════════════════════════ */
const MARQUEE_ITEMS = [
  'Persistent Memory', 'Local Inference', 'Africa first LLMs',
  'RAG Pipeline', 'Vector Search', 'Open Source', 'Fine-Tune Ready',
  'Streaming API', '128K Context', 'Zero Telemetry',
]

function Marquee() {
  const [paused, setPaused] = useState(false)
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '18px 0', overflow: 'hidden',
        background: 'rgba(255,255,255,0.01)',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{
        display: 'flex', gap: 0,
        width: 'max-content',
        animation: `marqueeSlide 28s linear infinite`,
        animationPlayState: paused ? 'paused' : 'running',
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '20px',
            padding: '0 36px', whiteSpace: 'nowrap',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(10px,1.5vw,12px)',
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
          }}>
            <span style={{
              width: 4, height: 4, borderRadius: '50%',
              background: 'rgba(59,130,246,0.6)',
              display: 'inline-block', flexShrink: 0,
            }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   FIXED JET — scroll-aware pointer
══════════════════════════════════════════ */
function ScrollJet() {
  const jetRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [landed, setLanded] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isDesktop) return

    const TARGETS: string[] = ['#hero-heading', '#features-heading', '#how-heading', '#cta-heading']
    let current = -1
    let rafId: number
    let jetX = window.innerWidth - 220
    let jetY = 160
    let targetX = jetX
    let targetY = jetY
    let isLanding = false

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const updateTarget = () => {
      const footer = document.getElementById('jet-base')
      if (footer) {
        const r = footer.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.85) {
          isLanding = true
          targetX = r.left + r.width / 2 - 28
          targetY = r.top - 100
          setLanded(true)
          return
        } else {
          isLanding = false
          setLanded(false)
        }
      }

      // Find which section heading is closest to top of viewport
      let bestIdx = 0
      let bestDist = Infinity
      TARGETS.forEach((sel, i) => {
        const el = document.querySelector(sel)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.top - 120)
        if (dist < bestDist) { bestDist = dist; bestIdx = i }
      })

      if (bestIdx !== current) {
        current = bestIdx
        const el = document.querySelector(TARGETS[bestIdx])
        if (el) {
          const r = el.getBoundingClientRect()
          // Jet sits to the right of the heading, pointing left toward it
          targetX = Math.min(r.right + 32, window.innerWidth - 200)
          targetY = r.top + r.height / 2 - 20
        }
      }
    }

    const tick = () => {
      updateTarget()
      jetX = lerp(jetX, targetX, 0.045)
      jetY = lerp(jetY, targetY, 0.045)
      if (jetRef.current) {
        const flipX = isLanding ? false : true // pointing left toward heading = flip
        jetRef.current.style.transform = `translate(${jetX}px, ${jetY}px) scaleX(${flipX ? -1 : 1}) ${isLanding ? 'rotate(-90deg)' : 'rotate(0deg)'}`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', updateTarget, { passive: true })
    rafId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', updateTarget)
    }
  }, [isDesktop])

  if (!isDesktop) return null

  return (
    <div
      ref={jetRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: 56, zIndex: 400,
        pointerEvents: 'none',
        filter: landed
          ? 'drop-shadow(0 0 10px rgba(59,130,246,0.6))'
          : 'drop-shadow(0 0 8px rgba(59,130,246,0.5))',
        transition: 'filter 0.4s',
        willChange: 'transform',
      }}
    >
      <svg viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Fuselage */}
        <path d="M24 4 Q36 20 36 40 Q36 62 24 76 Q12 62 12 40 Q12 20 24 4Z"
          fill="url(#jf)" stroke="rgba(59,130,246,0.4)" strokeWidth="0.5"/>
        {/* Cockpit */}
        <ellipse cx="24" cy="18" rx="5" ry="8"
          fill="rgba(59,130,246,0.5)" stroke="rgba(59,130,246,0.6)" strokeWidth="0.5"/>
        {/* Left wing */}
        <path d="M12 38 L2 52 L16 46Z"
          fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5"/>
        {/* Right wing */}
        <path d="M36 38 L46 52 L32 46Z"
          fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.3)" strokeWidth="0.5"/>
        {/* Left tail */}
        <path d="M18 68 L10 76 L20 72Z" fill="rgba(59,130,246,0.35)"/>
        {/* Right tail */}
        <path d="M30 68 L38 76 L28 72Z" fill="rgba(59,130,246,0.35)"/>
        {/* Engine glow — bottom when upright = nose when flying */}
        <ellipse cx="24" cy="74" rx="4" ry="3" fill="url(#eg)"/>
        {/* Highlight */}
        <path d="M21 8 Q22 18 22 32" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeLinecap="round"/>
        <defs>
          <linearGradient id="jf" x1="24" y1="4" x2="24" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1a2a4a"/>
            <stop offset="60%" stopColor="#162035"/>
            <stop offset="100%" stopColor="#0d1525"/>
          </linearGradient>
          <radialGradient id="eg" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function Home() {
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [ring, setRing] = useState({ x: -100, y: -100 })
  const ringRef = useRef({ x: -100, y: -100 })
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isDesktop) return
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    let raf: number
    const animate = () => {
      ringRef.current.x += (cursor.x - ringRef.current.x) * 0.11
      ringRef.current.y += (cursor.y - ringRef.current.y) * 0.11
      setRing({ ...ringRef.current })
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [isDesktop, cursor.x, cursor.y])

  const steps: StepItem[] = [
    { n: '01', title: 'You speak', body: 'Your message is embedded into a 384-dim semantic vector, locally on your machine.' },
    { n: '02', title: 'Velophos remembers', body: 'ChromaDB retrieves the most relevant past context via cosine similarity across your entire history.' },
    { n: '03', title: 'Precision response', body: 'Context feeds the local LLM. Token-streamed back to you in under a second.' },
  ]

  return (
    <>
      {/* ── Custom cursor (desktop only) ── */}
      {isDesktop && (
        <>
          <div style={{
            position: 'fixed', width: 7, height: 7, borderRadius: '50%',
            background: '#3b82f6', pointerEvents: 'none', zIndex: 9999,
            left: cursor.x, top: cursor.y, transform: 'translate(-50%,-50%)',
            boxShadow: '0 0 12px #3b82f6', mixBlendMode: 'screen',
          }} />
          <div style={{
            position: 'fixed', width: 32, height: 32, borderRadius: '50%',
            border: '1px solid rgba(59,130,246,0.35)', pointerEvents: 'none', zIndex: 9998,
            left: ring.x, top: ring.y, transform: 'translate(-50%,-50%)',
          }} />
        </>
      )}

      <Navbar />
      <ScrollJet />

      <main style={{ background: '#000', color: '#fff', overflowX: 'hidden' }}>

        {/* ══════════ HERO ══════════ */}
        <section id="hero" style={{
          minHeight: '100svh',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-start',
          padding: 'clamp(100px,12vw,140px) clamp(20px,7vw,96px) clamp(60px,8vw,100px)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'clamp(9px,1.5vw,11px)',
            letterSpacing: '4px', color: 'rgba(59,130,246,0.8)',
            textTransform: 'uppercase', marginBottom: 'clamp(20px,3vw,28px)',
            animation: 'fadeUp 0.7s 0.1s both',
          }}>
            v0.1 Beta · Open Source Core
          </div>

          <h1 id="hero-heading" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(68px,13vw,160px)',
            lineHeight: 0.88, letterSpacing: '2px',
            marginBottom: 'clamp(24px,4vw,36px)',
            animation: 'fadeUp 0.8s 0.25s both',
          }}>
            <ScrambleText text="VELOPHOS" />
          </h1>

          <p style={{
            fontSize: 'clamp(15px,2.2vw,20px)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            maxWidth: 'min(520px, 90vw)',
            marginBottom: 'clamp(36px,5vw,52px)',
            animation: 'fadeUp 0.8s 0.4s both',
          }}>
            An AI that remembers everything you've told it.<br />
            Fast. Private. Runs on your machine.
          </p>

          <div style={{
            display: 'flex', gap: '12px', flexWrap: 'wrap',
            animation: 'fadeUp 0.8s 0.55s both',
          }}>
            <Link href="/signup" style={{
              padding: 'clamp(12px,2vw,15px) clamp(24px,4vw,38px)',
              borderRadius: '100px',
              background: '#fff', color: '#000',
              fontSize: 'clamp(13px,1.5vw,14px)', fontWeight: 600,
              textDecoration: 'none', display: 'inline-block',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              Get Early Access
            </Link>
            <Link href="/docs" style={{
              padding: 'clamp(12px,2vw,15px) clamp(24px,4vw,38px)',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              fontSize: 'clamp(13px,1.5vw,14px)', fontWeight: 500,
              textDecoration: 'none', display: 'inline-block',
              backdropFilter: 'blur(12px)',
              transition: 'border-color 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            >
              Read the Docs
            </Link>
          </div>

          {/* Scroll cue */}
          <div style={{
            position: 'absolute', bottom: 'clamp(24px,4vw,40px)',
            left: 'clamp(20px,7vw,96px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            animation: 'fadeUp 0.8s 1s both',
          }}>
            <div style={{
              width: 1, height: 44,
              background: 'linear-gradient(to bottom, rgba(59,130,246,0.7), transparent)',
              animation: 'pulseLine 2s ease infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '3px', color: 'rgba(255,255,255,0.2)',
            }}>SCROLL</span>
          </div>
        </section>

        {/* ══════════ MARQUEE ══════════ */}
        <Marquee />

        {/* ══════════ STATEMENT ══════════ */}
        <section style={{
          padding: 'clamp(72px,10vw,120px) clamp(20px,7vw,96px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <Reveal>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px,5.5vw,72px)',
              lineHeight: 1.08, letterSpacing: '1px',
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '820px',
            }}>
              Not a wrapper.<br />
              <span style={{ color: 'rgba(59,130,246,0.85)' }}>An intelligence</span> that knows<br />
              your context — always.
            </p>
          </Reveal>
          <Reveal delay={150} style={{ marginTop: '24px' }}>
            <p style={{
              fontSize: 'clamp(14px,1.8vw,16px)',
              color: 'rgba(255,255,255,0.38)',
              maxWidth: '460px', lineHeight: 1.85, fontWeight: 300,
            }}>
              Built on open-source models running entirely on your hardware.
              No cloud dependency. No data leaks. Just raw intelligence.
            </p>
          </Reveal>
        </section>

        {/* ══════════ ABOUT ══════════ */}
        <section style={{
          padding: 'clamp(60px,8vw,100px) clamp(20px,7vw,96px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(40px,6vw,80px)',
          alignItems: 'center',
        }}>
          <div>
            <Reveal>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                letterSpacing: '4px', color: 'rgba(59,130,246,0.7)',
                textTransform: 'uppercase', display: 'block', marginBottom: '20px',
              }}>About</span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px,5vw,64px)',
                letterSpacing: '2px', color: '#fff',
                lineHeight: 0.95, marginBottom: '28px',
              }}>
                BUILT IN<br />AFRICA
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p style={{
                fontSize: 'clamp(14px,1.6vw,15px)',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.85, maxWidth: '440px',
              }}>
                Velophos is being built by a solo founder in Port Harcourt, Nigeria —
                proving that world-class AI infrastructure doesn't require Silicon Valley.
                Open source at its core. Scale to millions.
              </p>
            </Reveal>
          </div>

          {/* Stats grid */}
          <Reveal delay={150}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}>
              {[
                { val: '128K', label: 'Context window' },
                { val: '<1s', label: 'Response time' },
                { val: '100%', label: 'Local inference' },
                { val: 'AES-256', label: 'Data encryption' },
              ].map(({ val, label }) => (
                <div key={label} style={{
                  padding: 'clamp(20px,3vw,28px) clamp(16px,2.5vw,24px)',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(20px)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(28px,4vw,40px)',
                    letterSpacing: '1px',
                    color: '#fff', marginBottom: '6px',
                  }}>{val}</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '2px', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                  }}>{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ══════════ FEATURES ══════════ */}
        <section style={{
          padding: 'clamp(60px,8vw,100px) clamp(20px,7vw,96px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <Reveal style={{ marginBottom: 'clamp(40px,6vw,64px)' }}>
            <span id="features-heading" style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              letterSpacing: '4px', color: 'rgba(59,130,246,0.7)',
              textTransform: 'uppercase',
            }}>
              Core Capabilities
            </span>
          </Reveal>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '14px',
          }}>
            <FeatureCard delay={0} icon="🧠" title="Persistent Memory"
              desc="Semantically recalls context from any previous conversation using vector search — not just the last few messages." />
            <FeatureCard delay={80} icon="⚡" title="Local Inference"
              desc="Runs Mistral 7B or Phi-3 Mini entirely on your CPU. Your prompts never leave your machine." />
            <FeatureCard delay={160} icon="🔐" title="Secure by Default"
              desc="AES-256 encrypted memory store, HMAC-signed sessions, and zero third-party telemetry." />
            <FeatureCard delay={240} icon="🔬" title="Fine-Tune Ready"
              desc="LoRA fine-tuning hooks built in. Train the model on your own data when you're ready for Phase 2." />
          </div>
        </section>

        {/* ══════════ HOW IT WORKS ══════════ */}
        <section style={{
          padding: 'clamp(60px,8vw,100px) clamp(20px,7vw,96px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <Reveal style={{ marginBottom: 'clamp(40px,6vw,72px)' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              letterSpacing: '4px', color: 'rgba(59,130,246,0.7)',
              textTransform: 'uppercase', display: 'block', marginBottom: '16px',
            }}>How It Works</span>
            <h2 id="how-heading" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px,5vw,64px)',
              letterSpacing: '2px', color: '#fff',
            }}>Three steps to smarter AI</h2>
          </Reveal>

          <div style={{
            display: 'flex', flexDirection: 'column',
            maxWidth: '680px',
          }}>
            {steps.map(({ n, title, body }, i) => (
              <Reveal key={n} delay={i * 80}>
                <div style={{
                  display: 'flex', gap: 'clamp(16px,4vw,32px)', alignItems: 'flex-start',
                  padding: 'clamp(24px,4vw,36px) 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px',
                    color: 'rgba(59,130,246,0.6)', letterSpacing: '2px',
                    minWidth: '28px', paddingTop: '3px', flexShrink: 0,
                  }}>{n}</span>
                  <div>
                    <h3 style={{
                      fontSize: 'clamp(17px,2.2vw,20px)',
                      fontWeight: 600, marginBottom: '8px',
                    }}>{title}</h3>
                    <p style={{
                      fontSize: 'clamp(13px,1.5vw,14px)',
                      color: 'rgba(255,255,255,0.45)', lineHeight: 1.8,
                    }}>{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════════ CTA ══════════ */}
        <section style={{
          padding: 'clamp(80px,12vw,160px) clamp(20px,7vw,96px)',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        }}>
          <Reveal>
            <h2 id="cta-heading" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(52px,9vw,112px)',
              lineHeight: 0.9, letterSpacing: '2px',
              marginBottom: 'clamp(32px,5vw,48px)',
            }}>
              BUILD<br />
              <span style={{ color: 'rgba(59,130,246,0.8)' }}>WITH US</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/signup" style={{
                padding: 'clamp(13px,2vw,16px) clamp(28px,4vw,42px)',
                borderRadius: '100px',
                background: '#fff', color: '#000',
                fontSize: 'clamp(13px,1.5vw,14px)', fontWeight: 600,
                textDecoration: 'none', display: 'inline-block',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' }}
              >
                Get Early Access
              </Link>
              <a href="mailto:odjojitehilla@gmail.com" style={{
                fontSize: 'clamp(12px,1.4vw,14px)', fontFamily: 'var(--font-mono)',
                color: 'rgba(255,255,255,0.3)',
                textDecoration: 'none', letterSpacing: '0.5px',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(59,130,246,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
              >
                odjojitehilla@gmail.com
              </a>
            </div>
          </Reveal>
        </section>

        {/* ══════════ FOOTER ══════════ */}
        <footer id="footer" style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: 'clamp(36px,5vw,56px) clamp(20px,7vw,96px)',
          position: 'relative',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 'clamp(36px,5vw,64px)',
            marginBottom: 'clamp(36px,5vw,56px)',
          }}>
            {/* Brand */}
            <div>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,28px)',
                letterSpacing: '3px', color: '#fff', display: 'block', marginBottom: '14px',
              }}>VELOPHOS</span>
              <p style={{
                fontSize: '13px', color: 'rgba(255,255,255,0.3)',
                lineHeight: 1.8, maxWidth: '260px',
              }}>
                Open-source AI with persistent memory. Built in Port Harcourt, NG.
              </p>

              {/* Social links + Jet landing zone */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '24px', alignItems: 'center' }}>
                {[
                  { href: 'https://facebook.com/tehilla.odjoji', label: 'Facebook', svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  )},
                  { href: 'https://x.com/TOdjoji', label: 'X / Twitter', svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )},
                  { href: 'https://github.com', label: 'GitHub', svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                      <path d="M9 18c-4.51 2-5-2-7-2"/>
                    </svg>
                  )},
                ].map(({ href, label, svg }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.4)',
                      transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.background = 'rgba(59,130,246,0.08)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {svg}
                  </a>
                ))}
              </div>

              {/* Jet landing pad */}
              <div id="jet-base" style={{
                marginTop: '28px',
                width: '52px', height: '52px',
                borderRadius: '50%',
                border: '1px solid rgba(59,130,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  border: '1px solid rgba(59,130,246,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: 'rgba(59,130,246,0.5)',
                    boxShadow: '0 0 8px rgba(59,130,246,0.6)',
                  }} />
                </div>
                {/* Landing pad glow line */}
                <div style={{
                  position: 'absolute', bottom: '-12px', left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px', height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)',
                }} />
              </div>
            </div>

            {/* Product links */}
            <div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px',
                letterSpacing: '3px', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', marginBottom: '20px',
              }}>Product</p>
              {[
                { label: 'Features', href: '#features-heading' },
                { label: 'How it works', href: '#how-heading' },
                { label: 'Docs', href: '/docs' },
                { label: 'Pricing', href: '/pricing' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} style={{
                  display: 'block', fontSize: '13px',
                  color: 'rgba(255,255,255,0.35)',
                  textDecoration: 'none', marginBottom: '12px',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Account links */}
            <div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px',
                letterSpacing: '3px', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', marginBottom: '20px',
              }}>Account</p>
              {[
                { label: 'Sign Up', href: '/signup' },
                { label: 'Login', href: '/login' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} style={{
                  display: 'block', fontSize: '13px',
                  color: 'rgba(255,255,255,0.35)',
                  textDecoration: 'none', marginBottom: '12px',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 'clamp(20px,3vw,28px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: 'rgba(255,255,255,0.18)',
            }}>
              © 2025 Velophos · Port Harcourt, NG
            </span>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px',
                  color: 'rgba(255,255,255,0.18)',
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseLine {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 1; }
        }
        @keyframes marqueeSlide {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  )
}
