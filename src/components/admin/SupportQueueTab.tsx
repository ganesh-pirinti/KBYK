import React, { useState } from 'react';
import { useSupport } from '../../context/SupportContext';
import { SupportTicket, TicketStatus, TicketPriority } from '../../types';
import { 
  MessageSquare, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  X,
  Phone,
  Mail,
  Package
} from 'lucide-react';

export const SupportQueueTab: React.FC = () => {
  const { tickets, replyTicket, updateTicketStatus } = useSupport();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyInput, setReplyInput] = useState('');

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesSearch =
      searchQuery === '' ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.orderId && t.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyInput.trim()) return;
    replyTicket(selectedTicket.id, replyInput.trim(), 'artisan');
    
    // Refresh selected ticket in local state
    setSelectedTicket({
      ...selectedTicket,
      status: 'In Progress',
      messages: [
        ...selectedTicket.messages,
        {
          id: `msg-${Date.now()}`,
          sender: 'artisan',
          text: replyInput.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    });
    setReplyInput('');
  };

  const getPriorityBadge = (p: TicketPriority) => {
    switch (p) {
      case 'Urgent':
        return 'bg-red-950/70 text-red-300 border-red-800';
      case 'Normal':
        return 'bg-blue-950/70 text-blue-300 border-blue-800';
      case 'Low':
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C3532] pb-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            Customer Support & Resolution Queue
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Resolve delivery queries, photo replacement inquiries, and after-sales support tickets.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, customer, order #..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101413] border border-[#2C3532] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl border transition-colors ${
              statusFilter === st
                ? 'bg-[#145C45] border-emerald-500 text-white shadow-xs'
                : 'bg-[#161B19] border-[#2C3532] text-gray-400 hover:text-white'
            }`}
          >
            {st} ({st === 'All' ? tickets.length : tickets.filter((t) => t.status === st).length})
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => setSelectedTicket(ticket)}
            className="bg-[#161B19] rounded-2xl p-5 border border-[#2C3532] hover:border-emerald-600 transition-all hover:shadow-md cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-[#101413] px-2 py-0.5 rounded border border-[#2C3532]">
                  {ticket.id}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(ticket.priority)}`}>
                  {ticket.priority} Priority
                </span>
                <span className="text-[11px] font-semibold text-gray-400 bg-[#101413] px-2 py-0.5 rounded">
                  {ticket.category}
                </span>
                {ticket.orderId && (
                  <span className="text-[11px] text-gray-400 font-mono">
                    Order: {ticket.orderId}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-base font-bold text-white">
                {ticket.subject}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-1">
                {ticket.messages[ticket.messages.length - 1]?.text}
              </p>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              <div className="text-right text-xs">
                <span className="text-gray-300 font-medium block">{ticket.customerName}</span>
                <span className="text-[11px] text-gray-500">{ticket.createdAt}</span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  ticket.status === 'Open'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : ticket.status === 'In Progress'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {ticket.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Response Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#161B19] rounded-3xl border border-[#2C3532] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2C3532] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {selectedTicket.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mt-1">
                  {selectedTicket.subject}
                </h3>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#2A3330]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Ribbon */}
            <div className="p-3 bg-[#101413] rounded-2xl border border-[#2C3532] flex flex-wrap items-center justify-between gap-3 text-xs text-gray-300">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <strong>{selectedTicket.customerName}</strong>
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                {selectedTicket.customerPhone}
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <Mail className="w-3.5 h-3.5" />
                {selectedTicket.customerEmail}
              </span>
            </div>

            {/* Message Thread */}
            <div className="space-y-3 max-h-64 overflow-y-auto p-1">
              {selectedTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                    m.sender === 'artisan'
                      ? 'bg-[#145C45]/30 border border-emerald-800 ml-6 text-emerald-100'
                      : 'bg-[#101413] border border-[#2C3532] mr-6 text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                    <span>{m.sender === 'artisan' ? 'KBYK Studio Artisan' : selectedTicket.customerName}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Composer */}
            <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-[#2C3532]">
              <textarea
                rows={3}
                required
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Type your studio response to the customer..."
                className="w-full px-4 py-3 rounded-2xl bg-[#101413] border border-[#2C3532] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Mark Status:</span>
                  <select
                    value={selectedTicket.status}
                    onChange={(e: any) => {
                      updateTicketStatus(selectedTicket.id, e.target.value);
                      setSelectedTicket({ ...selectedTicket, status: e.target.value });
                    }}
                    className="px-2 py-1 bg-[#101413] border border-[#2C3532] rounded-lg text-xs text-white"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#145C45] hover:bg-[#0F4534] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Studio Reply</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
