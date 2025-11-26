import React, { useState, useRef, useEffect } from 'react';
import { useWizardStore } from '../store/wizardStore';
import { sendMessageToAI } from '../lib/api';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export const ChatView = () => {
  const { chatHistory, addMessage, accessCode, isLoading, setLoading, setQuizData } = useWizardStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, content: input };
    addMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await sendMessageToAI([...chatHistory, userMsg], accessCode);
      
      // --- DÉTECTION DU FORMAT JSON (Le moment magique) ---
      // On cherche un tableau JSON [...] dans la réponse
      const jsonMatch = aiResponse.match(/\[\s*\{.*\}\s*\]/s);

      if (jsonMatch) {
        // C'est un Quiz ! On parse et on change d'écran
        const quiz = JSON.parse(jsonMatch[0]);
        setQuizData(quiz); // Le store va automatiquement changer le step vers 'review'
      } else {
        // C'est juste du blabla
        addMessage({ role: 'assistant', content: aiResponse });
      }
    } catch (error) {
      alert("Erreur : Vérifiez votre code d'accès ou la connexion serveur.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm flex items-center gap-3">
        <div className="bg-purple-600 p-2 rounded-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">Architecte Pédagogique</h2>
          <p className="text-xs text-slate-500">Mode: Diagnostic Interactif</p>
        </div>
      </div>

      {/* Zone de Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {chatHistory.length === 0 && (
          <div className="text-center mt-10 p-6 bg-purple-50 rounded-xl border border-purple-100 mx-auto max-w-lg">
            <p className="text-purple-800 font-medium">👋 Dites simplement "Bonjour" pour lancer le diagnostic.</p>
          </div>
        )}
        
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
            )}
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-br-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-slate-500" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-12">
            <Loader2 className="w-4 h-4 animate-spin" />
            L'IA réfléchit...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
            placeholder="Répondez à l'IA..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};