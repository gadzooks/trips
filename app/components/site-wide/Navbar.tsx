// app/components/site-wide/navbar.tsx
'use client'

import { useTheme } from './ThemeProvider'
import { Menu } from 'lucide-react'
import { Button } from '@/app/components/ui/shadcn/button'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import SignIn from '../auth/sign-in'
import ThemeToggle from './ThemeToggle'

export function Navbar() {
  const { isDark, toggle } = useTheme()
  const { data: session } = useSession()
  console.log('navbar session is : ', JSON.stringify(session))
  
  return (
    <header className="fixed top-0 left-0 right-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-50">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={session ? "/my-trips" : "/"} className="flex items-center gap-2" title={session ? "My Trips" : "Home"}>
            <span className="font-semibold text-xl">MyTripPlanner</span>
          </Link>
          {session && (
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/shared"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                  title='Trips shared with me by others'
                >
                  Shared with Me
                </Link>
              </nav>
          )}
          <nav>
            <Link
              href="/explore" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              title='Explore public trips for inspiration'
            >
              Explore
            </Link>
          </nav>
        </div>
        {session ? (
          <div>
            Welcome {session?.user?.name}
          </div>
        ) : (
          <div>
            Sign in to create and share your trips
          </div>
        )}
        <div className="flex items-center gap-4">
          { session && ( 
          <Link 
              href="/trips/new" 
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Create Trip
          </Link>
          )}
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