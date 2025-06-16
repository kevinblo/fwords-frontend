const wordsScreenTranslations = {
  en: {
    title: 'Words',
    loading: 'Loading words...',
    selectMode: 'Choose your learning mode',
    'mode.flashcards': 'Flashcards',
    'mode.quiz': 'Quiz',
    'mode.flashcardsDesc': 'Review words and their translations by flipping cards',
    'mode.quizDesc': 'Test your knowledge with multiple choice questions',
    'results.title': 'Results',
    'results.complete': 'Learning Complete!',
    'results.correct': 'Correct',
    'results.wrong': 'Wrong',
    'results.practiceAgain': 'Practice Again',
    'results.backToModes': 'Back to Modes',
  },
  ru: {
    title: 'Слова',
    loading: 'Загрузка слов...',
    selectMode: 'Выберите режим обучения',
    'mode.flashcards': 'Карточки',
    'mode.quiz': 'Викторина',
    'mode.flashcardsDesc': 'Учите слова и переводы, перелистывая карточки',
    'mode.quizDesc': 'Проверьте свои знания с помощью вопросов с вариантами',
    'results.title': 'Результаты',
    'results.complete': 'Обучение завершено!',
    'results.correct': 'Верно',
    'results.wrong': 'Ошибки',
    'results.practiceAgain': 'Пройти снова',
    'results.backToModes': 'Назад к режимам',
  },
};

export type WordsScreenTranslationKey = keyof typeof wordsScreenTranslations['en'];
export default wordsScreenTranslations;
