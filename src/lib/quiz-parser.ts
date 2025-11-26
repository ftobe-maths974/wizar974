import type { KahootQuestion } from '../types';

export const normalizeQuizData = (rawData: any[]): KahootQuestion[] => {
  if (!Array.isArray(rawData)) return [];

  return rawData.map((item) => {
    // On cherche la valeur dans toutes les variantes possibles de clés
    // L'IA est imprévisible : "question", "Question", "QUESTION", etc.
    const getVal = (keys: string[]) => {
      for (const k of keys) {
        if (item[k] !== undefined) return item[k];
      }
      return ""; // Valeur par défaut si rien trouvé
    };

    return {
      // Mapping intelligent
      Question: getVal(['Question', 'question', 'q', 'QUESTION']),
      Answer1: getVal(['Answer1', 'answer1', 'Answer 1', 'answer 1', 'a1']),
      Answer2: getVal(['Answer2', 'answer2', 'Answer 2', 'answer 2', 'a2']),
      Answer3: getVal(['Answer3', 'answer3', 'Answer 3', 'answer 3', 'a3']),
      Answer4: getVal(['Answer4', 'answer4', 'Answer 4', 'answer 4', 'a4']),
      
      // Gestion des nombres (parfois l'IA renvoie "20s" ou "20")
      TimeLimit: parseInt(getVal(['TimeLimit', 'timeLimit', 'time', 'seconds']).toString().replace(/\D/g, '')) || 20,
      
      // Gestion des réponses correctes (string ou number)
      CorrectAnswer: getVal(['CorrectAnswer', 'correctAnswer', 'correct', 'answer']).toString()
    };
  });
};