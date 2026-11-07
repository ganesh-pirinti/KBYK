import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportTicket, TicketCategory, TicketPriority } from '../types';

interface SupportContextType {
  tickets: SupportTicket[];
  createTicket: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderId?: string;
    category: TicketCategory;
    priority: TicketPriority;
    subject: string;
    description: string;
  }) => SupportTicket;
  replyTicket: (ticketId: string, text: string, sender: 'customer' | 'artisan') => void;
  updateTicketStatus: (ticketId: string, status: 'Open' | 'In Progress' | 'Resolved') => void;
}

const SUPPORT_STORAGE_KEY = 'kbyk_support_tickets_v1';

const defaultTickets: SupportTicket[] = [
  {
    id: 'TICK-902',
    customerName: 'Rohit Malhotra',
    customerEmail: 'rohit.m@example.com',
    customerPhone: '+91 99304 12893',
    orderId: 'KBYK-8935',
    category: 'Personalisation Query',
    priority: 'Urgent',
    subject: 'Request to swap 2 polaroid photos in Anniversary Explosion Box',
    status: 'In Progress',
    createdAt: '2026-10-28 11:30 AM',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        text: 'Hi team, I just sent 2 replacement high-resolution photos via email. Could you please confirm if they can be swapped before the inner layer is assembled?',
        timestamp: '11:30 AM',
      },
      {
        id: 'msg-2',
        sender: 'artisan',
        text: 'Hello Rohit! Yes, our artisan is currently crafting the base box. We received the two new photos and replaced them in your layout draft. All set!',
        timestamp: '11:45 AM',
      },
    ],
  },
  {
    id: 'TICK-899',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.s@example.com',
    customerPhone: '+91 98201 44552',
    orderId: 'KBYK-8941',
    category: 'Delivery Delay',
    priority: 'Normal',
    subject: 'Confirm courier dispatch date for Bandra delivery',
    status: 'Resolved',
    createdAt: '2026-10-27 04:15 PM',
    messages: [
      {
        id: 'msg-3',
        sender: 'customer',
        text: 'Hello, need to ensure this reaches before Friday evening for my sister’s birthday.',
        timestamp: '04:15 PM',
      },
      {
        id: 'msg-4',
        sender: 'artisan',
        text: 'Hi Priya, your hamper was dispatched via Bluedart Express today with tracking #BD-449120. Scheduled for delivery Thursday noon.',
        timestamp: '05:00 PM',
      },
    ],
  },
];

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const stored = localStorage.getItem(SUPPORT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultTickets;
    } catch {
      return defaultTickets;
    }
  });

  useEffect(() => {
    localStorage.setItem(SUPPORT_STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  const createTicket = (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderId?: string;
    category: TicketCategory;
    priority: TicketPriority;
    subject: string;
    description: string;
  }): SupportTicket => {
    const newTicket: SupportTicket = {
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      orderId: data.orderId,
      category: data.category,
      priority: data.priority,
      subject: data.subject,
      status: 'Open',
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          text: data.description,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    return newTicket;
  };

  const replyTicket = (ticketId: string, text: string, sender: 'customer' | 'artisan') => {
    setTickets(
      tickets.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...t,
            messages: [...t.messages, newMsg],
            status: sender === 'artisan' && t.status === 'Open' ? 'In Progress' : t.status,
          };
        }
        return t;
      })
    );
  };

  const updateTicketStatus = (ticketId: string, status: 'Open' | 'In Progress' | 'Resolved') => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status } : t)));
  };

  return (
    <SupportContext.Provider
      value={{
        tickets,
        createTicket,
        replyTicket,
        updateTicketStatus,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport must be used within SupportProvider');
  }
  return context;
};
