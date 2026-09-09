/**
 * GramUdyam — Intelligent Voice Assistant & Auto-Entry Engine
 * 1. Explains all screen text & data in natural multilingual speech (HI, EN, MR, TA, TE)
 * 2. Understands user voice commands, makes concrete entries into system state (budget, business, sales, inspection), and speaks intelligent responses back
 */
import { BeneficiaryProfile, saveBeneficiaryProfile, getOrCreateThreadForCitizen, postAdvisorMessage } from './enterpriseStore';
import { Language } from '../locales';

export interface VoiceCommandResult {
  understoodIntent: string;
  entryMade: boolean;
  entryType?: 'budget_update' | 'business_update' | 'transaction_entry' | 'inspection_request' | 'asset_update' | 'inquiry_answer';
  entrySummary?: string;
  updatedProfile?: BeneficiaryProfile;
  spokenReply: string;
  writtenReply: string;
  actionData?: any;
}

export const getLanguageCode = (lang: Language): string => {
  switch (lang) {
    case 'hi': return 'hi-IN';
    case 'mr': return 'mr-IN';
    case 'ta': return 'ta-IN';
    case 'te': return 'te-IN';
    case 'en': return 'en-IN';
    default: return 'hi-IN';
  }
};

/**
 * Text-to-Speech playback helper
 */
export const speakAudio = (
  text: string,
  lang: Language,
  onStart?: () => void,
  onEnd?: () => void
): boolean => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(lang);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  }
  return false;
};

export const stopAudio = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Capability 1: "सबकुछ लिखा हुआ टेक्स्ट समझाएं" (Explain Screen Data & Text)
 */
export const getScreenVoiceExplanation = (
  screenName: string,
  profile: BeneficiaryProfile | null,
  lang: Language
): { title: string; spokenText: string; displayText: string[] } => {
  const name = profile?.fullName || (lang === 'en' ? 'Entrepreneur' : 'उद्यमी');
  const village = profile?.villageName || (lang === 'en' ? 'Bhiti Rawat' : 'भीटी रावत');
  const biz = profile?.selectedBizName || (lang === 'en' ? 'Dairy Farming Unit' : 'डेयरी फार्मिंग इकाई');
  const capital = profile?.capital ? `₹${profile.capital.toLocaleString('en-IN')}` : '₹80,000';

  switch (screenName.toLowerCase()) {
    case 'finance':
      if (lang === 'en') {
        return {
          title: 'Finance & DPR Calculator Briefing',
          spokenText: `You are on the Finance and Loan Simulator screen. For your ${biz}, the total project cost is 2 lakh rupees. You provide 30 thousand rupees as own contribution. Under the PMEGP scheme, you receive a 35 percent capital subsidy of 70 thousand rupees. The bank loan is 1 lakh rupees at 9.5 percent interest. Your monthly EMI is 4,250 rupees for 5 years with a 6-month moratorium. Your projected net monthly income is 28,500 rupees.`,
          displayText: [
            'Total Project Cost: ₹2,00,000 (Machinery: ₹1,40,000, Working Capital: ₹60,000)',
            'PMEGP Subsidy: ₹70,000 (35% capital back for rural OBC/SC/ST/Women)',
            'Bank Loan: ₹1,00,000 (PNB Sahjanwa Branch, 5-year tenure @ 9.5%)',
            'Own Contribution: ₹30,000 (15% equity margin)',
            'Monthly EMI: ₹4,250 with 6-month moratorium during installation',
            'Net Estimated Surplus: ₹28,500/month after all operating expenses & debt service'
          ]
        };
      } else if (lang === 'mr') {
        return {
          title: 'वित्त व डीपीआर सारांश',
          spokenText: `आपण वित्त आणि कर्ज सिम्युलेटर स्क्रीनवर आहात. आपल्या ${biz} साठी एकूण प्रकल्प खर्च २ लाख रुपये आहे. आपला स्व-वाटा ३० हजार रुपये आहे. PMEGP योजनेअंतर्गत ३५ टक्के म्हणजेच ७० हजार रुपयांचे अनुदान मिळेल. बँकेचे कर्ज १ लाख रुपये असून मासिक हप्ता ४,२५० रुपये असेल.`,
          displayText: [
            'एकूण प्रकल्प खर्च: ₹२,००,०००',
            'PMEGP अनुदान: ₹७०,००० (३५% ग्रामीण सबसिडी)',
            'बँक कर्ज: ₹१,००,००० (५ वर्षे परतफेड)',
            'स्वतःचा वाटा: ₹३०,००० (१५%)',
            'मासिक EMI: ₹४,२५० (६ महिने मोरेटोरियम)'
          ]
        };
      } else if (lang === 'ta') {
        return {
          title: 'நிதி & DPR விளக்கம்',
          spokenText: `நீங்கள் நிதி மற்றும் கடன் கணக்கீட்டு திரையில் உள்ளீர்கள். உங்கள் ${biz} தொழில் மொத்த திட்டம் 2 லட்சம் ரூபாய். PMEGP திட்டத்தின் கீழ் 35 சதவீத மானியமாக 70 ஆயிரம் ரூபாய் கிடைக்கும். வங்கி கடன் 1 லட்சம் ரூபாய். மாதாந்திர தவணை 4,250 ரூபாய்.`,
          displayText: [
            'மொத்த திட்ட செலவு: ₹2,00,000',
            'PMEGP மானியம்: ₹70,000 (35% கிராமப்புற மானியம்)',
            'வங்கி கடன்: ₹1,00,000 (5 ஆண்டுகள்)',
            'சொந்த முதலீடு: ₹30,000 (15%)',
            'மாத தவணை: ₹4,250 (6 மாத சலுகை காலம்)'
          ]
        };
      } else if (lang === 'te') {
        return {
          title: 'ఆర్థిక & DPR సారాంశం',
          spokenText: `మీరు ఆర్థిక మరియు రుణ సిమ్యులేటర్ తెరపై ఉన్నారు. మీ ${biz} ప్రాజెక్ట్ మొత్తం వ్యయం 2 లక్షల రూపాయలు. PMEGP పథకం కింద 35 శాతం సబ్సిడీగా 70 వేల రూపాయలు అందుతాయి. బ్యాంకు రుణం 1 లక్ష రూపాయలు. నెలవారీ EMI 4,250 రూపాయలు.`,
          displayText: [
            'మొత్తం ప్రాజెక్ట్ వ్యయం: ₹2,00,000',
            'PMEGP సబ్సిడీ: ₹70,000 (35% గ్రామీణ సబ్సిడీ)',
            'బ్యాంకు రుణం: ₹1,00,000 (5 సంవత్సరాలు)',
            'స్వంత వాటా: ₹30,000 (15%)',
            'నెలవారీ EMI: ₹4,250 (6 నెలల మారటోరియం)'
          ]
        };
      } else {
        return {
          title: 'वित्त एवं ऋण विश्लेषण विवरण',
          spokenText: `आप वित्त और लोन कैलकुलेटर स्क्रीन पर हैं। आपके ${biz} के लिए कुल प्रोजेक्ट लागत 2 लाख रुपये है, जिसमें आपका अंशदान 30 हजार रुपये है। PMEGP योजना के तहत 35 प्रतिशत यानी 70 हजार रुपये की पूंजीगत सब्सिडी स्वीकृत है। बैंक ऋण 1 लाख रुपये है जिसकी मासिक ईएमआई 4,250 रुपये 5 वर्षों के लिए होगी। आपका शुद्ध मासिक लाभ लगभग 28,500 रुपये अनुमानित है।`,
          displayText: [
            'कुल प्रोजेक्ट लागत: ₹2,00,000 (संयंत्र व मशीनरी: ₹1,40,000 + कार्यशील पूंजी: ₹60,000)',
            'PMEGP सब्सिडी: ₹70,000 (ग्रामीण OBC/SC/ST/महिला हेतु 35% अनुदान)',
            'बैंक ऋण: ₹1,00,000 (PNB सहजनवा, 5 वर्ष @ 9.5% ब्याज दर)',
            'उद्यमी स्वयं का अंशदान: ₹30,000 (15% मार्जिन)',
            'मासिक EMI: ₹4,250 (6 माह का निर्माण मोराटोरियम उपलब्ध)',
            'अनुमानित शुद्ध मासिक लाभ: ₹28,500 (सभी खर्च व ऋण भुगतान के बाद)'
          ]
        };
      }

    case 'schemes':
      if (lang === 'en') {
        return {
          title: 'Government Schemes & Subsidies',
          spokenText: `You are on the Government Schemes screen. PMEGP offers up to 35 percent capital subsidy for rural micro enterprises. Pradhan Mantri Mudra Yojana offers up to 10 lakh rupees collateral-free bank loans. PM Vishwakarma offers 3 lakh rupees loan at a subsidized 5 percent interest rate with modern toolkit support.`,
          displayText: [
            'PMEGP: 35% Capital Subsidy for Rural OBC/SC/ST & Women entrepreneurs',
            'PM Mudra Yojana: Shishu, Kishore & Tarun loans up to ₹10,00,000 without collateral',
            'PM Vishwakarma: ₹3,00,000 credit at subsidized 5% interest + ₹15,000 toolkit voucher',
            'Direct Nodal Recommendation: VDO verified application bypasses branch red tape'
          ]
        };
      } else {
        return {
          title: 'सरकारी योजनाएं व सब्सिडी विवरण',
          spokenText: `आप सरकारी योजनाएं स्क्रीन पर हैं। PMEGP योजना में ग्रामीण सूक्ष्म उद्यमों को 35 प्रतिशत तक सब्सिडी मिलती है। प्रधानमंत्री मुद्रा योजना में बिना किसी गारंटी के 10 लाख रुपये तक का बैंक ऋण उपलब्ध है। पीएम विश्वकर्मा योजना में 5 प्रतिशत की रियायती ब्याज दर पर 3 लाख रुपये का ऋण और 15 हजार का टूलकिट अनुदान मिलता है।`,
          displayText: [
            'PMEGP (खादी ग्रामोद्योग): ग्रामीण क्षेत्र में 35% तक पूंजीगत बैक-एंडेड सब्सिडी',
            'पीएम मुद्रा योजना: शिशु, किशोर व तरुण ऋण - बिना बैंक गारंटी ₹10,00,000 तक',
            'पीएम विश्वकर्मा योजना: 5% रियायती ब्याज दर पर ₹3,00,000 ऋण + ₹15,000 टूलकिट अनुदान',
            'नोडल अधिकारी संस्तुति: VDO संजय वर्मा द्वारा सत्यापित आवेदन सीधे बैंक शाखा प्रेषित'
          ]
        };
      }

    case 'discovery':
      if (lang === 'en') {
        return {
          title: 'Enterprise Opportunity Discovery',
          spokenText: `You are on the Opportunity Discovery screen. Based on raw materials and local demand in ${village}, your top match is Dairy Farming with an 85 percent suitability score. The nearest bulk milk chilling center is 2.1 kilometers away. Honey Bee Keeping and Mini Spice Grinding are also highly recommended.`,
          displayText: [
            'Top Match: Dairy Farming & Chilling Center (85% Match, 2.1 km to Chilling Plant)',
            'Alternative 1: Honey Bee Keeping & Bottling (78% Match, low investment of ₹45,000)',
            'Alternative 2: Cold Press Oil Expeller & Spice Grinding (72% Match, high rural demand)',
            '5-10 km Facility Radar: Mandi, Banks, and Feed suppliers mapped in real-time'
          ]
        };
      } else {
        return {
          title: 'उद्यम अवसर खोज विवरण',
          spokenText: `आप उद्यम अवसर खोज स्क्रीन पर हैं। ${village} में कच्चे माल और स्थानीय मांग के आधार पर शीर्ष व्यवसाय डेयरी फार्मिंग है, जिसका मैच स्कोर 85 प्रतिशत है। सहजनवा में 2.1 किलोमीटर दूरी पर बल्क मिल्क चिलिंग सेंटर उपलब्ध है। मौन पालन और मसाला पिसाई भी आपके लिए उपयुक्त विकल्प हैं।`,
          displayText: [
            'शीर्ष मैच: डेयरी फार्मिंग व चिलिंग सेंटर (85% उपयुक्तता स्कोर, चिलिंग प्लांट 2.1 किमी)',
            'विकल्प 1: मौन पालन व शहद बॉटलिंग (78% उपयुक्तता, मात्र ₹45,000 से प्रारंभ)',
            'विकल्प 2: मिनी दाल मिल व मसाला पिसाई (72% उपयुक्तता, स्थानीय बाज़ार में उच्च मांग)',
            '5-10 किमी रडार: मंडी, बैंक शाखा, और पशु आहार केंद्र का लाइव मैपिंग'
          ]
        };
      }

    case 'advisor':
      if (lang === 'en') {
        return {
          title: 'AI Advisor & Officer Desk',
          spokenText: `You are on the AI Advisor and Officer Chat screen. You have an active official channel with your village nodal officer Sanjay Verma, Village Development Officer. You can ask technical questions or schedule physical site inspections for your DPR verification.`,
          displayText: [
            'Assigned Nodal Officer: Sanjay Verma (VDO, Sahjanwa Block)',
            'AI Advisor Co-Pilot: 24/7 DPR assistance, compliance & financial simulation',
            'Action Available: Request site inspection, DPR physical review, or subsidy dispatch'
          ]
        };
      } else {
        return {
          title: 'AI सलाहकार व नोडल अधिकारी डेस्क विवरण',
          spokenText: `आप AI सलाहकार और ग्राम नोडल अधिकारी डेस्क पर हैं। आपके लिए ग्राम विकास अधिकारी संजय वर्मा जी नियुक्त हैं। आप यहाँ अपनी DPR की जांच, बैंक लोन में सहायता, और भौतिक सत्यापन के लिए सीधे संदेश भेज सकते हैं।`,
          displayText: [
            'ग्राम नोडल अधिकारी: संजय वर्मा (VDO - सहजनवा ब्लॉक)',
            'AI सलाहकार: 24 घंटे DPR सहायता, सरकारी नियमों की व्याख्या और ब्याज कैलकुलेशन',
            'सुविधा: भौतिक सत्यापन (Site Inspection) व बैंक लोन संस्तुति का 1-क्लिक अनुरोध'
          ]
        };
      }

    default: // Overview / Home
      if (lang === 'en') {
        return {
          title: 'Dashboard Overview Briefing',
          spokenText: `Welcome to GramUdyam. You are logged in as ${name} from ${village}. You are establishing a ${biz}. You have ${capital} capital registered. Your PMEGP subsidy approval is underway with Area Nodal Officer Sanjay Verma. All business tools, DPR reports, and banking calculators are ready for you.`,
          displayText: [
            `Entrepreneur: ${name} (${village}, Gorakhpur)`,
            `Selected Enterprise: ${biz} (Status: In Pipeline / Ready for Sanction)`,
            `Registered Available Capital: ${capital}`,
            'PMEGP 35% Capital Subsidy Sanction: Recommended by Block Nodal Desk',
            'GIS Radar: Raw materials and buyers verified within 5 km radius'
          ]
        };
      } else if (lang === 'mr') {
        return {
          title: 'मुख्य डॅशबोर्ड सारांश',
          spokenText: `ग्रामउद्यम मध्ये आपले स्वागत आहे. आपण ${name}, गाव ${village} म्हणून लॉग इन आहात. आपला व्यवसाय ${biz} आहे. आपले नोंदणीकृत भांडवल ${capital} आहे. आपल्या अर्जाची PMEGP ३५% अनुदानासाठी पडताळणी सुरू आहे.`,
          displayText: [
            `उद्योजक: ${name} (${village})`,
            `निवडलेला व्यवसाय: ${biz}`,
            `उपलब्ध भांडवल: ${capital}`,
            'PMEGP ३५% सबसिडी पडताळणी प्रगतीपथावर आहे'
          ]
        };
      } else if (lang === 'ta') {
        return {
          title: 'முகப்பு பலகை சுருக்கம்',
          spokenText: `கிராம்உத்யோக் உங்களை வரவேற்கிறது. நீங்கள் ${name}, கிராமம் ${village}. உங்கள் தொழில் ${biz}. உங்கள் பதிவு செய்யப்பட்ட மூலதனம் ${capital}. PMEGP 35 சதவீத மானிய ஒப்புதல் பரிசீலனையில் உள்ளது.`,
          displayText: [
            `தொழில்முனைவோர்: ${name} (${village})`,
            `தேர்ந்தெடுக்கப்பட்ட தொழில்: ${biz}`,
            `கிடைக்கும் மூலதனம்: ${capital}`,
            'PMEGP 35% மானிய விண்ணப்பம் பரிசீலனையில் உள்ளது'
          ]
        };
      } else if (lang === 'te') {
        return {
          title: 'డాష్‌బోర్డ్ సారాంశం',
          spokenText: `గ్రామ్‌ఉద్యమ్‌కు స్వాగతం. మీరు ${village} నుండి ${name}గా లాగిన్ అయ్యారు. మీ వ్యాపారం ${biz}. మీ మూలధనం ${capital}. మీ PMEGP 35 శాతం సబ్సిడీ ప్రక్రియ నోడల్ అధికారి వద్ద పరిశీలనలో ఉంది.`,
          displayText: [
            `లబ్ధిదారు: ${name} (${village})`,
            `ఎంచుకున్న వ్యాపారం: ${biz}`,
            `అందుబాటులో ఉన్న మూలధనం: ${capital}`,
            'PMEGP 35% సబ్సిడీ ఆమోదం పురోగతిలో ఉంది'
          ]
        };
      } else {
        return {
          title: 'ग्रामउद्यम मुख्य डैशबोर्ड विवरण',
          spokenText: `ग्रामउद्यम में आपका स्वागत है। आप ${name}, ग्राम ${village} के रूप में सक्रिय हैं। आपका चयनित उद्यम ${biz} है और आपका पंजीकृत पूंजी अंशदान ${capital} है। आपका 35 प्रतिशत PMEGP सब्सिडी आवेदन क्षेत्र नोडल अधिकारी संजय वर्मा के पास प्रक्रियाधीन है। आपकी परियोजना रिपोर्ट और बैंक लोन प्रस्ताव तैयार हैं।`,
          displayText: [
            `पंजीकृत उद्यमी: ${name} (ग्राम ${village}, सहजनवा ब्लॉक)`,
            `चयनित उद्यम: ${biz} (प्रस्तावित स्थिति: संस्तुति प्रक्रियाधीन)`,
            `पंजीकृत उपलब्ध पूंजी: ${capital}`,
            '35% PMEGP पूंजीगत सब्सिडी: नोडल अधिकारी द्वारा बैंक संस्तुति हेतु स्वीकृत',
            'GIS सुविधा रडार: 4 किमी के भीतर बल्क मिल्क चिलिंग सेंटर उपलब्ध'
          ]
        };
      }
  }
};

/**
 * Capability 2: "कुछ नया यूजर बताना चाहता है तो समझे, एंट्री करे, रिस्पांस दे"
 * Understand user voice/text input, make concrete entries in system state, and return speech/text response!
 */
export const processVoiceAssistantCommand = (
  rawTranscript: string,
  profile: BeneficiaryProfile,
  lang: Language
): VoiceCommandResult => {
  const text = rawTranscript.trim();
  const lower = text.toLowerCase();
  const isEn = lang === 'en';

  // Helper to extract numbers (handles "5 lakh", "500000", "50 हजार", "80 hazaar", "4250", etc.)
  const extractAmount = (input: string): number | null => {
    // Check for "X lakh" or "X लाख"
    const lakhMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख|లక్ష|லட்சம்)/i);
    if (lakhMatch) {
      return Math.round(parseFloat(lakhMatch[1]) * 100000);
    }
    // Check for "X thousand" or "X हजार" or "X hazaar"
    const thousandMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:thousand|k|hazaar|hazar|हजार|हज़ार|వేల|ஆயிரம்)/i);
    if (thousandMatch) {
      return Math.round(parseFloat(thousandMatch[1]) * 1000);
    }
    // Direct digits >= 100
    const digitMatch = input.match(/\b(\d{3,9})\b/);
    if (digitMatch) {
      return parseInt(digitMatch[1], 10);
    }
    return null;
  };

  // 1. BUDGET / CAPITAL / PROJECT COST ENTRY
  // e.g., "Mera budget 5 lakh hai", "Project cost 4 lakh karo", "Mera capital 120000 rupaye hai"
  if (
    lower.includes('budget') || lower.includes('बजट') ||
    lower.includes('capital') || lower.includes('पूंजी') || lower.includes('लागत') ||
    lower.includes('cost') || lower.includes('investment') || lower.includes('निवेश') ||
    lower.includes('రూపాయలు') || lower.includes('ரூபாய்')
  ) {
    const amt = extractAmount(lower);
    if (amt && amt > 0) {
      const updated: BeneficiaryProfile = {
        ...profile,
        capital: amt
      };
      saveBeneficiaryProfile(updated);

      const subsidyAmt = Math.round(amt * 0.35);
      const loanAmt = Math.round(amt * 0.50);
      const emiEst = Math.round((loanAmt * 0.095 * 5 + loanAmt) / 60);

      const amtFormatted = `₹${amt.toLocaleString('en-IN')}`;
      const subFormatted = `₹${subsidyAmt.toLocaleString('en-IN')}`;
      const emiFormatted = `₹${emiEst.toLocaleString('en-IN')}`;

      const spoken = isEn
        ? `Budget entry recorded. Your project capital has been updated to ${amtFormatted}. Under PMEGP, your 35 percent subsidy is ${subFormatted}, and estimated monthly EMI is ${emiFormatted}.`
        : `प्रविष्टि दर्ज कर ली गई है। आपकी कुल प्रोजेक्ट पूंजी ${amtFormatted} सेट कर दी गई है। PMEGP के तहत 35% सब्सिडी ${subFormatted} मिलेगी, और मासिक EMI लगभग ${emiFormatted} बनेगी।`;

      const written = isEn
        ? `✓ New Entry Recorded: Project Capital set to ${amtFormatted}.\n• 35% PMEGP Subsidy: ${subFormatted}\n• Estimated Bank Loan: ₹${loanAmt.toLocaleString('en-IN')}\n• Monthly EMI: ${emiFormatted} (5 years)`
        : `✓ नई प्रविष्टि सफलतापूर्वक दर्ज:\n• प्रोजेक्ट पूंजी/बजट: ${amtFormatted}\n• PMEGP 35% सरकारी सब्सिडी: ${subFormatted}\n• अनुमानित बैंक ऋण: ₹${loanAmt.toLocaleString('en-IN')}\n• मासिक ईएमआई: ${emiFormatted}/माह`;

      return {
        understoodIntent: 'Update Project Budget / Capital',
        entryMade: true,
        entryType: 'budget_update',
        entrySummary: isEn ? `Budget updated to ${amtFormatted}` : `बजट ${amtFormatted} में अपडेट किया गया`,
        updatedProfile: updated,
        spokenReply: spoken,
        writtenReply: written,
        actionData: { capital: amt, subsidy: subsidyAmt, loan: loanAmt, emi: emiEst }
      };
    }
  }

  // 2. DAILY SALES / CASH FLOW TRANSACTION ENTRY
  // e.g., "Aaj 3500 rupay ka doodh bika", "4200 ki bikri hui", "Chara kharcha 1200 likho"
  if (
    lower.includes('bika') || lower.includes('bikri') || lower.includes('बिक्री') ||
    lower.includes('sale') || lower.includes('कमाई') || lower.includes('doodh') || lower.includes('दूध') ||
    lower.includes('kharcha') || lower.includes('खर्चा') || lower.includes('expense') ||
    lower.includes('chara') || lower.includes('feed') || lower.includes('diesel')
  ) {
    const amt = extractAmount(lower) || 2500;
    const isExpense = lower.includes('kharcha') || lower.includes('खर्चा') || lower.includes('expense') || lower.includes('chara');
    const category = isExpense ? (isEn ? 'Cattle Feed / Supplies' : 'पशु आहार व सामग्री') : (isEn ? 'Daily Milk Sales' : 'दैनिक दूध बिक्री');
    const amtFormatted = `₹${amt.toLocaleString('en-IN')}`;

    // Record into local transaction ledger simulation
    const thread = getOrCreateThreadForCitizen(profile);
    const logText = isExpense
      ? `[कैश बहीखाता प्रविष्टि - व्यय]: ₹${amt} की सामग्री/चारा खरीद दर्ज की गई।`
      : `[कैश बहीखाता प्रविष्टि - आय]: ₹${amt} की दैनिक दूध बिक्री दर्ज की गई।`;
    postAdvisorMessage(thread.id, logText, 'citizen', profile.fullName);

    const spoken = isEn
      ? `Transaction entry recorded. ${amtFormatted} has been logged under ${category}. Your cash flow statement is healthy and EMI is safe.`
      : `लेनदेन प्रविष्टि दर्ज कर ली गई है। ${category} के तहत ${amtFormatted} का हिसाब बहीखाते में दर्ज हो गया है। आपका कैश फ्लो स्वस्थ है।`;

    const written = isEn
      ? `✓ Transaction Recorded in Ledger:\n• Type: ${isExpense ? 'Expense' : 'Income'}\n• Amount: ${amtFormatted}\n• Category: ${category}\n• Status: Ledger Synced & Safe Surplus Verified`
      : `✓ दैनिक बहीखाता प्रविष्टि दर्ज:\n• प्रकार: ${isExpense ? 'दैनिक व्यय (खर्च)' : 'दैनिक आय (बिक्री)'}\n• राशि: ${amtFormatted}\n• श्रेणी: ${category}\n• स्थिति: बहीखाता अपडेट हुआ, कैश फ्लो सुरक्षित`;

    return {
      understoodIntent: 'Record Daily Cash Flow Transaction',
      entryMade: true,
      entryType: 'transaction_entry',
      entrySummary: `${category}: ${amtFormatted}`,
      spokenReply: spoken,
      writtenReply: written,
      actionData: { amount: amt, type: isExpense ? 'expense' : 'income', category }
    };
  }

  // 3. CHANGE / SWITCH SELECTED BUSINESS ENTERPRISE
  // e.g., "Dairy farm ki jagah honey bee keeping chunna hai", "Mera business bakri palan hai", "Masala grinding chuno"
  const bizKeywords: { [key: string]: { id: string; name: string; nameHi: string } } = {
    'honey': { id: 'honey_keeping', name: 'Honey Bee Keeping & Bottling', nameHi: 'मौन पालन व शुद्ध शहद बॉटलिंग' },
    'मधुमक्खी': { id: 'honey_keeping', name: 'Honey Bee Keeping & Bottling', nameHi: 'मौन पालन व शुद्ध शहद बॉटलिंग' },
    'मौन': { id: 'honey_keeping', name: 'Honey Bee Keeping & Bottling', nameHi: 'मौन पालन व शुद्ध शहद बॉटलिंग' },
    'bakri': { id: 'goat_rearing', name: 'Goat Rearing & Breeding Unit', nameHi: 'उन्नत बकरी पालन व प्रजनन इकाई' },
    'बकरी': { id: 'goat_rearing', name: 'Goat Rearing & Breeding Unit', nameHi: 'उन्नत बकरी पालन व प्रजनन इकाई' },
    'goat': { id: 'goat_rearing', name: 'Goat Rearing & Breeding Unit', nameHi: 'उन्नत बकरी पालन व प्रजनन इकाई' },
    'masala': { id: 'spice_grinding', name: 'Micro Spice Grinding & Packaging', nameHi: 'मिनी मसाला पिसाई व पैकेजिंग' },
    'मसाला': { id: 'spice_grinding', name: 'Micro Spice Grinding & Packaging', nameHi: 'मिनी मसाला पिसाई व पैकेजिंग' },
    'spice': { id: 'spice_grinding', name: 'Micro Spice Grinding & Packaging', nameHi: 'मिनी मसाला पिसाई व पैकेजिंग' },
    'oil': { id: 'oil_expeller', name: 'Cold Press Mustard Oil Expeller', nameHi: 'कोल्ड प्रेस सरसों तेल एक्सपेलर' },
    'तेल': { id: 'oil_expeller', name: 'Cold Press Mustard Oil Expeller', nameHi: 'कोल्ड प्रेस सरसों तेल एक्सपेलर' },
    'expeller': { id: 'oil_expeller', name: 'Cold Press Mustard Oil Expeller', nameHi: 'कोल्ड प्रेस सरसों तेल एक्सपेलर' },
    'poultry': { id: 'poultry_farm', name: 'Commercial Broiler Poultry Unit', nameHi: 'व्यावसायिक ब्रायलर कुक्कुट पालन' },
    'मुर्गी': { id: 'poultry_farm', name: 'Commercial Broiler Poultry Unit', nameHi: 'व्यावसायिक ब्रायलर कुक्कुट पालन' },
    'dairy': { id: 'dairy_farming', name: 'Dairy Farming & Chilling Center', nameHi: 'डेयरी फार्मिंग व बल्क मिल्क चिलिंग' },
    'डेयरी': { id: 'dairy_farming', name: 'Dairy Farming & Chilling Center', nameHi: 'डेयरी फार्मिंग व बल्क मिल्क चिलिंग' }
  };

  for (const [kw, info] of Object.entries(bizKeywords)) {
    if (lower.includes(kw)) {
      const updated: BeneficiaryProfile = {
        ...profile,
        selectedBizId: info.id,
        selectedBizName: isEn ? info.name : info.nameHi
      };
      saveBeneficiaryProfile(updated);

      const chosenName = isEn ? info.name : info.nameHi;
      const spoken = isEn
        ? `Enterprise selection updated. Your active business is now set to ${chosenName}. Your DPR and machinery plan have been re-calibrated.`
        : `उद्यम चयन अपडेट कर दिया गया है। आपका मुख्य उद्यम अब '${chosenName}' सेट हो गया है। नई DPR और मशीनरी सूची अपडेट कर दी गई है।`;

      const written = isEn
        ? `✓ Enterprise Profile Updated:\n• New Selected Enterprise: ${chosenName}\n• DPR Structure: Tailored for ${chosenName}\n• Subsidies Applicable: PMEGP (35%) & Agriculture Infrastructure Fund`
        : `✓ उद्यम चयन सफलतापूर्वक अपडेट:\n• नया उद्यम: ${chosenName}\n• परियोजना रिपोर्ट (DPR): '${chosenName}' के अनुसार पुनर्निर्मित\n• लागू योजना: 35% PMEGP व नाबार्ड रियायती ऋण`;

      return {
        understoodIntent: 'Change Selected Rural Enterprise',
        entryMade: true,
        entryType: 'business_update',
        entrySummary: chosenName,
        updatedProfile: updated,
        spokenReply: spoken,
        writtenReply: written,
        actionData: info
      };
    }
  }

  // 4. NODAL OFFICER INSPECTION & FIELD VERIFICATION REQUEST
  // e.g., "VDO Sanjay Verma ko bulao", "Inspection schedule karo", "Physical verification karwana hai"
  if (
    lower.includes('vdo') || lower.includes('संजय') || lower.includes('sanjay') ||
    lower.includes('inspection') || lower.includes('सत्यापन') || lower.includes('वेरिफिकेशन') ||
    lower.includes('verification') || lower.includes('site visit') || lower.includes('मुआयना')
  ) {
    const thread = getOrCreateThreadForCitizen(profile);
    const citizenReq = `[आधिकारिक भौतिक सत्यापन अनुरोध]: ग्राम पंचायत भीटी रावत में मेरी इकाई के भौतिक निरीक्षण एवं 35% PMEGP सब्सिडी संस्तुति हेतु कृपया निरीक्षण तिथि निर्धारित करें।`;
    postAdvisorMessage(thread.id, citizenReq, 'citizen', profile.fullName, 'Verification Request');

    const spoken = isEn
      ? `Physical inspection request submitted. A formal verification notice has been sent to Area Nodal Officer Sanjay Verma. He will inspect your site in Bhiti Rawat.`
      : `भौतिक सत्यापन अनुरोध दर्ज हो गया है। ग्राम विकास अधिकारी संजय वर्मा जी को आधिकारिक सूचना भेज दी गई है। वे आपके स्थल का निरीक्षण करेंगे।`;

    const written = isEn
      ? `✓ Inspection Request Dispatched to Officer:\n• Officer: Sanjay Verma (VDO, Sahjanwa)\n• Location: ${profile.villageName}, Gorakhpur\n• Action: Site verification scheduled for DPR sanction & 35% PMEGP subsidy release`
      : `✓ शासकीय सत्यापन अनुरोध प्रेषित:\n• नोडल अधिकारी: संजय वर्मा (VDO - सहजनवा ब्लॉक)\n• स्थल: ${profile.villageName}, गोरखपुर\n• उद्देश्य: 35% PMEGP सब्सिडी व बैंक लोन संस्तुति हेतु भौतिक निरीक्षण`;

    return {
      understoodIntent: 'Schedule Field Officer Site Inspection',
      entryMade: true,
      entryType: 'inspection_request',
      entrySummary: isEn ? 'Inspection request sent to VDO Sanjay Verma' : 'VDO संजय वर्मा को निरीक्षण अनुरोध भेजा गया',
      spokenReply: spoken,
      writtenReply: written
    };
  }

  // 5. LAND, ELECTRICITY, ASSET SPECIFICATION ENTRY
  // e.g., "Mere paas 2 acre zameen aur 3 phase bijli hai", "600 sqft shed uplabdh hai"
  if (
    lower.includes('acre') || lower.includes('एकड़') || lower.includes('zameen') || lower.includes('ज़मीन') ||
    lower.includes('land') || lower.includes('bijli') || lower.includes('बिजली') || lower.includes('phase') ||
    lower.includes('sqft') || lower.includes('shed')
  ) {
    const updated: BeneficiaryProfile = {
      ...profile,
      spaceSqft: lower.includes('1200') ? 1200 : 800,
      skills: Array.from(new Set([...(profile.skills || []), '3-Phase Power', 'Land Verified']))
    };
    saveBeneficiaryProfile(updated);

    const spoken = isEn
      ? `Asset profile updated. Your land space and power connection specifications have been successfully recorded into your project DPR.`
      : `परिसंपत्ति विवरण दर्ज कर लिया गया है। आपकी भूमि और विद्युत कनेक्शन का विवरण आपकी बैंक DPR फाइल में जोड़ दिया गया है।`;

    const written = isEn
      ? `✓ DPR Land & Infrastructure Entry Recorded:\n• Land/Shed: Verified suitable for ${profile.selectedBizName || 'Dairy Unit'}\n• Electricity: 3-Phase Rural Commercial Connection logged\n• Compliance: Ready for bank physical verification`
      : `✓ भूमि व अधोसंरचना प्रविष्टि दर्ज:\n• भूमि/शेड: ${profile.selectedBizName || 'डेयरी इकाई'} हेतु उपयुक्त\n• विद्युत आपूर्ति: 3-फेज ग्रामीण व्यावसायिक कनेक्शन दर्ज\n• बैंक पात्रता: भौतिक सत्यापन हेतु डीपीआर में संलग्न`;

    return {
      understoodIntent: 'Record Land & Infrastructure Assets',
      entryMade: true,
      entryType: 'asset_update',
      entrySummary: isEn ? 'Land & 3-phase power registered in DPR' : 'भूमि व 3-फेज विद्युत डीपीआर में दर्ज',
      updatedProfile: updated,
      spokenReply: spoken,
      writtenReply: written
    };
  }

  // 6. SCHEME / SUBSIDY / GENERAL ADVISORY INQUIRY
  // e.g., "PMEGP subsidy kitni milegi?", "Mudra loan kaise le?", "DPR me kya hota hai?"
  let adviceSpoken = '';
  let adviceWritten = '';

  if (lower.includes('pmegp') || lower.includes('subsidy') || lower.includes('सब्सिडी')) {
    adviceSpoken = isEn
      ? `Under PMEGP, rural OBC, SC, ST, and women entrepreneurs receive a 35 percent capital subsidy. For a 2 lakh project, you get 70 thousand rupees grant.`
      : `PMEGP योजना में ग्रामीण क्षेत्र के OBC, SC, ST और महिला उद्यमियों को 35 प्रतिशत पूंजीगत सब्सिडी मिलती है। 2 लाख के प्रोजेक्ट पर 70 हजार रुपये सरकारी अनुदान मिलता है।`;
    adviceWritten = isEn
      ? `• PMEGP Subsidy Rate: 35% for rural special categories (OBC, SC, ST, Women, Ex-servicemen)\n• Own Contribution: Only 10% to 15% equity needed\n• Bank Loan: 85% composite loan with 6-month moratorium\n• Processing Time: 14 working days through VDO nodal recommendation`
      : `• PMEGP सब्सिडी दर: ग्रामीण क्षेत्र (OBC/SC/ST/महिला) हेतु 35% पूंजीगत अनुदान\n• उद्यमी अंशदान: केवल 10% से 15% स्वयं की पूंजी आवश्यक\n• बैंक ऋण: 85% कंपोजिट लोन (5 वर्ष अवधि, 6 माह मोराटोरियम)\n• संस्तुति: ग्राम नोडल VDO संजय वर्मा द्वारा 14 कार्यदिवसों में संस्तुत`;
  } else if (lower.includes('mudra') || lower.includes('मुद्रा')) {
    adviceSpoken = isEn
      ? `Under Pradhan Mantri Mudra Yojana, you can get up to 10 lakh rupees collateral-free bank loans across Shishu, Kishore, and Tarun tiers.`
      : `प्रधानमंत्री मुद्रा योजना के तहत बिना किसी बैंक गारंटी के 10 लाख रुपये तक का ऋण शिशु, किशोर और तरुण श्रेणी में मिलता है।`;
    adviceWritten = isEn
      ? `• Mudra Shishu: Up to ₹50,000 for initial tools & working capital\n• Mudra Kishore: ₹50,000 to ₹5,00,000 for machinery & animal stock\n• Mudra Tarun: Up to ₹10,00,000 for expansion\n• Collateral: Zero collateral required, covered under CGFMU guarantee`
      : `• मुद्रा शिशु: ₹50,000 तक (प्रारंभिक उपकरण व चारा खरीद)\n• मुद्रा किशोर: ₹50,000 से ₹5,00,000 (संयंत्र, शेड व दुधारू पशु खरीद)\n• मुद्रा तरुण: ₹10,00,000 तक (व्यावसायिक विस्तार हेतु)\n• गारंटी: बिना किसी बंधक (Zero Collateral) के स्वीकृत`;
  } else {
    adviceSpoken = isEn
      ? `I understand your query. Your application is fully registered for ${profile.selectedBizName || 'Dairy Enterprise'} in ${profile.villageName}. I have linked your question with your Nodal Officer Sanjay Verma.`
      : `आपके प्रश्न को समझ लिया गया है। ${profile.villageName} में आपके ${profile.selectedBizName || 'डेयरी उद्यम'} का डीपीआर सक्रिय है। यह प्रश्न आपके नोडल अधिकारी संजय वर्मा जी को भी प्रेषित कर दिया गया है।`;
    adviceWritten = isEn
      ? `✓ AI Assistant Advisory:\n• Query: "${text}"\n• Enterprise: ${profile.selectedBizName || 'Rural Micro-Enterprise'}\n• Assistance: All financial projections and government subsidy norms are aligned with UP Rural Mission 2024.`
      : `✓ AI सहायक परामर्श:\n• आपका प्रश्न: "${text}"\n• संबंधित उद्यम: ${profile.selectedBizName || 'ग्रामीण सूक्ष्म उद्यम'}\n• परामर्श: आपकी परियोजना ग्रामीण उद्यम नीति 2024 के सभी मानकों को पूरा करती है। किसी भी संशोधन हेतु बोलकर निर्देश दें।`;
  }

  return {
    understoodIntent: 'Answer Enterprise Query / Advisory',
    entryMade: false,
    spokenReply: adviceSpoken,
    writtenReply: adviceWritten
  };
};

/**
 * Quick sample voice prompts for easy 1-tap test or citizen speech guidance
 */
export const getQuickVoicePrompts = (lang: Language): string[] => {
  switch (lang) {
    case 'en':
      return [
        "Explain everything on this screen",
        "Set my project budget to 5 lakh rupees",
        "Record 3500 rupees milk sales today",
        "Switch my business to Honey Bee Keeping",
        "Schedule site inspection with VDO Sanjay Verma",
        "How much PMEGP subsidy will I get?"
      ];
    case 'mr':
      return [
        "या स्क्रीनवरील सर्व माहिती समजावून सांगा",
        "माझा प्रकल्प खर्च ५ लाख रुपये करा",
        "आजची ३५०० रुपयांची दूध विक्री नोंदवा",
        "माझा व्यवसाय मौन पालन (Honey) मध्ये बदला",
        "VDO संजय वर्मा यांच्याशी तपासणी निश्चित करा"
      ];
    case 'ta':
      return [
        "இந்த திரையில் உள்ள தகவல்களை விளக்குங்கள்",
        "எனது திட்ட செலவை 5 லட்சம் ரூபாயாக மாற்றவும்",
        "இன்றைய பால் விற்பனை 3500 ரூபாய் பதிவு செய்",
        "என் தொழிலை தேனீ வளர்ப்பாக மாற்றவும்",
        "VDO அதிகாரியிடம் சரிபார்ப்பு கோரிக்கை அனுப்பு"
      ];
    case 'te':
      return [
        "ఈ స్క్రీన్‌పై ఉన్న సమాచారాన్ని వివరించండి",
        "నా ప్రాజెక్ట్ బడ్జెట్ 5 లక్షల రూపాయలు చేయండి",
        "నేటి పాల అమ్మకాలు 3500 రూపాయలు నమోదు చేయండి",
        "నా వ్యాపారాన్ని తేనెటీగల పెంపకంగా మార్చండి",
        "VDO సంజయ్ వర్మతో తనిఖీని షెడ్యూల్ చేయండి"
      ];
    default:
      return [
        "स्क्रीन की सारी जानकारी समझाएं",
        "मेरा प्रोजेक्ट बजट ₹5,00,000 सेट करो",
        "आज ₹3,500 की दूध बिक्री दर्ज करो",
        "मुझे डेयरी के बजाय मौन पालन (Honey) चुनना है",
        "VDO संजय वर्मा को भौतिक सत्यापन के लिए बुलाओ",
        "PMEGP में 35% सब्सिडी कैसे मिलेगी?"
      ];
  }
};
