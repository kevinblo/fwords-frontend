import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { NativeLanguageProvider } from '@/context/NativeLanguageContext';
import { ActiveLanguageProvider } from '@/context/ActiveLanguageContext';
import { LanguageProgressProvider } from '@/context/LanguageProgressContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <NativeLanguageProvider>
              <ActiveLanguageProvider>
                <LanguageProgressProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="auth" />
                    <Stack.Screen name="flashcards/[id]" />
                    <Stack.Screen name="quiz/[id]" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                  <StatusBar style="auto" />
                </LanguageProgressProvider>
              </ActiveLanguageProvider>
            </NativeLanguageProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}