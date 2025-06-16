import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@/context/ThemeContext';
import {LanguageProgress} from '@/types/progress';
import Colors from '@/constants/Colors';
import {ProgressBar} from './ui/ProgressBar';

interface LanguageCardProps {
  progress: LanguageProgress;
  onPress: () => void;
}

export function LanguageCard({progress, onPress}: LanguageCardProps) {

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  console.log('[LanguageCard]', progress);
  return (
    <TouchableOpacity 
      style={[styles.card, isDark && styles.cardDark]} 
      onPress={onPress}
    >
      {/*<Image */}
      {/*  source={{ uri: language.flagUrl }} */}
      {/*  style={styles.flag} */}
      {/*/>*/}
      <Text style={[styles.name, isDark && styles.nameDark]}>
        {progress.language.name_native}
      </Text>
      <Text style={[styles.level, isDark && styles.levelDark]}>
        Level: {progress.level || 'A1'}
      </Text>
      <View style={styles.progressContainer}>
        <ProgressBar
            progress={progress.learned_words}
          color={Colors.primary}
          backgroundColor={isDark ? Colors.gray[800] : Colors.gray[200]}
          height={6}
        />
        <Text style={[styles.progressText, isDark && styles.progressTextDark]}>
          {Math.round(progress.learned_words * 100)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 180,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: Colors.dark.card,
  },
  flag: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginBottom: 14,
  },
  nameDark: {
    color: Colors.dark.text,
  },
  level: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginBottom: 16,
  },
  levelDark: {
    color: Colors.gray[400],
  },
  progressContainer: {
    marginTop: 'auto',
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[600],
    marginTop: 4,
    textAlign: 'right',
  },
  progressTextDark: {
    color: Colors.gray[400],
  },
});