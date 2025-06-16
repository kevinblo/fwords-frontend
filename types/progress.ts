import {Language} from '@/types/language';

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LanguageProgress {
  id: number;
  language: Language;
  level: LanguageLevel;
  learned_words: number;
  learned_phrases: number;
  updated_at: string;
  created_at: string;
}

export interface LanguageProgressResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LanguageProgress[];
}

export type WordProgressStatus = 'new' | 'learning' | 'learned' | 'mastered';

export interface WordProgress {
  id: number;
  word_id: number;
  target_language: Language;
  target_language_id: number;
  status: WordProgressStatus;
  interval: number; // Интервал повторения в днях
  next_review: string | null; // Дата следующего повторения (ISO date-time)
  review_count: number; // Количество повторений
  correct_count: number; // Количество правильных ответов
  date_learned: string | null; // Дата изучения (ISO date)
}

export interface WordProgressResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WordProgress[];
}

export interface UserProgress {
  totalWordsLearned: number;
  totalPhrasesLearned: number;
  streakDays: number;
  activeDays: number;
  totalMinutesLearned: number;
  completionRate: number;
  averageScore: number;
  languages: {
    [key: string]: LanguageProgress;
  };
}

export interface WordsStatsDaily {
  date: string;
  new: number;
  learning: number;
  learned: number;
  mastered: number;
  total: number;
}

export interface WordsStatsLanguageBreakdown {
  language_code: string;
  language_name: string;
  new_count: number;
  learning_count: number;
  learned_count: number;
  mastered_count: number;
  total_count: number;
}

export interface WordsStats {
  period: string;
  start_date: string;
  end_date: string;
  words_new: number;
  words_learning: number;
  words_learned: number;
  words_mastered: number;
  total_words: number;
  daily_breakdown: WordsStatsDaily[];
  language_breakdown: WordsStatsLanguageBreakdown[];
}

export interface QuizProgressPost {
  language_id: number;
  total_questions: number;
  correct_answers: number;
}

export interface QuizProgress {
  id: number;
  language: Language;
  total_questions: number;
  correct_answers: number;
  accuracy_percentage: number;
  updated_at: string;
  created_at: string;
}

export interface QuizzesProgressResponse {
  count: number;
  next: string | null;
  previous: string | null;
  result: QuizProgress[];
}

export interface QuizProgressStats {
  language: Language | null;
  total_questions: number;
  average_accuracy: number;
  quiz_count: number;
}

