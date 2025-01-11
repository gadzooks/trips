// import { auth } from '@/auth'
import Link from 'next/link'
import TripList from './components/trips/TripList'
import { TripListType } from '@/types/trip'

export default async function Home() {
  // const session = await auth()
  const session = true
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {session && (
          <Link 
            href="/trips/new" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Trip
          </Link>
        )}
      </div>
      
      {!session ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Share Your Travel Adventures</h2>
          <p className="mb-4">Sign in to create and share your trip plans.</p>
        </div>
      ) : (
        <TripList type={TripListType.PUBLIC} />
      )}
    </div>
  )
}