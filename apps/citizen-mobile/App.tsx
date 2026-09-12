/**
 * GramUdyam Mobile App — Main Entry Point
 * Dual-Architecture: Rural Entrepreneur & IAS / Government Official Mode
 * Feature-identical matching with citizen-app web
 */
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppHeader } from './src/components/AppHeader';
import { VoiceAssistantModal } from './src/components/VoiceAssistantModal';
import { AuthScreen } from './src/screens/AuthScreen';
import { OverviewScreen } from './src/screens/OverviewScreen';
import { FinanceScreen } from './src/screens/FinanceScreen';
import { SchemesScreen } from './src/screens/SchemesScreen';
import { DiscoveryScreen } from './src/screens/DiscoveryScreen';
import { AdvisorScreen } from './src/screens/AdvisorScreen';
import { OfficerDashboardScreen } from './src/screens/OfficerDashboardScreen';
import { GeoIntelligenceScreen } from './src/screens/GeoIntelligenceScreen';
import { BeneficiaryPipelineScreen } from './src/screens/BeneficiaryPipelineScreen';
import { SchemeMonitoringScreen } from './src/screens/SchemeMonitoringScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

import {
  BeneficiaryProfile, OfficerProfile,
  DEFAULT_FIELD_OFFICER, SEED_REGISTERED_ENTREPRENEURS,
  detectLanguageFromProfile
} from './src/services/enterpriseStore';
import { Language, translations } from './src/locales';
import { COLORS, RADIUS } from './src/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <MainAppContent />
    </SafeAreaProvider>
  );
}

function MainAppContent() {
  const insets = useSafeAreaInsets();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [appRole, setAppRole] = useState<'entrepreneur' | 'official'>('entrepreneur');
  // Pre-seed active session with Ramesh Yadav so app never loads blank
  const [userProfile, setUserProfile] = useState<BeneficiaryProfile | null>(
    SEED_REGISTERED_ENTREPRENEURS[0].profile
  );
  // Auto-detect language from profile's state/village/district
  const [lang, setLang] = useState<Language>(() =>
    detectLanguageFromProfile(SEED_REGISTERED_ENTREPRENEURS[0].profile)
  );
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [activeScreenName, setActiveScreenName] = useState('overview');
  const [officerProfile, setOfficerProfile] = useState<OfficerProfile | null>(
    DEFAULT_FIELD_OFFICER
  );

  const handleLogin = useCallback((
    role: 'entrepreneur' | 'official',
    profile: BeneficiaryProfile | null,
    officer: OfficerProfile | null
  ) => {
    setAppRole(role);
    if (profile) {
      setUserProfile(profile);
      // Auto-detect language from user's state registration (e.g., TN → Tamil, MH → Marathi)
      const detectedLang = detectLanguageFromProfile(profile);
      setLang(detectedLang);
    }
    if (officer) setOfficerProfile(officer);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const handleToggleRole = useCallback(() => {
    if (appRole === 'entrepreneur') {
      if (!officerProfile) setOfficerProfile(DEFAULT_FIELD_OFFICER);
      setAppRole('official');
      setActiveScreenName('command');
    } else {
      if (!userProfile) setUserProfile(SEED_REGISTERED_ENTREPRENEURS[0].profile);
      setAppRole('entrepreneur');
      setActiveScreenName('overview');
    }
  }, [appRole, officerProfile, userProfile]);

  if (!isAuthenticated) {
    return (
      <>
        <StatusBar style="dark" />
        <AuthScreen
          lang={lang}
          onSetLang={setLang}
          onLogin={handleLogin}
        />
      </>
    );
  }

  const isEn = lang === 'en';
  const dynamicTabBarStyle = [
    styles.tabBar,
    {
      height: 58 + Math.max(insets.bottom, 6),
      paddingBottom: Math.max(insets.bottom, 4),
    },
  ];

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.root}>
        {/* Universal Top Header with Language Switcher, Voice Narrator, Role Toggle & Logout */}
        <AppHeader
          lang={lang}
          onSetLang={setLang}
          role={appRole}
          onToggleRole={handleToggleRole}
          onLogout={handleLogout}
          userProfile={userProfile}
          officerProfile={officerProfile}
          currentScreenTitle={activeScreenName}
          onVoiceTranscript={() => setVoiceModalVisible(true)}
          onOpenVoiceAssistant={() => setVoiceModalVisible(true)}
        />

        <NavigationContainer>
          {appRole === 'entrepreneur' && userProfile ? (
            /* ============================================================ */
            /* ENTREPRENEUR 6-TAB NAVIGATION                                */
            /* ============================================================ */
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: dynamicTabBarStyle,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.tabInactive,
                tabBarLabelStyle: styles.tabLabel,
                tabBarIcon: ({ focused, color }) => {
                  let iconName: keyof typeof Ionicons.glyphMap = 'home';
                  if (route.name === 'Overview') iconName = focused ? 'home' : 'home-outline';
                  else if (route.name === 'Finance') iconName = focused ? 'calculator' : 'calculator-outline';
                  else if (route.name === 'Schemes') iconName = focused ? 'ribbon' : 'ribbon-outline';
                  else if (route.name === 'Discovery') iconName = focused ? 'compass' : 'compass-outline';
                  else if (route.name === 'Advisor') iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
                  else if (route.name === 'Profile') iconName = focused ? 'person-circle' : 'person-circle-outline';
                  return <Ionicons name={iconName} size={20} color={color} />;
                },
              })}
              screenListeners={{
                state: (e: any) => {
                  const r = e.data.state.routes[e.data.state.index];
                  if (r) setActiveScreenName(r.name.toLowerCase());
                },
              }}
            >
              <Tab.Screen
                name="Overview"
                options={{ tabBarLabel: translations[lang]?.navCopilot ? (lang === 'en' ? 'Overview' : lang === 'mr' ? 'आढावा' : lang === 'ta' ? 'கண்ணோட்டம்' : lang === 'te' ? 'అవలోకనం' : 'अवलोकन') : 'अवलोकन' }}
              >
                {({ navigation }: any) => (
                  <OverviewScreen
                    userProfile={userProfile}
                    lang={lang}
                    onNavigateToDiscovery={() => navigation.navigate('Discovery')}
                    onNavigateToFinance={() => navigation.navigate('Finance')}
                  />
                )}
              </Tab.Screen>

              <Tab.Screen
                name="Finance"
                options={{ tabBarLabel: translations[lang]?.navFinances || 'वित्त व DPR' }}
              >
                {() => <FinanceScreen userProfile={userProfile} lang={lang} />}
              </Tab.Screen>

              <Tab.Screen
                name="Schemes"
                options={{
                  tabBarLabel: translations[lang]?.navSchemes || 'योजनाएं',
                  tabBarIcon: ({ focused, color }) => (
                    <View style={focused ? styles.schemeIconActive : undefined}>
                      <Ionicons
                        name={focused ? 'ribbon' : 'ribbon-outline'}
                        size={20}
                        color={focused ? COLORS.white : color}
                      />
                    </View>
                  ),
                }}
              >
                {({ navigation }: any) => (
                  <SchemesScreen
                    userProfile={userProfile}
                    lang={lang}
                    onNavigateToFinance={() => navigation.navigate('Finance')}
                  />
                )}
              </Tab.Screen>

              <Tab.Screen
                name="Discovery"
                options={{ tabBarLabel: translations[lang]?.navDiscovery || 'खोज' }}
              >
                {({ navigation }: any) => (
                  <DiscoveryScreen
                    userProfile={userProfile}
                    lang={lang}
                    onNavigateToFinance={() => navigation.navigate('Finance')}
                  />
                )}
              </Tab.Screen>

              <Tab.Screen
                name="Advisor"
                options={{ tabBarLabel: translations[lang]?.navAdvisor || 'AI सलाह' }}
              >
                {() => <AdvisorScreen userProfile={userProfile} lang={lang} />}
              </Tab.Screen>

              <Tab.Screen
                name="Profile"
                options={{ tabBarLabel: translations[lang]?.myProfile || 'प्रोफ़ाइल' }}
              >
                {() => (
                  <ProfileScreen
                    role={appRole}
                    userProfile={userProfile}
                    officerProfile={officerProfile}
                    lang={lang}
                    onLogout={handleLogout}
                    onSetLang={setLang}
                  />
                )}
              </Tab.Screen>
            </Tab.Navigator>
          ) : (
            /* ============================================================ */
            /* OFFICIAL / IAS 5-TAB NAVIGATION                              */
            /* ============================================================ */
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: dynamicTabBarStyle,
                tabBarActiveTintColor: COLORS.accent,
                tabBarInactiveTintColor: COLORS.tabInactive,
                tabBarLabelStyle: styles.tabLabel,
                tabBarIcon: ({ focused, color }) => {
                  let iconName: keyof typeof Ionicons.glyphMap = 'briefcase';
                  if (route.name === 'Command') iconName = focused ? 'grid' : 'grid-outline';
                  else if (route.name === 'GIS') iconName = focused ? 'map' : 'map-outline';
                  else if (route.name === 'Pipeline') iconName = focused ? 'people' : 'people-outline';
                  else if (route.name === 'SchemeAudit') iconName = focused ? 'ribbon' : 'ribbon-outline';
                  else if (route.name === 'OfficerProfile') iconName = focused ? 'person-circle' : 'person-circle-outline';
                  return <Ionicons name={iconName} size={20} color={color} />;
                },
              })}
              screenListeners={{
                state: (e: any) => {
                  const r = e.data.state.routes[e.data.state.index];
                  if (r) setActiveScreenName(r.name.toLowerCase());
                },
              }}
            >
              <Tab.Screen
                name="Command"
                options={{ tabBarLabel: isEn ? 'Command' : 'कमांड' }}
              >
                {() => (
                  <OfficerDashboardScreen
                    officerProfile={officerProfile}
                    lang={lang}
                    onLogout={handleLogout}
                  />
                )}
              </Tab.Screen>

              <Tab.Screen
                name="GIS"
                options={{ tabBarLabel: isEn ? 'GIS Radar' : 'GIS रडार' }}
              >
                {() => <GeoIntelligenceScreen officerProfile={officerProfile} lang={lang} />}
              </Tab.Screen>

              <Tab.Screen
                name="Pipeline"
                options={{
                  tabBarLabel: isEn ? 'Pipeline' : 'पाइपलाइन',
                  tabBarBadge: 46,
                  tabBarBadgeStyle: styles.pipelineBadge,
                }}
              >
                {() => <BeneficiaryPipelineScreen officerProfile={officerProfile} lang={lang} />}
              </Tab.Screen>

              <Tab.Screen
                name="SchemeAudit"
                options={{ tabBarLabel: isEn ? 'Subsidies' : 'सब्सिडी' }}
              >
                {() => <SchemeMonitoringScreen officerProfile={officerProfile} lang={lang} />}
              </Tab.Screen>

              <Tab.Screen
                name="OfficerProfile"
                options={{ tabBarLabel: isEn ? 'Profile' : 'प्रोफ़ाइल' }}
              >
                {() => (
                  <ProfileScreen
                    role={appRole}
                    userProfile={userProfile}
                    officerProfile={officerProfile}
                    lang={lang}
                    onLogout={handleLogout}
                    onSetLang={setLang}
                  />
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </NavigationContainer>

        {/* Quick Floating Voice Assistant FAB */}
        <TouchableOpacity
          style={[styles.floatingFab, { bottom: 68 + Math.max(insets.bottom, 6) }]}
          onPress={() => setVoiceModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="sparkles" size={16} color="#ffffff" />
          <Text style={styles.floatingFabText}>
            {lang === 'en' ? 'Voice Copilot' : lang === 'mr' ? 'आवाज AI' : lang === 'ta' ? 'குரல் AI' : lang === 'te' ? 'వాయిస్ AI' : 'वॉइस सहायक'}
          </Text>
        </TouchableOpacity>

        {/* Universal Multilingual Voice Assistant Modal */}
        <VoiceAssistantModal
          visible={voiceModalVisible}
          onClose={() => setVoiceModalVisible(false)}
          lang={lang}
          currentScreenName={activeScreenName}
          userProfile={userProfile}
          onProfileUpdated={(updated) => setUserProfile(updated)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  schemeIconActive: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -2,
  },
  pipelineBadge: {
    backgroundColor: '#4338ca',
    fontSize: 9,
    fontWeight: '900',
  },
  floatingFab: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 99,
  },
  floatingFabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
});
