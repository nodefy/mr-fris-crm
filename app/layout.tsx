import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mr Fris CRM',
  description: 'Leadbeheer voor Mr Fris',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
