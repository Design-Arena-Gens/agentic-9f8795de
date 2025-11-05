import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Panic Button Dashboard',
  description: 'Emergency alert dashboard system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
