import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  Send, 
  Heart, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  HelpCircle, 
  Gift, 
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import { Product, AiChatMessage } from '../types';
import { PRODUCTS } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface AiFinderPageProps {
  initialPrompt?: string;
  onSelectProduct: (productId: string) => void;
  onNavigateCustomOrder: () => void;
}

export const AiFinderPage: React.FC<AiFinderPageProps> = ({
  initialPrompt = '',
  onSelectProduct,
  onNavigateCustomOrder,
}) => {
  const [inputText, setInputText] = useState(initialPrompt);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: "Hello! I am KBYK's intelligent gift concierge. ✨ Tell me who you're surprising, the occasion, and your budget (e.g. “Find a birthday gift for my best friend under ₹1,000”), and I will hand-match the most meaningful keepsakes for you.",
      timestamp: 'Just now',
      suggestedFollowUps: [
        'Birthday gift under ₹1,000',
        'A meaningful gift for my best friend',
        'Romantic anniversary keepsake with photos',
        'Cute desk decor for sister under ₹700',
      ],
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (messages.length > 1) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleUserSubmission(initialPrompt);
    }
  }, [initialPrompt]);

  // Voice handler
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsListening(true);
      setVoiceNotice('Listening to your voice... (Simulation)');
      const simulatedResponses = [
        'Birthday gift for my best friend under 1000 rupees. Something personal and aesthetic.',
        'Romantic anniversary keepsake with polaroids for my partner under 1500.',
        'A cute handmade keepsake gift for my sister graduation.',
      ];
      const selected = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
      setTimeout(() => {
        setIsListening(false);
        setVoiceNotice(null);
        setInputText(selected);
        handleUserSubmission(selected);
      }, 2400);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('Listening... Speak your gift request now');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setVoiceNotice(null);
        setInputText(transcript);
        handleUserSubmission(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('Microphone unavailable or voice unclear. Please type below.');
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Please type your response in the box below.');
    }
  };

  // Intelligent client-side matching engine
  const analyzeQuery = (query: string) => {
    const q = query.toLowerCase();

    // Extract budget
    let budget = 'Flexible';
    let maxPrice = 99999;
    if (q.includes('500') || q.includes('under 500')) {
      budget = 'Under ₹500';
      maxPrice = 500;
    } else if (q.includes('1000') || q.includes('1,000') || q.includes('under 1000') || q.includes('under 1,000')) {
      budget = 'Under ₹1,000';
      maxPrice = 1000;
    } else if (q.includes('1500') || q.includes('1,500') || q.includes('under 1500')) {
      budget = 'Under ₹1,500';
      maxPrice = 1500;
    } else if (q.includes('2000') || q.includes('2,000')) {
      budget = 'Under ₹2,000';
      maxPrice = 2000;
    }

    // Extract occasion
    let occasion = 'Any Celebration';
    if (q.includes('birthday')) occasion = 'Birthday';
    else if (q.includes('anniversary')) occasion = 'Anniversary';
    else if (q.includes('friend') || q.includes('bestie') || q.includes('bff')) occasion = 'Friendship';
    else if (q.includes('proposal') || q.includes('marry')) occasion = 'Proposal';
    else if (q.includes('festival') || q.includes('diwali') || q.includes('christmas')) occasion = 'Festival';

    // Extract recipient
    let recipient = 'Special Someone';
    if (q.includes('best friend') || q.includes('friend') || q.includes('bestie')) recipient = 'Best Friend';
    else if (q.includes('partner') || q.includes('boyfriend') || q.includes('girlfriend') || q.includes('husband') || q.includes('wife')) recipient = 'Partner / Soulmate';
    else if (q.includes('sister')) recipient = 'Sister';
    else if (q.includes('brother')) recipient = 'Brother';
    else if (q.includes('mom') || q.includes('mother') || q.includes('dad') || q.includes('parents')) recipient = 'Parents';

    // Extract style / vibe
    let style = 'Aesthetic & Sentimental';
    if (q.includes('photo') || q.includes('picture') || q.includes('polaroid')) style = 'Photo Memory Keepsake';
    else if (q.includes('lamp') || q.includes('light')) style = 'Ambient & Warm Glow';
    else if (q.includes('flower') || q.includes('bouquet')) style = 'Botanical & Floral';
    else if (q.includes('jewel') || q.includes('bracelet') || q.includes('chain')) style = 'Dainty Accessories';

    // Score products
    const scoredProducts = PRODUCTS.map((prod) => {
      let score = 0;
      let reasons: string[] = [];

      if (prod.price <= maxPrice) {
        score += 3;
        reasons.push(`Priced comfortably at ₹${prod.price} (within ${budget})`);
      } else {
        score -= 2;
      }

      if (occasion !== 'Any Celebration') {
        const matchesOccasion = prod.occasions.some((o) => o.toLowerCase().includes(occasion.toLowerCase()));
        if (matchesOccasion) {
          score += 4;
          reasons.push(`Designed specifically for ${occasion} celebrations`);
        }
      }

      if (recipient === 'Best Friend' && (prod.id === 'kbyk-01' || prod.id === 'kbyk-06' || prod.id === 'kbyk-12' || prod.id === 'kbyk-09')) {
        score += 4;
        reasons.push('Features matching duo options and photo slots beloved by best friends');
      }

      if ((recipient === 'Partner / Soulmate' || occasion === 'Anniversary') && (prod.id === 'kbyk-01' || prod.id === 'kbyk-03' || prod.id === 'kbyk-07' || prod.id === 'kbyk-10')) {
        score += 5;
        reasons.push('Deeply romantic aesthetic with custom date engraving & polaroid slots');
      }

      if (q.includes('aesthetic') || q.includes('cute')) {
        score += 2;
        reasons.push('Handmade with signature blush kraft cardstock & dried botanical petals');
      }

      return {
        product: prod,
        score,
        reason: reasons.length > 0 ? reasons.join(' • ') : 'Handcrafted keepsake with custom options',
      };
    });

    // Sort by score
    scoredProducts.sort((a, b) => b.score - a.score);
    const topMatches = scoredProducts.slice(0, 3).filter((sp) => sp.score > 0);

    const reasoningMap: Record<string, string> = {};
    topMatches.forEach((m) => {
      reasoningMap[m.product.id] = m.reason;
    });

    return {
      extractedPreferences: {
        occasion,
        recipient,
        budget,
        style,
        personalisation: 'Photos, Name & Notes',
      },
      recommendedProductIds: topMatches.map((m) => m.product.id),
      reasoningMap,
    };
  };

  const handleUserSubmission = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate AI thinking and analyzing
    setTimeout(() => {
      const analysis = analyzeQuery(textToSend);
      
      let aiReplyText = `I analyzed your request and extracted your key gifting preferences! Based on your target budget of ${analysis.extractedPreferences.budget} and ${analysis.extractedPreferences.occasion} vibe, here are the top handcrafted keepsakes that will create a lasting impression:`;
      
      if (analysis.recommendedProductIds.length === 0) {
        aiReplyText = `I couldn't find a standard catalog item matching those exact criteria. However, because KBYK is a bespoke studio, we can handcraft a custom order to fit your exact vision and budget!`;
      }

      const aiResponse: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: 'Just now',
        extractedPreferences: analysis.extractedPreferences,
        recommendedProductIds: analysis.recommendedProductIds,
        reasoningMap: analysis.reasoningMap,
        suggestedFollowUps: [
          'What is the delivery time?',
          'Can I add photos to this?',
          'Show me gifts under ₹500',
          'I want a custom surprise box',
        ],
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 800);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-init-reset',
        sender: 'ai',
        text: "Chat refreshed! ✨ What would you like to explore next? Tell me your budget, occasion, or who the gift is for.",
        timestamp: 'Just now',
        suggestedFollowUps: [
          'Birthday gift under ₹1,000',
          'Romantic 1st anniversary keepsake',
          'Mini gifts under ₹500',
        ],
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F7E6EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#145C45] text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#292626] flex items-center gap-2">
                AI Gift Finder
                <span className="text-xs bg-[#F7E6EB] text-[#145C45] px-2 py-0.5 rounded-full font-semibold font-sans">
                  Demo Prototype
                </span>
              </h1>
              <p className="text-xs text-[#77716F]">
                Conversational discovery grounded in authentic KBYK handcrafted gifts.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="text-xs text-[#77716F] hover:text-[#145C45] flex items-center gap-1 p-2 rounded-xl hover:bg-[#F7E6EB] transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Start Over</span>
          </button>
        </div>

        {/* Chat History Box */}
        <div className="bg-white rounded-3xl border border-[#F7E6EB] shadow-xl overflow-hidden flex flex-col h-[70vh]">
          
          {/* Scrollable messages container */}
          <div ref={chatContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                
                {/* Message Bubble */}
                <div
                  className={`flex items-start gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-[#145C45] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#145C45] text-white rounded-tr-none'
                        : 'bg-[#FCFAF9] text-[#292626] border border-[#F7E6EB] rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[10px] block mt-1.5 ${
                        msg.sender === 'user' ? 'text-emerald-200' : 'text-[#77716F]'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {/* Extracted Preferences Chips (if AI response) */}
                {msg.extractedPreferences && (
                  <div className="ml-11 bg-[#F7E6EB]/50 border border-[#E8B5C3] p-3 rounded-2xl max-w-lg space-y-1.5 text-xs animate-fade-in">
                    <span className="font-semibold text-[#145C45] text-[11px] uppercase tracking-wider block">
                      Extracted Customer Preferences:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E8B5C3] text-[11px] text-[#292626]">
                        Occasion: <strong>{msg.extractedPreferences.occasion}</strong>
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E8B5C3] text-[11px] text-[#292626]">
                        Recipient: <strong>{msg.extractedPreferences.recipient}</strong>
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E8B5C3] text-[11px] text-[#292626]">
                        Budget: <strong>{msg.extractedPreferences.budget}</strong>
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#E8B5C3] text-[11px] text-[#292626]">
                        Vibe: <strong>{msg.extractedPreferences.style}</strong>
                      </span>
                    </div>
                  </div>
                )}

                {/* Product Recommendations Cards (if any match) */}
                {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                  <div className="ml-11 space-y-3 pt-2">
                    <span className="text-xs font-semibold text-[#145C45] uppercase tracking-wider block">
                      Recommended Matches with Explanations:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.recommendedProductIds.map((pId) => {
                        const product = PRODUCTS.find((p) => p.id === pId);
                        if (!product) return null;
                        const reason = msg.reasoningMap?.[pId];
                        const isFavorited = isInWishlist(product.id);

                        return (
                          <div
                            key={product.id}
                            className="bg-white rounded-2xl border border-[#E8B5C3] p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-bold text-[#145C45] uppercase">
                                  {product.category}
                                </span>
                                <h4 className="font-serif text-sm font-semibold text-[#292626] truncate">
                                  {product.name}
                                </h4>
                                <span className="text-xs font-bold text-[#292626] block">
                                  ₹{product.price}
                                </span>
                              </div>

                              <button
                                onClick={() => toggleWishlist(product.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-full"
                                title="Wishlist"
                              >
                                <Heart
                                  className={`w-4 h-4 ${
                                    isFavorited ? 'fill-red-500 text-red-500' : ''
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Why this matches explanation */}
                            {reason && (
                              <div className="mt-2.5 bg-[#FCFAF9] p-2 rounded-xl border border-gray-100 text-[11px] text-[#77716F]">
                                <strong className="text-[#145C45] font-semibold block">
                                  Why this matches:
                                </strong>
                                <span>{reason}</span>
                              </div>
                            )}

                            {/* Actions on match */}
                            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                              <button
                                onClick={() => onSelectProduct(product.id)}
                                className="text-xs text-[#145C45] font-semibold hover:underline flex items-center gap-1"
                              >
                                <span>Customise Gift</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => addToCart(product, { quantity: 1 })}
                                className="px-3 py-1 rounded-full bg-[#145C45] text-white text-[11px] font-semibold hover:bg-[#0F4534] transition-colors"
                              >
                                Add to Enquiry
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Empty Results & Custom Order Fallback */}
                {msg.recommendedProductIds && msg.recommendedProductIds.length === 0 && (
                  <div className="ml-11 bg-white p-4 rounded-2xl border border-dashed border-[#E8B5C3] text-center space-y-2">
                    <p className="text-xs text-[#77716F]">
                      Don't worry! We specialize in custom-making whatever you envision.
                    </p>
                    <button
                      onClick={onNavigateCustomOrder}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#E8B5C3] text-[#292626] text-xs font-semibold hover:bg-[#dfa3b4] transition-colors"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Start Bespoke Custom Order</span>
                    </button>
                  </div>
                )}

                {/* Suggested Prompt Follow-up Chips */}
                {msg.suggestedFollowUps && (
                  <div className="ml-11 flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedFollowUps.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleUserSubmission(chip)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-[#F7E6EB] border border-gray-200 hover:border-[#E8B5C3] text-[#77716F] hover:text-[#145C45] transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            ))}
            <div />
          </div>

          {/* Voice Feedback Banner */}
          {voiceNotice && (
            <div className="bg-[#145C45] text-white text-xs px-4 py-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                {voiceNotice}
              </span>
              <button onClick={() => setVoiceNotice(null)} className="text-white/80 hover:text-white">
                ✕
              </button>
            </div>
          )}

          {/* Input Bar with Voice & Typed Input */}
          <div className="p-3 sm:p-4 bg-[#FCFAF9] border-t border-[#F7E6EB]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserSubmission(inputText);
              }}
              className="flex items-center gap-2"
            >
              {/* Voice button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-3 rounded-full transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-md'
                    : 'bg-[#F7E6EB] text-[#145C45] hover:bg-[#E8B5C3]'
                }`}
                title="Speak to AI Gift Finder"
                aria-label="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your gift request (e.g. Birthday gift for bestie under ₹1,000)..."
                className="flex-1 bg-white border border-[#E8B5C3] rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 rounded-full bg-[#145C45] text-white hover:bg-[#0F4534] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
