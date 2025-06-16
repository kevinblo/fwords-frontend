# Language Progress API - New Format

This document describes the new language progress API format implemented for the fwords-frontend React Native + Expo application.

## API Endpoint

**Base URL:** `/api/v1/progress/language/`

## Data Structure

### LanguageProgress Interface

```typescript
export interface LanguageProgress {
  id: number;                    // Unique progress ID
  language: Language;            // Full language object
  language_id: number;           // Language ID reference
  level: LanguageLevel;          // Current learning level
  learned_words_count: number;   // Number of words learned
  learned_phrases_count: number; // Number of phrases learned
  updated_at: string;            // Last update timestamp (ISO format)
  created_at: string;            // Creation timestamp (ISO format)
}
```

### Language Interface

```typescript
export interface Language {
  id: number;                    // Unique language ID
  code: string;                  // Language code (e.g., 'en', 'ru', 'es')
  name_english: string;          // Language name in English
  name_native: string;           // Language name in its native language
  enabled: boolean;              // Whether this language is enabled
  created_at: string;            // Creation timestamp
  updated_at: string;            // Last update timestamp
}
```

### LanguageLevel Type

```typescript
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
```

## API Functions

### 1. Fetch All Language Progress

```typescript
import { fetchLanguageProgress } from '@/api/api';

const progressList = await fetchLanguageProgress();
// Returns: LanguageProgress[]
```

### 2. Create New Language Progress

```typescript
import { createLanguageProgress } from '@/api/api';

const newProgress = await createLanguageProgress(languageId, 'A1');
// Parameters: (language_id: number, level: LanguageLevel)
// Returns: LanguageProgress
```

### 3. Update Language Progress

```typescript
import { updateLanguageProgress } from '@/api/api';

const updatedProgress = await updateLanguageProgress(progressId, 'B1');
// Parameters: (progressId: number, level: LanguageLevel, languageId?: number)
// Returns: LanguageProgress
```

### 4. Get Specific Language Progress

```typescript
import { getLanguageProgress } from '@/api/api';

const progress = await getLanguageProgress(progressId);
// Parameters: (progressId: number)
// Returns: LanguageProgress
```

### 5. Delete Language Progress

```typescript
import { deleteLanguageProgress } from '@/api/api';

await deleteLanguageProgress(progressId);
// Parameters: (progressId: number)
// Returns: void
```

## Example Usage

### Basic Component Implementation

```typescript
import React, { useState, useEffect } from 'react';
import { fetchLanguageProgress, createLanguageProgress } from '@/api/api';
import { LanguageProgress, LanguageLevel } from '@/types/progress';

export default function LanguageProgressComponent() {
  const [progress, setProgress] = useState<LanguageProgress[]>([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await fetchLanguageProgress();
      setProgress(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const addLanguage = async (languageId: number) => {
    try {
      const newProgress = await createLanguageProgress(languageId, 'A1');
      setProgress(prev => [...prev, newProgress]);
    } catch (error) {
      console.error('Failed to add language:', error);
    }
  };

  return (
    // Your component JSX here
  );
}
```

### Complete Example Component

See `components/LanguageProgressExample.tsx` for a full implementation example that demonstrates:

- Fetching language progress list
- Creating new language progress
- Updating language levels
- Deleting language progress
- Error handling
- UI interactions

## Migration from Old API

### Old Format (fetchUserProgress)
```typescript
// Old way
const userProgress = await fetchUserProgress();
// Returns complex nested structure
```

### New Format (fetchLanguageProgress)
```typescript
// New way
const languageProgress = await fetchLanguageProgress();
// Returns clean array of LanguageProgress objects
```

## Key Benefits

1. **Cleaner Data Structure**: Each language progress is a separate object with clear relationships
2. **Better Type Safety**: Strong TypeScript interfaces for all data structures
3. **CRUD Operations**: Full create, read, update, delete functionality
4. **Nested Language Data**: Full language information included in each progress object
5. **Standardized Levels**: Predefined language levels (A1-C2)
6. **Timestamps**: Proper tracking of creation and update times

## Error Handling

All API functions throw errors that should be caught and handled appropriately:

```typescript
try {
  const progress = await fetchLanguageProgress();
  // Handle success
} catch (error) {
  console.error('API Error:', error);
  // Handle error (show user message, retry, etc.)
}
```

## Testing

To test the new API format:

1. Import the example component: `import LanguageProgressExample from '@/components/LanguageProgressExample';`
2. Add it to any screen in your app
3. Test all CRUD operations through the UI
4. Check console logs for API request/response details

## Notes

- The old `fetchUserProgress` function is still available for backward compatibility
- All new development should use the new `fetchLanguageProgress` and related functions
- The API automatically handles authentication via stored access tokens
- All timestamps are in ISO format and should be parsed with `new Date()`