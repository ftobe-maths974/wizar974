import * as XLSX from 'xlsx';
// Le mot "type" est indispensable ici car KahootQuestion est une interface
import type { KahootQuestion } from '../types';

export const exportToKahootExcel = (questions: KahootQuestion[]) => {
  // 1. Créer une feuille de calcul
  const ws = XLSX.utils.json_to_sheet(questions);

  // 2. Créer un classeur
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Quiz");

  // 3. Générer le fichier et déclencher le téléchargement
  XLSX.writeFile(wb, "mon-quiz-kahoot.xlsx");
};