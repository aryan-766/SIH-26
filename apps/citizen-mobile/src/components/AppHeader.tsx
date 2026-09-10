/**
 * GramUdyam — Universal App Header
 * Top bar with Language Dropdown and Logout
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS } from '../theme';
import { Language } from '../locales';
import { BeneficiaryProfile, OfficerProfile } from '../services/enterpriseStore';

interface Props {
  lang: Language;
  onSetLang: (l: Language) => void;
  role: 'entrepreneur' | 'official';
  onToggleRole?: () => void;
  onLogout: () => void;
  userProfile?: BeneficiaryProfile | null;
  officerProfile?: OfficerProfile | null;
  currentScreenTitle?: string;
  narrationText?: string;
  onVoiceTranscript?: (text: string) => void;
  onOpenVoiceAssistant?: () => void;
}

export const AppHeader: React.FC<Props> = ({
  lang,
  onSetLang,
  role,
  onLogout,
  userProfile,
  officerProfile,
}) => {
  const isIas = officerProfile?.officerRole === 'ias_dm';
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
  ];

  const selectedLangObj = languages.find((l) => l.code === lang) || languages[0];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          {/* Brand Group (Left) */}
          <View style={styles.brandGroup}>
            <View style={[styles.logoBox, role === 'official' && styles.logoBoxOfficer]}>
              <Ionicons
                name={role === 'official' ? (isIas ? 'business' : 'shield') : 'leaf'}
                size={18}
                color={COLORS.white}
              />
            </View>
            <View>
              <View style={styles.brandTitleRow}>
                <Text style={styles.brandName}>GramUdyam</Text>
              </View>
              <Text style={styles.locationSub}>
                📍 {role === 'official'
                  ? `${officerProfile?.district || 'Gorakhpur'} • ${officerProfile?.fullName || 'Officer'}`
                  : `${userProfile?.districtName || 'Gorakhpur'} • ${userProfile?.villageName || 'Bhiti Rawat'}`}
              </Text>
            </View>
          </View>

          {/* Actions Right: Language Dropdown + Logout */}
          <View style={styles.actionsRight}>
            {/* Language Dropdown Selector */}
            <View style={styles.langDropdownContainer}>
              <TouchableOpacity
                style={styles.langDropdownBtn}
                onPress={() => setLangDropdownOpen(!langDropdownOpen)}
                activeOpacity={0.7}
              >
                <Ionicons name="globe-outline" size={13} color={COLORS.primary} />
                <Text style={styles.langDropdownText}>{selectedLangObj.label}</Text>
                <Ionicons
                  name={langDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={12}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>

              {langDropdownOpen && (
                <View style={styles.langDropdownMenu}>
                  {languages.map((l) => (
                    <TouchableOpacity
                      key={l.code}
                      style={[
                        styles.langDropdownOption,
                        lang === l.code && styles.langDropdownOptionActive,
                      ]}
                      onPress={() => {
                        onSetLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.langDropdownOptionText,
                          lang === l.code && styles.langDropdownOptionTextActive,
                        ]}
                      >
                        {l.label}
                      </Text>
                      {lang === l.code && (
                        <Ionicons name="checkmark" size={12} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={onLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 50,
  },
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBoxOfficer: {
    backgroundColor: COLORS.accent,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  locationSub: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutBtn: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  langDropdownContainer: {
    position: 'relative',
    zIndex: 100,
  },
  langDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
  },
  langDropdownText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  langDropdownMenu: {
    position: 'absolute',
    top: 34,
    right: 0,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: 4,
    minWidth: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  langDropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  langDropdownOptionActive: {
    backgroundColor: '#ecfdf5',
  },
  langDropdownOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  langDropdownOptionTextActive: {
    fontWeight: '800',
    color: COLORS.primary,
  },
});
