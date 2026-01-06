
export interface Question {
  id: number;
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
  userAnswer?: number;
}

export enum GameState {
  START = 'START',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT'
}

export interface Animal {
  emoji: string;
  name: string;
  color: string;
}
