/**
 * GramUdyam — Locked B2B Procurement Marketplace Screen
 * Certified machinery, equipment, and raw materials for new rural entrepreneurs.
 * LOCKED NODE until loan is sanctioned and subsidy is disbursed.
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { Language } from '../locales';
import { BeneficiaryProfile } from '../services/enterpriseStore';

interface Props {
  userProfile?: BeneficiaryProfile | null;
  lang: Language;
  onBack?: () => void;
}

interface MarketItem {
  id: string;
  name: string;
  name_hi: string;
  category: string;
  originalPrice: number;
  subsidizedPrice: number;
  subsidyPct: number;
  vendor: string;
  gemVerified: boolean;
  warranty: string;
  specs: string[];
}

const MARKET_ITEMS: MarketItem[] = [
  {
    id: 'm1',
    name: 'Bulk Milk Chilling Unit (200 Litres)',
    name_hi: 'बल्क मिल्क चिलिंग यूनिट (200 लीटर)',
    category: 'Dairy & Cold Chain',
    originalPrice: 185000,
    subsidizedPrice: 120250,
    subsidyPct: 35,
    vendor: 'National Dairy Development Board (NDDB) Empanelled',
    gemVerified: true,
    warranty: '2 Years Comprehensive',
    specs: ['SS 304 Food Grade Stainless Steel', 'Digital Temperature Controller', 'Hermetic Compressor'],
  },
  {
    id: 'm2',
    name: 'Cold Press Mustard Oil Expeller (6 Bolt)',
    name_hi: 'कोल्ड प्रेस सरसों तेल एक्सपेलर (6 बोल्ट)',
    category: 'Food Processing',
    originalPrice: 145000,
    subsidizedPrice: 94250,
    subsidyPct: 35,
    vendor: 'KVIC State Machine Directorate',
    gemVerified: true,
    warranty: '1 Year On-site Support',
    specs: ['Heavy Duty Steel Chamber', '5 HP Crompton Motor', 'Capacity: 45 kg seed/hour'],
  },
  {
    id: 'm3',
    name: 'Commercial Solar Inverter & Battery Hub (5kVA)',
    name_hi: 'व्यावसायिक सोलर इन्वर्टर एवं बैटरी बैकअप (5kVA)',
    category: 'Clean Energy & Power',
    originalPrice: 120000,
    subsidizedPrice: 78000,
    subsidyPct: 35,
    vendor: 'MNRE Registered Solar Fabricator',
    gemVerified: true,
    warranty: '5 Years Replacement',
    specs: ['MPPT Solar Charge Controller', 'Lithium Ferrophosphate Batteries', 'Pure Sine Wave Output'],
  },
  {
    id: 'm4',
    name: 'Stainless Steel 4-Frame Honey Extractor',
    name_hi: 'स्टेनलेस स्टील 4-फ्रेम शहद निष्कर्षण मशीन',
    category: 'Forest & Apiary',
    originalPrice: 28000,
    subsidizedPrice: 18200,
    subsidyPct: 35,
    vendor: 'KVIC Honey Mission Certified',
    gemVerified: true,
    warranty: '3 Years Warranty',
    specs: ['Manual & Motor Dual Mode', 'Food-Grade Honey Gate Valve', 'Clear Acrylic Top Lid'],
  },
  {
    id: 'm5',
    name: 'Industrial High-Speed Overlock Sewing Station',
    name_hi: 'औद्योगिक ओवरलॉक सिलाई मशीन स्टेशन',
    category: 'Textiles & Garment',
    originalPrice: 42000,
    subsidizedPrice: 27300,
    subsidyPct: 35,
    vendor: 'PM Vishwakarma Tool Supplier',
    gemVerified: true,
    warranty: '2 Years Free Servicing',
    specs: ['Direct Drive Servo Motor', 'Auto Thread Trimmer', 'LED Work Light Attached'],
  },
  {
    id: 'm6',
    name: 'Certified Murrah Buffalo Dairy Herd (2 Head)',
    name_hi: 'प्रमाणित मुर्रा भैंस दुग्ध पशुधन (2 पशु)',
    category: 'Livestock & Breeding',
    originalPrice: 160000,
    subsidizedPrice: 104000,
    subsidyPct: 35,
    vendor: 'State Livestock Development Board (LDB)',
    gemVerified: true,
    warranty: 'Veterinary Fitness & Insurance Included',
    specs: ['14-16 Litres Daily Milk Guarantee', 'Vaccinated (FMD & HS)', 'RFID Ear Tagged'],
  },
];

export const MarketplaceScreen: React.FC<Props> = ({ userProfile, lang, onBack }) => {
  const isEn = lang === 'en';
  const [notified, setNotified] = useState(false);

  const handleNotifyMe = () => {
    setNotified(true);
    Alert.alert(
      isEn ? 'Notification Set' : 'अधिसूचना सेट की गई',
      isEn
        ? 'You will receive an SMS and app alert when PNB Bank sanctions your DPR loan.'
        : 'पीएनबी बैंक द्वारा ऋण स्वीकृत होते ही आपको SMS एवं ऐप अलर्ट प्राप्त होगा।'
    );
  };

  const handleLockedItemPress = (item: MarketItem) => {
    Alert.alert(
      isEn ? '🔒 Locked Node' : '🔒 लॉक्ड स्टोर नोड',
      isEn
        ? `"${item.name}" is locked. Subsidized direct procurement will unlock automatically once your bank disbursal is confirmed.`
        : `"${item.name_hi}" वर्तमान में लॉक्ड है। बैंक द्वारा ऋण संवितरण की पुष्टि होते ही सरकारी सब्सिडी दर पर खरीद अनलॉक हो जाएगी।`
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color={COLORS.white} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={12} color="#fcd34d" />
              <Text style={styles.lockBadgeText}>
                {isEn ? 'LOCKED PROCUREMENT NODE' : 'लॉक्ड मशीनरी एवं कच्चा माल बाज़ार'}
              </Text>
            </View>
            <Text style={styles.headerTitle}>
              {isEn ? 'Entrepreneur Equipment Hub' : 'उद्यमिता उपकरण व संयंत्र हब'}
            </Text>
            <Text style={styles.headerSub}>
              {isEn
                ? 'GeM-approved direct machinery procurement with 35% government subsidy'
                : 'सरकारी GeM प्रमाणित वेंडरों से 35% सब्सिडी दर पर सीधी खरीद'}
            </Text>
          </View>
        </View>

        {/* Lock Status Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusIconBox}>
            <Ionicons name="lock-closed" size={24} color="#b45309" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>
              {isEn
                ? 'Store Unlocks at Stage 6: Bank Disbursal'
                : 'यह स्टोर चरण 6: ऋण संवितरण पर अनलॉक होगा'}
            </Text>
            <Text style={styles.statusSub}>
              {isEn
                ? 'Government policy requires formal bank sanction before subsidized equipment allocation.'
                : 'शासकीय नियमानुसार सब्सिडी दर पर मशीनरी आवंटन हेतु बैंक ऋण स्वीकृति आवश्यक है।'}
            </Text>
          </View>
        </View>

        {/* Unlock Checklist Roadmap */}
        <View style={styles.checklistCard}>
          <Text style={styles.checklistTitle}>
            {isEn ? 'Marketplace Unlock Roadmap:' : 'स्टोर अनलॉक करने की प्रक्रिया:'}
          </Text>

          {[
            { step: '1', title: isEn ? 'Enterprise Profile Created' : 'उद्यम प्रोफ़ाइल दर्ज', done: true },
            { step: '2', title: isEn ? 'DPR & Feasibility Validated' : 'DPR व व्यवहार्यता तैयार', done: true },
            { step: '3', title: isEn ? 'VDO Ground Verification Passed' : 'VDO भौतिक सत्यापन पूर्ण', done: true },
            { step: '4', title: isEn ? 'Bank Loan Sanction Letter' : 'बैंक ऋण स्वीकृति पत्र', done: false, active: true },
            { step: '5', title: isEn ? 'Store Unlocks: Instant Dispatch' : 'स्टोर अनलॉक: सीधी डिलीवरी', done: false },
          ].map((item, i) => (
            <View key={i} style={styles.checkRow}>
              <View
                style={[
                  styles.checkCircle,
                  item.done ? styles.checkCircleDone : item.active ? styles.checkCircleActive : styles.checkCirclePending,
                ]}
              >
                {item.done ? (
                  <Ionicons name="checkmark" size={12} color={COLORS.white} />
                ) : (
                  <Text
                    style={[
                      styles.stepNum,
                      item.active && { color: COLORS.white },
                    ]}
                  >
                    {item.step}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.checkText,
                  item.done && styles.checkTextDone,
                  item.active && styles.checkTextActive,
                ]}
              >
                {item.title}
              </Text>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.notifyBtn, notified && styles.notifyBtnDone]}
            onPress={handleNotifyMe}
            activeOpacity={0.7}
          >
            <Ionicons
              name={notified ? 'checkmark-circle' : 'notifications'}
              size={16}
              color={COLORS.white}
            />
            <Text style={styles.notifyBtnText}>
              {notified
                ? (isEn ? '✓ Notification Enabled' : '✓ अलर्ट सक्रिय है')
                : (isEn ? 'Notify Me When Loan Sanctioned' : 'ऋण स्वीकृत होने पर मुझे सूचित करें')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Preview of Subsidized Machinery Items */}
        <View style={styles.catalogSection}>
          <View style={styles.catalogHeader}>
            <Text style={styles.catalogTitle}>
              {isEn ? 'Subsidized Machinery Catalogue (Preview)' : 'सब्सिडी युक्त संयंत्र सूची (पूर्वावलोकन)'}
            </Text>
            <Text style={styles.catalogBadge}>6 {isEn ? 'Items' : 'उपकरण'}</Text>
          </View>

          {MARKET_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => handleLockedItemPress(item)}
              activeOpacity={0.7}
            >
              {/* Lock Badge Overlay */}
              <View style={styles.itemTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemName}>
                    {isEn ? item.name : item.name_hi}
                  </Text>
                  <Text style={styles.itemVendor}>🏢 {item.vendor}</Text>
                </View>
                <View style={styles.itemLockPill}>
                  <Ionicons name="lock-closed" size={12} color="#b45309" />
                  <Text style={styles.itemLockPillText}>LOCKED</Text>
                </View>
              </View>

              {/* Price Strip */}
              <View style={styles.priceStrip}>
                <View>
                  <Text style={styles.origPriceLbl}>{isEn ? 'Market Price' : 'बाज़ार मूल्य'}</Text>
                  <Text style={styles.origPriceVal}>₹{item.originalPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.subsidyBadge}>
                  <Text style={styles.subsidyBadgeText}>{item.subsidyPct}% GOVT SUBSIDY</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.subPriceLbl}>{isEn ? 'Your Cost (Post-Subsidy)' : 'आपकी लागत'}</Text>
                  <Text style={styles.subPriceVal}>₹{item.subsidizedPrice.toLocaleString()}</Text>
                </View>
              </View>

              {/* Specs */}
              <View style={styles.specsRow}>
                {item.specs.map((sp, idx) => (
                  <View key={idx} style={styles.specTag}>
                    <Text style={styles.specTagText}>• {sp}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.itemFooter}>
                <Text style={styles.warrantyText}>🛡️ {item.warranty}</Text>
                <Text style={styles.unlockActionText}>
                  {isEn ? 'Unlocks upon Sanction →' : 'स्वीकृति पर अनलॉक होगा →'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#78350f',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOW.md,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  lockBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#fde68a',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: FONT.md,
    fontWeight: '900',
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 10,
    color: '#fef3c7',
    marginTop: 2,
  },
  statusBanner: {
    backgroundColor: '#fef3c7',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#fde68a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statusIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: '#fde68a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#92400e',
  },
  statusSub: {
    fontSize: 10,
    color: '#b45309',
    marginTop: 2,
  },
  checklistCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
    ...SHADOW.sm,
  },
  checklistTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleDone: {
    backgroundColor: '#10b981',
  },
  checkCircleActive: {
    backgroundColor: '#f59e0b',
  },
  checkCirclePending: {
    backgroundColor: '#e2e8f0',
  },
  stepNum: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  checkText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  checkTextDone: {
    color: '#047857',
    fontWeight: '700',
  },
  checkTextActive: {
    color: '#b45309',
    fontWeight: '800',
  },
  notifyBtn: {
    backgroundColor: '#b45309',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
  },
  notifyBtnDone: {
    backgroundColor: '#047857',
  },
  notifyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  catalogSection: {
    gap: SPACING.sm,
  },
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catalogTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  catalogBadge: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#f1f5f9',
    color: COLORS.textSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#fed7aa',
    gap: SPACING.xs,
    ...SHADOW.xs,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9a3412',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  itemVendor: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  itemLockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  itemLockPillText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#92400e',
  },
  priceStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: RADIUS.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: '#fef3c7',
    marginTop: 4,
  },
  origPriceLbl: {
    fontSize: 8,
    color: COLORS.textTertiary,
  },
  origPriceVal: {
    fontSize: 10,
    color: COLORS.textTertiary,
    textDecorationLine: 'line-through',
  },
  subsidyBadge: {
    backgroundColor: '#fed7aa',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  subsidyBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#9a3412',
  },
  subPriceLbl: {
    fontSize: 8,
    color: '#047857',
    fontWeight: '700',
  },
  subPriceVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#047857',
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  specTag: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  specTagText: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  warrantyText: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  unlockActionText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309',
  },
});
