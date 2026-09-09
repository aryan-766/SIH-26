export type Language = 'hi' | 'en' | 'mr' | 'ta';

export interface Translations {
  appName: string;
  tagline: string;
  selectLanguage: string;
  continueBtn: string;
  listeningVoice: string;
  speakToSelect: string;
  
  // Navigation
  navDiscovery: string;
  navCompare: string;
  navFinances: string;
  navSchemes: string;
  navLaunch: string;
  navCopilot: string;
  navAdvisor: string;
  fieldOfficerMode: string;

  // Profile
  beneficiaryProfile: string;
  userName: string;
  userVillage: string;
  skillsDairyAgri: string;
  availableCapital: string;
  selectSkills: string;
  landSpace: string;
  experience: string;
  constraints: string;
  myProfile: string;
  editProfile: string;
  closeBtn: string;
  findOpportunities: string;

  // Radar
  nearbyFacilities: string;
  facility5km: string;
  facility10km: string;
  competitors: string;
  chillingCenter: string;
  mandi: string;
  banks: string;
  suppliers: string;
  radarRadiusInfo: string;

  // Discovery
  recommendedBusinesses: string;
  recommendedSubtitle: string;
  estimatedInvestment: string;
  expectedMargin: string;
  riskLevel: string;
  equipment: string;
  details: string;
  viewRadar: string;
  compareOptions: string;

  // Finance & DPR
  financeTitle: string;
  financeSubtitle: string;
  totalProjectCost: string;
  ownContribution: string;
  moratoriumPeriod: string;
  months: string;
  emiSubsidySummary: string;
  generateDpr: string;
  dprDownloadSuccess: string;

  // Schemes
  schemesTitle: string;
  schemesSubtitle: string;
  subsidyRate: string;
  collateralFree: string;
  applyScheme: string;

  // Checklist
  checklistTitle: string;
  checklistSubtitle: string;
  completedSteps: string;

  // Module 3 Copilot
  copilotTitle: string;
  copilotSubtitle: string;
  dailyIncome: string;
  dailyExpense: string;
  recordTx: string;
  healthStatus: string;
  healthSurplusNotice: string;
  askAdvicePlaceholder: string;
  askAdviceBtn: string;
  quickLedger: string;
  amountRs: string;
  descriptionPlaceholder: string;

  // Field Officer
  fieldOfficerTitle: string;
  fieldOfficerSubtitle: string;
  offlineCacheTitle: string;
  offlineCacheDesc: string;
  tokenActive24h: string;
  localSavedSurveys: string;
  syncBtn: string;
  syncing: string;
  syncedBadge: string;
  localBadge: string;

  // System Badges & Voice
  dpdpComplianceText: string;
  demoOtpText: string;
  voiceNarrationDiscovery: string;
  voiceNarrationFinance: string;
  voiceNarrationCopilot: string;
}

export const translations: Record<Language, Translations> = {
  hi: {
    appName: "ग्रामउद्यम",
    tagline: "ग्रामीण उद्यम एवं आजीविका इंटेलिजेंस मंच",
    selectLanguage: "अपनी भाषा चुनें",
    continueBtn: "आगे बढ़ें",
    listeningVoice: "सुन रहा हूँ... बोलिए",
    speakToSelect: "माइक दबाकर बोलें: 'डेयरी' या '80 हजार पूंजी'",

    navDiscovery: "अवसर खोज",
    navCompare: "तुलना",
    navFinances: "ऋण एवं डीपीआर",
    navSchemes: "सरकारी योजनाएं",
    navLaunch: "लॉन्च चेकलिस्ट",
    navCopilot: "बिजनेस कोपायलट",
    navAdvisor: "सलाहकार चैट",
    fieldOfficerMode: "फील्ड ऑफिसर मोड",

    beneficiaryProfile: "लाभार्थी प्रोफाइल",
    userName: "रमेश कुमार यादव",
    userVillage: "भीटी रावत (गोरखपुर)",
    skillsDairyAgri: "डेयरी / कृषि",
    availableCapital: "उपलब्ध पूंजी",
    selectSkills: "हुनर एवं अनुभव",
    landSpace: "उपलब्ध जगह",
    experience: "कार्य अनुभव",
    constraints: "पारिवारिक जरूरतें / सीमाएं",
    myProfile: "मेरी प्रोफाइल",
    editProfile: "मेरी प्रोफाइल संपादन",
    closeBtn: "बंद करें",
    findOpportunities: "अवसर खोजें",

    nearbyFacilities: "स्थानीय 5-10 किमी रडार",
    facility5km: "5 किमी दायरा",
    facility10km: "10 किमी दायरा",
    competitors: "प्रतिस्पर्धी",
    chillingCenter: "दूध चिलिंग केंद्र",
    mandi: "कृषि उपज मंडी",
    banks: "बैंक शाखाएं",
    suppliers: "कच्चा माल एवं चारा विक्रेता",
    radarRadiusInfo: "आपके गांव भीटी रावत से 5 किमी एवं 10 किमी दायरे में उपलब्ध सुविधाएं",

    recommendedBusinesses: "सुझाए गए उद्यम",
    recommendedSubtitle: "आपकी पूंजी, हुनर और स्थानीय मांग के आधार पर",
    estimatedInvestment: "अनुमानित निवेश",
    expectedMargin: "अपेक्षित मार्जिन",
    riskLevel: "जोखिम स्तर",
    equipment: "उपकरण",
    details: "विस्तार",
    viewRadar: "5-10 किमी रडार देखें",
    compareOptions: "विकल्पों की तुलना करें",

    financeTitle: "वित्तीय एवं ऋण सिमुलेटर",
    financeSubtitle: "कुल लागत, सब्सिडी और मासिक EMI की गणना",
    totalProjectCost: "कुल प्रोजेक्ट लागत",
    ownContribution: "अपना अंशदान",
    moratoriumPeriod: "मोरेटोरियम अवधि (किश्त में छूट)",
    months: "महीने",
    emiSubsidySummary: "सरकारी सब्सिडी एवं बैंक ऋण संरचना",
    generateDpr: "डीपीआर (DPR) तैयार करें",
    dprDownloadSuccess: "डीपीआर बैंक प्रारूप में डाउनलोड हो गया",

    schemesTitle: "पात्र सरकारी योजनाएं",
    schemesSubtitle: "PMEGP, मुद्रा एवं PMFME की सब्सिडी एवं ब्याज दरें",
    subsidyRate: "सब्सिडी दर",
    collateralFree: "बिना गारंटी ऋण",
    applyScheme: "आवेदन प्रारंभ करें",

    checklistTitle: "उद्यम स्थापना चेकलिस्ट",
    checklistSubtitle: "बिजनेस लॉन्च करने के 5 महत्वपूर्ण चरण",
    completedSteps: "चरण पूर्ण",

    copilotTitle: "एआई बिजनेस कोपायलट",
    copilotSubtitle: "रोजाना बिक्री, खर्च एवं एआई सलाहकार",
    dailyIncome: "आज की बिक्री (कमाई)",
    dailyExpense: "आज का खर्च (दाना/ईंधन)",
    recordTx: "हिसाब दर्ज करें",
    healthStatus: "व्यापार स्वास्थ्य",
    healthSurplusNotice: "ईएमआई सुरक्षित • नकदी अधिशेष",
    askAdvicePlaceholder: "पूछें: 'दाना महंगा हो गया है, क्या करूँ?'",
    askAdviceBtn: "सलाह लें",
    quickLedger: "दैनिक हिसाब दर्ज करें",
    amountRs: "रकम ₹",
    descriptionPlaceholder: "विवरण (जैसे: 24L दूध आपूर्ति)",

    fieldOfficerTitle: "फील्ड ऑफिसर सहायक मोड",
    fieldOfficerSubtitle: "गांव में ऑफलाइन सर्वे, वॉयस इंटरव्यू एवं सिंक",
    offlineCacheTitle: "ऑफलाइन डेटा स्टोरेज",
    offlineCacheDesc: "इंटरनेट न होने पर भी आप फोन में डेटा सहेज सकते हैं। नेटवर्क आने पर 1-क्लिक में सिंक होगा।",
    tokenActive24h: "24h टोकन सक्रिय",
    localSavedSurveys: "स्थानीय रूप से सहेजे गए सर्वे",
    syncBtn: "केंद्रीय सर्वर पर सिंक करें",
    syncing: "सिंक हो रहा है...",
    syncedBadge: "सिंक हुआ ✓",
    localBadge: "लोकल सेव",

    dpdpComplianceText: "DPDP Act 2023 अनुपालन (सहमति सैंडबॉक्स)",
    demoOtpText: "डेमो ओटीपी: 123456",
    voiceNarrationDiscovery: "आपके लिए सबसे उपयुक्त बिजनेस डेयरी फार्मिंग है, जिसमें 85 प्रतिशत मैच स्कोर है और चिलिंग सेंटर 4 किलोमीटर दूर है।",
    voiceNarrationFinance: "आपको दो लाख रुपये का लोन और सत्तर हजार रुपये पीएमईजीपी सब्सिडी मिलेगी। मासिक ईएमआई 4,250 रुपये होगी।",
    voiceNarrationCopilot: "आपका दैनिक कैश फ्लो स्वस्थ है। पिछले हफ्ते आपने बारह हजार रुपये की बिक्री की है।"
  },
  en: {
    appName: "GramUdyam",
    tagline: "Rural Enterprise & Livelihood Intelligence Platform",
    selectLanguage: "Select Your Language",
    continueBtn: "Continue",
    listeningVoice: "Listening... Speak now",
    speakToSelect: "Tap mic and say: 'Dairy' or '80 thousand capital'",

    navDiscovery: "Discovery",
    navCompare: "Compare",
    navFinances: "Finance & DPR",
    navSchemes: "Govt Schemes",
    navLaunch: "Launch Checklist",
    navCopilot: "Business Copilot",
    navAdvisor: "Advisor Chat",
    fieldOfficerMode: "Field Officer Mode",

    beneficiaryProfile: "Beneficiary Profile",
    userName: "Ramesh Kumar Yadav",
    userVillage: "Bhiti Rawat (Gorakhpur)",
    skillsDairyAgri: "Dairy / Agriculture",
    availableCapital: "Available Capital",
    selectSkills: "Skills & Experience",
    landSpace: "Available Space",
    experience: "Work Experience",
    constraints: "Family Constraints",
    myProfile: "My Profile",
    editProfile: "Edit Beneficiary Profile",
    closeBtn: "Close",
    findOpportunities: "Find Opportunities",

    nearbyFacilities: "Local 5-10 km Facility Radar",
    facility5km: "5 km Radius",
    facility10km: "10 km Radius",
    competitors: "Competitors",
    chillingCenter: "Milk Chilling Center",
    mandi: "Produce Mandi / Market",
    banks: "Rural Banks",
    suppliers: "Feeds & Equipment",
    radarRadiusInfo: "Commercial infrastructure available within 5km and 10km of Bhiti Rawat village",

    recommendedBusinesses: "Recommended Enterprises",
    recommendedSubtitle: "Ranked by your capital, skills and local spatial demand",
    estimatedInvestment: "Estimated Investment",
    expectedMargin: "Expected Margin",
    riskLevel: "Risk Level",
    equipment: "Equipment",
    details: "Details",
    viewRadar: "View 5-10km Radar",
    compareOptions: "Compare Alternatives",

    financeTitle: "Financial & Loan Simulator",
    financeSubtitle: "Compute project cost, subsidy entitlement, and monthly EMI",
    totalProjectCost: "Total Project Cost",
    ownContribution: "Own Contribution",
    moratoriumPeriod: "Moratorium Grace Period",
    months: "Months",
    emiSubsidySummary: "Subsidy & Bank Term Loan Structure",
    generateDpr: "Generate Bank-Ready DPR",
    dprDownloadSuccess: "DPR downloaded in bank appraisal format",

    schemesTitle: "Eligible Government Schemes",
    schemesSubtitle: "PMEGP, MUDRA and PMFME subsidies & interest subvention",
    subsidyRate: "Subsidy Rate",
    collateralFree: "Collateral-Free",
    applyScheme: "Start Application",

    checklistTitle: "Enterprise Launch Countdown",
    checklistSubtitle: "5 statutory and operational steps to launch",
    completedSteps: "Steps Completed",

    copilotTitle: "AI Business Copilot",
    copilotSubtitle: "Daily ledger sales, expenses and advisory assistant",
    dailyIncome: "Daily Income (Sales)",
    dailyExpense: "Daily Expense (Fodder/Fuel)",
    recordTx: "Log Transaction",
    healthStatus: "Operational Health",
    healthSurplusNotice: "EMI Covered • Cash Surplus",
    askAdvicePlaceholder: "Ask: 'Fodder prices increased, what should I do?'",
    askAdviceBtn: "Get Advice",
    quickLedger: "Quick Daily Ledger",
    amountRs: "Amount ₹",
    descriptionPlaceholder: "Description (e.g. 24L morning milk supply)",

    fieldOfficerTitle: "Field Officer Assistant Mode",
    fieldOfficerSubtitle: "Offline village survey, voice interview & sync queue",
    offlineCacheTitle: "Offline Local Storage",
    offlineCacheDesc: "Collect beneficiary registrations and voice recordings offline. Syncs in 1-click once reconnected.",
    tokenActive24h: "24h Offline Token Active",
    localSavedSurveys: "Locally Cached Surveys",
    syncBtn: "Sync to Central Mission Server",
    syncing: "Syncing...",
    syncedBadge: "Synced ✓",
    localBadge: "Local Cache",

    dpdpComplianceText: "DPDP Act 2023 Compliant (Consent Sandbox)",
    demoOtpText: "Demo OTP: 123456",
    voiceNarrationDiscovery: "Dairy Farming is your top match with an 85% suitability score, and a bulk milk chilling center is 2.1 kilometers away.",
    voiceNarrationFinance: "You are eligible for a two lakh rupee loan with seventy thousand rupee PMEGP subsidy. Monthly EMI will be 4,250 rupees.",
    voiceNarrationCopilot: "Your daily cash flow is healthy. You recorded twelve thousand rupees of sales over the past week."
  },
  mr: {
    appName: "ग्रामउद्यम",
    tagline: "ग्रामीण उद्योग आणि उपजीविका बुद्धिमत्ता मंच",
    selectLanguage: "आपली भाषा निवडा",
    continueBtn: "पुढे जा",
    listeningVoice: "ऐकत आहे... बोला",
    speakToSelect: "माइक दाबून बोला: 'डेअरी' किंवा 'भांडवल'",

    navDiscovery: "संधी शोधा",
    navCompare: "तुलना",
    navFinances: "प्रकल्प अहवाल",
    navSchemes: "सरकारी योजना",
    navLaunch: "सुरुवात चेकलिस्ट",
    navCopilot: "व्यवसाय साथीदार",
    navAdvisor: "सल्लागार चॅट",
    fieldOfficerMode: "फील्ड ऑफिसर मोड",

    beneficiaryProfile: "लाभार्थी प्रोफाइल",
    userName: "रमेश कुमार यादव",
    userVillage: "भीटी रावत (गोरखपूर)",
    skillsDairyAgri: "डेअरी / शेती",
    availableCapital: "उपलब्ध भांडवल",
    selectSkills: "कौशल्ये आणि अनुभव",
    landSpace: "उपलब्ध जागा",
    experience: "अनुभव",
    constraints: "कौटुंबिक मर्यादा",
    myProfile: "माझे प्रोफाईल",
    editProfile: "प्रोफाईल संपादन",
    closeBtn: "बंद करा",
    findOpportunities: "संधी शोधा",

    nearbyFacilities: "स्थानिक ५-१० किमी रडार",
    facility5km: "५ किमी त्रिज्या",
    facility10km: "१० किमी त्रिज्या",
    competitors: "स्पर्धक",
    chillingCenter: "दूध संकलन केंद्र",
    mandi: "बाजार समिती",
    banks: "बँक शाखा",
    suppliers: "चारा व यंत्रे",
    radarRadiusInfo: "गावापासून ५ व १० किमी परिसरातील सुविधा",

    recommendedBusinesses: "शिफारस केलेले व्यवसाय",
    recommendedSubtitle: "भांडवल, कौशल्ये आणि स्थानिक मागणीनुसार",
    estimatedInvestment: "अंदाजे गुंतवणूक",
    expectedMargin: "अपेक्षित नफा",
    riskLevel: "धोका पातळी",
    equipment: "साहित्य",
    details: "तपशील",
    viewRadar: "रडार पहा",
    compareOptions: "तुलना करा",

    financeTitle: "वित्तीय व कर्ज सिम्युलेटर",
    financeSubtitle: "एकूण खर्च, सबसिडी आणि मासिक हप्ता",
    totalProjectCost: "एकूण प्रकल्प खर्च",
    ownContribution: "स्वतःचे भांडवल",
    moratoriumPeriod: "हप्ता सवलत कालावधी",
    months: "महिने",
    emiSubsidySummary: "सबसिडी आणि बँक कर्ज",
    generateDpr: "डीपीआर अहवाल तयार करा",
    dprDownloadSuccess: "डीपीआर डाउनलोड झाला",

    schemesTitle: "पात्र सरकारी योजना",
    schemesSubtitle: "PMEGP, मुद्रा आणि PMFME सबसिडी",
    subsidyRate: "सबसिडी दर",
    collateralFree: "विनातारण कर्ज",
    applyScheme: "अर्ज करा",

    checklistTitle: "सुरुवात चेकलिस्ट",
    checklistSubtitle: "व्यवसाय सुरू करण्याचे ५ टप्पे",
    completedSteps: "टप्पे पूर्ण",

    copilotTitle: "एआय व्यवसाय साथीदार",
    copilotSubtitle: "दैनिक विक्री, खर्च आणि सल्लागार",
    dailyIncome: "आजची कमाई",
    dailyExpense: "आजचा खर्च",
    recordTx: "नोंद करा",
    healthStatus: "व्यवसाय आरोग्य",
    healthSurplusNotice: "हप्ता सुरक्षित • नफा शिल्लक",
    askAdvicePlaceholder: "विचारा: 'चारा महाग झाला आहे, काय करू?'",
    askAdviceBtn: "सल्ला घ्या",
    quickLedger: "दैनिक नोंदवही",
    amountRs: "रक्कम ₹",
    descriptionPlaceholder: "तपशील (उदा. दूध विक्री)",

    fieldOfficerTitle: "फील्ड ऑफिसर मोड",
    fieldOfficerSubtitle: "ऑफलाइन सर्वेक्षण आणि डेटा सिंक",
    offlineCacheTitle: "ऑफलाइन स्टोरेज",
    offlineCacheDesc: "इंटरनेट नसतानाही सर्वेक्षण नोंदवा. नंतर एका क्लिकमध्ये सिंक करा.",
    tokenActive24h: "२४ तास टोकन सक्रिय",
    localSavedSurveys: "जतन केलेले सर्वेक्षण",
    syncBtn: "सर्व्हरवर सिंक करा",
    syncing: "सिंक होत आहे...",
    syncedBadge: "सिंक झाले ✓",
    localBadge: "स्थानिक जतन",

    dpdpComplianceText: "DPDP Act 2023 अनुपालन (सहमती सँडबॉक्स)",
    demoOtpText: "डेमो ओटीपी: 123456",
    voiceNarrationDiscovery: "आपल्यासाठी डेअरी फार्मिंग हा सर्वोत्तम व्यवसाय आहे.",
    voiceNarrationFinance: "आपल्याला दोन लाख रुपयांचे कर्ज आणि सबसिडी मिळेल.",
    voiceNarrationCopilot: "आपला व्यवसाय चांगल्या स्थितीत आहे."
  },
  ta: {
    appName: "கிராமஉத்யம்",
    tagline: "கிராமப்புற தொழில் நுண்ணறிவு தளம்",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    continueBtn: "தொடரவும்",
    listeningVoice: "கேட்கிறது... பேசவும்",
    speakToSelect: "பேசவும்...",

    navDiscovery: "வாய்ப்புகள்",
    navCompare: "ஒப்பீடு",
    navFinances: "திட்ட நிதி",
    navSchemes: "அரசு திட்டங்கள்",
    navLaunch: "தொடங்க பட்டியல்",
    navCopilot: "தொழில் வழிகாட்டி",
    navAdvisor: "ஆலோசகர் அரட்டை",
    fieldOfficerMode: "கள அலுவலர் முறை",

    beneficiaryProfile: "பயனாளி விவரம்",
    userName: "ரமேஷ் குமார் யாதவ்",
    userVillage: "பீட்டி ராவத் (கோரக்பூர்)",
    skillsDairyAgri: "பால் பண்ணை / விவசாயம்",
    availableCapital: "மூலதனம்",
    selectSkills: "திறன்கள்",
    landSpace: "இடம்",
    experience: "அனுபவம்",
    constraints: "வரம்புகள்",
    myProfile: "என் விவரம்",
    editProfile: "விவரம் திருத்து",
    closeBtn: "மூடு",
    findOpportunities: "வாய்ப்புகளை தேடு",

    nearbyFacilities: "அருகிலுள்ள வசதிகள்",
    facility5km: "5 கி.மீ",
    facility10km: "10 கி.மீ",
    competitors: "போட்டியாளர்கள்",
    chillingCenter: "பால் மையம்",
    mandi: "சந்தை",
    banks: "வங்கிகள்",
    suppliers: "சப்ளையர்கள்",
    radarRadiusInfo: "5 மற்றும் 10 கி.மீ சுற்றளவில் உள்ள வசதிகள்",

    recommendedBusinesses: "பரிந்துரைக்கப்பட்ட தொழில்கள்",
    recommendedSubtitle: "மூலதனம் மற்றும் திறன்கள் அடிப்படையில்",
    estimatedInvestment: "மதிப்பிடப்பட்ட முதலீடு",
    expectedMargin: "எதிர்பார்க்கப்படும் லாபம்",
    riskLevel: "அபாய நிலை",
    equipment: "கருவிகள்",
    details: "விவரம்",
    viewRadar: "ரடார் பார்",
    compareOptions: "ஒப்பிடு",

    financeTitle: "திட்ட நிதி மற்றும் கடன்",
    financeSubtitle: "மானியம் மற்றும் மாதாந்திர தவணை கணக்கீடு",
    totalProjectCost: "திட்ட செலவு",
    ownContribution: "சொந்த முதலீடு",
    moratoriumPeriod: "தவணை சலுகை காலம்",
    months: "மாதங்கள்",
    emiSubsidySummary: "மானியம் மற்றும் கடன் விவரம்",
    generateDpr: "DPR அறிக்கை தயார் செய்",
    dprDownloadSuccess: "DPR பதிவிறக்கம் செய்யப்பட்டது",

    schemesTitle: "அரசு திட்டங்கள்",
    schemesSubtitle: "PMEGP மற்றும் முத்ரா மானியங்கள்",
    subsidyRate: "மானிய விகிதம்",
    collateralFree: "பிணையில்லா கடன்",
    applyScheme: "விண்ணப்பிக்க",

    checklistTitle: "தொழில் தொடக்க பட்டியல்",
    checklistSubtitle: "தொழில் தொடங்குவதற்கான 5 படிகள்",
    completedSteps: "படிகள் முடிந்தது",

    copilotTitle: "AI தொழில் வழிகாட்டி",
    copilotSubtitle: "தினசரி கணக்கு மற்றும் ஆலோசனை",
    dailyIncome: "தினசரி வருமானம்",
    dailyExpense: "செலவு",
    recordTx: "பதிவு செய்க",
    healthStatus: "தொழில் நிலை",
    healthSurplusNotice: "தவணை பாதுகாப்பு • லாபம்",
    askAdvicePlaceholder: "கேளுங்கள்...",
    askAdviceBtn: "வழிகாட்டல் பெறு",
    quickLedger: "தினசரி கணக்கு",
    amountRs: "தொகை ₹",
    descriptionPlaceholder: "விவரம்",

    fieldOfficerTitle: "கள அலுவலர் முறை",
    fieldOfficerSubtitle: "ஆஃப்லைன் கணக்கெடுப்பு மற்றும் ஒத்திசைவு",
    offlineCacheTitle: "ஆஃப்லைன் சேமிப்பு",
    offlineCacheDesc: "இணையம் இல்லாதபோதும் தரவை சேமிக்கலாம். பின்னர் ஒத்திசைக்கலாம்.",
    tokenActive24h: "24 மணி நேர டோக்கன்",
    localSavedSurveys: "சேமிக்கப்பட்ட கணக்கெடுப்புகள்",
    syncBtn: "ஒத்திசைக்க",
    syncing: "ஒத்திசைக்கிறது...",
    syncedBadge: "முடிந்தது ✓",
    localBadge: "உள்ளூர் சேமிப்பு",

    dpdpComplianceText: "DPDP Act 2023 இணக்கம்",
    demoOtpText: "டெமோ OTP: 123456",
    voiceNarrationDiscovery: "பால் பண்ணை உங்களுக்கு மிகவும் பொருத்தமான தொழில்.",
    voiceNarrationFinance: "உங்களுக்கு இரண்டு லட்சம் கடன் மற்றும் மானியம் கிடைக்கும்.",
    voiceNarrationCopilot: "உங்கள் தொழில் நல்ல நிலையில் உள்ளது."
  }
};
