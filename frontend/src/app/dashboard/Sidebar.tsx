'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '@/lib/api'
import { Search, X, MessageSquare, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

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
  isMobile,
  updateTrigger
}: {
  onSelect: (id: string) => void
  activeChat: string | null
  isOpen: boolean
  toggleSidebar: () => void
  isMobile: boolean
  updateTrigger: number
}) {
  const [chats, setChats] = useState<Chat[]>([])
  const [user, setUser] = useState<User | null>(null)
  
  // Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Chat[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        const res = await apiFetch('/api/chats')
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
        const res = await apiFetch('/auth/me')
        const data = await res.json()
        if (data.id) setUser(data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchChats()
    fetchUser()
    
  }, [activeChat, updateTrigger])

  const handleSearch = async (q: string) => {
    setSearchQuery(q)
    if (!q.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const res = await apiFetch(`/api/chats/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setSearchResults(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setIsSearching(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      const res = await apiFetch(`/api/chat/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setChats(prev => prev.filter(c => c.id !== id))
        if (activeChat === id) {
          onSelect('')
        }
        toast.success('Chat deleted')
      } else {
        toast.error('Failed to delete chat')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error deleting chat')
    }
  }

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
          width: isOpen ? 280 : 0,
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
              marginBottom: '12px', 
              transition: 'all 0.2s ease',
              fontWeight: 500
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
          >
            + New Chat
          </button>

          {/* Minimal Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              transition: 'color 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            <Search size={16} />
            Search chats...
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
                  borderColor: activeChat === chat.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={e => { if(activeChat !== chat.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { if(activeChat !== chat.id) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {chat.title || 'New Chat'}
                </span>
                
                <button
                  onClick={(e) => handleDelete(e, chat.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#ef4444'
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <Trash2 size={14} />
                </button>
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
                {user?.first_name?.[0] || 'U'}{user?.last_name?.[0] || ''}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
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

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '600px',
                background: 'rgba(15,15,15,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                margin: '0 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                <Search size={20} color="rgba(255,255,255,0.5)" />
                <input
                  autoFocus
                  placeholder="Search previous conversations..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {searchQuery.trim() === '' ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
                    Type to search your chats
                  </div>
                ) : isSearching ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(chat => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        onSelect(chat.id)
                        setIsSearchOpen(false)
                        setSearchQuery('')
                        if (isMobile) toggleSidebar()
                      }}
                      style={{
                        padding: '16px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      <MessageSquare size={16} color="rgba(255,255,255,0.4)" />
                      <span style={{ color: '#fff', fontSize: '15px' }}>{chat.title || 'New Chat'}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>
                    No results found
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}