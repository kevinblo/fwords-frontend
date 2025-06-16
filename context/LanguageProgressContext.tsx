import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  fetchLanguageProgress, 
  createLanguageProgress, 
  updateLanguageProgress,
  deleteLanguageProgress 
} from '@/api/api';
import { LanguageProgress, LanguageLevel } from '@/types/progress';
import { useAuth } from './AuthContext';

interface LanguageProgressContextType {
  languageProgress: LanguageProgress[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refreshProgress: () => Promise<void>;
  updateLanguageLevel: (languageId: number, level: LanguageLevel) => Promise<void>;
  createProgress: (languageId: number, level: LanguageLevel) => Promise<void>;
  removeProgress: (progressId: number) => Promise<void>;
  
  // Helpers
  getLanguageLevel: (languageId: number) => LanguageLevel;
  hasProgress: (languageId: number) => boolean;
}

const LanguageProgressContext = createContext<LanguageProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'languageProgress';
const CACHE_EXPIRY_KEY = 'languageProgressExpiry';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useLanguageProgress() {
  const context = useContext(LanguageProgressContext);
  if (!context) {
    throw new Error('useLanguageProgress must be used within a LanguageProgressProvider');
  }
  return context;
}

interface LanguageProgressProviderProps {
  children: ReactNode;
}

export function LanguageProgressProvider({ children }: LanguageProgressProviderProps) {
  const [languageProgress, setLanguageProgress] = useState<LanguageProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Load progress from cache or API
  const loadProgress = async (forceRefresh = false) => {
    if (!isAuthenticated) {
      setLanguageProgress([]);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = await getCachedProgress();
        if (cachedData) {
          console.log('[LanguageProgress] Using cached data');
          setLanguageProgress(cachedData);
          setIsLoading(false);
          return;
        }
      }

      console.log('[LanguageProgress] Fetching from API');
      const progressData = await fetchLanguageProgress();
      
      // Ensure we have an array
      const progressArray = Array.isArray(progressData) ? progressData : [];
      
      setLanguageProgress(progressArray);
      
      // Cache the data
      await cacheProgress(progressArray);
      
    } catch (err) {
      console.error('[LanguageProgress] Error loading progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to load language progress');
      
      // Try to use cached data as fallback
      const cachedData = await getCachedProgress();
      if (cachedData) {
        setLanguageProgress(cachedData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cache management
  const getCachedProgress = async (): Promise<LanguageProgress[] | null> => {
    try {
      const [cachedData, expiryTime] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(CACHE_EXPIRY_KEY)
      ]);

      if (!cachedData || !expiryTime) {
        return null;
      }

      const expiry = parseInt(expiryTime, 10);
      if (Date.now() > expiry) {
        // Cache expired
        await clearCache();
        return null;
      }

      return JSON.parse(cachedData);
    } catch (error) {
      console.error('[LanguageProgress] Error reading cache:', error);
      return null;
    }
  };

  const cacheProgress = async (progress: LanguageProgress[]) => {
    try {
      const expiryTime = Date.now() + CACHE_DURATION;
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)),
        AsyncStorage.setItem(CACHE_EXPIRY_KEY, expiryTime.toString())
      ]);
    } catch (error) {
      console.error('[LanguageProgress] Error caching data:', error);
    }
  };

  const clearCache = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEY),
        AsyncStorage.removeItem(CACHE_EXPIRY_KEY)
      ]);
    } catch (error) {
      console.error('[LanguageProgress] Error clearing cache:', error);
    }
  };

  // Actions
  const refreshProgress = async () => {
    setIsLoading(true);
    await loadProgress(true);
  };

  const updateLanguageLevel = async (languageId: number, level: LanguageLevel) => {
    try {
      // Find existing progress
      const existingProgress = languageProgress.find(p => p.language.id === languageId);
      
      if (existingProgress) {
        // Update existing progress
        const updatedProgress = await updateLanguageProgress(existingProgress.id, level, languageId);
        
        // Update local state
        const newProgressArray = languageProgress.map(p => 
          p.id === existingProgress.id ? updatedProgress : p
        );
        setLanguageProgress(newProgressArray);
        
        // Update cache with new data
        await cacheProgress(newProgressArray);
      } else {
        // Create new progress
        await createProgress(languageId, level);
      }
      
    } catch (err) {
      console.error('[LanguageProgress] Error updating language level:', err);
      throw err;
    }
  };

  const createProgress = async (languageId: number, level: LanguageLevel) => {
    try {
      const newProgress = await createLanguageProgress(languageId, level);
      
      // Update local state
      const newProgressArray = [...languageProgress, newProgress];
      setLanguageProgress(newProgressArray);
      
      // Update cache with new data
      await cacheProgress(newProgressArray);
      
    } catch (err) {
      console.error('[LanguageProgress] Error creating progress:', err);
      throw err;
    }
  };

  const removeProgress = async (progressId: number) => {
    try {
      await deleteLanguageProgress(progressId);
      
      // Update local state
      setLanguageProgress(prev => prev.filter(p => p.id !== progressId));
      
      // Update cache
      const updatedProgress = languageProgress.filter(p => p.id !== progressId);
      await cacheProgress(updatedProgress);
      
    } catch (err) {
      console.error('[LanguageProgress] Error removing progress:', err);
      throw err;
    }
  };

  // Helpers
  const getLanguageLevel = (languageId: number): LanguageLevel => {
    // API returns language as object with id
    const progress = languageProgress.find(p => p.language.id === languageId);
    return progress?.level || 'A1';
  };

  const hasProgress = (languageId: number): boolean => {
    return languageProgress.some(p => p.language.id === languageId);
  };

  // Load progress when auth state changes
  useEffect(() => {
    if (!authLoading) {
      loadProgress();
    }
  }, [authLoading, isAuthenticated]);

  // Clear cache when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      clearCache();
      setLanguageProgress([]);
    }
  }, [isAuthenticated]);

  const value: LanguageProgressContextType = {
    languageProgress,
    isLoading,
    error,
    refreshProgress,
    updateLanguageLevel,
    createProgress,
    removeProgress,
    getLanguageLevel,
    hasProgress,
  };

  return (
    <LanguageProgressContext.Provider value={value}>
      {children}
    </LanguageProgressContext.Provider>
  );
}