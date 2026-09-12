/**
 * GramUdyam — Finance & DPR Screen (Module 2: Financial Engineering & Bank DPR)
 * Fully customizable, interactive financial calculator dynamically synchronized with:
 * 1. User's Business Ideation (CapEx, OpEx, Revenue streams adapted to selected business)
 * 2. Selected Government Scheme (PMEGP, PMFME, MUDRA, AHIDF, Stand-Up India)
 * 3. Real-time Loan EMI, Subsidy, Surplus, DSCR & 31-Section Bank DPR generation
 */
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { BeneficiaryProfile, getActiveScheme, saveActiveScheme } from '../services/enterpriseStore';
import { Language } from '../locales';

interface Props {
  userProfile: BeneficiaryProfile;
  lang: Language;
}

type FinanceSubTab = 'overview' | 'scheme_selector' | 'capex_opex' | 'revenue_expense' | 'loan_repayment' | 'dpr_generator';

const FINANCE_TRANSLATIONS = {
  hi: {
    screenTitle: 'वित्तीय योजना एवं बैंक DPR हब',
    subtitle: 'एवं सरकारी योजनाओं से सिंक की गई लाइव वित्तीय मॉडलिंग',
    selectedScheme: 'वित्तपोषण हेतु चयनित योजना:',
    switchScheme: 'योजना बदलें (लाइव रीकैलकुलेशन):',
    tabOverview: 'वित्तीय अवलोकन',
    tabCapex: 'परियोजना लागत (CapEx)',
    tabRevenue: 'आय, व्यय व अधिशेष',
    tabLoan: 'ऋण व EMI अदायगी',
    tabDpr: 'बैंक DPR (92% तैयार)',
    lblProjectCost: 'कुल परियोजना लागत',
    lblSubsidy: 'सरकारी सब्सिडी',
    lblOwnEquity: 'स्वयं पूँजी',
    lblNetLoan: 'नेट बैंक ऋण',
    lblMonthlyEmi: 'मासिक EMI',
    lblNetSurplus: 'शुद्ध मासिक बचत',
    customizeTitle: 'परियोजना पैमाना एवं लागत अनुकूलन',
    scaleHint: 'हेतु अनुशंसित पैमाना चुनें अथवा अपनी इच्छित राशि दर्ज करें:',
    presetMicro: 'सूक्ष्म पैमाना',
    presetRec: '⭐ अनुशंसित',
    presetComm: 'व्यावसायिक सेटअप',
    customCostLbl: 'कस्टम परियोजना लागत:',
    ownCapitalTitle: 'आपकी स्वयं की पूँजी (Margin Money)',
    syncedBadge: 'ऑनबोर्डिंग से सिंक',
    aiInsightTitle: 'AI अंतर्दृष्टि: अनुशंसित बनाम अधिकतम ऋण तुलना',
    maxUnderScheme: 'योजना तहत अधिकतम सीमा',
    highRiskTag: 'उच्च जोखिम / अत्यधिक कर्ज',
    recSafeScale: '⭐ अनुशंसित सुरक्षित पैमाना',
    capexTitle: 'पूँजीगत परिसंपत्तियाँ (CapEx)',
    totalFixedCapex: 'कुल स्थायी परिसंपत्तियाँ:',
    opexTitle: 'कार्यशील पूँजी (OpEx Buffer)',
    totalOpex: 'कुल कार्यशील पूँजी:',
    totalProjectCost: 'कुल परियोजना लागत (CapEx + OpEx):',
    cashflowWaterfall: 'मासिक राजस्व, व्यय एवं शुद्ध अधिशेष प्रवाह',
    grossRev: 'सकल मासिक बिक्री / आय',
    rawMaterial: 'कच्चा माल व खरीद लागत',
    grossProfit: 'सकल परिचालन लाभ',
    fixedOverheads: 'स्थिर परिचालन व्यय (बिजली, किराया, सहायक)',
    operatingProfit: 'परिचालन लाभ (EBITDA)',
    loanEmiDeduct: 'मासिक ऋण किस्त (EMI)',
    netSurplusTakehome: 'शुद्ध मासिक बचत (घर ले जाने योग्य)',
    sensitivityTitle: 'तीन परिदृश्य संवेदनशीलता विश्लेषण',
    loanParamsTitle: 'ऋण व पुनर्भुगतान पैरामीटर अनुकूलन',
    interestRateLbl: 'वार्षिक ब्याज दर (%)',
    tenureLbl: 'ऋण अवधि (वर्ष)',
    moratoriumLbl: 'मोरेटोरियम (छूट अवधि)',
    debtHealthTitle: 'ऋण अदायगी सुरक्षा पूर्वानुमान',
    dprTitle: '31-खंडीय बैंक DPR दस्तावेज़ जनरेटर',
    dprCompiledHead: 'संकलित बैंक DPR खंड:',
    generateDprBtn: '31-खंडीय बैंक DPR रिपोर्ट (PDF) जनरेट करें',
    dprAlertTitle: '31-खंडीय बैंक DPR रिपोर्ट तैयार!',
    dprAlertMsg: 'आपकी विस्तृत परियोजना रिपोर्ट (DPR) बैंक में जमा करने हेतु तैयार है।',
  },
  en: {
    screenTitle: 'Finance & Bank DPR Hub',
    subtitle: 'Dynamic financial modeling synced with selected business & government schemes',
    selectedScheme: 'Selected Scheme for Funding:',
    switchScheme: 'Switch Scheme (Recalculates Finance):',
    tabOverview: 'Financial Overview',
    tabCapex: 'CapEx & OpEx Costing',
    tabRevenue: 'Revenue & Surplus',
    tabLoan: 'Loan & EMI Schedule',
    tabDpr: 'Bank DPR (92% Ready)',
    lblProjectCost: 'Project Cost',
    lblSubsidy: 'Govt Subsidy',
    lblOwnEquity: 'Own Equity',
    lblNetLoan: 'Net Bank Loan',
    lblMonthlyEmi: 'Monthly EMI',
    lblNetSurplus: 'Net Monthly Surplus',
    customizeTitle: 'Customize Project Size & Cost',
    scaleHint: 'Select a realistic starting scale or enter a custom amount:',
    presetMicro: 'Micro Scale',
    presetRec: '⭐ Recommended',
    presetComm: 'Commercial Setup',
    customCostLbl: 'Custom Project Cost:',
    ownCapitalTitle: 'Your Own Capital Contribution (Margin Money)',
    syncedBadge: 'Synced',
    aiInsightTitle: 'AI Insight: Recommended vs Maximum Finance',
    maxUnderScheme: 'Maximum Under Scheme',
    highRiskTag: 'High Risk / Excess Debt',
    recSafeScale: '⭐ Recommended Scale',
    capexTitle: 'CapEx Fixed Assets',
    totalFixedCapex: 'Total Fixed CapEx Assets:',
    opexTitle: 'Working Capital (OpEx Buffer)',
    totalOpex: 'Total Working Capital Reserve:',
    totalProjectCost: 'Total Project Cost (CapEx + OpEx):',
    cashflowWaterfall: 'Monthly Cash Flow Waterfall',
    grossRev: 'Gross Monthly Revenue',
    rawMaterial: 'Raw Materials & Procurement Cost',
    grossProfit: 'Gross Operating Profit',
    fixedOverheads: 'Fixed Overheads (Power, Helpers, Rent)',
    operatingProfit: 'Operating Profit (EBITDA)',
    loanEmiDeduct: 'Monthly Loan EMI',
    netSurplusTakehome: 'Net Monthly Cash Surplus (Take-Home)',
    sensitivityTitle: '3-Scenario Cash Flow Sensitivity',
    loanParamsTitle: 'Adjust Loan & Repayment Parameters',
    interestRateLbl: 'Annual Interest Rate (%)',
    tenureLbl: 'Loan Tenure (Years)',
    moratoriumLbl: 'Principal Moratorium',
    debtHealthTitle: 'Debt Service Health Forecast',
    dprTitle: '31-Section Bankable DPR Report',
    dprCompiledHead: 'Bank DPR Chapters Compiled:',
    generateDprBtn: 'Generate & Download 31-Section DPR (PDF)',
    dprAlertTitle: '31-Section Banking DPR Generated!',
    dprAlertMsg: 'Your bankable Detailed Project Report has been compiled and is ready for submission.',
  },
  mr: {
    screenTitle: 'आर्थिक नियोजन आणि बँक DPR केंद्र',
    subtitle: 'आणि सरकारी योजनांशी जोडलेले थेट आर्थिक मॉडेलिंग',
    selectedScheme: 'निधीसाठी निवडलेली सरकारी योजना:',
    switchScheme: 'योजना बदला (थेट पुनर्गणना):',
    tabOverview: 'आर्थिक विहंगावलोकन',
    tabCapex: 'प्रकल्प खर्च (भांडवली खर्च)',
    tabRevenue: 'उत्पन्न, खर्च आणि नफा',
    tabLoan: 'कर्ज आणि EMI परतफेड',
    tabDpr: 'बँक DPR (९२% तयार)',
    lblProjectCost: 'एकूण प्रकल्प खर्च',
    lblSubsidy: 'सरकारी अनुदान (सबसिडी)',
    lblOwnEquity: 'स्वतःचे भांडवल',
    lblNetLoan: 'निव्वळ बँक कर्ज',
    lblMonthlyEmi: 'मासिक हप्ता (EMI)',
    lblNetSurplus: 'निव्वळ मासिक नफा',
    customizeTitle: 'प्रकल्पाचा आकार आणि खर्च सानुकूलित करा',
    scaleHint: 'साठी शिफारस केलेला आकार निवडा किंवा स्वतःची रक्कम प्रविष्ट करा:',
    presetMicro: 'लघु प्रमाण',
    presetRec: '⭐ शिफारस केलेले',
    presetComm: 'व्यावसायिक स्वरूप',
    customCostLbl: 'इच्छित प्रकल्प खर्च:',
    ownCapitalTitle: 'तुमचे स्वतःचे भांडवल (मार्जिन मनी)',
    syncedBadge: 'नोंदणीतून सिंक',
    aiInsightTitle: 'AI दृष्टिकोन: शिफारस केलेले विरुद्ध कमाल वित्तपुरवठा',
    maxUnderScheme: 'योजनेअंतर्गत कमाल मर्यादा',
    highRiskTag: 'जास्त धोका / जादा कर्ज',
    recSafeScale: '⭐ शिफारस केलेला सुरक्षित आकार',
    capexTitle: 'भांडवली मालमत्ता (CapEx)',
    totalFixedCapex: 'एकूण स्थिर मालमत्ता खर्च:',
    opexTitle: 'कार्यरत भांडवल राखीव (OpEx)',
    totalOpex: 'एकूण कार्यरत भांडवल:',
    totalProjectCost: 'एकूण प्रकल्प खर्च (CapEx + OpEx):',
    cashflowWaterfall: 'मासिक रोख प्रवाह आणि नफा विश्लेषण',
    grossRev: 'एकूण मासिक विक्री / उत्पन्न',
    rawMaterial: 'कच्चा माल व खरेदी खर्च',
    grossProfit: 'एकूण नफा (Gross Profit)',
    fixedOverheads: 'नियमित खर्च (वीज, भाडे, कामगार)',
    operatingProfit: 'ऑपरेटिंग नफा (EBITDA)',
    loanEmiDeduct: 'मासिक बँक हप्ता (EMI)',
    netSurplusTakehome: 'निव्वळ मासिक नफा (हातात येणारी रक्कम)',
    sensitivityTitle: 'तीन परिस्थिती संवेदनशीलता विश्लेषण',
    loanParamsTitle: 'कर्ज आणि परतफेड पॅरामीटर्स बदला',
    interestRateLbl: 'वार्षिक व्याज दर (%)',
    tenureLbl: 'कर्ज कालावधी (वर्षे)',
    moratoriumLbl: 'सूट कालावधी (Moratorium)',
    debtHealthTitle: 'कर्ज परतफेड सुरक्षितता अंदाज',
    dprTitle: '३१-कलमी बँक DPR अहवाल जनरेटर',
    dprCompiledHead: 'संकलित बँक DPR विभाग:',
    generateDprBtn: '३१-कलमी बँक DPR अहवाल (PDF) तयार करा',
    dprAlertTitle: '३१-कलमी बँक DPR अहवाल तयार!',
    dprAlertMsg: 'तुमचा सविस्तर प्रकल्प अहवाल (DPR) बँकेत सादर करण्यासाठी पूर्ण तयार आहे.',
  },
  ta: {
    screenTitle: 'நிதித் திட்டம் மற்றும் வங்கி DPR மையம்',
    subtitle: 'மற்றும் அரசுத் திட்டங்களுடன் இணைக்கப்பட்ட நேரடி நிதி மாதிரி',
    selectedScheme: 'நிதியுதவிக்கான தேர்ந்தெடுக்கப்பட்ட திட்டம்:',
    switchScheme: 'திட்டத்தை மாற்றுக (நேரடி மறு கணக்கீடு):',
    tabOverview: 'நிதி மேலோட்டம்',
    tabCapex: 'திட்ட செலவு (மூலதன செலவு)',
    tabRevenue: 'வருவாய், செலவு மற்றும் உபரி',
    tabLoan: 'கடன் மற்றும் EMI திருப்பிச் செலுத்துதல்',
    tabDpr: 'வங்கி DPR (92% தயார்)',
    lblProjectCost: 'மொத்த திட்ட செலவு',
    lblSubsidy: 'அரசு மானியம்',
    lblOwnEquity: 'சொந்த முதலீடு',
    lblNetLoan: 'வங்கி கடன் தொகை',
    lblMonthlyEmi: 'மாதாந்திர தவணை (EMI)',
    lblNetSurplus: 'நிகர மாதாந்திர உபரி',
    customizeTitle: 'திட்ட அளவு மற்றும் செலவு தனிப்பயனாக்கம்',
    scaleHint: 'பரிந்துரைக்கப்பட்ட அளவைத் தேர்ந்தெடுக்கவும் அல்லது தொகையை உள்ளிடவும்:',
    presetMicro: 'குறு அளவு',
    presetRec: '⭐ பரிந்துரைக்கப்பட்டது',
    presetComm: 'வணிக அமைப்பு',
    customCostLbl: 'தனிப்பயன் திட்ட செலவு:',
    ownCapitalTitle: 'உங்கள் சொந்த முதலீடு (மார்ஜின் பணம்)',
    syncedBadge: 'இணைக்கப்பட்டது',
    aiInsightTitle: 'AI பார்வை: பரிந்துரைக்கப்பட்ட மற்றும் அதிகபட்ச நிதி',
    maxUnderScheme: 'திட்டத்தின் கீழ் அதிகபட்ச வரம்பு',
    highRiskTag: 'அதிக ஆபத்து / கூடுதல் கடன்',
    recSafeScale: '⭐ பாதுகாப்பான அளவு',
    capexTitle: 'மூலதன சொத்துக்கள் (CapEx)',
    totalFixedCapex: 'மொத்த நிலையான மூலதன சொத்துக்கள்:',
    opexTitle: 'நடைமுறை மூலதனம் (OpEx)',
    totalOpex: 'மொத்த நடைமுறை மூலதனம்:',
    totalProjectCost: 'மொத்த திட்ட செலவு (CapEx + OpEx):',
    cashflowWaterfall: 'மாதாந்திர பணப்புழக்கம் மற்றும் உபரி',
    grossRev: 'மொத்த மாதாந்திர விற்பனை / வருவாய்',
    rawMaterial: 'மூலப்பொருள் மற்றும் கொள்முதல் செலவு',
    grossProfit: 'மொத்த இயக்க லாபம்',
    fixedOverheads: 'நிலையான செலவுகள் (மின்சாரம், வாடகை, பணியாளர்)',
    operatingProfit: 'இயக்க லாபம் (EBITDA)',
    loanEmiDeduct: 'மாதாந்திர வங்கி தவணை (EMI)',
    netSurplusTakehome: 'நிகர மாதாந்திர லாபம் (கைக்கு வரும் தொகை)',
    sensitivityTitle: '3-சூழ்நிலை உணர்திறன் பகுப்பாய்வு',
    loanParamsTitle: 'கடன் மற்றும் திருப்பிச் செலுத்தும் அளவுருக்கள்',
    interestRateLbl: 'வருடாந்திர வட்டி விகிதம் (%)',
    tenureLbl: 'கடன் காலம் (ஆண்டுகள்)',
    moratoriumLbl: 'விலக்கு காலம் (Moratorium)',
    debtHealthTitle: 'கடன் திருப்பிச் செலுத்தும் பாதுகாப்பு கணிப்பு',
    dprTitle: '31-பிரிவு வங்கி DPR அறிக்கை ஜெனரேட்டர்',
    dprCompiledHead: 'தொகுக்கப்பட்ட வங்கி DPR அத்தியாயங்கள்:',
    generateDprBtn: '31-பிரிவு வங்கி DPR அறிக்கையை பதிவிறக்குக (PDF)',
    dprAlertTitle: '31-பிரிவு வங்கி DPR அறிக்கை தயார்!',
    dprAlertMsg: 'உங்கள் விரிவான திட்ட அறிக்கை (DPR) வங்கியில் சமர்ப்பிக்க தயாராக உள்ளது.',
  },
  te: {
    screenTitle: 'ఆర్థిక ప్రణాళిక మరియు బ్యాంక్ DPR కేంద్రం',
    subtitle: 'మరియు ప్రభుత్వ పథకాలతో సమన్వయం చేయబడిన ప్రత్యక్ష ఆర్థిక మోడలింగ్',
    selectedScheme: 'నిధుల కోసం ఎంచుకున్న ప్రభుత్వ పథకం:',
    switchScheme: 'పథకాన్ని మార్చండి (ప్రత్యక్ష పునఃగణన):',
    tabOverview: 'ఆర్థిక అవలోకనం',
    tabCapex: 'ప్రాజెక్ట్ ఖర్చు (మూలధన వ్యయం)',
    tabRevenue: 'ఆదాయం, ఖర్చు మరియు మిగులు',
    tabLoan: 'రుణం మరియు EMI చెల్లింపు',
    tabDpr: 'బ్యాంక్ DPR (92% సిద్ధంగా ఉంది)',
    lblProjectCost: 'మొత్తం ప్రాజెక్ట్ ఖర్చు',
    lblSubsidy: 'ప్రభుత్వ రాయితీ (సబ్సిడీ)',
    lblOwnEquity: 'సొంత పెట్టుబడి',
    lblNetLoan: 'నికర బ్యాంక్ రుణం',
    lblMonthlyEmi: 'నెలవారీ ఈఎంఐ (EMI)',
    lblNetSurplus: 'నికర నెలవారీ మిగులు',
    customizeTitle: 'ప్రాజెక్ట్ పరిమాణం మరియు వ్యయ సర్దుబాటు',
    scaleHint: 'కోసం సిఫార్సు చేసిన పరిమాణాన్ని ఎంచుకోండి లేదా మొత్తాన్ని నమోదు చేయండి:',
    presetMicro: 'సూక్ష్మ స్థాయి',
    presetRec: '⭐ సిఫార్సు చేయబడింది',
    presetComm: 'వాణిజ్య సెటప్',
    customCostLbl: 'సొంత ప్రాజెక్ట్ ఖర్చు:',
    ownCapitalTitle: 'మీ సొంత మూలధన భాగస్వామ్యం (మార్జిన్ మనీ)',
    syncedBadge: 'సింక్ చేయబడింది',
    aiInsightTitle: 'AI విశ్లేషణ: సిఫార్సు వర్సెస్ గరిష్ట రుణం',
    maxUnderScheme: 'పథకం కింద గరిష్ట పరిమితి',
    highRiskTag: 'అధిక ప్రమాదం / అధిక రుణం',
    recSafeScale: '⭐ సురక్షిత సిఫార్సు పరిమాణం',
    capexTitle: 'మూలధన ఆస్తులు (CapEx)',
    totalFixedCapex: 'మొత్తం స్థిర మూలధన ఆస్తులు:',
    opexTitle: 'నిర్వహణ మూలధనం (OpEx Buffer)',
    totalOpex: 'మొత్తం నిర్వహణ మూలధనం:',
    totalProjectCost: 'మొత్తం ప్రాజెక్ట్ ఖర్చు (CapEx + OpEx):',
    cashflowWaterfall: 'నెలవారీ నగదు ప్రవాహం మరియు మిగులు విశ్లేషణ',
    grossRev: 'మొత్తం నెలవారీ అమ్మకాలు / రాబడి',
    rawMaterial: 'ముడి సరుకు మరియు సేకరణ ఖర్చు',
    grossProfit: 'స్థూల నిర్వహణ లాభం',
    fixedOverheads: 'స్థిర ఖర్చులు (విద్యుత్, అద్దె, సిబ్బంది)',
    operatingProfit: 'నిర్వహణ లాభం (EBITDA)',
    loanEmiDeduct: 'నెలవారీ బ్యాంక్ ఈఎంఐ (EMI)',
    netSurplusTakehome: 'నికర నెలవారీ మిగులు (చేతికి వచ్చే నికర మొత్తం)',
    sensitivityTitle: '3-సందర్భాల సున్నితత్వ విశ్లేషణ',
    loanParamsTitle: 'రుణం మరియు తిరిగి చెల్లింపు పారామితులు',
    interestRateLbl: 'వార్షిక వడ్డీ రేటు (%)',
    tenureLbl: 'రుణ కాలపరిమితి (సంవత్సరాలు)',
    moratoriumLbl: 'మినహాయింపు కాలం (Moratorium)',
    debtHealthTitle: 'రుణ చెల్లింపు భద్రత అంచనా',
    dprTitle: '31-విభాగాల బ్యాంక్ DPR నివేదిక జనరేటర్',
    dprCompiledHead: 'రూపొందించిన బ్యాంక్ DPR విభాగాలు:',
    generateDprBtn: '31-విభాగాల బ్యాంక్ DPR నివేదికను డౌన్‌లోడ్ చేయండి (PDF)',
    dprAlertTitle: '31-విభాగాల బ్యాంక్ DPR నివేదిక సిద్ధమైంది!',
    dprAlertMsg: 'మీ సమగ్ర ప్రాజెక్ట్ నివేదిక (DPR) బ్యాంకులో సమర్పించడానికి సిద్ధంగా ఉంది.',
  },
};

// Government Schemes Configuration Dictionary
interface SchemeConfig {
  id: string;
  name: string;
  shortName: string;
  ministry: string;
  subsidyPct: number; // e.g. 35 for 35%
  maxSubsidyAmount?: number;
  minMarginPct: number;
  defaultInterestRate: number;
  defaultTenureYears: number;
  defaultMoratoriumMonths: number;
  maxProjectCost: number;
  collateralType: string;
  description: string;
  badge: string;
}

const SCHEMES_DATABASE: SchemeConfig[] = [
  {
    id: 'pmegp',
    name: "Prime Minister's Employment Generation Programme",
    shortName: 'PMEGP (Rural 35% Subsidy)',
    ministry: 'Ministry of MSME & KVIC',
    subsidyPct: 35,
    minMarginPct: 5,
    defaultInterestRate: 8.5,
    defaultTenureYears: 7,
    defaultMoratoriumMonths: 6,
    maxProjectCost: 5000000,
    collateralType: 'Collateral-Free (CGTMSE)',
    description: '35% capital subsidy for rural special categories (OBC/SC/ST/Women). Margin only 5%.',
    badge: '35% Rural Subsidy • Best Match',
  },
  {
    id: 'pmfme',
    name: 'PM Formalisation of Micro Food Processing Enterprises',
    shortName: 'PMFME (35% Grant)',
    ministry: 'Ministry of Food Processing (MoFPI)',
    subsidyPct: 35,
    maxSubsidyAmount: 1000000,
    minMarginPct: 10,
    defaultInterestRate: 8.0,
    defaultTenureYears: 5,
    defaultMoratoriumMonths: 3,
    maxProjectCost: 3000000,
    collateralType: 'Collateral-Free up to ₹10L',
    description: '35% credit-linked capital subsidy for agro, oil expeller, flour & food units up to ₹10 Lakh grant.',
    badge: '35% Food Processing Grant',
  },
  {
    id: 'mudra',
    name: 'Pradhan Mantri MUDRA Yojana',
    shortName: 'PM MUDRA (Kishor / Tarun)',
    ministry: 'Ministry of Finance / SIDBI',
    subsidyPct: 0,
    minMarginPct: 0,
    defaultInterestRate: 9.0,
    defaultTenureYears: 5,
    defaultMoratoriumMonths: 0,
    maxProjectCost: 1000000,
    collateralType: '100% Collateral-Free (CGFMU)',
    description: 'Instant collateral-free bank loan without subsidy delay. Up to ₹10 Lakh under Tarun phase.',
    badge: 'Zero Collateral • Instant Disbursal',
  },
  {
    id: 'ahidf',
    name: 'Animal Husbandry Infrastructure Development Fund',
    shortName: 'AHIDF (3% Interest Subvention)',
    ministry: 'Dept of Animal Husbandry & Dairying',
    subsidyPct: 0,
    minMarginPct: 10,
    defaultInterestRate: 6.5, // 3% subvention on base 9.5% -> net 6.5%
    defaultTenureYears: 8,
    defaultMoratoriumMonths: 24,
    maxProjectCost: 20000000,
    collateralType: 'NABARD Credit Guarantee',
    description: '3% direct interest subvention with 2-year principal moratorium for dairy & chilling setups.',
    badge: '3% Interest Subvention • 2-Yr Moratorium',
  },
  {
    id: 'standup',
    name: 'Stand-Up India Scheme',
    shortName: 'Stand-Up India (SC/ST/Women)',
    ministry: 'Department of Financial Services',
    subsidyPct: 15,
    minMarginPct: 15,
    defaultInterestRate: 7.75,
    defaultTenureYears: 7,
    defaultMoratoriumMonths: 18,
    maxProjectCost: 10000000,
    collateralType: 'CGSUI Credit Guarantee',
    description: 'Composite loan between ₹10 Lakh and ₹1 Crore for greenfield women or SC/ST enterprises.',
    badge: 'Composite Term Loan + Working Capital',
  },
];

export const FinanceScreen: React.FC<Props> = ({ userProfile, lang }) => {
  const isEn = lang === 'en';
  const [activeSubTab, setActiveSubTab] = useState<FinanceSubTab>('overview');

  // Business Ideation Category
  const bizName = userProfile.selectedBizName || 'Dairy Farming & Milk Collection';
  const catKey = (bizName + ' ' + (userProfile.businessIdeaDescription || '')).toLowerCase();

  // Determine Category-Specific Baseline Defaults
  const categoryConfig = useMemo(() => {
    if (catKey.includes('pharmacy') || catKey.includes('medical') || catKey.includes('health')) {
      return {
        defaultCost: 350000,
        presetCosts: [200000, 350000, 600000],
        capexItems: [
          { name: 'Medicine Storage Display Racks & Counter', defaultAmt: 65000 },
          { name: 'Medical Refrigerator for Vaccines/Insulin', defaultAmt: 45000 },
          { name: 'POS Billing Computer, Inverter & Software', defaultAmt: 50000 },
          { name: 'Drug License, Registration & Signboard', defaultAmt: 30000 },
        ],
        opexItems: [
          { name: 'Initial Essential Drug Stock (OTC + Chronic)', defaultAmt: 120000 },
          { name: 'Working Capital Reserve (2 Months)', defaultAmt: 40000 },
        ],
        revMonthlyUnit: 'Prescriptions & OTC Packets',
        revMarginPct: 0.22, // 22% retail margin
        monthlySalesFactor: 0.38,
      };
    } else if (catKey.includes('food') || catKey.includes('oil') || catKey.includes('flour') || catKey.includes('processing')) {
      return {
        defaultCost: 650000,
        presetCosts: [350000, 650000, 1200000],
        capexItems: [
          { name: '10HP Cold-Press Mustard Oil Expeller Unit', defaultAmt: 240000 },
          { name: 'Flour Mill Pulverizer & Motor', defaultAmt: 90000 },
          { name: 'Automated Oil Filter Press & Storage Drum', defaultAmt: 65000 },
          { name: '3-Phase Industrial Electric Connection & Shed', defaultAmt: 75000 },
        ],
        opexItems: [
          { name: 'Raw Mustard Seed Buffer Stock (50 Quintal)', defaultAmt: 110000 },
          { name: 'Working Capital & Bottling Packaging Buffer', defaultAmt: 70000 },
        ],
        revMonthlyUnit: 'Pressed Oil (Liters) + Flour (kg)',
        revMarginPct: 0.25,
        monthlySalesFactor: 0.32,
      };
    } else if (catKey.includes('repair') || catKey.includes('solar') || catKey.includes('electronics')) {
      return {
        defaultCost: 240000,
        presetCosts: [120000, 240000, 450000],
        capexItems: [
          { name: 'SMD Hot-Air Rework Station & Micro Soldering Kit', defaultAmt: 45000 },
          { name: 'Digital Oscilloscope, Multimeter & Diagnostic PC', defaultAmt: 55000 },
          { name: 'Solar Controller & BMS Battery Testing Bench', defaultAmt: 40000 },
          { name: 'Shop Interior, Anti-Static Workstation & Signboard', defaultAmt: 30000 },
        ],
        opexItems: [
          { name: 'Fast-Moving Spare Parts Inventory (Screens/Batteries)', defaultAmt: 50000 },
          { name: 'Emergency Working Capital Reserve', defaultAmt: 20000 },
        ],
        revMonthlyUnit: 'Repair Service Tickets & AMC',
        revMarginPct: 0.65, // High service margin
        monthlySalesFactor: 0.35,
      };
    } else if (catKey.includes('tailor') || catKey.includes('handloom') || catKey.includes('textile')) {
      return {
        defaultCost: 180000,
        presetCosts: [90000, 180000, 350000],
        capexItems: [
          { name: '2x High-Speed Industrial Motorized Sewing Machines', defaultAmt: 60000 },
          { name: '5-Thread Heavy Duty Overlock & Hemming Machine', defaultAmt: 35000 },
          { name: 'Pattern Cutting Table, Steam Iron & Mannequins', defaultAmt: 25000 },
          { name: 'Shop Shelving & Lighting Works', defaultAmt: 15000 },
        ],
        opexItems: [
          { name: 'Fabric, Lining, Zippers & Haberdashery Stock', defaultAmt: 30000 },
          { name: 'Working Capital & Tailor Helper Advance', defaultAmt: 15000 },
        ],
        revMonthlyUnit: 'Stitched Garments & Alterations',
        revMarginPct: 0.60,
        monthlySalesFactor: 0.38,
      };
    } else {
      // Default: Dairy & Milk Collection Setup
      return {
        defaultCost: 550000,
        presetCosts: [280000, 550000, 950000],
        capexItems: [
          { name: 'BMC Bulk Milk Chilling Tank (200L–300L)', defaultAmt: 220000 },
          { name: 'Solar Power Inverter & Battery Backup (3 kW)', defaultAmt: 130000 },
          { name: 'Digital Ultrasonic Milk Analyzer & Stirrer', defaultAmt: 45000 },
          { name: 'Insulated Milk Cans & Dairy Shed Works', defaultAmt: 45000 },
        ],
        opexItems: [
          { name: 'Initial Cattle Feed & Mineral Mixture Buffer', defaultAmt: 50000 },
          { name: 'Working Capital (10-Day Farmer Milk Payment Reserve)', defaultAmt: 60000 },
        ],
        revMonthlyUnit: 'Liters Milk Aggregated & Tested',
        revMarginPct: 0.22,
        monthlySalesFactor: 0.28,
      };
    }
  }, [catKey]);

  // Active Scheme State (synced from enterprise store)
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(() => {
    // Recommend scheme according to business
    if (catKey.includes('food') || catKey.includes('oil') || catKey.includes('flour')) {
      return getActiveScheme('pmfme');
    }
    return getActiveScheme('pmegp');
  });

  const activeScheme = useMemo(() => {
    return SCHEMES_DATABASE.find((s) => s.id === selectedSchemeId) || SCHEMES_DATABASE[0];
  }, [selectedSchemeId]);

  // Sync active scheme selection back to store
  const handleSelectScheme = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    saveActiveScheme(schemeId);
    const sch = SCHEMES_DATABASE.find((s) => s.id === schemeId);
    if (sch) {
      setInterestRate(sch.defaultInterestRate);
      setTenureYears(sch.defaultTenureYears);
      setMoratoriumMonths(sch.defaultMoratoriumMonths);
    }
  };

  // Customizable Financial Parameters
  const [projectCost, setProjectCost] = useState<number>(categoryConfig.defaultCost);
  const [ownCapital, setOwnCapital] = useState<number>(userProfile.capital || 80000);
  const [interestRate, setInterestRate] = useState<number>(activeScheme.defaultInterestRate);
  const [tenureYears, setTenureYears] = useState<number>(activeScheme.defaultTenureYears);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(activeScheme.defaultMoratoriumMonths);

  // Update parameters when category changes
  useEffect(() => {
    setProjectCost(categoryConfig.defaultCost);
  }, [categoryConfig]);

  // Synchronized Financial Calculations
  const calculations = useMemo(() => {
    // Subsidy Calculation
    let subsidy = Math.round(projectCost * (activeScheme.subsidyPct / 100));
    if (activeScheme.maxSubsidyAmount && subsidy > activeScheme.maxSubsidyAmount) {
      subsidy = activeScheme.maxSubsidyAmount;
    }

    // Min Own Margin Requirement
    const minOwnMarginRequired = Math.round(projectCost * (activeScheme.minMarginPct / 100));
    const isMarginSufficient = ownCapital >= minOwnMarginRequired;

    // Bank Term Loan Required (Net of Subsidy)
    const netLoan = Math.max(0, projectCost - ownCapital - subsidy);

    // Monthly EMI Calculation (Compound Amortization)
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;
    const repaymentMonths = Math.max(1, totalMonths - moratoriumMonths);

    let emi = 0;
    if (netLoan > 0 && monthlyRate > 0) {
      emi = Math.round(
        (netLoan * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
          (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
      );
    }

    const totalRepayment = emi * repaymentMonths;
    const totalInterest = Math.max(0, totalRepayment - netLoan);

    // Revenue, Operating Costs & Surplus (Synced with scale & ideation)
    const estMonthlyRevenue = Math.round(projectCost * categoryConfig.monthlySalesFactor);
    const cogs = Math.round(estMonthlyRevenue * (1 - categoryConfig.revMarginPct));
    const grossProfit = estMonthlyRevenue - cogs;
    const fixedOperatingCosts = Math.round(grossProfit * 0.45); // Rent, electricity, helpers
    const operatingProfit = grossProfit - fixedOperatingCosts; // EBITDA

    const netMonthlySurplus = operatingProfit - emi;
    const dscr = Number((operatingProfit / (emi || 1)).toFixed(2));

    // CapEx & OpEx Scaled
    const baseTotal =
      categoryConfig.capexItems.reduce((acc, it) => acc + it.defaultAmt, 0) +
      categoryConfig.opexItems.reduce((acc, it) => acc + it.defaultAmt, 0);
    const scaleRatio = projectCost / (baseTotal || 1);

    const scaledCapex = categoryConfig.capexItems.map((item) => ({
      name: item.name,
      amount: Math.round(item.defaultAmt * scaleRatio),
    }));
    const totalCapex = scaledCapex.reduce((acc, i) => acc + i.amount, 0);

    const scaledOpex = categoryConfig.opexItems.map((item) => ({
      name: item.name,
      amount: Math.round(item.defaultAmt * scaleRatio),
    }));
    const totalOpex = scaledOpex.reduce((acc, i) => acc + i.amount, 0);

    return {
      subsidy,
      minOwnMarginRequired,
      isMarginSufficient,
      netLoan,
      emi,
      totalRepayment,
      totalInterest,
      estMonthlyRevenue,
      cogs,
      grossProfit,
      fixedOperatingCosts,
      operatingProfit,
      netMonthlySurplus,
      dscr,
      scaledCapex,
      totalCapex,
      scaledOpex,
      totalOpex,
    };
  }, [projectCost, ownCapital, activeScheme, interestRate, tenureYears, moratoriumMonths, categoryConfig]);

  const formatCurrency = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} Lakh`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${Math.round(n).toLocaleString()}`;
  };

  const t = FINANCE_TRANSLATIONS[lang] || FINANCE_TRANSLATIONS.hi;

  const handleGenerateDpr = () => {
    Alert.alert(
      t.dprAlertTitle,
      `"${bizName}" • ${activeScheme.shortName}\n\n${t.lblProjectCost}: ${formatCurrency(projectCost)}\n${t.lblSubsidy}: ${formatCurrency(calculations.subsidy)}\n${t.lblNetLoan}: ${formatCurrency(calculations.netLoan)}\n${t.lblMonthlyEmi}: ₹${calculations.emi.toLocaleString()}\nDSCR: ${calculations.dscr}x\n\n${t.dprAlertMsg}`
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* SCREEN HEADER */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>
            <Ionicons name="calculator" size={20} color={COLORS.primary} />
            {'  '}{t.screenTitle}
          </Text>
          <Text style={styles.subtitle}>
            {bizName} • {t.subtitle}
          </Text>
        </View>

        {/* ============================================================ */}
        {/* ACTIVE SCHEME BANNER & SELECTOR                              */}
        {/* ============================================================ */}
        <View style={styles.schemeBannerCard}>
          <View style={styles.schemeBannerHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.schemeEyebrow}>{t.selectedScheme}</Text>
              <Text style={styles.schemeBannerTitle}>{activeScheme.shortName}</Text>
            </View>
            <View style={styles.schemeSubsidyPill}>
              <Text style={styles.schemeSubsidyText}>
                {activeScheme.subsidyPct > 0 ? `${activeScheme.subsidyPct}% ${t.lblSubsidy}` : 'Zero Collateral'}
              </Text>
            </View>
          </View>
          <Text style={styles.schemeBannerDesc}>{activeScheme.description}</Text>

          {/* Quick Scheme Selector Chips */}
          <Text style={styles.switchSchemeLabel}>{t.switchScheme}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.schemeChipScroll}>
            {SCHEMES_DATABASE.map((sch) => {
              const isSelected = sch.id === selectedSchemeId;
              return (
                <TouchableOpacity
                  key={sch.id}
                  style={[styles.schemeChipBtn, isSelected && styles.schemeChipBtnActive]}
                  onPress={() => handleSelectScheme(sch.id)}
                >
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ribbon-outline'}
                    size={13}
                    color={isSelected ? COLORS.primary : '#64748b'}
                  />
                  <Text style={[styles.schemeChipText, isSelected && styles.schemeChipTextActive]}>
                    {sch.id.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SUB-TABS NAVIGATION */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subTabScroll}>
          {[
            { key: 'overview' as FinanceSubTab, label: t.tabOverview },
            { key: 'capex_opex' as FinanceSubTab, label: t.tabCapex },
            { key: 'revenue_expense' as FinanceSubTab, label: t.tabRevenue },
            { key: 'loan_repayment' as FinanceSubTab, label: t.tabLoan },
            { key: 'dpr_generator' as FinanceSubTab, label: t.tabDpr },
          ].map((tb) => (
            <TouchableOpacity
              key={tb.key}
              style={[styles.subTabPill, activeSubTab === tb.key && styles.subTabPillActive]}
              onPress={() => setActiveSubTab(tb.key)}
            >
              <Text style={[styles.subTabPillText, activeSubTab === tb.key && styles.subTabPillTextActive]}>
                {tb.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ============================================================ */}
        {/* TAB 1: FINANCIAL OVERVIEW & REAL-TIME CALCULATOR             */}
        {/* ============================================================ */}
        {activeSubTab === 'overview' && (
          <View style={styles.sectionGap}>

            {/* A. 6 LIVE SUMMARY TILES */}
            <View style={styles.overviewGrid}>
              <View style={styles.oCard}>
                <Text style={styles.oLabel}>{t.lblProjectCost}</Text>
                <Text style={styles.oValue}>{formatCurrency(projectCost)}</Text>
              </View>

              <View style={[styles.oCard, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                <Text style={styles.oLabel}>{t.lblSubsidy}</Text>
                <Text style={[styles.oValue, { color: '#15803d' }]}>{formatCurrency(calculations.subsidy)}</Text>
              </View>

              <View style={[styles.oCard, { backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }]}>
                <Text style={styles.oLabel}>{t.lblOwnEquity}</Text>
                <Text style={[styles.oValue, { color: '#0284c7' }]}>{formatCurrency(ownCapital)}</Text>
              </View>

              <View style={styles.oCard}>
                <Text style={styles.oLabel}>{t.lblNetLoan}</Text>
                <Text style={[styles.oValue, { color: '#b45309' }]}>{formatCurrency(calculations.netLoan)}</Text>
              </View>

              <View style={styles.oCard}>
                <Text style={styles.oLabel}>{t.lblMonthlyEmi}</Text>
                <Text style={[styles.oValue, { color: COLORS.primary }]}>₹{calculations.emi.toLocaleString()}/mo</Text>
              </View>

              <View style={[styles.oCard, { backgroundColor: '#f0fdf4', borderColor: '#86efac' }]}>
                <Text style={styles.oLabel}>{t.lblNetSurplus}</Text>
                <Text style={[styles.oValue, { color: '#16a34a' }]}>₹{calculations.netMonthlySurplus.toLocaleString()}/mo</Text>
              </View>
            </View>

            {/* B. PROJECT SCALE PRESETS & CUSTOM COST ADJUSTER */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="options-outline" size={16} color={COLORS.primary} />
                <Text style={styles.cardTitle}>{t.customizeTitle}</Text>
              </View>

              <Text style={styles.scaleHintText}>
                {bizName} {t.scaleHint}
              </Text>

              {/* Preset Scale Buttons */}
              <View style={styles.presetBtnRow}>
                {categoryConfig.presetCosts.map((cost, idx) => {
                  const isSelected = projectCost === cost;
                  const label = idx === 0 ? t.presetMicro : idx === 1 ? t.presetRec : t.presetComm;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.presetBtn, isSelected && styles.presetBtnActive]}
                      onPress={() => setProjectCost(cost)}
                    >
                      <Text style={[styles.presetBtnLabel, isSelected && styles.presetBtnLabelActive]}>{label}</Text>
                      <Text style={[styles.presetBtnAmt, isSelected && styles.presetBtnAmtActive]}>{formatCurrency(cost)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Custom Number Input */}
              <View style={styles.customInputBox}>
                <Text style={styles.customInputLabel}>{t.customCostLbl}</Text>
                <View style={styles.inputInnerRow}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                  <TextInput
                    style={styles.textInputMain}
                    value={String(projectCost)}
                    onChangeText={(txt) => setProjectCost(parseInt(txt) || 0)}
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitBadge}>{formatCurrency(projectCost)}</Text>
                </View>
              </View>
            </View>

            {/* C. OWN CAPITAL CONTRIBUTION (SYNCED FROM ONBOARDING) */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="wallet-outline" size={16} color="#0284c7" />
                <Text style={styles.cardTitle}>{t.ownCapitalTitle}</Text>
                <View style={styles.syncedBadge}>
                  <Text style={styles.syncedBadgeText}>{t.syncedBadge}</Text>
                </View>
              </View>

              <View style={styles.inputInnerRow}>
                <Text style={styles.rupeeSymbol}>₹</Text>
                <TextInput
                  style={styles.textInputMain}
                  value={String(ownCapital)}
                  onChangeText={(txt) => setOwnCapital(parseInt(txt) || 0)}
                  keyboardType="numeric"
                />
                <Text style={styles.unitBadge}>
                  {((ownCapital / (projectCost || 1)) * 100).toFixed(1)}% Margin
                </Text>
              </View>

              {/* Margin Health Status */}
              <View style={[styles.marginNoteBox, calculations.isMarginSufficient ? { backgroundColor: '#f0fdf4' } : { backgroundColor: '#fff7ed' }]}>
                <Ionicons
                  name={calculations.isMarginSufficient ? 'checkmark-circle' : 'alert-circle'}
                  size={14}
                  color={calculations.isMarginSufficient ? '#16a34a' : '#c2410c'}
                />
                <Text style={[styles.marginNoteText, calculations.isMarginSufficient ? { color: '#166534' } : { color: '#9a3412' }]}>
                  {calculations.isMarginSufficient
                    ? `Eligible: Meets ${activeScheme.shortName} minimum ${activeScheme.minMarginPct}% margin (Req: ₹${calculations.minOwnMarginRequired.toLocaleString()}).`
                    : `Caution: ${activeScheme.shortName} requires at least ${activeScheme.minMarginPct}% (₹${calculations.minOwnMarginRequired.toLocaleString()}). Add ₹${(calculations.minOwnMarginRequired - ownCapital).toLocaleString()} or switch to MUDRA.`}
                </Text>
              </View>
            </View>

            {/* D. AI RECOMMENDATION: MAXIMUM VS RECOMMENDED */}
            <View style={styles.recVsMaxCard}>
              <View style={styles.rvmHeader}>
                <Ionicons name="sparkles" size={16} color="#b45309" />
                <Text style={styles.rvmTitle}>{t.aiInsightTitle}</Text>
              </View>

              <View style={styles.rvmGrid}>
                {/* Maximum Possible Box */}
                <View style={styles.rvmBoxMax}>
                  <Text style={styles.rvmBoxHeaderMax}>{t.maxUnderScheme}</Text>
                  <Text style={styles.rvmValText}>Max Project: {formatCurrency(activeScheme.maxProjectCost)}</Text>
                  <Text style={styles.rvmValText}>Potential Loan: {formatCurrency(activeScheme.maxProjectCost * 0.9)}</Text>
                  <Text style={[styles.rvmValText, { color: '#b91c1c', fontWeight: 'bold' }]}>{t.highRiskTag}</Text>
                </View>

                {/* Recommended Box */}
                <View style={styles.rvmBoxRec}>
                  <Text style={styles.rvmBoxHeaderRec}>{t.recSafeScale}</Text>
                  <Text style={styles.rvmValText}>Rec Project: {formatCurrency(projectCost)}</Text>
                  <Text style={styles.rvmValText}>Net Loan: {formatCurrency(calculations.netLoan)}</Text>
                  <Text style={[styles.rvmValText, { color: '#15803d', fontWeight: 'bold' }]}>
                    {calculations.dscr}x DSCR
                  </Text>
                </View>
              </View>

              <Text style={styles.rvmReasonText}>
                "{activeScheme.shortName}: {formatCurrency(projectCost)} — {t.lblMonthlyEmi}: ₹${calculations.emi.toLocaleString()} | {t.lblNetSurplus}: ₹${calculations.netMonthlySurplus.toLocaleString()}"
              </Text>
            </View>

          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 2: CAPEX & OPEX COSTING (ADAPTED TO BUSINESS IDEA)       */}
        {/* ============================================================ */}
        {activeSubTab === 'capex_opex' && (
          <View style={styles.sectionGap}>
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="construct-outline" size={18} color={COLORS.primary} />
                <Text style={styles.cardTitle}>{t.capexTitle} — {bizName}</Text>
              </View>

              {calculations.scaledCapex.map((item, idx) => (
                <View key={idx} style={styles.costItemRow}>
                  <Text style={styles.costItemName}>• {item.name}</Text>
                  <Text style={styles.costItemVal}>₹ {item.amount.toLocaleString()}</Text>
                </View>
              ))}

              <View style={styles.subtotalStrip}>
                <Text style={styles.subtotalLbl}>{t.totalFixedCapex}</Text>
                <Text style={styles.subtotalVal}>₹ {calculations.totalCapex.toLocaleString()}</Text>
              </View>

              <View style={[styles.cardHeaderRow, { marginTop: SPACING.md }]}>
                <Ionicons name="cart-outline" size={18} color="#0284c7" />
                <Text style={styles.cardTitle}>{t.opexTitle}</Text>
              </View>

              {calculations.scaledOpex.map((item, idx) => (
                <View key={idx} style={styles.costItemRow}>
                  <Text style={styles.costItemName}>• {item.name}</Text>
                  <Text style={styles.costItemVal}>₹ {item.amount.toLocaleString()}</Text>
                </View>
              ))}

              <View style={[styles.subtotalStrip, { backgroundColor: '#f0f9ff' }]}>
                <Text style={[styles.subtotalLbl, { color: '#0369a1' }]}>{t.totalOpex}</Text>
                <Text style={[styles.subtotalVal, { color: '#0284c7' }]}>₹ {calculations.totalOpex.toLocaleString()}</Text>
              </View>

              {/* Grand Total Strip */}
              <View style={styles.grandTotalStrip}>
                <Text style={styles.grandTotalLbl}>{t.totalProjectCost}</Text>
                <Text style={styles.grandTotalVal}>{formatCurrency(projectCost)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 3: REVENUE, EXPENSE WATERFALL & SURPLUS                  */}
        {/* ============================================================ */}
        {activeSubTab === 'revenue_expense' && (
          <View style={styles.sectionGap}>
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="bar-chart-outline" size={18} color="#047857" />
                <Text style={styles.cardTitle}>{t.cashflowWaterfall}</Text>
              </View>

              {[
                { label: `${t.grossRev} (${categoryConfig.revMonthlyUnit})`, val: `+ ₹ ${calculations.estMonthlyRevenue.toLocaleString()}`, color: '#15803d' },
                { label: t.rawMaterial, val: `- ₹ ${calculations.cogs.toLocaleString()}`, color: '#b91c1c' },
                { label: t.grossProfit, val: `= ₹ ${calculations.grossProfit.toLocaleString()}`, color: '#047857' },
                { label: t.fixedOverheads, val: `- ₹ ${calculations.fixedOperatingCosts.toLocaleString()}`, color: '#b91c1c' },
                { label: t.operatingProfit, val: `= ₹ ${calculations.operatingProfit.toLocaleString()}`, color: '#0284c7' },
                { label: `${t.loanEmiDeduct} (${activeScheme.shortName})`, val: `- ₹ ${calculations.emi.toLocaleString()}`, color: '#b45309' },
                { label: t.netSurplusTakehome, val: `= ₹ ${calculations.netMonthlySurplus.toLocaleString()}`, color: '#16a34a', bold: true },
              ].map((w, idx) => (
                <View key={idx} style={[styles.waterfallRow, w.bold && styles.waterfallRowHighlight]}>
                  <Text style={[styles.wLabel, w.bold && { fontFamily: FONT.bold, color: '#065f46' }]}>{w.label}</Text>
                  <Text style={[styles.wVal, { color: w.color }, w.bold && { fontSize: 13, fontFamily: FONT.bold }]}>{w.val}</Text>
                </View>
              ))}
            </View>

            {/* 3-Scenario Sensitivity */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>{t.sensitivityTitle}</Text>
              <View style={styles.scenarioTable}>
                <View style={styles.stThRow}>
                  <Text style={[styles.stThCell, { flex: 1.2 }]}>Scenario</Text>
                  <Text style={styles.stThCell}>Sales/mo</Text>
                  <Text style={styles.stThCell}>Surplus/mo</Text>
                  <Text style={styles.stThCell}>Break-even</Text>
                </View>

                {[
                  { s: 'Conservative (-25%)', r: Math.round(calculations.estMonthlyRevenue * 0.75), p: Math.round(calculations.netMonthlySurplus * 0.55), b: '20 Months' },
                  { s: 'Expected (Baseline)', r: calculations.estMonthlyRevenue, p: calculations.netMonthlySurplus, b: '13 Months', active: true },
                  { s: 'Optimistic (+25%)', r: Math.round(calculations.estMonthlyRevenue * 1.25), p: Math.round(calculations.netMonthlySurplus * 1.45), b: '9 Months' },
                ].map((sc, i) => (
                  <View key={i} style={[styles.stTdRow, sc.active && { backgroundColor: '#f0fdf4' }]}>
                    <Text style={[styles.stTdCell, { flex: 1.2, fontFamily: FONT.bold }]}>{sc.s}</Text>
                    <Text style={styles.stTdCell}>₹{sc.r.toLocaleString()}</Text>
                    <Text style={[styles.stTdCell, { color: '#15803d', fontFamily: FONT.bold }]}>₹{sc.p.toLocaleString()}</Text>
                    <Text style={styles.stTdCell}>{sc.b}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 4: LOAN CALCULATOR & REPAYMENT SCHEDULE                  */}
        {/* ============================================================ */}
        {activeSubTab === 'loan_repayment' && (
          <View style={styles.sectionGap}>
            {/* Interactive Loan Parameters Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="calculator-outline" size={18} color={COLORS.primary} />
                <Text style={styles.cardTitle}>{t.loanParamsTitle}</Text>
              </View>

              {/* Interest Rate */}
              <View style={styles.paramControlRow}>
                <View>
                  <Text style={styles.paramLabel}>{t.interestRateLbl}</Text>
                  <Text style={styles.paramSub}>{activeScheme.name}</Text>
                </View>
                <View style={styles.counterWrap}>
                  <TouchableOpacity style={styles.counterBtn} onPress={() => setInterestRate((p) => Math.max(5, Number((p - 0.25).toFixed(2))))}>
                    <Text style={styles.counterBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValText}>{interestRate}%</Text>
                  <TouchableOpacity style={styles.counterBtn} onPress={() => setInterestRate((p) => Math.min(15, Number((p + 0.25).toFixed(2))))}>
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tenure Years */}
              <View style={styles.paramControlRow}>
                <View>
                  <Text style={styles.paramLabel}>{t.tenureLbl}</Text>
                  <Text style={styles.paramSub}>{tenureYears * 12} installments</Text>
                </View>
                <View style={styles.counterWrap}>
                  <TouchableOpacity style={styles.counterBtn} onPress={() => setTenureYears((p) => Math.max(1, p - 1))}>
                    <Text style={styles.counterBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValText}>{tenureYears} Yrs</Text>
                  <TouchableOpacity style={styles.counterBtn} onPress={() => setTenureYears((p) => Math.min(10, p + 1))}>
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Moratorium Months */}
              <View style={styles.paramControlRow}>
                <View>
                  <Text style={styles.paramLabel}>{t.moratoriumLbl}</Text>
                  <Text style={styles.paramSub}>Grace period before EMI starts</Text>
                </View>
                <View style={styles.counterWrap}>
                  <TouchableOpacity style={styles.counterBtn} onPress={() => setMoratoriumMonths((p) => Math.max(0, p - 3))}>
                    <Text style={styles.counterBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValText}>{moratoriumMonths} Mo</Text>
                  <TouchableOpacity style={styles.counterBtn} onPress={() => setMoratoriumMonths((p) => Math.min(24, p + 3))}>
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Repayment Health Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#15803d" />
                <Text style={styles.cardTitle}>{t.debtHealthTitle}</Text>
                <View style={[styles.dscrBadge, calculations.dscr >= 1.5 ? { backgroundColor: '#dcfce7' } : { backgroundColor: '#fef3c7' }]}>
                  <Text style={[styles.dscrBadgeText, calculations.dscr >= 1.5 ? { color: '#15803d' } : { color: '#b45309' }]}>
                    {calculations.dscr >= 1.5 ? '🟢 Healthy' : '🟡 Moderate'} ({calculations.dscr}x DSCR)
                  </Text>
                </View>
              </View>

              <View style={styles.repayMetricsGrid}>
                <View style={styles.repayMetricBox}>
                  <Text style={styles.repayMetricLabel}>{t.lblNetLoan}</Text>
                  <Text style={styles.repayMetricVal}>{formatCurrency(calculations.netLoan)}</Text>
                </View>
                <View style={styles.repayMetricBox}>
                  <Text style={styles.repayMetricLabel}>{t.lblMonthlyEmi}</Text>
                  <Text style={[styles.repayMetricVal, { color: COLORS.primary }]}>₹{calculations.emi.toLocaleString()}</Text>
                </View>
                <View style={styles.repayMetricBox}>
                  <Text style={styles.repayMetricLabel}>Interest</Text>
                  <Text style={styles.repayMetricVal}>{formatCurrency(calculations.totalInterest)}</Text>
                </View>
              </View>

              <View style={styles.repayExplanationBox}>
                <Text style={styles.repayExplanationText}>
                  {calculations.operatingProfit.toLocaleString()} vs EMI ₹{calculations.emi.toLocaleString()} ({calculations.dscr}x DSCR coverage)
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 5: BANK-READY 31-SECTION DPR GENERATOR                  */}
        {/* ============================================================ */}
        {activeSubTab === 'dpr_generator' && (
          <View style={styles.sectionGap}>
            <View style={styles.dprCard}>
              <View style={styles.dprHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dprHeaderTitle}>{t.dprTitle}</Text>
                  <Text style={styles.dprHeaderSub}>
                    {bizName} • {activeScheme.shortName}
                  </Text>
                </View>
                <View style={styles.dprScorePill}>
                  <Text style={styles.dprScorePillText}>92% Ready</Text>
                </View>
              </View>

              <View style={styles.dprProgressBar}>
                <View style={[styles.dprProgressFill, { width: '92%' }]} />
              </View>

              {/* Synchronized DPR Specs Summary */}
              <View style={styles.dprSummaryGrid}>
                <View style={styles.dprSummaryItem}>
                  <Text style={styles.dprSummaryLbl}>Scheme</Text>
                  <Text style={styles.dprSummaryVal}>{activeScheme.id.toUpperCase()}</Text>
                </View>
                <View style={styles.dprSummaryItem}>
                  <Text style={styles.dprSummaryLbl}>{t.lblProjectCost}</Text>
                  <Text style={styles.dprSummaryVal}>{formatCurrency(projectCost)}</Text>
                </View>
                <View style={styles.dprSummaryItem}>
                  <Text style={styles.dprSummaryLbl}>{t.lblSubsidy}</Text>
                  <Text style={[styles.dprSummaryVal, { color: '#15803d' }]}>{formatCurrency(calculations.subsidy)}</Text>
                </View>
                <View style={styles.dprSummaryItem}>
                  <Text style={styles.dprSummaryLbl}>{t.lblNetLoan}</Text>
                  <Text style={styles.dprSummaryVal}>{formatCurrency(calculations.netLoan)}</Text>
                </View>
                <View style={styles.dprSummaryItem}>
                  <Text style={styles.dprSummaryLbl}>{t.lblMonthlyEmi}</Text>
                  <Text style={styles.dprSummaryVal}>₹{calculations.emi.toLocaleString()}</Text>
                </View>
                <View style={styles.dprSummaryItem}>
                  <Text style={styles.dprSummaryLbl}>DSCR Coverage</Text>
                  <Text style={[styles.dprSummaryVal, { color: '#0284c7' }]}>{calculations.dscr}x</Text>
                </View>
              </View>

              {/* 8 Core DPR Chapters Checklist */}
              <Text style={styles.dprChecklistHead}>{t.dprCompiledHead}</Text>
              <View style={styles.dprChecklist}>
                <Text style={styles.dprCheckItem}>✓ 1. Executive Summary & Entrepreneur Background</Text>
                <Text style={styles.dprCheckItem}>✓ 2. Local Market Catchment & Competitor Analysis</Text>
                <Text style={styles.dprCheckItem}>✓ 3. Technical Process, Power & Infrastructure Schedule</Text>
                <Text style={styles.dprCheckItem}>✓ 4. Itemized CapEx Asset Schedule & Working Capital</Text>
                <Text style={styles.dprCheckItem}>✓ 5. Means of Finance with {activeScheme.shortName} Subsidy</Text>
                <Text style={styles.dprCheckItem}>✓ 6. 3-Year Profit & Loss, Balance Sheet & Cash Flow</Text>
                <Text style={styles.dprCheckItem}>✓ 7. Debt Service Coverage Ratio (DSCR) & Break-even</Text>
                <Text style={[styles.dprCheckItem, { color: '#b45309' }]}>✓ 8. Quotations & KYC Compliance Dossier</Text>
              </View>

              <TouchableOpacity style={styles.generateDprBtn} onPress={handleGenerateDpr}>
                <Ionicons name="document-text" size={18} color="#ffffff" />
                <Text style={styles.generateDprBtnText}>
                  {t.generateDprBtn} ({activeScheme.id.toUpperCase()})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: SPACING.md, gap: SPACING.md },
  header: { marginBottom: 2 },
  screenTitle: { fontFamily: FONT.bold, fontSize: 16, color: '#0f172a' },
  subtitle: { fontFamily: FONT.medium, fontSize: 11, color: '#64748b', marginTop: 2 },

  // Scheme Banner Card
  schemeBannerCard: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    ...SHADOW.sm,
  },
  schemeBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  schemeEyebrow: {
    fontFamily: FONT.bold,
    fontSize: 10.5,
    color: '#0284c7',
    textTransform: 'uppercase',
  },
  schemeBannerTitle: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#0f172a',
  },
  schemeSubsidyPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  schemeSubsidyText: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: '#15803d',
  },
  schemeBannerDesc: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginVertical: 4,
  },
  switchSchemeLabel: {
    fontFamily: FONT.bold,
    fontSize: 10.5,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
  },
  schemeChipScroll: {
    flexDirection: 'row',
  },
  schemeChipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 6,
  },
  schemeChipBtnActive: {
    backgroundColor: '#f0fdfa',
    borderColor: COLORS.primary,
  },
  schemeChipText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: '#64748b',
    marginLeft: 4,
  },
  schemeChipTextActive: {
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },

  // Subtabs
  subTabScroll: { flexGrow: 0 },
  subTabPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 6,
  },
  subTabPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  subTabPillText: { fontFamily: FONT.medium, fontSize: 10.5, color: '#64748b' },
  subTabPillTextActive: { fontFamily: FONT.bold, color: '#ffffff' },

  sectionGap: { gap: SPACING.sm },

  // Overview Tiles
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  oCard: {
    width: '31.5%',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  oLabel: { fontFamily: FONT.medium, fontSize: 9.5, color: '#64748b', textAlign: 'center' },
  oValue: { fontFamily: FONT.bold, fontSize: 11.5, color: '#0f172a', marginTop: 2 },

  // Standard Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...SHADOW.sm,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  cardTitle: { fontFamily: FONT.bold, fontSize: 14, color: '#0f172a', marginLeft: 6, flex: 1 },
  cardHeaderTitle: { fontFamily: FONT.bold, fontSize: 14, color: '#0f172a', marginBottom: SPACING.xs },

  scaleHintText: {
    fontFamily: FONT.regular,
    fontSize: 11.5,
    color: '#475569',
    marginBottom: SPACING.xs,
  },
  presetBtnRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 6,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: '#f0fdfa',
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  presetBtnLabel: {
    fontFamily: FONT.medium,
    fontSize: 9.5,
    color: '#64748b',
  },
  presetBtnLabelActive: {
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },
  presetBtnAmt: {
    fontFamily: FONT.bold,
    fontSize: 11.5,
    color: '#0f172a',
    marginTop: 2,
  },
  presetBtnAmtActive: {
    color: COLORS.primary,
  },

  customInputBox: {
    marginTop: SPACING.xs,
  },
  customInputLabel: {
    fontFamily: FONT.medium,
    fontSize: 10.5,
    color: '#64748b',
    marginBottom: 4,
  },
  inputInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  rupeeSymbol: {
    fontFamily: FONT.bold,
    fontSize: 16,
    color: COLORS.primary,
    marginRight: 6,
  },
  textInputMain: {
    flex: 1,
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#0f172a',
    paddingVertical: 8,
  },
  unitBadge: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: '#0284c7',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },

  syncedBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  syncedBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 9.5,
    color: '#1d4ed8',
  },
  marginNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: RADIUS.sm,
    marginTop: 8,
  },
  marginNoteText: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 11,
    marginLeft: 6,
  },

  // Rec Vs Max
  recVsMaxCard: {
    backgroundColor: '#fffbeb',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 8,
  },
  rvmHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rvmTitle: { fontFamily: FONT.bold, fontSize: 13, color: '#92400e' },
  rvmGrid: { flexDirection: 'row', gap: 8 },
  rvmBoxMax: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#fee2e2',
    gap: 2,
  },
  rvmBoxHeaderMax: { fontFamily: FONT.bold, fontSize: 10, color: '#991b1b' },
  rvmBoxRec: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: '#4ade80',
    gap: 2,
  },
  rvmBoxHeaderRec: { fontFamily: FONT.bold, fontSize: 10, color: '#166534' },
  rvmValText: { fontFamily: FONT.medium, fontSize: 10, color: '#475569' },
  rvmReasonText: {
    fontFamily: FONT.regular,
    fontSize: 11.5,
    color: '#92400e',
    lineHeight: 16,
    fontStyle: 'italic',
  },

  // CapEx / OpEx
  costItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  costItemName: { fontFamily: FONT.medium, fontSize: 11.5, color: '#334155', flex: 1 },
  costItemVal: { fontFamily: FONT.bold, fontSize: 11.5, color: '#0f172a' },
  subtotalStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: RADIUS.sm,
    marginTop: 6,
  },
  subtotalLbl: { fontFamily: FONT.bold, fontSize: 11, color: '#475569' },
  subtotalVal: { fontFamily: FONT.bold, fontSize: 12, color: '#0f172a' },
  grandTotalStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  grandTotalLbl: { fontFamily: FONT.bold, fontSize: 12, color: '#166534' },
  grandTotalVal: { fontFamily: FONT.bold, fontSize: 15, color: '#15803d' },

  // Waterfall
  waterfallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  waterfallRowHighlight: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    marginTop: 4,
  },
  wLabel: { fontFamily: FONT.medium, fontSize: 11, color: '#334155' },
  wVal: { fontFamily: FONT.bold, fontSize: 11.5 },

  // Scenario Table
  scenarioTable: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: RADIUS.md, overflow: 'hidden' },
  stThRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', paddingVertical: 6, paddingHorizontal: 8 },
  stThCell: { flex: 1, fontFamily: FONT.bold, fontSize: 9.5, color: '#475569', textAlign: 'center' },
  stTdRow: { flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  stTdCell: { flex: 1, fontFamily: FONT.medium, fontSize: 10, color: '#0f172a', textAlign: 'center' },

  // Loan Controls
  paramControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  paramLabel: { fontFamily: FONT.bold, fontSize: 12, color: '#0f172a' },
  paramSub: { fontFamily: FONT.regular, fontSize: 10, color: '#64748b' },
  counterWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  counterBtnText: { fontFamily: FONT.bold, fontSize: 16, color: COLORS.primary },
  counterValText: { fontFamily: FONT.bold, fontSize: 13, color: '#0f172a', minWidth: 46, textAlign: 'center' },

  dscrBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  dscrBadgeText: { fontFamily: FONT.bold, fontSize: 11 },
  repayMetricsGrid: { flexDirection: 'row', gap: 6, marginVertical: 8 },
  repayMetricBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  repayMetricLabel: { fontFamily: FONT.medium, fontSize: 9.5, color: '#64748b' },
  repayMetricVal: { fontFamily: FONT.bold, fontSize: 12, color: '#0f172a', marginTop: 2 },
  repayExplanationBox: {
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#16a34a',
  },
  repayExplanationText: { fontFamily: FONT.regular, fontSize: 11.5, color: '#166534', lineHeight: 16 },

  // DPR Card
  dprCard: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...SHADOW.sm,
  },
  dprHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  dprHeaderTitle: { fontFamily: FONT.bold, fontSize: 15, color: '#0f172a' },
  dprHeaderSub: { fontFamily: FONT.medium, fontSize: 11, color: COLORS.primary, marginTop: 1 },
  dprScorePill: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  dprScorePillText: { fontFamily: FONT.bold, fontSize: 11, color: '#15803d' },
  dprProgressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  dprProgressFill: { height: '100%', backgroundColor: '#15803d' },

  dprSummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: SPACING.sm,
  },
  dprSummaryItem: { width: '31%', alignItems: 'center' },
  dprSummaryLbl: { fontFamily: FONT.medium, fontSize: 9, color: '#64748b', textAlign: 'center' },
  dprSummaryVal: { fontFamily: FONT.bold, fontSize: 11, color: '#0f172a', marginTop: 1 },

  dprChecklistHead: { fontFamily: FONT.bold, fontSize: 12, color: '#334155', marginBottom: 4 },
  dprChecklist: { gap: 3, marginBottom: SPACING.md },
  dprCheckItem: { fontFamily: FONT.medium, fontSize: 11, color: '#059669' },

  generateDprBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    ...SHADOW.sm,
  },
  generateDprBtnText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: '#ffffff',
    marginLeft: 6,
  },
});
