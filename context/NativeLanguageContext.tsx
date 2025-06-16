import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProfile, updateNativeLanguage, fetchLanguages} from '@/api/api';
import {useAuth} from './AuthContext';
import {Language} from '@/types/language';

interface NativeLanguageContextProps {
    nativeLanguageId: number | null;
    nativeLanguageCode: string;
    setNativeLanguage: (languageId: number) => Promise<void>;
    isLoading: boolean;
    languages: Language[];
}

const NativeLanguageContext = createContext<NativeLanguageContextProps>({
    nativeLanguageId: null,
    nativeLanguageCode: 'en',
    setNativeLanguage: async () => {
    },
    isLoading: true,
    languages: [],
});

export function useNativeLanguage() {
    return useContext(NativeLanguageContext);
}

interface NativeLanguageProviderProps {
    children: ReactNode;
}

export function NativeLanguageProvider({children}: NativeLanguageProviderProps) {
    const [nativeLanguageId, setNativeLanguageIdState] = useState<number | null>(null);
    const [nativeLanguageCode, setNativeLanguageCodeState] = useState<string>('en');
    const [languages, setLanguages] = useState<Language[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    useEffect(() => {
        // Only load when auth context is ready
        if (!authLoading) {
            loadNativeLanguage();
        }
    }, [authLoading, isAuthenticated]);

    const loadNativeLanguage = async () => {
        try {
            // First, load available languages
            const availableLanguages = await fetchLanguages();
            setLanguages(availableLanguages);
            
            // Try to get from AsyncStorage first (stored as ID)
            const savedLanguageId = await AsyncStorage.getItem('nativeLanguageId');
            if (savedLanguageId) {
                const languageId = parseInt(savedLanguageId, 10);
                const language = availableLanguages.find(l => l.id === languageId);
                if (language) {
                    console.log('[NativeLanguageContext] Loading saved native language ID:', languageId);
                    setNativeLanguageIdState(languageId);
                    setNativeLanguageCodeState(language.code);
                    return;
                }
            }

            // If not in AsyncStorage and user is authenticated, try to get from profile
            if (isAuthenticated) {
                try {
                    const profile = await getProfile();
                    if (profile.native_language) {
                        // Handle both ID (number) and object formats
                        let languageId: number;
                        let languageCode: string;
                        
                        if (typeof profile.native_language === 'object' && profile.native_language.id) {
                            // API returned full language object
                            languageId = profile.native_language.id;
                            languageCode = profile.native_language.code;
                            console.log('[NativeLanguageContext] Profile has native language object:', languageId, languageCode);
                        } else if (typeof profile.native_language === 'number') {
                            // API returned just the ID
                            languageId = profile.native_language;
                            const language = availableLanguages.find(l => l.id === languageId);
                            if (!language) {
                                console.log('[NativeLanguageContext] Language not found for ID:', languageId);
                                throw new Error('Language not found');
                            }
                            languageCode = language.code;
                            console.log('[NativeLanguageContext] Profile has native language ID:', languageId, languageCode);
                        } else {
                            console.log('[NativeLanguageContext] Invalid native_language format:', typeof profile.native_language, profile.native_language);
                            throw new Error('Invalid native_language format');
                        }
                        
                        console.log('[NativeLanguageContext] Loading native language from profile:', languageId, languageCode);
                        setNativeLanguageIdState(languageId);
                        setNativeLanguageCodeState(languageCode);
                        await AsyncStorage.setItem('nativeLanguageId', languageId.toString());
                        return;
                    }
                } catch (error) {
                    console.log('[NativeLanguageContext] Could not load profile, using default native language:', error);
                }
            }

            // Fallback to first available language or default
            if (availableLanguages.length > 0) {
                const defaultLanguage = availableLanguages.find(l => l.code === 'en') || availableLanguages[0];
                setNativeLanguageIdState(defaultLanguage.id);
                setNativeLanguageCodeState(defaultLanguage.code);
                await AsyncStorage.setItem('nativeLanguageId', defaultLanguage.id.toString());
            }
        } catch (error) {
            console.error('[NativeLanguageContext] Error loading native language:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setNativeLanguage = async (languageId: number) => {
        console.log('[NativeLanguageContext] Setting new native language ID:', languageId);
        
        const language = languages.find(l => l.id === languageId);
        if (!language) {
            console.error('[NativeLanguageContext] Language not found for ID:', languageId);
            return;
        }

        setNativeLanguageIdState(languageId);
        setNativeLanguageCodeState(language.code);
        
        try {
            // Save to AsyncStorage first
            await AsyncStorage.setItem('nativeLanguageId', languageId.toString());
            
            // If user is authenticated, also update on the server
            if (isAuthenticated) {
                try {
                    await updateNativeLanguage(languageId);
                    console.log('[NativeLanguageContext] Native language updated on server successfully');
                } catch (error) {
                    console.error('[NativeLanguageContext] Error updating native language on server:', error);
                    // Don't throw error here - local storage update was successful
                }
            }
        } catch (error) {
            console.error('[NativeLanguageContext] Error saving native language:', error);
        }
    };

    return (
        <NativeLanguageContext.Provider value={{
            nativeLanguageId, 
            nativeLanguageCode, 
            setNativeLanguage, 
            isLoading, 
            languages
        }}>
            {children}
        </NativeLanguageContext.Provider>
    );
}