/**
 * GramUdyam — Overview Dashboard Screen (Entrepreneur)
 * Business journey, summary metrics, GIS snapshot
 */
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { BeneficiaryProfile } from '../services/enterpriseStore';
import { Language, translations } from '../locales';

interface Props {
  userProfile: BeneficiaryProfile;
  lang: Language;
}

export const OverviewScreen: React.FC<Props> = ({ userProfile, lang }) => {
  const isEn = lang === 'en';
  const t = translations[lang] || translations.hi;

  const journeyStages = [
    { id: 'discover', title: isEn ? 'Discover' : 'खोज', status: 'completed', icon: 'compass' as const },
    { id: 'compare', title: isEn ? 'Compare' : 'तुलना', status: 'completed', icon: 'git-compare' as const },
    { id: 'select', title: isEn ? 'Select' : 'चयन', status: 'completed', icon: 'checkmark-circle' as const },
    { id: 'dpr', title: 'DPR', status: 'completed', icon: 'document-text' as const },
    { id: 'scheme', title: isEn ? 'Scheme' : 'योजना', status: 'completed', icon: 'ribbon' as const },
    { id: 'loan', title: isEn ? 'Loan' : 'ऋण', status: 'in_progress', icon: 'cash' as const },
    { id: 'launch', title: isEn ? 'Launch' : 'शुरुआत', status: 'pending', icon: 'rocket' as const },
    { id: 'operate', title: isEn ? 'Operate' : 'संचालन', status: 'pending', icon: 'cog' as const },
    { id: 'repay', title: isEn ? 'Repay' : 'अदायगी', status: 'pending', icon: 'card' as const },
    { id: 'grow', title: isEn ? 'Grow' : 'विस्तार', status: 'pending', icon: 'trending-up' as const },
  ];

  const summaryCards = [
    { label: isEn ? 'Opportunity Score' : 'अवसर स्कोर', value: '82/100', icon: 'star', color: COLORS.warning },
    { label: isEn ? 'Project Cost' : 'परियोजना लागत', value: '₹4.80L', icon: 'wallet', color: COLORS.info },
    { label: isEn ? 'Own Contribution' : 'स्वयं योगदान', value: '₹48,000', icon: 'cash', color: COLORS.primary },
    { label: isEn ? 'Loan Required' : 'ऋण आवश्यक', value: '₹4.32L', icon: 'card', color: COLORS.accent },
    { label: isEn ? 'Monthly Revenue' : 'मासिक राजस्व', value: '₹85,000', icon: 'trending-up', color: COLORS.success },
    { label: isEn ? 'Monthly Profit' : 'मासिक लाभ', value: '₹18,500', icon: 'sparkles', color: COLORS.primary },
    { label: isEn ? 'Break-even' : 'ब्रेक-ईवन', value: isEn ? '14 months' : '14 माह', icon: 'timer', color: COLORS.warning },
    { label: isEn ? 'Repayment Health' : 'अदायगी स्वास्थ्य', value: isEn ? 'Good' : 'अच्छा', icon: 'heart', color: COLORS.success },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userProfile.fullName.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{userProfile.fullName}</Text>
            <Text style={styles.profileBiz}>
              {userProfile.selectedBizName} • {userProfile.districtName}
            </Text>
          </View>
          <View style={[styles.statusBadge, 
            userProfile.businessStatus === 'Operational' ? { backgroundColor: '#dcfce7' } : { backgroundColor: '#fef3c7' }
          ]}>
            <Text style={[styles.statusText,
              userProfile.businessStatus === 'Operational' ? { color: COLORS.success } : { color: COLORS.warning }
            ]}>
              {userProfile.businessStatus}
            </Text>
          </View>
        </View>

        {/* Business Journey Timeline */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="map" size={14} color={COLORS.primary} />
            {'  '}{isEn ? 'Business Journey' : 'व्यापार यात्रा'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.journeyRow}>
            {journeyStages.map((stage, i) => (
              <View key={stage.id} style={styles.journeyItem}>
                <View style={[
                  styles.journeyDot,
                  stage.status === 'completed' && styles.journeyDotCompleted,
                  stage.status === 'in_progress' && styles.journeyDotProgress,
                ]}>
                  <Ionicons
                    name={stage.status === 'completed' ? 'checkmark' : (stage.icon as any)}
                    size={12}
                    color={stage.status === 'pending' ? COLORS.textMuted : COLORS.white}
                  />
                </View>
                <Text style={[styles.journeyLabel,
                  stage.status === 'completed' && { color: COLORS.primary, fontWeight: '700' },
                  stage.status === 'in_progress' && { color: COLORS.warning, fontWeight: '700' },
                ]}>
                  {stage.title}
                </Text>
                {i < journeyStages.length - 1 && (
                  <View style={[styles.journeyLine,
                    stage.status === 'completed' && { backgroundColor: COLORS.primary },
                  ]} />
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Summary Cards Grid */}
        <Text style={styles.sectionTitle}>
          <Ionicons name="bar-chart" size={14} color={COLORS.primary} />
          {'  '}{isEn ? 'Business Snapshot' : 'व्यापार स्नैपशॉट'}
        </Text>
        <View style={styles.cardGrid}>
          {summaryCards.map((card, i) => (
            <View key={i} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: card.color + '18' }]}>
                <Ionicons name={card.icon as any} size={18} color={card.color} />
              </View>
              <Text style={styles.metricValue}>{card.value}</Text>
              <Text style={styles.metricLabel}>{card.label}</Text>
            </View>
          ))}
        </View>

        {/* Location Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="location" size={14} color={COLORS.danger} />
            {'  '}{isEn ? 'Location' : 'स्थान'}
          </Text>
          <View style={styles.locationRow}>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>{isEn ? 'State' : 'राज्य'}</Text>
              <Text style={styles.locationValue}>{userProfile.stateCode}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>{isEn ? 'District' : 'जिला'}</Text>
              <Text style={styles.locationValue}>{userProfile.districtName}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>{isEn ? 'Village' : 'गाँव'}</Text>
              <Text style={styles.locationValue}>{userProfile.villageName}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SPACING.lg },
  profileHeader: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.lg,
    marginBottom: SPACING.lg, ...SHADOW.md,
  },
  avatarCircle: {
    width: 48, height: 48, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: FONT.sizes.xl, fontWeight: '800', color: COLORS.primary },
  profileName: { fontSize: FONT.sizes.lg, fontWeight: '800', color: COLORS.textPrimary },
  profileBiz: { fontSize: FONT.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.full },
  statusText: { fontSize: FONT.sizes.xs, fontWeight: '700' },

  sectionCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.lg,
    marginBottom: SPACING.lg, ...SHADOW.sm,
  },
  sectionTitle: {
    fontSize: FONT.sizes.sm, fontWeight: '800', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.md,
  },

  journeyRow: { paddingVertical: SPACING.sm, gap: 0, alignItems: 'flex-start' },
  journeyItem: { alignItems: 'center', width: 56, position: 'relative' },
  journeyDot: {
    width: 26, height: 26, borderRadius: RADIUS.full,
    backgroundColor: COLORS.shimmer, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.border,
  },
  journeyDotCompleted: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  journeyDotProgress: { backgroundColor: COLORS.warning, borderColor: COLORS.warning },
  journeyLabel: { fontSize: 8, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
  journeyLine: {
    position: 'absolute', top: 12, left: 41, width: 15, height: 2,
    backgroundColor: COLORS.border,
  },

  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  metricCard: {
    width: '48%' as any, backgroundColor: COLORS.card, borderRadius: RADIUS.lg,
    padding: SPACING.md, ...SHADOW.sm, flexGrow: 1, flexBasis: '46%',
  },
  metricIcon: {
    width: 32, height: 32, borderRadius: RADIUS.md,
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm,
  },
  metricValue: { fontSize: FONT.sizes.xl, fontWeight: '800', color: COLORS.textPrimary },
  metricLabel: { fontSize: FONT.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  locationRow: { flexDirection: 'row', gap: SPACING.sm },
  locationItem: {
    flex: 1, backgroundColor: COLORS.bg, borderRadius: RADIUS.md, padding: SPACING.md,
  },
  locationLabel: { fontSize: FONT.sizes.xs, color: COLORS.textMuted, marginBottom: 2 },
  locationValue: { fontSize: FONT.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },
});
