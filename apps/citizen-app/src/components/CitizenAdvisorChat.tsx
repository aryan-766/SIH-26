import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Send, ShieldCheck, MapPin, Phone, Check, 
  HelpCircle, Clock, Sparkles, User, ArrowLeft, Bot, RefreshCw
} from 'lucide-react';
import { 
  BeneficiaryProfile, AdvisorThread, DEFAULT_FIELD_OFFICER, 
  getOrCreateThreadForCitizen, postAdvisorMessage, generateAiAdvisorSupport,
  subscribeToStore 
} from '../services/enterpriseStore';

interface CitizenAdvisorChatProps {
  userProfile: BeneficiaryProfile;
  onBack?: () => void;
  isEn?: boolean;
}

export function CitizenAdvisorChat({ userProfile, onBack, isEn }: CitizenAdvisorChatProps) {
  const [thread, setThread] = useState<AdvisorThread | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [routedNotification, setRoutedNotification] = useState<string | null>(null);

  const loadThread = () => {
    const active = getOrCreateThreadForCitizen(userProfile);
    setThread({ ...active });
  };

  useEffect(() => {
    loadThread();
    const unsubscribe = subscribeToStore(loadThread);
    return () => unsubscribe();
  }, [userProfile.phone, userProfile.fullName]);

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || messageText;
    if (!textToSend.trim() || !thread) return;

    // 1. Post citizen message (instantly arrives in Field Officer's inbox!)
    postAdvisorMessage(
      thread.id,
      textToSend.trim(),
      'citizen',
      userProfile.fullName || 'Rural Entrepreneur'
    );
    if (!customText) setMessageText('');

    // Show routing banner to user
    setRoutedNotification(
      isEn 
        ? `Message delivered to Field Officer (Sanjay Verma, VDO) inbox for ${userProfile.villageName || 'Bhiti Rawat'}` 
        : `संदेश आपके ग्राम नोडल अधिकारी श्री संजय वर्मा (VDO) के इनबॉक्स में भेज दिया गया है`
    );
    setTimeout(() => setRoutedNotification(null), 4500);

    // 2. Trigger instant AI Advisory assistance
    setIsAiThinking(true);
    setTimeout(() => {
      const aiReply = generateAiAdvisorSupport(textToSend, userProfile.selectedBizName || 'Dairy');
      postAdvisorMessage(
        thread.id,
        aiReply,
        'ai',
        'GramUdyam AI Advisor',
        'AI Assisted 24/7'
      );
      setIsAiThinking(false);
    }, 600);
  };

  const officer = DEFAULT_FIELD_OFFICER;

  return (
    <div className="space-y-3 pb-8">
      {/* Header: AI Advisor + Field Officer Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-3.5 rounded-2xl shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black tracking-wide">
                  {isEn ? 'AI Business Advisor' : 'AI बिजनेस सलाहकार व नोडल डेस्क'}
                </h3>
                <span className="text-[9px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>AI 24/7</span>
                </span>
              </div>
              <p className="text-[10px] text-emerald-100">
                {isEn ? 'Instant AI Intelligence + Direct Field Officer Routing' : 'तत्काल AI सलाह + सीधे क्षेत्रीय VDO अधिकारी को प्रेषित'}
              </p>
            </div>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Assigned Official Area Officer Badge */}
        <div className="bg-white/10 rounded-xl p-2 border border-white/15 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-300 block">
                {isEn ? 'Assigned Area Officer:' : 'आपके ग्राम नोडल अधिकारी:'}
              </span>
              <span className="font-bold text-white text-[11px]">
                {officer.fullName} (VDO) • {userProfile.villageName || 'Bhiti Rawat'}
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
            {officer.uniqueGovtCode}
          </span>
        </div>
      </div>

      {/* Message Routing Alert */}
      {routedNotification && (
        <div className="bg-purple-50 border border-purple-200 text-purple-950 text-[11px] font-bold p-2.5 rounded-xl flex items-center gap-2 animate-fadeIn shadow-xs">
          <Check className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />
          <span>{routedNotification}</span>
        </div>
      )}

      {/* Chat Messages */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <span className="text-xs font-black text-slate-900">
              {isEn ? 'Advisor Solutions Chat' : 'व्यापार समाधान एवं सब्सिडी मार्गदर्शन'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {isEn ? 'AI advice + Official VDO review for your DPR' : 'AI सलाह + आपके DPR पर VDO अधिकारी की समीक्षा'}
            </span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>{isEn ? 'Online' : 'सक्रिय'}</span>
          </span>
        </div>

        {/* Message Container */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {thread?.messages.map(m => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'citizen' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1 mb-0.5 text-[9px] text-slate-400">
                <span>{m.senderName}</span>
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>
              <div
                className={`p-3 rounded-2xl text-xs max-w-[88%] leading-relaxed ${
                  m.sender === 'citizen'
                    ? 'bg-rural-600 text-white rounded-tr-none shadow-xs'
                    : m.sender === 'ai'
                    ? 'bg-emerald-50/90 text-emerald-950 border border-emerald-200 rounded-tl-none shadow-2xs'
                    : 'bg-purple-50 text-purple-950 rounded-tl-none border border-purple-200 shadow-2xs'
                }`}
              >
                {m.badge && (
                  <span className={`text-[9px] font-bold block mb-1 uppercase tracking-wide ${
                    m.sender === 'citizen' 
                      ? 'text-emerald-200' 
                      : m.sender === 'ai' 
                      ? 'text-emerald-700' 
                      : 'text-purple-700'
                  }`}>
                    ✓ {m.badge}
                  </span>
                )}
                <p>{m.text}</p>
              </div>
            </div>
          ))}

          {isAiThinking && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200 w-fit">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>{isEn ? 'AI Advisor analyzing policy & schemes...' : 'AI सलाहकार नीति व सब्सिडी का विश्लेषण कर रहा है...'}</span>
            </div>
          )}
        </div>

        {/* Quick Question Buttons */}
        <div className="space-y-1 pt-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            {isEn ? 'Recommended Inquiries (Tap to Ask)' : 'महत्वपूर्ण प्रश्न (पूछने के लिए छुएं)'}
          </span>
          <div className="flex flex-wrap gap-1">
            {[
              isEn ? 'What documents are required for 35% PMEGP subsidy?' : 'PMEGP 35% सब्सिडी के लिए कौनसे दस्तावेज चाहिए?',
              isEn ? 'Can VDO verify my DPR for PNB bank loan?' : 'क्या VDO साहब PNB लोन के लिए मेरा DPR सत्यापित करेंगे?',
              isEn ? 'When will the animal husbandry vaccination camp take place?' : 'पशु टीकाकरण व स्वास्थ्य शिविर कब लगेगा?'
            ].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(undefined, q)}
                className="text-[10px] bg-slate-50 text-slate-700 border border-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 transition text-left"
              >
                💬 {q}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-1.5 pt-1">
          <input
            type="text"
            placeholder={isEn ? 'Ask AI Advisor & Officer Sanjay Verma (VDO)...' : 'AI सलाहकार व VDO संजय वर्मा के लिए प्रश्न लिखें...'}
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!messageText.trim() || isAiThinking}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isEn ? 'Send' : 'पूछें'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
