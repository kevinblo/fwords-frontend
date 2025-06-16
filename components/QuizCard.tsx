import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Quiz } from '@/types/quiz';
import { Clock, HelpCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface QuizCardProps {
  quiz: Quiz;
  onPress: () => void;
}

export function QuizCard({ quiz, onPress }: QuizCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Format completion status icon
  const getCompletionIcon = () => {
    if (!quiz.completed) {
      return <HelpCircle size={20} color={Colors.warning} />;
    }
    
    return quiz.score >= 70 ? (
      <CheckCircle size={20} color={Colors.success} />
    ) : (
      <XCircle size={20} color={Colors.error} />
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.card, isDark && styles.cardDark]} 
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            {quiz.title}
          </Text>
          {getCompletionIcon()}
        </View>
        
        <Text style={[styles.description, isDark && styles.descriptionDark]}>
          {quiz.description}
        </Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Clock size={16} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
            <Text style={[styles.detailText, isDark && styles.detailTextDark]}>
              {quiz.duration} min
            </Text>
          </View>
          
          <View style={styles.detail}>
            <HelpCircle size={16} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
            <Text style={[styles.detailText, isDark && styles.detailTextDark]}>
              {quiz.questionCount} questions
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.arrowContainer}>
        <ArrowRight size={20} color={isDark ? Colors.gray[400] : Colors.gray[600]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardDark: {
    backgroundColor: Colors.dark.card,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  titleDark: {
    color: Colors.dark.text,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginBottom: 8,
  },
  descriptionDark: {
    color: Colors.gray[400],
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[600],
    marginLeft: 4,
  },
  detailTextDark: {
    color: Colors.gray[400],
  },
  arrowContainer: {
    marginLeft: 8,
  },
});