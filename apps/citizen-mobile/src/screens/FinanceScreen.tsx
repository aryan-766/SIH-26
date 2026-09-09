/**
 * GramUdyam — Finance & DPR Screen (Entrepreneur)
 * Real-time financial calculations, editable inputs, EMI, scenarios
 */
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { BeneficiaryProfile } from '../services/enterpriseStore';
import { Language, translations } from '../locales';
import {
  calculateDeterministicEmi,
  generateAmortizationSchedule,
  calculateRevenueAndExpenseWaterfall,
  calculateFinancialScenarios,
  DEFAULT_FIXED_ASSETS,
  DEFAULT_FIXED_EXPENSES,
  DEFAULT_PRODUCT_ASSUMPTIONS,
} from '../services/deterministicFinancialEngine';

interface Props {
  userProfile: BeneficiaryProfile;
  lang: Language;
}

export const FinanceScreen: React.FC<Props> = ({ userProfile, lang }) => {
  const isEn = lang === 'en';

  // Editable financial parameters
  const [projectCost, setProjectCost] = useState(480000);
  const [ownContrib, setOwnContrib] = useState(48000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenure, setTenure] = useState(5);
  const [marginPct, setMarginPct] = useState(22);
  const [activeSection, setActiveSection] = useState<'emi' | 'waterfall' | 'scenarios' | 'dpr'>('emi');

  const loanAmount = projectCost - ownContrib;

  // Reactive EMI calculation
  const monthlyEmi = useMemo(() => {
    return calculateDeterministicEmi(loanAmount, interestRate, tenure, 3);
  }, [loanAmount, interestRate, tenure]);

  // Amortization schedule
  const schedule = useMemo(() => {
    return generateAmortizationSchedule(loanAmount, interestRate, tenure, 3, 12);
  }, [loanAmount, interestRate, tenure]);

  const totalInterest = useMemo(() => {
    const totalMonths = tenure * 12 - 3;
    return monthlyEmi * totalMonths - loanAmount;
  }, [monthlyEmi, tenure, loanAmount]);

  // Revenue/Expense waterfall
  const waterfall = useMemo(() => {
    return calculateRevenueAndExpenseWaterfall(
      DEFAULT_PRODUCT_ASSUMPTIONS,
      DEFAULT_FIXED_EXPENSES,
      monthlyEmi
    );
  }, [monthlyEmi]);

  // 3 Scenarios
  const scenarios = useMemo(() => {
    return calculateFinancialScenarios(85000, 24000, 42500, monthlyEmi, projectCost);
  }, [monthlyEmi, projectCost]);

  const formatCurrency = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toFixed(0)}`;
  };

  const sections = [
    { key: 'emi' as const, label: isEn ? 'EMI' : 'ईएमआई', icon: 'calculator' as const },
    { key: 'waterfall' as const, label: isEn ? 'Cash Flow' : 'नकद प्रवाह', icon: 'bar-chart' as const },
    { key: 'scenarios' as const, label: isEn ? 'Scenarios' : 'परिदृश्य', icon: 'layers' as const },
    { key: 'dpr' as const, label: 'DPR', icon: 'document-text' as const },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <Text style={styles.screenTitle}>
          <Ionicons name="calculator" size={20} color={COLORS.primary} />
          {'  '}{isEn ? 'Finance & DPR Hub' : 'वित्त और DPR हब'}
        </Text>

        {/* Editable Project Parameters */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{isEn ? 'Project Parameters' : 'परियोजना मापदंड'}</Text>

          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>{isEn ? 'Project Cost' : 'परियोजना लागत'}</Text>
            <View style={styles.paramInputRow}>
              <Text style={styles.rupee}>₹</Text>
              <TextInput
                style={styles.paramInput}
                keyboardType="number-pad"
                value={String(projectCost)}
                onChangeText={v => setProjectCost(Number(v) || 0)}
              />
            </View>
          </View>

          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>{isEn ? 'Own Contribution' : 'स्वयं योगदान'}</Text>
            <View style={styles.paramInputRow}>
              <Text style={styles.rupee}>₹</Text>
              <TextInput
                style={styles.paramInput}
                keyboardType="number-pad"
                value={String(ownContrib)}
                onChangeText={v => setOwnContrib(Number(v) || 0)}
              />
            </View>
          </View>

          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>{isEn ? 'Interest Rate' : 'ब्याज दर'}</Text>
            <View style={styles.paramInputRow}>
              <TextInput
                style={styles.paramInput}
                keyboardType="decimal-pad"
                value={String(interestRate)}
                onChangeText={v => setInterestRate(Number(v) || 0)}
              />
              <Text style={styles.rupee}>%</Text>
            </View>
          </View>

          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>{isEn ? 'Tenure (years)' : 'अवधि (वर्ष)'}</Text>
            <View style={styles.tenureBtnRow}>
              {[3, 5, 7, 10].map(y => (
                <TouchableOpacity
                  key={y}
                  style={[styles.tenureBtn, tenure === y && styles.tenureBtnActive]}
                  onPress={() => setTenure(y)}
                >
                  <Text style={[styles.tenureBtnText, tenure === y && styles.tenureBtnTextActive]}>{y}Y</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.loanSummaryRow}>
            <View style={styles.loanSummaryItem}>
              <Text style={styles.loanSummaryLabel}>{isEn ? 'Loan Amount' : 'ऋण राशि'}</Text>
              <Text style={styles.loanSummaryValue}>{formatCurrency(loanAmount)}</Text>
            </View>
            <View style={styles.loanSummaryItem}>
              <Text style={styles.loanSummaryLabel}>{isEn ? 'Monthly EMI' : 'मासिक EMI'}</Text>
              <Text style={[styles.loanSummaryValue, { color: COLORS.primary }]}>
                {formatCurrency(monthlyEmi)}
              </Text>
            </View>
          </View>
        </View>

        {/* Section Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectionTabScroll}>
          {sections.map(s => (
            <TouchableOpacity
              key={s.key}
              style={[styles.sectionTab, activeSection === s.key && styles.sectionTabActive]}
              onPress={() => setActiveSection(s.key)}
            >
              <Ionicons name={s.icon} size={14} color={activeSection === s.key ? COLORS.white : COLORS.textSecondary} />
              <Text style={[styles.sectionTabText, activeSection === s.key && styles.sectionTabTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* EMI Section */}
        {activeSection === 'emi' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isEn ? 'EMI Breakdown' : 'EMI विवरण'}</Text>
            <View style={styles.emiGrid}>
              {[
                { label: isEn ? 'Monthly EMI' : 'मासिक EMI', value: formatCurrency(monthlyEmi), color: COLORS.primary },
                { label: isEn ? 'Total Interest' : 'कुल ब्याज', value: formatCurrency(Math.max(0, totalInterest)), color: COLORS.danger },
                { label: isEn ? 'Total Payment' : 'कुल भुगतान', value: formatCurrency(loanAmount + Math.max(0, totalInterest)), color: COLORS.info },
                { label: isEn ? 'Loan Amount' : 'ऋण राशि', value: formatCurrency(loanAmount), color: COLORS.warning },
              ].map((item, i) => (
                <View key={i} style={styles.emiItem}>
                  <Text style={styles.emiLabel}>{item.label}</Text>
                  <Text style={[styles.emiValue, { color: item.color }]}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* Amortization Preview */}
            <Text style={styles.subTitle}>{isEn ? 'Amortization (First 6 months)' : 'ऋण अनुसूची (पहले 6 माह)'}</Text>
            {schedule.slice(0, 6).map((row, i) => (
              <View key={i} style={styles.amortRow}>
                <Text style={styles.amortMonth}>M{row.month}</Text>
                <Text style={styles.amortVal}>P: {formatCurrency(row.principalComponent)}</Text>
                <Text style={styles.amortVal}>I: {formatCurrency(row.interestComponent)}</Text>
                <Text style={[styles.amortVal, { color: COLORS.primary }]}>Bal: {formatCurrency(row.closingPrincipal)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Cash Flow Waterfall */}
        {activeSection === 'waterfall' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isEn ? 'Revenue & Expense Waterfall' : 'राजस्व और व्यय प्रवाह'}</Text>
            {[
              { label: isEn ? 'Revenue' : 'राजस्व', value: waterfall.totalRevenue, color: COLORS.success },
              { label: isEn ? 'COGS' : 'उत्पादन लागत', value: waterfall.totalCogs, color: COLORS.danger },
              { label: isEn ? 'Gross Profit' : 'सकल लाभ', value: waterfall.grossProfit, color: COLORS.primary },
              { label: isEn ? 'Fixed Expenses' : 'स्थिर व्यय', value: waterfall.totalFixedExpenses, color: COLORS.warning },
              { label: isEn ? 'Operating Profit' : 'परिचालन लाभ', value: waterfall.operatingProfit, color: COLORS.info },
              { label: isEn ? 'EMI Deduction' : 'EMI कटौती', value: waterfall.monthlyEmi, color: COLORS.danger },
              { label: isEn ? 'Net Cash Surplus' : 'शुद्ध नकद', value: waterfall.netCashSurplus, color: COLORS.success },
            ].map((item, i) => (
              <View key={i} style={styles.waterfallRow}>
                <Text style={[styles.waterfallMonth, { width: 100 }]}>{item.label}</Text>
                <View style={{ flex: 1 }}>
                  <View style={styles.waterfallBar}>
                    <View style={[styles.waterfallFill, { width: `${Math.min(Math.abs(item.value) / (waterfall.totalRevenue || 1) * 100, 100)}%`, backgroundColor: item.color }]} />
                  </View>
                </View>
                <Text style={[styles.waterfallVal, { color: item.value >= 0 ? COLORS.success : COLORS.danger, fontWeight: '700', width: 60 }]}>
                  {formatCurrency(item.value)}
                </Text>
              </View>
            ))}
            <View style={styles.waterfallSummary}>
              <Text style={styles.subTitle}>{isEn ? 'Break-even:' : 'ब्रेक-ईवन:'}</Text>
              <Text style={[styles.emiValue, { color: COLORS.primary }]}>{waterfall.breakEvenMonths} {isEn ? 'months' : 'माह'}</Text>
            </View>
            <View style={styles.waterfallSummary}>
              <Text style={styles.subTitle}>DSCR:</Text>
              <Text style={[styles.emiValue, { color: waterfall.dscr >= 1.5 ? COLORS.success : COLORS.warning }]}>{waterfall.dscr}x</Text>
            </View>
          </View>
        )}

        {/* Scenario Analysis */}
        {activeSection === 'scenarios' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isEn ? '3-Scenario Analysis' : 'तीन परिदृश्य विश्लेषण'}</Text>
            <View style={styles.paramRow}>
              <Text style={styles.paramLabel}>{isEn ? 'Margin %' : 'मार्जिन %'}</Text>
              <View style={styles.paramInputRow}>
                <TextInput
                  style={styles.paramInput}
                  keyboardType="decimal-pad"
                  value={String(marginPct)}
                  onChangeText={v => setMarginPct(Number(v) || 0)}
                />
                <Text style={styles.rupee}>%</Text>
              </View>
            </View>
            {scenarios.map((sc, i) => (
              <View key={i} style={[styles.scenarioCard, {
                borderLeftColor: i === 0 ? COLORS.danger : i === 1 ? COLORS.warning : COLORS.success
              }]}>
                <Text style={styles.scenarioTitle}>{isEn ? sc.scenarioName : sc.scenarioName_hi}</Text>
                <View style={styles.scenarioRow}>
                  <Text style={styles.scenarioLabel}>{isEn ? 'Revenue' : 'राजस्व'}</Text>
                  <Text style={styles.scenarioValue}>{formatCurrency(sc.monthlyRevenue)}/m</Text>
                </View>
                <View style={styles.scenarioRow}>
                  <Text style={styles.scenarioLabel}>{isEn ? 'Net Surplus' : 'शुद्ध अधिशेष'}</Text>
                  <Text style={[styles.scenarioValue, { color: sc.netCashSurplus >= 0 ? COLORS.success : COLORS.danger }]}>
                    {formatCurrency(sc.netCashSurplus)}/m
                  </Text>
                </View>
                <View style={styles.scenarioRow}>
                  <Text style={styles.scenarioLabel}>{isEn ? 'Break-even' : 'ब्रेक-ईवन'}</Text>
                  <Text style={styles.scenarioValue}>{sc.breakEvenMonths} {isEn ? 'months' : 'माह'}</Text>
                </View>
                <View style={styles.scenarioRow}>
                  <Text style={styles.scenarioLabel}>ROI</Text>
                  <Text style={[styles.scenarioValue, { color: sc.projectRoiPct >= 0 ? COLORS.success : COLORS.danger }]}>{sc.projectRoiPct}%</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* DPR Section */}
        {activeSection === 'dpr' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isEn ? 'Detailed Project Report' : 'विस्तृत परियोजना रिपोर्ट'}</Text>

            {/* Asset Schedule */}
            <Text style={styles.subTitle}>{isEn ? 'Asset Schedule' : 'परिसंपत्ति अनुसूची'}</Text>
            {DEFAULT_FIXED_ASSETS.map((asset, i) => (
              <View key={i} style={styles.assetRow}>
                <Ionicons name="cube-outline" size={14} color={COLORS.textMuted} />
                <Text style={[styles.assetName, { flex: 1 }]}>{asset.name}</Text>
                <Text style={styles.assetCost}>{formatCurrency(asset.amount)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{isEn ? 'Total Assets' : 'कुल संपत्ति'}</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(DEFAULT_FIXED_ASSETS.reduce((s, a) => s + a.amount, 0))}
              </Text>
            </View>

            {/* Operating Expenses */}
            <Text style={styles.subTitle}>{isEn ? 'Monthly Operating Expenses' : 'मासिक परिचालन व्यय'}</Text>
            {DEFAULT_FIXED_EXPENSES.map((exp, i) => (
              <View key={i} style={styles.assetRow}>
                <Ionicons name="remove-circle-outline" size={14} color={COLORS.danger} />
                <Text style={[styles.assetName, { flex: 1 }]}>{exp.name}</Text>
                <Text style={[styles.assetCost, { color: COLORS.danger }]}>{formatCurrency(exp.monthlyAmount)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SPACING.lg },
  screenTitle: { fontSize: FONT.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.lg },

  card: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.lg,
    marginBottom: SPACING.lg, ...SHADOW.sm,
  },
  cardTitle: { fontSize: FONT.sizes.lg, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.md },
  subTitle: {
    fontSize: FONT.sizes.sm, fontWeight: '700', color: COLORS.textSecondary,
    marginTop: SPACING.lg, marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 0.5,
  },

  paramRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md,
  },
  paramLabel: { fontSize: FONT.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  paramInputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.sm,
  },
  paramInput: { fontSize: FONT.sizes.md, fontWeight: '700', color: COLORS.textPrimary, paddingVertical: SPACING.sm, minWidth: 80, textAlign: 'right' },
  rupee: { fontSize: FONT.sizes.md, fontWeight: '700', color: COLORS.textMuted },

  tenureBtnRow: { flexDirection: 'row', gap: SPACING.sm },
  tenureBtn: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border,
  },
  tenureBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tenureBtnText: { fontSize: FONT.sizes.sm, fontWeight: '700', color: COLORS.textSecondary },
  tenureBtnTextActive: { color: COLORS.white },

  loanSummaryRow: {
    flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md,
    backgroundColor: COLORS.primaryBg, borderRadius: RADIUS.md, padding: SPACING.md,
  },
  loanSummaryItem: { flex: 1, alignItems: 'center' },
  loanSummaryLabel: { fontSize: FONT.sizes.xs, color: COLORS.textMuted },
  loanSummaryValue: { fontSize: FONT.sizes.xl, fontWeight: '800', color: COLORS.textPrimary, marginTop: 2 },

  sectionTabScroll: { marginBottom: SPACING.lg, flexGrow: 0 },
  sectionTab: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, backgroundColor: COLORS.card, borderWidth: 1,
    borderColor: COLORS.border, marginRight: SPACING.sm,
  },
  sectionTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  sectionTabText: { fontSize: FONT.sizes.sm, fontWeight: '700', color: COLORS.textSecondary },
  sectionTabTextActive: { color: COLORS.white },

  emiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  emiItem: {
    flexBasis: '46%', flexGrow: 1, backgroundColor: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.md,
  },
  emiLabel: { fontSize: FONT.sizes.xs, color: COLORS.textMuted },
  emiValue: { fontSize: FONT.sizes.lg, fontWeight: '800', color: COLORS.textPrimary, marginTop: 2 },

  amortRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  amortMonth: { fontSize: FONT.sizes.sm, fontWeight: '700', color: COLORS.textPrimary, width: 30 },
  amortVal: { fontSize: FONT.sizes.xs, color: COLORS.textSecondary },

  waterfallRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  waterfallMonth: { fontSize: FONT.sizes.xs, fontWeight: '700', color: COLORS.textPrimary, width: 24 },
  waterfallBar: { height: 6, backgroundColor: COLORS.shimmer, borderRadius: 3, overflow: 'hidden' },
  waterfallFill: { height: 6, borderRadius: 3 },
  waterfallVal: { fontSize: 9, color: COLORS.textSecondary, width: 45, textAlign: 'right' },
  waterfallSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md },

  scenarioCard: {
    backgroundColor: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.md,
    marginBottom: SPACING.sm, borderLeftWidth: 4,
  },
  scenarioTitle: { fontSize: FONT.sizes.md, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  scenarioRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  scenarioLabel: { fontSize: FONT.sizes.sm, color: COLORS.textSecondary },
  scenarioValue: { fontSize: FONT.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },

  assetRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  assetName: { fontSize: FONT.sizes.sm, color: COLORS.textPrimary },
  assetCost: { fontSize: FONT.sizes.sm, fontWeight: '700', color: COLORS.primary },

  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingTop: SPACING.md,
    borderTopWidth: 2, borderTopColor: COLORS.primary, marginTop: SPACING.sm,
  },
  totalLabel: { fontSize: FONT.sizes.md, fontWeight: '800', color: COLORS.textPrimary },
  totalValue: { fontSize: FONT.sizes.md, fontWeight: '800', color: COLORS.primary },
});
