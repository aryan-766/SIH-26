/**
 * GramUdyam Mobile App — Main Entry Point
 * Dual-Architecture: Rural Entrepreneur & IAS / Government Official Mode
 * Feature-identical matching with citizen-app web
 */
import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppHeader } from './src/components/AppHeader';
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
  DEFAULT_FIELD_OFFICER, SEED_REGISTERED_ENTREPRENEURS
} from './src/services/enterpriseStore';
import { Language } from './src/locales';
import { COLORS, RADIUS } from './src/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [appRole, setAppRole] = useState<'entrepreneur' | 'official'>('entrepreneur');
  const [lang, setLang] = useState<Language>('hi');

  // Pre-seed active session with Ramesh Yadav so app never loads blank
  const [userProfile, setUserProfile] = useState<BeneficiaryProfile | null>(
    SEED_REGISTERED_ENTREPRENEURS[0].profile
  );
  const [officerProfile, setOfficerProfile] = useState<OfficerProfile | null>(
    DEFAULT_FIELD_OFFICER
  );

  const handleLogin = useCallback((
    role: 'entrepreneur' | 'official',
    profile: BeneficiaryProfile | null,
    officer: OfficerProfile | null
  ) => {
    setAppRole(role);
    if (profile) setUserProfile(profile);
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
    } else {
      if (!userProfile) setUserProfile(SEED_REGISTERED_ENTREPRENEURS[0].profile);
      setAppRole('entrepreneur');
    }
  }, [appRole, officerProfile, userProfile]);

  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthScreen
          lang={lang}
          onSetLang={setLang}
          onLogin={handleLogin}
        />
      </SafeAreaProvider>
    );
  }

  const isEn = lang === 'en';

  return (
    <SafeAreaProvider>
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
        />

        <NavigationContainer>
          {appRole === 'entrepreneur' && userProfile ? (
            /* ============================================================ */
            /* ENTREPRENEUR 6-TAB NAVIGATION                                */
            /* ============================================================ */
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
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
            >
              <Tab.Screen
                name="Overview"
                options={{ tabBarLabel: isEn ? 'Overview' : 'अवलोकन' }}
              >
                {() => <OverviewScreen userProfile={userProfile} lang={lang} />}
              </Tab.Screen>

              <Tab.Screen
                name="Finance"
                options={{ tabBarLabel: isEn ? 'Finance & DPR' : 'वित्त व DPR' }}
              >
                {() => <FinanceScreen userProfile={userProfile} lang={lang} />}
              </Tab.Screen>

              <Tab.Screen
                name="Schemes"
                options={{
                  tabBarLabel: isEn ? 'Schemes' : 'योजनाएं',
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
                {() => <SchemesScreen userProfile={userProfile} lang={lang} />}
              </Tab.Screen>

              <Tab.Screen
                name="Discovery"
                options={{ tabBarLabel: isEn ? 'Discovery' : 'खोज' }}
              >
                {() => <DiscoveryScreen userProfile={userProfile} lang={lang} />}
              </Tab.Screen>

              <Tab.Screen
                name="Advisor"
                options={{ tabBarLabel: isEn ? 'AI Advisor' : 'AI सलाह' }}
              >
                {() => <AdvisorScreen userProfile={userProfile} lang={lang} />}
              </Tab.Screen>

              <Tab.Screen
                name="Profile"
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
          ) : (
            /* ============================================================ */
            /* OFFICIAL / IAS 5-TAB NAVIGATION                              */
            /* ============================================================ */
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
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
      </View>
    </SafeAreaProvider>
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
    height: 58,
    paddingBottom: 4,
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
});
