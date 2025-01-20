// app/components/ui/ClientHome.tsx
"use client"
import TripList from '../trips/TripList'
import { TripListType } from '@/types/trip'
import { Session } from 'next-auth'

export default function ClientHome({ session }: { session: Session | null }) {  console.log('ClientHome session is : ', JSON.stringify(session))
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {session && session.user ? (
        <TripList type={TripListType.MY_TRIPS} />
      ) : (
        <TripList type={TripListType.PUBLIC} />
      )}
    </main>
  )
}