// app/my-trips/page.tsx
import { auth } from '@/auth'
import ClientHome from '../components/ui/ClientHome'
import { Session } from 'next-auth'

export default async function MyTrips() {
  const session: Session | null = await auth()
  console.log('session is : ', JSON.stringify(session))
  return <ClientHome session={session} />
}