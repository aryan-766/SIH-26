/**
 * GramUdyam — Profile Screen (Both roles)
 * Profile details, Locked Marketplace portal, Help & Support ("Take It Online" & Team contacts)
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { BeneficiaryProfile, OfficerProfile } from '../services/enterpriseStore';
import { Language } from '../locales';
import { MarketplaceScreen } from './MarketplaceScreen';
import { HelpSupportScreen } from './HelpSupportScreen';

interface Props {
  role: 'entrepreneur' | 'official';
  userProfile: BeneficiaryProfile | null;
  officerProfile: OfficerProfile | null;
  lang: Language;
  onLogout: () => void;
  onSetLang: (l: Language) => void;
}

export const ProfileScreen: React.FC<Props> = ({
  role,
  userProfile,
  officerProfile,
  lang,
  onLogout,
  onSetLang
}) => {
  const isEn = lang === 'en';
  const [showMarketplaceModal, setShowMarketplaceModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>{isEn ? 'Profile & Enterprise Hub' : 'प्रोफ़ाइल एवं उद्यम केंद्र'}</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={[styles.avatar, role === 'official' && { backgroundColor: COLORS.accentLight }]}>
            <Ionicons
              name={role === 'entrepreneur' ? 'person' : 'shield'}
              size={28}
              color={role === 'entrepreneur' ? COLORS.primary : COLORS.accent}
            />
          </View>
          <Text style={styles.profileName}>
            {role === 'entrepreneur' ? userProfile?.fullName : officerProfile?.fullName}
          </Text>
          <Text style={styles.profileRole}>
            {role === 'entrepreneur'
              ? (isEn ? 'Rural Entrepreneur' : 'ग्रामीण उद्यमी')
              : (officerProfile?.designation || (isEn ? 'Government Official' : 'सरकारी अधिकारी'))}
          </Text>
          {role === 'entrepreneur' && userProfile && (
            <Text style={styles.profileDetail}>📞 {userProfile.phone} • {userProfile.districtName}</Text>
          )}
          {role === 'official' && officerProfile && (
            <Text style={[styles.profileDetail, { color: COLORS.accent }]}>
              {officerProfile.uniqueGovtCode}
            </Text>
          )}
        </View>

        {/* SECTION: LOCKED MARKETPLACE (MACHINERY PROCUREMENT) */}
        <TouchableOpacity
          style={styles.marketplaceCard}
          onPress={() => setShowMarketplaceModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.featureIconBox}>
            <Ionicons name="cart" size={24} color="#b45309" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.lockRow}>
              <View style={styles.lockedPill}>
                <Ionicons name="lock-closed" size={10} color="#b45309" />
                <Text style={styles.lockedPillText}>
                  {isEn ? 'LOCKED STORE NODE' : 'लॉक्ड संयंत्र आपूर्ति बाज़ार'}
                </Text>
              </View>
              <Text style={styles.subsidyTag}>35% Subsidized</Text>
            </View>
            <Text style={styles.featureTitle}>
              {isEn ? 'Machinery & Equipment Store' : 'मशीनरी एवं कच्चा माल आपूर्ति बाज़ार'}
            </Text>
            <Text style={styles.featureDesc}>
              {isEn
                ? 'GeM-approved direct procurement unlocks automatically upon bank loan sanction.'
                : 'ऋण स्वीकृत होते ही सरकारी प्रमाणित वेंडरों से सीधी खरीद हेतु अनलॉक होगा।'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#b45309" />
        </TouchableOpacity>

        {/* SECTION: HELP & SUPPORT ("TAKE IT ONLINE" & TEAM SUPPORT) */}
        <TouchableOpacity
          style={styles.helpCard}
          onPress={() => setShowHelpModal(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.featureIconBox, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
            <Ionicons name="help-buoy" size={24} color="#047857" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.lockRow}>
              <View style={[styles.lockedPill, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
                <Ionicons name="globe-outline" size={10} color="#047857" />
                <Text style={[styles.lockedPillText, { color: '#047857' }]}>
                  {isEn ? 'TAKE IT ONLINE' : 'टेक इट ऑनलाइन (ONDC / GeM)'}
                </Text>
              </View>
              <Text style={[styles.subsidyTag, { color: '#047857', backgroundColor: '#dcfce7' }]}>
                24/7 Support
              </Text>
            </View>
            <Text style={styles.featureTitle}>
              {isEn ? 'Help & Support Desk' : 'सहायता केंद्र व मार्केटप्लेस लिस्टिंग'}
            </Text>
            <Text style={styles.featureDesc}>
              {isEn
                ? 'Team helpline, app issue tickets, and criteria to sell products on ONDC & Amazon.'
                : 'हेल्पलाइन नंबर, तकनीकी शिकायत टिकट एवं ONDC पर उत्पाद बेचने के मापदंड।'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#047857" />
        </TouchableOpacity>

        {/* Details Card */}
        {role === 'entrepreneur' && userProfile && (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>{isEn ? 'Business Details' : 'व्यापार विवरण'}</Text>
            {[
              { label: isEn ? 'Business' : 'व्यापार', value: userProfile.selectedBizName },
              { label: isEn ? 'State' : 'राज्य', value: userProfile.stateCode || 'UP' },
              { label: isEn ? 'District' : 'जिला', value: userProfile.districtName },
              { label: isEn ? 'Block' : 'ब्लॉक', value: userProfile.blockName || 'Sahjanwa' },
              { label: isEn ? 'Village' : 'गाँव', value: userProfile.villageName || 'Bhiti Rawat' },
              { label: isEn ? 'Category' : 'श्रेणी', value: userProfile.socialCategory },
              { label: isEn ? 'Capital' : 'पूंजी', value: `₹${userProfile.capital.toLocaleString()}` },
              { label: isEn ? 'Status' : 'स्थिति', value: userProfile.businessStatus },
            ].map((item, i) => (
              <View key={i} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}

        {role === 'official' && officerProfile && (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>{isEn ? 'Official Details' : 'अधिकारी विवरण'}</Text>
            {[
              { label: isEn ? 'Block' : 'ब्लॉक', value: officerProfile.block },
              { label: isEn ? 'District' : 'जिला', value: officerProfile.district },
              { label: isEn ? 'Govt Code' : 'सरकारी कोड', value: officerProfile.uniqueGovtCode },
              { label: isEn ? 'IAS Officer' : 'IAS अधिकारी', value: officerProfile.assignedIas.name },
              { label: isEn ? 'Villages' : 'गाँव', value: `${officerProfile.assignedVillages.length} assigned` },
            ].map((item, i) => (
              <View key={i} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Language Selector */}
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{isEn ? 'Application Language' : 'ऐप भाषा'}</Text>
          <View style={styles.langGrid}>
            {languages.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[styles.langBtn, lang === l.code && styles.langBtnActive]}
                onPress={() => onSetLang(l.code)}
              >
                <Text style={[styles.langBtnText, lang === l.code && styles.langBtnTextActive]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{isEn ? 'About GramUdyam' : 'ग्रामउद्यम के बारे में'}</Text>
          <Text style={styles.aboutText}>GramUdyam v1.2.0 • Smart India Hackathon 2026</Text>
          <Text style={styles.aboutText}>
            {isEn
              ? 'Rural Enterprise Intelligence, Financial DPR & Official Governance Platform'
              : 'ग्रामीण उद्यम बुद्धिमत्ता, वित्तीय डीपीआर एवं शासकीय अभिशासन मंच'}
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Ionicons name="log-out" size={18} color={COLORS.danger} />
          <Text style={styles.logoutText}>{isEn ? 'Logout Session' : 'सत्र समाप्त करें (लॉग आउट)'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Full Modal for Locked Marketplace */}
      <Modal visible={showMarketplaceModal} animationType="slide">
        <MarketplaceScreen
          userProfile={userProfile}
          lang={lang}
          onBack={() => setShowMarketplaceModal(false)}
        />
      </Modal>

      {/* Full Modal for Help & Support */}
      <Modal visible={showHelpModal} animationType="slide">
        <HelpSupportScreen
          userProfile={userProfile}
          lang={lang}
          onBack={() => setShowHelpModal(false)}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SPACING.md },
  screenTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary, marginBottom: SPACING.sm },

  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOW.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  profileName: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary },
  profileRole: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  profileDetail: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted, marginTop: 4 },

  marketplaceCard: {
    backgroundColor: '#fffbeb',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#fde68a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOW.xs,
  },
  helpCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOW.xs,
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  lockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  lockedPillText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#92400e',
  },
  subsidyTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#b45309',
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  featureDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },

  detailCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.xs,
  },
  detailTitle: { fontSize: 12, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.xs },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  detailLabel: { fontSize: 11, color: COLORS.textMuted },
  detailValue: { fontSize: 11, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'right', flex: 1, marginLeft: SPACING.md },

  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  langBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  langBtnText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  langBtnTextActive: { color: COLORS.white },

  aboutText: { fontSize: 10, color: COLORS.textSecondary, marginBottom: 2 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: '#fef2f2',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginTop: 4,
  },
  logoutText: { fontSize: 12, fontWeight: '800', color: COLORS.danger },
});
