const phrasesScreenTranslations = {
  en: {
    title: 'Phrases',
    loading: 'Loading phrases...',
    'results.title': 'Results',
    'results.complete': 'Learning Complete!',
    'results.correct': 'Correct',
    'results.wrong': 'Wrong',
    'results.practiceAgain': 'Practice Again',
  },
  ru: {
    title: 'Фразы',
    loading: 'Загрузка фраз...',
    'results.title': 'Результаты',
    'results.complete': 'Обучение завершено!',
    'results.correct': 'Верно',
    'results.wrong': 'Ошибки',
    'results.practiceAgain': 'Пройти снова',
  },
};

export type PhrasesScreenTranslationKey = keyof typeof phrasesScreenTranslations['en'];
export default phrasesScreenTranslations;