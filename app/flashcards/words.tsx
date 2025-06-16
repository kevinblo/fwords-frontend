import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Animated, Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {useTheme} from '@/context/ThemeContext';
import {useAuth} from '@/context/AuthContext';
import {useActiveLanguage} from '@/context/ActiveLanguageContext';
import {useNativeLanguage} from '@/context/NativeLanguageContext';
import {useLanguageProgress} from '@/context/LanguageProgressContext';
import {createWordProgress, fetchRandomWords, getWordProgress, updateWordProgress} from '@/api/api';
import {WordProgress, WordProgressStatus} from '@/types/progress';
import {Word} from '@/types/word';
import {ArrowLeft, Check, RotateCcw, Volume2, X} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import styles from "@/assets/styles/flashCardScreen.styles";
import {useTranslation} from '@/i18n/translations/useTranslation';
import flashcardsWordsScreenTranslations from '@/i18n/translations/flashcardsWordsScreen';
import {Audio} from 'expo-av';

// Вспомогательная функция для вычисления следующей даты повторения с новой схемой API
function getNextReviewDate(progress: WordProgress | null, correct: boolean) {
  const now = new Date();
  let intervalDays = progress?.interval ?? 0;

  if (correct) {
    // Если правильно, увеличиваем интервал по схеме spaced repetition
    if (intervalDays === 0) {
      intervalDays = 1; // Первый правильный ответ - повтор через день
    } else if (intervalDays === 1) {
      intervalDays = 3; // Второй правильный ответ - повтор через 3 дня
    } else if (intervalDays === 3) {
      intervalDays = 7; // Третий правильный ответ - повтор через неделю
    } else if (intervalDays === 7) {
      intervalDays = 14; // Четвертый правильный ответ - повтор через 2 недели
    } else {
      intervalDays = Math.min(intervalDays * 2, 90); // Удваиваем интервал, но не больше 90 дней
    }
  } else {
    // Если ошибка — сбрасываем интервал
    intervalDays = 0;
  }

  let nextDate = new Date(now);
  if (intervalDays === 0) {
    // Для неправильных ответов - повтор через 10 минут
    nextDate.setMinutes(now.getMinutes() + 10);
  } else {
    nextDate.setDate(now.getDate() + intervalDays);
  }

  return {nextDate, intervalDays};
}

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

export default function FlashcardScreen() {
  const { theme } = useTheme();
  const {user} = useAuth();
  const isDark = theme === 'dark';
  const { t, language } = useTranslation(flashcardsWordsScreenTranslations);

  // Debug: log current interface language
  useEffect(() => {
    console.log('[Flashcards] Current interface language:', language);
  }, [language]);

  // Language contexts
  const {activeLanguageCode, activeLanguageId, isLoading: activeLanguageLoading} = useActiveLanguage();
  const {nativeLanguageCode, nativeLanguageId, isLoading: nativeLanguageLoading} = useNativeLanguage();
  const {getLanguageLevel, isLoading: progressLoading} = useLanguageProgress();

  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const loadWords = async () => {
      // Wait for language contexts to load
      if (activeLanguageLoading || nativeLanguageLoading || progressLoading) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if languages are properly set
        if (!activeLanguageCode || !nativeLanguageCode || !activeLanguageId || !nativeLanguageId) {
          throw new Error(t('setLanguagesError'));
        }

        if (activeLanguageCode === nativeLanguageCode) {
          throw new Error(t('languagesTheSame') || 'Native and active language can\'t be the same');
        }

        console.log('[FlashCards] Using languages:', {
          activeLanguageCode,
          nativeLanguageCode,
          activeLanguageId,
          nativeLanguageId
        });

        // Get user level from the new context
        const userLevel = getLanguageLevel(activeLanguageId);
        const level = mapUserLevelToAPILevel(userLevel);

        console.log('[FlashCards] User level:', userLevel, 'API level:', level);

        const wordsData = await fetchRandomWords(
            activeLanguageCode,
            nativeLanguageCode,
            level,
            '20' // Request 20 words
        );

        if (!wordsData || wordsData.length === 0) {
          throw new Error(t('noWordsAvailable'));
        }

        console.log('[FlashCards] Fetched words:', wordsData.length);
        console.log('[FlashCards] First word sample:', wordsData[0]);

        // Фильтрация слов по дате следующего повторения
        const now = new Date();
        const filteredWords = wordsData.filter((word: any) => {
          if (word.next_review) {
            const nextReviewDate = new Date(word.next_review);
            return nextReviewDate <= now;
          }
          return true; // Новое слово — показываем сразу
        });

        console.log('[FlashCards] Filtered words:', filteredWords.length);

        if (filteredWords.length === 0) {
          console.log('[FlashCards] No words available for review, using all words');
          setWords(wordsData);
        } else {
          setWords(filteredWords);
        }
        setCurrentWordIndex(0);
      } catch (err) {
        console.error('[FlashCards] Error loading words:', err);
        setError(err instanceof Error ? err.message : t('failedToLoadWords'));
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, [activeLanguageLoading, nativeLanguageLoading, progressLoading, activeLanguageCode, nativeLanguageCode, activeLanguageId, nativeLanguageId, getLanguageLevel]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: false,
        });
      } catch (error) {
        console.error('[updateOrCreateWordProgress] Error:', error);
      }
    };
    configureAudio();
  }, []);

  const currentWord = words[currentWordIndex] || null;

  const flipCard = () => {
    setShowTranslation(!showTranslation);
    Animated.spring(flipAnim, {
      toValue: showTranslation ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const playAudio = async () => {
    if (!currentWord?.audio_url || isPlayingAudio) {
      return;
    }

    try {
      setIsPlayingAudio(true);

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const audioPath = require.context('../../audio', false, /\.mp3$/);
      const audioFile = audioPath(`./${currentWord.audio_url}`);

      const { sound } = await Audio.Sound.createAsync(audioFile);
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlayingAudio(false);
        }
      });

      await sound.playAsync();
    } catch (error) {
      setIsPlayingAudio(false);
      Alert.alert(
          'Audio Error',
          'Unable to play audio for this word.',
          [{ text: 'OK' }]
      );
    }
  };

  const moveToNextWord = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsPlayingAudio(false);
      } catch (error) {
        console.error('[updateOrCreateWordProgress] Error:', error);
      }
    }

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowTranslation(false);
      flipAnim.setValue(0);
    } else {
      router.replace('//practice');
    }
  };

  // Обновлённая функция для интервального повторения с новой схемой API
  const updateOrCreateWordProgress = async (wordId: number, correct: boolean) => {
    try {
      console.log('[updateOrCreateWordProgress] Raw language IDs from context:', {
        activeLanguageId,
        activeLanguageIdType: typeof activeLanguageId,
        nativeLanguageId,
        nativeLanguageIdType: typeof nativeLanguageId
      });

      // Validate and convert language IDs to numbers
      const activeId = typeof activeLanguageId === 'number' ? activeLanguageId : parseInt(String(activeLanguageId));
      const nativeId = typeof nativeLanguageId === 'number' ? nativeLanguageId : parseInt(String(nativeLanguageId));

      if (!activeId || isNaN(activeId) || !nativeId || isNaN(nativeId)) {
        console.error('[updateOrCreateWordProgress] Invalid language IDs after conversion:', {
          activeId,
          nativeId,
          originalActiveLanguageId: activeLanguageId,
          originalNativeLanguageId: nativeLanguageId
        });
        return;
      }

      console.log('[updateOrCreateWordProgress] Converted language IDs:', {
        activeId,
        nativeId
      });

      const progress = await getWordProgress(wordId);
      const {nextDate, intervalDays} = getNextReviewDate(progress, correct);

      console.log('[FlashCards] Current progress:', progress);
      console.log('[FlashCards] Next review date:', nextDate.toISOString());
      console.log('[FlashCards] Interval days:', intervalDays);
      console.log('[FlashCards] Language IDs:', {
        wordLanguage: activeId,
        targetLanguage: nativeId
      });

      if (progress) {
        // Update existing progress with improved status progression
        let newStatus: WordProgressStatus;
        if (correct) {
          // Progression: new -> learning -> learned -> mastered
          if (intervalDays >= 30) {
            newStatus = 'mastered';
          } else if (intervalDays >= 7) {
            newStatus = 'learned';
          } else {
            newStatus = 'learning';
          }
        } else {
          // If incorrect, keep current status or set to learning if it was higher
          if (progress.status === 'mastered' || progress.status === 'learned') {
            newStatus = 'learning';
          } else {
            newStatus = 'new';
          }
        }

        const updates: any = {
          status: newStatus,
          interval: intervalDays,
          next_review: nextDate.toISOString(),
          review_count: (progress.review_count || 0) + 1,
          correct_count: (progress.correct_count || 0) + (correct ? 1 : 0),
        };

        if (correct && (newStatus === 'learned' || newStatus === 'mastered')) {
          updates.date_learned = new Date().toISOString().split('T')[0];
        }

        // We need to find the progress ID, not word_id for the update
        // The progress should have an ID field for the update
        if (!progress.id) {
          console.error('[updateOrCreateWordProgress] Progress record missing ID:', progress);
          throw new Error('Progress record missing ID for update');
        }
        
        console.log('[FlashCards] Updating progress with ID:', progress.id);
        await updateWordProgress(progress.id, updates);
      } else {
        // Create new progress
        // Target language should be the native language (language we're learning TO)
        let status: WordProgressStatus;
        if (correct) {
          // For new words, start progression based on interval
          if (intervalDays >= 30) {
            status = 'mastered';
          } else if (intervalDays >= 7) {
            status = 'learned';
          } else if (intervalDays >= 1) {
            status = 'learning';
          } else {
            status = 'new';
          }
        } else {
          status = 'new';
        }
        
        // Ensure status is never empty
        if (!status || status.trim() === '') {
          status = 'new';
        }

        // Validate parameters before sending
        console.log('[FlashCards] Pre-validation values:', {
          wordId: wordId,
          wordIdType: typeof wordId,
          nativeId: nativeId,
          nativeIdType: typeof nativeId,
          status: status,
          statusType: typeof status,
          intervalDays: intervalDays,
          intervalDaysType: typeof intervalDays,
          correct: correct,
          nextDate: nextDate.toISOString()
        });

        if (!wordId || typeof wordId !== 'number') {
          throw new Error(`Invalid wordId: ${wordId} (type: ${typeof wordId})`);
        }
        if (!nativeId || typeof nativeId !== 'number') {
          throw new Error(`Invalid nativeId: ${nativeId} (type: ${typeof nativeId})`);
        }
        if (!status || typeof status !== 'string' || status.trim() === '') {
          throw new Error(`Invalid status: "${status}" (type: ${typeof status})`);
        }

        console.log('[FlashCards] Creating new word progress with validated params:', {
          wordId,
          activeId,
          status,
          intervalDays,
          nextReview: nextDate.toISOString()
        });

        await createWordProgress(
            wordId,
            activeId, // Use converted native language ID as target language
            status,
            intervalDays,
            nextDate.toISOString()
        );
      }
    } catch (error) {
      console.error('[updateOrCreateWordProgress] Error:', error);
    }
  };

  const handleKnown = async () => {
    if (currentWord?.id) {
      await updateOrCreateWordProgress(currentWord.id, true);
    }
    moveToNextWord();
  };

  const handleUnknown = async () => {
    if (currentWord?.id) {
      await updateOrCreateWordProgress(currentWord.id, false);
    }
    moveToNextWord();
  };

  const frontFlipStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        })
      }
    ],
  };

  const backFlipStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        })
      }
    ],
  };

  if (loading || activeLanguageLoading || nativeLanguageLoading) {
    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );
  }

  if (error || !currentWord) {
    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            {error || t('failedToLoadWordDetails')}
          </Text>
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                router.replace('/practice');
              }}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>{t('goBack')}</Text>
          </TouchableOpacity>
        </View>
    );
  }

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
            {t('flashcard')}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.cardContainer}>
          {/* Front of card (word) */}
          <Animated.View
              style={[
                styles.card,
                styles.cardFront,
                isDark && styles.cardFrontDark,
                frontFlipStyle,
                { opacity: flipAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0, 0],
                  })
                }
              ]}
          >
            <TouchableOpacity
                style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                onPress={flipCard}
                activeOpacity={0.8}
            >
              <Text style={[styles.originalWord, isDark && styles.originalWordDark]}>
                {currentWord.original}
              </Text>
              <Text style={[styles.transcription, isDark && styles.transcriptionDark]}>
                ({currentWord.part_of_speech})
              </Text>
              <Text style={[styles.transcription, isDark && styles.transcriptionDark]}>
                {currentWord.transcription}
              </Text>
              <TouchableOpacity
                  style={[styles.audioButton, isPlayingAudio && { opacity: 0.6 }]}
                  onPress={(e) => {
                    e.stopPropagation();
                    playAudio();
                  }}
                  disabled={isPlayingAudio || !currentWord.audio_url}
              >
                {isPlayingAudio ? (
                    <ActivityIndicator size="small" color={isDark ? Colors.accent : Colors.primary} />
                ) : (
                    <Volume2 size={24} color={isDark ? Colors.accent : Colors.primary} />
                )}
              </TouchableOpacity>
              <Text style={[styles.tapHint, isDark && styles.tapHintDark]}>
                {t('tapToSeeTranslation')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.flipButton, isDark && styles.flipButtonDark]}
                onPress={flipCard}
            >
              <RotateCcw size={20} color={isDark ? Colors.accent : Colors.primary} />
            </TouchableOpacity>
          </Animated.View>

          {/* Back of card (translation) */}
          <Animated.View
              style={[
                styles.card,
                styles.cardBack,
                isDark && styles.cardBackDark,
                backFlipStyle,
                { opacity: flipAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, 1],
                  })
                }
              ]}
          >
            <TouchableOpacity
                style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                onPress={flipCard}
                activeOpacity={0.8}
            >
              <Text style={[styles.translationTitle, isDark && styles.translationTitleDark]}>
                {t('translation')}
              </Text>
              <Text style={[styles.translationText, isDark && styles.translationTextDark]}>
                {currentWord.translation}
              </Text>
              <Text style={[styles.transcription, isDark && styles.transcriptionDark]}>
                ({currentWord.part_of_speech_translated})
              </Text>
             {currentWord.example && (
                  <View style={styles.exampleContainer}>
                    <Text style={[styles.exampleTitle, isDark && styles.exampleTitleDark]}>
                      {t('example')}
                    </Text>
                    <Text style={[styles.exampleText, isDark && styles.exampleTextDark]}>
                      {currentWord.example}
                    </Text>
                  </View>
              )}
              <Text style={[styles.tapHint, isDark && styles.tapHintDark]}>
                {t('tapToSeeOriginal')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.flipButton, isDark && styles.flipButtonDark]}
                onPress={flipCard}
            >
              <RotateCcw size={20} color={isDark ? Colors.accent : Colors.primary} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
              style={[styles.actionButton, styles.unknownButton]}
              onPress={handleUnknown}
          >
            <X size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>{t('dontKnow')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.actionButton, styles.knownButton]}
              onPress={handleKnown}
          >
            <Check size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>{t('know')}</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}