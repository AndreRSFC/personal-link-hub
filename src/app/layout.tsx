import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from '@/provider/react-query.provider'
import InternalSessionProvider from '@/provider/session.provider'
import Head from 'next/head'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Personal Link Hub',
  description: 'Take your life easy',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <body className={`${inter.variable}`}>
        <ReactQueryProvider>
          <InternalSessionProvider>{children}</InternalSessionProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
