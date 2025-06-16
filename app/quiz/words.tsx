import {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {useTheme} from '@/context/ThemeContext';
import {useActiveLanguage} from '@/context/ActiveLanguageContext';
import {useNativeLanguage} from '@/context/NativeLanguageContext';
import {useLanguageProgress} from '@/context/LanguageProgressContext';
import {createQuizProgress, fetchRandomWords} from '@/api/api';
import {QuizAnswer, QuizDetails} from '@/types/quiz';
import {Word} from '@/types/word';
import {ArrowLeft, CheckCircle2, XCircle} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import {ProgressBar} from '@/components/ui/ProgressBar';
import styles from "@/assets/styles/quizWordsScreen.styles";
import {useTranslation} from '@/i18n/translations/useTranslation';
import wordQuizTranslations from '@/i18n/translations/quizWords';

// Helper function to map user level format to API level format
function mapUserLevelToAPILevel(userLevel: string): string {
  // Based on the API response, the difficulty levels are:
  // elementary, pre_intermediate, intermediate, upper_intermediate, advanced, proficiency
  const levelMapping: { [key: string]: string } = {
    'A1': 'beginner',
    'A2': 'elementary',
    'B1': 'intermediate',
    'B2': 'upper_intermediate',
    'C1': 'advanced',
    'C2': 'proficiency',
  };

  return levelMapping[userLevel] || 'elementary';
}

export default function QuizScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const {t} = useTranslation(wordQuizTranslations);

  // Language contexts
  const {activeLanguageCode, activeLanguageId, isLoading: activeLanguageLoading} = useActiveLanguage();
  const {nativeLanguageCode, nativeLanguageId, isLoading: nativeLanguageLoading} = useNativeLanguage();
  const {getLanguageLevel, isLoading: progressLoading} = useLanguageProgress();

  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [words, setWords] = useState<Word[]>([]); // 20 основных слов
  const [distractorWords, setDistractorWords] = useState<Word[]>([]); // 60 для неправильных ответов
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizWords = async () => {
      // Wait for language contexts to load
      if (activeLanguageLoading || nativeLanguageLoading || progressLoading) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if languages are properly set
        if (!activeLanguageCode || !nativeLanguageCode || !activeLanguageId || !nativeLanguageId) {
          throw new Error(t('setLanguagesError') || 'Set your native and active language in profile');
        }

        if (activeLanguageCode === nativeLanguageCode) {
          throw new Error(t('languagesTheSame') || 'Native and active language can\'t be the same');
        }

        console.log('[Quiz] Using languages:', {
          activeLanguageCode,
          nativeLanguageCode,
          activeLanguageId,
          nativeLanguageId
        });

        // Get user level from the new context
        const userLevel = getLanguageLevel(activeLanguageId);
        const level = mapUserLevelToAPILevel(userLevel);

        console.log('[Quiz] User level:', userLevel, 'API level:', level);

        // Загружаем 20 слов с учетом уровня
        const wordsData = await fetchRandomWords(
            activeLanguageCode,
            nativeLanguageCode,
            level,
            '20'
        );

        if (!wordsData || wordsData.length === 0) {
          throw new Error(t('noWordsAvailable') || 'No words available for quiz');
        }

        console.log('[Quiz] Fetched main words:', wordsData.length);
        setWords(wordsData);

        // Загружаем 60 слов без учета уровня для дистракторов
        const distractorData = await fetchRandomWords(
            activeLanguageCode,
            nativeLanguageCode,
            undefined, // No level filter for distractors
            '60'
        );

        console.log('[Quiz] Fetched distractor words:', distractorData.length);
        setDistractorWords(distractorData);

      } catch (err) {
        console.error('[Quiz] Error loading words:', err);
        setError(err instanceof Error ? err.message : (t('failedToLoadWords') || 'Failed to load quiz words. Please try again.'));
      } finally {
        setLoading(false);
      }
    };

    loadQuizWords();
  }, [activeLanguageLoading, nativeLanguageLoading, progressLoading, activeLanguageCode, nativeLanguageCode, activeLanguageId, nativeLanguageId, getLanguageLevel]);

  useEffect(() => {
    if (words.length === 0 || distractorWords.length === 0) return;

    // Формируем quiz на основе загруженных слов
    // Для уникальности distractor-ответов между вопросами
    const distractorPool = distractorWords
      .map(w => w.translation)
      .filter((t, i, arr) => arr.indexOf(t) === i); // только уникальные переводы

    function getRandomAnswers(correctWord: Word, pool: string[], count: number) {
      // Выбираем случайные переводы из pool, не совпадающие с правильным
      const available = pool.filter(t => t !== correctWord.translation);
      const selected: string[] = [];
      while (selected.length < count - 1 && available.length > 0) {
        const idx = Math.floor(Math.random() * available.length);
        selected.push(available[idx]);
        available.splice(idx, 1);
      }
      const allAnswers = [
        { text: correctWord.translation, isCorrect: true },
        ...selected.map(text => ({ text, isCorrect: false })),
      ].sort(() => Math.random() - 0.5);
      return { answers: allAnswers.map((a, i) => ({ id: `a${i + 1}`, ...a })), used: selected };
    }

    let distractorPoolCopy = [...distractorPool];
    const questions = words.map((word, idx) => {
      const { answers, used } = getRandomAnswers(word, distractorPoolCopy, 4);
      // Удаляем использованные distractor-ответы из пула
      distractorPoolCopy = distractorPoolCopy.filter(t => !used.includes(t));
      return {
        id: `q${idx + 1}`,
        text: `${t('whatIsTranslation')} "${word.original}"?`,
        answers,
      };
    });
    const quizObj = {
      category: "", description: "", difficulty: "", language: "",
      id: 'quiz-from-words',
      title: t('vocabularyQuiz'),
      questions
    };
    setQuiz(quizObj);
    console.log('[DEBUG Quiz] quiz:', quizObj);
  }, [words, distractorWords]);

  const handleAnswerSelect = (answerId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(answerId);
    console.log('[DEBUG Quiz] Selected answer:', answerId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !quiz || isAnswerSubmitted) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedAnswerObj = currentQuestion.answers.find(a => a.id === selectedAnswer);
    console.log('[DEBUG Quiz] Submitting answer:', selectedAnswerObj);
    
    if (selectedAnswerObj && selectedAnswerObj.isCorrect) {
      setScore(prevScore => prevScore + 1);
      console.log('[DEBUG Quiz] Answer is correct');
    } else {
      console.log('[DEBUG Quiz] Answer is incorrect');
    }
    
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      console.log('[DEBUG Quiz] Move to next question:', currentQuestionIndex + 2);
    } else {
      setCompleted(true);

      const a = createQuizProgress(activeLanguageId, quiz.questions.length, score)
      console.log('[DEBUG Quiz] Quiz:', a);
      console.log('[DEBUG Quiz] Quiz completed');
      console.log('[DEBUG Quiz] Quiz percentage:', score);
    }
  };

  if (loading || activeLanguageLoading || nativeLanguageLoading || progressLoading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !quiz) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
          {error || t('failedToLoadQuizDetails')}
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/practice')}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
          <Text style={styles.backButtonText}>{t('goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (completed) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.replace('/practice')}
          >
            <ArrowLeft size={24} color={isDark ? Colors.dark.text : Colors.light.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
            {t('quizResults')}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.resultContainer}>
          <Text style={[styles.resultTitle, isDark && styles.resultTitleDark]}>
            {t('quizCompleted')}
          </Text>
          
          <View style={[styles.scoreCard, isDark && styles.scoreCardDark]}>
            <Text style={[styles.scoreLabel, isDark && styles.scoreLabelDark]}>
              {t('yourScore')}
            </Text>
            <Text style={[styles.scoreValue, isDark && styles.scoreValueDark]}>
              {percentage}%
            </Text>
            <Text style={[styles.scoreDetails, isDark && styles.scoreDetailsDark]}>
              {score} {t('correctOutOf')} {quiz.questions.length} {t('questions')}
            </Text>
            
            <View style={styles.resultProgressBar}>
              <ProgressBar 
                progress={percentage / 10}
                color={percentage >= 70 ? Colors.success : percentage >= 40 ? Colors.warning : Colors.error}
                backgroundColor={isDark ? Colors.gray[800] : Colors.gray[200]}
              />
            </View>
            
            <Text style={[styles.feedbackText, isDark && styles.feedbackTextDark]}>
              {percentage >= 80 ? t('excellentWork') : 
               percentage >= 60 ? t('goodJob') : 
               percentage >= 40 ? t('niceEffort') : 
               t('keepPracticing')}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.finishButton}
            onPress={() => router.replace('/practice')}
          >
            <Text style={styles.finishButtonText}>
              {t('finish')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = completed ? 9 : Math.round(currentQuestionIndex / quiz.questions.length * 90) / 10;
  console.log(progress);
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.replace('/practice')}
        >
          <ArrowLeft size={24} color={isDark ? Colors.dark.text : Colors.light.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          {quiz.title}
        </Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, isDark && styles.progressTextDark]}>
          {t('question')} {currentQuestionIndex + 1} {t('of')} {quiz.questions.length}
        </Text>
        <ProgressBar
          progress={progress}
          color={Colors.primary}
          backgroundColor={isDark ? Colors.gray[800] : Colors.gray[200]}
        />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.questionCard, isDark && styles.questionCardDark]}>
          <Text style={[styles.questionText, isDark && styles.questionTextDark]}>
            {currentQuestion.text}
          </Text>
          
          <View style={styles.answersContainer}>
            {currentQuestion.answers.map((answer: QuizAnswer) => (
              <TouchableOpacity 
                key={answer.id}
                style={[
                  styles.answerButton,
                  isDark && styles.answerButtonDark,
                  selectedAnswer === answer.id && styles.selectedAnswerButton,
                  isDark && selectedAnswer === answer.id && styles.selectedAnswerButtonDark,
                  isAnswerSubmitted && answer.isCorrect && styles.correctAnswerButton,
                  isAnswerSubmitted && selectedAnswer === answer.id && !answer.isCorrect && styles.incorrectAnswerButton,
                ]}
                onPress={() => handleAnswerSelect(answer.id)}
                disabled={isAnswerSubmitted}
              >
                <Text 
                  style={[
                    styles.answerText,
                    isDark && styles.answerTextDark,
                    selectedAnswer === answer.id && styles.selectedAnswerText,
                    isAnswerSubmitted && answer.isCorrect && styles.correctAnswerText,
                    isAnswerSubmitted && selectedAnswer === answer.id && !answer.isCorrect && styles.incorrectAnswerText,
                  ]}
                >
                  {answer.text}
                </Text>
                
                {isAnswerSubmitted && answer.isCorrect && (
                  <CheckCircle2 size={20} color={Colors.success} />
                )}
                
                {isAnswerSubmitted && selectedAnswer === answer.id && !answer.isCorrect && (
                  <XCircle size={20} color={Colors.error} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.actionsContainer}>
        {!isAnswerSubmitted ? (
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!selectedAnswer) && styles.disabledButton
            ]}
            onPress={handleSubmitAnswer}
            disabled={!selectedAnswer}
          >
            <Text style={styles.submitButtonText}>
              {t('submitAnswer')}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < quiz.questions.length - 1 ? t('nextQuestion') : t('seeResults')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
