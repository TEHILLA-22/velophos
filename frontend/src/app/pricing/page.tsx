'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, ArrowRight, Zap, Shield, Cpu, Globe } from 'lucide-react'
import { API_BASE_URL } from '@/lib/api'
import { toast } from 'sonner'

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      if (!token) {
        toast.error('Please sign in to upgrade')
        router.push('/login')
        return
      }

      const res = await fetch(`${API_BASE_URL}/billing/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (data?.data?.authorization_url) {
        window.location.href = data.data.authorization_url
      } else {
        toast.error('Payment initialization failed. Please try again.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong with the payment system.')
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const } }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 860, position: 'relative', zIndex: 1 }}
      >

        {/* ── Header ── */}
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: 20,
          }}>
            Simple pricing
          </p>
          <h1 style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 'clamp(64px, 10vw, 100px)',
            letterSpacing: '2px',
            lineHeight: 0.95,
            color: '#fff',
            marginBottom: 24,
          }}>
            Pricing
          </h1>
          <p style={{
            fontSize: 16, lineHeight: 1.75,
            color: 'rgba(255,255,255,0.38)',
            maxWidth: 460, margin: '0 auto',
          }}>
            Straightforward plans. No hidden fees.<br />
            Built for the next generation of intelligence.
          </p>
        </motion.div>

        {/* ── Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16,
          alignItems: 'stretch',
        }}>

          {/* FREE */}
          <motion.div variants={itemVariants}>
            <FreeCard />
          </motion.div>

          {/* PRO */}
          <motion.div variants={itemVariants}>
            <ProCard loading={loading} onUpgrade={handleUpgrade} />
          </motion.div>

        </div>

        {/* ── Trust bar ── */}
        <motion.div
          variants={itemVariants}
          style={{
            marginTop: 72,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px 48px',
          }}
        >
          {[
            { icon: <Shield size={14} />, label: 'Enterprise Security' },
            { icon: <Cpu size={14} />,    label: 'High Performance' },
            { icon: <Globe size={14} />,  label: 'Global Availability' },
          ].map(({ icon, label }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'DM Mono', monospace",
              fontSize: 11, letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
            }}>
              {icon}
              {label}
            </div>
          ))}
        </motion.div>

      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  )
}

/* ─────────────────────────────────────────
   FREE CARD
───────────────────────────────────────── */
function FreeCard() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: '100%',
        padding: '40px 36px',
        borderRadius: 24,
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(24px)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Tier label */}
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
        marginBottom: 28,
      }}>
        Free
      </p>

      {/* Price */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 64, letterSpacing: '1px', color: '#fff', lineHeight: 1 }}>
            ₦0
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Mono', monospace" }}>
          forever free
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 32 }} />

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        {[
          'Basic AI access',
          'Standard processing speed',
          'Limited memory context',
          'Community support',
        ].map(text => (
          <FeatureRow key={text} text={text} pro={false} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 40 }}>
        <div style={{
          width: '100%', height: 50,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 500,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.3px',
        }}>
          Current Plan
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   PRO CARD
───────────────────────────────────────── */
function ProCard({ loading, onUpgrade }: { loading: boolean; onUpgrade: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: '100%',
        padding: '40px 36px',
        borderRadius: 24,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.11)'}`,
        backdropFilter: 'blur(32px)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Recommended badge */}
      <div style={{
        position: 'absolute', top: 20, right: 20,
        padding: '4px 12px',
        borderRadius: 100,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.05)',
        fontFamily: "'DM Mono', monospace",
        fontSize: 9, letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.45)',
      }}>
        Recommended
      </div>

      {/* Tier label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 28,
      }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#fff',
        }}>
          Pro
        </p>
        <Zap size={12} fill="#fff" color="#fff" style={{ opacity: 0.9 }} />
      </div>

      {/* Price */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
          <span style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 64, letterSpacing: '1px',
            color: '#fff', lineHeight: 1,
          }}>
            ₦5,000
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Mono', monospace" }}>
          per month
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 32 }} />

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        {[
          'Unlimited messages',
          'Long-term persistent memory',
          'Advanced code execution',
          'Priority compute inference',
          'Early access to new models',
        ].map(text => (
          <FeatureRow key={text} text={text} pro />
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 40 }}>
        <button
          onClick={onUpgrade}
          disabled={loading}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            width: '100%', height: 52,
            borderRadius: 12,
            background: loading ? 'rgba(255,255,255,0.75)' : '#fff',
            color: '#000',
            fontSize: 14, fontWeight: 600,
            letterSpacing: '0.2px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            pointerEvents: loading ? 'none' : 'all',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.2s, transform 0.15s',
            transform: btnHovered && !loading ? 'scale(1.015)' : 'scale(1)',
            position: 'relative', overflow: 'hidden',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {/* Shimmer */}
          {!loading && (
            <span style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.6s linear infinite',
            }} />
          )}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key="spin"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
                Processing…
              </motion.span>
            ) : (
              <motion.span
                key="label"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, zIndex: 1 }}
              >
                Upgrade to Pro
                <ArrowRight size={14} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   FEATURE ROW
───────────────────────────────────────── */
function FeatureRow({ text, pro }: { text: string; pro: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 18, height: 18, minWidth: 18,
        borderRadius: '50%',
        border: `1px solid ${pro ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Check size={10} strokeWidth={2.5} color={pro ? '#fff' : 'rgba(255,255,255,0.3)'} />
      </div>
      <span style={{
        fontSize: 14,
        color: pro ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)',
        lineHeight: 1.4,
      }}>
        {text}
      </span>
    </div>
  )
}