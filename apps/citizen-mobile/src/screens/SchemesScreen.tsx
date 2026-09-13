/**
 * GramUdyam — Government Schemes & Subsidies Screen (Module 2)
 * Features:
 * 1. ⭐ Best Recommended Scheme vs. Other Schemes with Universal "Apply Now" & "Set as Active"
 * 2. Customizable Scheme Comparison Matrix (Toggle schemes, filter parameters, compare side-by-side)
 * 3. Dynamic Scheme-Specific Eligibility Checker (Adapts criteria & match score to chosen scheme)
 * 4. Dynamic Scheme-Specific Document Vault (Exact statutory documents & readiness meter per scheme)
 * 5. Interactive Application Submission Modal & Real-Time Application Stage Tracker
 */
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOW } from '../theme';
import { BeneficiaryProfile, getActiveScheme, saveActiveScheme } from '../services/enterpriseStore';
import { Language, translations } from '../locales';

interface Props {
  userProfile: BeneficiaryProfile;
  lang: Language;
  onNavigateToFinance?: () => void;
  initialSchemeId?: string;
}

type SchemesSubTab = 'recommended' | 'eligibility' | 'documents' | 'compare' | 'tracking';

export interface SchemeData {
  id: string;
  name: string;
  shortName: string;
  code: string;
  ministry: string;
  subsidyPct: string;
  subsidyCap: string;
  maxProjectCost: string;
  maxLoan: string;
  interestRate: string;
  moratorium: string;
  tenure: string;
  marginReq: string;
  collateral: string;
  complexity: 'Easy' | 'Medium' | 'High';
  processingTime: string;
  approvingBody: string;
  bestSuitedFor: string;
  matchScore: number;
  matchReason: string;
  advantages: string[];
  eligibilityRules: Array<{
    id: string;
    title: string;
    description: string;
    passed: boolean;
    warning?: boolean;
    statutoryNote: string;
  }>;
  requiredDocuments: Array<{
    id: string;
    name: string;
    description: string;
    status: 'Verified' | 'Generated' | 'Uploaded' | 'Pending';
    code: string;
    mandatory: boolean;
  }>;
}

export const SchemesScreen: React.FC<Props> = ({ userProfile, lang, onNavigateToFinance, initialSchemeId }) => {
  const isEn = lang === 'en';
  // t = translation shorthand for the current language
  const t = translations[lang] || translations['hi'];
  const [activeSubTab, setActiveSubTab] = useState<SchemesSubTab>(() => initialSchemeId ? 'eligibility' : 'recommended');
  const [activeSchemeId, setActiveSchemeId] = useState<string>(() => initialSchemeId || getActiveScheme('pmegp'));
  
  // Scheme selected for viewing in Eligibility / Documents tab
  const [inspectedSchemeId, setInspectedSchemeId] = useState<string>(() => initialSchemeId || getActiveScheme('pmegp'));

  useEffect(() => {
    if (initialSchemeId) {
      setActiveSchemeId(initialSchemeId);
      setInspectedSchemeId(initialSchemeId);
      setActiveSubTab('eligibility');
    }
  }, [initialSchemeId]);

  // Comparison Tab: User-customizable scheme selection
  const [comparedSchemeIds, setComparedSchemeIds] = useState<string[]>(['pmegp', 'pmfme', 'mudra', 'ahidf']);
  const [compareParamFilter, setCompareParamFilter] = useState<'all' | 'financial' | 'terms'>('all');

  // Application Modal state
  const [applyModalScheme, setApplyModalScheme] = useState<SchemeData | null>(null);
  const [applicationChannel, setApplicationChannel] = useState<'online' | 'vdo' | 'dossier'>('online');
  const [submittedApps, setSubmittedApps] = useState<Array<{
    schemeId: string;
    schemeName: string;
    appId: string;
    date: string;
    channel: string;
  }>>([
    {
      schemeId: 'pmegp',
      schemeName: "Prime Minister's Employment Generation Programme (PMEGP)",
      appId: 'PMEGP/2026/GKP/88921',
      date: '12 Sep 2026',
      channel: 'KVIC Direct API & VDO Pack',
    },
  ]);

  const village = userProfile.villageName || 'Bhiti Rawat';
  const district = userProfile.districtName || 'Gorakhpur';
  const bizName = userProfile.selectedBizName || 'Dairy Farming & Milk Chilling Center';
  const capital = userProfile.capital || 100000;
  const isRural = !userProfile.villageName?.toLowerCase().includes('city');
  const socialCat = userProfile.socialCategory || 'OBC';
  const isSpecialCategory = ['OBC', 'SC', 'ST', 'Women', 'Minority', 'Ex-Servicemen'].includes(socialCat) || userProfile.gender === 'Female';

  // -------------------------------------------------------------
  // MASTER SCHEMES DATASET WITH OFFICIAL STATUTORY RULES
  // -------------------------------------------------------------
  const allSchemes: SchemeData[] = useMemo(() => [
    {
      id: 'pmegp',
      name: "Prime Minister's Employment Generation Programme (PMEGP)",
      shortName: 'PMEGP',
      code: 'PMEGP-2024-MSME',
      ministry: 'Ministry of MSME & KVIC',
      subsidyPct: isRural && isSpecialCategory ? '35% Rural Capital Grant' : isRural ? '25% Rural Grant' : '15-25% Urban Grant',
      subsidyCap: 'Max ₹17.50 Lakh (Manufacturing) / ₹7.00 Lakh (Service)',
      maxProjectCost: '₹ 50.00 Lakh (Mfg) / ₹ 20.00 Lakh (Service)',
      maxLoan: '₹ 45.00 Lakh',
      interestRate: '8.5% p.a. (Bank Base Rate)',
      moratorium: '6 Months',
      tenure: '7 Years',
      marginReq: isSpecialCategory ? '5% Own Contribution' : '10% Own Contribution',
      collateral: 'Collateral-Free (Under CGTMSE Guarantee)',
      complexity: 'Medium',
      processingTime: '21 to 30 Days',
      approvingBody: 'DTFC & Lead Bank (PNB Gorakhpur)',
      bestSuitedFor: 'Manufacturing & processing units in rural areas seeking high upfront capital subsidy.',
      matchScore: 95,
      matchReason: `Your ${socialCat} category in rural ${village} qualifies for the peak 35% capital subsidy. Project cost for ${bizName} aligns smoothly with PMEGP manufacturing limits.`,
      advantages: ['Highest Capital Subsidy (35%)', 'Only 5-10% Promoter Margin', 'Collateral-Free CGTMSE Cover', 'Direct Bank Account Credit'],
      eligibilityRules: [
        {
          id: 'p1',
          title: isEn ? 'Age Requirement (>= 18 Years)' : 'आयु सीमा (18 वर्ष या अधिक)',
          description: isEn ? `Age: ${userProfile.age || 32} years. Complies with statutory requirement.` : `वर्तमान आयु ${userProfile.age || 32} वर्ष। न्यूनतम 18 वर्ष की शर्त पूर्ण।`,
          passed: true,
          statutoryNote: 'Section 4(a) PMEGP Operational Guidelines.',
        },
        {
          id: 'p2',
          title: isEn ? 'Location & Social Category (35% Subsidy)' : 'ग्रामीण क्षेत्र एवं सामाजिक वर्ग (35% सब्सिडी)',
          description: isEn ? `Rural beneficiary in ${village} under ${socialCat} category qualifies for peak 35% grant.` : `${village} (ग्रामीण) एवं ${socialCat} वर्ग के अंतर्गत 35% उच्चतम सब्सिडी हेतु पात्र।`,
          passed: true,
          statutoryNote: 'KVIC Rural Special Category Clause 5.2.',
        },
        {
          id: 'p3',
          title: isEn ? 'Business Activity Match' : 'व्यापार गतिविधि पात्रता',
          description: isEn ? `${bizName} is classified under Approved MSME Agro-Allied Processing.` : `${bizName} अनुमोदित एमएसएमई एग्रो/डेयरी प्रसंस्करण के अंतर्गत आती है।`,
          passed: true,
          statutoryNote: 'PMEGP Negative List Exemption Verified.',
        },
        {
          id: 'p4',
          title: isEn ? 'Promoter Margin Sufficiency' : 'स्वयं अंशदान (मार्जिन) उपलब्धता',
          description: isEn ? `Available capital ₹${capital.toLocaleString()} comfortably covers mandatory 5% margin (₹24,000).` : `उपलब्ध पूंजी ₹${capital.toLocaleString()} आवश्यक 5% मार्जिन (₹24,000) से अधिक है।`,
          passed: true,
          statutoryNote: 'Minimum 5% own contribution mandate met.',
        },
        {
          id: 'p5',
          title: isEn ? 'Educational Qualification (8th Standard)' : 'शैक्षणिक योग्यता (8वीं पास)',
          description: isEn ? 'Self-declared 8th standard pass marksheet available.' : '8वीं कक्षा उत्तीर्ण स्व-प्रमाणपत्र संलग्न।',
          passed: true,
          statutoryNote: 'Mandatory for projects above ₹10 Lakh in manufacturing.',
        },
        {
          id: 'p6',
          title: isEn ? 'EDP Training Undertaking' : 'उद्यमिता विकास प्रशिक्षण (EDP)',
          description: isEn ? 'Online EDP training can be completed post-sanction via KVIC e-portal.' : 'ऋण स्वीकृति के उपरांत KVIC पोर्टल से ऑनलाइन EDP पूर्ण की जा सकती है।',
          passed: true,
          warning: true,
          statutoryNote: '5-10 days mandatory EDP training prior to subsidy release.',
        },
      ],
      requiredDocuments: [
        { id: 'd1', name: 'Identity Proof (Aadhaar Card)', description: 'UIDAI verified biometric Aadhaar', status: 'Verified', code: '✓', mandatory: true },
        { id: 'd2', name: 'Permanent Account Number (PAN Card)', description: 'Income Tax Department PAN', status: 'Verified', code: '✓', mandatory: true },
        { id: 'd3', name: 'Rural Area Certificate', description: 'Issued by Gram Pradhan / BDO Officer', status: 'Verified', code: '✓', mandatory: true },
        { id: 'd4', name: `Caste Certificate (${socialCat})`, description: 'Tehsildar signed OBC/SC/ST certificate', status: 'Verified', code: '✓', mandatory: isSpecialCategory },
        { id: 'd5', name: 'Detailed Project Report (DPR Report)', description: '31-Section Bank DPR generated from App', status: 'Generated', code: '📄', mandatory: true },
        { id: 'd6', name: 'Machinery Quotations with GSTIN', description: 'Valid proforma invoices from authorized vendor', status: 'Uploaded', code: '📎', mandatory: true },
        { id: 'd7', name: 'Land Ownership / Lease Agreement', description: 'Minimum 3 years registered lease or Khatauni', status: 'Uploaded', code: '📎', mandatory: true },
        { id: 'd8', name: 'Gram Panchayat NOC', description: 'No-objection certificate for rural unit', status: 'Verified', code: '✓', mandatory: true },
        { id: 'd9', name: 'EDP Training Certificate', description: 'KVIC / RSETI certified training receipt', status: 'Pending', code: '⏱', mandatory: false },
      ],
    },
    {
      id: 'pmfme',
      name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
      shortName: 'PMFME',
      code: 'PMFME-2024-MOFPI',
      ministry: 'Ministry of Food Processing Industries (MoFPI)',
      subsidyPct: '35% Credit-linked Capital Grant',
      subsidyCap: 'Max ₹10.00 Lakh per unit',
      maxProjectCost: '₹ 30.00 Lakh',
      maxLoan: '₹ 20.00 Lakh',
      interestRate: '8.0% - 8.5% p.a.',
      moratorium: '6 Months',
      tenure: '5 to 7 Years',
      marginReq: '10% Own Contribution',
      collateral: 'Collateral-Free up to ₹10L (CGTMSE)',
      complexity: 'Easy',
      processingTime: '15 to 25 Days',
      approvingBody: 'District Level Committee (DLC) & Bank',
      bestSuitedFor: 'Micro food processing, dairy chilling, spices, oil expellers, packaging units.',
      matchScore: 89,
      matchReason: `Directly caters to ${bizName}. Provides 35% grant up to ₹10 Lakh with dedicated handholding by District Resource Persons (DRP).`,
      advantages: ['Direct Food Processing Mandate', 'Free DRP Technical Handholding', '35% Credit-linked Grant', 'Simplified FSSAI & Udyam Formalization'],
      eligibilityRules: [
        {
          id: 'pf1',
          title: isEn ? 'Food/Agro Processing Enterprise' : 'खाद्य/डेयरी प्रसंस्करण गतिविधि',
          description: isEn ? `${bizName} is 100% eligible under PMFME perishable commodity mandate.` : `${bizName} पीएमएफएमई के खाद्य एवं डेयरी प्रसंस्करण में पूर्णतः योग्य है।`,
          passed: true,
          statutoryNote: 'MoFPI ODOP (One District One Product) Compatible.',
        },
        {
          id: 'pf2',
          title: isEn ? 'Legal Status (Individual / Proprietary)' : 'इकाई का प्रकार (व्यक्तिगत/प्रोपराइटर)',
          description: isEn ? 'Individual rural micro-entrepreneur eligible for capital grant.' : 'व्यक्तिगत ग्रामीण उद्यमी पूंजीगत अनुदान हेतु पात्र।',
          passed: true,
          statutoryNote: 'Clause 4.1 Scheme Guidelines.',
        },
        {
          id: 'pf3',
          title: isEn ? 'Promoter 10% Contribution' : 'न्यूनतम 10% मार्जिन आवश्यकता',
          description: isEn ? `Your ₹${capital.toLocaleString()} satisfies the required 10% promoter equity.` : `आपकी ₹${capital.toLocaleString()} पूंजी 10% मार्जिन को पूरा करती है।`,
          passed: true,
          statutoryNote: 'Mandatory 10% beneficiary contribution.',
        },
        {
          id: 'pf4',
          title: isEn ? 'FSSAI Registration Undertaking' : 'FSSAI खाद्य सुरक्षा पंजीकरण प्रतिबद्धता',
          description: isEn ? 'Willingness to obtain basic FSSAI registration within 6 months of sanction.' : 'स्वीकृति के 6 माह के भीतर FSSAI लाइसेंस लेने का वचन।',
          passed: true,
          warning: true,
          statutoryNote: 'Mandatory compliance post-disbursement.',
        },
      ],
      requiredDocuments: [
        { id: 'pfd1', name: 'Identity & Address Proof (Aadhaar & PAN)', description: 'Biometric identity verification', status: 'Verified', code: '✓', mandatory: true },
        { id: 'pfd2', name: 'Udyam Registration Certificate', description: 'MSME registration certificate', status: 'Verified', code: '✓', mandatory: true },
        { id: 'pfd3', name: 'Food Processing Detailed Project Report', description: 'Techno-commercial DPR with flow chart', status: 'Generated', code: '📄', mandatory: true },
        { id: 'pfd4', name: 'Machinery & Cold Equipment Quotation', description: 'Vendor quotation with GSTIN and specs', status: 'Uploaded', code: '📎', mandatory: true },
        { id: 'pfd5', name: 'Electricity Utility Connection Bill', description: 'Commercial or agro power bill', status: 'Uploaded', code: '📎', mandatory: true },
        { id: 'pfd6', name: 'Bank Statement (Last 6 Months)', description: 'Savings or current bank statement', status: 'Verified', code: '✓', mandatory: true },
        { id: 'pfd7', name: 'FSSAI License / Basic Undertaking', description: 'Basic food safety declaration', status: 'Pending', code: '⏱', mandatory: true },
      ],
    },
    {
      id: 'mudra',
      name: 'Pradhan Mantri MUDRA Yojana (Tarun / Kishor)',
      shortName: 'PM MUDRA',
      code: 'MUDRA-2024-DFS',
      ministry: 'Ministry of Finance & SIDBI',
      subsidyPct: 'Zero Subsidy (Collateral-Free Bank Rate)',
      subsidyCap: 'No Capital Subsidy (Subsidized Credit)',
      maxProjectCost: '₹ 10.00 Lakh',
      maxLoan: '₹ 10.00 Lakh (Tarun Category)',
      interestRate: '8.75% - 9.5% p.a.',
      moratorium: '3 Months',
      tenure: '3 to 5 Years',
      marginReq: '0% (Shishu) to 15% (Tarun)',
      collateral: '100% Collateral-Free (Covered by CGFMU)',
      complexity: 'Easy',
      processingTime: '7 to 10 Days (Fastest)',
      approvingBody: 'Local Commercial / Gramin Bank Branch',
      bestSuitedFor: 'Immediate equipment purchase, working capital, small service units with minimal paperwork.',
      matchScore: 78,
      matchReason: `Fastest sanction time (7 days) and zero collateral requirement. However, it does not provide the 35% cash capital subsidy available in PMEGP.`,
      advantages: ['Fastest Bank Sanction (7–10 Days)', 'Zero Collateral (CGFMU Guarantee)', 'No Processing Fee', 'Simple Documentation'],
      eligibilityRules: [
        {
          id: 'm1',
          title: isEn ? 'Non-Farm Micro Enterprise Activity' : 'गैर-कृषि सूक्ष्म उद्यम गतिविधि',
          description: isEn ? `${bizName} qualifies under MUDRA micro processing & service window.` : `${bizName} मुद्रा ऋण के अंतर्गत पात्र व्यावसायिक गतिविधि है।`,
          passed: true,
          statutoryNote: 'PMMY Section 2 Guidelines.',
        },
        {
          id: 'm2',
          title: isEn ? 'Credit Score / No Prior Default' : 'क्रेडिट हिस्ट्री / पूर्व डिफ़ॉल्ट रहित',
          description: isEn ? 'Clean CIBIL profile with no past overdue loans in scheduled banks.' : 'कोई पूर्व बैंक ऋण डिफ़ॉल्ट नहीं, स्वच्छ सिबिल रिकॉर्ड।',
          passed: true,
          statutoryNote: 'Mandatory CIBIL / Experian check.',
        },
        {
          id: 'm3',
          title: isEn ? 'Loan Limit Ceiling' : 'ऋण सीमा ₹10 लाख के अंदर',
          description: isEn ? 'Project loan falls within Kishor (₹5L) or Tarun (₹10L) ceiling.' : 'परियोजना ऋण किशोर (₹5L) अथवा तरुण (₹10L) सीमा में है।',
          passed: true,
          statutoryNote: 'PMMY statutory loan ceiling.',
        },
      ],
      requiredDocuments: [
        { id: 'md1', name: 'Identity Proof (Aadhaar Card)', description: 'Government photo ID', status: 'Verified', code: '✓', mandatory: true },
        { id: 'md2', name: 'Permanent Account Number (PAN)', description: 'Income Tax PAN', status: 'Verified', code: '✓', mandatory: true },
        { id: 'md3', name: 'Proof of Business Address', description: 'Gram Panchayat certificate or electricity bill', status: 'Verified', code: '✓', mandatory: true },
        { id: 'md4', name: 'Machinery / Asset Quotation', description: 'Equipment invoice from vendor', status: 'Uploaded', code: '📎', mandatory: true },
        { id: 'md5', name: '6-Month Bank Account Passbook', description: 'Bank transaction history', status: 'Verified', code: '✓', mandatory: true },
        { id: 'md6', name: 'No-Default Self-Declaration', description: 'Affidavit declaring no overdue loan', status: 'Verified', code: '✓', mandatory: true },
      ],
    },
    {
      id: 'ahidf',
      name: 'Animal Husbandry Infrastructure Development Fund (AHIDF)',
      shortName: 'AHIDF',
      code: 'AHIDF-DAHD-GOI',
      ministry: 'Department of Animal Husbandry & Dairying (DAHD)',
      subsidyPct: '3% Direct Interest Subvention',
      subsidyCap: '3% p.a. Subvention for entire 8-Year tenure',
      maxProjectCost: '₹ 2.00 Crore+ (Scaleable)',
      maxLoan: 'Up to 90% of Project Cost',
      interestRate: '6.5% Net p.a. (Post 3% GOI Subvention)',
      moratorium: '2 Years (24 Months - Longest)',
      tenure: '8 to 10 Years',
      marginReq: '10% (Micro/Small) / 15% (Medium)',
      collateral: 'NABARD / DAHD Credit Guarantee up to 25%',
      complexity: 'High',
      processingTime: '30 to 45 Days',
      approvingBody: 'DAHD Project Appraisal Committee & Bank',
      bestSuitedFor: 'Commercial dairy chilling plants, bulk milk coolers (BMC), value added milk processing.',
      matchScore: 82,
      matchReason: `Best suited for commercial expansion of ${bizName}. Offers 24-month moratorium (grace period) and 3% interest discount, ideal if setting up a 1,000L+ chilling facility.`,
      advantages: ['24-Month Longest Moratorium', '3% Annual Interest Discount', 'Scaleable up to ₹2 Crore', 'NABARD Credit Guarantee'],
      eligibilityRules: [
        {
          id: 'ah1',
          title: isEn ? 'Dairy & Livestock Infrastructure Sector' : 'डेयरी एवं पशुपालन अवसंरचना क्षेत्र',
          description: isEn ? `${bizName} is a priority category under AHIDF value addition.` : `${bizName} पशुपालन अवसंरचना विकास निधि की शीर्ष प्राथमिकता है।`,
          passed: true,
          statutoryNote: 'DAHD Notification AHIDF/2020.',
        },
        {
          id: 'ah2',
          title: isEn ? 'Backward Linkages to Milk Producers' : 'स्थानीय दुग्ध उत्पादक किसानों से अनुबंध',
          description: isEn ? `Direct procurement planned from 30+ dairy farmers in ${village}.` : `${village} के 30+ पशुपालकों से सीधा दुग्ध संकलन मॉडल।`,
          passed: true,
          statutoryNote: 'Mandatory backward linkage requirement.',
        },
        {
          id: 'ah3',
          title: isEn ? 'Minimum 10% Margin Capital' : 'न्यूनतम 10% इक्विटी पूंजी',
          description: isEn ? `₹${capital.toLocaleString()} satisfies the promoter margin requirement.` : `उपलब्ध पूंजी मार्जिन अंशदान को पूरा करती है।`,
          passed: true,
          statutoryNote: 'Section 6.3 Guidelines.',
        },
        {
          id: 'ah4',
          title: isEn ? 'Environmental & Veterinary Clearance' : 'प्रदूषण नियंत्रण एवं पशुपालन विभाग अनापत्ति',
          description: isEn ? 'State Veterinary Officer inspection and pollution consent letter required.' : 'जिला पशुपालन अधिकारी एवं राज्य प्रदूषण बोर्ड अनापत्ति पत्र आवश्यक।',
          passed: false,
          warning: true,
          statutoryNote: 'Mandatory for processing setups.',
        },
      ],
      requiredDocuments: [
        { id: 'ahd1', name: 'Techno-Economic DPR & Feasibility Report', description: 'Detailed engineering & financial model', status: 'Generated', code: '📄', mandatory: true },
        { id: 'ahd2', name: 'Land Title / 10-Year Registered Lease', description: 'Registered lease deed or land registry', status: 'Uploaded', code: '📎', mandatory: true },
        { id: 'ahd3', name: 'Machinery & Bulk Milk Cooler Quotations', description: 'Technical specifications from certified OEM', status: 'Uploaded', code: '📎', mandatory: true },
        { id: 'ahd4', name: 'District Veterinary Officer NOC', description: 'Veterinary health inspection report', status: 'Pending', code: '⏱', mandatory: true },
        { id: 'ahd5', name: 'Bank In-Principle Consent Letter', description: 'Sanction willingness letter from scheduled bank', status: 'Pending', code: '⏱', mandatory: true },
        { id: 'ahd6', name: 'Promoter KYC & Financial Net Worth', description: 'Audited CA Net worth & CIBIL score', status: 'Verified', code: '✓', mandatory: true },
      ],
    },
    {
      id: 'standup',
      name: 'Stand-Up India Scheme for Women & SC/ST',
      shortName: 'Stand-Up India',
      code: 'SUI-2024-SIDBI',
      ministry: 'Ministry of Finance & SIDBI',
      subsidyPct: '15% Margin Money Convergence Assistance',
      subsidyCap: 'Composite Loan ₹10 Lakh to ₹1.00 Crore',
      maxProjectCost: '₹ 1.00 Crore',
      maxLoan: '₹ 1.00 Crore',
      interestRate: '8.5% - 8.9% p.a. (Lowest Tenor Bank Rate)',
      moratorium: 'Up to 18 Months',
      tenure: '7 Years',
      marginReq: '15% (Can be converged with State Subsidy)',
      collateral: 'Collateral-Free (Covered by CGFSI)',
      complexity: 'Medium',
      processingTime: '20 to 30 Days',
      approvingBody: 'All Scheduled Commercial Banks via Stand-Up Mitra',
      bestSuitedFor: 'SC, ST or Woman entrepreneurs establishing a greenfield venture in manufacturing or agri-allied.',
      matchScore: isSpecialCategory ? 85 : 45,
      matchReason: isSpecialCategory
        ? `Reserved specifically for SC/ST and Woman entrepreneurs with collateral-free financing up to ₹1 Crore.`
        : `General category males are not eligible unless forming an entity with 51%+ SC/ST/Women shareholding.`,
      advantages: ['High Loan Ceiling (₹10L to ₹1 Cr)', 'Special Support for Women & SC/ST', 'Collateral-Free CGFSI Cover', 'Handholding by Lead District Managers'],
      eligibilityRules: [
        {
          id: 'su1',
          title: isEn ? 'Category: SC/ST or Woman Entrepreneur' : 'श्रेणी: SC/ST अथवा महिला उद्यमी',
          description: isEn
            ? (isSpecialCategory ? `Eligible under social category (${socialCat}).` : 'Requires 51%+ shareholding by SC/ST or Woman partner.')
            : (isSpecialCategory ? `सामाजिक श्रेणी (${socialCat}) के अंतर्गत पूर्णतः पात्र।` : 'कम से कम 51% हिस्सेदारी SC/ST या महिला साझेदार की आवश्यक।'),
          passed: isSpecialCategory,
          warning: !isSpecialCategory,
          statutoryNote: 'Section 1 Mandatory Eligibility Mandate.',
        },
        {
          id: 'su2',
          title: isEn ? 'Greenfield Enterprise Mandate' : 'ग्रीनफील्ड (नया उद्यम) अनिवार्य',
          description: isEn ? `${bizName} is a first-time greenfield venture.` : `${bizName} नया (ग्रीनफील्ड) व्यवसाय है।`,
          passed: true,
          statutoryNote: 'First-time enterprise establishment only.',
        },
        {
          id: 'su3',
          title: isEn ? 'Project Loan Scale (>= ₹10 Lakh)' : 'परियोजना ऋण सीमा (₹10 लाख से अधिक)',
          description: isEn ? 'Loan requirement must be between ₹10 Lakh and ₹1.00 Crore.' : 'ऋण राशि न्यूनतम ₹10 लाख से ₹1 करोड़ के मध्य होनी चाहिए।',
          passed: true,
          statutoryNote: 'Stand-Up India statutory floor limit.',
        },
      ],
      requiredDocuments: [
        { id: 'sud1', name: 'Identity & Address Proof (Aadhaar & PAN)', description: 'Government verified credentials', status: 'Verified', code: '✓', mandatory: true },
        { id: 'sud2', name: 'Caste Certificate (SC/ST) / Woman Declaration', description: 'Statutory certificate from competent authority', status: 'Verified', code: '✓', mandatory: true },
        { id: 'sud3', name: 'Greenfield Enterprise Declaration', description: 'Affidavit affirming first venture', status: 'Verified', code: '✓', mandatory: true },
        { id: 'sud4', name: 'Detailed Project Report (DPR)', description: 'Comprehensive bankable DPR with balance sheet', status: 'Generated', code: '📄', mandatory: true },
        { id: 'sud5', name: 'Machinery Quotation & Building Estimate', description: 'Civil and machinery quotes with GST', status: 'Uploaded', code: '📎', mandatory: true },
        { id: 'sud6', name: 'IT Returns / Form 16 / Bank Statements', description: 'Last 2-3 years bank record', status: 'Verified', code: '✓', mandatory: true },
      ],
    },
  ], [isRural, isSpecialCategory, village, bizName, capital, socialCat, userProfile.age, isEn]);

  // Find the Best Recommended Scheme
  const bestScheme = useMemo(() => {
    return allSchemes.reduce((best, curr) => (curr.matchScore > best.matchScore ? curr : best), allSchemes[0]);
  }, [allSchemes]);

  // Other Schemes (excluding the best one)
  const otherSchemes = useMemo(() => {
    return allSchemes.filter((s) => s.id !== bestScheme.id);
  }, [allSchemes, bestScheme]);

  // Scheme currently inspected in Eligibility / Document tabs
  const currentInspectedScheme = useMemo(() => {
    return allSchemes.find((s) => s.id === inspectedSchemeId) || bestScheme;
  }, [allSchemes, inspectedSchemeId, bestScheme]);

  // Helper to activate a scheme for the entire app (Finance, DPR, etc.)
  const handleSelectSchemeAsActive = (scheme: SchemeData) => {
    setActiveSchemeId(scheme.id);
    saveActiveScheme(scheme.id);
    Alert.alert(
      isEn ? 'Active Scheme Updated!' : 'सक्रिय योजना चयनित!',
      isEn
        ? `"${scheme.shortName}" is now set as your active project scheme. Finance, EMI calculations, and your 31-Section DPR are now synced with this scheme.`
        : `"${scheme.shortName}" को आपकी मुख्य योजना के रूप में चुन लिया गया है। अब वित्त गणना, EMI और 31-खंडीय DPR इसी योजना के अनुसार सिंक हैं।`,
      [
        { text: isEn ? 'Stay Here' : 'यहीं रहें', style: 'cancel' },
        {
          text: isEn ? 'Go to Finance & DPR' : 'वित्त व DPR देखें',
          onPress: () => onNavigateToFinance && onNavigateToFinance(),
        },
      ]
    );
  };

  // Trigger Apply Now Modal
  const handleOpenApplyModal = (scheme: SchemeData) => {
    setApplyModalScheme(scheme);
  };

  // Confirm Application Submission
  const handleConfirmApplication = () => {
    if (!applyModalScheme) return;

    const newAppId = `${applyModalScheme.shortName.toUpperCase()}/2026/GKP/${Math.floor(10000 + Math.random() * 90000)}`;
    const newEntry = {
      schemeId: applyModalScheme.id,
      schemeName: applyModalScheme.name,
      appId: newAppId,
      date: 'Today',
      channel: applicationChannel === 'online' ? 'National e-Portal Direct API' : applicationChannel === 'vdo' ? 'Assisted VDO Pack' : 'Bank Dossier Package',
    };

    setSubmittedApps((prev) => [newEntry, ...prev]);
    setActiveSchemeId(applyModalScheme.id);
    saveActiveScheme(applyModalScheme.id);
    setApplyModalScheme(null);
    setActiveSubTab('tracking');

    Alert.alert(
      isEn ? '🎉 Application Pack Dispatched!' : '🎉 आवेदन सफलतापूर्वक प्रेषित!',
      isEn
        ? `Your application for ${applyModalScheme.shortName} has been submitted.\n\nApplication ID: ${newAppId}\nNodal Officer: Shri Sanjay Verma (VDO)`
        : `आपकी ${applyModalScheme.shortName} योजना का आवेदन प्रेषित हो गया है।\n\nआवेदन क्रमांक: ${newAppId}\nनोडल अधिकारी: श्री संजय वर्मा (VDO)`
    );
  };

  // Toggle schemes in comparison matrix
  const handleToggleCompareScheme = (schemeId: string) => {
    setComparedSchemeIds((prev) => {
      if (prev.includes(schemeId)) {
        if (prev.length <= 2) {
          Alert.alert(
            isEn ? 'Minimum 2 Schemes' : 'न्यूनतम 2 योजनाएं',
            isEn ? 'Please keep at least 2 schemes for side-by-side comparison.' : 'तुलना के लिए कम से कम 2 योजनाएं चयनित रखें।'
          );
          return prev;
        }
        return prev.filter((id) => id !== schemeId);
      } else {
        return [...prev, schemeId];
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ============================================================ */}
        {/* SCREEN HEADER                                                */}
        {/* ============================================================ */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Ionicons name="ribbon" size={22} color={COLORS.primary} />
            <Text style={styles.screenTitle}>
              {isEn ? 'Government Schemes & Subsidies Hub' : 'सरकारी योजनाएं एवं सब्सिडी हब'}
            </Text>
          </View>
          <Text style={styles.subtitle}>
            {isEn
              ? `AI-Matched Credit & Subsidy Programs for ${bizName} in ${village}`
              : `${village} में ${bizName} हेतु एआई-संचालित ऋण व सब्सिडी सहायता`}
          </Text>

          {/* Active Synced Scheme Pill Banner */}
          <View style={styles.activeSchemeBanner}>
            <Ionicons name="sync" size={13} color="#0369a1" />
            <Text style={styles.activeSchemeBannerText}>
              {isEn ? 'Currently Synced with Finance & DPR: ' : 'वर्तमान में वित्त व DPR से सिंक: '}
              <Text style={{ fontWeight: '900', color: '#0c4a6e' }}>
                {allSchemes.find((s) => s.id === activeSchemeId)?.shortName || 'PMEGP'}
              </Text>
            </Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 5 NAVIGATION SUB-TABS                                        */}
        {/* ============================================================ */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subTabScroll}>
          {[
            { key: 'recommended' as SchemesSubTab, label: `⭐ ${t.schTabRecommended}` },
            { key: 'compare' as SchemesSubTab, label: `⚡ ${t.schTabCompare}` },
            { key: 'eligibility' as SchemesSubTab, label: `🎯 ${t.schTabEligibility}` },
            { key: 'documents' as SchemesSubTab, label: `📁 ${t.schTabDocuments}` },
            { key: 'tracking' as SchemesSubTab, label: `📍 ${t.schTabTracking}` },
          ].map((tab) => (
              <TouchableOpacity
              key={tab.key}
              style={[styles.subTabPill, activeSubTab === tab.key && styles.subTabPillActive]}
              onPress={() => setActiveSubTab(tab.key)}
            >
              <Text style={[styles.subTabPillText, activeSubTab === tab.key && styles.subTabPillTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ============================================================ */}
        {/* TAB 1: BEST RECOMMENDED + OTHER SCHEMES                      */}
        {/* ============================================================ */}
        {activeSubTab === 'recommended' && (
          <View style={styles.sectionGap}>

            {/* ⭐ A. BEST SCHEME FOR YOU CARD */}
            <View style={styles.bestSchemeCard}>
              <View style={styles.bestBadgeRow}>
                <View style={styles.bestBadge}>
                  <Ionicons name="star" size={12} color="#ffffff" />
                  <Text style={styles.bestBadgeText}>
                    {t.schBestTag}
                  </Text>
                </View>

                <View style={styles.matchScoreBadge}>
                  <Text style={styles.matchScoreText}>{bestScheme.matchScore}% MATCH</Text>
                </View>
              </View>

              <Text style={styles.bestSchemeName}>{bestScheme.name}</Text>
              <Text style={styles.bestSchemeCode}>{bestScheme.code} • {bestScheme.ministry}</Text>

              {/* Dynamic Match Reason */}
              <View style={styles.reasonBox}>
                <Ionicons name="checkmark-circle" size={16} color="#047857" />
                <Text style={styles.reasonText}>{bestScheme.matchReason}</Text>
              </View>

              {/* Key Specs Grid */}
              <View style={styles.specsGrid}>
                <View style={styles.specItem}>
                  <Text style={styles.specLbl}>{t.schParamSubsidy}</Text>
                  <Text style={[styles.specVal, { color: '#047857' }]}>{bestScheme.subsidyPct}</Text>
                </View>

                <View style={styles.specItem}>
                  <Text style={styles.specLbl}>{t.schParamMaxLoan}</Text>
                  <Text style={styles.specVal}>{bestScheme.maxLoan}</Text>
                </View>

                <View style={styles.specItem}>
                  <Text style={styles.specLbl}>{t.schParamInterest}</Text>
                  <Text style={styles.specVal}>{bestScheme.interestRate}</Text>
                </View>

                <View style={styles.specItem}>
                  <Text style={styles.specLbl}>{t.schParamTenure} & {t.schParamMoratorium}</Text>
                  <Text style={styles.specVal}>{bestScheme.tenure} ({bestScheme.moratorium})</Text>
                </View>
              </View>

              {/* Advantages List */}
              <View style={styles.advantagesRow}>
                {bestScheme.advantages.map((adv, idx) => (
                  <View key={idx} style={styles.advantagePill}>
                    <Ionicons name="sparkles" size={10} color="#047857" />
                    <Text style={styles.advantageText}>{adv}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.collateralInfoRow}>
                <Ionicons name="shield-checkmark" size={14} color="#0369a1" />
                <Text style={styles.collateralInfoText}>
                  {bestScheme.collateral} • {t.schParamProcessingTime}: {bestScheme.processingTime}
                </Text>
              </View>

              {/* Action Buttons for Best Scheme */}
              <View style={styles.actionBtnRow}>
                {/* 1. APPLY NOW BUTTON */}
                <TouchableOpacity
                  style={styles.primaryApplyBtn}
                  onPress={() => handleOpenApplyModal(bestScheme)}
                >
                  <Ionicons name="paper-plane" size={14} color={COLORS.white} />
                  <Text style={styles.primaryApplyBtnText}>
                    {isEn ? 'Apply Now' : 'अभी आवेदन करें'}
                  </Text>
                </TouchableOpacity>

                {/* 2. SELECT AS ACTIVE / SYNC BUTTON */}
                <TouchableOpacity
                  style={[
                    styles.syncSchemeBtn,
                    activeSchemeId === bestScheme.id && styles.syncSchemeBtnActive,
                  ]}
                  onPress={() => handleSelectSchemeAsActive(bestScheme)}
                >
                  <Ionicons
                    name={activeSchemeId === bestScheme.id ? 'checkmark-circle' : 'swap-horizontal'}
                    size={14}
                    color={activeSchemeId === bestScheme.id ? '#15803d' : COLORS.primary}
                  />
                  <Text
                    style={[
                      styles.syncSchemeBtnText,
                      activeSchemeId === bestScheme.id && styles.syncSchemeBtnTextActive,
                    ]}
                  >
                    {activeSchemeId === bestScheme.id
                      ? (isEn ? '✓ Active Scheme' : '✓ सक्रिय योजना')
                      : (isEn ? 'Set Active for DPR' : 'DPR हेतु चुनें')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Quick links to Eligibility & Documents */}
              <View style={styles.quickLinksRow}>
                <TouchableOpacity
                  style={styles.quickLinkItem}
                  onPress={() => {
                    setInspectedSchemeId(bestScheme.id);
                    setActiveSubTab('eligibility');
                  }}
                >
                  <Ionicons name="checkmark-done" size={12} color={COLORS.primary} />
                  <Text style={styles.quickLinkText}>{isEn ? 'View Detailed Eligibility →' : 'विस्तृत पात्रता देखें →'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickLinkItem}
                  onPress={() => {
                    setInspectedSchemeId(bestScheme.id);
                    setActiveSubTab('documents');
                  }}
                >
                  <Ionicons name="folder-open" size={12} color={COLORS.primary} />
                  <Text style={styles.quickLinkText}>{isEn ? 'View Required Docs →' : 'आवश्यक दस्तावेज →'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 📋 B. OTHER AVAILABLE SCHEMES LIST (WITH APPLY BUTTONS) */}
            <View style={styles.otherHeaderSection}>
              <Text style={styles.sectionHeading}>
                {isEn ? 'Other Available Government Schemes' : 'अन्य उपलब्ध शासकीय योजनाएं'}
              </Text>
              <Text style={styles.sectionSub}>
                {isEn
                  ? 'You are eligible to apply for any of these programs based on your project requirements:'
                  : 'अपनी आवश्यकतानुसार आप इनमें से किसी भी योजना के लिए आवेदन कर सकते हैं:'}
              </Text>
            </View>

            {otherSchemes.map((sc) => {
              const isActive = activeSchemeId === sc.id;
              return (
                <View key={sc.id} style={[styles.otherSchemeCard, isActive && styles.otherSchemeCardActive]}>
                  {/* Card Header */}
                  <View style={styles.otherHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.otherSchemeName}>{sc.name}</Text>
                        {isActive && (
                          <View style={styles.activeTag}>
                            <Text style={styles.activeTagText}>{isEn ? 'ACTIVE' : 'सक्रिय'}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.otherSchemeSubsidy}>🎁 {sc.subsidyPct}</Text>
                      <Text style={styles.otherSchemeMinistry}>{sc.code} • {sc.ministry}</Text>
                    </View>

                    <View style={styles.otherMatchPill}>
                      <Text style={styles.otherMatchText}>{sc.matchScore}% Match</Text>
                    </View>
                  </View>

                  {/* Why this scheme note */}
                  <Text style={styles.otherReasonText}>{sc.matchReason}</Text>

                  {/* Stats Grid */}
                  <View style={styles.otherStatsRow}>
                    <View style={styles.oStatCol}>
                      <Text style={styles.oStatLbl}>{isEn ? 'Max Loan' : 'ऋण'}</Text>
                      <Text style={styles.oStatVal}>{sc.maxLoan}</Text>
                    </View>
                    <View style={styles.oStatCol}>
                      <Text style={styles.oStatLbl}>{isEn ? 'Interest' : 'ब्याज'}</Text>
                      <Text style={styles.oStatVal}>{sc.interestRate}</Text>
                    </View>
                    <View style={styles.oStatCol}>
                      <Text style={styles.oStatLbl}>{isEn ? 'Tenure' : 'अवधि'}</Text>
                      <Text style={styles.oStatVal}>{sc.tenure}</Text>
                    </View>
                    <View style={styles.oStatCol}>
                      <Text style={styles.oStatLbl}>{isEn ? 'Moratorium' : 'छूट'}</Text>
                      <Text style={styles.oStatVal}>{sc.moratorium}</Text>
                    </View>
                  </View>

                  {/* Collateral and Margin Note */}
                  <View style={styles.otherNotesRow}>
                    <Text style={styles.otherNoteItem}>🛡️ {sc.collateral}</Text>
                    <Text style={styles.otherNoteItem}>⏱️ {sc.processingTime}</Text>
                  </View>

                  {/* ACTION BUTTONS FOR EACH OTHER SCHEME */}
                  <View style={styles.otherActionRow}>
                    {/* APPLY NOW BUTTON */}
                    <TouchableOpacity
                      style={styles.otherApplyBtn}
                      onPress={() => handleOpenApplyModal(sc)}
                    >
                      <Ionicons name="paper-plane" size={13} color={COLORS.white} />
                      <Text style={styles.otherApplyBtnText}>
                        {isEn ? 'Apply Now' : 'आवेदन करें'}
                      </Text>
                    </TouchableOpacity>

                    {/* SELECT AS ACTIVE BUTTON */}
                    <TouchableOpacity
                      style={[styles.otherSelectBtn, isActive && styles.otherSelectBtnActive]}
                      onPress={() => handleSelectSchemeAsActive(sc)}
                    >
                      <Ionicons
                        name={isActive ? 'checkmark-circle' : 'swap-horizontal'}
                        size={13}
                        color={isActive ? '#15803d' : COLORS.primary}
                      />
                      <Text style={[styles.otherSelectBtnText, isActive && styles.otherSelectBtnTextActive]}>
                        {isActive ? (isEn ? '✓ Active Scheme' : '✓ चयनित') : (isEn ? 'Select for DPR' : 'DPR हेतु चुनें')}
                      </Text>
                    </TouchableOpacity>

                    {/* VIEW SPECS BUTTON */}
                    <TouchableOpacity
                      style={styles.otherDetailsBtn}
                      onPress={() => {
                        setInspectedSchemeId(sc.id);
                        setActiveSubTab('eligibility');
                      }}
                    >
                      <Ionicons name="information-circle-outline" size={14} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 2: CUSTOMIZABLE SCHEME COMPARISON MATRIX                 */}
        {/* ============================================================ */}
        {activeSubTab === 'compare' && (
          <View style={styles.sectionGap}>
            <View style={styles.matrixCard}>
              <View style={styles.matrixHeader}>
                <Ionicons name="git-compare" size={20} color={COLORS.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.matrixTitle}>
                    {t.schCompareTitle}
                  </Text>
                  <Text style={styles.matrixSub}>
                    {t.schCompareSelectSchemes}
                  </Text>
                </View>
              </View>

              {/* 1. SCHEME SELECTOR TOGGLE CHIPS */}
              <View style={styles.toggleChipsWrapper}>
                <Text style={styles.toggleSectionLbl}>
                  {t.schCompareSelectSchemes + ':'}
                </Text>
                <View style={styles.toggleChipsContainer}>
                  {allSchemes.map((sc) => {
                    const isSelected = comparedSchemeIds.includes(sc.id);
                    return (
                      <TouchableOpacity
                        key={sc.id}
                        style={[styles.schemeToggleChip, isSelected && styles.schemeToggleChipActive]}
                        onPress={() => handleToggleCompareScheme(sc.id)}
                      >
                        <Ionicons
                          name={isSelected ? 'checkbox' : 'square-outline'}
                          size={14}
                          color={isSelected ? COLORS.primary : COLORS.textTertiary}
                        />
                        <Text style={[styles.schemeToggleChipText, isSelected && styles.schemeToggleChipTextActive]}>
                          {sc.shortName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 2. PARAMETER FILTER TABS */}
              <View style={styles.paramFilterRow}>
                {[
                  { key: 'all', label: t.schCompareFilterAll },
                  { key: 'financial', label: t.schCompareFilterFinancial },
                  { key: 'terms', label: t.schCompareFilterTerms },
                ].map((pf) => (
                  <TouchableOpacity
                    key={pf.key}
                    style={[styles.paramFilterPill, compareParamFilter === pf.key && styles.paramFilterPillActive]}
                    onPress={() => setCompareParamFilter(pf.key as any)}
                  >
                    <Text style={[styles.paramFilterText, compareParamFilter === pf.key && styles.paramFilterTextActive]}>
                      {pf.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 3. COMPARISON TABLE (SCROLLABLE HORIZONTALLY) */}
              <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
                <View style={styles.matrixTable}>
                  {/* Table Header Row */}
                  <View style={styles.thRow}>
                    <View style={[styles.thCellParam, { width: 130 }]}>
                      <Text style={styles.thCellParamText}>{t.schCompareFilter}</Text>
                    </View>
                    {comparedSchemeIds.map((scId) => {
                      const sc = allSchemes.find((s) => s.id === scId);
                      if (!sc) return null;
                      const isBest = sc.id === bestScheme.id;
                      return (
                        <View key={sc.id} style={[styles.thCellScheme, isBest && styles.thCellSchemeBest]}>
                          {isBest && <Text style={styles.bestBadgeMini}>⭐ BEST</Text>}
                          <Text style={styles.thSchemeNameText}>{sc.shortName}</Text>
                          <Text style={styles.thSchemeMatchText}>{sc.matchScore}% Match</Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Table Body Rows */}
                  {[
                    // Financial rows
                    {
                      category: 'financial',
                      param: t.schParamSubsidy,
                      highlightWinner: 'pmegp',
                      getValue: (s: SchemeData) => s.subsidyPct,
                    },
                    {
                      category: 'financial',
                      param: t.schParamMaxLoan,
                      highlightWinner: 'ahidf',
                      getValue: (s: SchemeData) => s.maxLoan,
                    },
                    {
                      category: 'financial',
                      param: t.schParamInterest,
                      highlightWinner: 'ahidf',
                      getValue: (s: SchemeData) => s.interestRate,
                    },
                    {
                      category: 'financial',
                      param: t.schParamMargin,
                      highlightWinner: 'pmegp',
                      getValue: (s: SchemeData) => s.marginReq,
                    },
                    // Terms rows
                    {
                      category: 'terms',
                      param: t.schParamMoratorium,
                      highlightWinner: 'ahidf',
                      getValue: (s: SchemeData) => s.moratorium,
                    },
                    {
                      category: 'terms',
                      param: t.schParamTenure,
                      highlightWinner: 'ahidf',
                      getValue: (s: SchemeData) => s.tenure,
                    },
                    {
                      category: 'terms',
                      param: t.schParamCollateral,
                      highlightWinner: 'pmegp',
                      getValue: (s: SchemeData) => s.collateral,
                    },
                    {
                      category: 'terms',
                      param: t.schParamProcessingTime,
                      highlightWinner: 'mudra',
                      getValue: (s: SchemeData) => s.processingTime,
                    },
                    {
                      category: 'terms',
                      param: t.schParamBestFor,
                      getValue: (s: SchemeData) => s.bestSuitedFor,
                    },
                  ]
                    .filter((row) => compareParamFilter === 'all' || row.category === compareParamFilter)
                    .map((r, i) => (
                      <View key={i} style={[styles.tdRow, i % 2 === 1 && { backgroundColor: '#f8fafc' }]}>
                        <View style={[styles.tdCellParam, { width: 130 }]}>
                          <Text style={styles.tdParamText}>{r.param}</Text>
                        </View>
                        {comparedSchemeIds.map((scId) => {
                          const sc = allSchemes.find((s) => s.id === scId);
                          if (!sc) return null;
                          const isWinner = r.highlightWinner === sc.id;
                          return (
                            <View key={sc.id} style={[styles.tdCellScheme, isWinner && styles.tdCellSchemeWinner]}>
                              <Text style={[styles.tdValText, isWinner && styles.tdValTextWinner]}>
                                {r.getValue(sc)}
                              </Text>
                              {isWinner && (
                                <Text style={styles.winnerBadgeText}>Top Feature 🟢</Text>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    ))}

                  {/* Table Action Row */}
                  <View style={styles.actionTableRow}>
                    <View style={[styles.tdCellParam, { width: 130 }]}>
                      <Text style={[styles.tdParamText, { fontWeight: '900' }]}>
                        {t.schApplyNow}
                      </Text>
                    </View>
                    {comparedSchemeIds.map((scId) => {
                      const sc = allSchemes.find((s) => s.id === scId);
                      if (!sc) return null;
                      const isActive = activeSchemeId === sc.id;
                      return (
                        <View key={sc.id} style={styles.tdCellScheme}>
                          <TouchableOpacity
                            style={styles.tableApplyBtn}
                            onPress={() => handleOpenApplyModal(sc)}
                          >
                            <Text style={styles.tableApplyBtnText}>{t.schApplyNow}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.tableSelectBtn, isActive && styles.tableSelectBtnActive]}
                            onPress={() => handleSelectSchemeAsActive(sc)}
                          >
                            <Text style={[styles.tableSelectBtnText, isActive && styles.tableSelectBtnTextActive]}>
                              {isActive ? '✓ Active' : (isEn ? 'Select' : 'चुनें')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>

                </View>
              </ScrollView>

              {/* Recommendation Note */}
              <View style={styles.recBanner}>
                <Ionicons name="sparkles" size={16} color="#047857" />
                <Text style={styles.recBannerText}>
                  {isEn
                    ? `AI Analysis: For ${bizName}, PMEGP offers the highest cash grant (35% Subsidy = up to ₹17.5L), while AHIDF is ideal if planning large commercial expansion with a 2-year moratorium.`
                    : `एआई विश्लेषण: ${bizName} हेतु PMEGP में सबसे बड़ा 35% अनुदान उपलब्ध है, जबकि बड़े पैमाने पर विस्तार के लिए 2 वर्ष की छूट हेतु AHIDF श्रेष्ठ है।`}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 3: DYNAMIC SCHEME-SPECIFIC ELIGIBILITY CHECKER           */}
        {/* ============================================================ */}
        {activeSubTab === 'eligibility' && (
          <View style={styles.sectionGap}>
            <View style={styles.eligibilityCard}>
              <View style={styles.eligibilityHeader}>
                <Ionicons name="checkmark-done-circle" size={22} color="#047857" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.eligibilityTitle}>
                    {t.schTabEligibility}
                  </Text>
                  <Text style={styles.eligibilitySub}>
                    {t.schEligibilitySummary}
                  </Text>
                </View>
              </View>

              {/* SCHEME SELECTOR PILLS */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorPillScroll}>
                {allSchemes.map((sc) => (
                  <TouchableOpacity
                    key={sc.id}
                    style={[
                      styles.schemeSelectorPill,
                      inspectedSchemeId === sc.id && styles.schemeSelectorPillActive,
                    ]}
                    onPress={() => setInspectedSchemeId(sc.id)}
                  >
                    <Text
                      style={[
                        styles.schemeSelectorText,
                        inspectedSchemeId === sc.id && styles.schemeSelectorTextActive,
                      ]}
                    >
                      {sc.shortName}
                    </Text>
                    {sc.id === activeSchemeId && (
                      <View style={styles.activeDot} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* CURRENT SCHEME STATUS BANNER */}
              <View style={styles.eligibilityStatusBanner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.curSchemeName}>{currentInspectedScheme.name}</Text>
                  <Text style={styles.curSchemeMinistry}>{currentInspectedScheme.ministry}</Text>
                </View>
                <View style={styles.matchScoreBadgeLg}>
                  <Text style={styles.matchScoreLgText}>{currentInspectedScheme.matchScore}%</Text>
                  <Text style={styles.matchScoreLgSub}>{t.schEligibilityPassed}</Text>
                </View>
              </View>

              {/* STATUTORY CRITERIA CHECKLIST */}
              <Text style={styles.criteriaHeading}>
                {t.schStatutoryNote + ':'}
              </Text>
              <View style={styles.eligibilityChecklist}>
                {currentInspectedScheme.eligibilityRules.map((rule) => (
                  <View key={rule.id} style={styles.checkItem}>
                    <Ionicons
                      name={rule.passed ? 'checkmark-circle' : rule.warning ? 'alert-circle' : 'close-circle'}
                      size={18}
                      color={rule.passed ? '#047857' : rule.warning ? '#b45309' : '#b91c1c'}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.checkTitle}>{rule.title}</Text>
                      <Text style={styles.checkText}>{rule.description}</Text>
                      <Text style={styles.checkStatutoryNote}>📜 {rule.statutoryNote}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Summary Decision Box */}
              <View style={styles.resultBox}>
                <Text style={styles.resultTitle}>
                  {t.schOverallMatch}: {currentInspectedScheme.matchScore}% — {currentInspectedScheme.matchScore >= 80 ? t.schEligibilityPassed.toUpperCase() : t.schEligibilityWarning.toUpperCase()}
                </Text>
                <Text style={styles.resultDesc}>
                  {isEn
                    ? `Your profile meets ${currentInspectedScheme.eligibilityRules.filter((r) => r.passed).length} of ${currentInspectedScheme.eligibilityRules.length} statutory mandates under ${currentInspectedScheme.shortName} guidelines.`
                    : `${t.schEligibilitySummary}: ${currentInspectedScheme.eligibilityRules.filter((r) => r.passed).length}/${currentInspectedScheme.eligibilityRules.length} ${t.schEligibilityPassed}।`}
                </Text>

                {/* Direct Action for Inspected Scheme */}
                <View style={styles.eligibilityActionRow}>
                  <TouchableOpacity
                    style={styles.eligibilityApplyBtn}
                    onPress={() => handleOpenApplyModal(currentInspectedScheme)}
                  >
                    <Ionicons name="paper-plane" size={13} color={COLORS.white} />
                    <Text style={styles.eligibilityApplyBtnText}>
                      {t.schApplyNow} — {currentInspectedScheme.shortName}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.eligibilitySyncBtn}
                    onPress={() => handleSelectSchemeAsActive(currentInspectedScheme)}
                  >
                    <Ionicons name="swap-horizontal" size={13} color={COLORS.primary} />
                    <Text style={styles.eligibilitySyncBtnText}>
                      {t.schSetActive}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 4: DYNAMIC SCHEME-SPECIFIC DOCUMENT VAULT                */}
        {/* ============================================================ */}
        {activeSubTab === 'documents' && (
          <View style={styles.sectionGap}>
            <View style={styles.readinessCard}>
              <View style={styles.readinessHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.readinessTitle}>
                    {t.schTabDocuments}
                  </Text>
                  <Text style={styles.readinessSub}>
                    {t.schDocReadiness}
                  </Text>
                </View>
              </View>

              {/* SCHEME SELECTOR PILLS */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorPillScroll}>
                {allSchemes.map((sc) => (
                  <TouchableOpacity
                    key={sc.id}
                    style={[
                      styles.schemeSelectorPill,
                      inspectedSchemeId === sc.id && styles.schemeSelectorPillActive,
                    ]}
                    onPress={() => setInspectedSchemeId(sc.id)}
                  >
                    <Text
                      style={[
                        styles.schemeSelectorText,
                        inspectedSchemeId === sc.id && styles.schemeSelectorTextActive,
                      ]}
                    >
                      {sc.shortName}
                    </Text>
                    {sc.id === activeSchemeId && (
                      <View style={styles.activeDot} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Dynamic Readiness Meter */}
              {(() => {
                const docs = currentInspectedScheme.requiredDocuments;
                const readyCount = docs.filter((d) => d.status === 'Verified' || d.status === 'Generated' || d.status === 'Uploaded').length;
                const pct = Math.round((readyCount / docs.length) * 100);
                return (
                  <View style={styles.meterContainer}>
                    <View style={styles.meterLabels}>
                      <Text style={styles.meterSchemeTitle}>
                        {currentInspectedScheme.shortName} {isEn ? 'Document Readiness' : 'दस्तावेज तत्परता'}
                      </Text>
                      <Text style={styles.readinessScore}>
                        {readyCount} / {docs.length} Ready ({pct}%)
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
                    </View>
                  </View>
                );
              })()}

              {/* Document List */}
              <View style={styles.docList}>
                {currentInspectedScheme.requiredDocuments.map((doc) => (
                  <View key={doc.id} style={styles.docRow}>
                    <Text
                      style={[
                        styles.docBadge,
                        doc.status === 'Verified' ? { color: '#047857' } : doc.status === 'Generated' ? { color: '#2563eb' } : doc.status === 'Uploaded' ? { color: '#7c3aed' } : { color: '#b45309' },
                      ]}
                    >
                      {doc.code}
                    </Text>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.docName}>{doc.name}</Text>
                        {doc.mandatory && <Text style={styles.mandatoryStar}>*</Text>}
                      </View>
                      <Text style={styles.docDesc}>{doc.description}</Text>
                    </View>

                    <View
                      style={[
                        styles.docStatusPill,
                        doc.status === 'Verified'
                          ? { backgroundColor: '#dcfce7' }
                          : doc.status === 'Generated'
                          ? { backgroundColor: '#dbeafe' }
                          : doc.status === 'Uploaded'
                          ? { backgroundColor: '#f3e8ff' }
                          : { backgroundColor: '#fef3c7' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.docStatusText,
                          doc.status === 'Verified'
                            ? { color: '#047857' }
                            : doc.status === 'Generated'
                            ? { color: '#1d4ed8' }
                            : doc.status === 'Uploaded'
                            ? { color: '#6b21a8' }
                            : { color: '#b45309' },
                        ]}
                      >
                        {doc.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Upload Assistance Note */}
              <View style={styles.docUploadHelp}>
                <Ionicons name="cloud-upload-outline" size={16} color={COLORS.primary} />
                <Text style={styles.docUploadHelpText}>
                  {isEn
                    ? `Documents with "Generated" status are automatically compiled from your DPR and onboarding profile. Remaining pending items can be verified via VDO Sanjay Verma.`
                    : `"${t.schDocGenerated}" स्थिति वाले दस्तावेज आपके DPR एवं प्रोफ़ाइल से स्वतः तैयार हैं। शेष ${t.schDocPending} दस्तावेज VDO संजय वर्मा द्वारा सत्यापित किए जा सकते हैं।`}
                </Text>
              </View>

            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* TAB 5: REAL-TIME APPLICATION STAGE TRACKER                   */}
        {/* ============================================================ */}
        {activeSubTab === 'tracking' && (
          <View style={styles.sectionGap}>
            <View style={styles.trackerCard}>
              <View style={styles.trackerHeader}>
                <Text style={styles.trackerTitle}>
                  {t.schTrackingTitle}
                </Text>
                <Text style={styles.appIdText}>
                  {submittedApps[0]?.appId || 'PMEGP/2026/GKP/88921'}
                </Text>
              </View>

              {/* Active Application Card */}
              <View style={styles.currentAppInfoBox}>
                <Text style={styles.currentAppSchemeName}>
                  {submittedApps[0]?.schemeName || bestScheme.name}
                </Text>
                <Text style={styles.currentAppMeta}>
                  {t.schTrackingChannel}: {submittedApps[0]?.channel || 'KVIC Direct API'} • {t.schTrackingDate}: {submittedApps[0]?.date || '12 Sep 2026'}
                </Text>
              </View>

              {/* Workflow Stepper Tracker */}
              <View style={styles.trackerWorkflow}>
                {[
                  { title: isEn ? 'Application Pack Submitted' : 'आवेदन पत्र प्रेषित', status: 'done', date: '12 Sep 2026' },
                  { title: isEn ? 'Digital Document Verification' : 'डिजिटल दस्तावेज सत्यापन (VDO)', status: 'done', date: '12 Sep 2026' },
                  { title: isEn ? 'Field Verification & DTFC Review' : 'क्षेत्रीय सत्यापन (फील्ड इंस्पेक्शन)', status: 'active', date: isEn ? 'In Progress (Day 3)' : 'प्रगति पर (दिन 3)' },
                  { title: isEn ? 'Bank Loan Sanction (PNB Bank)' : 'बैंक ऋण स्वीकृति (PNB बैंक)', status: 'pending', date: isEn ? 'Expected 18 Sep' : 'संभावित 18 सित.' },
                  { title: isEn ? 'Subsidy Disbursement to Escrow' : 'सब्सिडी अनुदान हस्तांतरण', status: 'pending', date: isEn ? 'Post Bank Sanction' : 'स्वीकृति उपरांत' },
                ].map((st, i) => (
                  <View key={i} style={styles.trackerStepRow}>
                    <View
                      style={[
                        styles.trackerStepCircle,
                        st.status === 'done' && styles.stepDone,
                        st.status === 'active' && styles.stepActive,
                      ]}
                    >
                      <Ionicons
                        name={st.status === 'done' ? 'checkmark' : st.status === 'active' ? 'time' : 'ellipse-outline'}
                        size={12}
                        color={COLORS.white}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.trackerStepTitle}>{st.title}</Text>
                      <Text style={styles.trackerStepDate}>{st.date}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Assigned Nodal Officer */}
              <View style={styles.officerAssistanceBox}>
                <Ionicons name="person" size={18} color="#7c3aed" />
                <View style={{ flex: 1 }}>
                <Text style={styles.officerTitle}>{isEn ? 'Assigned Nodal Officer:' : t.schTrackingStatus + ':'}</Text>
                  <Text style={styles.officerName}>Shri Sanjay Verma (VDO - Sahjanwa Block)</Text>
                  <Text style={styles.officerContact}>📞 +91 9911223344 • Office of Gram Panchayat</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ============================================================ */}
      {/* UNIVERSAL APPLICATION SUBMISSION MODAL                       */}
      {/* ============================================================ */}
      {applyModalScheme && (
        <Modal
          visible={!!applyModalScheme}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setApplyModalScheme(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>
                    {t.schModalTitle}
                  </Text>
                  <Text style={styles.modalSchemeName}>{applyModalScheme.name}</Text>
                </View>
                <TouchableOpacity onPress={() => setApplyModalScheme(null)} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                {/* Application Pack Preview */}
                <View style={styles.previewBox}>
                  <Text style={styles.previewHeading}>
                    {isEn ? '📄 Application Pack Summary' : '📄 आवेदन सारांश'}
                  </Text>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLbl}>{isEn ? 'Applicant:' : 'आवेदक:'}</Text>
                    <Text style={styles.previewVal}>{userProfile.fullName || 'Ramesh Yadav'}</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLbl}>{isEn ? 'Proposed Business:' : 'प्रस्तावित व्यवसाय:'}</Text>
                    <Text style={styles.previewVal}>{bizName}</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLbl}>{isEn ? 'Location:' : 'स्थान:'}</Text>
                    <Text style={styles.previewVal}>{village}, {district}</Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLbl}>{isEn ? 'Subsidy Benefit:' : 'सब्सिडी लाभ:'}</Text>
                    <Text style={[styles.previewVal, { color: '#047857', fontWeight: '900' }]}>
                      {applyModalScheme.subsidyPct}
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLbl}>{isEn ? 'Attached Documents:' : 'संलग्न दस्तावेज:'}</Text>
                    <Text style={styles.previewVal}>
                      {applyModalScheme.requiredDocuments.filter((d) => d.status !== 'Pending').length} of {applyModalScheme.requiredDocuments.length} Ready
                    </Text>
                  </View>
                </View>

                {/* Submission Channel Selection */}
                <Text style={styles.channelHeading}>
                  {t.schModalChannelOnline + ' / ' + t.schModalChannelVDO + ':'}
                </Text>

                {[
                  {
                    key: 'online' as const,
                    icon: 'globe-outline',
                    title: t.schModalChannelOnline,
                    desc: isEn ? 'Directly transmit digital pack to Ministry portal.' : 'मंत्रालय पोर्टल पर डिजिटल पैक का सीधा हस्तांतरण।',
                  },
                  {
                    key: 'vdo' as const,
                    icon: 'people-outline',
                    title: t.schModalChannelVDO,
                    desc: isEn ? 'Forwarded to Shri Sanjay Verma (VDO) for fast-track physical inspection.' : 'श्री संजय वर्मा (VDO) को सत्यापन हेतु अग्रेषित।',
                  },
                  {
                    key: 'dossier' as const,
                    icon: 'download-outline',
                    title: t.schModalChannelDossier,
                    desc: isEn ? 'Export signed DPR + Quotations for direct branch submission.' : 'शाखा में भौतिक रूप से जमा करने हेतु सम्पूर्ण फाइल।',
                  },
                ].map((ch) => (
                  <TouchableOpacity
                    key={ch.key}
                    style={[styles.channelItem, applicationChannel === ch.key && styles.channelItemActive]}
                    onPress={() => setApplicationChannel(ch.key)}
                  >
                    <Ionicons
                      name={ch.icon as any}
                      size={20}
                      color={applicationChannel === ch.key ? COLORS.primary : COLORS.textSecondary}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.channelTitle, applicationChannel === ch.key && styles.channelTitleActive]}>
                        {ch.title}
                      </Text>
                      <Text style={styles.channelDesc}>{ch.desc}</Text>
                    </View>
                    <Ionicons
                      name={applicationChannel === ch.key ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={applicationChannel === ch.key ? COLORS.primary : COLORS.textTertiary}
                    />
                  </TouchableOpacity>
                ))}

              </ScrollView>

              {/* Modal Submit Actions */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setApplyModalScheme(null)}
                >
                  <Text style={styles.modalCancelBtnText}>{isEn ? 'Cancel' : t.schTabTracking === 'आवेदन स्थिति' ? 'रद्द करें' : 'Cancel'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={handleConfirmApplication}
                >
                  <Ionicons name="paper-plane" size={14} color={COLORS.white} />
                  <Text style={styles.modalConfirmBtnText}>
                    {t.schModalSubmit}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: SPACING.md, gap: SPACING.md },

  header: { marginBottom: 4, gap: 4 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  screenTitle: { fontSize: 15, fontWeight: '900', color: COLORS.textPrimary },
  subtitle: { fontSize: 10, color: COLORS.textTertiary, lineHeight: 14 },

  activeSchemeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bae6fd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
    marginTop: 4,
  },
  activeSchemeBannerText: { fontSize: 10, color: '#0369a1' },

  subTabScroll: { flexGrow: 0 },
  subTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  subTabPillActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  subTabPillText: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary },
  subTabPillTextActive: { color: COLORS.white },

  sectionGap: { gap: SPACING.sm },

  // BEST SCHEME CARD
  bestSchemeCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#4ade80',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: 8,
    ...SHADOW.xs,
  },
  bestBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  bestBadgeText: { fontSize: 9, fontWeight: '900', color: COLORS.white },
  matchScoreBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.md },
  matchScoreText: { fontSize: 11, fontWeight: '900', color: '#047857' },
  bestSchemeName: { fontSize: 14, fontWeight: '900', color: '#14532d' },
  bestSchemeCode: { fontSize: 9, color: '#166534' },

  reasonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: RADIUS.md,
  },
  reasonText: { fontSize: 10, color: COLORS.textPrimary, flex: 1, lineHeight: 14 },

  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: RADIUS.md,
  },
  specItem: { width: '48%' as any, gap: 1 },
  specLbl: { fontSize: 8, color: COLORS.textTertiary },
  specVal: { fontSize: 10, fontWeight: '800', color: COLORS.textPrimary },

  advantagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  advantagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  advantageText: { fontSize: 8, fontWeight: '800', color: '#065f46' },

  collateralInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  collateralInfoText: { fontSize: 9, fontWeight: '700', color: '#0369a1' },

  actionBtnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  primaryApplyBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  primaryApplyBtnText: { fontSize: 11, fontWeight: '900', color: COLORS.white },
  syncSchemeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  syncSchemeBtnActive: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  syncSchemeBtnText: { fontSize: 10, fontWeight: '800', color: COLORS.primary },
  syncSchemeBtnTextActive: { color: '#15803d' },

  quickLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#dcfce7',
  },
  quickLinkItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  quickLinkText: { fontSize: 9, fontWeight: '700', color: COLORS.primary },

  // OTHER SCHEMES SECTION
  otherHeaderSection: { marginTop: 8, gap: 2 },
  sectionHeading: { fontSize: 12, fontWeight: '900', color: COLORS.textPrimary },
  sectionSub: { fontSize: 9, color: COLORS.textTertiary },

  otherSchemeCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  otherSchemeCardActive: { borderColor: '#10b981', borderWidth: 1.5, backgroundColor: '#fafffd' },
  otherHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  otherSchemeName: { fontSize: 12, fontWeight: '900', color: COLORS.textPrimary, flexShrink: 1 },
  activeTag: { backgroundColor: '#dcfce7', paddingHorizontal: 5, paddingVertical: 2, borderRadius: RADIUS.sm },
  activeTagText: { fontSize: 7, fontWeight: '900', color: '#15803d' },
  otherSchemeSubsidy: { fontSize: 10, fontWeight: '800', color: '#047857', marginTop: 2 },
  otherSchemeMinistry: { fontSize: 8, color: COLORS.textTertiary, marginTop: 1 },
  otherMatchPill: { backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.sm },
  otherMatchText: { fontSize: 9, fontWeight: '800', color: COLORS.textSecondary },

  otherReasonText: { fontSize: 9, color: COLORS.textSecondary, lineHeight: 13 },

  otherStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  oStatCol: { gap: 1 },
  oStatLbl: { fontSize: 8, color: COLORS.textTertiary },
  oStatVal: { fontSize: 9, fontWeight: '800', color: COLORS.textPrimary },

  otherNotesRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  otherNoteItem: { fontSize: 8, color: COLORS.textSecondary },

  otherActionRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  otherApplyBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  otherApplyBtnText: { fontSize: 10, fontWeight: '800', color: COLORS.white },
  otherSelectBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  otherSelectBtnActive: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  otherSelectBtnText: { fontSize: 9, fontWeight: '800', color: COLORS.primary },
  otherSelectBtnTextActive: { color: '#15803d' },
  otherDetailsBtn: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: '#f1f5f9',
  },

  // COMPARISON MATRIX TAB
  matrixCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  matrixHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  matrixTitle: { fontSize: 13, fontWeight: '900', color: COLORS.textPrimary },
  matrixSub: { fontSize: 9, color: COLORS.textTertiary, marginTop: 1 },

  toggleChipsWrapper: { gap: 4, marginTop: 2 },
  toggleSectionLbl: { fontSize: 9, fontWeight: '800', color: COLORS.textSecondary },
  toggleChipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  schemeToggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  schemeToggleChipActive: { backgroundColor: '#ecfdf5', borderColor: '#10b981' },
  schemeToggleChipText: { fontSize: 9, fontWeight: '700', color: COLORS.textSecondary },
  schemeToggleChipTextActive: { color: '#065f46', fontWeight: '900' },

  paramFilterRow: { flexDirection: 'row', gap: 6, marginVertical: 4 },
  paramFilterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: '#f1f5f9',
  },
  paramFilterPillActive: { backgroundColor: COLORS.primary },
  paramFilterText: { fontSize: 9, fontWeight: '700', color: COLORS.textSecondary },
  paramFilterTextActive: { color: COLORS.white },

  tableScroll: { marginVertical: 4 },
  matrixTable: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, overflow: 'hidden' },
  thRow: { flexDirection: 'row', backgroundColor: '#064e3b' },
  thCellParam: { padding: 8, justifyContent: 'center' },
  thCellParamText: { fontSize: 9, fontWeight: '900', color: COLORS.white },
  thCellScheme: { width: 110, padding: 8, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#047857' },
  thCellSchemeBest: { backgroundColor: '#047857' },
  bestBadgeMini: { fontSize: 7, fontWeight: '900', color: '#fef08a' },
  thSchemeNameText: { fontSize: 9, fontWeight: '900', color: COLORS.white, textAlign: 'center' },
  thSchemeMatchText: { fontSize: 8, color: '#a7f3d0' },

  tdRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tdCellParam: { padding: 8, justifyContent: 'center' },
  tdParamText: { fontSize: 8, fontWeight: '800', color: COLORS.textSecondary },
  tdCellScheme: { width: 110, padding: 8, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#f1f5f9' },
  tdCellSchemeWinner: { backgroundColor: '#f0fdf4' },
  tdValText: { fontSize: 8, color: COLORS.textPrimary, textAlign: 'center' },
  tdValTextWinner: { fontWeight: '900', color: '#15803d' },
  winnerBadgeText: { fontSize: 6, fontWeight: '900', color: '#047857', marginTop: 2 },

  actionTableRow: { flexDirection: 'row', backgroundColor: '#f8fafc', paddingVertical: 6 },
  tableApplyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm, marginBottom: 4 },
  tableApplyBtnText: { fontSize: 8, fontWeight: '900', color: COLORS.white },
  tableSelectBtn: { borderWidth: 1, borderColor: COLORS.primary, paddingHorizontal: 6, paddingVertical: 3, borderRadius: RADIUS.sm },
  tableSelectBtnActive: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  tableSelectBtnText: { fontSize: 7, fontWeight: '800', color: COLORS.primary },
  tableSelectBtnTextActive: { color: '#15803d' },

  recBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  recBannerText: { fontSize: 9, color: '#14532d', flex: 1, lineHeight: 13 },

  // ELIGIBILITY TAB
  eligibilityCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  eligibilityHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eligibilityTitle: { fontSize: 13, fontWeight: '900', color: COLORS.textPrimary },
  eligibilitySub: { fontSize: 9, color: COLORS.textTertiary },

  selectorPillScroll: { marginVertical: 2 },
  schemeSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: '#f1f5f9',
    marginRight: 6,
  },
  schemeSelectorPillActive: { backgroundColor: COLORS.primary },
  schemeSelectorText: { fontSize: 9, fontWeight: '800', color: COLORS.textSecondary },
  schemeSelectorTextActive: { color: COLORS.white },
  activeDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#4ade80' },

  eligibilityStatusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  curSchemeName: { fontSize: 12, fontWeight: '900', color: COLORS.textPrimary },
  curSchemeMinistry: { fontSize: 8, color: COLORS.textTertiary, marginTop: 1 },
  matchScoreBadgeLg: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.md, alignItems: 'center' },
  matchScoreLgText: { fontSize: 13, fontWeight: '900', color: '#047857' },
  matchScoreLgSub: { fontSize: 7, fontWeight: '800', color: '#065f46' },

  criteriaHeading: { fontSize: 10, fontWeight: '900', color: COLORS.textPrimary, marginTop: 4 },
  eligibilityChecklist: { gap: 6 },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: RADIUS.md,
  },
  checkTitle: { fontSize: 10, fontWeight: '800', color: COLORS.textPrimary },
  checkText: { fontSize: 9, color: COLORS.textSecondary, marginTop: 1 },
  checkStatutoryNote: { fontSize: 8, color: COLORS.textTertiary, marginTop: 2, fontStyle: 'italic' },

  resultBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: RADIUS.md,
    padding: 10,
    gap: 6,
  },
  resultTitle: { fontSize: 11, fontWeight: '900', color: '#166534' },
  resultDesc: { fontSize: 9, color: '#14532d', lineHeight: 13 },
  eligibilityActionRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  eligibilityApplyBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  eligibilityApplyBtnText: { fontSize: 10, fontWeight: '900', color: COLORS.white },
  eligibilitySyncBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  eligibilitySyncBtnText: { fontSize: 9, fontWeight: '800', color: COLORS.primary },

  // DOCUMENT VAULT TAB
  readinessCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  readinessHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  readinessTitle: { fontSize: 13, fontWeight: '900', color: COLORS.textPrimary },
  readinessSub: { fontSize: 9, color: COLORS.textTertiary },

  meterContainer: { backgroundColor: '#f8fafc', padding: 8, borderRadius: RADIUS.md, gap: 4, marginVertical: 4 },
  meterLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meterSchemeTitle: { fontSize: 10, fontWeight: '900', color: COLORS.textPrimary },
  readinessScore: { fontSize: 10, fontWeight: '900', color: '#047857' },
  progressBarBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: RADIUS.full, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary },

  docList: { gap: 6, marginTop: 2 },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: RADIUS.md,
  },
  docBadge: { fontSize: 12, fontWeight: '900' },
  docName: { fontSize: 10, fontWeight: '800', color: COLORS.textPrimary },
  mandatoryStar: { fontSize: 10, fontWeight: '900', color: '#b91c1c' },
  docDesc: { fontSize: 8, color: COLORS.textTertiary },
  docStatusPill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.sm },
  docStatusText: { fontSize: 8, fontWeight: '800' },

  docUploadHelp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginTop: 4,
  },
  docUploadHelpText: { fontSize: 9, color: '#1e40af', flex: 1, lineHeight: 13 },

  // APPLICATION TRACKER TAB
  trackerCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  trackerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trackerTitle: { fontSize: 13, fontWeight: '900', color: COLORS.textPrimary },
  appIdText: { fontSize: 9, fontWeight: '800', color: COLORS.primary },

  currentAppInfoBox: {
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#86efac',
    gap: 2,
  },
  currentAppSchemeName: { fontSize: 11, fontWeight: '900', color: '#166534' },
  currentAppMeta: { fontSize: 9, color: '#15803d' },

  trackerWorkflow: { gap: 8, marginVertical: 6 },
  trackerStepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trackerStepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDone: { backgroundColor: COLORS.primary },
  stepActive: { backgroundColor: '#b45309' },
  trackerStepTitle: { fontSize: 10, fontWeight: '800', color: COLORS.textPrimary },
  trackerStepDate: { fontSize: 8, color: COLORS.textTertiary },

  officerAssistanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#faf5ff',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  officerTitle: { fontSize: 8, color: '#6b21a8' },
  officerName: { fontSize: 10, fontWeight: '800', color: '#581c87' },
  officerContact: { fontSize: 8, color: '#7e22ce', marginTop: 1 },

  // APPLICATION MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.md,
    maxHeight: '85%',
    gap: 10,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  modalTitle: { fontSize: 14, fontWeight: '900', color: COLORS.textPrimary },
  modalSchemeName: { fontSize: 10, color: COLORS.primary, fontWeight: '700', marginTop: 1 },
  modalCloseBtn: { padding: 4 },

  modalScroll: { gap: 8 },
  previewBox: { backgroundColor: '#f8fafc', padding: 10, borderRadius: RADIUS.md, gap: 4, borderWidth: 1, borderColor: COLORS.border },
  previewHeading: { fontSize: 10, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 2 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between' },
  previewLbl: { fontSize: 9, color: COLORS.textSecondary },
  previewVal: { fontSize: 9, fontWeight: '700', color: COLORS.textPrimary },

  channelHeading: { fontSize: 10, fontWeight: '900', color: COLORS.textPrimary, marginTop: 8, marginBottom: 4 },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 6,
  },
  channelItemActive: { backgroundColor: '#eff6ff', borderColor: COLORS.primary },
  channelTitle: { fontSize: 10, fontWeight: '800', color: COLORS.textPrimary },
  channelTitleActive: { color: COLORS.primary },
  channelDesc: { fontSize: 8, color: COLORS.textTertiary, marginTop: 1 },

  modalActionRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modalCancelBtnText: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary },
  modalConfirmBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  modalConfirmBtnText: { fontSize: 10, fontWeight: '900', color: COLORS.white },
});
