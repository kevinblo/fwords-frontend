import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';

export function useSessionDebug() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const logSessionData = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      console.log('=== CURRENT SESSION DATA ===');
      console.log('Timestamp:', new Date().toISOString());
      console.log('--- From AsyncStorage ---');
      console.log('User:', userJson ? JSON.parse(userJson) : null);
      console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : null);
      console.log('Refresh Token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : null);
      console.log('--- From AuthContext ---');
      console.log('Current User:', user);
      console.log('Is Authenticated:', isAuthenticated);
      console.log('Is Loading:', isLoading);
      
      // Проверка sessionStorage для web
      if (typeof sessionStorage !== 'undefined') {
        console.log('--- From SessionStorage (Web) ---');
        console.log('All keys:', Object.keys(sessionStorage));
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) {
            console.log(`${key}:`, sessionStorage.getItem(key));
          }
        }
      }
      
      console.log('========================');
    } catch (error) {
      console.error('Error logging session data:', error);
    }
  };

  useEffect(() => {
    // Автоматический вывод при монтировании компонента
    logSessionData();
  }, [user, isAuthenticated]);

  // Возвращаем функцию для ручного вызова
  return { logSessionData };
}