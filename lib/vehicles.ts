export type VehicleType = 'Berline' | 'SUV' | '4x4' | 'Luxe' | 'Économique';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  pricePerDay: number;
  seats: number;
  transmission: string;
  fuel: string;
  image: string;
  gallery: string[];
  description: string;
  available: boolean;
  tags?: string[];
}

export const vehicles: Vehicle[] = [
  {
    id: 'mercedes-glc',
    name: 'Mercedes GLC 300',
    type: 'Luxe',
    pricePerDay: 175,
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    image: 'https://images.unsplash.com/photo-1549921296-3bfa6a1f4bf8?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80'
    ],
    description: 'Confort premium, espace généreux et design moderne pour vos déplacements officiels ou privés à Douala.',
    available: true,
    tags: ['Sièges massants', 'Climatisation Multizone']
  },
  {
    id: 'toyota-rav4',
    name: 'Toyota RAV4 Hybrid',
    type: 'SUV',
    pricePerDay: 115,
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Hybride',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511323508556-1066590ede3a?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1512089747450-08b3f5a2c3c2?auto=format&fit=crop&w=1400&q=80'
    ],
    description: 'SUV fiable, spacieux et idéal pour les familles et les trajets à Douala avec style et sérénité.',
    available: true,
    tags: ['Hybride économique', 'Spacieux']
  },
  {
    id: 'hyundai-accent',
    name: 'Hyundai Accent',
    type: 'Économique',
    pricePerDay: 55,
    seats: 5,
    transmission: 'Manuelle',
    fuel: 'Essence',
    image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80'
    ],
    description: 'Solution économique, compacte et idéale pour se déplacer facilement dans Douala et ses environs.',
    available: true,
    tags: ['Climatisation renforcée', 'Idéal trafic urbain']
  },
  {
    id: 'toyota-landcruiser',
    name: 'Toyota Land Cruiser',
    type: '4x4',
    pricePerDay: 190,
    seats: 7,
    transmission: 'Automatique',
    fuel: 'Diesel',
    image: 'https://images.unsplash.com/photo-1542232178-4d79fa3ef155?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1518146517052-7b54b23d3ff3?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80'
    ],
    description: '4x4 robuste pour les routes du Cameroun, voyages d’affaires ou escapades en famille en toute confiance.',
    available: true,
    tags: ['Routes non bitumées', 'Suspensions renforcées']
  },
  {
    id: 'bmw-5-series',
    name: 'BMW Série 5',
    type: 'Berline',
    pricePerDay: 150,
    seats: 5,
    transmission: 'Automatique',
    fuel: 'Essence',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1449057528837-7cf2110d1cf6?auto=format&fit=crop&w=1400&q=80'
    ],
    description: 'Berline élégante pour une route confortable et un service haut de gamme à Douala.',
    available: true,
    tags: ['Sièges Cuir', 'Insonorisation premium']
  }
];
