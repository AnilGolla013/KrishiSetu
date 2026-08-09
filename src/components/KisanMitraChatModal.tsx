import React, { useState } from 'react';
import { Language } from '../types';
import {
  Sprout,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Sparkles,
  Loader2,
  Languages,
  Volume2
} from 'lucide-react';

interface KisanMitraChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface ChatTurn {
  sender: 'user' | 'bot';
  text: string;
  suggestedActions?: string[];
}

export const KisanMitraChatModal: React.FC<KisanMitraChatModalProps> = ({ isOpen, onClose, language }) => {
  const [currentLang, setCurrentLang] = useState<Language>(language);
  const [inputQuery, setInputQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([
    {
      sender: 'bot',
      text: 'Namaste! I am Kisan Mitra (రైతు మిత్రుడు / किसान मित्र), your AI agricultural companion. Ask me anything about crop diseases, direct selling tips, fertilizer doses, or live mandi prices in your language!',
      suggestedActions: [
        'How to get maximum tomato price without brokers?',
        'Organic treatment for yellow leaf curling',
        'How does direct buyer pickup transport work?'
      ]
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim()) return;

    const newTurns: ChatTurn[] = [...chatTurns, { sender: 'user', text: q }];
    setChatTurns(newTurns);
    if (!queryToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch("/api/ai/advisory-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          language: currentLang,
          userRole: "farmer"
        })
      });

      const data = await res.json();
      setChatTurns(prev => [
        ...prev,
        {
          sender: 'bot',
          text: data.reply || "Namaste! For direct selling, grade your vegetables carefully and post morning harvest photos on KisanDirect.",
          suggestedActions: data.suggestedActions || []
        }
      ]);
    } catch (err) {
      console.error("Kisan Mitra chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputQuery("టమోటా పంటకు నేరుగా మంచి ధర ఎలా పొందాలి?");
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleSpeakText = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2E1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#E0E7DE] overflow-hidden my-6 flex flex-col h-[600px]">
        {/* Header */}
        <div className="bg-[#2D6A4F] text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center font-black">
              🌾
            </div>
            <div>
              <h3 className="font-bold text-base text-[#D8F3DC]">Kisan Mitra AI Assistant</h3>
              <p className="text-[11px] text-[#D8F3DC]/80">Multilingual Farmer & Seller Guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value as Language)}
              className="bg-[#1B4332] text-[#D8F3DC] text-xs font-semibold px-2 py-1 rounded-lg border border-[#2D6A4F] cursor-pointer"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="kn">కన్నడ (Kannada)</option>
              <option value="mr">మరాఠీ (Marathi)</option>
            </select>

            <button
              onClick={onClose}
              className="text-[#D8F3DC] hover:text-white text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat History Area */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#F4F7F2]/50">
          {chatTurns.map((turn, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${turn.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  turn.sender === 'user'
                    ? 'bg-[#2D6A4F] text-white rounded-tr-none shadow-xs'
                    : 'bg-white text-[#1A2E1A] border border-[#E0E7DE] rounded-tl-none shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#F0F5F0] pb-1 text-[10px] text-[#5C715C]">
                  <span className={`font-bold flex items-center gap-1 ${turn.sender === 'user' ? 'text-[#D8F3DC]' : 'text-[#2D6A4F]'}`}>
                    {turn.sender === 'user' ? 'You' : '🌾 Kisan Mitra AI'}
                  </span>
                  {turn.sender === 'bot' && (
                    <button
                      onClick={() => handleSpeakText(turn.text)}
                      className="text-[#2D6A4F] hover:text-[#1B4332] font-bold flex items-center gap-0.5 cursor-pointer"
                      title="Read Aloud Voice"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>

                <p className={`whitespace-pre-line font-medium text-xs ${turn.sender === 'user' ? 'text-white' : 'text-[#1A2E1A]'}`}>{turn.text}</p>
              </div>

              {/* Action Prompt Chips */}
              {turn.suggestedActions && turn.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                  {turn.suggestedActions.map((action, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => handleSend(action)}
                      className="bg-[#D8F3DC]/60 hover:bg-[#D8F3DC] text-[#2D6A4F] border border-[#B7E4C7] text-[11px] font-semibold px-2.5 py-1 rounded-xl text-left transition-colors cursor-pointer"
                    >
                      💡 {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#2D6A4F] font-semibold p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Kisan Mitra is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E0E7DE] flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl text-white transition-all cursor-pointer ${
              isRecording
                ? 'bg-rose-600 animate-pulse ring-2 ring-rose-300'
                : 'bg-[#2D6A4F] hover:bg-[#1B4332]'
            }`}
            title="Voice Speak Button for Farmers"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              isRecording
                ? "Listening to voice input in Telugu/Hindi..."
                : "Ask Kisan Mitra in your language..."
            }
            className="flex-1 px-3.5 py-2 text-xs border border-[#E0E7DE] rounded-xl focus:ring-2 focus:ring-[#2D6A4F] focus:outline-none"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={loading || !inputQuery.trim()}
            className="bg-[#2D6A4F] hover:bg-[#1B4332] disabled:opacity-50 text-white p-2.5 rounded-xl font-bold transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
