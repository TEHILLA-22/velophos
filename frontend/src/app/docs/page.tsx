'use client'
import Link from 'next/link'

const sections = [
  {
    id: 'overview', label: 'Overview',
    content: 'Velophos is a local-first AI system. It runs open-source LLMs on your hardware, stores conversation memory in a local vector database, and exposes a REST API for your frontend to consume.',
  },
  {
    id: 'quickstart', label: 'Quick Start',
    content: 'Install Ollama, pull a model, start the FastAPI backend, connect the Next.js frontend. Full setup takes under 10 minutes on any machine with 8GB RAM.',
    code: `# 1. Install Ollama\ncurl -fsSL https://ollama.ai/install.sh | sh\nollama pull phi3\n\n# 2. Start backend\npip install -r requirements.txt\nuvicorn main:app --reload\n\n# 3. Start frontend\nnpm install && npm run dev`,
  },
  {
    id: 'api', label: 'API Reference',
    content: 'All endpoints return JSON. Authentication uses Bearer JWT tokens.',
    code: `POST /api/chat\n{\n  "message": "string",\n  "session_id": "string"\n}\n\nGET /api/history/:session_id\nDELETE /api/memory/:session_id`,
  },
  {
    id: 'memory', label: 'Memory System',
    content: 'Every message is embedded using sentence-transformers and stored in ChromaDB. On each new message, the top-5 most semantically similar past exchanges are retrieved and injected into the prompt context.',
  },
  {
    id: 'security', label: 'Security',
    content: 'Passwords hashed with bcrypt. Sessions signed with HMAC-SHA256 JWTs. All stored data encrypted at rest using AES-256. TLS enforced in production via Nginx reverse proxy.',
  },
]

export default function DocsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: 'var(--font-body)' }}>
      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', padding: '0 40px',
        justifyContent: 'space-between', zIndex: 100,
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-display)', fontSize: '20px',
          letterSpacing: '3px', color: '#fff', textDecoration: 'none',
        }}>VELOPHOS</Link>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px' }}>DOCS</span>
      </div>

      <div style={{ display: 'flex', paddingTop: '60px', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{
          width: '220px', minWidth: '220px',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '40px 24px', position: 'sticky', top: '60px',
          height: 'calc(100vh - 60px)', overflowY: 'auto',
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px', color: 'rgba(59,130,246,0.6)', textTransform: 'uppercase', marginBottom: '20px' }}>Contents</p>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              display: 'block', padding: '9px 0',
              fontSize: '13px', color: 'rgba(255,255,255,0.45)',
              textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >
              {s.label}
            </a>
          ))}
        </aside>

        {/* Content */}
        <div style={{ flex: 1, padding: '60px 7vw', maxWidth: '760px' }}>
          {sections.map(s => (
            <div key={s.id} id={s.id} style={{ marginBottom: '80px' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: '40px',
                letterSpacing: '2px', marginBottom: '20px', color: '#fff',
              }}>{s.label}</h2>
              <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(255,255,255,0.55)' }}>{s.content}</p>
              {s.code && (
                <pre style={{
                  marginTop: '24px', padding: '28px',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  fontFamily: 'var(--font-mono)', fontSize: '13px',
                  color: 'rgba(59,130,246,0.85)', lineHeight: 2,
                  overflowX: 'auto', whiteSpace: 'pre',
                }}>
                  {s.code}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}