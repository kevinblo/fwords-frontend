const flashcardsWordsScreenTranslations = {
  en: {
    // Header
    flashcard: 'Flashcard',
    
    // Error messages
    failedToLoadWords: 'Failed to load words. Please try again.',
    failedToLoadWordDetails: 'Failed to load word details.',
    noWordsAvailable: 'No words available for this language combination',
    setLanguagesError: 'Please set your native and active languages in settings',
    languagesTheSame: 'Native and active language can\'t be the same',

    // Card content
    tapToSeeTranslation: 'Tap to see translation',
    tapToSeeOriginal: 'Tap to see original',
    translation: 'Translation',
    example: 'Example:',
    
    // Actions
    goBack: 'Go Back',
    dontKnow: "Still learning",
    know: 'Know',
    
    // Hints
    swipeHint: "Swipe right if you know the word, left if you don't",
    
    // Audio
    playingAudio: 'Playing Audio',
    audioPlaybackMessage: 'Audio playback would start now',
    
    // Session complete
    sessionComplete: 'Session Complete!',
    sessionCompleteMessage: 'You have reviewed all words in this session.',
    ok: 'OK',
  },
  ru: {
    // Header
    flashcard: 'Карточка',
    
    // Error messages
    failedToLoadWords: 'Не удалось загрузить слова. Пожалуйста, попробуйте снова.',
    failedToLoadWordDetails: 'Не удалось загрузить детали слова.',
    noWordsAvailable: 'Нет доступных слов для этой языковой комбинации',
    setLanguagesError: 'Пожалуйста, установите родной и изучаемый языки в настройках',
    languagesTheSame: 'Родной и изучаемый язык не могут совпадать',

    // Card content
    tapToSeeTranslation: 'Нажмите, чтобы увидеть перевод',
    tapToSeeOriginal: 'Нажмите, чтобы увидеть оригинал',
    translation: 'Перевод',
    example: 'Пример:',
    
    // Actions
    goBack: 'Назад',
    dontKnow: 'Еще учу',
    know: 'Знаю',
    
    // Hints
    swipeHint: 'Сдвиньте карточку вправо, если знаете слово, влево - если нет',
    
    // Audio
    playingAudio: 'Воспроизведение аудио',
    audioPlaybackMessage: 'Воспроизведение аудио начнется сейчас',
    
    // Session complete
    sessionComplete: 'Сессия завершена!',
    sessionCompleteMessage: 'Вы просмотрели все слова в этой сессии.',
    ok: 'ОК',
  },
};

export type FlashcardsWordsScreenTranslationKey = keyof typeof flashcardsWordsScreenTranslations['en'];
export default flashcardsWordsScreenTranslations;