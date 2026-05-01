'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Chat = {
  id: string
  title?: string
}

type User = {
  first_name: string
  last_name: string
  plan: string
}

export default function Sidebar({
  onSelect,
  activeChat,
  isOpen,
  toggleSidebar,
  isMobile
}: {
  onSelect: (id: string) => void
  activeChat: string | null
  isOpen: boolean
  toggleSidebar: () => void
  isMobile: boolean
}) {
  const [chats, setChats] = useState<Chat[]>([])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        const res = await fetch('http://localhost:8000/api/chats', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (Array.isArray(data)) {
          setChats(data.reverse())
        }
      } catch (e) {
        console.error(e)
      }
    }

    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        const res = await fetch('http://localhost:8000/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.id) setUser(data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchChats()
    fetchUser()
  }, [activeChat])

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 40
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ 
          width: isOpen ? (isMobile ? 280 : 280) : 0,
          opacity: isOpen ? 1 : 0
        }}
        initial={false}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        style={{
          position: isMobile ? 'fixed' : 'relative',
          height: '100vh',
          background: 'rgba(255,255,255,0.02)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          left: 0,
          top: 0
        }}
      >
        <div style={{ width: 280, padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '18px', 
              letterSpacing: '2px', 
              color: '#fff',
              fontWeight: 300
            }}>
              CHATS
            </h2>
            {isMobile && (
              <button 
                onClick={toggleSidebar} 
                style={{ 
                  background: 'none', border: 'none', color: '#fff', 
                  fontSize: '24px', cursor: 'pointer', opacity: 0.7 
                }}
              >
                ×
              </button>
            )}
          </div>
          
          <button 
            onClick={() => { onSelect(''); if(isMobile) toggleSidebar() }}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: 'rgba(99,102,241,0.15)', 
              border: '1px solid rgba(99,102,241,0.3)', 
              borderRadius: '12px', 
              color: '#fff', 
              cursor: 'pointer', 
              marginBottom: '24px', 
              transition: 'all 0.2s ease',
              fontWeight: 500
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
          >
            + New Chat
          </button>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => { onSelect(chat.id); if(isMobile) toggleSidebar() }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  background: activeChat === chat.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: activeChat === chat.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.2s',
                  fontWeight: activeChat === chat.id ? 500 : 400,
                  border: '1px solid',
                  borderColor: activeChat === chat.id ? 'rgba(255,255,255,0.1)' : 'transparent'
                }}
                onMouseEnter={e => { if(activeChat !== chat.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { if(activeChat !== chat.id) e.currentTarget.style.background = 'transparent' }}
              >
                {chat.title || 'New Chat'}
              </div>
            ))}
          </div>
          {/* ── User Section ── */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 600, color: '#fff'
              }}>
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.first_name} {user?.last_name}
                </p>
                {user?.plan === 'pro' ? (
                  <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    PRO PLAN
                  </span>
                ) : (
                  <a href="/pricing" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                  >
                    Upgrade to Pro
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}