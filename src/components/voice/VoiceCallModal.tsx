import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Volume2 } from 'lucide-react';
import { VoiceCall } from '../../types';

interface VoiceCallModalProps {
  call: VoiceCall | null;
  onAnswer: (callId: string) => void;
  onDecline: (callId: string) => void;
  onEnd: (callId: string) => void;
}

const VoiceCallModal: React.FC<VoiceCallModalProps> = ({ call, onAnswer, onDecline, onEnd }) => {
  const [isRinging, setIsRinging] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (call && !isAnswered) {
      setIsRinging(true);
      const ringInterval = setInterval(() => {
        setIsRinging(prev => !prev);
      }, 1000);

      return () => clearInterval(ringInterval);
    }
  }, [call, isAnswered]);

  useEffect(() => {
    let durationInterval: NodeJS.Timeout;
    
    if (call && isAnswered) {
      durationInterval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(durationInterval);
  }, [call, isAnswered]);

  if (!call) return null;

  const getCharacterInfo = (character: string) => {
    const characters = {
      boss: { name: 'Your Boss', emoji: '👔', color: 'from-red-500 to-red-600' },
      parent: { name: 'Your Parent', emoji: '👨‍👩‍👧‍👦', color: 'from-blue-500 to-blue-600' },
      friend: { name: 'Your Friend', emoji: '👥', color: 'from-green-500 to-green-600' },
      coach: { name: 'Your Coach', emoji: '💪', color: 'from-orange-500 to-orange-600' },
      therapist: { name: 'Your Therapist', emoji: '🧠', color: 'from-purple-500 to-purple-600' },
    };
    return characters[character as keyof typeof characters] || characters.friend;
  };

  const characterInfo = getCharacterInfo(call.character);

  const handleAnswer = () => {
    setIsAnswered(true);
    setIsRinging(false);
    onAnswer(call.id);
  };

  const handleDecline = () => {
    onDecline(call.id);
  };

  const handleEnd = () => {
    onEnd(call.id);
    setIsAnswered(false);
    setCallDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`bg-gradient-to-br ${characterInfo.color} rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-white overflow-hidden ${
        isRinging ? 'animate-pulse' : ''
      }`}>
        {/* Header */}
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">{characterInfo.emoji}</div>
          <h3 className="text-2xl font-bold mb-2">{characterInfo.name}</h3>
          <p className="text-lg opacity-90">
            {isAnswered ? 'On Call' : 'Incoming Call'}
          </p>
          {isAnswered && (
            <p className="text-sm opacity-75 mt-2">
              {formatDuration(callDuration)}
            </p>
          )}
        </div>

        {/* Call Content */}
        {isAnswered && (
          <div className="px-8 pb-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm font-medium">Speaking...</span>
              </div>
              <p className="text-sm leading-relaxed">
                "{call.script}"
              </p>
            </div>
          </div>
        )}

        {/* Call Actions */}
        <div className="p-8">
          {!isAnswered ? (
            <div className="flex justify-center space-x-8">
              <button
                onClick={handleDecline}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                <PhoneOff className="h-8 w-8" />
              </button>
              
              <button
                onClick={handleAnswer}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg"
              >
                <Phone className="h-8 w-8" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handleEnd}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                <PhoneOff className="h-8 w-8" />
              </button>
            </div>
          )}
        </div>

        {/* Call Info */}
        <div className="px-8 pb-8">
          <div className="text-center text-sm opacity-75">
            <p>Motivation Intervention Call</p>
            <p>Trigger: {call.trigger}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCallModal;