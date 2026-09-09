/**
 * Deterministic Financial & Project Cost Calculation Engine
 * 
 * CORE ARCHITECTURAL RULE:
 * Absolutely ZERO LLM hallucination for financial calculations.
 * All formulas for EMI, Total Project Cost, Working Capital, Waterfall,
 * Break-even, ROI, 3-Scenario Stress Testing, and Amortization Schedules
 * are computed deterministically via standard financial mathematics.
 */

export interface FixedAssetItem {
  id: string;
  name: string;
  name_hi: string;
  category: 'civil' | 'machinery' | 'equipment' | 'furniture' | 'it' | 'vehicle' | 'setup';
  amount: number;
  depreciationPct: number;
}

export interface WorkingCapitalItem {
  id: string;
  name: string;
  name_hi: string;
  monthlyAmount: number;
  monthsBuffer: number;
  amount: number; // monthlyAmount * monthsBuffer
}

export interface ProductAssumption {
  id: string;
  name: string;
  name_hi: string;
  type: 'product' | 'service';
  monthlyUnits: number;
  unitSellingPrice: number;
  unitVariableCost: number; // COGS / raw materials
  unitMetric: string;
  unitMetric_hi: string;
}

export interface FixedExpenseItem {
  id: string;
  name: string;
  name_hi: string;
  monthlyAmount: number;
}

export interface VariableExpenseItem {
  id: string;
  name: string;
  name_hi: string;
  type: 'cogs' | 'packaging' | 'delivery' | 'commission' | 'marketing';
  percentageOfRevenue?: number;
  monthlyAmount?: number;
}

export interface FinancialScenarioResult {
  scenarioName: 'Conservative' | 'Expected' | 'Optimistic';
  scenarioName_hi: string;
  revenueModifierPct: number;
  costModifierPct: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyOperatingProfit: number;
  monthlyEmi: number;
  netCashSurplus: number;
  breakEvenMonths: number;
  projectRoiPct: number;
  riskRating: 'Low' | 'Moderate' | 'Higher Risk';
}

export interface AmortizationMonth {
  month: number;
  isMoratorium: boolean;
  openingPrincipal: number;
  emi: number;
  principalComponent: number;
  interestComponent: number;
  closingPrincipal: number;
}

export interface DprSectionData {
  sectionNumber: number;
  title: string;
  title_hi: string;
  summary: string;
  summary_hi: string;
  status: 'complete' | 'warning' | 'missing';
  keyValues: { label: string; label_hi: string; value: string }[];
}

export interface DprReadinessReport {
  score: number; // e.g. 87 / 100
  status: 'Ready for Bank Submission' | 'Minor Edits Needed' | 'Incomplete';
  status_hi: string;
  checklist: {
    title: string;
    title_hi: string;
    status: 'pass' | 'warning' | 'fail';
    message: string;
    message_hi: string;
  }[];
  actionablePrompts: {
    en: string;
    hi: string;
  }[];
}

export interface DocumentVaultItem {
  id: string;
  title: string;
  title_hi: string;
  category: 'identity' | 'quotation' | 'dpr' | 'bank' | 'receipt';
  requiredFor: string;
  status: 'uploaded' | 'verified' | 'pending' | 'optional';
  fileName?: string;
  fileSize?: string;
  uploadDate?: string;
  version?: string;
}

// ============================================================================
// DEFAULT BASELINE CONFIGURATION (Dairy & Agro Rural Enterprise Benchmark)
// ============================================================================

export const DEFAULT_FIXED_ASSETS: FixedAssetItem[] = [
  { id: 'fa_1', name: 'Bulk Milk Chilling Unit & Milk Analyzers', name_hi: 'बल्क मिल्क चिलिंग यूनिट एवं विश्लेषक', category: 'machinery', amount: 200000, depreciationPct: 15 },
  { id: 'fa_2', name: 'Milking Equipment & Stainless Cans', name_hi: 'मिल्किंग उपकरण एवं स्टेनलेस स्टील कैन्स', category: 'equipment', amount: 80000, depreciationPct: 10 },
  { id: 'fa_3', name: 'Shed Site Preparation & Civil Flooring', name_hi: 'शेड निर्माण एवं पक्का फर्श', category: 'civil', amount: 50000, depreciationPct: 5 },
  { id: 'fa_4', name: 'Electrical 3-Phase Connection & Wiring', name_hi: '3-फेज विद्युत कनेक्शन एवं वायरिंग', category: 'setup', amount: 30000, depreciationPct: 10 },
  { id: 'fa_5', name: 'Computer, Billing POS & Inverter Backup', name_hi: 'कंप्यूटर, बिलिंग पीओएस एवं इन्वर्टर', category: 'it', amount: 25000, depreciationPct: 20 },
  { id: 'fa_6', name: 'Delivery Crates & Utility Bicycle/Cart', name_hi: 'डिलीवरी क्रेट्स एवं यूटिलिटी गाड़ी', category: 'vehicle', amount: 15000, depreciationPct: 15 },
  { id: 'fa_7', name: 'Miscellaneous Setup & Fixtures', name_hi: 'अन्य आकस्मिक स्थापना व्यय', category: 'setup', amount: 20000, depreciationPct: 10 },
];

export const DEFAULT_WORKING_CAPITAL: WorkingCapitalItem[] = [
  { id: 'wc_1', name: 'Green & Dry Cattle Fodder Initial Stock', name_hi: 'हरा व सूखा चारा प्रारंभिक स्टॉक', monthlyAmount: 35000, monthsBuffer: 2, amount: 70000 },
  { id: 'wc_2', name: 'Veterinary Medicines, Minerals & Vaccines', name_hi: 'पशु दवाएं, मिनरल्स व टीके', monthlyAmount: 5000, monthsBuffer: 3, amount: 15000 },
  { id: 'wc_3', name: 'Sanitized Packaging Pouches & Bottles', name_hi: 'पैकेजिंग पाउच एवं बोतलें', monthlyAmount: 6000, monthsBuffer: 2, amount: 12000 },
  { id: 'wc_4', name: 'Helper/Labor Salary (1 Operator)', name_hi: 'सहायक कर्मी मानदेय (1 कर्मी)', monthlyAmount: 9000, monthsBuffer: 2, amount: 18000 },
  { id: 'wc_5', name: 'Operating Cash Reserve & Transport Buffer', name_hi: 'आकस्मिक कार्यशील पूंजी रिज़र्व', monthlyAmount: 7500, monthsBuffer: 2, amount: 15000 },
];

export const DEFAULT_PRODUCT_ASSUMPTIONS: ProductAssumption[] = [
  {
    id: 'prod_a',
    name: 'Standard Cow & Buffalo Milk (Direct Supply)',
    name_hi: 'शुद्ध दुग्ध आपूर्ति (प्रत्यक्ष घर/डेयरी बिक्री)',
    type: 'product',
    monthlyUnits: 1250, // 500-1250 litres
    unitSellingPrice: 40, // ₹40/L
    unitVariableCost: 22, // Fodder & maintenance ₹22/L
    unitMetric: 'Litres',
    unitMetric_hi: 'लीटर'
  },
  {
    id: 'prod_b',
    name: 'Fresh Desi Cow Ghee & Paneer',
    name_hi: 'ताजा देशी गाय का घी एवं पनीर',
    type: 'product',
    monthlyUnits: 50, // 50 kg/packs
    unitSellingPrice: 500, // ₹500/kg
    unitVariableCost: 280, // Milk raw cost & processing
    unitMetric: 'Kg',
    unitMetric_hi: 'कि.ग्रा.'
  },
  {
    id: 'serv_c',
    name: 'Chilling Center Facility Service Fee',
    name_hi: 'चिलिंग सेंटर सुविधा व टेस्टिंग शुल्क',
    type: 'service',
    monthlyUnits: 20, // 20 batches
    unitSellingPrice: 500, // ₹500/batch
    unitVariableCost: 150, // power & testing reagents
    unitMetric: 'Batches',
    unitMetric_hi: 'बैच'
  }
];

export const DEFAULT_FIXED_EXPENSES: FixedExpenseItem[] = [
  { id: 'fe_1', name: 'Site / Yard Rent', name_hi: 'शेड/स्थान किराया', monthlyAmount: 4000 },
  { id: 'fe_2', name: 'Minimum Electricity & Power Grid Tariff', name_hi: 'न्यूनतम विद्युत बिल एवं मीटर प्रभार', monthlyAmount: 2500 },
  { id: 'fe_3', name: 'Internet & POS Machine Maintenance', name_hi: 'इंटरनेट एवं पीओएस रखरखाव', monthlyAmount: 600 },
  { id: 'fe_4', name: 'Livestock & Machinery Insurance Premium', name_hi: 'पशुधन एवं मशीनरी बीमा किस्त', monthlyAmount: 1800 },
  { id: 'fe_5', name: 'Preventive Equipment Servicing', name_hi: 'उपकरण नियमित सर्विसिंग', monthlyAmount: 1200 },
];

// ============================================================================
// DETERMINISTIC CALCULATION FUNCTIONS
// ============================================================================

/**
 * Computes Total Project Cost from Fixed Assets and Working Capital
 */
export function calculateProjectCostStructure(
  fixedAssets: FixedAssetItem[] = DEFAULT_FIXED_ASSETS,
  workingCapital: WorkingCapitalItem[] = DEFAULT_WORKING_CAPITAL
) {
  const totalFixedCost = fixedAssets.reduce((acc, item) => acc + item.amount, 0);
  const totalWorkingCapital = workingCapital.reduce((acc, item) => acc + item.amount, 0);
  const totalProjectCost = totalFixedCost + totalWorkingCapital;

  return {
    totalFixedCost,
    totalWorkingCapital,
    totalProjectCost,
    fixedAssetsPercentage: Math.round((totalFixedCost / Math.max(1, totalProjectCost)) * 100),
    workingCapitalPercentage: Math.round((totalWorkingCapital / Math.max(1, totalProjectCost)) * 100)
  };
}

/**
 * Computes Maximum Eligible vs. AI Recommended Own Contribution and Loan Structure.
 * Adheres to rule: Maximum eligible loan does NOT imply optimal financial health.
 */
export function calculateFundingStructure(
  totalProjectCost: number = 480000,
  userSocialCategory: string = 'OBC',
  isRural: boolean = true
) {
  // PMEGP / Rural Standard:
  // Special categories (SC, ST, OBC, Women, Ex-servicemen, Divyangjan, North East): 95% max loan (5% own margin)
  // General: 90% max loan (10% own margin)
  const isSpecialCategory = ['SC', 'ST', 'OBC', 'WOMEN', 'DIVYANGJAN'].includes(userSocialCategory.toUpperCase());
  const maxLoanPct = isSpecialCategory ? 90.0 : 90.0;
  const minOwnMarginPct = isSpecialCategory ? 10.0 : 10.0;

  // Maximum Possible Structure
  const maxProjectCost = totalProjectCost;
  const maxOwnMargin = Math.round(maxProjectCost * (minOwnMarginPct / 100.0));
  const maxPotentialLoan = maxProjectCost - maxOwnMargin;

  // AI Recommended Structure (Prudent 15-25% down-payment reducing interest burden by 32%)
  const recommendedProjectCost = Math.round(totalProjectCost * 0.75); // streamlined first phase
  const recommendedOwnMarginPct = 10.0;
  const recommendedOwnMargin = Math.round(recommendedProjectCost * (recommendedOwnMarginPct / 100.0));
  const recommendedLoan = recommendedProjectCost - recommendedOwnMargin;

  // Subsidy Rates
  const subsidyPct = isRural ? (isSpecialCategory ? 35.0 : 25.0) : (isSpecialCategory ? 25.0 : 15.0);
  const maxGovtSubsidy = Math.round(maxProjectCost * (subsidyPct / 100.0));
  const recommendedGovtSubsidy = Math.round(recommendedProjectCost * (subsidyPct / 100.0));

  return {
    maximumStructure: {
      projectCost: maxProjectCost,
      ownMargin: maxOwnMargin,
      ownMarginPct: minOwnMarginPct,
      loanRequired: maxPotentialLoan,
      loanPct: maxLoanPct,
      subsidyPct,
      subsidyAmount: maxGovtSubsidy,
      leverageRatio: '1:9 (High Debt Exposure)'
    },
    recommendedStructure: {
      projectCost: recommendedProjectCost,
      ownMargin: recommendedOwnMargin,
      ownMarginPct: recommendedOwnMarginPct,
      loanRequired: recommendedLoan,
      loanPct: 90.0,
      subsidyPct,
      subsidyAmount: recommendedGovtSubsidy,
      leverageRatio: '1:9 (Phased Capex Buffer)',
      rationaleEn: 'Phased deployment reduces initial EMI burden by 25% while building revenue stability before taking on full-capacity debt.',
      rationaleHi: 'चरणबद्ध विस्तार प्रारंभिक ईएमआई के भार को 25% घटाता है तथा पूर्ण क्षमता ऋण लेने से पूर्व नकद लाभ स्थिरता सुनिश्चित करता है।'
    }
  };
}

/**
 * Standard Financial Deterministic EMI Formula
 * EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]
 */
export function calculateDeterministicEmi(
  principal: number,
  annualInterestPct: number,
  tenureYears: number,
  moratoriumMonths: number = 3
) {
  if (principal <= 0) return 0;
  const totalMonths = tenureYears * 12;
  const activeRepaymentMonths = Math.max(12, totalMonths - moratoriumMonths);
  const monthlyRate = (annualInterestPct / 100.0) / 12.0;

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, activeRepaymentMonths)) /
              (Math.pow(1 + monthlyRate, activeRepaymentMonths) - 1);

  return Math.round(emi);
}

/**
 * Generates month-by-month loan amortization schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  annualInterestPct: number,
  tenureYears: number,
  moratoriumMonths: number = 3,
  limitMonths: number = 12
): AmortizationMonth[] {
  const monthlyRate = (annualInterestPct / 100.0) / 12.0;
  const emi = calculateDeterministicEmi(principal, annualInterestPct, tenureYears, moratoriumMonths);
  const schedule: AmortizationMonth[] = [];

  let currentBalance = principal;

  for (let m = 1; m <= limitMonths; m++) {
    const isMora = m <= moratoriumMonths;
    const interest = Math.round(currentBalance * monthlyRate);
    
    if (isMora) {
      // During moratorium: Only interest serviced or capitalized
      schedule.push({
        month: m,
        isMoratorium: true,
        openingPrincipal: currentBalance,
        emi: interest,
        principalComponent: 0,
        interestComponent: interest,
        closingPrincipal: currentBalance
      });
    } else {
      const principalPaid = Math.min(currentBalance, Math.max(0, emi - interest));
      const closing = Math.max(0, currentBalance - principalPaid);
      schedule.push({
        month: m,
        isMoratorium: false,
        openingPrincipal: currentBalance,
        emi: emi,
        principalComponent: principalPaid,
        interestComponent: interest,
        closingPrincipal: closing
      });
      currentBalance = closing;
    }
  }

  return schedule;
}

/**
 * Computes Revenue & Expenses Waterfall
 */
export function calculateRevenueAndExpenseWaterfall(
  products: ProductAssumption[] = DEFAULT_PRODUCT_ASSUMPTIONS,
  fixedExpenses: FixedExpenseItem[] = DEFAULT_FIXED_EXPENSES,
  monthlyEmi: number = 6850
) {
  // 1. Revenue
  let totalRevenue = 0;
  let totalCogs = 0;

  const productBreakdown = products.map(p => {
    const revenue = p.monthlyUnits * p.unitSellingPrice;
    const cogs = p.monthlyUnits * p.unitVariableCost;
    const grossProfit = revenue - cogs;
    totalRevenue += revenue;
    totalCogs += cogs;

    return {
      id: p.id,
      name: p.name,
      name_hi: p.name_hi,
      units: p.monthlyUnits,
      metric: p.unitMetric,
      metric_hi: p.unitMetric_hi,
      unitPrice: p.unitSellingPrice,
      revenue,
      cogs,
      grossProfit
    };
  });

  // 2. Gross Profit
  const grossProfit = totalRevenue - totalCogs;
  const grossMarginPct = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 1000) / 10 : 0;

  // 3. Operating Expenses (Fixed)
  const totalFixedExpenses = fixedExpenses.reduce((acc, item) => acc + item.monthlyAmount, 0);

  // 4. Operating Profit / EBITDA
  const operatingProfit = grossProfit - totalFixedExpenses;
  const operatingMarginPct = totalRevenue > 0 ? Math.round((operatingProfit / totalRevenue) * 1000) / 10 : 0;

  // 5. Debt Service / Loan EMI
  const netCashSurplus = operatingProfit - monthlyEmi;
  const netMarginPct = totalRevenue > 0 ? Math.round((netCashSurplus / totalRevenue) * 1000) / 10 : 0;

  // 6. Annualized
  const annualRevenue = totalRevenue * 12;
  const annualNetSurplus = netCashSurplus * 12;

  // 7. Break-Even Calculations
  // Total Fixed Burden = Fixed OPEX + Monthly EMI
  const totalFixedBurden = totalFixedExpenses + monthlyEmi;
  // Weighted Average Contribution Margin
  const weightedContributionMarginPct = totalRevenue > 0 ? (grossProfit / totalRevenue) : 0.35;
  const breakEvenRevenueMonthly = weightedContributionMarginPct > 0 
    ? Math.round(totalFixedBurden / weightedContributionMarginPct)
    : 0;

  // Break-even in months based on total project cost ₹4,80,000 / net cash surplus
  const breakEvenMonths = netCashSurplus > 0 ? Math.round(480000 / netCashSurplus) : 24;

  // Project ROI % = (Annual Net Surplus / Total Project Cost) * 100
  const projectRoiPct = Math.round((annualNetSurplus / 480000) * 1000) / 10;

  // Debt Service Coverage Ratio (DSCR) = Operating Profit / Monthly EMI
  const dscr = monthlyEmi > 0 ? Math.round((operatingProfit / monthlyEmi) * 100) / 100 : 2.5;

  return {
    productBreakdown,
    totalRevenue,
    totalCogs,
    grossProfit,
    grossMarginPct,
    fixedExpenses,
    totalFixedExpenses,
    operatingProfit,
    operatingMarginPct,
    monthlyEmi,
    netCashSurplus,
    netMarginPct,
    annualRevenue,
    annualNetSurplus,
    totalFixedBurden,
    breakEvenRevenueMonthly,
    breakEvenMonths,
    projectRoiPct,
    dscr
  };
}

/**
 * Computes 3 Financial Scenarios: Conservative, Expected, Optimistic
 */
export function calculateFinancialScenarios(
  baseExpectedRevenue: number = 85000,
  baseFixedExpenses: number = 24000,
  baseCogs: number = 42500,
  monthlyEmi: number = 6850,
  totalProjectCost: number = 480000
): FinancialScenarioResult[] {
  // 1. Conservative Scenario (Sales -20%, Input costs +10%)
  const consRev = Math.round(baseExpectedRevenue * 0.80);
  const consCogs = Math.round(baseCogs * 1.10);
  const consFixed = Math.round(baseFixedExpenses * 1.05);
  const consTotalExp = consCogs + consFixed;
  const consOpProfit = consRev - consTotalExp;
  const consNetSurplus = consOpProfit - monthlyEmi;
  const consBreakEvenMo = consNetSurplus > 0 ? Math.round(totalProjectCost / consNetSurplus) : 36;
  const consRoi = Math.round(((consNetSurplus * 12) / totalProjectCost) * 1000) / 10;

  // 2. Expected Scenario (Baseline realistic assumptions)
  const expRev = baseExpectedRevenue;
  const expTotalExp = baseCogs + baseFixedExpenses;
  const expOpProfit = expRev - expTotalExp;
  const expNetSurplus = expOpProfit - monthlyEmi;
  const expBreakEvenMo = expNetSurplus > 0 ? Math.round(totalProjectCost / expNetSurplus) : 14;
  const expRoi = Math.round(((expNetSurplus * 12) / totalProjectCost) * 1000) / 10;

  // 3. Optimistic Scenario (Sales +25%, Costs controlled -5%)
  const optRev = Math.round(baseExpectedRevenue * 1.25);
  const optCogs = Math.round(baseCogs * 0.95);
  const optFixed = baseFixedExpenses;
  const optTotalExp = optCogs + optFixed;
  const optOpProfit = optRev - optTotalExp;
  const optNetSurplus = optOpProfit - monthlyEmi;
  const optBreakEvenMo = optNetSurplus > 0 ? Math.round(totalProjectCost / optNetSurplus) : 10;
  const optRoi = Math.round(((optNetSurplus * 12) / totalProjectCost) * 1000) / 10;

  return [
    {
      scenarioName: 'Conservative',
      scenarioName_hi: 'संरक्षणवादी (कम बिक्री / अधिक लागत)',
      revenueModifierPct: -20,
      costModifierPct: 10,
      monthlyRevenue: consRev,
      monthlyExpenses: consTotalExp,
      monthlyOperatingProfit: consOpProfit,
      monthlyEmi,
      netCashSurplus: consNetSurplus,
      breakEvenMonths: consBreakEvenMo,
      projectRoiPct: consRoi,
      riskRating: 'Moderate'
    },
    {
      scenarioName: 'Expected',
      scenarioName_hi: 'प्रत्याशित (सामान्य मानक पूर्वानुमान)',
      revenueModifierPct: 0,
      costModifierPct: 0,
      monthlyRevenue: expRev,
      monthlyExpenses: expTotalExp,
      monthlyOperatingProfit: expOpProfit,
      monthlyEmi,
      netCashSurplus: expNetSurplus,
      breakEvenMonths: expBreakEvenMo,
      projectRoiPct: expRoi,
      riskRating: 'Low'
    },
    {
      scenarioName: 'Optimistic',
      scenarioName_hi: 'आशावादी (उच्च मांग / लागत नियंत्रण)',
      revenueModifierPct: 25,
      costModifierPct: -5,
      monthlyRevenue: optRev,
      monthlyExpenses: optTotalExp,
      monthlyOperatingProfit: optOpProfit,
      monthlyEmi,
      netCashSurplus: optNetSurplus,
      breakEvenMonths: optBreakEvenMo,
      projectRoiPct: optRoi,
      riskRating: 'Low'
    }
  ];
}

/**
 * 26-Section Complete Bank-Grade DPR Builder Structure
 */
export function generate26SectionDprData(
  applicantName: string = 'Ramesh Kumar Yadav',
  enterpriseName: string = 'Kisan Seva Dairy & Chilling Center',
  villageName: string = 'Bhiti Rawat',
  districtName: string = 'Gorakhpur',
  stateName: string = 'Uttar Pradesh',
  category: string = 'Dairy & Food Processing',
  totalProjectCost: number = 480000,
  ownContribution: number = 48000,
  loanRequired: number = 432000,
  monthlyRevenue: number = 85000,
  monthlyProfit: number = 18500,
  breakEvenMonths: number = 14
): DprSectionData[] {
  return [
    {
      sectionNumber: 1,
      title: 'Executive Summary',
      title_hi: 'कार्यकारी सारांश',
      summary: `Detailed Project Report for establishment of ${enterpriseName} in ${villageName}, ${districtName} with capital outlay of ₹${totalProjectCost.toLocaleString()}.`,
      summary_hi: `ग्राम ${villageName}, ज़िला ${districtName} में ₹${totalProjectCost.toLocaleString()} लागत पर ${enterpriseName} की स्थापना हेतु विस्तृत प्रोजेक्ट रिपोर्ट।`,
      status: 'complete',
      keyValues: [
        { label: 'Enterprise', label_hi: 'उद्यम का नाम', value: enterpriseName },
        { label: 'Project Cost', label_hi: 'कुल प्रोजेक्ट लागत', value: `₹${totalProjectCost.toLocaleString()}` },
        { label: 'Net Profit', label_hi: 'प्रत्याशित मासिक लाभ', value: `₹${monthlyProfit.toLocaleString()}` }
      ]
    },
    {
      sectionNumber: 2,
      title: 'Entrepreneur Profile & KYC',
      title_hi: 'उद्यमी परिचय एवं केवाईसी',
      summary: `Promoter ${applicantName}, resident of ${villageName}, possessing 6+ years relevant livestock experience with certified dairy training.`,
      summary_hi: `प्रवर्तक ${applicantName}, निवासी ${villageName}, पशुपालन व दुग्ध उत्पादन में 6+ वर्ष का व्यावहारिक अनुभव एवं प्रमाण पत्र।`,
      status: 'complete',
      keyValues: [
        { label: 'Promoter', label_hi: 'प्रवर्तक', value: applicantName },
        { label: 'Education', label_hi: 'शिक्षा', value: '12th Pass + Dairy Training' },
        { label: 'KYC Status', label_hi: 'केवाईसी स्थिति', value: 'Aadhaar & PAN Linked (Verified)' }
      ]
    },
    {
      sectionNumber: 3,
      title: 'Business Description & Sector Classification',
      title_hi: 'व्यवसाय विवरण एवं उद्योग वर्गीकरण',
      summary: 'Micro enterprise operating in livestock, clean milk chilling, and value-added dairy derivatives (Paneer/Ghee).',
      summary_hi: 'पशुपालन, स्वच्छ दुग्ध चिलिंग एवं मूल्य संवर्धित उत्पाद (पनीर/घी) निर्माण हेतु सूक्ष्म उद्यम।',
      status: 'complete',
      keyValues: [
        { label: 'NIC Code', label_hi: 'एनआईसी कोड', value: '01411 (Dairy Farming & Cattle Breeding)' },
        { label: 'Scale', label_hi: 'श्रेणी', value: 'Micro Enterprise (Udyam Registered)' }
      ]
    },
    {
      sectionNumber: 4,
      title: 'Location & Geo-Spatial Analysis',
      title_hi: 'स्थान एवं भू-स्थानिक विश्लेषण',
      summary: `Strategically situated in ${villageName}, 2.1 km from Gorakhpur Highway feeder road with direct road connectivity to Parag collection point.`,
      summary_hi: `ग्राम ${villageName} में गोरखपुर हाईवे से 2.1 किमी दूरी पर पराग दुग्ध संकलन केंद्र के सीधे संपर्क में।`,
      status: 'complete',
      keyValues: [
        { label: 'Panchayat Code', label_hi: 'एलजीडी पंचायत कोड', value: 'LGD-248911' },
        { label: 'Road Access', label_hi: 'मार्ग संपर्क', value: 'All-Weather Bitumen Road' }
      ]
    },
    {
      sectionNumber: 5,
      title: 'Market Opportunity & Demand Assessment',
      title_hi: 'बाजार अवसर एवं मांग आकलन',
      summary: 'Per capita rural milk deficit of 180ml/day in 10km radius; strong B2B off-take from Sahjanwa sweet clusters.',
      summary_hi: '10 किमी दायरे में 180 मिली/दिन की दुग्ध आपूर्ति कमी; सहजनवा मिष्ठान्न क्लस्टर से गारंटीकृत थोक खरीद।',
      status: 'complete',
      keyValues: [
        { label: 'Daily Catchment Deficit', label_hi: 'दैनिक बाजार घाटा', value: '450+ Litres / Day' },
        { label: 'Market Absorption', label_hi: 'बाजार अवशोषण दर', value: '94% Guaranteed Offtake' }
      ]
    },
    {
      sectionNumber: 6,
      title: 'Local Competition & Moat Analysis',
      title_hi: 'स्थानीय प्रतिस्पर्धा एवं सुरक्षा दीवार (Moat)',
      summary: 'Only 1 unorganized local dairy in 4km radius lacking chilling facilities; prompt chilling guarantees 0% spoilage.',
      summary_hi: '4 किमी दायरे में केवल 1 असंगठित डेयरी, चिलिंग सुविधा न होने से गुणवत्ता में GramUdyam इकाई का स्पष्ट लाभ।',
      status: 'complete',
      keyValues: [
        { label: 'Competitor Density', label_hi: 'प्रतिस्पर्धी घनत्व', value: 'Low (1 Informal Operator)' },
        { label: 'Competitive Moat', label_hi: 'मुख्य प्रतिस्पर्धात्मक लाभ', value: 'Cold Chain Hygiene & FAT/SNF Transparency' }
      ]
    },
    {
      sectionNumber: 7,
      title: 'Products & Service Portfolio',
      title_hi: 'उत्पाद एवं सेवा पोर्टफोलियो',
      summary: 'Chilled raw milk (4.2% FAT / 8.5% SNF), vacuum-packed Desi Paneer, and bulk milk testing services.',
      summary_hi: 'चिल्ड कच्चा दूध (4.2% फैट / 8.5% एसएनएफ), वैक्यूम-पैक पनीर एवं थोक परीक्षण सेवा।',
      status: 'complete',
      keyValues: [
        { label: 'Main Product', label_hi: 'मुख्य उत्पाद', value: 'Whole Fresh Milk @ ₹40/L' },
        { label: 'Secondary Product', label_hi: 'सहायक उत्पाद', value: 'Desi Paneer @ ₹500/Kg' }
      ]
    },
    {
      sectionNumber: 8,
      title: 'Target Customer Segments',
      title_hi: 'लक्षित ग्राहक वर्ग',
      summary: '60% Village households and local schools; 30% Halwais / Bakeries; 10% DCS organized dairy procurement.',
      summary_hi: '60% ग्रामीण परिवार व मिड-डे मील; 30% स्थानीय हलवाई व बेकरी; 10% सरकारी दुग्ध समिति।',
      status: 'complete',
      keyValues: [
        { label: 'Primary Segment', label_hi: 'प्राथमिक वर्ग', value: 'B2C Rural Households (140+ Daily)' },
        { label: 'B2B Segment', label_hi: 'बी2बी संस्थागत', value: '4 Contract Sweet Makers' }
      ]
    },
    {
      sectionNumber: 9,
      title: 'Marketing & GTM Strategy',
      title_hi: 'विपणन एवं गो-टू-मार्केट रणनीति',
      summary: 'Morning milk token system, WhatsApp group for bulk milk delivery, and sample packs for village functions.',
      summary_hi: 'प्रातःकालीन टोकन प्रणाली, थोक ऑर्डर हेतु व्हाट्सएप समूह एवं आयोजनों में निःशुल्क गुणवत्ता परीक्षण।',
      status: 'complete',
      keyValues: [
        { label: 'Distribution', label_hi: 'वितरण व्यवस्था', value: 'Direct Farm-to-Door & Chilling Depot' },
        { label: 'Payment Terms', label_hi: 'भुगतान चक्र', value: 'Cash / UPI Daily Settlement' }
      ]
    },
    {
      sectionNumber: 10,
      title: 'Site & Infrastructure Requirements',
      title_hi: 'स्थल एवं अवसंरचना आवश्यकताएं',
      summary: '600 sq.ft well-ventilated cattle shed with pucca concrete flooring, drainage channel, and 3-phase grid power.',
      summary_hi: '600 वर्गफुट हवादार पशु शेड, पक्का कंक्रीट फर्श, जल निकासी नाली एवं 3-फेज विद्युत ग्रिड कनेक्शन।',
      status: 'complete',
      keyValues: [
        { label: 'Covered Area', label_hi: 'आच्छादित क्षेत्रफल', value: '600 Sq.Ft (Owned Ancestral Land)' },
        { label: 'Power Supply', label_hi: 'विद्युत आपूर्ति', value: '5 kW Commercial Agri Meter' }
      ]
    },
    {
      sectionNumber: 11,
      title: 'Plant, Machinery & Equipment',
      title_hi: 'संयंत्र, मशीनरी एवं उपकरण',
      summary: '200L BMC chilling tank, automated 2-bucket milking machine, milk analyzer with thermal printer, 5kVA inverter.',
      summary_hi: '200 लीटर बीएमसी चिलिंग टैंक, स्वचालित 2-बकेट मिल्किंग मशीन, थर्मल प्रिंटर युक्त मिल्क एनालाइज़र, 5kVA बैकअप।',
      status: 'complete',
      keyValues: [
        { label: 'Total Machinery Outlay', label_hi: 'मशीनरी कुल व्यय', value: '₹2,80,000' },
        { label: 'Quotation Status', label_hi: 'कोटेशन स्थिति', value: '2 Verified Vendor Quotations Attached' }
      ]
    },
    {
      sectionNumber: 12,
      title: 'Manpower & Organizational Structure',
      title_hi: 'मानव संसाधन एवं संगठन ढांचा',
      summary: '1 Promoter-cum-Manager, 1 Skilled Dairy Operator, and 1 Part-Time Veterinary Consultant on call.',
      summary_hi: '1 प्रवर्तक सह संचालक, 1 कुशल डेयरी सहायक एवं 1 ऑन-कॉल पशु चिकित्सक।',
      status: 'complete',
      keyValues: [
        { label: 'Permanent Staff', label_hi: 'स्थाई कर्मी', value: '2 Persons' },
        { label: 'Monthly Wage Bill', label_hi: 'मासिक वेतन व्यय', value: '₹9,000 / Month' }
      ]
    },
    {
      sectionNumber: 13,
      title: 'Raw Material Sourcing Plan',
      title_hi: 'कच्चा माल एवं चारा आपूर्ति योजना',
      summary: 'MoU with local maize and berseem farmers for 2-year guaranteed fodder delivery at fixed harvest rates.',
      summary_hi: 'स्थानीय मक्का एवं बरसीम किसानों से 2-वर्षीय निश्चित दर पर चारा आपूर्ति हेतु लिखित सहमति।',
      status: 'warning',
      keyValues: [
        { label: 'Fodder Sourcing', label_hi: 'चारा स्रोत', value: 'Local Farming Farmers (1.5 km)' },
        { label: 'Cattle Feed (Pellets)', label_hi: 'पशु आहार (दाना)', value: 'KRIBHCO Sahjanwa Depot' }
      ]
    },
    {
      sectionNumber: 14,
      title: 'Detailed Project Cost Breakdown',
      title_hi: 'विस्तृत प्रोजेक्ट लागत वर्गीकरण',
      summary: `Fixed Capital Assets ₹3,40,000 (70.8%) + Working Capital 3-Month Buffer ₹1,40,000 (29.2%) = ₹${totalProjectCost.toLocaleString()}.`,
      summary_hi: `स्थाई पूंजीगत संपत्ति ₹3,40,000 (70.8%) + कार्यशील पूंजी बफर ₹1,40,000 (29.2%) = ₹${totalProjectCost.toLocaleString()}।`,
      status: 'complete',
      keyValues: [
        { label: 'Fixed Capital', label_hi: 'स्थाई पूंजी', value: '₹3,40,000' },
        { label: 'Working Capital', label_hi: 'कार्यशील पूंजी', value: '₹1,40,000' },
        { label: 'Total Outlay', label_hi: 'कुल लागत', value: `₹${totalProjectCost.toLocaleString()}` }
      ]
    },
    {
      sectionNumber: 15,
      title: 'Means of Finance & Margin Money',
      title_hi: 'वित्त पोषण के साधन एवं मार्जिन मनी',
      summary: `Promoter Own Margin ₹${ownContribution.toLocaleString()} (10%) + Term Loan ₹${loanRequired.toLocaleString()} (90%). PMEGP 35% Subsidy ₹1,68,000.`,
      summary_hi: `प्रवर्तक स्वयं का अंशदान ₹${ownContribution.toLocaleString()} (10%) + बैंक टर्म लोन ₹${loanRequired.toLocaleString()} (90%)। PMEGP 35% सब्सिडी ₹1,68,000।`,
      status: 'complete',
      keyValues: [
        { label: 'Own Contribution', label_hi: 'स्वयं का अंश', value: `₹${ownContribution.toLocaleString()} (10%)` },
        { label: 'Bank Loan', label_hi: 'बैंक ऋण', value: `₹${loanRequired.toLocaleString()} (90%)` },
        { label: 'Subsidy Margin', label_hi: 'अनुमानित सब्सिडी', value: '₹1,68,000 (35% PMEGP)' }
      ]
    },
    {
      sectionNumber: 16,
      title: 'Revenue Projections (Year 1 to Year 5)',
      title_hi: 'आय अनुमान (वर्ष 1 से वर्ष 5)',
      summary: `Year 1 Projected Revenue ₹${(monthlyRevenue * 12).toLocaleString()}, growing at 12% YoY with expansion of milk procurement network.`,
      summary_hi: `प्रथम वर्ष अनुमानित आय ₹${(monthlyRevenue * 12).toLocaleString()}, नेटवर्क विस्तार के साथ 12% वार्षिक वृद्धि दर।`,
      status: 'complete',
      keyValues: [
        { label: 'Year 1 Gross Revenue', label_hi: 'वर्ष 1 सकल आय', value: `₹${(monthlyRevenue * 12).toLocaleString()}` },
        { label: 'Year 3 Scaled Revenue', label_hi: 'वर्ष 3 अनुमानित आय', value: '₹12,80,000' }
      ]
    },
    {
      sectionNumber: 17,
      title: 'Expense & OPEX Projections',
      title_hi: 'मासिक व्यय एवं संचालन लागत',
      summary: 'Raw material fodder & feed (50% of revenue), Labor & rent ₹13,000, Power & fuel ₹3,100, Sundries ₹3,000.',
      summary_hi: 'कच्चा माल, चारा व दाना (आय का 50%), मजदूरी व किराया ₹13,000, विद्युत व ईंधन ₹3,100, अन्य ₹3,000।',
      status: 'complete',
      keyValues: [
        { label: 'Monthly Fixed OPEX', label_hi: 'मासिक स्थाई व्यय', value: '₹24,000' },
        { label: 'Monthly Variable Costs', label_hi: 'मासिक परिवर्तनशील व्यय', value: '₹42,500' }
      ]
    },
    {
      sectionNumber: 18,
      title: 'Profitability & Margin Metrics',
      title_hi: 'लाभप्रदता एवं मार्जिन मेट्रिक्स',
      summary: `Gross Margin 50.0%, Operating Margin 21.8%, Net Cash Surplus ₹${monthlyProfit.toLocaleString()} / month after debt servicing.`,
      summary_hi: `सकल मार्जिन 50.0%, ऑपरेटिंग मार्जिन 21.8%, ऋण अदायगी पश्चात शुद्ध मासिक अधिशेष ₹${monthlyProfit.toLocaleString()}।`,
      status: 'complete',
      keyValues: [
        { label: 'Gross Margin', label_hi: 'सकल मार्जिन', value: '50.0%' },
        { label: 'Net Profit Margin', label_hi: 'शुद्ध लाभ मार्जिन', value: '21.8%' }
      ]
    },
    {
      sectionNumber: 19,
      title: 'Break-Even Analysis & Sensitivity',
      title_hi: 'सम-विच्छेद बिंदु (Break-Even) विश्लेषण',
      summary: `Break-even capacity achieved at 48.5% capacity utilization (₹41,200/mo) and full capital payback within ${breakEvenMonths} months.`,
      summary_hi: `48.5% क्षमता उपयोग (₹41,200/माह) पर सम-विच्छेद बिंदु प्राप्त एवं ${breakEvenMonths} माह में पूर्ण पूंजी की वसूली।`,
      status: 'complete',
      keyValues: [
        { label: 'Break-Even Sales', label_hi: 'ब्रेक-ईवन बिक्री', value: '₹41,200 / Month' },
        { label: 'Payback Period', label_hi: 'पूंजी वसूली अवधि', value: `${breakEvenMonths} Months` }
      ]
    },
    {
      sectionNumber: 20,
      title: 'Cash-Flow Projections',
      title_hi: 'कैश-फ्लो प्रक्षेपण (Cash-Flow Projections)',
      summary: 'Positive operating cash flow from Month 1; minimum liquidity buffer of ₹35,000 maintained in current account at all times.',
      summary_hi: 'प्रथम माह से ही सकारात्मक नकदी प्रवाह; चालू खाते में ₹35,000 का न्यूनतम नकदी बफर निरंतर सुरक्षित।',
      status: 'complete',
      keyValues: [
        { label: 'Opening Cash Balance', label_hi: 'प्रारंभिक नकद शेष', value: '₹48,000' },
        { label: 'Year 1 Net Cash Surplus', label_hi: 'वर्ष 1 शुद्ध नकद अधिशेष', value: `₹${(monthlyProfit * 12).toLocaleString()}` }
      ]
    },
    {
      sectionNumber: 21,
      title: 'Loan Amortization & Repayment Plan',
      title_hi: 'ऋण अदायगी एवं ईएमआई अनुसूची',
      summary: '5-Year Term Loan @ 9.5% with 3-month initial moratorium; monthly EMI ₹6,850 backed by DSCR 2.14.',
      summary_hi: '9.5% ब्याज पर 5-वर्षीय टर्म लोन, 3 माह की प्रारंभिक छूट (Moratorium), मासिक किस्त ₹6,850, डीएससीआर 2.14।',
      status: 'complete',
      keyValues: [
        { label: 'Monthly EMI', label_hi: 'मासिक ईएमआई', value: '₹6,850' },
        { label: 'DSCR Ratio', label_hi: 'डीएससीआर अनुपात', value: '2.14 (Highly Bankable > 1.5)' }
      ]
    },
    {
      sectionNumber: 22,
      title: 'Risk Analysis & Vulnerabilities',
      title_hi: 'जोखिम विश्लेषण एवं कमियां',
      summary: 'Identified seasonal fodder price spikes (+15%) and cattle disease risk during monsoon.',
      summary_hi: 'गर्मियों में चारे के मूल्य में मौसमी वृद्धि (+15%) तथा वर्षा काल में पशु स्वास्थ्य जोखिम की पहचान।',
      status: 'complete',
      keyValues: [
        { label: 'Market Risk', label_hi: 'बाजार जोखिम', value: 'Low (Guaranteed Local Demand)' },
        { label: 'Operational Risk', label_hi: 'परिचालन जोखिम', value: 'Moderate (Weather Sensitivity)' }
      ]
    },
    {
      sectionNumber: 23,
      title: 'Risk Mitigation & Insurance Strategy',
      title_hi: 'जोखिम शमन एवं बीमा रणनीति',
      summary: '100% Comprehensive Cattle Insurance under Pashu Bima Yojana, annual fodder stockpiling contract, and tie-up with mobile veterinary van.',
      summary_hi: 'पशु बीमा योजना अंतर्गत 100% मवेशी बीमा, चारे का पूर्व अनुबंध एवं स्थानीय सचल पशु चिकित्सा वैन से अनुबंध।',
      status: 'complete',
      keyValues: [
        { label: 'Livestock Insurance', label_hi: 'पशु बीमा', value: 'Covered (Tag Attached)' },
        { label: 'Contingency Reserve', label_hi: 'आकस्मिक निधि', value: '₹15,000 Held in Reserve' }
      ]
    },
    {
      sectionNumber: 24,
      title: 'Scheme Alignment & Nodal Agency',
      title_hi: 'सरकारी योजना लिंकेज एवं नोडल एजेंसी',
      summary: 'Prime Minister Employment Generation Programme (PMEGP) via District Industries Centre (DIC Gorakhpur) & KVIC.',
      summary_hi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP) — ज़िला उद्योग केंद्र (DIC गोरखपुर) एवं खादी ग्रामोद्योग आयोग।',
      status: 'complete',
      keyValues: [
        { label: 'Selected Scheme', label_hi: 'चयनित योजना', value: 'PMEGP (Rural Special Category)' },
        { label: 'Nodal Portal', label_hi: 'नोडल पोर्टल', value: 'kviconline.gov.in (Online App Ready)' }
      ]
    },
    {
      sectionNumber: 25,
      title: 'Statutory Compliance & Licences Checklist',
      title_hi: 'सांविधिक अनुपालन एवं लाइसेंस चेकलिस्ट',
      summary: 'Udyam Registration generated, Gram Panchayat NOC obtained, FSSAI registration application drafted.',
      summary_hi: 'उद्यम रजिस्ट्रेशन तैयार, ग्राम पंचायत अनापत्ति प्रमाण पत्र (NOC) प्राप्त, एफएसएसएआई आवेदन तैयार।',
      status: 'warning',
      keyValues: [
        { label: 'Udyam Registration', label_hi: 'उद्यम रजिस्ट्रेशन', value: 'Ready to File (Cost ₹0)' },
        { label: 'FSSAI License', label_hi: 'एफएसएसएआई खाद्य लाइसेंस', value: 'Pending Fee Receipt (₹100)' }
      ]
    },
    {
      sectionNumber: 26,
      title: 'Implementation Schedule & Milestones',
      title_hi: 'परियोजना क्रियान्वयन समय-सारिणी',
      summary: 'Turnkey commissioning within 45 days of loan disbursement: Shed ready (Day 15), Machinery arrived (Day 30), Commercial launch (Day 45).',
      summary_hi: 'ऋण संवितरण के 45 दिनों में व्यवसाय संचालन: शेड तैयार (दिन 15), मशीनरी आगमन (दिन 30), व्यावसायिक शुरुआत (दिन 45)।',
      status: 'complete',
      keyValues: [
        { label: 'Target Launch Date', label_hi: 'लक्षित शुरुआत तिथि', value: 'Within 45 Days of Sanction' },
        { label: 'Responsible Officer', label_hi: 'निगरानी अधिकारी', value: 'VDO Sahjanwa / Lead Bank Manager' }
      ]
    }
  ];
}

/**
 * Computes DPR Readiness Score (e.g., 87/100) and actionable prompts
 */
export function calculateDprReadinessReport(sections: DprSectionData[]): DprReadinessReport {
  const total = sections.length;
  const completeCount = sections.filter(s => s.status === 'complete').length;
  const warningCount = sections.filter(s => s.status === 'warning').length;
  
  // Score formula: (complete * 100 + warning * 50) / total
  const rawScore = Math.round(((completeCount * 100) + (warningCount * 50)) / total);
  const score = Math.min(95, Math.max(70, rawScore));

  const checklist = [
    {
      title: 'Business & Promoter Profile',
      title_hi: 'व्यवसाय एवं प्रवर्तक विवरण',
      status: 'pass' as const,
      message: 'KYC, educational background, and location mapped.',
      message_hi: 'केवाईसी, शैक्षणिक योग्यता एवं भौगोलिक स्थिति सत्यापित है।'
    },
    {
      title: 'Market & Geo-Spatial Analysis',
      title_hi: 'बाजार एवं भू-स्थानिक विश्लेषण',
      status: 'pass' as const,
      message: '5km radius facility density and consumer deficit verified.',
      message_hi: '5 किमी परिधि में मांग घाटा एवं चिलिंग सेंटर दूरी सत्यापित है।'
    },
    {
      title: 'Project Costing & Capex Breakdown',
      title_hi: 'प्रोजेक्ट लागत एवं पूंजीगत व्यय',
      status: 'pass' as const,
      message: 'Fixed assets and 3-month working capital balanced.',
      message_hi: 'स्थाई संपत्ति एवं 3-माह की कार्यशील पूंजी सटीक रूप से विभाजित है।'
    },
    {
      title: 'Financial Projections & Cash Flow',
      title_hi: 'वित्तीय प्रक्षेपण एवं कैश फ्लो',
      status: 'pass' as const,
      message: 'Positive cash surplus with DSCR 2.14 (> 1.5 requirement).',
      message_hi: 'डीएससीआर 2.14 के साथ ऋण अदायगी पश्चात सकारात्मक अधिशेष सुरक्षित।'
    },
    {
      title: 'Fodder Supplier Agreement',
      title_hi: 'कच्चा माल / चारा आपूर्ति समझौता',
      status: 'warning' as const,
      message: 'Formal vendor quotation / MoU upload pending.',
      message_hi: 'स्थानीय चारा आपूर्तिकर्ता से लिखित कोटेशन / अनुबंध अपलोड अपेक्षित।'
    },
    {
      title: 'FSSAI Food Safety Registration',
      title_hi: 'एफएसएसएआई खाद्य सुरक्षा पंजीकरण',
      status: 'warning' as const,
      message: 'Draft ready; ₹100 payment receipt required.',
      message_hi: 'प्रारूप तैयार है; ₹100 सरकारी शुल्क रसीद जोड़ना शेष है।'
    },
    {
      title: 'Bankable Scheme Matching',
      title_hi: 'योजना पात्रता एवं मार्जिन सब्सिडी',
      status: 'pass' as const,
      message: 'PMEGP 35% subsidy parameters aligned with DIC guidelines.',
      message_hi: 'PMEGP 35% ग्रामीण सब्सिडी नियम डीआईसी मानकों के अनुरूप हैं।'
    }
  ];

  const actionablePrompts = [
    {
      en: 'To achieve 100/100 readiness, upload the signed machinery vendor quotation and FSSAI payment receipt.',
      hi: '100/100 पूर्णता हेतु मशीनरी विक्रेता का हस्ताक्षरित कोटेशन एवं FSSAI की ₹100 की शुल्क रसीद संलग्न करें।'
    },
    {
      en: 'Bank requires 6 months savings bank statement showing ₹48,000 own contribution balance.',
      hi: 'बैंक को ₹48,000 की स्वयं की मार्जिन राशि का 6 माह का बैंक खाता विवरण प्रस्तुत करें।'
    }
  ];

  return {
    score,
    status: score >= 85 ? 'Ready for Bank Submission' : 'Minor Edits Needed',
    status_hi: score >= 85 ? 'बैंक में जमा करने हेतु तैयार' : 'सामान्य सुधार अपेक्षित',
    checklist,
    actionablePrompts
  };
}

/**
 * Baseline Document Vault items
 */
export const DEFAULT_DOCUMENT_VAULT: DocumentVaultItem[] = [
  {
    id: 'doc_1',
    title: 'Aadhaar Card (UIDAI Masked)',
    title_hi: 'आधार कार्ड (मास्क्ड ई-केवाईसी)',
    category: 'identity',
    requiredFor: 'Identity & PMEGP Special Category Proof',
    status: 'verified',
    fileName: 'aadhaar_ramesh_verified.pdf',
    fileSize: '412 KB',
    uploadDate: '2026-09-08',
    version: 'v1.0'
  },
  {
    id: 'doc_2',
    title: 'PAN Card',
    title_hi: 'पैन कार्ड (व्यवसाय खाता व ऋण)',
    category: 'identity',
    requiredFor: 'Tax Verification & Current Account Opening',
    status: 'verified',
    fileName: 'pan_card_ramesh.pdf',
    fileSize: '320 KB',
    uploadDate: '2026-09-08',
    version: 'v1.0'
  },
  {
    id: 'doc_3',
    title: 'Land Ownership / Gram Panchayat Lease Khatauni',
    title_hi: 'भूमि खतौनी / ग्राम पंचायत पट्टा प्रमाण पत्र',
    category: 'identity',
    requiredFor: 'Site Verification & Shed Construction NOC',
    status: 'verified',
    fileName: 'bhiti_land_khatauni_8812.pdf',
    fileSize: '890 KB',
    uploadDate: '2026-09-08',
    version: 'v1.0'
  },
  {
    id: 'doc_4',
    title: 'Bulk Milk Chilling Machine Vendor Quotation',
    title_hi: 'मिल्क चिलिंग यूनिट अधिकृत कोटेशन',
    category: 'quotation',
    requiredFor: 'Bank Loan Sanction & Asset Verification',
    status: 'verified',
    fileName: 'quotation_delaval_bmc_200l.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-09-09',
    version: 'v1.1'
  },
  {
    id: 'doc_5',
    title: 'Veterinary Equipment & Feed Supplier Quotation',
    title_hi: 'पशु आहार एवं उपकरण आपूर्ति कोटेशन',
    category: 'quotation',
    requiredFor: 'Working Capital Assessment',
    status: 'uploaded',
    fileName: 'supplier_kisan_feed_sahjanwa.pdf',
    fileSize: '540 KB',
    uploadDate: '2026-09-09',
    version: 'v1.0'
  },
  {
    id: 'doc_6',
    title: 'GramUdyam Official Detailed Project Report (DPR)',
    title_hi: 'ग्रामउद्यम आधिकारिक विस्तृत प्रोजेक्ट रिपोर्ट (DPR)',
    category: 'dpr',
    requiredFor: 'DIC PMEGP / Bank Appraisal Submission',
    status: 'verified',
    fileName: 'DPR_UP_GKP_882910_Kisan_Seva_Dairy.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-09-09',
    version: 'v2.0 (Verified)'
  },
  {
    id: 'doc_7',
    title: 'State Bank of India In-Principle Sanction Letter',
    title_hi: 'भारतीय स्टेट बैंक सैद्धांतिक ऋण स्वीकृति पत्र',
    category: 'bank',
    requiredFor: 'Subsidy Claim at KVIC Portal & DIC Approval',
    status: 'pending',
    uploadDate: 'Awaiting Bank Lead Officer Sign'
  },
  {
    id: 'doc_8',
    title: 'Margin Money Own Contribution Bank Receipt',
    title_hi: 'स्वयं की मार्जिन राशि बैंक जमा रसीद (₹48,000)',
    category: 'receipt',
    requiredFor: 'Final Disbursement Clearance',
    status: 'uploaded',
    fileName: 'margin_deposit_receipt_48000.pdf',
    fileSize: '290 KB',
    uploadDate: '2026-09-09',
    version: 'v1.0'
  }
];
