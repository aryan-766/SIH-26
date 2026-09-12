/**
 * GramUdyam — Auth Screen & Multi-Step Entrepreneur Onboarding
 * Upgraded Features:
 * 1. Muted Placeholder Text (placeholderTextColor="#94a3b8") so example text is light and distinguishable.
 * 2. Visual Validation & Error States (Red borders, light red tint, warning labels on empty required fields).
 * 3. Step 4 AI Analysis: High-tech AI Project Report Card + 3 Interactive High-ROI Alternative Opportunities in Panchayat with "Adopt Idea" selection.
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { Language } from '../locales';
import {
  BeneficiaryProfile, OfficerProfile,
  SEED_REGISTERED_ENTREPRENEURS, DEFAULT_FIELD_OFFICER,
  findRegisteredEntrepreneur
} from '../services/enterpriseStore';
import { getAllStates, getDistrictsByState, getDistrictById } from '../services/indiaPanPanchayatData';

interface AuthScreenProps {
  lang: Language;
  onSetLang: (l: Language) => void;
  onLogin: (role: 'entrepreneur' | 'official', profile: BeneficiaryProfile | null, officer: OfficerProfile | null) => void;
}

type AuthTab = 'signin' | 'signup' | 'official';

// Area Opportunity Model
interface AreaOpportunity {
  id: string;
  name: string;
  category: string;
  demandLevel: 'High' | 'Moderate' | 'Very High';
  expectedROI: string;
  annualProfit: string;
  subsidyScheme: string;
  subsidyPercent: string;
  competition: 'Low' | 'Moderate' | 'High';
  description: string;
  whyRecommended: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ lang, onSetLang, onLogin }) => {
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');

  // ==========================================
  // 1. ENTREPRENEUR SIGN IN STATE
  // ==========================================
  const [phone, setPhone] = useState('9876543210');
  const [signinOtpSent, setSigninOtpSent] = useState(false);
  const [signinOtp, setSigninOtp] = useState('');
  const [signinTimer, setSigninTimer] = useState(30);
  const [isSendingSigninOtp, setIsSendingSigninOtp] = useState(false);
  const [signinError, setSigninError] = useState('');

  // Timer effect for Sign In OTP resend
  useEffect(() => {
    let interval: any;
    if (signinOtpSent && signinTimer > 0) {
      interval = setInterval(() => {
        setSigninTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [signinOtpSent, signinTimer]);

  const handleSendSigninOtp = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setSigninError(isEn ? 'Please enter a valid 10-digit mobile number' : 'कृपया 10-अंकीय वैध मोबाइल नंबर दर्ज करें');
      return;
    }
    setSigninError('');
    setIsSendingSigninOtp(true);
    setTimeout(() => {
      setIsSendingSigninOtp(false);
      setSigninOtpSent(true);
      setSigninTimer(30);
      Alert.alert(
        isEn ? 'OTP Sent Successfully' : 'ओटीपी प्रेषित किया गया',
        isEn ? `Verification OTP sent to +91 ${cleanPhone}. Demo OTP: 123456` : `सत्यापन ओटीपी +91 ${cleanPhone} पर भेज दिया गया है। डेमो ओटीपी: 123456`
      );
    }, 900);
  };

  const handleVerifySigninOtp = () => {
    if (signinOtp.trim() !== '123456' && signinOtp.trim().length !== 6) {
      Alert.alert(
        isEn ? 'Invalid OTP' : 'अमान्य ओटीपी',
        isEn ? 'Please enter the 6-digit OTP (Demo: 123456)' : 'कृपया 6-अंकीय ओटीपी दर्ज करें (डेमो: 123456)'
      );
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    const existing = findRegisteredEntrepreneur(cleanPhone);
    if (existing) {
      onLogin('entrepreneur', existing.profile, null);
    } else {
      const defaultProf: BeneficiaryProfile = {
        fullName: 'Ramesh Kumar Yadav',
        phone: cleanPhone || '9876543210',
        email: 'ramesh.yadav@gramudyam.in',
        gender: 'Male',
        age: 34,
        socialCategory: 'OBC',
        capital: 120000,
        skills: ['Dairy Farming', 'Animal Husbandry', 'Cold Storage'],
        spaceSqft: 600,
        stateCode: 'UP',
        districtId: 'dist_gorakhpur',
        districtName: 'Gorakhpur (गोरखपुर)',
        blockId: 'blk_sahjanwa',
        blockName: 'Sahjanwa',
        villageId: 'vil_bhiti',
        villageName: 'Bhiti Rawat',
        selectedBizId: 'dairy_farming',
        selectedBizName: 'Dairy Farming & Chilling Center',
        businessIdeaDescription: 'Gorakhpur village me 500 ltr milk collection & chilling unit solar power se chalana',
        competitionAnalysis: {
          competitionLevel: 'Low',
          existingCompetitorsCount: 1,
          feasibilityScore: 92,
          marketDemandScore: 88,
          recommendation: 'Proceed',
          recommendationNote: 'आपकी ग्राम पंचायत में दुग्ध प्रशीतन केंद्र की अत्यधिक माँग है एवं 35% PMEGP सब्सिडी हेतु पूर्ण पात्र हैं।',
        },
        businessStatus: 'Operational',
      };
      onLogin('entrepreneur', defaultProf, null);
    }
  };

  // ==========================================
  // 2. ENTREPRENEUR MULTI-STEP ONBOARDING STATE
  // ==========================================
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Personal & Contact
  const [fullName, setFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [age, setAge] = useState('28');
  const [socialCategory, setSocialCategory] = useState<'OBC' | 'General' | 'SC' | 'ST'>('OBC');
  const [capitalAmount, setCapitalAmount] = useState('100000');
  const [errorsStep1, setErrorsStep1] = useState<{ fullName?: string; signupPhone?: string }>({});

  // Step 2: Location & GPS
  const statesList = getAllStates();
  const [selectedState, setSelectedState] = useState('UP');
  const districtsList = getDistrictsByState(selectedState);
  const [selectedDistrict, setSelectedDistrict] = useState(districtsList[0]?.id || 'dist_gorakhpur');
  const [villageName, setVillageName] = useState('Bhiti Rawat (भीटी रावत)');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [errorsStep2, setErrorsStep2] = useState<{ villageName?: string }>({});

  // Update district dropdown when state changes
  useEffect(() => {
    const dists = getDistrictsByState(selectedState);
    if (dists && dists.length > 0) {
      setSelectedDistrict(dists[0].id);
    }
  }, [selectedState]);

  // Step 3: Area Opportunities & Business Idea Capture
  const [selectedAreaOpp, setSelectedAreaOpp] = useState<AreaOpportunity | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessIdeaText, setBusinessIdeaText] = useState('');
  const [errorsStep3, setErrorsStep3] = useState<{ businessName?: string }>({});

  // High-ROI Alternative Business Opportunities in the selected Panchayat/District
  const alternativeOpportunities: AreaOpportunity[] = [
    {
      id: 'opp_solar_cold_storage',
      name: 'Micro Solar Agri-Cold Storage (5 MT Capacity)',
      category: 'Cold Chain & Horticulture Storage',
      demandLevel: 'Very High',
      expectedROI: '36% Annual ROI',
      annualProfit: '₹ 4.2 Lakh / Year',
      subsidyScheme: 'MIDH & PM-KUSUM Scheme',
      subsidyPercent: '50% Govt Subsidy',
      competition: 'Low',
      description: 'सब्जियों, फलों एवं दूध को ख़राब होने से बचाने हेतु सौर संचालित 5 मीट्रिक टन क्षमता का माइक्रो कोल्ड स्टोरेज।',
      whyRecommended: `गर्मियों में ${villageName} क्षेत्र में टमाटर एवं दूध के 40% नुकसान को रोकता है।`,
    },
    {
      id: 'opp_vermicompost_bio',
      name: 'Commercial Bio-Fertilizer & Vermicompost Unit',
      category: 'Agro Input & Waste-to-Wealth',
      demandLevel: 'High',
      expectedROI: '42% Annual ROI',
      annualProfit: '₹ 3.8 Lakh / Year',
      subsidyScheme: 'RKVY-RAFTAAR & Organic Mission',
      subsidyPercent: '45% Capital Grant',
      competition: 'Low',
      description: 'गोबर एवं जैविक अपशिष्ट से उच्च गुणवत्ता वर्मीकंपोस्ट खाद। स्थानीय किसानों एवं पौधशालाओं में 100% एडवांस बुकिंग।',
      whyRecommended: `${getDistrictById(selectedDistrict)?.name || 'ज़िला'} में जैविक उर्वरक की 1,200 बैग प्रति माह की कमी है।`,
    },
    {
      id: 'opp_honey_processing_packaging',
      name: 'Apiculture, Pure Honey Processing & Bottling',
      category: 'Apiculture & High Value Export',
      demandLevel: 'High',
      expectedROI: '31% Annual ROI',
      annualProfit: '₹ 3.5 Lakh / Year',
      subsidyScheme: 'National Beekeeping Honey Mission (NBHM)',
      subsidyPercent: '75% Project Grant',
      competition: 'Low',
      description: 'मधुमक्खी पालन (50 बॉक्स), शुद्ध शहद निष्कर्षण, गुणवत्ता टेस्टिंग एवं एगमार्क पैकेजिंग इकाई।',
      whyRecommended: 'सरसों एवं आम के बागों से प्रचुर मात्रा में पराग उपलब्धता एवं ख़रीदारों की सीधी पहुँच।',
    },
  ];

  // Step 4: AI Competition & Feasibility Analysis Choice
  const [isAnalyzingFeasibility, setIsAnalyzingFeasibility] = useState(false);
  const [feasilibilityScore, setFeasibilityScore] = useState(91);
  const [selectedBusinessIdea, setSelectedBusinessIdea] = useState<{
    name: string;
    category: string;
    description: string;
    roi: string;
    subsidy: string;
    isAlternative: boolean;
  }>({
    name: '',
    category: '',
    description: '',
    roi: '32% Annual ROI',
    subsidy: '35% PMEGP Subsidy',
    isAlternative: false,
  });

  const handleAutoDetectGPS = () => {
    setIsDetectingGps(true);
    setTimeout(() => {
      const sampleLocs = [
        { state: 'UP', districtId: 'dist_gorakhpur', village: 'Bhiti Rawat (भीटी रावत)', lat: 26.7606, lng: 83.3732, pin: '273209' },
        { state: 'UP', districtId: 'dist_lucknow', village: 'Mohanlalganj (मोहनलालगंज)', lat: 26.6914, lng: 80.9782, pin: '226301' },
        { state: 'MP', districtId: 'dist_indore', village: 'Mhow Khas (महू खास)', lat: 22.5532, lng: 75.7621, pin: '453441' },
        { state: 'BR', districtId: 'dist_patna', village: 'Phulwari Sharif (फुलवारी शरीफ)', lat: 25.5788, lng: 85.0772, pin: '801505' },
      ];
      const picked = sampleLocs[Math.floor(Math.random() * sampleLocs.length)];
      setSelectedState(picked.state);
      setSelectedDistrict(picked.districtId);
      setVillageName(picked.village);
      setErrorsStep2({});
      setGpsData({
        lat: picked.lat,
        lng: picked.lng,
        address: `${picked.village}, Pin ${picked.pin}`
      });
      setIsDetectingGps(false);
      Alert.alert(
        isEn ? 'GPS Location Auto-Detected' : '📍 जीपीएस से स्थान प्राप्त हुआ',
        `ग्राम: ${picked.village}\nअक्षांश: ${picked.lat}, देशांतर: ${picked.lng}`
      );
    }, 1000);
  };

  // STEP 1 VALIDATION
  const handleNextStep1 = () => {
    const errs: { fullName?: string; signupPhone?: string } = {};
    if (!fullName.trim()) {
      errs.fullName = isEn ? 'Please enter your Full Name' : 'कृपया अपना पूरा नाम दर्ज करें';
    }
    const cleanP = signupPhone.replace(/\D/g, '');
    if (cleanP.length < 10) {
      errs.signupPhone = isEn ? 'Please enter a valid 10-digit mobile number' : 'कृपया 10-अंकीय वैध मोबाइल नंबर दर्ज करें';
    }

    if (Object.keys(errs).length > 0) {
      setErrorsStep1(errs);
      return;
    }
    setErrorsStep1({});
    setOnboardingStep(2);
  };

  // STEP 2 VALIDATION
  const handleNextStep2 = () => {
    if (!villageName.trim()) {
      setErrorsStep2({ villageName: isEn ? 'Please enter or select your Gram Panchayat / Village' : 'कृपया अपनी ग्राम पंचायत या गाँव का नाम दर्ज करें' });
      return;
    }
    setErrorsStep2({});
    setOnboardingStep(3);
  };

  // STEP 3 VALIDATION
  const handleNextStep3 = () => {
    if (!businessName.trim() && !selectedAreaOpp) {
      setErrorsStep3({ businessName: isEn ? 'Please enter your Business Name or select an Idea' : 'कृपया अपने व्यवसाय का नाम या योजना का चयन करें' });
      return;
    }
    setErrorsStep3({});

    // Set initial selected business idea
    const finalBizName = businessName.trim() || selectedAreaOpp?.name || 'Dairy & Agro Chilling Center';
    const finalDesc = businessIdeaText.trim() || selectedAreaOpp?.description || 'Rural agro enterprise with local market supply';

    setSelectedBusinessIdea({
      name: finalBizName,
      category: selectedAreaOpp?.category || 'Agro-processing & Rural Business',
      description: finalDesc,
      roi: selectedAreaOpp?.expectedROI || '32% Annual ROI',
      subsidy: selectedAreaOpp?.subsidyScheme || 'PMEGP (35% Capital Subsidy)',
      isAlternative: false,
    });

    // Trigger AI Feasibility Analysis
    setIsAnalyzingFeasibility(true);
    setOnboardingStep(4);
    setTimeout(() => {
      setIsAnalyzingFeasibility(false);
      const score = Math.floor(86 + Math.random() * 10);
      setFeasibilityScore(score);
    }, 1100);
  };

  const handleCompleteRegistration = () => {
    const distObj = getDistrictById(selectedDistrict);
    const block = distObj?.blocks?.[0];
    const village = block?.villages?.[0];

    const chosenBizName = selectedBusinessIdea.name || 'Agro & Dairy Enterprise';
    const chosenIdea = selectedBusinessIdea.description || 'Rural agro enterprise';

    const newProfile: BeneficiaryProfile = {
      fullName: fullName.trim(),
      phone: signupPhone.replace(/\D/g, '').trim(),
      email: signupEmail.trim() || `${fullName.toLowerCase().replace(/\s+/g, '')}@gramudyam.in`,
      gender,
      age: parseInt(age) || 28,
      socialCategory,
      capital: parseInt(capitalAmount) || 100000,
      skills: ['Agro Business', 'Rural Management', 'Local Trade'],
      spaceSqft: 650,
      stateCode: selectedState,
      districtId: selectedDistrict,
      districtName: distObj?.name || 'Gorakhpur',
      blockId: block?.id || 'blk_sahjanwa',
      blockName: block?.name || 'Sahjanwa',
      villageId: village?.id || 'vil_bhiti',
      villageName: villageName || 'Bhiti Rawat',
      selectedBizId: selectedAreaOpp?.id || 'biz_custom_' + Date.now(),
      selectedBizName: chosenBizName,
      businessIdeaDescription: chosenIdea,
      competitionAnalysis: {
        competitionLevel: 'Low',
        existingCompetitorsCount: 1,
        feasibilityScore: feasilibilityScore,
        marketDemandScore: 92,
        recommendation: selectedBusinessIdea.isAlternative ? 'Alternative Recommended' : 'Proceed',
        recommendationNote: `आपकी ग्राम पंचायत ${villageName} में "${chosenBizName}" हेतु ${feasilibilityScore}% व्यवहार्यता दर्ज की गई है।`,
        recommendedAlternatives: alternativeOpportunities.map(a => ({
          id: a.id,
          name: a.name,
          category: a.category,
          expectedROI: a.expectedROI,
          subsidyScheme: a.subsidyScheme,
          demandLevel: a.demandLevel
        }))
      },
      gpsLocation: gpsData ? { lat: gpsData.lat, lng: gpsData.lng, addressString: gpsData.address } : undefined,
      businessStatus: 'Planning',
    };

    onLogin('entrepreneur', newProfile, null);
  };

  // ==========================================
  // 3. OFFICIAL / IAS LOGIN STATE
  // ==========================================
  const [officialRoleType, setOfficialRoleType] = useState<'ias_dm' | 'field_officer'>('field_officer');
  const [govtOrderNo, setGovtOrderNo] = useState('GOV/UP/PANCHAYAT/2024/7712-B');

  const handleOfficialLogin = (forcedRole?: 'ias_dm' | 'field_officer') => {
    const roleToUse = forcedRole || officialRoleType;

    if (roleToUse === 'ias_dm') {
      const iasOfficer: OfficerProfile = {
        id: 'officer_ias_dm_gkp',
        phone: '9415000001',
        fullName: 'Shri Alok Kumar (IAS)',
        designation: 'District Magistrate & Collector (ज़िलाधिकारी एवं समाहर्ता)',
        uniqueGovtCode: 'IAS-UP-DM-8891',
        block: 'All Blocks (District Jurisdiction)',
        district: 'Gorakhpur (गोरखपुर)',
        officerRole: 'ias_dm',
        assignedIas: {
          name: 'Shri Alok Kumar',
          cadre: 'IAS (UP Cadre - 2014 Batch)',
          designation: 'District Magistrate & Collector',
          office: 'Office of District Magistrate & Collectorate, Gorakhpur',
          email: 'dm-gorakhpur@nic.in',
          appointmentOrder: 'IAS/UP-CADRE/DM-GKP/2022/9901',
        },
        jurisdictionProof: {
          orderNumber: 'IAS/UP-CADRE/DM-GKP/2022/9901',
          issuingAuthority: 'Department of Personnel & Training (DoPT), Govt of India',
          appointmentDate: '12-Jul-2022',
          lgdBlockCode: 'ALL-BLOCKS-LGD',
          lgdVillages: [],
          authoritySeal: 'Presidential Warrant & State Collectorate Seal',
          verificationStatus: 'GOVT_VERIFIED',
        },
        assignedVillages: [
          { id: 'vil_bhiti', name: 'Bhiti Rawat', totalEnterprises: 14 },
          { id: 'vil_sahjanwa', name: 'Sahjanwa Khas', totalEnterprises: 19 },
          { id: 'vil_ghaghra', name: 'Ghaghrasur', totalEnterprises: 8 },
        ],
      };
      onLogin('official', null, iasOfficer);
    } else {
      const vdoOfficer: OfficerProfile = {
        ...DEFAULT_FIELD_OFFICER,
        officerRole: 'field_officer',
      };
      onLogin('official', null, vdoOfficer);
    }
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Top Branding Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.appTitle}>GramUdyam</Text>
            <Text style={styles.appSubtitle}>
              {isEn ? 'National Rural Enterprise Intelligence Platform' : 'राष्ट्रीय ग्रामीण उद्यम अभिशासन एवं विकास मंच'}
            </Text>

            {/* Language Selection Pills */}
            <View style={styles.langRow}>
              {languages.map((l) => (
                <TouchableOpacity
                  key={l.code}
                  style={[styles.langChip, lang === l.code && styles.langChipActive]}
                  onPress={() => onSetLang(l.code)}
                >
                  <Text style={[styles.langChipText, lang === l.code && styles.langChipTextActive]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Navigation Bar Tabs */}
          <View style={styles.tabRow}>
            {[
              { key: 'signin' as AuthTab, icon: 'log-in-outline' as const, label: isEn ? 'Entrepreneur Sign In' : 'उद्यमी लॉगिन' },
              { key: 'signup' as AuthTab, icon: 'sparkles-outline' as const, label: isEn ? 'New Onboarding' : 'नया पंजीकरण' },
              { key: 'official' as AuthTab, icon: 'shield-checkmark-outline' as const, label: isEn ? 'IAS / Official' : 'अधिकारी पोर्टल' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons
                  name={tab.icon}
                  size={14}
                  color={activeTab === tab.key ? COLORS.white : COLORS.textSecondary}
                />
                <Text style={[styles.tabBtnText, activeTab === tab.key && styles.tabBtnTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ============================================================ */}
          {/* 1. ENTREPRENEUR SIGN IN WITH OTP                             */}
          {/* ============================================================ */}
          {activeTab === 'signin' && (
            <View style={styles.formCard}>
              <View style={styles.formHeaderRow}>
                <Ionicons name="key" size={20} color={COLORS.primary} />
                <Text style={styles.formTitle}>
                  {isEn ? 'Entrepreneur Secure Sign In' : 'ग्रामीण उद्यमी सुरक्षित लॉगिन'}
                </Text>
              </View>
              <Text style={styles.formSubtitle}>
                {isEn ? 'Enter your 10-digit mobile number with +91 to receive OTP' : '+91 के साथ अपना मोबाइल नंबर दर्ज करके 6-अंकीय ओटीपी प्राप्त करें'}
              </Text>

              {/* Phone Input with +91 Country Code Badge */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{isEn ? 'Mobile Phone Number *' : 'मोबाइल नंबर (भारत) *'}</Text>
                <View style={styles.phoneInputRow}>
                  <View style={styles.countryCodeBadge}>
                    <Text style={{ fontSize: 13 }}>🇮🇳</Text>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      { flex: 1 },
                      !!signinError && styles.inputError,
                    ]}
                    value={phone}
                    onChangeText={(txt) => {
                      setPhone(txt);
                      setSigninError('');
                    }}
                    keyboardType="phone-pad"
                    maxLength={10}
                    placeholder="9876543210"
                    placeholderTextColor="#94a3b8"
                    editable={!signinOtpSent}
                  />
                </View>
                {!!signinError && (
                  <Text style={styles.errorText}>⚠️ {signinError}</Text>
                )}
              </View>

              {/* Step A: Send OTP Button */}
              {!signinOtpSent ? (
                <TouchableOpacity
                  style={[styles.submitBtn, isSendingSigninOtp && { opacity: 0.7 }]}
                  onPress={handleSendSigninOtp}
                  disabled={isSendingSigninOtp}
                >
                  {isSendingSigninOtp ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <>
                      <Ionicons name="paper-plane" size={16} color={COLORS.white} />
                      <Text style={styles.submitBtnText}>
                        {isEn ? 'Send OTP Verification Code' : 'ओटीपी प्रेषित करें'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                /* Step B: Verify 6-Digit OTP View */
                <View style={styles.otpBoxContainer}>
                  <View style={styles.otpHeaderRow}>
                    <Text style={styles.otpBoxTitle}>
                      {isEn ? 'Enter 6-Digit OTP Verification Code' : '6-अंकीय ओटीपी कोड दर्ज करें'}
                    </Text>
                    <TouchableOpacity onPress={() => setSigninOtpSent(false)}>
                      <Text style={styles.changeNumText}>{isEn ? 'Change Number' : 'नंबर बदलें'}</Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.otpInput}
                    value={signinOtp}
                    onChangeText={setSigninOtp}
                    keyboardType="numeric"
                    maxLength={6}
                    placeholder="• • • • • •"
                    placeholderTextColor="#94a3b8"
                  />

                  {/* Quick Auto-fill Demo OTP Pill */}
                  <TouchableOpacity
                    style={styles.demoOtpPill}
                    onPress={() => setSigninOtp('123456')}
                  >
                    <Ionicons name="sparkles" size={14} color="#047857" />
                    <Text style={styles.demoOtpText}>
                      {isEn ? '⚡ Auto-Fill Demo OTP (123456)' : '⚡ त्वरित डेमो ओटीपी भरें (123456)'}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.resendRow}>
                    <Text style={styles.timerText}>
                      {signinTimer > 0
                        ? (isEn ? `Resend OTP in ${signinTimer}s` : `${signinTimer} सेकंड में पुनः भेजें`)
                        : (isEn ? 'Didn\'t receive OTP?' : 'ओटीपी प्राप्त नहीं हुआ?')}
                    </Text>
                    {signinTimer === 0 && (
                      <TouchableOpacity onPress={handleSendSigninOtp}>
                        <Text style={styles.resendBtnText}>{isEn ? 'Resend OTP' : 'पुनः ओटीपी भेजें'}</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <TouchableOpacity style={styles.submitBtn} onPress={handleVerifySigninOtp}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.white} />
                    <Text style={styles.submitBtnText}>
                      {isEn ? 'Verify OTP & Access Portal' : 'ओटीपी सत्यापित करें एवं प्रवेश करें'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Quick One-Tap Seed Logins */}
              <View style={styles.quickSeedSection}>
                <Text style={styles.quickSeedTitle}>
                  {isEn ? '⚡ DIRECT DEMO ENTREPRENEUR ACCESS:' : '⚡ सीधी उद्यमी लॉगिन (डेमो):'}
                </Text>
                {SEED_REGISTERED_ENTREPRENEURS.map((ent) => (
                  <TouchableOpacity
                    key={ent.id}
                    style={styles.seedChip}
                    onPress={() => onLogin('entrepreneur', ent.profile, null)}
                  >
                    <Ionicons name="person-circle" size={16} color={COLORS.primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.seedName}>{ent.fullName}</Text>
                      <Text style={styles.seedBiz}>{ent.businessSummary}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ============================================================ */}
          {/* 2. MULTI-STEP GUIDED ONBOARDING PROCESS                      */}
          {/* ============================================================ */}
          {activeTab === 'signup' && (
            <View style={styles.formCard}>
              
              {/* Stepper Progress Bar */}
              <View style={styles.stepperContainer}>
                <View style={styles.stepperTrack}>
                  <View style={[styles.stepperFill, { width: `${(onboardingStep / 5) * 100}%` }]} />
                </View>

                <View style={styles.stepBadgesRow}>
                  {[
                    { num: 1, label: isEn ? 'Basic Info' : 'विवरण' },
                    { num: 2, label: isEn ? 'Panchayat' : 'स्थान & GPS' },
                    { num: 3, label: isEn ? 'Business' : 'व्यवसाय' },
                    { num: 4, label: isEn ? 'AI Analysis' : 'विश्लेषण' },
                    { num: 5, label: isEn ? 'Profile' : 'प्रोफ़ाइल' },
                  ].map((st) => (
                    <TouchableOpacity
                      key={st.num}
                      style={[
                        styles.stepCircle,
                        onboardingStep === st.num && styles.stepCircleActive,
                        onboardingStep > st.num && styles.stepCircleDone,
                      ]}
                      onPress={() => {
                        if (st.num < onboardingStep) setOnboardingStep(st.num as any);
                      }}
                    >
                      <Text
                        style={[
                          styles.stepNumText,
                          onboardingStep >= st.num && styles.stepNumTextActive,
                        ]}
                      >
                        {onboardingStep > st.num ? '✓' : st.num}
                      </Text>
                      <Text style={styles.stepLabelText}>{st.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* STEP 1: PERSONAL & CONTACT DETAILS */}
              {onboardingStep === 1 && (
                <View style={styles.stepSection}>
                  <Text style={styles.stepTitle}>
                    {isEn ? '👤 Step 1: Entrepreneur Contact & Personal Details' : '👤 चरण 1: उद्यमी का व्यक्तिगत एवं संपर्क विवरण'}
                  </Text>

                  {/* Full Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{isEn ? 'Full Name *' : 'उद्यमी का पूरा नाम *'}</Text>
                    <TextInput
                      style={[
                        styles.input,
                        !!errorsStep1.fullName && styles.inputError,
                      ]}
                      value={fullName}
                      onChangeText={(txt) => {
                        setFullName(txt);
                        setErrorsStep1((prev) => ({ ...prev, fullName: undefined }));
                      }}
                      placeholder="e.g. Ramesh Kumar Yadav"
                      placeholderTextColor="#94a3b8"
                    />
                    {!!errorsStep1.fullName && (
                      <Text style={styles.errorText}>⚠️ {errorsStep1.fullName}</Text>
                    )}
                  </View>

                  {/* Phone Number */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{isEn ? 'Mobile Phone (+91) *' : 'मोबाइल नंबर (भारत +91) *'}</Text>
                    <View style={styles.phoneInputRow}>
                      <View style={styles.countryCodeBadge}>
                        <Text style={{ fontSize: 13 }}>🇮🇳</Text>
                        <Text style={styles.countryCodeText}>+91</Text>
                      </View>
                      <TextInput
                        style={[
                          styles.input,
                          { flex: 1 },
                          !!errorsStep1.signupPhone && styles.inputError,
                        ]}
                        value={signupPhone}
                        onChangeText={(txt) => {
                          setSignupPhone(txt);
                          setErrorsStep1((prev) => ({ ...prev, signupPhone: undefined }));
                        }}
                        keyboardType="phone-pad"
                        maxLength={10}
                        placeholder="9876543210"
                        placeholderTextColor="#94a3b8"
                      />
                    </View>
                    {!!errorsStep1.signupPhone && (
                      <Text style={styles.errorText}>⚠️ {errorsStep1.signupPhone}</Text>
                    )}
                  </View>

                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{isEn ? 'Email Address (Optional)' : 'ईमेल आईडी (ऐच्छिक)'}</Text>
                    <TextInput
                      style={styles.input}
                      value={signupEmail}
                      onChangeText={setSignupEmail}
                      keyboardType="email-address"
                      placeholder="ramesh.yadav@gmail.com"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                    <View style={[{ flex: 1 }, styles.inputGroup]}>
                      <Text style={styles.inputLabel}>{isEn ? 'Gender' : 'लिंग'}</Text>
                      <View style={styles.chipToggleRow}>
                        {(['Male', 'Female', 'Other'] as const).map((g) => (
                          <TouchableOpacity
                            key={g}
                            style={[styles.chipPill, gender === g && styles.chipPillActive]}
                            onPress={() => setGender(g)}
                          >
                            <Text style={[styles.chipPillText, gender === g && styles.chipPillTextActive]}>
                              {g === 'Male' ? 'पुरुष' : g === 'Female' ? 'महिला' : 'अन्य'}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={[{ flex: 1 }, styles.inputGroup]}>
                      <Text style={styles.inputLabel}>{isEn ? 'Age (Years)' : 'आयु (वर्ष)'}</Text>
                      <TextInput
                        style={styles.input}
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                        placeholder="28"
                        placeholderTextColor="#94a3b8"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{isEn ? 'Social Category (For Govt Subsidies)' : 'सामाजिक वर्ग (सरकारी सब्सिडी लाभ हेतु)'}</Text>
                    <View style={styles.chipToggleRow}>
                      {(['OBC', 'General', 'SC', 'ST'] as const).map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          style={[styles.chipPill, socialCategory === cat && styles.chipPillActive]}
                          onPress={() => setSocialCategory(cat)}
                        >
                          <Text style={[styles.chipPillText, socialCategory === cat && styles.chipPillTextActive]}>
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{isEn ? 'Investment Capital Available (₹)' : 'उपलब्ध निवेश पूँजी (₹)'}</Text>
                    <TextInput
                      style={styles.input}
                      value={capitalAmount}
                      onChangeText={setCapitalAmount}
                      keyboardType="numeric"
                      placeholder="100000"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <TouchableOpacity style={styles.submitBtn} onPress={handleNextStep1}>
                    <Text style={styles.submitBtnText}>
                      {isEn ? 'Next: Location & Panchayat ->' : 'आगे बढ़ें: स्थान एवं ग्राम पंचायत ->'}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: PAN-INDIA LOCATION & GPS AUTO-DETECT */}
              {onboardingStep === 2 && (
                <View style={styles.stepSection}>
                  <Text style={styles.stepTitle}>
                    {isEn ? '🗺️ Step 2: Location (800+ Districts & 6 Lakh Villages)' : '🗺️ चरण 2: स्थान चयन (800+ ज़िले एवं 6 लाख गाँव)'}
                  </Text>

                  {/* GPS Auto-Detect Location Button */}
                  <TouchableOpacity
                    style={styles.gpsAutoDetectBtn}
                    onPress={handleAutoDetectGPS}
                    disabled={isDetectingGps}
                  >
                    {isDetectingGps ? (
                      <ActivityIndicator size="small" color="#0369a1" />
                    ) : (
                      <>
                        <Ionicons name="location" size={18} color="#0284c7" />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.gpsBtnTitle}>
                            {isEn ? '📍 Auto-Detect Location via GPS' : '📍 जीपीएस से वर्तमान स्थान स्वतः प्राप्त करें'}
                          </Text>
                          <Text style={styles.gpsBtnSub}>
                            {gpsData ? gpsData.address : (isEn ? 'Tap to auto-fill State, District & Gram Panchayat' : 'राज्य, ज़िला और ग्राम पंचायत ऑटो-भरने के लिए टैप करें')}
                          </Text>
                        </View>
                        <Ionicons name="sparkles" size={16} color="#0284c7" />
                      </>
                    )}
                  </TouchableOpacity>

                  {/* State Selection */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{isEn ? 'Select State / Union Territory *' : 'राज्य / केंद्र शासित प्रदेश का चयन करें *'}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalPillScroll}>
                      {statesList.map((st) => (
                        <TouchableOpacity
                          key={st.code}
                          style={[styles.statePill, selectedState === st.code && styles.statePillActive]}
                          onPress={() => setSelectedState(st.code)}
                        >
                          <Text style={[styles.statePillText, selectedState === st.code && styles.statePillTextActive]}>
                            {st.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* District Selection (Filtered State-wise) */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      {isEn ? `Select District (${districtsList.length} Districts Available) *` : `ज़िला चुनें (${districtsList.length} ज़िले उपलब्ध) *`}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalPillScroll}>
                      {districtsList.map((dist) => (
                        <TouchableOpacity
                          key={dist.id}
                          style={[styles.statePill, selectedDistrict === dist.id && styles.statePillActive]}
                          onPress={() => {
                            setSelectedDistrict(dist.id);
                            if (dist.blocks?.[0]?.villages?.[0]) {
                              setVillageName(dist.blocks[0].villages[0].name);
                            }
                          }}
                        >
                          <Text style={[styles.statePillText, selectedDistrict === dist.id && styles.statePillTextActive]}>
                            {dist.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Gram Panchayat / Village Selection */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{isEn ? 'Gram Panchayat / Village Name *' : 'ग्राम पंचायत / गाँव का नाम *'}</Text>
                    <TextInput
                      style={[
                        styles.input,
                        !!errorsStep2.villageName && styles.inputError,
                      ]}
                      value={villageName}
                      onChangeText={(text) => {
                        setVillageName(text);
                        setErrorsStep2({});
                      }}
                      placeholder="e.g. Bhiti Rawat (भीटी रावत)"
                      placeholderTextColor="#94a3b8"
                    />
                    {!!errorsStep2.villageName && (
                      <Text style={styles.errorText}>⚠️ {errorsStep2.villageName}</Text>
                    )}
                  </View>

                  <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => setOnboardingStep(1)}>
                      <Ionicons name="arrow-back" size={16} color={COLORS.textSecondary} />
                      <Text style={styles.backBtnText}>{isEn ? 'Back' : 'पीछे'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.submitBtn, { flex: 1 }]} onPress={handleNextStep2}>
                      <Text style={styles.submitBtnText}>
                        {isEn ? 'Next: Business Idea & Opportunities ->' : 'आगे बढ़ें: क्षेत्र के व्यवसाय अवसर ->'}
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 3: AREA BUSINESS SUGGESTIONS & IDEA CAPTURE */}
              {onboardingStep === 3 && (
                <View style={styles.stepSection}>
                  <Text style={stepStyles.stepTitle}>
                    {isEn ? '💡 Step 3: Business Name & Idea Registration' : '💡 चरण 3: अपने व्यवसाय का नाम एवं विचार दर्ज करें'}
                  </Text>
                  <Text style={stepStyles.stepSubtitle}>
                    {isEn ? `Register your proposed enterprise for ${villageName}:` : `${villageName} क्षेत्र हेतु अपने व्यवसाय की जानकारी दें:`}
                  </Text>

                  {/* Input for Custom Business Name & Description */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{isEn ? 'Proposed Business Name *' : 'प्रस्तावित व्यवसाय का नाम *'}</Text>
                    <TextInput
                      style={[
                        styles.input,
                        !!errorsStep3.businessName && styles.inputError,
                      ]}
                      value={businessName}
                      onChangeText={(txt) => {
                        setBusinessName(txt);
                        setErrorsStep3({});
                      }}
                      placeholder="e.g. Maa Vaishno Solar Chilling & Dairy Unit"
                      placeholderTextColor="#94a3b8"
                    />
                    {!!errorsStep3.businessName && (
                      <Text style={styles.errorText}>⚠️ {errorsStep3.businessName}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{isEn ? 'Describe Your Business Idea (व्यवसाय विचार का संक्षेप)' : 'अपने व्यवसाय विचार का विवरण दें'}</Text>
                    <TextInput
                      style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                      value={businessIdeaText}
                      onChangeText={setBusinessIdeaText}
                      multiline
                      numberOfLines={3}
                      placeholder="e.g. Mere gaon me 500 ltr milk collection & chilling unit solar power se chalana chahta hu"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => setOnboardingStep(2)}>
                      <Ionicons name="arrow-back" size={16} color={COLORS.textSecondary} />
                      <Text style={styles.backBtnText}>{isEn ? 'Back' : 'पीछे'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.submitBtn, { flex: 1 }]} onPress={handleNextStep3}>
                      <Text style={styles.submitBtnText}>
                        {isEn ? 'Next: AI Competition Analysis ->' : 'आगे बढ़ें: AI बाज़ार एवं प्रतिस्पर्धा विश्लेषण ->'}
                      </Text>
                      <Ionicons name="sparkles" size={16} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 4: AI COMPETITION & FEASIBILITY ANALYSIS + 3 RECOMMENDED OPPORTUNITIES */}
              {onboardingStep === 4 && (
                <View style={styles.stepSection}>
                  <Text style={stepStyles.stepTitle}>
                    {isEn ? '🧠 Step 4: AI Market Analysis & 3 Recommended Opportunities' : '🧠 चरण 4: AI बाज़ार विश्लेषण एवं 3 अनुशंसित व्यवसाय अवसर'}
                  </Text>

                  {isAnalyzingFeasibility ? (
                    <View style={stepStyles.analyzingBox}>
                      <ActivityIndicator size="large" color={COLORS.primary} />
                      <Text style={stepStyles.analyzingText}>
                        {isEn
                          ? `Analyzing competitor density & demand gap in ${villageName}...`
                          : `${villageName} क्षेत्र में प्रतिस्पर्धा घनत्व एवं बाज़ार माँग का AI विश्लेषण चालू है...`}
                      </Text>
                    </View>
                  ) : (
                    <>
                      {/* USER PROPOSED IDEA PRESENTATION CARD */}
                      <View style={stepStyles.userIdeaCard}>
                        <View style={stepStyles.userIdeaBadgeRow}>
                          <View style={stepStyles.userIdeaTypeBadge}>
                            <Ionicons name="analytics" size={12} color="#047857" />
                            <Text style={stepStyles.userIdeaTypeText}>
                              {isEn ? 'User Proposed Enterprise' : 'उद्यमी का प्रस्तावित व्यवसाय'}
                            </Text>
                          </View>
                          <View style={stepStyles.feasibilityBadge}>
                            <Text style={stepStyles.feasibilityText}>{feasilibilityScore}% Feasibility</Text>
                          </View>
                        </View>

                        <Text style={stepStyles.userIdeaName}>{selectedBusinessIdea.name}</Text>
                        {!!selectedBusinessIdea.description && (
                          <Text style={stepStyles.userIdeaDesc}>"{selectedBusinessIdea.description}"</Text>
                        )}

                        <View style={stepStyles.statsGrid}>
                          <View style={stepStyles.statItem}>
                            <Text style={stepStyles.statValText}>Low (1 Unit)</Text>
                            <Text style={stepStyles.statLblText}>Competitor Saturation</Text>
                          </View>
                          <View style={stepStyles.statItem}>
                            <Text style={stepStyles.statValText}>850 Ltr/Day</Text>
                            <Text style={stepStyles.statLblText}>Local Deficit Gap</Text>
                          </View>
                          <View style={stepStyles.statItem}>
                            <Text style={stepStyles.statValText}>35% Grant</Text>
                            <Text style={stepStyles.statLblText}>PMEGP Subsidy</Text>
                          </View>
                        </View>
                      </View>

                      {/* SECTION: 3 RECOMMENDED HIGH-ROI ALTERNATIVE OPPORTUNITIES */}
                      <View style={stepStyles.sectionHeaderBox}>
                        <Ionicons name="bulb" size={16} color="#b45309" />
                        <Text style={stepStyles.sectionHeaderTitle}>
                          {isEn
                            ? `💡 3 High-ROI Business Opportunities Suggested for ${villageName}:`
                            : `💡 ${villageName} क्षेत्र हेतु 3 अनुशंसित उच्च-लाभदायक व्यवसाय अवसर:`}
                        </Text>
                      </View>

                      <View style={stepStyles.oppCardsList}>
                        {alternativeOpportunities.map((opp, idx) => {
                          const isSelected = selectedBusinessIdea.name === opp.name;
                          return (
                            <TouchableOpacity
                              key={opp.id}
                              style={[
                                stepStyles.oppCard,
                                isSelected && stepStyles.oppCardSelected,
                              ]}
                              onPress={() => {
                                setSelectedBusinessIdea({
                                  name: opp.name,
                                  category: opp.category,
                                  description: opp.description,
                                  roi: opp.expectedROI,
                                  subsidy: `${opp.subsidyPercent} (${opp.subsidyScheme})`,
                                  isAlternative: true,
                                });
                              }}
                            >
                              <View style={stepStyles.oppCardHeader}>
                                <View style={{ flex: 1 }}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Text style={stepStyles.oppRankNum}>#{idx + 1}</Text>
                                    <Text style={stepStyles.oppCardName}>{opp.name}</Text>
                                  </View>
                                  <Text style={stepStyles.oppCardCategory}>{opp.category}</Text>
                                </View>

                                <View style={stepStyles.roiBadge}>
                                  <Text style={stepStyles.roiText}>{opp.expectedROI}</Text>
                                </View>
                              </View>

                              <Text style={stepStyles.whyRecText}>
                                🎯 <Text style={{ fontWeight: '800' }}>AI Insight:</Text> {opp.whyRecommended}
                              </Text>

                              <View style={stepStyles.oppMetaRow}>
                                <View style={stepStyles.metaPill}>
                                  <Ionicons name="ribbon" size={10} color="#047857" />
                                  <Text style={stepStyles.metaPillText}>{opp.subsidyPercent}</Text>
                                </View>

                                <View style={[stepStyles.metaPill, { backgroundColor: '#fef3c7' }]}>
                                  <Ionicons name="cash" size={10} color="#b45309" />
                                  <Text style={[stepStyles.metaPillText, { color: '#b45309' }]}>{opp.annualProfit}</Text>
                                </View>

                                <View style={[stepStyles.metaPill, { backgroundColor: isSelected ? '#15803d' : '#e2e8f0', marginLeft: 'auto' }]}>
                                  <Text style={[stepStyles.metaPillText, { color: isSelected ? '#ffffff' : '#334155', fontWeight: '900' }]}>
                                    {isSelected ? '✓ Selected' : 'Select Idea'}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => setOnboardingStep(3)}>
                          <Ionicons name="arrow-back" size={16} color={COLORS.textSecondary} />
                          <Text style={styles.backBtnText}>{isEn ? 'Back' : 'पीछे'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.submitBtn, { flex: 1 }]} onPress={() => setOnboardingStep(5)}>
                          <Text style={styles.submitBtnText}>
                            {isEn ? 'Next: Review & Finalize ->' : 'आगे बढ़ें: समीक्षा एवं प्रोफ़ाइल पूर्ण करें ->'}
                          </Text>
                          <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}

              {/* STEP 5: FINAL PROFILE REVIEW & LAUNCH DASHBOARD */}
              {onboardingStep === 5 && (
                <View style={styles.stepSection}>
                  <Text style={stepStyles.stepTitle}>
                    {isEn ? '🎉 Step 5: Final Entrepreneur Profile Ready!' : '🎉 चरण 5: आपकी ग्रामीण उद्यमी प्रोफ़ाइल तैयार है!'}
                  </Text>

                  {/* Summary Profile Preview Card */}
                  <View style={stepStyles.finalSummaryCard}>
                    <View style={stepStyles.summaryAvatarRow}>
                      <View style={stepStyles.summaryAvatar}>
                        <Text style={stepStyles.summaryAvatarText}>{fullName.charAt(0) || 'U'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={stepStyles.summaryName}>{fullName || 'Rural Entrepreneur'}</Text>
                        <Text style={stepStyles.summaryContact}>+91 {signupPhone} • {socialCategory}</Text>
                        <Text style={stepStyles.summaryLocation}>📍 {villageName}, {getDistrictById(selectedDistrict)?.name}</Text>
                      </View>
                    </View>

                    <View style={stepStyles.summaryDivider} />

                    <View style={stepStyles.summaryDetailRow}>
                      <Text style={stepStyles.summaryLabel}>{isEn ? 'Selected Business:' : 'चयनित व्यवसाय:'}</Text>
                      <Text style={stepStyles.summaryValue}>{selectedBusinessIdea.name || 'Agro & Dairy Enterprise'}</Text>
                    </View>

                    <View style={stepStyles.summaryDetailRow}>
                      <Text style={stepStyles.summaryLabel}>{isEn ? 'Capital Available:' : 'उपलब्ध पूँजी:'}</Text>
                      <Text style={stepStyles.summaryValue}>₹{parseInt(capitalAmount || '100000').toLocaleString()}</Text>
                    </View>

                    <View style={stepStyles.summaryDetailRow}>
                      <Text style={stepStyles.summaryLabel}>{isEn ? 'Feasibility Score:' : 'व्यवहार्यता स्कोर:'}</Text>
                      <Text style={[stepStyles.summaryValue, { color: '#047857', fontWeight: '900' }]}>{feasilibilityScore}% (Very High)</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.submitBtn} onPress={handleCompleteRegistration}>
                    <Ionicons name="rocket" size={18} color={COLORS.white} />
                    <Text style={styles.submitBtnText}>
                      {isEn ? '🚀 Launch Entrepreneur Dashboard & Modules' : '🚀 उद्यमी डैशबोर्ड एवं 6 मॉड्यूल्स में प्रवेश करें'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

            </View>
          )}

          {/* ============================================================ */}
          {/* 3. OFFICIAL / IAS LOGIN                                      */}
          {/* ============================================================ */}
          {activeTab === 'official' && (
            <View style={[styles.formCard, styles.formCardOfficial]}>
              <View style={styles.officialHeader}>
                <Text style={styles.officialTitle}>
                  {isEn ? '🏛️ Official Government Portal' : '🏛️ शासकीय अभिशासन एवं IAS पोर्टल'}
                </Text>
                <View style={styles.restrictedBadge}>
                  <Ionicons name="lock-closed" size={10} color="#991b1b" />
                  <Text style={styles.restrictedBadgeText}>Restricted Access</Text>
                </View>
              </View>

              {/* Role Toggle: IAS DM vs VDO */}
              <Text style={styles.inputLabel}>{isEn ? 'Select Official Designation:' : 'शासकीय पद का चयन करें:'}</Text>
              <View style={styles.roleToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.roleToggleBtn,
                    officialRoleType === 'ias_dm' && styles.roleToggleBtnActiveIas,
                  ]}
                  onPress={() => setOfficialRoleType('ias_dm')}
                >
                  <Text style={{ fontSize: 16 }}>🏛️</Text>
                  <Text
                    style={[
                      styles.roleToggleText,
                      officialRoleType === 'ias_dm' && styles.roleToggleTextActiveIas,
                    ]}
                  >
                    IAS District Magistrate (DM)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleToggleBtn,
                    officialRoleType === 'field_officer' && styles.roleToggleBtnActiveVdo,
                  ]}
                  onPress={() => setOfficialRoleType('field_officer')}
                >
                  <Text style={{ fontSize: 16 }}>📋</Text>
                  <Text
                    style={[
                      styles.roleToggleText,
                      officialRoleType === 'field_officer' && styles.roleToggleTextActiveVdo,
                    ]}
                  >
                    VDO / Gram Sachiv
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Quick One-Tap Official Access */}
              <View style={styles.quickOfficialBox}>
                <Text style={styles.quickOfficialTitle}>
                  {isEn ? '⚡ ONE-TAP DIRECT OFFICIAL ACCESS:' : '⚡ त्वरित शासकीय अभिप्रमाणन:'}
                </Text>
                <TouchableOpacity
                  style={styles.directIasBtn}
                  onPress={() => handleOfficialLogin('ias_dm')}
                >
                  <Text style={{ fontSize: 18 }}>🏛️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.directIasTitle}>
                      {isEn ? 'Enter as IAS District Magistrate' : 'आईएएस ज़िलाधिकारी (DM) प्रवेश'}
                    </Text>
                    <Text style={styles.directIasSub}>
                      Shri Alok Kumar (IAS) • Presidential Commission
                    </Text>
                  </View>
                  <Ionicons name="shield-checkmark" size={18} color="#92400e" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.directVdoBtn}
                  onPress={() => handleOfficialLogin('field_officer')}
                >
                  <Text style={{ fontSize: 18 }}>📋</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.directVdoTitle}>
                      {isEn ? 'Enter as Field Officer (VDO)' : 'ग्राम विकास अधिकारी (VDO) प्रवेश'}
                    </Text>
                    <Text style={styles.directVdoSub}>
                      Sanjay Verma (VDO) • Sahjanwa Block
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#6b21a8" />
                </TouchableOpacity>
              </View>

              {/* Manual Dispatch Order Entry */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {isEn ? 'Govt Gazette Order No. / Service Dispatch Code' : 'सरकारी आदेश क्रमांक / राजपत्र कोड'}
                </Text>
                <TextInput
                  style={[styles.input, { fontFamily: 'monospace', fontSize: 11 }]}
                  value={govtOrderNo}
                  onChangeText={setGovtOrderNo}
                  placeholder="GOV/UP/PANCHAYAT/2024/7712-B"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <TouchableOpacity
                style={styles.officialSubmitBtn}
                onPress={() => handleOfficialLogin()}
              >
                <Ionicons name="shield-checkmark" size={16} color={COLORS.white} />
                <Text style={styles.officialSubmitBtnText}>
                  {officialRoleType === 'ias_dm'
                    ? (isEn ? 'Authenticate as IAS District Magistrate' : 'आईएएस ज़िलाधिकारी के रूप में सत्यापित करें')
                    : (isEn ? 'Authenticate as Field Officer (VDO)' : 'ग्राम विकास अधिकारी के रूप में सत्यापित करें')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Main Auth Screen Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    ...SHADOW.md,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  appSubtitle: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  langRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: SPACING.sm,
  },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  langChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  langChipTextActive: {
    color: COLORS.white,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: RADIUS.md,
    padding: 3,
    gap: 3,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.white,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  formCardOfficial: {
    borderColor: '#c084fc',
    backgroundColor: '#fdf4ff',
  },
  formHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  formSubtitle: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#dc2626',
    marginTop: 1,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  countryCodeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
  },
  submitBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.white,
  },
  otpBoxContainer: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    gap: 8,
    marginTop: 4,
  },
  otpHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  otpBoxTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
  },
  changeNumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284c7',
    textDecorationLine: 'underline',
  },
  otpInput: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 8,
    color: COLORS.textPrimary,
  },
  demoOtpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#d1fae5',
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  demoOtpText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  resendBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  quickSeedSection: {
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 6,
  },
  quickSeedTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
  },
  seedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  seedName: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  seedBiz: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  stepperContainer: {
    marginBottom: SPACING.xs,
    gap: 8,
  },
  stepperTrack: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  stepperFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  stepBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCircle: {
    alignItems: 'center',
    gap: 2,
  },
  stepCircleActive: {
    transform: [{ scale: 1.05 }],
  },
  stepCircleDone: {},
  stepNumText: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#cbd5e1',
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 20,
  },
  stepNumTextActive: {
    backgroundColor: COLORS.primary,
  },
  stepLabelText: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  stepSection: {
    gap: SPACING.sm,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  chipToggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chipPill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  chipPillActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primary,
  },
  chipPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  chipPillTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '900',
  },
  gpsAutoDetectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    padding: 10,
    borderRadius: RADIUS.md,
  },
  gpsBtnTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0369a1',
  },
  gpsBtnSub: {
    fontSize: 9,
    color: '#0284c7',
  },
  horizontalPillScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  statePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statePillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  statePillTextActive: {
    color: COLORS.white,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  backBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  officialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  officialTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#3b0764',
  },
  restrictedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  restrictedBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#991b1b',
  },
  roleToggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  roleToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  roleToggleBtnActiveIas: {
    borderColor: '#b45309',
    backgroundColor: '#fef3c7',
  },
  roleToggleBtnActiveVdo: {
    borderColor: '#7e22ce',
    backgroundColor: '#f3e8ff',
  },
  roleToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    flex: 1,
  },
  roleToggleTextActiveIas: {
    color: '#92400e',
    fontWeight: '900',
  },
  roleToggleTextActiveVdo: {
    color: '#6b21a8',
    fontWeight: '900',
  },
  quickOfficialBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  quickOfficialTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#6b21a8',
    letterSpacing: 0.5,
  },
  directIasBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 8,
    borderRadius: RADIUS.md,
  },
  directIasTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#92400e',
  },
  directIasSub: {
    fontSize: 9,
    color: '#b45309',
  },
  directVdoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#faf5ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
    padding: 8,
    borderRadius: RADIUS.md,
  },
  directVdoTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#6b21a8',
  },
  directVdoSub: {
    fontSize: 9,
    color: '#7e22ce',
  },
  officialSubmitBtn: {
    backgroundColor: '#4c1d95',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  officialSubmitBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
});

// Step 3 & 4 Sub-styles
const stepStyles = StyleSheet.create({
  stepTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  stepSubtitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  userIdeaCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#4ade80',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: 6,
    ...SHADOW.xs,
  },
  userIdeaBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userIdeaTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  userIdeaTypeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  feasibilityBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  feasibilityText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.white,
  },
  userIdeaName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#14532d',
  },
  userIdeaDesc: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#166534',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: RADIUS.md,
    marginTop: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  statLblText: {
    fontSize: 8,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  sectionHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fffbeb',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400e',
    flex: 1,
  },
  oppCardsList: {
    gap: 8,
  },
  oppCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 10,
    gap: 6,
    ...SHADOW.xs,
  },
  oppCardSelected: {
    backgroundColor: '#f0fdf4',
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  oppCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  oppRankNum: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primary,
  },
  oppCardName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  oppCardCategory: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  roiBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  roiText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#15803d',
  },
  whyRecText: {
    fontSize: 9,
    color: COLORS.textSecondary,
    backgroundColor: '#f8fafc',
    padding: 6,
    borderRadius: RADIUS.sm,
    lineHeight: 13,
  },
  oppMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  metaPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#047857',
  },
  analyzingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  analyzingText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  finalSummaryCard: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: 8,
  },
  summaryAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryAvatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
  },
  summaryName: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  summaryContact: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  summaryLocation: {
    fontSize: 9,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  summaryDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
});
