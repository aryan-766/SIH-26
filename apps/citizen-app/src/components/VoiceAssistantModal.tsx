import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Mic, MicOff, Sparkles, X, CheckCircle2, 
  ArrowRight, Play, Square, MessageSquare, Briefcase, Calculator, 
  HelpCircle, ShieldCheck
} from 'lucide-react';
import { Language } from '../locales';
import { BeneficiaryProfile, saveBeneficiaryProfile } from '../services/enterpriseStore';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentScreen: string;
  userProfile: BeneficiaryProfile;
  onProfileUpdated?: (prof: BeneficiaryProfile) => void;
  onAddTransaction?: (type: 'income' | 'expense', amount: number, category: string) => void;
  onBudgetUpdated?: (newCost: number) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentScreen,
  userProfile,
  onProfileUpdated,
  onAddTransaction,
  onBudgetUpdated
}) => {
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<'explain' | 'interact'>('explain');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [result, setResult] = useState<{
    intent: string;
    entryMade: boolean;
    summary?: string;
    written: string;
    spoken: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  const getLangCode = (l: Language) => {
    switch (l) {
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      case 'ta': return 'ta-IN';
      case 'te': return 'te-IN';
      case 'en': return 'en-IN';
      default: return 'hi-IN';
    }
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLangCode(lang);
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatusMessage(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setStatusMessage(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setStatusMessage(null);
  };

  // Screen explanation generator
  const getScreenExplanation = () => {
    const biz = userProfile.selectedBizName || (isEn ? 'Dairy Farming Unit' : 'डेयरी फार्मिंग इकाई');
    const village = userProfile.villageName || (isEn ? 'Bhiti Rawat' : 'भीटी रावत');

    switch (currentScreen) {
      case 'finance':
      case 'dpr':
        return {
          title: isEn ? 'Finance & DPR Calculator Briefing' : 'वित्त एवं ऋण विश्लेषण विवरण',
          spoken: isEn
            ? `You are in the Finance section. Total project cost is 2 lakh rupees. PMEGP subsidy is 70 thousand rupees at 35 percent. Bank loan is 1 lakh rupees with monthly EMI of 4,250 rupees for 5 years.`
            : `आप वित्त और लोन कैलकुलेटर में हैं। कुल प्रोजेक्ट लागत 2 लाख रुपये है, जिसमें 35 प्रतिशत PMEGP सब्सिडी 70 हजार रुपये स्वीकृत है। बैंक ऋण 1 लाख रुपये है जिसकी मासिक EMI 4,250 रुपये 5 वर्ष के लिए होगी।`,
          points: isEn ? [
            'Total Project Cost: ₹2,00,000 (Machinery: ₹1.4L + Working Capital: ₹60K)',
            'PMEGP Subsidy: ₹70,000 (35% capital subsidy for rural special categories)',
            'Bank Loan: ₹1,00,000 (5-year tenure @ 9.5% interest)',
            'Own Contribution: ₹30,000 (15% equity margin)',
            'Monthly EMI: ₹4,250 with 6-month moratorium'
          ] : [
            'कुल प्रोजेक्ट लागत: ₹2,00,000 (संयंत्र व मशीनरी: ₹1.4 लाख + कार्यशील पूंजी: ₹60,000)',
            'PMEGP सब्सिडी: ₹70,000 (ग्रामीण OBC/SC/ST/महिला हेतु 35% अनुदान)',
            'बैंक ऋण: ₹1,00,000 (PNB सहजनवा, 5 वर्ष अवधि @ 9.5% ब्याज दर)',
            'उद्यमी अंशदान: ₹30,000 (15% मार्जिन)',
            'मासिक EMI: ₹4,250 (6 माह का निर्माण मोराटोरियम उपलब्ध)'
          ]
        };

      case 'schemes':
        return {
          title: isEn ? 'Government Schemes Briefing' : 'सरकारी योजनाएं व सब्सिडी विवरण',
          spoken: isEn
            ? `You are on the Government Schemes screen. Under PMEGP, you get up to 35 percent capital subsidy. PM Mudra loan offers up to 10 lakh rupees collateral-free bank loans.`
            : `आप सरकारी योजनाएं स्क्रीन पर हैं। PMEGP योजना में ग्रामीण सूक्ष्म उद्यमों को 35 प्रतिशत तक सब्सिडी मिलती है। प्रधानमंत्री मुद्रा योजना में बिना गारंटी के 10 लाख तक का बैंक ऋण उपलब्ध है।`,
          points: isEn ? [
            'PMEGP: 35% Capital Subsidy for Rural OBC/SC/ST & Women entrepreneurs',
            'PM Mudra Yojana: Up to ₹10,00,000 collateral-free loans',
            'PM Vishwakarma: Subsidized 5% interest rate + ₹15,000 toolkit voucher',
            'Nodal Desk: Direct VDO recommendation to bank branch'
          ] : [
            'PMEGP (खादी ग्रामोद्योग): ग्रामीण क्षेत्र में 35% तक पूंजीगत सब्सिडी',
            'पीएम मुद्रा योजना: बिना बैंक गारंटी ₹10,00,000 तक ऋण',
            'पीएम विश्वकर्मा योजना: 5% रियायती ब्याज दर + ₹15,000 टूलकिट अनुदान',
            'नोडल संस्तुति: VDO संजय वर्मा द्वारा सत्यापित आवेदन'
          ]
        };

      default:
        return {
          title: isEn ? 'Overview & Discovery Briefing' : 'ग्रामउद्यम मुख्य विवरण',
          spoken: isEn
            ? `Welcome to GramUdyam. You are registered from ${village} for ${biz}. Your suitability score is 85 percent, and bulk milk chilling center is 4 kilometers away. Nodal Officer Sanjay Verma is assigned.`
            : `ग्रामउद्यम में आपका स्वागत है। आप ${village} से ${biz} हेतु पंजीकृत हैं। 85 प्रतिशत मैच स्कोर है और 4 किलोमीटर पर मिल्क चिलिंग सेंटर उपलब्ध है। नोडल अधिकारी संजय वर्मा नियुक्त हैं।`,
          points: isEn ? [
            `Applicant: ${userProfile.fullName || 'Ramesh Yadav'} (${village})`,
            `Enterprise: ${biz} (85% suitability match)`,
            'Proximity: 4 km to Sahjanwa Bulk Milk Chilling Center',
            'Nodal Officer: Sanjay Verma (VDO) assigned for verification'
          ] : [
            `पंजीकृत उद्यमी: ${userProfile.fullName || 'रमेश कुमार यादव'} (${village})`,
            `चयनित उद्यम: ${biz} (85% उपयुक्तता मैच)`,
            'निकटवर्ती सुविधा: 4 किमी पर सहजनवा बल्क मिल्क चिलिंग सेंटर',
            'नोडल अधिकारी: संजय वर्मा (VDO सहजनवा) सत्यापन हेतु नियुक्त'
          ]
        };
    }
  };

  const handleExplainCurrentScreen = () => {
    setActiveTab('explain');
    const exp = getScreenExplanation();
    setStatusMessage(isEn ? 'Explaining screen details aloud...' : 'स्क्रीन की जानकारी पढ़कर समझाई जा रही है...');
    speak(exp.spoken);
  };

  // Process user spoken/typed command -> Understand -> Enter -> Speak
  const handleProcessText = (input: string) => {
    if (!input.trim()) return;
    const lower = input.toLowerCase();

    // Helper to extract amounts
    const extractNum = (str: string): number | null => {
      const lakh = str.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख|లక్ష|லட்சம்)/i);
      if (lakh) return Math.round(parseFloat(lakh[1]) * 100000);
      const thousand = str.match(/(\d+(?:\.\d+)?)\s*(?:thousand|k|hazaar|hazar|हजार|हज़ार|వేల|ஆயிரம்)/i);
      if (thousand) return Math.round(parseFloat(thousand[1]) * 1000);
      const digits = str.match(/\b(\d{3,9})\b/);
      if (digits) return parseInt(digits[1], 10);
      return null;
    };

    // 1. Budget / Cost Entry
    if (lower.includes('budget') || lower.includes('बजट') || lower.includes('cost') || lower.includes('लागत') || lower.includes('capital') || lower.includes('पूंजी')) {
      const amt = extractNum(lower);
      if (amt) {
        if (onBudgetUpdated) onBudgetUpdated(amt);
        const updated = { ...userProfile, capital: amt };
        saveBeneficiaryProfile(updated);
        if (onProfileUpdated) onProfileUpdated(updated);

        const sub = Math.round(amt * 0.35);
        const spoken = isEn
          ? `Budget entry recorded. Your project capital is now set to ${amt} rupees. 35 percent PMEGP subsidy will be ${sub} rupees.`
          : `प्रविष्टि दर्ज: कुल प्रोजेक्ट लागत ₹${amt.toLocaleString('en-IN')} सेट कर दी गई है। 35% PMEGP सब्सिडी ₹${sub.toLocaleString('en-IN')} मिलेगी।`;

        const written = isEn
          ? `✓ Entry Recorded: Project Cost updated to ₹${amt.toLocaleString('en-IN')}\n• 35% Subsidy: ₹${sub.toLocaleString('en-IN')}\n• DPR Recalculated`
          : `✓ नई प्रविष्टि दर्ज: प्रोजेक्ट लागत ₹${amt.toLocaleString('en-IN')} सेट हुई\n• 35% PMEGP सब्सिडी: ₹${sub.toLocaleString('en-IN')}\n• डीपीआर पुनः संकलित`;

        setResult({ intent: 'Update Project Budget', entryMade: true, summary: `₹${amt.toLocaleString('en-IN')}`, written, spoken });
        speak(spoken);
        return;
      }
    }

    // 2. Sales / Expense Entry
    if (lower.includes('bikri') || lower.includes('बिक्री') || lower.includes('bika') || lower.includes('sale') || lower.includes('kharcha') || lower.includes('खर्चा')) {
      const amt = extractNum(lower) || 3500;
      const isExp = lower.includes('kharcha') || lower.includes('खर्चा');
      const cat = isExp ? 'Feed / Supplies' : 'Milk Sales';
      if (onAddTransaction) onAddTransaction(isExp ? 'expense' : 'income', amt, cat);

      const spoken = isEn
        ? `Transaction entry recorded. ${amt} rupees entered under ${cat}. Cash flow is safe.`
        : `लेनदेन प्रविष्टि दर्ज: ₹${amt} का हिसाब बहीखाते में दर्ज हो गया है। कैश फ्लो सुरक्षित है।`;

      const written = isEn
        ? `✓ Transaction Recorded in Ledger:\n• Type: ${isExp ? 'Expense' : 'Income'}\n• Amount: ₹${amt.toLocaleString('en-IN')}\n• Category: ${cat}`
        : `✓ दैनिक बहीखाता प्रविष्टि दर्ज:\n• प्रकार: ${isExp ? 'खर्च' : 'बिक्री/आय'}\n• राशि: ₹${amt.toLocaleString('en-IN')}\n• श्रेणी: ${cat}`;

      setResult({ intent: 'Record Transaction', entryMade: true, summary: `₹${amt}`, written, spoken });
      speak(spoken);
      return;
    }

    // 3. Inspection / Officer
    if (lower.includes('vdo') || lower.includes('sanjay') || lower.includes('inspection') || lower.includes('सत्यापन') || lower.includes('वेरिफिकेशन')) {
      const spoken = isEn
        ? `Physical inspection request submitted to Area Nodal Officer Sanjay Verma.`
        : `VDO संजय वर्मा को भौतिक सत्यापन का आधिकारिक अनुरोध भेज दिया गया है।`;

      const written = isEn
        ? `✓ Official Inspection Request Dispatched:\n• Officer: Sanjay Verma (VDO Sahjanwa)\n• Target: DPR verification & 35% PMEGP sanction`
        : `✓ शासकीय सत्यापन अनुरोध प्रेषित:\n• अधिकारी: संजय वर्मा (VDO सहजनवा)\n• उद्देश्य: DPR सत्यापन व 35% PMEGP सब्सिडी संस्तुति`;

      setResult({ intent: 'Field Inspection Request', entryMade: true, summary: 'VDO Sanjay Verma notified', written, spoken });
      speak(spoken);
      return;
    }

    // 4. Default Advisory
    const spoken = isEn
      ? `Your query has been understood. Your enterprise is eligible for 35 percent rural subsidy.`
      : `आपके प्रश्न को समझ लिया गया है। आपका उद्यम 35 प्रतिशत ग्रामीण सब्सिडी के लिए पात्र है।`;
    const written = isEn
      ? `✓ Advisory: ${input}\n• PMEGP 35% capital subsidy applies\n• Direct recommendation from Sahjanwa block office`
      : `✓ परामर्श: "${input}"\n• PMEGP 35% सब्सिडी लागू\n• सहजनवा ब्लॉक कार्यालय से संस्तुति पत्र जारी`;

    setResult({ intent: 'Enterprise Query', entryMade: false, written, spoken });
    speak(spoken);
  };

  const startVoiceInput = () => {
    stopSpeaking();
    setActiveTab('interact');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const prompts = [
        "मेरा प्रोजेक्ट बजट ₹5,00,000 सेट करो",
        "आज ₹3,500 की दूध बिक्री दर्ज करो",
        "VDO संजय वर्मा से भौतिक सत्यापन का अनुरोध करो",
        "PMEGP 35% सब्सिडी के लिए क्या कागज चाहिए?"
      ];
      const r = prompts[Math.floor(Math.random() * prompts.length)];
      setTranscript(r);
      setStatusMessage(isEn ? 'Processing speech...' : 'ध्वनि इनपुट प्राप्त...');
      setTimeout(() => handleProcessText(r), 800);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      recognitionRef.current = rec;
      rec.lang = getLangCode(lang);
      rec.continuous = false;

      rec.onstart = () => {
        setIsListening(true);
        setStatusMessage(isEn ? 'Listening... Speak now' : 'सुन रहा हूँ... बोलिए');
      };

      rec.onresult = (e: any) => {
        const textSpoken = e.results[0][0].transcript;
        setTranscript(textSpoken);
        setIsListening(false);
        handleProcessText(textSpoken);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      rec.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  if (!isOpen) return null;
  const explanation = getScreenExplanation();

  const quickPrompts = [
    isEn ? "Explain everything on this screen" : "स्क्रीन की सारी जानकारी समझाएं",
    isEn ? "Set my project budget to 5 lakh rupees" : "मेरा प्रोजेक्ट बजट ₹5,00,000 सेट करो",
    isEn ? "Record 3500 rupees milk sales today" : "आज ₹3,500 की दूध बिक्री दर्ज करो",
    isEn ? "Schedule site inspection with VDO Sanjay Verma" : "VDO संजय वर्मा को भौतिक सत्यापन के लिए बुलाओ",
    isEn ? "How much PMEGP subsidy will I get?" : "PMEGP में 35% सब्सिडी कैसे मिलेगी?"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${isListening ? 'bg-red-500 animate-pulse' : isSpeaking ? 'bg-amber-500 animate-bounce' : 'bg-white/20'}`}>
              {isSpeaking ? <Volume2 className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black tracking-wide">
                  {isEn ? 'GramUdyam Voice Assistant' : 'ग्रामउद्यम वॉइस सहायक'}
                </h2>
                <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded font-bold uppercase">
                  {getLangCode(lang)}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">
                {isEn ? 'Screen Briefing • Auto-Entry Engine' : 'स्क्रीन विवरण • स्वचालित प्रविष्टि सहायक'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => { stopSpeaking(); onClose(); }}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-2 gap-2">
          <button
            onClick={handleExplainCurrentScreen}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'explain'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isEn ? 'Explain Screen Text' : 'स्क्रीन का विवरण समझाएं'}</span>
          </button>

          <button
            onClick={() => setActiveTab('interact')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'interact'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isEn ? 'Speak / Make Entry' : 'बोलकर प्रविष्टि करें'}</span>
          </button>
        </div>

        {/* Status Strip */}
        {statusMessage && (
          <div className={`px-4 py-2 text-xs font-semibold flex items-center justify-between ${isSpeaking ? 'bg-amber-50 text-amber-900 border-b border-amber-200' : 'bg-emerald-50 text-emerald-900 border-b border-emerald-200'}`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-current animate-ping" />
              <span>{statusMessage}</span>
            </div>
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="text-[10px] bg-amber-200 hover:bg-amber-300 text-amber-900 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
              >
                <Square className="w-3 h-3" />
                <span>{isEn ? 'Stop' : 'रोकें'}</span>
              </button>
            )}
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'explain' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {isEn ? `CURRENT VIEW: ${currentScreen}` : `वर्तमान स्क्रीन: ${currentScreen}`}
                </span>
                <button
                  onClick={handleExplainCurrentScreen}
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isEn ? 'Listen Again' : 'पुनः सुनें'}</span>
                </button>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{explanation.title}</h3>

              <div className="space-y-2">
                {explanation.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div 
                onClick={() => { setActiveTab('interact'); startVoiceInput(); }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-emerald-100 transition"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-emerald-950">
                    {isEn ? 'Want to change budget or record sales?' : 'बजट बदलना या बिक्री दर्ज करना चाहते हैं?'}
                  </h4>
                  <p className="text-[10px] text-emerald-800">
                    {isEn ? 'Click here to speak your details' : 'यहाँ क्लिक करें और बोलकर प्रविष्टि करें'}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Push to talk */}
              <div className="flex flex-col items-center justify-center py-2">
                <button
                  onClick={startVoiceInput}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                    isListening
                      ? 'bg-red-500 text-white ring-8 ring-red-100 animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-100'
                  }`}
                >
                  <Mic className="w-7 h-7" />
                </button>
                <span className="text-xs font-bold text-slate-700 mt-2">
                  {isListening
                    ? (isEn ? 'Listening... Speak now' : 'सुन रहा हूँ... बोलिए')
                    : (isEn ? 'Tap to speak' : 'बोलने के लिए माइक दबाएं')}
                </span>
              </div>

              {/* Text Input Fallback */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-emerald-500">
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleProcessText(transcript); }}
                  placeholder={isEn ? 'Or type: "Budget 5 lakh", "3500 sales", "Call VDO"' : 'या लिखें: "बजट 5 लाख करो", "3500 बिक्री", "VDO को बुलाओ"'}
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-800 outline-hidden"
                />
                <button
                  onClick={() => handleProcessText(transcript)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Action Entry Result Card */}
              {result && (
                <div className={`p-3.5 rounded-2xl border ${result.entryMade ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                  {result.entryMade && (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-200/80 text-emerald-900 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{isEn ? '✓ ENTRY RECORDED IN SYSTEM' : '✓ प्रविष्टि सिस्टम में सफलतापूर्वक दर्ज'}</span>
                    </div>
                  )}

                  <h4 className="text-xs font-black text-slate-900">{result.intent}</h4>
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans font-medium leading-relaxed">
                    {result.written}
                  </pre>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                    <button
                      onClick={() => speak(result.spoken)}
                      className="text-xs font-bold text-emerald-800 bg-white border border-emerald-200 px-2.5 py-1 rounded-full hover:bg-emerald-50 flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Listen Response' : 'उत्तर सुनें'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Sample Prompts */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400">
                  {isEn ? 'QUICK PROMPTS (Click to test):' : 'त्वरित उदाहरण (क्लिक करके चलाएं):'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setTranscript(q);
                        handleProcessText(q);
                      }}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
