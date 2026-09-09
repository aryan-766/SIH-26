/**
 * GramUdyam — Official & IAS Dashboard Screen
 * Comprehensive District Command, Area CRM, Live Citizen Chats, and IAS Magisterial Records
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT, RADIUS, SHADOW } from '../theme';
import {
  OfficerProfile, VillageBusiness, AdvisorThread,
  getAllVillageBusinesses, getBusinessesByVillage, saveVillageBusiness,
  updateBusinessInspection, getAllAdvisorThreads, getAdvisorThreadsForVillage,
  postAdvisorMessage, subscribeToStore, DEFAULT_FIELD_OFFICER
} from '../services/enterpriseStore';
import { PAN_INDIA_GOV_SCHEMES } from '../services/panIndiaSchemesData';
import { Language } from '../locales';

interface Props {
  officerProfile: OfficerProfile | null;
  lang: Language;
  onLogout: () => void;
}

type OfficerTab = 'directory' | 'schemes' | 'inbox' | 'proof';

export const OfficerDashboardScreen: React.FC<Props> = ({
  officerProfile,
  lang,
  onLogout
}) => {
  const isEn = lang === 'en';
  const officer = officerProfile || DEFAULT_FIELD_OFFICER;
  const isIas = officer.officerRole === 'ias_dm';

  const [activeTab, setActiveTab] = useState<OfficerTab>('directory');
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live Data from Store
  const [businesses, setBusinesses] = useState<VillageBusiness[]>([]);
  const [threads, setThreads] = useState<AdvisorThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Inspection Modal State
  const [selectedBiz, setSelectedBiz] = useState<VillageBusiness | null>(null);
  const [inspectStatus, setInspectStatus] = useState<VillageBusiness['schemeStatus']>('Field Verified');
  const [inspectSubsidy, setInspectSubsidy] = useState<string>('168000');
  const [inspectNotes, setInspectNotes] = useState<string>('');

  // New Ground Survey Modal State
  const [showAddSurveyModal, setShowAddSurveyModal] = useState<boolean>(false);
  const [surveyName, setSurveyName] = useState('');
  const [surveyPhone, setSurveyPhone] = useState('');
  const [surveyBiz, setSurveyBiz] = useState('');
  const [surveyInvestment, setSurveyInvestment] = useState('200000');

  // Proof Document View Modal
  const [showProofModal, setShowProofModal] = useState<boolean>(false);

  const refreshData = () => {
    const bizList = selectedVillage === 'all'
      ? getAllVillageBusinesses()
      : getBusinessesByVillage(selectedVillage);
    setBusinesses(bizList);

    const threadList = getAdvisorThreadsForVillage(selectedVillage);
    setThreads(threadList);
    if (!activeThreadId && threadList.length > 0) {
      setActiveThreadId(threadList[0].id);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = subscribeToStore(refreshData);
    return () => unsub();
  }, [selectedVillage]);

  // Reply in Chat
  const handleSendReply = () => {
    if (!replyText.trim() || !activeThreadId) return;
    postAdvisorMessage(
      activeThreadId,
      replyText.trim(),
      'officer',
      `${officer.fullName} (${isIas ? 'IAS DM' : 'VDO'})`,
      'Official Endorsement'
    );
    setReplyText('');
  };

  // Quick Action Pill
  const handleQuickPill = (text: string) => {
    if (!activeThreadId) return;
    postAdvisorMessage(
      activeThreadId,
      text,
      'officer',
      `${officer.fullName} (${isIas ? 'IAS DM' : 'VDO'})`,
      'Verified Action Taken'
    );
  };

  // Save Inspection
  const handleSaveInspection = () => {
    if (!selectedBiz) return;
    updateBusinessInspection(
      selectedBiz.id,
      inspectNotes || 'Ground inspection verified and endorsed by officer.',
      inspectStatus,
      parseInt(inspectSubsidy) || selectedBiz.subsidyAmount,
      'Strong / Repaying'
    );
    setSelectedBiz(null);
    Alert.alert(isEn ? 'Updated' : 'अद्यतन किया गया', isEn ? 'Inspection record updated' : 'निरीक्षण विवरण सहेजा गया');
  };

  // Save Ground Survey
  const handleCreateSurvey = () => {
    if (!surveyName.trim() || !surveyPhone.trim()) {
      Alert.alert(isEn ? 'Error' : 'त्रुटि', isEn ? 'Please fill required fields' : 'कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }
    const inv = parseInt(surveyInvestment) || 150000;
    const sub = Math.round(inv * 0.35);
    const newBiz: VillageBusiness = {
      id: 'biz_survey_' + Date.now(),
      entrepreneurName: surveyName.trim(),
      phone: surveyPhone.trim(),
      businessName: surveyBiz.trim() || `${surveyName}'s Enterprise`,
      category: 'Agro & Food Processing',
      villageId: 'vil_bhiti',
      villageName: 'Bhiti Rawat',
      block: officer.block || 'Sahjanwa',
      investment: inv,
      annualTurnover: inv * 2.5,
      allocatedScheme: 'PMEGP (35% Subsidy)',
      subsidyPercent: 35,
      subsidyAmount: sub,
      bankName: 'Punjab National Bank - Sahjanwa',
      schemeStatus: 'Field Verified',
      sanctionedAmount: Math.round(inv * 0.85),
      riskStatus: 'Low Risk',
      performanceHealth: 'Under Inspection',
      lastInspectionDate: new Date().toLocaleDateString('en-GB'),
      inspectionNotes: 'Field survey registered by official on GramUdyam mobile app.',
      gpsCoordinates: { lat: 26.745, lng: 83.25 },
    };
    saveVillageBusiness(newBiz);
    setShowAddSurveyModal(false);
    setSurveyName('');
    setSurveyPhone('');
    setSurveyBiz('');
    Alert.alert(isEn ? 'Success' : 'सफलता', isEn ? 'New ground survey registered' : 'नया भू-सर्वेक्षण पंजीकृत किया गया');
  };

  const activeThread = threads.find((t) => t.id === activeThreadId);
  const unreadCount = threads.filter((t) => t.unreadByOfficer).length;

  const filteredBusinesses = businesses.filter((b) => {
    return (
      b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.entrepreneurName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.allocatedScheme?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top Magisterial Officer Identity Card */}
        <View style={[styles.headerCard, isIas && styles.headerCardIas]}>
          <View style={styles.headerTopRow}>
            <View style={[styles.avatarBox, isIas && styles.avatarBoxIas]}>
              <Text style={{ fontSize: 20 }}>{isIas ? '🏛️' : '📋'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.officerNameText}>{officer.fullName}</Text>
                <View style={[styles.roleBadge, isIas && styles.roleBadgeIas]}>
                  <Text style={[styles.roleBadgeText, isIas && styles.roleBadgeTextIas]}>
                    {isIas ? 'IAS APEX DM' : 'VDO SACHIV'}
                  </Text>
                </View>
              </View>
              <Text style={styles.desigText}>{officer.designation}</Text>
              <Text style={styles.govtCodeText}>{officer.uniqueGovtCode}</Text>
            </View>
          </View>

          {/* IAS Magisterial Jurisdiction Strip */}
          {isIas ? (
            <View style={styles.iasStrip}>
              <View style={{ flex: 1 }}>
                <Text style={styles.iasApexTitle}>
                  {isEn ? 'PRESIDENTIAL COMMISSION & DISTRICT OVERSIGHT' : 'राष्ट्रपति आदेशाधीन ज़िला समाहर्ता अधिकारिता'}
                </Text>
                <Text style={styles.iasSub}>
                  {officer.assignedIas.cadre} • {isEn ? 'All Blocks Jurisdiction' : 'समग्र ज़िला अधिकारिता'}
                </Text>
                <Text style={styles.iasOrder}>
                  Gazette Order: {officer.assignedIas.appointmentOrder || 'IAS/UP-CADRE/DM-GKP/2022/9901'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewOrderBtn}
                onPress={() => setShowProofModal(true)}
              >
                <Ionicons name="document-text" size={12} color="#92400e" />
                <Text style={styles.viewOrderBtnText}>{isEn ? 'Gazette' : 'राजपत्र'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.vdoStrip}>
              <Ionicons name="person-circle" size={16} color="#fcd34d" />
              <View style={{ flex: 1 }}>
                <Text style={styles.vdoSuperTitle}>
                  {isEn ? 'Supervisory IAS District Magistrate:' : 'पर्यवेक्षी आईएएस ज़िलाधिकारी:'}
                </Text>
                <Text style={styles.vdoSuperName}>
                  {officer.assignedIas.name} ({officer.assignedIas.cadre})
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewOrderBtn}
                onPress={() => setShowProofModal(true)}
              >
                <Ionicons name="document-text" size={12} color="#92400e" />
                <Text style={styles.viewOrderBtnText}>{isEn ? 'Service ID' : 'सेवा कार्ड'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Real-Time Metrics Strip */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLbl}>{isEn ? 'Enterprises' : 'उद्यम'}</Text>
              <Text style={styles.metricNum}>{businesses.length}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLbl}>{isEn ? 'Subsidies' : 'सब्सिडी'}</Text>
              <Text style={[styles.metricNum, { color: '#a7f3d0' }]}>
                ₹{(businesses.reduce((acc, b) => acc + (b.subsidyAmount || 0), 0) / 100000).toFixed(1)}L
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLbl}>{isEn ? 'Sanctioned' : 'स्वीकृत'}</Text>
              <Text style={styles.metricNum}>
                {businesses.filter((b) => b.schemeStatus === 'Sanctioned' || b.schemeStatus === 'Disbursed').length}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLbl}>{isEn ? 'Inquiries' : 'संदेश'}</Text>
              <Text style={[styles.metricNum, { color: '#fde047' }]}>{threads.length}</Text>
            </View>
          </View>
        </View>

        {/* 4 Main Sub-Navigation Tabs */}
        <View style={styles.tabBar}>
          {[
            { key: 'directory' as OfficerTab, label: isEn ? 'CRM Directory' : 'उद्यमी सूची', icon: 'business' },
            { key: 'schemes' as OfficerTab, label: isEn ? 'Schemes' : 'योजनाएं', icon: 'ribbon' },
            { key: 'inbox' as OfficerTab, label: isEn ? `Inbox (${threads.length})` : `संदेश (${threads.length})`, icon: 'chatbubbles', badge: unreadCount },
            { key: 'proof' as OfficerTab, label: isEn ? (isIas ? 'IAS Gazette' : 'Service Proof') : (isIas ? 'राजपत्र' : 'सेवा प्रमाण'), icon: 'shield-checkmark' },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabBtn, activeTab === t.key && styles.tabBtnActive]}
              onPress={() => setActiveTab(t.key)}
            >
              <Ionicons
                name={t.icon as any}
                size={14}
                color={activeTab === t.key ? (isIas ? '#78350f' : '#3b0764') : COLORS.textTertiary}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === t.key && (isIas ? styles.tabBtnTextActiveIas : styles.tabBtnTextActive),
                ]}
              >
                {t.label}
              </Text>
              {t.badge ? <View style={styles.unreadDot} /> : null}
            </TouchableOpacity>
          ))}
        </View>

        {/* TAB 1: CRM DIRECTORY & GROUND SURVEYS */}
        {activeTab === 'directory' && (
          <View style={styles.tabContent}>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={14} color={COLORS.textTertiary} />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={isEn ? 'Search enterprise or citizen...' : 'उद्यमी या व्यवसाय खोजें...'}
                  placeholderTextColor={COLORS.textTertiary}
                />
              </View>
              <TouchableOpacity
                style={styles.newSurveyBtn}
                onPress={() => setShowAddSurveyModal(true)}
              >
                <Ionicons name="add" size={16} color={COLORS.white} />
                <Text style={styles.newSurveyBtnText}>{isEn ? 'Survey' : 'सर्वे'}</Text>
              </TouchableOpacity>
            </View>

            {/* List of Registered Businesses */}
            {filteredBusinesses.map((biz) => (
              <TouchableOpacity
                key={biz.id}
                style={styles.bizCard}
                onPress={() => {
                  setSelectedBiz(biz);
                  setInspectStatus(biz.schemeStatus);
                  setInspectSubsidy(biz.subsidyAmount?.toString() || '150000');
                  setInspectNotes(biz.inspectionNotes || '');
                }}
                activeOpacity={0.7}
              >
                <View style={styles.bizTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bizCategory}>{biz.category}</Text>
                    <Text style={styles.bizTitle}>{biz.businessName}</Text>
                    <Text style={styles.bizMeta}>
                      👤 {biz.entrepreneurName} • 📞 {biz.phone}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      biz.schemeStatus === 'Disbursed'
                        ? styles.statusDisbursed
                        : biz.schemeStatus === 'Sanctioned'
                        ? styles.statusSanctioned
                        : styles.statusVerified,
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{biz.schemeStatus}</Text>
                  </View>
                </View>

                <View style={styles.bizFinanceRow}>
                  <View>
                    <Text style={styles.finSubLbl}>{isEn ? 'Scheme' : 'योजना'}</Text>
                    <Text style={styles.finSubVal}>{biz.allocatedScheme || 'PMEGP'}</Text>
                  </View>
                  <View>
                    <Text style={styles.finSubLbl}>{isEn ? 'Subsidy 35%' : 'सब्सिडी 35%'}</Text>
                    <Text style={[styles.finSubVal, { color: '#047857' }]}>
                      ₹{biz.subsidyAmount?.toLocaleString()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.finSubLbl}>{isEn ? 'Bank' : 'बैंक'}</Text>
                    <Text style={styles.finSubVal} numberOfLines={1}>{biz.bankName || 'PNB'}</Text>
                  </View>
                </View>

                <View style={styles.bizActionRow}>
                  <Text style={styles.inspectHint}>
                    🔍 {isEn ? 'Tap to Inspect & Update Status' : 'निरीक्षण एवं स्थिति बदलने हेतु टैप करें'}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={COLORS.textTertiary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TAB 2: SCHEMES & SUBSIDIES */}
        {activeTab === 'schemes' && (
          <View style={styles.tabContent}>
            {PAN_INDIA_GOV_SCHEMES.map((sch) => {
              const schemeName = sch.name[lang] || sch.name.hi || sch.name.en;
              const subsidyText = sch.subsidyDisplay[lang] || sch.subsidyDisplay.hi || sch.subsidyDisplay.en;
              const maxLoanText = sch.maxLoanDisplay[lang] || sch.maxLoanDisplay.hi || sch.maxLoanDisplay.en;

              return (
                <View key={sch.id} style={styles.schemeCard}>
                  <View style={styles.schemeTop}>
                    <Text style={styles.schCode}>{sch.code}</Text>
                    <Text style={styles.schSubsidyRate}>
                      {sch.subsidyRateRural > 0 ? `${sch.subsidyRateRural}% Subsidy` : 'Subvention'}
                    </Text>
                  </View>
                  <Text style={styles.schTitle}>{schemeName}</Text>
                  <View style={styles.schGrid}>
                    <View style={styles.schBox}>
                      <Text style={styles.schBoxLbl}>{isEn ? 'Max Loan' : 'अधिकतम ऋण'}</Text>
                      <Text style={styles.schBoxVal}>{maxLoanText}</Text>
                    </View>
                    <View style={[styles.schBox, { backgroundColor: '#ecfdf5' }]}>
                      <Text style={[styles.schBoxLbl, { color: '#047857' }]}>
                        {isEn ? 'Benefit' : 'सब्सिडी लाभ'}
                      </Text>
                      <Text style={[styles.schBoxVal, { color: '#047857' }]}>{subsidyText}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 3: INBOX & TWO-WAY CITIZEN CHATS */}
        {activeTab === 'inbox' && (
          <View style={styles.tabContent}>
            {/* Thread selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.threadScroll}>
              {threads.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.threadChip,
                    activeThreadId === t.id && styles.threadChipActive,
                  ]}
                  onPress={() => {
                    setActiveThreadId(t.id);
                    t.unreadByOfficer = false;
                  }}
                >
                  <Text
                    style={[
                      styles.threadChipName,
                      activeThreadId === t.id && styles.threadChipNameActive,
                    ]}
                  >
                    {t.entrepreneurName}
                  </Text>
                  <Text
                    style={[
                      styles.threadChipVillage,
                      activeThreadId === t.id && styles.threadChipVillageActive,
                    ]}
                  >
                    {t.villageName}
                  </Text>
                  {t.unreadByOfficer && <View style={styles.chipDot} />}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Active Conversation History */}
            {activeThread && (
              <View style={styles.chatCard}>
                <View style={styles.chatCardHeader}>
                  <View>
                    <Text style={styles.chatEntName}>{activeThread.entrepreneurName}</Text>
                    <Text style={styles.chatBizType}>
                      {activeThread.businessType} • 📞 {activeThread.entrepreneurPhone}
                    </Text>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={12} color="#047857" />
                    <Text style={styles.verifiedBadgeText}>Citizen Desk</Text>
                  </View>
                </View>

                {/* Message Log */}
                <View style={styles.msgLog}>
                  {activeThread.messages.map((m) => (
                    <View
                      key={m.id}
                      style={[
                        styles.bubbleWrap,
                        m.sender === 'officer' ? styles.bubbleWrapRight : styles.bubbleWrapLeft,
                      ]}
                    >
                      <View style={styles.msgMetaRow}>
                        <Text style={styles.msgSender}>{m.senderName}</Text>
                        <Text style={styles.msgTime}>{m.timestamp}</Text>
                      </View>
                      <View
                        style={[
                          styles.chatBubble,
                          m.sender === 'officer'
                            ? styles.chatBubbleOfficer
                            : m.sender === 'ai'
                            ? styles.chatBubbleAi
                            : styles.chatBubbleCitizen,
                        ]}
                      >
                        {m.badge && (
                          <Text style={styles.msgBadgeText}>✓ {m.badge}</Text>
                        )}
                        <Text
                          style={[
                            styles.msgTextContent,
                            m.sender === 'officer' && styles.msgTextContentOfficer,
                          ]}
                        >
                          {m.text}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Quick Official Action Endorsement Pills */}
                <View style={styles.quickActionStrip}>
                  <Text style={styles.quickActionTitle}>
                    {isEn ? 'OFFICIAL ACTIONS' : 'त्वरित शासकीय संस्तुति:'}
                  </Text>
                  <View style={styles.quickPillsRow}>
                    <TouchableOpacity
                      style={styles.quickPillBtn}
                      onPress={() =>
                        handleQuickPill(
                          isEn
                            ? 'Physical verification complete. Recommendation forwarded to PNB branch.'
                            : 'आपका भौतिक सत्यापन पूर्ण हो चुका है। PNB शाखा प्रबंधक को संस्तुति पत्र प्रेषित कर दिया गया है।'
                        )
                      }
                    >
                      <Text style={styles.quickPillBtnText}>
                        {isEn ? '✓ Verify Complete' : '✓ सत्यापन पूर्ण'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickPillBtn}
                      onPress={() =>
                        handleQuickPill(
                          isEn
                            ? 'Site inspection scheduled for tomorrow at 2:30 PM. Keep Aadhaar and electricity bill ready.'
                            : 'कल दोपहर 2:30 बजे कार्यस्थल पर भौतिक निरीक्षण हेतु आ रहा हूँ। कृपया बिजली बिल व आधार कार्ड तैयार रखें।'
                        )
                      }
                    >
                      <Text style={styles.quickPillBtnText}>
                        {isEn ? '📅 Schedule Visit' : '📅 निरीक्षण तय करें'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickPillBtn}
                      onPress={() =>
                        handleQuickPill(
                          isEn
                            ? 'Unit endorsed for 35% rural subsidy under PMEGP. Recorded on official portal.'
                            : 'आपकी इकाई PMEGP के तहत 35% ग्रामीण सब्सिडी हेतु पात्र पाई गई है। शासकीय पोर्टल पर अनुमोदन दर्ज किया गया।'
                        )
                      }
                    >
                      <Text style={styles.quickPillBtnText}>
                        {isEn ? '🏛️ Endorse Subsidy' : '🏛️ सब्सिडी संस्तुत'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Officer Custom Reply Input */}
                <View style={styles.replyBar}>
                  <TextInput
                    style={styles.replyInput}
                    value={replyText}
                    onChangeText={setReplyText}
                    placeholder={isEn ? 'Type official advisory / response...' : 'शासकीय परामर्श / निर्देश लिखें...'}
                    placeholderTextColor={COLORS.textTertiary}
                  />
                  <TouchableOpacity
                    style={[styles.replySendBtn, !replyText.trim() && { opacity: 0.5 }]}
                    onPress={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    <Ionicons name="send" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* TAB 4: OFFICIAL PROOF & APPOINTMENT RECORD */}
        {activeTab === 'proof' && (
          <View style={styles.tabContent}>
            {isIas ? (
              /* IAS Magisterial Commission View */
              <View style={styles.proofCardIas}>
                <View style={styles.iasProofHeader}>
                  <Text style={{ fontSize: 32 }}>🏛️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.doptHeader}>
                      भारत सरकार • कार्मिक एवं प्रशिक्षण विभाग (DoPT)
                    </Text>
                    <Text style={styles.iasCommissionTitle}>
                      भारतीय प्रशासनिक सेवा (IAS) प्राधिकार प्रमाण पत्र
                    </Text>
                    <Text style={styles.collectorateSub}>
                      Office of the District Magistrate & Collector, {officer.district}
                    </Text>
                  </View>
                </View>

                <View style={styles.iasCredentialBox}>
                  <Text style={styles.iasCadreBadge}>Apex District Magistrate</Text>
                  <Text style={styles.iasOfficerTitle}>{officer.fullName}</Text>
                  <Text style={styles.iasBatchText}>{officer.assignedIas.cadre}</Text>
                  <View style={styles.iasDetailsGrid}>
                    <View>
                      <Text style={styles.iasDetLbl}>Collectorate Office:</Text>
                      <Text style={styles.iasDetVal}>{officer.assignedIas.office}</Text>
                    </View>
                    <View>
                      <Text style={styles.iasDetLbl}>Official NIC Email:</Text>
                      <Text style={styles.iasDetVal}>{officer.assignedIas.email}</Text>
                    </View>
                    <View style={{ width: '100%' }}>
                      <Text style={styles.iasDetLbl}>Presidential Gazette Order / Warrant:</Text>
                      <Text style={styles.iasGazetteNum}>{officer.assignedIas.appointmentOrder}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.stampCard}>
                  <Ionicons name="checkmark-circle" size={18} color="#047857" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stampTitle}>NIC e-Office Gazetted Stamp Verified</Text>
                    <Text style={styles.stampSub}>SHA256: 4f8b9e...c31e • Signed by President of India</Text>
                  </View>
                </View>
              </View>
            ) : (
              /* VDO Service Proof View */
              <View style={styles.proofCardVdo}>
                <View style={styles.vdoProofHeader}>
                  <Text style={{ fontSize: 28 }}>📋</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.vdoDeptTitle}>पंचायती राज विभाग, उत्तर प्रदेश शासन</Text>
                    <Text style={styles.vdoIdTitle}>ग्राम विकास अधिकारी (VDO) सेवा अभिलेख</Text>
                    <Text style={styles.vdoBlockSub}>
                      ब्लॉक: {officer.block} • ज़िला: {officer.district}
                    </Text>
                  </View>
                </View>

                <View style={styles.vdoCredentialBox}>
                  <Text style={styles.vdoOfficerName}>{officer.fullName}</Text>
                  <Text style={styles.vdoUniqueCode}>{officer.uniqueGovtCode}</Text>
                  <Text style={styles.vdoPostingInfo}>
                    अधिकारिता: भीटी रावत, सहजनवा खास, घाघरासुर ग्राम पंचायतें
                  </Text>
                </View>

                <View style={styles.stampCard}>
                  <Ionicons name="checkmark-circle" size={18} color="#047857" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stampTitle}>DM Office Gorakhpur Empanelled</Text>
                    <Text style={styles.stampSub}>Field Verification Authority Authorized under PMEGP</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Business Inspection Modal */}
        <Modal visible={!!selectedBiz} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEn ? 'Inspect & Verify Enterprise' : 'उद्यम निरीक्षण व सत्यापन'}
                </Text>
                <TouchableOpacity onPress={() => setSelectedBiz(null)}>
                  <Ionicons name="close" size={20} color={COLORS.textTertiary} />
                </TouchableOpacity>
              </View>

              {selectedBiz && (
                <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalBizName}>{selectedBiz.businessName}</Text>
                  <Text style={styles.modalEntName}>
                    {selectedBiz.entrepreneurName} • {selectedBiz.phone}
                  </Text>

                  <Text style={styles.modalFieldLabel}>{isEn ? 'Scheme Status' : 'योजना स्थिति'}</Text>
                  <View style={styles.statusSelectRow}>
                    {(['Field Verified', 'Sanctioned', 'Disbursed'] as const).map((st) => (
                      <TouchableOpacity
                        key={st}
                        style={[styles.statusOption, inspectStatus === st && styles.statusOptionActive]}
                        onPress={() => setInspectStatus(st)}
                      >
                        <Text style={[styles.statusOptionText, inspectStatus === st && styles.statusOptionTextActive]}>
                          {st}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.modalFieldLabel}>{isEn ? 'Approved Subsidy (₹)' : 'स्वीकृत सब्सिडी (₹)'}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={inspectSubsidy}
                    onChangeText={setInspectSubsidy}
                    keyboardType="numeric"
                  />

                  <Text style={styles.modalFieldLabel}>{isEn ? 'Inspection Findings' : 'निरीक्षण विवरण'}</Text>
                  <TextInput
                    style={[styles.modalInput, { height: 60 }]}
                    value={inspectNotes}
                    onChangeText={setInspectNotes}
                    placeholder={isEn ? 'Enter field survey notes...' : 'भौतिक सत्यापन विवरण लिखें...'}
                    multiline
                  />

                  <TouchableOpacity style={styles.saveInspectBtn} onPress={handleSaveInspection}>
                    <Ionicons name="save" size={16} color={COLORS.white} />
                    <Text style={styles.saveInspectBtnText}>
                      {isEn ? 'Save Official Verification' : 'शासकीय सत्यापन सुरक्षित करें'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        {/* New Survey Modal */}
        <Modal visible={showAddSurveyModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEn ? 'New Ground Survey' : 'नया भू-सर्वेक्षण दर्ज करें'}
                </Text>
                <TouchableOpacity onPress={() => setShowAddSurveyModal(false)}>
                  <Ionicons name="close" size={20} color={COLORS.textTertiary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalFieldLabel}>{isEn ? 'Entrepreneur Name *' : 'उद्यमी का नाम *'}</Text>
                <TextInput style={styles.modalInput} value={surveyName} onChangeText={setSurveyName} />

                <Text style={styles.modalFieldLabel}>{isEn ? 'Phone Number *' : 'फोन नंबर *'}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={surveyPhone}
                  onChangeText={setSurveyPhone}
                  keyboardType="phone-pad"
                />

                <Text style={styles.modalFieldLabel}>{isEn ? 'Business Name' : 'व्यापार का नाम'}</Text>
                <TextInput style={styles.modalInput} value={surveyBiz} onChangeText={setSurveyBiz} />

                <Text style={styles.modalFieldLabel}>{isEn ? 'Proposed Investment (₹)' : 'प्रस्तावित निवेश (₹)'}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={surveyInvestment}
                  onChangeText={setSurveyInvestment}
                  keyboardType="numeric"
                />

                <TouchableOpacity style={styles.saveInspectBtn} onPress={handleCreateSurvey}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
                  <Text style={styles.saveInspectBtnText}>
                    {isEn ? 'Record Ground Survey' : 'भू-सर्वेक्षण दर्ज करें'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Proof Document Modal */}
        <Modal visible={showProofModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isIas ? 'Gazetted IAS Appointment Warrant' : 'Official Government Service Record'}
                </Text>
                <TouchableOpacity onPress={() => setShowProofModal(false)}>
                  <Ionicons name="close" size={20} color={COLORS.textTertiary} />
                </TouchableOpacity>
              </View>
              <View style={{ padding: SPACING.md, gap: SPACING.sm }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.textPrimary }}>
                  {isIas
                    ? 'WARRANT OF APPOINTMENT AS DISTRICT MAGISTRATE'
                    : 'PANCHAYATI RAJ DEPARTMENT POSTING ORDER'}
                </Text>
                <Text style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 18 }}>
                  {isIas
                    ? `Under the authority vested by the Constitution of India and DoPT notification, ${officer.fullName} is commissioned as District Magistrate & Collector for ${officer.district}. Magisterial authorization: Full district credit and subsidy sanctioning authority.`
                    : `Shri ${officer.fullName}, Village Development Officer (VDO), is posted to Sahjanwa Block with jurisdiction over Bhiti Rawat and allied Gram Panchayats. Authorized for field verification under PMEGP.`}
                </Text>
                <View style={[styles.stampCard, { marginTop: SPACING.sm }]}>
                  <Ionicons name="shield-checkmark" size={20} color="#047857" />
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#047857' }}>
                    DIGITALLY SIGNED & VERIFIED BY NIC GOVT REPOSITORY
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
  headerCard: {
    backgroundColor: '#3b0764',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.md,
    gap: SPACING.sm,
  },
  headerCardIas: {
    backgroundColor: '#451a03',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarBox: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBoxIas: {
    backgroundColor: '#78350f',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  officerNameText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.white,
  },
  roleBadge: {
    backgroundColor: '#9333ea',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  roleBadgeIas: {
    backgroundColor: '#d97706',
  },
  roleBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.white,
  },
  roleBadgeTextIas: {
    color: '#451a03',
  },
  desigText: {
    fontSize: 11,
    color: '#e9d5ff',
  },
  govtCodeText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#d8b4fe',
  },
  iasStrip: {
    backgroundColor: 'rgba(217,119,6,0.2)',
    borderRadius: RADIUS.md,
    padding: 8,
    borderWidth: 1,
    borderColor: '#b45309',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iasApexTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#fde68a',
    letterSpacing: 0.5,
  },
  iasSub: {
    fontSize: 10,
    color: '#fef3c7',
  },
  iasOrder: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#fde68a',
    marginTop: 2,
  },
  vdoStrip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vdoSuperTitle: {
    fontSize: 9,
    color: '#e9d5ff',
  },
  vdoSuperName: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
  },
  viewOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  viewOrderBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400e',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLbl: {
    fontSize: 9,
    color: '#e9d5ff',
  },
  metricNum: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.white,
    marginTop: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: RADIUS.md,
    padding: 3,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    gap: 3,
    position: 'relative',
  },
  tabBtnActive: {
    backgroundColor: COLORS.white,
    ...SHADOW.xs,
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  tabBtnTextActive: {
    color: '#3b0764',
  },
  tabBtnTextActiveIas: {
    color: '#78350f',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    position: 'absolute',
    top: 4,
    right: 4,
  },
  tabContent: {
    gap: SPACING.sm,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 6,
  },
  searchBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    height: 38,
    gap: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textPrimary,
  },
  newSurveyBtn: {
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  newSurveyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  bizCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
    ...SHADOW.xs,
  },
  bizTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bizCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
  },
  bizTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  bizMeta: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  statusDisbursed: {
    backgroundColor: '#dcfce7',
  },
  statusSanctioned: {
    backgroundColor: '#dbeafe',
  },
  statusVerified: {
    backgroundColor: '#f3e8ff',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  bizFinanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 6,
    borderRadius: RADIUS.sm,
    marginTop: 2,
  },
  finSubLbl: {
    fontSize: 8,
    color: COLORS.textTertiary,
  },
  finSubVal: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  bizActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  inspectHint: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
  },
  schemeCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  schemeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  schCode: {
    fontSize: 9,
    fontWeight: '900',
    backgroundColor: '#f3e8ff',
    color: '#6b21a8',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  schSubsidyRate: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  schTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  schGrid: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  schBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 4,
    borderRadius: RADIUS.xs,
  },
  schBoxLbl: {
    fontSize: 8,
    color: COLORS.textTertiary,
  },
  schBoxVal: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  threadScroll: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  threadChip: {
    backgroundColor: '#f1f5f9',
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  threadChipActive: {
    backgroundColor: '#3b0764',
    borderColor: '#3b0764',
  },
  threadChipName: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  threadChipNameActive: {
    color: COLORS.white,
  },
  threadChipVillage: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  threadChipVillageActive: {
    color: '#d8b4fe',
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    position: 'absolute',
    top: 4,
    right: 4,
  },
  chatCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  chatCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chatEntName: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  chatBizType: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  msgLog: {
    maxHeight: 220,
    gap: SPACING.xs,
  },
  bubbleWrap: {
    maxWidth: '85%',
  },
  bubbleWrapRight: {
    alignSelf: 'flex-end',
  },
  bubbleWrapLeft: {
    alignSelf: 'flex-start',
  },
  msgMetaRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 2,
  },
  msgSender: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  msgTime: {
    fontSize: 8,
    color: COLORS.textTertiary,
  },
  chatBubble: {
    borderRadius: RADIUS.md,
    padding: SPACING.xs,
  },
  chatBubbleCitizen: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chatBubbleAi: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  chatBubbleOfficer: {
    backgroundColor: '#3b0764',
  },
  msgBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fcd34d',
    marginBottom: 2,
  },
  msgTextContent: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textPrimary,
  },
  msgTextContentOfficer: {
    color: COLORS.white,
  },
  quickActionStrip: {
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.md,
    padding: 6,
    gap: 4,
  },
  quickActionTitle: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
  },
  quickPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  quickPillBtn: {
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#d8b4fe',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  quickPillBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6b21a8',
  },
  replyBar: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  replyInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    fontSize: 11,
    height: 38,
  },
  replySendBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proofCardIas: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#fcd34d',
    gap: SPACING.sm,
  },
  iasProofHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#fef3c7',
    paddingBottom: SPACING.xs,
  },
  doptHeader: {
    fontSize: 9,
    fontWeight: '900',
    color: '#92400e',
    textTransform: 'uppercase',
  },
  iasCommissionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  collectorateSub: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  iasCredentialBox: {
    backgroundColor: '#fffbeb',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 4,
  },
  iasCadreBadge: {
    fontSize: 8,
    fontWeight: '900',
    color: '#92400e',
    textTransform: 'uppercase',
  },
  iasOfficerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  iasBatchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  iasDetailsGrid: {
    marginTop: 4,
    gap: 4,
  },
  iasDetLbl: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  iasDetVal: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  iasGazetteNum: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#92400e',
  },
  proofCardVdo: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#d8b4fe',
    gap: SPACING.sm,
  },
  vdoProofHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  vdoDeptTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#6b21a8',
  },
  vdoIdTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  vdoBlockSub: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  vdoCredentialBox: {
    backgroundColor: '#faf5ff',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    gap: 2,
  },
  vdoOfficerName: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  vdoUniqueCode: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#6b21a8',
  },
  vdoPostingInfo: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  stampCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    borderRadius: RADIUS.md,
    padding: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  stampTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  stampSub: {
    fontSize: 9,
    color: '#065f46',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.xs,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalBizName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  modalEntName: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  modalFieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 6,
    marginBottom: 2,
  },
  statusSelectRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statusOption: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  statusOptionActive: {
    backgroundColor: '#3b0764',
  },
  statusOptionText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  statusOptionTextActive: {
    color: COLORS.white,
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 11,
    color: COLORS.textPrimary,
  },
  saveInspectBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },
  saveInspectBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
});
