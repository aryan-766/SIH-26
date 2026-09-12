export type Language = 'hi' | 'en' | 'mr' | 'ta' | 'te';

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

  // Schemes Hub — Sub-tabs
  schTabRecommended: string;
  schTabEligibility: string;
  schTabDocuments: string;
  schTabCompare: string;
  schTabTracking: string;

  // Schemes Hub — Best Scheme Card
  schBestTag: string;
  schBestReason: string;
  schMatchScore: string;
  schAdvantages: string;
  schSetActive: string;
  schApplyNow: string;
  schOtherSchemes: string;
  schSwitchToFinance: string;
  schCurrentlyActive: string;

  // Schemes Hub — Eligibility
  schEligibilityFor: string;
  schEligibilitySummary: string;
  schEligibilityPassed: string;
  schEligibilityWarning: string;
  schEligibilityFailed: string;
  schStatutoryNote: string;
  schOverallMatch: string;

  // Schemes Hub — Documents
  schDocumentsFor: string;
  schDocReadiness: string;
  schDocVerified: string;
  schDocGenerated: string;
  schDocUploaded: string;
  schDocPending: string;
  schDocMandatory: string;
  schDocOptional: string;

  // Schemes Hub — Compare
  schCompareTitle: string;
  schCompareFilter: string;
  schCompareFilterAll: string;
  schCompareFilterFinancial: string;
  schCompareFilterTerms: string;
  schCompareSelectSchemes: string;

  // Schemes Hub — Tracking / Pipeline
  schTrackingTitle: string;
  schTrackingAppId: string;
  schTrackingDate: string;
  schTrackingChannel: string;
  schTrackingStatus: string;
  schNoApplications: string;

  // Application Modal
  schModalTitle: string;
  schModalChannelOnline: string;
  schModalChannelVDO: string;
  schModalChannelDossier: string;
  schModalSubmit: string;
  schModalSubmitSuccess: string;

  // Scheme parameters
  schParamSubsidy: string;
  schParamMaxLoan: string;
  schParamInterest: string;
  schParamTenure: string;
  schParamMoratorium: string;
  schParamMargin: string;
  schParamCollateral: string;
  schParamComplexity: string;
  schParamProcessingTime: string;
  schParamBestFor: string;
  schParamMinistry: string;

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

    schTabRecommended: "सर्वश्रेष्ठ योजनाएं",
    schTabEligibility: "पात्रता जांच",
    schTabDocuments: "दस्तावेज़",
    schTabCompare: "तुलना",
    schTabTracking: "आवेदन स्थिति",

    schBestTag: "⭐ आपके लिए सर्वश्रेष्ठ",
    schBestReason: "क्यों अनुशंसित है",
    schMatchScore: "मैच स्कोर",
    schAdvantages: "मुख्य लाभ",
    schSetActive: "इस योजना को चुनें",
    schApplyNow: "अभी आवेदन करें",
    schOtherSchemes: "अन्य उपलब्ध योजनाएं",
    schSwitchToFinance: "वित्त कैलकुलेटर में देखें →",
    schCurrentlyActive: "✓ वर्तमान में चयनित",

    schEligibilityFor: "पात्रता जांच",
    schEligibilitySummary: "आपकी प्रोफाइल के आधार पर पात्रता",
    schEligibilityPassed: "पात्र",
    schEligibilityWarning: "सावधान",
    schEligibilityFailed: "अपात्र",
    schStatutoryNote: "वैधानिक नोट",
    schOverallMatch: "कुल पात्रता स्कोर",

    schDocumentsFor: "आवश्यक दस्तावेज़",
    schDocReadiness: "दस्तावेज़ तैयारी",
    schDocVerified: "सत्यापित",
    schDocGenerated: "जनरेट किया गया",
    schDocUploaded: "अपलोड किया गया",
    schDocPending: "लंबित",
    schDocMandatory: "अनिवार्य",
    schDocOptional: "वैकल्पिक",

    schCompareTitle: "योजनाओं की तुलना",
    schCompareFilter: "फ़िल्टर",
    schCompareFilterAll: "सभी पैरामीटर",
    schCompareFilterFinancial: "वित्तीय विवरण",
    schCompareFilterTerms: "ऋण शर्तें",
    schCompareSelectSchemes: "तुलना के लिए योजनाएं चुनें",

    schTrackingTitle: "आवेदन ट्रैकर",
    schTrackingAppId: "आवेदन ID",
    schTrackingDate: "तारीख",
    schTrackingChannel: "चैनल",
    schTrackingStatus: "स्थिति",
    schNoApplications: "अभी तक कोई आवेदन नहीं हुआ।",

    schModalTitle: "आवेदन पैक चुनें",
    schModalChannelOnline: "ऑनलाइन पोर्टल (KVIC/MSME)",
    schModalChannelVDO: "VDO / पंचायत सहायता",
    schModalChannelDossier: "बैंक डोज़ियर (DPR सहित)",
    schModalSubmit: "आवेदन जमा करें",
    schModalSubmitSuccess: "✓ आवेदन सफलतापूर्वक जमा हो गया!",

    schParamSubsidy: "सब्सिडी दर",
    schParamMaxLoan: "अधिकतम ऋण",
    schParamInterest: "ब्याज दर",
    schParamTenure: "ऋण अवधि",
    schParamMoratorium: "मोरेटोरियम",
    schParamMargin: "मार्जिन आवश्यकता",
    schParamCollateral: "संपार्श्विक",
    schParamComplexity: "जटिलता",
    schParamProcessingTime: "प्रसंस्करण समय",
    schParamBestFor: "किसके लिए सर्वोत्तम",
    schParamMinistry: "मंत्रालय / नोडल एजेंसी",

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

    schTabRecommended: "Best Schemes",
    schTabEligibility: "Eligibility Check",
    schTabDocuments: "Documents",
    schTabCompare: "Compare",
    schTabTracking: "Application Status",

    schBestTag: "⭐ Best for You",
    schBestReason: "Why Recommended",
    schMatchScore: "Match Score",
    schAdvantages: "Key Benefits",
    schSetActive: "Set as Active Scheme",
    schApplyNow: "Apply Now",
    schOtherSchemes: "Other Available Schemes",
    schSwitchToFinance: "View in Finance Calculator →",
    schCurrentlyActive: "✓ Currently Selected",

    schEligibilityFor: "Eligibility Check for",
    schEligibilitySummary: "Your profile-based eligibility assessment",
    schEligibilityPassed: "Eligible",
    schEligibilityWarning: "Caution",
    schEligibilityFailed: "Not Eligible",
    schStatutoryNote: "Statutory Note",
    schOverallMatch: "Overall Eligibility Score",

    schDocumentsFor: "Required Documents for",
    schDocReadiness: "Document Readiness",
    schDocVerified: "Verified",
    schDocGenerated: "Generated",
    schDocUploaded: "Uploaded",
    schDocPending: "Pending",
    schDocMandatory: "Mandatory",
    schDocOptional: "Optional",

    schCompareTitle: "Scheme Comparison Matrix",
    schCompareFilter: "Filter",
    schCompareFilterAll: "All Parameters",
    schCompareFilterFinancial: "Financial Details",
    schCompareFilterTerms: "Loan Terms",
    schCompareSelectSchemes: "Select schemes to compare",

    schTrackingTitle: "Application Tracker",
    schTrackingAppId: "Application ID",
    schTrackingDate: "Date",
    schTrackingChannel: "Channel",
    schTrackingStatus: "Status",
    schNoApplications: "No applications submitted yet.",

    schModalTitle: "Choose Application Pack",
    schModalChannelOnline: "Online Portal (KVIC/MSME)",
    schModalChannelVDO: "VDO / Panchayat Assisted",
    schModalChannelDossier: "Bank Dossier (with DPR)",
    schModalSubmit: "Submit Application",
    schModalSubmitSuccess: "✓ Application submitted successfully!",

    schParamSubsidy: "Subsidy Rate",
    schParamMaxLoan: "Max Loan",
    schParamInterest: "Interest Rate",
    schParamTenure: "Loan Tenure",
    schParamMoratorium: "Moratorium",
    schParamMargin: "Margin Requirement",
    schParamCollateral: "Collateral",
    schParamComplexity: "Complexity",
    schParamProcessingTime: "Processing Time",
    schParamBestFor: "Best Suited For",
    schParamMinistry: "Ministry / Nodal Agency",

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

    schTabRecommended: "सर्वोत्तम योजना",
    schTabEligibility: "पात्रता तपासणी",
    schTabDocuments: "कागदपत्रे",
    schTabCompare: "तुलना",
    schTabTracking: "अर्ज स्थिती",

    schBestTag: "⭐ आपल्यासाठी सर्वोत्तम",
    schBestReason: "का शिफारस केली",
    schMatchScore: "जुळणी गुण",
    schAdvantages: "मुख्य फायदे",
    schSetActive: "ही योजना निवडा",
    schApplyNow: "आत्ताच अर्ज करा",
    schOtherSchemes: "इतर उपलब्ध योजना",
    schSwitchToFinance: "वित्त कॅल्क्युलेटरमध्ये पहा →",
    schCurrentlyActive: "✓ सध्या निवडलेले",

    schEligibilityFor: "पात्रता तपासणी",
    schEligibilitySummary: "आपल्या प्रोफाइलवर आधारित पात्रता",
    schEligibilityPassed: "पात्र",
    schEligibilityWarning: "सावधान",
    schEligibilityFailed: "अपात्र",
    schStatutoryNote: "वैधानिक नोंद",
    schOverallMatch: "एकूण पात्रता गुण",

    schDocumentsFor: "आवश्यक कागदपत्रे",
    schDocReadiness: "कागदपत्र तयारी",
    schDocVerified: "सत्यापित",
    schDocGenerated: "तयार केले",
    schDocUploaded: "अपलोड केले",
    schDocPending: "प्रलंबित",
    schDocMandatory: "अनिवार्य",
    schDocOptional: "पर्यायी",

    schCompareTitle: "योजना तुलना",
    schCompareFilter: "फिल्टर",
    schCompareFilterAll: "सर्व पॅरामीटर",
    schCompareFilterFinancial: "आर्थिक तपशील",
    schCompareFilterTerms: "कर्ज अटी",
    schCompareSelectSchemes: "तुलनेसाठी योजना निवडा",

    schTrackingTitle: "अर्ज ट्रॅकर",
    schTrackingAppId: "अर्ज ID",
    schTrackingDate: "तारीख",
    schTrackingChannel: "चॅनेल",
    schTrackingStatus: "स्थिती",
    schNoApplications: "अद्याप कोणताही अर्ज सादर केला नाही.",

    schModalTitle: "अर्ज पॅक निवडा",
    schModalChannelOnline: "ऑनलाइन पोर्टल (KVIC/MSME)",
    schModalChannelVDO: "VDO / पंचायत सहाय्य",
    schModalChannelDossier: "बँक डोसियर (DPR सह)",
    schModalSubmit: "अर्ज सादर करा",
    schModalSubmitSuccess: "✓ अर्ज यशस्वीरीत्या सादर झाला!",

    schParamSubsidy: "सबसिडी दर",
    schParamMaxLoan: "कमाल कर्ज",
    schParamInterest: "व्याजदर",
    schParamTenure: "कर्ज मुदत",
    schParamMoratorium: "मोरेटोरियम",
    schParamMargin: "मार्जिन आवश्यकता",
    schParamCollateral: "तारण",
    schParamComplexity: "जटिलता",
    schParamProcessingTime: "प्रक्रिया वेळ",
    schParamBestFor: "कोणासाठी सर्वोत्तम",
    schParamMinistry: "मंत्रालय / नोडल एजन्सी",

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

    schTabRecommended: "சிறந்த திட்டங்கள்",
    schTabEligibility: "தகுதி சோதனை",
    schTabDocuments: "ஆவணங்கள்",
    schTabCompare: "ஒப்பீடு",
    schTabTracking: "விண்ணப்ப நிலை",

    schBestTag: "⭐ உங்களுக்கு சிறந்தது",
    schBestReason: "ஏன் பரிந்துரைக்கப்பட்டது",
    schMatchScore: "பொருத்த மதிப்பெண்",
    schAdvantages: "முக்கிய நன்மைகள்",
    schSetActive: "இந்த திட்டத்தை தேர்ந்தெடு",
    schApplyNow: "இப்போதே விண்ணப்பிக்கவும்",
    schOtherSchemes: "மற்ற கிடைக்கும் திட்டங்கள்",
    schSwitchToFinance: "நிதி கணக்கியலில் பார்க்கவும் →",
    schCurrentlyActive: "✓ தற்போது தேர்ந்தெடுக்கப்பட்டது",

    schEligibilityFor: "தகுதி சோதனை",
    schEligibilitySummary: "உங்கள் சுயவிவரத்தின் படி தகுதி",
    schEligibilityPassed: "தகுதியுடையவர்",
    schEligibilityWarning: "எச்சரிக்கை",
    schEligibilityFailed: "தகுதியற்றவர்",
    schStatutoryNote: "சட்டபூர்வ குறிப்பு",
    schOverallMatch: "மொத்த தகுதி மதிப்பெண்",

    schDocumentsFor: "தேவையான ஆவணங்கள்",
    schDocReadiness: "ஆவண தயார்நிலை",
    schDocVerified: "சரிபார்க்கப்பட்டது",
    schDocGenerated: "உருவாக்கப்பட்டது",
    schDocUploaded: "பதிவேற்றப்பட்டது",
    schDocPending: "நிலுவையில்",
    schDocMandatory: "கட்டாயம்",
    schDocOptional: "விருப்பத்தேர்வு",

    schCompareTitle: "திட்ட ஒப்பீட்டு அட்டவணை",
    schCompareFilter: "வடிகட்டி",
    schCompareFilterAll: "அனைத்து அளவுருக்கள்",
    schCompareFilterFinancial: "நிதி விவரங்கள்",
    schCompareFilterTerms: "கடன் நிபந்தனைகள்",
    schCompareSelectSchemes: "ஒப்பிட திட்டங்களை தேர்ந்தெடுக்கவும்",

    schTrackingTitle: "விண்ணப்ப நிலை கண்காணிப்பு",
    schTrackingAppId: "விண்ணப்ப ID",
    schTrackingDate: "தேதி",
    schTrackingChannel: "சேனல்",
    schTrackingStatus: "நிலை",
    schNoApplications: "இன்னும் எந்த விண்ணப்பமும் சமர்ப்பிக்கப்படவில்லை.",

    schModalTitle: "விண்ணப்ப தொகுப்பை தேர்வு செய்க",
    schModalChannelOnline: "ஆன்லைன் போர்டல் (KVIC/MSME)",
    schModalChannelVDO: "VDO / பஞ்சாயத்து உதவி",
    schModalChannelDossier: "வங்கி டோசியர் (DPR உடன்)",
    schModalSubmit: "விண்ணப்பத்தை சமர்ப்பிக்கவும்",
    schModalSubmitSuccess: "✓ விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",

    schParamSubsidy: "மானிய விகிதம்",
    schParamMaxLoan: "அதிகபட்ச கடன்",
    schParamInterest: "வட்டி விகிதம்",
    schParamTenure: "கடன் காலம்",
    schParamMoratorium: "மொராட்டோரியம்",
    schParamMargin: "மார்ஜின் தேவை",
    schParamCollateral: "பிணை",
    schParamComplexity: "சிக்கலான தன்மை",
    schParamProcessingTime: "செயலாக்க நேரம்",
    schParamBestFor: "யாருக்கு சிறந்தது",
    schParamMinistry: "அமைச்சகம் / நோடல் ஏஜென்சி",

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

    dpdpComplianceText: "DPDP Act 2023 இணக்கம் (சம்மத சாண்ட்பாக்ஸ்)",
    demoOtpText: "டெமோ OTP: 123456",
    voiceNarrationDiscovery: "பால் பண்ணை தொழில் உங்களுக்கு மிகவும் பொருத்தமானது, 85 சதவீத பொருத்தம் மதிப்பெண் மற்றும் பால் குளிர் மையம் 4 கிலோமீட்டர் தொலைவில் உள்ளது.",
    voiceNarrationFinance: "இரண்டு லட்சம் ரூபாய் கடன் மற்றும் எழுபது ஆயிரம் ரூபாய் PMEGP மானியம் கிடைக்கும். மாதாந்திர தவணை 4,250 ரூபாய் ஆகும்.",
    voiceNarrationCopilot: "உங்கள் தினசரி பண ஓட்டம் சிறப்பாக உள்ளது. கடந்த வாரம் பன்னிரண்டு ஆயிரம் ரூபாய் விற்பனை பதிவு செய்தீர்கள்."
  },
  te: {
    appName: "గ్రామ్‌ఉద్యమ్",
    tagline: "గ్రామీణ వ్యాపార మేధస్సు వేదిక",
    selectLanguage: "మీ భాషను ఎంచుకోండి",
    continueBtn: "కొనసాగించు",
    listeningVoice: "వింటున్నాను... మాట్లాడండి",
    speakToSelect: "మైక్ నొక్కి చెప్పండి: 'డైరీ' లేదా '80 వేల పెట్టుబడి'",

    navDiscovery: "అవకాశాలు",
    navCompare: "పోలిక",
    navFinances: "రుణం & DPR",
    navSchemes: "ప్రభుత్వ పథకాలు",
    navLaunch: "లాంచ్ చెక్‌లిస్ట్",
    navCopilot: "వ్యాపార సహాయకుడు",
    navAdvisor: "సలహాదారు చాట్",
    fieldOfficerMode: "ఫీల్డ్ అధికారి మోడ్",

    beneficiaryProfile: "లబ్ధిదారు వివరాలు",
    userName: "రమేష్ కుమార్ యాదవ్",
    userVillage: "భీతి రావత్ (గోరఖ్‌పూర్)",
    skillsDairyAgri: "డైరీ / వ్యవసాయం",
    availableCapital: "అందుబాటులో ఉన్న మూలధనం",
    selectSkills: "నైపుణ్యాలు & అనుభవం",
    landSpace: "అందుబాటులో ఉన్న స్థలం",
    experience: "పని అనుభవం",
    constraints: "కుటుంబ పరిమితులు",
    myProfile: "నా ప్రొఫైల్",
    editProfile: "ప్రొఫైల్ సవరించు",
    closeBtn: "మూసివేయి",
    findOpportunities: "అవకాశాలు వెతుకు",

    nearbyFacilities: "స్థానిక 5-10 కి.మీ రాడార్",
    facility5km: "5 కి.మీ పరిధి",
    facility10km: "10 కి.మీ పరిధి",
    competitors: "పోటీదారులు",
    chillingCenter: "పాల చిల్లింగ్ కేంద్రం",
    mandi: "వ్యవసాయ మార్కెట్",
    banks: "బ్యాంకు శాఖలు",
    suppliers: "దాణా & సామగ్రి సరఫరాదారులు",
    radarRadiusInfo: "భీతి రావత్ గ్రామం నుండి 5 మరియు 10 కి.మీ పరిధిలో అందుబాటులో ఉన్న సౌకర్యాలు",

    recommendedBusinesses: "సిఫార్సు చేయబడిన వ్యాపారాలు",
    recommendedSubtitle: "మీ మూలధనం, నైపుణ్యాలు మరియు స్థానిక డిమాండ్ ఆధారంగా",
    estimatedInvestment: "అంచనా పెట్టుబడి",
    expectedMargin: "ఆశించిన లాభం",
    riskLevel: "ప్రమాద స్థాయి",
    equipment: "పరికరాలు",
    details: "వివరాలు",
    viewRadar: "5-10 కి.మీ రాడార్ చూడు",
    compareOptions: "ప్రత్యామ్నాయాలు పోల్చండి",

    financeTitle: "ఆర్థిక & రుణ సిమ్యులేటర్",
    financeSubtitle: "మొత్తం వ్యయం, సబ్సిడీ మరియు నెలవారీ EMI లెక్కించండి",
    totalProjectCost: "మొత్తం ప్రాజెక్ట్ వ్యయం",
    ownContribution: "స్వంత వాటా",
    moratoriumPeriod: "మారటోరియం కాలం",
    months: "నెలలు",
    emiSubsidySummary: "సబ్సిడీ & బ్యాంకు రుణ నిర్మాణం",
    generateDpr: "DPR నివేదిక తయారు చేయండి",
    dprDownloadSuccess: "DPR బ్యాంకు ఫార్మాట్‌లో డౌన్‌లోడ్ అయింది",

    schemesTitle: "అర్హులైన ప్రభుత్వ పథకాలు",
    schemesSubtitle: "PMEGP, ముద్రా మరియు PMFME సబ్సిడీలు",
    subsidyRate: "సబ్సిడీ రేటు",
    collateralFree: "హామీ లేని రుణం",
    applyScheme: "దరఖాస్తు చేయండి",

    schTabRecommended: "ఉత్తమ పథకాలు",
    schTabEligibility: "అర్హత తనిఖీ",
    schTabDocuments: "పత్రాలు",
    schTabCompare: "పోలిక",
    schTabTracking: "దరఖాస్తు స్థితి",

    schBestTag: "⭐ మీకు అత్యుత్తమం",
    schBestReason: "ఎందుకు సిఫార్సు చేయబడింది",
    schMatchScore: "సరిపోలిక స్కోర్",
    schAdvantages: "ముఖ్య ప్రయోజనాలు",
    schSetActive: "ఈ పథకాన్ని ఎంచుకోండి",
    schApplyNow: "ఇప్పుడే దరఖాస్తు చేయండి",
    schOtherSchemes: "ఇతర అందుబాటులో ఉన్న పథకాలు",
    schSwitchToFinance: "ఆర్థిక కాలిక్యులేటర్‌లో చూడండి →",
    schCurrentlyActive: "✓ ప్రస్తుతం ఎంచుకోబడింది",

    schEligibilityFor: "అర్హత తనిఖీ",
    schEligibilitySummary: "మీ ప్రొఫైల్ ఆధారంగా అర్హత",
    schEligibilityPassed: "అర్హులు",
    schEligibilityWarning: "జాగ్రత్త",
    schEligibilityFailed: "అనర్హులు",
    schStatutoryNote: "శాసనబద్ధ గమనిక",
    schOverallMatch: "మొత్తం అర్హత స్కోర్",

    schDocumentsFor: "అవసరమైన పత్రాలు",
    schDocReadiness: "పత్రాల సంసిద్ధత",
    schDocVerified: "ధృవీకరించబడింది",
    schDocGenerated: "రూపొందించబడింది",
    schDocUploaded: "అప్‌లోడ్ చేయబడింది",
    schDocPending: "పెండింగ్",
    schDocMandatory: "తప్పనిసరి",
    schDocOptional: "ఐచ్ఛికం",

    schCompareTitle: "పథక పోలిక పట్టిక",
    schCompareFilter: "ఫిల్టర్",
    schCompareFilterAll: "అన్ని పారామీటర్లు",
    schCompareFilterFinancial: "ఆర్థిక వివరాలు",
    schCompareFilterTerms: "రుణ నిబంధనలు",
    schCompareSelectSchemes: "పోల్చడానికి పథకాలు ఎంచుకోండి",

    schTrackingTitle: "దరఖాస్తు ట్రాకర్",
    schTrackingAppId: "దరఖాస్తు ID",
    schTrackingDate: "తేదీ",
    schTrackingChannel: "చానల్",
    schTrackingStatus: "స్థితి",
    schNoApplications: "ఇంకా ఏ దరఖాస్తూ సమర్పించబడలేదు.",

    schModalTitle: "దరఖాస్తు ప్యాక్ ఎంచుకోండి",
    schModalChannelOnline: "ఆన్‌లైన్ పోర్టల్ (KVIC/MSME)",
    schModalChannelVDO: "VDO / పంచాయతీ సహాయం",
    schModalChannelDossier: "బ్యాంకు డోజియర్ (DPR తో)",
    schModalSubmit: "దరఖాస్తు సమర్పించండి",
    schModalSubmitSuccess: "✓ దరఖాస్తు విజయవంతంగా సమర్పించబడింది!",

    schParamSubsidy: "సబ్సిడీ రేటు",
    schParamMaxLoan: "గరిష్ట రుణం",
    schParamInterest: "వడ్డీ రేటు",
    schParamTenure: "రుణ కాలపరిమితి",
    schParamMoratorium: "మారటోరియం",
    schParamMargin: "మార్జిన్ అవసరం",
    schParamCollateral: "హామీ",
    schParamComplexity: "సంక్లిష్టత",
    schParamProcessingTime: "ప్రాసెసింగ్ సమయం",
    schParamBestFor: "ఎవరికి అనువైనది",
    schParamMinistry: "మంత్రిత్వ శాఖ / నోడల్ ఏజెన్సీ",

    checklistTitle: "వ్యాపార స్థాపన చెక్‌లిస్ట్",

    checklistSubtitle: "వ్యాపారం ప్రారంభించడానికి 5 ముఖ్యమైన దశలు",
    completedSteps: "దశలు పూర్తయ్యాయి",

    copilotTitle: "AI వ్యాపార సహాయకుడు",
    copilotSubtitle: "రోజువారీ అమ్మకాలు, ఖర్చులు మరియు AI సలహా",
    dailyIncome: "నేటి ఆదాయం (అమ్మకాలు)",
    dailyExpense: "నేటి ఖర్చు (దాణా/ఇంధనం)",
    recordTx: "లావాదేవీ నమోదు చేయండి",
    healthStatus: "వ్యాపార ఆరోగ్యం",
    healthSurplusNotice: "EMI సురక్షితం • నగదు మిగులు",
    askAdvicePlaceholder: "అడగండి: 'దాణా ధరలు పెరిగాయి, ఏమి చేయాలి?'",
    askAdviceBtn: "సలహా పొందండి",
    quickLedger: "రోజువారీ లెక్కల నమోదు",
    amountRs: "మొత్తం ₹",
    descriptionPlaceholder: "వివరణ (ఉదా: 24L పాల సరఫరా)",

    fieldOfficerTitle: "ఫీల్డ్ అధికారి సహాయక మోడ్",
    fieldOfficerSubtitle: "గ్రామంలో ఆఫ్‌లైన్ సర్వే, వాయిస్ ఇంటర్వ్యూ & సమకాలీకరణ",
    offlineCacheTitle: "ఆఫ్‌లైన్ డేటా నిల్వ",
    offlineCacheDesc: "ఇంటర్నెట్ లేకపోయినా డేటా సేవ్ చేయవచ్చు. నెట్‌వర్క్ వచ్చినప్పుడు 1-క్లిక్‌లో సమకాలీకరించండి.",
    tokenActive24h: "24 గంటల టోకెన్ క్రియాశీలంగా ఉంది",
    localSavedSurveys: "స్థానికంగా సేవ్ అయిన సర్వేలు",
    syncBtn: "కేంద్ర సర్వర్‌కు సమకాలీకరించండి",
    syncing: "సమకాలీకరిస్తోంది...",
    syncedBadge: "సమకాలీకరించబడింది ✓",
    localBadge: "స్థానిక నిల్వ",

    dpdpComplianceText: "DPDP Act 2023 అనుసరణ (సమ్మతి సాండ్‌బాక్స్)",
    demoOtpText: "డెమో OTP: 123456",
    voiceNarrationDiscovery: "డైరీ వ్యవసాయం మీకు అత్యంత అనుకూలమైన వ్యాపారం, 85 శాతం అనుకూలత స్కోరు మరియు పాల చిల్లింగ్ కేంద్రం 4 కిలోమీటర్ల దూరంలో ఉంది.",
    voiceNarrationFinance: "మీకు రెండు లక్షల రూపాయల రుణం మరియు డెబ్బై వేల రూపాయల PMEGP సబ్సిడీ అందుతుంది. నెలవారీ EMI 4,250 రూపాయలు ఉంటుంది.",
    voiceNarrationCopilot: "మీ రోజువారీ నగదు ప్రవాహం ఆరోగ్యంగా ఉంది. గత వారం పన్నెండు వేల రూపాయల అమ్మకాలు నమోదు చేసారు."
  }
};
