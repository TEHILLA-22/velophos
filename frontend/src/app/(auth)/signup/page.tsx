'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function SignupPage() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleSignup = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    setToast(null)

    try {
      const res = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName
        })
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.detail || 'Signup failed', 'error')
        setLoading(false)
        return
      }

      showToast('OTP sent to your email', 'success')

      // redirect to OTP page
      setTimeout(() => {
        router.push(`/otp?email=${encodeURIComponent(email)}`)
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

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: '440px', zIndex: 1 }}
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
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
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
              Join early
            </h1>
            <p style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '36px'
            }}>
              Be part of what's coming
            </p>
          </motion.div>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                style={{
                  width: '50%',
                  padding: '16px 20px', borderRadius: '14px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: '15px',
                  outline: 'none', fontFamily: 'var(--font-body)',
                  transition: 'border-color 0.2s ease, background 0.2s ease'
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                style={{
                  width: '50%',
                  padding: '16px 20px', borderRadius: '14px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: '15px',
                  outline: 'none', fontFamily: 'var(--font-body)',
                  transition: 'border-color 0.2s ease, background 0.2s ease'
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '16px 20px', borderRadius: '14px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: '15px',
                  outline: 'none', fontFamily: 'var(--font-body)',
                  transition: 'border-color 0.2s ease, background 0.2s ease'
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <input
                type="password"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '16px 20px', borderRadius: '14px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: '15px',
                  outline: 'none', fontFamily: 'var(--font-body)',
                  transition: 'border-color 0.2s ease, background 0.2s ease'
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants} style={{ marginTop: '12px' }}>
              <motion.button
                type="submit"
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
                {loading ? 'Creating account...' : 'Create Account'}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', margin: '32px 0', opacity: 0.5 }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #fff)' }} />
            <span style={{ padding: '0 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #fff)' }} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '16px',
                borderRadius: '14px', background: 'rgba(255,255,255,0.04)',
                color: '#fff', fontSize: '15px', fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
                transition: 'background 0.2s ease'
              }}
              onClick={() => alert("OAuth will be implemented soon!")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.81 15.72 17.59V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.59C14.74 18.25 13.48 18.66 12 18.66C9.13 18.66 6.7 16.72 5.83 14.12H2.17V16.96C3.98 20.56 7.7 23 12 23Z" fill="#34A853"/>
                <path d="M5.83 14.12C5.61 13.46 5.48 12.75 5.48 12C5.48 11.25 5.61 10.54 5.83 9.88V7.04H2.17C1.43 8.52 1 10.2 1 12C1 13.8 1.43 15.48 2.17 16.96L5.83 14.12Z" fill="#FBBC05"/>
                <path d="M12 5.34C13.62 5.34 15.06 5.9 16.2 6.99L19.35 3.84C17.46 2.08 14.97 1 12 1C7.7 1 3.98 3.44 2.17 7.04L5.83 9.88C6.7 7.28 9.13 5.34 12 5.34Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </motion.button>
          </motion.div>

          <motion.p variants={itemVariants} style={{ textAlign: 'center', marginTop: '36px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* 🔔 Premium Glass Toast */}
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
              gap: '12px'
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  )
}