import { useState, useEffect } from 'react';
import { VoiceCall } from '../types';

export const useVoiceCalls = () => {
  const [currentCall, setCurrentCall] = useState<VoiceCall | null>(null);

  // Simulate voice call triggers
  useEffect(() => {
    const triggerCall = () => {
      // Random chance of triggering a call when user is idle
      if (Math.random() < 0.1) { // 10% chance every check
        const characters = ['boss', 'parent', 'friend', 'coach', 'therapist'];
        const character = characters[Math.floor(Math.random() * characters.length)];
        
        const scripts = {
          boss: "Hey, I noticed you've been procrastinating on that project. We need to talk about your productivity. This is affecting the team's performance.",
          parent: "Sweetie, I'm worried about you. You seem to be avoiding your responsibilities lately. Is everything okay? You know you can talk to me.",
          friend: "Dude, what's going on? You've been putting off everything lately. This isn't like you. Want to grab coffee and talk about it?",
          coach: "Listen up! Champions don't make excuses, they make progress. You've got the potential, but you need to push through this resistance. Let's go!",
          therapist: "I've noticed some patterns in your behavior that suggest you might be struggling with task avoidance. Would you like to explore what might be underlying this?"
        };

        const call: VoiceCall = {
          id: crypto.randomUUID(),
          userId: 'current-user',
          character: character as any,
          trigger: 'Prolonged procrastination detected',
          script: scripts[character as keyof typeof scripts],
          duration: 0,
          scheduledFor: new Date(),
          completed: false,
        };

        setCurrentCall(call);
      }
    };

    // Check every 5 minutes
    const interval = setInterval(triggerCall, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const answerCall = (callId: string) => {
    if (currentCall?.id === callId) {
      setCurrentCall(prev => prev ? { ...prev, userResponse: 'answered' } : null);
    }
  };

  const declineCall = (callId: string) => {
    if (currentCall?.id === callId) {
      setCurrentCall(prev => prev ? { ...prev, userResponse: 'declined', completed: true } : null);
      setTimeout(() => setCurrentCall(null), 1000);
    }
  };

  const endCall = (callId: string) => {
    if (currentCall?.id === callId) {
      setCurrentCall(prev => prev ? { ...prev, completed: true } : null);
      setTimeout(() => setCurrentCall(null), 1000);
    }
  };

  return {
    currentCall,
    answerCall,
    declineCall,
    endCall,
  };
};