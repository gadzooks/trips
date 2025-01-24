// app/components/site-wide/SideBarWrapper.tsx
import { auth } from '@/auth';
import { Sidebar } from './SideBar';

export async function SidebarWrapper() {
  const session = await auth();
  return <Sidebar session={session} />;
}