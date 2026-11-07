export interface FaqItem {
  id: string;
  category: 'Ordering' | 'Shipping' | 'Personalisation' | 'Urgent & Policies';
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Ordering',
    question: 'How do I place a custom order?',
    answer: 'You can browse our curated gifts, choose your preferred themes and add-ons, or visit our "Custom Order" page to describe your bespoke idea. Submit your enquiry with your required date and reference photos. We will reach out on WhatsApp/Instagram within 24 hours to confirm the draft design and start handcrafting!',
  },
  {
    id: 'faq-2',
    category: 'Shipping',
    question: 'How long does it take to deliver?',
    answer: 'Since each keepsake is handmade with love and precision, standard handcrafting takes 3 to 5 business days. Once dispatched, domestic courier takes 2 to 4 business days depending on your city. We recommend placing orders 7-10 days before your special occasion.',
  },
  {
    id: 'faq-3',
    category: 'Shipping',
    question: 'Do you ship pan-India?',
    answer: 'Yes! We ship all across India — covering all major metro cities (Mumbai, Bangalore, Delhi NCR, Pune, Kolkata, Chennai, Hyderabad) as well as tier 2 and tier 3 towns. All packages are bubble-wrapped securely in rigid boxes to prevent any transit damage.',
  },
  {
    id: 'faq-4',
    category: 'Personalisation',
    question: 'Can I request specific themes or colours?',
    answer: 'Absolutely! Personalisation is the soul of KBYK. You can choose from our popular palettes (Soft Blush, Deep Emerald, Kraft Vintage, Lavender Mist) or let us know your loved one’s favorite colors during checkout or in your enquiry.',
  },
  {
    id: 'faq-5',
    category: 'Ordering',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking, and Debit/Credit Cards. For custom bespoke orders, we request an initial 50% deposit before crafting begins, with the balance upon completion photos.',
  },
  {
    id: 'faq-6',
    category: 'Urgent & Policies',
    question: 'Can I make urgent orders?',
    answer: 'Yes, we accept rush orders depending on current studio slots. If your date is less than 4 days away, select the "Urgent Rush" option in our delivery planner or DM us directly on Instagram @_.kbyk._. An express crafting fee of ₹150–₹250 may apply.',
  },
  {
    id: 'faq-7',
    category: 'Personalisation',
    question: 'Do you offer gift wrapping?',
    answer: 'Every single KBYK order arrives pre-gift-ready in aesthetic blush tissue, hand-tied ribbon, and a wax-sealed envelope tag. You can also upgrade to our Luxury Keepsake Velvet Box with dried floral sprinkles for an extra-special unboxing experience.',
  },
  {
    id: 'faq-8',
    category: 'Ordering',
    question: 'What if I have more questions?',
    answer: 'We are always happy to chat! DM us anytime on Instagram @_.kbyk._ or email kbyk.gifts@gmail.com. You can also use our direct WhatsApp chat button at the bottom of any page.',
  },
];
