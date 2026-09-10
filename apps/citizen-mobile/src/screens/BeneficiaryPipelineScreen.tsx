/**
 * GramUdyam — Beneficiary Pipeline & DPR Audit Screen
 * 46 Cases lifecycle tracking, document audit, and bank sanction forwarding
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { OfficerProfile } from '../services/enterpriseStore';
import { Language } from '../locales';

interface Props {
  officerProfile: OfficerProfile | null;
  lang: Language;
}

interface BeneficiaryCase {
  id: string;
  applicantName: string;
  phone: string;
  businessName: string;
  category: string;
  villageName: string;
  projectCost: number;
  loanRequested: number;
  subsidyEligible: number;
  allocatedScheme: string;
  dprScore: number;
  stage: 'discovery' | 'feasibility' | 'dpr_ready' | 'bank_scrutiny' | 'disbursed';
  docsVerified: number;
  totalDocs: number;
  repaymentHealth: 'healthy' | 'watch' | 'at_risk';
  appliedDate: string;
}

const SEED_CASES: BeneficiaryCase[] = [
  {
    id: 'app_101',
    applicantName: 'Ramesh Kumar Yadav',
    phone: '9876543210',
    businessName: 'Dairy Farming & Chilling Unit',
    category: 'Dairy & Livestock',
    villageName: 'Bhiti Rawat',
    projectCost: 480000,
    loanRequested: 432000,
    subsidyEligible: 168000,
    allocatedScheme: 'PMEGP (35% Rural Subsidy)',
    dprScore: 92,
    stage: 'bank_scrutiny',
    docsVerified: 5,
    totalDocs: 5,
    repaymentHealth: 'healthy',
    appliedDate: '02 Sep 2026',
  },
  {
    id: 'app_102',
    applicantName: 'Suresh Patil',
    phone: '9876501234',
    businessName: 'High-Tech Polyhouse Floriculture',
    category: 'Agro & Horticulture',
    villageName: 'Sahjanwa Khas',
    projectCost: 650000,
    loanRequested: 520000,
    subsidyEligible: 195000,
    allocatedScheme: 'Agri-Infrastructure Fund (AIF)',
    dprScore: 88,
    stage: 'dpr_ready',
    docsVerified: 4,
    totalDocs: 5,
    repaymentHealth: 'healthy',
    appliedDate: '04 Sep 2026',
  },
  {
    id: 'app_103',
    applicantName: 'Priya Devi',
    phone: '9876512345',
    businessName: 'Zari Handloom & Rural Weaving Center',
    category: 'Textiles & Handloom',
    villageName: 'Ghaghrasur',
    projectCost: 220000,
    loanRequested: 180000,
    subsidyEligible: 77000,
    allocatedScheme: 'PM Vishwakarma Scheme',
    dprScore: 85,
    stage: 'feasibility',
    docsVerified: 3,
    totalDocs: 4,
    repaymentHealth: 'watch',
    appliedDate: '06 Sep 2026',
  },
  {
    id: 'app_104',
    applicantName: 'Mahendra Chauhan',
    phone: '9811223344',
    businessName: 'Solar Rooftop & Inverter Repair Shop',
    category: 'Technical Services',
    villageName: 'Pipraich Khurd',
    projectCost: 190000,
    loanRequested: 150000,
    subsidyEligible: 50000,
    allocatedScheme: 'PM MUDRA Kishor',
    dprScore: 91,
    stage: 'disbursed',
    docsVerified: 5,
    totalDocs: 5,
    repaymentHealth: 'healthy',
    appliedDate: '18 Aug 2026',
  },
  {
    id: 'app_105',
    applicantName: 'Anita Bind',
    phone: '9922334455',
    businessName: 'Mustard Oil Expeller & Atta Chakkki',
    category: 'Food Processing',
    villageName: 'Campierganj Dehat',
    projectCost: 350000,
    loanRequested: 280000,
    subsidyEligible: 122500,
    allocatedScheme: 'PMFME Micro Food Scheme',
    dprScore: 79,
    stage: 'discovery',
    docsVerified: 2,
    totalDocs: 5,
    repaymentHealth: 'at_risk',
    appliedDate: '08 Sep 2026',
  },
];

export const BeneficiaryPipelineScreen: React.FC<Props> = ({ officerProfile, lang }) => {
  const isEn = lang === 'en';
  const [cases, setCases] = useState<BeneficiaryCase[]>(SEED_CASES);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<BeneficiaryCase | null>(null);

  const stageCounts = {
    all: 46,
    discovery: 12,
    feasibility: 9,
    dpr_ready: 11,
    bank_scrutiny: 8,
    disbursed: 6,
  };

  const handleApprove = (appId: string) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === appId
          ? {
              ...c,
              stage: c.stage === 'dpr_ready' ? 'bank_scrutiny' : 'disbursed',
              docsVerified: c.totalDocs,
            }
          : c
      )
    );
    Alert.alert(
      isEn ? 'Approved' : 'स्वीकृत',
      isEn
        ? 'Application endorsed and forwarded to PNB Sahjanwa Branch manager.'
        : 'आवेदन को संस्तुत कर पीएनबी सहजनवा शाखा प्रबंधक को अग्रसारित कर दिया गया।'
    );
  };

  const filteredCases = cases.filter((c) => {
    const matchSearch =
      c.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.villageName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStage = stageFilter === 'all' || c.stage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header with 46 badge */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerIcon}>
              <Ionicons name="people" size={22} color={COLORS.white} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>
                    {isEn ? 'DPR AUDIT PIPELINE' : 'DPR ऑडिट पाइपलाइन'}
                  </Text>
                </View>
                <View style={styles.countPill}>
                  <Text style={styles.countPillText}>46 {isEn ? 'Cases' : 'मामले'}</Text>
                </View>
              </View>
              <Text style={styles.headerTitle}>
                {isEn ? 'Beneficiary Lifecycle Audit' : 'लाभार्थी जीवनचक्र एवं ऋण संस्तुति'}
              </Text>
              <Text style={styles.headerSub}>
                {isEn
                  ? 'Verify DPRs, land documents, and endorse subsidies'
                  : 'DPR, भूमि अभिलेखों का सत्यापन एवं सब्सिडी अनुमोदन'}
              </Text>
            </View>
          </View>

          {/* Pipeline Stage Funnel Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stageScroll}>
            {[
              { key: 'all', label: isEn ? 'All' : 'सभी', count: stageCounts.all, color: COLORS.textPrimary },
              { key: 'discovery', label: isEn ? 'Discover' : 'खोज', count: stageCounts.discovery, color: '#64748b' },
              { key: 'feasibility', label: isEn ? 'Survey' : 'सर्वे', count: stageCounts.feasibility, color: '#0284c7' },
              { key: 'dpr_ready', label: isEn ? 'DPR Ready' : 'DPR तैयार', count: stageCounts.dpr_ready, color: '#8b5cf6' },
              { key: 'bank_scrutiny', label: isEn ? 'Bank Review' : 'बैंक समीक्षा', count: stageCounts.bank_scrutiny, color: '#f59e0b' },
              { key: 'disbursed', label: isEn ? 'Disbursed' : 'वितरित', count: stageCounts.disbursed, color: '#10b981' },
            ].map((st) => (
              <TouchableOpacity
                key={st.key}
                style={[styles.stageChip, stageFilter === st.key && styles.stageChipActive]}
                onPress={() => setStageFilter(st.key)}
              >
                <Text
                  style={[
                    styles.stageCount,
                    { color: stageFilter === st.key ? COLORS.white : st.color },
                  ]}
                >
                  {st.count}
                </Text>
                <Text
                  style={[
                    styles.stageLabel,
                    stageFilter === st.key && styles.stageLabelActive,
                  ]}
                >
                  {st.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={COLORS.textTertiary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={isEn ? 'Search entrepreneur, village...' : 'उद्यमी, गाँव का नाम खोजें...'}
            placeholderTextColor={COLORS.textTertiary}
          />
        </View>

        {/* Pipeline Case Cards */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>
            {isEn ? 'Applications Under Audit' : 'ऑडिट अधीन आवेदन'} ({filteredCases.length})
          </Text>

          {filteredCases.map((item) => (
            <View key={item.id} style={styles.caseCard}>
              <View style={styles.caseTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.applicantName}>{item.applicantName}</Text>
                  <Text style={styles.businessTitle}>{item.businessName}</Text>
                  <Text style={styles.metaText}>
                    📍 {item.villageName} • 📞 {item.phone}
                  </Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.dprScoreVal}>{item.dprScore}%</Text>
                  <Text style={styles.dprScoreLbl}>DPR SCORE</Text>
                </View>
              </View>

              {/* Financial Metrics Strip */}
              <View style={styles.financeStrip}>
                <View style={styles.finCol}>
                  <Text style={styles.finLbl}>{isEn ? 'Cost' : 'परियोजना'}</Text>
                  <Text style={styles.finVal}>₹{(item.projectCost / 100000).toFixed(1)}L</Text>
                </View>
                <View style={styles.finCol}>
                  <Text style={styles.finLbl}>{isEn ? 'Loan' : 'ऋण'}</Text>
                  <Text style={[styles.finVal, { color: COLORS.primary }]}>
                    ₹{(item.loanRequested / 100000).toFixed(1)}L
                  </Text>
                </View>
                <View style={styles.finCol}>
                  <Text style={styles.finLbl}>{isEn ? 'Subsidy' : 'सब्सिडी'}</Text>
                  <Text style={[styles.finVal, { color: '#047857' }]}>
                    ₹{(item.subsidyEligible / 1000).toFixed(0)}K
                  </Text>
                </View>
                <View style={styles.finCol}>
                  <Text style={styles.finLbl}>{isEn ? 'Docs' : 'कागजात'}</Text>
                  <Text
                    style={[
                      styles.finVal,
                      { color: item.docsVerified === item.totalDocs ? '#047857' : '#d97706' },
                    ]}
                  >
                    {item.docsVerified}/{item.totalDocs} ✓
                  </Text>
                </View>
              </View>

              {/* Scheme Tag & Actions */}
              <View style={styles.caseFooter}>
                <View style={styles.schemeTag}>
                  <Ionicons name="ribbon-outline" size={12} color="#4338ca" />
                  <Text style={styles.schemeText}>{item.allocatedScheme}</Text>
                </View>

                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleApprove(item.id)}
                >
                  <Ionicons name="shield-checkmark" size={12} color={COLORS.white} />
                  <Text style={styles.approveBtnText}>
                    {item.stage === 'disbursed'
                      ? (isEn ? 'Disbursed' : 'वितरित')
                      : (isEn ? 'Endorse & Forward' : 'संस्तुत करें')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  header: {
    backgroundColor: '#1e1b4b',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  activeBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#c7d2fe',
  },
  countPill: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  countPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
  },
  headerTitle: {
    fontSize: FONT.md,
    fontWeight: '800',
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 10,
    color: '#c7d2fe',
  },
  stageScroll: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    gap: 6,
  },
  stageChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    marginRight: 6,
  },
  stageChipActive: {
    backgroundColor: COLORS.accent,
  },
  stageCount: {
    fontSize: 14,
    fontWeight: '900',
  },
  stageLabel: {
    fontSize: 9,
    color: '#cbd5e1',
    fontWeight: '600',
    marginTop: 1,
  },
  stageLabelActive: {
    color: COLORS.white,
  },
  searchBar: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    height: 40,
    gap: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  listSection: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  caseCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  caseTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  applicantName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  businessTitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  metaText: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  scoreContainer: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  dprScoreVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#047857',
  },
  dprScoreLbl: {
    fontSize: 8,
    fontWeight: '800',
    color: '#047857',
  },
  financeStrip: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.md,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  finCol: {
    flex: 1,
    alignItems: 'center',
  },
  finLbl: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  finVal: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  schemeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    maxWidth: '55%',
  },
  schemeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3730a3',
  },
  approveBtn: {
    backgroundColor: '#1e1b4b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  approveBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
});
