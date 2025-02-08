// app/layout.tsx
import './globals.css'
import { Inter, Roboto_Flex } from 'next/font/google'
import { ThemeProvider } from './components/site-wide/ThemeProvider'
import { Navbar } from './components/site-wide/Navbar'
import { SessionProvider } from "next-auth/react"
import { SidebarWrapper } from './components/site-wide/SideBarWrapper'
import { TailwindIndicator } from './components/ui/shadcn/tailwind-indicator'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Optional - Roboto Flex for better variable font support
const roboto = Roboto_Flex({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  return (
    // <html lang="en" suppressHydrationWarning>
    <html lang="en" className={`${inter.variable} ${roboto.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 max-w-[100vw] overflow-x-hidden">
              <Navbar />
              <div className="flex">
                <SidebarWrapper />
                <main className="flex-1 p-4 lg:p-6 mt-16 md:ml-64 mx-auto max-w-7xl w-full">
                  {children}
                </main>
              </div>
            </div>
          </ThemeProvider>
        </SessionProvider>
        <TailwindIndicator />
      </body>
    </html>
  )
}