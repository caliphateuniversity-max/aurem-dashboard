import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AUREM Intelligence',
  description: 'AI-powered social media automation for Dubai luxury real estate',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{ background: '#080604', color: '#F0EAE0' }}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#13100A',
              color: '#F0EAE0',
              border: '1px solid rgba(232,115,26,0.2)',
            },
            success: { iconTheme: { primary: '#66CC88', secondary: '#080604' } },
            error: { iconTheme: { primary: '#CC6666', secondary: '#080604' } },
          }}
        />
      </body>
    </html>
  )
}
