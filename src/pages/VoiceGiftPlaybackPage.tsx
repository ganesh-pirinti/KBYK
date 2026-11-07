import React, { useState, useEffect, useRef } from 'react';
import { QrVoiceGift } from '../types';
import { 
  Play, 
  Pause, 
  Volume2, 
  Heart, 
  Lock, 
  Sparkles, 
  MessageCircle, 
  Gift, 
  ArrowLeft,
  Check
} from 'lucide-react';

interface VoiceGiftPlaybackPageProps {
  giftId: string;
  onExploreGifts: () => void;
}

export const VoiceGiftPlaybackPage: React.FC<VoiceGiftPlaybackPageProps> = ({
  giftId,
  onExploreGifts
}) => {
  const [gift, setGift] = useState<QrVoiceGift | null>(null);
  const [isUnsealed, setIsUnsealed] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Audio Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(42);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Lookup gift by ID or use a rich default memory
    try {
      const stored = JSON.parse(localStorage.getItem('kbyk_voice_gifts') || '{}');
      if (stored[giftId]) {
        setGift(stored[giftId]);
        setDuration(stored[giftId].audioDurationSeconds || 42);
        if (!stored[giftId].isLocked) setPinUnlocked(true);
        return;
      }
    } catch {}

    // Fallback sample gift for instant enjoyment
    const sample: QrVoiceGift = {
      id: giftId || 'VG-SAMPLE',
      recipientName: 'Priya',
      senderName: 'Aarav',
      audioBlobUrl: 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg',
      audioDurationSeconds: 48,
      messageText: 'Happy 3rd Anniversary! Every single second spent with you is a moment I treasure forever. Thank you for making my life so incredibly beautiful. Listen to our song and this note...',
      photoUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
      createdAt: '2026-10-28',
      isLocked: false,
      qrCodeUrl: '',
      playbackCount: 1
    };
    setGift(sample);
    setPinUnlocked(true);
  }, [giftId]);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (gift?.pinCode && pinInput === gift.pinCode) {
      setPinUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const togglePlayAudio = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      intervalRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!gift) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCFAF9] via-[#F7E6EB]/40 to-[#FCFAF9] py-8 sm:py-16 text-[#292626] flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        
        {/* Step 1: Wax-Seal Envelope Unboxing */}
        {!isUnsealed ? (
          <div 
            onClick={() => setIsUnsealed(true)}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F7E6EB] shadow-2xl text-center space-y-6 cursor-pointer hover:scale-[1.01] transition-transform select-none"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#77716F]">
              A Handcrafted Keepsake Has Arrived
            </span>

            <div className="w-24 h-24 mx-auto rounded-full bg-[#145C45] text-white flex items-center justify-center shadow-xl shadow-emerald-950/20 relative group">
              <span className="font-serif text-3xl font-bold">K</span>
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E8B5C3] animate-spin-slow" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#292626]">
                For Dearest {gift.recipientName}
              </h1>
              <p className="text-xs text-[#77716F]">
                From <strong>{gift.senderName}</strong> with all their love.
              </p>
            </div>

            <div className="pt-4">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F7E6EB] text-[#145C45] text-xs font-bold hover:bg-[#F2D7E0] transition-colors shadow-xs">
                <Sparkles className="w-4 h-4" />
                <span>Tap the Wax Seal to Open Note</span>
              </span>
            </div>
          </div>
        ) : !pinUnlocked ? (
          /* Step 2: PIN Lock Verification */
          <div className="bg-white rounded-3xl p-8 border border-[#F7E6EB] shadow-xl text-center space-y-6 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-[#292626]">Private Audio Message</h2>
              <p className="text-xs text-[#77716F]">
                {gift.senderName} protected this voice note with a secret PIN.
              </p>
            </div>

            <form onSubmit={handleUnlockPin} className="space-y-4 max-w-xs mx-auto">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 4-Digit PIN"
                className="w-full text-center text-2xl tracking-widest font-mono py-3 rounded-2xl bg-[#FCFAF9] border border-gray-200 focus:outline-none focus:border-[#145C45]"
              />

              {pinError && (
                <span className="text-xs text-rose-600 block">Incorrect PIN. Please try again.</span>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#145C45] text-white text-xs font-semibold shadow-md"
              >
                Unlock Audio Note
              </button>
            </form>
          </div>
        ) : (
          /* Step 3: Full Audio Keepsake Experience */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F7E6EB] shadow-2xl space-y-8 animate-scale-up">
            
            {/* Memory Photo Banner */}
            {gift.photoUrl && (
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden shadow-md border border-[#F7E6EB]">
                <img src={gift.photoUrl} alt="Memory" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-serif italic">
                    Forever in our hearts • {gift.senderName} & {gift.recipientName}
                  </span>
                </div>
              </div>
            )}

            {/* Audio Turntable Player */}
            <div className="p-6 rounded-2xl bg-[#FCFAF9] border border-[#F7E6EB] flex flex-col items-center justify-center text-center space-y-4">
              
              {/* Spinning Disc */}
              <div className="relative">
                <div className={`w-24 h-24 rounded-full bg-[#161B19] flex items-center justify-center shadow-lg transition-transform ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}>
                  <div className="w-8 h-8 rounded-full bg-[#E8B5C3] border-2 border-white flex items-center justify-center text-[8px] font-bold text-[#145C45]">
                    KBYK
                  </div>
                </div>

                <button
                  onClick={togglePlayAudio}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#145C45] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
              </div>

              {/* Progress & Waveform */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-[#77716F]">
                  <span>{formatSeconds(currentTime)}</span>
                  <span className="text-[#145C45] font-semibold flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    {isPlaying ? 'Playing Audio Keepsake' : 'Tap to Listen'}
                  </span>
                  <span>{formatSeconds(duration)}</span>
                </div>

                {/* Scrubber Bar */}
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#145C45] transition-all duration-300" 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Heartfelt Written Calligraphy Note */}
            <div className="space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#145C45]">
                A Message For You
              </span>
              <p className="font-serif text-base sm:text-lg text-[#292626] italic leading-relaxed px-4">
                "{gift.messageText}"
              </p>
              <span className="text-xs font-semibold text-[#77716F] block pt-1">
                — With love, {gift.senderName}
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Thank you so much for the beautiful KBYK audio gift! Hearing your voice made my day so special ❤️`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#145C45] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#196B51] transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send {gift.senderName} a "Thank You" Note</span>
              </a>

              <button
                onClick={onExploreGifts}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-[#F7E6EB] text-[#145C45] text-xs font-semibold hover:bg-[#F2D7E0] transition-colors"
              >
                Explore KBYK Studio
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
