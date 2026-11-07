import React from 'react';
import { OCCASIONS } from '../../data/occasions';
import { ArrowRight } from 'lucide-react';
import { MotionReveal } from '../common/MotionReveal';

interface OccasionGridProps {
  onSelectOccasion: (name: string) => void;
}

export const OccasionGrid: React.FC<OccasionGridProps> = ({ onSelectOccasion }) => {
  return (
    <section className="py-14 sm:py-20 bg-[#FCFAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <MotionReveal direction="up" className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#145C45]">
            Curated For Every Milestone
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#292626]">
            Shop by Occasion
          </h2>
          <p className="text-sm text-[#77716F]">
            From heartfelt birthday surprises to eternal wedding keepsakes, find the perfect handmade gift crafted for their special day.
          </p>
        </MotionReveal>

        {/* Occasions Circles Grid matching Reference 01 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {OCCASIONS.map((occ, idx) => (
            <MotionReveal
              key={occ.id}
              direction="scale"
              delay={idx * 70}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                onClick={() => onSelectOccasion(occ.name)}
                className="w-full flex flex-col items-center"
              >
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1.5 border-2 border-[#E8B5C3] group-hover:border-[#145C45] transition-colors duration-300 transform group-hover:-translate-y-1.5 duration-400">
                  <div className="w-full h-full rounded-full overflow-hidden shadow-sm">
                    <img
                      src={occ.image}
                      alt={occ.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Subtle hover glow badge */}
                  <div className="absolute inset-0 rounded-full bg-[#145C45]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white drop-shadow-md" />
                  </div>
                </div>

                <h3 className="mt-3 text-sm sm:text-base font-semibold text-[#292626] group-hover:text-[#145C45] transition-colors text-center">
                  {occ.name}
                </h3>
                <span className="text-[11px] text-[#77716F] text-center">
                  {occ.badge}
                </span>
              </div>
            </MotionReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
