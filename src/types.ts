export interface KahootQuestion {
  Question: string;
  Answer1: string;
  Answer2: string;
  Answer3: string;
  Answer4: string;
  TimeLimit: number;
  CorrectAnswer: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'; // Ajout de 'system' pour la compatibilité
  content: string;
}

export type WizardStep = 'login' | 'source' | 'chat' | 'review';

// --- LA NOUVELLE STRUCTURE PIVOT ---
export interface QuizSettings {
  // 1. Contexte
  subject: string;
  level: string;
  topic: string;

  // 2. Pédagogie
  bloomLevel: string;
  questionType: string;
  distractorStrategy: string;

  // 3. UX
  difficulty: string;
  tone: string;
  language: string;
}