'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import FlyingJet from '@/components/FlyingJet'

/* ─── tiny reusable hook for scroll reveal ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties
}) {
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

/* ─── FEATURE CARD ─── */
function FeatureCard({ icon, title, desc, delay }: {
  icon: string; title: string; desc: string; delay?: number
}) {
  const { ref, visible } = useReveal()
  const [hovered, setHovered] = useState(false)
  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.9s cubic-bezier(0.23,1,0.32,1) ${delay ?? 0}ms, transform 0.9s cubic-bezier(0.23,1,0.32,1) ${delay ?? 0}ms`,
      padding: '36px 32px',
      background: hovered ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.025)',
      border: `1px solid ${hovered ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: '20px',
      backdropFilter: 'blur(20px)',
      cursor: 'default',
      transitionProperty: 'opacity, transform, background, border-color, box-shadow',
      boxShadow: hovered ? '0 0 40px rgba(59,130,246,0.08)' : 'none',
    }}>
      <div style={{ fontSize: '28px', marginBottom: '20px' }}>{icon}</div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px', color: '#fff' }}>{title}</h3>
      <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
    </div>
  )
}

/* ─── WORD SCRAMBLE ─── */
function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const onEnter = () => {
    let i = 0
    const interval = setInterval(() => {
      setDisplay(text.split('').map((c, j) =>
        c === ' ' ? ' ' : j <= i ? text[j] : chars[Math.floor(Math.random() * 26)]
      ).join(''))
      if (i++ >= text.length) clearInterval(interval)
    }, 40)
  }
  return <span onMouseEnter={onEnter} style={{ cursor: 'default' }}>{display}</span>
}

export default function Home() {
  /* cursor */
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [ring, setRing] = useState({ x: -100, y: -100 })
  const ringRef = useRef({ x: -100, y: -100 })

  useEffect(() => {
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
  }, [cursor.x, cursor.y])

  return (
    <>
      {/* ── CURSOR ── */}
      <div style={{
        position: 'fixed', width: 8, height: 8, borderRadius: '50%',
        background: 'var(--blue)', pointerEvents: 'none', zIndex: 9999,
        left: cursor.x, top: cursor.y, transform: 'translate(-50%,-50%)',
        boxShadow: '0 0 16px var(--blue)', mixBlendMode: 'screen',
      }} />
      <div style={{
        position: 'fixed', width: 34, height: 34, borderRadius: '50%',
        border: '1px solid rgba(59,130,246,0.4)', pointerEvents: 'none', zIndex: 9998,
        left: ring.x, top: ring.y, transform: 'translate(-50%,-50%)',
        transition: 'width 0.2s, height 0.2s',
      }} />

      <Navbar />
      <FlyingJet />

      <main style={{ background: '#000', color: '#fff', overflowX: 'hidden' }}>

        {/* ══ HERO ══ */}
        <section style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-start',
          padding: '0 7vw',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* background glow */}
          <div style={{
            position: 'absolute', top: '-10%', right: '-5%',
            width: '55vw', height: '70vh',
            background: 'radial-gradient(ellipse,rgba(59,130,246,0.07) 0%,transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', left: '20%',
            width: '30vw', height: '30vw',
            background: 'radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            letterSpacing: '4px', color: 'rgba(59,130,246,0.8)',
            textTransform: 'uppercase', marginBottom: '28px',
            opacity: 1, animation: 'fadeUp 0.7s 0.1s both',
          }}>
            v0.1 Beta · Open Source Core
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(72px,11vw,160px)',
            lineHeight: 0.9, letterSpacing: '2px',
            marginBottom: '36px',
            animation: 'fadeUp 0.8s 0.25s both',
          }}>
            <ScrambleText text="VELOPHOS" />
          </h1>

          <p style={{
            fontSize: 'clamp(17px,2vw,22px)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.65,
            maxWidth: '520px',
            marginBottom: '52px',
            animation: 'fadeUp 0.8s 0.4s both',
          }}>
            An AI that remembers everything you've told it.<br />
            Fast. Private. Runs on your machine.
          </p>

          <div style={{
            display: 'flex', gap: '16px', flexWrap: 'wrap',
            animation: 'fadeUp 0.8s 0.55s both',
          }}>
            <Link href="/signup" style={{
              padding: '15px 38px', borderRadius: '100px',
              background: '#fff', color: '#000',
              fontSize: '14px', fontWeight: 600, letterSpacing: '0.3px',
              textDecoration: 'none', display: 'inline-block',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Get Early Access
            </Link>
            <Link href="/docs" style={{
              padding: '15px 38px', borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              fontSize: '14px', fontWeight: 500,
              textDecoration: 'none', display: 'inline-block',
              backdropFilter: 'blur(12px)',
              transition: 'border-color 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              Read the Docs
            </Link>
          </div>

          {/* Scroll cue */}
          <div style={{
            position: 'absolute', bottom: '40px', left: '7vw',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            animation: 'fadeUp 0.8s 1s both',
          }}>
            <div style={{
              width: 1, height: 48,
              background: 'linear-gradient(to bottom, rgba(59,130,246,0.7), transparent)',
              animation: 'pulse 2s ease infinite',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px', color: 'rgba(255,255,255,0.25)' }}>SCROLL</span>
          </div>
        </section>

        {/* ══ STATEMENT ══ */}
        <section style={{ padding: '120px 7vw', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Reveal>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px,5.5vw,72px)',
              lineHeight: 1.1, letterSpacing: '1px',
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '800px',
            }}>
              Not a wrapper.<br />
              <span style={{ color: 'rgba(59,130,246,0.85)' }}>An intelligence</span> that knows<br />
              your context — always.
            </p>
          </Reveal>
          <Reveal delay={150} style={{ marginTop: '28px' }}>
            <p style={{
              fontSize: '16px', color: 'rgba(255,255,255,0.4)',
              maxWidth: '480px', lineHeight: 1.8, fontWeight: 300,
            }}>
              Built on open-source models running entirely on your hardware.
              No cloud dependency. No data leaks. Just raw intelligence.
            </p>
          </Reveal>
        </section>

        {/* ══ FEATURES ══ */}
        <section style={{ padding: '40px 7vw 140px' }}>
          <Reveal style={{ marginBottom: '64px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              letterSpacing: '4px', color: 'rgba(59,130,246,0.7)',
              textTransform: 'uppercase',
            }}>
              Core Capabilities
            </span>
          </Reveal>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            <FeatureCard delay={0} icon="🧠" title="Persistent Memory"
              desc="Semantically recalls context from any previous conversation using vector search — not just the last few messages." />
            <FeatureCard delay={100} icon="⚡" title="Local Inference"
              desc="Runs Mistral 7B or Phi-3 Mini entirely on your CPU. Your prompts never leave your machine." />
            <FeatureCard delay={200} icon="🔐" title="Secure by Default"
              desc="AES-256 encrypted memory store, HMAC-signed sessions, and zero third-party telemetry." />
            <FeatureCard delay={300} icon="🔬" title="Fine-Tune Ready"
              desc="LoRA fine-tuning hooks built in. Train the model on your own data when you're ready for Phase 2." />
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section style={{
          padding: '100px 7vw',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <Reveal style={{ marginBottom: '72px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              letterSpacing: '4px', color: 'rgba(59,130,246,0.7)',
              textTransform: 'uppercase', display: 'block', marginBottom: '20px',
            }}>How It Works</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px,5vw,64px)',
              letterSpacing: '2px', color: '#fff',
            }}>Three steps to smarter AI</h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', maxWidth: '680px' }}>
            {[
              { n: '01', title: 'You speak', body: 'Your message is embedded into a 384-dim semantic vector, locally.' },
              { n: '02', title: 'Velophos remembers', body: 'ChromaDB retrieves the most relevant past context via cosine similarity across your entire history.' },
              { n: '03', title: 'Precision response', body: 'The assembled context feeds the local LLM. Token-streamed back to you in under a second.' },
            ].map(({ n, title, body }, i) => (
              <Reveal key={n} delay={i * 100}>
                <div style={{
                  display: 'flex', gap: '32px', alignItems: 'flex-start',
                  padding: '36px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px',
                    color: 'rgba(59,130,246,0.6)', letterSpacing: '2px',
                    minWidth: '32px', paddingTop: '3px',
                  }}>{n}</span>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '10px' }}>{title}</h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section style={{
          padding: '160px 7vw',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        }}>
          <Reveal>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(56px,8vw,112px)',
              lineHeight: 0.92, letterSpacing: '2px',
              marginBottom: '48px',
            }}>
              BUILD<br />
              <span style={{ color: 'rgba(59,130,246,0.8)' }}>WITH US</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/signup" style={{
                padding: '16px 42px', borderRadius: '100px',
                background: '#fff', color: '#000',
                fontSize: '14px', fontWeight: 600,
                textDecoration: 'none', display: 'inline-block',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                Get Early Access
              </Link>
              <a href="mailto:odjojitehilla@gmail.com" style={{
                fontSize: '14px', fontFamily: 'var(--font-mono)',
                color: 'rgba(255,255,255,0.35)',
                textDecoration: 'none', letterSpacing: '1px',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(59,130,246,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >
                odjojitehilla@gmail.com
              </a>
            </div>
          </Reveal>
        </section>

        {/* ══ FOOTER ══ */}
        <footer id="footer" style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '48px 7vw',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '24px',
          position: 'relative',
        }}>
          {/* Jet landing base */}
          <div id="footer-base" style={{
            position: 'absolute', top: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '160px', height: '2px',
            background: 'linear-gradient(90deg,transparent,rgba(59,130,246,0.6),transparent)',
            boxShadow: '0 0 20px rgba(59,130,246,0.4)',
          }} />

          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '22px',
            letterSpacing: '3px', color: 'rgba(255,255,255,0.9)',
          }}>VELOPHOS</span>

          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[
              { label: 'Login', href: '/login' },
              { label: 'Sign Up', href: '/signup' },
              { label: 'Docs', href: '/docs' },
              { label: 'GitHub', href: 'https://github.com' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={{
                color: 'rgba(255,255,255,0.35)', fontSize: '13px',
                textDecoration: 'none', letterSpacing: '0.5px',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >
                {label}
              </Link>
            ))}
          </div>

          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'rgba(255,255,255,0.2)',
          }}>
            © 2025 Velophos · Port Harcourt, NG
          </span>
        </footer>
      </main>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }
        @media (max-width: 768px) {
          nav { padding: 0 24px; }
        }
      `}</style>
    </>
  )
}