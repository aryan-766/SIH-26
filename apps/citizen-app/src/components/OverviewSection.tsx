import React, { useState } from 'react';
import { 
  TrendingUp, Award, DollarSign, Wallet, Calendar, ShieldCheck, 
  CheckCircle2, Clock, Circle, ArrowRight, MapPin, Building,
  Layers, AlertTriangle, Sparkles, Store, Compass, FileText,
  Landmark, UserCheck, ChevronRight, BarChart3, PieChart, Users,
  Package, Info, Eye, ExternalLink, RefreshCw, Bot
} from 'lucide-react';
import { BeneficiaryProfile } from '../services/enterpriseStore';
import { Language } from '../locales';

interface OverviewSectionProps {
  userProfile: BeneficiaryProfile;
  lang: Language;
  onNavigateToTab: (tabId: string) => void;
  onOpenAdvisorChat: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  userProfile,
  lang,
  onNavigateToTab,
  onOpenAdvisorChat
}) => {
  const isEn = lang === 'en';
  const isMr = lang === 'mr';
  const isTa = lang === 'ta';

  // Perspective toggle: 'user' | 'officer_aggregate'
  const [viewPerspective, setViewPerspective] = useState<'user' | 'officer_aggregate'>('user');

  // Selected GIS cluster filter for interactive map
  const [activeMapLayer, setActiveMapLayer] = useState<'all' | 'competitors' | 'customers' | 'suppliers' | 'institutions'>('all');

  // 10-Stage Business Journey definition
  const journeyStages = [
    { id: 'discover', title: isEn ? 'Discover' : isMr ? 'शोध' : isTa ? 'கண்டுபிடி' : 'खोज', status: 'completed' },
    { id: 'compare', title: isEn ? 'Compare' : isMr ? 'तुलना' : isTa ? 'ஒப்பிடு' : 'तुलना', status: 'completed' },
    { id: 'select', title: isEn ? 'Select' : isMr ? 'निवड' : isTa ? 'தேர்ந்தெடு' : 'चयन', status: 'completed' },
    { id: 'dpr', title: isEn ? 'DPR' : isMr ? 'डीपीआर' : isTa ? 'டிபிஆர்' : 'DPR', status: 'completed' },
    { id: 'scheme', title: isEn ? 'Scheme' : isMr ? 'योजना' : isTa ? 'திட்டம்' : 'योजना', status: 'completed' },
    { id: 'loan', title: isEn ? 'Loan' : isMr ? 'कर्ज' : isTa ? 'கடன்' : 'ऋण', status: 'in_progress' },
    { id: 'launch', title: isEn ? 'Launch' : isMr ? 'सुरुवात' : isTa ? 'துவக்கம்' : 'शुरुआत', status: 'pending' },
    { id: 'operate', title: isEn ? 'Operate' : isMr ? 'संचालन' : isTa ? 'இயக்கு' : 'संचालन', status: 'pending' },
    { id: 'repay', title: isEn ? 'Repay' : isMr ? 'परतफेड' : isTa ? 'திருப்பிச் செலுத்து' : 'अदायगी', status: 'pending' },
    { id: 'grow', title: isEn ? 'Grow' : isMr ? 'विस्तार' : isTa ? 'வளர்ச்சி' : 'विस्तार', status: 'pending' },
  ];

  // Map cluster points
  const mapEntities = [
    { id: 'm_1', name: 'Parag Chilling Plant (Procurement)', type: 'institutions', dist: '2.1 km', color: 'bg-blue-500' },
    { id: 'm_2', name: 'Sahjanwa Sweet Maker Cluster (B2B Buyers)', type: 'customers', dist: '3.4 km', color: 'bg-emerald-500' },
    { id: 'm_3', name: 'Verma Fodder & Feed Depot', type: 'suppliers', dist: '1.2 km', color: 'bg-amber-500' },
    { id: 'm_4', name: 'Local Informal Cattle Shed', type: 'competitors', dist: '3.8 km', color: 'bg-rose-500' },
    { id: 'm_5', name: 'State Bank of India (Lead Bank)', type: 'institutions', dist: '2.5 km', color: 'bg-purple-500' },
    { id: 'm_6', name: 'Government Veterinary Hospital', type: 'institutions', dist: '1.8 km', color: 'bg-indigo-500' },
  ];

  const filteredMapEntities = activeMapLayer === 'all' 
    ? mapEntities 
    : mapEntities.filter(e => e.type === activeMapLayer);

  return (
    <div className="space-y-4 pb-6">
      {/* ------------------------------------------------------------- */}
      {/* VIEW PERSPECTIVE SWITCHER (Entrepreneur vs Officer Aggregate) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setViewPerspective('user')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            viewPerspective === 'user' 
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-rural-600" />
          <span>{isEn ? 'Entrepreneur Overview' : isMr ? 'उद्योजक विहंगावलोकन' : isTa ? 'தொழில்முனைவோர் சுருக்கம்' : 'उद्यमी डैशबोर्ड'}</span>
        </button>
        <button
          onClick={() => setViewPerspective('officer_aggregate')}
          className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            viewPerspective === 'officer_aggregate' 
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
          <span>{isEn ? 'Panchayat Officer Rollup' : isMr ? 'पंचायत अधिकारी रोलअप' : isTa ? 'பஞ்சாயத்து அதிகாரி பார்வை' : 'पंचायत स्तर कुल डेटा'}</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. SECTION A: TOP SUMMARY CARDS                               */}
      {/* ------------------------------------------------------------- */}
      {viewPerspective === 'user' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-rural-600" />
              <span>{isEn ? 'Enterprise Performance Summary' : isMr ? 'उद्यम कामगिरी सारांश' : isTa ? 'வணிகச் செயல்திறன் சுருக்கம்' : 'उद्यम प्रमुख वित्तीय सारांश'}</span>
            </h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{isEn ? 'Repayment Health: Good' : isMr ? 'कर्ज परतफेड: उत्तम' : isTa ? 'கடன் நிலை: நன்று' : 'ऋण अदायगी स्थिति: उत्तम'}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Opportunity Score */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium">{isEn ? 'Opportunity Score' : isMr ? 'संधी गुण' : isTa ? 'வாய்ப்பு மதிப்பீடு' : 'व्यवसाय अवसर स्कोर'}</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">82</span>
                <span className="text-xs text-slate-400 font-bold">/ 100</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[82%]" />
              </div>
            </div>

            {/* Project Cost */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium">{isEn ? 'Project Cost' : isMr ? 'प्रकल्प खर्च' : isTa ? 'திட்ட செலவு' : 'कुल प्रोजेक्ट लागत'}</span>
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-black text-slate-900">₹4.80 L</div>
              <span className="text-[10px] text-slate-500 block mt-1">{isEn ? '70% Assets + 30% OPEX' : '70% स्थाई + 30% कार्यशील'}</span>
            </div>

            {/* Own Contribution */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium">{isEn ? 'Own Contribution' : isMr ? 'स्वतःचे योगदान' : isTa ? 'சொந்த பங்களிப்பு' : 'स्वयं का अंशदान'}</span>
                <Wallet className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-lg font-black text-slate-900">₹48,000</div>
              <span className="text-[10px] text-emerald-700 font-semibold">{isEn ? '10% Margin Money' : '10% मार्जिन राशि'}</span>
            </div>

            {/* Loan Required */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium">{isEn ? 'Loan Required' : isMr ? 'आवश्यक कर्ज' : isTa ? 'தேவையான கடன்' : 'बैंक ऋण आवश्यकता'}</span>
                <Landmark className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-lg font-black text-slate-900">₹4.32 L</div>
              <span className="text-[10px] text-purple-700 font-semibold">PMEGP 35% Subsidy</span>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium">{isEn ? 'Est. Monthly Revenue' : isMr ? 'मासिक उत्पन्न' : isTa ? 'மாதாந்திர வருவாய்' : 'अनुमानित मासिक आय'}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-lg font-black text-emerald-700">₹85,000</div>
              <span className="text-[10px] text-emerald-600">▲ +18.1% vs prev</span>
            </div>

            {/* Monthly Profit */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-medium">{isEn ? 'Est. Monthly Profit' : isMr ? 'मासिक नफा' : isTa ? 'மாதாந்திர லாபம்' : 'शुद्ध मासिक लाभ'}</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-lg font-black text-slate-900">₹18,500</div>
              <span className="text-[10px] text-slate-500">{isEn ? 'After EMI payment' : 'ईएमआई भुगतान पश्चात'}</span>
            </div>

            {/* Break-Even */}
            <div className="col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-3 rounded-2xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-300 block">{isEn ? 'Capital Payback Period' : 'पूंजी निवेश वसूली अवधि (Break-Even)'}</span>
                <div className="text-lg font-black text-white mt-0.5">14 Months ({isEn ? 'Break-even reached' : 'में पूर्ण वसूली'})</div>
                <span className="text-[10px] text-emerald-400">DSCR 2.14 • Highly Bankable Ratio</span>
              </div>
              <button
                onClick={() => onNavigateToTab('finance')}
                className="px-3 py-1.5 bg-rural-600 hover:bg-rural-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <span>{isEn ? 'View DPR' : 'DPR देखें'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Officer Aggregate Rollup View */
        <div className="space-y-2 bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-purple-900">
              {isEn ? 'Sahjanwa Block Enterprise Ledger' : 'सहजनवा ब्लॉक — समेकित उद्यम रजिस्टर'}
            </span>
            <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-full">
              42 Panchayats
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-purple-100">
              <span className="text-slate-500 text-[10px] block">{isEn ? 'Total Entrepreneurs' : 'कुल पंजीकृत उद्यमी'}</span>
              <span className="text-base font-black text-slate-900">124</span>
              <span className="text-[10px] text-emerald-600 block">▲ 12 added this week</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-purple-100">
              <span className="text-slate-500 text-[10px] block">{isEn ? 'Active Applications' : 'सक्रिय आवेदन'}</span>
              <span className="text-base font-black text-slate-900">48</span>
              <span className="text-[10px] text-purple-600 block">Under DIC Scrutiny</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-purple-100">
              <span className="text-slate-500 text-[10px] block">{isEn ? 'DPRs Generated' : 'तैयार डीपीआर (DPRs)'}</span>
              <span className="text-base font-black text-slate-900">76</span>
              <span className="text-[10px] text-blue-600 block">100% Deterministic</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-purple-100">
              <span className="text-slate-500 text-[10px] block">{isEn ? 'Sanctioned / Disbursed' : 'स्वीकृत / संवितरित ऋण'}</span>
              <span className="text-base font-black text-emerald-700">₹1.84 Cr</span>
              <span className="text-[10px] text-emerald-600 block">28 Enterprises</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-purple-100">
              <span className="text-slate-500 text-[10px] block">{isEn ? 'Businesses Launched' : 'संचालित ग्रामीण उद्यम'}</span>
              <span className="text-base font-black text-slate-900">22 Units</span>
              <span className="text-[10px] text-slate-500 block">Commercial stage</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-purple-100">
              <span className="text-slate-500 text-[10px] block">{isEn ? 'At-Risk Monitoring' : 'जोखिम निगरानी'}</span>
              <span className="text-base font-black text-rose-600">3 Units</span>
              <span className="text-[10px] text-rose-600 block">Raw fodder stress</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. SECTION B: BUSINESS JOURNEY / PROGRESS VISUAL TIMELINE     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-rural-600" />
              <span>{isEn ? 'Business Journey & Progress' : isMr ? 'व्यवसाय प्रवास व प्रगती' : isTa ? 'வணிகப் பயணம் & முன்னேற்றம்' : 'व्यवसाय यात्रा एवं प्रगति पथ'}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isEn ? 'Track each stage from discovery to sustainable growth' : 'खोज से लेकर निरंतर विस्तार तक प्रत्येक चरण की स्थिति'}
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
            Stage 6 / 10
          </span>
        </div>

        {/* Horizontal Visual Timeline */}
        <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
          <div className="flex items-center min-w-[580px] gap-1 relative">
            {journeyStages.map((stage, idx) => {
              const isDone = stage.status === 'completed';
              const isInProg = stage.status === 'in_progress';

              return (
                <React.Fragment key={stage.id}>
                  <div className="flex flex-col items-center text-center w-14">
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isDone 
                          ? 'bg-emerald-500 text-white shadow-xs' 
                          : isInProg 
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse' 
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isDone ? '✓' : isInProg ? '→' : '○'}
                    </div>
                    <span className={`text-[10px] font-bold mt-1 truncate w-full ${
                      isDone ? 'text-slate-900' : isInProg ? 'text-amber-700 font-black' : 'text-slate-400'
                    }`}>
                      {stage.title}
                    </span>
                  </div>
                  {idx < journeyStages.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-4 ${
                      isDone ? 'bg-emerald-400' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Active Stage Next Action Banner */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{isEn ? 'Current Action Needed:' : 'अगला आवश्यक कदम:'}</span>
            </span>
            <p className="text-xs font-bold text-amber-950">
              {isEn ? 'Submit DPR with Bank Application to State Bank of India' : 'स्टेट बैंक ऑफ इंडिया में DPR व PMEGP आवेदन पत्र जमा करें'}
            </p>
            <p className="text-[10px] text-amber-800">
              {isEn ? 'All 26 sections compiled. PMEGP subsidy token generated.' : '26-खंडीय रिपोर्ट तैयार है। 35% सब्सिडी हेतु बैंक अनुमोदन अपेक्षित।'}
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('finance')}
            className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 flex items-center gap-1"
          >
            <span>{isEn ? 'Open DPR' : 'DPR खोलें'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. SECTION C: BUSINESS SNAPSHOT                               */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rural-100 flex items-center justify-center text-rural-700 font-bold">
              🐄
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">
                {userProfile.selectedBizName || 'Dairy Farming & Bulk Milk Chilling Center'}
              </h3>
              <span className="text-[10px] text-slate-500">
                {userProfile.villageName}, {userProfile.blockName}, {userProfile.districtName}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-rural-100 text-rural-800 px-2 py-0.5 rounded-full">
            {userProfile.businessStatus || 'Operational'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">{isEn ? 'Catchment Area' : 'कार्यक्षेत्र (दायरा)'}</span>
            <span className="font-bold text-slate-800">5 – 10 km Radius</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">{isEn ? 'Target Customers' : 'लक्षित ग्राहक'}</span>
            <span className="font-bold text-slate-800">140+ Households & Sweet Makers</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">{isEn ? 'Key Products' : 'मुख्य उत्पाद/सेवा'}</span>
            <span className="font-bold text-slate-800">Fresh Chilled Milk, Paneer, Ghee</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">{isEn ? 'Local Demand / Competition' : 'स्थानीय मांग / प्रतिस्पर्धा'}</span>
            <span className="font-bold text-emerald-700">High Demand / 1 Competitor</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">{isEn ? 'Expected Margin' : 'प्रत्याशित लाभ मार्जिन'}</span>
            <span className="font-bold text-emerald-700">21.8% Net Surplus</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 text-[10px] block">{isEn ? 'Key Identified Risk' : 'पहचाना गया जोखिम'}</span>
            <span className="font-bold text-amber-700">Summer fodder price (+15%)</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. SECTION D: LOCAL MARKET SNAPSHOT + INTERACTIVE MAP         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>{isEn ? 'Local Market Feasibility Snapshot' : isMr ? 'स्थानिक बाजार व्यवहार्यता' : isTa ? 'உள்ளூர் சந்தை சாத்தியக்கூறு' : 'स्थानीय बाजार व्यवहार्यता मीटर'}</span>
            </h3>
            <p className="text-[10px] text-slate-500">Module 1 Geo-Intelligence Assessment</p>
          </div>
          <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            {userProfile.villageName}
          </span>
        </div>

        {/* Progress Meters */}
        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>{isEn ? 'Local Demand' : 'स्थानीय मांग (Local Demand)'}</span>
              <span className="text-emerald-700">High (85%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-[85%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>{isEn ? 'Competition Level' : 'प्रतिस्पर्धा स्तर (Competition)'}</span>
              <span className="text-amber-700">Medium (45%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full w-[45%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>{isEn ? 'Supply Access (Fodder/Reagents)' : 'कच्चा माल व चारा पहुंच'}</span>
              <span className="text-emerald-700">Good (80%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-[80%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>{isEn ? 'Purchasing Power' : 'क्रय शक्ति (Purchasing Power)'}</span>
              <span className="text-blue-700">Medium (60%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full w-[60%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>{isEn ? 'Location & Highway Fit' : 'स्थान व राजमार्ग संपर्क'}</span>
              <span className="text-emerald-700">Excellent (92%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full w-[92%]" />
            </div>
          </div>
        </div>

        {/* Interactive Cluster Map Area */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 text-white p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold flex items-center gap-1.5 text-emerald-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{isEn ? 'Interactive Cluster Radar (5km)' : 'इंटरैक्टिव क्लस्टर रडार (5 किमी)'}</span>
            </span>
            <div className="flex gap-1 text-[9px]">
              {(['all', 'competitors', 'customers', 'suppliers', 'institutions'] as const).map(layer => (
                <button
                  key={layer}
                  onClick={() => setActiveMapLayer(layer)}
                  className={`px-1.5 py-0.5 rounded capitalize ${
                    activeMapLayer === layer 
                      ? 'bg-rural-600 text-white font-bold' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          {/* Mini Visual Grid */}
          <div className="h-36 bg-slate-950 rounded-xl relative border border-slate-800 flex items-center justify-center overflow-hidden">
            {/* Radar concentric rings */}
            <div className="absolute w-28 h-28 rounded-full border border-slate-800 animate-pulse" />
            <div className="absolute w-20 h-20 rounded-full border border-slate-700" />
            <div className="absolute w-10 h-10 rounded-full border border-slate-600" />

            {/* Center: My Enterprise */}
            <div className="absolute z-10 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30 flex items-center justify-center text-[8px] font-black text-slate-950">
              ●
            </div>

            {/* Entity markers */}
            {filteredMapEntities.map((ent, i) => {
              const angles = [30, 110, 210, 290, 70, 170];
              const radii = [45, 55, 38, 52, 48, 35];
              const rad = (angles[i % angles.length] * Math.PI) / 180;
              const r = radii[i % radii.length];
              const top = 50 + r * Math.sin(rad) * 0.45;
              const left = 50 + r * Math.cos(rad) * 0.7;

              return (
                <div
                  key={ent.id}
                  style={{ top: `${top}%`, left: `${left}%` }}
                  title={`${ent.name} (${ent.dist})`}
                  className={`absolute w-3 h-3 rounded-full ${ent.color} ring-2 ring-white/20 cursor-pointer hover:scale-125 transition-transform`}
                />
              );
            })}

            <div className="absolute bottom-1 right-2 text-[9px] text-slate-400">
              Center: {userProfile.villageName}
            </div>
          </div>

          {/* Map List Details */}
          <div className="space-y-1 text-[11px] max-h-24 overflow-y-auto pr-1">
            {filteredMapEntities.map(ent => (
              <div key={ent.id} className="flex items-center justify-between py-0.5 border-b border-slate-800/60">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className={`w-2 h-2 rounded-full ${ent.color}`} />
                  <span className="truncate max-w-[200px]">{ent.name}</span>
                </span>
                <span className="text-slate-400 font-mono text-[10px]">{ent.dist}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. SECTION E: BUSINESS HEALTH (MODULE 3)                      */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? 'Business Health Metrics' : isMr ? 'व्यवसाय आरोग्य मेट्रिक्स' : isTa ? 'வணிக சுகாதார அளவீடுகள்' : 'व्यवसाय स्वास्थ्य एवं संचालन स्थिति'}</span>
          </h3>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Live Copilot Sync
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Revenue */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-500 font-bold text-[10px] block">{isEn ? 'Monthly Revenue' : 'मासिक राजस्व (Revenue)'}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-black text-slate-900">₹85,000</span>
              <span className="text-[10px] font-bold text-emerald-700">▲ +18.1%</span>
            </div>
            <span className="text-[10px] text-slate-400 block">{isEn ? 'Last Month: ₹72,000' : 'गत माह: ₹72,000'}</span>
          </div>

          {/* Expenses */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-500 font-bold text-[10px] block">{isEn ? 'Operating Expenses' : 'संचालन व्यय (OPEX)'}</span>
            <div className="text-sm font-black text-slate-900">₹66,500</div>
            <span className="text-[10px] text-slate-500 block">Fixed ₹24k • Variable ₹42.5k</span>
          </div>

          {/* Profit Split */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-500 font-bold text-[10px] block">{isEn ? 'Gross vs Net Profit' : 'सकल बनाम शुद्ध लाभ'}</span>
            <div className="text-sm font-black text-emerald-700">₹18,500 Net</div>
            <span className="text-[10px] text-slate-500 block">Gross Profit: ₹42,500 (50%)</span>
          </div>

          {/* Inventory Health */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-500 font-bold text-[10px] block flex items-center justify-between">
              <span>{isEn ? 'Stock & Inventory' : 'स्टॉक एवं इन्वेंटरी'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </span>
            <div className="text-sm font-black text-slate-900">240L Chilled</div>
            <span className="text-[10px] text-amber-700 font-bold block">Fodder stock: 4 days buffer</span>
          </div>
        </div>

        {/* Customers Segments */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-500 block">{isEn ? 'Active Customer Base' : 'सक्रिय ग्राहक नेटवर्क'}</span>
            <span className="text-sm font-black text-slate-900">180 Regular Buyers</span>
          </div>
          <div className="text-right text-[11px]">
            <span className="font-bold text-slate-800 block">38 New • 142 Returning</span>
            <span className="text-[10px] text-emerald-700 font-bold">78.8% Repeat Retention</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. SECTION F: AI RECOMMENDATIONS & BUSINESS ADVISOR           */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-br from-emerald-950 to-rural-900 text-white p-4 rounded-2xl shadow-sm space-y-3 border border-emerald-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-emerald-300" />
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-100">
              {isEn ? 'AI Business Advisor & Action Plan' : isMr ? 'एआय व्यवसाय सल्लागार' : isTa ? 'AI வணிக ஆலோசகர்' : 'AI बिजनेस एडवाइजर — सक्रिय परामर्श'}
            </h3>
          </div>
          <button
            onClick={onOpenAdvisorChat}
            className="text-[10px] bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-2 py-1 rounded-lg font-bold transition flex items-center gap-1"
          >
            <span>{isEn ? 'Ask AI' : 'चैट करें'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Recommendation Card 1: Margin Analysis */}
        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs space-y-1.5 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{isEn ? 'Pricing & Margin Action Alert:' : 'मार्जिन संतुलन एवं मूल्य समायोजन अलर्ट:'}</span>
          </div>
          <p className="text-xs text-emerald-50 leading-relaxed">
            {isEn 
              ? 'Your sales increased 18% this month, but raw-material cost increased 11%. Your estimated margin has fallen from 24% to 21%.'
              : 'इस माह आपकी कुल बिक्री में 18% की वृद्धि हुई, परंतु सूखे चारे के मूल्य में 11% वृद्धि होने से आपका शुद्ध मार्जिन 24% से घटकर 21% हो गया है।'}
          </p>
          <div className="bg-emerald-900/60 p-2 rounded-lg text-[11px] text-emerald-200 border border-emerald-700/50">
            <b>{isEn ? 'Recommended Action:' : 'सुझाया गया कदम:'}</b>{' '}
            {isEn 
              ? 'Review supplier pricing and consider a ₹5–₹10 price adjustment on Product A (Fresh Packaged Milk).'
              : 'सहजनवा चारा मंडी से थोक दर अनुबंध की समीक्षा करें तथा दुग्ध आपूर्ति पर ₹2/लीटर मूल्य समायोजन करें।'}
          </div>
        </div>

        {/* Recommendation Card 2: Debt Reserve Warning */}
        <div className="bg-amber-950/40 p-3 rounded-xl backdrop-blur-xs space-y-1.5 border border-amber-500/30">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Loan Repayment Reserve Buffer Notice:' : 'ऋण अदायगी रिज़र्व बफर चेतावनी:'}</span>
          </div>
          <p className="text-xs text-amber-100 leading-relaxed">
            {isEn
              ? 'Your next scheduled loan EMI repayment is ₹6,850 and projected cash balance may fall below your recommended reserve buffer.'
              : 'आपकी अगली बैंक ईएमआई ₹6,850 देय है और माह के अंत में कार्यशील नकदी आपके अनुशंसित सुरक्षा रिज़र्व से कम हो सकती है।'}
          </p>
          <div className="bg-amber-900/60 p-2 rounded-lg text-[11px] text-amber-200 border border-amber-700/50">
            <b>{isEn ? 'Required Action:' : 'आवश्यक कदम:'}</b>{' '}
            {isEn
              ? 'Maintain a minimum ₹12,000 repayment reserve in your current account prior to the 10th of this month.'
              : 'इस माह की 10 तारीख से पूर्व अपने चालू खाते में कम से कम ₹12,000 का सुरक्षित ईएमआई बफर बनाए रखें।'}
          </div>
        </div>
      </div>
    </div>
  );
};
