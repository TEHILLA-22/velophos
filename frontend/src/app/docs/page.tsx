'use client'
import Link from 'next/link'
import { useState } from 'react'

/* ─────────────────────────────────────────
   CONTENT — no internal stack details exposed
───────────────────────────────────────── */
interface Section {
  id: string
  label: string
  content: string
  code?: string
  note?: string
}

const sections: Section[] = [
  {
    id: 'overview',
    label: 'Overview',
    content:
      'Velophos is a next-generation AI built for precision and deep contextual understanding. Unlike cloud-dependent tools, Velophos runs privately — your conversations stay yours. It remembers what you\'ve told it across sessions and responds with full context, not just the last message.',
  },
  {
    id: 'quickstart',
    label: 'Quick Start',
    content:
      'Getting started takes less than a minute. Create your account, complete email verification, and you\'re in. No configuration, no setup — just open the chat and start talking.',
    code: `1. Sign up at velophos.ai/signup\n2. Verify your email\n3. Open your dashboard\n4. Start your first conversation`,
  },
  {
    id: 'memory',
    label: 'Memory',
    content:
      'Velophos remembers the context of your previous conversations. You can reference something you said weeks ago and it will recall it accurately. Memory is scoped to your account and is fully private — nothing is shared or used to train other users\' models.',
  },
  {
    id: 'api',
    label: 'API Access',
    content:
      'Pro users get access to the Velophos API. Authenticate with your account token and send requests to integrate Velophos into your own applications. Full API documentation is available after signing up.',
    note: 'API access is available on the Pro plan. See Pricing for details.',
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    content:
      'Your data is encrypted at rest and in transit. We do not sell, share, or use your conversations for any purpose outside of serving your requests. You can delete your memory and account data at any time from your settings.',
  },
  {
    id: 'faq',
    label: 'FAQ',
    content:
      'Common questions about Velophos — from how memory works to billing and account management.',
  },
]

const FAQ_ITEMS = [
  {
    q: 'Can I delete my conversation history?',
    a: 'Yes. You can clear your memory or delete individual sessions from your dashboard at any time.',
  },
  {
    q: 'Is my data used to train other models?',
    a: 'No. Your conversations are private and are never used to train models for other users.',
  },
  {
    q: 'What happens if I cancel my Pro plan?',
    a: 'You keep access until the end of your billing period, then revert to the free plan. Your data is retained.',
  },
  {
    q: 'Is there a free tier?',
    a: 'Yes. The free plan gives you access to core features with a daily message limit. Upgrade to Pro for unlimited access.',
  },
]

/* ─────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '18px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', textAlign: 'left', gap: 16,
        }}
      >
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(14px,1.6vw,15px)',
          fontWeight: 500, color: '#fff',
        }}>{q}</span>
        <span style={{
          color: 'rgba(255,255,255,0.35)',
          fontSize: 18, flexShrink: 0,
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
          display: 'inline-block', lineHeight: 1,
        }}>+</span>
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? '200px' : '0px',
        transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <p style={{
          paddingBottom: 20,
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(13px,1.5vw,14px)',
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.8,
        }}>{a}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   MOBILE SECTION PICKER
───────────────────────────────────────── */
function MobileSectionPicker({
  active, onSelect,
}: {
  active: string
  onSelect: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const current = sections.find(s => s.id === active)

  return (
    <div style={{ position: 'relative', marginBottom: 32 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 12, padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14, color: '#fff', fontWeight: 500,
        }}>{current?.label}</span>
        <span style={{
          color: 'rgba(255,255,255,0.35)', fontSize: 12,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.3s',
          display: 'inline-block',
        }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#0d0d0d',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 12, overflow: 'hidden', zIndex: 50,
        }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => {
                onSelect(s.id)
                setOpen(false)
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              style={{
                width: '100%', background: s.id === active ? 'rgba(59,130,246,0.08)' : 'none',
                border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '13px 18px', textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              {s.id === active && (
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(59,130,246,0.8)', flexShrink: 0 }} />
              )}
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                color: s.id === active ? '#fff' : 'rgba(255,255,255,0.5)',
              }}>{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  return (
    <main style={{
      minHeight: '100vh',
      background: '#000', color: '#fff',
      fontFamily: "'Outfit', sans-serif",
    }}>

      {/* ── Top bar ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 60,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(24px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(20px,5vw,40px)',
        zIndex: 100,
      }}>
        <Link href="/" style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: 'clamp(16px,3vw,20px)',
          letterSpacing: '4px', color: '#fff', textDecoration: 'none',
        }}>
          VELOPHOS
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: '3px',
            color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase',
          }}>
            Docs
          </span>
          <Link href="/signup" style={{
            fontFamily: "'Outfit', sans-serif",
            padding: '7px 18px', borderRadius: 100,
            background: '#fff', color: '#000',
            fontSize: 12, fontWeight: 600,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Get Access
          </Link>
        </div>
      </div>

      {/* ── Layout ── */}
      <div style={{
        display: 'flex',
        paddingTop: 60,
        minHeight: '100vh',
      }}>

        {/* ── Sidebar (desktop only) ── */}
        <aside className="docs-sidebar" style={{
          width: 220, minWidth: 220,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '44px 24px',
          position: 'sticky', top: 60,
          height: 'calc(100vh - 60px)',
          overflowY: 'auto',
        }}>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9, letterSpacing: '3px',
            color: 'rgba(59,130,246,0.6)',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            Contents
          </p>
          {sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0',
                fontSize: 13,
                color: activeSection === s.id ? '#fff' : 'rgba(255,255,255,0.38)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                transition: 'color 0.2s',
                fontWeight: activeSection === s.id ? 500 : 400,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = activeSection === s.id ? '#fff' : 'rgba(255,255,255,0.38)')}
            >
              {activeSection === s.id && (
                <span style={{
                  width: 3, height: 3, borderRadius: '50%',
                  background: 'rgba(59,130,246,0.8)', flexShrink: 0,
                }} />
              )}
              {s.label}
            </a>
          ))}
        </aside>

        {/* ── Main content ── */}
        <div style={{
          flex: 1,
          padding: 'clamp(32px,5vw,64px) clamp(20px,6vw,72px)',
          maxWidth: 740,
          width: '100%',
        }}>

          {/* Mobile section picker */}
          <div className="docs-mobile-picker">
            <MobileSectionPicker active={activeSection} onSelect={setActiveSection} />
          </div>

          {sections.map(s => (
            <div
              key={s.id}
              id={s.id}
              style={{ marginBottom: 'clamp(56px,8vw,96px)', scrollMarginTop: 80 }}
            >
              {/* Section heading */}
              <div style={{ marginBottom: 20 }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9, letterSpacing: '3px',
                  color: 'rgba(59,130,246,0.6)',
                  textTransform: 'uppercase',
                  display: 'block', marginBottom: 10,
                }}>
                  {String(sections.indexOf(s) + 1).padStart(2, '0')}
                </span>
                <h2 style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: 'clamp(32px,5vw,48px)',
                  letterSpacing: '2px', color: '#fff',
                  lineHeight: 0.95,
                }}>
                  {s.label}
                </h2>
              </div>

              {/* Divider */}
              <div style={{
                height: 1,
                background: 'rgba(255,255,255,0.06)',
                marginBottom: 24,
              }} />

              {/* Body */}
              <p style={{
                fontSize: 'clamp(14px,1.6vw,15px)',
                lineHeight: 1.85,
                color: 'rgba(255,255,255,0.5)',
              }}>
                {s.content}
              </p>

              {/* Code block */}
              {s.code && (
                <pre style={{
                  marginTop: 24,
                  padding: 'clamp(18px,3vw,28px)',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 'clamp(11px,1.4vw,13px)',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 2,
                  overflowX: 'auto',
                  whiteSpace: 'pre',
                }}>
                  {s.code}
                </pre>
              )}

              {/* Note callout */}
              {s.note && (
                <div style={{
                  marginTop: 20,
                  padding: '14px 18px',
                  background: 'rgba(59,130,246,0.06)',
                  border: '1px solid rgba(59,130,246,0.15)',
                  borderRadius: 12,
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  <span style={{ color: 'rgba(59,130,246,0.7)', fontSize: 14, flexShrink: 0, marginTop: 1 }}>ℹ</span>
                  <p style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12, lineHeight: 1.75,
                    color: 'rgba(255,255,255,0.4)',
                  }}>
                    {s.note}
                  </p>
                </div>
              )}

              {/* FAQ section */}
              {s.id === 'faq' && (
                <div style={{ marginTop: 8 }}>
                  {FAQ_ITEMS.map(item => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Footer CTA */}
          <div style={{
            marginTop: 'clamp(40px,6vw,80px)',
            paddingTop: 'clamp(32px,5vw,56px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <p style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 'clamp(28px,4vw,40px)',
              letterSpacing: '2px', color: '#fff', lineHeight: 1,
            }}>
              Ready to get started?
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/signup" style={{
                padding: 'clamp(11px,2vw,13px) clamp(22px,3vw,30px)',
                borderRadius: 100,
                background: '#fff', color: '#000',
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Create Free Account
              </Link>
              <Link href="/pricing" style={{
                padding: 'clamp(11px,2vw,13px) clamp(22px,3vw,30px)',
                borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent', color: 'rgba(255,255,255,0.6)',
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13, fontWeight: 400,
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .docs-sidebar { display: block !important; }
          .docs-mobile-picker { display: none !important; }
        }
        @media (max-width: 768px) {
          .docs-sidebar { display: none !important; }
          .docs-mobile-picker { display: block !important; }
        }
      `}</style>
    </main>
  )
}
