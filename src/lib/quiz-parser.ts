import type { KahootQuestion } from '../types';

export const normalizeQuizData = (rawData: any[]): KahootQuestion[] => {
  if (!Array.isArray(rawData)) return [];

  return rawData.map((item) => {
    // 1. Gestion des réponses : Soit clés plates (Answer1...), soit tableau (options/answers)
    let answers = ["", "", "", ""];
    
    // Tentative de détection d'un tableau de réponses
    const optionsArray = item.options || item.answers || item.choices;
    
    if (Array.isArray(optionsArray) && optionsArray.length > 0) {
      // Si l'IA a renvoyé un tableau, on le map vers nos 4 slots
      answers = [
        optionsArray[0] || "",
        optionsArray[1] || "",
        optionsArray[2] || "",
        optionsArray[3] || ""
      ];
    } else {
      // Sinon, on cherche les clés plates habituelles
      const getAns = (keys: string[]) => {
        for (const k of keys) {
          if (item[k] !== undefined) return item[k];
        }
        return "";
      };
      
      answers = [
        getAns(['Answer1', 'answer1', 'Answer 1', 'a1']),
        getAns(['Answer2', 'answer2', 'Answer 2', 'a2']),
        getAns(['Answer3', 'answer3', 'Answer 3', 'a3']),
        getAns(['Answer4', 'answer4', 'Answer 4', 'a4'])
      ];
    }

    // 2. Gestion de la question
    const getVal = (keys: string[]) => {
      for (const k of keys) {
        if (item[k] !== undefined) return item[k];
      }
      return "";
    };

    return {
      Question: getVal(['Question', 'question', 'q', 'title', 'statement']),
      
      Answer1: answers[0].toString(),
      Answer2: answers[1].toString(),
      Answer3: answers[2].toString(),
      Answer4: answers[3].toString(),
      
      TimeLimit: parseInt(getVal(['TimeLimit', 'timeLimit', 'time', 'seconds', 'duration']).toString().replace(/\D/g, '')) || 20,
      
      // On s'assure que c'est une string pour l'export Excel (ex: "1")
      CorrectAnswer: getVal(['CorrectAnswer', 'correctAnswer', 'correct', 'answer', 'correctOption']).toString()
    };
  });
};