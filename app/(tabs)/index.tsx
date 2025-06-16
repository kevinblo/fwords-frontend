import {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {useTheme} from '@/context/ThemeContext';
import {fetchLanguages, fetchUserProgress, fetchWordsStats, getProfile} from '@/api/api';
import {LanguageProgress, WordsStats} from '@/types/progress';
import {ArrowRight, Book, Sparkles} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import {LanguageCard} from '@/components/LanguageCard';
import {Header} from '@/components/ui/Header';
import styles from "@/assets/styles/indexScreen.styles";
import i18n from '@/i18n';
import {User} from '@/types/user';

export default function LearnScreen() {

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [languageProgress, setUserProgress] = useState<LanguageProgress[] | []>([]);
  const [wordsStats, setWordsStats] = useState<WordsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch languages and user progress in parallel
        const [languagesData, progressData, profileData, wordsStatsData] = await Promise.all([
          fetchLanguages(),
          fetchUserProgress(),
          getProfile(),
          fetchWordsStats()
        ]);

        console.log('[INDEX userProfile]', userProfile);
        console.log('[INDEX progressData]', progressData);
        console.log('[INDEX fetchWordsStats]', wordsStatsData);

        setUserProgress(progressData);
        setUserProfile(profileData);
        setWordsStats(wordsStatsData);
      } catch (err) {
        setError(i18n.t('index.failedToLoadData'));
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };


    loadData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDark && styles.loadingContainerDark]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, isDark && styles.errorContainerDark]}>
        <Text style={[styles.errorText, isDark && styles.errorTextDark]}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.retryButtonText}>{i18n.t('index.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title={i18n.t('index.title')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Today's stats */}
        <View style={[styles.statsCard, isDark && styles.statsCardDark]}>
          <View style={styles.statHeader}>
            <Text style={[styles.statsTitle, isDark && styles.statsTitleDark]}>{i18n.t('index.todaysProgress')}</Text>
            <Sparkles size={20} color={isDark ? Colors.accent : Colors.primary} />
          </View>

          <View style={styles.statsContent}>
            <View style={styles.statItem}>
                <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                  {wordsStats?.total_words || 0}
                </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>{i18n.t('index.wordsLearned')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                  {wordsStats?.words_new || 0}
                </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>{i18n.t('index.newWords')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                  {wordsStats?.words_learning || 0}
                </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>{i18n.t('index.wordsLearning')}</Text>
            </View>
          </View>
        </View>

        {/* My Languages section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>{i18n.t('index.myLanguages')}</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>{i18n.t('index.seeAll')}</Text>
              <ArrowRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.languagesContainer}
          >
            {languageProgress
                .slice(0, 4)
                .map((progress) =>
                    (userProfile?.native_language &&
                    progress.language.name_native !== userProfile.native_language.name_native ? (
                        <LanguageCard
                            key={progress.id}
                            progress={progress || null}
                onPress={() => router.push(`/`)}
              />
                    ) : null))}

            {/*<TouchableOpacity*/}
            {/*  style={[styles.addLanguageCard, isDark && styles.addLanguageCardDark]}*/}
            {/*  onPress={() => router.push('/')}*/}
            {/*>*/}
            {/*  <Plus size={24} color={isDark ? Colors.light.text : Colors.dark.text} />*/}
            {/*  <Text style={[styles.addLanguageText, isDark && styles.addLanguageTextDark]}>{i18n.t('index.addNewLanguage')}</Text>*/}
            {/*</TouchableOpacity>*/}
          </ScrollView>
        </View>

        {/* Categories section */}
        {/*<View style={styles.sectionContainer}>*/}
        {/*  <View style={styles.sectionHeader}>*/}
        {/*    <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>{i18n.t('index.categories')}</Text>*/}
        {/*    <TouchableOpacity style={styles.viewAllButton}>*/}
        {/*      <Text style={styles.viewAllText}>{i18n.t('index.seeAll')}</Text>*/}
        {/*      <ArrowRight size={16} color={Colors.primary} />*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*  */}
        {/*  <View style={styles.categoriesGrid}>*/}
        {/*    {categories.map((category) => (*/}
        {/*      <CategoryCard */}
        {/*        key={category.id}*/}
        {/*        category={category}*/}
        {/*        onPress={() => router.push(`/`)}*/}
        {/*      />*/}
        {/*    ))}*/}
        {/*  </View>*/}
        {/*</View>*/}

        {/* Quick Start */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>{i18n.t('index.quickStart')}</Text>

          <TouchableOpacity
            style={[styles.quickStartCard, isDark && styles.quickStartCardDark]}
            onPress={() => router.push('/flashcards/daily')}
          >
            <View style={styles.quickStartContent}>
              <Book size={24} color={Colors.primary} />
              <View style={styles.quickStartTextContainer}>
                <Text style={[styles.quickStartTitle, isDark && styles.quickStartTitleDark]}>{i18n.t('index.dailyWords')}</Text>
                <Text style={[styles.quickStartDescription, isDark && styles.quickStartDescriptionDark]}>
                  {i18n.t('index.practiceNewWords')}
                </Text>
              </View>
            </View>
            <ArrowRight size={20} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
