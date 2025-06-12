import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import SarcasticPromptDisplay from './components/sarcasm/SarcasticPromptDisplay';
import { useSarcasticPrompts } from './hooks/useSarcasticPrompts';

const AppContent: React.FC = () => {
  const { isOnboarding, currentTheme } = useApp();
  const { currentPrompt, userPersona, dismissPrompt, changePersona } = useSarcasticPrompts();

  useEffect(() => {
    // Apply theme to document
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  if (isOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
      </main>
      
      <SarcasticPromptDisplay
        prompt={currentPrompt}
        onDismiss={dismissPrompt}
        onPersonaChange={changePersona}
        currentPersona={userPersona}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;