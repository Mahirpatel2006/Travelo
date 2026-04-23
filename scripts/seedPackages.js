/**
 * scripts/seedPackages.js
 * Run once: node scripts/seedPackages.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('../src/models/Package');

const packages = [
  {
    slug: 'goa',
    name: 'Goa',
    tagline: 'Pearl of the Orient',
    description: 'India\'s smallest state packs an enormous punch — sun-drenched beaches, Portuguese heritage, world-class seafood, and a nightlife scene unlike anywhere else in the country.',
    price: 23000,
    originalPrice: 25000,
    coverImage: '/images/destinations/goa/goa-4.avif',
    images: [
      '/images/destinations/goa/goa-1.avif',
      '/images/destinations/goa/goa-2.avif',
      '/images/destinations/goa/goa-3.avif',
      '/images/destinations/goa/goa-4.avif',
    ],
    highlights: ['100+ km of pristine coastline', 'UNESCO Heritage churches', 'Vibrant carnival & nightlife', 'Fresh seafood & Goan cuisine'],
    sections: [
      { heading: 'The Beaches', body: 'From the bustling shores of Baga and Calangute to the serene sands of Palolem and Agonda, every beach has its own personality. Water sports, beach shacks, and unforgettable sunsets await.' },
      { heading: 'A Melting Pot of Cultures', body: 'Once a Portuguese colony, Goa retains a distinct European charm evident in its architecture, narrow winding streets of Old Goa, and the Basilica of Bom Jesus — a UNESCO World Heritage Site.' },
      { heading: 'Culinary Delights', body: 'Prawn balchão, fish curry rice, Goan sausage, and the layered bebinca dessert — Goa\'s food scene is a gastronomic adventure blending coconut, kokum, and exotic spices.' },
      { heading: 'Festivals & Celebrations', body: 'The Goa Carnival in February features parades and street parties. Christmas and New Year are celebrated with lights, music, and merriment across the entire state.' },
    ],
    duration: '5 Days / 4 Nights',
    bestTime: 'November – February',
    weather: '20°C – 33°C',
    location: 'West Coast, India',
  },
  {
    slug: 'manali',
    name: 'Manali',
    tagline: 'Gateway to the Himalayas',
    description: 'Cradled between snow-capped peaks and lush deodar forests, Manali is the adventure capital of the north — perfect for skiing, trekking, river rafting, and soul-healing mountain air.',
    price: 26000,
    originalPrice: 30000,
    coverImage: '/images/destinations/manali/manali-1.jpg',
    images: [
      '/images/destinations/manali/manali-1.jpg',
      '/images/destinations/manali/manali-2.jpg',
      '/images/destinations/manali/manali-3.jpg',
      '/images/destinations/manali/manali-4.jpg',
    ],
    highlights: ['Rohtang Pass snow experience', 'River rafting on Beas', 'Solang Valley cable car', 'Ancient Hadimba Temple'],
    sections: [
      { heading: 'Adventure Capital', body: 'Manali offers world-class adventure: skiing at Solang Valley in winter, white-water rafting on the Beas, paragliding, zorbing, and trekking routes that stretch into the high Himalayas.' },
      { heading: 'Rohtang Pass', body: 'At 3,978 m, Rohtang Pass is a must-visit. Snow-covered even in summer, it offers sledding, snowmobiling, and jaw-dropping views of Lahaul and Spiti valleys beyond.' },
      { heading: 'Old Manali & Vashisht', body: 'Stroll the charming lanes of Old Manali with its cafés and boutiques. Vashisht village has natural hot sulphur springs believed to have healing properties.' },
      { heading: 'Temples & Culture', body: 'The 16th-century Hadimba Devi Temple set among cedar forests is iconic. The Manu Temple and Tibetan monasteries add spiritual depth to the journey.' },
    ],
    duration: '6 Days / 5 Nights',
    bestTime: 'October – June',
    weather: '-10°C to 25°C',
    location: 'Himachal Pradesh, India',
  },
  {
    slug: 'darjeeling',
    name: 'Darjeeling',
    tagline: 'Queen of the Hills',
    description: 'Rolling tea gardens, the iconic Toy Train, and panoramic views of Kangchenjunga — Darjeeling is a timeless hill station that captivates every sense.',
    price: 25000,
    originalPrice: 28000,
    coverImage: '/images/destinations/darjeeling/darjeeling-1.avif',
    images: [
      '/images/destinations/darjeeling/darjeeling-1.avif',
      '/images/destinations/darjeeling/darjeeling-2.avif',
      '/images/destinations/darjeeling/darjeeling-3.avif',
      '/images/destinations/darjeeling/darjeeling-4.avif',
    ],
    highlights: ['UNESCO Darjeeling Toy Train', 'Tiger Hill sunrise over Kangchenjunga', 'World-famous Darjeeling tea estates', 'Batasia Loop & War Memorial'],
    sections: [
      { heading: 'Tea Gardens', body: 'Darjeeling\'s tea is world-renowned. Tour estates like Happy Valley and Makaibari, learn the artisanal process of first-flush plucking, and sip the freshest cup you\'ll ever taste.' },
      { heading: 'The Toy Train', body: 'The Darjeeling Himalayan Railway — a UNESCO World Heritage Site — chugs through breathtaking mountain scenery, looping around the famous Batasia spiral.' },
      { heading: 'Tiger Hill Sunrise', body: 'Wake at 3 AM and make the pilgrimage to Tiger Hill (2,590 m) to watch the first golden light kiss the summit of Kangchenjunga — one of the world\'s most spectacular sunrises.' },
      { heading: 'Culture & Markets', body: 'Chowrasta Mall, Tibetan Refugee Self-Help Centre, and the bustling Darjeeling market offer local crafts, woollen shawls, and authentic Tibetan artefacts.' },
    ],
    duration: '5 Days / 4 Nights',
    bestTime: 'March – May, October – December',
    weather: '5°C – 25°C',
    location: 'West Bengal, India',
  },
  {
    slug: 'varanasi',
    name: 'Varanasi',
    tagline: 'The Eternal City',
    description: 'One of the world\'s oldest continuously inhabited cities, Varanasi pulses with spiritual energy — ancient ghats, the sacred Ganges, and the mesmerizing Ganga Aarti ceremony.',
    price: 18500,
    originalPrice: 20000,
    coverImage: '/images/destinations/varanasi/varanasi-1.avif',
    images: [
      '/images/destinations/varanasi/varanasi-1.avif',
      '/images/destinations/varanasi/varanasi-2.avif',
      '/images/destinations/varanasi/varanasi-3.avif',
      '/images/destinations/varanasi/varanasi-4.jpg',
    ],
    highlights: ['84 sacred Ghats along the Ganges', 'Spectacular Ganga Aarti ceremony', 'Silk weaving & Banarasi sarees', 'Kashi Vishwanath Temple'],
    sections: [
      { heading: 'The Sacred Ghats', body: 'Varanasi has 84 ghats stretching along the Ganges. Dashashwamedh Ghat hosts the nightly Ganga Aarti; Assi Ghat is a peaceful sunset spot; Manikarnika Ghat burns 24/7 as one of Hinduism\'s holiest cremation sites.' },
      { heading: 'Sunrise Boat Ride', body: 'A boat ride at dawn on the Ganges, watching the ancient city slowly wake — priests bathing, pilgrims praying, kites circling overhead — is an experience that transcends words.' },
      { heading: 'Temples & Spirituality', body: 'Kashi Vishwanath Temple, dedicated to Lord Shiva, is one of the twelve Jyotirlingas. The Sankat Mochan Hanuman Temple and centuries-old Durga Temple are equally revered.' },
      { heading: 'Art & Cuisine', body: 'Banarasi silk sarees are woven in intricate patterns passed down through generations. Try thandai, kachori sabzi, chaat at Kashi Chat Bhandar, and the famous Banarasi paan.' },
    ],
    duration: '4 Days / 3 Nights',
    bestTime: 'October – March',
    weather: '5°C – 35°C',
    location: 'Uttar Pradesh, India',
  },
  {
    slug: 'ooty',
    name: 'Ooty',
    tagline: 'Queen of Hill Stations',
    description: 'Nestled in the Nilgiri Hills, Ooty enchants visitors with its emerald tea plantations, colonial-era botanical gardens, tranquil lakes, and the charming Nilgiri Mountain Railway.',
    price: 24000,
    originalPrice: 26000,
    coverImage: '/images/destinations/ooty/ooty-1.avif',
    images: [
      '/images/destinations/ooty/ooty-1.avif',
      '/images/destinations/ooty/ooty-3.avif',
      '/images/destinations/ooty/ooty-4.webp',
      '/images/destinations/ooty/ooty-5.avif',
    ],
    highlights: ['UNESCO Nilgiri Mountain Railway', 'Government Botanical Gardens', 'Ooty Lake boat rides', 'Doddabetta Peak at 2,637 m'],
    sections: [
      { heading: 'Tea Estates & Doddabetta', body: 'Rolling tea gardens carpet the Nilgiri slopes. Doddabetta Peak (2,637 m), the highest point in the Nilgiris, offers a 360° panoramic view on clear days.' },
      { heading: 'Nilgiri Mountain Railway', body: 'The UNESCO-listed Blue Mountain Train winds through tunnels, bridges, and dense forests between Mettupalayam and Ooty — one of India\'s most scenic rail journeys.' },
      { heading: 'Gardens & Lakes', body: 'The Government Botanical Gardens (155 years old) and the serene Ooty Lake for boating are must-visits. Pykara Falls and Rose Garden add to the natural splendour.' },
      { heading: 'Tribal Culture', body: 'The indigenous Toda tribe inhabit the Nilgiri plateau, maintaining ancient customs, distinctive embroidery, and barrel-shaped stone temples unlike anything else in India.' },
    ],
    duration: '5 Days / 4 Nights',
    bestTime: 'April – June, September – November',
    weather: '5°C – 25°C',
    location: 'Tamil Nadu, India',
  },
  {
    slug: 'udaipur',
    name: 'Udaipur',
    tagline: 'City of Lakes',
    description: 'Often dubbed the "Venice of the East," Udaipur is a fairy-tale city of shimmering lakes, magnificent palaces rising from the water, and a Rajput heritage that takes your breath away.',
    price: 15000,
    originalPrice: 20000,
    coverImage: '/images/destinations/udaipur/udaipur-1.avif',
    images: [
      '/images/destinations/udaipur/udaipur-1.avif',
      '/images/destinations/udaipur/udaipur-2.avif',
      '/images/destinations/udaipur/udaipur-3.avif',
      '/images/destinations/udaipur/eklingji.webp',
    ],
    highlights: ['City Palace & Lake Pichola boat ride', 'Taj Lake Palace floating on water', 'Kumbhalgarh Fort & Great Wall of India', 'Eklingji & Nathdwara temples'],
    sections: [
      { heading: 'City Palace & Lake Pichola', body: 'The City Palace complex, spanning the eastern shore of Lake Pichola, is among Rajasthan\'s grandest royal structures. A sunset boat ride on the lake, with the Jag Mandir rising from the water, is magical.' },
      { heading: 'Kumbhalgarh Fort', body: 'The 36 km-long walls of Kumbhalgarh Fort — second only to the Great Wall of China — snake across the Aravalli Hills. The hilltop fort encloses 360 temples and commands sweeping valley views.' },
      { heading: 'Saheliyon-ki-Bari & Jagdish Temple', body: 'The "Garden of the Maidens" was built by Maharana Sangram Singh for royal ladies — elegant fountains, marble pavilions, and lotus pools. The 17th-century Jagdish Temple is a masterpiece of Indo-Aryan architecture.' },
      { heading: 'Mewar Cuisine & Crafts', body: 'Dal baati churma, gatte ki sabzi, and laal maas define Mewar cuisine. The city\'s artisans produce fine miniature paintings, blue pottery, and the famous silver thewa jewellery.' },
    ],
    duration: '4 Days / 3 Nights',
    bestTime: 'September – March',
    weather: '5°C – 35°C',
    location: 'Rajasthan, India',
  },
];

async function seed() {
  await mongoose.connect(process.env.DB_URI);
  console.log('DB connected');

  for (const pkg of packages) {
    await Package.findOneAndUpdate(
      { slug: pkg.slug },
      pkg,
      { upsert: true, new: true }
    );
    console.log(`✓ Upserted: ${pkg.name}`);
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
