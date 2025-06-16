import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProfile, fetchLanguages, updateActiveLanguage} from '@/api/api';
import {useAuth} from './AuthContext';
import {Language} from '@/types/language';

interface ActiveLanguageContextProps {
    activeLanguageId: number | null;
    activeLanguageCode: string;
    setActiveLanguage: (languageId: number) => Promise<void>;
    isLoading: boolean;
    languages: Language[];
}

const ActiveLanguageContext = createContext<ActiveLanguageContextProps>({
    activeLanguageId: null,
    activeLanguageCode: 'en',
    setActiveLanguage: async () => {},
    isLoading: true,
    languages: [],
});

export function useActiveLanguage() {
    return useContext(ActiveLanguageContext);
}

interface ActiveLanguageProviderProps {
    children: ReactNode;
}

export function ActiveLanguageProvider({children}: ActiveLanguageProviderProps) {
    const [activeLanguageId, setActiveLanguageIdState] = useState<number | null>(null);
    const [activeLanguageCode, setActiveLanguageCodeState] = useState<string>('en');
    const [languages, setLanguages] = useState<Language[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    useEffect(() => {
        console.log('[ActiveLanguageContext] useEffect triggered, authLoading:', authLoading, 'isAuthenticated:', isAuthenticated);
        // Only load when auth context is ready
        if (!authLoading) {
            loadActiveLanguage();
        }
    }, [authLoading, isAuthenticated]);

    const loadActiveLanguage = async () => {
        console.log('[ActiveLanguageContext] loadActiveLanguage started');
        try {
            // First, load available languages
            console.log('[ActiveLanguageContext] Fetching languages...');
            const availableLanguages = await fetchLanguages();
            console.log('[ActiveLanguageContext] Available languages:', availableLanguages);
            setLanguages(availableLanguages);
            
            // Try to get from AsyncStorage first (stored as ID)
            const savedLanguageId = await AsyncStorage.getItem('activeLanguageId');
            console.log('[ActiveLanguageContext] Saved language ID from storage:', savedLanguageId);
            
            if (savedLanguageId) {
                const languageId = parseInt(savedLanguageId, 10);
                const language = availableLanguages.find(l => l.id === languageId);
                if (language) {
                    console.log('[ActiveLanguageContext] Loading saved active language ID:', languageId);
                    setActiveLanguageIdState(languageId);
                    setActiveLanguageCodeState(language.code);
                    setIsLoading(false);
                    return;
                }
            }

            // If not in AsyncStorage and user is authenticated, try to get from profile
            if (isAuthenticated) {
                try {
                    console.log('[ActiveLanguageContext] Fetching profile...');
                    const profile = await getProfile();
                    console.log('[ActiveLanguageContext] Profile data:', profile);
                    
                    if (profile.active_language) {
                        // Handle both ID (number) and object formats
                        let languageId: number;
                        let languageCode: string;
                        
                        if (typeof profile.active_language === 'object' && profile.active_language.id) {
                            // API returned full language object
                            languageId = profile.active_language.id;
                            languageCode = profile.active_language.code;
                            console.log('[ActiveLanguageContext] Profile has language object:', languageId, languageCode);
                        } else if (typeof profile.active_language === 'number') {
                            // API returned just the ID
                            languageId = profile.active_language;
                            const language = availableLanguages.find(l => l.id === languageId);
                            if (!language) {
                                console.log('[ActiveLanguageContext] Language not found for ID:', languageId);
                                throw new Error('Language not found');
                            }
                            languageCode = language.code;
                            console.log('[ActiveLanguageContext] Profile has language ID:', languageId, languageCode);
                        } else {
                            console.log('[ActiveLanguageContext] Invalid active_language format:', typeof profile.active_language, profile.active_language);
                            throw new Error('Invalid active_language format');
                        }
                        
                        console.log('[ActiveLanguageContext] Loading active language from profile:', languageId, languageCode);
                        setActiveLanguageIdState(languageId);
                        setActiveLanguageCodeState(languageCode);
                        await AsyncStorage.setItem('activeLanguageId', languageId.toString());
                        setIsLoading(false);
                        return;
                    }
                } catch (error) {
                    console.log('[ActiveLanguageContext] Could not load profile, using default active language:', error);
                }
            }

            // Fallback to first available language or default
            if (availableLanguages.length > 0) {
                const defaultLanguage = availableLanguages.find(l => l.code === 'en') || availableLanguages[0];
                console.log('[ActiveLanguageContext] Using default language:', defaultLanguage);
                setActiveLanguageIdState(defaultLanguage.id);
                setActiveLanguageCodeState(defaultLanguage.code);
                await AsyncStorage.setItem('activeLanguageId', defaultLanguage.id.toString());
            }
        } catch (error) {
            console.error('[ActiveLanguageContext] Error loading active language:', error);
        } finally {
            console.log('[ActiveLanguageContext] loadActiveLanguage finished');
            setIsLoading(false);
        }
    };

    const setActiveLanguage = async (languageId: number) => {
        console.log('[ActiveLanguageContext] Setting new active language ID:', languageId);
        
        const language = languages.find(l => l.id === languageId);
        if (!language) {
            console.error('[ActiveLanguageContext] Language not found for ID:', languageId);
            return;
        }

        setActiveLanguageIdState(languageId);
        setActiveLanguageCodeState(language.code);
        
        try {
            // Save to AsyncStorage first
            await AsyncStorage.setItem('activeLanguageId', languageId.toString());
            
            // If user is authenticated, also update on the server
            if (isAuthenticated) {
                try {
                    await updateActiveLanguage(languageId);
                    console.log('[ActiveLanguageContext] Active language updated on server successfully');
                } catch (error) {
                    console.error('[ActiveLanguageContext] Error updating active language on server:', error);
                    // Don't throw error here - local storage update was successful
                }
            }
        } catch (error) {
            console.error('[ActiveLanguageContext] Error saving active language:', error);
        }
    };

    // Backward compatibility - expose ActiveLanguage
    const ActiveLanguage = activeLanguageCode;

    console.log('[ActiveLanguageContext] Current state:', {
        activeLanguageId,
        activeLanguageCode,
        isLoading,
        languagesCount: languages.length
    });

    return (
        <ActiveLanguageContext.Provider value={{
            activeLanguageId,
            activeLanguageCode,
            setActiveLanguage,
            isLoading,
            languages,
            // Backward compatibility
            ActiveLanguage
        } as any}>
            {children}
        </ActiveLanguageContext.Provider>
    );
}