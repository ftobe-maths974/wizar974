import type { ChatMessage } from '../types';
import { buildSystemPrompt } from './prompts'; // <--- Import de la nouvelle fonction
import { useWizardStore } from '../store/wizardStore';

const API_URL = "https://blokaly.maths974.fr/api-proxy.php";

export const sendMessageToAI = async (history: ChatMessage[], accessCode: string): Promise<string> => {
  try {
    const { sourceContent } = useWizardStore.getState();

    // GÉNÉRATION DYNAMIQUE DU PROMPT
    const dynamicInstruction = buildSystemPrompt(sourceContent);

    const triggerMessage = history.length === 0 
      ? "Analyse ma configuration ci-dessus et fais ta proposition stratégique maintenant."
      : "";

    const fullHistory = [
      { role: 'system', content: dynamicInstruction }, 
      ...history 
    ];

    if (triggerMessage) {
        fullHistory.push({ role: 'user', content: triggerMessage });
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessCode, history: fullHistory }),
    });

    if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    
    return data.choices?.[0]?.message?.content || "Erreur vide";

  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};