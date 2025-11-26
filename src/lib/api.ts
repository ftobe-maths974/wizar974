import type { ChatMessage } from '../types';
import { SYSTEM_INSTRUCTION } from './prompts';

// C'est ici qu'on branche votre URL réelle
const API_URL = "https://blokaly.maths974.fr/api-proxy.php";

export const sendMessageToAI = async (history: ChatMessage[], accessCode: string): Promise<string> => {
  try {
    // 1. On prépare l'historique avec l'instruction système
    const fullHistory = [
      { role: 'system', content: SYSTEM_INSTRUCTION }, 
      ...history
    ];

    // 2. On appelle votre proxy PHP chez OVH
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessCode, history: fullHistory }),
    });

    // 3. Gestion des erreurs HTTP (ex: mot de passe faux)
    if (!response.ok) {
      if (response.status === 403) throw new Error("Code d'accès refusé (Mot de passe incorrect)");
      if (response.status === 404) throw new Error("Fichier PHP introuvable à cette adresse");
      if (response.status === 500) throw new Error("Erreur interne du serveur PHP (Vérifiez votre clé API)");
      throw new Error(`Erreur serveur : ${response.status}`);
    }

    const data = await response.json();

    // 4. Gestion des erreurs renvoyées par le PHP (ex: clé OpenAI invalide)
    if (data.error) {
      throw new Error(data.error);
    }
    
    // 5. Extraction de la réponse (Format spécifique ChatGPT)
    return data.choices?.[0]?.message?.content || "Erreur : Réponse vide de l'IA";

  } catch (error) {
    console.error("Erreur API:", error);
    // On relance l'erreur pour l'afficher dans l'interface (alert)
    throw error;
  }
};