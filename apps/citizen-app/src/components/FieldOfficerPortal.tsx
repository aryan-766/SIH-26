import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, MapPin, Building, Users, CheckCircle2, AlertCircle, 
  MessageSquare, RefreshCw, Plus, ChevronRight, Phone, Clock, FileText,
  Search, Filter, ArrowLeft, Send, Check, Sparkles, ExternalLink, Lock,
  Award, FileCheck, Landmark, Upload, Eye, FileSpreadsheet, UserCheck
} from 'lucide-react';
import { 
  OfficerProfile, DEFAULT_FIELD_OFFICER, VillageBusiness, AdvisorThread,
  UploadedProofDoc, getAllVillageBusinesses, getBusinessesByVillage, saveVillageBusiness, 
  updateBusinessInspection, getAllAdvisorThreads, getAdvisorThreadsForVillage, 
  postAdvisorMessage, subscribeToStore, getOfficerProofDoc, saveOfficerProofDoc
} from '../services/enterpriseStore';
import {
  PAN_INDIA_GEOGRAPHY, AUTHORIZED_OFFICERS_REGISTRY, IAS_OFFICERS_REGISTRY,
  getAllStates, getDistrictsByState, getDistrictById, getBlocksByDistrict, getVillagesByBlock,
  IasOfficer, searchOfficialByGovtOrder, searchOfficialByPhoneAndRole, RegisteredOfficial
} from '../services/indiaPanPanchayatData';
import { PAN_INDIA_GOV_SCHEMES } from '../services/panIndiaSchemesData';
import { Language } from '../locales';
import { LanguageSwitcher } from './LanguageSwitcher';
import { OFFICER_I18N } from '../locales/officerTranslations';

interface FieldOfficerPortalProps {
  onSwitchToCitizen: () => void;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function FieldOfficerPortal({ 
  onSwitchToCitizen,
  currentLang = 'hi',
  onLanguageChange
}: FieldOfficerPortalProps) {
  const [selectedLang, setSelectedLang] = useState<Language>(currentLang || 'hi');

  useEffect(() => {
    if (currentLang) setSelectedLang(currentLang);
  }, [currentLang]);

  const handleLanguageChange = (l: Language) => {
    setSelectedLang(l);
    onLanguageChange?.(l);
  };

  const ot = OFFICER_I18N[selectedLang] || OFFICER_I18N.hi;

  // Persistent Officer Session Key
  const SAVED_OFFICER_SESSION_KEY = 'gramudyam_officer_session';
  const savedOfficerSession = (() => {
    try {
      const raw = localStorage.getItem(SAVED_OFFICER_SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  })();

  // Official Authentication State (Restored from session or unauthenticated)
  const [isOfficerLoggedIn, setIsOfficerLoggedIn] = useState<boolean>(!!savedOfficerSession);
  const [loginMethod, setLoginMethod] = useState<'phone_proof' | 'govt_order'>('phone_proof');
  const [selectedOfficialRole, setSelectedOfficialRole] = useState<'ias_dm' | 'field_officer'>(
    savedOfficerSession?.selectedOfficialRole || 'field_officer'
  );
  const [selectedDistrictForLogin, setSelectedDistrictForLogin] = useState<string>(
    savedOfficerSession?.selectedDistrictId || 'dist_gorakhpur'
  );

  const [officerPhone, setOfficerPhone] = useState('9911223344');
  const [officerPin, setOfficerPin] = useState('7788');
  const [govtOrderInput, setGovtOrderInput] = useState('GOV/UP/PANCHAYAT/2024/7712-B');
  const [govtUniqueCode, setGovtUniqueCode] = useState('UP-GKP-VDO-8891');
  const [officerData, setOfficerData] = useState<OfficerProfile>(
    savedOfficerSession?.officerData || DEFAULT_FIELD_OFFICER
  );
  const [loginError, setLoginError] = useState<string | null>(null);

  // Proof Document Upload State during Login
  const [proofDoc, setProofDoc] = useState<UploadedProofDoc>(
    savedOfficerSession?.proofDoc || getOfficerProofDoc()
  );
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);

  // Pan-India Area Jurisdiction Hierarchy
  const [selectedStateCode, setSelectedStateCode] = useState<string>('UP');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('dist_gorakhpur');
  const [selectedBlockId, setSelectedBlockId] = useState<string>('blk_sahjanwa');
  const [selectedVillageId, setSelectedVillageId] = useState<string>('all');

  // View Navigation
  const [activeTab, setActiveTab] = useState<'directory' | 'schemes' | 'inbox' | 'proof'>('directory');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live Data
  const [businesses, setBusinesses] = useState<VillageBusiness[]>([]);
  const [threads, setThreads] = useState<AdvisorThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Business Inspection Modal
  const [selectedBizForInspect, setSelectedBizForInspect] = useState<VillageBusiness | null>(null);
  const [inspectNotesInput, setInspectNotesInput] = useState('');
  const [inspectStatusInput, setInspectStatusInput] = useState<VillageBusiness['schemeStatus']>('Field Verified');
  const [inspectSubsidyInput, setInspectSubsidyInput] = useState<string>('133000');
  const [inspectHealthInput, setInspectHealthInput] = useState<VillageBusiness['performanceHealth']>('Strong / Repaying');

  // Register New Ground Survey Modal
  const [showAddBizModal, setShowAddBizModal] = useState(false);
  const [newBizForm, setNewBizForm] = useState({
    entrepreneurName: '',
    phone: '',
    businessName: '',
    category: 'Dairy & Livestock',
    villageId: 'vil_bhiti',
    villageName: 'Bhiti Rawat',
    investment: '150000',
    allocatedScheme: 'PMEGP (35% Subsidy)',
    subsidyAmount: '52500',
    notes: 'Ground survey completed by VDO. Location verified with GIS tagging.'
  });

  // Proof Modal
  const [showProofModal, setShowProofModal] = useState(false);

  // Get currently assigned IAS Officer for selected District
  const currentDistrictObj = getDistrictById(selectedDistrictId);
  const currentAssignedIas: IasOfficer = currentDistrictObj?.assignedIas || officerData.assignedIas;

  // Refresh data from store
  const refreshData = () => {
    const bizList = selectedVillageId === 'all' 
      ? getAllVillageBusinesses() 
      : getBusinessesByVillage(selectedVillageId);
    setBusinesses(bizList);

    const threadList = getAdvisorThreadsForVillage(selectedVillageId);
    setThreads(threadList);
    if (!activeThreadId && threadList.length > 0) {
      setActiveThreadId(threadList[0].id);
    }
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = subscribeToStore(refreshData);
    return () => unsubscribe();
  }, [selectedVillageId, selectedDistrictId]);

  // Handle Official File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDoc(true);
    setTimeout(() => {
      const newDoc: UploadedProofDoc = {
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        docType: 'Govt Service ID Card',
        verificationStatus: 'VERIFIED_BY_DM_OFFICE'
      };
      setProofDoc(newDoc);
      saveOfficerProofDoc(newDoc);
      setIsUploadingDoc(false);
      setUploadSuccessAlert(true);
      setTimeout(() => setUploadSuccessAlert(false), 4000);
    }, 700);
  };

  // Method 1: Phone Number + Proof Document Login (IAS or VDO)
  const handlePhoneProofLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isIas = selectedOfficialRole === 'ias_dm';

    if (!proofDoc && isIas) {
      setLoginError(selectedLang === 'en' ? 'Uploading official appointment order / ID card is mandatory for IAS DM login.' :
                    selectedLang === 'mr' ? 'आयएएस / जिल्हाधिकारी पोर्टलसाठी अधिकृत नियुक्ती पुरावा अपलोड करणे आवश्यक आहे.' :
                    selectedLang === 'ta' ? 'ஐஏஎஸ் / மாவட்ட ஆட்சியர் நுழைவுக்கு அதிகாரப்பூர்வ நியமன ஆணையை பதிவேற்றுவது கட்டாயமாகும்.' :
                    'आईएएस / डीएम पोर्टल हेतु आधिकारिक नियुक्ति प्रमाण पत्र (Gazette Order / Identity Card) अपलोड करना अनिवार्य है।');
      return;
    }

    const official = searchOfficialByPhoneAndRole(officerPhone, selectedOfficialRole);
    const distData = getDistrictById(isIas ? selectedDistrictForLogin : (official.districtId || selectedDistrictForLogin));

    const updatedOfficer: OfficerProfile = {
      id: isIas ? `ias_${distData?.id || 'dm'}` : `officer_${official.blockId || 'vdo'}`,
      phone: officerPhone || official.phone,
      fullName: isIas ? (distData?.assignedIas.name || official.name) : official.name,
      designation: isIas ? (distData?.assignedIas.designation || official.designation) : official.designation,
      uniqueGovtCode: isIas ? `IAS-DM-${distData?.name?.toUpperCase()}` : (official.code || 'UP-GKP-VDO-8891'),
      block: isIas ? 'All Blocks (District Collector Jurisdiction)' : (official.blockId ? (distData?.blocks.find(b => b.id === official.blockId)?.name || 'Sahjanwa') : 'Sahjanwa'),
      district: distData?.name || 'Gorakhpur',
      officerRole: selectedOfficialRole,
      assignedIas: distData?.assignedIas || {
        name: official.name,
        cadre: official.cadre || 'IAS Cadre',
        designation: official.designation,
        office: official.office || 'District Collectorate',
        email: 'dm@nic.in',
        appointmentOrder: official.orderNumber
      },
      jurisdictionProof: {
        orderNumber: isIas ? (distData?.assignedIas.appointmentOrder || official.orderNumber) : official.orderNumber,
        issuingAuthority: official.authorityIssuing,
        appointmentDate: official.appointmentDate,
        lgdBlockCode: isIas ? 'ALL-BLOCKS-LGD' : 'LGD-BLK-771',
        lgdVillages: [],
        authoritySeal: isIas ? 'Office of District Magistrate & Collector' : 'Panchayati Raj Department',
        verificationStatus: 'GOVT_VERIFIED'
      },
      uploadedProofDoc: proofDoc || {
        fileName: isIas ? 'IAS_Gazette_Appointment_DM.pdf' : 'VDO_Service_ID_Card.pdf',
        fileType: 'application/pdf',
        fileSize: '2.4 MB',
        uploadedAt: new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        docType: isIas ? 'Gazetted Appointment Order' : 'Govt Service ID Card',
        verificationStatus: 'VERIFIED_BY_DM_OFFICE'
      },
      assignedVillages: []
    };

    setOfficerData(updatedOfficer);
    setSelectedDistrictId(distData?.id || 'dist_gorakhpur');
    if (!isIas && official.blockId) {
      setSelectedBlockId(official.blockId);
    }
    setIsOfficerLoggedIn(true);
    setLoginError(null);

    // Save persistent officer session
    try {
      localStorage.setItem(SAVED_OFFICER_SESSION_KEY, JSON.stringify({
        officerData: updatedOfficer,
        selectedDistrictId: distData?.id || 'dist_gorakhpur',
        selectedBlockId: !isIas && official.blockId ? official.blockId : undefined,
        selectedOfficialRole: isIas ? 'ias_dm' : 'field_officer',
        proofDoc: updatedOfficer.uploadedProofDoc || proofDoc
      }));
    } catch (e) {
      console.warn('Could not save officer session', e);
    }
  };

  // Method 2: Government Order Number / Service Dispatch Code Login
  const handleGovtOrderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = govtOrderInput.trim();
    if (!cleanInput) {
      setLoginError(ot.errGovtOrderRequired);
      return;
    }

    const official = searchOfficialByGovtOrder(cleanInput);
    if (!official) {
      setLoginError(`${ot.errGovtOrderNotFound} ('${cleanInput}')`);
      return;
    }

    const distData = getDistrictById(official.districtId);
    const isIas = official.type === 'ias_dm';

    const updatedOfficer: OfficerProfile = {
      id: isIas ? `ias_${official.districtId}` : `officer_${official.blockId || 'vdo'}`,
      phone: official.phone,
      fullName: official.name,
      designation: official.designation,
      uniqueGovtCode: official.code || cleanInput,
      block: isIas ? 'All Blocks (District Collector Jurisdiction)' : (official.blockId ? (distData?.blocks.find(b => b.id === official.blockId)?.name || 'Sahjanwa') : 'Sahjanwa'),
      district: distData?.name || 'Gorakhpur',
      officerRole: official.type,
      assignedIas: distData?.assignedIas || {
        name: official.name,
        cadre: official.cadre || 'IAS Cadre',
        designation: official.designation,
        office: official.office || 'District Collectorate',
        email: 'dm@nic.in',
        appointmentOrder: official.orderNumber
      },
      jurisdictionProof: {
        orderNumber: official.orderNumber,
        issuingAuthority: official.authorityIssuing,
        appointmentDate: official.appointmentDate,
        lgdBlockCode: isIas ? 'ALL-BLOCKS-LGD' : 'LGD-BLK-771',
        lgdVillages: [],
        authoritySeal: isIas ? 'Office of District Magistrate & Collector' : 'Panchayati Raj Department',
        verificationStatus: 'GOVT_VERIFIED'
      },
      uploadedProofDoc: proofDoc || {
        fileName: `Govt_Order_${official.orderNumber.replace(/[\/\s]/g, '_')}.pdf`,
        fileType: 'application/pdf',
        fileSize: '1.8 MB',
        uploadedAt: new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        docType: isIas ? 'Gazetted Appointment Order' : 'Govt Service ID Card',
        verificationStatus: 'VERIFIED_BY_DM_OFFICE'
      },
      assignedVillages: []
    };

    setOfficerData(updatedOfficer);
    setSelectedDistrictId(distData?.id || 'dist_gorakhpur');
    if (!isIas && official.blockId) {
      setSelectedBlockId(official.blockId);
    }
    setIsOfficerLoggedIn(true);
    setLoginError(null);

    // Save persistent officer session
    try {
      localStorage.setItem(SAVED_OFFICER_SESSION_KEY, JSON.stringify({
        officerData: updatedOfficer,
        selectedDistrictId: distData?.id || 'dist_gorakhpur',
        selectedBlockId: !isIas && official.blockId ? official.blockId : undefined,
        selectedOfficialRole: isIas ? 'ias_dm' : 'field_officer',
        proofDoc: updatedOfficer.uploadedProofDoc || proofDoc
      }));
    } catch (e) {
      console.warn('Could not save officer session', e);
    }
  };

  const handleOfficerLogout = () => {
    try {
      localStorage.removeItem(SAVED_OFFICER_SESSION_KEY);
    } catch (e) {}
    setIsOfficerLoggedIn(false);
  };

  const handleSendOfficerReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeThreadId) return;

    postAdvisorMessage(
      activeThreadId,
      replyText.trim(),
      'officer',
      `${officerData.fullName} (VDO)`,
      'Official Endorsement'
    );
    setReplyText('');
  };

  const handleQuickActionPill = (quickReply: string) => {
    if (!activeThreadId) return;
    postAdvisorMessage(
      activeThreadId,
      quickReply,
      'officer',
      `${officerData.fullName} (VDO)`,
      'Verified Action Taken'
    );
  };

  const handleSaveInspection = () => {
    if (!selectedBizForInspect) return;
    updateBusinessInspection(
      selectedBizForInspect.id, 
      inspectNotesInput, 
      inspectStatusInput,
      parseInt(inspectSubsidyInput) || selectedBizForInspect.subsidyAmount,
      inspectHealthInput
    );
    setSelectedBizForInspect(null);
  };

  const handleCreateGroundSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = parseInt(newBizForm.investment) || 100000;
    const sub = parseInt(newBizForm.subsidyAmount) || Math.round(inv * 0.35);

    const newBiz: VillageBusiness = {
      id: 'biz_survey_' + Date.now(),
      entrepreneurName: newBizForm.entrepreneurName,
      phone: newBizForm.phone,
      businessName: newBizForm.businessName || `${newBizForm.entrepreneurName}'s Enterprise`,
      category: newBizForm.category,
      villageId: newBizForm.villageId,
      villageName: newBizForm.villageId === 'vil_bhiti' ? 'Bhiti Rawat' : 'Sahjanwa Khas',
      block: officerData.block || 'Sahjanwa',
      investment: inv,
      annualTurnover: inv * 2.6,
      allocatedScheme: newBizForm.allocatedScheme,
      subsidyPercent: 35,
      subsidyAmount: sub,
      bankName: 'Punjab National Bank - Sahjanwa',
      schemeStatus: 'Field Verified',
      sanctionedAmount: Math.round(inv * 0.85),
      riskStatus: 'Low Risk',
      performanceHealth: 'Under Inspection',
      lastInspectionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      inspectionNotes: newBizForm.notes,
      gpsCoordinates: { lat: 26.7450, lng: 83.2500 }
    };
    saveVillageBusiness(newBiz);
    setShowAddBizModal(false);
  };

  const activeThread = threads.find(t => t.id === activeThreadId);

  // Filtered businesses
  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.entrepreneurName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.allocatedScheme?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate metrics
  const totalEnterprises = businesses.length;
  const totalSubsidyDisbursed = businesses.reduce((acc, b) => acc + (b.subsidyAmount || 0), 0);
  const sanctionedCount = businesses.filter(b => b.schemeStatus === 'Sanctioned' || b.schemeStatus === 'Disbursed').length;
  const unreadInquiries = threads.filter(t => t.unreadByOfficer).length;

  // Available geographical dropdown values
  const availableDistricts = getDistrictsByState(selectedStateCode);
  const availableBlocks = getBlocksByDistrict(selectedDistrictId);
  const availableVillages = getVillagesByBlock(selectedDistrictId, selectedBlockId);

  // -------------------------------------------------------------
  // 1. RESTRICTED OFFICIAL & IAS LOGIN GATE (DUAL AUTHENTICATION PATHWAYS)
  // -------------------------------------------------------------
  if (!isOfficerLoggedIn) {
    // Check if current govtOrderInput matches an official in registry for live preview
    const matchedOfficialByOrder = searchOfficialByGovtOrder(govtOrderInput);

    return (
      <div className="p-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <button 
            onClick={onSwitchToCitizen} 
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{ot.backToEntrepreneur}</span>
          </button>
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher currentLang={selectedLang} onLanguageChange={handleLanguageChange} />
            <span className="text-[10px] bg-red-100 text-red-900 font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3 text-red-700" />
              <span>{ot.restrictedGovtAccess}</span>
            </span>
          </div>
        </div>

        <div className="text-center pt-1 space-y-1">
          <div className="w-13 h-13 rounded-2xl bg-purple-950 text-white flex items-center justify-center mx-auto shadow-md">
            <Landmark className="w-7 h-7 text-purple-300" />
          </div>
          <h2 className="text-base font-black text-slate-900 mt-1.5">
            {ot.loginTitle}
          </h2>
          <p className="text-xs text-purple-950 font-bold">
            {ot.deptMinistry}
          </p>
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
            {ot.loginInstruction}
          </p>
        </div>

        {/* Dual Authentication Mode Switcher */}
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 shadow-2xs border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('phone_proof');
              setLoginError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              loginMethod === 'phone_proof'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📱</span>
            <span>{ot.tabPhoneProof}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod('govt_order');
              setLoginError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              loginMethod === 'govt_order'
                ? 'bg-purple-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📜</span>
            <span>{ot.tabGovtOrder}</span>
          </button>
        </div>

        {/* Quick Demo Pre-fills */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-2.5 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wide">
              {loginMethod === 'phone_proof' ? ot.quickPresetsLabel : ot.quickOrderLabel}
            </span>
            <span className="text-[9px] bg-purple-200 text-purple-950 px-1.5 py-0.5 rounded font-bold">
              {ot.tapToTest}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {loginMethod === 'phone_proof' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOfficialRole('ias_dm');
                    setOfficerPhone('9415001122');
                    setSelectedDistrictForLogin('dist_gorakhpur');
                    setLoginError(null);
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg font-bold bg-white text-purple-950 border border-purple-300 hover:bg-purple-100 transition"
                >
                  🏛️ DM Gorakhpur (Rajeshwar Prasad IAS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOfficialRole('ias_dm');
                    setOfficerPhone('9822003344');
                    setSelectedDistrictForLogin('dist_pune');
                    setLoginError(null);
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg font-bold bg-white text-purple-950 border border-purple-300 hover:bg-purple-100 transition"
                >
                  🏛️ DM Pune (Dr. Rajesh Deshmukh IAS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOfficialRole('field_officer');
                    setOfficerPhone('9911223344');
                    setSelectedDistrictForLogin('dist_gorakhpur');
                    setOfficerPin('7788');
                    setLoginError(null);
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg font-bold bg-white text-purple-950 border border-purple-300 hover:bg-purple-100 transition"
                >
                  📋 VDO Sahjanwa (Sanjay Verma)
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setGovtOrderInput('GOV/UP/PANCHAYAT/2024/7712-B');
                    setLoginError(null);
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg font-mono font-bold bg-white text-purple-950 border border-purple-300 hover:bg-purple-100 transition"
                >
                  📜 GOV/UP/PANCHAYAT/2024/7712-B (VDO Sahjanwa)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGovtOrderInput('DOPT/GOV-UP/IAS/2023/1102');
                    setLoginError(null);
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg font-mono font-bold bg-white text-purple-950 border border-purple-300 hover:bg-purple-100 transition"
                >
                  🏛️ DOPT/GOV-UP/IAS/2023/1102 (DM Gorakhpur)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGovtOrderInput('MAH/REV/IAS/2023/771');
                    setLoginError(null);
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg font-mono font-bold bg-white text-purple-950 border border-purple-300 hover:bg-purple-100 transition"
                >
                  🏛️ MAH/REV/IAS/2023/771 (DM Pune)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGovtOrderInput('UP-GKP-VDO-8891');
                    setLoginError(null);
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg font-mono font-bold bg-white text-purple-950 border border-purple-300 hover:bg-purple-100 transition"
                >
                  🏷️ UP-GKP-VDO-8891 (Service Code)
                </button>
              </>
            )}
          </div>
        </div>

        {/* ---------------- METHOD 1: PHONE + PROOF LOGIN FORM ---------------- */}
        {loginMethod === 'phone_proof' && (
          <form onSubmit={handlePhoneProofLogin} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
            {loginError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-bold flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Officer Level / Role Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {ot.selectRoleLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOfficialRole('ias_dm')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    selectedOfficialRole === 'ias_dm'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>🏛️</span>
                  <span>{ot.roleIasDm}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOfficialRole('field_officer')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    selectedOfficialRole === 'field_officer'
                      ? 'bg-purple-900 text-white border-purple-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>📋</span>
                  <span>{ot.roleVdo}</span>
                </button>
              </div>
            </div>

            {/* District Selector & Details */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {ot.selectJurisdictionDistrict}
                </label>
                <select
                  value={selectedDistrictForLogin}
                  onChange={e => setSelectedDistrictForLogin(e.target.value)}
                  className="w-full px-2 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-purple-600"
                >
                  <option value="dist_gorakhpur">Gorakhpur (गोरखपुर)</option>
                  <option value="dist_varanasi">Varanasi (वाराणसी)</option>
                  <option value="dist_pune">Pune (पुणे)</option>
                  <option value="dist_patna">Patna (पटना)</option>
                  <option value="dist_jaipur">Jaipur (जयपुर)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {ot.registeredPhoneLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">+91</span>
                  <input
                    type="tel"
                    required
                    value={officerPhone}
                    onChange={e => setOfficerPhone(e.target.value)}
                    placeholder="9415001122"
                    className="w-full pl-9 pr-2 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Display Assigned Officer Preview Card */}
            {(() => {
              const curDist = getDistrictById(selectedDistrictForLogin);
              if (!curDist) return null;
              return (
                <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                  selectedOfficialRole === 'ias_dm'
                    ? 'bg-amber-50/90 border-amber-300'
                    : 'bg-purple-50/90 border-purple-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedOfficialRole === 'ias_dm' ? '🏛️' : '📋'}</span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        {selectedOfficialRole === 'ias_dm' ? (selectedLang === 'en' ? 'Assigned District Magistrate (IAS):' : selectedLang === 'mr' ? 'नियुक्त जिल्हाधिकारी (IAS):' : selectedLang === 'ta' ? 'நியமிக்கப்பட்ட மாவட்ட ஆட்சியர்:' : 'संबंधित जिलाधिकारी (IAS):') : (selectedLang === 'en' ? 'Jurisdiction Area:' : selectedLang === 'mr' ? 'कार्यक्षेत्र:' : selectedLang === 'ta' ? 'அதிகார வரம்பு:' : 'कार्यक्षेत्र:')}
                      </span>
                      <span className="font-extrabold text-slate-900 block text-[11px]">
                        {selectedOfficialRole === 'ias_dm' ? curDist.assignedIas.name : `${curDist.name} • Block Sahjanwa / Harhua`}
                      </span>
                      <span className="text-[10px] text-slate-600">
                        {selectedOfficialRole === 'ias_dm' ? curDist.assignedIas.cadre : 'Panchayat Development & Credit Mobilization'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-emerald-800">
                    {ot.govtRecordVerified} ✓
                  </span>
                </div>
              );
            })()}

            {/* Official Appointment / ID Proof Upload Section */}
            <div className="pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span>
                    {ot.attachedProofLabel}
                  </span>
                </label>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                  {ot.mandatoryProof}
                </span>
              </div>

              {/* Document Preview or Upload Box */}
              <div className="border border-dashed border-purple-300 rounded-2xl p-3 bg-purple-50/40 text-center space-y-2">
                {proofDoc ? (
                  <div className="bg-white p-2.5 rounded-xl border border-purple-200 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                          {proofDoc.fileName}
                        </div>
                        <span className="text-[10px] text-slate-500">{proofDoc.fileSize} • {proofDoc.docType}</span>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" />
                      <span>{ot.verifiedByDmOffice}</span>
                    </span>
                  </div>
                ) : null}

                <div className="flex items-center justify-center gap-2">
                  <label className="cursor-pointer bg-purple-800 hover:bg-purple-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>{isUploadingDoc ? ot.uploading : ot.chooseFileBtn}</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400">
                  {selectedOfficialRole === 'ias_dm'
                    ? ot.uploadHintIas
                    : ot.uploadHintVdo}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-950 hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>{ot.submitPhoneProofBtn}</span>
            </button>
          </form>
        )}

        {/* ---------------- METHOD 2: GOVT ORDER NO. LOGIN FORM ---------------- */}
        {loginMethod === 'govt_order' && (
          <form onSubmit={handleGovtOrderLogin} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
            {loginError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-bold flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {ot.govtOrderInputLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">📜</span>
                <input
                  type="text"
                  required
                  value={govtOrderInput}
                  onChange={e => {
                    setGovtOrderInput(e.target.value);
                    setLoginError(null);
                  }}
                  placeholder={ot.govtOrderPlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-black tracking-wide bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-purple-600 text-slate-900 font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {ot.govtOrderHelpText}
              </p>
            </div>

            {/* Live Inspection / Validation Banner if Matched */}
            {matchedOfficialByOrder && (
              <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                matchedOfficialByOrder.type === 'ias_dm'
                  ? 'bg-amber-50/90 border-amber-300'
                  : 'bg-emerald-50/90 border-emerald-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                    <span>{matchedOfficialByOrder.type === 'ias_dm' ? '🏛️' : '📋'}</span>
                    <span>✓ {ot.govtRecordVerified}</span>
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    matchedOfficialByOrder.type === 'ias_dm'
                      ? 'bg-amber-200 text-amber-950 font-mono'
                      : 'bg-emerald-200 text-emerald-950 font-mono'
                  }`}>
                    {matchedOfficialByOrder.type === 'ias_dm' ? 'IAS DM RECORD' : 'VDO RECORD'}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs mt-1">
                  {matchedOfficialByOrder.name} ({matchedOfficialByOrder.designation})
                </h4>
                <p className="text-[10px] text-slate-600">
                  {ot.issuingAuthority} {matchedOfficialByOrder.authorityIssuing}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                  <span>{ot.appointmentDate} {matchedOfficialByOrder.appointmentDate}</span>
                  <span>•</span>
                  <span>{ot.orderNumberLabel} {matchedOfficialByOrder.orderNumber}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-purple-950 hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>{ot.submitGovtOrderBtn}</span>
            </button>
          </form>
        )}

        <div className="text-center text-[10px] text-slate-400">
          {ot.nicFooter}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED OFFICIAL & IAS JURISDICTION DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="space-y-3 pb-8">
      {/* Top Banner: Officer Identity & Role & Sign Out */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white p-3.5 rounded-2xl shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-700/80 border border-purple-400/40 flex items-center justify-center font-black text-sm">
              {officerData.officerRole === 'ias_dm' ? '🏛️' : '📋'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black">{officerData.fullName}</span>
                <span className="text-[9px] bg-purple-400/30 text-purple-200 font-bold px-1.5 py-0.2 rounded font-mono">
                  {officerData.uniqueGovtCode}
                </span>
                {officerData.officerRole === 'ias_dm' && (
                  <span className="text-[9px] bg-amber-400/30 text-amber-200 font-bold px-1.5 py-0.2 rounded">
                    IAS DM
                  </span>
                )}
              </div>
              <div className="text-[10px] text-purple-200 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-300" />
                <span>{officerData.designation}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <LanguageSwitcher currentLang={selectedLang} onLanguageChange={handleLanguageChange} />
            <button
              onClick={handleOfficerLogout}
              className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition border border-red-400/30"
              title="Sign Out / Exit Session"
            >
              <span>{ot.logout}</span>
            </button>
            <button
              onClick={onSwitchToCitizen}
              className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition shadow-xs"
              title="Switch to Entrepreneur App"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{ot.backToEntrepreneur}</span>
            </button>
          </div>
        </div>

        {/* IAS Apex District Oversight Banner OR VDO Reporting Strip */}
        {officerData.officerRole === 'ias_dm' ? (
          <div className="bg-amber-500/15 rounded-xl p-2.5 border border-amber-400/40 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-300 flex-shrink-0" />
              <div>
                <span className="text-[9px] text-amber-300 uppercase font-bold tracking-wider block">
                  {ot.apexAuthorityBadge}
                </span>
                <span className="font-bold text-white text-[11px]">
                  {officerData.fullName}
                </span>
                <span className="text-[9px] text-amber-200 block">
                  {officerData.assignedIas.cadre} • {ot.directOversight}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowProofModal(true)}
              className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-1 rounded-lg hover:bg-amber-400/30 transition flex items-center gap-1"
            >
              <span>{ot.viewOrderBtn}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <div className="bg-purple-900/80 rounded-xl p-2.5 border border-purple-500/40 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <div>
                <span className="text-[9px] text-purple-300 uppercase font-bold tracking-wider block">
                  {ot.supervisoryIas}
                </span>
                <span className="font-bold text-white text-[11px]">
                  {currentAssignedIas.name}
                </span>
                <span className="text-[9px] text-amber-200 block">
                  {currentAssignedIas.designation} • {currentAssignedIas.cadre}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowProofModal(true)}
              className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-1 rounded-lg hover:bg-amber-400/30 transition flex items-center gap-1"
            >
              <span>{ot.viewOrderBtn}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        )}

        {/* Pan-India Geographic Jurisdiction Switcher */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px]">
          <div>
            <span className="text-[9px] text-purple-300 block mb-0.5">{ot.stateLabel}</span>
            <select
              value={selectedStateCode}
              onChange={e => {
                const sCode = e.target.value;
                setSelectedStateCode(sCode);
                const firstDist = getDistrictsByState(sCode)[0];
                if (firstDist) {
                  setSelectedDistrictId(firstDist.id);
                  setSelectedBlockId(firstDist.blocks[0]?.id || '');
                }
              }}
              className="w-full bg-purple-950 border border-purple-500/50 rounded-lg text-[10px] font-bold text-purple-100 p-1"
            >
              {getAllStates().map(s => (
                <option key={s.code} value={s.code}>{s.name.split(' ')[0]}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[9px] text-purple-300 block mb-0.5">{ot.districtLabel}</span>
            <select
              value={selectedDistrictId}
              onChange={e => {
                const dId = e.target.value;
                setSelectedDistrictId(dId);
                const dObj = getDistrictById(dId);
                if (dObj && dObj.blocks[0]) {
                  setSelectedBlockId(dObj.blocks[0].id);
                }
              }}
              className="w-full bg-purple-950 border border-purple-500/50 rounded-lg text-[10px] font-bold text-purple-100 p-1"
            >
              {availableDistricts.map(d => (
                <option key={d.id} value={d.id}>{d.name.split(' ')[0]}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[9px] text-purple-300 block mb-0.5">{ot.panchayatLabel}</span>
            <select
              value={selectedVillageId}
              onChange={e => setSelectedVillageId(e.target.value)}
              className="w-full bg-purple-950 border border-purple-500/50 rounded-lg text-[10px] font-bold text-purple-100 p-1"
            >
              <option value="all">{ot.allVillages}</option>
              {availableVillages.map(v => (
                <option key={v.id} value={v.id}>{v.name.split(' ')[0]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Real-time KPI Stats Bar */}
      <div className="grid grid-cols-4 gap-1.5 text-center">
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-medium block">{ot.kpiEnterprises}</span>
          <span className="text-sm font-black text-slate-900">{totalEnterprises}</span>
        </div>
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-medium block">{ot.kpiSubsidies}</span>
          <span className="text-sm font-black text-emerald-700">₹{(totalSubsidyDisbursed / 100000).toFixed(1)}L</span>
        </div>
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-medium block">{ot.kpiSanctioned}</span>
          <span className="text-sm font-black text-purple-800">{sanctionedCount}</span>
        </div>
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs relative">
          <span className="text-[10px] text-slate-500 font-medium block">{ot.kpiAdvisorInbox}</span>
          <span className="text-sm font-black text-amber-600">{unreadInquiries}</span>
          {unreadInquiries > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1 text-[11px] font-bold">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1 ${
            activeTab === 'directory' ? 'bg-white text-purple-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>{ot.tabBusinesses}</span>
        </button>
        <button
          onClick={() => setActiveTab('schemes')}
          className={`flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1 ${
            activeTab === 'schemes' ? 'bg-white text-purple-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{ot.tabSubsidies}</span>
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1 relative ${
            activeTab === 'inbox' ? 'bg-white text-purple-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{ot.tabInbox}</span>
          {unreadInquiries > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('proof')}
          className={`flex-1 py-1.5 rounded-lg transition text-center flex items-center justify-center gap-1 ${
            activeTab === 'proof' ? 'bg-white text-purple-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{ot.tabProof}</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: AREA BUSINESSES DIRECTORY                              */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'directory' && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={ot.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <button
              onClick={() => setShowAddBizModal(true)}
              className="bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{ot.surveyBtn}</span>
            </button>
          </div>

          <div className="space-y-2">
            {filteredBusinesses.map(biz => (
              <div 
                key={biz.id} 
                className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-2 hover:border-purple-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{biz.category}</span>
                    <h3 className="text-xs font-black text-slate-900">{biz.businessName}</h3>
                    <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                      <span>{ot.ownerLabel} <b>{biz.entrepreneurName}</b></span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-slate-500">
                        <Phone className="w-2.5 h-2.5" />
                        {biz.phone}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    biz.schemeStatus === 'Disbursed' ? 'bg-emerald-100 text-emerald-800' :
                    biz.schemeStatus === 'Sanctioned' ? 'bg-blue-100 text-blue-800' :
                    biz.schemeStatus === 'Field Verified' ? 'bg-purple-100 text-purple-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {biz.schemeStatus}
                  </span>
                </div>

                {/* Scheme & Subsidy Performance Strip */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{ot.schemeLabel}</span>
                    <span className="font-bold text-purple-900">{biz.allocatedScheme || 'PM MUDRA'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{ot.subsidyLabel}</span>
                    <span className="font-black text-emerald-700">
                      ₹{biz.subsidyAmount?.toLocaleString()} ({biz.subsidyPercent || 35}% {ot.subsidizedSuffix})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500">{ot.bankLabel} <b>{biz.bankName || 'PNB Sahjanwa'}</b></span>
                    <span className={`font-bold ${
                      biz.performanceHealth === 'Strong / Repaying' ? 'text-emerald-700' :
                      biz.performanceHealth === 'Subsidies Disbursed' ? 'text-blue-700' :
                      'text-amber-700'
                    }`}>
                      ● {biz.performanceHealth || 'Under Inspection'}
                    </span>
                  </div>
                </div>

                {biz.inspectionNotes && (
                  <p className="text-[10px] text-slate-600 bg-purple-50/70 border border-purple-100 p-2 rounded-xl leading-relaxed">
                    📝 <b>{selectedLang === 'en' ? 'Appraisal Note:' : selectedLang === 'mr' ? 'तपासणी नोंद:' : selectedLang === 'ta' ? 'ஆய்வு குறிப்பு:' : 'निरीक्षण टिप्पणी:'}</b> {biz.inspectionNotes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
                    {ot.lastVerifiedLabel} {biz.lastInspectionDate}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedBizForInspect(biz);
                        setInspectNotesInput(biz.inspectionNotes || '');
                        setInspectStatusInput(biz.schemeStatus);
                        setInspectSubsidyInput(String(biz.subsidyAmount || 133000));
                        setInspectHealthInput(biz.performanceHealth || 'Strong / Repaying');
                      }}
                      className="text-[10px] font-bold text-purple-800 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-lg border border-purple-200 transition"
                    >
                      {ot.updateAppraisalBtn}
                    </button>
                    <button
                      onClick={() => {
                        const matchingThread = threads.find(t => t.entrepreneurPhone === biz.phone);
                        if (matchingThread) {
                          setActiveThreadId(matchingThread.id);
                          setActiveTab('inbox');
                        } else {
                          setActiveTab('inbox');
                        }
                      }}
                      className="text-[10px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition flex items-center gap-1"
                    >
                      <MessageSquare className="w-2.5 h-2.5" />
                      <span>{ot.messageBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: SCHEMES & SUBSIDIES LEDGER                             */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'schemes' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>{ot.schemesTitle} ({currentDistrictObj?.name})</span>
              </h3>
              <span className="text-[10px] font-mono text-purple-800 font-bold bg-purple-100 px-2 py-0.5 rounded">
                DM: {currentAssignedIas.name.split(' ')[0]} (IAS)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {ot.schemesSubtitle}
            </p>

            <div className="space-y-2 pt-1">
              {PAN_INDIA_GOV_SCHEMES.map((sch) => {
                const schemeName = sch.name[selectedLang] || sch.name.hi || sch.name.en;
                const subsidyText = sch.subsidyDisplay[selectedLang] || sch.subsidyDisplay.hi || sch.subsidyDisplay.en;
                const ministryText = sch.ministry[selectedLang] || sch.ministry.hi || sch.ministry.en;
                const maxLoanText = sch.maxLoanDisplay[selectedLang] || sch.maxLoanDisplay.hi || sch.maxLoanDisplay.en;
                const badgeText = sch.badge[selectedLang] || sch.badge.hi || sch.badge.en;

                return (
                  <div key={sch.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-black text-purple-900 bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded">
                            {sch.code}
                          </span>
                          <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 font-bold px-1.5 py-0.2 rounded">
                            {badgeText}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 mt-1">{schemeName}</h4>
                        <span className="text-[10px] text-slate-500 font-medium block">
                          🏛️ {ministryText}
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                        {sch.subsidyRateRural > 0 ? `${sch.subsidyRateSpecial || sch.subsidyRateRural}% Subsidy` : 'Interest Subvention'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-0.5">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Max Limit</span>
                        <span className="font-bold text-slate-800 text-[10px] block truncate">{maxLoanText}</span>
                      </div>
                      <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                        <span className="text-emerald-700 block text-[9px] uppercase font-bold">Benefit</span>
                        <span className="font-black text-emerald-900 text-[10px] block truncate">{subsidyText}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      <span className="truncate">
                        {sch.collateralFree ? '✓ 100% Collateral-Free' : '• Priority Sector Loan'}
                      </span>
                      <a
                        href={sch.officialPortal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-0.5"
                      >
                        <span>{sch.portalName}</span>
                        <span className="text-[9px]">↗</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: ADVISOR INBOX (RECEIVES CITIZEN QUERIES)               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'inbox' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>{ot.inboxTitle} ({threads.length})</span>
              </h3>
              <span className="text-[10px] text-slate-400">{ot.routedFromAi}</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {threads.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveThreadId(t.id);
                    t.unreadByOfficer = false;
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition text-left ${
                    activeThreadId === t.id
                      ? 'bg-purple-50/80 border-purple-600 ring-1 ring-purple-600/30'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{t.entrepreneurName}</span>
                      {t.unreadByOfficer && (
                        <span className="text-[9px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400">{t.lastUpdated}</span>
                  </div>
                  <div className="text-[10px] text-purple-800 font-medium truncate">{t.businessType} • {t.villageName}</div>
                  <div className="text-[11px] text-slate-600 truncate mt-0.5">
                    {t.messages[t.messages.length - 1]?.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Conversation Messages */}
          {activeThread && (
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900">{activeThread.entrepreneurName}</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded-full">
                    {activeThread.entrepreneurPhone}
                  </span>
                </div>
                <p className="text-[10px] text-purple-700 font-medium">{activeThread.subject}</p>
              </div>

              {/* Message History */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {activeThread.messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'officer' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 mb-0.5 text-[9px] text-slate-400">
                      <span>{m.senderName}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <div className={`p-2.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                      m.sender === 'officer'
                        ? 'bg-purple-800 text-white rounded-tr-none'
                        : m.sender === 'ai'
                        ? 'bg-emerald-50 text-emerald-950 rounded-tl-none border border-emerald-200'
                        : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
                    }`}>
                      {m.badge && (
                        <span className={`text-[9px] font-bold block mb-1 uppercase tracking-wide ${
                          m.sender === 'officer' 
                            ? 'text-purple-200' 
                            : m.sender === 'ai' 
                            ? 'text-emerald-700' 
                            : 'text-purple-700'
                        }`}>
                          ✓ {m.badge}
                        </span>
                      )}
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Official Response Presets */}
              <div className="space-y-1 pt-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  {ot.quickActionTitle}
                </span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickActionPill(selectedLang === 'en' ? 'Your physical verification is complete. Recommendation letter has been forwarded to PNB branch.' : selectedLang === 'mr' ? 'तुमची प्रत्यक्ष तपासणी पूर्ण झाली आहे. बँक शाखा व्यवस्थापकाकडे मंजुरी शिफारस पत्र पाठवले आहे.' : selectedLang === 'ta' ? 'உங்கள் நேரடி ஆய்வு முடிந்தது. பரிந்துரை கடிதம் வங்கி மேலாளருக்கு அனுப்பப்பட்டுள்ளது.' : 'आपका भौतिक सत्यापन पूर्ण हो चुका है। PNB सहजनवा शाखा प्रबंधक को ऋण संस्तुति पत्र प्रेषित कर दिया गया है।')}
                    className="text-[10px] bg-purple-50 text-purple-800 border border-purple-200 px-2 py-1 rounded-lg hover:bg-purple-100 transition"
                  >
                    {ot.quickActionShareLetter}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickActionPill(selectedLang === 'en' ? 'I am scheduling a site inspection visit tomorrow at 2:30 PM. Please keep electricity bill and Aadhaar ready.' : selectedLang === 'mr' ? 'मी उद्या दुपारी २:३० वाजता प्रत्यक्ष तपासणीसाठी येत आहे. कृपया वीज बिल व आधार कार्ड तयार ठेवा.' : selectedLang === 'ta' ? 'நாளை மதியம் 2:30 மணிக்கு நேரடி ஆய்வுக்கு வருகிறேன். மின் கட்டண ரசீது & ஆதார் தயார் செய்க.' : 'कल दोपहर 2:30 बजे मैं आपके कार्यस्थल पर भौतिक निरीक्षण हेतु आ रहा हूँ। कृपया बिजली बिल व आधार कार्ड तैयार रखें।')}
                    className="text-[10px] bg-purple-50 text-purple-800 border border-purple-200 px-2 py-1 rounded-lg hover:bg-purple-100 transition"
                  >
                    {ot.quickActionScheduleVisit}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickActionPill(selectedLang === 'en' ? 'Your unit has been found eligible for 35% rural subsidy under PMEGP. Endorsement recorded on portal.' : selectedLang === 'mr' ? 'तुमची युनिट PMEGP अंतर्गत ३५% ग्रामीण अनुदानासाठी पात्र ठरली आहे. पोर्टलवर मंजुरी नोंदवली आहे.' : selectedLang === 'ta' ? 'உங்கள் தொழில் PMEGP திட்டத்தின் கீழ் 35% ஊரக மானியத்திற்கு தகுதியானது என அங்கீகரிக்கப்பட்டது.' : 'आपकी इकाई PMEGP के तहत 35% ग्रामीण सब्सिडी हेतु पात्र पाई गई है। पोर्टल पर अनुमोदन दर्ज कर दिया गया है।')}
                    className="text-[10px] bg-purple-50 text-purple-800 border border-purple-200 px-2 py-1 rounded-lg hover:bg-purple-100 transition"
                  >
                    {ot.quickActionEndorseSubsidy}
                  </button>
                </div>
              </div>

              {/* Officer Reply Input */}
              <form onSubmit={handleSendOfficerReply} className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder={ot.replyPlaceholder}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-purple-600 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="bg-purple-800 hover:bg-purple-900 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{ot.sendBtn}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: OFFICIAL GOVT PROOF & ASSIGNED IAS DETAILS             */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'proof' && (
        <div className="space-y-3">
          {/* ========================================================= */}
          {/* VIEW A: IF LOGGED IN AS IAS DISTRICT MAGISTRATE (DM)       */}
          {/* ========================================================= */}
          {officerData.officerRole === 'ias_dm' ? (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              {/* Official Central Civil Services Seal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center text-2xl border border-amber-400/30">
                    🏛️
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                      भारत सरकार • कार्मिक एवं प्रशिक्षण विभाग (DoPT)
                    </span>
                    <h3 className="text-sm font-black text-slate-900">
                      भारतीय प्रशासनिक सेवा (IAS) प्राधिकार प्रमाण पत्र
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Office of the District Magistrate & Collector, {officerData.district}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                  <span>★</span>
                  <span>राष्ट्रपति आदेशाधीन प्राधिकृत</span>
                </span>
              </div>

              {/* IAS Executive Credential Card */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 via-amber-50/70 to-orange-50 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest block">
                      District Magistrate & Collector (जिलाधिकारी एवं समाहर्ता)
                    </span>
                    <div className="text-base font-black text-slate-900">
                      {officerData.fullName}
                    </div>
                    <div className="text-xs text-amber-950 font-semibold">
                      {officerData.assignedIas.cadre}
                    </div>
                  </div>
                  <span className="text-xs bg-amber-600 text-white font-bold px-2 py-0.5 rounded-lg shadow-2xs">
                    Apex DM
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-200/60 text-[11px] text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Collectorate Office:</span>
                    <span className="font-bold text-slate-900">{officerData.assignedIas.office}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Official NIC Email:</span>
                    <span className="font-bold text-slate-900">{officerData.assignedIas.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-500 block">Presidential Gazette Order / Warrant:</span>
                    <span className="font-mono font-bold text-amber-900 bg-white/70 px-2 py-0.5 rounded border border-amber-200 block mt-0.5">
                      {officerData.assignedIas.appointmentOrder}
                    </span>
                  </div>
                </div>
              </div>

              {/* Magisterial District-Wide Jurisdiction */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    समग्र ज़िला अधिकारिता (Full District Jurisdiction)
                  </span>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                    {officerData.district}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">प्रशासनिक ब्लॉक</span>
                    <span className="text-xs font-black text-slate-900">{availableBlocks.length} Blocks</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">संबद्ध ग्राम पंचायतें</span>
                    <span className="text-xs font-black text-slate-900">{availableVillages.length}+ Panchayats</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">संबद्ध उद्यम</span>
                    <span className="text-xs font-black text-emerald-700">{businesses.length} Active</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  ज़िला स्तर पर सूक्ष्म एवं मध्यम उद्यमों (MSME), नाबार्ड (NABARD) क्रेडिट गारंटी, PMEGP, AIF एवं पशुपालन सब्सिडी के समग्र अनुमोदन एवं पर्यवेक्षण का वैधानिक प्राधिकार प्राप्त है।
                </p>
              </div>

              {/* Uploaded IAS Gazette Commission Proof Document */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    अपलोड किया गया आधिकारिक राजपत्र / पदस्थापन आदेश (Uploaded IAS Proof)
                  </span>
                  <button
                    onClick={() => setShowProofModal(true)}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1"
                  >
                    <span>नया आदेश अपलोड करें</span>
                    <Upload className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-300/80 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center text-lg">
                      📄
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{proofDoc.fileName}</span>
                      <span className="text-[10px] text-slate-500">
                        {proofDoc.docType} • अपलोड दिनांक: {proofDoc.uploadedAt}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-700 block mt-0.5">
                        SHA256: 4f8b9...c31e • NIC e-Office Verified Stamp
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    सत्यापित
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* VIEW B: IF LOGGED IN AS FIELD OFFICER (VDO / SACHIV)     */
            /* ========================================================= */
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center text-xl">
                    📋
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">{ot.govtProofTitle}</h3>
                    <span className="text-[10px] text-slate-500">{ot.deptMinistry}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  {ot.scrutinyPassed}
                </span>
              </div>

              {/* Reporting Supervisory IAS Officer Card */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1.5">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest block">
                  {ot.reportingDm}
                </span>
                <div className="text-xs font-black text-slate-900">
                  {currentAssignedIas.name}
                </div>
                <div className="text-[11px] text-slate-700 font-medium">
                  {currentAssignedIas.designation}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-0.5">
                  <span>Cadre: <b>{currentAssignedIas.cadre}</b></span>
                  <span>•</span>
                  <span>{currentAssignedIas.email}</span>
                </div>
              </div>

              {/* VDO Officer Details & Service Record */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">{ot.officerNameLabel}</span>
                  <span className="font-bold text-slate-900">{officerData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{ot.designationLabel}</span>
                  <span className="font-bold text-slate-900">{officerData.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{ot.serviceCodeLabel}</span>
                  <span className="font-mono font-black text-purple-900">{officerData.uniqueGovtCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{ot.govtOrderRefLabel}</span>
                  <span className="font-mono font-bold text-slate-800">{officerData.jurisdictionProof.orderNumber || currentAssignedIas.appointmentOrder}</span>
                </div>
              </div>

              {/* Uploaded VDO Proof Document Section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {ot.uploadedProofLabel}
                  </span>
                  <button
                    onClick={() => setShowProofModal(true)}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1"
                  >
                    <span>नया प्रमाण पत्र अपलोड करें</span>
                    <Upload className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-purple-800" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{proofDoc.fileName}</span>
                      <span className="text-[10px] text-slate-500">{proofDoc.docType} • Uploaded: {proofDoc.uploadedAt}</span>
                    </div>
                  </div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {ot.scrutinyPassed}
                  </span>
                </div>
              </div>

              {/* Authorized Gram Panchayats for this Block */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  {ot.authorizedPanchayats} ({officerData.block})
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {availableVillages.map((vil, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-purple-700 font-bold">📍</span>
                        <span className="font-bold text-slate-900">{vil.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">({vil.lgdCode})</span>
                      </div>
                      <span className="text-[10px] text-purple-900 font-medium">{vil.households} {ot.householdsLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: UPDATE FIELD INSPECTION & SCHEME STATUS                */}
      {/* ------------------------------------------------------------- */}
      {selectedBizForInspect && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-sm w-full space-y-3 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-900">
                {ot.modalAppraisalTitle}: {selectedBizForInspect.businessName}
              </h3>
              <button 
                onClick={() => setSelectedBizForInspect(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {ot.modalSchemeStatus}
                </label>
                <select
                  value={inspectStatusInput}
                  onChange={e => setInspectStatusInput(e.target.value as any)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-purple-600"
                >
                  <option value="Eligible">Eligible</option>
                  <option value="Applied">Applied for Subsidy</option>
                  <option value="Field Verified">Field Verified (Approved)</option>
                  <option value="Sanctioned">Sanctioned by Bank / DIC</option>
                  <option value="Disbursed">Disbursed (Funds Released)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {ot.modalSubsidyAmount}
                </label>
                <input
                  type="number"
                  value={inspectSubsidyInput}
                  onChange={e => setInspectSubsidyInput(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-purple-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {ot.modalHealthStatus}
              </label>
              <select
                value={inspectHealthInput}
                onChange={e => setInspectHealthInput(e.target.value as any)}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-purple-600"
              >
                <option value="Strong / Repaying">Strong / Repaying</option>
                <option value="Subsidies Disbursed">Subsidies Disbursed</option>
                <option value="Under Inspection">Under Inspection</option>
                <option value="Awaiting Disbursal">Awaiting Disbursal</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {ot.modalNotes}
              </label>
              <textarea
                rows={3}
                value={inspectNotesInput}
                onChange={e => setInspectNotesInput(e.target.value)}
                placeholder="Enter observations on physical premises, equipment, animals..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSelectedBizForInspect(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
              >
                {ot.modalCancel}
              </button>
              <button
                onClick={handleSaveInspection}
                className="flex-1 py-2 text-xs font-bold text-white bg-purple-800 rounded-xl hover:bg-purple-900 transition"
              >
                {ot.modalSave}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: REGISTER NEW GROUND SURVEY                             */}
      {/* ------------------------------------------------------------- */}
      {showAddBizModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateGroundSurvey} className="bg-white rounded-2xl p-4 max-w-sm w-full space-y-3 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-900">{ot.modalSurveyTitle}</h3>
              <button 
                type="button"
                onClick={() => setShowAddBizModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">{ot.modalEntrepreneurName}</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh Maurya"
                  value={newBizForm.entrepreneurName}
                  onChange={e => setNewBizForm({ ...newBizForm, entrepreneurName: e.target.value })}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">{ot.modalPhone}</label>
                <input
                  required
                  type="tel"
                  placeholder="9876543210"
                  value={newBizForm.phone}
                  onChange={e => setNewBizForm({ ...newBizForm, phone: e.target.value })}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">{ot.modalEnterpriseName}</label>
              <input
                required
                type="text"
                placeholder="e.g. Maurya Milk Collection Center"
                value={newBizForm.businessName}
                onChange={e => setNewBizForm({ ...newBizForm, businessName: e.target.value })}
                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">{ot.modalInvestment}</label>
                <input
                  type="number"
                  placeholder="150000"
                  value={newBizForm.investment}
                  onChange={e => setNewBizForm({ ...newBizForm, investment: e.target.value })}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">{ot.modalSubsidyEst}</label>
                <input
                  type="number"
                  placeholder="52500"
                  value={newBizForm.subsidyAmount}
                  onChange={e => setNewBizForm({ ...newBizForm, subsidyAmount: e.target.value })}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddBizModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
              >
                {ot.modalCancel}
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold text-white bg-purple-800 rounded-xl hover:bg-purple-900 transition"
              >
                {ot.modalSubmitSurvey}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: VIEW FULL JURISDICTION PROOF CERTIFICATE               */}
      {/* ------------------------------------------------------------- */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-sm w-full space-y-3 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-xs font-black text-slate-900">{ot.modalCertTitle}</h3>
              </div>
              <button 
                onClick={() => setShowProofModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest block">
                {ot.modalCertState}
              </span>
              <div className="text-xs font-black text-slate-900">
                {ot.modalCertDept} • {currentDistrictObj?.name}
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                Order Reference: {currentAssignedIas.appointmentOrder}
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-700">
              <p>
                <b>Appointed Officer:</b> {officerData.fullName} ({officerData.designation})
              </p>
              <p>
                <b>Unique Service Code:</b> <span className="font-mono font-bold text-purple-900">{officerData.uniqueGovtCode}</span>
              </p>
              <p>
                <b>Reporting IAS District Magistrate:</b> <span className="font-bold text-slate-900">{currentAssignedIas.name}</span> ({currentAssignedIas.designation})
              </p>
              <p>
                <b>Authorized Mandate:</b> Enterprise Registration, PMEGP/PMFME 35% Subsidy Endorsement, Physical Inspection, and Credit Appraisal.
              </p>
            </div>

            <div className="p-2 bg-slate-50 border rounded-xl text-center text-[10px] text-slate-500 font-serif italic">
              "Affixed with Digital Signature & Official Seal of District Collectorate"
            </div>

            <button
              onClick={() => setShowProofModal(false)}
              className="w-full py-2 text-xs font-bold text-white bg-purple-800 rounded-xl hover:bg-purple-900 transition"
            >
              {ot.modalCertClose}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
