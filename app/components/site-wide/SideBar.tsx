// app/components/site-wide/SideBar.tsx
import { TripCard } from "./TripCard"
export function Sidebar() {
    return (
      <aside className="fixed left-0 top-16 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Trending Trips</h2>
            <div className="space-y-4">
              {/* Add trending trips here */}
              <TripCard
                title="Yosemite Adventure"
                date="Jan 15, 2025"
              />
              <TripCard
                title="Beach Weekend"
                date="Jan 20, 2025"
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Latest Trips</h2>
            <div className="space-y-4">
              {/* Add latest trips here */}
              <TripCard
                title="Mountain Hike"
                date="Jan 10, 2025"
              />
              <TripCard
                title="City Tour"
                date="Jan 5, 2025"
              />
            </div>
          </div>
        </div>
      </aside>
    )
  }