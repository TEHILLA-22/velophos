'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleLogin } from '@react-oauth/google'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { UserPlus, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)

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
        toast.error(data.detail || 'Signup failed')
        setLoading(false)
        return
      }

      toast.success('Verification code sent to your email!')
      
      // redirect to OTP page (assuming it exists or will be styled)
      setTimeout(() => {
        router.push(`/otp?email=${encodeURIComponent(email)}`)
      }, 2000)

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
        toast.error(data.detail || 'Google signup failed')
      }
    } catch (err) {
      toast.error('Google authentication failed')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 } 
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <main className="min-h-screen bg-[#020202] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[440px] z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-light tracking-[0.3em] text-white/90 font-display">VELOPHOS</span>
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white/[0.02] border border-white/[0.06] rounded-[32px] p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="mb-10">
            <h1 className="text-3xl font-medium tracking-tight text-white mb-2">Join Velophos</h1>
            <p className="text-white/40 text-[15px]">Be part of what's coming next.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="flex gap-4">
               <div className="relative group flex-1">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white text-[15px] outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all placeholder:text-white/20"
                />
              </div>
              <div className="relative group flex-1">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 px-4 text-white text-[15px] outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white text-[15px] outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all placeholder:text-white/20"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="password"
                placeholder="Password (min. 8 characters)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-white text-[15px] outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all placeholder:text-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-white text-black h-[56px] rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center my-8 gap-4">
            <div className="flex-1 h-[1px] bg-white/[0.06]" />
            <span className="text-[11px] uppercase tracking-widest text-white/20 font-bold">Or sign up with</span>
            <div className="flex-1 h-[1px] bg-white/[0.06]" />
          </div>

          <div className="flex justify-center">
             <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Signup Failed')}
                theme="dark"
                shape="pill"
                size="large"
                width="100%"
              />
          </div>

          <p className="text-center mt-10 text-[14px] text-white/30">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:text-indigo-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </main>
  )
}