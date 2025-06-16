import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { fetchUserProgress } from '@/api/api';
import { UserProgress } from '@/types/progress';
import { BarChart3, TrendingUp, Calendar, Clock, Award } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Header } from '@/components/ui/Header';
import { ProgressChart } from '@/components/ProgressChart';
import { LanguageProgressCard } from '@/components/LanguageProgressCard';

export default function ProgressScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        const progressData = await fetchUserProgress();
        setUserProgress(progressData);
      } catch (err) {
        setError('Failed to load progress data. Please try again.');
        console.error('Error loading progress data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProgress();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDark && styles.loadingContainerDark]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleTimeFrameChange = (newTimeFrame: 'week' | 'month' | 'year') => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Header title="Progress" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {/* Overview Card */}
            <View style={[styles.overviewCard, isDark && styles.overviewCardDark]}>
              <View style={styles.overviewHeader}>
                <Text style={[styles.overviewTitle, isDark && styles.overviewTitleDark]}>
                  Learning Overview
                </Text>
                <Award size={20} color={Colors.primary} />
              </View>
              
              <View style={styles.statsContent}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                    {userProgress?.totalWordsLearned || 0}
                  </Text>
                  <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Words Learned</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                    {userProgress?.totalPhrasesLearned || 0}
                  </Text>
                  <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Phrases Learned</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                    {userProgress?.streakDays || 0}
                  </Text>
                  <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Day Streak</Text>
                </View>
              </View>
            </View>
            
            {/* Activity Chart */}
            <View style={styles.chartContainer}>
              <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                Learning Activity
              </Text>
              
              <View style={styles.timeFrameSelector}>
                <TouchableOpacity 
                  style={[
                    styles.timeFrameButton, 
                    timeFrame === 'week' && styles.timeFrameButtonActive
                  ]}
                  onPress={() => handleTimeFrameChange('week')}
                >
                  <Text style={[
                    styles.timeFrameText,
                    timeFrame === 'week' && styles.timeFrameTextActive
                  ]}>Week</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.timeFrameButton, 
                    timeFrame === 'month' && styles.timeFrameButtonActive
                  ]}
                  onPress={() => handleTimeFrameChange('month')}
                >
                  <Text style={[
                    styles.timeFrameText,
                    timeFrame === 'month' && styles.timeFrameTextActive
                  ]}>Month</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.timeFrameButton, 
                    timeFrame === 'year' && styles.timeFrameButtonActive
                  ]}
                  onPress={() => handleTimeFrameChange('year')}
                >
                  <Text style={[
                    styles.timeFrameText,
                    timeFrame === 'year' && styles.timeFrameTextActive
                  ]}>Year</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.chartCard, isDark && styles.chartCardDark]}>
                <ProgressChart timeFrame={timeFrame} isDark={isDark} />
              </View>
            </View>
            
            {/* Languages Progress */}
            <View style={styles.languagesContainer}>
              <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                Languages Progress
              </Text>
              
              {userProgress && userProgress.languages ? (
                Object.entries(userProgress.languages).map(([id, data]) => (
                  <LanguageProgressCard 
                    key={id}
                    id={id}
                    name={data.name}
                    progress={data.progress}
                    wordsLearned={data.wordsLearned}
                    phrasesLearned={data.phrasesLearned}
                    lastPracticed={data.lastPracticed}
                    isDark={isDark}
                  />
                ))
              ) : (
                <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                  No language progress data available.
                </Text>
              )}
            </View>
            
            {/* Learning Stats */}
            <View style={[styles.statsCard, isDark && styles.statsCardDark]}>
              <Text style={[styles.statsTitle, isDark && styles.statsTitleDark]}>
                Learning Stats
              </Text>
              
              <View style={styles.statRow}>
                <View style={styles.statRowIcon}>
                  <Clock size={20} color={isDark ? Colors.accent : Colors.primary} />
                </View>
                <View style={styles.statRowContent}>
                  <Text style={[styles.statRowLabel, isDark && styles.statRowLabelDark]}>
                    Total Time Spent
                  </Text>
                  <Text style={[styles.statRowValue, isDark && styles.statRowValueDark]}>
                    {userProgress?.totalMinutesLearned || 0} minutes
                  </Text>
                </View>
              </View>
              
              <View style={styles.statRow}>
                <View style={styles.statRowIcon}>
                  <Calendar size={20} color={isDark ? Colors.accent : Colors.primary} />
                </View>
                <View style={styles.statRowContent}>
                  <Text style={[styles.statRowLabel, isDark && styles.statRowLabelDark]}>
                    Active Days
                  </Text>
                  <Text style={[styles.statRowValue, isDark && styles.statRowValueDark]}>
                    {userProgress?.activeDays || 0} days
                  </Text>
                </View>
              </View>
              
              <View style={styles.statRow}>
                <View style={styles.statRowIcon}>
                  <TrendingUp size={20} color={isDark ? Colors.accent : Colors.primary} />
                </View>
                <View style={styles.statRowContent}>
                  <Text style={[styles.statRowLabel, isDark && styles.statRowLabelDark]}>
                    Completion Rate
                  </Text>
                  <Text style={[styles.statRowValue, isDark && styles.statRowValueDark]}>
                    {userProgress?.completionRate || 0}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.statRow}>
                <View style={styles.statRowIcon}>
                  <BarChart3 size={20} color={isDark ? Colors.accent : Colors.primary} />
                </View>
                <View style={styles.statRowContent}>
                  <Text style={[styles.statRowLabel, isDark && styles.statRowLabelDark]}>
                    Average Score
                  </Text>
                  <Text style={[styles.statRowValue, isDark && styles.statRowValueDark]}>
                    {userProgress?.averageScore || 0}%
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  containerDark: {
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 100, // Add space for the header
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingContainerDark: {
    backgroundColor: Colors.dark.background,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginVertical: 20,
  },
  overviewCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewCardDark: {
    backgroundColor: Colors.dark.card,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  overviewTitleDark: {
    color: Colors.dark.text,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statValueDark: {
    color: Colors.accent,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    textAlign: 'center',
  },
  statLabelDark: {
    color: Colors.gray[400],
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray[300],
    marginHorizontal: 8,
  },
  chartContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: Colors.dark.text,
  },
  timeFrameSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeFrameButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.gray[200],
  },
  timeFrameButtonActive: {
    backgroundColor: Colors.primary,
  },
  timeFrameText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[600],
  },
  timeFrameTextActive: {
    color: '#FFFFFF',
  },
  chartCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    height: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  chartCardDark: {
    backgroundColor: Colors.dark.card,
  },
  languagesContainer: {
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyTextDark: {
    color: Colors.gray[400],
  },
  statsCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsCardDark: {
    backgroundColor: Colors.dark.card,
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  statsTitleDark: {
    color: Colors.dark.text,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statRowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statRowContent: {
    flex: 1,
  },
  statRowLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginBottom: 4,
  },
  statRowLabelDark: {
    color: Colors.gray[400],
  },
  statRowValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  statRowValueDark: {
    color: Colors.dark.text,
  },
});