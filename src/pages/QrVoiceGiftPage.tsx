import React, { useState, useRef, useEffect } from 'react';
import { QrVoiceGift } from '../types';
import { MotionReveal } from '../components/common/MotionReveal';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Upload, 
  RotateCcw, 
  QrCode, 
  Download, 
  Lock, 
  Check, 
  Sparkles, 
  Heart, 
  Volume2, 
  Share2, 
  ExternalLink 
} from 'lucide-react';

interface QrVoiceGiftPageProps {
  onBackToStorefront: () => void;
  onOpenPlayback: (giftId: string) => void;
}

export const QrVoiceGiftPage: React.FC<QrVoiceGiftPageProps> = ({
  onBackToStorefront,
  onOpenPlayback
}) => {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  
  // Media recorder references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Form State
  const [recipientName, setRecipientName] = useState('Priya');
  const [senderName, setSenderName] = useState('Aarav');
  const [messageText, setMessageText] = useState('Happy 3rd Anniversary my love! Listen to this voice message from when we first met...');
  const [pinCode, setPinCode] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80');

  // Generated QR Gift
  const [generatedGift, setGeneratedGift] = useState<QrVoiceGift | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 180) { // 3-minute cap
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      alert('Microphone access was denied or is unavailable. You can also upload a pre-recorded audio file.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioBlobUrl(url);
      setRecordingSeconds(45); // simulated duration
    }
  };

  const togglePreviewPlayback = () => {
    if (!audioPlayerRef.current && audioBlobUrl) {
      audioPlayerRef.current = new Audio(audioBlobUrl);
      audioPlayerRef.current.onended = () => setIsPlayingPreview(false);
    }

    if (audioPlayerRef.current) {
      if (isPlayingPreview) {
        audioPlayerRef.current.pause();
        setIsPlayingPreview(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlayingPreview(true);
      }
    }
  };

  const handleGenerateQrGift = (e: React.FormEvent) => {
    e.preventDefault();
    const giftId = `VG-${Date.now().toString().slice(-6)}`;
    const newGift: QrVoiceGift = {
      id: giftId,
      recipientName,
      senderName,
      audioBlobUrl: audioBlobUrl || 'sample-audio-stream',
      audioDurationSeconds: recordingSeconds || 42,
      messageText,
      photoUrl,
      createdAt: new Date().toISOString(),
      isLocked: Boolean(pinCode.trim()),
      pinCode: pinCode.trim() || undefined,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        `${window.location.origin}/#voice-${giftId}`
      )}&color=14-5C-45`,
      playbackCount: 0
    };

    // Store in localStorage for playback lookup
    try {
      const existing = JSON.parse(localStorage.getItem('kbyk_voice_gifts') || '{}');
      existing[giftId] = newGift;
      localStorage.setItem('kbyk_voice_gifts', JSON.stringify(existing));
    } catch {}

    setGeneratedGift(newGift);
  };

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopyLink = () => {
    if (!generatedGift) return;
    const url = `${window.location.origin}/#voice-${generatedGift.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF9] py-8 sm:py-14 text-[#292626]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <MotionReveal variant="fade-up">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#145C45] uppercase tracking-wider block">
              Audio Keepsakes
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#292626]">
              QR Voice Gift Creator
            </h1>
            <p className="text-xs sm:text-sm text-[#77716F]">
              Record your personal voice message or laughter. We print an elegant gold-foil QR card included inside your gift box that plays your voice when scanned.
            </p>
          </div>
        </MotionReveal>

        {!generatedGift ? (
          /* Step 1: Recording & Configuration Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Voice Recording Studio */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-lg space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#292626] flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#145C45]" />
                Record Your Voice Note
              </h3>

              {/* Recording Disc Visualizer */}
              <div className="aspect-square rounded-2xl bg-gradient-to-b from-[#FCFAF9] to-[#F7E6EB] border border-[#F7E6EB] flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30 scale-110 animate-pulse' 
                    : audioBlobUrl 
                      ? 'bg-[#145C45] text-white shadow-md' 
                      : 'bg-white text-[#145C45] border border-gray-200'
                }`}>
                  <Mic className="w-12 h-12" />
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-2xl font-bold text-[#292626] block">
                    {formatDuration(recordingSeconds)}
                  </span>
                  <span className="text-xs text-[#77716F] block">
                    {isRecording ? 'Listening... Speak clearly into your mic' : audioBlobUrl ? 'Voice message ready for preview' : 'Up to 3 minutes of audio'}
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 pt-2">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-5 py-2.5 rounded-full bg-[#145C45] hover:bg-[#196B51] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
                    >
                      <Mic className="w-4 h-4" />
                      <span>{audioBlobUrl ? 'Re-record' : 'Start Recording'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
                    >
                      <Square className="w-4 h-4" />
                      <span>Finish Recording</span>
                    </button>
                  )}

                  {audioBlobUrl && !isRecording && (
                    <button
                      type="button"
                      onClick={togglePreviewPlayback}
                      className="p-2.5 rounded-full bg-white hover:bg-[#F7E6EB] border border-gray-200 text-[#145C45] transition-all"
                      title="Play / Pause Audio"
                    >
                      {isPlayingPreview ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Upload audio file option */}
                <div className="pt-2 text-center">
                  <label className="text-[11px] text-[#145C45] hover:underline font-medium cursor-pointer flex items-center gap-1 justify-center">
                    <Upload className="w-3 h-3" />
                    <span>Or upload pre-recorded audio (.mp3, .m4a)</span>
                    <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Gift Message & Card Setup */}
            <form onSubmit={handleGenerateQrGift} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F7E6EB] shadow-xs space-y-5">
              <h3 className="font-serif text-xl font-bold text-[#292626]">
                QR Card Presentation Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-[#292626] block mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Priya"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-gray-200 text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#292626] block mb-1">Your Name (Sender) *</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Aarav"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-gray-200 text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-[#292626] block">Handwritten Note on the QR Card *</label>
                <textarea
                  rows={3}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="A romantic note, quote, or memory caption..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-gray-200 text-sm text-[#292626] focus:outline-none focus:border-[#145C45] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-[#292626] block mb-1">Memory Photo URL (Optional)</label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-gray-200 text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
                  />
                  <span className="text-[10px] text-[#77716F]">Appears on the recipient's unboxing screen.</span>
                </div>

                <div>
                  <label className="font-bold text-[#292626] block mb-1">Secret 4-Digit PIN Lock (Optional)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 1402"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FCFAF9] border border-gray-200 text-sm text-[#292626] focus:outline-none focus:border-[#145C45]"
                  />
                  <span className="text-[10px] text-[#77716F]">Recipient must type PIN to hear message.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!audioBlobUrl && recordingSeconds === 0}
                  className="w-full py-4 rounded-2xl bg-[#145C45] hover:bg-[#196B51] disabled:opacity-40 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01]"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Generate Keepsake QR Gift Card</span>
                </button>
              </div>
            </form>

          </div>
        ) : (
          /* Step 2: Generated QR Card & Download Presentation */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#F7E6EB] shadow-xl text-center space-y-6 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-[#F7E6EB] text-[#145C45] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#145C45] uppercase tracking-wider">
                Keepsake Ready
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#292626]">
                QR Voice Gift Created!
              </h2>
              <p className="text-xs text-[#77716F]">
                This QR code links directly to your private voice message and memory photo.
              </p>
            </div>

            {/* Printable Keepsake Card Mockup */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FCFAF9] to-[#F7E6EB] border border-[#E8B5C3]/60 max-w-sm mx-auto shadow-sm space-y-4">
              <span className="font-serif italic text-xs text-[#145C45] block">
                KBYK • For moments that deserve to last
              </span>

              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-center">
                <img src={generatedGift.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
              </div>

              <div>
                <strong className="font-serif text-base text-[#292626] block">Scan to Hear My Voice</strong>
                <p className="text-[11px] text-[#77716F] mt-1">
                  Crafted for <strong>{generatedGift.recipientName}</strong> with love from <strong>{generatedGift.senderName}</strong>
                </p>
                {generatedGift.isLocked && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold mt-2">
                    <Lock className="w-3 h-3" /> PIN Protected: {generatedGift.pinCode}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onOpenPlayback(generatedGift.id)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#145C45] hover:bg-[#196B51] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Test Recipient Unboxing Screen</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#F7E6EB] hover:bg-[#F2D7E0] text-[#145C45] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
              </button>

              <button
                onClick={() => setGeneratedGift(null)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-gray-200 text-[#77716F] hover:text-[#292626] text-xs font-semibold"
              >
                Create Another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
