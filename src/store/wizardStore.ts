import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KahootQuestion, ChatMessage, WizardStep, QuizSettings } from '../types';

// SourceType : soit manuel (objet), soit texte brut (string)
export type SourceType = 'manual' | 'text' | 'pronote' | null;

interface WizardState {
  step: WizardStep;
  accessCode: string;
  
  sourceType: SourceType;
  sourceContent: QuizSettings | string; // <--- Le changement clé est ici
  
  chatHistory: ChatMessage[];
  quizData: KahootQuestion[];
  isLoading: boolean;

  setAccessCode: (code: string) => void;
  setSource: (type: SourceType, content: QuizSettings | string) => void;
  addMessage: (msg: ChatMessage) => void;
  setQuizData: (data: KahootQuestion[]) => void;
  setLoading: (loading: boolean) => void;
  setStep: (step: WizardState['step']) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      step: 'login',
      accessCode: '',
      sourceType: null,
      sourceContent: '',
      chatHistory: [],
      quizData: [],
      isLoading: false,

      setAccessCode: (code) => set({ accessCode: code }),
      
      setSource: (type, content) => set({ 
        sourceType: type, 
        sourceContent: content,
        step: 'chat',
        chatHistory: [] 
      }),

      addMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
      setQuizData: (data) => set({ quizData: data, step: 'review' }),
      setLoading: (l) => set({ isLoading: l }),
      setStep: (s) => set({ step: s }),
      reset: () => set({ step: 'login', sourceType: null, sourceContent: '', chatHistory: [], quizData: [] })
    }),
    { name: 'quiz-wizard-storage' }
  )
);