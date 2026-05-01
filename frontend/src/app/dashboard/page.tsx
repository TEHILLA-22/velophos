'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import { Plus, Send, Paperclip, Loader2, LogOut, Menu, FileText, X } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

type Msg = {
  role: 'user' | 'ai'
  content: string
}

export default function Dashboard() {
  const router = useRouter()

  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // File states
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  // 🔐 check auth & handle resize
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) router.push('/login')

    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
      else setSidebarOpen(true)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [router])

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const cleanResponse = (text: string) => {
    return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      const data = await res.json()
      if (res.ok) {
        setFileContent(data.extracted_text)
        setFileName(data.filename)
        toast.success(`${data.filename} uploaded and processed!`)
      } else {
        toast.error(data.detail || 'Upload failed')
      }
    } catch (err) {
      toast.error('Network error during upload')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const sendMessage = async () => {
    if (!input.trim() && !fileContent) return

    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')

    const userMsg = input
    const fullMsg = fileContent ? `[File Analysis: ${fileName}]\n\nContent:\n${fileContent}\n\nUser Question: ${userMsg || 'Analyze this file.'}` : userMsg
    
    setInput('')
    setFileContent(null)
    setFileName(null)
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg || `Analyzed ${fileName}` }])
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: fullMsg,
          chat_id: chatId ? parseInt(chatId) : null
        })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error('Session expired. Please login again.')
        setLoading(false)
        return
      }

      setChatId(data.chat_id.toString())

      setMessages(prev => [
        ...prev,
        { role: 'ai', content: cleanResponse(data.response || 'No response') }
      ])

    } catch {
      toast.error('Failed to connect to Velophos server.')
    }

    setLoading(false)
  }

  return (
    <main style={{
      height: '100vh',
      background: '#050505',
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
      color: '#fff',
      fontFamily: 'var(--font-body)'
    }}>
      
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '60vw', height: '500px', background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.1), transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <Sidebar
        activeChat={chatId}
        isOpen={sidebarOpen}
        isMobile={isMobile}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSelect={async (id) => {
          setChatId(id || null)
          if (!id) {
            setMessages([])
            return
          }

          const token = localStorage.getItem('token')
          const res = await fetch(`http://localhost:8000/api/chat/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setMessages(data.map((m: any) => ({
              ...m,
              content: m.role === 'ai' ? cleanResponse(m.content) : m.content
            })))
          }
        }}
      />

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        zIndex: 10,
        height: '100vh',
        overflow: 'hidden'
      }}>
        
        {/* HEADER */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(5,5,5,0.8)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {(!sidebarOpen || isMobile) && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  width: '36px', height: '36px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
              >
                <Menu size={20} />
              </button>
            )}
            <h1 style={{
              letterSpacing: '3px',
              fontSize: '15px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.9)',
              fontFamily: 'var(--font-display)'
            }}>
              VELOPHOS
            </h1>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('token')
              toast.info('Logged out')
              router.push('/login')
            }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
              padding: '8px 16px',
              fontSize: '13px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* CHAT AREA */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '100px 24px 120px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          scrollBehavior: 'smooth'
        }}>
          {messages.length === 0 && !loading && (
            <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.3 }}>
              <h2 style={{ fontWeight: 300, fontSize: '24px', letterSpacing: '1px' }}>How can I help you today?</h2>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '18px 24px',
                borderRadius: '24px',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '24px',
                borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '24px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                  : 'rgba(255,255,255,0.03)',
                border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                color: '#fff',
                fontSize: '15px',
                lineHeight: 1.6,
                boxShadow: msg.role === 'user' ? '0 10px 25px -10px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div style={{
              alignSelf: 'flex-start',
              padding: '18px 24px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              borderBottomLeftRadius: '4px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Velophos is thinking...</span>
            </div>
          )}

          <div ref={bottomRef} style={{ height: 1 }} />
        </div>

        {/* INPUT AREA */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '24px',
          background: 'linear-gradient(to top, #050505 60%, transparent)',
          zIndex: 30
        }}>
          <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* File indicator */}
            <AnimatePresence>
              {fileName && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: '#a5b4fc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FileText size={14} />
                  {fileName}
                  <button onClick={() => { setFileContent(null); setFileName(null); }} className="hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{
              background: 'rgba(20,20,20,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                hidden 
                accept=".txt,.pdf"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  width: '36px', height: '36px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                className="hover:bg-white/10 hover:text-white"
              >
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={20} />}
              </button>

              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Message Velophos..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  padding: '8px 0'
                }}
              />
              
              <button
                onClick={sendMessage}
                disabled={loading || (!input.trim() && !fileContent)}
                style={{
                  width: '36px', height: '36px',
                  borderRadius: '12px',
                  background: input.trim() || fileContent ? '#fff' : 'rgba(255,255,255,0.05)',
                  color: input.trim() || fileContent ? '#000' : 'rgba(255,255,255,0.2)',
                  cursor: (input.trim() || fileContent) && !loading ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  border: 'none'
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}