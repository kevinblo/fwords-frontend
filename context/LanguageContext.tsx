import {createContext, ReactNode, useContext, useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';
import {fetchLanguages, getProfile, updateInterfaceLanguage} from '@/api/api';
import {useAuth} from './AuthContext';
import {Language} from '@/types/language';

interface LanguageContextProps {
  interfaceLanguageId: number | null;
  interfaceLanguageCode: string;
  setInterfaceLanguage: (languageId: number) => Promise<void>;
  isLoading: boolean;
  languages: Language[];
  // Backward compatibility
  userLanguage: 'en' | 'ru';
  setUserLanguage: (languageCode: 'en' | 'ru') => Promise<void>;
}

const LanguageContext = createContext<LanguageContextProps>({
  interfaceLanguageId: 1,
  interfaceLanguageCode: 'en',
  setInterfaceLanguage: async () => {},
  isLoading: true,
  languages: [],
  // Backward compatibility
  userLanguage: 'en',
  setUserLanguage: async () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [interfaceLanguageId, setInterfaceLanguageIdState] = useState<number | null>(null);
  const [interfaceLanguageCode, setInterfaceLanguageCodeState] = useState<string>('en');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const currentLanguageRef = useRef<string>('en');

  // Update ref when language changes
  useEffect(() => {
    currentLanguageRef.current = interfaceLanguageCode;
  }, [interfaceLanguageCode]);

  useEffect(() => {
    // Only load when auth context is ready
    if (!authLoading) {
      loadInterfaceLanguage();
    }
  }, [authLoading, isAuthenticated]);

  const loadInterfaceLanguage = async () => {
    try {
      // First, load available languages
      const availableLanguages = await fetchLanguages();
      setLanguages(availableLanguages);
      
      // Try to get from AsyncStorage first (stored as ID)
      const savedLanguageId = await AsyncStorage.getItem('interfaceLanguageId');
      if (savedLanguageId) {
        const languageId = parseInt(savedLanguageId, 10);
        const language = availableLanguages.find(l => l.id === languageId);
        if (language) {
          console.log('[LanguageContext] Loading saved interface language ID:', languageId);
          setInterfaceLanguageIdState(languageId);
          setInterfaceLanguageCodeState(language.code);
          return;
        }
      }

      // If not in AsyncStorage and user is authenticated, try to get from profile
      if (isAuthenticated) {
        try {
          const profile = await getProfile();
          if (profile.interface_language) {
            // Handle both ID (number) and object formats
            let languageId: number;
            let languageCode: string;
            
            if (typeof profile.interface_language === 'object' && profile.interface_language.id) {
              // API returned full language object
              languageId = profile.interface_language.id;
              languageCode = profile.interface_language.code;
              console.log('[LanguageContext] Profile has interface language object:', languageId, languageCode);
            } else if (typeof profile.interface_language === 'number') {
              // API returned just the ID
              languageId = profile.interface_language;
              const language = availableLanguages.find(l => l.id === languageId);
              if (!language) {
                console.log('[LanguageContext] Language not found for ID:', languageId);
                throw new Error('Language not found');
              }
              languageCode = language.code;
              console.log('[LanguageContext] Profile has interface language ID:', languageId, languageCode);
            } else {
              console.log('[LanguageContext] Invalid interface_language format:', typeof profile.interface_language, profile.interface_language);
              throw new Error('Invalid interface_language format');
            }
            
            console.log('[LanguageContext] Loading interface language from profile:', languageId, languageCode);
            setInterfaceLanguageIdState(languageId);
            setInterfaceLanguageCodeState(languageCode);
            await AsyncStorage.setItem('interfaceLanguageId', languageId.toString());
            return;
          }
        } catch (error) {
          console.log('[LanguageContext] Could not load profile, using default interface language:', error);
        }
      }

      // Fallback to first available language or default
      if (availableLanguages.length > 0) {
        const defaultLanguage = availableLanguages.find(l => l.code === 'en') || availableLanguages[0];
        setInterfaceLanguageIdState(defaultLanguage.id);
        setInterfaceLanguageCodeState(defaultLanguage.code);
        await AsyncStorage.setItem('interfaceLanguageId', defaultLanguage.id.toString());
      }
    } catch (error) {
      console.error('[LanguageContext] Error loading interface language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setInterfaceLanguage = async (languageId: number) => {
    console.log('[LanguageContext] Setting new interface language ID:', languageId);
    
    const language = languages.find(l => l.id === languageId);
    if (!language) {
      console.error('[LanguageContext] Language not found for ID:', languageId);
      return;
    }

    setInterfaceLanguageIdState(languageId);
    setInterfaceLanguageCodeState(language.code);
    
    try {
      // Save to AsyncStorage first
      await AsyncStorage.setItem('interfaceLanguageId', languageId.toString());
      
      // If user is authenticated, also update on the server
      if (isAuthenticated) {
        try {
          await updateInterfaceLanguage(languageId);
          console.log('[LanguageContext] Interface language updated on server successfully');
        } catch (error) {
          console.error('[LanguageContext] Error updating interface language on server:', error);
          // Don't throw error here - local storage update was successful
        }
      }
    } catch (error) {
      console.error('[LanguageContext] Error saving interface language:', error);
    }
  };

  // Синхронизация i18n.locale с interfaceLanguageCode
  useEffect(() => {
    if (!isLoading && interfaceLanguageCode) {
      console.log('[LanguageContext] Syncing i18n locale to:', interfaceLanguageCode);
      i18n.locale = interfaceLanguageCode;
    }
  }, [interfaceLanguageCode, isLoading]);

  // Backward compatibility - expose userLanguage and setUserLanguage
  const userLanguage = interfaceLanguageCode as 'en' | 'ru';
  const setUserLanguage = async (languageCode: 'en' | 'ru') => {
    const language = languages.find(l => l.code === languageCode);
    if (language) {
      await setInterfaceLanguage(language.id);
    }
  };

  return (
    <LanguageContext.Provider value={{
      interfaceLanguageId,
      interfaceLanguageCode,
      setInterfaceLanguage,
      isLoading,
      languages,
      // Backward compatibility
      userLanguage,
      setUserLanguage
    } as any}>
      {children}
    </LanguageContext.Provider>
  );
}