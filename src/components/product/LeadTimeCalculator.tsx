import React, { useState } from 'react';
import { Calendar, AlertTriangle, CheckCircle, Clock, MessageCircle, Info } from 'lucide-react';

interface LeadTimeCalculatorProps {
  leadTimeDays?: number;
  onDateChange?: (date: string, isUrgent: boolean) => void;
}

export const LeadTimeCalculator: React.FC<LeadTimeCalculatorProps> = ({
  leadTimeDays = 5,
  onDateChange,
}) => {
  // Compute minimum recommended date (today + leadTimeDays)
  const today = new Date();
  const recommendedDate = new Date();
  recommendedDate.setDate(today.getDate() + leadTimeDays);

  const formatDateForInput = (d: Date) => d.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(formatDateForInput(recommendedDate));

  const handleDateChange = (val: string) => {
    setSelectedDate(val);
    if (!val) return;

    const chosen = new Date(val);
    const diffTime = chosen.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isUrgent = diffDays < leadTimeDays;

    onDateChange?.(val, isUrgent);
  };

  const getStatus = () => {
    if (!selectedDate) return null;
    const chosen = new Date(selectedDate);
    const diffTime = chosen.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        type: 'invalid',
        message: 'Please choose an upcoming date.',
        isUrgent: false,
      };
    }

    if (diffDays <= 3) {
      return {
        type: 'urgent',
        badge: '⚡ High Rush Notice',
        message: `Your date is in ${diffDays} day${diffDays === 1 ? '' : 's'}. Handcrafted keepsakes require min. 4-5 days. Please message us on WhatsApp for emergency express slot confirmation!`,
        isUrgent: true,
      };
    }

    if (diffDays < leadTimeDays) {
      return {
        type: 'tight',
        badge: '⏳ Expedited Window',
        message: `Tight timeframe (${diffDays} days). We can prioritize handcrafting your piece with our rush slot.`,
        isUrgent: true,
      };
    }

    return {
      type: 'optimal',
      badge: '✓ Perfect Handcrafting Window',
      message: `Optimal timeframe (${diffDays} days). Full artistic attention, photo drafting, and tracked packaging guaranteed!`,
      isUrgent: false,
    };
  };

  const status = getStatus();

  return (
    <div className="bg-[#FCFAF9] rounded-2xl p-4 sm:p-5 border border-[#F7E6EB] space-y-3.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[#145C45] flex items-center gap-1.5 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-[#145C45]" />
          Required Delivery Date Planner
        </span>
        <span className="text-[11px] text-[#77716F]">
          Std. lead time: ~{leadTimeDays} days
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="date"
          value={selectedDate}
          min={formatDateForInput(today)}
          onChange={(e) => handleDateChange(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#E8B5C3] text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
        />

        <div className="text-xs text-[#77716F] flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-[#145C45]" />
          <span>Need it sooner?</span>
        </div>
      </div>

      {/* Dynamic Status Alert Banner */}
      {status && (
        <div
          className={`p-3 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
            status.type === 'urgent'
              ? 'bg-amber-50 text-amber-900 border border-amber-200'
              : status.type === 'tight'
              ? 'bg-amber-50 text-amber-800 border border-amber-100'
              : 'bg-[#F7E6EB] text-[#145C45] border border-[#E8B5C3]'
          }`}
        >
          <div className="flex items-start gap-2">
            {status.type === 'urgent' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-4 h-4 text-[#145C45] flex-shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold block">{status.badge}</span>
              <p className="text-[11px] leading-tight mt-0.5">{status.message}</p>
            </div>
          </div>

          {status.isUrgent && (
            <a
              href="https://wa.me/919820144552?text=Hi%20KBYK!%20I%20have%20an%20urgent%20custom%20gift%20request%20needed%20within%203-4%20days."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] whitespace-nowrap flex items-center gap-1 transition-colors self-end sm:self-auto"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Rush Slot</span>
            </a>
          )}
        </div>
      )}

      <p className="text-[10px] text-[#77716F] italic">
        * Note: Delivery dates are estimated based on courier transit times. We confirm the exact dispatch tracking upon handcraft completion.
      </p>
    </div>
  );
};
