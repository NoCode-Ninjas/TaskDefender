import { useState, useEffect, useCallback } from 'react';
import { SarcasticPrompt } from '../types';
import { SarcasticPromptEngine } from '../services/SarcasticPromptEngine';

export const useSarcasticPrompts = () => {
  const [currentPrompt, setCurrentPrompt] = useState<SarcasticPrompt | null>(null);
  const [userPersona, setUserPersona] = useState<string>('sarcastic-friend');
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [isIdle, setIsIdle] = useState(false);

  const updateActivity = useCallback(() => {
    setLastActivity(new Date());
    setIsIdle(false);
  }, []);

  const dismissPrompt = useCallback(() => {
    setCurrentPrompt(null);
  }, []);

  const changePersona = useCallback((persona: string) => {
    setUserPersona(persona);
  }, []);

  // Check for idle state and trigger prompts
  useEffect(() => {
    const checkIdleState = () => {
      const now = new Date();
      const timeSinceActivity = now.getTime() - lastActivity.getTime();
      const idleThreshold = 5 * 60 * 1000; // 5 minutes

      if (timeSinceActivity > idleThreshold && !isIdle) {
        setIsIdle(true);
        const prompt = SarcasticPromptEngine.generatePrompt('procrastination', userPersona as any);
        setCurrentPrompt(prompt);
      }
    };

    const interval = setInterval(checkIdleState, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [lastActivity, isIdle, userPersona]);

  // Auto-dismiss prompts after a certain time
  useEffect(() => {
    if (currentPrompt) {
      const timer = setTimeout(() => {
        setCurrentPrompt(null);
      }, 10000); // Auto-dismiss after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [currentPrompt]);

  return {
    currentPrompt,
    userPersona,
    isIdle,
    updateActivity,
    dismissPrompt,
    changePersona,
  };
};