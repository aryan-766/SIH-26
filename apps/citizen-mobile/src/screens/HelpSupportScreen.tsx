/**
 * GramUdyam — Help & Support Screen
 * Team Support, App Issue Ticketing, and "Take It Online" (ONDC / GeM Marketplaces)
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Linking, Alert
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

type SupportSection = 'take_online' | 'team_support' | 'tickets' | 'faqs';

export const HelpSupportScreen: React.FC<Props> = ({ userProfile, lang, onBack }) => {
  const isEn = lang === 'en';
  const [activeSection, setActiveSection] = useState<SupportSection>('take_online');

  // Ticket Form State
  const [ticketCategory, setTicketCategory] = useState('dpr');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPhone, setTicketPhone] = useState(userProfile?.phone || '9876543210');
  const [generatedTicketId, setGeneratedTicketId] = useState<string | null>(null);

  // Digital Onboarding Application State
  const [appliedOnline, setAppliedOnline] = useState(false);

  const handleApplyOnline = () => {
    setAppliedOnline(true);
    Alert.alert(
      isEn ? 'Application Received!' : 'आवेदन प्राप्त हुआ!',
      isEn
        ? 'GramUdyam Digital Commerce team will contact you for ONDC & GeM product cataloging.'
        : 'ग्रामउद्यम डिजिटल कॉमर्स टीम ONDC एवं GeM कैटलॉगिंग हेतु आपसे 48 घंटे में संपर्क करेगी।'
    );
  };

  const handleSubmitTicket = () => {
    if (!ticketDescription.trim()) {
      Alert.alert(isEn ? 'Error' : 'त्रुटि', isEn ? 'Please describe your query' : 'कृपया अपनी समस्या का विवरण लिखें');
      return;
    }
    const ticketId = 'TKT-GU-' + Math.floor(100000 + Math.random() * 900000);
    setGeneratedTicketId(ticketId);
    setTicketDescription('');
    Alert.alert(
      isEn ? 'Ticket Generated' : 'शिकायत दर्ज की गई',
      isEn
        ? `Ticket #${ticketId} created successfully. Our team will resolve it within 24 hours.`
        : `टिकट #${ticketId} सफलतापूर्वक दर्ज हुआ। हमारी टीम 24 घंटों में समाधान करेगी।`
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color={COLORS.white} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <View style={styles.headerBadge}>
              <Ionicons name="headset" size={12} color="#a7f3d0" />
              <Text style={styles.headerBadgeText}>
                {isEn ? 'DEDICATED SUPPORT & MARKET EXPANSION' : 'समर्थन डेस्क एवं बाज़ार विस्तार'}
              </Text>
            </View>
            <Text style={styles.headerTitle}>
              {isEn ? 'Help & Support Desk' : 'सहायता एवं समर्थन केंद्र'}
            </Text>
            <Text style={styles.headerSub}>
              {isEn
                ? 'Team assistance, app queries, and online marketplace listing guidance'
                : 'टीम सहायता, ऐप समाधान एवं ONDC/GeM पर ऑनलाइन लिस्टिंग'}
            </Text>
          </View>
        </View>

        {/* 4 Navigation Pills */}
        <View style={styles.tabRow}>
          {[
            { key: 'take_online' as SupportSection, label: isEn ? 'Take It Online' : 'ऑनलाइन बेचें', icon: 'globe' },
            { key: 'team_support' as SupportSection, label: isEn ? 'Team Support' : 'टीम संपर्क', icon: 'call' },
            { key: 'tickets' as SupportSection, label: isEn ? 'Raise Ticket' : 'शिकायत दर्ज', icon: 'chatbox-ellipses' },
            { key: 'faqs' as SupportSection, label: isEn ? 'FAQs' : 'सामान्य प्रश्न', icon: 'help-circle' },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabBtn, activeSection === t.key && styles.tabBtnActive]}
              onPress={() => setActiveSection(t.key)}
            >
              <Ionicons
                name={t.icon as any}
                size={13}
                color={activeSection === t.key ? COLORS.white : COLORS.textSecondary}
              />
              <Text style={[styles.tabBtnText, activeSection === t.key && styles.tabBtnTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SECTION 1: TAKE IT ONLINE (CRITERIA & MARKETPLACES) */}
        {activeSection === 'take_online' && (
          <View style={styles.sectionGap}>
            <View style={styles.heroCard}>
              <View style={styles.heroTop}>
                <View style={styles.heroIconBox}>
                  <Ionicons name="storefront" size={24} color="#047857" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroTitle}>
                    {isEn ? 'Take Your Rural Enterprise Online' : 'अपने ग्रामीण उत्पाद को ऑनलाइन ले जाएं'}
                  </Text>
                  <Text style={styles.heroSub}>
                    {isEn
                      ? 'List on ONDC, Amazon Saheli, Flipkart Samarth, and Government e-Marketplace (GeM)'
                      : 'ONDC, अमेज़न सहेली, फ्लिपकार्ट समर्थ एवं सरकारी GeM पोर्टल पर सीधी लिस्टिंग'}
                  </Text>
                </View>
              </View>

              {/* Supported Marketplaces Grid */}
              <View style={styles.mktGrid}>
                {[
                  { name: 'ONDC Network', desc: isEn ? 'Zero Commission Open Network' : 'शून्य कमीशन ओपन नेटवर्क', tag: 'Govt of India' },
                  { name: 'GeM Portal', desc: isEn ? 'Supply to Govt Offices' : 'सरकारी दफ्तरों में आपूर्ति', tag: 'Direct Procurement' },
                  { name: 'Flipkart Samarth', desc: isEn ? 'Rural Crafts & Agro' : 'ग्रामीण हस्तशिल्प व कृषि', tag: 'National Logistics' },
                  { name: 'Amazon Saheli', desc: isEn ? 'Women & SHG Special' : 'महिला व SHG विशेष', tag: 'Global Reach' },
                ].map((m, i) => (
                  <View key={i} style={styles.mktBox}>
                    <Text style={styles.mktTag}>{m.tag}</Text>
                    <Text style={styles.mktName}>{m.name}</Text>
                    <Text style={styles.mktDesc}>{m.desc}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Eligibility Criteria Checklist */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {isEn ? 'Mandatory Criteria for Online Listing:' : 'ऑनलाइन लिस्टिंग हेतु अनिवार्य मापदंड:'}
              </Text>
              <Text style={styles.cardSub}>
                {isEn
                  ? 'Complete these 5 benchmarks to qualify for marketplace cataloging'
                  : 'मार्केटप्लेस पर उत्पाद जोड़ने के लिए निम्नलिखित 5 शर्तें आवश्यक हैं'}
              </Text>

              {[
                {
                  id: 'c1',
                  title: isEn ? '1. Udyam Aadhaar / MSME Registration' : '1. उद्यम आधार / MSME पंजीयन प्रमाण पत्र',
                  desc: isEn ? 'Free central government registration certificate.' : 'निःशुल्क केंद्र सरकारी प्रमाण पत्र (सहायता उपलब्ध)।',
                  met: true,
                },
                {
                  id: 'c2',
                  title: isEn ? '2. Business Current Bank Account & GSTIN' : '2. चालू बैंक खाता (Current Account) व GSTIN',
                  desc: isEn ? 'Account in enterprise trade name for direct settlements.' : 'व्यापार के नाम पर बैंक खाता जिसमें ऑनलाइन भुगतान आएगा।',
                  met: true,
                },
                {
                  id: 'c3',
                  title: isEn ? '3. Quality Certification (FSSAI / Agmark)' : '3. गुणवत्ता प्रमाणन (FSSAI / एगमार्क / BIS)',
                  desc: isEn ? 'Mandatory for food, mustard oil, milk, and honey products.' : 'खाद्य तेल, दुग्ध एवं खाद्य प्रसंस्करण हेतु अनिवार्य।',
                  met: false,
                },
                {
                  id: 'c4',
                  title: isEn ? '4. Minimum Monthly Production Capacity' : '4. न्यूनतम मासिक उत्पादन क्षमता',
                  desc: isEn ? 'Ability to fulfill regular orders (e.g. 50 kg/day or 50 pcs/mo).' : 'दैनिक या मासिक नियमित ऑर्डर आपूर्ति करने की क्षमता।',
                  met: false,
                },
                {
                  id: 'c5',
                  title: isEn ? '5. Standard Packaging with Barcode' : '5. लेबलिंग, बारकोड एवं सीलबंद पैकेजिंग',
                  desc: isEn ? 'Food grade pouches/bottles with MFG date & net weight.' : 'उत्पाद पर वजन, निर्माण दिनांक एवं सामग्री विवरण।',
                  met: false,
                },
              ].map((c) => (
                <View key={c.id} style={styles.criteriaRow}>
                  <View style={[styles.critIconBox, c.met ? styles.critIconMet : styles.critIconPending]}>
                    <Ionicons
                      name={c.met ? 'checkmark-circle' : 'time-outline'}
                      size={16}
                      color={c.met ? '#047857' : '#d97706'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.critTitle, c.met && { color: '#047857' }]}>{c.title}</Text>
                    <Text style={styles.critDesc}>{c.desc}</Text>
                  </View>
                  <View style={[styles.critBadge, c.met ? styles.critBadgeMet : styles.critBadgePending]}>
                    <Text style={[styles.critBadgeText, c.met ? styles.critBadgeTextMet : styles.critBadgeTextPending]}>
                      {c.met ? (isEn ? 'Ready' : 'तैयार') : (isEn ? 'In Progress' : 'प्रक्रियाधीन')}
                    </Text>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={[styles.applyBtn, appliedOnline && styles.applyBtnDone]}
                onPress={handleApplyOnline}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={appliedOnline ? 'checkmark-circle' : 'rocket'}
                  size={16}
                  color={COLORS.white}
                />
                <Text style={styles.applyBtnText}>
                  {appliedOnline
                    ? (isEn ? '✓ Onboarding Request Active' : '✓ आवेदन सक्रिय है')
                    : (isEn ? 'Apply for Free Marketplace Onboarding' : 'निःशुल्क ऑनलाइन लिस्टिंग सहायता हेतु आवेदन करें')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* SECTION 2: TEAM SUPPORT */}
        {activeSection === 'team_support' && (
          <View style={styles.sectionGap}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {isEn ? 'Direct Team Contacts' : 'ग्रामउद्यम प्रत्यक्ष सहायता टीम'}
              </Text>
              <Text style={styles.cardSub}>
                {isEn
                  ? 'Reach out to our field facilitators and district nodal coordinators'
                  : 'हमारे ज़िला समन्वयक एवं तकनीकी सहायकों से सीधे संपर्क करें'}
              </Text>

              {[
                {
                  title: isEn ? 'National Toll-Free Rural Helpline' : 'राष्ट्रीय टोल-फ्री ग्रामीण हेल्पलाइन',
                  val: '1800-889-UDYAM (83926)',
                  sub: isEn ? 'Mon - Sat, 8:00 AM to 8:00 PM' : 'सोम - शनि, सुबह 8 से रात 8 बजे तक',
                  icon: 'call',
                  action: () => Linking.openURL('tel:18008898392').catch(() => {}),
                },
                {
                  title: isEn ? 'WhatsApp Enterprise Support' : 'व्हाट्सएप सहायता केंद्र',
                  val: '+91 98765-83926',
                  sub: isEn ? 'Instant chat for document & DPR queries' : 'दस्तावेज़ एवं DPR सहायता हेतु त्वरित चैट',
                  icon: 'logo-whatsapp',
                  action: () => Linking.openURL('https://wa.me/919876583926').catch(() => {}),
                },
                {
                  title: isEn ? 'District Resource Desk (Collectorate)' : 'ज़िला उद्यम संसाधन केंद्र (समाहर्ता कार्यालय)',
                  val: 'Collectorate Compound, Gorakhpur, UP',
                  sub: isEn ? 'Room 14, DIC Ground Floor' : 'कक्ष 14, ज़िला उद्योग केंद्र (DIC) भूतल',
                  icon: 'business',
                  action: () => Alert.alert('Office Visit', 'District Industry Center (DIC), Gorakhpur. Open on all working days 10:00 AM - 5:00 PM.'),
                },
                {
                  title: isEn ? 'Official NIC Support Email' : 'आधिकारिक एनआईसी ईमेल',
                  val: 'support-gramudyam@nic.in',
                  sub: isEn ? 'Response within 24 business hours' : '24 कार्यघंटों के भीतर समाधान',
                  icon: 'mail',
                  action: () => Linking.openURL('mailto:support-gramudyam@nic.in').catch(() => {}),
                },
              ].map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.contactRow}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <View style={styles.contactIconBox}>
                    <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactTitle}>{item.title}</Text>
                    <Text style={styles.contactVal}>{item.val}</Text>
                    <Text style={styles.contactSub}>{item.sub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* SECTION 3: RAISE SUPPORT TICKET */}
        {activeSection === 'tickets' && (
          <View style={styles.sectionGap}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {isEn ? 'Raise an App Issue or Inquiry' : 'ऐप समस्या या पूछताछ हेतु टिकट दर्ज करें'}
              </Text>
              <Text style={styles.cardSub}>
                {isEn
                  ? 'Tracked resolution by technical team and district nodal officers'
                  : 'तकनीकी टीम एवं ज़िला अधिकारियों द्वारा 24 घंटे में ट्रैक्ड समाधान'}
              </Text>

              {generatedTicketId && (
                <View style={styles.ticketSuccessBanner}>
                  <Ionicons name="checkmark-circle" size={18} color="#047857" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ticketSuccessTitle}>
                      {isEn ? 'Active Ticket ID:' : 'सक्रिय टिकट क्रमांक:'} {generatedTicketId}
                    </Text>
                    <Text style={styles.ticketSuccessSub}>
                      {isEn ? 'Assigned to Gorakhpur DIC technical supervisor' : 'गोरखपुर DIC तकनीकी पर्यवेक्षक को प्रेषित किया गया'}
                    </Text>
                  </View>
                </View>
              )}

              {/* Category Pills */}
              <Text style={styles.fieldLabel}>{isEn ? 'Select Query Category:' : 'समस्या की श्रेणी:'}</Text>
              <View style={styles.catGrid}>
                {[
                  { key: 'dpr', label: isEn ? 'DPR & Financial Plan' : 'DPR व वित्तीय गणना' },
                  { key: 'subsidy', label: isEn ? 'Subsidy Disbursement Delay' : 'सब्सिडी भुगतान देरी' },
                  { key: 'vdo', label: isEn ? 'VDO Inspection Request' : 'VDO भौतिक निरीक्षण' },
                  { key: 'app', label: isEn ? 'App Bug / Technical Glitch' : 'ऐप तकनीकी समस्या' },
                ].map((c) => (
                  <TouchableOpacity
                    key={c.key}
                    style={[styles.catBtn, ticketCategory === c.key && styles.catBtnActive]}
                    onPress={() => setTicketCategory(c.key)}
                  >
                    <Text style={[styles.catBtnText, ticketCategory === c.key && styles.catBtnTextActive]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>{isEn ? 'Contact Mobile Phone:' : 'संपर्क मोबाइल नंबर:'}</Text>
              <TextInput
                style={styles.textInput}
                value={ticketPhone}
                onChangeText={setTicketPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.fieldLabel}>{isEn ? 'Describe Your Query / Issue *' : 'समस्या का विस्तृत विवरण लिखें *'}</Text>
              <TextInput
                style={[styles.textInput, { height: 80 }]}
                value={ticketDescription}
                onChangeText={setTicketDescription}
                placeholder={isEn ? 'Provide details about your query or app issue...' : 'अपनी समस्या या प्रश्न का विवरण यहाँ लिखें...'}
                multiline
              />

              <TouchableOpacity style={styles.ticketSubmitBtn} onPress={handleSubmitTicket}>
                <Ionicons name="send" size={16} color={COLORS.white} />
                <Text style={styles.ticketSubmitBtnText}>
                  {isEn ? 'Submit Support Ticket' : 'शिकायत टिकट दर्ज करें'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* SECTION 4: FAQS */}
        {activeSection === 'faqs' && (
          <View style={styles.sectionGap}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {isEn ? 'Frequently Asked Questions' : 'अक्सर पूछे जाने वाले प्रश्न'}
              </Text>

              {[
                {
                  q: isEn ? 'How does the 35% PMEGP subsidy get credited?' : 'PMEGP 35% सब्सिडी खाते में कैसे आती है?',
                  a: isEn
                    ? 'The subsidy is credited as Margin Money into a 3-year term deposit account linked to your loan. After 3 years of successful operation, it adjusts directly against the principal.'
                    : 'सब्सिडी मार्जिन मनी के रूप में 3 वर्ष की सावधि जमा (TDR) खाते में बैंक में जमा होती है। 3 वर्ष नियमित संचालन के बाद यह ऋण मूलधन में सीधे समायोजित हो जाती है।',
                },
                {
                  q: isEn ? 'When does the Locked Machinery Store open?' : 'लॉक्ड मशीनरी स्टोर कब खुलेगा?',
                  a: isEn
                    ? 'The store unlocks immediately after your loan is sanctioned by the bank. You can purchase GeM-approved machineries at direct subsidized prices.'
                    : 'बैंक द्वारा आपका ऋण स्वीकृत होते ही स्टोर स्वचालित रूप से अनलॉक हो जाएगा। आप सीधे सब्सिडी दर पर GeM प्रमाणित मशीनें मँगवा सकेंगे।',
                },
                {
                  q: isEn ? 'Can I change my business choice after DPR generation?' : 'क्या DPR बनाने के बाद व्यापार बदल सकते हैं?',
                  a: isEn
                    ? 'Yes! Simply visit Discovery, select a new opportunity (e.g. Oil Expeller or Solar EV), and your Financial Plan recalculates automatically.'
                    : 'हाँ! डिस्कवरी सेक्शन में जाकर कोई भी नया व्यापार चुनें, आपका वित्त एवं DPR स्वतः नए आंकड़ों के अनुसार अपडेट हो जाएगा।',
                },
                {
                  q: isEn ? 'How do I request a VDO site inspection?' : 'VDO भौतिक निरीक्षण के लिए कैसे संपर्क करें?',
                  a: isEn
                    ? 'Go to AI Advisor screen, and send a message. Your query is automatically routed to your village nodal VDO Sanjay Verma, who will respond with a scheduled date.'
                    : 'AI सलाहकार स्क्रीन में संदेश लिखें। आपका संदेश सीधे आपके ग्राम विकास अधिकारी श्री संजय वर्मा के इनबॉक्स में जाता है और वे निरीक्षण का समय निर्धारित करेंगे।',
                },
              ].map((faq, i) => (
                <View key={i} style={styles.faqBox}>
                  <Text style={styles.faqQ}>❓ {faq.q}</Text>
                  <Text style={styles.faqA}>{faq.a}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
    backgroundColor: '#065f46',
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
  headerBadge: {
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
  headerBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#a7f3d0',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: FONT.md,
    fontWeight: '900',
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 10,
    color: '#d1fae5',
    marginTop: 2,
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
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: SPACING.sm,
    ...SHADOW.xs,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  heroIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  heroTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  heroSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mktGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  mktBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.md,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mktTag: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  mktName: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  mktDesc: {
    fontSize: 9,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
    ...SHADOW.sm,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  cardSub: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginBottom: 6,
  },
  criteriaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  critIconBox: {
    marginTop: 2,
  },
  critIconMet: {},
  critIconPending: {},
  critTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  critDesc: {
    fontSize: 9,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  critBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  critBadgeMet: {
    backgroundColor: '#ecfdf5',
  },
  critBadgePending: {
    backgroundColor: '#fffbeb',
  },
  critBadgeText: {
    fontSize: 8,
    fontWeight: '900',
  },
  critBadgeTextMet: {
    color: '#047857',
  },
  critBadgeTextPending: {
    color: '#b45309',
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  applyBtnDone: {
    backgroundColor: '#047857',
  },
  applyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 4,
  },
  contactIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  contactVal: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  contactSub: {
    fontSize: 9,
    color: COLORS.textTertiary,
  },
  ticketSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    padding: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: 6,
  },
  ticketSuccessTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#047857',
  },
  ticketSuccessSub: {
    fontSize: 9,
    color: '#065f46',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 4,
  },
  catBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  catBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  catBtnTextActive: {
    color: COLORS.white,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    fontSize: 11,
    color: COLORS.textPrimary,
  },
  ticketSubmitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  ticketSubmitBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  faqBox: {
    backgroundColor: '#f8fafc',
    borderRadius: RADIUS.md,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 6,
    gap: 3,
  },
  faqQ: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  faqA: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
});
