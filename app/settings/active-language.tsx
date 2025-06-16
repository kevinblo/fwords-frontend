import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {router} from 'expo-router';
import {useTheme} from '@/context/ThemeContext';
import {useActiveLanguage} from '@/context/ActiveLanguageContext';
import {useLanguageProgress} from '@/context/LanguageProgressContext';
import {ArrowLeft, Check} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import styles from '@/assets/styles/settingsLanguage.styles'
import i18n from '@/i18n';
import {useAuth} from '@/context/AuthContext';
import {useEffect, useState} from 'react';
import {LanguageLevel} from '@/types/progress';

const LEVELS: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function ActiveLanguageScreen() {
    const {theme} = useTheme();
    const {activeLanguageId, activeLanguageCode, languages, setActiveLanguage: setContextActiveLanguage, isLoading: contextLoading} = useActiveLanguage();
    const {
        languageProgress,
        isLoading: isLoadingProgress,
        getLanguageLevel,
        updateLanguageLevel,
        createProgress,
        refreshProgress
    } = useLanguageProgress();
    const { refreshUser } = useAuth();
    const isDark = theme === 'dark';
    const [isUpdating, setIsUpdating] = useState(false);
    const [levelUpdating, setLevelUpdating] = useState<{[key: number]: boolean}>({});

    // Refresh progress when component mounts
    useEffect(() => {
        console.log('[ActiveLanguage] Component mounted, refreshing progress');
        refreshProgress();
    }, []);

    // Debug effect to log progress changes
    useEffect(() => {
        console.log('[ActiveLanguage] Language progress updated:', languageProgress);
        console.log('[ActiveLanguage] Progress count:', languageProgress.length);
        if (activeLanguageId) {
            const currentLevel = getLanguageLevel(activeLanguageId);
            console.log('[ActiveLanguage] Current level for active language:', currentLevel);
        }
    }, [languageProgress, activeLanguageId]);

    const handleLanguageSelect = async (languageId: number) => {
        if (isUpdating) return;

        setIsUpdating(true);
        try {
            // Update through context - this will handle both local storage and API update
            await setContextActiveLanguage(languageId);
            // Refresh user profile
            if (refreshUser) {
                await refreshUser();
            }
            router.back();
        } catch (error) {
            console.error('Failed to update active language:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLevelChange = async (languageId: number, level: LanguageLevel) => {
        if (levelUpdating[languageId]) return;

        setLevelUpdating(prev => ({ ...prev, [languageId]: true }));
        
        try {
            console.log('Updating level:', level, 'for language:', languageId);
            
            // Check if progress exists for this language
            const existingProgress = languageProgress.find(p => p.language.id === languageId);
            
            if (existingProgress) {
                // Update existing progress
                await updateLanguageLevel(languageId, level);
            } else {
                // Create new progress
                await createProgress(languageId, level);
            }
            
            console.log('Level updated successfully');
        } catch (error) {
            console.error('Error updating language level:', error);
            // You might want to show an error message to the user here
        } finally {
            setLevelUpdating(prev => ({ ...prev, [languageId]: false }));
        }
    };

    if (contextLoading || isLoadingProgress) {
        return (
            <View style={[styles.container, isDark && styles.containerDark, {justifyContent: 'center', alignItems: 'center'}]}>
                <ActivityIndicator size="large" color={Colors.primary}/>
            </View>
        );
    }

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.header, isDark && styles.containerDark]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace('/profile')}
                >
                    <ArrowLeft size={24} color={isDark ? Colors.dark.text : Colors.light.text}/>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
                    {i18n.t('profile.activeLanguage')}
                </Text>
                <View style={{width: 24}}/>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {languages.map((language) => {
                    const currentLevel = getLanguageLevel(language.id);
                    const isLevelUpdating = levelUpdating[language.id] || false;
                    
                    return (
                        <View key={language.id} style={{
                            marginBottom: 24, 
                            backgroundColor: isDark ? '#222' : '#fff', 
                            borderRadius: 8, 
                            padding: 12
                        }}>
                            <TouchableOpacity
                                style={[
                                    styles.languageItem,
                                    isDark && styles.languageItemDark,
                                    activeLanguageId === language.id && styles.selectedItem,
                                    isDark && activeLanguageId === language.id && styles.selectedItemDark,
                                ]}
                                onPress={() => handleLanguageSelect(language.id)}
                                disabled={isUpdating}
                            >
                                <Text style={[
                                    styles.languageName,
                                    isDark && styles.languageNameDark,
                                    activeLanguageId === language.id && styles.selectedText,
                                ]}>
                                    {language.name_native}
                                </Text>
                                {activeLanguageId === language.id && !isUpdating && (
                                    <Check size={20} color={Colors.primary}/>
                                )}
                                {activeLanguageId === language.id && isUpdating && (
                                    <ActivityIndicator size="small" color={Colors.primary}/>
                                )}
                            </TouchableOpacity>
                            
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                <Text style={[
                                    styles.languageLevel,
                                    isDark && styles.languageLevelDark,
                                    { flex: 1 }
                                ]}>
                                    {i18n.t('profile.languageLevel') || 'Level'}:
                                </Text>
                                {isLevelUpdating && (
                                    <ActivityIndicator size="small" color={Colors.primary} style={{ marginLeft: 8 }} />
                                )}
                            </View>
                            
                            <Picker
                                selectedValue={currentLevel}
                                onValueChange={(value) => handleLevelChange(language.id, value)}
                                enabled={!isLevelUpdating}
                                style={[
                                    styles.languageItem,
                                    isDark && styles.languageItemDark,
                                    activeLanguageId === language.id && styles.selectedItem,
                                    isDark && activeLanguageId === language.id && styles.selectedItemDark,
                                    isLevelUpdating && { opacity: 0.6 }
                                ]}
                            >
                                {LEVELS.map((level) => (
                                    <Picker.Item 
                                        key={level} 
                                        label={level} 
                                        value={level} 
                                        style={[
                                            styles.languageItem,
                                            isDark && styles.languageItemDark,
                                            activeLanguageId === language.id && styles.selectedItem,
                                            isDark && activeLanguageId === language.id && styles.selectedItemDark,
                                        ]}
                                    />
                                ))}
                            </Picker>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}