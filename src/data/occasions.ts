export interface OccasionInfo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  badge: string;
  color: string;
  giftIdeaHighlight: string;
}

export const OCCASIONS: OccasionInfo[] = [
  {
    id: 'birthdays',
    name: 'Birthdays',
    tagline: 'Make another year unforgettable',
    description: 'Celebrate their milestone with scrapbooks loaded with nostalgic photos, custom birthday explosion boxes, and personalized keepsakes.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    badge: 'Most Popular',
    color: '#F7E6EB',
    giftIdeaHighlight: 'Memory Scrapbook or 3-Layer Explosion Box filled with inside jokes',
  },
  {
    id: 'anniversaries',
    name: 'Anniversaries',
    tagline: 'Treasuring your journey together',
    description: 'Relive every romantic chapter from the day you met. Warm ambient photo lamps, wax-sealed love letters, and couple charm bracelets.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    badge: 'Romantic',
    color: '#E8B5C3',
    giftIdeaHighlight: 'Illuminated Wooden Photo Lamp with your anniversary date',
  },
  {
    id: 'friendship',
    name: 'Friendship',
    tagline: 'For the ones who feel like home',
    description: 'Matching polaroid keychains, aesthetic desk journals, dried floral posies, and the ultimate BFF hampers to remind them how loved they are.',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    badge: 'Heartfelt',
    color: '#F7E6EB',
    giftIdeaHighlight: 'Twin matching custom keychains + Mini bouquet posy',
  },
  {
    id: 'festivals',
    name: 'Festivals',
    tagline: 'Joy, warmth & handcrafted glow',
    description: 'Elevate festive gifting beyond standard sweets with hand-poured scented candles, gold-embossed boxes, and bespoke festive hampers.',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80',
    badge: 'Seasonal',
    color: '#FCFAF9',
    giftIdeaHighlight: 'Luxury Curated Hamper Box with fairy lights & sweets',
  },
  {
    id: 'just-because',
    name: 'Just Because',
    tagline: 'No reason needed to send love',
    description: 'A surprise pick-me-up on a random Tuesday. Dainty beaded phone charms, cute polaroids, and pocket-sized keepsakes that spark instant smiles.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    badge: 'Everyday Joy',
    color: '#F7E6EB',
    giftIdeaHighlight: 'Personalised acrylic keychain or mini dried flower posy',
  },
  {
    id: 'proposals',
    name: 'Proposals',
    tagline: 'Setting the stage for forever',
    description: 'Bespoke velvet explosion boxes with a secret ring tier, deckle-edge wax sealed promises, and romantic photo albums crafted to make them cry happy tears.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    badge: 'Precious Moments',
    color: '#145C45',
    giftIdeaHighlight: '3-Layer Explosion Box with central velvet ring pedestal',
  },
];
