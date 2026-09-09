/**
 * GramUdyam — Scheme Monitoring & Subsidies Screen
 * Credit targets, absorption rate, subsidy tracking, and central/state scheme audits
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { OfficerProfile } from '../services/enterpriseStore';
import { PAN_INDIA_GOV_SCHEMES } from '../services/panIndiaSchemesData';
import { Language } from '../locales';

interface Props {
  officerProfile: OfficerProfile | null;
  lang: Language;
}

export const SchemeMonitoringScreen: React.FC<Props> = ({ officerProfile, lang }) => {
  const isEn = lang === 'en';
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const summary = {
    totalAllocatedCr: 115.0,
    totalDisbursedCr: 95.7,
    utilizationRatePct: 83.2,
    beneficiariesFinanced: 3487,
    pendingClearances: 182,
  };

  const categories = [
    { key: 'all', label: isEn ? 'All Schemes' : 'सभी योजनाएं' },
    { key: 'agro', label: isEn ? 'Agro & Food' : 'कृषि व खाद्य' },
    { key: 'msme', label: isEn ? 'MSME Credit' : 'MSME ऋण' },
    { key: 'livestock', label: isEn ? 'Dairy & Allied' : 'डेयरी व पशुपालन' },
  ];

  const filteredSchemes = PAN_INDIA_GOV_SCHEMES.filter((s) => {
    const name = (s.name as any)[lang] || s.name.hi || s.name.en;
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerIcon}>
              <Ionicons name="ribbon" size={22} color={COLORS.white} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.badgeRow}>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>
                    {isEn ? 'DISTRICT WELFARE SUBSIDY AUDIT' : 'ज़िला कल्याणकारी योजना सब्सिडी ऑडिट'}
                  </Text>
                </View>
              </View>
              <Text style={styles.headerTitle}>
                {isEn ? 'Scheme Credit & Subsidy Monitoring' : 'योजना ऋण एवं सब्सिडी मॉनिटरिंग'}
              </Text>
              <Text style={styles.headerSub}>
                {officerProfile?.district || 'Gorakhpur'} • FY 2025-26
              </Text>
            </View>
          </View>

          {/* Top 4 KPI Summary Grid */}
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLbl}>
                {isEn ? 'Credit Allocated' : 'कुल ऋण लक्ष्य'}
              </Text>
              <Text style={styles.kpiVal}>₹{summary.totalAllocatedCr} Cr</Text>
              <Text style={styles.kpiSub}>FY 2025-26</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLbl}>
                {isEn ? 'Disbursed Fund' : 'वितरित राशि'}
              </Text>
              <Text style={[styles.kpiVal, { color: '#10b981' }]}>
                ₹{summary.totalDisbursedCr} Cr
              </Text>
              <Text style={[styles.kpiSub, { color: '#10b981' }]}>
                {summary.utilizationRatePct}% {isEn ? 'absorbed' : 'अवशोषण'}
              </Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLbl}>
                {isEn ? 'Beneficiaries' : 'लाभार्थी'}
              </Text>
              <Text style={styles.kpiVal}>
                {summary.beneficiariesFinanced.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.kpiSub}>{isEn ? 'Enterprises' : 'उद्यम स्थापित'}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLbl}>
                {isEn ? 'Pending Clear' : 'लंबित सब्सिडी'}
              </Text>
              <Text style={[styles.kpiVal, { color: '#f59e0b' }]}>
                {summary.pendingClearances}
              </Text>
              <Text style={styles.kpiSub}>{isEn ? 'Awaiting Signoff' : 'अनुमोदन प्रतीक्षित'}</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={COLORS.textTertiary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={isEn ? 'Search scheme by name or code...' : 'योजना का नाम या कोड खोजें...'}
            placeholderTextColor={COLORS.textTertiary}
          />
        </View>

        {/* Scheme List */}
        <View style={styles.schemeSection}>
          <Text style={styles.sectionTitle}>
            {isEn ? 'Active Central & State Schemes' : 'सक्रिय केंद्रीय व राज्य योजनाएं'} ({filteredSchemes.length})
          </Text>

          {filteredSchemes.map((s) => {
            const schemeName = (s.name as any)[lang] || s.name.hi || s.name.en;
            const subsidyText = (s.subsidyDisplay as any)[lang] || s.subsidyDisplay.hi || s.subsidyDisplay.en;
            const ministryText = (s.ministry as any)[lang] || s.ministry.hi || s.ministry.en;
            const maxLoanText = (s.maxLoanDisplay as any)[lang] || s.maxLoanDisplay.hi || s.maxLoanDisplay.en;
            const badgeText = (s.badge as any)[lang] || s.badge.hi || s.badge.en;

            return (
              <View key={s.id} style={styles.schemeCard}>
                <View style={styles.schemeTop}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.codeRow}>
                      <Text style={styles.codeBadge}>{s.code}</Text>
                      <Text style={styles.tagBadge}>{badgeText}</Text>
                    </View>
                    <Text style={styles.schemeName}>{schemeName}</Text>
                    <Text style={styles.ministryText}>🏛️ {ministryText}</Text>
                  </View>
                  <View style={styles.subsidyPill}>
                    <Text style={styles.subsidyPillText}>
                      {s.subsidyRateRural > 0
                        ? `${s.subsidyRateSpecial || s.subsidyRateRural}% Subsidy`
                        : 'Subvention'}
                    </Text>
                  </View>
                </View>

                {/* Limits & Benefit Strip */}
                <View style={styles.benefitGrid}>
                  <View style={styles.benefitBox}>
                    <Text style={styles.benefitLbl}>{isEn ? 'MAX LIMIT' : 'अधिकतम सीमा'}</Text>
                    <Text style={styles.benefitVal} numberOfLines={1}>{maxLoanText}</Text>
                  </View>
                  <View style={[styles.benefitBox, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
                    <Text style={[styles.benefitLbl, { color: '#047857' }]}>
                      {isEn ? 'SUBSIDY BENEFIT' : 'सब्सिडी लाभ'}
                    </Text>
                    <Text style={[styles.benefitVal, { color: '#047857' }]} numberOfLines={1}>
                      {subsidyText}
                    </Text>
                  </View>
                </View>

                {/* Footer with Portal Link & Collateral Indicator */}
                <View style={styles.schemeFooter}>
                  <Text style={styles.collateralText}>
                    {s.collateralFree
                      ? (isEn ? '✓ 100% Collateral-Free' : '✓ शत-प्रतिशत गारंटी मुक्त')
                      : (isEn ? '• Priority Sector Loan' : '• प्राथमिक क्षेत्र ऋण')}
                  </Text>
                  <TouchableOpacity
                    style={styles.portalLink}
                    onPress={() => Linking.openURL(s.officialPortal).catch(() => {})}
                  >
                    <Text style={styles.portalLinkText}>{s.portalName}</Text>
                    <Ionicons name="open-outline" size={11} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: '#0c4a6e',
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
    marginBottom: 2,
  },
  badgePill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#bae6fd',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: FONT.md,
    fontWeight: '800',
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 10,
    color: '#bae6fd',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: SPACING.sm,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  kpiLbl: {
    fontSize: 9,
    color: '#e0f2fe',
  },
  kpiVal: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.white,
    marginTop: 2,
  },
  kpiSub: {
    fontSize: 8,
    color: '#bae6fd',
    marginTop: 1,
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
  schemeSection: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  schemeCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  schemeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  codeBadge: {
    fontSize: 9,
    fontWeight: '900',
    fontFamily: 'monospace',
    backgroundColor: '#f0fdf4',
    color: '#166534',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  tagBadge: {
    fontSize: 9,
    fontWeight: '700',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  schemeName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  ministryText: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  subsidyPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  subsidyPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803d',
  },
  benefitGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  benefitBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.sm,
    padding: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  benefitLbl: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
  },
  benefitVal: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  schemeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  collateralText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  portalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  portalLinkText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
