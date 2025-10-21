import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Actor Lab - AI Tools for Professional Actors',
  description: 'AI-powered tools to help actors excel in their craft',
  keywords: ['acting', 'AI tools', 'actor resources', 'casting', 'auditions'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
