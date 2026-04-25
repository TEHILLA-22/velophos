import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Velophos — Intelligence Redefined',
  description: 'A next-generation AI with persistent memory, local inference, and deep contextual understanding.',
  openGraph: {
    title: 'Velophos',
    description: 'Intelligence Redefined.',
    url: 'https://velophos.ai',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}