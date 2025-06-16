import {Language} from './language'

export interface WordDetails {
  id: string;
  original: string;
  translation: string;
  transcription: string;
  audioUrl?: string;
  example?: string;
  category: string;
  level: string;
}

export interface PartOfSpeech {
  id: number;
  code: string;
  name: string;
  abbreviation: string;
}

export interface Translation {
  id: number;
  word: string;
  language: Language;
  transcription: string;
  part_of_speech: PartOfSpeech;
  gender: string | null;
  gender_display: string | null;
  difficulty_level: string;
  difficulty_level_display: string;
  audio_url: string;
  active: boolean;
  examples: any[];
  confidence: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface WordFromAPI {
  id: number;
  word: string;
  language: Language;
  transcription: string;
  part_of_speech: PartOfSpeech;
  gender: string | null;
  gender_display: string | null;
  difficulty_level: string;
  difficulty_level_display: string;
  audio_url: string;
  active: boolean;
  examples: any[];
  translation: Translation;
  created_at: string;
  updated_at: string;
}

export interface RandomWordsResponse {
  words: WordFromAPI[];
  total_available: number;
  requested_count: number;
  returned_count: number;
  source_language: string;
  target_language: string;
  difficulty_level: string | null;
}

export interface Word {
  id: number;
  original: string;
  translation: string;
  transcription?: string;
  audio_url?: string;
  part_of_speech: string;
  part_of_speech_translated: string;
  level?: string;
  example?: string;
  created_at?: string;
  source_language?: number;
  target_language?: number;
}