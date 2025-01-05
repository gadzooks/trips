import './globals.css'
import { Inter } from 'next/font/google'
// import { AuthProvider } from './providers'
import { Navbar } from './components/navbar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <AuthProvider> */}
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        {/* </AuthProvider> */}
      </body>
    </html>
  )
}