import React from 'react';
import { Heart } from 'lucide-react';
import { InstagramIcon } from '../common/InstagramIcon';

export const InstagramShowcase: React.FC = () => {
  const posts = [
    {
      img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      caption: 'Stitching memory albums for 5th wedding anniversary celebrations ♡',
      likes: '428',
    },
    {
      img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
      caption: 'Packaging today’s blush pink celebration hampers ready for courier pickup ✨',
      likes: '392',
    },
    {
      img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      caption: 'Every single explosion box takes over 4 hours of intricate scoring and folding.',
      likes: '615',
    },
    {
      img: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
      caption: 'Preserved baby breath and eucalyptus posies that last 2+ years without wilting 🌸',
      likes: '512',
    },
    {
      img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      caption: 'Our Spotify scan code acrylic keychains have been the top favorite this month!',
      likes: '740',
    },
    {
      img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
      caption: 'Golden wax seals on deckle-edged vintage letters. Pure poetry in physical form.',
      likes: '884',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <a
            href="https://www.instagram.com/_.kbyk._/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EB] text-[#145C45] text-xs font-semibold hover:bg-[#E8B5C3] transition-colors"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>@_.kbyk._ on Instagram</span>
          </a>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#292626]">
            Follow Our Craft Journey
          </h2>
          <p className="text-sm text-[#77716F]">
            Catch daily behind-the-scenes reels, unboxing reactions, and limited custom slot announcements.
          </p>
        </div>

        {/* 6-Photo Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post, i) => (
            <a
              key={i}
              href="https://www.instagram.com/_.kbyk._/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all"
            >
              <img
                src={post.img}
                alt={post.caption}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />

              {/* Hover overlay with Instagram icon and likes */}
              <div className="absolute inset-0 bg-[#145C45]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-white text-center">
                <InstagramIcon className="w-6 h-6 mb-2" />
                <p className="text-[10px] line-clamp-2 font-medium">{post.caption}</p>
                <div className="flex items-center gap-1 text-[11px] font-bold mt-2 text-[#E8B5C3]">
                  <Heart className="w-3.5 h-3.5 fill-[#E8B5C3]" />
                  <span>{post.likes}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://www.instagram.com/_.kbyk._/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FCFAF9] hover:bg-[#F7E6EB] border border-[#E8B5C3] text-[#145C45] text-xs font-semibold transition-colors"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>DM us on Instagram for Fast Custom Queries</span>
          </a>
        </div>

      </div>
    </section>
  );
};
