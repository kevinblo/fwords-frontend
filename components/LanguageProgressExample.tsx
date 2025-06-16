import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { 
  fetchLanguageProgress, 
  createLanguageProgress, 
  updateLanguageProgress, 
  deleteLanguageProgress,
  fetchLanguages 
} from '@/api/api';
import { LanguageProgress, LanguageLevel } from '@/types/progress';
import { Language } from '@/types/language';

export default function LanguageProgressExample() {
  const [languageProgress, setLanguageProgress] = useState<LanguageProgress[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [progressData, languagesData] = await Promise.all([
        fetchLanguageProgress(),
        fetchLanguages()
      ]);
      setLanguageProgress(progressData);
      setAvailableLanguages(languagesData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load language progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgress = async (languageId: number, level: LanguageLevel) => {
    try {
      const newProgress = await createLanguageProgress(languageId, level);
      setLanguageProgress(prev => [...prev, newProgress]);
      Alert.alert('Success', 'Language progress created successfully');
    } catch (error) {
      console.error('Error creating progress:', error);
      Alert.alert('Error', 'Failed to create language progress');
    }
  };

  const handleUpdateLevel = async (progressId: number, newLevel: LanguageLevel) => {
    try {
      const updatedProgress = await updateLanguageProgress(progressId, newLevel);
      setLanguageProgress(prev => 
        prev.map(p => p.id === progressId ? updatedProgress : p)
      );
      Alert.alert('Success', 'Language level updated successfully');
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'Failed to update language level');
    }
  };

  const handleDeleteProgress = async (progressId: number) => {
    try {
      await deleteLanguageProgress(progressId);
      setLanguageProgress(prev => prev.filter(p => p.id !== progressId));
      Alert.alert('Success', 'Language progress deleted successfully');
    } catch (error) {
      console.error('Error deleting progress:', error);
      Alert.alert('Error', 'Failed to delete language progress');
    }
  };

  const renderProgressItem = ({ item }: { item: LanguageProgress }) => (
    <View style={styles.progressItem}>
      <View style={styles.languageInfo}>
        <Text style={styles.languageName}>{item.language.name_english}</Text>
        <Text style={styles.languageCode}>({item.language.code})</Text>
      </View>
      
      <View style={styles.progressStats}>
        <Text style={styles.level}>Level: {item.level}</Text>
        <Text style={styles.stats}>
          Words: {item.learned_words_count} | Phrases: {item.learned_phrases_count}
        </Text>
        <Text style={styles.date}>
          Updated: {new Date(item.updated_at).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={() => {
            // Cycle through levels for demo
            const levels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
            const currentIndex = levels.indexOf(item.level);
            const nextLevel = levels[(currentIndex + 1) % levels.length];
            handleUpdateLevel(item.id, nextLevel);
          }}
        >
          <Text style={styles.buttonText}>Update Level</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteProgress(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAvailableLanguage = ({ item }: { item: Language }) => {
    const hasProgress = languageProgress.some(p => p.language_id === item.id);
    
    if (hasProgress) return null;

    return (
      <TouchableOpacity 
        style={styles.availableLanguage}
        onPress={() => handleCreateProgress(item.id, 'A1')}
      >
        <Text style={styles.availableLanguageText}>
          Add {item.name_english} ({item.code})
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading language progress...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language Progress (New API Format)</Text>
      
      <Text style={styles.sectionTitle}>Your Language Progress:</Text>
      {languageProgress.length > 0 ? (
        <FlatList
          data={languageProgress}
          renderItem={renderProgressItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.progressList}
        />
      ) : (
        <Text style={styles.emptyText}>No language progress found</Text>
      )}

      <Text style={styles.sectionTitle}>Add New Language:</Text>
      <FlatList
        data={availableLanguages}
        renderItem={renderAvailableLanguage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.availableList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  progressList: {
    maxHeight: 400,
  },
  progressItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  languageCode: {
    fontSize: 14,
    color: '#666',
  },
  progressStats: {
    marginBottom: 12,
  },
  level: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2196F3',
    marginBottom: 4,
  },
  stats: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  availableList: {
    maxHeight: 200,
  },
  availableLanguage: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  availableLanguageText: {
    color: '#2196F3',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
});