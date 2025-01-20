// app/page.tsx
import { auth } from '@/auth'
import ClientHome from './components/ui/ClientHome'
import { Session } from 'next-auth'
export default async function Home() {
  const session: Session | null = await auth()
  return <ClientHome session={session} />
}