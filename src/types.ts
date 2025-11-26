// src/types.ts

export interface KahootQuestion {
  Question: string;        // Max 120 chars
  Answer1: string;         // Max 75 chars
  Answer2: string;
  Answer3: string;
  Answer4: string;
  TimeLimit: number;       // 5, 10, 20, 30, 60, 90, 120, 240
  CorrectAnswer: string;   // Ex: "1" ou "2,3"
}

// C'est cette partie qui manquait probablement :
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type WizardStep = 'login' | 'chat' | 'review';