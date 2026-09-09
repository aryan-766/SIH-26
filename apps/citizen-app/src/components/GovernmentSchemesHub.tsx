import React, { useState } from 'react';
import { 
  Landmark, Search, ShieldCheck, CheckCircle2, FileText, ChevronDown, 
  ChevronUp, ExternalLink, Sparkles, Filter, AlertCircle, ArrowRight, 
  Layers, Check, HelpCircle
} from 'lucide-react';
import { 
  PAN_INDIA_GOV_SCHEMES, 
  GovScheme, 
  getFilteredSchemes 
} from '../services/panIndiaSchemesData';
import { Language } from '../locales';
import { BeneficiaryProfile } from '../services/enterpriseStore';

interface GovernmentSchemesHubProps {
  lang: Language;
  userProfile: BeneficiaryProfile;
  onSelectSchemeForDpr: (scheme: GovScheme) => void;
}

export function GovernmentSchemesHub({ 
  lang, 
  userProfile, 
  onSelectSchemeForDpr 
}: GovernmentSchemesHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>('scheme_pmegp');
  const [activeDetailTab, setActiveDetailTab] = useState<Record<string, 'eligibility' | 'documents' | 'process'>>({});

  const schemes = getFilteredSchemes(selectedCategory, searchQuery, lang);

  const getTab = (schemeId: string) => activeDetailTab[schemeId] || 'eligibility';
  const setTab = (schemeId: string, tab: 'eligibility' | 'documents' | 'process') => {
    setActiveDetailTab(prev => ({ ...prev, [schemeId]: tab }));
  };

  const getLocalized = (obj: any) => {
    return obj[lang] || obj.hi || obj.en;
  };

  // User suitability matching score calculation
  const getSuitability = (scheme: GovScheme) => {
    let score = 85;
    const biz = (userProfile.selectedBizName || '').toLowerCase();
    const sectorMatch = scheme.targetSectors.some(s => biz.includes(s.toLowerCase()));
    if (sectorMatch) score += 10;
    if (scheme.collateralFree) score += 4;
    return Math.min(99, score);
  };

  const i18nUI = {
    title: {
      hi: 'सरकारी योजनाएं एवं सब्सिडी पोर्टल',
      en: 'Government Schemes & Subsidy Portal',
      mr: 'शासकीय योजना व सबसिडी पोर्टल',
      ta: 'அரசு திட்டங்கள் மற்றும் மானிய போர்டல்'
    },
    subtitle: {
      hi: 'भारत सरकार एवं राज्य की समस्त 10+ योजनाएं सभी नागरिकों हेतु खुली हैं। पूरी पात्रता, दस्तावेज़ व सीधे पोर्टल लिंक देखें।',
      en: 'All 10+ flagship Central & State schemes open and visible to all citizens. View eligibility, documents & direct portals.',
      mr: 'केंद्र व राज्य शासनाच्या सर्व 10+ योजना सर्व नागरिकांसाठी खुल्या आहेत. संपूर्ण पात्रता, कागदपत्रे व पोर्टल पहा.',
      ta: 'அனைத்து 10+ மத்திய மற்றும் மாநில அரசு திட்டங்களும் அனைத்து மக்களுக்கும் வெளிப்படையாக கிடைக்கும்.'
    },
    searchPlaceholder: {
      hi: 'योजना, मंत्रालय, व्यवसाय (डेयरी, आटा चक्की, सोलर) खोजें...',
      en: 'Search schemes, ministry, sector (Dairy, Flour Mill, Solar)...',
      mr: 'योजना, मंत्रालय किंवा व्यवसाय शोधा...',
      ta: 'திட்டம், அமைச்சகம், தொழில்களைத் தேடவும்...'
    },
    filterAll: { hi: 'सभी योजनाएं (10)', en: 'All Schemes (10)', mr: 'सर्व योजना (10)', ta: 'அனைத்து திட்டங்கள் (10)' },
    filterSubsidy: { hi: '💰 सब्सिडी युक्त (Grant)', en: '💰 With Subsidy', mr: '💰 सबसिडीयुक्त', ta: '💰 மானியத்துடன்' },
    filterCollateralFree: { hi: '🛡️ बिना गारंटी (Collateral-Free)', en: '🛡️ Collateral-Free', mr: '🛡️ तारणमुक्त', ta: '🛡️ பிணையில்லா கடன்' },
    filterAgro: { hi: '🌾 खाद्य व कृषि (PMFME/AIF)', en: '🌾 Food & Agro', mr: '🌾 अन्न व कृषी', ta: '🌾 உணவு & வேளாண்' },
    filterLivestock: { hi: '🐄 पशुपालन व मत्स्य (NLM/KCC)', en: '🐄 Livestock & Fish', mr: '🐄 पशुसंवर्धन', ta: '🐄 கால்நடை & மீன்' },
    filterArtisans: { hi: '🛠️ कारीगर व विश्वकर्मा', en: '🛠️ Artisans & Crafts', mr: '🛠️ कारागीर योजना', ta: '🛠️ கைவினைஞர்கள்' },
    filterWomen: { hi: '👩 महिला व समूह (Lakhpati)', en: '👩 Women & SHGs', mr: '👩 महिला बचत गट', ta: '👩 மகளிர் குழு' },
    tabEligibility: { hi: '📋 पात्रता शर्तें', en: '📋 Eligibility', mr: '📋 पात्रता अटी', ta: '📋 தகுதி வரம்புகள்' },
    tabDocs: { hi: '📄 आवश्यक दस्तावेज़', en: '📄 Required Docs', mr: '📄 आवश्यक कागदपत्रे', ta: '📄 தேவையான ஆவணங்கள்' },
    tabProcess: { hi: '⚡ आवेदन प्रक्रिया', en: '⚡ How to Apply', mr: '⚡ अर्ज प्रक्रिया', ta: '⚡ விண்ணப்பிக்கும் முறை' },
    applyOnline: { hi: 'आधिकारिक सरकारी पोर्टल पर जाएं', en: 'Visit Official Govt Portal', mr: 'अधिकृत पोर्टलवर जा', ta: 'அதிகாரப்பூர்வ இணையதளம்' },
    createDpr: { hi: 'इस योजना हेतु DPR बनाएं', en: 'Generate DPR for this Scheme', mr: 'या योजनेसाठी DPR बनवा', ta: 'DPR அறிக்கை உருவாக்கவும்' },
    collateralBadge: { hi: 'बिना गारंटी', en: 'No Collateral', mr: 'तारणमुक्त', ta: 'பிணையில்லா கடன்' },
    maxLimit: { hi: 'अधिकतम ऋण सीमा:', en: 'Max Loan Limit:', mr: 'कमाल कर्ज मर्यादा:', ta: 'அதிகபட்ச கடன் வரம்பு:' },
    subsidyBenefit: { hi: 'सरकारी सब्सिडी:', en: 'Government Subsidy:', mr: 'शासकीय सबसिडी:', ta: 'அரசு மானியம்:' },
    interestTitle: { hi: 'ब्याज दर:', en: 'Interest Rate:', mr: 'व्याजदर:', ta: 'வட்டி விகிதம்:' },
    suitabilityBadge: { hi: 'आपकी प्रोफ़ाइल से उपयुक्तता:', en: 'Profile Match Score:', mr: 'प्रोफाइल सुसंगतता:', ta: 'பொருந்தும் அளவு:' },
  };

  return (
    <div className="space-y-3.5 pb-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-br from-rural-800 via-emerald-800 to-teal-900 text-white rounded-3xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-xl shadow-inner">
              🏛️
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">
                National Portal Convergence
              </span>
              <h1 className="text-sm font-black text-white tracking-tight">
                {getLocalized(i18nUI.title)}
              </h1>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
            10 Flagship Schemes
          </span>
        </div>

        <p className="text-[11px] text-emerald-100/90 leading-relaxed">
          {getLocalized(i18nUI.subtitle)}
        </p>

        {/* User Context Strip */}
        <div className="bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 flex items-center justify-between text-[10px] text-emerald-200 font-medium">
          <span>
            📍 {userProfile.villageName || 'Bhiti Rawat'}, {userProfile.districtName || 'Gorakhpur'}
          </span>
          <span>
            💼 {userProfile.selectedBizName || 'Dairy & Agro Unit'} (₹{(userProfile.capital || 80000).toLocaleString()})
          </span>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={getLocalized(i18nUI.searchPlaceholder)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rural-600 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-bold">
        {[
          { id: 'all', label: getLocalized(i18nUI.filterAll) },
          { id: 'subsidy', label: getLocalized(i18nUI.filterSubsidy) },
          { id: 'collateral_free', label: getLocalized(i18nUI.filterCollateralFree) },
          { id: 'food_processing', label: getLocalized(i18nUI.filterAgro) },
          { id: 'livestock', label: getLocalized(i18nUI.filterLivestock) },
          { id: 'artisans', label: getLocalized(i18nUI.filterArtisans) },
          { id: 'women_shg', label: getLocalized(i18nUI.filterWomen) }
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSelectedCategory(f.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition border ${
              selectedCategory === f.id
                ? 'bg-rural-700 text-white border-rural-700 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Schemes List */}
      <div className="space-y-3">
        {schemes.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 space-y-2">
            <div className="text-3xl">🔍</div>
            <h3 className="text-xs font-bold text-slate-800">
              {lang === 'hi' ? 'कोई योजना नहीं मिली' : 'No schemes match your criteria'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {lang === 'hi' ? 'कृपया अन्य श्रेणी या कीवर्ड खोजें।' : 'Please clear your search query or filter.'}
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-xs text-rural-700 font-bold hover:underline"
            >
              {lang === 'hi' ? 'सभी 10 योजनाएं दिखाएं' : 'Show All 10 Schemes'}
            </button>
          </div>
        ) : (
          schemes.map((s) => {
            const isExpanded = expandedSchemeId === s.id;
            const currentTab = getTab(s.id);
            const score = getSuitability(s);

            return (
              <div
                key={s.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-rural-500 shadow-md ring-1 ring-rural-500/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Scheme Header Card (Always Visible) */}
                <div
                  onClick={() => setExpandedSchemeId(isExpanded ? null : s.id)}
                  className="p-3.5 cursor-pointer space-y-2 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-black text-rural-800 bg-rural-50 border border-rural-200 px-2 py-0.5 rounded-md">
                          {s.code}
                        </span>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          {getLocalized(s.badge)}
                        </span>
                        {s.collateralFree && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                            ✓ {getLocalized(i18nUI.collateralBadge)}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xs font-black text-slate-900 mt-1 leading-snug">
                        {getLocalized(s.name)}
                      </h2>
                      <p className="text-[10px] text-slate-500 font-medium">
                        🏛️ {getLocalized(s.ministry)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {score}% Match
                      </span>
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600 p-1"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-rural-700" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Brief Snippet */}
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {getLocalized(s.brief)}
                  </p>

                  {/* Key Metrics Pill Grid */}
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[10px]">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block">{getLocalized(i18nUI.maxLimit)}</span>
                      <span className="font-bold text-slate-800 block truncate">
                        {getLocalized(s.maxLoanDisplay)}
                      </span>
                    </div>

                    <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                      <span className="text-emerald-700 font-bold block">{getLocalized(i18nUI.subsidyBenefit)}</span>
                      <span className="font-extrabold text-emerald-900 block truncate">
                        {getLocalized(s.subsidyDisplay)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Deep Details Section */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-3.5 bg-slate-50/40 space-y-3">
                    {/* Full Description */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      {getLocalized(s.description)}
                    </div>

                    {/* Collateral & Interest Specifics Banner */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                        <span className="text-slate-500 font-bold flex items-center gap-1">
                          <span>🛡️</span> {getLocalized(i18nUI.collateralBadge)}:
                        </span>
                        <span className="text-slate-800 font-medium block">
                          {getLocalized(s.collateralText)}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                        <span className="text-slate-500 font-bold flex items-center gap-1">
                          <span>📉</span> {getLocalized(i18nUI.interestTitle)}:
                        </span>
                        <span className="text-slate-800 font-medium block">
                          {getLocalized(s.interestRate)}
                        </span>
                      </div>
                    </div>

                    {/* Sub-tabs for Eligibility, Documents, How to Apply */}
                    <div className="bg-slate-200/70 p-1 rounded-xl flex items-center text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setTab(s.id, 'eligibility')}
                        className={`flex-1 py-1.5 rounded-lg transition ${
                          currentTab === 'eligibility'
                            ? 'bg-white text-rural-800 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {getLocalized(i18nUI.tabEligibility)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTab(s.id, 'documents')}
                        className={`flex-1 py-1.5 rounded-lg transition ${
                          currentTab === 'documents'
                            ? 'bg-white text-rural-800 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {getLocalized(i18nUI.tabDocs)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTab(s.id, 'process')}
                        className={`flex-1 py-1.5 rounded-lg transition ${
                          currentTab === 'process'
                            ? 'bg-white text-rural-800 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {getLocalized(i18nUI.tabProcess)}
                      </button>
                    </div>

                    {/* Tab Content 1: Eligibility */}
                    {currentTab === 'eligibility' && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{getLocalized(i18nUI.tabEligibility)}</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {(s.eligibility[lang] || s.eligibility.hi).map((crit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                              <span className="text-emerald-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tab Content 2: Documents Required */}
                    {currentTab === 'documents' && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-rural-600" />
                          <span>{getLocalized(i18nUI.tabDocs)}</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {(s.documents[lang] || s.documents.hi).map((doc, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                              <span className="text-rural-600 font-bold flex-shrink-0 mt-0.5">📄</span>
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tab Content 3: Application Process */}
                    {currentTab === 'process' && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{getLocalized(i18nUI.tabProcess)}</span>
                        </h4>
                        <ol className="space-y-1.5">
                          {(s.applicationProcess[lang] || s.applicationProcess.hi).map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                              <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Direct Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={s.officialPortal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition shadow-xs text-center"
                      >
                        <ExternalLink className="w-3 h-3 text-emerald-400" />
                        <span className="truncate">{s.portalName}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => onSelectSchemeForDpr(s)}
                        className="py-2.5 px-3 bg-rural-600 hover:bg-rural-700 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition shadow-xs text-center"
                      >
                        <FileText className="w-3 h-3 text-white" />
                        <span className="truncate">{getLocalized(i18nUI.createDpr)}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
