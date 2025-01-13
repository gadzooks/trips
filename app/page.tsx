// app/page.tsx
import { auth } from '@/auth'
import Link from 'next/link'
import TripList from './components/trips/TripList'
import { TripListType } from '@/types/trip'

export default async function Home() {
  const session = await auth()
  
  return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {session ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-xl">Welcome {session.user?.name}!</p>
              <Link 
                href="/trips/new" 
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
              >
                Create Trip
              </Link>
            </div>
            <TripList type={TripListType.PUBLIC} />
          </div>
        ) : (
          <div className="space-y-12 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Share your Travel Adventure</h2>
              <p className="mt-2 text-gray-600">Sign in to create and share your trip plans.</p>
            </div>
            
            <div className="py-4">
              <TripList type={TripListType.PUBLIC} />
            </div>
          </div>
        )}
      </main>
  )
}