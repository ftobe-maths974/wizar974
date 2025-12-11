import { useState, useRef, useEffect } from 'react';
import { useWizardStore } from '../store/wizardStore';
import { sendMessageToAI } from '../lib/api';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, Loader2, ArrowLeft } from 'lucide-react';
import { normalizeQuizData } from '../lib/quiz-parser'; // <--- AJOUT

export const ChatView = () => {
  const { chatHistory, addMessage, accessCode, isLoading, setLoading, setQuizData, setStep } = useWizardStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Ref pour éviter le double appel en mode Strict React
  const hasStartedRef = useRef(false);

  // --- AUTO-START (Le Secret du Wizard) ---
  useEffect(() => {
    // Si l'historique est vide, on lance l'analyse automatiquement
    if (chatHistory.length === 0 && !isLoading && !hasStartedRef.current) {
      hasStartedRef.current = true; // Verrouillage
      triggerAutoAnalysis();
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const triggerAutoAnalysis = async () => {
    setLoading(true);
    try {
      // On envoie une instruction cachée (l'utilisateur ne la voit pas dans son historique)
      // L'IA recevra le Contexte (via api.ts) + ce message déclencheur
      const aiResponse = await sendMessageToAI([], accessCode);
      
      // On ajoute directement la réponse de l'IA
      addMessage({ role: 'assistant', content: aiResponse });
    } catch (error) {
      console.error(error);
      addMessage({ role: 'assistant', content: "Erreur de connexion. Dites 'Bonjour' pour réessayer." });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, content: input };
    addMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await sendMessageToAI([...chatHistory, userMsg], accessCode);
      
      // DÉTECTION JSON
      const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const firstBracket = cleanJson.indexOf('[');
      const lastBracket = cleanJson.lastIndexOf(']');

      if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        try {
          const jsonString = cleanJson.substring(firstBracket, lastBracket + 1);
          const rawQuiz = JSON.parse(jsonString);
          
          // --- LA CORRECTION EST ICI ---
          // On nettoie les données avant de les envoyer au store
          const cleanQuiz = normalizeQuizData(rawQuiz);
          
          if (cleanQuiz.length > 0) {
            setQuizData(cleanQuiz);
            return; // Succès !
          }
        } catch (e) { 
          console.log("Tentative de parsing échouée :", e); 
        }
      }

      // Nettoyage Markdown
      const cleanMarkdown = aiResponse.replace(/\\\*/g, '*');
      addMessage({ role: 'assistant', content: cleanMarkdown });

    } catch (error) {
      alert("Erreur IA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('source')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="bg-purple-600 p-2 rounded-lg shadow-purple-200">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Architecte Pédagogique</h2>
            <p className="text-xs text-slate-500 font-medium">Assistant Quiz Wizard</p>
          </div>
        </div>
      </div>

      {/* Zone de Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Loader initial spécial */}
        {chatHistory.length === 0 && isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            <p className="animate-pulse font-medium">Analyse de votre configuration...</p>
          </div>
        )}
        
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
            )}
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
            }`}>
              <ReactMarkdown 
                components={{
                  strong: ({node, ...props}) => <span className="font-bold text-purple-700 bg-purple-50 px-1 rounded" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc ml-4 my-2 space-y-1 marker:text-purple-400" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal ml-4 my-2 space-y-1 marker:text-purple-600 font-medium" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {/* Loader classique pour les messages suivants */}
        {chatHistory.length > 0 && isLoading && (
          <div className="text-slate-400 text-sm ml-12 animate-pulse">L'IA réfléchit...</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:bg-white transition outline-none"
            placeholder="Votre réponse..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition disabled:opacity-50">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};