'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleLogin } from '@react-oauth/google'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { API_BASE_URL } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
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

  /* ── Animation variants with Skew morph ── */
  const pageVariants = {
    hidden: { opacity: 0, scale: 1.05, filter: 'blur(10px)', skewY: 2 },
    visible: { 
      opacity: 1, scale: 1, filter: 'blur(0px)', skewY: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, staggerChildren: 0.1 } 
    },
    exit: { opacity: 0, scale: 0.95, filter: 'blur(10px)', skewY: -2, transition: { duration: 0.6 } }
  }

  const formVariants = {
    hidden: { opacity: 0, x: -50, skewX: -5 },
    visible: {
      opacity: 1, x: 0, skewX: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="login"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          minHeight: '100vh',
          width: '100%',
          background: '#030303',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          fontFamily: "'Outfit', sans-serif",
          color: '#fff',
          position: 'relative'
        }}
      >
        {/* Fine grid pattern for the whole page */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.02,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          zIndex: 0, pointerEvents: 'none'
        }} />

        {/* ── Left Side: Form (Liquid Glass) ── */}
        <div style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          position: 'relative',
          zIndex: 10
        }}>
          
          <motion.div variants={formVariants} style={{ width: '100%', maxWidth: '420px' }}>
            
            {/* Logo */}
            <motion.div variants={itemVariants} style={{ marginBottom: '40px' }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
                <span style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontSize: '32px', letterSpacing: '0.4em',
                  color: '#fff', opacity: 0.95,
                  textShadow: '0 0 20px rgba(255,255,255,0.2)'
                }}>
                  VELOPHOS
                </span>
              </Link>
            </motion.div>

            {/* Form Container: Liquid Glass */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              padding: '48px 40px',
              boxShadow: '0 30px 60px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
              position: 'relative'
            }}>
              
              <motion.div variants={itemVariants} style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '8px' }}>
                  Welcome back
                </h1>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
                  Enter your credentials to access your terminal.
                </p>
              </motion.div>

              <motion.form variants={itemVariants} onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <FieldWrap icon={<Mail size={16} />}>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </FieldWrap>

                <FieldWrap icon={<Lock size={16} />}>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </FieldWrap>

                <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                  <Link href="/forgot-password" style={{
                    fontSize: '13px', color: 'rgba(255,255,255,0.3)',
                    textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                  >
                    Forgot password?
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  style={{
                    marginTop: '8px',
                    width: '100%', height: '54px',
                    borderRadius: '14px',
                    background: '#fff', color: '#000',
                    fontSize: '15px', fontWeight: 600,
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.3s ease',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                  onMouseLeave={e => { if (!loading) { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; } }}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Loader2 size={16} className="animate-spin" /> Signing in...
                      </motion.span>
                    ) : (
                      <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        Sign In <ArrowRight size={16} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.form>

              <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                <span style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <GoogleSignInWrapper onSuccess={handleGoogleSuccess} />
              </motion.div>

              <motion.p variants={itemVariants} style={{ textAlign: 'center', marginTop: '36px', fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>
                New to Velophos?{' '}
                <Link href="/signup" style={{ color: '#fff', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '2px', transition: 'all 0.2s' }}>
                  Create an account
                </Link>
              </motion.p>

            </div>
          </motion.div>
        </div>

        {/* ── Right Side: Image Cover (Hidden on Mobile) ── */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            flex: '1 1 50%',
            position: 'relative',
            display: 'block',
            height: '100vh'
          }}
          className="hero-cover"
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'url(/auth-bg.png) center center / cover no-repeat',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
          }} />
          {/* Overlay gradient to blend edge */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, #030303 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.4) 100%)'
          }} />
        </motion.div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');
          @media (max-width: 768px) {
            .hero-cover { display: none !important; }
          }
          input::placeholder { color: rgba(255,255,255,0.2); }
        `}</style>
      </motion.main>
    </AnimatePresence>
  )
}

function FieldWrap({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
        color: 'rgba(255,255,255,0.3)', pointerEvents: 'none', zIndex: 1,
      }}>
        {icon}
      </span>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px 16px 16px 48px',
  borderRadius: '14px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.3s ease',
  fontFamily: "'Outfit', sans-serif",
}

function GoogleSignInWrapper({ onSuccess }: { onSuccess: (res: any) => void }) {
  return (
    <div style={{ position: 'relative', height: '54px', borderRadius: '14px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s ease' }}
         onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
         onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
      
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', pointerEvents: 'none', zIndex: 1 }}>
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
        </svg>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>Continue with Google</span>
      </div>

      <div style={{ opacity: 0, position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GoogleLogin onSuccess={onSuccess} onError={() => {}} theme="filled_black" shape="rectangular" size="large" width="400" />
      </div>
    </div>
  )
}