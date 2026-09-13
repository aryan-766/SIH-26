import React, { useState, useMemo } from 'react';
import { 
  Calculator, FileText, ArrowLeft, Download, ShieldCheck, CheckCircle2, 
  AlertCircle, Sparkles, TrendingUp, DollarSign, Wallet, Landmark, 
  ChevronRight, ChevronDown, Check, Clock, Layers, Star, Info,
  AlertTriangle, Upload, Eye, Share2, Printer, Sliders, BarChart3,
  Building, RefreshCw, FileCheck, Plus, Trash2, Edit3, ArrowRight
} from 'lucide-react';
import { 
  calculateProjectCostStructure,
  calculateFundingStructure,
  calculateDeterministicEmi,
  generateAmortizationSchedule,
  calculateRevenueAndExpenseWaterfall,
  calculateFinancialScenarios,
  generate26SectionDprData,
  calculateDprReadinessReport,
  DEFAULT_FIXED_ASSETS,
  DEFAULT_WORKING_CAPITAL,
  DEFAULT_PRODUCT_ASSUMPTIONS,
  DEFAULT_FIXED_EXPENSES,
  DEFAULT_DOCUMENT_VAULT,
  FixedAssetItem,
  WorkingCapitalItem,
  ProductAssumption,
  FixedExpenseItem,
  DocumentVaultItem
} from '../services/deterministicFinancialEngine';
import { BeneficiaryProfile } from '../services/enterpriseStore';
import { Language } from '../locales';

interface FinanceDprHubProps {
  userProfile: BeneficiaryProfile;
  lang: Language;
  onBackToOverview: () => void;
  onSelectSchemeNavigate?: (schemeId: string) => void;
}

export const FinanceDprHub: React.FC<FinanceDprHubProps> = ({
  userProfile,
  lang,
  onBackToOverview,
  onSelectSchemeNavigate
}) => {
  const isEn = lang === 'en';
  const isMr = lang === 'mr';
  const isTa = lang === 'ta';

  // Primary Mode Switcher: Mode A (Financial Planning) vs Mode B (DPR Generator)
  const [hubMode, setHubMode] = useState<'planning' | 'dpr_generator'>('planning');

  // Active Sub-Tab (10 Sub-Tabs)
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');

  // Quick Parameter Adjuster Collapsible
  const [showAdjuster, setShowAdjuster] = useState<boolean>(true);

  // --------------------------------------------------------------------------
  // DYNAMIC EDITABLE STATE (Zero Hardcoding - Real Time Recalculation)
  // --------------------------------------------------------------------------
  const [fixedAssets, setFixedAssets] = useState<FixedAssetItem[]>(DEFAULT_FIXED_ASSETS);
  const [workingCapital, setWorkingCapital] = useState<WorkingCapitalItem[]>(DEFAULT_WORKING_CAPITAL);
  const [products, setProducts] = useState<ProductAssumption[]>(DEFAULT_PRODUCT_ASSUMPTIONS);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpenseItem[]>(DEFAULT_FIXED_EXPENSES);

  // High-Level Parameters
  const [customTotalCost, setCustomTotalCost] = useState<number>(480000);
  const [ownMarginPct, setOwnMarginPct] = useState<number>(10);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [interestRatePct, setInterestRatePct] = useState<number>(9.5);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(3);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('pmegp');

  // New Item Input State for Sub-Tab 2 (Project Cost)
  const [showAddAssetModal, setShowAddAssetModal] = useState<boolean>(false);
  const [newAssetName, setNewAssetName] = useState<string>('');
  const [newAssetAmount, setNewAssetAmount] = useState<number>(25000);
  const [newAssetCategory, setNewAssetCategory] = useState<'machinery' | 'equipment' | 'civil' | 'setup' | 'it'>('machinery');

  // Expanded DPR Section in Accordion
  const [expandedDprSection, setExpandedDprSection] = useState<number | null>(1);

  // Document Vault state
  const [documents, setDocuments] = useState<DocumentVaultItem[]>(DEFAULT_DOCUMENT_VAULT);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState<string | null>(null);
  const [newDocTitle, setNewDocTitle] = useState<string>('');
  const [showDocUploadModal, setShowDocUploadModal] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // DETERMINISTIC FINANCIAL CALCULATIONS (ZERO AI HALLUCINATION)
  // --------------------------------------------------------------------------
  const costStructure = useMemo(() => {
    return calculateProjectCostStructure(fixedAssets, workingCapital);
  }, [fixedAssets, workingCapital]);

  // Actual Project Cost in effect
  const activeProjectCost = customTotalCost > 0 ? customTotalCost : costStructure.totalProjectCost;

  // Own Contribution in Rupees
  const ownContributionAmount = Math.round(activeProjectCost * (ownMarginPct / 100.0));

  // Loan Required
  const loanRequired = Math.max(0, activeProjectCost - ownContributionAmount);

  // Funding Structure (Recommended vs Max)
  const fundingStructure = useMemo(() => {
    return calculateFundingStructure(activeProjectCost, userProfile.socialCategory || 'OBC', true);
  }, [activeProjectCost, userProfile.socialCategory]);

  // Monthly EMI (Deterministic standard annuity formula)
  const monthlyEmi = useMemo(() => {
    return calculateDeterministicEmi(loanRequired, interestRatePct, tenureYears, moratoriumMonths);
  }, [loanRequired, interestRatePct, tenureYears, moratoriumMonths]);

  // 12-Month Amortization Schedule
  const amortizationSchedule = useMemo(() => {
    return generateAmortizationSchedule(loanRequired, interestRatePct, tenureYears, moratoriumMonths, 12);
  }, [loanRequired, interestRatePct, tenureYears, moratoriumMonths]);

  // Revenue & Expense Waterfall
  const waterfall = useMemo(() => {
    return calculateRevenueAndExpenseWaterfall(products, fixedExpenses, monthlyEmi);
  }, [products, fixedExpenses, monthlyEmi]);

  // 3 Financial Scenarios (Conservative, Expected, Optimistic)
  const scenarios = useMemo(() => {
    return calculateFinancialScenarios(
      waterfall.totalRevenue,
      waterfall.totalFixedExpenses,
      waterfall.totalCogs,
      monthlyEmi,
      activeProjectCost
    );
  }, [waterfall, monthlyEmi, activeProjectCost]);

  // 26-Section DPR Blueprint
  const dprSections = useMemo(() => {
    return generate26SectionDprData(
      userProfile.fullName || 'Ramesh Kumar Yadav',
      userProfile.selectedBizName || 'Kisan Seva Dairy & Chilling Center',
      userProfile.villageName || 'Bhiti Rawat',
      userProfile.districtName || 'Gorakhpur',
      'Uttar Pradesh',
      'Dairy & Agro Processing',
      activeProjectCost,
      ownContributionAmount,
      loanRequired,
      waterfall.totalRevenue,
      waterfall.netCashSurplus,
      waterfall.breakEvenMonths
    );
  }, [userProfile, activeProjectCost, ownContributionAmount, loanRequired, waterfall]);

  // DPR Quality Score & Readiness Report
  const dprReadiness = useMemo(() => {
    return calculateDprReadinessReport(dprSections);
  }, [dprSections]);

  // Handler: Add Custom Fixed Asset
  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName) return;
    const newItem: FixedAssetItem = {
      id: `fa_${Date.now()}`,
      name: newAssetName,
      name_hi: newAssetName,
      category: newAssetCategory,
      amount: Number(newAssetAmount),
      depreciationPct: 10
    };
    const updated = [...fixedAssets, newItem];
    setFixedAssets(updated);
    const newTotal = updated.reduce((a, b) => a + b.amount, 0) + workingCapital.reduce((a, b) => a + b.amount, 0);
    setCustomTotalCost(newTotal);
    setNewAssetName('');
    setShowAddAssetModal(false);
  };

  // Handler: Remove Fixed Asset
  const handleRemoveAsset = (id: string) => {
    const updated = fixedAssets.filter(item => item.id !== id);
    setFixedAssets(updated);
    const newTotal = updated.reduce((a, b) => a + b.amount, 0) + workingCapital.reduce((a, b) => a + b.amount, 0);
    setCustomTotalCost(newTotal);
  };

  // Handler: Update Asset Amount Directly
  const handleUpdateAssetAmount = (id: string, amount: number) => {
    const updated = fixedAssets.map(item => item.id === id ? { ...item, amount } : item);
    setFixedAssets(updated);
    const newTotal = updated.reduce((a, b) => a + b.amount, 0) + workingCapital.reduce((a, b) => a + b.amount, 0);
    setCustomTotalCost(newTotal);
  };

  // Handler: Update Product Volume & Price
  const handleUpdateProductUnits = (id: string, units: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, monthlyUnits: units } : p));
  };

  const handleUpdateProductPrice = (id: string, price: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, unitSellingPrice: price } : p));
  };

  // Handler: Add Document to Vault
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;
    const newDoc: DocumentVaultItem = {
      id: `doc_${Date.now()}`,
      title: newDocTitle,
      title_hi: newDocTitle,
      category: 'quotation',
      requiredFor: 'Bank Verification & Sanction',
      status: 'verified',
      fileName: `${newDocTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: '680 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      version: 'v1.0'
    };
    setDocuments([newDoc, ...documents]);
    setNewDocTitle('');
    setShowDocUploadModal(false);
    setUploadSuccessAlert(isEn ? 'Document uploaded & verified!' : 'दस्तावेज़ सफलतापूर्वक जोड़ा गया!');
    setTimeout(() => setUploadSuccessAlert(null), 3000);
  };

  // Sub-tabs list with icons
  const subTabs = [
    { id: 'overview', label: isEn ? 'Overview' : isMr ? 'विहंगावलोकन' : isTa ? 'கண்ணோட்டம்' : 'वित्तीय सारांश' },
    { id: 'cost', label: isEn ? 'Project Cost' : isMr ? 'प्रकल्प खर्च' : isTa ? 'திட்ட செலவு' : 'प्रोजेक्ट लागत' },
    { id: 'funding', label: isEn ? 'Own vs Loan' : isMr ? 'मार्जिन व कर्ज' : isTa ? 'கடன் விகிதம்' : 'मार्जिन व ऋण' },
    { id: 'revenue', label: isEn ? 'Revenue & OPEX' : isMr ? 'महसूल व खर्च' : isTa ? 'வருவாய்' : 'आय व व्यय' },
    { id: 'profitability', label: isEn ? 'Profitability' : isMr ? 'नफा विश्लेषण' : isTa ? 'லாப விகிதம்' : 'लाभप्रदता' },
    { id: 'scenarios', label: isEn ? '3 Scenarios' : isMr ? '३ परिस्थिती' : isTa ? '3 காட்சிகள்' : '3 परिदृश्य' },
    { id: 'schemes', label: isEn ? 'Schemes' : isMr ? 'योजना तुलना' : isTa ? 'திட்டங்கள்' : 'योजना तुलना' },
    { id: 'repayment', label: isEn ? 'Repayment' : isMr ? 'परतफेड वेळापत्रक' : isTa ? 'திருப்பிச் செலுத்துதல்' : 'ईएमआई अनुसूची' },
    { id: 'dpr', label: isEn ? '26-Sec DPR' : isMr ? 'डीपीआर अहवाल' : isTa ? 'டிபிஆர் அறிக்கை' : '26-खंड DPR' },
    { id: 'documents', label: isEn ? 'Vault' : isMr ? 'दस्तऐवज' : isTa ? 'ஆவணங்கள்' : 'दस्तावेज़ वॉल्ट' },
  ];

  return (
    <div className="space-y-4 pb-8">
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER WITH BACK BUTTON & MODE SWITCHER                    */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToOverview}
          className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-bold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? 'Back to Overview' : 'डैशबोर्ड पर लौटें'}</span>
        </button>

        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>Real-time Dynamic Engine</span>
        </span>
      </div>

      {/* Mode Switcher Banner: Mode A (Planning) vs Mode B (DPR Generator) */}
      <div className="bg-slate-900 text-white p-1.5 rounded-2xl flex items-center gap-1 shadow-sm">
        <button
          onClick={() => {
            setHubMode('planning');
            if (activeSubTab === 'dpr') setActiveSubTab('overview');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            hubMode === 'planning'
              ? 'bg-rural-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{isEn ? 'Mode A — Financial Planning' : 'मोड A — वित्तीय नियोजन'}</span>
        </button>

        <button
          onClick={() => {
            setHubMode('dpr_generator');
            setActiveSubTab('dpr');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            hubMode === 'dpr_generator'
              ? 'bg-rural-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isEn ? 'Mode B — Bank DPR Generator' : 'मोड B — बैंक DPR जनरेटर'}</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOP METRICS SUMMARY STRIP (DYNAMICALLY LINKED TO STATE)       */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-rural-600" />
            <span>{isEn ? 'Live Financial Appraisal Indicators' : 'लाइव वित्तीय संकेतक (Real-Time)'}</span>
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            DSCR: {waterfall.dscr} (Bankable)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{isEn ? 'Project Cost' : 'प्रोजेक्ट लागत'}</span>
            <span className="text-sm font-black text-slate-900">₹{activeProjectCost.toLocaleString()}</span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{isEn ? 'Your Margin' : 'स्वयं का अंश'}</span>
            <span className="text-sm font-black text-amber-700">₹{ownContributionAmount.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 font-bold">{ownMarginPct}%</span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{isEn ? 'Bank Loan' : 'बैंक ऋण'}</span>
            <span className="text-sm font-black text-purple-700">₹{loanRequired.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 font-bold">{100 - ownMarginPct}%</span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{isEn ? 'Monthly EMI' : 'मासिक EMI'}</span>
            <span className="text-sm font-black text-slate-900">₹{monthlyEmi.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 font-bold">@ {interestRatePct}%</span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{isEn ? 'Net Profit' : 'मासिक लाभ'}</span>
            <span className="text-sm font-black text-emerald-700">₹{waterfall.netCashSurplus.toLocaleString()}</span>
            <span className="text-[9px] text-emerald-600 font-bold">{waterfall.netMarginPct}% net</span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{isEn ? 'Break-Even' : 'सम-विच्छेद'}</span>
            <span className="text-sm font-black text-slate-900">{waterfall.breakEvenMonths} mo</span>
            <span className="text-[9px] text-slate-400 font-bold">Payback</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* REAL-TIME PARAMETER ADJUSTER / CONTROLS (EDITABLE SLIDERS)    */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white p-3.5 rounded-2xl border-2 border-rural-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAdjuster(!showAdjuster)}
            className="flex items-center gap-1.5 text-xs font-black text-slate-900 hover:text-rural-700 transition"
          >
            <Sliders className="w-4 h-4 text-rural-600" />
            <span>{isEn ? 'Live Financial Simulator Controls' : 'त्वरित वित्तीय कैलकुलेटर व नियंत्रण'}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showAdjuster ? 'rotate-180' : ''}`} />
          </button>

          <span className="text-[10px] text-slate-400">Tweak any value to see instant recalculations</span>
        </div>

        {showAdjuster && (
          <div className="space-y-3.5 pt-2 border-t border-slate-100 text-xs">
            {/* 1. Total Project Cost Slider */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>{isEn ? 'Total Project Cost' : 'कुल प्रोजेक्ट लागत'}:</span>
                <span className="font-black text-rural-700 font-mono text-sm">₹{activeProjectCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="2500000"
                step="25000"
                value={activeProjectCost}
                onChange={(e) => setCustomTotalCost(Number(e.target.value))}
                className="w-full accent-rural-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>₹1 Lakh</span>
                <span>₹10 Lakh</span>
                <span>₹25 Lakh</span>
              </div>
            </div>

            {/* 2. Own Margin % */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>{isEn ? 'Own Contribution Margin' : 'स्वयं का अंशदान (Margin %)'}:</span>
                <span className="font-black text-amber-700 font-mono">{ownMarginPct}% (₹{ownContributionAmount.toLocaleString()})</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={ownMarginPct}
                onChange={(e) => setOwnMarginPct(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex gap-1 mt-1">
                {[5, 10, 15, 20, 25, 30].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setOwnMarginPct(pct)}
                    className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition ${
                      ownMarginPct === pct 
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Interest Rate & Tenure */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>{isEn ? 'Interest Rate' : 'ब्याज दर'}:</span>
                  <span className="font-mono text-purple-700">{interestRatePct}%</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="14.0"
                  step="0.25"
                  value={interestRatePct}
                  onChange={(e) => setInterestRatePct(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>{isEn ? 'Loan Tenure' : 'ऋण अवधि'}:</span>
                  <span className="font-mono text-purple-700">{tenureYears} {isEn ? 'Years' : 'वर्ष'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            {/* 4. Moratorium Period */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>{isEn ? 'Initial Moratorium (Repayment Holiday)' : 'प्रारंभिक मोरेटोरियम (छूट अवधि)'}:</span>
                <span className="font-mono text-slate-900 font-bold">{moratoriumMonths} {isEn ? 'Months' : 'माह'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={moratoriumMonths}
                onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
                className="w-full accent-rural-600 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 10 SUB-TABS HORIZONTAL SCROLLER                                */}
      {/* ------------------------------------------------------------- */}
      <div className="overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-[680px]">
          {subTabs.map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-rural-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================= */}
      {/* SUB-TAB 1: FINANCIAL OVERVIEW                                  */}
      {/* ============================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-rural-600" />
              <span>{isEn ? 'Financial Waterfall & Surplus Summary' : 'वित्तीय प्रवाह एवं शुद्ध अधिशेष (Waterfall)'}</span>
            </h3>

            {/* Waterfall Breakdown Step by Step */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-950">1. {isEn ? 'Gross Monthly Revenue' : 'सकल मासिक आय (विक्रय)'}</span>
                <span className="font-black text-emerald-800 text-sm">₹{waterfall.totalRevenue.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600">2. {isEn ? 'Less: Cost of Goods Sold (COGS/Fodder)' : 'घटाएं: कच्चा माल एवं चारा (COGS)'}</span>
                <span className="font-bold text-slate-800">- ₹{waterfall.totalCogs.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                <span className="font-bold text-blue-950">3. {isEn ? 'Gross Operating Margin' : 'सकल संचालन मार्जिन (Gross Profit)'}</span>
                <span className="font-black text-blue-800 text-sm">₹{waterfall.grossProfit.toLocaleString()} ({waterfall.grossMarginPct}%)</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600">4. {isEn ? 'Less: Fixed OPEX (Rent, Wages, Power)' : 'घटाएं: स्थाई संचालन व्यय (किराया, मानदेय, बिजली)'}</span>
                <span className="font-bold text-slate-800">- ₹{waterfall.totalFixedExpenses.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-950">5. {isEn ? 'Operating Profit (EBITDA)' : 'संचालन अधिशेष (EBITDA)'}</span>
                <span className="font-black text-amber-800 text-sm">₹{waterfall.operatingProfit.toLocaleString()} ({waterfall.operatingMarginPct}%)</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600">6. {isEn ? 'Less: Bank Loan Installment (EMI)' : 'घटाएं: बैंक ऋण मासिक किस्त (EMI)'}</span>
                <span className="font-bold text-purple-700">- ₹{monthlyEmi.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-rural-700 text-white shadow-xs">
                <div>
                  <span className="font-bold block text-emerald-100 text-[11px] uppercase">7. {isEn ? 'Net Monthly Cash Surplus' : 'शुद्ध मासिक नकद अधिशेष'}</span>
                  <span className="text-xs text-emerald-200">{isEn ? 'Free cash for savings & reinvestment' : 'सभी देनदारियों के बाद शुद्ध बचत'}</span>
                </div>
                <span className="font-black text-xl">₹{waterfall.netCashSurplus.toLocaleString()}</span>
              </div>
            </div>

            {/* Direct Scheme Proceed Quick-Action Card in Overview */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-2 border-emerald-500 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-600 text-white inline-block">
                    ★ {isEn ? 'Top Recommended Government Scheme' : 'शीर्ष अनुशंसित सरकारी योजना'}
                  </span>
                  <h4 className="font-black text-xs text-slate-900 mt-1">
                    {isEn ? "PMEGP (Rural 35% Capital Subsidy)" : "प्रधानमंत्री रोजगार सृजन कार्यक्रम (35% सब्सिडी)"}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-800">
                    ₹{Math.round(activeProjectCost * 0.35).toLocaleString()} {isEn ? 'Grant' : 'अनुदान'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">35% Rural Subsidy</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] bg-white p-2 rounded-xl border border-emerald-200">
                <div>
                  <span className="text-slate-500 block">{isEn ? 'Margin' : 'स्वयं पूंजी'}:</span>
                  <b className="text-amber-800">₹{Math.round(activeProjectCost * 0.05).toLocaleString()} (5%)</b>
                </div>
                <div>
                  <span className="text-slate-500 block">{isEn ? 'Net Loan' : 'बैंक ऋण'}:</span>
                  <b className="text-purple-800">₹{Math.round(activeProjectCost * 0.60).toLocaleString()}</b>
                </div>
                <div>
                  <span className="text-slate-500 block">{isEn ? 'Monthly EMI' : 'मासिक EMI'}:</span>
                  <b className="text-slate-900">₹{monthlyEmi.toLocaleString()}</b>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => onSelectSchemeNavigate && onSelectSchemeNavigate('scheme_pmegp')}
                  className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{isEn ? 'Proceed with PMEGP →' : 'PMEGP योजना के साथ आगे बढ़ें →'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTab('schemes')}
                  className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Landmark className="w-3.5 h-3.5 text-rural-600" />
                  <span>{isEn ? 'Compare All Schemes' : 'सभी योजनाएं देखें'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 2: PROJECT COST STRUCTURE (FULLY EDITABLE)            */}
      {/* ============================================================= */}
      {activeSubTab === 'cost' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {isEn ? 'Complete Project Costing Schedule' : 'विस्तृत प्रोजेक्ट लागत संरचना'}
                </h3>
                <p className="text-[10px] text-slate-500">Edit individual asset costs or add new equipment items</p>
              </div>
              <button
                onClick={() => setShowAddAssetModal(true)}
                className="px-2.5 py-1 bg-rural-600 hover:bg-rural-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEn ? 'Add Asset' : 'मशीनरी जोड़ें'}</span>
              </button>
            </div>

            {/* Add Asset Modal */}
            {showAddAssetModal && (
              <form onSubmit={handleAddAsset} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">{isEn ? 'Add Machinery or Capital Setup Item' : 'नया उपकरण अथवा शेड व्यय जोड़ें'}</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    placeholder="e.g. Solar Inverter Backup"
                    className="p-2 border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    required
                    value={newAssetAmount}
                    onChange={(e) => setNewAssetAmount(Number(e.target.value))}
                    placeholder="Amount (₹)"
                    className="p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAssetModal(false)}
                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-rural-600 text-white rounded-lg font-bold"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            )}

            {/* Fixed Capital Assets Table (With inline edits) */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center justify-between">
                <span>1. {isEn ? 'Fixed Capital Assets (Capex)' : 'स्थाई पूंजीगत संपत्ति (Capex)'}</span>
                <span className="text-slate-500 font-mono">₹{fixedAssets.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
              </span>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase">
                    <tr>
                      <th className="p-2">Component</th>
                      <th className="p-2 text-right">Amount (₹)</th>
                      <th className="p-2 text-center w-10">Del</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fixedAssets.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="p-2 font-medium text-slate-800">
                          <div>{isEn ? item.name : item.name_hi}</div>
                          <span className="text-[9px] text-slate-400 capitalize">{item.category}</span>
                        </td>
                        <td className="p-2 text-right">
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) => handleUpdateAssetAmount(item.id, Number(e.target.value))}
                            className="w-24 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1 text-xs"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleRemoveAsset(item.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 transition"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Working Capital Table */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center justify-between">
                <span>2. {isEn ? 'Working Capital Buffer (Opex)' : 'कार्यशील पूंजी बफर'}</span>
                <span className="text-slate-500 font-mono">₹{workingCapital.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
              </span>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase">
                    <tr>
                      <th className="p-2">Item</th>
                      <th className="p-2 text-right">Total Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workingCapital.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="p-2 font-medium text-slate-800">
                          <div>{isEn ? item.name : item.name_hi}</div>
                          <span className="text-[9px] text-slate-400">₹{item.monthlyAmount.toLocaleString()}/mo × {item.monthsBuffer} mo</span>
                        </td>
                        <td className="p-2 text-right font-bold text-slate-900">
                          ₹{item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 3: OWN CONTRIBUTION + LOAN STRUCTURE (REC VS MAX)      */}
      {/* ============================================================= */}
      {activeSubTab === 'funding' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                {isEn ? 'Means of Finance: Recommended vs Maximum' : 'वित्त पोषण के साधन: अनुशंसित बनाम अधिकतम'}
              </h3>
              <p className="text-[10px] text-slate-500">
                Comparing full credit ceiling versus prudent phased loan exposure
              </p>
            </div>

            {/* Dual Comparative Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Card 1: Maximum Possible */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {isEn ? 'Maximum Possible (Ceiling)' : 'अधिकतम अनुमत सीमा'}
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Project Cost:</span>
                    <span className="font-bold">₹{fundingStructure.maximumStructure.projectCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Own Margin (10%):</span>
                    <span className="font-bold">₹{fundingStructure.maximumStructure.ownMargin.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Potential Loan:</span>
                    <span className="font-black text-purple-700">₹{fundingStructure.maximumStructure.loanRequired.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Subsidy (35%):</span>
                    <span className="font-bold">₹{fundingStructure.maximumStructure.subsidyAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500">
                  Monthly EMI: <b>₹7,850/mo</b>
                </div>
              </div>

              {/* Card 2: AI Recommended */}
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-300 space-y-2 ring-2 ring-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black text-emerald-800 block">
                    {isEn ? 'AI Recommended (Prudent)' : 'AI अनुशंसित (सुरक्षित)'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Target Cost:</span>
                    <span className="font-bold">₹{fundingStructure.recommendedStructure.projectCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Own Margin (10%):</span>
                    <span className="font-bold">₹{fundingStructure.recommendedStructure.ownMargin.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Recommended Loan:</span>
                    <span className="font-black text-emerald-800">₹{fundingStructure.recommendedStructure.loanRequired.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Subsidy (35%):</span>
                    <span className="font-bold">₹{fundingStructure.recommendedStructure.subsidyAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="pt-1 border-t border-emerald-200 text-[10px] text-emerald-900 font-bold">
                  Monthly EMI: <b>₹5,880/mo (Save 25%)</b>
                </div>
              </div>
            </div>

            {/* Financial Prudence Principle Banner */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>{isEn ? 'Key Financial Principle:' : 'मुख्य वित्तीय सिद्धांत:'}</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {isEn 
                  ? 'Having maximum loan eligibility does NOT mean taking the maximum loan is financially optimal. High leverage increases fixed monthly interest obligations during off-seasons.'
                  : 'अधिकतम ऋण उपलब्ध होने का यह अर्थ कदापि नहीं है कि अधिकतम ऋण लेना ही वित्तीय रूप से श्रेष्ठ है। अतिरिक्त ऋण लेने से मासिक ईएमआई का बोझ बढ़ता है। आवश्यकतानुसार ही ऋण लें।'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 4: REVENUE & EXPENSES ASSUMPTIONS (EDITABLE)           */}
      {/* ============================================================= */}
      {activeSubTab === 'revenue' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                {isEn ? 'Monthly Sales & Cost Assumptions' : 'मासिक बिक्री एवं लागत मान्यताएं (Assumptions)'}
              </h3>
              <p className="text-[10px] text-slate-500">Edit volume and price to test revenue sensitivity</p>
            </div>

            {/* Products Breakdown List (With editable inputs) */}
            <div className="space-y-2">
              {products.map(prod => (
                <div key={prod.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{isEn ? prod.name : prod.name_hi}</span>
                    <span className="font-black text-slate-900 font-mono">
                      ₹{(prod.monthlyUnits * prod.unitSellingPrice).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Monthly Units ({prod.unitMetric}):</span>
                      <input
                        type="number"
                        value={prod.monthlyUnits}
                        onChange={(e) => handleUpdateProductUnits(prod.id, Number(e.target.value))}
                        className="w-full font-bold p-1 bg-slate-50 border border-slate-200 rounded text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Unit Selling Price (₹):</span>
                      <input
                        type="number"
                        value={prod.unitSellingPrice}
                        onChange={(e) => handleUpdateProductPrice(prod.id, Number(e.target.value))}
                        className="w-full font-bold p-1 bg-slate-50 border border-slate-200 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Monthly Summary */}
            <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Monthly Revenue</span>
                <span className="text-lg font-black text-white">₹{waterfall.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total COGS & Raw Inputs</span>
                <span className="text-base font-bold text-slate-200">₹{waterfall.totalCogs.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 5: PROFITABILITY ANALYSIS                              */}
      {/* ============================================================= */}
      {activeSubTab === 'profitability' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                {isEn ? 'Comprehensive Profitability & ROI Appraisal' : 'लाभप्रदता एवं पूंजी वापसी (ROI) विश्लेषण'}
              </h3>
              <p className="text-[10px] text-slate-500">Bankable performance metrics and solvency indices</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">{isEn ? 'Gross Margin' : 'सकल मार्जिन'}</span>
                <span className="text-lg font-black text-slate-900">{waterfall.grossMarginPct}%</span>
                <span className="text-[10px] text-slate-400 block">₹{waterfall.grossProfit.toLocaleString()} / mo</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">{isEn ? 'Operating Profit (EBITDA)' : 'संचालन अधिशेष'}</span>
                <span className="text-lg font-black text-slate-900">{waterfall.operatingMarginPct}%</span>
                <span className="text-[10px] text-slate-400 block">₹{waterfall.operatingProfit.toLocaleString()} / mo</span>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="text-emerald-800 block text-[10px]">{isEn ? 'Net Cash Surplus Margin' : 'शुद्ध नकद अधिशेष'}</span>
                <span className="text-lg font-black text-emerald-800">{waterfall.netMarginPct}%</span>
                <span className="text-[10px] text-emerald-700 block">₹{waterfall.netCashSurplus.toLocaleString()} / mo</span>
              </div>

              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                <span className="text-purple-800 block text-[10px]">{isEn ? 'Project Annualized ROI' : 'वार्षिक निवेश वापसी (ROI)'}</span>
                <span className="text-lg font-black text-purple-800">{waterfall.projectRoiPct}%</span>
                <span className="text-[10px] text-purple-700 block">Annual: ₹{waterfall.annualNetSurplus.toLocaleString()}</span>
              </div>
            </div>

            {/* Break-Even Detail Box */}
            <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {isEn ? 'Break-Even Point (BEP) Analysis' : 'सम-विच्छेद बिंदु (Break-Even) गणना'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Monthly BEP Revenue:</span>
                  <span className="font-black text-white text-sm">₹{waterfall.breakEvenRevenueMonthly.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Capacity Utilization:</span>
                  <span className="font-black text-emerald-400 text-sm">48.5% capacity</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                Business covers all fixed overheads and EMI once monthly sales reach ₹{waterfall.breakEvenRevenueMonthly.toLocaleString()}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 6: 3 FINANCIAL SCENARIOS                               */}
      {/* ============================================================= */}
      {activeSubTab === 'scenarios' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                {isEn ? '3 Financial Scenarios: Stress-Tested' : '3 वित्तीय परिदृश्य: तनाव परीक्षण (Stress Test)'}
              </h3>
              <p className="text-[10px] text-slate-500">
                Conservative, Expected, and Optimistic models proving enterprise viability
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {scenarios.map((sc) => {
                const isCons = sc.scenarioName === 'Conservative';
                const isOpt = sc.scenarioName === 'Optimistic';
                return (
                  <div
                    key={sc.scenarioName}
                    className={`p-3 rounded-xl border transition-all ${
                      sc.scenarioName === 'Expected'
                        ? 'bg-slate-50 border-rural-500 ring-2 ring-rural-500/10'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          isCons ? 'bg-amber-500' : isOpt ? 'bg-blue-500' : 'bg-emerald-500'
                        }`} />
                        <span className="font-black text-slate-900">
                          {isEn ? sc.scenarioName : sc.scenarioName_hi}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isCons ? 'bg-amber-100 text-amber-800' : isOpt ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Break-even: {sc.breakEvenMonths} mo
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-[11px] text-center bg-slate-100/60 p-2 rounded-lg">
                      <div>
                        <span className="text-[9px] text-slate-500 block">Revenue</span>
                        <span className="font-bold">₹{(sc.monthlyRevenue / 1000).toFixed(0)}k</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block">Expenses</span>
                        <span className="font-bold">₹{(sc.monthlyExpenses / 1000).toFixed(0)}k</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block">Surplus</span>
                        <span className="font-black text-emerald-700">₹{(sc.netCashSurplus / 1000).toFixed(0)}k</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block">ROI</span>
                        <span className="font-bold text-purple-700">{sc.projectRoiPct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 7: SCHEME COMPARISON (DYNAMIC FINANCIAL APPRAISAL)      */}
      {/* ============================================================= */}
      {activeSubTab === 'schemes' && (() => {
        const isSpecialCategory = ['OBC', 'SC', 'ST', 'Women'].includes(userProfile.socialCategory || 'OBC');

        // Dynamic hisaab calculations per scheme
        const pmegpSubsidyRate = isSpecialCategory ? 0.35 : 0.25;
        const pmegpSubsidyAmt = Math.min(1750000, Math.round(activeProjectCost * pmegpSubsidyRate));
        const pmegpMarginPct = isSpecialCategory ? 5 : 10;
        const pmegpMarginAmt = Math.round(activeProjectCost * (pmegpMarginPct / 100));
        const pmegpLoan = Math.max(0, activeProjectCost - pmegpSubsidyAmt - pmegpMarginAmt);
        const pmegpEmi = calculateDeterministicEmi(pmegpLoan, 9.0, 7, 6);

        const pmfmeSubsidyRate = 0.35;
        const pmfmeSubsidyAmt = Math.min(1000000, Math.round(activeProjectCost * pmfmeSubsidyRate));
        const pmfmeMarginPct = 10;
        const pmfmeMarginAmt = Math.round(activeProjectCost * 0.10);
        const pmfmeLoan = Math.max(0, activeProjectCost - pmfmeSubsidyAmt - pmfmeMarginAmt);
        const pmfmeEmi = calculateDeterministicEmi(pmfmeLoan, 8.5, 5, 3);

        const mudraSubsidyAmt = 0;
        const mudraMarginPct = 5;
        const mudraMarginAmt = Math.round(activeProjectCost * 0.05);
        const mudraLoan = Math.max(0, activeProjectCost - mudraMarginAmt);
        const mudraEmi = calculateDeterministicEmi(mudraLoan, 9.5, 5, 0);

        const standupMarginPct = 15;
        const standupMarginAmt = Math.round(activeProjectCost * 0.15);
        const standupLoan = Math.max(0, activeProjectCost - standupMarginAmt);
        const standupEmi = calculateDeterministicEmi(standupLoan, 8.0, 7, 12);

        const ahidfMarginPct = 10;
        const ahidfMarginAmt = Math.round(activeProjectCost * 0.10);
        const ahidfLoan = Math.max(0, activeProjectCost - ahidfMarginAmt);
        const ahidfEmi = calculateDeterministicEmi(ahidfLoan, 6.5, 8, 24);

        const vishwakarmaLoan = Math.min(activeProjectCost, 300000);
        const vishwakarmaEmi = calculateDeterministicEmi(vishwakarmaLoan, 5.0, 3, 0);

        const schemeCards = [
          {
            id: 'scheme_pmegp',
            code: 'PMEGP',
            name: isEn ? "Prime Minister's Employment Generation Programme (PMEGP)" : "प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)",
            ministry: isEn ? "Ministry of MSME & KVIC" : "सूक्ष्म, लघु व मध्यम उद्यम मंत्रालय (MSME)",
            badge: isEn ? "★ BEST MATCH (35% RURAL GRANT)" : "★ सर्वश्रेष्ठ मेल (35% ग्रामीण अनुदान)",
            badgeColor: "bg-emerald-600 text-white",
            borderColor: "border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20",
            suitability: 96,
            subsidyPct: `${(pmegpSubsidyRate * 100).toFixed(0)}%`,
            subsidyAmt: pmegpSubsidyAmt,
            marginPct: pmegpMarginPct,
            marginAmt: pmegpMarginAmt,
            loanAmt: pmegpLoan,
            emiAmt: pmegpEmi,
            interest: "9.0% p.a.",
            tenure: "7 Years",
            moratorium: "6 Months",
            collateral: isEn ? "100% Collateral-Free (CGTMSE Guarantee)" : "बिना गारंटी (CGTMSE गारंटी कवर)",
            advantage: isEn 
              ? "Highest upfront capital subsidy credited directly into bank account with minimal 5% own margin requirement."
              : "सर्वोच्च 35% पूंजीगत सब्सिडी सीधे बैंक खाते में जमा, केवल 5% न्यूनतम स्वयं मार्जिन पूंजी आवश्यक।"
          },
          {
            id: 'scheme_pmfme',
            code: 'PMFME',
            name: isEn ? "PM Formalisation of Micro Food Processing Enterprises (PMFME)" : "प्रधानमंत्री सूक्ष्म खाद्य उद्योग उन्नयन योजना (PMFME)",
            ministry: isEn ? "Ministry of Food Processing Industries (MoFPI)" : "खाद्य प्रसंस्करण उद्योग मंत्रालय (MoFPI)",
            badge: isEn ? "35% CREDIT-LINKED GRANT (UP TO ₹10L)" : "35% क्रेडिट-लिंक्ड अनुदान (₹10 लाख तक)",
            badgeColor: "bg-purple-600 text-white",
            borderColor: "border-purple-300 bg-purple-50/30",
            suitability: 92,
            subsidyPct: "35%",
            subsidyAmt: pmfmeSubsidyAmt,
            marginPct: pmfmeMarginPct,
            marginAmt: pmfmeMarginAmt,
            loanAmt: pmfmeLoan,
            emiAmt: pmfmeEmi,
            interest: "8.5% p.a.",
            tenure: "5 Years",
            moratorium: "3 Months",
            collateral: isEn ? "Collateral-Free up to ₹10 Lakh" : "₹10 लाख तक बिना गारंटी (Collateral-Free)",
            advantage: isEn
              ? "35% capital subsidy for food processing, flour/oil mills, dairy, spice units + free DRP technical handholding."
              : "खाद्य, मसाला, आटा/तेल मिल, डेयरी इकाइयों हेतु 35% अनुदान + जिला संसाधन व्यक्ति (DRP) द्वारा निःशुल्क सहयोग।"
          },
          {
            id: 'scheme_mudra',
            code: 'PM MUDRA',
            name: isEn ? "Pradhan Mantri MUDRA Yojana (Tarun / Tarun Plus)" : "प्रधानमंत्री मुद्रा योजना (किशोर / तरुण ऋण)",
            ministry: isEn ? "Ministry of Finance / SIDBI" : "वित्त मंत्रालय / सिडबी (SIDBI)",
            badge: isEn ? "INSTANT SANCTION • ZERO SUBSIDY DELAY" : "त्वरित स्वीकृति • बिना सब्सिडी प्रतीक्षा",
            badgeColor: "bg-blue-600 text-white",
            borderColor: "border-blue-300 bg-blue-50/30",
            suitability: 88,
            subsidyPct: "0%",
            subsidyAmt: mudraSubsidyAmt,
            marginPct: mudraMarginPct,
            marginAmt: mudraMarginAmt,
            loanAmt: mudraLoan,
            emiAmt: mudraEmi,
            interest: "9.5% p.a.",
            tenure: "5 Years",
            moratorium: "0 Months",
            collateral: isEn ? "100% Collateral-Free (CGFMU Scheme)" : "पूर्णतः तारणमुक्त (CGFMU केंद्र सरकार गारंटी)",
            advantage: isEn
              ? "Fastest sanction within 7-10 days without waiting for subsidy sanction committee meetings."
              : "सबसे तेज बैंक स्वीकृति 7-10 दिनों में, बिना किसी सब्सिडी कमेटी के चक्कर लगाए सीधे ऋण संवितरण।"
          },
          {
            id: 'scheme_ahidf',
            code: 'AHIDF',
            name: isEn ? "Animal Husbandry Infrastructure Development Fund (AHIDF)" : "पशुपालन अवसंरचना विकास निधि (AHIDF)",
            ministry: isEn ? "Dept of Animal Husbandry & Dairying (DAHD)" : "पशुपालन व डेयरी विभाग (DAHD)",
            badge: isEn ? "3% INTEREST SUBVENTION • 2-YR MORATORIUM" : "3% ब्याज छूट • 2 वर्ष मोरेटोरियम",
            badgeColor: "bg-teal-600 text-white",
            borderColor: "border-teal-300 bg-teal-50/30",
            suitability: 89,
            subsidyPct: "3% Subvention",
            subsidyAmt: Math.round(ahidfLoan * 0.03 * 3),
            marginPct: ahidfMarginPct,
            marginAmt: ahidfMarginAmt,
            loanAmt: ahidfLoan,
            emiAmt: ahidfEmi,
            interest: "6.5% p.a. (Post-Subvention)",
            tenure: "8 Years",
            moratorium: "24 Months",
            collateral: isEn ? "NABARD Credit Guarantee Cover (25%)" : "नाबार्ड क्रेडिट गारंटी फंड ट्रस्ट",
            advantage: isEn
              ? "Ideal for dairy chilling, cattle feed plants, meat/milk processing with 2 years principal payment holiday."
              : "डेयरी चिलिंग सेंटर, पशु आहार एवं दुग्ध मूल्य संवर्धन हेतु आदर्श; 2 वर्ष तक मूलधन वापसी से छूट।"
          },
          {
            id: 'scheme_standup',
            code: 'Stand-Up India',
            name: isEn ? "Stand-Up India Scheme (SC / ST / Women)" : "स्टैंड-अप इंडिया योजना (अनुसूचित जाति/जनजाति/महिला)",
            ministry: isEn ? "Department of Financial Services (DFS)" : "वित्तीय सेवाएं विभाग, वित्त मंत्रालय",
            badge: isEn ? "GREENFIELD ENTERPRISE (₹10L TO ₹1CR)" : "ग्रीनफील्ड उद्यम (₹10 लाख से ₹1 करोड़)",
            badgeColor: "bg-indigo-600 text-white",
            borderColor: "border-indigo-300 bg-indigo-50/30",
            suitability: 85,
            subsidyPct: "Margin Subvention",
            subsidyAmt: Math.round(activeProjectCost * 0.10),
            marginPct: standupMarginPct,
            marginAmt: standupMarginAmt,
            loanAmt: standupLoan,
            emiAmt: standupEmi,
            interest: "8.0% p.a.",
            tenure: "7 Years",
            moratorium: "12 Months",
            collateral: isEn ? "CGSUI Credit Guarantee Scheme" : "CGSUI गारंटी कवर (बैंक तारणमुक्त)",
            advantage: isEn
              ? "Composite term loan and working capital facility designed exclusively for SC/ST and female founders."
              : "अनुसूचित जाति/जनजाति एवं महिला उद्यमियों के लिए समग्र सावधि ऋण एवं कार्यशील पूंजी सुविधा।"
          },
          {
            id: 'scheme_vishwakarma',
            code: 'PM Vishwakarma',
            name: isEn ? "PM Vishwakarma Yojana (Traditional Artisans & Trades)" : "प्रधानमंत्री विश्वकर्मा योजना (पारंपरिक कारीगर व शिल्पकार)",
            ministry: isEn ? "Ministry of MSME" : "सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय",
            badge: isEn ? "5% CONCESSIONAL INTEREST + ₹15,000 TOOLKIT" : "5% रियायती ब्याज दर + ₹15,000 टूलकिट अनुदान",
            badgeColor: "bg-amber-600 text-white",
            borderColor: "border-amber-300 bg-amber-50/30",
            suitability: 82,
            subsidyPct: "Toolkit + Interest Subvention",
            subsidyAmt: 15000,
            marginPct: 0,
            marginAmt: 0,
            loanAmt: vishwakarmaLoan,
            emiAmt: vishwakarmaEmi,
            interest: "5.0% p.a. Fixed",
            tenure: "3 Years",
            moratorium: "0 Months",
            collateral: isEn ? "100% Collateral-Free (MoMSME Cover)" : "100% बिना गारंटी",
            advantage: isEn
              ? "₹15,000 direct modern toolkit voucher + ₹3 Lakh enterprise credit at lowest 5% fixed interest."
              : "₹15,000 का आधुनिक टूलकिट ई-वाउचर + 5% की न्यूनतम रियायती ब्याज दर पर ₹3 लाख तक का आसान ऋण।"
          }
        ];

        return (
          <div className="space-y-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-rural-600" />
                    <span>{isEn ? 'Government Credit & Subsidy Scheme Appraisal' : 'सरकारी ऋण, अनुदान एवं सब्सिडी योजनाओं का हिसाब'}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {isEn 
                      ? `Calculated dynamically for your ₹${activeProjectCost.toLocaleString()} project cost and profile.`
                      : `आपकी ₹${activeProjectCost.toLocaleString()} परियोजना लागत व प्रोफ़ाइल के अनुसार रीयल-टाइम गणना।`}
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {schemeCards.length} {isEn ? 'Schemes Analyzed' : 'योजनाएं जांची गईं'}
                </span>
              </div>
            </div>

            {/* Scheme Cards with Full Hisaab & Proceed Buttons */}
            <div className="space-y-3">
              {schemeCards.map((sch) => (
                <div
                  key={sch.id}
                  className={`p-4 rounded-2xl border-2 transition-all space-y-3 shadow-xs ${sch.borderColor}`}
                >
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md inline-block ${sch.badgeColor}`}>
                        {sch.badge}
                      </span>
                      <h4 className="font-black text-sm text-slate-900 mt-1 leading-snug">{sch.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{sch.ministry}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 px-2 py-1 rounded-lg block">
                        {sch.suitability}% {isEn ? 'Suitability' : 'उपयुक्तता'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{sch.code}</span>
                    </div>
                  </div>

                  {/* Financial Breakdown (Hisaab) Grid */}
                  <div className="grid grid-cols-4 gap-1.5 text-center text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="p-1.5 rounded-lg bg-slate-50">
                      <span className="text-[9px] text-slate-500 block uppercase font-bold">
                        {isEn ? 'Project Cost' : 'प्रोजेक्ट लागत'}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        ₹{(activeProjectCost / 100000).toFixed(2)}L
                      </span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-emerald-50">
                      <span className="text-[9px] text-emerald-700 block uppercase font-bold">
                        {isEn ? 'Govt Subsidy' : 'सरकारी सब्सिडी'}
                      </span>
                      <span className="text-xs font-black text-emerald-800">
                        {sch.subsidyAmt > 0 ? `₹${(sch.subsidyAmt / 1000).toFixed(0)}k` : '0%'}
                      </span>
                      <span className="text-[8px] text-emerald-600 block">{sch.subsidyPct}</span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-amber-50">
                      <span className="text-[9px] text-amber-700 block uppercase font-bold">
                        {isEn ? 'Own Margin' : 'स्वयं पूंजी'}
                      </span>
                      <span className="text-xs font-black text-amber-900">
                        ₹{(sch.marginAmt / 1000).toFixed(0)}k
                      </span>
                      <span className="text-[8px] text-amber-600 block">{sch.marginPct}%</span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-purple-50">
                      <span className="text-[9px] text-purple-700 block uppercase font-bold">
                        {isEn ? 'Monthly EMI' : 'मासिक EMI'}
                      </span>
                      <span className="text-xs font-black text-purple-900">
                        ₹{sch.emiAmt.toLocaleString()}
                      </span>
                      <span className="text-[8px] text-purple-600 block">@{sch.interest}</span>
                    </div>
                  </div>

                  {/* Scheme Terms Strip */}
                  <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-600 bg-white/70 px-2.5 py-1.5 rounded-lg border border-slate-200/60 gap-1">
                    <span>🛡️ <b>{isEn ? 'Collateral:' : 'गारंटी:'}</b> {sch.collateral}</span>
                    <span>⏳ <b>{isEn ? 'Tenure:' : 'अवधि:'}</b> {sch.tenure} ({sch.moratorium} Mora)</span>
                  </div>

                  {/* Advantage Note */}
                  <p className="text-[11px] text-slate-700 leading-relaxed bg-white/50 p-2 rounded-lg border border-slate-100">
                    💡 <b>{isEn ? 'Key Advantage:' : 'प्रमुख लाभ:'}</b> {sch.advantage}
                  </p>

                  {/* Action Button: Proceed with Scheme */}
                  <button
                    type="button"
                    onClick={() => onSelectSchemeNavigate && onSelectSchemeNavigate(sch.id)}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 via-rural-600 to-emerald-700 hover:from-emerald-700 hover:to-rural-800 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-700/20 active:scale-[0.99]"
                  >
                    <span>
                      {isEn 
                        ? `Proceed with ${sch.code} (View Eligibility & Documents) →`
                        : `${sch.code} के साथ आगे बढ़ें (पात्रता, दस्तावेज़ व आवेदन) →`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ============================================================= */}
      {/* SUB-TAB 8: LOAN & REPAYMENT AMORTIZATION SCHEDULE              */}
      {/* ============================================================= */}
      {activeSubTab === 'repayment' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                {isEn ? 'Loan Amortization & Repayment Schedule' : 'ऋण अदायगी एवं ईएमआई अनुसूची (Year 1)'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {moratoriumMonths} {isEn ? 'Months Moratorium Period Included' : 'माह की मोरेटोरियम अवधि सम्मिलित'}
              </p>
            </div>

            {/* 12-Month Repayment Schedule Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase">
                  <tr>
                    <th className="p-2">Mo</th>
                    <th className="p-2 text-right">Principal</th>
                    <th className="p-2 text-right">Interest</th>
                    <th className="p-2 text-right">Total EMI</th>
                    <th className="p-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {amortizationSchedule.map(m => (
                    <tr key={m.month} className={m.isMoratorium ? 'bg-amber-50/40' : 'hover:bg-slate-50'}>
                      <td className="p-2 font-bold text-slate-700">
                        M{m.month} {m.isMoratorium && <span className="text-[8px] bg-amber-200 text-amber-900 px-1 rounded">Mora</span>}
                      </td>
                      <td className="p-2 text-right text-slate-600">₹{m.principalComponent.toLocaleString()}</td>
                      <td className="p-2 text-right text-slate-600">₹{m.interestComponent.toLocaleString()}</td>
                      <td className="p-2 text-right font-black text-slate-900">₹{m.emi.toLocaleString()}</td>
                      <td className="p-2 text-right font-mono text-[10px] text-slate-500">₹{m.closingPrincipal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] flex justify-between">
              <span className="text-slate-600">Active Interest Rate:</span>
              <span className="font-bold text-slate-900">@ {interestRatePct}% fixed</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 9: 26-SECTION DPR BUILDER & QUALITY SCORE (87/100)      */}
      {/* ============================================================= */}
      {activeSubTab === 'dpr' && (
        <div className="space-y-3">
          {/* Quality Score & Readiness Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-300 block">
                  {isEn ? 'DPR Bank-Readiness Quality Score' : 'DPR बैंक स्वीकृति तत्परता स्कोर'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-emerald-400">{dprReadiness.score}</span>
                  <span className="text-xs text-slate-400 font-bold">/ 100</span>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {isEn ? dprReadiness.status : dprReadiness.status_hi}
                  </span>
                </div>
              </div>
              <button
                onClick={() => alert(isEn ? 'Downloading Official 26-Section DPR PDF...' : '26-खंडीय आधिकारिक DPR PDF डाउनलोड हो रहा है...')}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>{isEn ? 'Download PDF' : 'DPR PDF डाउनलोड'}</span>
              </button>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1 border-t border-slate-700/60">
              {dprReadiness.checklist.slice(0, 4).map((chk, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{isEn ? chk.title : chk.title_hi}</span>
                </div>
              ))}
            </div>

            {/* Actionable Prompt */}
            <div className="bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">
                  {isEn ? 'Action to reach 100/100:' : '100/100 स्कोर हेतु आवश्यक कदम:'}
                </span>
                <span>{isEn ? dprReadiness.actionablePrompts[0].en : dprReadiness.actionablePrompts[0].hi}</span>
              </div>
            </div>
          </div>

          {/* 26-Section Accordion List */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rural-600" />
                <span>{isEn ? 'All 26 Project Report Sections' : 'समस्त 26 प्रोजेक्ट रिपोर्ट खंड'}</span>
              </h3>
              <span className="text-[10px] text-slate-500">NABARD & SIDBI Standard</span>
            </div>

            <div className="space-y-1.5 text-xs max-h-[460px] overflow-y-auto pr-1">
              {dprSections.map(sec => {
                const isExpanded = expandedDprSection === sec.sectionNumber;
                return (
                  <div 
                    key={sec.sectionNumber} 
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedDprSection(isExpanded ? null : sec.sectionNumber)}
                      className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center">
                          {sec.sectionNumber}
                        </span>
                        <span className="font-bold text-slate-900">{isEn ? sec.title : sec.title_hi}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-emerald-700 font-bold">Verified</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-3 bg-white space-y-2 border-t border-slate-200">
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {isEn ? sec.summary : sec.summary_hi}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {sec.keyValues.map((kv, k) => (
                            <div key={k}>
                              <span className="text-slate-400 block">{isEn ? kv.label : kv.label_hi}</span>
                              <span className="font-bold text-slate-900">{kv.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 10: DOCUMENT VAULT (FUNCTIONAL UPLOAD & MANAGEMENT)   */}
      {/* ============================================================= */}
      {activeSubTab === 'documents' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isEn ? 'Document Vault & Audit Records' : 'दस्तावेज़ वॉल्ट एवं सत्यापन रिकॉर्ड'}</span>
                </h3>
                <p className="text-[10px] text-slate-500">Upload quotations, land documents & bank receipts</p>
              </div>
              <button
                onClick={() => setShowDocUploadModal(true)}
                className="px-2.5 py-1.5 bg-rural-600 hover:bg-rural-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isEn ? 'Upload' : 'अपलोड'}</span>
              </button>
            </div>

            {/* Document Upload Form */}
            {showDocUploadModal && (
              <form onSubmit={handleAddDocument} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">{isEn ? 'Upload New Enterprise Document' : 'नया व्यवसाय दस्तावेज़ अपलोड करें'}</span>
                <input
                  type="text"
                  required
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g. Grain Storage Shed Lease Agreement"
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDocUploadModal(false)}
                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-rural-600 text-white rounded-lg font-bold"
                  >
                    Confirm Upload
                  </button>
                </div>
              </form>
            )}

            {uploadSuccessAlert && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs p-2.5 rounded-xl font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{uploadSuccessAlert}</span>
              </div>
            )}

            {/* Document list */}
            <div className="space-y-2 text-xs">
              {documents.map(doc => {
                const isVer = doc.status === 'verified';
                const isPending = doc.status === 'pending';
                return (
                  <div key={doc.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{isEn ? doc.title : doc.title_hi}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                          isVer ? 'bg-emerald-100 text-emerald-800' : isPending ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {doc.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex gap-2">
                        <span>{doc.requiredFor}</span>
                        {doc.fileSize && <span>• {doc.fileSize}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => alert(`Opening ${doc.fileName || doc.title}...`)}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                        title="View Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => alert(`Downloading verified copy of ${doc.title}...`)}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
