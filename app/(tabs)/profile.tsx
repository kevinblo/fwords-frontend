import {useEffect, useState} from 'react';
import {Alert, Platform, ScrollView, Switch, Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {useAuth} from '@/context/AuthContext';
import {useTheme} from '@/context/ThemeContext';
import {useLanguage} from '@/context/LanguageContext';
import {useNativeLanguage} from '@/context/NativeLanguageContext';
import {useActiveLanguage} from '@/context/ActiveLanguageContext';
import {fetchLanguages, fetchLanguageProgress, getProfile, updateNotifications} from '@/api/api';
import {Bell, ChevronRight, Globe, HelpCircle, Languages, LogOut, Moon, Settings, Shield, Sun} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import {Header} from '@/components/ui/Header';
import styles from '@/assets/styles/profileScreen.styles'
import i18n from '@/i18n';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { interfaceLanguageCode, languages: interfaceLanguages } = useLanguage();
  const { nativeLanguageCode, languages: nativeLanguages } = useNativeLanguage();
  const { activeLanguageCode, languages: activeLanguages } = useActiveLanguage();

  const [notifications, setNotifications] = useState(true);
  const [languages, setLanguages] = useState<any[]>([]);
  const [languageProgress, setLanguageProgress] = useState<any[]>([]);
  const [currentLevel, setCurrentLevel] = useState<string>('A1');

  const isDark = theme === 'dark';

  // Загружаем языки и прогресс при монтировании компонента
  useEffect(() => {
    loadNotificationSettings();
    fetchLanguages().then(setLanguages);
    fetchLanguageProgress().then((progress) => {
      setLanguageProgress(progress);
    }).catch((error) => {
      console.error('Failed to fetch language progress:', error);
      setLanguageProgress([]); // Set empty array as fallback
    });
  }, []);

  // Загружаем настройки уведомлений из API
  const loadNotificationSettings = async () => {
    try {
      const profile = await getProfile();
      if (profile.notify !== undefined) {
        setNotifications(profile.notify);
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  };

  // Функция для получения названия языка
  const getLanguageName = (code: string): string => {
    // First try to find in native languages from context
    const nativeLanguage = nativeLanguages.find(l => l.code === code);
    if (nativeLanguage) {
      return nativeLanguage.name_native;
    }
    
    // Try interface languages
    const interfaceLanguage = interfaceLanguages.find(l => l.code === code);
    if (interfaceLanguage) {
      return interfaceLanguage.name_english;
    }
    
    // Try active languages
    const activeLanguage = activeLanguages.find(l => l.code === code);
    if (activeLanguage) {
      return activeLanguage.name_native;
    }
    
    // Fallback to hardcoded names
    const languageNames: { [key: string]: string } = {
      en: 'English',
      ru: 'Русский',
    };
    return languageNames[code] || code;
  };

  const handleSignOut = async () => {
    console.log('handleSignOut called');
    console.log('Current user:', user);
    console.log('signOut function:', signOut);

    try {
      // Временно убираем подтверждение для отладки
      console.log('Calling signOut...');
      await signOut();
      console.log('Sign out completed');
    } catch (error) {
      console.error('Sign out error:', error);
      // @ts-ignore
      alert('Error signing out: ' + error.message);
    }
  };

  // Альтернативная функция с подтверждением
  const handleSignOutWithConfirm = async () => {
    console.log('handleSignOutWithConfirm called');

    // Для web используем confirm, для мобильных - Alert
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(i18n.t('profile.signOutConfirm'));
      if (confirmed) {
        console.log('User confirmed sign out');
        try {
          await signOut();
          console.log('Sign out completed');
        } catch (error) {
          console.error('Sign out error:', error);
        }
      }
    } else {
      Alert.alert(
        i18n.t('profile.signOutTitle'),
        i18n.t('profile.signOutConfirm'),
        [
          {
            text: i18n.t('profile.cancel'),
            style: 'cancel',
            onPress: () => console.log('Sign out cancelled'),
          },
          {
            text: i18n.t('profile.signOut'),
            onPress: async () => {
              console.log('User confirmed sign out');
              try {
                await signOut();
                console.log('Sign out completed');
              } catch (error) {
                console.error('Sign out error:', error);
              }
            },
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleLanguageChange = () => {
    router.push('/settings/language');
  };

  // Обработчик изменения настройки уведомлений
  const handleNotificationToggle = async (value: boolean) => {
    setNotifications(value);
    try {
      await updateNotifications(value);
      console.log('Notification settings updated successfully');
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      // Откатываем изменение в случае ошибки
      setNotifications(!value);
      Alert.alert(
        i18n.t('profile.error'),
        i18n.t('profile.notificationUpdateError')
      );
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title={i18n.t('profile.title')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Profile Card */}
        <View style={[styles.profileCard, isDark && styles.profileCardDark]}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, isDark && styles.profileNameDark]}>
                {user?.name || i18n.t('profile.userName')}
              </Text>
              <Text style={[styles.profileEmail, isDark && styles.profileEmailDark]}>
                {user?.email || i18n.t('profile.userEmail')}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/settings/profile')}
          >
            <Text style={styles.editButtonText}>{i18n.t('profile.edit')}</Text>
          </TouchableOpacity>
        </View>

        {/* Language Settings */}
        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            {i18n.t('profile.settingsLanguages')}
          </Text>
          
          {/* Active Language Setting */}
          <TouchableOpacity
              style={[styles.settingItem, isDark && styles.settingItemDark]}
              onPress={() => router.push('/settings/active-language')}
          >
            <View style={styles.settingLeft}>
              <Languages size={22} color={isDark ? Colors.accent : Colors.primary}/>
              <Text style={[styles.settingText, isDark && styles.settingTextDark]}>
                {i18n.t('profile.activeLanguage')}
              </Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, isDark && styles.settingValueDark]}>
                {activeLanguageCode ? getLanguageName(activeLanguageCode) : i18n.t('profile.notSet')}
              </Text>
              <ChevronRight size={20} color={isDark ? Colors.gray[400] : Colors.gray[600]}/>
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            {i18n.t('profile.settings')}
          </Text>

          {/* Theme Setting */}
          <View style={[styles.settingItem, isDark && styles.settingItemDark]}>
            <View style={styles.settingLeft}>
              {isDark ? (
                <Moon size={22} color={Colors.accent} />
              ) : (
                <Sun size={22} color={Colors.primary} />
              )}
              <Text style={[styles.settingText, isDark && styles.settingTextDark]}>
                {i18n.t('profile.darkMode')}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + '80' }}
              thumbColor={isDark ? Colors.primary : Colors.gray[100]}
            />
          </View>

          {/* Interface Language Setting */}
          <TouchableOpacity
            style={[styles.settingItem, isDark && styles.settingItemDark]}
            onPress={handleLanguageChange}
          >
            <View style={styles.settingLeft}>
              <Languages size={22} color={isDark ? Colors.accent : Colors.primary}/>
              <Text style={[styles.settingText, isDark && styles.settingTextDark]}>
                {i18n.t('profile.appLanguage')}
              </Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, isDark && styles.settingValueDark]}>
                {interfaceLanguageCode ? getLanguageName(interfaceLanguageCode) : i18n.t('profile.notSet')}
              </Text>
              <ChevronRight size={20} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
            </View>
          </TouchableOpacity>

          {/* Native Language Setting */}
          <TouchableOpacity
            style={[styles.settingItem, isDark && styles.settingItemDark]}
            onPress={() => router.push('/settings/native-language')}
          >
            <View style={styles.settingLeft}>
              <Globe size={22} color={isDark ? Colors.accent : Colors.primary} />
              <Text style={[styles.settingText, isDark && styles.settingTextDark]}>
                {i18n.t('profile.nativeLanguage')}
              </Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, isDark && styles.settingValueDark]}>
                {nativeLanguageCode ? getLanguageName(nativeLanguageCode) : i18n.t('profile.notSet')}
              </Text>
              <ChevronRight size={20} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
            </View>
          </TouchableOpacity>

          {/* Notifications Setting */}
          <View style={[styles.settingItem, isDark && styles.settingItemDark]}>
            <View style={styles.settingLeft}>
              <Bell size={22} color={isDark ? Colors.accent : Colors.primary} />
              <Text style={[styles.settingText, isDark && styles.settingTextDark]}>
                {i18n.t('profile.notifications')}
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: Colors.gray[300], true: Colors.primary + '80' }}
              thumbColor={notifications ? Colors.primary : Colors.gray[100]}
            />
          </View>
        </View>

        {/* Additional Options */}
        <View style={styles.optionsContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            {i18n.t('profile.more')}
          </Text>

          <TouchableOpacity style={[styles.optionItem, isDark && styles.optionItemDark]}>
            <View style={styles.optionLeft}>
              <Settings size={22} color={isDark ? Colors.accent : Colors.primary} />
              <Text style={[styles.optionText, isDark && styles.optionTextDark]}>
                {i18n.t('profile.preferences')}
              </Text>
            </View>
            <ChevronRight size={20} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionItem, isDark && styles.optionItemDark]}>
            <View style={styles.optionLeft}>
              <Shield size={22} color={isDark ? Colors.accent : Colors.primary} />
              <Text style={[styles.optionText, isDark && styles.optionTextDark]}>
                {i18n.t('profile.privacy')}
              </Text>
            </View>
            <ChevronRight size={20} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionItem, isDark && styles.optionItemDark]}>
            <View style={styles.optionLeft}>
              <HelpCircle size={22} color={isDark ? Colors.accent : Colors.primary} />
              <Text style={[styles.optionText, isDark && styles.optionTextDark]}>
                {i18n.t('profile.help')}
              </Text>
            </View>
            <ChevronRight size={20} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signOutButton, isDark && styles.signOutButtonDark]}
            onPress={() => {
              console.log('Sign Out button pressed');
              handleSignOut();
            }}
            activeOpacity={0.7}
          >
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.signOutText}>{i18n.t('profile.signOut')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.versionText, isDark && styles.versionTextDark]}>
          {i18n.t('profile.version', { version: '0.0.1' })}
        </Text>
      </ScrollView>
    </View>
  );
}