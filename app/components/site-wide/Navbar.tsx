// app/components/site-wide/navbar.tsx
'use client'

import { useTheme } from './ThemeProvider'
import { Moon, Sun, Menu } from 'lucide-react'
import { Button } from '@/app/components/ui/shadcn/button'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import SignIn from '../auth/sign-in'
import ThemeToggle from './ThemeToggle'

export function Navbar() {
  const { isDark, toggle } = useTheme()
  const { data: session } = useSession()
  
  return (
    <header className="fixed top-0 left-0 right-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-50">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-semibold text-xl">MyTripPlanner</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/my-trips" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              My Trips
            </Link>
            <Link 
              href="/shared" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              Shared with Me
            </Link>
            <Link 
              href="/explore" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              Explore
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Trip
          </Button>
          {session ? (
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="text-gray-700 dark:text-gray-200"
            >
              Sign Out
            </Button>
          ) : <SignIn />}
          
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden h-9 w-9"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <ThemeToggle isDark={isDark} toggle={toggle} />
        </div>
      </div>
    </header>
  )
}