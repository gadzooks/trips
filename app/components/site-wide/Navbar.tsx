// app/components/site-wide/navbar.tsx
"use client";
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { data: session } = useSession();
  const { isDark, toggle } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent cursor-pointer">
            MyTripPlanner
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
              Explore Trips
            </Link>
            {session && (
              <>
                <Link href="/my-trips" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  My Trips
                </Link>
                <Link href="/trips/new" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Create Trip
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <DropdownMenuItem asChild className="focus:bg-gray-100 dark:focus:bg-gray-700">
                  <Link href="/explore" className="flex py-3">Explore Trips</Link>
                </DropdownMenuItem>
                
                {session ? (
                  <>
                    <DropdownMenuItem asChild className="focus:bg-gray-100 dark:focus:bg-gray-700">
                      <Link href="/my-trips" className="flex py-3">My Trips</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-gray-100 dark:focus:bg-gray-700">
                      <Link href="/trips/new" className="flex py-3">Create Trip</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem 
                      onSelect={() => signOut()}
                      className="py-3 focus:bg-gray-100 dark:focus:bg-gray-700 text-red-600 dark:text-red-400"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem 
                    onSelect={() => signIn('google')}
                    className="py-3 focus:bg-gray-100 dark:focus:bg-gray-700 text-blue-600 dark:text-blue-400"
                  >
                    Sign in with Google
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Desktop Auth Buttons */}
            {session ? (
              <Button
                onClick={() => signOut()}
                variant="ghost"
                className="hidden md:flex hover:text-red-600 dark:hover:text-red-400"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={() => signIn('google')}
                className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign in with Google
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}