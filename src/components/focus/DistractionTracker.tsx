import React, { useState } from 'react';
import { AlertTriangle, Smartphone, Globe, MessageCircle, Plus } from 'lucide-react';
import { FocusSession } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface DistractionTrackerProps {
  currentSession?: FocusSession;
}

const DistractionTracker: React.FC<DistractionTrackerProps> = ({ currentSession }) => {
  const { addDistraction } = useApp();
  const [customDistraction, setCustomDistraction] = useState('');

  const commonDistractions = [
    { type: 'phone', label: 'Phone/SMS', icon: Smartphone },
    { type: 'social-media', label: 'Social Media', icon: MessageCircle },
    { type: 'website', label: 'Random Website', icon: Globe },
    { type: 'thoughts', label: 'Random Thoughts', icon: AlertTriangle },
  ];

  const handleAddDistraction = (type: string, source?: string) => {
    if (currentSession) {
      addDistraction(currentSession.id, type, source);
    }
  };

  const handleCustomDistraction = () => {
    if (customDistraction.trim() && currentSession) {
      addDistraction(currentSession.id, 'custom', customDistraction.trim());
      setCustomDistraction('');
    }
  };

  if (!currentSession) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Distraction Tracker
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Start a focus session to track distractions
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Distraction Tracker
        </h3>
        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm">
          {currentSession.distractions.length} distractions
        </span>
      </div>

      {/* Quick Distraction Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {commonDistractions.map((distraction) => (
          <button
            key={distraction.type}
            onClick={() => handleAddDistraction(distraction.type)}
            className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
          >
            <distraction.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {distraction.label}
            </span>
          </button>
        ))}
      </div>

      {/* Custom Distraction */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={customDistraction}
          onChange={(e) => setCustomDistraction(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCustomDistraction()}
          placeholder="Custom distraction..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-sm"
        />
        <button
          onClick={handleCustomDistraction}
          disabled={!customDistraction.trim()}
          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Distraction List */}
      {currentSession.distractions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Session Distractions:
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {currentSession.distractions.map((distraction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/10 rounded text-sm"
              >
                <span className="text-red-700 dark:text-red-300">
                  {distraction.source || distraction.type}
                </span>
                <span className="text-red-500 dark:text-red-400 text-xs">
                  {new Date(distraction.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          💡 Tip: Acknowledge distractions without judgment. The goal is awareness, not perfection.
        </p>
      </div>
    </div>
  );
};

export default DistractionTracker;