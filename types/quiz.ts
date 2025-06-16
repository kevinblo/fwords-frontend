export interface Quiz {
  id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  duration: number;
  questionCount: number;
  completed: boolean;
  score?: number;
}

export interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  answers: QuizAnswer[];
}

export interface QuizDetails {
  id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  difficulty: string;
  questions: QuizQuestion[];
}