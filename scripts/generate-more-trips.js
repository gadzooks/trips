// scripts/generate-more-trips.js

// to run this script : node scripts/generate-more-trips.js

const users = [
    // 'john.doe@example.com',
    // 'jane.smith@example.com',
    // 'bob.wilson@example.com',
    'karwande@gmail.com'
  ];
  
  const trips = [
    // Trip 1: Italian Renaissance Tour
    {
      name: "Italian Renaissance Tour",
      description: "Explore the art, history, and cuisine of Florence and Rome.",
      isPublic: true,
      tags: ["art", "history", "culture", "italy", "europe", "food"],
      days: Array.from({length: 7}, (_, i) => {
        const date = new Date('2023-05-10');
        date.setDate(date.getDate() + i);
        const formattedDate = date.toISOString().split('T')[0];
        return {
          id: `day${i+1}`,
          date: formattedDate,
          itinerary: i === 0 ? "Arrive in Florence, explore Oltrarno district, and enjoy sunset views from Ponte Vecchio. Settle into the hotel and have a relaxed first evening." :
                     i === 1 ? "Visit the Uffizi Gallery (pre-booked tickets essential) to marvel at Renaissance masterpieces. Climb Brunelleschi's Dome for breathtaking panoramic views of the city." :
                     i === 2 ? "See Michelangelo's David at the Accademia Gallery. Explore the bustling San Lorenzo Market and enjoy lunch at the Mercato Centrale food hall." :
                     i === 3 ? "Take a high-speed train to Rome. Check into the hotel near Vatican City and take an afternoon tour of St. Peter's Basilica and Square." :
                     i === 4 ? "Immerse yourself in the Vatican Museums, including the stunning Sistine Chapel (allow several hours). Explore the nearby Borgo district or Castel Sant'Angelo in the afternoon." :
                     i === 5 ? "Step back in time exploring the Colosseum, Roman Forum, and Palatine Hill. In the evening, toss a coin in the Trevi Fountain and visit the Pantheon." :
                     "Visit the Borghese Gallery and Museum (reservations mandatory) for sculptures and paintings. Enjoy a final stroll through Borghese Gardens before departing from Rome Fiumicino Airport (FCO).",
          reservations: i === 0 ? "Flight IT123 arriving FLR at 2 PM. Hotel Lungarno reservation confirmed (Ref: FLR789). Consider booking a welcome dinner at Trattoria Sabatino." :
                        i === 1 ? "Uffizi Gallery timed entry tickets booked for 9:30 AM. Duomo climb tickets reserved for 3 PM. Recommended dinner reservation at Osteria Santo Spirito." :
                        i === 2 ? "Accademia Gallery timed entry tickets booked for 10:00 AM. No market reservations needed, but check opening hours. Lunch planned at Mercato Centrale." :
                        i === 3 ? "Trenitalia high-speed train (FR 9571) Florence SMN to Rome Termini booked for 10:00 AM. Starhotels Michelangelo Rome reservation confirmed (Ref: ROM123). Consider booking a Vatican Scavi tour far in advance if interested." :
                        i === 4 ? "Vatican Museums & Sistine Chapel timed entry tickets booked for 9:00 AM. Castel Sant'Angelo tickets can be purchased online or on-site. Dinner reservation at Pizzarium Bonci recommended." :
                        i === 5 ? "Colosseum/Forum/Palatine Hill combo ticket booked for 10:00 AM timed entry. Trevi/Pantheon require no booking. Dinner reservation made at Da Enzo al 29 in Trastevere." :
                        "Borghese Gallery timed entry tickets booked for 10:00 AM (strictly enforced two-hour slot). Leonardo Express train tickets to FCO purchased for 3 PM departure.",
          lodging: i < 3 ? "Hotel Lungarno, Borgo San Jacopo, 14, 50125 Firenze FI, Italy" :
                   "Starhotels Michelangelo Rome, Via della Stazione di S. Pietro, 14, 00165 Roma RM, Italy",
          travelTime: i === 0 ? "30 min taxi from FLR" :
                      i === 1 ? "Local walking" :
                      i === 2 ? "Local walking" :
                      i === 3 ? "1.5 hr train + 20 min taxi/metro" :
                      i === 4 ? "Local walking/short taxi" :
                      i === 5 ? "Metro/bus/taxi to Colosseum, then walking" :
                      "20 min taxi to Borghese, 45 min train to FCO",
          notes: i === 0 ? "Purchase Firenze Card online for museum access if cost-effective. Wear comfortable shoes for cobblestones. Learn basic Italian greetings." :
                 i === 1 ? "Uffizi is vast; prioritize key artworks. Book Duomo climb far in advance, it's strenuous but worth it. Stay hydrated." :
                 i === 2 ? "Be prepared for crowds at Accademia. Bargain respectfully at San Lorenzo Market. Mercato Centrale offers great variety." :
                 i === 3 ? "Validate train tickets before boarding if required. Dress modestly for Vatican sites (shoulders/knees covered). Book Vatican Museums for the next day now if not already done." :
                 i === 4 ? "Allow ample time (3-4 hours) for Vatican Museums. No photography allowed in Sistine Chapel. Comfortable shoes are a must." :
                 i === 5 ? "Wear sunscreen and a hat for Ancient Rome sites as there's little shade. Toss a coin right-handed over left shoulder into Trevi Fountain! Check Pantheon opening hours." :
                 "Borghese Gallery visits are strictly timed. Book airport transfer/train tickets in advance. Allow plenty of time for airport procedures."
        }
      }),
    },
    // Trip 2: Japanese Cultural Immersion
    {
      name: "Japanese Cultural Immersion",
      description: "Experience the contrast of modern Tokyo and traditional Kyoto.",
      isPublic: true,
      tags: ["culture", "history", "city", "asia", "japan", "food"],
      days: Array.from({length: 8}, (_, i) => {
         const date = new Date('2024-03-15');
         date.setDate(date.getDate() + i);
         const formattedDate = date.toISOString().split('T')[0];
        return {
          id: `day${i+1}`,
          date: formattedDate,
          itinerary: i === 0 ? "Arrive at Narita (NRT) or Haneda (HND) Airport in Tokyo. Transfer to your hotel in Shinjuku and take an evening stroll to see the vibrant lights and grab dinner." :
                     i === 1 ? "Explore the electric energy of Shibuya crossing and the trendy Harajuku district. Visit the serene Meiji Jingu Shrine nestled in the forest." :
                     i === 2 ? "Immerse yourself in traditional culture in Asakusa: visit Senso-ji Temple and Nakamise-dori market. Take a relaxing Sumida River cruise for city views." :
                     i === 3 ? "Day trip to Hakone for stunning views of Mt. Fuji (weather permitting). Enjoy the Hakone Open-Air Museum and a cruise across Lake Ashi." :
                     i === 4 ? "Take the Shinkansen (bullet train) to Kyoto. Check into your ryokan or hotel and explore the Gion district, hoping to spot geishas." :
                     i === 5 ? "Visit the iconic Fushimi Inari Shrine with its thousands of red torii gates. Explore the beautiful Arashiyama Bamboo Grove and Tenryu-ji Temple." :
                     i === 6 ? "Discover Kinkaku-ji (Golden Pavilion) and Ryoan-ji Temple with its famous Zen rock garden. Experience a traditional tea ceremony." :
                     "Visit Nijo Castle, former residence of the Tokugawa shogunate. Do some last-minute souvenir shopping at Nishiki Market before departing from Kansai Airport (KIX).",
          reservations: i === 0 ? "Flight JL005 arriving NRT at 4 PM. Park Hyatt Tokyo reservation confirmed (Ref: TYO456). Airport Limousine Bus tickets purchased." :
                        i === 1 ? "No specific reservations needed for Shibuya/Harajuku/Meiji Jingu. Dinner reservation at Ichiran Ramen recommended for the solo dining experience." :
                        i === 2 ? "Sumida River Cruise tickets booked for 3 PM departure from Asakusa. Consider reserving a spot at a themed cafe like the Owl Cafe." :
                        i === 3 ? "Hakone Free Pass purchased for transportation. Consider booking Hakone Open-Air Museum tickets online to save time. Check train schedules for Odawara/Hakone-Yumoto." :
                        i === 4 ? "Shinkansen Nozomi tickets (Tokyo to Kyoto) booked for 10:00 AM. Ryokan KANADE reservation confirmed (Ref: KYO789). Gion walking tour booked for evening." :
                        i === 5 ? "No reservations needed for Fushimi Inari or Arashiyama Bamboo Grove (go early to avoid crowds). Tenryu-ji Temple entry tickets purchased on site." :
                        i === 6 ? "Kinkaku-ji and Ryoan-ji tickets purchased on site. Tea ceremony experience booked for 3 PM at Camellia Flower Teahouse." :
                        "Nijo Castle tickets purchased online. Haruka Express train tickets (Kyoto to KIX) booked for 4 PM departure.",
          lodging: i < 4 ? "Park Hyatt Tokyo, 3-7-1-2 Nishi-Shinjuku, Shinjuku-Ku, Tokyo, 163-1055, Japan" :
                   "Ryokan KANADE, 665 Kodoicho, Shimogyo Ward, Kyoto, 600-8186, Japan",
          travelTime: i === 0 ? "1.5-2 hr train/bus from NRT" :
                      i === 1 ? "Local metro (Tokyo Metro/JR)" :
                      i === 2 ? "Local metro + River Cruise (40 min)" :
                      i === 3 ? "1.5 hr train to Hakone + local transport" :
                      i === 4 ? "2.5 hr Shinkansen + local metro/taxi" :
                      i === 5 ? "Local train/bus (JR Nara Line to Fushimi Inari)" :
                      i === 6 ? "Local bus/taxi" :
                      "Local bus/taxi + 75 min Haruka Express to KIX",
          notes: i === 0 ? "Get a Suica or Pasmo card for easy metro travel. Learn basic Japanese phrases like 'Arigato' (Thank you). Carry some cash as not all small shops accept cards." :
                 i === 1 ? "Shibuya Crossing is best viewed from the Starbucks overlook. Harajuku's Takeshita Street is crowded on weekends. Meiji Jingu is a peaceful escape." :
                 i === 2 ? "Wear shoes easy to slip on/off for temple visits. Try some street food on Nakamise-dori. Check river cruise schedules in advance." :
                 i === 3 ? "Check the Mt. Fuji forecast before going. The Hakone Loop involves various transport modes (train, cable car, ropeway, boat, bus). Allow a full day." :
                 i === 4 ? "Forward large luggage from Tokyo to Kyoto hotel using Takkyubin service for easier train travel. Respect etiquette in Gion (no harassing geishas). Enjoy the ryokan onsen if available." :
                 i === 5 ? "Visit Fushimi Inari early morning to avoid peak crowds and get better photos. Wear comfortable shoes for walking uphill. Arashiyama can also get very busy." :
                 i === 6 ? "Kinkaku-ji is purely for viewing from outside. Ryoan-ji's rock garden encourages contemplation. Remove shoes before entering tea ceremony room." :
                 "Nijo Castle has 'nightingale floors' that chirp when walked on. Nishiki Market is great for food samples and unique ingredients. Allow ample time for KIX airport procedures."
        }
      }),
    },
    // Trip 3: California Coast Road Trip (SF to LA)
     {
      name: "California Coast Road Trip (SF to LA)",
      description: "Drive the scenic Pacific Coast Highway from San Francisco to Los Angeles.",
      isPublic: true,
      tags: ["roadtrip", "scenic", "usa", "california", "beach", "nature"],
      days: Array.from({length: 6}, (_, i) => {
          const date = new Date('2022-09-20');
          date.setDate(date.getDate() + i);
          const formattedDate = date.toISOString().split('T')[0];
          return {
              id: `day${i+1}`,
              date: formattedDate,
              itinerary: i === 0 ? "Arrive in San Francisco (SFO), pick up rental car. Explore Fisherman's Wharf, see the sea lions at Pier 39, and enjoy views of Alcatraz and the Golden Gate Bridge." :
                         i === 1 ? "Drive across the Golden Gate Bridge. Head south on Highway 1, stopping in charming Carmel-by-the-Sea and exploring Point Lobos State Natural Reserve." :
                         i === 2 ? "Continue south through Big Sur, stopping at iconic viewpoints like Bixby Bridge and McWay Falls. Enjoy short hikes and soak in the dramatic coastal scenery." :
                         i === 3 ? "Drive to San Simeon and tour the opulent Hearst Castle (reservations highly recommended). Continue south to the coastal town of Morro Bay, known for Morro Rock." :
                         i === 4 ? "Explore the Danish-inspired town of Solvang in the Santa Ynez Valley wine region. Drive to Santa Barbara, visit Stearns Wharf, and relax on the beach." :
                         "Drive the final leg to Los Angeles. Check into your hotel, perhaps explore Santa Monica Pier or Griffith Observatory for city views before departure day.",
              reservations: i === 0 ? "Flight UA456 arriving SFO at 11 AM. Rental car (SUV) booked with Hertz (Ref: SFOH123). Hotel Argonaut reservation confirmed (Ref: SFOARG9)." :
                            i === 1 ? "Golden Gate Bridge toll paid via license plate. La Playa Carmel hotel reservation confirmed (Ref: CRMELP1). Point Lobos has limited parking, arrive early." :
                            i === 2 ? "Big Sur Lodge reservation confirmed (Ref: BIGSURL1). No specific reservations needed for viewpoints, but check for road closures on Highway 1." :
                            i === 3 ? "Hearst Castle Grand Rooms Tour booked for 11:00 AM (Ref: HCGRT55). Inn at Morro Bay reservation confirmed (Ref: MORROB2)." :
                            i === 4 ? "Consider booking wine tasting appointments in Santa Ynez Valley. Hotel Californian reservation confirmed in Santa Barbara (Ref: SBAHCAL3)." :
                            "The LINE Hotel LA reservation confirmed (Ref: LAXLINE8). Consider booking Griffith Observatory tickets if planning to enter.",
              lodging: i === 0 ? "Hotel Argonaut, 495 Jefferson St, San Francisco, CA 94109, USA" :
                       i === 1 ? "La Playa Carmel, Camino Real &, 8th Ave, Carmel-By-The-Sea, CA 93921, USA" :
                       i === 2 ? "Big Sur Lodge, 47225 CA-1, Big Sur, CA 93920, USA" :
                       i === 3 ? "Inn at Morro Bay, 60 State Park Rd, Morro Bay, CA 93442, USA" :
                       i === 4 ? "Hotel Californian, 36 State St, Santa Barbara, CA 93101, USA" :
                       "The LINE Hotel LA, 3515 Wilshire Blvd, Los Angeles, CA 90010, USA",
              travelTime: i === 0 ? "45 min shuttle/taxi from SFO + local driving" :
                          i === 1 ? "Approx 2-3 hour drive (+ stops)" :
                          i === 2 ? "Approx 2-3 hour drive through Big Sur (+ stops)" :
                          i === 3 ? "Approx 1.5 hour drive to Hearst Castle + 1 hour to Morro Bay" :
                          i === 4 ? "Approx 1.5 hour drive to Solvang + 45 mins to Santa Barbara" :
                          "Approx 2 hour drive to LA (traffic dependent)",
              notes: i === 0 ? "Book Alcatraz tickets months in advance if planning to visit. Dress in layers for SF's variable weather. Download offline maps for areas with poor signal." :
                     i === 1 ? "Walk the Golden Gate Bridge for great views (can be windy/foggy). Point Lobos often reaches capacity; have backup plans. Carmel has unique architecture and art galleries." :
                     i === 2 ? "Fill up gas before entering Big Sur, services are limited and expensive. Check CA Highway Patrol (CHP) website for current Highway 1 conditions/closures. Take photos safely at designated pull-offs ONLY." :
                     i === 3 ? "Allow ample time for Hearst Castle tour and exploring the grounds. Morro Bay is great for spotting sea otters. Enjoy fresh seafood." :
                     i === 4 ? "Try Danish pastries in Solvang. Consider a wine tasting tour if time permits. Santa Barbara has beautiful Spanish colonial architecture." :
                     "LA traffic can be extreme; plan driving times accordingly. Decide which LA neighborhood suits your interests for activities/dining. Consider public transport or ride-sharing within LA."
          }
      }),
     },
     // Trip 4: Costa Rican Rainforest Adventure
     {
      name: "Costa Rican Rainforest Adventure",
      description: "Explore volcanoes, cloud forests, and diverse wildlife in La Fortuna and Monteverde.",
      isPublic: true,
      tags: ["nature", "adventure", "wildlife", "hiking", "costa rica", "central america"],
      days: Array.from({length: 7}, (_, i) => {
          const date = new Date('2024-11-05');
          date.setDate(date.getDate() + i);
          const formattedDate = date.toISOString().split('T')[0];
          return {
              id: `day${i+1}`,
              date: formattedDate,
              itinerary: i === 0 ? "Arrive at Juan Santamaría International Airport (SJO) near San Jose. Pick up rental 4x4 vehicle and drive to La Fortuna, settling into your eco-lodge near Arenal Volcano." :
                         i === 1 ? "Hike around Arenal Volcano National Park, walk across the Arenal Hanging Bridges for canopy views. Relax in the evening at one of the natural hot springs resorts." :
                         i === 2 ? "Visit La Fortuna Waterfall for a refreshing swim. Try an adventure activity like zip-lining through the rainforest canopy or white-water rafting." :
                         i === 3 ? "Drive the scenic (and bumpy) route around Lake Arenal to Monteverde. Check into your cloud forest accommodation and take a night walk tour to spot nocturnal creatures." :
                         i === 4 ? "Explore the Monteverde Cloud Forest Biological Preserve, looking for unique flora and fauna like the Resplendent Quetzal (seasonal). Walk among the treetops on suspension bridges." :
                         i === 5 ? "Visit the Santa Elena Cloud Forest Reserve, often less crowded than Monteverde. Consider a visit to a local coffee plantation for a tour and tasting." :
                         "Drive back towards SJO airport area. Perhaps visit Poas Volcano National Park (check status) or the La Paz Waterfall Gardens before returning rental car and preparing for departure.",
              reservations: i === 0 ? "Flight AA987 arriving SJO at 1 PM. 4x4 rental booked with Adobe Rent a Car (Ref: SJOAD44). Nayara Gardens reservation confirmed (Ref: FORTN8)." :
                            i === 1 ? "Arenal Hanging Bridges tickets booked online. Tabacon Hot Springs evening pass reserved for 6 PM. Park entrance fees paid on site." :
                            i === 2 ? "Sky Adventures zip-lining tour booked for 10 AM. La Fortuna Waterfall entrance fee paid on site. Dinner reservation at Don Rufino suggested." :
                            i === 3 ? "Hotel Belmar reservation confirmed in Monteverde (Ref: MONTB3). Night walk tour booked with Kinkajou Night Walk for 7 PM." :
                            i === 4 ? "Monteverde Cloud Forest Preserve entrance tickets purchased online (recommended). No specific reservations needed for bridges within park." :
                            i === 5 ? "Santa Elena Reserve entrance fee paid on site. Don Juan Coffee Plantation tour booked for 2 PM." :
                            "Consider booking La Paz Waterfall Gardens tickets online. Hotel near SJO (e.g., Courtyard Alajuela) booked for last night if needed. Check Poas Volcano status and reservation requirements.",
              lodging: i < 3 ? "Nayara Gardens, 702 road 21007, Provincia de Alajuela, La Fortuna, 21007, Costa Rica" :
                       i < 6 ? "Hotel Belmar, 300m East of the gas station, Provincia de Puntarenas, Monteverde, 60109, Costa Rica" :
                       "Courtyard by Marriott San Jose Airport Alajuela, Radial Francisco J. Orlich Plaza Los Mangos, Alajuela Province, Alajuela, 20109, Costa Rica", // Assuming last night near SJO
              travelTime: i === 0 ? "Approx 3 hour drive from SJO to La Fortuna" :
                          i === 1 ? "Local driving (short distances)" :
                          i === 2 ? "Local driving/tour transport" :
                          i === 3 ? "Approx 3-4 hour drive (partially unpaved)" :
                          i === 4 ? "Short drive/taxi to reserve" :
                          i === 5 ? "Short drive/taxi to reserve/plantation" :
                          "Approx 3 hour drive back to SJO area",
              notes: i === 0 ? "A 4x4 vehicle is highly recommended, especially for the road to Monteverde. Download offline maps (Waze or Google Maps). Bring insect repellent and rain gear." :
                     i === 1 ? "Wear sturdy hiking shoes. Bring swimwear and a towel for hot springs. Book popular hot springs in advance." :
                     i === 2 ? "Choose adventure activities based on comfort level. Waterfall steps can be slippery. Stay hydrated in the heat." :
                     i === 3 ? "The drive to Monteverde is scenic but can be rough; allow plenty of daylight hours. Night walks require flashlights (usually provided) and quiet observation." :
                     i === 4 ? "Cloud forests can be misty and cool, dress in layers. Binoculars are essential for birdwatching. Hire a local guide for best wildlife spotting chances." :
                     i === 5 ? "Santa Elena Reserve is managed by the local community. Coffee tours offer insight into an important Costa Rican product. Support local businesses." :
                     "Check volcanic activity status for Poas before visiting. La Paz is quite commercial but has good wildlife exhibits. Allow extra time for rental car return and airport check-in."
          }
      }),
     },
     // Trip 5: Parisian City Break
     {
      name: "Parisian City Break",
      description: "Experience the art, romance, food, and iconic landmarks of Paris.",
      isPublic: true,
      tags: ["city break", "europe", "france", "paris", "art", "romance", "food"],
      days: Array.from({length: 5}, (_, i) => {
          const date = new Date('2024-09-10');
          date.setDate(date.getDate() + i);
          const formattedDate = date.toISOString().split('T')[0];
          return {
              id: `day${i+1}`,
              date: formattedDate,
              itinerary: i === 0 ? "Arrive at Charles de Gaulle (CDG) or Orly (ORY) Airport. Transfer to your hotel in Le Marais. Explore the charming streets, Place des Vosges, and enjoy dinner at a local bistro." :
                         i === 1 ? "Visit the Louvre Museum (book tickets well in advance!). Stroll through the Tuileries Garden towards Place de la Concorde. See the Arc de Triomphe and walk down the Champs-Élysées." :
                         i === 2 ? "Explore Île de la Cité: visit Sainte-Chapelle for its stunning stained glass and see Notre Dame Cathedral (exterior view). Discover the Latin Quarter and Shakespeare & Company bookstore." :
                         i === 3 ? "Ascend the Eiffel Tower (book tickets far ahead!). Take a relaxing Seine River cruise. Explore the Musée d'Orsay, housed in a former train station, focusing on Impressionist art." :
                         "Wander through the artistic neighborhood of Montmartre, visit the Sacré-Cœur Basilica for panoramic views. Enjoy some last-minute pastry shopping before heading to the airport for departure.",
              reservations: i === 0 ? "Flight AF011 arriving CDG at 9 AM. Hotel Caron de Beaumarchais reservation confirmed (Ref: PARISM1). RER B train tickets from CDG purchased." :
                            i === 1 ? "Louvre Museum timed entry ticket booked for 10:00 AM. Consider Arc de Triomphe rooftop ticket pre-booking. Dinner reservation at Bouillon Pigalle recommended." :
                            i === 2 ? "Sainte-Chapelle timed entry ticket booked for 11:00 AM. No reservations needed for Latin Quarter exploration. Consider a walking tour booking." :
                            i === 3 ? "Eiffel Tower summit access tickets booked for 10:30 AM. Bateaux Mouches Seine River cruise tickets purchased. Musée d'Orsay timed entry ticket booked for 3 PM." :
                            "No reservations essential for Montmartre/Sacré-Cœur (except perhaps specific shows/restaurants). RER B train ticket to CDG purchased.",
              lodging: "Hotel Caron de Beaumarchais, 12 Rue Vieille du Temple, 75004 Paris, France",
              travelTime: i === 0 ? "Approx 1 hour RER train/taxi from CDG" :
                          i === 1 ? "Local metro/walking" :
                          i === 2 ? "Local metro/walking" :
                          i === 3 ? "Local metro/walking/river cruise (1 hr)" :
                          "Local metro + 1 hour RER train/taxi to CDG",
              notes: i === 0 ? "Purchase a Navigo Découverte pass (if staying Mon-Sun) or carnet of t+ tickets for metro. Le Marais is great for boutique shopping and cafes. Beware of pickpockets in tourist areas." :
                     i === 1 ? "The Louvre is huge; plan your visit focusing on specific wings (Denon for Mona Lisa/Winged Victory). Champs-Élysées is mostly high-end shops; window shopping is fine." :
                     i === 2 ? "Book Sainte-Chapelle for a sunny morning if possible. Notre Dame exterior viewing areas may change due to restoration. Get lost in the Latin Quarter's bookshops and cafes." :
                     i === 3 ? "Eiffel Tower tickets sell out months in advance, especially for summit access. Seine cruises offer a different perspective on landmarks. Musée d'Orsay is more manageable than the Louvre." :
                     "Visit Montmartre early to avoid crowds. Enjoy the street artists at Place du Tertre. Grab delicious pastries from a local boulangerie. Allow ample time for airport transfer and check-in."
          }
      }),
     },
      // Trip 6: Canadian Rockies Exploration
     {
      name: "Canadian Rockies Exploration",
      description: "Discover the stunning mountain scenery, turquoise lakes, and glaciers of Banff and Jasper National Parks.",
      isPublic: true,
      tags: ["nature", "mountains", "hiking", "canada", "north america", "scenic", "lakes"],
      days: Array.from({length: 7}, (_, i) => {
          const date = new Date('2023-07-15');
          date.setDate(date.getDate() + i);
          const formattedDate = date.toISOString().split('T')[0];
          return {
              id: `day${i+1}`,
              date: formattedDate,
              itinerary: i === 0 ? "Fly into Calgary International Airport (YYC). Pick up rental car and drive to Banff (~1.5-2 hrs). Check into hotel, explore Banff townsite, and ride the Banff Gondola for panoramic views." :
                         i === 1 ? "Visit the iconic Lake Louise and Moraine Lake (access may require shuttle booking). Hike to Lake Agnes Teahouse or paddle a canoe on Lake Louise." :
                         i === 2 ? "Explore Johnston Canyon, walking the catwalks to the Lower and Upper Falls. Drive the scenic Bow Valley Parkway, looking for wildlife (go early or late)." :
                         i === 3 ? "Drive the Icefields Parkway towards Jasper, one of the world's most scenic drives. Stop at Peyto Lake viewpoint, Bow Lake, and the Columbia Icefield Discovery Centre." :
                         i === 4 ? "At the Columbia Icefield, take the Ice Explorer tour onto the Athabasca Glacier and walk on the Glacier Skywalk (book in advance). Continue driving to Jasper townsite." :
                         i === 5 ? "Explore Maligne Lake, take a boat cruise to Spirit Island (book ahead). Visit Maligne Canyon and walk the bridges over the deep gorge." :
                         "Enjoy a final morning hike near Jasper (e.g., Valley of the Five Lakes). Begin the scenic drive back towards Calgary, perhaps stopping at Canmore for lunch, before catching evening flight from YYC.",
              reservations: i === 0 ? "Flight AC221 arriving YYC at 12 PM. Rental car booked with Avis (Ref: YYCAV5). Fairmont Banff Springs reservation confirmed (Ref: BANFFSPR1)." :
                            i === 1 ? "Parks Canada shuttle reservation for Lake Louise/Moraine Lake booked (essential during peak season). Canoe rental paid on site. Lake Agnes Teahouse is cash only." :
                            i === 2 ? "No reservations needed for Johnston Canyon or Bow Valley Parkway. Consider dinner reservation at The Bison Restaurant in Banff." :
                            i === 3 ? "No specific reservations needed for viewpoints along Icefields Parkway. Ensure Parks Canada Discovery Pass is valid and displayed." :
                            i === 4 ? "Columbia Icefield Adventure (Ice Explorer + Skywalk) combo ticket booked for 11:00 AM. Fairmont Jasper Park Lodge reservation confirmed (Ref: JASPPL2)." :
                            i === 5 ? "Maligne Lake Boat Cruise to Spirit Island booked for 10:00 AM. No reservations needed for Maligne Canyon." :
                            "No reservations needed for Valley of the Five Lakes. Check flight status AC228 departing YYC at 8 PM.",
              lodging: i < 3 ? "Fairmont Banff Springs, 405 Spray Ave, Banff, AB T1L 1J4, Canada" :
                       i < 6 ? "Fairmont Jasper Park Lodge, 1 Old Lodge Rd, Jasper, AB T0E 1E0, Canada" :
                       "N/A - Driving back to Calgary for flight",
              travelTime: i === 0 ? "1.5-2 hour drive YYC to Banff" :
                          i === 1 ? "Short drive + shuttle to lakes" :
                          i === 2 ? "Short drives around Banff" :
                          i === 3 ? "Approx 3-4 hour drive Banff to Columbia Icefield (+ stops)" :
                          i === 4 ? "Local glacier activities + 1.5 hour drive to Jasper" :
                          i === 5 ? "Approx 1 hour drive to Maligne Lake area" :
                          "Approx 4-5 hour drive Jasper to YYC (+ stops)",
              notes: i === 0 ? "Purchase Parks Canada Discovery Pass online in advance or upon entry. Book Banff Gondola tickets online. Weather can change rapidly; pack layers, including rain gear." :
                     i === 1 ? "Moraine Lake access is restricted; research Parks Canada shuttle/bus options well in advance as parking is usually unavailable. Arrive very early for best light and fewer crowds. Bring cash for Teahouse." :
                     i === 2 ? "Wear sturdy footwear for Johnston Canyon; microspikes recommended if icy (early/late season). Drive slowly on Bow Valley Parkway, especially at dawn/dusk for wildlife. Carry bear spray and know how to use it." :
                     i === 3 ? "Fill up gas in Lake Louise before heading onto the Icefields Parkway. Cell service is non-existent for most of the parkway; download offline maps. Pack snacks and water." :
                     i === 4 ? "Dress warmly for the glacier tour, even in summer. The Skywalk offers great views but isn't for those with fear of heights. Book tours in advance, especially in peak season." :
                     i === 5 ? "Spirit Island boat tours are popular; book early. Maligne Canyon trail can be slippery when wet. Watch for elk around Jasper townsite." :
                     "Allow ample driving time back to Calgary, accounting for potential stops and traffic. Check road conditions before departing Jasper. Ensure sufficient time for rental car return and airport check-in at YYC."
          }
      }),
     },
     // Trip 7: Southeast Asian Beaches (Thailand)
     {
      name: "Southeast Asian Beach Escape (Thailand)",
      description: "Relax on the stunning beaches of Phuket and explore the dramatic limestone karsts of Krabi.",
      isPublic: true,
      tags: ["beach", "relaxation", "asia", "thailand", "southeast asia", "islands", "snorkeling"],
      days: Array.from({length: 9}, (_, i) => {
          const date = new Date('2023-02-10');
          date.setDate(date.getDate() + i);
          const formattedDate = date.toISOString().split('T')[0];
          return {
              id: `day${i+1}`,
              date: formattedDate,
              itinerary: i === 0 ? "Fly into Phuket International Airport (HKT). Transfer to your beachfront hotel on Kata or Karon Beach. Relax, swim, and enjoy a sunset dinner." :
                         i === 1 ? "Explore Phuket's southern beaches: visit Promthep Cape for sunset views, see the Big Buddha statue. Enjoy watersports or simply relax on the sand." :
                         i === 2 ? "Take a day trip boat tour to the Phi Phi Islands. Snorkel in crystal-clear waters, visit Maya Bay (check accessibility rules), and see Viking Cave." :
                         i === 3 ? "Explore Phuket Old Town with its Sino-Portuguese architecture. Visit local markets and enjoy authentic Thai street food." :
                         i === 4 ? "Transfer from Phuket to Krabi province via ferry or land transfer. Check into your hotel near Ao Nang or Railay Beach." :
                         i === 5 ? "Take a longtail boat to Railay Beach (if staying in Ao Nang). Explore Phra Nang Cave Beach and climb to the viewpoint for stunning panoramas (challenging climb)." :
                         i === 6 ? "Island hopping tour from Krabi: visit spots like Hong Island or the '4 Islands' (Tup Island, Chicken Island, Poda Island) for snorkeling and beaches." :
                         i === 7 ? "Relax on Ao Nang beach or try kayaking through mangrove forests near Ao Thalane. Enjoy a final Thai massage." :
                         "Transfer to Krabi International Airport (KBV) for your departure flight.",
              reservations: i === 0 ? "Flight TG221 arriving HKT at 3 PM. The Shore at Katathani reservation confirmed (Ref: HKTKAT1)." :
                            i === 1 ? "No specific reservations needed for beaches/viewpoints. Big Buddha visit is free (donations welcome). Consider booking sunset dinner at a viewpoint restaurant." :
                            i === 2 ? "Phi Phi Islands speedboat tour booked with Simba Sea Trips. National Park fees often paid separately on tour." :
                            i === 3 ? "No reservations needed for Old Town exploration. Consider booking a Thai cooking class." :
                            i === 4 ? "Phuket to Krabi ferry ticket booked for 11:00 AM departure. Rayavadee resort reservation confirmed (Railay Beach) (Ref: KBVRAY5)." :
                            i === 5 ? "Longtail boat from Ao Nang Pier to Railay paid on site (fixed price). No reservations for viewpoint/beaches." :
                            i === 6 ? "Hong Island longtail boat tour booked via hotel/local agent. Remember cash for National Park entrance fees if not included." :
                            i === 7 ? "Ao Thalane kayaking tour booked for the morning. Thai massage appointment made at hotel spa." :
                            "Transfer to KBV airport arranged via hotel/taxi for flight QR841 departing at 4 PM.",
              lodging: i < 4 ? "The Shore at Katathani, 14 Kata Noi Rd, Karon, Muang, Phuket 83100, Thailand" :
                       i < 8 ? "Rayavadee, 214 Moo 2, Tambon Ao-Nang, Amphoe Muang, Krabi 81000, Thailand" : // Assuming staying at Railay
                       "N/A - Departing",
              travelTime: i === 0 ? "Approx 1 hour taxi from HKT" :
                          i === 1 ? "Local taxi/tuk-tuk/scooter rental" :
                          i === 2 ? "Full day boat tour" :
                          i === 3 ? "30-45 min taxi to Old Town" :
                          i === 4 ? "Approx 2-3 hour ferry/land transfer" :
                          i === 5 ? "15 min longtail boat ride (Ao Nang to Railay)" :
                          i === 6 ? "Full day boat tour" :
                          i === 7 ? "Local boat/taxi + tour transport" :
                          "Approx 45 min taxi/transfer from Railay/Ao Nang to KBV",
              notes: i === 0 ? "Arrange airport transfer in advance or use official airport taxis. Stay hydrated and use sunscreen. Learn a few Thai phrases ('Sawasdee' - Hello, 'Khop Khun' - Thank You)." :
                     i === 1 ? "Dress respectfully when visiting Big Buddha (cover shoulders/knees). Negotiate prices with tuk-tuk drivers before starting trip. Promthep Cape is very popular at sunset." :
                     i === 2 ? "Choose reputable boat tour operators. Bring reef-safe sunscreen and swimwear. Maya Bay may have restrictions on swimming or boat access; check current rules." :
                     i === 3 ? "Phuket Old Town is best explored on foot. Try local snacks like 'Ah Pong' (crispy crepes). Weekend night markets are vibrant." :
                     i === 4 ? "Confirm ferry pier location (Phuket has multiple). If transferring by land, journey takes longer. Railay Beach is only accessible by boat." :
                     i === 5 ? "Wear sturdy shoes (not flip-flops) if attempting Railay viewpoint climb – it's steep and uses ropes. Watch out for monkeys on Phra Nang beach." :
                     i === 6 ? "Bring cash for national park fees. Check tide times as some '4 Islands' features (like the sandbar) are tide-dependent. Protect yourself from the sun on boats." :
                     i === 7 ? "Kayaking tours often include opportunities to see wildlife. Thai massages can vary in intensity; communicate your preference. Enjoy the local seafood." :
                     "Allow ample time for boat transfer (if staying on Railay) and road travel to Krabi airport. Check baggage allowances for domestic/international flights."
          }
      }),
     },
     // Trip 8: Andalusian Discovery (Spain)
     {
      name: "Andalusian Discovery (Spain)",
      description: "Experience the passion of flamenco, Moorish architecture, and vibrant culture of Seville, Granada, and Cordoba.",
      isPublic: true,
      tags: ["culture", "history", "spain", "europe", "architecture", "food", "flamenco"],
      days: Array.from({length: 8}, (_, i) => {
          const date = new Date('2024-04-20');
          date.setDate(date.getDate() + i);
          const formattedDate = date.toISOString().split('T')[0];
          return {
              id: `day${i+1}`,
              date: formattedDate,
              itinerary: i === 0 ? "Arrive at Seville Airport (SVQ). Transfer to your hotel in the Santa Cruz neighborhood. Explore the charming narrow streets and enjoy tapas for dinner." :
                         i === 1 ? "Visit the stunning Alcázar of Seville (royal palace with Moorish influences - book ahead!). Explore Seville Cathedral, the world's largest Gothic cathedral, and climb the Giralda tower." :
                         i === 2 ? "Wander through María Luisa Park and marvel at the Plaza de España. Experience an authentic Flamenco show in the evening in the Triana district." :
                         i === 3 ? "Take a morning train to Cordoba. Visit the Mezquita-Catedral, a breathtaking Mosque-Cathedral. Explore the historic Jewish Quarter (Judería) and its Patios." :
                         i === 4 ? "Continue by train to Granada. Check into your hotel near the Albaicín district. Enjoy sunset views of the Alhambra from the Mirador de San Nicolás." :
                         i === 5 ? "Dedicate the day to exploring the magnificent Alhambra palace and Generalife gardens (book tickets MONTHS in advance!). Allow several hours for this complex." :
                         i === 6 ? "Explore the Albaicín, Granada's old Arab quarter with its winding streets and whitewashed houses. Visit the Granada Cathedral and Royal Chapel in the city center." :
                         "Enjoy a final Spanish breakfast. Transfer to Granada Airport (GRX) or take a train back to Seville/Malaga for departure.",
              reservations: i === 0 ? "Flight IB3106 arriving SVQ at 1 PM. Hotel Alfonso XIII reservation confirmed (Ref: SVQALF1). Airport bus ticket purchased." :
                            i === 1 ? "Alcázar of Seville timed entry tickets booked for 10:00 AM. Seville Cathedral & Giralda tickets booked for 2 PM." :
                            i === 2 ? "No reservations needed for park/plaza. Flamenco show tickets booked at Tablao El Arenal for 8:00 PM." :
                            i === 3 ? "Renfe train tickets (Seville to Cordoba) booked for 9:30 AM. Mezquita-Catedral tickets purchased online. Hotel Balcón de Córdoba reservation confirmed (Ref: ODBBAL2)." :
                            i === 4 ? "Renfe train tickets (Cordoba to Granada) booked for 11:00 AM. Parador de Granada reservation confirmed (within Alhambra grounds) (Ref: GRXPAR3)." :
                            i === 5 ? "Alhambra General tickets (including Nasrid Palaces timed entry) booked for 10:30 AM Nasrid Palaces slot. Ensure you arrive well before Nasrid Palaces entry time." :
                            i === 6 ? "Granada Cathedral & Royal Chapel tickets purchased online or on site. Consider booking a walking tour of the Albaicín." :
                            "Airport transfer booked to GRX for flight VY2013 departing at 12 PM.",
              lodging: i < 3 ? "Hotel Alfonso XIII, a Luxury Collection Hotel, C. San Fernando, 2, 41004 Sevilla, Spain" :
                       i === 3 ? "Hotel Balcón de Córdoba, C. Encarnación, 8, 14003 Córdoba, Spain" :
                       i < 7 ? "Parador de Granada, C. Real de la Alhambra, s/n, 18009 Granada, Spain" :
                       "N/A - Departing",
              travelTime: i === 0 ? "30 min bus/taxi from SVQ" :
                          i === 1 ? "Local walking" :
                          i === 2 ? "Local walking/bus" :
                          i === 3 ? "45 min train + local walking/taxi" :
                          i === 4 ? "Approx 2.5 hr train + local taxi/bus" :
                          i === 5 ? "Walking within Alhambra complex" :
                          i === 6 ? "Local walking/bus" :
                          "30 min taxi to GRX",
              notes: i === 0 ? "Santa Cruz neighborhood is a maze; enjoy getting lost but use a map! Tapas culture involves ordering small dishes at various bars. Dinner is typically eaten late (9 PM onwards)." :
                     i === 1 ? "Book Alcázar tickets directly from the official website far in advance. Allow plenty of time for security checks. Wear comfortable shoes for climbing Giralda tower." :
                     i === 2 ? "Plaza de España is stunning, rent a rowboat for fun. Book Flamenco show tickets ahead, especially for reputable venues. Triana is known for ceramics as well." :
                     i === 3 ? "Mezquita requires respectful attire. Look for the flower-filled Patios in Cordoba (best in May during the Patio Festival). Validate train tickets if needed." :
                     i === 4 ? "Mirador de San Nicolás offers iconic Alhambra views, especially at sunset, but can be crowded. Be prepared for hills in Albaicín/Sacromonte." :
                     i === 5 ? "Alhambra tickets are essential and sell out extremely quickly. Bring ID matching the ticket name. Wear very comfortable shoes and bring water. Follow signs carefully, especially for Nasrid Palaces entry." :
                     i === 6 ? "Wear good walking shoes for Albaicín's cobblestones. Consider visiting a Carmen (traditional house with garden). Enjoy Granada's free tapas culture (drink purchase often includes a tapa)." :
                     "Check train schedules if departing from Seville/Malaga. Allow ample time for airport procedures. Consider buying olive oil or ceramics as souvenirs."
          }
      }),
     },
      // Trip 9: New York City Exploration
     {
      name: "New York City Exploration",
      description: "Experience the energy, landmarks, museums, and Broadway shows of the Big Apple.",
      isPublic: true,
      tags: ["city break", "usa", "new york", "landmarks", "museums", "theater", "food"],
      days: Array.from({length: 6}, (_, i) => {
          const date = new Date('2023-12-01'); // Winter trip
          date.setDate(date.getDate() + i);
          const formattedDate = date.toISOString().split('T')[0];
          return {
              id: `day${i+1}`,
              date: formattedDate,
              itinerary: i === 0 ? "Arrive at JFK, LGA, or EWR airport. Transfer to your Midtown Manhattan hotel. Take an evening walk through Times Square to experience the dazzling lights." :
                         i === 1 ? "Visit the Top of the Rock Observation Deck for iconic city views including Central Park and the Empire State Building. Explore Rockefeller Center (see the tree in winter!). Visit St. Patrick's Cathedral." :
                         i === 2 ? "Explore Central Park: Strawberry Fields (John Lennon memorial), Bethesda Terrace, The Lake. Visit the American Museum of Natural History or the Metropolitan Museum of Art (choose one)." :
                         i === 3 ? "Take the Staten Island Ferry for free views of the Statue of Liberty and Manhattan skyline. Explore the Financial District: Wall Street Bull, 9/11 Memorial & Museum (allow ample time)." :
                         i === 4 ? "Walk across the Brooklyn Bridge from Brooklyn to Manhattan for amazing skyline views. Explore the trendy DUMBO neighborhood in Brooklyn. Catch a Broadway show in the evening." :
                         "Visit Grand Central Terminal. Do some last-minute souvenir shopping or visit another museum like MoMA. Head to the airport for departure.",
              reservations: i === 0 ? "Flight DL400 arriving JFK at 4 PM. The Knickerbocker Hotel reservation confirmed (Ref: NYCKNK1). AirTrain/Subway or taxi transfer to hotel." :
                            i === 1 ? "Top of the Rock timed entry tickets booked for 10:00 AM. Consider booking ice skating at Rockefeller Center if interested (winter)." :
                            i === 2 ? "American Museum of Natural History general admission tickets purchased (timed entry may be required). Central Park exploration requires no booking." :
                            i === 3 ? "Staten Island Ferry is free, no tickets needed. 9/11 Museum timed entry tickets booked for 2:00 PM (allow 2-3 hours)." :
                            i === 4 ? "Broadway show tickets ('Hamilton') purchased for 7:00 PM performance. Consider reserving dinner near theater district." :
                            "Museum of Modern Art (MoMA) tickets can be purchased online or on site. Check flight status DL405 departing JFK at 6 PM.",
              lodging: "The Knickerbocker Hotel, 6 Times Square, New York, NY 10036, USA",
              travelTime: i === 0 ? "Approx 1-1.5 hour subway/taxi from JFK" :
                          i === 1 ? "Local subway/walking" :
                          i === 2 ? "Local subway/walking" :
                          i === 3 ? "Subway to Whitehall Terminal + Ferry (25 min each way) + subway/walking" :
                          i === 4 ? "Subway to Brooklyn + walking bridge (30-60 min walk) + subway" :
                          "Local subway/walking + 1-1.5 hour subway/taxi to JFK",
              notes: i === 0 ? "Purchase a 7-day unlimited MetroCard for easy subway/bus travel. Times Square is intense; great for photos but very crowded. Be aware of surroundings and costumed characters wanting payment for photos." :
                     i === 1 ? "Go to Top of the Rock early for fewer crowds. Rockefeller Center is especially magical during the holiday season. Dress warmly in winter." :
                     i === 2 ? "Central Park is huge; plan specific areas to visit. Major museums (Met, AMNH) can take a full day; prioritize sections or choose one. Check museum free/donation-based entry policies/times." :
                     i === 3 ? "Stand on the right side of the Staten Island Ferry going out for best Statue views. The 9/11 Museum is emotionally impactful; allow sufficient time and be respectful." :
                     i === 4 ? "Check weather before walking Brooklyn Bridge; can be cold/windy. DUMBO offers great photo opportunities. Book Broadway tickets far in advance for popular shows; check TKTS booth for same-day discounts." :
                     "Grand Central Terminal has stunning architecture and a great food court downstairs. Consider airport transfer options (subway, LIRR, taxi, ride-share) based on budget/time. Allow plenty of time for airport security."
          }
      }),
     },
     // Trip 10: Scottish Highlands Road Trip
     {
      name: "Scottish Highlands Road Trip",
      description: "Explore historic Edinburgh, drive through dramatic Highland scenery, and visit the mystical Isle of Skye.",
      isPublic: true,
      tags: ["roadtrip", "scenic", "uk", "scotland", "highlands", "castles", "nature", "history"],
      days: Array.from({length: 7}, (_, i) => {
          const date = new Date('2024-08-10');
          date.setDate(date.getDate() + i);
          const formattedDate = date.toISOString().split('T')[0];
          return {
              id: `day${i+1}`,
              date: formattedDate,
              itinerary: i === 0 ? "Arrive at Edinburgh Airport (EDI). Pick up rental car. Explore Edinburgh: walk the Royal Mile, visit Edinburgh Castle, and perhaps hike Arthur's Seat for city views." :
                         i === 1 ? "Drive north towards Inverness, stopping at Stirling Castle. Continue through Cairngorms National Park, perhaps visiting a whisky distillery near Speyside." :
                         i === 2 ? "Explore the area around Loch Ness: search for Nessie, visit Urquhart Castle ruins on the lochside. Drive towards the Isle of Skye, crossing the Skye Bridge." :
                         i === 3 ? "Explore the Isle of Skye's Trotternish Peninsula: see the Old Man of Storr, Kilt Rock, and the Quiraing landscape (hiking optional). Visit the main town of Portree." :
                         i === 4 ? "Discover more of Skye: visit Dunvegan Castle & Gardens (MacLeod clan seat), explore the Fairy Pools near Glen Brittle (requires walk), or Talisker Distillery." :
                         i === 5 ? "Drive south from Skye towards Glencoe, stopping at the iconic Eilean Donan Castle for photos. Marvel at the dramatic mountain scenery of Glencoe valley." :
                         "Drive back towards Edinburgh via Loch Lomond & The Trossachs National Park. Return rental car at EDI airport and depart.",
              reservations: i === 0 ? "Flight BA1438 arriving EDI at 10 AM. Rental car booked with Arnold Clark (Ref: EDIAC7). The Witchery by the Castle reservation confirmed (Ref: EDIWTC1)." :
                            i === 1 ? "Edinburgh Castle tickets booked online. Stirling Castle tickets booked online. Glenfiddich Distillery tour booked for 3 PM." :
                            i === 2 ? "Urquhart Castle tickets booked online. Duisdale House Hotel (Skye) reservation confirmed (Ref: SKYEDH2)." :
                            i === 3 ? "No specific reservations needed for landscapes. Dinner reservation at Scorrybreac Restaurant in Portree recommended." :
                            i === 4 ? "Dunvegan Castle tickets purchased online. Talisker Distillery tour booked for 2 PM. Fairy Pools parking may require payment." :
                            i === 5 ? "Eilean Donan Castle tickets purchased on site (mostly for exterior photos). Kingshouse Hotel (Glencoe) reservation confirmed (Ref: GLNKH3)." :
                            "Check flight status BA1451 departing EDI at 5 PM.",
              lodging: i === 0 ? "The Witchery by the Castle, Castlehill, Royal Mile, Edinburgh EH1 2NF, UK" :
                       i === 1 ? "Culloden House Hotel, Culloden Rd, Balloch, Inverness IV2 7BZ, UK" : // Near Inverness
                       i < 5 ? "Duisdale House Hotel, Sleat, Isle of Skye IV43 8QW, UK" :
                       i === 5 ? "Kingshouse Hotel, Glencoe, Ballachulish PH49 4HY, UK" :
                       "N/A - Departing",
              travelTime: i === 0 ? "30 min tram/taxi from EDI + local walking/driving" :
                          i === 1 ? "Approx 1 hr drive to Stirling + 3-4 hr drive to Inverness area (+ stops)" :
                          i === 2 ? "Approx 30 min drive to Loch Ness + 2-3 hr drive to Skye (+ stops)" :
                          i === 3 ? "Full day driving loop around Trotternish (slow roads)" :
                          i === 4 ? "Local driving on Skye (variable distances)" :
                          i === 5 ? "Approx 2-3 hr drive Skye to Glencoe (+ stops including Eilean Donan)" :
                          "Approx 3 hr drive Glencoe to EDI via Loch Lomond (+ stops)",
              notes: i === 0 ? "Book Edinburgh Castle tickets online to avoid queues. Wear comfortable shoes for walking cobblestone streets and hills. Driving is on the left side of the road." :
                     i === 1 ? "Allow ample time for Stirling Castle. Book distillery tours in advance, especially popular ones. Watch out for sheep on rural roads." :
                     i === 2 ? "Urquhart Castle offers great Loch Ness views. Skye Bridge has a toll (check current status) or consider Mallaig-Armadale ferry as alternative route. Cell service can be patchy in Highlands." :
                     i === 3 ? "Skye roads are often single-track; learn how to use passing places. Weather changes quickly; pack waterproofs and layers. Quiraing requires careful driving/hiking." :
                     i === 4 ? "Fairy Pools car park fills quickly; go early or late. Walk to pools requires crossing streams on stepping stones. Book distillery tours well ahead." :
                     i === 5 ? "Eilean Donan is best photographed from viewpoint before bridge. Take time to stop safely at viewpoints in Glencoe. Be aware of midges (tiny biting insects) especially summer evenings." :
                     "Loch Lomond offers boat trips or short walks. Allow plenty of time for the drive back to EDI, including potential traffic and car return. Check rental car fuel policy."
          }
      }),
     }
   ];
  
   // You can now use the 'trips' array which contains 10 different trip objects.
   // For example: console.log(JSON.stringify(trips, null, 2));
  
  async function createTrips() {
    for (const user of users) {
      // Create variations of each trip for the user
      const userTrips = trips.map(tripTemplate => ({
        ...tripTemplate,
        userId: user,
        fakeData: true,
        name: tripTemplate.name,
        // invitees: [users.find(u => u === 'karwande@gmail.com')].filter(Boolean),
        isPublic: true
      }));
  
      for (const trip of userTrips) {
        try {
          const response = await fetch('http://localhost:3000/api/trips', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': process.env.SESSION_COOKIE
            },
            body: JSON.stringify(trip)
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log(`Created trip ${trip.name} for ${user} with ID: ${data.tripId}`);
        } catch (error) {
          console.error(`Failed to create trip ${trip.name} for ${user}:`, error);
        }
        // break;
      }
      // break;
    }
  }
  
  createTrips().catch(console.error);