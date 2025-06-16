import {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {useTheme} from '@/context/ThemeContext';
import {fetchQuizProgressByLanguage} from '@/api/api';
import {BrainCircuit, Dumbbell, Trophy} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import {Header} from '@/components/ui/Header';
import styles from '@/assets/styles/practiceScreen.styles'
import i18n from '@/i18n';
import {QuizProgressStats} from "@/types/progress";
import {useActiveLanguage} from '@/context/ActiveLanguageContext';


export default function PracticeScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const {activeLanguageCode} = useActiveLanguage();

  const initialProgress: QuizProgressStats = {
    language: null,
    total_questions: 0,
    average_accuracy: 0,
    quiz_count: 0
  }

  const [quizProgress, setquizProgress] = useState<QuizProgressStats | null>(initialProgress);

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 90) return Colors.success;     // Зелёный
    if (accuracy >= 70) return Colors.accent;      // Жёлтый/оранжевый
    if (accuracy >= 40) return Colors.warning;     // Светло-оранжевый
    return Colors.error;                           // Красный
  };

  useEffect(() => {
    const loadQuizProgress = async () => {
      try {
        setLoading(true);
        const progressArray = await fetchQuizProgressByLanguage(activeLanguageCode);
        setquizProgress(progressArray[0] || initialProgress); // ✅ берём только первый объект
      } catch (err) {
        console.error('[DEBUG Practice] Error loading quizProgress:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuizProgress();
  }, [activeLanguageCode]);


  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDark && styles.loadingContainerDark]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!quizProgress) {
    return null;
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title={i18n.t('practice.title')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Practice Words */}
        <View style={styles.modeContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>{i18n.t('practice.words')}</Text>

          <View style={styles.modesGrid}>
            <TouchableOpacity
              style={[styles.modeCard, isDark && styles.modeCardDark]}
              onPress={() => router.push('/flashcards/words')}
            >
              <View style={[styles.modeIconContainer, { backgroundColor: Colors.primary + '20' }]}>
                <BrainCircuit size={24} color={Colors.primary} />
              </View>
              <Text style={[styles.modeTitle, isDark && styles.modeTitleDark]}>{i18n.t('practice.flashcards')}</Text>
              <Text style={[styles.modeDescription, isDark && styles.modeDescriptionDark]}>
                {i18n.t('practice.flashcardsDescription')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeCard, isDark && styles.modeCardDark]}
              onPress={() => router.push('/quiz/words')}
            >
              <View style={[styles.modeIconContainer, { backgroundColor: Colors.accent + '20' }]}>
                <Dumbbell size={24} color={Colors.accent} />
              </View>
              <Text style={[styles.modeTitle, isDark && styles.modeTitleDark]}>{i18n.t('practice.quiz')}</Text>
              <Text style={[styles.modeDescription, isDark && styles.modeDescriptionDark]}>
                {i18n.t('practice.quizDescription')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeCard, isDark && styles.modeCardDark]}
              onPress={() => router.push('/practice')}
            >
              <View style={[styles.modeIconContainer, { backgroundColor: Colors.success + '20' }]}>
                <Trophy size={24} color={Colors.success} />
              </View>
              <Text style={[styles.modeTitle, isDark && styles.modeTitleDark]}>{i18n.t('practice.challenge')}</Text>
              <Text style={[styles.modeDescription, isDark && styles.modeDescriptionDark]}>
                {i18n.t('practice.challengeDescription')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Practice Phrases */}
        {/*<View style={styles.modeContainer}>*/}
        {/*  <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>{i18n.t('practice.phrases')}</Text>*/}

        {/*  <View style={styles.modesGrid}>*/}
        {/*    <TouchableOpacity*/}
        {/*      style={[styles.modeCard, isDark && styles.modeCardDark]}*/}
        {/*      onPress={() => router.push('/practice')}*/}
        {/*    >*/}
        {/*      <View style={[styles.modeIconContainer, { backgroundColor: Colors.primary + '20' }]}>*/}
        {/*        <BrainCircuit size={24} color={Colors.primary} />*/}
        {/*      </View>*/}
        {/*      <Text style={[styles.modeTitle, isDark && styles.modeTitleDark]}>{i18n.t('practice.flashcards')}</Text>*/}
        {/*      <Text style={[styles.modeDescription, isDark && styles.modeDescriptionDark]}>*/}
        {/*        {i18n.t('practice.flashcardsDescription')}*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}

        {/*    <TouchableOpacity*/}
        {/*      style={[styles.modeCard, isDark && styles.modeCardDark]}*/}
        {/*      onPress={() => router.push('/practice')}*/}
        {/*    >*/}
        {/*      <View style={[styles.modeIconContainer, { backgroundColor: Colors.accent + '20' }]}>*/}
        {/*        <Dumbbell size={24} color={Colors.accent} />*/}
        {/*      </View>*/}
        {/*      <Text style={[styles.modeTitle, isDark && styles.modeTitleDark]}>{i18n.t('practice.quiz')}</Text>*/}
        {/*      <Text style={[styles.modeDescription, isDark && styles.modeDescriptionDark]}>*/}
        {/*        {i18n.t('practice.quizDescription')}*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}

        {/*    <TouchableOpacity*/}
        {/*      style={[styles.modeCard, isDark && styles.modeCardDark]}*/}
        {/*      onPress={() => router.push('/practice')}*/}
        {/*    >*/}
        {/*      <View style={[styles.modeIconContainer, { backgroundColor: Colors.success + '20' }]}>*/}
        {/*        <Trophy size={24} color={Colors.success} />*/}
        {/*      </View>*/}
        {/*      <Text style={[styles.modeTitle, isDark && styles.modeTitleDark]}>{i18n.t('practice.challenge')}</Text>*/}
        {/*      <Text style={[styles.modeDescription, isDark && styles.modeDescriptionDark]}>*/}
        {/*        {i18n.t('practice.challengeDescription')}*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*</View>*/}

        {/* Recent Quizzes */}
        {/*<View style={styles.quizzesContainer}>*/}
        {/*  <View style={styles.sectionHeader}>*/}
        {/*    <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>{i18n.t('practice.recentQuizzes')}</Text>*/}
        {/*    <TouchableOpacity style={styles.viewAllButton}>*/}
        {/*      <Text style={styles.viewAllText}>{i18n.t('practice.seeAll')}</Text>*/}
        {/*      <ArrowRight size={16} color={Colors.primary} />*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*  */}
        {/*  {error ? (*/}
        {/*    <Text style={styles.errorText}>{error}</Text>*/}
        {/*  ) : (*/}
        {/*    <View>*/}
        {/*      {quizzes.map((quiz) => (*/}
        {/*        <QuizCard */}
        {/*          key={quiz.id}*/}
        {/*          quiz={quiz}*/}
        {/*          onPress={() => router.push(`/quiz/${quiz.id}`)}*/}
        {/*        />*/}
        {/*      ))}*/}
        {/*    </View>*/}
        {/*  )}*/}
        {/*</View>*/}

        {/* Practice Stats */}
        <View style={[styles.statsCard, isDark && styles.statsCardDark]}>
          <Text style={[styles.statsTitle, isDark && styles.statsTitleDark]}>{i18n.t('practice.yourPracticeStats')}</Text>

          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.statValueDark]}>{quizProgress.quiz_count}</Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>{i18n.t('practice.quizzesCompleted')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text
                  style={[
                    styles.statValue,
                    isDark && styles.statValueDark,
                    { color: getAccuracyColor(quizProgress.average_accuracy) }  // 🔥 цвет по значению
                  ]}
              >
                {quizProgress.average_accuracy}%
              </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                {i18n.t('practice.avgScore')}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.statValueDark]}>{quizProgress.total_questions}</Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>{i18n.t('practice.totalQuestions')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}