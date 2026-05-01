'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, Loader2, ArrowRight, Zap, Shield, Cpu, Globe } from 'lucide-react'
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

      const res = await fetch('http://localhost:8000/billing/billing/initialize', {
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
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <main className="min-h-screen bg-[#000] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[80vw] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl z-10"
      >
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
          >
            Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Choose the power that fits your ambition. Simple, transparent, and built for the next generation of intelligence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* FREE PLAN */}
          <motion.div
            variants={cardVariants}
            className="bg-white/[0.02] border border-white/[0.06] rounded-[32px] p-10 backdrop-blur-2xl flex flex-col h-full relative group transition-all hover:border-white/10"
          >
            <div className="mb-8">
              <h2 className="text-xl font-medium text-white/60 mb-2">Free</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">₦0</span>
                <span className="text-white/30">/forever</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <FeatureItem text="Basic AI access" />
              <FeatureItem text="Standard processing speed" />
              <FeatureItem text="Limited memory context" />
              <FeatureItem text="Community support" />
            </div>

            <div className="mt-10">
              <button className="w-full h-14 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white/50 font-medium cursor-default">
                Current Plan
              </button>
            </div>
          </motion.div>

          {/* PRO PLAN */}
          <motion.div
            variants={cardVariants}
            className="bg-white/[0.03] border border-white/[0.15] rounded-[32px] p-10 backdrop-blur-3xl flex flex-col h-full relative shadow-[0_0_50px_rgba(99,102,241,0.1)] group transition-all hover:border-indigo-500/30"
          >
            {/* Top Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
              Recommended
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-medium text-indigo-400 mb-2 flex items-center gap-2">
                Pro <Zap size={16} fill="currentColor" />
              </h2>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">₦5,000</span>
                <span className="text-white/30">/month</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <FeatureItem text="Unlimited messages" pro />
              <FeatureItem text="Long-term persistent memory" pro />
              <FeatureItem text="Advanced code execution" pro />
              <FeatureItem text="Priority compute inference" pro />
              <FeatureItem text="Early access to new models" pro />
            </div>

            <div className="mt-10">
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-white text-black font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Upgrade to Pro
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Trust Icons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale"
        >
          <div className="flex items-center gap-2 text-sm"><Shield size={18} /> Enterprise Security</div>
          <div className="flex items-center gap-2 text-sm"><Cpu size={18} /> High Performance</div>
          <div className="flex items-center gap-2 text-sm"><Globe size={18} /> Global Availability</div>
        </motion.div>
      </motion.div>
    </main>
  )
}

function FeatureItem({ text, pro = false }: { text: string; pro?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${pro ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-white/40'}`}>
        <Check size={12} strokeWidth={3} />
      </div>
      <span className={`text-[15px] ${pro ? 'text-white/90' : 'text-white/50'}`}>{text}</span>
    </div>
  )
}
