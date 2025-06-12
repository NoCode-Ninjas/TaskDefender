import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import TaskManager from './components/tasks/TaskManager';
import FocusMode from './components/focus/FocusMode';
import Calendar from './components/calendar/Calendar';
import Settings from './components/settings/Settings';
import SarcasticPromptDisplay from './components/sarcasm/SarcasticPromptDisplay';
import VoiceCallModal from './components/voice/VoiceCallModal';
import NotificationCenter from './components/notifications/NotificationCenter';
import { useSarcasticPrompts } from './hooks/useSarcasticPrompts';
import { useVoiceCalls } from './hooks/useVoiceCalls';

const AppContent: React.FC = () => {
  const { isOnboarding, currentTheme, currentView } = useApp();
  const { currentPrompt, userPersona, dismissPrompt, changePersona } = useSarcasticPrompts();
  const { currentCall, answerCall, declineCall, endCall } = useVoiceCalls();

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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tasks':
        return <TaskManager />;
      case 'focus':
        return <FocusMode />;
      case 'calendar':
        return <Calendar />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
      
      {/* Overlays */}
      <SarcasticPromptDisplay
        prompt={currentPrompt}
        onDismiss={dismissPrompt}
        onPersonaChange={changePersona}
        currentPersona={userPersona}
      />
      
      <VoiceCallModal
        call={currentCall}
        onAnswer={answerCall}
        onDecline={declineCall}
        onEnd={endCall}
      />
      
      <NotificationCenter />
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