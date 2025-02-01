// app/components/trips/TripGrid.tsx
import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/shadcn/card';
import { Calendar, Navigation, Share2, Pencil, Trash2 } from "lucide-react";
// import { TripListType } from '@/types/trip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/shadcn/dropdown-menu';

// Predefined gradient classes for variety
const gradients = [
  'from-pink-500 to-purple-500',
  'from-orange-400 to-pink-500',
  'from-green-400 to-cyan-500',
  'from-blue-500 to-indigo-500'
];

// interface TripListProps {
//     type: TripListType;
// }

const TripCard = ({ title = "Untitled Trip", date = "No date set", id = "000", index = 0 }) => {
  const gradientClass = gradients[index % gradients.length];
  
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <Card className={`relative h-64 w-full bg-gradient-to-br ${gradientClass} text-white shadow-xl transition-all duration-300 hover:scale-105`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Navigation className="h-6 w-6" />
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <div className="flex space-x-2">
                <Share2 className="h-5 w-5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="relative h-full">
          <div className="flex items-center space-x-2 text-sm opacity-90">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          {/* <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-75">ID: {id}</span>
              <div className="flex space-x-2">
                <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                  Ready
                </span>
              </div>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

const sampleTrips = [
  { id: "y8flq", title: "Greek Island Hopping", date: "January 14, 2025" },
  { id: "x7kmp", title: "Paris Weekend", date: "February 1, 2025" },
  { id: "z9nrj", title: "Tokyo Adventure", date: "March 15, 2025" },
  { id: "w6htp", title: "Safari Explorer", date: "April 22, 2025" }
];

const TripGrid = ({ trips = sampleTrips }) => {
  if (!trips?.length) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No trips found. Start planning your next adventure!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {trips.map((trip, index) => (
        <TripCard key={trip.id} {...trip} index={index} />
      ))}
    </div>
  );
};

export default TripGrid;