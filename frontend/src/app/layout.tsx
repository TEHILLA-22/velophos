import type { Metadata } from 'next'
import './globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

export const metadata: Metadata = {
  title: 'Velophos — Intelligence Redefined',
  description: 'A next-generation AI with persistent memory, local inference, and deep contextual understanding.',
  openGraph: {
    title: 'Velophos',
    description: 'Intelligence Redefined.',
    url: 'https://velophos.ai',
  },
}

import { Toaster } from 'sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "your_client_id"}>
          {children}
          <Toaster richColors position="top-right" theme="dark" />
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}