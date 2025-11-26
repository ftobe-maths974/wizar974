import { useWizardStore } from './store/wizardStore';
import { LoginView } from './components/LoginView';
import { SourceView } from './components/SourceView'; // <--- Nouvel import
import { ChatView } from './components/ChatView';
import { ReviewView } from './components/ReviewView';

function App() {
  const { step } = useWizardStore();

  return (
    <>
      {step === 'login' && <LoginView />}
      {step === 'source' && <SourceView />} {/* <--- Nouvelle étape */}
      {step === 'chat' && <ChatView />}
      {step === 'review' && <ReviewView />}
    </>
  );
}

export default App;