/**
 * GramUdyam — Government Schemes Screen
 * All schemes visible in selected language, with eligibility, docs, details
 */
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { BeneficiaryProfile } from '../services/enterpriseStore';
import { Language, translations } from '../locales';
import { PAN_INDIA_GOV_SCHEMES, GovScheme } from '../services/panIndiaSchemesData';

interface Props {
  userProfile: BeneficiaryProfile;
  lang: Language;
}

export const SchemesScreen: React.FC<Props> = ({ userProfile, lang }) => {
  const isEn = lang === 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);

  // Helper to get text from multilingual object
  const getText = (ml: { hi: string; en: string; mr: string; ta: string }) => {
    return (ml as any)[lang] || ml.en || ml.hi;
  };
  const getList = (ml: { hi: string[]; en: string[]; mr: string[]; ta: string[] }) => {
    return (ml as any)[lang] || ml.en || ml.hi;
  };

  const categories = [
    { key: 'all', label: isEn ? 'All Schemes' : 'सभी योजनाएं' },
    { key: 'msme', label: 'MSME' },
    { key: 'food_processing', label: isEn ? 'Food' : 'खाद्य' },
    { key: 'livestock', label: isEn ? 'Livestock' : 'पशुधन' },
    { key: 'women_shg', label: isEn ? 'Women/SHG' : 'महिला/SHG' },
    { key: 'agri_infra', label: isEn ? 'Agri' : 'कृषि' },
  ];

  const schemes = useMemo(() => {
    let list: GovScheme[] = PAN_INDIA_GOV_SCHEMES || [];
    if (selectedCategory !== 'all') {
      list = list.filter(s => s.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.name.en.toLowerCase().includes(q) ||
        s.name.hi.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
      );
    }
    return list.slice(0, 30);
  }, [selectedCategory, searchQuery]);

  const getSchemeStatusColor = (status?: string) => {
    if (status === 'Active') return COLORS.success;
    if (status === 'Applied') return COLORS.info;
    return COLORS.textMuted;
  };

  const renderScheme = ({ item: scheme }: { item: GovScheme }) => {
    const isExpanded = expandedScheme === scheme.id;
    const schemeName = getText(scheme.name);

    return (
      <TouchableOpacity
        style={styles.schemeCard}
        onPress={() => setExpandedScheme(isExpanded ? null : scheme.id)}
        activeOpacity={0.7}
      >
        <View style={styles.schemeHeader}>
          <View style={[styles.schemeBadge, { backgroundColor: COLORS.info + '18' }]}>
            <Ionicons name="ribbon" size={14} color={COLORS.info} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.schemeName} numberOfLines={isExpanded ? undefined : 2}>{schemeName}</Text>
            <Text style={styles.schemeCategory}>{scheme.code} • {getText(scheme.ministry)}</Text>
          </View>
          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textMuted} />
        </View>

        {/* Badge */}
        <View style={styles.matchRow}>
          <Text style={styles.matchText}>{getText(scheme.badge)}</Text>
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfoRow}>
          <View style={styles.quickInfoChip}>
            <Ionicons name="cash-outline" size={12} color={COLORS.success} />
            <Text style={styles.quickInfoText}>
              {getText(scheme.subsidyDisplay)}
            </Text>
          </View>
          <View style={styles.quickInfoChip}>
            <Ionicons name="card-outline" size={12} color={COLORS.info} />
            <Text style={styles.quickInfoText}>
              {getText(scheme.maxLoanDisplay)}
            </Text>
          </View>
        </View>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            {/* Description */}
            <View style={styles.detailBlock}>
              <Text style={styles.detailTitle}>
                <Ionicons name="information-circle" size={14} color={COLORS.info} />
                {'  '}{isEn ? 'Description' : 'विवरण'}
              </Text>
              <Text style={styles.detailText}>{getText(scheme.description)}</Text>
            </View>

            {/* Eligibility */}
            <View style={styles.detailBlock}>
              <Text style={styles.detailTitle}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                {'  '}{isEn ? 'Eligibility' : 'पात्रता'}
              </Text>
              {getList(scheme.eligibility).map((e: string, i: number) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.detailText}>{e}</Text>
                </View>
              ))}
            </View>

            {/* Required Documents */}
            <View style={styles.detailBlock}>
              <Text style={styles.detailTitle}>
                <Ionicons name="document-text" size={14} color={COLORS.warning} />
                {'  '}{isEn ? 'Required Documents' : 'आवश्यक दस्तावेज'}
              </Text>
              {getList(scheme.documents).map((d: string, i: number) => (
                <View key={i} style={styles.bulletRow}>
                  <Ionicons name="document-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.detailText}>{d}</Text>
                </View>
              ))}
            </View>

            {/* Collateral + Interest */}
            <View style={styles.quickInfoRow}>
              <View style={[styles.quickInfoChip, { backgroundColor: scheme.collateralFree ? '#dcfce7' : '#fef3c7' }]}>
                <Ionicons name={scheme.collateralFree ? 'shield-checkmark' : 'alert-circle'} size={12} color={scheme.collateralFree ? COLORS.success : COLORS.warning} />
                <Text style={styles.quickInfoText}>{getText(scheme.collateralText)}</Text>
              </View>
              <View style={styles.quickInfoChip}>
                <Ionicons name="trending-down" size={12} color={COLORS.info} />
                <Text style={styles.quickInfoText}>{getText(scheme.interestRate)}</Text>
              </View>
            </View>

            {/* Apply Button */}
            <TouchableOpacity style={styles.applyBtn}>
              <Ionicons name="paper-plane" size={16} color={COLORS.white} />
              <Text style={styles.applyBtnText}>
                {isEn ? 'Apply for this Scheme' : 'इस योजना के लिए आवेदन करें'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>
          <Ionicons name="ribbon" size={20} color={COLORS.primary} />
          {'  '}{isEn ? 'Government Schemes' : 'सरकारी योजनाएं'}
        </Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{schemes.length}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder={isEn ? 'Search schemes...' : 'योजनाएं खोजें...'}
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.filterChip, selectedCategory === cat.key && styles.filterChipActive]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text style={[styles.filterText, selectedCategory === cat.key && styles.filterTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Schemes List */}
      <FlatList
        data={schemes}
        keyExtractor={(item) => item.id || String(Math.random())}
        renderItem={renderScheme}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>{isEn ? 'No schemes found' : 'कोई योजना नहीं मिली'}</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  screenTitle: { fontSize: FONT.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary },
  countBadge: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  countText: { fontSize: FONT.sizes.sm, fontWeight: '800', color: COLORS.white },

  searchRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, marginHorizontal: SPACING.lg,
    marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, paddingVertical: SPACING.md, marginLeft: SPACING.sm, fontSize: FONT.sizes.md, color: COLORS.textPrimary },

  filterScroll: { flexGrow: 0, paddingHorizontal: SPACING.lg, marginTop: SPACING.md, marginBottom: SPACING.sm },
  filterChip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full,
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, marginRight: SPACING.sm,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONT.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: COLORS.white },

  listContent: { padding: SPACING.lg, paddingTop: SPACING.sm },

  schemeCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.xl, padding: SPACING.lg,
    marginBottom: SPACING.md, ...SHADOW.sm,
  },
  schemeHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  schemeBadge: { width: 36, height: 36, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  schemeName: { fontSize: FONT.sizes.md, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 20 },
  schemeCategory: { fontSize: FONT.sizes.xs, color: COLORS.textMuted, marginTop: 2 },

  matchRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.md },
  matchBar: { flex: 1, height: 6, backgroundColor: COLORS.shimmer, borderRadius: 3, overflow: 'hidden' },
  matchFill: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  matchText: { fontSize: FONT.sizes.xs, fontWeight: '700', color: COLORS.primary },

  quickInfoRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm, flexWrap: 'wrap' },
  quickInfoChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.bg, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 4,
  },
  quickInfoText: { fontSize: FONT.sizes.xs, fontWeight: '600', color: COLORS.textSecondary },

  expandedSection: { marginTop: SPACING.lg, borderTopWidth: 1, borderTopColor: COLORS.borderLight, paddingTop: SPACING.md },
  detailBlock: { marginBottom: SPACING.md },
  detailTitle: { fontSize: FONT.sizes.sm, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  detailText: { fontSize: FONT.sizes.sm, color: COLORS.textSecondary, lineHeight: 20, flex: 1 },
  bulletRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: 4, paddingLeft: SPACING.xs },
  bullet: { color: COLORS.primary, fontWeight: '700' },

  applyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
  },
  applyBtnText: { fontSize: FONT.sizes.md, fontWeight: '800', color: COLORS.white },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: FONT.sizes.md, color: COLORS.textMuted, marginTop: SPACING.md },
});
