import React from 'react';
import { Check, MessageCircle, Home } from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { useAdmin } from '../context/AdminContext';

interface OrderSubmittedPageProps {
  enquiryId: string;
  onBackToHome: () => void;
  onExploreGifts: () => void;
}

export const OrderSubmittedPage: React.FC<OrderSubmittedPageProps> = ({
  enquiryId,
  onBackToHome,
}) => {
  const { enquiries } = useAdmin();
  const currentEnquiry = enquiries.find((e) => e.id === enquiryId) || enquiries[0];

  const whatsappMessage = encodeURIComponent(
    `Hi KBYK Studio! ✨ I just submitted enquiry #${enquiryId || 'KBYK-NEW'} on your website for my ${currentEnquiry?.occasion || 'celebration'}. Looking forward to discussing details!`
  );

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-12 sm:py-20 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-[#F7E6EB] shadow-2xl text-center space-y-6 animate-fade-in relative overflow-hidden">
        
        {/* Subtle decorative botanical pattern background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#F7E6EB] blur-2xl"></div>

        {/* Large Emerald Green Checkmark Circle matching Reference 10 */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-[#145C45] text-white flex items-center justify-center mx-auto shadow-xl">
          <Check className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Headline matching Reference 10 */}
        <div className="space-y-2 relative z-10">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#292626] font-normal">
            Your Enquiry has been Submitted!
          </h1>
          <p className="text-xs sm:text-sm text-[#77716F] max-w-md mx-auto">
            Thank you for reaching out! We'll get back to you within 24 hours with the details and next steps.
          </p>
        </div>

        {/* Reference Badge */}
        <div className="bg-[#FCFAF9] border border-[#E8B5C3] rounded-2xl p-4 max-w-sm mx-auto text-xs space-y-1">
          <span className="text-[#77716F] uppercase tracking-wider text-[10px] block">
            Enquiry Reference ID
          </span>
          <span className="font-mono text-base font-bold text-[#145C45] tracking-widest block">
            {enquiryId || 'KBYK-8941'}
          </span>
          <span className="text-[11px] text-[#77716F]">
            Target Delivery: {currentEnquiry?.requiredArrivalDate || 'As requested'}
          </span>
        </div>

        {/* What Happens Next Roadmap */}
        <div className="text-left bg-[#FCFAF9] p-4 sm:p-5 rounded-2xl border border-gray-100 text-xs space-y-3">
          <span className="font-bold text-[#145C45] uppercase tracking-wider block">
            What Happens Next:
          </span>
          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#E8B5C3] text-[#292626] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <p className="text-[#77716F]">Our artisan reviews your photos, dates, and theme requirements.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#E8B5C3] text-[#292626] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <p className="text-[#77716F]">We message you on WhatsApp with a digital draft preview & payment link.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#145C45] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <p className="text-[#77716F]">Once approved, we handcraft, wrap, and courier your package with tracking!</p>
            </div>
          </div>
        </div>

        {/* Action Buttons matching Reference 10: "Back to Home" & "Chat on Instagram" */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto px-7 py-3 rounded-full border border-gray-300 text-xs sm:text-sm font-semibold text-[#292626] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <a
            href="https://www.instagram.com/_.kbyk._/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#E8B5C3] text-[#292626] font-semibold text-xs sm:text-sm hover:bg-[#dfa3b4] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Chat on Instagram</span>
          </a>

          <a
            href={`https://wa.me/919820144552?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#145C45] text-white font-semibold text-xs sm:text-sm hover:bg-[#0F4534] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>WhatsApp Quick Connect</span>
          </a>
        </div>

      </div>
    </div>
  );
};
