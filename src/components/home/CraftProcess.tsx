import React from 'react';
import { Camera, Scissors, Flower2, Gift, Send, Sparkles } from 'lucide-react';
import { MotionReveal } from '../common/MotionReveal';

export const CraftProcess: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Camera,
      title: 'Your Story & Photos',
      description: 'You share your favorite memories, personal dates, milestones, and inside jokes.',
    },
    {
      num: '02',
      icon: Flower2,
      title: 'Artisan Materials',
      description: 'We select hand-pressed botanicals, 300 GSM kraft cardstock, and silk ribbons.',
    },
    {
      num: '03',
      icon: Scissors,
      title: 'Dedicated Handcrafting',
      description: 'Every pull-tab, flip pocket, and foil inscription is individually assembled by hand.',
    },
    {
      num: '04',
      icon: Gift,
      title: 'Luxury Wax-Seal Packaging',
      description: 'Sealed with hot metallic wax and nestled in blush tissue ready for the unboxing gasp.',
    },
    {
      num: '05',
      icon: Send,
      title: 'Pan-India Delivery',
      description: 'Safely packaged in rigid courier boxes and delivered directly to their doorstep.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FCFAF9] border-t border-[#F7E6EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <MotionReveal direction="up" className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7E6EB] text-[#145C45] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Behind the Studio Curtain</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#292626]">
            How Your Gift Comes to Life
          </h2>
          <p className="text-sm text-[#77716F]">
            We do not mass produce anything. Every single creation takes hours of patience, care, and heartfelt attention.
          </p>
        </MotionReveal>

        {/* 5-Step Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <MotionReveal
                key={idx}
                direction="up"
                delay={idx * 90}
                className="relative bg-white rounded-2xl p-6 border border-[#F7E6EB] hover:border-[#E8B5C3] card-luxury transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-[#E8B5C3] group-hover:text-[#145C45] transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#F7E6EB] text-[#145C45] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-[#292626] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#77716F] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-1 text-[11px] font-semibold text-[#145C45]">
                  <span>Craft step {step.num} of 05</span>
                </div>
              </MotionReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
