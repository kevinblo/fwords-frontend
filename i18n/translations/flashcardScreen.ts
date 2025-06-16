const flashcardScreenTranslations = {
  en: {
    noData: 'No words data available.',
    example: 'Example:',
    tapToFlip: 'Tap to flip',
    didYouKnow: 'Did you know this word?',
    knewIt: 'I Knew It',
    stillLearning: 'Still Learning',
  },
  ru: {
    noData: 'Нет данных по словам.',
    example: 'Пример:',
    tapToFlip: 'Нажмите для переворота',
    didYouKnow: 'Вы знали это слово?',
    knewIt: 'Я знал это',
    stillLearning: 'Еще учу',
  },
};

export type FlashcardScreenTranslationKey = keyof typeof flashcardScreenTranslations['en'];
export default flashcardScreenTranslations;