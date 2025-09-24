import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from 'expo-router';
import {loginUser, refreshToken, registerUser, User} from '@/api/auth';
import {getProfile} from '@/api/api';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>; // <-- добавьте эту строку
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshIntervalId, setRefreshIntervalId] = useState<NodeJS.Timeout | null>(null);

  const refreshUser = async () => {
    try {
      const profileData = await getProfile();
      
      // Transform profile data to match User interface
      const userData: User = {
        id: profileData.id.toString(),
        name: profileData.name || profileData.username || profileData.email,
        email: profileData.email,
        username: profileData.username,
        is_email_verified: profileData.is_email_verified,
        created_at: profileData.created_at,
        native_language: profileData.native_language,
        active_language: profileData.active_language
      };
      
      setUser(userData);
      
      // Update AsyncStorage with fresh user data
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  // Вынесенная функция для загрузки пользователя из AsyncStorage
  const loadUser = async () => {
    try {
      console.log('[DEBUG] loadUser: start');
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshTokenValue = await AsyncStorage.getItem('refreshToken');

      // Вывод содержимого сессии в консоль
      console.log('[DEBUG] loadUser: SESSION DATA');
      console.log('[DEBUG] loadUser: Access Token:', accessToken);
      console.log('[DEBUG] loadUser: Refresh Token:', refreshTokenValue);
      console.log('[DEBUG] loadUser: ===================');

      if (accessToken && refreshTokenValue) {
        try {
          // Получаем актуальные данные пользователя из API
          console.log('[DEBUG] loadUser: fetching user profile from API');
          const profileData = await getProfile();
          console.log('[DEBUG] loadUser: profile data received:', profileData);
          
          // Преобразуем данные профиля в формат User для AuthContext
          const userData: User = {
            id: profileData.id.toString(),
            name: profileData.name || profileData.username || profileData.email,
            email: profileData.email,
            username: profileData.username,
            is_email_verified: profileData.is_email_verified,
            created_at: profileData.created_at,
            native_language: profileData.native_language,
            active_language: profileData.active_language
          };
          
          // Сохраняем обновленные данные пользователя в AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          
          // Сохраняем язык интерфейса из профиля
          if (profileData.interface_language) {
            console.log('[DEBUG] loadUser: setting interface language:', profileData.interface_language);
            // @ts-ignore
            await AsyncStorage.setItem('userLanguage', profileData.interface_language);
          }
          
          // Сохраняем родной язык из профиля
          if (profileData.native_language) {
            console.log('[DEBUG] loadUser: setting native language:', profileData.native_language);
            // @ts-ignore
            await AsyncStorage.setItem('nativeLanguage', profileData.native_language);
          }
          
          // Сохраняем активный язык из профиля
          if (profileData.active_language) {
            console.log('[DEBUG] loadUser: setting active language:', profileData.active_language);
            // @ts-ignore
            await AsyncStorage.setItem('activeLanguage', profileData.active_language);
          }

          setUser(userData);
          setupRefreshInterval();
          console.log('[DEBUG] loadUser: user set and refresh interval started');
        } catch (error: any) {
          console.error('[DEBUG] loadUser: Failed to fetch profile from API:', error);
          if (error && error.name === 'TokenExpiredError') {
            console.log('[DEBUG] loadUser: TokenExpiredError detected - global handler will manage redirect');
            // Don't call signOut here as the global handler in api.ts will handle the redirect
            // Just clear the local state
            setUser(null);
            if (refreshIntervalId) {
              clearInterval(refreshIntervalId);
              setRefreshIntervalId(null);
            }
            return;
          }
          // Если не удалось получить профиль, пробуем загрузить из AsyncStorage
          const userJson = await AsyncStorage.getItem('user');
          if (userJson) {
            const userData = JSON.parse(userJson);
            setUser(userData);
            setupRefreshInterval();
            console.log('[DEBUG] loadUser: loaded user from AsyncStorage as fallback');
          } else {
            // Если нет данных пользователя, выходим
            console.log('[DEBUG] loadUser: no user data available, calling signOut');
            await signOut(true);
            return;
          }
        }
      } else {
        console.log('[DEBUG] loadUser: no tokens found');
        // Проверяем, есть ли данные пользователя без токенов
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          // Session is invalid: user present but missing at least one token
          console.log('[DEBUG] loadUser: user present but missing token(s), calling signOut');
          await signOut(true);
          return;
        }
        // Если нет токенов и нет пользователя - это нормальное состояние для неавторизованного пользователя
        console.log('[DEBUG] loadUser: no tokens and no user - user is not authenticated');
      }
    } catch (error) {
      console.error('[DEBUG] loadUser: Failed to load user:', error);
    } finally {
      setIsLoading(false);
      console.log('[DEBUG] loadUser: end');
    }
  };

  useEffect(() => {
    loadUser();
    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
    };
  }, []);

  const setupRefreshInterval = () => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
    }
    const intervalId = setInterval(async () => {
      try {
        await refreshUserToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        signOut();
      }
    }, 60 * 60 * 1000); // 10 минут
    // @ts-ignore
    setRefreshIntervalId(intervalId);
  };

  const refreshUserToken = async () => {
    try {
      const refreshTokenValue = await AsyncStorage.getItem('refreshToken');
      
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }
      
      const { accessToken, refreshToken: newRefreshToken } = await refreshToken(refreshTokenValue);
      
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', newRefreshToken);
      
      setupRefreshInterval();
      
      return true;
    } catch (error: any) {
      console.error('Failed to refresh token:', error);
      
      // If refresh token is also expired, the refreshToken function will handle the redirect
      // We just need to clean up the local state here
      if (error.message.includes('Failed to refresh token')) {
        console.log('[DEBUG] refreshUserToken: Refresh token expired, cleaning up state');
        setUser(null);
        if (refreshIntervalId) {
          clearInterval(refreshIntervalId);
          setRefreshIntervalId(null);
        }
      }
      
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log('[DEBUG] signIn: start');
      const { user: userData, accessToken, refreshToken: newRefreshToken } = await loginUser(email, password);
      console.log('[DEBUG] signIn: loginUser result', { userData, accessToken, newRefreshToken });
      
      console.log('[DEBUG] signIn: writing user to AsyncStorage');
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      console.log('[DEBUG] signIn: writing accessToken to AsyncStorage');
      await AsyncStorage.setItem('accessToken', accessToken);
      console.log('[DEBUG] signIn: writing refreshToken to AsyncStorage');
      await AsyncStorage.setItem('refreshToken', newRefreshToken);
      
      // Set user directly instead of calling loadUser to avoid infinite loop
      console.log('[DEBUG] signIn: setting user state');
      setUser(userData);
      setupRefreshInterval();
      
      console.log('[DEBUG] signIn: redirecting to /(tabs)/');
      // @ts-ignore
      router.replace('/(tabs)/');
    } catch (error) {
      console.error('[DEBUG] signIn: Sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('[DEBUG] signIn: end');
    }
  };

  const signUp = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      
      const { user: userData } = await registerUser(name, email, password, confirmPassword);
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      await loadUser();

      // @ts-ignore
      router.replace('/(tabs)/');
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (skipRedirect = false) => {
    try {
      console.log('=== SIGN OUT STARTED ===');
      
      // Очистка AsyncStorage
      const keysToRemove = ['user', 'accessToken', 'refreshToken'];
      await AsyncStorage.multiRemove(keysToRemove);
      console.log('AsyncStorage cleared');

      // Очистка sessionStorage (web)
      if (typeof sessionStorage !== 'undefined') {
        const sessionKeys = Object.keys(sessionStorage);
        console.log('SessionStorage keys before clear:', sessionKeys);
        sessionStorage.clear();
        console.log('SessionStorage cleared');
      }
      
      // Очистка localStorage (web)
      if (typeof localStorage !== 'undefined') {
        const localKeys = Object.keys(localStorage);
        console.log('LocalStorage keys before clear:', localKeys);
        localStorage.clear();
        console.log('LocalStorage cleared');
      }
      
      // Очистка cookies (web)
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        console.log('Cookies before clear:', cookies.length);
        cookies.forEach((c) => {
          const eqPos = c.indexOf('=');
          const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
          // Очистка для всех возможных путей и доменов
          document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
          document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/;domain=${window.location.hostname}`;
          document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/;domain=.${window.location.hostname}`;
        });
        console.log('Cookies cleared');
      }
      
      // Очистка состояния
      setUser(null);
      
      // Очистка интервала обновления токена
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
        setRefreshIntervalId(null);
        console.log('Refresh interval cleared');
      }
      
      // Проверка очистки
      if (typeof window !== 'undefined') {
        setTimeout(async () => {
          const checkUser = await AsyncStorage.getItem('user');
          const checkToken = await AsyncStorage.getItem('accessToken');
          console.log('=== POST SIGN OUT CHECK ===');
          console.log('User in AsyncStorage:', checkUser);
          console.log('Token in AsyncStorage:', checkToken);
          console.log('SessionStorage:', typeof sessionStorage !== 'undefined' ? Object.keys(sessionStorage) : 'N/A');
          console.log('LocalStorage:', typeof localStorage !== 'undefined' ? Object.keys(localStorage) : 'N/A');
          console.log('Cookies:', typeof document !== 'undefined' ? document.cookie : 'N/A');
          console.log('========================');
        }, 100);
      }
      
      console.log('=== SIGN OUT COMPLETED ===');
      
      // Редирект на страницу логина только если не пропускаем редирект
      if (!skipRedirect) {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        signIn, 
        signUp, 
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
