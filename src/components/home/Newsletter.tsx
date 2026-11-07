import React, { useState } from 'react';
import { Mail, Check, Heart, Sparkles } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F7E6EB]/40 border-t border-[#F7E6EB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <div className="w-12 h-12 rounded-full bg-white text-[#145C45] flex items-center justify-center mx-auto shadow-xs border border-[#E8B5C3]">
          <Heart className="w-6 h-6 fill-[#E8B5C3] text-[#145C45]" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#292626]">
            Never Miss a Milestone
          </h2>
          <p className="text-sm text-[#77716F] max-w-md mx-auto">
            Subscribe for seasonal bespoke slot openings, secret gifting tips, and 10% off your first custom keepsake enquiry.
          </p>
        </div>

        {subscribed ? (
          <div className="bg-white border border-[#145C45] p-4 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-sm text-[#145C45] font-semibold animate-fade-in shadow-xs">
            <Check className="w-5 h-5 text-[#145C45]" />
            <span>Thank you for joining our gifting circle! Check your inbox soon.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-[#77716F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45] transition-colors shadow-2xs"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#145C45] text-white font-semibold text-sm hover:bg-[#0F4534] transition-all whitespace-nowrap shadow-xs"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-[11px] text-[#77716F]">
          We respect your privacy. No spam ever — only heartfelt stories & studio updates.
        </p>

      </div>
    </section>
  );
};
