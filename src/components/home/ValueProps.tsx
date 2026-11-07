import React from 'react';
import { Heart, Sparkles, Award, Gift, Truck } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const props = [
    {
      icon: Heart,
      title: 'Handmade With Love',
      subtitle: 'Every piece carefully handcrafted',
    },
    {
      icon: Sparkles,
      title: 'Personalised Just for You',
      subtitle: 'Your memories, names & dates',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      subtitle: '300+ GSM boards & preserved florals',
    },
    {
      icon: Gift,
      title: 'Thoughtful Packaging',
      subtitle: 'Wax seal and satin ribbon tied',
    },
    {
      icon: Truck,
      title: 'Pan-India Delivery',
      subtitle: 'Safe, tracked doorstep transit',
    },
  ];

  return (
    <section className="border-y border-[#F7E6EB] bg-white py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4 items-center">
          {props.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 p-2 rounded-xl hover:bg-[#FCFAF9] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#F7E6EB] text-[#145C45] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#292626]">
                    {prop.title}
                  </h4>
                  <p className="text-[11px] text-[#77716F] leading-tight mt-0.5">
                    {prop.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
