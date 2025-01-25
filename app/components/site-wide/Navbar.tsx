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
} from 'app/components/ui/shadcn/dropdown-menu'
import { Button } from '../ui/shadcn/button';

export function Navbar() {
  const { data: session } = useSession();
  const { isDark, toggle } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            MyTripPlanner
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/explore" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Explore Trips
            </Link>
            {session && (
              <>
                <Link href="/my-trips" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  My Trips
                </Link>
                <Link href="/trips/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Create Trip
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggle}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/explore">Explore Trips</Link>
                </DropdownMenuItem>
                
                {session ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/my-trips">My Trips</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/trips/new">Create Trip</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => signOut()}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onSelect={() => signIn('google')}>
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
                className="hidden md:flex"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={() => signIn('google')}
                className="hidden md:flex"
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