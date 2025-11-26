import { useWizardStore } from './store/wizardStore';
import { LoginView } from './components/LoginView';
import { ChatView } from './components/ChatView';
import { ReviewView } from './components/ReviewView';

function App() {
  const { step } = useWizardStore();

  return (
    <>
      {step === 'login' && <LoginView />}
      {step === 'chat' && <ChatView />}
      {step === 'review' && <ReviewView />}
    </>
  );
}

export default App;