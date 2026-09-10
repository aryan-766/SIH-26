/**
 * GramUdyam — AI Business Advisor & Officer Chat Screen
 * Integrated two-way messaging between Citizen, AI, and Field Officer (VDO/IAS)
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import {
  BeneficiaryProfile, AdvisorThread, DEFAULT_FIELD_OFFICER,
  getOrCreateThreadForCitizen, postAdvisorMessage, generateAiAdvisorSupport,
  subscribeToStore
} from '../services/enterpriseStore';
import { Language } from '../locales';

interface Props {
  userProfile: BeneficiaryProfile;
  lang: Language;
}

const QUICK_PROMPTS_EN = [
  '💰 How to get 35% PMEGP subsidy?',
  '🏦 Apply for MUDRA Kishor loan',
  '📊 Analyze my dairy cash flow',
  '🏛️ Inspection visit request for VDO',
  '📋 Documents needed for bank sanction',
];

const QUICK_PROMPTS_HI = [
  '💰 35% PMEGP सब्सिडी कैसे मिलेगी?',
  '🏦 मुद्रा किशोर ऋण हेतु आवेदन',
  '📊 मेरे डेयरी व्यवसाय का विश्लेषण',
  '🏛️ VDO अधिकारी से भौतिक निरीक्षण का अनुरोध',
  '📋 बैंक ऋण स्वीकृति के लिए आवश्यक दस्तावेज',
];

export const AdvisorScreen: React.FC<Props> = ({ userProfile, lang }) => {
  const isEn = lang === 'en';
  const scrollRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [thread, setThread] = useState<AdvisorThread | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [routedNotice, setRoutedNotice] = useState<string | null>(null);

  const loadThread = () => {
    const active = getOrCreateThreadForCitizen(userProfile);
    setThread({ ...active });
  };

  useEffect(() => {
    loadThread();
    const unsub = subscribeToStore(loadThread);
    return () => unsub();
  }, [userProfile.phone, userProfile.fullName]);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [thread?.messages.length]);

  const handleSendMessage = (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || !thread) return;

    // 1. Post citizen message to store
    postAdvisorMessage(
      thread.id,
      textToSend,
      'citizen',
      userProfile.fullName || (isEn ? 'Rural Entrepreneur' : 'ग्रामीण उद्यमी')
    );
    if (!customText) setInputText('');

    // Show routing banner
    setRoutedNotice(
      isEn
        ? `Delivered to Field Officer (${DEFAULT_FIELD_OFFICER.fullName}, VDO) inbox for ${userProfile.villageName || 'Bhiti Rawat'}`
        : `संदेश आपके ग्राम नोडल अधिकारी (${DEFAULT_FIELD_OFFICER.fullName}, VDO) के इनबॉक्स में भेज दिया गया है`
    );
    setTimeout(() => setRoutedNotice(null), 4500);

    // 2. Trigger instant AI response
    setIsAiThinking(true);
    setTimeout(() => {
      const aiReply = generateAiAdvisorSupport(textToSend, userProfile.selectedBizName || 'Dairy Enterprise');
      postAdvisorMessage(
        thread.id,
        aiReply,
        'ai',
        'GramUdyam AI Advisor',
        'AI Powered 24/7'
      );
      setIsAiThinking(false);
    }, 600);
  };

  const quickPrompts = isEn ? QUICK_PROMPTS_EN : QUICK_PROMPTS_HI;
  const officer = DEFAULT_FIELD_OFFICER;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header: AI Advisor + Officer Connection */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerIcon}>
              <Ionicons name="sparkles" size={20} color={COLORS.success} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>
                  {isEn ? 'AI Advisor & Officer Desk' : 'AI सलाहकार व नोडल डेस्क'}
                </Text>
                <View style={styles.badge24}>
                  <Text style={styles.badge24Text}>AI 24/7</Text>
                </View>
              </View>
              <Text style={styles.headerSubtitle}>
                {isEn
                  ? 'Instant AI intelligence + Direct VDO Officer routing'
                  : 'तत्काल AI सलाह + सीधे क्षेत्रीय VDO अधिकारी को प्रेषित'}
              </Text>
            </View>
          </View>

          {/* Assigned Officer Card */}
          <View style={styles.officerStrip}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.officerLabel}>
                {isEn ? 'Assigned Area Officer:' : 'आपके ग्राम नोडल अधिकारी:'}
              </Text>
              <Text style={styles.officerName}>
                {officer.fullName} (VDO) • {userProfile.villageName || 'Bhiti Rawat'}
              </Text>
            </View>
            <View style={styles.onlinePill}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>{isEn ? 'Active' : 'सक्रिय'}</Text>
            </View>
          </View>
        </View>

        {/* Routed Notice Banner */}
        {routedNotice && (
          <View style={styles.noticeBanner}>
            <Ionicons name="paper-plane" size={14} color="#15803d" />
            <Text style={styles.noticeText}>{routedNotice}</Text>
          </View>
        )}

        {/* Quick Prompts Bar */}
        <View style={styles.quickBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}>
            {quickPrompts.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickChip}
                onPress={() => handleSendMessage(q)}
              >
                <Text style={styles.quickChipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Thread */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messageScroll}
          showsVerticalScrollIndicator={false}
        >
          {thread?.messages.map((m) => {
            const isCitizen = m.sender === 'citizen';
            const isOfficer = m.sender === 'officer';
            const isAi = m.sender === 'ai';

            return (
              <View
                key={m.id}
                style={[
                  styles.msgWrapper,
                  isCitizen ? styles.msgWrapperRight : styles.msgWrapperLeft,
                ]}
              >
                {/* Sender Meta */}
                <View style={[styles.senderRow, isCitizen && { justifyContent: 'flex-end' }]}>
                  <Text style={styles.senderName}>{m.senderName}</Text>
                  <Text style={styles.senderDot}>•</Text>
                  <Text style={styles.senderTime}>{m.timestamp}</Text>
                </View>

                {/* Bubble */}
                <View
                  style={[
                    styles.bubble,
                    isCitizen && styles.bubbleCitizen,
                    isAi && styles.bubbleAi,
                    isOfficer && styles.bubbleOfficer,
                  ]}
                >
                  {/* Badge */}
                  {m.badge && (
                    <View style={styles.badgeRow}>
                      <Ionicons
                        name={isOfficer ? 'shield-checkmark' : 'sparkles'}
                        size={12}
                        color={isOfficer ? COLORS.accent : '#047857'}
                      />
                      <Text
                        style={[
                          styles.bubbleBadge,
                          isOfficer ? { color: COLORS.accent } : { color: '#047857' },
                        ]}
                      >
                        {m.badge}
                      </Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.msgText,
                      isCitizen && styles.msgTextCitizen,
                      isAi && styles.msgTextAi,
                      isOfficer && styles.msgTextOfficer,
                    ]}
                  >
                    {m.text}
                  </Text>
                </View>
              </View>
            );
          })}

          {isAiThinking && (
            <View style={[styles.msgWrapper, styles.msgWrapperLeft]}>
              <View style={[styles.bubble, styles.bubbleAi]}>
                <Text style={styles.thinkingText}>
                  {isEn ? 'AI Advisor is thinking...' : 'AI सलाहकार उत्तर तैयार कर रहा है...'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={
              isEn
                ? 'Ask about schemes, loans, or request officer visit...'
                : 'योजनाओं, ऋण या अधिकारी निरीक्षण के बारे में पूछें...'
            }
            placeholderTextColor={COLORS.textTertiary}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#064e3b',
    padding: SPACING.md,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
    ...SHADOW.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT.sm,
    fontWeight: '800',
    color: COLORS.white,
  },
  badge24: {
    backgroundColor: 'rgba(16,185,129,0.25)',
    borderWidth: 1,
    borderColor: '#34d399',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  badge24Text: {
    color: '#a7f3d0',
    fontSize: 9,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#a7f3d0',
    marginTop: 2,
  },
  officerStrip: {
    marginTop: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  officerLabel: {
    fontSize: 9,
    color: '#cbd5e1',
  },
  officerName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34,197,94,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  onlineText: {
    fontSize: 9,
    color: '#86efac',
    fontWeight: '700',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    borderBottomWidth: 1,
    borderBottomColor: '#bbf7d0',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  noticeText: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '600',
    flex: 1,
  },
  quickBar: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
  },
  quickScroll: {
    paddingHorizontal: SPACING.sm,
    gap: 6,
  },
  quickChip: {
    backgroundColor: '#f1f5f9',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  messageScroll: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  msgWrapper: {
    maxWidth: '85%',
  },
  msgWrapperRight: {
    alignSelf: 'flex-end',
  },
  msgWrapperLeft: {
    alignSelf: 'flex-start',
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  senderName: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  senderDot: {
    fontSize: 8,
    color: COLORS.textTertiary,
  },
  senderTime: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  bubble: {
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
  },
  bubbleCitizen: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  bubbleAi: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderBottomLeftRadius: 2,
  },
  bubbleOfficer: {
    backgroundColor: '#faf5ff',
    borderWidth: 1.5,
    borderColor: '#c084fc',
    borderBottomLeftRadius: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  bubbleBadge: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  msgText: {
    fontSize: 12,
    lineHeight: 18,
  },
  msgTextCitizen: {
    color: COLORS.white,
  },
  msgTextAi: {
    color: '#064e3b',
  },
  msgTextOfficer: {
    color: '#3b0764',
    fontWeight: '500',
  },
  thinkingText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#047857',
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    fontSize: 12,
    color: COLORS.textPrimary,
    maxHeight: 80,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
