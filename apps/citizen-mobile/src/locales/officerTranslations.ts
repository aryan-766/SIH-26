import { Language } from './index';

export interface OfficerTranslations {
  // Common & Header
  backToEntrepreneur: string;
  restrictedGovtAccess: string;
  loginTitle: string;
  deptMinistry: string;
  loginInstruction: string;
  logout: string;
  headerTitle: string;
  headerSubtitle: string;

  // Login Tabs & Presets
  tabPhoneProof: string;
  tabGovtOrder: string;
  quickPresetsLabel: string;
  quickOrderLabel: string;
  tapToTest: string;

  // Phone + Proof Method
  selectRoleLabel: string;
  roleIasDm: string;
  roleVdo: string;
  selectJurisdictionDistrict: string;
  registeredPhoneLabel: string;
  securityPinLabel: string;
  attachedProofLabel: string;
  mandatoryProof: string;
  verifiedByDmOffice: string;
  chooseFileBtn: string;
  uploading: string;
  uploadHintIas: string;
  uploadHintVdo: string;
  submitPhoneProofBtn: string;

  // Govt Order Method
  govtOrderInputLabel: string;
  govtOrderPlaceholder: string;
  govtOrderHelpText: string;
  govtRecordVerified: string;
  issuingAuthority: string;
  appointmentDate: string;
  orderNumberLabel: string;
  submitGovtOrderBtn: string;
  nicFooter: string;

  // Authenticated Hub Header
  apexAuthorityBadge: string;
  supervisoryIas: string;
  directOversight: string;
  viewOrderBtn: string;
  stateLabel: string;
  districtLabel: string;
  panchayatLabel: string;
  allVillages: string;

  // KPI Bar
  kpiEnterprises: string;
  kpiSubsidies: string;
  kpiSanctioned: string;
  kpiAdvisorInbox: string;

  // Hub Tabs
  tabBusinesses: string;
  tabSubsidies: string;
  tabInbox: string;
  tabProof: string;

  // Tab 1: Directory
  searchPlaceholder: string;
  surveyBtn: string;
  ownerLabel: string;
  schemeLabel: string;
  subsidyLabel: string;
  subsidizedSuffix: string;
  bankLabel: string;
  lastVerifiedLabel: string;
  updateAppraisalBtn: string;
  messageBtn: string;

  // Tab 2: Schemes
  schemesTitle: string;
  schemesSubtitle: string;
  beneficiariesLabel: string;
  totalSubsidiesLabel: string;

  // Tab 3: Inbox
  inboxTitle: string;
  routedFromAi: string;
  replyPlaceholder: string;
  sendBtn: string;
  quickActionTitle: string;
  quickActionShareLetter: string;
  quickActionScheduleVisit: string;
  quickActionEndorseSubsidy: string;

  // Tab 4: Proof
  govtProofTitle: string;
  reportingDm: string;
  officerDetailsTitle: string;
  officerNameLabel: string;
  designationLabel: string;
  serviceCodeLabel: string;
  govtOrderRefLabel: string;
  uploadedProofLabel: string;
  scrutinyPassed: string;
  authorizedPanchayats: string;
  householdsLabel: string;

  // Modals
  modalAppraisalTitle: string;
  modalSchemeStatus: string;
  modalSubsidyAmount: string;
  modalHealthStatus: string;
  modalNotes: string;
  modalCancel: string;
  modalSave: string;

  modalSurveyTitle: string;
  modalEntrepreneurName: string;
  modalPhone: string;
  modalEnterpriseName: string;
  modalInvestment: string;
  modalSubsidyEst: string;
  modalSubmitSurvey: string;

  modalCertTitle: string;
  modalCertState: string;
  modalCertDept: string;
  modalCertClose: string;

  // Error Messages
  errPhoneRequired: string;
  errGovtOrderRequired: string;
  errGovtOrderNotFound: string;
  errPinInvalid: string;
}

export const OFFICER_I18N: Record<Language, OfficerTranslations> = {
  hi: {
    backToEntrepreneur: 'उद्यमी ऐप',
    restrictedGovtAccess: 'अधिकृत प्रशासनिक प्रवेश (Restricted Access)',
    loginTitle: 'सरकारी अधिकारी एवं आईएएस लॉगिन (Official Login)',
    deptMinistry: 'पंचायती राज मंत्रालय एवं सूक्ष्म, लघु व मध्यम उद्यम निदेशालय',
    loginInstruction: 'फ़ोन नंबर व अधिकृत पहचान प्रमाण से, या सरकार द्वारा जारी नियुक्ति आदेश संख्या से लॉगिन करें।',
    logout: 'लॉगआउट',
    headerTitle: 'ग्रामउद्यम • फील्ड ऑफिसर मोड',
    headerSubtitle: 'पंचायत नोडल पोर्टल एवं अधिकार क्षेत्र हब',

    tabPhoneProof: 'फ़ोन नंबर + प्रमाण (IAS/VDO)',
    tabGovtOrder: 'सरकारी आदेश संख्या (Govt Order)',
    quickPresetsLabel: 'त्वरित लॉगिन प्रीसेट (IAS / VDO):',
    quickOrderLabel: 'वैध सरकारी आदेश संख्या (सरकारी आदेश):',
    tapToTest: 'क्लिक कर टेस्ट करें',

    selectRoleLabel: 'प्रशासनिक पद / संवर्ग चुनें (Select Officer Role)',
    roleIasDm: 'जिलाधिकारी (IAS DM)',
    roleVdo: 'ग्राम विकास अधिकारी (VDO)',
    selectJurisdictionDistrict: 'अधिकार क्षेत्र जिला चुनें',
    registeredPhoneLabel: 'पंजीकृत आधिकारिक मोबाइल नंबर',
    securityPinLabel: 'सुरक्षा पिन (4-अंक)',
    attachedProofLabel: 'आधिकारिक पहचान पत्र / स्थानांतरण आदेश (PDF/JPG)',
    mandatoryProof: 'अनिवार्य प्रमाण',
    verifiedByDmOffice: 'डीएम कार्यालय द्वारा सत्यापित',
    chooseFileBtn: 'पहचान प्रमाण / आदेश PDF चुनें',
    uploading: 'अपलोड हो रहा है...',
    uploadHintIas: 'DoPT गजट अधिसूचना, आईएएस सिविल आईडी कार्ड या डीएम नियुक्ति आदेश',
    uploadHintVdo: 'पंचायत नोडल पहचान पत्र, वीडीओ नियुक्ति आदेश या ब्लॉक राजपत्रित पत्र (अधिकतम 10MB)',
    submitPhoneProofBtn: 'प्रमाण सत्यापित कर लॉगिन करें (Verify Proof & Authenticate)',

    govtOrderInputLabel: 'सरकारी आदेश संख्या / सर्विस कोड (Govt Order No. / Service ID)',
    govtOrderPlaceholder: 'उदा. GOV/UP/PANCHAYAT/2024/7712-B या DOPT/GOV-UP/IAS/2023/1102',
    govtOrderHelpText: 'कार्मिक एवं प्रशिक्षण विभाग (DoPT) या राज्य पंचायती राज द्वारा जारी आधिकारिक आदेश संख्या दर्ज करें।',
    govtRecordVerified: 'सरकारी रिकॉर्ड सत्यापित (Official Record Verified)',
    issuingAuthority: 'जारीकर्ता प्राधिकरण:',
    appointmentDate: 'नियुक्ति तिथि:',
    orderNumberLabel: 'आदेश संख्या:',
    submitGovtOrderBtn: 'सरकारी आदेश से लॉगिन करें (Authenticate Govt Order & Enter)',
    nicFooter: '🔒 राष्ट्रीय सूचना विज्ञान केंद्र (NIC) एवं भारत सरकार प्रशासनिक निर्देशिका से प्रमाणित',

    apexAuthorityBadge: 'शीर्ष जिला प्रशासनिक अधिकार (Apex District Administrative Authority)',
    supervisoryIas: 'संबंधित जिलाधिकारी / आईएएस (Supervisory IAS District Collector)',
    directOversight: 'प्रत्यक्ष एमएसएमई व पीएमईजीपी सब्सिडी निगरानी',
    viewOrderBtn: 'सरकारी आदेश',
    stateLabel: 'राज्य (State):',
    districtLabel: 'ज़िला (District):',
    panchayatLabel: 'ग्राम पंचायत:',
    allVillages: 'सभी ग्राम पंचायतें',

    kpiEnterprises: 'कुल उद्यम',
    kpiSubsidies: 'सब्सिडी राशि',
    kpiSanctioned: 'स्वीकृत उद्यम',
    kpiAdvisorInbox: 'सलाहकार इनबॉक्स',

    tabBusinesses: 'उद्यम डायरेक्टरी',
    tabSubsidies: 'योजना व सब्सिडी',
    tabInbox: 'सलाहकार इनबॉक्स',
    tabProof: 'आईएएस व प्रमाण',

    searchPlaceholder: 'व्यवसाय नाम, उद्यमी, या गाँव खोजें...',
    surveyBtn: '+ सर्वेक्षण',
    ownerLabel: 'उद्यमी:',
    schemeLabel: 'स्वीकृत योजना:',
    subsidyLabel: 'सरकारी सब्सिडी:',
    subsidizedSuffix: 'सब्सिडी समर्थित',
    bankLabel: 'बैंकिंग चैनल:',
    lastVerifiedLabel: 'अंतिम सत्यापन:',
    updateAppraisalBtn: 'सब्सिडी व मूल्यांकन अपडेट',
    messageBtn: 'संदेश',

    schemesTitle: 'सरकारी योजनाएं व सब्सिडी वितरण',
    schemesSubtitle: 'जिलाधिकारी निगरानी अंतर्गत स्वीकृत सब्सिडी, बैंक क्लीयरेंस व लक्ष्य',
    beneficiariesLabel: 'लाभार्थी:',
    totalSubsidiesLabel: 'कुल सब्सिडी:',

    inboxTitle: 'क्षेत्रीय उद्यमियों के परामर्श संदेश',
    routedFromAi: 'एआई बिजनेस एडवाइजर से अग्रेषित',
    replyPlaceholder: 'आधिकारिक सलाह या स्वीकृति संदेश लिखें...',
    sendBtn: 'भेजें',
    quickActionTitle: 'त्वरित प्रशासनिक प्रतिक्रिया (Quick Action Pills)',
    quickActionShareLetter: '📄 ऋण संस्तुति पत्र प्रेषित करें',
    quickActionScheduleVisit: '📍 भौतिक निरीक्षण समय तय करें',
    quickActionEndorseSubsidy: '💰 35% सब्सिडी अनुमोदित करें',

    govtProofTitle: 'सरकारी अधिकार पत्र एवं आईएएस संवर्ग प्रमाण',
    reportingDm: 'पर्यवेक्षी जिलाधिकारी (Reporting DM)',
    officerDetailsTitle: 'अधिकारी विवरण एवं प्रशासनिक पहचान',
    officerNameLabel: 'फील्ड ऑफिसर नाम:',
    designationLabel: 'पदनाम:',
    serviceCodeLabel: 'विशिष्ट सर्विस कोड:',
    govtOrderRefLabel: 'सरकारी आदेश संख्या:',
    uploadedProofLabel: 'अपलोड किया गया सरकारी प्रमाण पत्र:',
    scrutinyPassed: '✓ जांच में प्रामाणिक',
    authorizedPanchayats: 'अधिकार क्षेत्र के गाँव (Authorized Panchayats):',
    householdsLabel: 'परिवार',

    modalAppraisalTitle: 'स्थलीय मूल्यांकन एवं सब्सिडी स्थिति',
    modalSchemeStatus: 'योजना स्थिति',
    modalSubsidyAmount: 'सब्सिडी राशि (₹)',
    modalHealthStatus: 'चुकौती एवं व्यवसाय स्वास्थ्य',
    modalNotes: 'आधिकारिक निरीक्षण टिप्पणी',
    modalCancel: 'रद्द करें',
    modalSave: 'मूल्यांकन सहेजें',

    modalSurveyTitle: '+ नया स्थलीय उद्यम सर्वेक्षण दर्ज करें',
    modalEntrepreneurName: 'उद्यमी का नाम',
    modalPhone: 'मोबाइल नंबर',
    modalEnterpriseName: 'उद्यम का नाम',
    modalInvestment: 'अनुमानित लागत (₹)',
    modalSubsidyEst: 'सब्सिडी अनुमान (35%)',
    modalSubmitSurvey: 'सर्वेक्षण जमा करें',

    modalCertTitle: 'आधिकारिक सरकारी अधिकार पत्र',
    modalCertState: 'उत्तर प्रदेश शासन / भारत सरकार',
    modalCertDept: 'पंचायती राज विभाग एवं एमएसएमई निदेशालय',
    modalCertClose: 'प्रमाण पत्र बंद करें',

    errPhoneRequired: 'कृपया 10 अंकों का पंजीकृत आधिकारिक मोबाइल नंबर दर्ज करें।',
    errGovtOrderRequired: 'कृपया सरकार द्वारा जारी सरकारी आदेश संख्या या सर्विस कोड दर्ज करें।',
    errGovtOrderNotFound: 'सुरक्षा अस्वीकृति: यह आदेश संख्या किसी पंजीकृत सरकारी आदेश या नियुक्ति रिकॉर्ड से मेल नहीं खाता।',
    errPinInvalid: 'सुरक्षा पिन अमान्य है। (परीक्षण पिन: 7788)'
  },

  en: {
    backToEntrepreneur: 'Entrepreneur App',
    restrictedGovtAccess: 'Restricted Govt Access',
    loginTitle: 'Official Govt & IAS Login',
    deptMinistry: 'Ministry of Panchayati Raj & Directorate of MSME',
    loginInstruction: 'Sign in using your registered mobile number & identity proof, or government order number.',
    logout: 'Sign Out',
    headerTitle: 'GramUdyam • Field Officer Mode',
    headerSubtitle: 'Panchayat Nodal Portal & Jurisdiction Hub',

    tabPhoneProof: 'Phone + Proof (IAS/VDO)',
    tabGovtOrder: 'Govt Order Number',
    quickPresetsLabel: 'Quick Login Presets (IAS / VDO):',
    quickOrderLabel: 'Valid Govt Order Numbers (For Testing):',
    tapToTest: 'Tap to Test',

    selectRoleLabel: 'Select Officer Role & Cadre',
    roleIasDm: 'District Magistrate (IAS DM)',
    roleVdo: 'Village Development Officer (VDO)',
    selectJurisdictionDistrict: 'Select Jurisdiction District',
    registeredPhoneLabel: 'Registered Official Mobile No.',
    securityPinLabel: 'Security PIN (4-digit)',
    attachedProofLabel: 'Official ID / Appointment Order (PDF/JPG)',
    mandatoryProof: 'Mandatory Proof',
    verifiedByDmOffice: 'Verified by DM Office',
    chooseFileBtn: 'Choose ID Proof / Order PDF',
    uploading: 'Uploading...',
    uploadHintIas: 'Official DoPT Gazette notification, IAS Civil ID Card or DM Appointment Order',
    uploadHintVdo: 'Panchayat Nodal ID card, VDO Joining Order or Block Gazetted Letter (Max 10MB)',
    submitPhoneProofBtn: 'Verify Proof & Authenticate',

    govtOrderInputLabel: 'Government Order No. / Service ID',
    govtOrderPlaceholder: 'e.g. GOV/UP/PANCHAYAT/2024/7712-B or DOPT/GOV-UP/IAS/2023/1102',
    govtOrderHelpText: 'Enter official Government Order Number issued by DoPT or State Panchayati Raj Department.',
    govtRecordVerified: 'Official Record Verified',
    issuingAuthority: 'Issuing Authority:',
    appointmentDate: 'Appointment Date:',
    orderNumberLabel: 'Order Number:',
    submitGovtOrderBtn: 'Authenticate Govt Order & Enter',
    nicFooter: '🔒 NIC & Government of India Administrative Directory Verified',

    apexAuthorityBadge: 'Apex District Administrative Authority',
    supervisoryIas: 'Supervisory IAS District Collector',
    directOversight: 'Direct MSME & PMEGP Sanction Oversight',
    viewOrderBtn: 'Govt Order',
    stateLabel: 'State:',
    districtLabel: 'District:',
    panchayatLabel: 'Gram Panchayat:',
    allVillages: 'All Villages',

    kpiEnterprises: 'Enterprises',
    kpiSubsidies: 'Subsidies',
    kpiSanctioned: 'Sanctioned',
    kpiAdvisorInbox: 'Advisor Inbox',

    tabBusinesses: 'Area Businesses',
    tabSubsidies: 'Subsidies Ledger',
    tabInbox: 'Advisor Inbox',
    tabProof: 'IAS & Proof',

    searchPlaceholder: 'Search business, entrepreneur, or village...',
    surveyBtn: '+ Survey',
    ownerLabel: 'Owner:',
    schemeLabel: 'Allocated Scheme:',
    subsidyLabel: 'Govt Subsidy:',
    subsidizedSuffix: 'Subsidized',
    bankLabel: 'Banking Channel:',
    lastVerifiedLabel: 'Last Verified:',
    updateAppraisalBtn: 'Update Subsidy & Appraisal',
    messageBtn: 'Message',

    schemesTitle: 'Government Schemes & Subsidies',
    schemesSubtitle: 'Approved subsidies, bank clearances, and district disbursement targets under District Magistrate monitoring.',
    beneficiariesLabel: 'Beneficiaries:',
    totalSubsidiesLabel: 'Total Subsidies:',

    inboxTitle: 'Area Entrepreneur Inquiries',
    routedFromAi: 'Routed from AI Business Advisor',
    replyPlaceholder: 'Type official guidance or sanction update...',
    sendBtn: 'Send',
    quickActionTitle: 'Official Quick Action Pills',
    quickActionShareLetter: '📄 Share Sanction Clear Letter',
    quickActionScheduleVisit: '📍 Schedule Inspection Visit',
    quickActionEndorseSubsidy: '💰 Endorse 35% Subsidy',

    govtProofTitle: 'Government Authorization & IAS Cadre Proof',
    reportingDm: 'Reporting District Magistrate (IAS)',
    officerDetailsTitle: 'Official Credentials & Identification',
    officerNameLabel: 'Field Officer Name:',
    designationLabel: 'Designation:',
    serviceCodeLabel: 'Unique Service Code:',
    govtOrderRefLabel: 'Government Order No:',
    uploadedProofLabel: 'Uploaded Proof Document:',
    scrutinyPassed: '✓ Scrutiny Passed',
    authorizedPanchayats: 'Authorized Gram Panchayats:',
    householdsLabel: 'Households',

    modalAppraisalTitle: 'Ground Appraisal & Subsidy Status',
    modalSchemeStatus: 'Scheme Status',
    modalSubsidyAmount: 'Subsidy Amount (₹)',
    modalHealthStatus: 'Repayment & Health',
    modalNotes: 'Official Appraisal Notes',
    modalCancel: 'Cancel',
    modalSave: 'Save Appraisal',

    modalSurveyTitle: '+ Register Ground Enterprise Survey',
    modalEntrepreneurName: 'Entrepreneur Name',
    modalPhone: 'Phone Number',
    modalEnterpriseName: 'Enterprise Name',
    modalInvestment: 'Investment (₹)',
    modalSubsidyEst: 'Subsidy Est. (35%)',
    modalSubmitSurvey: 'Submit Survey',

    modalCertTitle: 'Official Government Authorization',
    modalCertState: 'State Administration / Govt of India',
    modalCertDept: 'Department of Panchayati Raj & MSME Directorate',
    modalCertClose: 'Close Certificate',

    errPhoneRequired: 'Please enter a 10-digit registered official mobile number.',
    errGovtOrderRequired: 'Please enter a valid Government Order Number or Service Code.',
    errGovtOrderNotFound: 'Verification Failed: Order number does not match registered official records.',
    errPinInvalid: 'Invalid security PIN. (Demo PIN: 7788)'
  },

  mr: {
    backToEntrepreneur: 'उद्योजक ॲप',
    restrictedGovtAccess: 'अधिकृत शासकीय प्रवेश',
    loginTitle: 'शासकीय अधिकारी व आयएएस लॉगिन',
    deptMinistry: 'ग्रामविकास व पंचायत राज मंत्रालय आणि एमएसएमई संचालनालय',
    loginInstruction: 'नोंदणीकृत मोबाइल क्रमांक व ओळखपत्राद्वारे, किंवा शासकीय आदेश क्रमांकाद्वारे लॉगिन करा.',
    logout: 'लॉगआउट',
    headerTitle: 'ग्रामउद्यम • फील्ड ऑफिसर मोड',
    headerSubtitle: 'पंचायत नोडल पोर्टल व कार्यक्षेत्र केंद्र',

    tabPhoneProof: 'फोन क्रमांक + पुरावा (IAS/VDO)',
    tabGovtOrder: 'शासकीय आदेश क्रमांक',
    quickPresetsLabel: 'जलद लॉगिन पर्याय (IAS / VDO):',
    quickOrderLabel: 'वैध शासकीय आदेश क्रमांक:',
    tapToTest: 'तपासण्यासाठी क्लिक करा',

    selectRoleLabel: 'प्रशासकीय पद / संवर्ग निवडा',
    roleIasDm: 'जिल्हाधिकारी (IAS DM)',
    roleVdo: 'ग्रामविकास अधिकारी (VDO)',
    selectJurisdictionDistrict: 'अधिकारक्षेत्र जिल्हा निवडा',
    registeredPhoneLabel: 'नोंदणीकृत अधिकृत मोबाइल क्रमांक',
    securityPinLabel: 'सुरक्षा पिन (४-अंकी)',
    attachedProofLabel: 'अधिकृत ओळखपत्र / बदली आदेश (PDF/JPG)',
    mandatoryProof: 'अनिवार्य पुरावा',
    verifiedByDmOffice: 'जिल्हाधिकारी कार्यालयाद्वारे सत्यापित',
    chooseFileBtn: 'ओळखपत्र / आदेश PDF निवडा',
    uploading: 'अपलोड होत आहे...',
    uploadHintIas: 'DoPT राजपत्र अधिसूचना, आयएएस ओळखपत्र किंवा नियुक्ती आदेश',
    uploadHintVdo: 'पंचायत नोडल ओळखपत्र, व्हीडीओ रुजू आदेश किंवा ब्लॉक पत्र (कमाल १०MB)',
    submitPhoneProofBtn: 'पुरावा पडताळून लॉगिन करा',

    govtOrderInputLabel: 'शासकीय आदेश क्रमांक / सेवा आयडी',
    govtOrderPlaceholder: 'उदा. MAH/REV/IAS/2023/771 किंवा GOV/UP/PANCHAYAT/2024/7712-B',
    govtOrderHelpText: 'कार्मिक व प्रशिक्षण विभाग किंवा राज्य ग्रामविकास खात्याने जारी केलेला आदेश क्रमांक प्रविष्ट करा.',
    govtRecordVerified: 'शासकीय नोंदणी सत्यापित',
    issuingAuthority: 'जारीकर्ता प्राधिकरण:',
    appointmentDate: 'नियुक्ती तारीख:',
    orderNumberLabel: 'आदेश क्रमांक:',
    submitGovtOrderBtn: 'शासकीय आदेशाने लॉगिन करा',
    nicFooter: '🔒 राष्ट्रीय सूचना विज्ञान केंद्र (NIC) व भारत सरकार निर्देशिकेद्वारे प्रमाणित',

    apexAuthorityBadge: 'सर्वोच्च जिल्हा प्रशासकीय प्राधिकरण',
    supervisoryIas: 'पर्यवेक्षी जिल्हाधिकारी (IAS)',
    directOversight: 'थेट एमएसएमई व पीएमईजीपी अनुदान देखरेख',
    viewOrderBtn: 'शासकीय आदेश',
    stateLabel: 'राज्य:',
    districtLabel: 'जिल्हा:',
    panchayatLabel: 'ग्रामपंचायत:',
    allVillages: 'सर्व गावे',

    kpiEnterprises: 'एकूण व्यवसाय',
    kpiSubsidies: 'अनुदान रक्कम',
    kpiSanctioned: 'मंजूर व्यवसाय',
    kpiAdvisorInbox: 'सल्लागार इनबॉक्स',

    tabBusinesses: 'व्यवसाय यादी',
    tabSubsidies: 'अनुदान खाते',
    tabInbox: 'सल्लागार इनबॉक्स',
    tabProof: 'IAS व पुरावा',

    searchPlaceholder: 'व्यवसाय, उद्योजक किंवा गाव शोधा...',
    surveyBtn: '+ सर्वेक्षण',
    ownerLabel: 'उद्योजक:',
    schemeLabel: 'मंजूर योजना:',
    subsidyLabel: 'शासकीय अनुदान:',
    subsidizedSuffix: 'अनुदानित',
    bankLabel: 'बँकिंग चॅनेल:',
    lastVerifiedLabel: 'शेवटची तपासणी:',
    updateAppraisalBtn: 'अनुदान व मूल्यमापन अद्यतन',
    messageBtn: 'संदेश',

    schemesTitle: 'शासकीय योजना व अनुदान वाटप',
    schemesSubtitle: 'जिल्हाधिकारी यांच्या देखरेखीखाली मंजूर अनुदान आणि बँक वितरण उद्दिष्टे.',
    beneficiariesLabel: 'लाभार्थी:',
    totalSubsidiesLabel: 'एकूण अनुदान:',

    inboxTitle: 'स्थानिक उद्योजकांच्या चौकशी',
    routedFromAi: 'एआय बिझनेस ॲडव्हायझर कडून प्राप्त',
    replyPlaceholder: 'अधिकृत सल्ला किंवा मंजुरी संदेश लिहा...',
    sendBtn: 'पाठवा',
    quickActionTitle: 'जलद प्रशासकीय प्रतिसाद',
    quickActionShareLetter: '📄 मंजुरी पत्र पाठवा',
    quickActionScheduleVisit: '📍 प्रत्यक्ष तपासणी वेळ निश्चित करा',
    quickActionEndorseSubsidy: '💰 ३५% अनुदान मंजूर करा',

    govtProofTitle: 'शासकीय अधिकार पत्र व आयएएस संवर्ग पुरावा',
    reportingDm: 'नियंत्रक जिल्हाधिकारी (IAS)',
    officerDetailsTitle: 'अधिकारी तपशील व ओळख',
    officerNameLabel: 'फील्ड ऑफिसरचे नाव:',
    designationLabel: 'पदनाम:',
    serviceCodeLabel: 'विशिष्ट सेवा कोड:',
    govtOrderRefLabel: 'शासकीय आदेश क्रमांक:',
    uploadedProofLabel: 'अपलोड केलेले शासकीय प्रमाणपत्र:',
    scrutinyPassed: '✓ पडताळणी पूर्ण',
    authorizedPanchayats: 'अधिकारक्षेत्रातील गावे:',
    householdsLabel: 'कुटुंबे',

    modalAppraisalTitle: 'प्रत्यक्ष पाहणी व अनुदान स्थिती',
    modalSchemeStatus: 'योजना स्थिती',
    modalSubsidyAmount: 'अनुदान रक्कम (₹)',
    modalHealthStatus: 'परतफेड व स्थिती',
    modalNotes: 'तपासणी टिप्पण्या',
    modalCancel: 'रद्द करा',
    modalSave: 'मूल्यांकन जतन करा',

    modalSurveyTitle: '+ नवीन उद्यम सर्वेक्षण नोंदवा',
    modalEntrepreneurName: 'उद्योजकाचे नाव',
    modalPhone: 'मोबाइल क्रमांक',
    modalEnterpriseName: 'व्यवसायाचे नाव',
    modalInvestment: 'गुंतवणूक (₹)',
    modalSubsidyEst: 'अनुमानित अनुदान (३५%)',
    modalSubmitSurvey: 'सर्वेक्षण सबमिट करा',

    modalCertTitle: 'अधिकृत शासकीय अधिकारपत्र',
    modalCertState: 'महाराष्ट्र शासन / भारत सरकार',
    modalCertDept: 'ग्रामविकास विभाग व एमएसएमई संचालनालय',
    modalCertClose: 'प्रमाणपत्र बंद करा',

    errPhoneRequired: 'कृपया १० अंकी नोंदणीकृत अधिकृत मोबाइल क्रमांक प्रविष्ट करा.',
    errGovtOrderRequired: 'कृपया वैध शासकीय आदेश क्रमांक किंवा सेवा कोड प्रविष्ट करा.',
    errGovtOrderNotFound: 'पडताळणी अयशस्वी: हा आदेश क्रमांक शासकीय नोंदीशी जुळत नाही.',
    errPinInvalid: 'अवैध सुरक्षा पिन. (चाचणी पिन: 7788)'
  },

  ta: {
    backToEntrepreneur: 'தொழில்முனைவோர் செயலி',
    restrictedGovtAccess: 'அரசு அங்கீகரிக்கப்பட்ட நுழைவு',
    loginTitle: 'அரசு அதிகாரி & ஐஏஎஸ் உள்நுழைவு',
    deptMinistry: 'ஊரக வளர்ச்சி மற்றும் குறு, சிறு & நடுத்தர தொழில் துறை',
    loginInstruction: 'பதிவுசெய்த மொபைல் எண் & அடையாளச் சான்று அல்லது அரசு ஆணை எண் கொண்டு உள்நுழைக.',
    logout: 'வெளியேறு',
    headerTitle: 'கிராமஉத்யோக் • கள அதிகாரி முறை',
    headerSubtitle: 'பஞ்சாயத்து நோடல் போர்டல் & அதிகார வரம்பு தளம்',

    tabPhoneProof: 'தொலைபேசி + சான்று (IAS/VDO)',
    tabGovtOrder: 'அரசு ஆணை எண்',
    quickPresetsLabel: 'விரைவு உள்நுழைவு தேர்வுகள் (IAS / VDO):',
    quickOrderLabel: 'செல்லுபடியாகும் அரசு ஆணை எண்கள்:',
    tapToTest: 'சோதிக்க அழுத்தவும்',

    selectRoleLabel: 'அதிகாரி பதவி / பிரிவை தேர்ந்தெடுக்கவும்',
    roleIasDm: 'மாவட்ட ஆட்சியர் (IAS DM)',
    roleVdo: 'கிராம வளர்ச்சி அலுவலர் (VDO)',
    selectJurisdictionDistrict: 'அதிகார வரம்பு மாவட்டத்தை தேர்வு செய்க',
    registeredPhoneLabel: 'பதிவுசெய்யப்பட்ட அதிகாரப்பூர்வ மொபைல் எண்',
    securityPinLabel: 'பாதுகாப்பு பின் (4-இலக்கம்)',
    attachedProofLabel: 'அடையாள அட்டை / நியமன ஆணை (PDF/JPG)',
    mandatoryProof: 'கட்டாய சான்று',
    verifiedByDmOffice: 'மாவட்ட ஆட்சியர் அலுவலகத்தால் சரிபார்க்கப்பட்டது',
    chooseFileBtn: 'அடையாளச் சான்று / ஆணை PDF தேர்வு செய்',
    uploading: 'பதிவேற்றப்படுகிறது...',
    uploadHintIas: 'DoPT அரசிதழ் அறிவிப்பு, ஐஏஎஸ் அடையாள அட்டை அல்லது நியமன ஆணை',
    uploadHintVdo: 'பஞ்சாயத்து நோடல் அட்டை, VDO சேர்ப்பு ஆணை அல்லது அரசு கடிதம் (அதிகபட்சம் 10MB)',
    submitPhoneProofBtn: 'சான்றை சரிபார்த்து உள்நுழைக',

    govtOrderInputLabel: 'அரசு ஆணை எண் / பணி குறியீடு',
    govtOrderPlaceholder: 'எ.கா. GOV/UP/PANCHAYAT/2024/7712-B அல்லது DOPT/GOV-UP/IAS/2023/1102',
    govtOrderHelpText: 'DoPT அல்லது மாநில ஊரக வளர்ச்சி துறை வழங்கிய அரசு ஆணை எண்ணை உள்ளிடவும்.',
    govtRecordVerified: 'அரசு பதிவு சரிபார்க்கப்பட்டது',
    issuingAuthority: 'வழங்கிய ஆணையம்:',
    appointmentDate: 'நியமன தேதி:',
    orderNumberLabel: 'ஆணை எண்:',
    submitGovtOrderBtn: 'அரசு ஆணை மூலம் உள்நுழைக',
    nicFooter: '🔒 NIC மற்றும் இந்திய அரசு நிர்வாக பதிவேட்டால் சரிபார்க்கப்பட்டது',

    apexAuthorityBadge: 'முதன்மை மாவட்ட நிர்வாக அதிகாரம்',
    supervisoryIas: 'கண்காணிப்பு மாவட்ட ஆட்சியர் (IAS)',
    directOversight: 'நேரடி MSME & PMEGP மானிய கண்காணிப்பு',
    viewOrderBtn: 'அரசு ஆணை',
    stateLabel: 'மாநிலம்:',
    districtLabel: 'மாவட்டம்:',
    panchayatLabel: 'கிராம பஞ்சாயத்து:',
    allVillages: 'அனைத்து கிராமங்கள்',

    kpiEnterprises: 'தொழில்கள்',
    kpiSubsidies: 'மானியங்கள்',
    kpiSanctioned: 'ஒப்புதல் பெற்றவை',
    kpiAdvisorInbox: 'ஆலோசகர் இன்பாக்ஸ்',

    tabBusinesses: 'பகுதி தொழில்கள்',
    tabSubsidies: 'மானிய கணக்கு',
    tabInbox: 'ஆலோசகர் இன்பாக்ஸ்',
    tabProof: 'IAS & சான்று',

    searchPlaceholder: 'தொழில், தொழில்முனைவோர் அல்லது கிராமத்தை தேடுக...',
    surveyBtn: '+ ஆய்வு',
    ownerLabel: 'உரிமையாளர்:',
    schemeLabel: 'திட்டம்:',
    subsidyLabel: 'அரசு மானியம்:',
    subsidizedSuffix: 'மானியம் அளிக்கப்பட்டது',
    bankLabel: 'வங்கி கிளை:',
    lastVerifiedLabel: 'கடைசி சரிபார்ப்பு:',
    updateAppraisalBtn: 'மானியம் & மதிப்பீட்டை புதுப்பி',
    messageBtn: 'செய்தி',

    schemesTitle: 'அரசு திட்டங்கள் மற்றும் மானியங்கள்',
    schemesSubtitle: 'மாவட்ட ஆட்சியரின் மேற்பார்வையில் அங்கீகரிக்கப்பட்ட மானியங்கள் மற்றும் வங்கி ஒப்புதல்கள்.',
    beneficiariesLabel: 'பயனாளிகள்:',
    totalSubsidiesLabel: 'மொத்த மானியம்:',

    inboxTitle: 'உள்ளூர் தொழில்முனைவோர் கேள்விகள்',
    routedFromAi: 'AI வணிக ஆலோசகரிலிருந்து பெறப்பட்டது',
    replyPlaceholder: 'அதிகாரப்பூர்வ ஆலோசனை அல்லது ஒப்புதல் தகவலை உள்ளிடவும்...',
    sendBtn: 'அனுப்பு',
    quickActionTitle: 'விரைவு நிர்வாக பதில்கள்',
    quickActionShareLetter: '📄 ஒப்புதல் கடிதத்தை அனுப்பு',
    quickActionScheduleVisit: '📍 நேரடி ஆய்வு திட்டமிடுக',
    quickActionEndorseSubsidy: '💰 35% மானியத்தை அங்கீகரி',

    govtProofTitle: 'அரசு அங்கீகாரம் மற்றும் ஐஏஎஸ் சான்று',
    reportingDm: 'அறிக்கை சமர்ப்பிக்கும் மாவட்ட ஆட்சியர்',
    officerDetailsTitle: 'அதிகாரி விவரங்கள் மற்றும் அடையாளம்',
    officerNameLabel: 'கள அதிகாரி பெயர்:',
    designationLabel: 'பதவி:',
    serviceCodeLabel: 'சேவை குறியீடு:',
    govtOrderRefLabel: 'அரசு ஆணை எண்:',
    uploadedProofLabel: 'பதிவேற்றிய சான்றிதழ் ஆவணம்:',
    scrutinyPassed: '✓ ஆய்வு முடிந்தது',
    authorizedPanchayats: 'அங்கீகரிக்கப்பட்ட கிராமங்கள்:',
    householdsLabel: 'குடும்பங்கள்',

    modalAppraisalTitle: 'கள ஆய்வு மற்றும் மானிய நிலை',
    modalSchemeStatus: 'திட்ட நிலை',
    modalSubsidyAmount: 'மானியத் தொகை (₹)',
    modalHealthStatus: 'திருப்பி செலுத்துதல் நிலை',
    modalNotes: 'கள ஆய்வு குறிப்புகள்',
    modalCancel: 'ரத்து செய்',
    modalSave: 'மதிப்பீட்டை சேமி',

    modalSurveyTitle: '+ புதிய கள ஆய்வு பதிவு செய்',
    modalEntrepreneurName: 'தொழில்முனைவோர் பெயர்',
    modalPhone: 'மொபைல் எண்',
    modalEnterpriseName: 'தொழில் பெயர்',
    modalInvestment: 'முதலீடு (₹)',
    modalSubsidyEst: 'மதிப்பிடப்பட்ட மானியம் (35%)',
    modalSubmitSurvey: 'ஆய்வை சமர்ப்பி',

    modalCertTitle: 'அதிகாரப்பூர்வ அரசு சான்று',
    modalCertState: 'மாநில அரசு / இந்திய அரசு',
    modalCertDept: 'ஊரக வளர்ச்சி துறை & MSME இயக்குநரகம்',
    modalCertClose: 'சான்றிதழை மூடு',

    errPhoneRequired: 'தயவுசெய்து 10 இலக்க பதிவு செய்யப்பட்ட மொபைல் எண்ணை உள்ளிடவும்.',
    errGovtOrderRequired: 'தயவுசெய்து அரசு ஆணை எண் அல்லது சேவை குறியீட்டை உள்ளிடவும்.',
    errGovtOrderNotFound: 'சரிபார்ப்பு தோல்வி: இந்த ஆணை எண் அரசு பதிவுகளுடன் பொருந்தவில்லை.',
    errPinInvalid: 'தவறான பாதுகாப்பு பின். (சோதனை பின்: 7788)'
  },

  te: {
    backToEntrepreneur: 'ఉద్యమి యాప్',
    restrictedGovtAccess: 'పరిమిత ప్రభుత్వ ప్రవేశం',
    loginTitle: 'అధికారిక ప్రభుత్వ & IAS లాగిన్',
    deptMinistry: 'పంచాయతీ రాజ్ మంత్రిత్వ శాఖ & MSME డైరెక్టరేట్',
    loginInstruction: 'మీ నమోదిత మొబైల్ నంబర్ మరియు అధికారిక గుర్తింపుతో లాగిన్ అవ్వండి.',
    logout: 'లాగ్ అవుట్',
    headerTitle: 'గ్రామ్‌ఉద్యమ్ • ఫీల్డ్ ఆఫీసర్ మోడ్',
    headerSubtitle: 'పంచాయతీ నోడల్ పోర్టల్ & అధికార పరిధి హబ్',

    tabPhoneProof: 'ఫోన్ + ఐడీ రుజువు (IAS/VDO)',
    tabGovtOrder: 'ప్రభుత్వ ఉత్తర్వు సంఖ్య',
    quickPresetsLabel: 'త్వరిత లాగిన్ ప్రీసెట్లు (IAS / VDO):',
    quickOrderLabel: 'చెల్లుబాటు అయ్యే ప్రభుత్వ ఉత్తర్వులు:',
    tapToTest: 'పరీక్షించండి',

    selectRoleLabel: 'అధికారి పాత్రను ఎంచుకోండి',
    roleIasDm: 'జిల్లా కలెక్టర్ (IAS DM)',
    roleVdo: 'గ్రామ అభివృద్ధి అధికారి (VDO)',
    selectJurisdictionDistrict: 'అధికార పరిధి జిల్లాను ఎంచుకోండి',
    registeredPhoneLabel: 'నమోదిత అధికారిక మొబైల్ సంఖ్య',
    securityPinLabel: 'సెక్యూరిటీ పిన్ (4 అంకెలు)',
    attachedProofLabel: 'అధికారిక ఐడీ / నియామక ఉత్తర్వు (PDF/JPG)',
    mandatoryProof: 'తప్పనిసరి రుజువు',
    verifiedByDmOffice: 'కలెక్టర్ కార్యాలయం ద్వారా ధృవీకరించబడింది',
    chooseFileBtn: 'ఐడీ రుజువును ఎంచుకోండి',
    uploading: 'అప్‌లోడ్ అవుతోంది...',
    uploadHintIas: 'DoPT అధికారిక గెజిట్ నోటిఫికేషన్ లేదా IAS సివిల్ ఐడీ కార్డు',
    uploadHintVdo: 'పంచాయతీ నోడల్ ఐడీ లేదా VDO జాయినింగ్ ఆర్డర్ (గరిష్టంగా 10MB)',
    submitPhoneProofBtn: 'ధృవీకరించి లాగిన్ అవ్వండి',

    govtOrderInputLabel: 'ప్రభుత్వ ఉత్తర్వు సంఖ్య / సర్వీస్ ఐడీ',
    govtOrderPlaceholder: 'ఉదా: GOV/UP/PANCHAYAT/2024/7712-B లేదా DOPT/GOV-UP/IAS/2023/1102',
    govtOrderHelpText: 'DoPT లేదా పంచాయతీ రాజ్ శాఖ జారీ చేసిన అధికారిక ఉత్తర్వు సంఖ్య నమోదు చేయండి.',
    govtRecordVerified: 'అధికారిక రికార్డు ధృవీకరించబడింది',
    issuingAuthority: 'జారీ చేసిన అధికారి:',
    appointmentDate: 'నియామక తేదీ:',
    orderNumberLabel: 'ఉత్తర్వు సంఖ్య:',
    submitGovtOrderBtn: 'ప్రభుత్వ ఉత్తర్వుతో లాగిన్ అవ్వండి',
    nicFooter: '🔒 NIC మరియు భారత ప్రభుత్వ పరిపాలనా రికార్డు ద్వారా ధృవీకరించబడింది',

    apexAuthorityBadge: 'ప్రధాన జిల్లా పరిపాలనా అధికారం',
    supervisoryIas: 'పర్యవేక్షణ జిల్లా కలెక్టర్ (IAS)',
    directOversight: 'ప్రత్యక్ష MSME & PMEGP సబ్సిడీ పర్యవేక్షణ',
    viewOrderBtn: 'ప్రభుత్వ ఉత్తర్వు',
    stateLabel: 'రాష్ట్రం:',
    districtLabel: 'జిల్లా:',
    panchayatLabel: 'గ్రామ పంచాయతీ:',
    allVillages: 'అన్ని గ్రామాలు',

    kpiEnterprises: 'ఎంటర్‌ప్రైజెస్',
    kpiSubsidies: 'సబ్సిడీలు',
    kpiSanctioned: 'ఆమోదించబడినవి',
    kpiAdvisorInbox: 'సలహాదారు ఇన్‌బాక్స్',

    tabBusinesses: 'ప్రాంతీయ ఎంటర్‌ప్రైజెస్',
    tabSubsidies: 'సబ్సిడీ నివేదిక',
    tabInbox: 'సలహాదారు ఇన్‌బాక్స్',
    tabProof: 'IAS & రుజువు',

    searchPlaceholder: 'ఎంటర్‌ప్రైజ్, లబ్ధిదారు లేదా గ్రామం ద్వారా శోధించండి...',
    surveyBtn: '+ సర్వే',
    ownerLabel: 'యజమాని:',
    schemeLabel: 'పథకం:',
    subsidyLabel: 'ప్రభుత్వ సబ్సిడీ:',
    subsidizedSuffix: 'సబ్సిడీ ఇవ్వబడింది',
    bankLabel: 'బ్యాంకు శాఖ:',
    lastVerifiedLabel: 'చివరి ధృవీకరణ:',
    updateAppraisalBtn: 'సబ్సిడీ & మూల్యాంకనం నవీకరించండి',
    messageBtn: 'సందేశం',

    schemesTitle: 'ప్రభుత్వ పథకాలు మరియు సబ్సిడీలు',
    schemesSubtitle: 'జిల్లా కలెక్టర్ పర్యవేక్షణలో ఆమోదించబడిన సబ్సిడీలు మరియు బ్యాంకు ఆమోదాలు.',
    beneficiariesLabel: 'లబ్ధిదారులు:',
    totalSubsidiesLabel: 'మొత్తం సబ్సిడీ:',

    inboxTitle: 'స్థానిక వ్యాపార ప్రశ్నలు',
    routedFromAi: 'AI వ్యాపార సలహాదారు నుండి పంపబడింది',
    replyPlaceholder: 'అధికారిక సలహా లేదా ఆమోద సమాచారాన్ని నమోదు చేయండి...',
    sendBtn: 'పంపండి',
    quickActionTitle: 'త్వరిత పరిపాలనా ప్రత్యుత్తరాలు',
    quickActionShareLetter: '📄 ఆమోద పత్రాన్ని పంపండి',
    quickActionScheduleVisit: '📍 ప్రత్యక్ష తనిఖీ షెడ్యూల్ చేయండి',
    quickActionEndorseSubsidy: '💰 35% సబ్సిడీని ఆమోదించండి',

    govtProofTitle: 'ప్రభుత్వ గుర్తింపు మరియు ఐఏఎస్ రుజువు',
    reportingDm: 'నివేదిక సమర్పించే జిల్లా కలెక్టర్',
    officerDetailsTitle: 'అధికారి వివరాలు & గుర్తింపు',
    officerNameLabel: 'ఫీల్డ్ అధికారి పేరు:',
    designationLabel: 'హోదా:',
    serviceCodeLabel: 'సర్వీస్ కోడ్:',
    govtOrderRefLabel: 'ప్రభుత్వ ఉత్తర్వు సంఖ్య:',
    uploadedProofLabel: 'అప్‌లోడ్ చేసిన ధృవీకరణ పత్రం:',
    scrutinyPassed: '✓ పరిశీలన పూర్తయింది',
    authorizedPanchayats: 'అధికారిక గ్రామాలు:',
    householdsLabel: 'కుటుంబాలు',

    modalAppraisalTitle: 'క్షేత్ర తనిఖీ & సబ్సిడీ స్థితి',
    modalSchemeStatus: 'పథకం స్థితి',
    modalSubsidyAmount: 'సబ్సిడీ మొత్తం (₹)',
    modalHealthStatus: 'తిరిగి చెల్లింపు స్థితి',
    modalNotes: 'క్షేత్ర తనిఖీ గమనికలు',
    modalCancel: 'రద్దు చేయండి',
    modalSave: 'సేవ్ చేయండి',

    modalSurveyTitle: '+ కొత్త సర్వేను నమోదు చేయండి',
    modalEntrepreneurName: 'లబ్ధిదారు పేరు',
    modalPhone: 'మొబైల్ సంఖ్య',
    modalEnterpriseName: 'వ్యాపారం పేరు',
    modalInvestment: 'పెట్టుబడి (₹)',
    modalSubsidyEst: 'అంచనా సబ్సిడీ (35%)',
    modalSubmitSurvey: 'సర్వే సమర్పించండి',

    modalCertTitle: 'అధికారిక ప్రభుత్వ ధృవీకరణ పత్రం',
    modalCertState: 'రాష్ట్ర ప్రభుత్వం / భారత ప్రభుత్వం',
    modalCertDept: 'గ్రామీణాభివృద్ధి శాఖ & MSME డైరెక్టరేట్',
    modalCertClose: 'మూసివేయండి',

    errPhoneRequired: 'దయచేసి 10 అంకెల నమోదిత మొబైల్ సంఖ్యను నమోదు చేయండి.',
    errGovtOrderRequired: 'దయచేసి ప్రభుత్వ ఉత్తర్వు సంఖ్య లేదా సర్వీస్ కోడ్ నమోదు చేయండి.',
    errGovtOrderNotFound: 'ధృవీకరణ విఫలమైంది: ఈ ఉత్తర్వు సంఖ్య రికార్డులతో సరిపోలలేదు.',
    errPinInvalid: 'చెల్లని సెక్యూరిటీ పిన్. (టెస్ట్ పిన్: 7788)'
  }
};
