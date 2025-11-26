import { useState } from 'react';
import { useWizardStore } from '../store/wizardStore';
import { Settings, FileText, ArrowRight, Brain, Sparkles, BookOpen } from 'lucide-react';
import type { QuizSettings } from '../types';

const SUBJECTS = ["Mathématiques", "Français", "Histoire-Géo", "Anglais", "SVT", "Physique-Chimie", "Technologie", "SES", "Philo"];
const LEVELS = ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale", "BTS", "Universitaire"];
const BLOOMS = ["Mémorisation (Réciter)", "Compréhension (Expliquer)", "Application (Résoudre)", "Analyse (Comparer)", "Création (Inventer)"];
const TYPES = ["QCM Classique", "Vrai/Faux", "Mise en situation", "Trouver l'intrus", "Définition inversée"];
const DISTRACTORS = ["Erreurs fréquentes", "Confusions phonétiques", "Aléatoire", "Proche de la vérité"];
const TONES = ["Bienveillant", "Strict", "Ludique", "Compétition", "Mystérieux"];
const DIFFICULTIES = ["Progressive", "Constante", "Difficile", "Piègeuse"];

export const SourceView = () => {
  const { setSource } = useWizardStore();
  const [mode, setMode] = useState<'manual' | 'text'>('manual');
  const [rawText, setRawText] = useState('');

  const [config, setConfig] = useState<QuizSettings>({
    subject: "Mathématiques", level: "4ème", topic: "",
    bloomLevel: BLOOMS[2], questionType: TYPES[0], distractorStrategy: DISTRACTORS[0],
    difficulty: DIFFICULTIES[0], tone: TONES[0], language: "Français Standard"
  });

  const update = (field: keyof QuizSettings, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleGo = () => {
    if (mode === 'manual') setSource('manual', config);
    else setSource('text', rawText);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-start pt-10">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* SIDEBAR */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Source</h2>
          <ModeButton icon={Settings} label="Configurateur" active={mode === 'manual'} onClick={() => setMode('manual')} />
          <ModeButton icon={FileText} label="Texte / Cours" active={mode === 'text'} onClick={() => setMode('text')} />
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
          {mode === 'manual' ? (
            <div className="space-y-8 animate-in fade-in">
              <Section title="1. Le Cadre" icon={BookOpen} color="text-blue-600" bg="bg-blue-50">
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Matière" value={config.subject} options={SUBJECTS} onChange={v => update('subject', v)} />
                  <Select label="Niveau" value={config.level} options={LEVELS} onChange={v => update('level', v)} />
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sujet Précis</label>
                  <input className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" placeholder="Ex: Pythagore" value={config.topic} onChange={e => update('topic', e.target.value)} />
                </div>
              </Section>

              <Section title="2. Pédagogie" icon={Brain} color="text-purple-600" bg="bg-purple-50">
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Niveau Cognitif" value={config.bloomLevel} options={BLOOMS} onChange={v => update('bloomLevel', v)} />
                  <Select label="Stratégie Pièges" value={config.distractorStrategy} options={DISTRACTORS} onChange={v => update('distractorStrategy', v)} />
                </div>
              </Section>

              <Section title="3. Expérience" icon={Sparkles} color="text-pink-600" bg="bg-pink-50">
                <div className="grid grid-cols-3 gap-4">
                  <Select label="Type Question" value={config.questionType} options={TYPES} onChange={v => update('questionType', v)} />
                  <Select label="Ton" value={config.tone} options={TONES} onChange={v => update('tone', v)} />
                  <Select label="Difficulté" value={config.difficulty} options={DIFFICULTIES} onChange={v => update('difficulty', v)} />
                </div>
              </Section>
            </div>
          ) : (
             <div className="h-full flex flex-col animate-in fade-in">
                <textarea className="flex-1 w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl resize-none h-96" placeholder="Collez ici le texte..." value={rawText} onChange={e => setRawText(e.target.value)} />
             </div>
          )}

          <div className="mt-10 flex justify-end pt-6 border-t border-slate-100">
            <button onClick={handleGo} disabled={mode === 'manual' && !config.topic} className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-black transition shadow-xl disabled:opacity-50">
              Lancer l'Architecte <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModeButton = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 p-4 rounded-xl text-left font-bold transition ${active ? 'bg-white shadow-md text-slate-900 ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}>
    <Icon className={`w-5 h-5 ${active ? 'text-purple-600' : 'text-slate-400'}`} /> {label}
  </button>
);

const Section = ({ title, icon: Icon, children, color, bg }: any) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-1">
    <div className={`flex items-center gap-2 px-4 py-3 ${bg} ${color} rounded-t-xl font-bold text-sm uppercase tracking-wide`}><Icon className="w-4 h-4" /> {title}</div>
    <div className="p-5">{children}</div>
  </div>
);

const Select = ({ label, value, options, onChange }: any) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
    <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" value={value} onChange={e => onChange(e.target.value)}>
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);