import React from 'react';
import { useWizardStore } from '../store/wizardStore';
import { exportToKahootExcel } from '../lib/kahoot-exporter';
import { Download, ArrowLeft, CheckCircle, Clock } from 'lucide-react';

export const ReviewView = () => {
  const { quizData, setStep, reset } = useWizardStore();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <button onClick={() => setStep('chat')} className="flex items-center text-slate-500 hover:text-purple-600 mb-2 transition">
              <ArrowLeft className="w-4 h-4 mr-1" /> Retour au chat
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Quiz Généré ({quizData.length} questions)</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={reset} className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium">
              Nouveau Quiz
            </button>
            <button 
              onClick={() => exportToKahootExcel(quizData)}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg shadow-green-600/20 transition transform hover:-translate-y-0.5"
            >
              <Download className="w-5 h-5 mr-2" />
              Télécharger .xlsx
            </button>
          </div>
        </div>

        {/* Liste des cartes Questions */}
        <div className="grid gap-6">
          {quizData.map((q, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-700">Question {i + 1}</h3>
                <div className="flex items-center text-sm text-slate-500 bg-white px-3 py-1 rounded-full border">
                  <Clock className="w-4 h-4 mr-1" /> {q.TimeLimit} sec
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-xl font-medium text-slate-800 mb-6">{q.Question}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* On génère les 4 réponses */}
                  {[q.Answer1, q.Answer2, q.Answer3, q.Answer4].map((ans, idx) => {
                    const answerIndex = (idx + 1).toString();
                    // Vérifie si c'est une bonne réponse (gère "1" et "1,3")
                    const isCorrect = q.CorrectAnswer.split(',').map(s => s.trim()).includes(answerIndex);
                    
                    return (
                      <div key={idx} className={`p-4 rounded-lg border-2 flex items-center justify-between ${
                        isCorrect 
                          ? 'border-green-500 bg-green-50 text-green-900' 
                          : 'border-slate-100 bg-slate-50 text-slate-500'
                      }`}>
                        <span className="font-medium">{ans}</span>
                        {isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};