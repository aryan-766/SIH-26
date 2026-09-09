/**
 * Pan-India Comprehensive Government Schemes Registry
 * Full multilingual support for Hindi (hi), English (en), Marathi (mr), Tamil (ta).
 * Every scheme is visible to all citizens with detailed eligibility, required documents,
 * subsidy percentage, loan ceilings, and official portal application links.
 */

export interface MultilingualText {
  hi: string;
  en: string;
  mr: string;
  ta: string;
}

export interface MultilingualList {
  hi: string[];
  en: string[];
  mr: string[];
  ta: string[];
}

export interface GovScheme {
  id: string;
  code: string;
  badge: MultilingualText;
  name: MultilingualText;
  ministry: MultilingualText;
  category: 'msme' | 'food_processing' | 'artisans' | 'livestock' | 'agri_infra' | 'women_shg';
  maxLoanAmount: number;
  maxLoanDisplay: MultilingualText;
  subsidyRateRural: number;
  subsidyRateSpecial: number;
  subsidyDisplay: MultilingualText;
  interestRate: MultilingualText;
  collateralFree: boolean;
  collateralText: MultilingualText;
  brief: MultilingualText;
  description: MultilingualText;
  eligibility: MultilingualList;
  documents: MultilingualList;
  applicationProcess: MultilingualList;
  officialPortal: string;
  portalName: string;
  targetSectors: string[];
  specialCategoryHighlight?: MultilingualText;
}

export const PAN_INDIA_GOV_SCHEMES: GovScheme[] = [
  {
    id: 'scheme_pmegp',
    code: 'PMEGP',
    badge: {
      hi: '35% तक सब्सिडी • सबसे लोकप्रिय',
      en: 'Up to 35% Subsidy • Most Popular',
      mr: '35% पर्यंत सबसिडी • सर्वाधिक लोकप्रिय',
      ta: '35% வரை மானியம் • மிகவும் பிரபலமானது'
    },
    name: {
      hi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)',
      en: 'Prime Minister Employment Generation Programme (PMEGP)',
      mr: 'पंतप्रधान रोजगार निर्मिती कार्यक्रम (PMEGP)',
      ta: 'பிரதமர் வேலைவாய்ப்பு உருவாக்கும் திட்டம் (PMEGP)'
    },
    ministry: {
      hi: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MoMSME) / KVIC',
      en: 'Ministry of MSME / Khadi & Village Industries Commission',
      mr: 'सूक्ष्म, लघु आणि मध्यम उद्योग मंत्रालय / KVIC',
      ta: 'குறு, சிறு மற்றும் நடுத்தர தொழில் அமைச்சகம் / KVIC'
    },
    category: 'msme',
    maxLoanAmount: 5000000,
    maxLoanDisplay: {
      hi: 'विनिर्माण: ₹50 लाख | सेवा/कृषि: ₹20 लाख',
      en: 'Mfg: Up to ₹50 Lakh | Service/Agro: Up to ₹20 Lakh',
      mr: 'उत्पादन: ₹50 लाख | सेवा/कृषी: ₹20 लाख',
      ta: 'உற்பத்தி: ₹50 லட்சம் | சேவை: ₹20 லட்சம்'
    },
    subsidyRateRural: 25,
    subsidyRateSpecial: 35,
    subsidyDisplay: {
      hi: 'सामान्य ग्रामीण: 25% | महिला / SC / ST / OBC: 35% सब्सिडी',
      en: 'General Rural: 25% | Women / SC / ST / OBC: 35% Subsidy',
      mr: 'सामान्य ग्रामीण: 25% | महिला / SC / ST / OBC: 35% सबसिडी',
      ta: 'பொது கிராமப்புறம்: 25% | பெண்கள்/SC/ST/OBC: 35% மானியம்'
    },
    interestRate: {
      hi: 'सामान्य बैंक दर (9% - 11%)',
      en: 'Standard Bank MCLR rate (9% - 11%)',
      mr: 'मानक बँक दर (9% - 11%)',
      ta: 'வங்கி வட்டி விகிதம் (9% - 11%)'
    },
    collateralFree: true,
    collateralText: {
      hi: '₹10 लाख तक पूर्णतः बिना गारंटी (CGTMSE गारंटीकृत)',
      en: '100% Collateral-Free up to ₹10 Lakhs (Covered by CGTMSE)',
      mr: '₹10 लाखांपर्यंत पूर्णपणे गहाणमुक्त (CGTMSE)',
      ta: '₹10 லட்சம் வரை எவ்வித பிணையும் இன்றி (CGTMSE)'
    },
    brief: {
      hi: 'ग्रामीण भारत में नया उद्योग, सर्विस सेंटर या कृषि व्यापार लगाने हेतु 25% से 35% सरकारी सब्सिडी।',
      en: 'Credit-linked capital subsidy scheme providing 25-35% grant for new manufacturing and service micro-enterprises.',
      mr: 'ग्रामीण भागात नवीन सूक्ष्म उद्योग किंवा सेवा केंद्र सुरू करण्यासाठी 25% ते 35% शासकीय अनुदान.',
      ta: 'கிராமப்புறங்களில் புதிய உற்பத்தி மற்றும் சேவை தொழில் தொடங்க 25% முதல் 35% வரை மானியம்.'
    },
    description: {
      hi: 'PMEGP देश की सबसे बड़ी क्रेडिट-लिंक्ड सब्सिडी योजना है। ग्रामीण क्षेत्र में सामान्य वर्ग को 25% तथा महिला, ओबीसी, एससी, एसटी, दिव्यांग व पूर्व सैनिकों को 35% की सीधी सब्सिडी मिलती है। विनिर्माण इकाइयों के लिए ₹50 लाख तक और सेवा/व्यवसाय इकाइयों के लिए ₹20 लाख तक का ऋण बैंक से मिलता है।',
      en: 'PMEGP is India flagship credit-linked subsidy initiative. In rural areas, general applicants receive 25% margin money subsidy while special category applicants (Women, SC, ST, OBC, Divyangjan, Ex-Servicemen) receive 35% subsidy. Bank loans up to ₹50 Lakh for manufacturing units and ₹20 Lakh for service units are provided.',
      mr: 'PMEGP ही देशातील सर्वात मोठी सबसिडी योजना आहे. ग्रामीण भागात सर्वसाधारण प्रवर्गाला 25% आणि महिला, ओबीसी, एससी, एसटी प्रवर्गाला 35% थेट शासकीय सबसिडी मिळते. मॅन्युफॅक्चरिंग युनिटसाठी ₹50 लाख आणि सेवा क्षेत्रासाठी ₹20 लाखांपर्यंत कर्ज उपलब्ध.',
      ta: 'PMEGP என்பது நாட்டின் முதன்மை கடன் மானியத் திட்டமாகும். கிராமப்புறங்களில் பொதுப் பிரிவினருக்கு 25% மானியமும், பெண்கள், SC, ST, OBC பிரிவினருக்கு 35% மானியமும் வழங்கப்படுகிறது. உற்பத்திப் பிரிவுகளுக்கு ₹50 லட்சம் வரையிலும், சேவைப் பிரிவுகளுக்கு ₹20 லட்சம் வரையிலும் கடன் கிடைக்கிறது.'
    },
    eligibility: {
      hi: [
        'आयु: न्यूनतम 18 वर्ष पूर्ण होनी चाहिए (अधिकतम आयु सीमा नहीं)',
        'योग्यता: ₹10 लाख से अधिक विनिर्माण अथवा ₹5 लाख से अधिक सेवा हेतु न्यूनतम 8वीं पास',
        'केवल नए उद्यम (Greenfield Units) स्थापना हेतु लागू',
        'स्वयं का अंशदान: सामान्य वर्ग 10%, विशेष वर्ग (महिला/SC/ST/OBC) केवल 5%',
        'परिवार में केवल एक व्यक्ति को लाभ मिल सकता है'
      ],
      en: [
        'Age: Minimum 18 years completed (No upper age ceiling)',
        'Education: Minimum 8th class pass for projects above ₹10L (Mfg) or ₹5L (Service)',
        'New Greenfield micro-enterprises only (existing units not eligible)',
        'Own Contribution: 10% for General, only 5% for Special Categories (Women/SC/ST/OBC)',
        'Only one person per family is eligible for financial assistance'
      ],
      mr: [
        'वय: किमान 18 वर्षे पूर्ण असावी (कमाल वयोमर्यादा नाही)',
        'शिक्षण: ₹10 लाखांपेक्षा जास्त प्रकल्पांसाठी किमान 8वी उत्तीर्ण',
        'केवळ नवीन उद्योगांच्या (Greenfield) स्थापनेसाठी पात्र',
        'स्वतःचे भांडवल: सर्वसाधारण 10%, विशेष प्रवर्ग (महिला/मागासवर्गीय) फक्त 5%',
        'एका कुटुंबातील एकाच व्यक्तीस लाभ अनुज्ञेय'
      ],
      ta: [
        'வயது: குறைந்தபட்சம் 18 வயது பூர்த்தியடைந்திருக்க வேண்டும்',
        'கல்வித்தகுதி: ₹10 லட்சத்திற்கு மேற்பட்ட திட்டங்களுக்கு 8-ஆம் வகுப்பு தேர்ச்சி',
        'புதிய தொழில் தொடங்க மட்டுமே பொருந்தும் (பழைய நிறுவனங்களுக்கு இல்லை)',
        'சுய பங்களிப்பு: பொதுப்பிரிவு 10%, சிறப்புப் பிரிவினர் (பெண்கள்/SC/ST/OBC) 5% மட்டுமே',
        'ஒரு குடும்பத்தில் ஒரு நபருக்கு மட்டுமே இத்திட்டம் பொருந்தும்'
      ]
    },
    documents: {
      hi: [
        'आधार कार्ड एवं पैन कार्ड (Aadhaar & PAN Card)',
        'निवास प्रमाण पत्र / ग्राम प्रधान सत्यापन (Rural Resident Certificate)',
        'जाति प्रमाण पत्र (SC/ST/OBC/दिव्यांगजन हेतु आवश्यक)',
        'विस्तृत प्रोजेक्ट रिपोर्ट (DPR / Business Plan)',
        'शैक्षणिक योग्यता प्रमाण पत्र (8वीं/10वीं अंकतालिका)',
        'पासपोर्ट साइज फोटो एवं बैंक खाता पासबुक'
      ],
      en: [
        'Aadhaar Card and PAN Card of applicant',
        'Rural Residence Certificate / Gram Panchayat Verification',
        'Caste Certificate (for SC / ST / OBC / Divyangjan applicants)',
        'Detailed Project Report (DPR) / Machinery Quotation',
        'Educational Qualification Certificate (8th / 10th / Diploma)',
        'Passport Size Photographs and Active Bank Account Passbook'
      ],
      mr: [
        'आधार कार्ड आणि पॅन कार्ड',
        'रहिवासी दाखला / ग्रामपंचायत प्रमाणपत्र',
        'जातीचा दाखला (SC/ST/OBC प्रवर्गासाठी)',
        'सविस्तर प्रकल्प अहवाल (DPR) आणि मशिनरी कोटेशन',
        'शैक्षणिक प्रमाणपत्र (किमान 8वी उत्तीर्ण पुरावा)',
        'पासपोर्ट फोटो आणि बँक पासबुक'
      ],
      ta: [
        'விண்ணப்பதாரரின் ஆதார் அட்டை மற்றும் பான் அட்டை',
        'கிராமப்புற இருப்பிடச் சான்றிதழ் / ஊராட்சி மன்ற சான்றிதழ்',
        'சாதிச் சான்றிதழ் (SC/ST/OBC பிரிவினருக்கு)',
        'திட்ட அறிக்கை (DPR) மற்றும் இயந்திர விலைப்பட்டியல்',
        'கல்வித் தகுதிச் சான்றிதழ் (8-ஆம் வகுப்பு அல்லது அதற்கு மேல்)',
        'பாஸ்போர்ட் அளவு புகைப்படம் மற்றும் வங்கி கணக்கு புத்தகம்'
      ]
    },
    applicationProcess: {
      hi: [
        '१. KVIC PMEGP पोर्टल (kviconline.gov.in) पर ऑनलाइन आवेदन करें',
        '२. ग्रामउद्यम ऐप से जेनरेटेड DPR (प्रोजेक्ट रिपोर्ट) अपलोड करें',
        '३. ज़िला उद्योग केंद्र (DIC) अथवा KVIC द्वारा आवेदन की जांच व अनुमोदन',
        '४. चुनी हुई बैंक शाखा द्वारा ऋण स्वीकृति (Sanction Letter)',
        '५. 10 दिवसीय EDP प्रशिक्षण एवं 35% सब्सिडी मार्जिन मनी बैंक खाते में क्रेडिट'
      ],
      en: [
        '1. Submit online application on KVIC PMEGP portal (kviconline.gov.in) or JanSamarth',
        '2. Upload GramUdyam generated Detailed Project Report (DPR) & quotation',
        '3. Task Force Committee / District Industries Centre (DIC) verifies and approves file',
        '4. Sponsoring bank branch sanctions the term loan and cash credit',
        '5. Complete 10-day EDP training; 35% subsidy margin money credited in TDR account'
      ],
      mr: [
        '१. KVIC PMEGP पोर्टलवर ऑनलाइन अर्ज भरा',
        '२. ग्रामउद्यम अ‍ॅपद्वारे तयार केलेला DPR प्रकल्प अहवाल अपलोड करा',
        '३. जिल्हा उद्योग केंद्र (DIC) कडून कागदपत्रे तपासणी व मंजुरी',
        '४. बँक शाखेकडून कर्ज मंजुरी आदेश',
        '५. 10 दिवसांचे EDP प्रशिक्षण आणि सबसिडी खात्यात जमा'
      ],
      ta: [
        '1. KVIC PMEGP இணையதளத்தில் (kviconline.gov.in) விண்ணப்பிக்கவும்',
        '2. திட்ட அறிக்கையை (DPR) பதிவேற்றம் செய்யவும்',
        '3. மாவட்ட தொழில் மையம் (DIC) சரிபார்த்து ஒப்புதல் அளிக்கும்',
        '4. வங்கி கிளையிலிருந்து கடன் அனுமதி ஆணை பெறப்படும்',
        '5. 10 நாள் EDP பயிற்சிக்கு பின் 35% மானியம் வங்கி கணக்கில் வரவு வைக்கப்படும்'
      ]
    },
    officialPortal: 'https://www.kviconline.gov.in/pmegpeportal/',
    portalName: 'KVIC PMEGP e-Portal',
    targetSectors: ['Dairy', 'Food Processing', 'Garments', 'Solar', 'Services', 'Manufacturing', 'Agro Industry']
  },
  {
    id: 'scheme_pm_mudra',
    code: 'PMMY',
    badge: {
      hi: 'बिना गारंटी ऋण • तत्काल स्वीकृति',
      en: '100% Collateral-Free • Instant Approval',
      mr: 'तारणमुक्त कर्ज • झटपट मंजुरी',
      ta: 'பிணையில்லா கடன் • உடனடி ஒப்புதல்'
    },
    name: {
      hi: 'प्रधानमंत्री मुद्रा योजना (PM MUDRA)',
      en: 'Pradhan Mantri MUDRA Yojana (PMMY)',
      mr: 'प्रधानमंत्री मुद्रा योजना (PMMY)',
      ta: 'பிரதமர் முத்ரா யோஜனா திட்டம் (PMMY)'
    },
    ministry: {
      hi: 'वित्तीय सेवाएं विभाग, वित्त मंत्रालय (Ministry of Finance)',
      en: 'Department of Financial Services, Ministry of Finance',
      mr: 'वित्तीय सेवा विभाग, वित्त मंत्रालय',
      ta: 'நிதி சேவைகள் துறை, மத்திய நிதி அமைச்சகம்'
    },
    category: 'msme',
    maxLoanAmount: 2000000,
    maxLoanDisplay: {
      hi: 'शिशु: ₹50,000 | किशोर: ₹5 लाख | तरुण: ₹10-20 लाख',
      en: 'Shishu: Up to ₹50k | Kishor: Up to ₹5L | Tarun: Up to ₹20L',
      mr: 'शिशू: ₹50 हजार | किशोर: ₹5 लाख | तरुण: ₹10-20 लाख',
      ta: 'சிஷு: ₹50,000 வரை | கிஷோர்: ₹5 லட்சம் | தருண்: ₹20 லட்சம் வரை'
    },
    subsidyRateRural: 0,
    subsidyRateSpecial: 0,
    subsidyDisplay: {
      hi: 'रियायती ब्याज दर (8.5% - 10%) • कोई प्रोसेसिंग फीस नहीं',
      en: 'Concessional Interest (8.5% - 10%) • Zero Processing Fee',
      mr: 'सवलतीचे व्याजदर (8.5% - 10%) • शून्य प्रक्रिया शुल्क',
      ta: 'குறைந்த வட்டி விகிதம் (8.5% - 10%) • செயலாக்கக் கட்டணம் இல்லை'
    },
    interestRate: {
      hi: '8.5% से 10.25% वार्षिक (बैंकानुसार)',
      en: '8.5% to 10.25% per annum (Bank linked)',
      mr: '8.5% ते 10.25% वार्षिक (बँकेनुसार)',
      ta: 'ஆண்டுக்கு 8.5% முதல் 10.25% வரை'
    },
    collateralFree: true,
    collateralText: {
      hi: 'संपूर्ण ऋण बिना किसी ज़मीन या गिरवी के (CGFMU गारंटीकृत)',
      en: '100% Collateral-Free guaranteed by National Credit Guarantee Trustee Co.',
      mr: 'कोणतीही मालमत्ता गहाण न ठेवता 100% हमीमुक्त कर्ज',
      ta: 'சொத்து பிணை ஏதுமின்றி 100% உத்திரவாதத்துடன் கூடிய கடன்'
    },
    brief: {
      hi: 'छोटे ग्रामीण दुकानदारों, रिपेयरिंग, सर्विस व विनिर्माण के लिए ₹50,000 से ₹20 लाख तक का बिना गारंटी लोन।',
      en: 'Collateral-free institutional micro-credit up to ₹20 Lakhs for non-corporate, non-farm small/micro enterprises.',
      mr: 'लहान व्यावसायिक, कृषी संलग्न सेवा व दुकानांसाठी ₹50,000 ते ₹20 लाखांपर्यंतचे तारणमुक्त कर्ज.',
      ta: 'சிறு கிராமப்புற வணிகங்கள், பழுதுபார்ப்பு மற்றும் சிறு தொழில்களுக்கு ₹20 லட்சம் வரை பிணையில்லா கடன்.'
    },
    description: {
      hi: 'मुद्रा योजना भारत सरकार की सबसे सरल ऋण योजना है। इसमें तीन श्रेणियां हैं: शिशु (₹50 हजार तक - नए काम के लिए), किशोर (₹50 हजार से ₹5 लाख तक - उपकरण व विस्तार हेतु), और तरुण (₹5 लाख से ₹20 लाख तक - व्यवसाय वृद्धि हेतु)। इसमें किसी कोलैटरल की आवश्यकता नहीं होती।',
      en: 'Pradhan Mantri MUDRA Yojana facilitates collateral-free institutional credit to micro-enterprises under three tiers: Shishu (loans up to ₹50,000 for startup stage), Kishor (loans from ₹50,000 to ₹5,00,000 for equipment & working capital), and Tarun (loans up to ₹20,00,000 for established growth enterprises).',
      mr: 'मुद्रा योजना ही देशातील सर्वात सोपी कर्ज योजना आहे. यात तीन टप्पे आहेत: शिशू (₹50,000 पर्यंत), किशोर (₹50 हजार ते ₹5 लाख), आणि तरुण (₹5 लाख ते ₹20 लाख). कोणत्याही जमिनीची किंवा संपत्तीची गहाण गरज नसते.',
      ta: 'முத்ரா யோஜனா என்பது பிணையில்லா கடன் வழங்கும் திட்டமாகும். இதில் சிஷு (₹50,000 வரை), கிஷோர் (₹50,000 முதல் ₹5 லட்சம் வரை), மற்றும் தருண் (₹5 லட்சம் முதல் ₹20 லட்சம் வரை) என மூன்று பிரிவுகளில் கடன் வழங்கப்படுகிறது.'
    },
    eligibility: {
      hi: [
        'भारतीय नागरिक होना अनिवार्य (ग्रामीण व अर्ध-शहरी निवासी)',
        'गैर-कृषि आय उत्पन्न करने वाला उद्यम (दुकान, सेवा, विनिर्माण, एग्री-टूल, डेयरी बूथ)',
        'बैंक में किसी भी पूर्व ऋण पर डिफ़ॉल्ट (CIBIL Defaulter) न हो',
        'शिशु श्रेणी हेतु कोई न्यूनतम शैक्षणिक योग्यता आवश्यक नहीं',
        'महिला उद्यमियों के लिए विशेष ब्याज छूट (Mudra Tarun Plus)'
      ],
      en: [
        'Any Indian citizen with a viable non-farm income generating activity',
        'Applicable for trade, service, artisan, agro-allied repair, and micro manufacturing',
        'Should not be a defaulter to any bank or financial institution',
        'No minimum educational requirement for Shishu tier loans',
        'Interest rate concession for women entrepreneurs'
      ],
      mr: [
        'कोणताही भारतीय नागरिक ज्याचा गैर-कृषी उद्योग सुरू करण्याचा विचार आहे',
        'दुकानदार, सेवा केंद्र, रिपेअरिंग, टेलरिंग, प्रक्रिया युनिट्स पात्र',
        'कोणत्याही बँकेचे थकीत कर्ज नसावे',
        'शिशू कर्जासाठी शिक्षणाची कोणतीही अट नाही',
        'महिला व्यावसायिकांसाठी व्याजदरात विशेष सवलत'
      ],
      ta: [
        'விவசாயம் அல்லாத வருமானம் ஈட்டும் தொழில் செய்யும் எந்தவொரு இந்தியக் குடிமகனும்',
        'சிறு கடைகள், சேவை மையங்கள், பழுதுபார்ப்பு, கைவினைஞர்கள் விண்ணப்பிக்கலாம்',
        'எந்தவொரு வங்கியிலும் கடன் பாக்கி இல்லாமல் இருத்தல் வேண்டும்',
        'சிஷு கடன்களுக்கு குறைந்தபட்ச கல்வித்தகுதி தேவையில்லை',
        'பெண் தொழில்முனைவோருக்கு கூடுதல் வட்டிச் சலுகை'
      ]
    },
    documents: {
      hi: [
        'पहचान पत्र (आधार कार्ड / मतदाता पहचान पत्र)',
        'निवास प्रमाण पत्र (राशन कार्ड / बिजली बिल / पंचायत निवास प्रमाण)',
        'व्यवसाय का प्रमाण (उद्यम पंजीकरण अथवा ग्राम पंचायत अनापत्ति प्रमाण पत्र)',
        'मशीनरी अथवा उपकरणों का कोटेशन (किशोर एवं तरुण लोन हेतु)',
        'पिछले 6 महीने का बैंक स्टेटमेंट एवं पासपोर्ट साइज फोटो'
      ],
      en: [
        'Identity Proof (Aadhaar Card / Voter ID / Driving License)',
        'Address Proof (Electricity Bill / Ration Card / Panchayat certificate)',
        'Proof of Business (Udyam Registration or Panchayat trade NOC)',
        'Quotation for Machinery / Equipment to be purchased (for Kishor/Tarun)',
        'Bank Account Statement of past 6 months and 2 passport photos'
      ],
      mr: [
        'ओळख पुरावा (आधार कार्ड / मतदार ओळखपत्र)',
        'पत्ता पुरावा (लाईट बिल / रेशन कार्ड / ग्रामपंचायत दाखला)',
        'उद्योग नोंदणी (Udyam Registration किंवा ग्रामपंचायत परवाना)',
        'मशिनरीचे कोटेशन (किशोर व तरुण कर्जासाठी)',
        'मागील ६ महिन्यांचे बँक स्टेटमेंट आणि २ पासपोर्ट फोटो'
      ],
      ta: [
        'அடையாளச் சான்று (ஆதார் அட்டை / வாக்காளர் அடையாள அட்டை)',
        'முகவரிச் சான்று (மின் கட்டண ரசீது / குடும்ப அட்டை)',
        'தொழில் பதிவு சான்றிதழ் (Udyam பதிவு அல்லது பஞ்சாயத்து அனுமதி)',
        'இயந்திரங்கள் வாங்குவதற்கான விலைப்பட்டியல் (கொட்டேஷன்)',
        'கடந்த 6 மாத வங்கி கணக்கு அறிக்கை மற்றும் புகைப்படங்கள்'
      ]
    },
    applicationProcess: {
      hi: [
        '१. जन समर्थ पोर्टल (jansamarth.in) पर जाकर PM MUDRA चुनें',
        '२. अपनी आवश्यकतानुसार श्रेणी चुनें (शिशु, किशोर या तरुण)',
        '३. आधार OTP सत्यापन के बाद तुरंत डिजिटल पात्रता जांचें',
        '४. निकटतम ग्रामीण बैंक, SBI, PNB अथवा स्मॉल फाइनेंस बैंक का चयन करें',
        '५. 72 घंटे में बैंक शाखा द्वारा ऋण स्वीकृति व मुद्रा डेबिट कार्ड जारी'
      ],
      en: [
        '1. Visit national JanSamarth portal (jansamarth.in) and select Business Activity Loan',
        '2. Select loan tier: Shishu (<₹50k), Kishor (₹50k-5L), or Tarun (₹5L-20L)',
        '3. Instant Aadhaar OTP authentication and digital in-principle approval',
        '4. Choose nearest servicing Gramin Bank, Public Sector Bank, or Small Finance Bank',
        '5. Loan disbursal within 3-5 working days and MUDRA RuPay Debit Card issuance'
      ],
      mr: [
        '१. जन समर्थ पोर्टलवर (jansamarth.in) जाऊन मुद्रा कर्ज निवडा',
        '२. आवश्यकतेनुसार प्रवर्ग निवडा (शिशू, किशोर किंवा तरुण)',
        '३. आधार व्हेरिफिकेशन करून त्वरित डिजिटल मंजुरी मिळवा',
        '४. जवळच्या ग्रामीण बँक किंवा राष्ट्रीयीकृत बँकेची निवड करा',
        '५. ३ ते ५ दिवसांत कर्ज वितरण व मुद्रा रूपे कार्ड प्राप्त'
      ],
      ta: [
        '1. ஜன் சமர்த் போர்ட்டலில் (jansamarth.in) சென்று முத்ரா கடனைத் தேர்ந்தெடுக்கவும்',
        '2. தேவையான வகையைத் தேர்ந்தெடுக்கவும் (சிஷு, கிஷோர் அல்லது தருண்)',
        '3. ஆதார் சரிபார்ப்பு மூலம் உடனடி டிஜிட்டல் ஒப்புதல் பெறவும்',
        '4. அருகிலுள்ள கிராம வங்கி அல்லது அரசு வங்கியைத் தேர்வு செய்யவும்',
        '5. 3-5 வேலை நாட்களில் கடன் வழங்கப்பட்டு முத்ரா டெபிட் கார்டு வழங்கப்படும்'
      ]
    },
    officialPortal: 'https://www.jansamarth.in/business-activity-loan',
    portalName: 'JanSamarth National Portal',
    targetSectors: ['Retail', 'Services', 'Solar', 'Dairy', 'CSC', 'Tailoring', 'Workshops']
  },
  {
    id: 'scheme_pmfme',
    code: 'PMFME',
    badge: {
      hi: '35% खाद्य सब्सिडी • ODOP क्लस्टर',
      en: '35% Capital Subsidy • ODOP Cluster',
      mr: '35% अन्न प्रक्रिया सबसिडी • ODOP',
      ta: '35% மூலதன மானியம் • ODOP திட்டம்'
    },
    name: {
      hi: 'पीएम सूक्ष्म खाद्य प्रसंस्करण उद्यम योजना (PMFME)',
      en: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
      mr: 'पीएम सूक्ष्म अन्न प्रक्रिया उद्योग योजना (PMFME)',
      ta: 'பிரதமர் குறு உணவு பதப்படுத்தும் தொழில் திட்டம் (PMFME)'
    },
    ministry: {
      hi: 'खाद्य प्रसंस्करण उद्योग मंत्रालय (MoFPI)',
      en: 'Ministry of Food Processing Industries (MoFPI)',
      mr: 'अन्न प्रक्रिया उद्योग मंत्रालय (MoFPI)',
      ta: 'உணவு பதப்படுத்தும் தொழில் அமைச்சகம் (MoFPI)'
    },
    category: 'food_processing',
    maxLoanAmount: 1000000,
    maxLoanDisplay: {
      hi: 'परियोजना लागत: ₹10 लाख से ₹30 लाख तक (सब्सिडी: अधिकतम ₹10 लाख)',
      en: 'Project Cost: ₹10L - ₹30L (Subsidy: Max ₹10 Lakh)',
      mr: 'प्रकल्प खर्च: ₹10 लाख ते ₹30 लाख (सबसिडी: कमाल ₹10 लाख)',
      ta: 'திட்ட மதிப்பீடு: ₹30 லட்சம் வரை (மானியம்: அதிகபட்சம் ₹10 லட்சம்)'
    },
    subsidyRateRural: 35,
    subsidyRateSpecial: 35,
    subsidyDisplay: {
      hi: '35% सीधी क्रेडिट लिंक्ड कैपिटल सब्सिडी (अधिकतम ₹10 लाख)',
      en: '35% Direct Credit-Linked Capital Subsidy (Up to ₹10 Lakhs)',
      mr: '35% थेट भांडवली सबसिडी (कमाल ₹10 लाखांपर्यंत)',
      ta: '35% நேரடி மூலதன மானியம் (அதிகபட்சம் ₹10 லட்சம் வரை)'
    },
    interestRate: {
      hi: 'प्राथमिकता क्षेत्र रियायती बैंक दर (8.5% - 9.75%)',
      en: 'Priority Sector Lending Concessional Rate (8.5% - 9.75%)',
      mr: 'प्राधान्य क्षेत्रासाठी सवलतीचे व्याजदर (8.5% - 9.75%)',
      ta: 'முன்னுரிமை துறை வங்கி வட்டி விகிதம் (8.5% - 9.75%)'
    },
    collateralFree: true,
    collateralText: {
      hi: '₹10 लाख तक के ऋण पर CGTMSE के तहत कोलैटरल की छूट',
      en: 'Collateral-free for loans up to ₹10 Lakh under CGTMSE cover',
      mr: '₹10 लाखांपर्यंत CGTMSE अंतर्गत तारणमुक्त कर्ज',
      ta: 'CGTMSE திட்டத்தின் கீழ் ₹10 லட்சம் வரை பிணையில்லா கடன்'
    },
    brief: {
      hi: 'आटा चक्की, तेल मिल, मसाला पिसाई, बेकरी, दुग्ध उत्पाद (घी/पनीर) व अचार उद्योग पर 35% सरकारी सब्सिडी।',
      en: 'Credit-linked capital subsidy of 35% for establishing or upgrading micro food processing units.',
      mr: 'आटा चक्की, तेल गिरणी, मसाला उद्योग, बेकरी आणि दुग्ध प्रक्रिया युनिट्ससाठी 35% थेट सबसिडी.',
      ta: 'மாவை அரைக்கும் ஆலை, எண்ணெய் ஆலை, மசாலா பொடி, பால் பொருட்கள் பதப்படுத்துதல் மற்றும் பேக்கரிக்கு 35% மானியம்.'
    },
    description: {
      hi: 'PMFME योजना खाद्य प्रसंस्करण उद्योग मंत्रालय द्वारा एक ज़िला एक उत्पाद (ODOP) दृष्टिकोण पर संचालित है। इसमें तेल पेरने वाली कोल्हू, मसाला पिसाई, दाल मिल, डेयरी उत्पाद (खोया, पनीर, मक्खन), बेकरी, और फलों/सब्जियों के प्रसंस्करण पर कुल लागत का 35% (अधिकतम ₹10 लाख) सरकारी अनुदान मिलता है।',
      en: 'The PMFME Scheme adopts the One District One Product (ODOP) approach to leverage scale in procurement of inputs, common services, and marketing of products. Individual micro-enterprises receive a 35% credit-linked capital subsidy with a maximum ceiling of ₹10 Lakh per unit, alongside FSSAI certification and branding support.',
      mr: 'PMFME ही अन्न प्रक्रिया उद्योगांसाठी विशेष योजना आहे. तेल गिरणी, पीठ गिरणी, मिरची मसाला युनिट, बेकरी आणि दुग्ध प्रक्रिया (पनीर, खवा) उद्योगांसाठी प्रकल्प खर्चाच्या 35% (कमाल ₹10 लाख) थेट शासकीय अनुदान मिळते.',
      ta: 'PMFME திட்டம் என்பது "ஒரு மாவட்டம் ஒரு பொருள்" (ODOP) அணுகுமுறையை அடிப்படையாகக் கொண்டது. எண்ணெய் ஆலைகள், பருப்பு ஆலைகள், மசாலா உற்பத்தி, பேக்கரி மற்றும் பால் பதப்படுத்தும் அலகுகளுக்கு திட்ட மதிப்பீட்டில் 35% வரை (அதிகபட்சம் ₹10 லட்சம்) மானியம் வழங்கப்படுகிறது.'
    },
    eligibility: {
      hi: [
        'आयु: 18 वर्ष या उससे अधिक',
        'व्यक्तिगत सूक्ष्म खाद्य प्रसंस्करण उद्यम (मौजूदा अथवा नया)',
        'एक परिवार से एक ही व्यक्ति पात्र होगा',
        'स्वयं का अंशदान परियोजना लागत का न्यूनतम 10% होना चाहिए',
        'FSSAI खाद्य सुरक्षा मानकों का पालन करने की सहमति'
      ],
      en: [
        'Age: Minimum 18 years',
        'Individual micro-food processor (Existing upgrade or new greenfield unit)',
        'Only one member from a family is eligible for subsidy grant',
        'Applicant must contribute at least 10% of total project cost',
        'Commitment to adhere to basic FSSAI hygiene standards'
      ],
      mr: [
        'वय: किमान 18 वर्षे',
        'अन्न प्रक्रिया उद्योग (नवीन युनिट किंवा जुन्याचा विस्तार)',
        'एका कुटुंबातून फक्त एकाच व्यक्तीस लाभ',
        'स्वतःचे भांडवल किमान 10% असणे आवश्यक',
        'FSSAI अन्न सुरक्षा नियमांचे पालन करण्याचे आश्वासन'
      ],
      ta: [
        'வயது: குறைந்தபட்சம் 18 வயது பூர்த்தியடைந்திருக்க வேண்டும்',
        'உணவு பதப்படுத்தும் தொழில் செய்வோர் (புதிய அலகு அல்லது விரிவாக்கம்)',
        'ஒரு குடும்பத்தில் ஒருவருக்கு மட்டுமே மானிய உதவி',
        'திட்ட மதிப்பில் குறைந்தபட்சம் 10% சொந்த முதலீடு செய்ய வேண்டும்',
        'FSSAI உணவு பாதுகாப்பு விதிமுறைகளை பின்பற்ற வேண்டும்'
      ]
    },
    documents: {
      hi: [
        'आधार कार्ड एवं पैन कार्ड',
        'निवास प्रमाण पत्र एवं बैंक खाता विवरण (6 माह)',
        'मशीनरी का कोटेशन (निर्माता / सप्लायर से)',
        'विस्तृत प्रोजेक्ट रिपोर्ट (GramUdyam DPR)',
        'दुकान/भूमि का स्वामित्व अथवा किरायानामा (Rent Agreement)',
        'FSSAI लाइसेंस/पंजीकरण (यदि उपलब्ध हो, अन्यथा सहायता दी जाती है)'
      ],
      en: [
        'Aadhaar Card and PAN Card of applicant',
        'Address Proof and Bank Statement for the past 6 months',
        'Valid Machinery Quotation from authorized vendor/supplier',
        'Detailed Project Report (DPR) prepared via GramUdyam',
        'Proof of premises ownership or minimum 3-year registered lease deed',
        'Basic FSSAI registration (assistance provided by District Resource Person)'
      ],
      mr: [
        'आधार कार्ड आणि पॅन कार्ड',
        'रहिवासी दाखला आणि ६ महिन्यांचे बँक पासबुक',
        'मशिनरीचे अधिकृत कोटेशन',
        'प्रकल्प अहवाल (GramUdyam DPR)',
        'जागेचा पुरावा (7/12 उतारा किंवा भाडेकरार)',
        'FSSAI नोंदणी प्रत (नसल्यास मार्गदर्शन केले जाते)'
      ],
      ta: [
        'விண்ணப்பதாரரின் ஆதார் மற்றும் பான் அட்டை',
        'முகவரிச் சான்று மற்றும் கடந்த 6 மாத வங்கி கணக்கு புத்தகம்',
        'இயந்திரங்களுக்கான அதிகாரப்பூர்வ விலைப்பட்டியல் (Quotation)',
        'GramUdyam மூலம் உருவாக்கப்பட்ட விரிவான திட்ட அறிக்கை (DPR)',
        'தொழில் செய்யும் இடத்தின் பட்டா அல்லது வாடகை ஒப்பந்த பத்திரம்',
        'FSSAI பதிவு சான்றிதழ் (இல்லையெனில் பெற உதவி செய்யப்படும்)'
      ]
    },
    applicationProcess: {
      hi: [
        '१. PMFME आधिकारिक राष्ट्रीय पोर्टल (pmfme.mofpi.gov.in) पर पंजीकरण करें',
        '२. ज़िला रिसोर्स पर्सन (DRP) आपके गांव में डीपीआर और फॉर्म भरने में मदद करेगा',
        '३. ज़िला स्तरीय समिति (DLC) द्वारा आवेदन की समीक्षा एवं अनुमोदन',
        '४. नोडल बैंक शाखा द्वारा ऋण राशि का वितरण',
        '५. 35% सब्सिडी राशि बैंक खाते में सीधे ट्रांसफर की जाएगी'
      ],
      en: [
        '1. Register online on the national PMFME MIS portal (pmfme.mofpi.gov.in)',
        '2. District Resource Person (DRP) assigned to assist with DPR and compliance',
        '3. District Level Committee (DLC) chaired by District Collector clears application',
        '4. Sponsoring bank disburses term loan and working capital',
        '5. 35% capital subsidy is released to beneficiary loan linked subsidy account'
      ],
      mr: [
        '१. PMFME च्या pmfme.mofpi.gov.in या पोर्टलवर ऑनलाइन अर्ज करा',
        '२. जिल्हा साधन व्यक्ती (DRP) डीपीआर व अर्जासाठी मदत करेल',
        '३. जिल्हाधिकारी अध्यक्षतेखालील समितीकडून मंजुरी',
        '४. बँकेकडून कर्ज वाटप',
        '५. 35% सबसिडी थेट बँक खात्यात वर्ग'
      ],
      ta: [
        '1. pmfme.mofpi.gov.in என்ற அதிகாரப்பூர்வ இணையதளத்தில் பதிவு செய்யவும்',
        '2. மாவட்ட வள நபர் (DRP) திட்ட அறிக்கை மற்றும் ஆவணங்களுக்கு உதவுவார்',
        '3. மாவட்ட ஆட்சியர் தலைமையிலான குழு விண்ணப்பத்தை ஆய்வு செய்து ஒப்புதல் அளிக்கும்',
        '4. வங்கி கிளையிலிருந்து கடன் தொகை விடுவிக்கப்படும்',
        '5. 35% மூலதன மானியம் வங்கிக் கணக்கில் வரவு வைக்கப்படும்'
      ]
    },
    officialPortal: 'https://pmfme.mofpi.gov.in/',
    portalName: 'PMFME Official Portal',
    targetSectors: ['Food Processing', 'Dairy', 'Oil Mill', 'Flour Mill', 'Bakery', 'Spices', 'Pickles']
  },
  {
    id: 'scheme_pm_vishwakarma',
    code: 'PM-VISHWAKARMA',
    badge: {
      hi: '₹3 लाख रियायती ऋण (5%) • ₹15,000 टूलकिट',
      en: '₹3L Loan @ 5% Concessional • ₹15k Tool Kit',
      mr: '₹3 लाख कर्ज (5% व्याज) • ₹15,000 टूलकिट',
      ta: '₹3 லட்சம் கடன் (5% வட்டி) • ₹15,000 கருவித்தொகுப்பு'
    },
    name: {
      hi: 'पीएम विश्वकर्मा योजना (PM Vishwakarma)',
      en: 'PM Vishwakarma Scheme',
      mr: 'पीएम विश्वकर्मा योजना',
      ta: 'பிரதமர் விஸ்வகர்மா திட்டம்'
    },
    ministry: {
      hi: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय एवं कौशल विकास मंत्रालय',
      en: 'Ministry of MSME & Ministry of Skill Development',
      mr: 'एमएसएमई आणि कौशल्य विकास मंत्रालय',
      ta: 'குறு, சிறு மற்றும் நடுத்தர தொழில் மற்றும் திறன் மேம்பாட்டு அமைச்சகம்'
    },
    category: 'artisans',
    maxLoanAmount: 300000,
    maxLoanDisplay: {
      hi: 'प्रथम चरण: ₹1 लाख | द्वितीय चरण: ₹2 लाख (कुल ₹3 लाख)',
      en: 'Tranche 1: ₹1 Lakh | Tranche 2: ₹2 Lakh (Total ₹3 Lakh)',
      mr: 'पहिला टप्पा: ₹1 लाख | दुसरा टप्पा: ₹2 लाख (एकूण ₹3 लाख)',
      ta: 'முதல் தவணை: ₹1 லட்சம் | இரண்டாம் தவணை: ₹2 லட்சம் (மொத்தம் ₹3 லட்சம்)'
    },
    subsidyRateRural: 8,
    subsidyRateSpecial: 8,
    subsidyDisplay: {
      hi: '₹15,000 मुफ़्त आधुनिक टूलकिट वाउचर + ₹500 प्रतिदिन प्रशिक्षण भत्ता',
      en: '₹15,000 Free Toolkit e-Voucher + ₹500/day Training Stipend',
      mr: '₹15,000 मोफत टूलकिट व्हाउचर + ₹500 प्रतिदिन प्रशिक्षण भत्ता',
      ta: '₹15,000 மதிப்புள்ள இலவச நவீன கருவித்தொகுப்பு + நாள் ஒன்றுக்கு ₹500 உதவித்தொகை'
    },
    interestRate: {
      hi: 'मात्र 5% निश्चित रियायती ब्याज दर (8% सरकार वहन करेगी)',
      en: 'Flat 5% Concessional Interest Rate (Govt subvention up to 8%)',
      mr: 'केवळ 5% सवलतीचा व्याजदर (बाकी 8% शासन भरेल)',
      ta: 'வெறும் 5% சலுகை வட்டி விகிதம் (8% வரை அரசே ஏற்கும்)'
    },
    collateralFree: true,
    collateralText: {
      hi: '100% बिना गारंटी (क्रेडिट गारंटी फंड द्वारा सुरक्षित)',
      en: '100% Collateral-Free covered under Credit Guarantee Fund for Micro Units',
      mr: 'कोणतेही तारण न देता 100% गहाणमुक्त कर्ज',
      ta: 'எந்தவித சொத்து பிணையமும் இன்றி 100% பாதுகாப்பான கடன்'
    },
    brief: {
      hi: 'पारंपरिक बढ़ई, लोहार, दर्जी, कुम्हार, राजमिस्त्री व मूर्तिकारों को 5% ब्याज पर ₹3 लाख ऋण, मुफ़्त टूलकिट व कौशल प्रशिक्षण।',
      en: 'Support for traditional artisans and craftspeople with ₹3 Lakh collateral-free loan @ 5%, ₹15,000 modern toolkit, and stipend.',
      mr: 'पारंपारिक सुतार, लोहार, शिंपी, कुंभार, गवंडी व कारागिरांसाठी 5% व्याजाने ₹3 लाख कर्ज व मोफत आधुनिक टूलकिट.',
      ta: 'பாரம்பரிய தச்சர்கள், கொல்லர்கள், தையல்காரர்கள், குயவர்கள் மற்றும் கொத்தனார்களுக்கு 5% வட்டியில் ₹3 லட்சம் கடன் மற்றும் இலவச கருவித்தொகுப்பு.'
    },
    description: {
      hi: 'पीएम विश्वकर्मा योजना भारत के 18 पारंपरिक शिल्पकलाओं और हस्तशिल्पियों के उत्थान के लिए समर्पित है। पात्र कारीगरों को विश्वकर्मा प्रमाण पत्र, 5-7 दिवसीय बुनियादी कौशल प्रशिक्षण, ₹500 प्रतिदिन वजीफा, ₹15,000 का आधुनिक टूलकिट ई-वाउचर, तथा 5% रियायती ब्याज दर पर ₹3 लाख तक का बिना गारंटी बैंक ऋण प्रदान किया जाता है।',
      en: 'PM Vishwakarma covers 18 traditional crafts (Carpenters, Boat Makers, Armourers, Blacksmiths, Hammer/Tool Kit Makers, Locksmiths, Sculptors, Potters, Cobblers, Masons, Basket/Mat/Broom Makers, Doll/Toy Makers, Barbers, Garland Makers, Washermen, Tailors, Fishing Net Makers). Includes Skill Upgradation, Toolkit Incentive of ₹15,000, and enterprise credit up to ₹3,00,000 @ 5% interest.',
      mr: 'पीएम विश्वकर्मा योजना ही 18 पारंपारिक कारागिरांसाठी सुरू केलेली योजना आहे. सुतार, लोहार, कुंभार, गवंडी, शिंपी इत्यादींना ₹15,000 चे मोफत टूलकिट, ₹500 प्रतिदिन भत्ता, आणि 5% सवलतीच्या व्याजाने ₹3 लाखांपर्यंतचे बिनव्याजी कर्ज मिळते.',
      ta: 'பாரம்பரிய 18 கைவினைத் தொழில்களில் ஈடுபட்டுள்ள தச்சர்கள், கொல்லர்கள், குயவர்கள், கொத்தனார்கள், தையல்காரர்கள், முடிதிருத்துபவர்கள் உள்ளிட்டோருக்கு இத்திட்டம் பொருந்தும். ₹15,000 கருவித்தொகுப்பு, திறன் பயிற்சி மற்றும் 5% வட்டி விகிதத்தில் ₹3 லட்சம் வரை பிணையில்லா கடன் வழங்கப்படுகிறது.'
    },
    eligibility: {
      hi: [
        'आयु: 18 वर्ष या उससे अधिक',
        '18 चिह्नित पारंपरिक व्यवसायों (बढ़ई, लोहार, दर्जी, कुम्हार, राजमिस्त्री आदि) में कार्यरत',
        'स्वरोजगार आधारित हाथों व औजारों से काम करने वाला कारीगर',
        'परिवार में किसी सदस्य ने पूर्व में पीएमईजीपी या मुद्रा में बड़ा डिफ़ॉल्ट न किया हो',
        'सरकारी सेवा में कार्यरत व्यक्ति इसके पात्र नहीं हैं'
      ],
      en: [
        'Age: Minimum 18 years on the date of registration',
        'Engaged in one of the 18 identified traditional family trades',
        'Artisan working with hands and tools on self-employment basis',
        'Should not have availed benefits under PMEGP or PM Svanidhi in the past 5 years with default',
        'Govt employees and their immediate family members are excluded'
      ],
      mr: [
        'वय: किमान 18 वर्षे पूर्ण असावी',
        '18 पारंपारिक व्यवसायांपैकी (सुतार, लोहार, शिंपी, गवंडी इ.) एका व्यवसायात कार्यरत',
        'हाताने व पारंपरिक अवजारांनी काम करणारा कारागीर',
        'शासकीय सेवेत नसलेला नागरिक',
        'एका कुटुंबातून फक्त एकाच व्यक्तीस लाभ'
      ],
      ta: [
        'விண்ணப்பிக்கும் போது குறைந்தபட்சம் 18 வயது பூர்த்தியடைந்திருக்க வேண்டும்',
        'குறிப்பிடப்பட்ட 18 பாரம்பரிய கைவினைத் தொழில்களில் ஒன்றில் ஈடுபட்டிருக்க வேண்டும்',
        'சுயதொழில் செய்யும் பாரம்பரிய கைவினைஞர்கள்',
        'அரசு ஊழியர்கள் மற்றும் அவர்களது குடும்பத்தினர் இத்திட்டத்தில் பயன்பெற முடியாது',
        'ஒரு குடும்பத்தில் ஒருவருக்கு மட்டுமே இந்த உதவி வழங்கப்படும்'
      ]
    },
    documents: {
      hi: [
        'आधार कार्ड (मोबाइल नंबर लिंक होना चाहिए)',
        'सक्रिय बैंक खाता पासबुक (आधार से लिंक NPCI DBT Enabled)',
        'राशन कार्ड अथवा परिवार पहचान पत्र',
        'ग्राम प्रधान अथवा पंचायत सचिव द्वारा कारीगरी सत्यापन'
      ],
      en: [
        'Aadhaar Card with linked active mobile number',
        'Active Bank Account Passbook (Aadhaar seeded for DBT)',
        'Ration Card / Family Composition Certificate',
        'Gram Panchayat Head / Secretary Craftsmanship Verification'
      ],
      mr: [
        'आधार कार्ड (मोबाईल नंबर लिंक असलेले)',
        'बँक पासबुक (आधार लिंक डीबीटी सक्रिय)',
        'रेशन कार्ड किंवा कुटुंब ओळखपत्र',
        'ग्रामपंचायत सरपंच किंवा ग्रामसेवकाचे व्यावसायिक प्रमाणपत्र'
      ],
      ta: [
        'மொபைல் எண்ணுடன் இணைக்கப்பட்ட ஆதார் அட்டை',
        'வங்கி கணக்கு புத்தகம் (ஆதார் இணைக்கப்பட்ட நேரடி மானிய வங்கி கணக்கு)',
        'ரேஷன் கார்டு (குடும்ப அட்டை)',
        'கிராம ஊராட்சி தலைவர் அல்லது செயலாளரின் தொழில் சரிபார்ப்பு சான்றிதழ்'
      ]
    },
    applicationProcess: {
      hi: [
        '१. कॉमन सर्विस सेंटर (CSC) अथवा ग्रामउद्यम पोर्टल से पंजीकरण करें',
        '२. ग्राम प्रधान एवं पंचायत सचिव द्वारा कारीगर की त्रिस्तरीय पुष्टि (3-Tier Verification)',
        '३. 5 दिवसीय बुनियादी कौशल प्रशिक्षण एवं ₹15,000 टूलकिट वाउचर जारी',
        '४. प्रथम चरण में ₹1,00,000 का 5% ब्याज पर ऋण वितरण (18 माह अवधि)',
        '५. समय पर चुकता करने पर द्वितीय चरण में ₹2,00,000 का अतिरिक्त ऋण (30 माह)'
      ],
      en: [
        '1. Enroll at nearest Common Service Centre (CSC) or online at pmvishwakarma.gov.in',
        '2. Three-tier verification: Gram Panchayat -> District Level Committee -> National Committee',
        '3. Basic 5-day skill training with ₹500/day stipend & ₹15,000 toolkit digital voucher',
        '4. Tranche 1 loan of ₹1,00,000 disbursed @ 5% interest (18-month repayment tenure)',
        '5. Tranche 2 loan of ₹2,00,000 unlocked upon standard repayment of Tranche 1'
      ],
      mr: [
        '१. जवळच्या सीएससी (CSC) केंद्रावर जाऊन मोफत नोंदणी करा',
        '२. ग्रामपंचायत सरपंच व ग्रामसेवकाकडून ३-स्तरीय पडताळणी',
        '३. ५ दिवसांचे कौशल्य प्रशिक्षण आणि ₹15,000 चे आधुनिक टूलकिट व्हाउचर',
        '४. पहिल्या टप्प्यात 5% व्याजाने ₹1 लाख कर्ज वितरण',
        '५. वेळेवर परतफेडीनंतर दुसऱ्या टप्प्यात ₹2 लाख अतिरिक्त कर्ज'
      ],
      ta: [
        '1. அருகிலுள்ள பொது சேவை மையம் (CSC) மூலம் இலவசமாக பதிவு செய்யவும்',
        '2. கிராம ஊராட்சி மற்றும் மாவட்ட அளவிலான மூன்று அடுக்கு சரிபார்ப்பு',
        '3. 5 நாட்கள் திறன் பயிற்சி மற்றும் ₹15,000 கருவித்தொகுப்பு கூப்பன் பெறுதல்',
        '4. முதல் தவணையாக 5% வட்டி விகிதத்தில் ₹1,00,000 கடன் வழங்கப்படுதல்',
        '5. முதல் தவணையை சரியாக திருப்பிச் செலுத்திய பின் ₹2,00,000 வரை இரண்டாம் தவணை கடன்'
      ]
    },
    officialPortal: 'https://pmvishwakarma.gov.in/',
    portalName: 'PM Vishwakarma Portal',
    targetSectors: ['Carpentry', 'Blacksmith', 'Tailoring', 'Pottery', 'Masonry', 'Sculpture', 'Traditional Crafts']
  },
  {
    id: 'scheme_standup_india',
    code: 'STAND-UP-INDIA',
    badge: {
      hi: '₹1 करोड़ तक ग्रीनफील्ड ऋण • SC/ST/महिला',
      en: 'Up to ₹1 Crore • SC/ST & Women Focus',
      mr: '₹1 कोटींपर्यंत कर्ज • SC/ST व महिला',
      ta: '₹1 கோடி வரை கடன் • SC/ST மற்றும் பெண்கள்'
    },
    name: {
      hi: 'स्टैंड-अप इंडिया योजना (Stand-Up India)',
      en: 'Stand-Up India Scheme',
      mr: 'स्टँड-अप इंडिया योजना',
      ta: 'ஸ்டாண்ட்-அப் இந்தியா திட்டம்'
    },
    ministry: {
      hi: 'वित्तीय सेवाएं विभाग, वित्त मंत्रालय (MoF)',
      en: 'Department of Financial Services, Ministry of Finance',
      mr: 'वित्तीय सेवा विभाग, वित्त मंत्रालय',
      ta: 'நிதி சேவைகள் துறை, மத்திய நிதி அமைச்சகம்'
    },
    category: 'women_shg',
    maxLoanAmount: 10000000,
    maxLoanDisplay: {
      hi: '₹10 लाख से ₹1 करोड़ तक बैंक ऋण',
      en: '₹10 Lakh to ₹1 Crore Enterprise Loan',
      mr: '₹10 लाख ते ₹1 कोटी व्यावसायिक कर्ज',
      ta: '₹10 லட்சம் முதல் ₹1 கோடி வரை தொழில் கடன்'
    },
    subsidyRateRural: 15,
    subsidyRateSpecial: 25,
    subsidyDisplay: {
      hi: 'मार्जिन मनी में 15% तक सरकारी सहायता • 7 वर्ष पुनर्भुगतान अवधि',
      en: 'Margin Money convergence up to 15% • 7-Year Tenure',
      mr: 'मार्जिन मनीमध्ये 15% सवलत • 7 वर्षांची परतफेड मुदत',
      ta: 'விளிம்புத் தொகையில் 15% வரை அரசு மானியம் • 7 ஆண்டுகள் தவணை'
    },
    interestRate: {
      hi: 'बैंक का सबसे निम्न ब्याज दर (MCLR + 3% + Tenor Premium)',
      en: 'Lowest applicable bank rate (MCLR + up to 3% + Tenor Premium)',
      mr: 'बँकेचा सर्वात कमी लागू व्याजदर',
      ta: 'குறைந்தபட்ச வங்கி வட்டி விகிதம்'
    },
    collateralFree: false,
    collateralText: {
      hi: 'क्रेडिट गारंटी फंड फॉर स्टैंड-अप इंडिया (CGFSI) द्वारा समर्थित',
      en: 'Covered under Credit Guarantee Scheme for Stand Up India (CGFSI)',
      mr: 'स्टँड-अप इंडिया क्रेडिट गॅरंटी फंडद्वारे संरक्षित',
      ta: 'ஸ்டாண்ட்-அப் இந்தியா கடன் உத்தரவாத நிதியத்தின் கீழ் பாதுகாப்பானது'
    },
    brief: {
      hi: 'अनुसूचित जाति (SC), अनुसूचित जनजाति (ST) एवं महिला उद्यमियों को विनिर्माण या सेवा उद्यम लगाने हेतु ₹10 लाख से ₹1 करोड़ तक ऋण।',
      en: 'Facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one SC/ST borrower and one Woman per bank branch.',
      mr: 'अनुसूचित जाती, जमाती आणि महिला उद्योजकांसाठी नवीन उद्योगाकरिता ₹10 लाख ते ₹1 कोटींपर्यंतचे बँक कर्ज.',
      ta: 'SC/ST மற்றும் பெண் தொழில்முனைவோர் புதிய தொழில்கள் தொடங்க ₹10 லட்சம் முதல் ₹1 கோடி வரை வங்கிக் கடன்.'
    },
    description: {
      hi: 'स्टैंड-अप इंडिया योजना देश की प्रत्येक बैंक शाखा से कम से कम एक एससी/एसटी और कम से कम एक महिला उद्यमी को ग्रीनफील्ड सूक्ष्म/लघु उद्यम लगाने हेतु ₹10 लाख से ₹1 करोड़ का ऋण सुनिश्चित करती है। इसमें मार्जिन मनी को केंद्र/राज्य योजनाओं के संयोजन से केवल 15% तक सीमित किया गया है।',
      en: 'Stand-Up India Scheme facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one SC or ST borrower and at least one Woman borrower per bank branch for setting up a greenfield enterprise in manufacturing, services, agri-allied activities, or the trading sector.',
      mr: 'या योजनेअंतर्गत देशातील प्रत्येक बँक शाखेकडून किमान एका SC/ST आणि एका महिला उद्योजिकेला नवीन व्यवसायासाठी ₹10 लाख ते ₹1 कोटींचे कर्ज दिले जाते. उत्पादन, सेवा किंवा व्यापार क्षेत्रात नवीन प्रकल्प उभारण्यासाठी ही मोठी योजना आहे.',
      ta: 'ஒவ்வொரு வங்கிக் கிளையும் குறைந்தபட்சம் ஒரு SC/ST விண்ணப்பதாரருக்கும், ஒரு பெண் தொழில்முனைவோருக்கும் உற்பத்தி, சேவை அல்லது வர்த்தகத் துறையில் புதிய தொழில் தொடங்க ₹10 லட்சம் முதல் ₹1 கோடி வரை கடன் வழங்க வேண்டும் என்பதை இத்திட்டம் உறுதி செய்கிறது.'
    },
    eligibility: {
      hi: [
        'केवल SC / ST वर्ग अथवा महिला उद्यमी (आयु 18+ वर्ष)',
        'केवल नए उद्यम (Greenfield Enterprise) की स्थापना हेतु',
        'गैर-व्यक्तिगत उद्यमों में 51% शेयरधारिता SC/ST अथवा महिला के पास होनी चाहिए',
        'किसी भी बैंक या वित्तीय संस्थान में डिफ़ॉल्टर न हों',
        'ऋण में टर्म लोन तथा वर्किंग कैपिटल दोनों शामिल हैं'
      ],
      en: [
        'SC/ST and/or Women entrepreneurs above 18 years of age',
        'Loans under the scheme are available only for greenfield projects',
        'In case of non-individual enterprises, 51% shareholding must be held by SC/ST or Women',
        'Borrower should not be in default to any bank or financial institution',
        'Composite loan covers both equipment term loan and working capital'
      ],
      mr: [
        'केवळ SC/ST प्रवर्गातील व्यक्ती किंवा कोणत्याही प्रवर्गातील महिला उद्योजिका',
        'केवळ नवीन उद्योगाच्या उभारणीसाठी (Greenfield Project)',
        'भागीदारी संस्थेत 51% हिस्सा SC/ST किंवा महिला भागीदाराचा असावा',
        'बँकेचा कोणताही आर्थिक डिफॉल्ट नसावा',
        'मुदत कर्ज व खेळते भांडवल दोन्ही समाविष्ट'
      ],
      ta: [
        '18 வயதுக்கு மேற்பட்ட SC/ST அல்லது பெண் தொழில்முனைவோர் மட்டுமே விண்ணப்பிக்கலாம்',
        'புதிய தொழில் தொடங்க மட்டுமே இக்கடன் வழங்கப்படும் (Greenfield projects)',
        'கூட்டு நிறுவனமாக இருப்பின், 51% பங்குகள் SC/ST அல்லது பெண்களிடம் இருக்க வேண்டும்',
        'வங்கிகளில் எந்தவொரு கடன் பாக்கியும் இல்லாதவராக இருத்தல் வேண்டும்',
        'இயந்திரங்கள் வாங்க மற்றும் நடைமுறை மூலதனம் இரண்டிற்கும் கடன் கிடைக்கும்'
      ]
    },
    documents: {
      hi: [
        'जाति प्रमाण पत्र (SC/ST हेतु) अथवा महिला पहचान प्रमाण',
        'आधार कार्ड, पैन कार्ड एवं पासपोर्ट साइज फोटो',
        'कंपनी/फर्म का पंजीकरण एवं 51% शेयरधारिता प्रमाण',
        'विस्तृत व्यावसायिक प्रोजेक्ट रिपोर्ट (DPR)',
        'भूमि/दुकान के कागजात अथवा पंजीकृत लीज डीड (Lease Agreement)',
        'मशीनरी सप्लायर से अधिकृत कोटेशन'
      ],
      en: [
        'Caste Certificate (for SC/ST applicants) / Woman Proof of Identity',
        'Aadhaar Card, PAN Card, and latest Passport Photographs',
        'Enterprise registration documents showing 51% controlling stake',
        'Detailed Business Project Report (DPR) with financial viability',
        'Factory/Office lease deed or title deeds of proposed premises',
        'Machinery/Equipment invoices and proforma quotations'
      ],
      mr: [
        'जातीचा दाखला (SC/ST साठी) / महिला ओळख पुरावा',
        'आधार कार्ड, पॅन कार्ड आणि पासपोर्ट फोटो',
        'उद्योग नोंदणी कागदपत्रे आणि 51% भागभांडवल पुरावा',
        'सविस्तर प्रकल्प अहवाल (DPR)',
        'जागेचे 7/12 किंवा नोंदणीकृत भाडेकरार',
        'मशिनरीचे कोटेशन'
      ],
      ta: [
        'சாதிச் சான்றிதழ் (SC/ST பிரிவினருக்கு) / பெண்களுக்கான அடையாளச் சான்று',
        'ஆதார் அட்டை, பான் அட்டை மற்றும் புகைப்படங்கள்',
        'நிறுவனப் பதிவு சான்றிதழ் (51% பங்கு இருப்பதற்கான ஆவணம்)',
        'விரிவான வணிக திட்ட அறிக்கை (DPR)',
        'தொழில் செய்யும் இடத்தின் ஆவணங்கள் அல்லது குத்தகை ஒப்பந்தம்',
        'இயந்திரங்களின் விலைப்பட்டியல் மற்றும் கொள்முதல் விவரங்கள்'
      ]
    },
    applicationProcess: {
      hi: [
        '१. स्टैंड-अप मित्र पोर्टल (standupmitra.in) पर ऑनलाइन प्रोफाइल बनाएं',
        '२. ग्रामउद्यम द्वारा तैयार की गई 5-वर्षीय DPR रिपोर्ट संलग्न करें',
        '३. हैंड-होल्डिंग एजेंसी (SIDBI/NABARD) द्वारा आवेदन का तकनीकी सत्यापन',
        '४. चुनी गई बैंक शाखा में साक्षात्कार व ऋण स्वीकृति आदेश जारी',
        '५. मार्जिन मनी और टर्म लोन वितरण'
      ],
      en: [
        '1. Apply online directly at Stand-Up Mitra Portal (standupmitra.in)',
        '2. Attach GramUdyam generated 5-year financial DPR and viability model',
        '3. Handholding agency (SIDBI/DIC) reviews file for skill & loan readiness',
        '4. Chosen commercial bank branch processes application within 30 days',
        '5. Loan sanction and disbursement with credit guarantee activation'
      ],
      mr: [
        '१. standupmitra.in या अधिकृत पोर्टलवर अर्ज भरा',
        '२. ग्रामउद्यम प्रकल्प अहवाल (DPR) जोडा',
        '३. सिडबी (SIDBI) किंवा नाबार्ड संस्थेकडून प्राथमिक तपासणी',
        '४. निवडलेल्या बँकेकडून प्रकल्प तपासणी व कर्ज मंजुरी',
        '५. कर्ज वितरण व व्यवसाय प्रारंभ'
      ],
      ta: [
        '1. standupmitra.in இணையதளத்தில் ஆன்லைனில் விண்ணப்பிக்கவும்',
        '2. விரிவான திட்ட அறிக்கை (DPR) ஆவணங்களை இணைக்கவும்',
        '3. SIDBI அல்லது வழிகாட்டுதல் முகமைகள் மூலம் விண்ணப்ப ஆய்வு',
        '4. தேர்ந்தெடுக்கப்பட்ட வங்கி கிளையிலிருந்து கடன் ஒப்புதல் பெறுதல்',
        '5. கடன் விடுவிக்கப்பட்டு புதிய தொழில் தொடங்குதல்'
      ]
    },
    officialPortal: 'https://www.standupmitra.in/',
    portalName: 'Stand-Up Mitra Portal',
    targetSectors: ['Manufacturing', 'Services', 'Agro-processing', 'Cold Storage', 'Trading']
  },
  {
    id: 'scheme_pmmsy',
    code: 'PMMSY',
    badge: {
      hi: '40% से 60% मत्स्य सब्सिडी',
      en: '40% to 60% Fisheries Subsidy',
      mr: '40% ते 60% मत्स्यपालन सबसिडी',
      ta: '40% முதல் 60% வரை மீன்வள மானியம்'
    },
    name: {
      hi: 'प्रधानमंत्री मत्स्य संपदा योजना (PMMSY)',
      en: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
      mr: 'प्रधानमंत्री मत्स्य संपदा योजना (PMMSY)',
      ta: 'பிரதமர் மத்ஸ்ய சம்பதா திட்டம் (PMMSY)'
    },
    ministry: {
      hi: 'मत्स्यपालन, पशुपालन एवं डेयरी मंत्रालय',
      en: 'Ministry of Fisheries, Animal Husbandry & Dairying',
      mr: 'मत्स्यव्यवसाय, पशुसंवर्धन आणि दुग्धव्यवसाय मंत्रालय',
      ta: 'மீன்வளம், கால்நடை பராமரிப்பு மற்றும் பால்வளத்துறை அமைச்சகம்'
    },
    category: 'livestock',
    maxLoanAmount: 5000000,
    maxLoanDisplay: {
      hi: 'इकाई लागत: ₹7.5 लाख (बायोफ्लॉक) से ₹50 लाख (फीड मिल/हैचरी)',
      en: 'Unit Cost: ₹7.5 Lakh (Biofloc) to ₹50 Lakh (Hatcheries/Feed Mill)',
      mr: 'प्रकल्प खर्च: ₹7.5 लाख (बायोफ्लॉक) ते ₹50 लाख (हॅचरी/फीड)',
      ta: 'திட்ட மதிப்பீடு: ₹7.5 லட்சம் முதல் ₹50 லட்சம் வரை'
    },
    subsidyRateRural: 40,
    subsidyRateSpecial: 60,
    subsidyDisplay: {
      hi: 'सामान्य वर्ग: 40% सब्सिडी | महिला / SC / ST: 60% सब्सिडी',
      en: 'General: 40% Subsidy | Women / SC / ST: 60% Subsidy',
      mr: 'सर्वसाधारण: 40% सबसिडी | महिला / SC / ST: 60% सबसिडी',
      ta: 'பொதுப்பிரிவு: 40% மானியம் | பெண்கள் / SC / ST: 60% மானியம்'
    },
    interestRate: {
      hi: 'नाबार्ड सह-वित्तपोषित प्राथमिकता दर (7% - 9%)',
      en: 'NABARD refinancing priority rate (7% - 9%)',
      mr: 'नाबार्ड प्राधान्य व्याजदर (7% - 9%)',
      ta: 'நபார்டு முன்னுரிமை வட்டி விகிதம் (7% - 9%)'
    },
    collateralFree: true,
    collateralText: {
      hi: '₹1.6 लाख से ₹10 लाख तक के मत्स्य किसान क्रेडिट कार्ड बिना गिरवी',
      en: 'Fisheries KCC up to ₹2 Lakh collateral-free; larger projects bank-linked',
      mr: 'मत्स्य KCC अंतर्गत ₹2 लाखांपर्यंत तारणमुक्त',
      ta: 'மீன்வள KCC மூலம் ₹2 லட்சம் வரை எவ்வித பிணையமும் இன்றி'
    },
    brief: {
      hi: 'मछली पालन, बायोफ्लॉक टैंक, रिसर्कुलेटिंग एक्वाकल्चर (RAS), फीड मिल व शीतगृह पर 40% से 60% सरकारी अनुदान।',
      en: 'Flagship fisheries development scheme offering 40-60% government subsidy for fish ponds, biofloc tanks, RAS units, and feed plants.',
      mr: 'तलावातील मत्स्यपालन, बायोफ्लॉक टँक, आरएएस सिस्टीम आणि मत्स्य खाद्य निर्मितीसाठी 40% ते 60% शासकीय सबसिडी.',
      ta: 'மீன் வளர்ப்பு குளங்கள், பயோஃப்ளாக் தொட்டிகள், மீன் உணவு ஆலைகள் மற்றும் குளிர்பதன வாகனங்களுக்கு 40% முதல் 60% வரை மானியம்.'
    },
    description: {
      hi: 'PMMSY मत्स्य क्षेत्र में निवेश के लिए भारत सरकार की सबसे बड़ी योजना है। इसमें सामान्य वर्ग को 40% तथा महिलाओं एवं एससी/एसटी वर्ग को 60% तक की भारी सब्सिडी दी जाती है। छोटे किसानों के लिए बायोफ्लॉक टैंक (₹7.5 लाख लागत) पर ₹4.5 लाख तक की सीधी सब्सिडी मिलती है।',
      en: 'PMMSY addresses critical gaps in fish production, productivity, quality, technology, post-harvest infrastructure, and management. Financial assistance is 40% for General category and 60% for SC/ST/Women beneficiaries across activities such as pond construction, Biofloc units, hatcheries, and insulated transport vans.',
      mr: 'मत्स्य व्यवसाय वाढवण्यासाठी ही केंद्र सरकारची मोठी योजना आहे. यात सामान्य प्रवर्गाला 40% तर महिला व एससी/एसटी प्रवर्गाला 60% थेट सबसिडी मिळते. शेतातील तळे किंवा घरामागे बायोफ्लॉक टँक उभारून मत्स्यपालनासाठी उत्तम योजना.',
      ta: 'PMMSY திட்டம் மீன் உற்பத்தியை அதிகரிக்க தொடங்கப்பட்டது. இதில் பொதுப்பிரிவினருக்கு 40% மானியமும், பெண்கள் மற்றும் SC/ST பிரிவினருக்கு 60% மானியமும் வழங்கப்படுகிறது. பயோஃப்ளாக் முறையில் மீன் வளர்க்க ₹4.5 லட்சம் வரை நேரடி மானியம் உண்டு.'
    },
    eligibility: {
      hi: [
        'व्यक्तिगत किसान, मत्स्य पालक, एसएचजी, अथवा सहकारी समितियां',
        'स्वयं की भूमि अथवा न्यूनतम 7 वर्ष का पंजीकृत लीज एग्रीमेंट (तालाब/टैंक हेतु)',
        'मत्स्य पालन का बुनियादी प्रशिक्षण अथवा कृषि पृष्ठभूमि',
        'पानी की पर्याप्त उपलब्धता एवं गुणवत्ता मानक परीक्षण',
        'महिला आवेदकों को 60% सब्सिडी में सर्वोच्च प्राथमिकता'
      ],
      en: [
        'Individual fishers, fish farmers, SHGs, JLGs, and Fisheries Cooperatives',
        'Own land or registered lease agreement for at least 7 years for pond/tank setup',
        'Basic orientation training in fisheries or willingness to undergo KVK training',
        'Adequate water source with testing report for aquaculture suitability',
        'Women, SC, and ST beneficiaries get highest priority with 60% grant'
      ],
      mr: [
        'शेतकरी, मत्स्यपालक, बचत गट किंवा तरुण उद्योजक',
        'स्वतःची जमीन किंवा किमान ७ वर्षांचा नोंदणीकृत भाडेकरार',
        'पाण्याची पुरेशी उपलब्धता आणि योग्य गुणवत्ता',
        'मत्स्यव्यवसाय विभागाचे प्राथमिक प्रशिक्षण',
        'महिलांना 60% सबसिडीत सर्वोच्च प्राधान्य'
      ],
      ta: [
        'தனிநபர் விவசாயிகள், மீன் வளர்ப்போர், மகளிர் சுயஉதவி குழுக்கள்',
        'சொந்த நிலம் அல்லது குறைந்தபட்சம் 7 ஆண்டுகள் குத்தகை ஒப்பந்தம்',
        'மீன் வளர்ப்புக்கான நீர் ஆதாரம் மற்றும் பரிசோதனை அறிக்கை',
        'மீன்வளத்துறை பயிற்சி பெற்றிருப்பது கூடுதல் தகுதி',
        'பெண்கள் மற்றும் SC/ST பிரிவினருக்கு 60% மானியத்தில் முன்னுரிமை'
      ]
    },
    documents: {
      hi: [
        'आधार कार्ड एवं निवास प्रमाण पत्र',
        'भूमि अभिलेख (खतौनी/भूलेख) अथवा पंजीकृत पट्टा (Lease Deed)',
        'मत्स्य पालन डीपीआर (GramUdyam विस्तृत प्रोजेक्ट रिपोर्ट)',
        'मत्स्य विभाग या केवीके (KVK) प्रशिक्षण प्रमाण पत्र',
        'पानी की जांच रिपोर्ट (Water Testing Report)'
      ],
      en: [
        'Aadhaar Card, PAN Card, and Address Proof',
        'Land Ownership Records (Khatauni/Khasra) or Registered Lease Deed',
        'Fisheries Detailed Project Report (DPR) with civil & input costing',
        'Training Certificate from District Fisheries Dept or KVK',
        'Water Quality Lab Testing Report'
      ],
      mr: [
        'आधार कार्ड आणि रहिवासी दाखला',
        'जमिनीचा 7/12 उतारा किंवा नोंदणीकृत भाडेकरार',
        'मत्स्यपालन प्रकल्प अहवाल (DPR)',
        'मत्स्य विभागाचे किंवा कृषी विज्ञान केंद्राचे प्रशिक्षण प्रमाणपत्र',
        'पाणी तपासणी प्रयोगशाळा अहवाल'
      ],
      ta: [
        'ஆதார் அட்டை, பான் அட்டை மற்றும் முகவரிச் சான்று',
        'நில பட்டா அல்லது பதிவு செய்யப்பட்ட குத்தகை ஒப்பந்த ஆவணம்',
        'மீன்வளத் திட்ட அறிக்கை (DPR)',
        'மீன்வளத்துறை அல்லது வேளாண் அறிவியல் மைய (KVK) பயிற்சி சான்றிதழ்',
        'நீர் பரிசோதனை ஆய்வக அறிக்கை'
      ]
    },
    applicationProcess: {
      hi: [
        '१. राज्य मत्स्य पोर्टल अथवा PMMSY पोर्टल (pmmsy.dof.gov.in) पर ऑनलाइन आवेदन करें',
        '२. ज़िला मत्स्य अधिकारी (DFO) द्वारा स्थल निरीक्षण (Site Inspection)',
        '३. ज़िला स्तरीय समिति (DLC) द्वारा प्रशासनिक व वित्तीय स्वीकृति',
        '४. निर्माण कार्य पूर्ण होने पर जिओ-टैगिंग एवं भौतिक सत्यापन',
        '५. 40% से 60% सब्सिडी सीधे बैंक खाते में प्रत्यक्ष लाभ अंतरण (DBT)'
      ],
      en: [
        '1. Submit online proposal on PMMSY portal (pmmsy.dof.gov.in) or state fisheries portal',
        '2. District Fisheries Officer (DFO) inspects proposed site and water source',
        '3. District Level Committee clears the proposal for financial sanction',
        '4. Geo-tagged verification of pond/Biofloc civil structure upon completion',
        '5. 40-60% subsidy disbursed directly to beneficiary Aadhaar-linked account in tranches'
      ],
      mr: [
        '१. pmmsy.dof.gov.in या पोर्टलवर ऑनलाइन प्रस्ताव सादर करा',
        '२. जिल्हा मत्स्यव्यवसाय अधिकाऱ्यांकडून जागेची पाहणी (Site Inspection)',
        '३. जिल्हास्तरीय समितीकडून प्रकल्पास प्रशासकीय मंजुरी',
        '४. काम पूर्ण झाल्यावर जिओ-टॅगिंग व पडताळणी',
        '५. सबसिडी थेट बँक खात्यात जमा'
      ],
      ta: [
        '1. pmmsy.dof.gov.in இணையதளத்தில் ஆன்லைனில் விண்ணப்பிக்கவும்',
        '2. மாவட்ட மீன்வள அலுவலர் நிலம் மற்றும் நீரின் தன்மையை ஆய்வு செய்வார்',
        '3. மாவட்ட குழுவால் ஒப்புதல் அளிக்கப்பட்டு நிதி அனுமதி வழங்கப்படும்',
        '4. குளம்/தொட்டி அமைக்கப்பட்ட பின் புவிக்குறியீட்டு (Geo-tag) சரிபார்ப்பு',
        '5. 40% முதல் 60% மானியத் தொகை வங்கி கணக்கில் விடுவிக்கப்படும்'
      ]
    },
    officialPortal: 'https://pmmsy.dof.gov.in/',
    portalName: 'PMMSY National Fisheries Portal',
    targetSectors: ['Fisheries', 'Biofloc', 'Aquaculture', 'Feed Mill', 'Cold Chain']
  },
  {
    id: 'scheme_nlm',
    code: 'NLM',
    badge: {
      hi: '50% पूंजी सब्सिडी • बकरी, पोल्ट्री व चारा',
      en: '50% Capital Subsidy • Poultry, Goat & Fodder',
      mr: '50% सबसिडी • शेळी, कुक्कुटपालन व चारा',
      ta: '50% மூலதன மானியம் • ஆடு, கோழி மற்றும் தீவனம்'
    },
    name: {
      hi: 'राष्ट्रीय पशुधन मिशन (National Livestock Mission - NLM)',
      en: 'National Livestock Mission (NLM)',
      mr: 'राष्ट्रीय पशुधन अभियान (NLM)',
      ta: 'தேசிய கால்நடை திட்டம் (NLM)'
    },
    ministry: {
      hi: 'पशुपालन एवं डेयरी विभाग, मत्स्य, पशुपालन व डेयरी मंत्रालय',
      en: 'Department of Animal Husbandry & Dairying (DAHD)',
      mr: 'पशुसंवर्धन आणि दुग्धव्यवसाय विभाग',
      ta: 'கால்நடை பராமரிப்பு மற்றும் பால்வளத்துறை அமைச்சகம்'
    },
    category: 'livestock',
    maxLoanAmount: 5000000,
    maxLoanDisplay: {
      hi: 'परियोजना: ₹10 लाख से ₹1 करोड़ (सब्सिडी: 50% अधिकतम ₹50 लाख)',
      en: 'Project: ₹10L - ₹1 Crore (50% Subsidy up to ₹50 Lakh)',
      mr: 'प्रकल्प: ₹10 लाख ते ₹1 कोटी (50% सबसिडी कमाल ₹50 लाख)',
      ta: 'திட்டம்: ₹10 லட்சம் முதல் ₹1 கோடி வரை (50% மானியம் ₹50 லட்சம் வரை)'
    },
    subsidyRateRural: 50,
    subsidyRateSpecial: 50,
    subsidyDisplay: {
      hi: 'सीधी 50% कैपिटल सब्सिडी (अधिकतम ₹25 लाख बकरी, ₹50 लाख पोल्ट्री)',
      en: 'Flat 50% Capital Subsidy (Up to ₹25L for Goat/Sheep, ₹50L for Poultry)',
      mr: 'थेट 50% भांडवली सबसिडी (शेळीपालनासाठी ₹25 लाख, पोल्ट्रीसाठी ₹50 लाख)',
      ta: 'நேரடி 50% மூலதன மானியம் (ஆடு வளர்ப்பிற்கு ₹25L, கோழிப்பண்ணைக்கு ₹50L)'
    },
    interestRate: {
      hi: 'बैंक प्राथमिकता दर (8.5% - 10%)',
      en: 'Commercial Bank priority agro rate (8.5% - 10%)',
      mr: 'बँक कृषी कर्ज दर (8.5% - 10%)',
      ta: 'வங்கி வேளாண் கடன் வட்டி விகிதம் (8.5% - 10%)'
    },
    collateralFree: false,
    collateralText: {
      hi: 'बैंक नियमानुसार (पशुधन व शेड हाइपोथिकेशन)',
      en: 'As per RBI norms with hypothecation of livestock and shed assets',
      mr: 'पशुधन आणि शेड तारण नियमानुसार',
      ta: 'கால்நடைகள் மற்றும் கொட்டகை அடமானம்'
    },
    brief: {
      hi: 'वाणिज्यिक बकरी पालन (100+5), कुक्कुट पालन, साइलेज चारा ब्लॉक व ब्रीडिंग फार्म पर 50% सीधी सरकारी सब्सिडी।',
      en: 'Provides 50% capital subsidy up to ₹50 Lakhs for rural commercial poultry, goat/sheep breeding, and silage fodder units.',
      mr: 'व्यावसायिक शेळीपालन (100+5), कुक्कुटपालन आणि सायलेज चारा युनिटसाठी थेट 50% शासकीय सबसिडी.',
      ta: 'வணிக ரீதியான ஆடு வளர்ப்பு (100+5), கோழிப்பண்ணை மற்றும் தீவன ஆலைகளுக்கு 50% நேரடி மானியம்.'
    },
    description: {
      hi: 'राष्ट्रीय पशुधन मिशन (NLM) देश में मांस, अंडा, ऊन तथा गुणवत्तापूर्ण चारे के उत्पादन को बढ़ाने हेतु 50% की भारी पूंजी सब्सिडी प्रदान करता है। बकरी पालन में 100 बकरियां + 5 बकरे की इकाई (₹20 लाख लागत) पर ₹10 लाख की नकद सब्सिडी सीधे बैंक ऋण खाते में भेजी जाती है।',
      en: 'NLM is designed to create rural entrepreneurship in poultry, sheep, goat, piggery, and fodder seed production. The central government provides a 50% capital subsidy (up to ₹25-50 Lakh) credited directly into the beneficiary loan account in two equal tranches.',
      mr: 'राष्ट्रीय पशुधन मिशन अंतर्गत शेळी-मेंढी पालन, कुक्कुटपालन आणि चारा निर्मितीसाठी प्रकल्प खर्चाच्या 50% सबसिडी थेट बँक खात्यात दिली जाते. 100 शेळ्यांच्या युनिटसाठी ₹10 लाखांपर्यंतचे थेट अनुदान मिळते.',
      ta: 'NLM திட்டமானது கிராமப்புறங்களில் ஆடு வளர்ப்பு, கோழிப்பண்ணை மற்றும் பசுந்தீவன உற்பத்தியை ஊக்குவிக்க 50% நேரடி மூலதன மானியம் (அதிகபட்சம் ₹50 லட்சம் வரை) இரண்டு தவணைகளாக வழங்குகிறது.'
    },
    eligibility: {
      hi: [
        'व्यक्तिगत किसान, ग्रामीण उद्यमी, एफपीओ (FPO) अथवा स्वयं सहायता समूह',
        'शेड निर्माण व चराई हेतु स्वयं की भूमि अथवा दीर्घकालिक लीज',
        'पशुपालन का बुनियादी अनुभव अथवा प्रशिक्षण अनिवार्य',
        'परियोजना लागत का न्यूनतम 10% स्वयं का अंशदान होना चाहिए',
        'बैंक ऋण स्वीकृति अथवा स्वयं की पूंजी से शेष 50% का प्रबंध'
      ],
      en: [
        'Individual farmers, rural entrepreneurs, FPOs, Cooperatives, and SHGs',
        'Own or long-term leased land suitable for housing animals and fodder cultivation',
        'Relevant training certificate or verified experience in livestock management',
        'Applicant contribution must be at least 10% of total project outlay',
        'Rest of funds covered via scheduled bank sanction or verified self-finance'
      ],
      mr: [
        'शेतकरी, तरुण पशुपालक, शेतकरी उत्पादक कंपन्या (FPO) किंवा बचत गट',
        'शेड बांधण्यासाठी व चाऱ्यासाठी स्वतःची किंवा भाडेतत्वावरील जमीन',
        'पशुपालनाचा अनुभव किंवा कृषी विज्ञान केंद्राचे प्रशिक्षण',
        'किमान 10% स्वतःचे भांडवल असणे आवश्यक',
        'उर्वरित रकमेसाठी बँकेचे कर्ज किंवा स्वभांडवल पुरावा'
      ],
      ta: [
        'விவசாயிகள், கிராமப்புற இளைஞர்கள், உழவர் உற்பத்தியாளர் நிறுவனங்கள் (FPO)',
        'கொட்டகை மற்றும் தீவனப் பயிரிட சொந்த நிலம் அல்லது நீண்டகால குத்தகை நிலம்',
        'கால்நடை மேலாண்மை பயிற்சி அல்லது அனுபவச் சான்றிதழ்',
        'திட்ட மதிப்பில் குறைந்தபட்சம் 10% சொந்த முதலீடு',
        'மீதி 50% தொகைக்கு வங்கி கடன் அனுமதி ஆணை'
      ]
    },
    documents: {
      hi: [
        'आधार कार्ड, पैन कार्ड एवं बैंक पासबुक',
        'भूमि अभिलेख (खसरा-खतौनी) एवं चारा उगाने की भूमि का प्रमाण',
        'पशुपालन विभाग / KVK से 3-दिवसीय प्रशिक्षण प्रमाण पत्र',
        'विस्तृत प्रोजेक्ट रिपोर्ट (DPR) एवं शेड का नक्शा',
        'बैंक इन-प्रिंसिपल स्वीकृति पत्र (यदि ऋण ले रहे हैं)'
      ],
      en: [
        'Aadhaar Card, PAN Card, and active Bank Account Details',
        'Land Records (Khasra/Khatauni) for housing and green fodder cultivation',
        'Livestock Management Training Certificate from Animal Husbandry Dept/KVK',
        'Detailed Project Report (DPR) with shed layout and cash flow projection',
        'In-principle Bank Sanction Letter (if applying via debt-equity route)'
      ],
      mr: [
        'आधार कार्ड, पॅन कार्ड आणि बँक पासबुक',
        'जमिनीचा 7/12 उतारा व जागेचा नकाशा',
        'पशुसंवर्धन विभागाचे प्रशिक्षण प्रमाणपत्र',
        'सविस्तर प्रकल्प अहवाल (DPR) आणि शेड डिझाईन',
        'बँकेचे प्राथमिक कर्ज मंजुरी पत्र'
      ],
      ta: [
        'ஆதார் அட்டை, பான் அட்டை மற்றும் வங்கி கணக்கு புத்தகம்',
        'நில உரிமைப் பட்டா மற்றும் வரைபடம்',
        'கால்நடை பராமரிப்புத் துறையின் பயிற்சி சான்றிதழ்',
        'திட்ட அறிக்கை (DPR) மற்றும் கொட்டகை மதிப்பீட்டு வரைபடம்',
        'வங்கி கொள்கை அளவிலான கடன் அனுமதி கடிதம்'
      ]
    },
    applicationProcess: {
      hi: [
        '१. राष्ट्रीय NLM पोर्टल (nlm.udyamimitra.in) पर ऑनलाइन रजिस्ट्रेशन करें',
        '२. ग्रामउद्यम से प्राप्त प्रमाणित लाइवस्टॉक DPR और भूमि दस्तावेज अपलोड करें',
        '३. राज्य पशुपालन स्क्रीनिंग कमेटी (SLEAC) द्वारा आवेदन का तकनीकी सत्यापन',
        '४. स्वीकृति के बाद 50% सब्सिडी की प्रथम 50% किश्त शेड निर्माण हेतु जारी',
        '५. पशुओं की खरीद और कानों में टैगिंग (INAPH/12 Digit Tag) उपरांत द्वितीय किश्त'
      ],
      en: [
        '1. Apply online on NLM portal (nlm.udyamimitra.in)',
        '2. Upload GramUdyam certified livestock DPR, shed map, and land papers',
        '3. State Level Executive Committee (SLEC) reviews feasibility and sanctions grant',
        '4. 1st installment of subsidy released into escrow upon completion of civil shed',
        '5. 2nd installment released after animal procurement and 12-digit INAPH ear tagging'
      ],
      mr: [
        '१. nlm.udyamimitra.in या पोर्टलवर ऑनलाइन अर्ज सादर करा',
        '२. ग्रामउद्यम प्रकल्प अहवाल आणि जमिनीची कागदपत्रे अपलोड करा',
        '३. राज्यस्तरीय समितीकडून (SLEC) अर्जाची तपासणी व मंजुरी',
        '४. शेडचे बांधकाम झाल्यावर सबसिडीचा पहिला हप्ता जमा',
        '५. जनावरांची खरेदी व टॅगिंग झाल्यावर दुसरा हप्ता जमा'
      ],
      ta: [
        '1. nlm.udyamimitra.in இணையதளத்தில் பதிவு செய்யவும்',
        '2. கால்நடை திட்ட அறிக்கை (DPR) மற்றும் நில ஆவணங்களை பதிவேற்றவும்',
        '3. மாநில அளவிலான ஆய்வுக் குழு விண்ணப்பத்தை ஆய்வு செய்து ஒப்புதல் அளிக்கும்',
        '4. கொட்டகை அமைக்கப்பட்ட பின் முதல் தவணை மானியம் விடுவிக்கப்படும்',
        '5. கால்நடைகள் வாங்கப்பட்டு காது குறிச்சொல் (Tagging) செய்த பின் இரண்டாம் தவணை மானியம்'
      ]
    },
    officialPortal: 'https://nlm.udyamimitra.in/',
    portalName: 'National Livestock Mission Portal',
    targetSectors: ['Goat Farming', 'Poultry', 'Dairy', 'Livestock', 'Fodder Units', 'Piggery']
  },
  {
    id: 'scheme_aif',
    code: 'AIF',
    badge: {
      hi: '3% ब्याज छूट • ₹2 करोड़ तक',
      en: '3% Interest Subvention • Up to ₹2 Cr',
      mr: '3% व्याज सवलत • ₹2 कोटींपर्यंत',
      ta: '3% வட்டி மானியம் • ₹2 கோடி வரை'
    },
    name: {
      hi: 'कृषि अवसंरचना कोष (Agriculture Infrastructure Fund - AIF)',
      en: 'Agriculture Infrastructure Fund (AIF)',
      mr: 'कृषी पायाभूत सुविधा निधी (AIF)',
      ta: 'வேளாண் உள்கட்டமைப்பு நிதி திட்டம் (AIF)'
    },
    ministry: {
      hi: 'कृषि एवं किसान कल्याण मंत्रालय (Ministry of Agriculture)',
      en: 'Ministry of Agriculture and Farmers Welfare',
      mr: 'कृषी आणि शेतकरी कल्याण मंत्रालय',
      ta: 'வேளாண்மை மற்றும் உழவர் நல அமைச்சகம்'
    },
    category: 'agri_infra',
    maxLoanAmount: 20000000,
    maxLoanDisplay: {
      hi: '₹2 करोड़ तक (3% ब्याज छूट 7 वर्षों के लिए)',
      en: 'Up to ₹2 Crore with 3% Interest Subvention for 7 Years',
      mr: '₹2 कोटींपर्यंत (7 वर्षांसाठी 3% व्याज सवलत)',
      ta: '₹2 கோடி வரை (7 ஆண்டுகளுக்கு 3% வட்டிச் சலுகை)'
    },
    subsidyRateRural: 3,
    subsidyRateSpecial: 3,
    subsidyDisplay: {
      hi: '3% वार्षिक ब्याज छूट + CGTMSE शुल्क की 100% सरकार द्वारा प्रतिपूर्ति',
      en: '3% Interest Subvention p.a. + 100% CGTMSE Fee Reimbursement by Govt',
      mr: '3% वार्षिक व्याज सवलत + संपूर्ण CGTMSE शुल्क माफी',
      ta: 'ஆண்டுக்கு 3% வட்டி மானியம் + CGTMSE கட்டணம் அரசே ஏற்கும்'
    },
    interestRate: {
      hi: 'प्रभावी ब्याज दर केवल 5.5% से 6.5%',
      en: 'Effective net interest rate only 5.5% to 6.5%',
      mr: 'निव्वळ व्याजदर फक्त 5.5% ते 6.5%',
      ta: 'நிகர வட்டி விகிதம் வெறும் 5.5% முதல் 6.5% மட்டுமே'
    },
    collateralFree: true,
    collateralText: {
      hi: '₹2 करोड़ तक का ऋण CGTMSE के तहत बिना किसी बाहरी संपत्ति गारंटी के',
      en: 'Collateral-free loans up to ₹2 Crore covered under CGTMSE guarantee',
      mr: '₹2 कोटींपर्यंत तारणमुक्त (CGTMSE द्वारे संरक्षित)',
      ta: '₹2 கோடி வரை எவ்வித வெளிப்புற பிணையும் இன்றி CGTMSE மூலம் பாதுகாப்பு'
    },
    brief: {
      hi: 'कोल्ड स्टोरेज, सोलर वेयरहाउस, ग्रेडिंग-सॉर्टिंग यूनिट, साइलो व दाल मिल हेतु 3% ब्याज छूट व बिना गारंटी ऋण।',
      en: 'Medium-long term debt financing for post-harvest management infrastructure with 3% interest subvention and CGTMSE cover.',
      mr: 'शीतगृह (Cold Storage), धान्य गोदाम, प्रतवारी युनिट व सौर ड्रायरसाठी 3% व्याज सवलत.',
      ta: 'குளிர்பதன கிடங்கு, தானிய சேமிப்பு கிடங்கு, தரம் பிரிக்கும் அலகுகள் அமைக்க 3% வட்டி மானியம் மற்றும் பிணையில்லா கடன்.'
    },
    description: {
      hi: 'कृषि अवसंरचना कोष (AIF) ₹1 लाख करोड़ का राष्ट्रीय कोष है। इसके तहत कोल्ड स्टोरेज, पैक हाउस, सोलर ड्रायर, प्राथमिक प्रसंस्करण केंद्र (सॉर्टिंग, ग्रेडिंग, क्लीनिंग) और कस्टम हायरिंग केंद्र लगाने पर 7 वर्षों तक 3% की ब्याज छूट और ₹2 करोड़ तक CGTMSE की गारंटी मुफ़्त मिलती है।',
      en: 'The AIF provides medium to long-term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets. All loans under this financing facility have interest subvention of 3% per annum up to a limit of ₹2 Crore for a maximum period of 7 years.',
      mr: 'AIF ही शेतीमाल साठवणूक आणि प्रक्रिया पायाभूत सुविधांसाठी केंद्र सरकारची मोठी योजना आहे. कोल्ड स्टोरेज, धान्य गोदामे, ड्रायर व कस्टम हायरिंग सेंटरसाठी 3% व्याज सवलत व ₹2 कोटींपर्यंत तारणमुक्त हमी मिळते.',
      ta: 'அறுவடைக்கு பின் விளைபொருட்களை சேமிக்க மற்றும் பதப்படுத்த தேவையான உள்கட்டமைப்பை உருவாக்க இத்திட்டம் உதவுகிறது. குளிர்பதன கிடங்குகள், சேமிப்பு கிடங்குகள் அமைக்க 7 ஆண்டுகளுக்கு 3% வட்டி மானியமும், ₹2 கோடி வரை பிணையில்லா கடன் வசதியும் உண்டு.'
    },
    eligibility: {
      hi: [
        'प्राथमिक कृषि ऋण समितियां (PACS), किसान, FPO, SHG, ग्रामीण कृषि उद्यमी',
        'कटाई उपरांत प्रबंधन (Post Harvest) से संबंधित अवसंरचना',
        'भूमि स्वामित्व अथवा न्यूनतम 10 वर्ष का लीज एग्रीमेंट',
        'व्यावसायिक रूप से व्यावहारिक परियोजना रिपोर्ट (DPR)',
        'अधिकतम 7 वर्षों के लिए 3% वार्षिक ब्याज छूट'
      ],
      en: [
        'Farmers, Agri-entrepreneurs, Startups, FPOs, SHGs, and Primary Agricultural Credit Societies',
        'Projects focused on post-harvest storage, cold chain, sorting, grading, and logistics',
        'Clear title of land or minimum 10-year registered lease deed',
        'Financially viable Detailed Project Report (DPR)',
        'Interest subvention of 3% available for a maximum tenure of 7 years'
      ],
      mr: [
        'शेतकरी, कृषी उद्योजक, एफपीओ (FPO), शेती बचत गट',
        'शेतीमाल साठवणूक व प्रक्रिया पायाभूत सुविधांचा प्रकल्प',
        'स्वतःची जमीन किंवा किमान 10 वर्षांचा भाडेकरार',
        'व्यवहार्य प्रकल्प अहवाल (DPR)',
        'जास्तीत जास्त 7 वर्षांसाठी 3% व्याज सवलत लागू'
      ],
      ta: [
        'விவசாயிகள், உழவர் உற்பத்தியாளர் நிறுவனங்கள் (FPO), வேளாண் தொழில்முனைவோர்',
        'அறுவடைக்கு பிந்தைய சேமிப்பு கிடங்கு மற்றும் குளிர்பதன கிடங்கு திட்டங்கள்',
        'சொந்த நிலம் அல்லது குறைந்தபட்சம் 10 ஆண்டுகள் குத்தகை ஒப்பந்தம்',
        'செயல்முறை திட்ட அறிக்கை (DPR)',
        'அதிகபட்சம் 7 ஆண்டுகளுக்கு 3% வட்டி மானியம் கிடைக்கும்'
      ]
    },
    documents: {
      hi: [
        'आधार कार्ड, पैन कार्ड एवं आवेदक का केवाईसी',
        'भूमि का खसरा-खतौनी अथवा पंजीकृत लीज अभिलेख',
        'विस्तृत प्रोजेक्ट रिपोर्ट (Civil Estimate, Machinery Quotation & Cash Flow)',
        'ग्राम पंचायत अथवा स्थानीय प्राधिकरण से अनापत्ति प्रमाण पत्र (NOC)',
        'पर्यावरण व प्रदूषण अनापत्ति (यदि आवश्यक हो)'
      ],
      en: [
        'Aadhaar Card, PAN Card, and applicant KYC documents',
        'Land Title Deeds (Khasra/Khatauni) or registered lease deed',
        'Detailed Project Report (DPR) with civil works estimate and plant machinery quotations',
        'Local Panchayat / Town Planning approval or trade NOC',
        'Pollution control consent (if applicable for agro processing)'
      ],
      mr: [
        'आधार कार्ड, पॅन कार्ड आणि केवायसी कागदपत्रे',
        'जमिनीचा 7/12 उतारा किंवा नोंदणीकृत भाडेकरार',
        'सविस्तर प्रकल्प अहवाल (DPR) व मशिनरी कोटेशन',
        'ग्रामपंचायत ना हरकत प्रमाणपत्र (NOC)',
        'प्रदूषण नियंत्रण मंडळाची संमती (लागू असल्यास)'
      ],
      ta: [
        'ஆதார் அட்டை, பான் அட்டை மற்றும் KYC ஆவணங்கள்',
        'நில பட்டா அல்லது பதிவு செய்யப்பட்ட நீண்டகால குத்தகை பத்திரம்',
        'கட்டிட மதிப்பீடு மற்றும் இயந்திர விலைப்பட்டியல் அடங்கிய திட்ட அறிக்கை (DPR)',
        'கிராம ஊராட்சி தடையில்லா சான்றிதழ் (NOC)',
        'சுற்றுச்சூழல் மாசுக்கட்டுப்பாட்டு வாரிய அனுமதி (தேவைப்பட்டால்)'
      ]
    },
    applicationProcess: {
      hi: [
        '१. AIF राष्ट्रीय पोर्टल (agriinfra.dac.gov.in) पर ऑनलाइन आवेदन करें',
        '२. बैंक शाखा का चयन करें और परियोजना रिपोर्ट (DPR) अपलोड करें',
        '३. कृषि मंत्रालय की पीएमयू टीम द्वारा 7 दिनों में आवेदन का ऑनलाइन सत्यापन',
        '४. बैंक द्वारा ऋण स्वीकृति एवं CGTMSE कवर का स्वतः एक्टिवेशन',
        '५. बैंक द्वारा ऋण वितरण के साथ 3% ब्याज छूट सीधे खाते में लागू'
      ],
      en: [
        '1. Apply online on national AIF portal (agriinfra.dac.gov.in)',
        '2. Select preferred lending bank branch and upload GramUdyam DPR',
        '3. Ministry of Agriculture PMU validates application within 7 days',
        '4. Bank sanctions loan and initiates automatic CGTMSE guarantee enrolment',
        '5. Loan disbursed with 3% interest subvention automatically applied to monthly interest'
      ],
      mr: [
        '१. agriinfra.dac.gov.in या पोर्टलवर ऑनलाइन नोंदणी करा',
        '२. बँकेची निवड करा आणि प्रकल्प अहवाल (DPR) जोडा',
        '३. कृषी मंत्रालयाकडून ७ दिवसांत अर्जाची ऑनलाइन छाननी',
        '४. बँकेकडून कर्ज मंजुरी व CGTMSE सुरक्षा लागू',
        '५. कर्ज वितरणानंतर 3% व्याज सवलत थेट लागू'
      ],
      ta: [
        '1. agriinfra.dac.gov.in இணையதளத்தில் ஆன்லைனில் விண்ணப்பிக்கவும்',
        '2. விருப்பமான வங்கியைத் தேர்ந்தெடுத்து திட்ட அறிக்கையை (DPR) பதிவேற்றவும்',
        '3. வேளாண் அமைச்சக குழு 7 நாட்களில் விண்ணப்பத்தை ஆய்வு செய்யும்',
        '4. வங்கி கடனை அனுமதித்து CGTMSE உத்தரவாதத்தை வழங்கும்',
        '5. கடன் வழங்கப்பட்டு 3% வட்டி மானியம் நேரடியாக செயல்படுத்தப்படும்'
      ]
    },
    officialPortal: 'https://agriinfra.dac.gov.in/',
    portalName: 'Agriculture Infrastructure Fund Portal',
    targetSectors: ['Cold Storage', 'Warehousing', 'Agri Logistics', 'Food Processing', 'Solar Dryers']
  },
  {
    id: 'scheme_kcc_allied',
    code: 'KCC-ALLIED',
    badge: {
      hi: '4% प्रभावी ब्याज दर • ₹2 लाख तक बिना गारंटी',
      en: '4% Effective Interest • Up to ₹2L Collateral-Free',
      mr: '4% प्रभावी व्याजदर • ₹2 लाखांपर्यंत तारणमुक्त',
      ta: '4% குறைந்த வட்டி • ₹2 லட்சம் வரை பிணையில்லா கடன்'
    },
    name: {
      hi: 'किसान क्रेडिट कार्ड - पशुपालन एवं मत्स्यपालन (KCC Allied)',
      en: 'Kisan Credit Card for Animal Husbandry & Fisheries (KCC)',
      mr: 'किसान क्रेडिट कार्ड - पशुसंवर्धन व मत्स्यव्यवसाय (KCC)',
      ta: 'கிசான் கடன் அட்டை - கால்நடை மற்றும் மீன்வளம் (KCC)'
    },
    ministry: {
      hi: 'कृषि एवं किसान कल्याण मंत्रालय एवं नाबार्ड',
      en: 'Ministry of Agriculture & Farmers Welfare / NABARD',
      mr: 'कृषी मंत्रालय आणि नाबार्ड (NABARD)',
      ta: 'வேளாண்மை அமைச்சகம் மற்றும் நபார்டு'
    },
    category: 'livestock',
    maxLoanAmount: 200000,
    maxLoanDisplay: {
      hi: 'कार्यशील पूंजी: ₹2 लाख तक (पशुपालन/मत्स्य)',
      en: 'Working Capital: Up to ₹2 Lakhs (Animal Husbandry/Fisheries)',
      mr: 'खेळते भांडवल: ₹2 लाखांपर्यंत (दुग्ध व मत्स्य व्यवसाय)',
      ta: 'நடைமுறை மூலதனம்: ₹2 லட்சம் வரை'
    },
    subsidyRateRural: 3,
    subsidyRateSpecial: 3,
    subsidyDisplay: {
      hi: 'समय पर चुकता करने पर 3% अतिरिक्त ब्याज छूट (प्रभावी ब्याज मात्र 4%)',
      en: '3% Prompt Repayment Incentive (Effective Interest only 4%)',
      mr: 'वेळेवर परतफेड केल्यास 3% व्याज सवलत (निव्वळ व्याज फक्त 4%)',
      ta: 'சரியான நேரத்தில் திருப்பிச் செலுத்தினால் 3% கூடுதல் வட்டி தள்ளுபடி (நிகர வட்டி 4%)'
    },
    interestRate: {
      hi: '7% सामान्य दर • 3% छूट उपरांत मात्र 4% वार्षिक',
      en: '7% base rate • 4% net rate with 3% Prompt Repayment Incentive (PRI)',
      mr: '7% मूळ दर • वेळेवर परतफेडीसह फक्त 4%',
      ta: '7% அடிப்படை வட்டி • சலுகைக்குப் பின் 4% மட்டுமே'
    },
    collateralFree: true,
    collateralText: {
      hi: '₹1.60 लाख (दुग्ध संघ सदस्यों हेतु ₹2 लाख) तक कोई संपत्ति गिरवी नहीं',
      en: '100% Collateral-free up to ₹1.60 Lakh (up to ₹2 Lakh for milk cooperative pourers)',
      mr: '₹1.60 लाख ते ₹2 लाखांपर्यंत कोणत्याही तारणाशिवाय कर्ज',
      ta: '₹2 லட்சம் வரை எவ்வித நில பிணையமும் தேவையில்லை'
    },
    brief: {
      hi: 'गाय, भैंस, बकरी व मछली के चारे, दवा व दैनिक खर्च हेतु मात्र 4% ब्याज पर ₹2 लाख तक का तत्काल ऋण।',
      en: 'Short-term working capital loan up to ₹2 Lakh at highly subsidized 4% interest rate for livestock feed, veterinary care, and recurring expenses.',
      mr: 'गाई-म्हशींचा चारा, औषधोपचार व दैनंदिन खर्चासाठी फक्त 4% व्याजाने ₹2 लाखांपर्यंतचे खेळते भांडवल कर्ज.',
      ta: 'மாடு, ஆடு மற்றும் மீன்களுக்கான தீவனம் மற்றும் தினசரி பராமரிப்பு செலவுகளுக்கு வெறும் 4% வட்டியில் ₹2 லட்சம் வரை கடன்.'
    },
    description: {
      hi: 'किसान क्रेडिट कार्ड (KCC) सुविधा अब पशुपालन और मत्स्य पालकों के लिए भी उपलब्ध है। दुधारू पशुओं के चारे, दाने, पशु चिकित्सा और मछली के बीज/फीड के दैनिक खर्चों के लिए ₹2 लाख तक की सीमा दी जाती है। समय पर भुगतान करने पर 3% की विशेष छूट के साथ प्रभावी ब्याज केवल 4% प्रतिवर्ष आता है।',
      en: 'The Government of India extended KCC facilities to Animal Husbandry and Fisheries farmers to meet their working capital requirements. Farmers can avail up to ₹2 Lakh credit at a benchmark 7% interest rate, with an additional 3% Prompt Repayment Incentive (PRI), effectively reducing interest to just 4% per year.',
      mr: 'शेतकऱ्यांना शेतीशिवाय दुग्ध व्यवसाय, शेळीपालन व मत्स्य व्यवसायातील दैनंदिन खर्चासाठी (चारा, औषध, पाणी) ₹2 लाखांपर्यंतचे खेळते भांडवल केसीसीद्वारे दिले जाते. नियमित परतफेडीवर निव्वळ व्याजदर अवघा 4% पडतो.',
      ta: 'கால்நடை மற்றும் மீன் வளர்ப்போருக்கு தீவனம் மற்றும் மருத்துவ செலவுகளுக்காக KCC அட்டை மூலம் ₹2 லட்சம் வரை நடைமுறை மூலதன கடன் வழங்கப்படுகிறது. தவணையை சரியாக செலுத்தினால் ஆண்டுக்கு 4% மட்டுமே வட்டி வசூலிக்கப்படும்.'
    },
    eligibility: {
      hi: [
        'दुधारू पशु (गाय/भैंस/बकरी) अथवा मछली पालन करने वाले किसान व ग्रामीण',
        'भूमिहीन पशुपालक, बटाईदार व स्वयं सहायता समूह भी पात्र',
        'पशुओं का टीकाकरण व स्वास्थ्य कार्ड होना चाहिए',
        'बैंक में कोई पुराना कृषि ऋण ओवरड्यू न हो',
        'डेयरी सहकारी समिति (जैसे अमूल, पराग, नंदिनी) में दूध आपूर्ति करने वालों को वरीयता'
      ],
      en: [
        'Farmers and individuals rearing milch animals (Cattle/Buffalo/Goat) or practicing fisheries',
        'Landless livestock farmers and tenant farmers are fully eligible',
        'Animals must be vaccinated with health certificate issued by Veterinary Doctor',
        'No overdue agricultural loan in any banking institution',
        'Preference for milk pourers registered with dairy cooperatives'
      ],
      mr: [
        'दुभती जनावरे (गाय/म्हैस) किंवा शेळ्या-मेंढ्या बाळगणारे पशुपालक',
        'जमीन नसलेले शेतमजूर व पशुपालकही पूर्ण पात्र',
        'जनावरांचे लसीकरण झालेले असणे आवश्यक',
        'बँकेचे कोणतेही थकीत कर्ज नसावे',
        'दूध डेअरीशी जोडलेल्या शेतकऱ्यांना प्राधान्य'
      ],
      ta: [
        'கறவை மாடுகள், ஆடுகள் அல்லது மீன் வளர்ப்பில் ஈடுபட்டுள்ள கிராமப்புற மக்கள்',
        'நிலமற்ற விவசாய கூலிகளும் இக்கடனைப் பெற முழு தகுதியுடையவர்கள்',
        'கால்நடைகளுக்கு தடுப்பூசி போடப்பட்ட கால்நடை மருத்துவச் சான்றிதழ்',
        'வங்கி கடன் பாக்கி இல்லாதிருத்தல் வேண்டும்',
        'பால் கூட்டுறவு சங்கங்களில் பால் ஊற்றுபவர்களுக்கு முன்னுரிமை'
      ]
    },
    documents: {
      hi: [
        'आधार कार्ड एवं मतदाता पहचान पत्र',
        'निवास प्रमाण पत्र (ग्राम पंचायत सत्यापन)',
        'पशुधन स्वामित्व का स्व-घोषणा पत्र अथवा पशु चिकित्सा अधिकारी का सत्यापन',
        'बैंक खाता पासबुक एवं 2 पासपोर्ट फोटो'
      ],
      en: [
        'Aadhaar Card and Voter ID / PAN',
        'Address Proof (Gram Panchayat verified certificate)',
        'Self-declaration of livestock ownership or Local Veterinary Officer certificate',
        'Active Bank Account Passbook and two passport size photos'
      ],
      mr: [
        'आधार कार्ड आणि मतदार ओळखपत्र',
        'रहिवासी दाखला / ग्रामपंचायत पत्र',
        'जनावरे असल्याचा स्वयंघोषणा दाखला किंवा पशुवैद्यकीय अधिकाऱ्याचे प्रमाणपत्र',
        'बँक पासबुक आणि २ पासपोर्ट फोटो'
      ],
      ta: [
        'ஆதார் அட்டை மற்றும் வாக்காளர் அடையாள அட்டை',
        'முகவரிச் சான்று (ஊராட்சி மன்ற சான்றிதழ்)',
        'கால்நடைகள் இருப்பதற்கான சுய உறுதிமொழி ஆவணம் / கால்நடை மருத்துவர் சான்றிதழ்',
        'வங்கி கணக்கு புத்தகம் மற்றும் புகைப்படங்கள்'
      ]
    },
    applicationProcess: {
      hi: [
        '१. सरल एक-पेज KCC फॉर्म भरकर निकटतम ग्रामीण बैंक/सहकारी बैंक में जमा करें',
        '२. जन समर्थ पोर्टल (jansamarth.in) पर ऑनलाइन KCC Animal Husbandry चुनें',
        '३. बैंक अधिकारी एवं पशु चिकित्सा अधिकारी द्वारा पशुओं का सत्यापन',
        '४. 14 दिनों के भीतर KCC क्रेडिट सीमा स्वीकृति',
        '५. एटीएम से नकदी निकालने हेतु RuPay KCC कार्ड जारी'
      ],
      en: [
        '1. Submit simplified 1-page KCC application at local Bank Branch or via JanSamarth',
        '2. Apply digitally at jansamarth.in under Agri Allied Kisan Credit Card',
        '3. Quick physical/veterinary verification of animal herd',
        '4. Bank sanctions credit limit within 14 days without processing fee',
        '5. Issuance of KCC RuPay Card for cash withdrawals at ATMs and POS machines'
      ],
      mr: [
        '१. एक पानी सोपा केसीसी अर्ज भरून जवळच्या बँकेत जमा करा',
        '२. jansamarth.in पोर्टलवर ऑनलाइन नोंदणी करा',
        '३. जनावरांची प्राथमिक तपासणी',
        '४. १४ दिवसांत कर्ज मर्यादा मंजूर',
        '५. एटीएममधून पैसे काढण्यासाठी रूपे केसीसी कार्ड प्राप्त'
      ],
      ta: [
        '1. எளிய ஒரு பக்க KCC விண்ணப்பத்தை பூர்த்தி செய்து அருகிலுள்ள வங்கியில் சமர்ப்பிக்கவும்',
        '2. jansamarth.in இணையதளத்திலும் ஆன்லைனில் விண்ணப்பிக்கலாம்',
        '3. கால்நடை மருத்துவர் மூலம் கால்நடைகள் சரிபார்க்கப்படும்',
        '4. 14 நாட்களுக்குள் கட்டணமின்றி கடன் வரம்பு அனுமதிக்கப்படும்',
        '5. பணம் எடுக்க RuPay KCC கார்டு வழங்கப்படும்'
      ]
    },
    officialPortal: 'https://www.jansamarth.in/kisan-credit-card',
    portalName: 'JanSamarth KCC Portal',
    targetSectors: ['Dairy', 'Goat Farming', 'Poultry', 'Fisheries', 'Livestock']
  },
  {
    id: 'scheme_day_nrlm',
    code: 'DAY-NRLM',
    badge: {
      hi: 'लखपति दीदी • महिला समूह ब्याज छूट',
      en: 'Lakhpati Didi • SHG Collateral-Free',
      mr: 'लखपती दीदी • महिला बचत गट कर्ज',
      ta: 'லக்பதி தீதி • மகளிர் குழு பிணையில்லா கடன்'
    },
    name: {
      hi: 'दीनदयाल अंत्योदय योजना - एनआरएलएम (लखपति दीदी)',
      en: 'Deendayal Antyodaya Yojana - NRLM (Lakhpati Didi)',
      mr: 'दीनदयाळ अंत्योदय योजना - एनआरएलएम (लखपती दीदी)',
      ta: 'தீன்தயாள் அந்த்யோதயா திட்டம் - NRLM (லக்பதி தீதி)'
    },
    ministry: {
      hi: 'ग्रामीण विकास मंत्रालय (Ministry of Rural Development)',
      en: 'Ministry of Rural Development (MoRD)',
      mr: 'ग्रामीण विकास मंत्रालय',
      ta: 'ஊரக வளர்ச்சி அமைச்சகம்'
    },
    category: 'women_shg',
    maxLoanAmount: 1000000,
    maxLoanDisplay: {
      hi: '₹10 लाख तक बिना गारंटी समूह बैंक ऋण',
      en: 'Up to ₹10 Lakh Collateral-Free Bank Linkage Credit',
      mr: '₹10 लाखांपर्यंत तारणमुक्त बचत गट कर्ज',
      ta: '₹10 லட்சம் வரை பிணையில்லா மகளிர் குழு கடன்'
    },
    subsidyRateRural: 100,
    subsidyRateSpecial: 100,
    subsidyDisplay: {
      hi: 'रिवॉल्विंग फंड ₹15,000 + CIF ₹1.5 लाख + 7% ब्याज पर ऋण (ब्याज छूट)',
      en: 'Revolving Fund ₹15k + CIF ₹1.5L + Concessional Interest Subvention @ 7%',
      mr: 'फिरता निधी ₹15,000 + CIF ₹1.5 लाख + 7% व्याजाने कर्ज',
      ta: 'சுழல் நிதி ₹15,000 + CIF ₹1.5 லட்சம் + 7% சலுகை வட்டி கடன்'
    },
    interestRate: {
      hi: 'मात्र 7% वार्षिक (समय पर भुगतान पर 3% अतिरिक्त छूट = 4% प्रभावी)',
      en: '7% per annum (With prompt repayment incentive net 4% in intensive blocks)',
      mr: 'फक्त 7% वार्षिक (नियमित परतफेडीवर निव्वळ 4%)',
      ta: 'ஆண்டுக்கு 7% வட்டி மட்டுமே'
    },
    collateralFree: true,
    collateralText: {
      hi: '₹10 लाख तक के ऋण पर कोई कोलैटरल या मार्जिन मनी नहीं',
      en: '100% Collateral-Free and zero margin money up to ₹10 Lakhs',
      mr: 'कोणतेही तारण न देता ₹10 लाखांपर्यंत कर्ज',
      ta: '₹10 லட்சம் வரை எவ்வித பிணையமும் இன்றி கடன்'
    },
    brief: {
      hi: 'ग्रामीण महिला स्वयं सहायता समूह (SHG) सदस्यों को लघु उद्योग लगाने और ₹1 लाख वार्षिक आय (लखपति दीदी) हेतु वित्तीय सहायता।',
      en: 'Financial inclusion initiative enabling rural women SHG members to establish micro-enterprises and achieve ₹1 Lakh+ sustainable annual income.',
      mr: 'ग्रामीण महिला बचत गट सदस्यांना गृहउद्योग, शेळीपालन, शिलाई व प्रक्रिया उद्योगासाठी तारणमुक्त कर्ज.',
      ta: 'கிராமப்புற மகளிர் சுயஉதவி குழு உறுப்பினர்கள் குறுந்தொழில் தொடங்கி ஆண்டுக்கு ₹1 லட்சம் வருமானம் ஈட்ட உதவும் திட்டம்.'
    },
    description: {
      hi: 'मिशन लखपति दीदी का लक्ष्य ग्रामीण महिलाओं को स्थायी उद्यमी बनाना है। इसके तहत स्वयं सहायता समूह (SHG) की महिला सदस्यों को रिवॉल्विंग फंड, सामुदायिक निवेश कोष (CIF), बिना गारंटी के ₹10 लाख तक का बैंक लिंकेज ऋण मात्र 7% ब्याज पर, तथा तकनीकी प्रशिक्षण दिया जाता है ताकि प्रत्येक दीदी साल में कम से कम ₹1 लाख कमा सके।',
      en: 'The Lakhpati Didi initiative under DAY-NRLM empowers rural women to undertake viable economic activities across agriculture, livestock, tailoring, digital services, and food processing. It provides community funding, bank loans up to ₹10 Lakh without collateral at 7% interest, and market linkages through SARAS fairs.',
      mr: 'लखपती दीदी उपक्रमांतर्गत ग्रामीण भागातील महिलांना शेती, दुग्धव्यवसाय, सेंद्रिय खते, हातमाग व खाद्य प्रक्रिया यांसारख्या उद्योगांसाठी बचत गटांमार्फत 7% व्याजाने ₹10 लाखांपर्यंतचे तारणमुक्त कर्ज दिले जाते.',
      ta: 'லக்பதி தீதி திட்டம் கிராமப்புற பெண்களை தொழில்முனைவோராக மாற்றும் நோக்கத்துடன் தொடங்கப்பட்டது. மகளிர் சுயஉதவி குழுக்களுக்கு ₹10 லட்சம் வரை பிணையில்லா கடன் வெறும் 7% வட்டியில் வழங்கப்படுகிறது. ஆண்டுக்கு குறைந்தபட்சம் ₹1 லட்சம் வருமானம் ஈட்டுவதை இத்திட்டம் உறுதி செய்கிறது.'
    },
    eligibility: {
      hi: [
        'ग्रामीण महिला स्वयं सहायता समूह (SHG) की सक्रिय सदस्य',
        'समूह नियमित बचत और बैठक (पंचसूत्र) का पालन करता हो',
        'समूह का बैंक खाता न्यूनतम 6 महीने पुराना हो',
        'उद्यम शुरू करने हेतु व्यावहारिक कार्ययोजना (Micro Investment Plan)',
        'सभी जातियों और श्रेणियों की ग्रामीण महिलाएं पात्र'
      ],
      en: [
        'Active member of a registered rural Self-Help Group (SHG)',
        'SHG must follow Panchasutra (Regular Meetings, Savings, Internal Lending, Repayment, Bookkeeping)',
        'SHG bank account operational for at least 6 months with good grading',
        'Preparation of household Micro Investment Plan (MIP)',
        'Open to all rural women across communities'
      ],
      mr: [
        'नोंदणीकृत ग्रामीण महिला बचत गटाची सक्रिय सदस्या',
        'बचत गटाने पंचसूत्रीचे नियमित पालन केलेले असावे',
        'बचत गट किमान ६ महिने जुना असावा',
        'उद्योग सुरू करण्यासाठी सूक्ष्म गुंतवणूक आराखडा (MIP) आवश्यक',
        'सर्व प्रवर्गातील ग्रामीण महिला पात्र'
      ],
      ta: [
        'பதிவு செய்யப்பட்ட மகளிர் சுயஉதவி குழுவின் (SHG) தீவிர உறுப்பினர்',
        'குழு பஞ்சசூத்திர விதிகளை தவறாமல் பின்பற்றி இருக்க வேண்டும்',
        'குழு ஆரம்பிக்கப்பட்டு குறைந்தது 6 மாதங்கள் ஆகியிருக்க வேண்டும்',
        'தொழில் தொடங்குவதற்கான நுண் முதலீட்டுத் திட்டம் (MIP)',
        'அனைத்து சமூகங்களைச் சேர்ந்த கிராமப்புற பெண்களும் தகுதியானவர்கள்'
      ]
    },
    documents: {
      hi: [
        'आधार कार्ड एवं मोबाइल नंबर',
        'स्वयं सहायता समूह (SHG) सदस्यता प्रमाण व समूह प्रस्ताव (Resolution)',
        'समूह बैंक खाता पासबुक एवं ग्रेडिंग रिपोर्ट',
        'माइक्रो इन्वेस्टमेंट प्लान (MIP फॉर्म)',
        'आवेदिका का पासपोर्ट साइज फोटो'
      ],
      en: [
        'Aadhaar Card with linked phone number',
        'SHG Membership proof and SHG sanction resolution copy',
        'SHG Bank Passbook and Bank Grading Assessment sheet',
        'Household Micro Investment Plan (MIP) document',
        'Passport photograph of the beneficiary woman'
      ],
      mr: [
        'आधार कार्ड व मोबाईल नंबर',
        'बचत गट सदस्यत्व पुरावा व बचत गटाचा ठराव',
        'बचत गटाचे बँक पासबुक व ग्रेडिंग प्रत',
        'सूक्ष्म गुंतवणूक आराखडा (MIP फॉर्म)',
        'पासपोर्ट फोटो'
      ],
      ta: [
        'விண்ணப்பதாரரின் ஆதார் அட்டை',
        'மகளிர் சுயஉதவி குழு உறுப்பினர் சான்று மற்றும் குழுவின் தீர்மான நகல்',
        'குழுவின் வங்கி கணக்கு புத்தகம் மற்றும் தர மதிப்பீட்டு அறிக்கை',
        'நுண் முதலீட்டுத் திட்டம் (MIP படிவம்)',
        'பாஸ்போர்ட் அளவு புகைப்படம்'
      ]
    },
    applicationProcess: {
      hi: [
        '१. अपने ग्राम संगठन (VO) अथवा संकुल स्तरीय संघ (CLF) में उद्यम प्रस्ताव प्रस्तुत करें',
        '२. कम्युनिटी रिसोर्स पर्सन (CRP / बैंक सखी) द्वारा MIP तैयार करने में सहायता',
        '३. ग्राम संगठन द्वारा प्रस्ताव पारित कर बैंक शाखा में लिंकेज हेतु प्रेषित',
        '४. बैंक द्वारा 7% ब्याज दर पर सामूहिक अथवा व्यक्तिगत उद्यम ऋण का संवितरण',
        '५. ग्रामउद्यम व आजीविका मिशन द्वारा तकनीकी प्रशिक्षण एवं बाजार सहायता'
      ],
      en: [
        '1. Present business proposal at Village Organisation (VO) or Cluster Level Federation (CLF)',
        '2. Community Resource Person (CRP / Bank Sakhi) assists with Micro Investment Plan',
        '3. VO approves proposal and submits loan application to linked bank branch',
        '4. Bank sanctions and disburses loan at subsidized 7% interest rate',
        '5. Training and market linkage provided via SARAS fairs and rural marts'
      ],
      mr: [
        '१. ग्रामसंघात (VO) किंवा प्रभाग संघात व्यवसाय प्रस्ताव मांडा',
        '२. बँक सखीच्या मदतीने कर्ज प्रस्ताव तयार करा',
        '३. ग्रामसंघाच्या मंजुरीनंतर बँक शाखेत अर्ज दाखल',
        '४. बँकेकडून 7% सवलतीच्या व्याजाने कर्ज वितरण',
        '५. प्रशिक्षण व बाजारपेठ जोडणी'
      ],
      ta: [
        '1. கிராம வறுமை ஒழிப்பு சங்கம் அல்லது கூட்டமைப்பில் தொழில் திட்டத்தை முன்வைக்கவும்',
        '2. வங்கி சகி (Bank Sakhi) திட்ட அறிக்கை தயாரிக்க உதவுவார்',
        '3. வங்கிக்கு கடன் விண்ணப்பம் பரிந்துரைக்கப்படும்',
        '4. வங்கி 7% சலுகை வட்டியில் கடனை நேரடியாக வழங்கும்',
        '5. வாழ்வாதார இயக்கம் மூலம் பயிற்சி மற்றும் சந்தை வாய்ப்புகள் வழங்கப்படும்'
      ]
    },
    officialPortal: 'https://nrlm.gov.in/',
    portalName: 'DAY-NRLM Official Portal',
    targetSectors: ['Tailoring', 'Dairy', 'Food Processing', 'Handloom', 'Poultry', 'Handicrafts', 'Retail']
  }
];

/**
 * Filter schemes by category, search text, or specific tags
 */
export function getFilteredSchemes(
  categoryFilter: string,
  searchQuery: string,
  lang: 'hi' | 'en' | 'mr' | 'ta'
): GovScheme[] {
  let list = PAN_INDIA_GOV_SCHEMES;

  if (categoryFilter && categoryFilter !== 'all') {
    if (categoryFilter === 'subsidy') {
      list = list.filter(s => s.subsidyRateRural > 0 || s.subsidyRateSpecial > 0);
    } else if (categoryFilter === 'collateral_free') {
      list = list.filter(s => s.collateralFree);
    } else {
      list = list.filter(s => s.category === categoryFilter);
    }
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(s => {
      const name = s.name[lang].toLowerCase();
      const code = s.code.toLowerCase();
      const ministry = s.ministry[lang].toLowerCase();
      const desc = s.description[lang].toLowerCase();
      const sectors = s.targetSectors.join(' ').toLowerCase();
      return name.includes(q) || code.includes(q) || ministry.includes(q) || desc.includes(q) || sectors.includes(q);
    });
  }

  return list;
}

/**
 * Get scheme by ID
 */
export function getSchemeById(id: string): GovScheme | undefined {
  return PAN_INDIA_GOV_SCHEMES.find(s => s.id === id);
}
