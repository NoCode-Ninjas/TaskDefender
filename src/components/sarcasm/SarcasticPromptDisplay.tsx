import React from 'react';
import { X, RotateCcw, Settings } from 'lucide-react';
import { SarcasticPrompt } from '../../types';

interface SarcasticPromptDisplayProps {
  prompt: SarcasticPrompt | null;
  onDismiss: () => void;
  onPersonaChange: (persona: string) => void;
  currentPersona: string;
}

const SarcasticPromptDisplay: React.FC<SarcasticPromptDisplayProps> = ({
  prompt,
  onDismiss,
  onPersonaChange,
  currentPersona,
}) => {
  if (!prompt) return null;

  const getPersonaEmoji = (persona: string) => {
    const emojiMap: Record<string, string> = {
      'drill-sergeant': '🪖',
      'disappointed-parent': '😔',
      'sarcastic-friend': '😏',
      'motivational-coach': '💪',
    };
    return emojiMap[persona] || '🤖';
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return 'from-green-500 to-blue-500';
    if (intensity <= 3) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getIntensityColor(prompt.intensity)} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{getPersonaEmoji(prompt.persona)}</div>
              <div>
                <h3 className="font-bold text-lg capitalize">
                  {prompt.persona.replace('-', ' ')}
                </h3>
                <p className="text-sm opacity-90 capitalize">
                  {prompt.category} • Intensity {prompt.intensity}/5
                </p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Message */}
        <div className="p-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-gray-900 dark:text-gray-100 text-lg leading-relaxed">
              "{prompt.message}"
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Generate new prompt with same trigger
                  onDismiss();
                }}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="text-sm">New Message</span>
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={onDismiss}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={onDismiss}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 transition-all duration-200"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>

        {/* Persona Selector */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Change personality:
            </span>
            <div className="flex space-x-1">
              {['drill-sergeant', 'disappointed-parent', 'sarcastic-friend', 'motivational-coach'].map((persona) => (
                <button
                  key={persona}
                  onClick={() => onPersonaChange(persona)}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPersona === persona
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={persona.replace('-', ' ')}
                >
                  <span className="text-lg">{getPersonaEmoji(persona)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SarcasticPromptDisplay;