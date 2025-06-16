import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { ProgressBar } from './ui/ProgressBar';

interface LanguageProgressCardProps {
  id: string;
  name: string;
  progress: number;
  wordsLearned: number;
  phrasesLearned: number;
  lastPracticed: string;
  isDark: boolean;
}

export function LanguageProgressCard({ 
  id, 
  name, 
  progress, 
  wordsLearned, 
  phrasesLearned, 
  lastPracticed,
  isDark 
}: LanguageProgressCardProps) {
  
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <View style={styles.header}>
        <Text style={[styles.name, isDark && styles.nameDark]}>
          {name}
        </Text>
        <View style={styles.lastPracticedContainer}>
          <Clock size={14} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
          <Text style={[styles.lastPracticedText, isDark && styles.lastPracticedTextDark]}>
            Last: {formatDate(lastPracticed)}
          </Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelContainer}>
          <Text style={[styles.progressLabel, isDark && styles.progressLabelDark]}>
            Overall Progress
          </Text>
          <Text style={[styles.progressPercentage, isDark && styles.progressPercentageDark]}>
            {Math.round(progress * 100)}%
          </Text>
        </View>
        <ProgressBar 
          progress={progress}
          color={progress > 0.7 ? Colors.success : progress > 0.4 ? Colors.primary : Colors.warning}
          backgroundColor={isDark ? Colors.gray[800] : Colors.gray[200]}
        />
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>
            {wordsLearned}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
            Words
          </Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>
            {phrasesLearned}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
            Phrases
          </Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>
            {wordsLearned + phrasesLearned}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
            Total
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardDark: {
    backgroundColor: Colors.dark.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  nameDark: {
    color: Colors.dark.text,
  },
  lastPracticedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastPracticedText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginLeft: 4,
  },
  lastPracticedTextDark: {
    color: Colors.gray[400],
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[700],
  },
  progressLabelDark: {
    color: Colors.gray[300],
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  progressPercentageDark: {
    color: Colors.accent,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  statValueDark: {
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
  },
  statLabelDark: {
    color: Colors.gray[400],
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.gray[300],
    marginHorizontal: 8,
  },
});