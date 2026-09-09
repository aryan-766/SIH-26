/**
 * GramUdyam — Universal App Header
 * Top bar with Language Switcher, Voice Narrator/Mic, Role Switcher, and Logout
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS } from '../theme';
import { Language } from '../locales';
import { VoiceNarrator } from './VoiceNarrator';
import { VoiceMicButton } from './VoiceMicButton';
import { BeneficiaryProfile, OfficerProfile } from '../services/enterpriseStore';

interface Props {
  lang: Language;
  onSetLang: (l: Language) => void;
  role: 'entrepreneur' | 'official';
  onToggleRole: () => void;
  onLogout: () => void;
  userProfile?: BeneficiaryProfile | null;
  officerProfile?: OfficerProfile | null;
  currentScreenTitle?: string;
  narrationText?: string;
  onVoiceTranscript?: (text: string) => void;
}

export const AppHeader: React.FC<Props> = ({
  lang,
  onSetLang,
  role,
  onToggleRole,
  onLogout,
  userProfile,
  officerProfile,
  currentScreenTitle,
  narrationText,
  onVoiceTranscript,
}) => {
  const isEn = lang === 'en';
  const isIas = officerProfile?.officerRole === 'ias_dm';

  const languages: { code: Language; label: string }[] = [
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'EN' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  const defaultNarration = narrationText || (
    role === 'entrepreneur'
      ? (isEn
          ? `Welcome to GramUdyam. You are exploring rural business opportunities in ${userProfile?.districtName || 'Gorakhpur'}. Check your DPR, calculate loans, and apply for government subsidies.`
          : `ग्रामउद्यम में आपका स्वागत है। आप ${userProfile?.districtName || 'गोरखपुर'} में ग्रामीण व्यापार अवसरों की खोज कर रहे हैं। अपना DPR देखें, ऋण की गणना करें और सरकारी सब्सिडी के लिए आवेदन करें।`)
      : (isEn
          ? `GramUdyam Official Command Dashboard. Monitoring enterprise verification, GIS radar, beneficiary pipeline, and subsidy disbursements.`
          : `ग्रामउद्यम शासकीय डैशबोर्ड। उद्यम सत्यापन, GIS रडार, लाभार्थी पाइपलाइन एवं सब्सिडी वितरण का लाइव पर्यवेक्षण।`)
  );

  return (
    <View style={styles.container}>
      {/* Top Brand Strip */}
      <View style={styles.topRow}>
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
              <View
                style={[
                  styles.rolePill,
                  role === 'official'
                    ? (isIas ? styles.rolePillIas : styles.rolePillVdo)
                    : styles.rolePillEnt,
                ]}
              >
                <Text
                  style={[
                    styles.rolePillText,
                    role === 'official'
                      ? (isIas ? styles.rolePillTextIas : styles.rolePillTextVdo)
                      : styles.rolePillTextEnt,
                  ]}
                >
                  {role === 'official'
                    ? (isIas ? '🏛️ IAS DM' : '📋 VDO Sachiv')
                    : (isEn ? 'Entrepreneur' : 'उद्यमी')}
                </Text>
              </View>
            </View>
            <Text style={styles.locationSub}>
              📍 {role === 'official'
                ? `${officerProfile?.district || 'Gorakhpur'} • ${officerProfile?.fullName || 'Officer'}`
                : `${userProfile?.districtName || 'Gorakhpur'} • ${userProfile?.villageName || 'Bhiti Rawat'}`}
            </Text>
          </View>
        </View>

        {/* Action Controls: Switch Role & Logout */}
        <View style={styles.actionsRight}>
          <TouchableOpacity
            style={styles.switchRoleBtn}
            onPress={onToggleRole}
            activeOpacity={0.7}
          >
            <Ionicons
              name="swap-horizontal"
              size={14}
              color={role === 'official' ? COLORS.accent : COLORS.primary}
            />
            <Text
              style={[
                styles.switchRoleText,
                { color: role === 'official' ? COLORS.accent : COLORS.primary },
              ]}
            >
              {role === 'official'
                ? (isEn ? 'Citizen App' : 'उद्यमी मोड')
                : (isEn ? 'Officer Portal' : 'अधिकारी पोर्टल')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Controls Strip: Language Selector + Voice Narrator + Voice Mic */}
      <View style={styles.controlsRow}>
        {/* Language Selector Chips */}
        <View style={styles.langChips}>
          {languages.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.langChip, lang === l.code && styles.langChipActive]}
              onPress={() => onSetLang(l.code)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.langChipText,
                  lang === l.code && styles.langChipTextActive,
                ]}
              >
                {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Voice Features (Narrator + Mic) */}
        <View style={styles.voiceGroup}>
          <VoiceNarrator textToSpeak={defaultNarration} lang={lang} />
          {onVoiceTranscript && (
            <VoiceMicButton onTranscript={onVoiceTranscript} lang={lang} size={30} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    zIndex: 50,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
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
  rolePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  rolePillEnt: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  rolePillIas: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  rolePillVdo: {
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#d8b4fe',
  },
  rolePillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  rolePillTextEnt: {
    color: '#047857',
  },
  rolePillTextIas: {
    color: '#b45309',
  },
  rolePillTextVdo: {
    color: '#6b21a8',
  },
  locationSub: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchRoleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  switchRoleText: {
    fontSize: 10,
    fontWeight: '700',
  },
  logoutBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  langChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  langChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    backgroundColor: '#f1f5f9',
  },
  langChipActive: {
    backgroundColor: COLORS.primary,
  },
  langChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  langChipTextActive: {
    color: COLORS.white,
  },
  voiceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
