import React, { useState } from 'react';
import { Mail, MapPin, Send, MessageCircle, Clock, Check, Ticket, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { useSupport } from '../context/SupportContext';
import { MotionReveal } from '../components/common/MotionReveal';
import { TicketCategory } from '../types';

export const ContactPage: React.FC = () => {
  const { createTicket } = useSupport();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [category, setCategory] = useState<TicketCategory>('General Enquiry');
  const [message, setMessage] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const ticket = createTicket({
      customerName: name,
      customerEmail: email,
      customerPhone: phone || 'Not provided',
      orderId: orderId.trim() || undefined,
      category,
      priority: category === 'Delivery Delay' || category === 'Damaged Package' ? 'Urgent' : 'Normal',
      subject: `${category}: ${message.slice(0, 45)}...`,
      description: message,
    });

    setCreatedTicketId(ticket.id);
    setName('');
    setEmail('');
    setPhone('');
    setOrderId('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <MotionReveal variant="fade-up">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#145C45] uppercase tracking-wider block">
              Direct Studio Desk & Support
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#292626]">
              Let's Create Something Beautiful
            </h1>
            <p className="text-sm text-[#77716F]">
              Reach our crafting desk directly for bespoke queries, delivery date verifications, or order assistance.
            </p>
          </div>
        </MotionReveal>

        {/* Two-Column Card matching Reference 08 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Contact Channels Info Card (Reference 08) */}
          <MotionReveal variant="slide-right" className="lg:col-span-5 h-full">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-sm flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-[#145C45] mb-2">
                    Connect With Us
                  </h3>
                  <p className="text-xs sm:text-sm text-[#77716F] leading-relaxed">
                    Have a question about personalising a gift or need delivery date guidance? Reach out through any of our channels below.
                  </p>
                </div>

                {/* Channels List */}
                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/_.kbyk._/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#FCFAF9] hover:bg-[#F7E6EB] transition-colors border border-gray-100 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F7E6EB] text-[#145C45] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <InstagramIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-[#292626] block">Instagram</span>
                      <span className="text-[#145C45] font-medium text-xs">DM for quick updates @_.kbyk._</span>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:kbyk.gifts@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#FCFAF9] hover:bg-[#F7E6EB] transition-colors border border-gray-100 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F7E6EB] text-[#145C45] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-[#292626] block">Email</span>
                      <span className="text-[#145C45] font-medium text-xs">kbyk.gifts@gmail.com</span>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FCFAF9] border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-[#F7E6EB] text-[#145C45] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-[#292626] block">Location</span>
                      <span className="text-[#77716F] text-xs">Based in India | Pan-India Shipping</span>
                    </div>
                  </div>

                  {/* Timing */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FCFAF9] border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-[#F7E6EB] text-[#145C45] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-[#292626] block">Studio Crafting Hours</span>
                      <span className="text-[#77716F] text-xs">Mon - Sat: 10:00 AM – 8:00 PM IST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct pill */}
              <div className="pt-4 border-t border-gray-100">
                <a
                  href="https://wa.me/919820144552?text=Hi%20KBYK!%20I%20would%20like%20to%20connect%20regarding%20a%20gift."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-full bg-[#145C45] text-white text-xs font-semibold hover:bg-[#0F4534] transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Chat Directly on WhatsApp</span>
                </a>
              </div>
            </div>
          </MotionReveal>

          {/* Right Column: Contact Message Form */}
          <MotionReveal variant="slide-left" className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F7E6EB] shadow-xl">
              <h3 className="font-serif text-2xl font-normal text-[#292626] mb-2">
                Send a Note to Our Studio
              </h3>
              <p className="text-xs text-[#77716F] mb-6">
                Your enquiry will be assigned directly to our artisan desk with guaranteed 24h response.
              </p>

              {createdTicketId ? (
                <div className="bg-emerald-50 border border-[#145C45] p-6 rounded-2xl text-center space-y-3 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-[#145C45] text-white flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#145C45]">Ticket #{createdTicketId} Logged!</h4>
                  <p className="text-xs text-[#77716F] max-w-sm mx-auto">
                    Thank you for reaching out! Our lead craftsperson has received your enquiry and will respond via email or WhatsApp within 24 hours.
                  </p>
                  <button
                    onClick={() => setCreatedTicketId(null)}
                    className="mt-2 px-5 py-2 rounded-full bg-[#F7E6EB] text-[#145C45] text-xs font-semibold hover:bg-[#F0D5DF] transition-all"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-[#292626] block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Radhika Merchant"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF9] border border-gray-200 text-sm focus:outline-none focus:border-[#145C45]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-[#292626] block mb-1">Your Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. radhika@gmail.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF9] border border-gray-200 text-sm focus:outline-none focus:border-[#145C45]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#292626] block mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98201 44552"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF9] border border-gray-200 text-sm focus:outline-none focus:border-[#145C45]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-[#292626] block mb-1">Query Topic</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as TicketCategory)}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF9] border border-gray-200 text-sm focus:outline-none focus:border-[#145C45]"
                      >
                        <option value="General Enquiry">General Enquiry</option>
                        <option value="Personalisation Query">Personalisation Customisation</option>
                        <option value="Order Issue">Order Status</option>
                        <option value="Delivery Delay">Express / Rush Delivery</option>
                        <option value="Cancellation / Refund">Cancellation / Refund</option>
                        <option value="Damaged Package">Package Damage Claim</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-[#292626] block mb-1">Order ID (If applicable)</label>
                      <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="e.g. KBYK-8941"
                        className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF9] border border-gray-200 text-sm focus:outline-none focus:border-[#145C45]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#292626] block mb-1">Your Message / Idea *</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about the celebration, questions about custom scrapbooks, delivery deadlines, etc."
                      className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF9] border border-gray-200 text-sm focus:outline-none focus:border-[#145C45] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#145C45] text-white font-semibold text-sm hover:bg-[#0F4534] transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
                  >
                    <span>Send Message to Atelier</span>
                    <Send className="w-4 h-4 text-emerald-200" />
                  </button>
                </form>
              )}
            </div>
          </MotionReveal>

        </div>

      </div>
    </div>
  );
};
