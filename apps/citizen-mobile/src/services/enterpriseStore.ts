/**
 * Real-Time Multi-Tenant Village Enterprise & Business Advisor Store
 * Provides local storage persistence and cross-role synchronization between
 * rural entrepreneurs and local Field Officers (VDO / Panchayat / CSC).
 */

export interface BeneficiaryProfile {
  fullName: string;
  phone: string;
  socialCategory: string;
  capital: number;
  skills: string[];
  spaceSqft: number;
  stateCode?: string;
  districtId: string;
  districtName: string;
  blockId?: string;
  blockName?: string;
  villageId: string;
  villageName: string;
  selectedBizId: string;
  selectedBizName: string;
  businessStatus: 'Planning' | 'Applied' | 'Operational' | 'Expanding';
}

export interface VillageBusiness {
  id: string;
  entrepreneurName: string;
  phone: string;
  businessName: string;
  category: string;
  villageId: string;
  villageName: string;
  block: string;
  investment: number;
  annualTurnover?: number;
  allocatedScheme?: string;
  subsidyPercent?: number;
  subsidyAmount?: number;
  bankName?: string;
  schemeStatus: 'Eligible' | 'Applied' | 'Field Verified' | 'Sanctioned' | 'Disbursed';
  sanctionedAmount?: number;
  disbursedDate?: string;
  riskStatus: 'Low Risk' | 'Moderate' | 'Watchlist' | 'High Impact';
  performanceHealth?: 'Strong / Repaying' | 'Under Inspection' | 'Subsidies Disbursed' | 'Awaiting Disbursal';
  lastInspectionDate: string;
  inspectionNotes: string;
  gpsCoordinates?: { lat: number; lng: number };
}

export interface AdvisorMessage {
  id: string;
  sender: 'citizen' | 'officer' | 'ai';
  senderName: string;
  text: string;
  timestamp: string;
  badge?: string;
}

export interface AdvisorThread {
  id: string;
  villageId: string;
  villageName: string;
  entrepreneurName: string;
  entrepreneurPhone: string;
  businessType: string;
  subject: string;
  status: 'open' | 'resolved' | 'followup_needed';
  lastUpdated: string;
  unreadByOfficer: boolean;
  unreadByCitizen: boolean;
  messages: AdvisorMessage[];
}

export interface UploadedProofDoc {
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  docType: 'Govt Service ID Card' | 'Gazetted Appointment Order' | 'DM Transfer / Posting Order';
  previewUrl?: string;
  verificationStatus: 'VERIFIED_BY_DM_OFFICE' | 'PENDING';
}

export interface GovtJurisdictionProof {
  orderNumber: string;
  issuingAuthority: string;
  appointmentDate: string;
  lgdBlockCode: string;
  lgdVillages: { code: string; name: string; households: number }[];
  authoritySeal: string;
  verificationStatus: 'GOVT_VERIFIED' | 'PENDING';
}

export interface OfficerProfile {
  id: string;
  phone: string;
  fullName: string;
  designation: string;
  uniqueGovtCode: string;
  block: string;
  district: string;
  assignedIas: {
    name: string;
    cadre: string;
    designation: string;
    office: string;
    email: string;
    appointmentOrder: string;
  };
  jurisdictionProof: GovtJurisdictionProof;
  uploadedProofDoc?: UploadedProofDoc;
  assignedVillages: { id: string; name: string; totalEnterprises: number }[];
  officerRole?: 'ias_dm' | 'field_officer';
}

const STORAGE_KEYS = {
  BENEFICIARY: 'gramudyam_beneficiary_profile',
  BUSINESSES: 'gramudyam_village_businesses',
  THREADS: 'gramudyam_advisor_threads',
  OFFICER_SESSION: 'gramudyam_officer_session',
  OFFICER_PROOF: 'gramudyam_officer_proof_doc',
  ACTIVE_ROLE: 'gramudyam_active_role', // 'entrepreneur' | 'field_officer'
  REGISTERED_ENTREPRENEURS: 'gramudyam_registered_entrepreneurs',
  ACTIVE_ENTREPRENEUR_SESSION: 'gramudyam_active_entrepreneur_session'
};

export interface RegisteredEntrepreneur {
  id: string;
  phone: string;
  pin: string;
  fullName: string;
  businessSummary: string;
  profile: BeneficiaryProfile;
}

export const SEED_REGISTERED_ENTREPRENEURS: RegisteredEntrepreneur[] = [
  {
    id: 'ent_ramesh_gkp',
    phone: '9876543210',
    pin: '1234',
    fullName: 'Ramesh Kumar Yadav',
    businessSummary: 'Dairy Farming & Chilling (Gorakhpur, UP)',
    profile: {
      fullName: 'Ramesh Kumar Yadav',
      phone: '9876543210',
      socialCategory: 'OBC',
      capital: 80000,
      skills: ['Dairy Farming', 'Animal Husbandry', 'Cold Chain'],
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
      businessStatus: 'Operational'
    }
  },
  {
    id: 'ent_suresh_pun',
    phone: '9822001122',
    pin: '1234',
    fullName: 'Suresh Patil',
    businessSummary: 'Polyhouse Organic Farm (Pune, MH)',
    profile: {
      fullName: 'Suresh Patil',
      phone: '9822001122',
      socialCategory: 'General',
      capital: 120000,
      skills: ['Greenhouse Farming', 'Drip Irrigation', 'Organic Produce'],
      spaceSqft: 1200,
      stateCode: 'MH',
      districtId: 'dist_pune',
      districtName: 'Pune (पुणे)',
      blockId: 'blk_haveli',
      blockName: 'Haveli',
      villageId: 'vil_wagholi',
      villageName: 'Wagholi',
      selectedBizId: 'food_processing',
      selectedBizName: 'Polyhouse Organic Farm & Logistics',
      businessStatus: 'Applied'
    }
  },
  {
    id: 'ent_priya_jai',
    phone: '9414002233',
    pin: '1234',
    fullName: 'Priya Sharma',
    businessSummary: 'Handloom & Textile Crafts (Jaipur, RJ)',
    profile: {
      fullName: 'Priya Sharma',
      phone: '9414002233',
      socialCategory: 'General',
      capital: 60000,
      skills: ['Handloom Weaving', 'Block Printing', 'Direct to Consumer'],
      spaceSqft: 450,
      stateCode: 'RJ',
      districtId: 'dist_jaipur',
      districtName: 'Jaipur (जयपुर)',
      blockId: 'blk_sanganer',
      blockName: 'Sanganer',
      villageId: 'vil_muhana',
      villageName: 'Muhana Mandi',
      selectedBizId: 'services',
      selectedBizName: 'Handloom & Textile Crafts',
      businessStatus: 'Planning'
    }
  },
  {
    id: 'ent_anbarasan_cbe',
    phone: '9840005566',
    pin: '1234',
    fullName: 'M. Anbarasan',
    businessSummary: 'Coir & Agro Value Addition (Coimbatore, TN)',
    profile: {
      fullName: 'M. Anbarasan',
      phone: '9840005566',
      socialCategory: 'OBC',
      capital: 150000,
      skills: ['Coir Fiber Processing', 'Horticulture Substrate', 'Export Quality'],
      spaceSqft: 1500,
      stateCode: 'TN',
      districtId: 'dist_coimbatore',
      districtName: 'Coimbatore (कोयंबटूर)',
      blockId: 'blk_pollachi',
      blockName: 'Pollachi',
      villageId: 'vil_chinnampalayam',
      villageName: 'Chinnampalayam',
      selectedBizId: 'mfg',
      selectedBizName: 'Coir & Agro Value Addition Unit',
      businessStatus: 'Operational'
    }
  }
];

// Preset Officer Identity for Sahjanwa / Bhiti Rawat Area
export const DEFAULT_FIELD_OFFICER: OfficerProfile = {
  id: 'officer_field_sahjanwa',
  phone: '9911223344',
  fullName: 'Sanjay Verma',
  designation: 'Gram Panchayat VDO & Enterprise Nodal Officer',
  uniqueGovtCode: 'UP-GKP-VDO-8891',
  block: 'Sahjanwa',
  district: 'Gorakhpur',
  assignedIas: {
    name: 'Rajeshwar Prasad (IAS)',
    cadre: 'UP Cadre (2012 Batch)',
    designation: 'District Magistrate & Collector, Gorakhpur',
    office: 'Collectorate Compound, Civil Lines, Gorakhpur',
    email: 'dm.gorakhpur@nic.in',
    appointmentOrder: 'GOV/UP/PANCHAYAT/2024/7712-B'
  },
  jurisdictionProof: {
    orderNumber: 'GOV/UP/PANCHAYAT/2024/7712-B',
    issuingAuthority: 'Department of Panchayati Raj & Directorate of MSME, Govt of Uttar Pradesh',
    appointmentDate: '12 August 2024',
    lgdBlockCode: 'LGD-BLK-5842 (Sahjanwa)',
    lgdVillages: [
      { code: 'LGD-VIL-182901', name: 'Bhiti Rawat', households: 640 },
      { code: 'LGD-VIL-182902', name: 'Sahjanwa Khas', households: 820 },
      { code: 'LGD-VIL-182903', name: 'Pipraich Dehat', households: 450 }
    ],
    authoritySeal: 'Official Seal of VDO, Vikas Khand Sahjanwa, Gorakhpur',
    verificationStatus: 'GOVT_VERIFIED'
  },
  uploadedProofDoc: {
    fileName: 'VDO_Appointment_Order_Govt_UP_2024.pdf',
    fileType: 'application/pdf',
    fileSize: '1.8 MB',
    uploadedAt: '12 Aug 2024, 11:30 AM',
    docType: 'Gazetted Appointment Order',
    verificationStatus: 'VERIFIED_BY_DM_OFFICE'
  },
  assignedVillages: [
    { id: 'vil_bhiti', name: 'Bhiti Rawat', totalEnterprises: 14 },
    { id: 'vil_sahjanwa_rural', name: 'Sahjanwa Khas', totalEnterprises: 22 },
    { id: 'vil_pipraich', name: 'Pipraich Dehat', totalEnterprises: 9 }
  ]
};

// Default seed businesses with clear scheme and subsidy breakdowns
const SEED_VILLAGE_BUSINESSES: VillageBusiness[] = [
  {
    id: 'biz_gkp_001',
    entrepreneurName: 'Savita Devi',
    phone: '9876501122',
    businessName: 'Gauri Shankar Dairy Farm',
    category: 'Dairy & Livestock',
    villageId: 'vil_bhiti',
    villageName: 'Bhiti Rawat',
    block: 'Sahjanwa',
    investment: 380000,
    annualTurnover: 520000,
    allocatedScheme: 'PMEGP Rural Livestock Credit',
    subsidyPercent: 35,
    subsidyAmount: 133000,
    bankName: 'State Bank of India - Sahjanwa',
    schemeStatus: 'Disbursed',
    sanctionedAmount: 285000,
    disbursedDate: '12 Jan 2026',
    riskStatus: 'Low Risk',
    performanceHealth: 'Subsidies Disbursed',
    lastInspectionDate: '28 Feb 2026',
    inspectionNotes: '4 high-yield Murrah buffaloes healthy. Daily milk supply: 38L to local chilling center. Subsidies credited.',
    gpsCoordinates: { lat: 26.7454, lng: 83.2505 }
  },
  {
    id: 'biz_gkp_002',
    entrepreneurName: 'Manoj Kumar Yadav',
    phone: '9876503344',
    businessName: 'Shri Krishna Mustard Oil Expeller',
    category: 'Agro & Food Processing',
    villageId: 'vil_bhiti',
    villageName: 'Bhiti Rawat',
    block: 'Sahjanwa',
    investment: 620000,
    annualTurnover: 840000,
    allocatedScheme: 'PMFME (Micro Food Processing)',
    subsidyPercent: 35,
    subsidyAmount: 217000,
    bankName: 'Punjab National Bank - Sahjanwa',
    schemeStatus: 'Field Verified',
    sanctionedAmount: 434000,
    disbursedDate: 'Awaiting Final DLC Clearance',
    riskStatus: 'Moderate',
    performanceHealth: 'Under Inspection',
    lastInspectionDate: '01 Mar 2026',
    inspectionNotes: 'Plant machinery installed. FSSAI registration in progress. 3-phase electricity line checked.',
    gpsCoordinates: { lat: 26.7461, lng: 83.2519 }
  },
  {
    id: 'biz_gkp_003',
    entrepreneurName: 'Arvind Chauhan',
    phone: '9876505566',
    businessName: 'Surya Solar Pump & Battery Center',
    category: 'Renewable & Rural Services',
    villageId: 'vil_bhiti',
    villageName: 'Bhiti Rawat',
    block: 'Sahjanwa',
    investment: 140000,
    annualTurnover: 280000,
    allocatedScheme: 'PM Mudra Shishu (Tarun Phase)',
    subsidyPercent: 15,
    subsidyAmount: 21000,
    bankName: 'Baroda UP Bank - Bhiti Rawat',
    schemeStatus: 'Sanctioned',
    sanctionedAmount: 100000,
    disbursedDate: '19 Feb 2026',
    riskStatus: 'Low Risk',
    performanceHealth: 'Strong / Repaying',
    lastInspectionDate: '25 Feb 2026',
    inspectionNotes: 'Provides repair services for 18 solar irrigation setups across 3 neighboring hamlets.',
    gpsCoordinates: { lat: 26.7442, lng: 83.2491 }
  },
  {
    id: 'biz_gkp_004',
    entrepreneurName: 'Kishori Lal Maurya',
    phone: '9876507788',
    businessName: 'Maurya Agro Tools Rental & Spares',
    category: 'Agri Equipment',
    villageId: 'vil_sahjanwa_rural',
    villageName: 'Sahjanwa Khas',
    block: 'Sahjanwa',
    investment: 210000,
    annualTurnover: 320000,
    allocatedScheme: 'Sub-Mission on Agricultural Mechanization',
    subsidyPercent: 40,
    subsidyAmount: 84000,
    bankName: 'State Bank of India - Sahjanwa',
    schemeStatus: 'Disbursed',
    sanctionedAmount: 150000,
    disbursedDate: '05 Jan 2026',
    riskStatus: 'Low Risk',
    performanceHealth: 'Subsidies Disbursed',
    lastInspectionDate: '20 Feb 2026',
    inspectionNotes: 'Rotavator & 2 sprayers rented out actively during Rabi season. Repayment timely.',
    gpsCoordinates: { lat: 26.758, lng: 83.262 }
  }
];

// Initial Advisor discussions
const SEED_ADVISOR_THREADS: AdvisorThread[] = [
  {
    id: 'thread_001',
    villageId: 'vil_bhiti',
    villageName: 'Bhiti Rawat',
    entrepreneurName: 'Savita Devi',
    entrepreneurPhone: '9876501122',
    businessType: 'Dairy Farming (Murrah Breed)',
    subject: 'Subsidized Green Fodder Seeds & Animal Health Camp',
    status: 'resolved',
    lastUpdated: '02 Mar 2026',
    unreadByOfficer: false,
    unreadByCitizen: false,
    messages: [
      {
        id: 'm1',
        sender: 'citizen',
        senderName: 'Savita Devi',
        text: 'Sir, kya agle hafte gram sabha me pashu chikitsa ka camp lag raha hai? Buffalo vaccination karani hai.',
        timestamp: '02 Mar 2026, 10:15 AM'
      },
      {
        id: 'm2',
        sender: 'officer',
        senderName: 'Sanjay Verma (VDO)',
        text: 'Haan Savita ji, 6 March ko Veterinary Doctor block se Bhiti Rawat Panchayat bhavan me rahenge. Muft vaccination aur deworming medicine uplabdh rahegi.',
        timestamp: '02 Mar 2026, 11:30 AM',
        badge: 'Official Verification'
      }
    ]
  },
  {
    id: 'thread_002',
    villageId: 'vil_bhiti',
    villageName: 'Bhiti Rawat',
    entrepreneurName: 'Manoj Kumar Yadav',
    entrepreneurPhone: '9876503344',
    businessType: 'Mustard Oil Expeller Unit',
    subject: 'PMFME 35% Subsidy File Status at PNB Sahjanwa Branch',
    status: 'open',
    lastUpdated: '05 Mar 2026',
    unreadByOfficer: true,
    unreadByCitizen: false,
    messages: [
      {
        id: 'm10',
        sender: 'citizen',
        senderName: 'Manoj Kumar Yadav',
        text: 'Namaste Verma ji. PNB branch manager keh rahe hain ki District Level Committee (DLC) approval letter lana hoga. Kya aap letter release karwa sakte hain?',
        timestamp: '05 Mar 2026, 03:45 PM'
      },
      {
        id: 'm11',
        sender: 'officer',
        senderName: 'Sanjay Verma (VDO)',
        text: 'Manoj ji, maine Gorakhpur DIC portal par aapka physical inspection upload kar diya hai. Kal 11 baje block aakar sign kiya hua sanction endorse letter le lijiye.',
        timestamp: '05 Mar 2026, 05:20 PM',
        badge: 'Action Taken'
      }
    ]
  }
];

// Helper: safe JSON parse
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    notifyListeners();
  } catch (e) {
    console.warn('Storage quota or security restriction:', e);
  }
}

// Global listener pool for instant multi-role reactivity
type StoreListener = () => void;
const listeners = new Set<StoreListener>();

export function subscribeToStore(fn: StoreListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notifyListeners() {
  listeners.forEach(fn => {
    try { fn(); } catch (err) { console.error('Store subscriber error:', err); }
  });
}

// -------------------------------------------------------------
// APP ROLE SESSION APIS
// -------------------------------------------------------------
export function getSavedAppRole(): 'entrepreneur' | 'field_officer' {
  return getStored<'entrepreneur' | 'field_officer'>(STORAGE_KEYS.ACTIVE_ROLE, 'entrepreneur');
}

export function saveAppRole(role: 'entrepreneur' | 'field_officer'): void {
  setStored(STORAGE_KEYS.ACTIVE_ROLE, role);
}

// -------------------------------------------------------------
// BENEFICIARY PROFILE APIS
// -------------------------------------------------------------
export function getSavedBeneficiaryProfile(): BeneficiaryProfile | null {
  return getStored<BeneficiaryProfile | null>(STORAGE_KEYS.BENEFICIARY, null);
}

export function saveBeneficiaryProfile(prof: BeneficiaryProfile): void {
  setStored(STORAGE_KEYS.BENEFICIARY, prof);
  syncCitizenToVillageDirectory(prof);
}

// -------------------------------------------------------------
// REGISTERED ENTREPRENEURS & ACTIVE SESSION APIS
// -------------------------------------------------------------
export function getRegisteredEntrepreneurs(): RegisteredEntrepreneur[] {
  return getStored<RegisteredEntrepreneur[]>(STORAGE_KEYS.REGISTERED_ENTREPRENEURS, SEED_REGISTERED_ENTREPRENEURS);
}

export function findRegisteredEntrepreneur(phone: string): RegisteredEntrepreneur | undefined {
  const all = getRegisteredEntrepreneurs();
  const clean = phone.replace(/\D/g, '').slice(-10);
  return all.find(e => e.phone.replace(/\D/g, '').slice(-10) === clean);
}

export function registerNewEntrepreneur(account: RegisteredEntrepreneur): void {
  const all = getRegisteredEntrepreneurs();
  const clean = account.phone.replace(/\D/g, '').slice(-10);
  const idx = all.findIndex(e => e.phone.replace(/\D/g, '').slice(-10) === clean);
  if (idx >= 0) {
    all[idx] = account;
  } else {
    all.unshift(account);
  }
  setStored(STORAGE_KEYS.REGISTERED_ENTREPRENEURS, all);
  saveActiveEntrepreneurSession(account.profile);
}

export function getActiveEntrepreneurSession(): BeneficiaryProfile | null {
  return getStored<BeneficiaryProfile | null>(STORAGE_KEYS.ACTIVE_ENTREPRENEUR_SESSION, null);
}

export function saveActiveEntrepreneurSession(prof: BeneficiaryProfile): void {
  setStored(STORAGE_KEYS.ACTIVE_ENTREPRENEUR_SESSION, prof);
  setStored(STORAGE_KEYS.BENEFICIARY, prof);
  syncCitizenToVillageDirectory(prof);
}

export function clearActiveEntrepreneurSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ENTREPRENEUR_SESSION);
  } catch (e) {}
}

// -------------------------------------------------------------
// VILLAGE BUSINESS DIRECTORY APIS
// -------------------------------------------------------------
export function getAllVillageBusinesses(): VillageBusiness[] {
  return getStored<VillageBusiness[]>(STORAGE_KEYS.BUSINESSES, SEED_VILLAGE_BUSINESSES);
}

export function getBusinessesByVillage(villageId: string): VillageBusiness[] {
  const all = getAllVillageBusinesses();
  return all.filter(b => b.villageId === villageId || villageId === 'all');
}

export function saveVillageBusiness(biz: VillageBusiness): void {
  const current = getAllVillageBusinesses();
  const idx = current.findIndex(b => b.id === biz.id);
  if (idx >= 0) {
    current[idx] = biz;
  } else {
    current.unshift(biz);
  }
  setStored(STORAGE_KEYS.BUSINESSES, current);
}

export function updateBusinessInspection(
  bizId: string, 
  notes: string, 
  status: VillageBusiness['schemeStatus'],
  subsidyAmount?: number,
  health?: VillageBusiness['performanceHealth']
): void {
  const current = getAllVillageBusinesses();
  const idx = current.findIndex(b => b.id === bizId);
  if (idx >= 0) {
    current[idx].inspectionNotes = notes;
    current[idx].schemeStatus = status;
    if (subsidyAmount !== undefined) current[idx].subsidyAmount = subsidyAmount;
    if (health) current[idx].performanceHealth = health;
    current[idx].lastInspectionDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setStored(STORAGE_KEYS.BUSINESSES, current);
  }
}

function syncCitizenToVillageDirectory(prof: BeneficiaryProfile) {
  if (!prof.fullName || prof.fullName.trim() === '') return;
  const current = getAllVillageBusinesses();
  const citizenBizId = 'biz_citizen_' + (prof.phone || 'default');
  
  const existingIndex = current.findIndex(b => b.id === citizenBizId || b.phone === prof.phone);
  const capital = prof.capital || 80000;
  const subsidyAmount = Math.round(capital * 0.35);

  const syncedRecord: VillageBusiness = {
    id: citizenBizId,
    entrepreneurName: prof.fullName,
    phone: prof.phone || '9876543210',
    businessName: `${prof.fullName}'s ${prof.selectedBizName || 'Rural Enterprise'}`,
    category: prof.selectedBizName?.includes('Dairy') ? 'Dairy & Livestock' : 'Agro & Food Processing',
    villageId: prof.villageId || 'vil_bhiti',
    villageName: prof.villageName || 'Bhiti Rawat',
    block: 'Sahjanwa',
    investment: capital,
    annualTurnover: Math.round(capital * 2.8),
    allocatedScheme: 'PMEGP (35% Rural Subsidy Allocation)',
    subsidyPercent: 35,
    subsidyAmount: subsidyAmount,
    bankName: 'Punjab National Bank - Sahjanwa Branch',
    schemeStatus: 'Applied',
    sanctionedAmount: Math.round(capital * 1.5),
    disbursedDate: 'Pending Ground Verification by VDO',
    riskStatus: 'Low Risk',
    performanceHealth: 'Awaiting Disbursal',
    lastInspectionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    inspectionNotes: `Self-registered via GramUdyam Citizen Portal with ₹${capital.toLocaleString()} initial capital. Ready for ground appraisal by VDO Sanjay Verma.`,
    gpsCoordinates: { lat: 26.7450, lng: 83.2500 }
  };

  if (existingIndex >= 0) {
    current[existingIndex] = { ...current[existingIndex], ...syncedRecord };
  } else {
    current.unshift(syncedRecord);
  }
  setStored(STORAGE_KEYS.BUSINESSES, current);
}

// -------------------------------------------------------------
// MULTI-TENANT ADVISOR INBOX & AI ROUTING APIS
// -------------------------------------------------------------
export function getAllAdvisorThreads(): AdvisorThread[] {
  return getStored<AdvisorThread[]>(STORAGE_KEYS.THREADS, SEED_ADVISOR_THREADS);
}

export function getAdvisorThreadsForVillage(villageId: string): AdvisorThread[] {
  const all = getAllAdvisorThreads();
  if (villageId === 'all') return all;
  return all.filter(t => t.villageId === villageId);
}

export function getOrCreateThreadForCitizen(prof: BeneficiaryProfile): AdvisorThread {
  const all = getAllAdvisorThreads();
  const phone = prof.phone || '9876543210';
  const existing = all.find(t => t.entrepreneurPhone === phone);
  
  if (existing) {
    return existing;
  }

  // Create initial consultation thread connecting citizen to Field Officer & AI Advisor
  const newThread: AdvisorThread = {
    id: 'thread_citizen_' + phone,
    villageId: prof.villageId || 'vil_bhiti',
    villageName: prof.villageName || 'Bhiti Rawat',
    entrepreneurName: prof.fullName || 'Rural Entrepreneur',
    entrepreneurPhone: phone,
    businessType: prof.selectedBizName || 'Dairy Enterprise',
    subject: `Business Solutions & Govt Scheme Guidance for ${prof.fullName || 'Citizen'}`,
    status: 'open',
    lastUpdated: 'Just now',
    unreadByOfficer: true,
    unreadByCitizen: false,
    messages: [
      {
        id: 'msg_welcome_ai',
        sender: 'ai',
        senderName: 'GramUdyam AI Advisor',
        text: `नमस्ते ${prof.fullName || 'उद्यमी'} जी! मैं आपका डिजिटल बिजनेस सलाहकार (AI) हूँ। आप अपने व्यवसाय, बैंक लोन, या सरकारी सब्सिडी से जुड़ा कोई भी प्रश्न पूछ सकते हैं। आपका हर संदेश आपके ग्राम पंचायत के अधिकृत अधिकारी श्री संजय वर्मा (VDO, भीटी रावत) को भी सीधे प्रेषित किया जाता है।`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: 'AI Powered 24/7'
      },
      {
        id: 'msg_welcome_officer',
        sender: 'officer',
        senderName: DEFAULT_FIELD_OFFICER.fullName + ' (VDO)',
        text: `संजय वर्मा (VDO - सहजनवा ब्लॉक): आपका डीपीआर हमारे पोर्टल पर दर्ज हो चुका है। आवश्यक सत्यापन और 35% PMEGP सब्सिडी संस्तुति के लिए संपर्क में रहें।`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: 'Area Nodal Officer'
      }
    ]
  };

  all.unshift(newThread);
  setStored(STORAGE_KEYS.THREADS, all);
  return newThread;
}

export function postAdvisorMessage(
  threadId: string, 
  text: string, 
  sender: 'citizen' | 'officer' | 'ai', 
  senderName: string,
  badge?: string
): void {
  const all = getAllAdvisorThreads();
  const thread = all.find(t => t.id === threadId);
  if (!thread) return;

  const now = new Date();
  const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ', ' + 
                  now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMsg: AdvisorMessage = {
    id: 'msg_' + Date.now(),
    sender,
    senderName,
    text,
    timestamp: timeStr,
    badge
  };

  thread.messages.push(newMsg);
  thread.lastUpdated = timeStr;
  
  if (sender === 'citizen') {
    // Unread notification for officer in his jurisdiction inbox
    thread.unreadByOfficer = true;
  } else {
    thread.unreadByCitizen = true;
  }

  setStored(STORAGE_KEYS.THREADS, all);
}

// Simulated fast intelligent AI response that supports the entrepreneur immediately
export function generateAiAdvisorSupport(query: string, businessType: string): string {
  const lower = query.toLowerCase();
  if (lower.includes('pmegp') || lower.includes('subsidy') || lower.includes('सब्सिडी') || lower.includes('दस्तावेज')) {
    return `[AI Advisor]: PMEGP योजना के तहत ग्रामीण क्षेत्र में OBC/SC/ST/महिला उद्यमियों को 35% तक पूँजीगत सब्सिडी मिलती है। आवश्यक दस्तावेज़: (1) आधार कार्ड, (2) जाति प्रमाण पत्र, (3) प्रोजेक्ट DPR रिपोर्ट, (4) ज़मीन/किरायानामा, (5) बैंक पासबुक। आपका यह प्रश्न VDO संजय वर्मा जी को भी भेज दिया गया है।`;
  }
  if (lower.includes('loan') || lower.includes('बैंक') || lower.includes('ऋण') || lower.includes('pnb')) {
    return `[AI Advisor]: आपके ${businessType || 'डेयरी उद्यम'} के लिए बैंक 85% तक ऋण स्वीकृत करता है, जिसमें केवल 15% उद्यमी अंशदान आवश्यक है। PNB सहजनवा शाखा में DPR जमा करने के बाद 14 कार्यदिवसों में संस्तुति प्राप्त हो जाती है।`;
  }
  if (lower.includes('doctor') || lower.includes('पशु') || lower.includes('टीका') || lower.includes('vaccin')) {
    return `[AI Advisor]: पशुपालन विभाग द्वारा प्रत्येक माह के पहले सप्ताह में सहजनवा ब्लॉक में निःशुल्क खुरपका-मुँहपका (FMD) टीकाकरण शिविर आयोजित किया जाता है। पंचायत भवन पर उपलब्ध सूची से स्लॉट बुक कर सकते हैं।`;
  }
  return `[AI Advisor]: आपके प्रश्न का विश्लेषण किया गया है। ग्रामीण उद्यम नीति 2024 के अनुसार आपकी इकाई पूर्ण रूप से पात्र है। यह संदेश आपके ग्राम नोडल अधिकारी (संजय वर्मा, VDO) के इनबॉक्स में स्थानांतरित कर दिया गया है।`;
}

export function getOfficerProofDoc(): UploadedProofDoc {
  return getStored<UploadedProofDoc>(STORAGE_KEYS.OFFICER_PROOF, DEFAULT_FIELD_OFFICER.uploadedProofDoc!);
}

export function saveOfficerProofDoc(proof: UploadedProofDoc): void {
  setStored(STORAGE_KEYS.OFFICER_PROOF, proof);
}

