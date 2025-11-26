import React, { useState } from 'react';
import { useWizardStore } from '../store/wizardStore';
import { Lock, Wand2 } from 'lucide-react';

export const LoginView = () => {
  const { setAccessCode, setStep } = useWizardStore();
  const [localCode, setLocalCode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (localCode.trim()) {
      setAccessCode(localCode);
      setStep('source');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wand2 className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Quiz Wizard</h1>
        <p className="text-slate-500 mb-6">Entrez le code d'accès de votre établissement pour configurer l'IA.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Code d'accès (ex: PROFS2025)"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={localCode}
              onChange={(e) => setLocalCode(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition shadow-lg hover:shadow-purple-500/30"
          >
            Commencer
          </button>
        </form>
      </div>
    </div>
  );
};