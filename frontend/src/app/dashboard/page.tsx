'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

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

  const bottomRef = useRef<HTMLDivElement | null>(null)

  // 🔐 check auth
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) router.push('/login')
  }, [])

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
          chat_id: chatId
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'ai', content: 'Error from AI' }])
        setLoading(false)
        return
      }

      setChatId(data.chat_id)

      setMessages(prev => [
        ...prev,
        { role: 'ai', content: data.response || 'No response' }
      ])

    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Network error' }])
    }

    setLoading(false)
  }

  return (
    <main style={{
      height: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* HEADER */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          letterSpacing: '2px',
          fontSize: '18px'
        }}>
          VELOPHOS
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem('token')
            router.push('/login')
          }}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* CHAT AREA */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              padding: '14px 18px',
              borderRadius: '16px',
              background: msg.role === 'user'
                ? '#fff'
                : 'rgba(255,255,255,0.08)',
              color: msg.role === 'user' ? '#000' : '#fff'
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '12px'
          }}>
            Velophos is thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Velophos..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            outline: 'none'
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: '14px 20px',
            borderRadius: '12px',
            background: '#fff',
            color: '#000',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          Send
        </button>
      </div>

    </main>
  )
}