/**
 * GramUdyam — Hyper-Local Business Discovery & Map Intelligence Screen
 * Production-quality, dynamic, evidence-backed market analysis.
 * Part 2: Hyper-Local Business Discovery
 * Part 3: GIS / Map Intelligence
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
  onNavigateToFinance?: () => void;
}

type SubTab = 'gis_radar' | 'market_gap' | 'ecosystem_pricing' | 'swot_strategy';

const DISCOVERY_TRANSLATIONS: Record<Language, {
  loading: string;
  screenTitle: string;
  screenSubtitlePrefix: string;
  catchment: string;
  tabGis: string;
  tabGap: string;
  tabEco: string;
  tabSwot: string;
  radarMapTitle: string;
  interactiveLayers: string;
  directionalGapTitle: string;
  nearbyCompTitle: string;
  strengthLabel: string;
  weaknessLabel: string;
  diffOppLabel: string;
  whyWorkHere: string;
  marketGapForBiz: string;
  whatMeansForBiz: string;
  customerEcoTitle: string;
  potentialCustomers: string;
  potentialSuppliers: string;
  distChannels: string;
  pricingTitle: string;
  observedRange: string;
  suggestedRange: string;
  swotTitle: string;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
  recStrategyTitle: string;
  bestArea: string;
  targetCust: string;
  startingScale: string;
  keyDiff: string;
  biggestRisk: string;
  firstAction: string;
  dataTrustTitle: string;
  proceedFinanceBtn: string;
}> = {
  hi: {
    loading: 'स्थानीय भू-स्थानिक डेटा एवं बाज़ार विश्लेषण लोड हो रहा है...',
    screenTitle: 'हाइपर-लोकल व्यापार खोज (Business Discovery)',
    screenSubtitlePrefix: 'के लिए स्थानीय बाज़ार का विस्तृत विश्लेषण',
    catchment: 'दायरा',
    tabGis: 'GIS रडार व नक्शा',
    tabGap: 'अवसर व बाज़ार गैप',
    tabEco: 'ग्राहक व दरें',
    tabSwot: 'रणनीति व SWOT',
    radarMapTitle: 'स्थानीय नक्शा बुद्धिमत्ता (GIS Map)',
    interactiveLayers: 'नक्शा लेयर्स (चालू/बंद करने हेतु स्पर्श करें):',
    directionalGapTitle: 'दिशात्मक बाज़ार गैप (Market Gap)',
    nearbyCompTitle: 'निकटतम प्रतिस्पर्धी विश्लेषण',
    strengthLabel: 'मजबूती:',
    weaknessLabel: 'कमजोरी:',
    diffOppLabel: 'आपके अलग दिखने का अवसर:',
    whyWorkHere: 'यह बिज़नेस यहाँ क्यों चल सकता है?',
    marketGapForBiz: 'आपके बिज़नेस के लिए मार्केट में क्या गैप है?',
    whatMeansForBiz: 'आपके बिज़नेस के लिए इसका अर्थ:',
    customerEcoTitle: 'ग्राहक व आपूर्तिकर्ता इकोसिस्टम',
    potentialCustomers: 'संभावित ग्राहक:',
    potentialSuppliers: 'संभावित आपूर्तिकर्ता:',
    distChannels: 'वितरण के रास्ते:',
    pricingTitle: 'स्थानीय मूल्य निर्धारण (Pricing Intelligence)',
    observedRange: 'अनुमानित स्थानीय दर',
    suggestedRange: 'सुझाई गई शुरुआती दर',
    swotTitle: 'व्यवसाय-विशिष्ट SWOT विश्लेषण',
    strengths: 'मजबूतियाँ (Strengths)',
    weaknesses: 'कमजोरियाँ (Weaknesses)',
    opportunities: 'अवसर (Opportunities)',
    threats: 'चुनौतियाँ (Threats)',
    recStrategyTitle: 'सुझाई गई व्यापार रणनीति (Business Strategy)',
    bestArea: 'सर्वश्रेष्ठ क्षेत्र:',
    targetCust: 'लक्षित ग्राहक:',
    startingScale: 'शुरुआती पैमाना:',
    keyDiff: 'मुख्य विशेषता:',
    biggestRisk: 'सबसे बड़ा जोखिम:',
    firstAction: 'पहला कदम:',
    dataTrustTitle: 'डेटा विश्वसनीयता एवं स्रोत (Data Trust)',
    proceedFinanceBtn: 'इस डेटा के साथ वित्तीय योजना (Finance & DPR) पर बढ़ें →',
  },
  en: {
    loading: 'Fetching hyper-local spatial intelligence and market data...',
    screenTitle: 'Hyper-Local Business Discovery',
    screenSubtitlePrefix: 'Detailed local market intelligence for',
    catchment: 'Catchment',
    tabGis: 'GIS Radar & Map',
    tabGap: 'Opportunity & Gaps',
    tabEco: 'Customers & Pricing',
    tabSwot: 'Strategy & SWOT',
    radarMapTitle: 'Local Map Intelligence',
    interactiveLayers: 'Interactive Map Layers (Tap to toggle):',
    directionalGapTitle: 'Directional Market Gap',
    nearbyCompTitle: 'Nearby Business Comparison',
    strengthLabel: 'Strength:',
    weaknessLabel: 'Weakness:',
    diffOppLabel: 'Your Differentiation Opportunity:',
    whyWorkHere: 'Why This Business Can Work Here',
    marketGapForBiz: 'What is the Market Gap for Your Business?',
    whatMeansForBiz: 'What this means for your business:',
    customerEcoTitle: 'Customer & Supplier Ecosystem',
    potentialCustomers: 'Potential Customers:',
    potentialSuppliers: 'Potential Suppliers:',
    distChannels: 'Distribution Channels:',
    pricingTitle: 'Local Pricing Intelligence',
    observedRange: 'Observed Local Range',
    suggestedRange: 'Suggested Positioning',
    swotTitle: 'Business-Specific SWOT',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    opportunities: 'Opportunities',
    threats: 'Threats',
    recStrategyTitle: 'Recommended Business Strategy',
    bestArea: 'Best Area:',
    targetCust: 'Target Customer:',
    startingScale: 'Starting Scale:',
    keyDiff: 'Key Differentiator:',
    biggestRisk: 'Biggest Risk:',
    firstAction: 'First Action:',
    dataTrustTitle: 'Data Trust & Provenance',
    proceedFinanceBtn: 'Proceed to Finance & DPR with this Data →',
  },
  mr: {
    loading: 'स्थानिक नकाशा व बाजारपेठ विश्लेषणाची माहिती लोड होत आहे...',
    screenTitle: 'हायपर-लोकल व्यवसाय शोध (Business Discovery)',
    screenSubtitlePrefix: 'साठी स्थानिक बाजारपेठेचे तपशीलवार विश्लेषण',
    catchment: 'परिसर',
    tabGis: 'GIS रडार व नकाशा',
    tabGap: 'संधी व बाजार अंतर',
    tabEco: 'ग्राहक व दर',
    tabSwot: 'रणनीती व SWOT',
    radarMapTitle: 'स्थानिक नकाशा विश्लेषण (GIS Map)',
    interactiveLayers: 'नकाशा लेयर्स (सुरू/बंद करण्यासाठी टॅप करा):',
    directionalGapTitle: 'दिशात्मक बाजार अंतर (Market Gap)',
    nearbyCompTitle: 'नजीकच्या स्पर्धा विश्लेषण',
    strengthLabel: 'सामर्थ्य:',
    weaknessLabel: 'उणीव:',
    diffOppLabel: 'आपल्या वेगळेपणाची संधी:',
    whyWorkHere: 'हा व्यवसाय येथे का यशस्वी होऊ शकतो?',
    marketGapForBiz: 'आपल्या व्यवसायासाठी बाजारात काय तूट आहे?',
    whatMeansForBiz: 'आपल्या व्यवसायासाठी याचा अर्थ:',
    customerEcoTitle: 'ग्राहक व पुरवठादार परिसंस्था',
    potentialCustomers: 'संभाव्य ग्राहक:',
    potentialSuppliers: 'संभाव्य पुरवठादार:',
    distChannels: 'वितरण मार्ग:',
    pricingTitle: 'स्थानिक किंमत विश्लेषण (Pricing)',
    observedRange: 'अंदाजे स्थानिक दर',
    suggestedRange: 'सुचवलेले सुरुवातीचे दर',
    swotTitle: 'व्यवसाय-विशिष्ट SWOT विश्लेषण',
    strengths: 'सामर्थ्ये (Strengths)',
    weaknesses: 'उणिवा (Weaknesses)',
    opportunities: 'संधी (Opportunities)',
    threats: 'धोके (Threats)',
    recStrategyTitle: 'सुचवलेली व्यवसाय रणनीती (Business Strategy)',
    bestArea: 'सर्वोत्तम क्षेत्र:',
    targetCust: 'लक्ष्यित ग्राहक:',
    startingScale: 'सुरुवातीचे प्रमाण:',
    keyDiff: 'मुख्य वैशिष्ट्य:',
    biggestRisk: 'सर्वात मोठा धोका:',
    firstAction: 'पहिले पाऊल:',
    dataTrustTitle: 'डेटा विश्वासार्हता व स्रोत',
    proceedFinanceBtn: 'या माहितीसह वित्त व डीपीआर कडे पुढे जा →',
  },
  ta: {
    loading: 'உள்ளூர் வரைபட தகவல் மற்றும் சந்தை ஆய்வு ஏற்றப்படுகிறது...',
    screenTitle: 'ஹைப்பர்-லோக்கல் தொழில் கண்டுபிடிப்பு',
    screenSubtitlePrefix: 'தொழிலுக்கான உள்ளூர் சந்தை பகுப்பாய்வு',
    catchment: 'பகுதி',
    tabGis: 'GIS வரைபடம்',
    tabGap: 'வாய்ப்புகள் & இடைவெளி',
    tabEco: 'வாடிக்கையாளர் & விலை',
    tabSwot: 'வியூகம் & SWOT',
    radarMapTitle: 'உள்ளூர் வரைபட நுண்ணறிவு',
    interactiveLayers: 'வரைபட அடுக்குகள் (இயக்க/முடக்க தட்டவும்):',
    directionalGapTitle: 'திசைசார் சந்தை இடைவெளி',
    nearbyCompTitle: 'அருகிலுள்ள தொழில் ஒப்பீடு',
    strengthLabel: 'பலம்:',
    weaknessLabel: 'பலவீனம்:',
    diffOppLabel: 'உங்கள் தனித்துவ வாய்ப்பு:',
    whyWorkHere: 'இந்த தொழில் இங்கு ஏன் வெற்றி பெறும்?',
    marketGapForBiz: 'உங்கள் தொழிலுக்கான சந்தை இடைவெளி என்ன?',
    whatMeansForBiz: 'உங்கள் தொழிலுக்கு இதன் பொருள்:',
    customerEcoTitle: 'வாடிக்கையாளர் & சப்ளையர் அமைப்பு',
    potentialCustomers: 'சாத்தியமான வாடிக்கையாளர்கள்:',
    potentialSuppliers: 'சாத்தியமான சப்ளையர்கள்:',
    distChannels: 'விநியோக வழிகள்:',
    pricingTitle: 'உள்ளூர் விலை நிர்ணயம்',
    observedRange: 'கவனிக்கப்பட்ட உள்ளூர் விலை',
    suggestedRange: 'பரிந்துரைக்கப்பட்ட விலை',
    swotTitle: 'தொழில் சார்ந்த SWOT பகுப்பாய்வு',
    strengths: 'பலங்கள் (Strengths)',
    weaknesses: 'பலவீனங்கள் (Weaknesses)',
    opportunities: 'வாய்ப்புகள் (Opportunities)',
    threats: 'அச்சுறுத்தல்கள் (Threats)',
    recStrategyTitle: 'பரிந்துரைக்கப்பட்ட தொழில் உத்தி',
    bestArea: 'சிறந்த பகுதி:',
    targetCust: 'இலக்கு வாடிக்கையாளர்:',
    startingScale: 'தொடக்க அளவு:',
    keyDiff: 'முக்கிய தனித்துவம்:',
    biggestRisk: 'மிகப்பெரிய ஆபத்து:',
    firstAction: 'முதல் நடவடிக்கை:',
    dataTrustTitle: 'தரவு நம்பகத்தன்மை',
    proceedFinanceBtn: 'இந்த தரவுகளுடன் நிதி மற்றும் DPR திட்டத்திற்கு செல்லவும் →',
  },
  te: {
    loading: 'స్థానిక మ్యాప్ సమాచారం మరియు మార్కెట్ విశ్లేషణ లోడ్ అవుతోంది...',
    screenTitle: 'హైపర్-లోకల్ వ్యాపార ఆవిష్కరణ (Discovery)',
    screenSubtitlePrefix: 'వ్యాపారానికి స్థానిక మార్కెట్ విశ్లేషణ',
    catchment: 'పరిధి',
    tabGis: 'GIS రాడార్ & మ్యాప్',
    tabGap: 'అవకాశాలు & మార్కెట్ గ్యాప్',
    tabEco: 'వినియోగదారులు & ధరలు',
    tabSwot: 'వ్యూహం & SWOT',
    radarMapTitle: 'స్థానిక మ్యాప్ సమాచారం (GIS Map)',
    interactiveLayers: 'మ్యాప్ లేయర్‌లు (ఆన్/ఆఫ్ చేయడానికి తాకండి):',
    directionalGapTitle: 'దిశాత్మక మార్కెట్ గ్యాప్ (Market Gap)',
    nearbyCompTitle: 'సమీప వ్యాపార పోలిక',
    strengthLabel: 'బలం:',
    weaknessLabel: 'బలహీనత:',
    diffOppLabel: 'మీ ప్రత్యేక గుర్తింపు అవకాశం:',
    whyWorkHere: 'ఈ వ్యాపారం ఇక్కడ ఎందుకు విజయవంతం అవుతుంది?',
    marketGapForBiz: 'మీ వ్యాపారానికి మార్కెట్ గ్యాప్ ఏమిటి?',
    whatMeansForBiz: 'మీ వ్యాపారానికి దీని అర్థం:',
    customerEcoTitle: 'వినియోగదారుల & సరఫరాదారుల పర్యావరణ వ్యవస్థ',
    potentialCustomers: 'సంభావ్య వినియోగదారులు:',
    potentialSuppliers: 'సంభావ్య సరఫరాదారులు:',
    distChannels: 'పంపిణీ మార్గాలు:',
    pricingTitle: 'స్థానిక ధరల విశ్లేషణ (Pricing)',
    observedRange: 'స్థానిక ధరల పరిధి',
    suggestedRange: 'సిఫార్సు చేసిన ప్రారంభ ధర',
    swotTitle: 'వ్యాపార-నిర్దిష్ట SWOT విశ్లేషణ',
    strengths: 'బలాలు (Strengths)',
    weaknesses: 'బలహీనతలు (Weaknesses)',
    opportunities: 'అవకాశాలు (Opportunities)',
    threats: 'సవాళ్లు (Threats)',
    recStrategyTitle: 'సిఫార్సు చేయబడిన వ్యాపార వ్యూహం',
    bestArea: 'ఉత్తమ ప్రాంతం:',
    targetCust: 'లక్ష్యిత వినియోగదారుడు:',
    startingScale: 'ప్రారంభ స్థాయి:',
    keyDiff: 'ప్రధాన ప్రత్యేకత:',
    biggestRisk: 'అతిపెద్ద ప్రమాదం:',
    firstAction: 'మొదటి అడుగు:',
    dataTrustTitle: 'డేటా విశ్వసనీయత & మూలాలు',
    proceedFinanceBtn: 'ఈ డేటాతో ఫైనాన్స్ మరియు DPR కు వెళ్లండి →',
  },
};

export const DiscoveryScreen: React.FC<Props> = ({ userProfile, lang, onNavigateToFinance }) => {
  const t = DISCOVERY_TRANSLATIONS[lang] || DISCOVERY_TRANSLATIONS.hi;
  const [activeTab, setActiveTab] = useState<SubTab>('gis_radar');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DiscoveryAnalysisResult | null>(null);

  // Dynamic Layer Toggles
  const [activeLayerIds, setActiveLayerIds] = useState<Record<string, boolean>>({
    catchment_primary: true,
    catchment_expansion: true,
  });

  const toggleLayer = (id: string) => {
    setActiveLayerIds((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchDiscoveryAnalysis(userProfile, lang).then((res) => {
      if (isMounted) {
        setData(res);
        // Initialize dynamic layers
        const initialLayers: Record<string, boolean> = {
          catchment_primary: true,
          catchment_expansion: false,
        };
        res.gis_intelligence.layers.forEach((l) => {
          initialLayers[l.id] = l.active;
        });
        setActiveLayerIds(initialLayers);
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
        <Text style={styles.loadingText}>{t.loading}</Text>
      </View>
    );
  }

  const village = userProfile.villageName || data.village;
  const district = userProfile.districtName || data.district;
  const bizName = userProfile.selectedBizName || data.business_name;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ============================================================ */}
        {/* HEADER                                                       */}
        {/* ============================================================ */}
        <View style={styles.headerCard}>
          <Text style={styles.screenTitle}>{t.screenTitle}</Text>
          <Text style={styles.screenSubtitle}>
            "{lang === 'en' ? `${t.screenSubtitlePrefix} ${bizName}` : `${bizName} ${t.screenSubtitlePrefix}`}"
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.badgeItem}>
              <Ionicons name="location-outline" size={12} color="#0369a1" />
              <Text style={styles.badgeText}>{village}, {district}</Text>
            </View>
            <View style={[styles.badgeItem, { backgroundColor: '#f0fdf4' }]}>
              <Ionicons name="compass-outline" size={12} color="#15803d" />
              <Text style={[styles.badgeText, { color: '#15803d' }]}>
                {data.gis_intelligence.primary_radius} {t.catchment}
              </Text>
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* SUB-TABS NAVIGATION                                          */}
        {/* ============================================================ */}
        <View style={styles.subTabRow}>
          {[
            { key: 'gis_radar' as SubTab, label: t.tabGis, icon: 'map' },
            { key: 'market_gap' as SubTab, label: t.tabGap, icon: 'sparkles' },
            { key: 'ecosystem_pricing' as SubTab, label: t.tabEco, icon: 'pricetag' },
            { key: 'swot_strategy' as SubTab, label: t.tabSwot, icon: 'shield-checkmark' },
          ].map((tb) => (
            <TouchableOpacity
              key={tb.key}
              style={[styles.subTabBtn, activeTab === tb.key && styles.subTabBtnActive]}
              onPress={() => setActiveTab(tb.key)}
            >
              <Ionicons
                name={tb.icon as any}
                size={14}
                color={activeTab === tb.key ? COLORS.primary : '#64748b'}
              />
              <Text style={[styles.subTabText, activeTab === tb.key && styles.subTabTextActive]}>
                {tb.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ============================================================ */}
        {/* TAB 1: GIS / MAP INTELLIGENCE                                */}
        {/* ============================================================ */}
        {activeTab === 'gis_radar' && (
          <View>
            {/* GIS RADAR CANVAS */}
            <View style={styles.radarCard}>
              <View style={styles.radarHeader}>
                <View style={styles.rowAlign}>
                  <Ionicons name="navigate-circle" size={18} color={COLORS.primary} />
                  <Text style={styles.radarTitle}>{t.radarMapTitle}</Text>
                </View>
                <View style={styles.gpsBadge}>
                  <Text style={styles.gpsBadgeText}>
                    GPS: {data.gis_intelligence.center_lat.toFixed(4)}, {data.gis_intelligence.center_lng.toFixed(4)}
                  </Text>
                </View>
              </View>

              {/* Simulated Visual Radar Map Canvas */}
              <View style={styles.mapCanvas}>
                {/* Proposed Business Location Node (Center) */}
                <View style={styles.centerNode}>
                  <Ionicons name="location" size={26} color="#dc2626" />
                  <Text style={styles.centerNodeLabel}>{village}</Text>
                </View>

                {/* Primary Catchment Circle */}
                {activeLayerIds.catchment_primary && (
                  <View style={styles.primaryCircle}>
                    <Text style={styles.catchmentLabel}>{data.gis_intelligence.primary_radius}</Text>
                  </View>
                )}

                {/* Expansion Catchment Circle */}
                {activeLayerIds.catchment_expansion && (
                  <View style={styles.expansionCircle}>
                    <Text style={styles.catchmentLabelExpansion}>{data.gis_intelligence.expansion_radius}</Text>
                  </View>
                )}

                {/* Plotted Competitor POIs */}
                {data.nearby_competitors.map((comp, idx) => {
                  const isTop = comp.direction.includes('North');
                  const isBottom = comp.direction.includes('South');
                  const isRight = comp.direction.includes('East');
                  const isLeft = comp.direction.includes('West');

                  return (
                    <View
                      key={idx}
                      style={[
                        styles.poiMarker,
                        isTop ? { top: 22 + idx * 10 } : isBottom ? { bottom: 25 + idx * 10 } : { top: 80 },
                        isRight ? { right: 28 + idx * 14 } : isLeft ? { left: 24 + idx * 14 } : { left: 100 },
                      ]}
                    >
                      <Ionicons name="storefront" size={13} color="#991b1b" />
                      <Text style={styles.poiMarkerText} numberOfLines={1}>
                        {comp.name.split(' ')[0]} ({comp.distance_km}km)
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Dynamic Business-Specific Layer Toggles */}
              <Text style={styles.layerSectionTitle}>{t.interactiveLayers}</Text>
              <View style={styles.layerChipsWrap}>
                {data.gis_intelligence.layers.map((layer) => {
                  const isActive = activeLayerIds[layer.id] ?? layer.active;
                  return (
                    <TouchableOpacity
                      key={layer.id}
                      style={[styles.layerChip, isActive && styles.layerChipActive]}
                      onPress={() => toggleLayer(layer.id)}
                    >
                      <Ionicons
                        name={isActive ? 'eye' : 'eye-off'}
                        size={12}
                        color={isActive ? COLORS.primary : '#94a3b8'}
                      />
                      <Text style={[styles.layerChipText, isActive && styles.layerChipTextActive]}>
                        {layer.name} ({layer.count})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 5. DIRECTIONAL MARKET GAP MAP */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="compass" size={18} color="#0d9488" />
                <Text style={styles.cardTitle}>{t.directionalGapTitle}</Text>
              </View>

              <View style={styles.directionPillRow}>
                <View style={[styles.directionBadge, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                  <Text style={[styles.directionBadgeText, { color: '#15803d' }]}>
                    {data.market_gap_direction.opportunity_badge}
                  </Text>
                </View>
                <View style={[styles.directionBadge, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                  <Text style={[styles.directionBadgeText, { color: '#991b1b' }]}>
                    {data.market_gap_direction.crowded_direction}
                  </Text>
                </View>
              </View>

              <Text style={styles.directionExplanation}>
                "{data.market_gap_direction.why_explanation}"
              </Text>
            </View>

            {/* 6. NEARBY BUSINESS COMPARISON */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="git-compare-outline" size={18} color="#0284c7" />
                <Text style={styles.cardTitle}>{t.nearbyCompTitle}</Text>
              </View>

              {data.nearby_competitors.map((comp, idx) => (
                <View key={idx} style={styles.competitorCard}>
                  <View style={styles.compCardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.compName}>{comp.name}</Text>
                      <Text style={styles.compMeta}>
                        📍 {comp.distance_km} km ({comp.direction}) • {comp.business_type}
                      </Text>
                    </View>
                    <View style={styles.priceBadge}>
                      <Text style={styles.priceBadgeText}>{comp.price_range}</Text>
                    </View>
                  </View>

                  <View style={styles.compDetailGrid}>
                    <View style={styles.compDetailItem}>
                      <Text style={styles.compDetailLabel}>✅ {t.strengthLabel}</Text>
                      <Text style={styles.compDetailVal}>{comp.strength}</Text>
                    </View>
                    <View style={styles.compDetailItem}>
                      <Text style={styles.compDetailLabel}>⚠️ {t.weaknessLabel}</Text>
                      <Text style={styles.compDetailVal}>{comp.weakness || 'N/A'}</Text>
                    </View>
                  </View>

                  <View style={styles.diffBox}>
                    <Text style={styles.diffLabel}>🎯 {t.diffOppLabel}</Text>
                    <Text style={styles.diffVal}>"{comp.differentiation}"</Text>
                  </View>

                  <Text style={styles.sourceTagSmall}>🏷️ {comp.data_source}</Text>
                </View>
              ))}
            </View>

            {/* 7. COMPETITIVE POSITIONING */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="medal-outline" size={18} color="#d97706" />
                <Text style={styles.cardTitle}>{data.competitive_positioning.title}</Text>
              </View>

              {data.competitive_positioning.differentiators.map((diff, idx) => (
                <View key={idx} style={styles.diffItemRow}>
                  <View style={styles.diffCheckCircle}>
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                  </View>
                  <Text style={styles.diffItemText}>{diff}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 2: OPPORTUNITY & GAPS                                    */}
        {/* ============================================================ */}
        {activeTab === 'market_gap' && (
          <View>
            {/* 1. WHY THIS BUSINESS CAN WORK HERE */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="trending-up-outline" size={18} color="#16a34a" />
                <Text style={styles.cardTitle}>{t.whyWorkHere}</Text>
              </View>

              {data.business_opportunity_factors.map((fact, idx) => (
                <View key={idx} style={styles.factorCard}>
                  <View style={styles.factorHeaderRow}>
                    <Text style={styles.factorName}>{fact.factor}</Text>
                    <Text style={styles.factorFinding}>{fact.finding}</Text>
                  </View>
                  <Text style={styles.factorMeaning}>💡 <Text style={{ fontWeight: '700' }}>Detail:</Text> {fact.meaning}</Text>
                </View>
              ))}
            </View>

            {/* 2. BUSINESS-SPECIFIC MARKET GAP */}
            <View style={[styles.card, { backgroundColor: '#fffbebf0', borderColor: '#fde047' }]}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="sparkles" size={18} color="#b45309" />
                <Text style={[styles.cardTitle, { color: '#92400e' }]}>{t.marketGapForBiz}</Text>
              </View>

              <View style={styles.gapCategoryBadge}>
                <Text style={styles.gapCategoryText}>{data.business_market_gap.gap_category}</Text>
              </View>
              <Text style={styles.gapTitleText}>{data.business_market_gap.gap_title}</Text>
              <Text style={styles.gapDescText}>"{data.business_market_gap.potential_gap_description}"</Text>

              <View style={styles.gapActionBox}>
                <Text style={styles.gapActionLabel}>💡 {t.whatMeansForBiz}</Text>
                <Text style={styles.gapActionText}>{data.business_market_gap.actionable_meaning}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 3: CUSTOMERS, SUPPLIERS & PRICING                        */}
        {/* ============================================================ */}
        {activeTab === 'ecosystem_pricing' && (
          <View>
            {/* 3. CUSTOMER / SUPPLIER ANALYSIS */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="people-outline" size={18} color="#0284c7" />
                <Text style={styles.cardTitle}>{t.customerEcoTitle}</Text>
              </View>

              <Text style={styles.ecoSubheading}>👥 {t.potentialCustomers}</Text>
              <View style={styles.chipWrap}>
                {data.ecosystem_analysis.potential_customers.map((c, idx) => (
                  <View key={idx} style={styles.ecoChip}>
                    <Text style={styles.ecoChipText}>• {c}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.ecoSubheading, { marginTop: SPACING.sm }]}>📦 {t.potentialSuppliers}</Text>
              <View style={styles.chipWrap}>
                {data.ecosystem_analysis.potential_suppliers.map((s, idx) => (
                  <View key={idx} style={[styles.ecoChip, { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' }]}>
                    <Text style={[styles.ecoChipText, { color: '#334155' }]}>• {s}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.ecoSubheading, { marginTop: SPACING.sm }]}>🚚 {t.distChannels}</Text>
              <View style={styles.chipWrap}>
                {data.ecosystem_analysis.distribution_channels.map((d, idx) => (
                  <View key={idx} style={[styles.ecoChip, { backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }]}>
                    <Text style={[styles.ecoChipText, { color: '#6b21a8' }]}>• {d}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 4. LOCAL PRICING INTELLIGENCE */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="pricetag-outline" size={18} color="#7c3aed" />
                <Text style={styles.cardTitle}>{t.pricingTitle}</Text>
              </View>

              <View style={styles.pricingGrid}>
                <View style={styles.priceBox}>
                  <Text style={styles.priceBoxLabel}>{t.observedRange}</Text>
                  <Text style={styles.priceBoxVal}>{data.pricing_intelligence.observed_local_range}</Text>
                </View>

                <View style={[styles.priceBox, { backgroundColor: '#f3e8ff', borderColor: '#d8b4fe' }]}>
                  <Text style={[styles.priceBoxLabel, { color: '#6b21a8' }]}>{t.suggestedRange}</Text>
                  <Text style={[styles.priceBoxVal, { color: '#7c3aed' }]}>{data.pricing_intelligence.suggested_starting_range}</Text>
                </View>
              </View>

              <View style={styles.positionTag}>
                <Text style={styles.positionTagText}>🎯 {data.pricing_intelligence.positioning}</Text>
              </View>

              <Text style={styles.priceExplainText}>
                "{data.pricing_intelligence.ai_explanation}"
              </Text>

              <Text style={styles.sourceTagSmall}>🏷️ {data.pricing_intelligence.source_badge}</Text>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 4: SWOT & STRATEGY                                       */}
        {/* ============================================================ */}
        {activeTab === 'swot_strategy' && (
          <View>
            {/* 5. BUSINESS-SPECIFIC SWOT */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="grid-outline" size={18} color="#0f172a" />
                <Text style={styles.cardTitle}>{t.swotTitle}</Text>
              </View>

              <View style={styles.swotGrid}>
                {/* Strengths */}
                <View style={[styles.swotQuadrant, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
                  <Text style={[styles.swotTitle, { color: '#166534' }]}>💪 {t.strengths}</Text>
                  {data.swot.strengths.map((s, idx) => (
                    <Text key={idx} style={styles.swotItemText}>• {s}</Text>
                  ))}
                </View>

                {/* Weaknesses */}
                <View style={[styles.swotQuadrant, { backgroundColor: '#fff7ed', borderColor: '#fed7aa' }]}>
                  <Text style={[styles.swotTitle, { color: '#9a3412' }]}>⚠️ {t.weaknesses}</Text>
                  {data.swot.weaknesses.map((w, idx) => (
                    <Text key={idx} style={styles.swotItemText}>• {w}</Text>
                  ))}
                </View>

                {/* Opportunities */}
                <View style={[styles.swotQuadrant, { backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }]}>
                  <Text style={[styles.swotTitle, { color: '#075985' }]}>🚀 {t.opportunities}</Text>
                  {data.swot.opportunities.map((o, idx) => (
                    <Text key={idx} style={styles.swotItemText}>• {o}</Text>
                  ))}
                </View>

                {/* Threats */}
                <View style={[styles.swotQuadrant, { backgroundColor: '#fef2f2', borderColor: '#fca5a5' }]}>
                  <Text style={[styles.swotTitle, { color: '#991b1b' }]}>🛡️ {t.threats}</Text>
                  {data.swot.threats.map((tItem, idx) => (
                    <Text key={idx} style={styles.swotItemText}>• {tItem}</Text>
                  ))}
                </View>
              </View>
            </View>

            {/* 8. FINAL DISCOVERY RECOMMENDATION */}
            <View style={[styles.card, { backgroundColor: '#0f172a', borderColor: '#334155' }]}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="ribbon-outline" size={18} color="#38bdf8" />
                <Text style={[styles.cardTitle, { color: '#ffffff' }]}>{t.recStrategyTitle}</Text>
                <View style={styles.aiBadgeDark}>
                  <Text style={styles.aiBadgeDarkText}>{data.final_discovery_recommendation.ai_confidence} Confidence</Text>
                </View>
              </View>

              <View style={styles.strategyGrid}>
                <View style={styles.strategyItem}>
                  <Text style={styles.strategyLabel}>{t.bestArea}</Text>
                  <Text style={styles.strategyVal}>{data.final_discovery_recommendation.best_area}</Text>
                </View>
                <View style={styles.strategyItem}>
                  <Text style={styles.strategyLabel}>{t.targetCust}</Text>
                  <Text style={styles.strategyVal}>{data.final_discovery_recommendation.target_customer}</Text>
                </View>
                <View style={styles.strategyItem}>
                  <Text style={styles.strategyLabel}>{t.startingScale}</Text>
                  <Text style={styles.strategyVal}>{data.final_discovery_recommendation.starting_scale}</Text>
                </View>
                <View style={styles.strategyItem}>
                  <Text style={styles.strategyLabel}>{t.keyDiff}</Text>
                  <Text style={[styles.strategyVal, { color: '#4ade80' }]}>
                    {data.final_discovery_recommendation.key_differentiator}
                  </Text>
                </View>
                <View style={styles.strategyItem}>
                  <Text style={styles.strategyLabel}>{t.biggestRisk}</Text>
                  <Text style={[styles.strategyVal, { color: '#f87171' }]}>
                    {data.final_discovery_recommendation.biggest_risk}
                  </Text>
                </View>
                <View style={styles.strategyItem}>
                  <Text style={styles.strategyLabel}>{t.firstAction}</Text>
                  <Text style={[styles.strategyVal, { color: '#38bdf8' }]}>
                    {data.final_discovery_recommendation.first_action}
                  </Text>
                </View>
              </View>
            </View>

            {/* 9. DATA TRUST VERIFICATION */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="checkmark-done-circle-outline" size={18} color="#059669" />
                <Text style={styles.cardTitle}>{t.dataTrustTitle}</Text>
              </View>

              {data.data_trust.map((dt, idx) => (
                <View key={idx} style={styles.dataTrustRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dataTrustItem}>{dt.item}</Text>
                    <Text style={styles.dataTrustSource}>Source: {dt.source}</Text>
                  </View>
                  <View style={styles.dataTrustBadge}>
                    <Text style={styles.dataTrustBadgeText}>{dt.type} • {dt.confidence}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TRANSITION TO FINANCE CTA */}
        <TouchableOpacity
          style={styles.bottomFinanceBtn}
          onPress={() => onNavigateToFinance?.()}
        >
          <Ionicons name="calculator" size={18} color="#ffffff" />
          <Text style={styles.bottomFinanceBtnText}>{t.proceedFinanceBtn}</Text>
        </TouchableOpacity>

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

  // Header Card
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...SHADOW.sm,
  },
  screenTitle: {
    fontFamily: FONT.bold,
    fontSize: 18,
    color: '#0f172a',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontFamily: FONT.medium,
    fontSize: 13,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: '#0369a1',
    marginLeft: 4,
  },

  // Subtabs
  subTabRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.md,
    padding: 3,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  subTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  subTabBtnActive: {
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  subTabText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: '#64748b',
    marginLeft: 4,
  },
  subTabTextActive: {
    fontFamily: FONT.bold,
    color: COLORS.primary,
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#0f172a',
    marginLeft: 6,
    flex: 1,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Radar Canvas
  radarCard: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...SHADOW.sm,
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  radarTitle: {
    fontFamily: FONT.bold,
    fontSize: 14.5,
    color: '#0f172a',
    marginLeft: 4,
  },
  gpsBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gpsBadgeText: {
    fontFamily: FONT.medium,
    fontSize: 10,
    color: '#475569',
  },
  mapCanvas: {
    height: 220,
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  centerNode: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  centerNodeLabel: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: '#dc2626',
    backgroundColor: '#ffffff',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  primaryCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
  },
  catchmentLabel: {
    fontFamily: FONT.bold,
    fontSize: 9,
    color: '#0284c7',
  },
  expansionCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#94a3b8',
    backgroundColor: 'rgba(148, 163, 184, 0.05)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
  },
  catchmentLabelExpansion: {
    fontFamily: FONT.medium,
    fontSize: 9,
    color: '#64748b',
  },
  poiMarker: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fca5a5',
    zIndex: 5,
  },
  poiMarkerText: {
    fontFamily: FONT.medium,
    fontSize: 9.5,
    color: '#991b1b',
    marginLeft: 3,
  },
  layerSectionTitle: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: '#475569',
    marginTop: SPACING.sm,
    marginBottom: 6,
  },
  layerChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  layerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  layerChipActive: {
    backgroundColor: '#f0fdfa',
    borderColor: '#5eead4',
  },
  layerChipText: {
    fontFamily: FONT.medium,
    fontSize: 10.5,
    color: '#64748b',
    marginLeft: 4,
  },
  layerChipTextActive: {
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },

  // Directional Gap
  directionPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  directionBadge: {
    flex: 1,
    padding: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  directionBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 12,
    textAlign: 'center',
  },
  directionExplanation: {
    fontFamily: FONT.regular,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // Competitor Card
  competitorCard: {
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  compCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  compName: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: '#0f172a',
  },
  compMeta: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  priceBadge: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priceBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: '#6d28d9',
  },
  compDetailGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  compDetailItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.sm,
    padding: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  compDetailLabel: {
    fontFamily: FONT.bold,
    fontSize: 10.5,
    color: '#334155',
    marginBottom: 1,
  },
  compDetailVal: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: '#475569',
  },
  diffBox: {
    backgroundColor: '#ecfdf5',
    borderRadius: RADIUS.sm,
    padding: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
    marginBottom: 4,
  },
  diffLabel: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: '#065f46',
  },
  diffVal: {
    fontFamily: FONT.medium,
    fontSize: 11.5,
    color: '#047857',
    marginTop: 1,
  },
  sourceTagSmall: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: '#94a3b8',
  },

  // Positioning
  diffItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  diffCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  diffItemText: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 12.5,
    color: '#1e293b',
    lineHeight: 18,
  },

  // Tab 2 Opportunity & Gaps
  factorCard: {
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.sm,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  factorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  factorName: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: '#0f172a',
  },
  factorFinding: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: COLORS.primary,
  },
  factorMeaning: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  gapCategoryBadge: {
    backgroundColor: '#fef3c7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  gapCategoryText: {
    fontFamily: FONT.bold,
    fontSize: 10.5,
    color: '#92400e',
  },
  gapTitleText: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#92400e',
    marginBottom: 4,
  },
  gapDescText: {
    fontFamily: FONT.regular,
    fontSize: 12.5,
    color: '#78350f',
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  gapActionBox: {
    backgroundColor: '#ffffff',
    borderRadius: RADIUS.sm,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#d97706',
  },
  gapActionLabel: {
    fontFamily: FONT.bold,
    fontSize: 11.5,
    color: '#92400e',
    marginBottom: 1,
  },
  gapActionText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: '#78350f',
    lineHeight: 17,
  },

  // Tab 3 Ecosystem & Pricing
  ecoSubheading: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: '#334155',
    marginBottom: 6,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ecoChip: {
    backgroundColor: '#f0f9ff',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  ecoChipText: {
    fontFamily: FONT.medium,
    fontSize: 11.5,
    color: '#0369a1',
  },
  pricingGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.xs,
  },
  priceBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  priceBoxLabel: {
    fontFamily: FONT.medium,
    fontSize: 10.5,
    color: '#64748b',
    marginBottom: 2,
  },
  priceBoxVal: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#0f172a',
  },
  positionTag: {
    backgroundColor: '#f5f3ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginVertical: 6,
  },
  positionTagText: {
    fontFamily: FONT.bold,
    fontSize: 11.5,
    color: '#6d28d9',
  },
  priceExplainText: {
    fontFamily: FONT.regular,
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 4,
    fontStyle: 'italic',
  },

  // Tab 4 SWOT & Strategy
  swotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  swotQuadrant: {
    width: '48.5%',
    borderRadius: RADIUS.md,
    padding: 8,
    borderWidth: 1,
  },
  swotTitle: {
    fontFamily: FONT.bold,
    fontSize: 12,
    marginBottom: 4,
  },
  swotItemText: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: '#334155',
    lineHeight: 15,
    marginBottom: 3,
  },
  aiBadgeDark: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  aiBadgeDarkText: {
    fontFamily: FONT.bold,
    fontSize: 10,
    color: '#38bdf8',
  },
  strategyGrid: {
    gap: 8,
    marginTop: 4,
  },
  strategyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  strategyLabel: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: '#94a3b8',
    width: '38%',
  },
  strategyVal: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: '#ffffff',
    width: '60%',
    textAlign: 'right',
  },
  dataTrustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dataTrustItem: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: '#334155',
  },
  dataTrustSource: {
    fontFamily: FONT.regular,
    fontSize: 10.5,
    color: '#64748b',
  },
  dataTrustBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dataTrustBadgeText: {
    fontFamily: FONT.medium,
    fontSize: 10,
    color: '#15803d',
  },

  // Bottom Finance CTA
  bottomFinanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    marginTop: SPACING.xs,
    ...SHADOW.md,
  },
  bottomFinanceBtnText: {
    fontFamily: FONT.bold,
    fontSize: 13.5,
    color: '#ffffff',
    marginLeft: 6,
  },
});
