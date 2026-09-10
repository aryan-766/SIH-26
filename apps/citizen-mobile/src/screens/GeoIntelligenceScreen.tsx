/**
 * GramUdyam — GIS Geo-Intelligence Radar Screen
 * Spatial mapping of competitor density, chilling centers, mandis, and enterprise clusters
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput
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

interface ClusterVillage {
  id: string;
  name: string;
  block: string;
  enterprises: number;
  milkYieldDaily: number;
  powerHours: number;
  feasibilityScore: number;
  nearestFacility: string;
  facilityDistanceKm: number;
  status: 'optimal' | 'moderate' | 'high_potential';
}

const VILLAGES_DATA: ClusterVillage[] = [
  {
    id: 'v1',
    name: 'Bhiti Rawat (भीटी रावत)',
    block: 'Sahjanwa',
    enterprises: 14,
    milkYieldDaily: 2800,
    powerHours: 21,
    feasibilityScore: 94,
    nearestFacility: 'Sahjanwa Bulk Milk Chilling Center',
    facilityDistanceKm: 3.2,
    status: 'optimal',
  },
  {
    id: 'v2',
    name: 'Sahjanwa Khas (सहजनवा खास)',
    block: 'Sahjanwa',
    enterprises: 19,
    milkYieldDaily: 3400,
    powerHours: 23,
    feasibilityScore: 91,
    nearestFacility: 'APMC Krishi Mandi & Cold Storage',
    facilityDistanceKm: 1.8,
    status: 'optimal',
  },
  {
    id: 'v3',
    name: 'Ghaghrasur (घाघरासुर)',
    block: 'Sahjanwa',
    enterprises: 8,
    milkYieldDaily: 1950,
    powerHours: 19,
    feasibilityScore: 86,
    nearestFacility: 'PNB Rural Self Employment Training (RSETI)',
    facilityDistanceKm: 5.4,
    status: 'moderate',
  },
  {
    id: 'v4',
    name: 'Pipraich Khurd (पिपराइच खुर्द)',
    block: 'Pipraich',
    enterprises: 12,
    milkYieldDaily: 2400,
    powerHours: 20,
    feasibilityScore: 89,
    nearestFacility: 'Cooperative Sugar & Agro Mill',
    facilityDistanceKm: 4.1,
    status: 'optimal',
  },
  {
    id: 'v5',
    name: 'Campierganj Dehat (कैम्पियरगंज देहात)',
    block: 'Campierganj',
    enterprises: 6,
    milkYieldDaily: 1600,
    powerHours: 18,
    feasibilityScore: 82,
    nearestFacility: 'Veterinary Hospital & Artificial Insemination Hub',
    facilityDistanceKm: 6.8,
    status: 'high_potential',
  },
];

export const GeoIntelligenceScreen: React.FC<Props> = ({ officerProfile, lang }) => {
  const isEn = lang === 'en';
  const [selectedRadius, setSelectedRadius] = useState<'5km' | '10km' | '25km'>('5km');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredVillages = VILLAGES_DATA.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.block.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerIcon}>
              <Ionicons name="map" size={22} color={COLORS.white} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.headerBadge}>
                <Ionicons name="radio" size={10} color="#a7f3d0" />
                <Text style={styles.headerBadgeText}>
                  {isEn ? 'SPATIAL GIS RADAR' : 'स्थानिक GIS रडार'}
                </Text>
              </View>
              <Text style={styles.headerTitle}>
                {isEn ? 'District Geo-Intelligence' : 'ज़िला भू-स्थानिक बुद्धिमत्ता'}
              </Text>
              <Text style={styles.headerSub}>
                {officerProfile?.district || 'Gorakhpur'} • {officerProfile?.block || 'Sahjanwa'}
              </Text>
            </View>
          </View>

          {/* Radius Selector */}
          <View style={styles.radiusRow}>
            <Text style={styles.radiusLabel}>
              {isEn ? 'Coverage Radius:' : 'कवरेज दायरा:'}
            </Text>
            <View style={styles.radiusBtns}>
              {(['5km', '10km', '25km'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.radiusBtn, selectedRadius === r && styles.radiusBtnActive]}
                  onPress={() => setSelectedRadius(r)}
                >
                  <Text
                    style={[
                      styles.radiusBtnText,
                      selectedRadius === r && styles.radiusBtnTextActive,
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Visual Simulated GIS Radar Map Canvas */}
        <View style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <View style={styles.mapTitleRow}>
              <Ionicons name="navigate-circle" size={16} color={COLORS.primary} />
              <Text style={styles.mapTitle}>
                {isEn ? 'Live Infrastructure & Enterprise Map' : 'लाइव इंफ्रास्ट्रक्चर एवं उद्यम नक्शा'}
              </Text>
            </View>
            <Text style={styles.mapLiveBadge}>● LIVE GIS</Text>
          </View>

          {/* Interactive Radar Box */}
          <View style={styles.radarCanvas}>
            {/* Concentric Circles */}
            <View style={[styles.radarRing, styles.ringOuter]} />
            <View style={[styles.radarRing, styles.ringMid]} />
            <View style={[styles.radarRing, styles.ringInner]} />

            {/* Crosshairs */}
            <View style={styles.crosshairH} />
            <View style={styles.crosshairV} />

            {/* Center Anchor Point */}
            <View style={styles.centerNode}>
              <Ionicons name="business" size={12} color={COLORS.white} />
            </View>

            {/* Simulated Village Nodes with Status Colors */}
            <View style={[styles.mapNode, { top: '22%', left: '30%' }]}>
              <View style={[styles.nodeDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.nodeLabel}>Bhiti (14 Ent)</Text>
            </View>

            <View style={[styles.mapNode, { top: '48%', left: '72%' }]}>
              <View style={[styles.nodeDot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.nodeLabel}>Sahjanwa BMC (3.2km)</Text>
            </View>

            <View style={[styles.mapNode, { top: '75%', left: '38%' }]}>
              <View style={[styles.nodeDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.nodeLabel}>Ghaghrasur (8 Ent)</Text>
            </View>

            <View style={[styles.mapNode, { top: '28%', left: '68%' }]}>
              <View style={[styles.nodeDot, { backgroundColor: '#8b5cf6' }]} />
              <Text style={styles.nodeLabel}>APMC Mandi (1.8km)</Text>
            </View>

            <View style={[styles.mapNode, { top: '65%', left: '80%' }]}>
              <View style={[styles.nodeDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.nodeLabel}>Pipraich (12 Ent)</Text>
            </View>
          </View>

          {/* Map Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>{isEn ? 'High Viability' : 'उच्च व्यवहार्यता'}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.legendText}>{isEn ? 'Cold Chain' : 'कोल्ड चेन'}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8b5cf6' }]} />
              <Text style={styles.legendText}>{isEn ? 'Krishi Mandi' : 'कृषि मंडी'}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>{isEn ? 'Under Survey' : 'सर्वेक्षण अधीन'}</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={COLORS.textTertiary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={isEn ? 'Search village or block...' : 'गाँव या ब्लॉक खोजें...'}
            placeholderTextColor={COLORS.textTertiary}
          />
        </View>

        {/* Village Resource Index Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableTitle}>
              {isEn ? 'Village Cluster Feasibility Index' : 'ग्राम क्लस्टर व्यवहार्यता सूचकांक'}
            </Text>
            <Text style={styles.tableSubtitle}>
              {isEn
                ? 'Daily milk yield, power supply & facility access'
                : 'दैनिक दुग्ध उत्पादन, विद्युत आपूर्ति एवं सुविधा दूरी'}
            </Text>
          </View>

          {filteredVillages.map((v) => (
            <View key={v.id} style={styles.villageCard}>
              <View style={styles.villageTop}>
                <View>
                  <Text style={styles.villageName}>{v.name}</Text>
                  <Text style={styles.villageBlock}>
                    {isEn ? 'Block' : 'ब्लॉक'}: {v.block}
                  </Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreNum}>{v.feasibilityScore}</Text>
                  <Text style={styles.scoreLabel}>/ 100</Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>
                    {isEn ? 'Enterprises' : 'उद्यम'}
                  </Text>
                  <Text style={styles.statVal}>{v.enterprises}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>
                    {isEn ? 'Daily Yield' : 'दुग्ध आवक'}
                  </Text>
                  <Text style={[styles.statVal, { color: COLORS.primary }]}>
                    {v.milkYieldDaily}L
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>
                    {isEn ? 'Power' : 'बिजली'}
                  </Text>
                  <Text style={styles.statVal}>{v.powerHours}h/d</Text>
                </View>
              </View>

              <View style={styles.facilityStrip}>
                <Ionicons name="location-sharp" size={12} color={COLORS.primary} />
                <Text style={styles.facilityText} numberOfLines={1}>
                  {v.nearestFacility} ({v.facilityDistanceKm} km)
                </Text>
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
    backgroundColor: '#0f766e',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.md,
  },
  headerRow: {
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
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
    marginBottom: 2,
  },
  headerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#a7f3d0',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: FONT.md,
    fontWeight: '800',
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 11,
    color: '#ccfbf1',
  },
  radiusRow: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  radiusLabel: {
    fontSize: 11,
    color: '#ccfbf1',
    fontWeight: '600',
  },
  radiusBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  radiusBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  radiusBtnActive: {
    backgroundColor: COLORS.white,
  },
  radiusBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ccfbf1',
  },
  radiusBtnTextActive: {
    color: '#0f766e',
  },
  mapCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  mapTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  mapLiveBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10b981',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  radarCanvas: {
    height: 220,
    backgroundColor: '#0f172a',
    borderRadius: RADIUS.md,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.25)',
  },
  ringOuter: {
    width: 200,
    height: 200,
  },
  ringMid: {
    width: 130,
    height: 130,
  },
  ringInner: {
    width: 60,
    height: 60,
  },
  crosshairH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(16,185,129,0.2)',
  },
  crosshairV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(16,185,129,0.2)',
  },
  centerNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    zIndex: 10,
  },
  mapNode: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15,23,42,0.85)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  nodeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  nodeLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.white,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 9,
    color: COLORS.textSecondary,
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
  tableCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  tableHeader: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.xs,
  },
  tableTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  tableSubtitle: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  villageCard: {
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: SPACING.xs,
  },
  villageTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  villageName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  villageBlock: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  scoreNum: {
    fontSize: 12,
    fontWeight: '900',
    color: '#15803d',
  },
  scoreLabel: {
    fontSize: 9,
    color: '#15803d',
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  statVal: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  facilityStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  facilityText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    flex: 1,
  },
});
