'use client'

import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import Image from 'next/image';

function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <div>
      {/* <label className="flex items-center gap-2 cursor-pointer">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </label> */}
      <button onClick={toggle}>
        {isDark ? '🌙' : '☀️'}
      </button>
    </div>
  )
}

export function Navbar() {
  const session = true;
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">

          <Image
            src="/images/logo.png"
            alt="MyTripPlanner Logo"
            width={70}
            height={150}
            className="rounded-md p-2"
            priority
        />

            <Link 
              href="/" 
              className="flex items-center px-2 py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              <span className="text-xl font-bold">MyTripPlanner</span>
            </Link>
            
            {session && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/trips"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  My Trips
                </Link>
                <Link
                  href="/trips/shared"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Shared with Me
                </Link>
              </div>
            )}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/privacy"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Terms & Conditions
                </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="px-4">
              <ThemeToggle />
            </div>
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}