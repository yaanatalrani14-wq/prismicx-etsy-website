import { Listing, Niche } from '../types';

const keywords = {
  boho: ['boho', 'bohemian', 'hippie', 'festival', 'gypsy', 'tribal'],
  celestial: ['moon', 'star', 'celestial', 'cosmic', 'galaxy', 'astrology'],
  minimalist: ['minimalist', 'simple', 'modern', 'clean', 'elegant', 'dainty'],
  vintage: ['vintage', 'retro', 'antique', 'rustic', 'classic', 'timeless'],
  crystal: ['crystal', 'gemstone', 'healing', 'spiritual', 'chakra', 'energy'],
};

const shops = ['MoonlightCreations', 'BohoBliss', 'CrystalDreams', 'VintageVibes', 'MinimalMood'];

export const niches: Niche[] = [
  { id: 'jewelry', name: 'Jewelry', path: ['Jewelry'] },
  { id: 'jewelry-necklaces', name: 'Necklaces', parent: 'jewelry', path: ['Jewelry', 'Necklaces'] },
  { id: 'jewelry-necklaces-boho', name: 'Boho Necklaces', parent: 'jewelry-necklaces', path: ['Jewelry', 'Necklaces', 'Boho'] },
  { id: 'home-decor', name: 'Home Decor', path: ['Home Decor'] },
  { id: 'home-decor-wall-art', name: 'Wall Art', parent: 'home-decor', path: ['Home Decor', 'Wall Art'] },
  { id: 'home-decor-wall-art-minimalist', name: 'Minimalist Prints', parent: 'home-decor-wall-art', path: ['Home Decor', 'Wall Art', 'Minimalist'] },
];

function generateCluster(centerX: number, centerY: number, count: number, keywordGroup: string[], basePerformance: number): Listing[] {
  const listings: Listing[] = [];
  const spread = 0.15;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * spread;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    const selectedTags = keywordGroup
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + Math.floor(Math.random() * 3));

    const performance = basePerformance + (Math.random() - 0.5) * 0.3;
    const favorites = Math.floor(performance * 200 + Math.random() * 100);
    const views = Math.floor(performance * 1000 + Math.random() * 500);

    listings.push({
      id: `listing-${Math.random().toString(36).substr(2, 9)}`,
      title: generateTitle(selectedTags),
      tags: selectedTags,
      shop: shops[Math.floor(Math.random() * shops.length)],
      performance,
      favorites,
      views,
      x,
      y,
      imageUrl: `https://images.pexels.com/photos/${1000000 + Math.floor(Math.random() * 8000000)}/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=200`,
    });
  }

  return listings;
}

function generateTitle(tags: string[]): string {
  const adjectives = ['Beautiful', 'Handmade', 'Unique', 'Artisan', 'Delicate', 'Stunning', 'Exquisite'];
  const nouns = ['Necklace', 'Pendant', 'Jewelry', 'Charm', 'Piece', 'Creation'];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const tag = tags[Math.floor(Math.random() * tags.length)];

  return `${adj} ${tag.charAt(0).toUpperCase() + tag.slice(1)} ${noun}`;
}

export function generateMockListings(): Listing[] {
  const listings: Listing[] = [];

  listings.push(...generateCluster(-0.4, 0.3, 35, keywords.boho, 0.7));
  listings.push(...generateCluster(0.2, 0.4, 28, keywords.celestial, 0.8));
  listings.push(...generateCluster(0.5, -0.2, 32, keywords.minimalist, 0.75));
  listings.push(...generateCluster(-0.3, -0.3, 25, keywords.vintage, 0.65));
  listings.push(...generateCluster(0.1, 0.0, 30, keywords.crystal, 0.72));

  const mixed = [
    ...keywords.boho.slice(0, 2),
    ...keywords.celestial.slice(0, 2),
  ];
  listings.push(...generateCluster(-0.1, 0.35, 20, mixed, 0.78));

  for (let i = 0; i < 15; i++) {
    const allKeywords = Object.values(keywords).flat();
    const randomTags = allKeywords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    listings.push({
      id: `listing-outlier-${i}`,
      title: generateTitle(randomTags),
      tags: randomTags,
      shop: shops[Math.floor(Math.random() * shops.length)],
      performance: 0.4 + Math.random() * 0.3,
      favorites: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 500),
      x: (Math.random() - 0.5) * 1.5,
      y: (Math.random() - 0.5) * 1.5,
      imageUrl: `https://images.pexels.com/photos/${1000000 + Math.floor(Math.random() * 8000000)}/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=200`,
    });
  }

  return listings;
}
