import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { GraduationCap, Clock, LineChart, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import AuthGuard from '../AuthGuard';
import i18n from '@/i18n';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: isDark ? Colors.gray[400] : Colors.gray[500],
          tabBarStyle: {
            backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
            borderTopColor: isDark ? Colors.dark.border : Colors.light.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
          },
          headerStyle: {
            backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
          },
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
            color: isDark ? Colors.dark.text : Colors.light.text,
          },
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: i18n.t('tabs.learn'),
            tabBarIcon: ({ color, size }) => <GraduationCap size={size} color={color} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: i18n.t('tabs.practice'),
            tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: i18n.t('tabs.progress'),
            tabBarIcon: ({ color, size }) => <LineChart size={size} color={color} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: i18n.t('tabs.profile'),
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            headerShown: false,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}