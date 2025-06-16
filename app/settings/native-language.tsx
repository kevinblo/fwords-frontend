import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {useTheme} from '@/context/ThemeContext';
import {useNativeLanguage} from '@/context/NativeLanguageContext';
import {ArrowLeft, Check} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import styles from '@/assets/styles/settingsLanguage.styles'
import i18n from '@/i18n';
import {useState} from 'react';

export default function NativeLanguageScreen() {
    const {theme} = useTheme();
    const {nativeLanguageId, languages, setNativeLanguage: setContextNativeLanguage, isLoading: contextLoading} = useNativeLanguage();
    const isDark = theme === 'dark';
    const [isUpdating, setIsUpdating] = useState(false);

    const handleLanguageSelect = async (languageId: number) => {
        if (isUpdating) return;

        setIsUpdating(true);
        try {
            // Update through context - this will handle both local storage and API update
            await setContextNativeLanguage(languageId);
            router.back();
        } catch (error) {
            console.error('Failed to update native language:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (contextLoading) {
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
                    {i18n.t('profile.nativeLanguage')}
                </Text>
                <View style={{width: 24}}/>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {languages.map((language) => (
                    <TouchableOpacity
                        key={language.id}
                        style={[
                            styles.languageItem,
                            isDark && styles.languageItemDark,
                            nativeLanguageId === language.id && styles.selectedItem,
                            isDark && nativeLanguageId === language.id && styles.selectedItemDark,
                        ]}
                        onPress={() => handleLanguageSelect(language.id)}
                        disabled={isUpdating}
                    >
                        <Text style={[
                            styles.languageName,
                            isDark && styles.languageNameDark,
                            nativeLanguageId === language.id && styles.selectedText,
                        ]}>
                            {language.name_native}
                        </Text>
                        {nativeLanguageId === language.id && !isUpdating && (
                            <Check size={20} color={Colors.primary}/>
                        )}
                        {nativeLanguageId === language.id && isUpdating && (
                            <ActivityIndicator size="small" color={Colors.primary}/>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}