/**
 * GramUdyam — Auth Screen
 * Sign In / Sign Up for Entrepreneurs + IAS District Magistrate & VDO Official Login
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import { Language, translations } from '../locales';
import {
  BeneficiaryProfile, OfficerProfile,
  SEED_REGISTERED_ENTREPRENEURS, DEFAULT_FIELD_OFFICER,
  RegisteredEntrepreneur, findRegisteredEntrepreneur,
  registerNewEntrepreneur
} from '../services/enterpriseStore';
import { getAllStates, getDistrictsByState, getDistrictById, AUTHORIZED_OFFICERS_REGISTRY } from '../services/indiaPanPanchayatData';

interface AuthScreenProps {
  lang: Language;
  onSetLang: (l: Language) => void;
  onLogin: (role: 'entrepreneur' | 'official', profile: BeneficiaryProfile | null, officer: OfficerProfile | null) => void;
}

type AuthTab = 'signin' | 'signup' | 'official';

export const AuthScreen: React.FC<AuthScreenProps> = ({ lang, onSetLang, onLogin }) => {
  const isEn = lang === 'en';
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');

  // Entrepreneur Sign In
  const [phone, setPhone] = useState('9876543210');
  const [pin, setPin] = useState('1234');

  // Entrepreneur Sign Up
  const [fullName, setFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPin, setSignupPin] = useState('1234');
  const [selectedState, setSelectedState] = useState('UP');
  const [selectedDistrict, setSelectedDistrict] = useState('dist_gorakhpur');

  // Official Login
  const [officialRoleType, setOfficialRoleType] = useState<'ias_dm' | 'field_officer'>('field_officer');
  const [govtOrderNo, setGovtOrderNo] = useState('GOV/UP/PANCHAYAT/2024/7712-B');
  const [officialPhone, setOfficialPhone] = useState('9911223344');
  const [officialPin, setOfficialPin] = useState('7788');

  const languages: { code: Language; label: string }[] = [
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  const handleSignIn = () => {
    if (!phone.trim()) {
      Alert.alert(isEn ? 'Error' : 'त्रुटि', isEn ? 'Please enter phone number' : 'कृपया फोन नंबर दर्ज करें');
      return;
    }
    const existing = findRegisteredEntrepreneur(phone.trim());
    if (existing) {
      onLogin('entrepreneur', existing.profile, null);
    } else {
      const defaultProf: BeneficiaryProfile = {
        fullName: 'Ramesh Kumar Yadav',
        phone: phone.trim(),
        socialCategory: 'OBC',
        capital: 80000,
        skills: ['Dairy Farming', 'Animal Husbandry'],
        spaceSqft: 600,
        stateCode: 'UP',
        districtId: 'dist_gorakhpur',
        districtName: 'Gorakhpur (गोरखपुर)',
        blockId: 'blk_sahjanwa',
        blockName: 'Sahjanwa',
        villageId: 'vil_bhiti',
        villageName: 'Bhiti Rawat',
        selectedBizId: 'dairy_farming',
        selectedBizName: 'Dairy Farming & Chilling Center',
        businessStatus: 'Operational',
      };
      onLogin('entrepreneur', defaultProf, null);
    }
  };

  const handleSignUp = () => {
    if (!fullName.trim() || !signupPhone.trim()) {
      Alert.alert(isEn ? 'Error' : 'त्रुटि', isEn ? 'Please fill all required fields' : 'कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }
    const distObj = getDistrictById(selectedDistrict);
    const block = distObj?.blocks?.[0];
    const village = block?.villages?.[0];
    const newProfile: BeneficiaryProfile = {
      fullName: fullName.trim(),
      phone: signupPhone.trim(),
      socialCategory: 'General',
      capital: 100000,
      skills: ['Agro Business'],
      spaceSqft: 500,
      stateCode: selectedState,
      districtId: selectedDistrict,
      districtName: distObj?.name || 'Gorakhpur',
      blockId: block?.id || 'blk_sahjanwa',
      blockName: block?.name || 'Sahjanwa',
      villageId: village?.id || 'vil_bhiti',
      villageName: village?.name || 'Bhiti Rawat',
      selectedBizId: 'dairy_farming',
      selectedBizName: 'Dairy Farming & Chilling Center',
      businessStatus: 'Planning',
    };
    onLogin('entrepreneur', newProfile, null);
  };

  const handleOfficialLogin = (forcedRole?: 'ias_dm' | 'field_officer') => {
    const roleToUse = forcedRole || officialRoleType;

    if (roleToUse === 'ias_dm') {
      const iasOfficer: OfficerProfile = {
        id: 'officer_ias_dm_gkp',
        phone: '9415000001',
        fullName: 'Shri Alok Kumar (IAS)',
        designation: 'District Magistrate & Collector (ज़िलाधिकारी एवं समाहर्ता)',
        uniqueGovtCode: 'IAS-UP-DM-8891',
        block: 'All Blocks (District Jurisdiction)',
        district: 'Gorakhpur (गोरखपुर)',
        officerRole: 'ias_dm',
        assignedIas: {
          name: 'Shri Alok Kumar',
          cadre: 'IAS (UP Cadre - 2014 Batch)',
          designation: 'District Magistrate & Collector',
          office: 'Office of District Magistrate & Collectorate, Gorakhpur',
          email: 'dm-gorakhpur@nic.in',
          appointmentOrder: 'IAS/UP-CADRE/DM-GKP/2022/9901',
        },
        jurisdictionProof: {
          orderNumber: 'IAS/UP-CADRE/DM-GKP/2022/9901',
          issuingAuthority: 'Department of Personnel & Training (DoPT), Govt of India',
          appointmentDate: '12-Jul-2022',
          lgdBlockCode: 'ALL-BLOCKS-LGD',
          lgdVillages: [],
          authoritySeal: 'Presidential Warrant & State Collectorate Seal',
          verificationStatus: 'GOVT_VERIFIED',
        },
        assignedVillages: [
          { id: 'vil_bhiti', name: 'Bhiti Rawat', totalEnterprises: 14 },
          { id: 'vil_sahjanwa', name: 'Sahjanwa Khas', totalEnterprises: 19 },
          { id: 'vil_ghaghra', name: 'Ghaghrasur', totalEnterprises: 8 },
        ],
      };
      onLogin('official', null, iasOfficer);
    } else {
      const vdoOfficer: OfficerProfile = {
        ...DEFAULT_FIELD_OFFICER,
        officerRole: 'field_officer',
      };
      onLogin('official', null, vdoOfficer);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Top Brand Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.appTitle}>GramUdyam</Text>
            <Text style={styles.appSubtitle}>
              {isEn ? 'Rural Enterprise Intelligence Platform' : 'ग्रामीण उद्यम बुद्धिमत्ता एवं अभिशासन मंच'}
            </Text>

            {/* Language Selector Bar */}
            <View style={styles.langRow}>
              {languages.map((l) => (
                <TouchableOpacity
                  key={l.code}
                  style={[styles.langChip, lang === l.code && styles.langChipActive]}
                  onPress={() => onSetLang(l.code)}
                >
                  <Text style={[styles.langChipText, lang === l.code && styles.langChipTextActive]}>
                    {l.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tab Switcher: Entrepreneur Sign In / Sign Up / Official Login */}
          <View style={styles.tabRow}>
            {[
              { key: 'signin' as AuthTab, icon: 'log-in-outline' as const, label: isEn ? 'Entrepreneur Sign In' : 'उद्यमी प्रवेश' },
              { key: 'signup' as AuthTab, icon: 'person-add-outline' as const, label: isEn ? 'New Register' : 'नया पंजीकरण' },
              { key: 'official' as AuthTab, icon: 'shield-checkmark-outline' as const, label: isEn ? 'Official / IAS Portal' : 'अधिकारी / IAS' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons
                  name={tab.icon}
                  size={14}
                  color={activeTab === tab.key ? COLORS.white : COLORS.textSecondary}
                />
                <Text style={[styles.tabBtnText, activeTab === tab.key && styles.tabBtnTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 1. ENTREPRENEUR SIGN IN */}
          {activeTab === 'signin' && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                {isEn ? '👤 Rural Entrepreneur Sign In' : '👤 ग्रामीण उद्यमी लॉगिन'}
              </Text>
              <Text style={styles.formSubtitle}>
                {isEn ? 'Access your DPR, loan status, and government schemes' : 'अपने डीपीआर, ऋण एवं सरकारी योजनाओं की स्थिति देखें'}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{isEn ? 'Mobile Number' : 'मोबाइल नंबर'}</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="9876543210"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{isEn ? '4-Digit PIN' : '4-अंकीय पिन'}</Text>
                <TextInput
                  style={styles.input}
                  value={pin}
                  onChangeText={setPin}
                  keyboardType="numeric"
                  secureTextEntry
                  placeholder="1234"
                />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSignIn}>
                <Ionicons name="log-in" size={18} color={COLORS.white} />
                <Text style={styles.submitBtnText}>
                  {isEn ? 'Sign In as Entrepreneur' : 'उद्यमी के रूप में लॉगिन करें'}
                </Text>
              </TouchableOpacity>

              {/* Quick Demo Seed Logins */}
              <View style={styles.quickSeedSection}>
                <Text style={styles.quickSeedTitle}>
                  {isEn ? '⚡ ONE-TAP DEMO ENTREPRENEURS:' : '⚡ त्वरित डेमो उद्यमी लॉगिन:'}
                </Text>
                {SEED_REGISTERED_ENTREPRENEURS.map((ent) => (
                  <TouchableOpacity
                    key={ent.id}
                    style={styles.seedChip}
                    onPress={() => onLogin('entrepreneur', ent.profile, null)}
                  >
                    <Ionicons name="person-circle" size={16} color={COLORS.primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.seedName}>{ent.fullName}</Text>
                      <Text style={styles.seedBiz}>{ent.businessSummary}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 2. ENTREPRENEUR SIGN UP */}
          {activeTab === 'signup' && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                {isEn ? '📝 Register Rural Enterprise' : '📝 नए ग्रामीण उद्यम का पंजीकरण'}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{isEn ? 'Full Name *' : 'पूरा नाम *'}</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="e.g. Ramesh Kumar Yadav"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{isEn ? 'Mobile Phone *' : 'मोबाइल नंबर *'}</Text>
                <TextInput
                  style={styles.input}
                  value={signupPhone}
                  onChangeText={setSignupPhone}
                  keyboardType="phone-pad"
                  placeholder="9876543210"
                />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSignUp}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.white} />
                <Text style={styles.submitBtnText}>
                  {isEn ? 'Create Entrepreneur Account' : 'खाता बनाएं एवं आगे बढ़ें'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 3. OFFICIAL / IAS LOGIN */}
          {activeTab === 'official' && (
            <View style={[styles.formCard, styles.formCardOfficial]}>
              <View style={styles.officialHeader}>
                <Text style={styles.officialTitle}>
                  {isEn ? '🏛️ Official Government Portal' : '🏛️ शासकीय अभिशासन एवं IAS पोर्टल'}
                </Text>
                <View style={styles.restrictedBadge}>
                  <Ionicons name="lock-closed" size={10} color="#991b1b" />
                  <Text style={styles.restrictedBadgeText}>Restricted Access</Text>
                </View>
              </View>

              {/* Role Toggle: IAS DM vs VDO */}
              <Text style={styles.inputLabel}>{isEn ? 'Select Official Role:' : 'शासकीय पद का चयन करें:'}</Text>
              <View style={styles.roleToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.roleToggleBtn,
                    officialRoleType === 'ias_dm' && styles.roleToggleBtnActiveIas,
                  ]}
                  onPress={() => setOfficialRoleType('ias_dm')}
                >
                  <Text style={{ fontSize: 16 }}>🏛️</Text>
                  <Text
                    style={[
                      styles.roleToggleText,
                      officialRoleType === 'ias_dm' && styles.roleToggleTextActiveIas,
                    ]}
                  >
                    IAS District Magistrate (DM)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleToggleBtn,
                    officialRoleType === 'field_officer' && styles.roleToggleBtnActiveVdo,
                  ]}
                  onPress={() => setOfficialRoleType('field_officer')}
                >
                  <Text style={{ fontSize: 16 }}>📋</Text>
                  <Text
                    style={[
                      styles.roleToggleText,
                      officialRoleType === 'field_officer' && styles.roleToggleTextActiveVdo,
                    ]}
                  >
                    VDO / Gram Sachiv
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Quick One-Tap Official Logins */}
              <View style={styles.quickOfficialBox}>
                <Text style={styles.quickOfficialTitle}>
                  {isEn ? '⚡ ONE-TAP DIRECT OFFICIAL ACCESS:' : '⚡ त्वरित शासकीय अभिप्रमाणन:'}
                </Text>
                <TouchableOpacity
                  style={styles.directIasBtn}
                  onPress={() => handleOfficialLogin('ias_dm')}
                >
                  <Text style={{ fontSize: 18 }}>🏛️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.directIasTitle}>
                      {isEn ? 'Enter as IAS District Magistrate' : 'आईएएस ज़िलाधिकारी (DM) प्रवेश'}
                    </Text>
                    <Text style={styles.directIasSub}>
                      Shri Alok Kumar (IAS) • Presidential Commission
                    </Text>
                  </View>
                  <Ionicons name="shield-checkmark" size={18} color="#92400e" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.directVdoBtn}
                  onPress={() => handleOfficialLogin('field_officer')}
                >
                  <Text style={{ fontSize: 18 }}>📋</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.directVdoTitle}>
                      {isEn ? 'Enter as Field Officer (VDO)' : 'ग्राम विकास अधिकारी (VDO) प्रवेश'}
                    </Text>
                    <Text style={styles.directVdoSub}>
                      Sanjay Verma (VDO) • Sahjanwa Block
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#6b21a8" />
                </TouchableOpacity>
              </View>

              {/* Manual Government Order No. Form */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {isEn ? 'Govt Gazette Order No. / Service Dispatch Code' : 'सरकारी आदेश क्रमांक / राजपत्र कोड'}
                </Text>
                <TextInput
                  style={[styles.input, { fontFamily: 'monospace', fontSize: 11 }]}
                  value={govtOrderNo}
                  onChangeText={setGovtOrderNo}
                  placeholder="GOV/UP/PANCHAYAT/2024/7712-B"
                />
              </View>

              <TouchableOpacity
                style={styles.officialSubmitBtn}
                onPress={() => handleOfficialLogin()}
              >
                <Ionicons name="shield-checkmark" size={16} color={COLORS.white} />
                <Text style={styles.officialSubmitBtnText}>
                  {officialRoleType === 'ias_dm'
                    ? (isEn ? 'Authenticate as IAS District Magistrate' : 'आईएएस ज़िलाधिकारी के रूप में सत्यापित करें')
                    : (isEn ? 'Authenticate as Field Officer (VDO)' : 'ग्राम विकास अधिकारी के रूप में सत्यापित करें')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  logoContainer: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    ...SHADOW.md,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  appSubtitle: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  langRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: SPACING.sm,
  },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  langChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  langChipTextActive: {
    color: COLORS.white,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: RADIUS.md,
    padding: 3,
    gap: 3,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
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
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  formCardOfficial: {
    borderColor: '#c084fc',
    backgroundColor: '#fdf4ff',
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  formSubtitle: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  inputGroup: {
    gap: 3,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
  },
  submitBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.white,
  },
  quickSeedSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 6,
  },
  quickSeedTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.textTertiary,
    letterSpacing: 0.5,
  },
  seedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  seedName: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  seedBiz: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  officialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  officialTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#3b0764',
  },
  restrictedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  restrictedBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#991b1b',
  },
  roleToggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  roleToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  roleToggleBtnActiveIas: {
    borderColor: '#b45309',
    backgroundColor: '#fef3c7',
  },
  roleToggleBtnActiveVdo: {
    borderColor: '#7e22ce',
    backgroundColor: '#f3e8ff',
  },
  roleToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    flex: 1,
  },
  roleToggleTextActiveIas: {
    color: '#92400e',
    fontWeight: '900',
  },
  roleToggleTextActiveVdo: {
    color: '#6b21a8',
    fontWeight: '900',
  },
  quickOfficialBox: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  quickOfficialTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#6b21a8',
    letterSpacing: 0.5,
  },
  directIasBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 8,
    borderRadius: RADIUS.md,
  },
  directIasTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#92400e',
  },
  directIasSub: {
    fontSize: 9,
    color: '#b45309',
  },
  directVdoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#faf5ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
    padding: 8,
    borderRadius: RADIUS.md,
  },
  directVdoTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#6b21a8',
  },
  directVdoSub: {
    fontSize: 9,
    color: '#7e22ce',
  },
  officialSubmitBtn: {
    backgroundColor: '#4c1d95',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  officialSubmitBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
});
