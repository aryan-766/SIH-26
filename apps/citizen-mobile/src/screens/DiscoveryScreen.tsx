/**
 * GramUdyam — Discovery Screen (Entrepreneur)
 * Business opportunities, Comparison Matrix, and Facility Proximity Radar
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { BeneficiaryProfile } from '../services/enterpriseStore';
import { Language } from '../locales';

interface Props {
  userProfile: BeneficiaryProfile;
  lang: Language;
}

type DiscoveryTab = 'opportunities' | 'radar' | 'compare';

const DEFAULT_OPPORTUNITIES = [
  {
    id: 'dairy_farming',
    name: 'Dairy Farming & Bulk Milk Chilling Center',
    name_hi: 'डेयरी फार्मिंग एवं दुग्ध शीतलन केंद्र',
    sector: 'Livestock & Agro Allied',
    sector_hi: 'पशुधन एवं कृषि संबंधित',
    capital: 480000,
    margin: 21.8,
    risk: 'Low-Moderate',
    risk_hi: 'कम-मध्यम',
    score: 96,
    equipment: ['BMC Chilling Unit (200L)', 'Milking Machine', 'Milk Analyzer', 'Inverter Backup'],
    scheme: 'PMEGP (35% Subsidy) + AHIDF',
  },
  {
    id: 'food_processing',
    name: 'Mustard Oil Expeller & Flour Processing Unit',
    name_hi: 'सरसों तेल स्पेलर एवं आटा चक्की प्रसंस्करण',
    sector: 'Food Processing',
    sector_hi: 'खाद्य प्रसंस्करण',
    capital: 350000,
    margin: 24.5,
    risk: 'Low',
    risk_hi: 'निम्न',
    score: 91,
    equipment: ['Cold Press Oil Expeller', 'Flour Pulverizer', 'Packaging Sealer', 'Weighing Scale'],
    scheme: 'PMFME (35% Credit-linked Grant)',
  },
  {
    id: 'solar_ev',
    name: 'Solar Rooftop & EV E-Rickshaw Repair Center',
    name_hi: 'सोलर रूफटॉप एवं ई-रिक्शा सर्विस सेंटर',
    sector: 'Clean Energy',
    sector_hi: 'स्वच्छ ऊर्जा',
    capital: 220000,
    margin: 28.0,
    risk: 'Moderate',
    risk_hi: 'मध्यम',
    score: 87,
    equipment: ['Digital Multimeter', 'Battery Tester', 'Tooling Kit', 'Soldering Station'],
    scheme: 'PM MUDRA Kishor (Zero Collateral)',
  },
  {
    id: 'mushroom',
    name: 'Oyster & Button Mushroom Cultivation',
    name_hi: 'ऑयस्टर एवं बटन मशरूम उत्पादन इकाई',
    sector: 'Horticulture',
    sector_hi: 'बागवानी',
    capital: 180000,
    margin: 32.0,
    risk: 'Moderate',
    risk_hi: 'मध्यम',
    score: 84,
    equipment: ['Autoclave', 'Humidifier System', 'Incubation Racks', 'Sterilizer'],
    scheme: 'MIDH Scheme',
  },
  {
    id: 'honey',
    name: 'Organic Honey Extraction & Apiary Farm',
    name_hi: 'शुद्ध शहद निष्कर्षण एवं मधुमक्खी पालन',
    sector: 'Forest Produce',
    sector_hi: 'वन उत्पाद',
    capital: 150000,
    margin: 30.0,
    risk: 'Low',
    risk_hi: 'निम्न',
    score: 89,
    equipment: ['Bee Boxes (50)', 'Honey Extractor', 'Wax Roller', 'Food Grade Jars'],
    scheme: 'KVIC Honey Mission',
  },
  {
    id: 'garment',
    name: 'Rural Garment & School Uniform Unit',
    name_hi: 'ग्रामीण वस्त्र एवं स्कूल यूनिफॉर्म सिलाई',
    sector: 'Textile',
    sector_hi: 'वस्त्र उद्योग',
    capital: 190000,
    margin: 26.5,
    risk: 'Low',
    risk_hi: 'निम्न',
    score: 85,
    equipment: ['Sewing Machines (4)', 'Overlock Machine', 'Cutting Table', 'Steam Iron'],
    scheme: 'PM Vishwakarma Scheme',
  },
];

const PROXIMITY_FACILITIES = [
  { name: 'Sahjanwa Bulk Milk Chilling Center (BMC)', distanceKm: 3.2, travelMins: 8, status: 'Active (24x7)', icon: 'cube' },
  { name: 'Krishi Upaj Mandi Samiti (APMC)', distanceKm: 1.8, travelMins: 5, status: 'High Liquidity', icon: 'cart' },
  { name: 'Punjab National Bank (Rural Branch)', distanceKm: 0.9, travelMins: 3, status: 'PMEGP Nodal Bank', icon: 'business' },
  { name: 'Government Veterinary Hospital', distanceKm: 2.4, travelMins: 6, status: 'Free Insemination', icon: 'medkit' },
  { name: 'Rural Electricity Substation (33/11 kV)', distanceKm: 1.1, travelMins: 3, status: '21 hrs/day Supply', icon: 'flash' },
];

export const DiscoveryScreen: React.FC<Props> = ({ userProfile, lang }) => {
  const isEn = lang === 'en';
  const [activeSubTab, setActiveSubTab] = useState<DiscoveryTab>('opportunities');
  const [selectedBiz, setSelectedBiz] = useState<string | null>('dairy_farming');

  const formatCurrency = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    return `₹${(n / 1000).toFixed(0)}K`;
  };

  const handleSelectBusiness = (biz: typeof DEFAULT_OPPORTUNITIES[0]) => {
    userProfile.selectedBizId = biz.id;
    userProfile.selectedBizName = isEn ? biz.name : biz.name_hi;
    Alert.alert(
      isEn ? 'Business Selected!' : 'व्यापार चयनित!',
      isEn
        ? `Selected "${biz.name}". Your financial plan and DPR have been updated.`
        : `"${biz.name_hi}" चुना गया। आपकी वित्तीय योजना एवं DPR अद्यतित कर दी गई है।`
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>
            <Ionicons name="compass" size={18} color={COLORS.primary} />
            {'  '}{isEn ? 'Opportunity Discovery & Feasibility' : 'अवसर खोज एवं व्यवहार्यता रडार'}
          </Text>
          <Text style={styles.subtitle}>
            {isEn
              ? `AI-matched recommendations for ${userProfile.districtName || 'Gorakhpur'}`
              : `${userProfile.districtName || 'गोरखपुर'} के लिए AI द्वारा सत्यापित अवसर`}
          </Text>
        </View>

        {/* 3 Sub-Navigation Tabs */}
        <View style={styles.tabRow}>
          {[
            { key: 'opportunities' as DiscoveryTab, label: isEn ? 'Opportunities' : 'व्यापार अवसर', icon: 'grid' },
            { key: 'radar' as DiscoveryTab, label: isEn ? 'Facility Radar' : 'सुविधा रडार', icon: 'locate' },
            { key: 'compare' as DiscoveryTab, label: isEn ? 'Compare (3)' : 'तुलना मैट्रिक्स', icon: 'git-compare' },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabBtn, activeSubTab === t.key && styles.tabBtnActive]}
              onPress={() => setActiveSubTab(t.key)}
            >
              <Ionicons
                name={t.icon as any}
                size={13}
                color={activeSubTab === t.key ? COLORS.white : COLORS.textSecondary}
              />
              <Text style={[styles.tabBtnText, activeSubTab === t.key && styles.tabBtnTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TAB 1: BUSINESS OPPORTUNITIES */}
        {activeSubTab === 'opportunities' && (
          <View style={styles.sectionGap}>
            {DEFAULT_OPPORTUNITIES.map((biz) => {
              const isExpanded = selectedBiz === biz.id;
              const isCurrent = userProfile.selectedBizId === biz.id;

              return (
                <View
                  key={biz.id}
                  style={[
                    styles.bizCard,
                    isExpanded && styles.bizCardExpanded,
                    isCurrent && styles.bizCardCurrent,
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedBiz(isExpanded ? null : biz.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardTop}>
                      <View style={{ flex: 1, paddingRight: 50 }}>
                        <Text style={styles.bizSector}>{isEn ? biz.sector : biz.sector_hi}</Text>
                        <Text style={styles.bizName}>{isEn ? biz.name : biz.name_hi}</Text>
                      </View>
                      <View style={styles.scoreBadge}>
                        <Text style={styles.scoreText}>{biz.score}%</Text>
                        <Text style={styles.scoreLabel}>MATCH</Text>
                      </View>
                    </View>

                    {/* Stats Strip */}
                    <View style={styles.statsRow}>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>{isEn ? 'Capital' : 'पूंजी'}</Text>
                        <Text style={styles.statValue}>{formatCurrency(biz.capital)}</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>{isEn ? 'Margin' : 'मुनाफा'}</Text>
                        <Text style={[styles.statValue, { color: '#047857' }]}>{biz.margin}%</Text>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statLabel}>{isEn ? 'Risk' : 'जोखिम'}</Text>
                        <Text style={styles.statValue}>{isEn ? biz.risk : biz.risk_hi}</Text>
                      </View>
                    </View>

                    {isCurrent && (
                      <View style={styles.selectedPill}>
                        <Ionicons name="checkmark-circle" size={12} color="#047857" />
                        <Text style={styles.selectedPillText}>
                          {isEn ? 'Active Selected Business' : 'वर्तमान चयनित व्यवसाय'}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <View style={styles.expandedSection}>
                      <Text style={styles.equipHeader}>
                        {isEn ? 'Required Machineries & Assets:' : 'आवश्यक उपकरण एवं संपत्तियां:'}
                      </Text>
                      {biz.equipment.map((eq, i) => (
                        <View key={i} style={styles.equipRow}>
                          <Ionicons name="checkmark" size={12} color={COLORS.primary} />
                          <Text style={styles.equipText}>{eq}</Text>
                        </View>
                      ))}

                      <View style={styles.schemeStrip}>
                        <Ionicons name="ribbon-outline" size={14} color="#4338ca" />
                        <Text style={styles.schemeStripText}>{biz.scheme}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.selectBtn}
                        onPress={() => handleSelectBusiness(biz)}
                      >
                        <Ionicons name="rocket" size={14} color={COLORS.white} />
                        <Text style={styles.selectBtnText}>
                          {isEn ? 'Select for Financial Plan & DPR' : 'वित्तीय योजना व DPR हेतु चुनें'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 2: FACILITY PROXIMITY RADAR */}
        {activeSubTab === 'radar' && (
          <View style={styles.sectionGap}>
            <View style={styles.radarCard}>
              <View style={styles.radarCardHeader}>
                <Ionicons name="radio" size={16} color={COLORS.primary} />
                <Text style={styles.radarCardTitle}>
                  {isEn ? 'Local Infrastructure Radius (5km)' : 'स्थानीय बुनियादी ढांचा दायरा (5 किमी)'}
                </Text>
              </View>
              <Text style={styles.radarCardSub}>
                {isEn
                  ? 'Spatial access to milk chilling, cold storage, and banking hubs'
                  : 'दुग्ध शीतलन, शीतगृह एवं बैंकिंग केंद्रों तक भौतिक दूरी'}
              </Text>

              <View style={styles.facilityList}>
                {PROXIMITY_FACILITIES.map((f, i) => (
                  <View key={i} style={styles.facilityRow}>
                    <View style={styles.facilityIconBox}>
                      <Ionicons name={f.icon as any} size={16} color={COLORS.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.facilityTitle}>{f.name}</Text>
                      <Text style={styles.facilityStatus}>{f.status}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.distanceVal}>{f.distanceKm} km</Text>
                      <Text style={styles.travelTime}>{f.travelMins} mins</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* TAB 3: COMPARISON MATRIX */}
        {activeSubTab === 'compare' && (
          <View style={styles.sectionGap}>
            <View style={styles.compareCard}>
              <Text style={styles.compareTitle}>
                {isEn ? 'Head-to-Head Enterprise Comparison' : 'शीर्ष ग्रामीण उद्यम तुलना मैट्रिक्स'}
              </Text>

              {/* Comparison Table */}
              <View style={styles.matrixTable}>
                {/* Header Row */}
                <View style={styles.tableHeadRow}>
                  <Text style={[styles.headCell, { flex: 1.2 }]}>{isEn ? 'Parameter' : 'मापदंड'}</Text>
                  <Text style={styles.headCell}>Dairy</Text>
                  <Text style={styles.headCell}>Oil Expeller</Text>
                  <Text style={styles.headCell}>Solar EV</Text>
                </View>

                {/* Rows */}
                {[
                  { param: isEn ? 'Capital' : 'पूंजी', d: '₹4.8L', o: '₹3.5L', s: '₹2.2L' },
                  { param: isEn ? 'Margin' : 'मुनाफा', d: '21.8%', o: '24.5%', s: '28.0%' },
                  { param: isEn ? 'Break-even' : 'ब्रेक-ईवन', d: '14 mo', o: '11 mo', s: '9 mo' },
                  { param: isEn ? 'Subsidy' : 'सब्सिडी', d: '35% PMEGP', o: '35% PMFME', s: 'Mudra' },
                  { param: isEn ? 'Risk' : 'जोखिम', d: isEn ? 'Low' : 'कम', o: isEn ? 'Low' : 'कम', s: isEn ? 'Mod' : 'मध्यम' },
                ].map((row, i) => (
                  <View key={i} style={[styles.tableDataRow, i % 2 === 1 && { backgroundColor: '#f8fafc' }]}>
                    <Text style={[styles.dataCell, { flex: 1.2, fontWeight: '700' }]}>{row.param}</Text>
                    <Text style={styles.dataCell}>{row.d}</Text>
                    <Text style={styles.dataCell}>{row.o}</Text>
                    <Text style={styles.dataCell}>{row.s}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
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
    gap: SPACING.sm,
  },
  header: {
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: RADIUS.md,
    padding: 3,
    gap: 3,
    marginBottom: SPACING.xs,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.white,
  },
  sectionGap: {
    gap: SPACING.sm,
  },
  bizCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.xs,
  },
  bizCardExpanded: {
    borderColor: COLORS.primary,
  },
  bizCardCurrent: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bizSector: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
  },
  bizName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: '#ecfdf5',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#047857',
  },
  scoreLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#047857',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: SPACING.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.sm,
    padding: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  statValue: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  selectedPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  expandedSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 4,
  },
  equipHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  equipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  equipText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  schemeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0e7ff',
    padding: 6,
    borderRadius: RADIUS.sm,
    marginTop: 4,
  },
  schemeStripText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#3730a3',
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    marginTop: 6,
  },
  selectBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  radarCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  radarCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radarCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  radarCardSub: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginBottom: 6,
  },
  facilityList: {
    gap: 6,
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  facilityIconBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  facilityTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  facilityStatus: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  distanceVal: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primary,
  },
  travelTime: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  compareCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  compareTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  matrixTable: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  tableHeadRow: {
    flexDirection: 'row',
    backgroundColor: '#064e3b',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  headCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
  },
  tableDataRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dataCell: {
    flex: 1,
    fontSize: 10,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});
