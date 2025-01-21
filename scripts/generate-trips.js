const users = [
  'john.doe@example.com',
  'jane.smith@example.com',
  'bob.wilson@example.com'
];

const trips = [
  {
    name: "Japan Cultural Tour",
    description: "Exploring traditional and modern Japan",
    isPublic: true,
    tags: ["culture", "asia", "food"],
    days: [
      {
        id: "day1",
        date: "2024-03-15",
        activity: "Tokyo exploration - Senso-ji Temple and Akihabara",
        bookings: "Tokyu Hotel Tokyo",
        stay: "Tokyo",
        travelTime: "2 hours from airport",
        notes: "Remember to get Pasmo card"
      },
      {
        id: "day2",
        date: "2024-03-16",
        activity: "Day trip to Kamakura - Giant Buddha",
        bookings: "Tokyu Hotel Tokyo",
        stay: "Tokyo",
        travelTime: "1 hour by train",
        notes: "Pack light for day trip"
      }
    ]
  },
  {
    name: "Iceland Road Trip",
    description: "Ring road adventure with northern lights",
    isPublic: false,
    tags: ["nature", "adventure", "winter"],
    days: [
      {
        id: "day1",
        date: "2024-02-10",
        activity: "Blue Lagoon and Reykjavik city tour",
        bookings: "Fosshotel Reykjavik",
        stay: "Reykjavik",
        travelTime: "45 min from airport",
        notes: "Pickup rental car at 3 PM"
      }
    ]
  },
  // Add more trip templates...
];

async function createTrips() {
  for (const user of users) {
    // Assign 3-4 trips per user with variations
    const userTrips = trips.map(tripTemplate => ({
      ...tripTemplate,
      userId: user,
      fakeData: true,
      name: `${tripTemplate.name} - ${Math.random().toString(36).substring(7)}`,
      sharedWith: users.filter(u => u !== user).slice(0, 2)
    }));

    for (const trip of userTrips) {
      try {
        const response = await fetch('http://localhost:3000/api/trips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trip)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // console.log(`Created trip ${trip.name} for ${user} with ID: ${data.tripId}`);
      } catch (error) {
        console.error(`Failed to create trip ${trip.name} for ${user}:`, error);
      }
    }
  }
}

createTrips().catch(console.error);
