'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react'
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
        const res = await fetch(`http://localhost:8000/billing/verify/${reference}`, {
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 } 
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <main className="min-h-screen bg-[#000] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[500px] bg-white/[0.02] border border-white/[0.08] rounded-[40px] p-12 backdrop-blur-3xl shadow-2xl relative text-center"
      >
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400"
            >
              <CheckCircle2 size={48} strokeWidth={1.5} />
            </motion.div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-2 border-dashed border-indigo-500/30 rounded-full scale-125" 
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Welcome to Pro
          </h1>
          <p className="text-white/40 text-lg">
            {verifying ? 'Finalizing your upgrade...' : 'Your subscription is now active. Intelligence unlocked.'}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center gap-2">
            <Zap size={20} className="text-indigo-400" />
            <span className="text-[13px] text-white/60 font-medium">Infinite Scale</span>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-400" />
            <span className="text-[13px] text-white/60 font-medium">Priority Auth</span>
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          onClick={() => router.push('/dashboard')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-16 rounded-2xl bg-white text-black font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-white/90 transition-all"
        >
          Enter Dashboard
          <ArrowRight size={20} />
        </motion.button>

        <motion.div 
          variants={itemVariants}
          className="mt-8 flex items-center justify-center gap-2 text-white/20"
        >
          <Sparkles size={14} />
          <span className="text-xs uppercase tracking-widest font-bold">Velophos Intelligence</span>
        </motion.div>
      </motion.div>
    </main>
  )
}