// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './components/site-wide/ThemeProvider'
import { Navbar } from './components/site-wide/Navbar'
import { SessionProvider } from "next-auth/react"
import { SidebarWrapper } from './components/site-wide/SideBarWrapper'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
              <Navbar />
              <div className="flex">
                <SidebarWrapper />
                <main className="flex-1 p-8 ml-64 mt-16">
                  {children}
                </main>
              </div>
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}