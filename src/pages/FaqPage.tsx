import React, { useState } from 'react';
import { FAQS } from '../data/faqs';
import { ChevronDown, MessageCircle, HelpCircle, Sparkles, Search, X } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Ordering', 'Shipping', 'Personalisation', 'Urgent & Policies'];

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header matching Reference 07 */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#145C45] uppercase tracking-wider block">
            Common Inquiries
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#292626]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[#77716F]">
            Everything you need to know about our handcrafted keepsakes and ordering process.
          </p>
        </div>

        {/* Search Bar & Category Filter */}
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#77716F] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a question (e.g. deliver, payment, urgent)..."
              className="w-full pl-10 pr-10 py-3 rounded-full bg-white border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#145C45] text-white font-semibold'
                    : 'bg-white text-[#77716F] hover:bg-[#F7E6EB] border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Layout matching Reference 07 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Accordion List matching Reference 07 */}
          <div className="lg:col-span-7 space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-[#F7E6EB] overflow-hidden shadow-2xs transition-all hover:border-[#E8B5C3]"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-medium text-[#292626] hover:text-[#145C45] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#145C45] flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#77716F] leading-relaxed border-t border-gray-50 animate-fade-in">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Aesthetic Card matching Reference 07 ("Every Gift Tells A Story") */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white group">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
                alt="Every Gift Tells a Story"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Editorial Card Overlay matching Reference 07 */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8B5C3]">
                  The KBYK Philosophy
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium">
                  Every Gift Tells A Story
                </h3>
                <p className="text-xs text-emerald-100 font-light leading-relaxed">
                  Have an idea not covered in our FAQs? Talk directly with our artisan. We reply within a few hours!
                </p>

                <div className="pt-2">
                  <a
                    href="https://wa.me/919820144552?text=Hi%20KBYK!%20I%20have%20a%20question%20about%20your%20custom%20gifts."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8B5C3] text-[#292626] font-semibold text-xs hover:bg-[#F7E6EB] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
