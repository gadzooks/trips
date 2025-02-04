// app/components/site-wide/SideBar.tsx
"use client";
import { Session } from 'next-auth';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MyTrips } from './sidebar/MyTrips';
import { PublicTrips } from './sidebar/PublicTrips';

interface SidebarProps {
  tripsPerSection?: number;
  session: Session | null;
}

export function Sidebar({ tripsPerSection = 2, session }: SidebarProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  if (!isDesktop) return null;
  
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 pt-8">
        {session?.user && <MyTrips tripsPerSection={tripsPerSection} />}
        <PublicTrips tripsPerSection={tripsPerSection} />
      </div>
    </aside>
  );
}