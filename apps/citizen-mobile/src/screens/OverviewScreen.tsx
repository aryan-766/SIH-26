/**
 * GramUdyam — Business Overview Screen (Part 1: Decision Summary)
 * Production-quality, dynamic, profile-driven overview answering the 5 core questions:
 * 1. Business opportunity achhi hai ya nahi?
 * 2. Mere liye ye business kitna suitable hai?
 * 3. Local market mein demand/competition kaisa hai?
 * 4. Sabse bada opportunity kya hai?
 * 5. Mujhe ab kya karna chahiye?
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { BeneficiaryProfile } from '../services/enterpriseStore';
import { Language } from '../locales';
import { fetchDiscoveryAnalysis, DiscoveryAnalysisResult } from '../services/discoveryService';

interface Props {
  userProfile: BeneficiaryProfile;
  lang: Language;
  onNavigateToDiscovery?: () => void;
  onNavigateToFinance?: () => void;
}

const OVERVIEW_TRANSLATIONS: Record<Language, {
  loading: string;
  eyebrow: string;
  aiSummary: string;
  keyScores: string;
  oppScore: string;
  entFit: string;
  marketPot: string;
  riskLvl: string;
  whyScore: string;
  positiveFactors: string;
  reduceFactors: string;
  localMarket: string;
  primaryMarket: string;
  expansionMarket: string;
  competition: string;
  marketAccess: string;
  supplyAvailability: string;
  relevantInfra: string;
  customerGroups: string;
  demandInsight: string;
  compAround: string;
  compLevel: string;
  closestComp: string;
  inPrimaryCatchment: string;
  lowerCompZone: string;
  opportunityArea: string;
  viewCompMap: string;
  biggestOpp: string;
  recommendedAction: string;
  whyFits: string;
  capitalFit: string;
  locationFit: string;
  experienceFit: string;
  startingPosition: string;
  availableCapital: string;
  suggestedScale: string;
  planInvestment: string;
  thingsToWatch: string;
  whyMatters: string;
  whatToDo: string;
  aiView: string;
  nextSteps: string;
  exploreDiscovery: string;
  continueFinance: string;
}> = {
  hi: {
    loading: 'आपकी ऑनबोर्डिंग प्रोफ़ाइल और स्थानीय बाज़ार का विश्लेषण किया जा रहा है...',
    eyebrow: 'आपके बिज़नेस का अवलोकन (Business Overview)',
    aiSummary: 'AI सारांश (AI Executive Summary)',
    keyScores: 'मुख्य बिज़नेस स्कोर',
    oppScore: 'अवसर स्कोर',
    entFit: 'उद्यमी अनुकूलता',
    marketPot: 'बाज़ार क्षमता',
    riskLvl: 'जोखिम स्तर',
    whyScore: 'यह स्कोर क्यों मिला?',
    positiveFactors: 'सकारात्मक कारक (Why?):',
    reduceFactors: 'क्या स्कोर घटा सकता है? (Risks):',
    localMarket: 'आपका स्थानीय बाज़ार (Area at a Glance)',
    primaryMarket: 'प्राथमिक बाज़ार',
    expansionMarket: 'विस्तार बाज़ार',
    competition: 'प्रतिस्पर्धा',
    marketAccess: 'बाज़ार पहुँच',
    supplyAvailability: 'कच्चा माल / आपूर्ति',
    relevantInfra: 'प्रासंगिक बुनियादी ढाँचा:',
    customerGroups: 'संभावित ग्राहक समूह:',
    demandInsight: 'मांग अंतर्दृष्टि (Demand Insight):',
    compAround: 'आपके आस-पास की प्रतिस्पर्धा',
    compLevel: 'प्रतिस्पर्धा स्तर:',
    closestComp: 'निकटतम प्रतिस्पर्धी',
    inPrimaryCatchment: 'प्राथमिक दायरे में',
    lowerCompZone: 'कम प्रतिस्पर्धा क्षेत्र',
    opportunityArea: 'अवसर क्षेत्र',
    viewCompMap: 'प्रतिस्पर्धी नक्शा देखें (View Map) →',
    biggestOpp: 'सबसे बड़ा अवसर (Biggest Opportunity)',
    recommendedAction: 'सुझाया गया कदम:',
    whyFits: 'यह व्यवसाय आपके अनुकूल क्यों है?',
    capitalFit: 'पूँजी अनुकूलता (Capital Fit):',
    locationFit: 'स्थान अनुकूलता (Location Fit):',
    experienceFit: 'अनुभव अनुकूलता (Experience Fit):',
    startingPosition: 'आपकी शुरुआती स्थिति (Starting Position)',
    availableCapital: 'उपलब्ध पूँजी',
    suggestedScale: 'सुझाया गया शुरुआती पैमाना',
    planInvestment: 'मेरी निवेश योजना बनाएं (Plan Investment) →',
    thingsToWatch: 'ध्यान देने योग्य जोखिम (Things to Watch)',
    whyMatters: 'यह क्यों महत्वपूर्ण है: ',
    whatToDo: 'क्या करें: ',
    aiView: 'AI का निर्णय (AI Decision)',
    nextSteps: 'आपके अगले कदम (Your Next Steps)',
    exploreDiscovery: 'विस्तृत व्यापार खोज देखें (Detailed Discovery) →',
    continueFinance: 'वित्तीय योजना व DPR पर आगे बढ़ें →',
  },
  en: {
    loading: 'Analyzing your onboarding profile and local market...',
    eyebrow: 'Your Business Overview',
    aiSummary: 'AI Executive Summary',
    keyScores: 'Key Business Scores',
    oppScore: 'Opportunity Score',
    entFit: 'Entrepreneur Fit',
    marketPot: 'Market Potential',
    riskLvl: 'Risk Level',
    whyScore: 'Why this score?',
    positiveFactors: 'Positive Factors (Why?):',
    reduceFactors: 'What can reduce the score? (Risks):',
    localMarket: 'Your Local Market (Area at a Glance)',
    primaryMarket: 'Primary Market',
    expansionMarket: 'Expansion Market',
    competition: 'Competition',
    marketAccess: 'Market Access',
    supplyAvailability: 'Supply Availability',
    relevantInfra: 'Relevant Infrastructure:',
    customerGroups: 'Potential Customer Groups:',
    demandInsight: 'Demand Insight:',
    compAround: 'Competition Around You',
    compLevel: 'Competition Level:',
    closestComp: 'Closest Competitor',
    inPrimaryCatchment: 'In Primary Catchment',
    lowerCompZone: 'Lower Comp. Zone',
    opportunityArea: 'Opportunity',
    viewCompMap: 'View Competition Map →',
    biggestOpp: 'Biggest Opportunity',
    recommendedAction: 'Recommended Action:',
    whyFits: 'Why This Business Fits You',
    capitalFit: 'Capital Fit:',
    locationFit: 'Location Fit:',
    experienceFit: 'Experience Fit:',
    startingPosition: 'Your Starting Position',
    availableCapital: 'Available Capital',
    suggestedScale: 'Suggested Starting Scale',
    planInvestment: 'Plan My Investment →',
    thingsToWatch: 'Things You Should Watch',
    whyMatters: 'Why it matters: ',
    whatToDo: 'What to do: ',
    aiView: "AI's Decision",
    nextSteps: 'Your Next Steps',
    exploreDiscovery: 'Explore Detailed Business Discovery →',
    continueFinance: 'Continue to Finance & DPR →',
  },
  mr: {
    loading: 'आपल्या नोंदणी प्रोफाइल व स्थानिक बाजाराचे विश्लेषण केले जात आहे...',
    eyebrow: 'आपल्या व्यवसायाचा आढावा (Business Overview)',
    aiSummary: 'एआय सारांश (AI Executive Summary)',
    keyScores: 'मुख्य व्यवसाय गुण (Key Scores)',
    oppScore: 'संधी गुण',
    entFit: 'उद्योजक योग्यता',
    marketPot: 'बाजार क्षमता',
    riskLvl: 'जोखीम पातळी',
    whyScore: 'हे गुण का मिळाले?',
    positiveFactors: 'सकारात्मक घटक (Why?):',
    reduceFactors: 'गुण कमी करणारे धोके (Risks):',
    localMarket: 'आपली स्थानिक बाजारपेठ (Area at a Glance)',
    primaryMarket: 'प्राथमिक बाजार',
    expansionMarket: 'विस्तार बाजार',
    competition: 'स्पर्धा',
    marketAccess: 'बाजारपेठ पोहोच',
    supplyAvailability: 'कच्चा माल उपलब्धता',
    relevantInfra: 'संबंधित पायाभूत सुविधा:',
    customerGroups: 'संभाव्य ग्राहक वर्ग:',
    demandInsight: 'मागणी अंतर्दृष्टी (Demand Insight):',
    compAround: 'आपल्या परिसरातील स्पर्धा',
    compLevel: 'स्पर्धा पातळी:',
    closestComp: 'नजीकचा स्पर्धक',
    inPrimaryCatchment: 'प्राथमिक कार्यक्षेत्रात',
    lowerCompZone: 'कमी स्पर्धा क्षेत्र',
    opportunityArea: 'संधी क्षेत्र',
    viewCompMap: 'स्पर्धा नकाशा पहा →',
    biggestOpp: 'सर्वात मोठी संधी (Biggest Opportunity)',
    recommendedAction: 'सुचवलेले पाऊल:',
    whyFits: 'हा व्यवसाय आपल्यासाठी योग्य का आहे?',
    capitalFit: 'भांडवल योग्यता:',
    locationFit: 'स्थान योग्यता:',
    experienceFit: 'अनुभव योग्यता:',
    startingPosition: 'आपली सुरुवातीची स्थिती',
    availableCapital: 'उपलब्ध भांडवल',
    suggestedScale: 'सुचवलेले सुरुवातीचे प्रमाण',
    planInvestment: 'माझे गुंतवणूक नियोजन करा →',
    thingsToWatch: 'काळजी घेण्यासारख्या बाबी (Risks)',
    whyMatters: 'हे का महत्त्वाचे आहे: ',
    whatToDo: 'काय करावे: ',
    aiView: 'एआय निर्णय (AI Decision)',
    nextSteps: 'आपली पुढील पावले (Next Steps)',
    exploreDiscovery: 'तपशीलवार संधी शोधा →',
    continueFinance: 'वित्त व डीपीआर कडे पुढे जा →',
  },
  ta: {
    loading: 'உங்கள் விவரங்கள் மற்றும் உள்ளூர் சந்தை ஆய்வு செய்யப்படுகிறது...',
    eyebrow: 'உங்கள் தொழில் கண்ணோட்டம் (Business Overview)',
    aiSummary: 'AI நிர்வாகச் சுருக்கம்',
    keyScores: 'முக்கிய தொழில் மதிப்பீடுகள்',
    oppScore: 'வாய்ப்பு மதிப்பெண்',
    entFit: 'தொழில்முனைவோர் பொருத்தம்',
    marketPot: 'சந்தை திறன்',
    riskLvl: 'அபாய நிலை',
    whyScore: 'இந்த மதிப்பெண் ஏன்?',
    positiveFactors: 'சாதகமான காரணிகள்:',
    reduceFactors: 'மதிப்பெண்ணை குறைக்கும் அபாயங்கள்:',
    localMarket: 'உங்கள் உள்ளூர் சந்தை (Area at a Glance)',
    primaryMarket: 'முதன்மை சந்தை',
    expansionMarket: 'விரிவாக்க சந்தை',
    competition: 'போட்டி',
    marketAccess: 'சந்தை அணுகல்',
    supplyAvailability: 'மூலப்பொருள் கிடைப்பது',
    relevantInfra: 'தொடர்புடைய உள்கட்டமைப்பு:',
    customerGroups: 'சாத்தியமான வாடிக்கையாளர் குழுக்கள்:',
    demandInsight: 'தேவை நுண்ணறிவு (Demand Insight):',
    compAround: 'உங்களைச் சுற்றியுள்ள போட்டி',
    compLevel: 'போட்டி நிலை:',
    closestComp: 'அருகிலுள்ள போட்டியாளர்',
    inPrimaryCatchment: 'முதன்மை பகுதியில்',
    lowerCompZone: 'குறைந்த போட்டி பகுதி',
    opportunityArea: 'வாய்ப்பு பகுதி',
    viewCompMap: 'போட்டியாளர் வரைபடத்தை காண்க →',
    biggestOpp: 'மிகப்பெரிய வாய்ப்பு (Biggest Opportunity)',
    recommendedAction: 'பரிந்துரைக்கப்பட்ட நடவடிக்கை:',
    whyFits: 'இந்த தொழில் உங்களுக்கு ஏன் பொருந்துகிறது?',
    capitalFit: 'மூலதன பொருத்தம்:',
    locationFit: 'இடப் பொருத்தம்:',
    experienceFit: 'அனுபவப் பொருத்தம்:',
    startingPosition: 'உங்கள் தொடக்க நிலை',
    availableCapital: 'கிடைக்கும் மூலதனம்',
    suggestedScale: 'பரிந்துரைக்கப்பட்ட தொடக்க அளவு',
    planInvestment: 'முதலீட்டை திட்டமிடுங்கள் →',
    thingsToWatch: 'கவனிக்க வேண்டிய அபாயங்கள்',
    whyMatters: 'இது ஏன் முக்கியம்: ',
    whatToDo: 'என்ன செய்ய வேண்டும்: ',
    aiView: 'AI இன் முடிவு (AI Decision)',
    nextSteps: 'உங்கள் அடுத்த படிகள்',
    exploreDiscovery: 'விரிவான வாய்ப்புகளை காண்க →',
    continueFinance: 'நிதி மற்றும் DPR திட்டத்திற்கு செல்லவும் →',
  },
  te: {
    loading: 'మీ ఆన్‌బోర్డింగ్ ప్రొఫైల్ మరియు స్థానిక మార్కెట్ విశ్లేషించబడుతోంది...',
    eyebrow: 'మీ వ్యాపార అవలోకనం (Business Overview)',
    aiSummary: 'AI సారాంశం (AI Executive Summary)',
    keyScores: 'ప్రధాన వ్యాపార స్కోర్లు',
    oppScore: 'అవకాశ స్కోరు',
    entFit: 'వ్యవస్థాపక అనుకూలత',
    marketPot: 'మార్కెట్ సంభావ్యత',
    riskLvl: 'రిస్క్ స్థాయి',
    whyScore: 'ఈ స్కోరు ఎందుకు వచ్చింది?',
    positiveFactors: 'సానుకూల అంశాలు (Why?):',
    reduceFactors: 'స్కోరు తగ్గించే రిస్కులు:',
    localMarket: 'మీ స్థానిక మార్కెట్ (Area at a Glance)',
    primaryMarket: 'ప్రాథమిక మార్కెట్',
    expansionMarket: 'విస్తరణ మార్కెట్',
    competition: 'పోటీ',
    marketAccess: 'మార్కెట్ రవాణా',
    supplyAvailability: 'ముడిసరుకు లభ్యత',
    relevantInfra: 'సంబంధిత మౌలిక సదుపాయాలు:',
    customerGroups: 'సంభావ్య వినియోగదారుల సమూహాలు:',
    demandInsight: 'డిమాండ్ అంతర్దృష్టి (Demand Insight):',
    compAround: 'మీ చుట్టూ ఉన్న పోటీ',
    compLevel: 'పోటీ స్థాయి:',
    closestComp: 'సమీప పోటీదారు',
    inPrimaryCatchment: 'ప్రాథమిక పరిధిలో',
    lowerCompZone: 'తక్కువ పోటీ ప్రాంతం',
    opportunityArea: 'అవకాశ ప్రాంతం',
    viewCompMap: 'పోటీ మ్యాప్ చూడండి →',
    biggestOpp: 'అతిపెద్ద అవకాశం (Biggest Opportunity)',
    recommendedAction: 'సిఫార్సు చేయబడిన చర్య:',
    whyFits: 'ఈ వ్యాపారం మీకు ఎందుకు సరిపోతుంది?',
    capitalFit: 'పెట్టుబడి అనుకూలత:',
    locationFit: 'ప్రదేశ అనుకూలత:',
    experienceFit: 'అనుభవ అనుకూలత:',
    startingPosition: 'మీ ప్రారంభ స్థితి',
    availableCapital: 'అందుబాటులో ఉన్న పెట్టుబడి',
    suggestedScale: 'సిఫార్సు చేసిన ప్రారంభ స్థాయి',
    planInvestment: 'నా పెట్టుబడిని ప్లాన్ చేయండి →',
    thingsToWatch: 'మీరు గమనించవలసిన విషయాలు (Risks)',
    whyMatters: 'ఇది ఎందుకు ముఖ్యం: ',
    whatToDo: 'ఏమి చేయాలి: ',
    aiView: 'AI నిర్ణయం (AI Decision)',
    nextSteps: 'మీ తదుపరి దశలు (Next Steps)',
    exploreDiscovery: 'వివరమైన వ్యాపార అవకాశాన్ని చూడండి →',
    continueFinance: 'ఫైనాన్స్ మరియు DPR కు వెళ్లండి →',
  },
};

export const OverviewScreen: React.FC<Props> = ({
  userProfile,
  lang,
  onNavigateToDiscovery,
  onNavigateToFinance,
}) => {
  const t = OVERVIEW_TRANSLATIONS[lang] || OVERVIEW_TRANSLATIONS.hi;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DiscoveryAnalysisResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchDiscoveryAnalysis(userProfile, lang).then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [userProfile, lang]);

  if (loading || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>
          {t.loading}
        </Text>
      </View>
    );
  }

  const bizName = userProfile.selectedBizName || data.business_name;
  const village = userProfile.villageName || data.village;
  const district = userProfile.districtName || data.district;
  const state = userProfile.stateCode || data.state;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ============================================================ */}
        {/* 1. HEADER                                                    */}
        {/* ============================================================ */}
        <View style={styles.headerCard}>
          <Text style={styles.headerEyebrow}>{t.eyebrow}</Text>
          <Text style={styles.businessTitle}>{bizName}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color={COLORS.primary} />
            <Text style={styles.locationText}>
              {village}, {district}, {state}
            </Text>
          </View>
          <View style={styles.trustBadgeRow}>
            <Ionicons name="shield-checkmark" size={12} color="#0284c7" />
            <Text style={styles.trustBadgeText}>
              {data.data_trust_badge || 'Based on your onboarding profile + local market analysis'}
            </Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 2. AI EXECUTIVE SUMMARY                                      */}
        {/* ============================================================ */}
        <View style={styles.aiSummaryCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircleAI}>
              <Ionicons name="sparkles" size={16} color="#0284c7" />
            </View>
            <Text style={styles.cardTitleAI}>{t.aiSummary}</Text>
          </View>
          <Text style={styles.aiSummaryText}>
            "{data.ai_executive_summary}"
          </Text>
        </View>

        {/* ============================================================ */}
        {/* 3. KEY BUSINESS SCORES (4 Simple Cards)                       */}
        {/* ============================================================ */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>{t.keyScores}</Text>
          <View style={styles.scoreGrid}>
            {/* 1. Opportunity Score */}
            <View style={[styles.scoreCard, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
              <Text style={styles.scoreLabel}>{t.oppScore}</Text>
              <Text style={[styles.scoreNumber, { color: '#15803d' }]}>{data.opportunity_score} / 100</Text>
              <Text style={[styles.scoreSubBadge, { color: '#166534' }]}>"{data.opportunity_label}"</Text>
            </View>

            {/* 2. Entrepreneur Fit */}
            <View style={[styles.scoreCard, { backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }]}>
              <Text style={styles.scoreLabel}>{t.entFit}</Text>
              <Text style={[styles.scoreNumber, { color: '#0369a1' }]}>{data.entrepreneur_fit} / 100</Text>
              <Text style={[styles.scoreSubBadge, { color: '#075985' }]}>"{data.fit_label}"</Text>
            </View>

            {/* 3. Market Potential */}
            <View style={[styles.scoreCard, { backgroundColor: '#fefce8', borderColor: '#fef08a' }]}>
              <Text style={styles.scoreLabel}>{t.marketPot}</Text>
              <Text style={[styles.scoreNumber, { color: '#a16207' }]}>{data.market_potential}</Text>
              <Text style={[styles.scoreSubBadge, { color: '#854d0e' }]}>"{data.market_potential_label}"</Text>
            </View>

            {/* 4. Risk Level */}
            <View style={[styles.scoreCard, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}>
              <Text style={styles.scoreLabel}>{t.riskLvl}</Text>
              <Text style={[styles.scoreNumber, { color: '#c2410c' }]}>{data.risk_level}</Text>
              <Text style={[styles.scoreSubBadge, { color: '#9a3412' }]}>"{data.risk_level_label}"</Text>
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 4. WHY THIS SCORE?                                           */}
        {/* ============================================================ */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>{t.whyScore}</Text>

          <Text style={styles.factorSubheadGreen}>{t.positiveFactors}</Text>
          {data.why_positive_factors.map((item, idx) => (
            <View key={`pos-${idx}`} style={styles.bulletRow}>
              <Text style={styles.bulletPlus}>+</Text>
              <Text style={styles.bulletTextGreen}>{item.replace(/^\+\s*/, '')}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={styles.factorSubheadRed}>{t.reduceFactors}</Text>
          {data.what_can_reduce_score.map((item, idx) => (
            <View key={`neg-${idx}`} style={styles.bulletRow}>
              <Text style={styles.bulletMinus}>–</Text>
              <Text style={styles.bulletTextRed}>{item.replace(/^-\s*/, '')}</Text>
            </View>
          ))}
        </View>

        {/* ============================================================ */}
        {/* 5. YOUR AREA AT A GLANCE                                     */}
        {/* ============================================================ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="map-outline" size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>{t.localMarket}</Text>
          </View>

          <View style={styles.glanceGrid}>
            <View style={styles.glanceItem}>
              <Text style={styles.glanceLabel}>{t.primaryMarket}</Text>
              <Text style={styles.glanceValue}>{data.area_at_a_glance.primary_market}</Text>
            </View>
            <View style={styles.glanceItem}>
              <Text style={styles.glanceLabel}>{t.expansionMarket}</Text>
              <Text style={styles.glanceValue}>{data.area_at_a_glance.expansion_market}</Text>
            </View>
            <View style={styles.glanceItem}>
              <Text style={styles.glanceLabel}>{t.competition}</Text>
              <Text style={styles.glanceValue}>{data.area_at_a_glance.competition}</Text>
            </View>
            <View style={styles.glanceItem}>
              <Text style={styles.glanceLabel}>{t.marketAccess}</Text>
              <Text style={styles.glanceValue}>{data.area_at_a_glance.market_access}</Text>
            </View>
            <View style={styles.glanceItem}>
              <Text style={styles.glanceLabel}>{t.supplyAvailability}</Text>
              <Text style={styles.glanceValue}>{data.area_at_a_glance.supply_availability}</Text>
            </View>
          </View>

          <View style={styles.infraBox}>
            <Text style={styles.infraLabel}>
              <Ionicons name="business" size={13} color="#475569" /> {t.relevantInfra}
            </Text>
            <Text style={styles.infraText}>
              {data.area_at_a_glance.relevant_infrastructure || 'Not enough local data'}
            </Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 6. DEMAND SNAPSHOT (Business-Specific)                       */}
        {/* ============================================================ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="people-outline" size={18} color="#0d9488" />
            <Text style={styles.cardTitle}>{data.demand_snapshot.title}</Text>
          </View>

          <Text style={styles.subheadText}>{t.customerGroups}</Text>
          <View style={styles.chipWrap}>
            {data.demand_snapshot.potential_customer_groups.map((grp, idx) => (
              <View key={idx} style={styles.customerChip}>
                <Ionicons name="checkmark-circle" size={13} color="#0d9488" />
                <Text style={styles.customerChipText}>{grp}</Text>
              </View>
            ))}
          </View>

          <View style={styles.insightBox}>
            <Text style={styles.insightLabel}>💡 {t.demandInsight}</Text>
            <Text style={styles.insightText}>"{data.demand_snapshot.demand_insight}"</Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 7. COMPETITION SNAPSHOT                                      */}
        {/* ============================================================ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="storefront-outline" size={18} color="#b45309" />
            <Text style={styles.cardTitle}>{t.compAround}</Text>
          </View>

          <View style={styles.compLevelPill}>
            <Text style={styles.compLevelText}>
              {t.compLevel}{' '}
              <Text style={{ fontWeight: '700' }}>{data.competition_snapshot.competition_level}</Text>
            </Text>
          </View>

          <Text style={styles.compConcentrationText}>
            "{data.competition_snapshot.concentration_text}"
          </Text>

          <View style={styles.compMetricsRow}>
            <View style={styles.compMetricItem}>
              <Text style={styles.compMetricLabel}>{t.closestComp}</Text>
              <Text style={styles.compMetricValue}>{data.competition_snapshot.closest_competitor_distance_km} km</Text>
              <Text style={styles.compMetricSub} numberOfLines={1}>
                {data.competition_snapshot.closest_competitor_name}
              </Text>
            </View>

            <View style={styles.compMetricItem}>
              <Text style={styles.compMetricLabel}>{t.inPrimaryCatchment}</Text>
              <Text style={styles.compMetricValue}>{data.competition_snapshot.competitors_in_primary_catchment}</Text>
              <Text style={styles.compMetricSub}>{data.area_at_a_glance.primary_market}</Text>
            </View>

            <View style={styles.compMetricItem}>
              <Text style={styles.compMetricLabel}>{t.lowerCompZone}</Text>
              <Text style={[styles.compMetricValue, { color: '#16a34a', fontSize: 13 }]}>
                {data.competition_snapshot.lower_competition_zone}
              </Text>
              <Text style={styles.compMetricSub}>{t.opportunityArea}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionLinkBtn}
            onPress={() => onNavigateToDiscovery?.()}
          >
            <Text style={styles.actionLinkText}>{t.viewCompMap}</Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* 8. OPPORTUNITY FOUND                                         */}
        {/* ============================================================ */}
        <View style={[styles.card, { backgroundColor: '#f0fdf4', borderColor: '#86efac' }]}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="trophy-outline" size={18} color="#16a34a" />
            <Text style={[styles.cardTitle, { color: '#166534' }]}>{t.biggestOpp}</Text>
          </View>

          <Text style={styles.oppTitle}>{data.opportunity_found.biggest_opportunity_title}</Text>
          <Text style={styles.oppInsight}>"{data.opportunity_found.biggest_opportunity_insight}"</Text>

          <View style={styles.oppActionBox}>
            <Text style={styles.oppActionLabel}>🎯 {t.recommendedAction}</Text>
            <Text style={styles.oppActionText}>{data.opportunity_found.recommended_action}</Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 9. BUSINESS FIT                                              */}
        {/* ============================================================ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="person-circle-outline" size={18} color="#0284c7" />
            <Text style={styles.cardTitle}>{t.whyFits}</Text>
          </View>

          {/* Capital Fit */}
          <View style={styles.fitRow}>
            <View style={styles.fitHeaderRow}>
              <Text style={styles.fitLabel}>{t.capitalFit}</Text>
              <View style={[styles.fitBadge, { backgroundColor: data.business_fit.capital_fit.level === 'Good' ? '#dcfce7' : '#fed7aa' }]}>
                <Text style={[styles.fitBadgeText, { color: data.business_fit.capital_fit.level === 'Good' ? '#166534' : '#9a3412' }]}>
                  {data.business_fit.capital_fit.level}
                </Text>
              </View>
            </View>
            <Text style={styles.fitDesc}>"{data.business_fit.capital_fit.text}"</Text>
          </View>

          {/* Location Fit */}
          <View style={styles.fitRow}>
            <View style={styles.fitHeaderRow}>
              <Text style={styles.fitLabel}>{t.locationFit}</Text>
              <View style={[styles.fitBadge, { backgroundColor: '#e0f2fe' }]}>
                <Text style={[styles.fitBadgeText, { color: '#0369a1' }]}>
                  {data.business_fit.location_fit.level}
                </Text>
              </View>
            </View>
            <Text style={styles.fitDesc}>"{data.business_fit.location_fit.text}"</Text>
          </View>

          {/* Experience Fit */}
          <View style={styles.fitRow}>
            <View style={styles.fitHeaderRow}>
              <Text style={styles.fitLabel}>{t.experienceFit}</Text>
              <View style={[styles.fitBadge, { backgroundColor: data.business_fit.experience_fit.level === 'Good' ? '#dcfce7' : '#f1f5f9' }]}>
                <Text style={[styles.fitBadgeText, { color: data.business_fit.experience_fit.level === 'Good' ? '#166534' : '#64748b' }]}>
                  {data.business_fit.experience_fit.level}
                </Text>
              </View>
            </View>
            <Text style={styles.fitDesc}>"{data.business_fit.experience_fit.text}"</Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 10. CAPITAL & STARTING SCALE                                 */}
        {/* ============================================================ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="wallet-outline" size={18} color="#047857" />
            <Text style={styles.cardTitle}>{t.startingPosition}</Text>
          </View>

          <View style={styles.scaleGrid}>
            <View style={styles.scaleBox}>
              <Text style={styles.scaleBoxLabel}>{t.availableCapital}</Text>
              <Text style={styles.scaleCapitalNum}>{data.capital_and_scale.available_capital_formatted}</Text>
            </View>

            <View style={[styles.scaleBox, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
              <Text style={[styles.scaleBoxLabel, { color: '#065f46' }]}>{t.suggestedScale}</Text>
              <Text style={[styles.scaleModelText, { color: '#047857' }]}>{data.capital_and_scale.suggested_starting_scale}</Text>
            </View>
          </View>

          <Text style={styles.scaleRationaleText}>
            "{data.capital_and_scale.scale_explanation}"
          </Text>

          <TouchableOpacity
            style={styles.primaryCtaOutlineBtn}
            onPress={() => onNavigateToFinance?.()}
          >
            <Ionicons name="calculator-outline" size={16} color={COLORS.primary} />
            <Text style={styles.primaryCtaOutlineText}>{t.planInvestment}</Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* 11. TOP RISKS                                                */}
        {/* ============================================================ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="shield-outline" size={18} color="#dc2626" />
            <Text style={styles.cardTitle}>{t.thingsToWatch}</Text>
          </View>

          {data.top_risks.map((rk, idx) => (
            <View key={idx} style={styles.riskItemCard}>
              <Text style={styles.riskItemTitle}>{idx + 1}. {rk.title}</Text>
              <Text style={styles.riskItemWhy}>
                <Text style={{ fontWeight: '700' }}>{t.whyMatters}</Text>
                {rk.why_it_matters}
              </Text>
              <View style={styles.riskMitigationBox}>
                <Text style={styles.riskMitigationText}>
                  <Text style={{ fontWeight: '700' }}>{t.whatToDo}</Text>
                  {rk.mitigation}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ============================================================ */}
        {/* 12. AI DECISION                                              */}
        {/* ============================================================ */}
        <View style={[
          styles.decisionCard,
          data.ai_decision.badge_color === 'green'
            ? { backgroundColor: '#f0fdf4', borderColor: '#86efac' }
            : data.ai_decision.badge_color === 'yellow'
            ? { backgroundColor: '#fefce8', borderColor: '#fde047' }
            : { backgroundColor: '#fef2f2', borderColor: '#fca5a5' }
        ]}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="hardware-chip-outline" size={18} color="#0f172a" />
            <Text style={styles.decisionCardHeader}>{t.aiView}</Text>
          </View>

          <View style={styles.decisionBadgeRow}>
            <Text style={styles.decisionBadgeText}>
              {data.ai_decision.badge_color === 'green' ? '🟢' : data.ai_decision.badge_color === 'yellow' ? '🟡' : '🔴'}{' '}
              {data.ai_decision.decision}
            </Text>
          </View>

          <Text style={styles.decisionExplanation}>
            "{data.ai_decision.explanation}"
          </Text>
        </View>

        {/* ============================================================ */}
        {/* 13. NEXT STEPS                                               */}
        {/* ============================================================ */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="footsteps-outline" size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>{t.nextSteps}</Text>
          </View>

          {data.next_steps.map((st) => (
            <View key={st.step_num} style={styles.stepRow}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepCircleText}>0{st.step_num}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepHeading}>{st.title}</Text>
                <Text style={styles.stepDetail}>{st.description}</Text>
              </View>
            </View>
          ))}

          {/* DUAL CTAS */}
          <TouchableOpacity
            style={styles.mainDiscoveryCta}
            onPress={() => onNavigateToDiscovery?.()}
          >
            <Ionicons name="compass" size={18} color="#ffffff" />
            <Text style={styles.mainDiscoveryCtaText}>{t.exploreDiscovery}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryFinanceCta}
            onPress={() => onNavigateToFinance?.()}
          >
            <Ionicons name="document-text-outline" size={18} color={COLORS.primary} />
            <Text style={styles.secondaryFinanceCtaText}>{t.continueFinance}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontFamily: FONT.medium,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  scroll: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl * 2,
  },

  // 1. Header Card
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...SHADOW.sm,
  },
  headerEyebrow: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  businessTitle: {
    fontFamily: FONT.bold,
    fontSize: 20,
    color: '#0f172a',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  locationText: {
    fontFamily: FONT.medium,
    fontSize: 13,
    color: '#475569',
    marginLeft: 4,
  },
  trustBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: RADIUS.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  trustBadgeText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: '#0369a1',
    marginLeft: 4,
  },

  // 2. AI Executive Summary
  aiSummaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#bae6fd',
    ...SHADOW.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconCircleAI: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  cardTitleAI: {
    fontFamily: FONT.bold,
    fontSize: 16,
    color: '#0284c7',
  },
  aiSummaryText: {
    fontFamily: FONT.regular,
    fontSize: 13.5,
    color: '#1e293b',
    lineHeight: 21,
    fontStyle: 'italic',
  },

  // 3. Scores
  sectionContainer: {
    marginBottom: SPACING.md,
  },
  sectionHeading: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: SPACING.xs,
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  scoreCard: {
    width: '48.5%',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  scoreLabel: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
  },
  scoreNumber: {
    fontFamily: FONT.bold,
    fontSize: 20,
    marginVertical: 2,
  },
  scoreSubBadge: {
    fontFamily: FONT.medium,
    fontSize: 11,
    textAlign: 'center',
  },

  // Standard Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...SHADOW.sm,
  },
  cardTitle: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#0f172a',
    marginLeft: SPACING.xs,
  },
  cardHeaderTitle: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: SPACING.sm,
  },
  factorSubheadGreen: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: '#166534',
    marginBottom: 4,
  },
  factorSubheadRed: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: '#991b1b',
    marginTop: 6,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletPlus: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: '#16a34a',
    width: 14,
  },
  bulletMinus: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: '#dc2626',
    width: 14,
  },
  bulletTextGreen: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 12.5,
    color: '#14532d',
    lineHeight: 18,
  },
  bulletTextRed: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 12.5,
    color: '#7f1d1d',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: SPACING.xs,
  },

  // 5. Glance
  glanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  glanceItem: {
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: '47%',
    flex: 1,
  },
  glanceLabel: {
    fontFamily: FONT.medium,
    fontSize: 10.5,
    color: '#64748b',
    marginBottom: 2,
  },
  glanceValue: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: '#0f172a',
  },
  infraBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: RADIUS.sm,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  infraLabel: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: '#334155',
    marginBottom: 2,
  },
  infraText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#475569',
  },

  // 6. Demand
  subheadText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  customerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#ccfbf1',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  customerChipText: {
    fontFamily: FONT.medium,
    fontSize: 11.5,
    color: '#0f766e',
    marginLeft: 4,
  },
  insightBox: {
    backgroundColor: '#fafaf9',
    borderRadius: RADIUS.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },
  insightLabel: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: '#44403c',
    marginBottom: 2,
  },
  insightText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: '#292524',
    lineHeight: 18,
  },

  // 7. Competition
  compLevelPill: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  compLevelText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: '#92400e',
  },
  compConcentrationText: {
    fontFamily: FONT.regular,
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: SPACING.sm,
    fontStyle: 'italic',
  },
  compMetricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  compMetricItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  compMetricLabel: {
    fontFamily: FONT.medium,
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  compMetricValue: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#0f172a',
    marginVertical: 2,
  },
  compMetricSub: {
    fontFamily: FONT.regular,
    fontSize: 9.5,
    color: '#64748b',
    textAlign: 'center',
  },
  actionLinkBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  actionLinkText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: COLORS.primary,
  },

  // 8. Opportunity Found
  oppTitle: {
    fontFamily: FONT.bold,
    fontSize: 16,
    color: '#15803d',
    marginBottom: 4,
  },
  oppInsight: {
    fontFamily: FONT.regular,
    fontSize: 13,
    color: '#166534',
    lineHeight: 19,
    marginBottom: SPACING.sm,
  },
  oppActionBox: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.sm,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#16a34a',
  },
  oppActionLabel: {
    fontFamily: FONT.bold,
    fontSize: 11.5,
    color: '#15803d',
    marginBottom: 2,
  },
  oppActionText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
  },

  // 9. Business Fit
  fitRow: {
    marginBottom: SPACING.sm,
  },
  fitHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  fitLabel: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: '#334155',
  },
  fitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  fitBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 11,
  },
  fitDesc: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },

  // 10. Capital & Scale
  scaleGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  scaleBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  scaleBoxLabel: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: '#64748b',
    marginBottom: 2,
  },
  scaleCapitalNum: {
    fontFamily: FONT.bold,
    fontSize: 18,
    color: '#0f172a',
  },
  scaleModelText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    lineHeight: 18,
  },
  scaleRationaleText: {
    fontFamily: FONT.regular,
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: SPACING.sm,
    fontStyle: 'italic',
  },
  primaryCtaOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    backgroundColor: '#f0fdfa',
  },
  primaryCtaOutlineText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: COLORS.primary,
    marginLeft: 6,
  },

  // 11. Risks
  riskItemCard: {
    backgroundColor: '#fef2f2',
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#dc2626',
  },
  riskItemTitle: {
    fontFamily: FONT.bold,
    fontSize: 13.5,
    color: '#991b1b',
    marginBottom: 3,
  },
  riskItemWhy: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#7f1d1d',
    lineHeight: 17,
    marginBottom: 4,
  },
  riskMitigationBox: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.sm,
    padding: 6,
  },
  riskMitigationText: {
    fontFamily: FONT.medium,
    fontSize: 11.5,
    color: '#166534',
    lineHeight: 16,
  },

  // 12. AI Decision
  decisionCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    ...SHADOW.sm,
  },
  decisionCardHeader: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#0f172a',
    marginLeft: 6,
  },
  decisionBadgeRow: {
    marginVertical: 4,
  },
  decisionBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 18,
    color: '#0f172a',
  },
  decisionExplanation: {
    fontFamily: FONT.medium,
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    marginTop: 4,
  },

  // 13. Next Steps
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  stepCircleText: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: COLORS.primary,
  },
  stepContent: {
    flex: 1,
  },
  stepHeading: {
    fontFamily: FONT.bold,
    fontSize: 13.5,
    color: '#0f172a',
  },
  stepDetail: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  },
  mainDiscoveryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    marginTop: SPACING.sm,
    ...SHADOW.sm,
  },
  mainDiscoveryCtaText: {
    fontFamily: FONT.bold,
    fontSize: 13.5,
    color: '#ffffff',
    marginLeft: 6,
  },
  secondaryFinanceCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    marginTop: 8,
    backgroundColor: '#ffffff',
  },
  secondaryFinanceCtaText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: COLORS.primary,
    marginLeft: 6,
  },
});
