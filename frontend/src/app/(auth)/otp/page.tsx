'use client'
import Link from 'next/link'
import { useRef, useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

function OTPForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!email) {
      router.push('/signup')
    }
  }, [email, router])

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6)
    if (!/^[0-9]+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char
    })
    setOtp(newOtp)
    
    const focusIndex = Math.min(pastedData.length, 5)
    inputs.current[focusIndex]?.focus()
  }

  const handleVerify = async () => {
    const otpString = otp.join('')
    if (otpString.length < 6) {
      showToast('Please enter all 6 digits', 'error')
      return
    }

    setLoading(true)
    setToast(null)

    try {
      const res = await fetch('http://localhost:8000/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString })
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.detail || 'Verification failed', 'error')
        setLoading(false)
        return
      }

      showToast('Email verified successfully!', 'success')

      setTimeout(() => {
        router.push('/login')
      }, 1500)

    } catch (err) {
      showToast('Network error', 'error')
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } 
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px', zIndex: 1, position: 'relative' }}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Link href="/" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            letterSpacing: '4px',
            color: '#fff',
            textDecoration: 'none',
            display: 'block',
            textAlign: 'center',
            marginBottom: '48px',
            fontWeight: 300
          }}>
            VELOPHOS
          </Link>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '28px',
            padding: '48px 40px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <motion.div variants={itemVariants}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              letterSpacing: '1px',
              marginBottom: '8px',
              color: '#fff',
              fontWeight: 500
            }}>
              Verify Email
            </h1>
            <p style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '36px',
              lineHeight: '1.5'
            }}>
              We sent a 6-digit code to <br />
              <strong style={{ color: '#fff', fontWeight: 500 }}>{email}</strong>
            </p>
          </motion.div>

          <motion.div variants={itemVariants} style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '32px',
          }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el }}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleBackspace(e, i)}
                onPaste={handlePaste}
                maxLength={1}
                style={{
                  width: '48px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '20px',
                  fontWeight: '600',
                  borderRadius: '14px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-display)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button 
              onClick={handleVerify}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                background: '#fff',
                color: '#000',
                fontSize: '15px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'box-shadow 0.2s ease'
              }}
            >
              {loading && (
                <div style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(0,0,0,0.2)',
                  borderTop: '2px solid #000',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }} />
              )}
              {loading ? 'Verifying...' : 'Verify Email'}
            </motion.button>
          </motion.div>

          <motion.p variants={itemVariants} style={{
            textAlign: 'center',
            marginTop: '32px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.4)',
          }}>
            Didn't receive code?{' '}
            <span 
              onClick={() => showToast('New code sent (Mock)', 'success')}
              style={{
                color: '#fff',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              Resend
            </span>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Premium Glass Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '16px 24px',
              borderRadius: '16px',
              background: 'rgba(20,20,20,0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: toast.type === 'error' ? '#ef4444' : '#4ade80',
              fontSize: '15px',
              fontWeight: 500,
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              whiteSpace: 'nowrap'
            }}
          >
            {toast.type === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
          top: '-20%', left: '-10%',
          filter: 'blur(80px)',
          zIndex: 0
        }} 
      />

      <Suspense fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
        <OTPForm />
      </Suspense>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  )
}