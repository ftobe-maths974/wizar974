# 🧙‍♂️ Quiz Wizard (Wizar974)

![Status](https://img.shields.io/badge/Status-Proof_of_Concept-orange)
![Tech](https://img.shields.io/badge/Tech-React_|_Vite_|_Tailwind-blue)

**Quiz Wizard** est une application web (Proof of Concept) permettant aux enseignants de générer automatiquement des quiz pédagogiques (compatibles Kahoot) grâce à l'intelligence artificielle.

L'application agit comme un "Architecte Pédagogique", transformant une configuration (matière, niveau, objectif) ou un texte brut en un fichier Excel prêt à être importé dans Kahoot.

🔗 **Démo en ligne :** [https://ftobe-maths974.github.io/wizar974/](https://ftobe-maths974.github.io/wizar974/)

---

## ✨ Fonctionnalités Clés

* **🛡️ Authentification Simple :** Accès sécurisé par un code unique.
* **⚙️ Configurateur Pédagogique :** Définition précise du contexte (Niveau Bloom, Stratégie des distracteurs, Ton, Difficulté).
* **📝 Mode Texte Source :** Génération de quiz à partir d'un cours copié-collé.
* **🤖 Chat IA Interactif :** Dialogue avec l'IA pour affiner le quiz avant validation.
* **Dg 📊 Parsing Intelligent :** Transformation automatique des réponses de l'IA (JSON) en données structurées.
* **xk 📥 Export Kahoot :** Génération d'un fichier `.xlsx` formaté spécifiquement pour l'import Kahoot.

---

## 🛠️ Stack Technique

Ce projet est construit avec des technologies modernes pour assurer performance et maintenabilité :

* **Core :** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
* **State Management :** [Zustand](https://github.com/pmndrs/zustand) (avec persistance locale optimisée).
* **Styling :** [Tailwind CSS](https://tailwindcss.com/) pour une UI responsive et propre.
* **API & IA :** Appels vers un proxy PHP (`api.ts`) communiquant avec un LLM.
* **Utilitaires :**
    * `xlsx` : Pour la création des fichiers Excel.
    * `react-markdown` : Pour le rendu des messages du chat.
    * `lucide-react` : Pour l'iconographie.

---

## VX 📂 Structure du Projet

L'architecture est organisée de manière modulaire dans le dossier `src/` :

```text
src/
├── components/        # Vues principales de l'application
│   ├── LoginView.tsx    # Écran de connexion
│   ├── SourceView.tsx   # Choix du mode (Configurateur ou Texte)
│   ├── ChatView.tsx     # Interface de discussion avec l'IA
│   └── ReviewView.tsx   # Prévisualisation et export du quiz
│
├── lib/               # Logique métier et utilitaires
│   ├── api.ts           # Gestion des appels API vers le proxy IA
│   ├── prompts.ts       # "Prompt Engineering" : construction des instructions système
│   ├── quiz-parser.ts   # Normalisation et nettoyage du JSON reçu de l'IA
│   └── kahoot-exporter.ts # Génération du fichier Excel via SheetJS
│
├── store/             # Gestion d'état global
│   └── wizardStore.ts   # Store Zustand (Step, User Data, Quiz Data)
│
├── types.ts           # Définitions TypeScript (Interfaces partagées)
└── App.tsx            # Routeur logique (gestion des étapes)