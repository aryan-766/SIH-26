import React, { useState, useEffect } from 'react';
import { 
  Compass, Calculator, Landmark, CheckSquare, TrendingUp, User, 
  ChevronRight, ArrowLeft, Download, ShieldCheck, AlertCircle, 
  Sparkles, Layers, FileText, CheckCircle2, PhoneCall, RefreshCw, Send,
  MapPin, Check, Globe, Mic, Lock, Smartphone, Building, MessageSquare, Bot, LogOut,
  LogIn, UserCheck, Phone, Store
} from 'lucide-react';
import { MobileFrame } from './components/MobileFrame';
import { VoiceMicButton } from './components/VoiceMicButton';
import { VoiceNarrator } from './components/VoiceNarrator';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { FacilityRadar } from './components/FacilityRadar';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { FieldOfficerPortal } from './components/FieldOfficerPortal';
import { CitizenAdvisorChat } from './components/CitizenAdvisorChat';
import { GovernmentSchemesHub } from './components/GovernmentSchemesHub';
import { OverviewSection } from './components/OverviewSection';
import { FinanceDprHub } from './components/FinanceDprHub';
import { 
  BeneficiaryProfile, 
  getSavedBeneficiaryProfile, 
  saveBeneficiaryProfile, 
  subscribeToStore,
  getSavedAppRole,
  saveAppRole,
  getRegisteredEntrepreneurs,
  findRegisteredEntrepreneur,
  registerNewEntrepreneur,
  getActiveEntrepreneurSession,
  saveActiveEntrepreneurSession,
  clearActiveEntrepreneurSession,
  RegisteredEntrepreneur
} from './services/enterpriseStore';
import { 
  getAllStates, 
  getDistrictsByState, 
  getDistrictById, 
  getBlocksByDistrict, 
  getVillagesByBlock, 
  findVillageDetails,
  PAN_INDIA_GEOGRAPHY,
  DistrictData,
  GramPanchayat
} from './services/indiaPanPanchayatData';
import { translations, Language } from './locales';
import * as api from './services/api';

export default function App() {
  const [lang, setLang] = useState<Language>('hi');
  const t = translations[lang] || translations.hi;
  const isEn = lang === 'en';
  const isMr = lang === 'mr';
  const isTa = lang === 'ta';

  // Top-Level App Role: 'entrepreneur' | 'field_officer'
  const [appRole, setAppRole] = useState<'entrepreneur' | 'field_officer'>(getSavedAppRole());

  // Active Entrepreneur Session (Persistent)
  const activeSession = getActiveEntrepreneurSession();
  const savedProf = activeSession || getSavedBeneficiaryProfile();

  // Authentication State: 'signin' | 'signup'
  const [isOnboarded, setIsOnboarded] = useState<boolean>(!!activeSession);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [pinInput, setPinInput] = useState<string>('1234');
  const [rememberSession, setRememberSession] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sign In / Profile fields
  const [citizenFullName, setCitizenFullName] = useState(savedProf?.fullName || 'Ramesh Kumar Yadav');
  const [phoneNumber, setPhoneNumber] = useState(savedProf?.phone || '9876543210');
  const [otpCode, setOtpCode] = useState('1234');
  const [consentChecked, setConsentChecked] = useState(true);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Selected State and District for Pan-India hierarchy
  const [selectedStateCode, setSelectedStateCode] = useState<string>(savedProf?.stateCode || 'UP');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(savedProf?.districtId || 'dist_gorakhpur');

  // Beneficiary Profile State (Dynamic & Persisted)
  const [userProfile, setUserProfile] = useState<BeneficiaryProfile>({
    fullName: savedProf?.fullName || 'Ramesh Kumar Yadav',
    phone: savedProf?.phone || '9876543210',
    capital: savedProf?.capital || 80000,
    skills: savedProf?.skills || ['Dairy Farming', 'Agriculture'],
    spaceSqft: savedProf?.spaceSqft || 600,
    socialCategory: savedProf?.socialCategory || 'OBC',
    stateCode: savedProf?.stateCode || 'UP',
    districtId: savedProf?.districtId || 'dist_gorakhpur',
    districtName: savedProf?.districtName || 'Gorakhpur (गोरखपुर)',
    blockId: savedProf?.blockId || 'blk_sahjanwa',
    blockName: savedProf?.blockName || 'Sahjanwa',
    villageId: savedProf?.villageId || 'vil_bhiti',
    villageName: savedProf?.villageName || 'Bhiti Rawat',
    selectedBizId: savedProf?.selectedBizId || 'dairy_farming',
    selectedBizName: savedProf?.selectedBizName || 'Dairy Farming & Chilling Center',
    businessStatus: savedProf?.businessStatus || 'Operational'
  });

  // Selected Business Opportunity
  const [selectedBizId, setSelectedBizId] = useState<string>('dairy_farming');
  const [customBizInput, setCustomBizInput] = useState<string>('');
  const [bizCategoryFilter, setBizCategoryFilter] = useState<'all' | 'agro' | 'livestock' | 'services' | 'mfg'>('all');

  // GPS Auto-detect Simulation
  const [gpsDetected, setGpsDetected] = useState<boolean>(false);

  // App Navigation Flow after onboarding
  // 'overview' | 'discovery' | 'radar' | 'compare' | 'feasibility' | 'finance' | 'schemes' | 'dpr' | 'launch' | 'copilot' | 'field_officer' | 'profile'
  const [currentScreen, setCurrentScreen] = useState<string>('overview');

  // Default Pan-India Rural Business Opportunities (Guarantees zero empty state)
  const DEFAULT_OPPORTUNITIES = [
    {
      id: 'dairy_farming',
      name: 'Dairy Farming & Bulk Milk Chilling Center',
      name_hi: 'डेयरी फार्मिंग एवं दुग्ध शीतलन केंद्र',
      sector: 'Livestock & Agro Allied',
      recommended_capital: 480000,
      expected_margin_pct: 21.8,
      risk_level: 'Low to Moderate',
      risk_level_hi: 'कम से मध्यम',
      match_score: 96,
      equipment: ['BMC Chilling Unit (200L)', 'Milking Machine', 'Milk Analyzer', 'Inverter Backup']
    },
    {
      id: 'food_processing',
      name: 'Mustard Oil Expeller & Flour Processing Unit',
      name_hi: 'सरसों तेल स्पेलर एवं आटा चक्की प्रसंस्करण',
      sector: 'Food Processing & Value Addition',
      recommended_capital: 350000,
      expected_margin_pct: 24.5,
      risk_level: 'Low',
      risk_level_hi: 'निम्न जोखिम',
      match_score: 91,
      equipment: ['Cold Press Oil Expeller', 'Flour Pulverizer', 'Packaging Sealer', 'Weighing Scale']
    },
    {
      id: 'solar_ev_repair',
      name: 'Solar Panel Installation & EV Repair Center',
      name_hi: 'सोलर रूफटॉप एवं ई-रिक्शा सर्विस सेंटर',
      sector: 'Clean Energy & Technical Services',
      recommended_capital: 220000,
      expected_margin_pct: 28.0,
      risk_level: 'Moderate',
      risk_level_hi: 'मध्यम',
      match_score: 87,
      equipment: ['Digital Multimeter', 'Battery Capacity Tester', 'Tooling Kit', 'Soldering Station']
    },
    {
      id: 'mushroom_farming',
      name: 'Oyster & Button Mushroom Cultivation',
      name_hi: 'ऑयस्टर एवं बटन मशरूम उत्पादन इकाई',
      sector: 'Horticulture & Commercial Agriculture',
      recommended_capital: 180000,
      expected_margin_pct: 32.0,
      risk_level: 'Moderate',
      risk_level_hi: 'मध्यम',
      match_score: 84,
      equipment: ['Autoclave / Boiler', 'Humidifier System', 'Incubation Racks', 'Sterilizer']
    },
    {
      id: 'honey_processing',
      name: 'Organic Honey Extraction & Apiary Farm',
      name_hi: 'शुद्ध शहद निष्कर्षण एवं मधुमक्खी पालन',
      sector: 'Beekeeping & Forest Produce',
      recommended_capital: 150000,
      expected_margin_pct: 30.0,
      risk_level: 'Low',
      risk_level_hi: 'निम्न जोखिम',
      match_score: 89,
      equipment: ['Bee Boxes (50 Units)', 'Honey Extractor Centrifuge', 'Wax Sheet Roller', 'Food Grade Jars']
    },
    {
      id: 'apparel_tailoring',
      name: 'Rural Garment & School Uniform Manufacturing',
      name_hi: 'ग्रामीण वस्त्र सिलाई एवं स्कूल यूनिफॉर्म इकाई',
      sector: 'Textile & Apparel Crafts',
      recommended_capital: 190000,
      expected_margin_pct: 26.5,
      risk_level: 'Low',
      risk_level_hi: 'निम्न जोखिम',
      match_score: 85,
      equipment: ['Industrial Sewing Machines (4)', 'Overlock Machine', 'Cutting Table', 'Steam Iron']
    }
  ];

  // Discovery Opportunities List (Initialized with rich defaults)
  const [opportunities, setOpportunities] = useState<any[]>(DEFAULT_OPPORTUNITIES);
  const [gisRadar, setGisRadar] = useState<any>(null);
  const [radarRadius, setRadarRadius] = useState<number>(5.0);
  const [comparisonData, setComparisonData] = useState<{ businesses: any[]; matrix: any[] }>({ businesses: [], matrix: [] });

  // Module 2: Financial Planner State
  const [finances, setFinances] = useState<any>(null);
  const [customTotalCost, setCustomTotalCost] = useState<number>(250000);
  const [customOwnContrib, setCustomOwnContrib] = useState<number>(50000);
  const [customMoratorium, setCustomMoratorium] = useState<number>(3);
  const [dprDoc, setDprDoc] = useState<any>(null);

  // Scheme Hub State
  const [schemes, setSchemes] = useState<any[]>([]);

  // Launch Checklist State
  const [checklist, setChecklist] = useState<any[]>([]);

  // Module 3: Copilot State
  const [copilotData, setCopilotData] = useState<any>(null);
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotAdvice, setCopilotAdvice] = useState<string | null>(null);
  const [txForm, setTxForm] = useState({ 
    type: 'income', 
    category: 'milk_sale', 
    amount: '960', 
    desc: '24L milk supply @ ₹40/L' 
  });

  // Field Officer Offline Mode
  const [offlineSurveys, setOfflineSurveys] = useState<any[]>([
    { name: "Kishori Lal", village: "Bhiti", capital: 45000, skill: "Poultry", synced: false }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    loadDiscoveryData();
    loadGisRadar(5.0);
    loadComparisonData();
    loadFinancialPlan();
    loadSchemes();
    loadLaunchChecklist();
    loadCopilotData();
  }, [selectedBizId, userProfile.capital, userProfile.villageId]);

  const loadDiscoveryData = async () => {
    try {
      const res = await api.getOpportunities(userProfile.capital, userProfile.skills, userProfile.spaceSqft, userProfile.villageId);
      setOpportunities(res.opportunities || []);
    } catch (e) {
      console.warn(e);
    }
  };

  const loadGisRadar = async (radius: number) => {
    try {
      setRadarRadius(radius);
      const res = await api.getGisRadar(radius, userProfile.villageId);
      setGisRadar(res);
    } catch (e) {
      console.warn(e);
    }
  };

  const loadComparisonData = async () => {
    try {
      const res = await api.compareBusinesses('dairy_farming,food_processing,mobile_solar_repair');
      setComparisonData({ businesses: res.businesses, matrix: res.comparison_matrix });
    } catch (e) {
      console.warn(e);
    }
  };

  const loadFinancialPlan = async () => {
    try {
      const res = await api.simulateFinances({
        category_id: selectedBizId,
        total_project_cost: customTotalCost,
        own_contribution: customOwnContrib,
        interest_rate_pct: 9.5,
        tenure_years: 5,
        moratorium_months: customMoratorium,
        is_rural: true,
        social_category: userProfile.socialCategory
      });
      setFinances(res);
    } catch (e) {
      console.warn(e);
    }
  };

  const loadSchemes = async () => {
    try {
      const res = await api.getSchemes(customTotalCost - customOwnContrib, userProfile.socialCategory, 'Dairy');
      setSchemes(res || []);
    } catch (e) {
      console.warn(e);
    }
  };

  const loadLaunchChecklist = async () => {
    try {
      const res = await api.getLaunchChecklist(selectedBizId);
      setChecklist(res.steps || []);
    } catch (e) {
      console.warn(e);
    }
  };

  const loadCopilotData = async () => {
    try {
      const res = await api.getCopilotOverview('app_101');
      setCopilotData(res);
    } catch (e) {
      console.warn(e);
    }
  };

  // One-Tap Quick Login with Pre-seeded Account
  const handleQuickLogin = (acc: RegisteredEntrepreneur) => {
    setPhoneNumber(acc.phone);
    setPinInput(acc.pin);
    setCitizenFullName(acc.fullName);
    setSelectedStateCode(acc.profile.stateCode || 'UP');
    setSelectedDistrictId(acc.profile.districtId);
    setSelectedBizId(acc.profile.selectedBizId);
    setUserProfile(acc.profile);
    if (rememberSession) {
      saveActiveEntrepreneurSession(acc.profile);
    }
    setIsOnboarded(true);
    setCurrentScreen('discovery');
  };

  // Sign In Form Submission
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const existing = findRegisteredEntrepreneur(phoneNumber);
    if (existing) {
      setUserProfile(existing.profile);
      setCitizenFullName(existing.fullName);
      setSelectedStateCode(existing.profile.stateCode || 'UP');
      setSelectedDistrictId(existing.profile.districtId);
      setSelectedBizId(existing.profile.selectedBizId);
      if (rememberSession) {
        saveActiveEntrepreneurSession(existing.profile);
      }
      setIsOnboarded(true);
      setCurrentScreen('discovery');
    } else {
      // Auto-provision dynamic profile for this number
      const effectiveName = citizenFullName.trim() || 'Rural Entrepreneur';
      const newProf: BeneficiaryProfile = {
        ...userProfile,
        fullName: effectiveName,
        phone: phoneNumber
      };
      setUserProfile(newProf);
      const newAcc: RegisteredEntrepreneur = {
        id: `ent_${Date.now()}`,
        phone: phoneNumber,
        pin: pinInput || '1234',
        fullName: effectiveName,
        businessSummary: `${newProf.selectedBizName} (${newProf.districtName})`,
        profile: newProf
      };
      registerNewEntrepreneur(newAcc);
      if (rememberSession) {
        saveActiveEntrepreneurSession(newProf);
      }
      setIsOnboarded(true);
      setCurrentScreen('discovery');
    }
  };

  // Sign Up Form Submission
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const effectiveName = citizenFullName.trim() || 'Rural Entrepreneur';
    const distObj = getDistrictById(selectedDistrictId);
    const blockObj = distObj?.blocks.find(b => b.id === userProfile.blockId) || distObj?.blocks[0];
    const vilObj = blockObj?.villages.find(v => v.id === userProfile.villageId) || blockObj?.villages[0];

    const newProf: BeneficiaryProfile = {
      ...userProfile,
      fullName: effectiveName,
      phone: phoneNumber,
      stateCode: selectedStateCode,
      districtId: selectedDistrictId,
      districtName: distObj?.name || 'Gorakhpur',
      blockId: blockObj?.id || '',
      blockName: blockObj?.name || '',
      villageId: vilObj?.id || '',
      villageName: vilObj?.name || '',
      selectedBizId,
      businessStatus: 'Planning'
    };
    setUserProfile(newProf);
    const newAcc: RegisteredEntrepreneur = {
      id: `ent_${Date.now()}`,
      phone: phoneNumber,
      pin: pinInput || '1234',
      fullName: effectiveName,
      businessSummary: `${newProf.selectedBizName} (${newProf.districtName})`,
      profile: newProf
    };
    registerNewEntrepreneur(newAcc);
    if (rememberSession) {
      saveActiveEntrepreneurSession(newProf);
    }
    setIsOnboarded(true);
    setCurrentScreen('discovery');
  };

  // Logout Handler
  const handleLogout = () => {
    clearActiveEntrepreneurSession();
    setIsOnboarded(false);
    setAuthMode('signin');
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSignInSubmit(e as any);
  };

  const handleVoiceCommand = async (transcript: string) => {
    try {
      const langCode = lang === 'en' ? 'en-IN' : (lang === 'mr' ? 'mr-IN' : (lang === 'ta' ? 'ta-IN' : 'hi-IN'));
      const res = await api.parseVoiceQuery(transcript, langCode);
      if (res.extracted_entities?.capital_estimate) {
        setUserProfile(prev => ({ ...prev, capital: res.extracted_entities.capital_estimate }));
      }
      if (res.extracted_entities?.target_sector) {
        const sector = res.extracted_entities.target_sector.toLowerCase();
        if (sector.includes('dairy')) setSelectedBizId('dairy_farming');
        else if (sector.includes('food') || sector.includes('oil') || sector.includes('masala')) setSelectedBizId('food_processing');
        else setSelectedBizId('mobile_solar_repair');
      }
      if (!isOnboarded) {
        setAuthMode('signup');
      } else {
        setCurrentScreen('discovery');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleGpsDetect = () => {
    setGpsDetected(true);
    setSelectedStateCode('UP');
    setSelectedDistrictId('dist_gorakhpur');
    setUserProfile(prev => ({
      ...prev,
      stateCode: 'UP',
      districtId: 'dist_gorakhpur',
      districtName: 'Gorakhpur',
      blockId: 'blk_sahjanwa',
      blockName: 'Sahjanwa',
      villageId: 'vil_bhiti',
      villageName: 'Bhiti Rawat'
    }));
  };

  const handleFinishOnboarding = () => {
    setIsOnboarded(true);
    setCurrentScreen('discovery');
    saveBeneficiaryProfile(userProfile);
    loadDiscoveryData();
    loadGisRadar(5.0);
  };

  const handleRestartWizard = () => {
    setIsOnboarded(false);
    setAuthMode('signin');
  };

  const handleGenerateDpr = async () => {
    try {
      const res = await api.generateDpr({
        category_id: selectedBizId,
        total_project_cost: customTotalCost,
        own_contribution: customOwnContrib,
        interest_rate_pct: 9.5,
        tenure_years: 5,
        moratorium_months: customMoratorium,
        is_rural: true,
        social_category: userProfile.socialCategory
      });
      setDprDoc(res);
      setCurrentScreen('dpr');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAskCopilot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!copilotQuery.trim()) return;
    try {
      const res = await api.askCopilotAdvisor(copilotQuery);
      setCopilotAdvice(res.copilot_advice);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAddTx = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addDailyTransaction({
        application_id: 'app_101',
        type: txForm.type,
        category: txForm.category,
        amount: parseFloat(txForm.amount) || 500,
        description: txForm.desc
      });
      loadCopilotData();
      setTxForm(prev => ({ ...prev, amount: '' }));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSyncOffline = async () => {
    setIsSyncing(true);
    try {
      await api.syncOfflineSurveys('officer_field_sahjanwa', offlineSurveys);
      setOfflineSurveys(prev => prev.map(s => ({ ...s, synced: true })));
      setTimeout(() => setIsSyncing(false), 1200);
    } catch (e) {
      setIsSyncing(false);
    }
  };

  if (appRole === 'field_officer') {
    return (
      <MobileFrame>
        {/* Top Official Header */}
        <div className="bg-purple-950 text-white px-4 py-3 border-b border-purple-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              🏛️
            </div>
            <div>
              <h1 className="text-xs font-black tracking-wide">
                {lang === 'hi' ? 'ग्रामउद्यम • फील्ड ऑफिसर मोड' :
                 lang === 'mr' ? 'ग्रामउद्यम • फील्ड ऑफिसर मोड' :
                 lang === 'ta' ? 'கிராமஉத்யோக் • கள அதிகாரி முறை' :
                 'GramUdyam • Field Officer Mode'}
              </h1>
              <p className="text-[10px] text-purple-200">
                {lang === 'hi' ? 'पंचायत नोडल पोर्टल एवं अधिकार क्षेत्र हब' :
                 lang === 'mr' ? 'पंचायत नोडल पोर्टल व कार्यक्षेत्र केंद्र' :
                 lang === 'ta' ? 'பஞ்சாயத்து நோடல் போர்டல் & அதிகார வரம்பு தளம்' :
                 'Panchayat Nodal Portal & Jurisdiction Hub'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
            <button
              onClick={() => {
                setAppRole('entrepreneur');
                saveAppRole('entrepreneur');
              }}
              className="text-[11px] font-bold bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-xl text-white transition flex items-center gap-1 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>
                {lang === 'hi' ? 'उद्यमी ऐप' :
                 lang === 'mr' ? 'उद्योजक ॲप' :
                 lang === 'ta' ? 'தொழில்முனைவோர் செயலி' :
                 'Entrepreneur App'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 p-3 pb-8 overflow-y-auto">
          <FieldOfficerPortal 
            onSwitchToCitizen={() => {
              setAppRole('entrepreneur');
              saveAppRole('entrepreneur');
            }} 
            currentLang={lang}
            onLanguageChange={setLang}
          />
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      {/* Top Mobile Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rural-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            🌾
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none">{t.appName}</h1>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {isOnboarded ? t.userVillage : 'National Rural Enterprise Mission'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isOnboarded ? (
            <>
              <button
                onClick={() => {
                  setAppRole('field_officer');
                  saveAppRole('field_officer');
                }}
                className="text-[10px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 px-2 py-1 rounded-xl transition flex items-center gap-1 shadow-xs"
                title="Switch to Field Officer Mode"
              >
                <span>👮</span>
                <span>{lang === 'hi' ? 'अधिकारी' : 'Officer'}</span>
              </button>
              <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
              <VoiceMicButton 
                onTranscript={handleVoiceCommand} 
                language={lang === 'en' ? 'en-IN' : (lang === 'mr' ? 'mr-IN' : (lang === 'ta' ? 'ta-IN' : 'hi-IN'))} 
              />
              <button
                onClick={handleLogout}
                className="text-[10px] font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 p-1.5 rounded-xl transition shadow-xs"
                title="Sign Out / Exit"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
            </>
          )}
        </div>
      </div>

      {/* Main Body Flow */}
      <div className="flex-1 p-3 pb-20 space-y-4 overflow-y-auto">

        {/* ------------------------------------------------------------- */}
        {/* AUTHENTICATION: SIGN IN VS SIGN UP (NO RE-ONBOARDING LOOP)   */}
        {/* ------------------------------------------------------------- */}
        {!isOnboarded && (
          <div className="space-y-4 pt-1">
            {/* Header / Brand Banner */}
            <div className="text-center space-y-1.5 py-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rural-600 to-emerald-700 text-white shadow-md shadow-rural-600/20 text-2xl">
                🌾
              </div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                {isEn ? 'GramUdyam Citizen Portal' : 'ग्रामउद्यम नागरिक पोर्टल'}
              </h1>
              <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                {isEn 
                  ? 'AI-Powered Rural Enterprise & Government Subsidy Engine' 
                  : 'ग्रामीण सूक्ष्म-उद्यम विकास एवं सरकारी सब्सिडी पोर्टल'}
              </p>
            </div>

            {/* Auth Mode Toggle Segmented Control */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center shadow-inner border border-slate-200">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'signin'
                    ? 'bg-white text-rural-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isEn ? 'Sign In (मौजूदा उद्यमी)' : 'लॉगिन (मौजूदा उद्यमी)'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'signup'
                    ? 'bg-white text-rural-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isEn ? 'Sign Up (नया खाता)' : 'नया खाता (पंजीकरण)'}</span>
              </button>
            </div>

            {authError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-xs text-rose-700 font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{authError}</span>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* SIGN IN TAB: 1-TAP PROFILES & PHONE/PIN LOGIN                     */}
            {/* ----------------------------------------------------------------- */}
            {authMode === 'signin' && (
              <div className="space-y-4">
                {/* 1-Tap Quick Login Carousel/Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isEn ? '1-Tap Demo Profiles (No Typing Required):' : '1-टैप त्वरित लॉगिन (प्रोफ़ाइल चुनें):'}</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {isEn ? 'Auto-Sync' : 'ऑटो-सिंक'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {getRegisteredEntrepreneurs().map((ent) => (
                      <button
                        key={ent.id}
                        type="button"
                        onClick={() => handleQuickLogin(ent)}
                        className="w-full text-left p-3 rounded-2xl border border-slate-200 bg-white hover:border-rural-500 hover:shadow-md transition-all group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-rural-50 border border-rural-200 text-rural-700 flex items-center justify-center font-bold text-sm group-hover:bg-rural-600 group-hover:text-white transition-colors">
                            {ent.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-rural-700">
                              {ent.fullName}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              📱 {ent.phone} • {ent.profile.districtName}
                            </div>
                            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                              💼 {ent.businessSummary}
                            </div>
                          </div>
                        </div>
                        <div className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600 group-hover:bg-rural-600 group-hover:text-white transition">
                          {isEn ? 'Login →' : 'प्रवेश →'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isEn ? 'Or Login With Phone & PIN' : 'या फ़ोन नंबर व पिन से लॉगिन करें'}
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Direct Phone & PIN Form */}
                <form onSubmit={handleSignInSubmit} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isEn ? 'Mobile Phone Number' : 'मोबाइल नंबर'}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 px-2.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="flex-1 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-rural-600 focus:outline-none focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isEn ? '4-Digit Access PIN' : '4-अंकीय एक्सेस पिन'}</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Default: 1234</span>
                    </div>
                    <input
                      type="password"
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full text-center tracking-[0.5em] text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-rural-600 focus:outline-none focus:bg-white"
                      required
                    />
                  </div>

                  {/* Remember Me Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="w-4 h-4 rounded text-rural-600 focus:ring-rural-500 border-slate-300"
                    />
                    <span className="text-[11px] text-slate-600 font-medium">
                      {isEn ? 'Keep me signed in on this device (Never ask again)' : 'इस डिवाइस पर लॉगिन रखें (बार-बार लॉगिन न पूछें)'}
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-3 bg-rural-600 hover:bg-rural-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rural-600/20 transition flex items-center justify-center gap-2 mt-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isEn ? 'Sign In to Enterprise Hub' : 'उद्यम डैशबोर्ड में प्रवेश करें'}</span>
                  </button>
                </form>

                {/* Footer Switch */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="text-xs text-rural-700 font-bold hover:underline"
                  >
                    {isEn ? "Don't have an enterprise registered yet? Create Account →" : "अभी तक कोई उद्यम पंजीकृत नहीं है? नया खाता बनाएं →"}
                  </button>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* SIGN UP TAB: PAN-INDIA 28 STATES & 800 DISTRICTS REGISTRATION     */}
            {/* ----------------------------------------------------------------- */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-rural-600" />
                    <span>{isEn ? 'Register Rural Enterprise Profile' : 'नया ग्रामीण उद्यम पंजीकरण'}</span>
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {isEn ? 'All 28 States, 780+ Districts & Panchayats connected' : 'देश के सभी 28 राज्य, 783 ज़िले एवं पंचायतें उपलब्ध हैं'}
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    {isEn ? 'Entrepreneur Full Name' : 'उद्यमी का पूरा नाम'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={citizenFullName}
                    onChange={(e) => setCitizenFullName(e.target.value)}
                    placeholder={isEn ? 'e.g. Ramesh Kumar Yadav' : 'उदा. रमेश कुमार यादव'}
                    className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-rural-600 focus:outline-none focus:bg-white"
                  />
                </div>

                {/* Phone Number & PIN */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      {isEn ? 'Mobile Phone' : 'मोबाइल नंबर'} *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-rural-600 focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      {isEn ? 'Set 4-Digit PIN' : '4-अंकीय पिन'} *
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234"
                      className="w-full text-center tracking-widest text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-rural-600 focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                {/* Pan-India Geography Selection */}
                <div className="space-y-2.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rural-600" />
                      <span>{isEn ? 'Pan-India Enterprise Location' : 'उद्यम का भौगोलिक स्थान (अखिल भारतीय)'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setGpsDetected(true);
                        setSelectedStateCode('UP');
                        setSelectedDistrictId('dist_gorakhpur');
                      }}
                      className="text-[10px] text-rural-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>📍 {isEn ? 'Auto GPS' : 'ऑटो GPS'}</span>
                    </button>
                  </div>

                  {/* State Dropdown: 28 States & 8 UTs */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                      {isEn ? '1. State / Union Territory' : '१. राज्य / केंद्र शासित प्रदेश'} ({getAllStates().length} Total)
                    </label>
                    <select
                      value={selectedStateCode}
                      onChange={(e) => {
                        const newSt = e.target.value;
                        setSelectedStateCode(newSt);
                        const dists = getDistrictsByState(newSt);
                        if (dists.length > 0) {
                          setSelectedDistrictId(dists[0].id);
                          setUserProfile(prev => ({
                            ...prev,
                            stateCode: newSt,
                            districtId: dists[0].id,
                            districtName: dists[0].name,
                            blockId: dists[0].blocks[0]?.id || '',
                            blockName: dists[0].blocks[0]?.name || '',
                            villageId: dists[0].blocks[0]?.villages[0]?.id || '',
                            villageName: dists[0].blocks[0]?.villages[0]?.name || ''
                          }));
                        }
                      }}
                      className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-2.5 focus:border-rural-600 focus:outline-none"
                    >
                      {getAllStates().map(st => (
                        <option key={st.code} value={st.code}>
                          {st.name} ({st.code}) - {st.districts.length} Districts
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Dropdown: All 783 Official Districts */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                      {isEn ? '2. District (Assigned Collector & DM)' : '२. ज़िला (अधिकृत ज़िलाधिकारी)'}
                    </label>
                    <select
                      value={selectedDistrictId}
                      onChange={(e) => {
                        const dId = e.target.value;
                        setSelectedDistrictId(dId);
                        const dObj = getDistrictById(dId);
                        if (dObj) {
                          setUserProfile(prev => ({
                            ...prev,
                            districtId: dId,
                            districtName: dObj.name,
                            blockId: dObj.blocks[0]?.id || '',
                            blockName: dObj.blocks[0]?.name || '',
                            villageId: dObj.blocks[0]?.villages[0]?.id || '',
                            villageName: dObj.blocks[0]?.villages[0]?.name || ''
                          }));
                        }
                      }}
                      className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-2.5 focus:border-rural-600 focus:outline-none"
                    >
                      {getDistrictsByState(selectedStateCode).map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} (DM: {d.assignedIas.name}, {d.assignedIas.cadre})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Block & Village Dropdowns */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        {isEn ? '3. Block / Tehsil' : '३. ब्लॉक / तहसील'}
                      </label>
                      <select
                        value={userProfile.blockId}
                        onChange={(e) => {
                          const bId = e.target.value;
                          const blocks = getBlocksByDistrict(selectedDistrictId);
                          const bObj = blocks.find(b => b.id === bId);
                          if (bObj) {
                            setUserProfile(prev => ({
                              ...prev,
                              blockId: bId,
                              blockName: bObj.name,
                              villageId: bObj.villages[0]?.id || '',
                              villageName: bObj.villages[0]?.name || ''
                            }));
                          }
                        }}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-2 focus:border-rural-600 focus:outline-none"
                      >
                        {getBlocksByDistrict(selectedDistrictId).map(b => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        {isEn ? '4. Gram Panchayat' : '४. ग्राम पंचायत'}
                      </label>
                      <select
                        value={userProfile.villageId}
                        onChange={(e) => {
                          const vId = e.target.value;
                          const vils = getVillagesByBlock(selectedDistrictId, userProfile.blockId);
                          const vObj = vils.find(v => v.id === vId);
                          if (vObj) {
                            setUserProfile(prev => ({
                              ...prev,
                              villageId: vId,
                              villageName: vObj.name
                            }));
                          }
                        }}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-2 focus:border-rural-600 focus:outline-none"
                      >
                        {getVillagesByBlock(selectedDistrictId, userProfile.blockId).map(v => (
                          <option key={v.id} value={v.id}>
                            {v.name} (LGD: {v.lgdCode})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Business Sector Intent */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    {isEn ? 'Intended Business Sector' : 'प्रस्तावित व्यवसाय क्षेत्र'}
                  </label>
                  <select
                    value={selectedBizId}
                    onChange={(e) => setSelectedBizId(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-rural-600 focus:outline-none focus:bg-white"
                  >
                    <option value="dairy_farming">🥛 Dairy Farming & Milk Collection (डेयरी फार्मिंग)</option>
                    <option value="food_processing">🌾 Agro & Food Processing / Dal Mill (खाद्य प्रसंस्करण)</option>
                    <option value="mobile_solar_repair">☀️ Solar Pump & Mobile Electric Repair (सोलर रिपेयरिंग)</option>
                    <option value="polyhouse_farming">🌱 Hi-Tech Polyhouse & Floriculture (पॉलीहाउस खेती)</option>
                    <option value="handloom_weaving">🧵 Khadi & Handloom Weaving (हथकरघा एवं बुनाई)</option>
                    <option value="cold_storage">❄️ Solar Cold Storage & Warehousing (कोल्ड स्टोरेज)</option>
                  </select>
                </div>

                {/* Available Capital */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    {isEn ? 'Self Investment / Available Capital' : 'स्वयं की उपलब्ध पूंजी (पूंजी क्षमता)'}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[25000, 50000, 80000, 150000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setUserProfile(p => ({ ...p, capital: amt }))}
                        className={`py-2 text-xs rounded-xl font-bold border transition ${
                          userProfile.capital === amt
                            ? 'bg-rural-600 text-white border-rural-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        ₹{(amt / 1000)}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="w-4 h-4 rounded text-rural-600 focus:ring-rural-500 border-slate-300"
                  />
                  <span className="text-[11px] text-slate-600 font-medium">
                    {isEn ? 'Remember my session permanently (Auto-login on visit)' : 'मेरा सत्र सुरक्षित रखें (बार-बार पंजीकरण या लॉगिन न पूछें)'}
                  </span>
                </label>

                {/* Submit Sign Up */}
                <button
                  type="submit"
                  className="w-full py-3 bg-rural-600 hover:bg-rural-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rural-600/20 transition flex items-center justify-center gap-2 mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isEn ? 'Create Account & Launch Dashboard' : 'खाता बनाएं एवं उद्यम डैशबोर्ड खोलें'}</span>
                </button>
                {/* Switch to Sign In */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="text-xs text-rural-700 font-bold hover:underline"
                  >
                    {isEn ? 'Already registered? Sign In to your profile →' : 'पहले से पंजीकृत हैं? अपने खाते में लॉगिन करें →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 5: ONBOARDED ENTERPRISE HUB (ALL SCREENS & RADAR)         */}
        {/* ------------------------------------------------------------- */}
        {isOnboarded && (
          <>
            {/* DPDP Act 2023 Consent & Dev OTP Badge */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 flex items-center justify-between text-[10px] text-emerald-900 font-medium shadow-xs">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.dpdpComplianceText}</span>
              </span>
              <span className="bg-emerald-200/70 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">
                {t.demoOtpText}
              </span>
            </div>

            {/* Profile Card Banner */}
            <div className="bg-gradient-to-r from-rural-700 to-rural-600 text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-semibold">
                  {t.beneficiaryProfile}
                </span>
                <h2 className="text-sm font-bold mt-0.5">{userProfile.fullName || 'Rural Entrepreneur'}</h2>
                <div className="flex gap-2 mt-1.5 text-[11px] text-emerald-100">
                  <span>{t.availableCapital}: <b>₹{userProfile.capital.toLocaleString()}</b></span>
                  <span>•</span>
                  <span>{userProfile.villageName}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setCurrentScreen('advisor_chat')}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white transition-colors flex items-center gap-1.5 text-[11px] font-bold shadow-xs border border-emerald-600"
                  title="Open AI Business Advisor & VDO Desk"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{isEn ? 'AI Advisor' : 'AI सलाहकार'}</span>
                </button>
                <button 
                  onClick={() => setCurrentScreen('profile')}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
                  title={t.editProfile}
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SCREEN: Profile Editor Modal */}
            {currentScreen === 'profile' && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{t.editProfile}</h3>
                  <button onClick={() => setCurrentScreen('discovery')} className="text-xs text-emerald-600 font-semibold">
                    {t.closeBtn}
                  </button>
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">{isEn ? 'Beneficiary Full Name' : 'लाभार्थी का पूरा नाम'}</label>
                  <input
                    type="text"
                    value={userProfile.fullName}
                    onChange={e => {
                      const updated = { ...userProfile, fullName: e.target.value };
                      setUserProfile(updated);
                      setCitizenFullName(e.target.value);
                      saveBeneficiaryProfile(updated);
                    }}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">{t.availableCapital}</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[25000, 50000, 80000, 150000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setUserProfile(p => ({ ...p, capital: amt }));
                          loadDiscoveryData();
                        }}
                        className={`py-1.5 text-xs rounded-lg font-medium border ${
                          userProfile.capital === amt
                            ? 'bg-rural-600 text-white border-rural-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        ₹{(amt / 1000)}k
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">{t.selectSkills}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Dairy Farming', 'Food Processing', 'Solar & Electric Repair', 'Agri Tool Rental', 'Tailoring'].map(skill => (
                      <span key={skill} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-md">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentScreen('discovery')}
                  className="w-full py-2.5 bg-rural-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-rural-700 transition-colors"
                >
                  {t.findOpportunities}
                </button>
              </div>
            )}

            {/* SCREEN 0: Comprehensive Overview Section */}
            {currentScreen === 'overview' && (
              <OverviewSection
                userProfile={userProfile}
                lang={lang}
                onNavigateToTab={(tabId) => setCurrentScreen(tabId)}
                onOpenAdvisorChat={() => setCurrentScreen('advisor_chat')}
              />
            )}

            {/* SCREEN 1: Discovery Feed (Module 1) */}
            {currentScreen === 'discovery' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>{t.recommendedBusinesses}</span>
                    </h2>
                    <p className="text-[11px] text-slate-500">{t.recommendedSubtitle}</p>
                  </div>
                  <VoiceNarrator textToSpeak={t.voiceNarrationDiscovery} />
                </div>

                {/* Opportunity Cards */}
                <div className="space-y-2.5">
                  {opportunities.map((opp) => {
                    const isSelected = selectedBizId === opp.id;
                    const displayName = isEn ? opp.name : (opp.name_hi || opp.name);
                    const displayRisk = isEn ? opp.risk_level : (opp.risk_level_hi || opp.risk_level);

                    return (
                      <div
                        key={opp.id}
                        onClick={() => setSelectedBizId(opp.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-rural-600 shadow-md ring-2 ring-rural-500/20'
                            : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-xs text-slate-900">{displayName}</h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                opp.match_score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {opp.match_score}/100 Match
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{opp.sector}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-3 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                          <div>
                            <span className="text-slate-500 block text-[10px]">{t.estimatedInvestment}</span>
                            <span className="font-bold text-slate-800">₹{(opp.recommended_capital).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">{t.expectedMargin}</span>
                            <span className="font-bold text-emerald-700">{opp.expected_margin_pct}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">{t.riskLevel}</span>
                            <span className="font-bold text-slate-800">{displayRisk}</span>
                          </div>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 truncate max-w-[200px]">
                            {t.equipment}: {opp.equipment?.slice(0, 2).join(', ')}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBizId(opp.id);
                              setCurrentScreen('feasibility');
                            }}
                            className="text-rural-700 font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span>{t.details}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Actions Row */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setCurrentScreen('radar')}
                    className="py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 hover:bg-slate-50 shadow-xs"
                  >
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>{t.viewRadar}</span>
                  </button>
                  <button
                    onClick={() => setCurrentScreen('compare')}
                    className="py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 hover:bg-slate-50 shadow-xs"
                  >
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>{t.compareOptions}</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 2: 5km/10km Facility Radar */}
            {currentScreen === 'radar' && (
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentScreen('discovery')}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 font-semibold mb-1 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.navDiscovery}</span>
                </button>

                {gisRadar && (
                  <FacilityRadar
                    facilities={gisRadar.facilities || []}
                    counts={gisRadar.counts || {}}
                    radiusKm={radarRadius}
                    onRadiusChange={loadGisRadar}
                    villageName={gisRadar.village_name || t.userVillage}
                    lang={lang}
                  />
                )}

                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isEn ? 'Radar Proximity Analysis:' : 'रडार इनसाइट्स (Radar Insights):'}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    {isEn 
                      ? "Sahjanwa Bulk Milk Chilling Center is 2.1km away with daily procurement at ₹40-42/L. Low competitor density ensures 94%+ market absorption."
                      : "आपके गांव से 2.1 किमी पर सहजनवा चिलिंग सेंटर है जहां ₹40-42/लीटर पर दूध की गारंटीकृत खरीद है।"}
                  </p>
                </div>
              </div>
            )}

            {/* SCREEN 3: Side-by-Side Comparison */}
            {currentScreen === 'compare' && (
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentScreen('discovery')}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 font-semibold mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.navDiscovery}</span>
                </button>

                <ComparisonMatrix
                  businesses={comparisonData.businesses}
                  matrix={comparisonData.matrix}
                  selectedBizId={selectedBizId}
                  onSelectBiz={(id) => {
                    setSelectedBizId(id);
                    setCurrentScreen('finance');
                  }}
                  lang={lang}
                />

                <button
                  onClick={() => setCurrentScreen('finance')}
                  className="w-full py-2.5 bg-rural-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-rural-700 flex items-center justify-center gap-1.5"
                >
                  <span>{isEn ? 'Create Financial Plan for Selected Enterprise' : 'चुने हुए व्यवसाय का वित्तीय प्लान बनाएं'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* SCREEN 4: Feasibility & SWOT Analysis */}
            {currentScreen === 'feasibility' && (
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentScreen('discovery')}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 font-semibold mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.navDiscovery}</span>
                </button>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        {isEn ? 'Feasibility & SWOT Analysis' : 'संभाव्यता एवं SWOT विश्लेषण'}
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        {isEn ? 'Dairy Farming & Milk Production' : 'डेयरी फार्मिंग एवं दुग्ध उत्पादन'}
                      </p>
                    </div>
                    <VoiceNarrator textToSpeak={t.voiceNarrationDiscovery} />
                  </div>

                  {/* SWOT Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-xl">
                      <span className="font-bold text-emerald-800 block text-[11px] mb-1">
                        {isEn ? 'Strengths (S)' : 'ताकत (Strengths)'}
                      </span>
                      <p className="text-[11px] text-emerald-950">
                        {isEn ? 'Daily cash revenue, guaranteed DCS milk collection, high local ghee/paneer demand.' : 'प्रतिदिन नकद आमदनी, पराग समिति को गारंटीकृत बिक्री, घी व पनीर की स्थानीय मांग।'}
                      </p>
                    </div>
                    <div className="bg-amber-50/70 border border-amber-200 p-2.5 rounded-xl">
                      <span className="font-bold text-amber-800 block text-[11px] mb-1">
                        {isEn ? 'Weaknesses (W)' : 'कमजोरी (Weaknesses)'}
                      </span>
                      <p className="text-[11px] text-amber-950">
                        {isEn ? 'Requires 24/7 care; milk yield sensitive to weather variations.' : '24 घंटे देखरेख जरूरी, मौसमी बीमारी में उत्पादन घटने का खतरा।'}
                      </p>
                    </div>
                    <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded-xl">
                      <span className="font-bold text-blue-800 block text-[11px] mb-1">
                        {isEn ? 'Opportunities (O)' : 'अवसर (Opportunities)'}
                      </span>
                      <p className="text-[11px] text-blue-950">
                        {isEn ? 'PMEGP 35% rural subsidy + NABARD interest subvention.' : 'PMEGP योजना में 35% सरकारी सब्सिडी एवं नाबार्ड ब्याज छूट।'}
                      </p>
                    </div>
                    <div className="bg-rose-50/70 border border-rose-200 p-2.5 rounded-xl">
                      <span className="font-bold text-rose-800 block text-[11px] mb-1">
                        {isEn ? 'Threats (T)' : 'खतरे (Threats)'}
                      </span>
                      <p className="text-[11px] text-rose-950">
                        {isEn ? 'Summer seasonal fodder inflation (+15-20%).' : 'गर्मियों में सूखे चारे की कीमतों में मौसमी बढ़ोतरी।'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentScreen('finance')}
                    className="w-full py-2.5 bg-rural-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-rural-700 flex items-center justify-center gap-1.5"
                  >
                    <span>{t.navFinances}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 5: Comprehensive Finance & 26-Section DPR Hub (Deterministic Engine) */}
            {(currentScreen === 'finance' || currentScreen === 'dpr') && (
              <FinanceDprHub
                userProfile={userProfile}
                lang={lang}
                onBackToOverview={() => setCurrentScreen('overview')}
                onSelectSchemeNavigate={(schemeId) => {
                  setCurrentScreen('schemes');
                }}
              />
            )}

            {/* SCREEN 7: Comprehensive Government Schemes & Subsidies Hub */}
            {currentScreen === 'schemes' && (
              <GovernmentSchemesHub
                lang={lang}
                userProfile={userProfile}
                onSelectSchemeForDpr={(scheme) => {
                  if (scheme.maxLoanAmount) {
                    setCustomTotalCost(Math.min(500000, scheme.maxLoanAmount));
                  }
                  setCurrentScreen('finance');
                }}
              />
            )}

            {/* SCREEN 8: Launch Checklist */}
            {currentScreen === 'launch' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                      <span>{t.checklistTitle}</span>
                    </h2>
                    <p className="text-[11px] text-slate-500">{t.checklistSubtitle}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2.5">
                  {checklist.map((step, idx) => (
                    <div
                      key={step.id}
                      onClick={() => {
                        setChecklist(prev =>
                          prev.map((s, i) =>
                            i === idx ? { ...s, status: s.status === 'completed' ? 'pending' : 'completed' } : s
                          )
                        );
                      }}
                      className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                        step.status === 'completed'
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="mt-0.5">
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xs font-bold ${step.status === 'completed' ? 'text-emerald-950 line-through' : 'text-slate-800'}`}>
                          {step.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{step.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 9: AI Copilot Dashboard */}
            {currentScreen === 'copilot' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>{t.copilotTitle}</span>
                    </h2>
                    <p className="text-[11px] text-slate-500">{t.copilotSubtitle}</p>
                  </div>
                  <VoiceNarrator textToSpeak={t.voiceNarrationCopilot} />
                </div>

                {/* Health Meter Card with Accessible Icons */}
                {copilotData && (
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black text-white ${
                          copilotData.repayment_health === 'AT RISK'
                            ? 'bg-red-600'
                            : copilotData.repayment_health === 'WATCH'
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
                        }`}>
                          {copilotData.repayment_health === 'AT RISK' ? '✗' : copilotData.repayment_health === 'WATCH' ? '⚠' : '✓'}
                        </span>
                        <span className="font-bold text-xs text-slate-900">
                          {copilotData.repayment_health === 'HEALTHY' ? (isEn ? 'HEALTHY' : 'स्वस्थ (HEALTHY)') : copilotData.repayment_health} • {copilotData.health_score}%
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <span>✓</span>
                        <span>{t.healthSurplusNotice}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-500 block">{t.dailyIncome}</span>
                        <span className="font-bold text-emerald-700">₹{copilotData.total_revenue_recorded?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">{t.dailyExpense}</span>
                        <span className="font-bold text-rose-600">₹{copilotData.total_expenses_recorded?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">{isEn ? 'Net Surplus' : 'शुद्ध बचत'}</span>
                        <span className="font-bold text-slate-900">₹{copilotData.net_surplus?.toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
                      💡 <b>{isEn ? 'Advisor:' : 'सलाह:'}</b> {copilotData.recommendation}
                    </p>
                  </div>
                )}

                {/* Daily Ledger Entry Form */}
                <form onSubmit={handleAddTx} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-900">{t.quickLedger}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={txForm.type}
                      onChange={(e) => setTxForm(p => ({ ...p, type: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium"
                    >
                      <option value="income">{isEn ? 'Sale (+)' : 'कमाई (+) बिक्री'}</option>
                      <option value="expense">{isEn ? 'Expense (-)' : 'खर्च (-) दाना/ईंधन'}</option>
                    </select>
                    <input
                      type="number"
                      placeholder={t.amountRs}
                      value={txForm.amount}
                      onChange={(e) => setTxForm(p => ({ ...p, amount: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 font-bold"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder={t.descriptionPlaceholder}
                    value={txForm.desc}
                    onChange={(e) => setTxForm(p => ({ ...p, desc: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-rural-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-rural-700"
                  >
                    {t.recordTx}
                  </button>
                </form>

                {/* Copilot Natural Language Advisory Box */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.copilotTitle}</span>
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={copilotQuery}
                      onChange={(e) => setCopilotQuery(e.target.value)}
                      placeholder={t.askAdvicePlaceholder}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleAskCopilot()}
                      className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                    >
                      {t.askAdviceBtn}
                    </button>
                  </div>

                  {copilotAdvice && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-950 mt-2">
                      <p className="leading-relaxed">{copilotAdvice}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SCREEN 10: Dedicated Field Officer Mode */}
            {currentScreen === 'field_officer' && (
              <FieldOfficerPortal 
                onSwitchToCitizen={() => setCurrentScreen('discovery')} 
                currentLang={lang}
                onLanguageChange={setLang}
              />
            )}

            {/* SCREEN 11: Citizen Advisor Chat (Direct VDO & Enterprise Support) */}
            {currentScreen === 'advisor_chat' && (
              <CitizenAdvisorChat 
                userProfile={userProfile} 
                onBack={() => setCurrentScreen('discovery')} 
                isEn={isEn} 
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation Bar (Shown when onboarded) - Govt Schemes Dead-Center */}
      {isOnboarded && (
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around sticky bottom-0 z-30 shadow-lg text-[10px] font-semibold text-slate-500">
          {/* Button 1: Overview Dashboard */}
          <button
            onClick={() => setCurrentScreen('overview')}
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              currentScreen === 'overview' ? 'text-rural-700 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{isEn ? 'Overview' : isMr ? 'विहंगावलोकन' : isTa ? 'கண்ணோட்டம்' : 'अवलोकन'}</span>
          </button>

          {/* Button 2: Finance & DPR */}
          <button
            onClick={() => setCurrentScreen('finance')}
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              currentScreen === 'finance' || currentScreen === 'dpr' ? 'text-rural-700 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{isEn ? 'Finance & DPR' : isMr ? 'वित्त व डीपीआर' : isTa ? 'நிதி & டிபிஆர்' : 'वित्त व DPR'}</span>
          </button>

          {/* Button 3: Govt Schemes (DEAD-CENTER HIGHLIGHTED) */}
          <button
            onClick={() => setCurrentScreen('schemes')}
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors relative ${
              currentScreen === 'schemes' ? 'text-rural-700 font-black scale-105' : 'hover:text-slate-900'
            }`}
          >
            <div className="relative p-1 rounded-xl bg-rural-50 text-rural-700 border border-rural-200">
              <Landmark className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rural-600 animate-ping" />
            </div>
            <span className="text-rural-900 font-black">{t.navSchemes}</span>
          </button>

          {/* Button 4: Discovery & Feasibility Radar */}
          <button
            onClick={() => setCurrentScreen('discovery')}
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
              currentScreen === 'discovery' || currentScreen === 'radar' || currentScreen === 'compare' ? 'text-rural-700 font-bold' : 'hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t.navDiscovery}</span>
          </button>

          {/* Button 5: AI Business Advisor */}
          <button
            onClick={() => setCurrentScreen('advisor_chat')}
            className={`flex flex-col items-center gap-0.5 p-1 transition-colors relative ${
              currentScreen === 'advisor_chat' ? 'text-emerald-700 font-black' : 'hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-emerald-800 font-bold">{isEn ? 'AI Advisor' : 'AI सलाहकार'}</span>
          </button>
        </div>
      )}
    </MobileFrame>
  );
}
