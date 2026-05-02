'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react'
import { API_BASE_URL } from '@/lib/api'
import { toast } from 'sonner'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    if (!reference) {
      setVerifying(false)
      return
    }

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API_BASE_URL}/billing/verify/${reference}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()

        if (data.status === 'success' || data.status === 'already_verified') {
          toast.success('Subscription activated!')
        } else {
          toast.error('Could not verify payment.')
        }
      } catch (err) {
        console.error(err)
        toast.error('Verification error.')
      } finally {
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [reference])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.12 } 
    }
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
        style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }}
      >
        
        <div style={{
          padding: '60px 48px',
          borderRadius: 24,
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(32px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center'
        }}>

          {/* Top Label */}
          <motion.p variants={itemVariants} style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: 40,
          }}>
            Status Update
          </motion.p>

          {/* Animated Checkmark Circle */}
          <motion.div variants={itemVariants} style={{ position: 'relative', marginBottom: 40 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 20 }}
              style={{
                width: 80, height: 80,
                borderRadius: '50%',
                background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px rgba(255,255,255,0.2)'
              }}
            >
              <Check size={40} strokeWidth={2.5} color="#000" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                border: '1px dashed rgba(255,255,255,0.2)',
                transform: 'scale(1.4)'
              }}
            />
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} style={{ marginBottom: 48 }}>
            <h1 style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 'clamp(48px, 8vw, 72px)',
              letterSpacing: '1px',
              lineHeight: 1,
              color: '#fff',
              marginBottom: 16,
            }}>
              PRO UNLOCKED
            </h1>
            <p style={{
              fontSize: 16, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.4)',
              maxWidth: 360, margin: '0 auto',
            }}>
              {verifying 
                ? 'Finalizing your payment...' 
                : 'Your subscription is active. Welcome to the next generation of intelligence.'}
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 48 }} />

          {/* Perks Grid */}
          <motion.div variants={itemVariants} style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 24, 
            width: '100%',
            marginBottom: 48
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Zap size={20} color="rgba(255,255,255,0.6)" />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontFamily: "'DM Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Infinite Scale</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Shield size={20} color="rgba(255,255,255,0.6)" />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontFamily: "'DM Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Priority Compute</span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} style={{ width: '100%' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                width: '100%', height: 56,
                borderRadius: 14,
                background: '#fff', color: '#000',
                fontSize: 15, fontWeight: 600,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.3s ease',
                fontFamily: "'Outfit', sans-serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Enter Dashboard
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </motion.div>

        </div>

        {/* Bottom Tag */}
        <motion.div
          variants={itemVariants}
          style={{
            marginTop: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: 'rgba(255,255,255,0.2)',
          }}
        >
          <Sparkles size={14} />
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            Velophos Intelligence
          </span>
        </motion.div>

      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');
      `}</style>
    </main>
  )
}