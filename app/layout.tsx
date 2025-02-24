import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Recover from Postgres outages in milliseconds',
  description: 'A demo to create an outage in your database and restore it to the original state in milliseconds.',
  openGraph: {
    images: [
      {
        url: 'https://neon-demos-outage.vercel.app/og.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(fontSans.variable, 'min-h-lvh w-full bg-black bg-cover px-6 pt-24 font-sans md:px-4 lg:px-8')}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
