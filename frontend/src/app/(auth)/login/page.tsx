'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleLogin } from '@react-oauth/google'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { LogIn, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.detail || 'Login failed')
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.access_token)
      toast.success('Welcome back to Velophos!')
      router.push('/dashboard')

    } catch (err) {
      toast.error('Network error. Is the backend running?')
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch('http://localhost:8000/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('token', data.access_token)
        toast.success(`Welcome, ${data.user.first_name}!`)
        router.push('/dashboard')
      } else {
        toast.error(data.detail || 'Google login failed')
      }
    } catch (err) {
      toast.error('Google authentication failed')
    }
  }

  /* ── Animation variants ── */
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.08 } }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* ── Ambient background ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
      }}>
        {/* Top-right cold blue orb */}
        <div style={{
          position: 'absolute', top: '-15%', right: '-10%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        {/* Bottom-left deep orb */}
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        {/* Subtle center glow */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 300, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.03) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        {/* Fine grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.018,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }} />
      </div>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
      >

        {/* ── Logo ── */}
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: 44 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <span style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 28, letterSpacing: '0.35em',
              color: '#fff', opacity: 0.92,
            }}>
              VELOPHOS
            </span>
          </Link>
        </motion.div>

        {/* ── Card ── */}
        <motion.div
          variants={cardVariants}
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 28,
            padding: '44px 40px 40px',
            backdropFilter: 'blur(32px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top shine line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 40%, rgba(59,130,246,0.2) 60%, transparent 100%)',
          }} />
          {/* Bottom corner glow */}
          <div style={{
            position: 'absolute', bottom: -80, right: -80, width: 220, height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* ── Heading ── */}
          <motion.div variants={itemVariants} style={{ marginBottom: 36 }}>
            <h1 style={{
              fontSize: 26, fontWeight: 500, letterSpacing: '-0.3px',
              color: '#fff', marginBottom: 7,
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
              Sign in to continue to Velophos.
            </p>
          </motion.div>

          {/* ── Form ── */}
          <motion.form variants={itemVariants} onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Email field */}
            <FieldWrap icon={<Mail size={15} />}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                onBlur={e => Object.assign(e.currentTarget.style, inputBlurStyle)}
              />
            </FieldWrap>

            {/* Password field */}
            <FieldWrap icon={<Lock size={15} />}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => Object.assign(e.currentTarget.style, inputFocusStyle)}
                onBlur={e => Object.assign(e.currentTarget.style, inputBlurStyle)}
              />
            </FieldWrap>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <Link href="/forgot-password" style={{
                fontSize: 12, color: 'rgba(255,255,255,0.28)',
                textDecoration: 'none', letterSpacing: '0.2px',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(59,130,246,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={loading ? {} : { scale: 0.97 }}
              style={{
                marginTop: 8,
                width: '100%', height: 52,
                borderRadius: 14,
                background: loading ? 'rgba(255,255,255,0.7)' : '#fff',
                color: '#000',
                fontSize: 14, fontWeight: 600,
                letterSpacing: '0.2px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                pointerEvents: loading ? 'none' : 'all',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s, opacity 0.2s',
                position: 'relative', overflow: 'hidden',
                fontFamily: "'Outfit', sans-serif",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.88)' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#fff' }}
            >
              {/* Shimmer on hover */}
              {!loading && (
                <span style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2.4s linear infinite',
                }} />
              )}
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
                    Signing in…
                  </motion.span>
                ) : (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, zIndex: 1 }}
                  >
                    Sign In <ArrowRight size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>

          {/* ── Divider ── */}
          <motion.div variants={itemVariants} style={{
            display: 'flex', alignItems: 'center', gap: 14, margin: '28px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{
              fontSize: 10, letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase', fontWeight: 600,
            }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </motion.div>

          {/* ── Google Sign-In (custom styled wrapper) ── */}
          <motion.div variants={itemVariants}>
            <GoogleSignInWrapper onSuccess={handleGoogleSuccess} />
          </motion.div>

          {/* ── Footer link ── */}
          <motion.p variants={itemVariants} style={{
            textAlign: 'center', marginTop: 32,
            fontSize: 13, color: 'rgba(255,255,255,0.25)',
          }}>
            New to Velophos?{' '}
            <Link href="/signup" style={{
              color: '#fff', fontWeight: 500, textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(59,130,246,0.85)')}
              onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
            >
              Create an account
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes googlePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
          50% { box-shadow: 0 0 0 4px rgba(59,130,246,0.12); }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input { caret-color: rgba(59,130,246,0.9); }
      `}</style>
    </main>
  )
}

/* ─── Field wrapper with left icon ─── */
function FieldWrap({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 16, top: '50%',
        transform: 'translateY(-50%)',
        color: 'rgba(255,255,255,0.22)',
        display: 'flex', alignItems: 'center', pointerEvents: 'none',
        zIndex: 1,
      }}>
        {icon}
      </span>
      {children}
    </div>
  )
}

/* ─── Shared input styles ─── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px 14px 44px',
  borderRadius: 12,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.25s, background 0.25s',
  fontFamily: "'Outfit', sans-serif",
}
const inputFocusStyle: React.CSSProperties = {
  borderColor: 'rgba(59,130,246,0.45)',
  background: 'rgba(59,130,246,0.04)',
}
const inputBlurStyle: React.CSSProperties = {
  borderColor: 'rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
}

/* ─── Custom Google Sign-In wrapper ─── */
function GoogleSignInWrapper({ onSuccess }: { onSuccess: (res: any) => void }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'transform 0.2s cubic-bezier(0.23,1,0.32,1)',
        transform: pressed ? 'scale(0.97)' : hovered ? 'scale(1.012)' : 'scale(1)',
      }}
    >
      {/* Glowing border ring */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 14,
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.09)'}`,
        transition: 'border-color 0.3s',
        pointerEvents: 'none', zIndex: 2,
      }} />
      {/* Blue outer glow on hover */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute', inset: -2,
            borderRadius: 16,
            boxShadow: '0 0 24px rgba(59,130,246,0.18)',
            pointerEvents: 'none', zIndex: 0,
          }}
        />
      )}

      {/* Label row visible above the hidden GoogleLogin */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11,
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        borderRadius: 14,
        transition: 'background 0.25s',
        pointerEvents: 'none',
      }}>
        {/* Google "G" SVG */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
        </svg>
        <span style={{
          fontSize: 14, fontWeight: 500,
          color: hovered ? '#fff' : 'rgba(255,255,255,0.65)',
          transition: 'color 0.25s',
          letterSpacing: '0.1px',
        }}>
          Continue with Google
        </span>
      </div>

      {/* Actual GoogleLogin — invisible but functional, sits on top */}
      <div style={{
        opacity: 0, height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 3,
      }}>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => {}}
          theme="filled_black"
          shape="rectangular"
          size="large"
          width="380"
        />
      </div>
    </div>
  )
}