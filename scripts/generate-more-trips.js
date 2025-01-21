const users = [
    'john.doe@example.com',
    'jane.smith@example.com',
    'bob.wilson@example.com',
    'karwande@gmail.com'
  ];
  
  const trips = [
    {
      name: "Greek Island Hopping",
      description: "Island adventure through Santorini, Mykonos, and Crete",
      isPublic: true,
      tags: ["beach", "culture", "mediterranean"],
      days: Array.from({length: 7}, (_, i) => ({
        id: `day${i+1}`,
        date: `2024-06-${String(i+1).padStart(2, '0')}`,
        activity: i === 0 ? "Arrival in Athens, evening Plaka walk" :
                 i === 1 ? "Flight to Santorini, Oia sunset" :
                 i === 2 ? "Santorini wine tour and black beach" :
                 i === 3 ? "Ferry to Mykonos, Little Venice exploration" :
                 i === 4 ? "Mykonos beach day and windmills" :
                 i === 5 ? "Flight to Crete, Knossos Palace" :
                 "Heraklion food tour, departure",
        bookings: i <= 0 ? "Athens Gate Hotel" :
                  i <= 2 ? "Santorini Secret Suites" :
                  i <= 4 ? "Myconian Collection" :
                  "GDM Megaron Hotel",
        stay: i <= 0 ? "Athens" :
              i <= 2 ? "Santorini" :
              i <= 4 ? "Mykonos" :
              "Heraklion",
        travelTime: i === 0 ? "40 min from airport" :
                    i === 1 ? "45 min flight" :
                    i === 3 ? "2.5 hour ferry" :
                    i === 5 ? "1 hour flight" :
                    "local",
        notes: i === 0 ? "Get metro pass" :
               i === 1 ? "Arranged hotel pickup" :
               i === 3 ? "Early ferry departure" :
               i === 5 ? "Pack light for internal flight" :
               "Confirm restaurant reservations"
      }))
    },
    {
      name: "South African Safari Adventure",
      description: "Wildlife viewing and wine tasting in South Africa",
      isPublic: true,
      tags: ["wildlife", "luxury", "africa"],
      days: Array.from({length: 5}, (_, i) => ({
        id: `day${i+1}`,
        date: `2024-09-${String(i+1).padStart(2, '0')}`,
        activity: i === 0 ? "Arrival in Johannesburg, Apartheid Museum" :
                 i === 1 ? "Flight to Kruger, afternoon game drive" :
                 i === 2 ? "Full day safari, Big Five tracking" :
                 i === 3 ? "Morning safari, flight to Cape Town" :
                 "Wine tasting in Stellenbosch",
        bookings: i <= 0 ? "Four Seasons Johannesburg" :
                  i <= 2 ? "Lion Sands Game Reserve" :
                  "Mount Nelson Hotel",
        stay: i <= 0 ? "Johannesburg" :
              i <= 2 ? "Kruger National Park" :
              "Cape Town",
        travelTime: i === 0 ? "30 min from airport" :
                    i === 1 ? "2 hour flight" :
                    i === 3 ? "2.5 hour flight" :
                    "45 min drive",
        notes: i === 0 ? "Arrange airport transfer" :
               i === 1 ? "5AM wake-up call" :
               i === 2 ? "Pack warm clothes for morning drive" :
               "Wine shipping available"
      }))
    },
    {
      name: "Vietnam North to South",
      description: "Cultural journey from Hanoi to Ho Chi Minh City",
      isPublic: true,
      tags: ["culture", "food", "history"],
      days: Array.from({length: 6}, (_, i) => ({
        id: `day${i+1}`,
        date: `2024-11-${String(i+1).padStart(2, '0')}`,
        activity: i === 0 ? "Hanoi Old Quarter and Water Puppet Show" :
                 i === 1 ? "Ha Long Bay overnight cruise" :
                 i === 2 ? "Return to Hanoi, flight to Hue" :
                 i === 3 ? "Imperial City tour, train to Hoi An" :
                 i === 4 ? "Hoi An cooking class and tailoring" :
                 "Flight to HCMC, Cu Chi Tunnels",
        bookings: i === 1 ? "Paradise Luxury Cruise" :
                  i <= 2 ? "Sofitel Legend Metropole" :
                  i === 3 ? "La Residence Hue" :
                  i === 4 ? "Four Seasons Nam Hai" :
                  "Park Hyatt Saigon",
        stay: i <= 2 ? (i === 1 ? "Ha Long Bay" : "Hanoi") :
              i === 3 ? "Hue" :
              i === 4 ? "Hoi An" :
              "Ho Chi Minh City",
        travelTime: i === 0 ? "45 min from airport" :
                    i === 1 ? "4 hour drive" :
                    i === 2 ? "4 hour drive, 1.5 hour flight" :
                    i === 3 ? "3 hour train" :
                    i === 5 ? "1.5 hour flight" :
                    "local",
        notes: i === 0 ? "Get local SIM card" :
               i === 1 ? "Pack overnight bag only" :
               i === 2 ? "Early departure 7AM" :
               i === 4 ? "Submit clothing measurements" :
               "Book street food tour"
      }))
    },
    {
      name: "Morocco Desert and Cities",
      description: "From Marrakech to Sahara, experiencing Morocco's diversity",
      isPublic: true,
      tags: ["desert", "culture", "adventure"],
      days: Array.from({length: 4}, (_, i) => ({
        id: `day${i+1}`,
        date: `2024-10-${String(i+1).padStart(2, '0')}`,
        activity: i === 0 ? "Marrakech Medina and Jardin Majorelle" :
                 i === 1 ? "Atlas Mountains, Ait Benhaddou" :
                 i === 2 ? "Sahara camel trek and camping" :
                 "Return to Marrakech, hammam spa",
        bookings: i === 2 ? "Luxury Desert Camp" : "La Mamounia",
        stay: i === 2 ? "Sahara Desert" : "Marrakech",
        travelTime: i === 1 ? "4 hour drive" :
                    i === 2 ? "6 hour drive" :
                    i === 3 ? "8 hour drive" :
                    "30 min from airport",
        notes: i === 0 ? "Get dirham from ATM" :
               i === 1 ? "Pack for cold mountain weather" :
               i === 2 ? "Bring headlamp for camp" :
               "Book evening food tour"
      }))
    },
    {
      name: "Costa Rica Eco Adventure",
      description: "Rainforest, volcanoes, and beaches of Costa Rica",
      isPublic: true,
      tags: ["nature", "adventure", "eco"],
      days: Array.from({length: 5}, (_, i) => ({
        id: `day${i+1}`,
        date: `2024-07-${String(i+1).padStart(2, '0')}`,
        activity: i === 0 ? "San Jose arrival, city tour" :
                 i === 1 ? "Arenal Volcano hike and hot springs" :
                 i === 2 ? "Monteverde cloud forest zip-lining" :
                 i === 3 ? "Manuel Antonio beach and wildlife" :
                 "National park hike, departure",
        bookings: i === 0 ? "Gran Hotel Costa Rica" :
                  i === 1 ? "Nayara Springs" :
                  i === 2 ? "El Establo Mountain Hotel" :
                  "Arenas del Mar",
        stay: i === 0 ? "San Jose" :
              i === 1 ? "La Fortuna" :
              i === 2 ? "Monteverde" :
              "Manuel Antonio",
        travelTime: i === 0 ? "30 min from airport" :
                    i === 1 ? "3 hour drive" :
                    i === 2 ? "4 hour drive" :
                    i === 3 ? "5 hour drive" :
                    "3 hour drive to airport",
        notes: i === 0 ? "Exchange money at bank" :
               i === 1 ? "Bring water shoes" :
               i === 2 ? "Early start for birds" :
               "Pack beach gear"
      }))
    }
  ];
  
  async function createTrips() {
    for (const user of users) {
      // Create variations of each trip for the user
      const userTrips = trips.map(tripTemplate => ({
        ...tripTemplate,
        userId: user,
        fakeData: true,
        name: `${tripTemplate.name} - ${Math.random().toString(36).substring(7)}`,
        sharedWith: [users.find(u => u === 'karwande@gmail.com')].filter(Boolean),
        isPublic: true
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
        //   console.log(`Created trip ${trip.name} for ${user} with ID: ${data.tripId}`);
        } catch (error) {
          console.error(`Failed to create trip ${trip.name} for ${user}:`, error);
        }
      }
    }
  }
  
  createTrips().catch(console.error);