import AsyncStorage from '@react-native-async-storage/async-storage';
import {Language} from '@/types/language';
import {LanguageLevel, LanguageProgress, LanguageProgressResponse, QuizProgress, QuizProgressStats, WordProgress, WordProgressResponse, WordProgressStatus, WordsStats} from '@/types/progress';
import {RandomWordsResponse, Word, WordDetails, WordFromAPI} from '@/types/word';
import {User} from '@/types/user';

// const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || 'https://lbook.ru/api/v1';
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Helper function to get auth header
async function getAuthHeader() {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('DEBUG] API URL: ' + API_BASE_URL);
  console.log('[DEBUG] getAuthHeader: accessToken =', token);
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Generic API request function with auth
class TokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

async function apiRequest<T>(endpoint: string, options = {}): Promise<T> {
  const headers = await getAuthHeader();
  console.log('[DEBUG] apiRequest: endpoint =', endpoint);
  console.log('[DEBUG] apiRequest: headers =', headers);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  console.log('[DEBUG] apiRequest: response.status =', response.status);
  if (!response.ok) {
    const responseText = await response.text();
    console.log('[DEBUG] apiRequest: response error body =', responseText);
    // Check for token not valid/expired error
    try {
      const errorJson = JSON.parse(responseText);
      if (
          errorJson?.code === 'token_not_valid' ||
          (errorJson?.detail && errorJson.detail.toLowerCase().includes('token'))
      ) {
        const tokenError = new TokenExpiredError(errorJson.detail || 'Token is expired or not valid');
        // Trigger logout and redirect to login
        handleTokenExpired();
        throw tokenError;
      }
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw e; // Re-throw TokenExpiredError
      }
      // Ignore JSON parse errors, throw generic error below
    }
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

// Function to handle token expiration globally
async function handleTokenExpired() {
  try {
    // Clear all stored tokens and user data
    await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
    
    // Clear web storage if available
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    
    console.log('[DEBUG] handleTokenExpired: Storage cleared, redirecting to login');
    
    // Import router dynamically to avoid circular dependencies
    const { router } = await import('expo-router');
    router.replace('/auth/login');
  } catch (error) {
    console.error('[DEBUG] handleTokenExpired: Error during cleanup:', error);
  }
}

// Generic API request function without auth (for public endpoints)
async function publicApiRequest<T>(endpoint: string, options = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
  };

  console.log('[DEBUG] apiRequest: endpoint =', endpoint);
  console.log('[DEBUG] apiRequest: headers =', headers);

  // Log request body if present
  if ((options as any).body) {
    try {
      const bodyData = JSON.parse((options as any).body);
      console.log('[DEBUG] apiRequest: request body =', bodyData);
    } catch (e) {
      console.log('[DEBUG] apiRequest: request body (raw) =', (options as any).body);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options as any).headers,
    },
  });

  console.log('Статус ответа от сервера:', response.status, response.statusText);
  console.log('URL запроса:', response.url);

  // Получаем текст ответа для отладки
  const responseText = await response.text();
  console.log('Текст ответа от сервера:', responseText);

  if (!response.ok) {
    let errorData;
    try {
      errorData = JSON.parse(responseText);
    } catch {
      errorData = { message: `Server returned ${response.status}: ${responseText}` };
    }
    console.log('Ошибка от сервера:', errorData);
    throw new Error(responseText || `API request failed: ${response.status}`);
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch (error) {
    console.error('Ошибка парсинга JSON:', error);
    throw new Error('Server returned invalid JSON response');
  }
  
  console.log('Распарсенный ответ от сервера:', data);
  return data;
}

// Fetch available languages
export async function fetchLanguages(): Promise<Language[]> {
  return publicApiRequest<Language[]>('/languages/enabled/');
}

// Fetch language progress list
export async function fetchLanguageProgress(): Promise<LanguageProgress[]> {
  const response = await apiRequest<LanguageProgressResponse>('/progress/language/');
  return response.results;
}

// Fetch user progress
export async function fetchUserProgress(): Promise<LanguageProgress[]> {
  const response = await apiRequest<LanguageProgressResponse>('/progress/language/');
  return response.results;
}

// Fetch words statistics
export async function fetchWordsStats(): Promise<WordsStats> {
  const response = await apiRequest<WordsStats>('/progress/words-stats/');
  console.log('[fetchWordsStats]', response);
  return response;
}

// Fetch word details
export async function fetchWordDetails(id: string): Promise<WordDetails> {
  return apiRequest<WordDetails>(`/words/${id}`);
}

// Fetch all word progress for the current user
export async function fetchAllWordProgress(): Promise<WordProgress[]> {
  const response = await apiRequest<WordProgressResponse>('/progress/words/');
  return response.results;
}

// Fetch user's word progress (legacy - kept for backward compatibility)
export async function fetchWordProgress(userId: string): Promise<any> {
  return apiRequest<any>(`/progress/words/${userId}`);
}

// Fetch user's phrase progress
export async function fetchPhraseProgress(userId: string): Promise<any> {
  return apiRequest<any>(`/progress/phrases/${userId}`);
}

// Fetch user profile (authorized)
export async function getProfile(): Promise<User> {
  return apiRequest<User>('/auth/profile/');
}

// Update user interface language
export async function updateInterfaceLanguage(languageId: number): Promise<User> {
  return apiRequest<User>('/auth/profile/', {
    method: 'PATCH',
    body: JSON.stringify({ interface_language_id: languageId }),
  });
}

// Universal update profile (for learning_language, learning_level, etc)
export async function updateProfile(data: Partial<User> & {[key: string]: any}): Promise<User> {
  return apiRequest<User>('/auth/profile/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Update user native language
export async function updateNativeLanguage(languageId: number): Promise<User> {
  return apiRequest<User>('/auth/profile/', {
    method: 'PATCH',
    body: JSON.stringify({ native_language_id: languageId }),
  });
}

// Update user active language
export async function updateActiveLanguage(languageId: number): Promise<User> {
  return apiRequest<User>('/auth/profile/', {
    method: 'PATCH',
    body: JSON.stringify({ active_language_id: languageId }),
  });
}

// Create language progress (for a new language) - using new endpoint
export async function createLanguageProgress(language_id: number, level: LanguageLevel): Promise<LanguageProgress> {
  return apiRequest<LanguageProgress>(`/progress/language/`, {
    method: 'POST',
    body: JSON.stringify({ language_id, level }),
  });
}

// Update language progress (level) for a language - using new endpoint
export async function updateLanguageProgress(progressId: number, level: LanguageLevel, languageId?: number): Promise<LanguageProgress> {
  const body: any = { level };
  if (languageId) {
    body.language_id = languageId;
  }
  
  return apiRequest<LanguageProgress>(`/progress/language/${progressId}/`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

// Get specific language progress by ID
export async function getLanguageProgress(progressId: number): Promise<LanguageProgress> {
  return apiRequest<LanguageProgress>(`/progress/language/${progressId}/`);
}

// Delete language progress
export async function deleteLanguageProgress(progressId: number): Promise<void> {
  return apiRequest<void>(`/progress/language/${progressId}/`, {
    method: 'DELETE',
  });
}

// Update user notifications setting
export async function updateNotifications(notify: boolean): Promise<User> {
  return apiRequest<User>('/auth/profile/', {
    method: 'PATCH',
    body: JSON.stringify({ notify }),
  });
}

// Create word progress
export async function createWordProgress(
  wordId: number, 
  targetLanguageId: number,
  status: WordProgressStatus = 'new',
  interval: number = 0,
  nextReview?: string
): Promise<WordProgress> {

  const body: any = {
    word_id: wordId,
    target_language_id: targetLanguageId,
    status: status,
    interval: interval,
  };

  // Only add optional fields if they have valid values
  if (nextReview && nextReview.trim() !== '') {
    body.next_review = nextReview;
  }

  if (status === 'learned') {
    body.date_learned = new Date().toISOString().split('T')[0];
  }

  console.log('Final request body being sent:', JSON.stringify(body, null, 2));

  try {
    const result = await apiRequest<WordProgress>(`/progress/words/`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    console.log('createWordProgress success:', result);
    return result;
  } catch (error) {
    throw error;
  }
}

// Update existing word progress
export async function updateWordProgress(
  progressId: number, 
  updates: Partial<{
    status: WordProgressStatus;
    interval: number;
    next_review: string;
    review_count: number;
    correct_count: number;
    date_learned: string;
  }>
): Promise<WordProgress> {
  console.log("updateWordProgress =====================");
  console.log({ progressId, updates });

  return apiRequest<WordProgress>(`/progress/words/${progressId}/`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

// Get word progress for a specific word with new API schema
export async function getWordProgress(wordId: number): Promise<WordProgress | null> {
  try {
    const response = await apiRequest<WordProgressResponse>(`/progress/words/`);
    return response.results.find(p => p.word_id === wordId) || null;
  } catch (error) {
    console.error('[getWordProgress] Error:', error);
    return null;
  }
}

// Get word progress by ID
export async function getWordProgressById(progressId: number): Promise<WordProgress> {
  return apiRequest<WordProgress>(`/progress/words/${progressId}/`);
}

// Delete word progress
export async function deleteWordProgress(progressId: number): Promise<void> {
  return apiRequest<void>(`/progress/words/${progressId}/`, {
    method: 'DELETE',
  });
}

// Legacy functions for backward compatibility
export async function createWordProgressLegacy(wordId: number, status: boolean, interval: string): Promise<any> {
  console.log("createWordProgressLegacy =====================");
  console.log(wordId, status, interval);
  return apiRequest<any>(`/progress/words/`, {
    method: 'POST',
    body: JSON.stringify({ 
      word: wordId,
      status: status,
      date_learned: status ? new Date().toISOString().split('T')[0] : null,
      interval: interval
    }),
  });
}

export async function updateWordProgressLegacy(progressId: number, status: boolean, interval: string): Promise<any> {
  console.log("updateWordProgressLegacy =====================")
  console.log(progressId, status, interval)
  return apiRequest<any>(`/progress/words/${progressId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ 
      status: status,
      date_learned: status ? new Date().toISOString().split('T')[0] : null,
      interval: interval
    }),
  });
}

// Login function (without auth header)
export async function loginUser(email: string, password: string): Promise<any> {
  const requestData = {
    email,
    password,
  };

  return publicApiRequest<any>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}

// Registration function (without auth header)
export async function registerUser(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    interfaceLanguageId?: string
): Promise<any> {
  const requestData = {
    email,
    username: name,
    password,
    password_confirm: confirmPassword,
    interface_language: interfaceLanguageId,
  };

  console.log('Данные для регистрации:', requestData);

  return publicApiRequest<any>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}

// Fetch random words for flashcards - Updated for new API format
export async function fetchRandomWords(
  sourceLanguage: string,
  targetLanguage: string,
  level?: string,
  count?: string
): Promise<Word[]> {
  const params = new URLSearchParams({
    from: sourceLanguage,
    to: targetLanguage,
  });
  
  if (level) {
    params.append('level', level);
  }

  if (count) {
    params.append('count', count);
  }

  console.log('[fetchRandomWords] Fetching with params:', {
    from: sourceLanguage,
    to: targetLanguage,
    level,
    count
  });
  
  const response = await apiRequest<RandomWordsResponse>(`/words/random/?${params.toString()}`);
  
  console.log('[fetchRandomWords] Raw API response:', response);
  
  // Check if response has the expected structure
  if (!response || !response.words || !Array.isArray(response.words)) {
    console.error('[fetchRandomWords] Invalid response structure:', response);
    throw new Error('Invalid API response: missing words array');
  }
  
  // Transform the new API format to the legacy format for backward compatibility
  const transformedWords: Word[] = response.words.map((apiWord: WordFromAPI) => {
    console.log('[fetchRandomWords] Processing word:', apiWord);
    
    return {
      id: apiWord.id,
      original: apiWord.word,
      translation: apiWord.translation ? apiWord.translation.word : '',
      transcription: apiWord.transcription || '',
      audio_url: apiWord.audio_url || '',
      part_of_speech: apiWord.part_of_speech ? apiWord.part_of_speech.name : 'unknown',
      part_of_speech_translated: apiWord.translation.part_of_speech ? apiWord.translation.part_of_speech.name : 'unknown',
      level: apiWord.difficulty_level_display || apiWord.difficulty_level || 'beginner',
      // Add examples if available
      example: apiWord.examples && apiWord.examples.length > 0 ? apiWord.examples[0] : undefined,
      created_at: apiWord.created_at,
      source_language: apiWord.language ? apiWord.language.id : undefined,
      target_language: apiWord.translation && apiWord.translation.language ? apiWord.translation.language.id : undefined,
    };
  });

  console.log('[fetchRandomWords] Transformed words:', transformedWords.length);
  
  return transformedWords;
}

export async function createQuizProgress(
    language_id: number | null,
    total_questions: number,
    correct_answers: number,
): Promise<QuizProgress> {
  console.log('Input parameters (raw):', {language_id, total_questions, correct_answers});

  const body: any = {
    language_id: language_id,
    total_questions: total_questions,
    correct_answers: correct_answers,
  };

  try {
    const result = await apiRequest<QuizProgress>(`/progress/quiz/`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    console.log('createQProgress success:', result);
    return result;
  } catch (error) {
    console.error('createWordProgress error:', error);
    console.error('Error details:', {
      originalParams: {language_id, total_questions, correct_answers},
      body: JSON.stringify(body, null, 2)
    });
    throw error;
  }
}

export async function fetchQuizProgressByLanguage(activeLanguage: string): Promise<QuizProgressStats[]> {
  try {
    const query = activeLanguage ? `language=${encodeURIComponent(activeLanguage)}` : '';
    return await apiRequest<QuizProgressStats[]>(`/progress/quiz-stats/?${query}`, {});
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
}

