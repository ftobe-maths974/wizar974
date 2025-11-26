import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Notez l'ajout de "type" ici qui corrige le bug précédent
import type { KahootQuestion, ChatMessage, WizardStep } from '../types';

interface WizardState {
  step: WizardStep;
  accessCode: string;
  chatHistory: ChatMessage[];
  quizData: KahootQuestion[];
  isLoading: boolean;

  setAccessCode: (code: string) => void;
  addMessage: (msg: ChatMessage) => void;
  setQuizData: (data: KahootQuestion[]) => void;
  setLoading: (loading: boolean) => void;
  setStep: (step: WizardStep) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      step: 'login',
      accessCode: '',
      chatHistory: [],
      quizData: [],
      isLoading: false,

      setAccessCode: (code) => set({ accessCode: code }),
      addMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
      setQuizData: (data) => set({ quizData: data, step: 'review' }),
      setLoading: (l) => set({ isLoading: l }),
      setStep: (s) => set({ step: s }),
      reset: () => set({ step: 'login', chatHistory: [], quizData: [] })
    }),
    {
      name: 'quiz-wizard-storage',
    }
  )
);