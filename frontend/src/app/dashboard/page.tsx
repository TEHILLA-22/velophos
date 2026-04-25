'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'

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
    
    // Set initial
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [router])

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const cleanResponse = (text: string) => {
    // Hide irrelevant <think> generation blocks from the AI
    return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')

    const userMsg = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMsg,
          chat_id: chatId ? parseInt(chatId) : null
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'ai', content: 'Network error or token expired.' }])
        setLoading(false)
        return
      }

      setChatId(data.chat_id.toString())

      setMessages(prev => [
        ...prev,
        { role: 'ai', content: cleanResponse(data.response || 'No response') }
      ])

    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Failed to connect to Velophos server.' }])
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
      fontFamily: 'system-ui, -apple-system, sans-serif'
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
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            )}
            <h1 style={{
              letterSpacing: '3px',
              fontSize: '16px',
              fontWeight: 600,
              background: 'linear-gradient(to right, #fff, #a5b4fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              VELOPHOS
            </h1>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('token')
              router.push('/login')
            }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)',
              padding: '8px 16px',
              fontSize: '13px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            Logout
          </button>
        </div>

        {/* CHAT AREA */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '100px 24px 100px 24px', // Space for header and input
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          scrollBehavior: 'smooth'
        }}>
          {messages.length === 0 && !loading && (
            <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.5 }}>
              <h2 style={{ fontWeight: 300 }}>How can I help you today?</h2>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                padding: '16px 20px',
                borderRadius: '24px',
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '24px',
                borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '24px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(255,255,255,0.05)',
                border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                color: '#fff',
                fontSize: '15px',
                lineHeight: 1.6,
                boxShadow: msg.role === 'user' ? '0 4px 20px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div style={{
              alignSelf: 'flex-start',
              padding: '16px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              borderBottomLeftRadius: '4px',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span className="dot-pulse">Velophos is thinking</span>
              <style>{`
                @keyframes blink { 0% { opacity: .2; } 20% { opacity: 1; } 100% { opacity: .2; } }
                .dot-pulse::after { content: '...'; animation: blink 1.4s infinite both; }
              `}</style>
            </div>
          )}

          <div ref={bottomRef} style={{ height: 1 }} />
        </div>

        {/* INPUT FLOATING PANEL */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '24px',
          background: 'linear-gradient(to top, rgba(5,5,5,1) 50%, transparent)',
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '800px',
            pointerEvents: 'auto',
            background: 'rgba(20,20,20,0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            gap: '8px'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Message Velophos..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 20px',
                borderRadius: '16px',
                background: input.trim() && !loading ? '#fff' : 'rgba(255,255,255,0.1)',
                color: input.trim() && !loading ? '#000' : 'rgba(255,255,255,0.4)',
                fontWeight: 600,
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </main>
  )
}