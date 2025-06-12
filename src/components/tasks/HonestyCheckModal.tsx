import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Heart } from 'lucide-react';
import { Task } from '../../types';

interface HonestyCheckModalProps {
  task: Task;
  onComplete: (honestlyCompleted: boolean) => void;
  onCancel: () => void;
}

const HonestyCheckModal: React.FC<HonestyCheckModalProps> = ({ task, onComplete, onCancel }) => {
  const [reflection, setReflection] = useState('');
  const [honestlyCompleted, setHonestlyCompleted] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (honestlyCompleted !== null) {
      onComplete(honestlyCompleted);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-green-500 p-6 text-white">
          <div className="flex items-center space-x-3">
            <Heart className="h-6 w-6" />
            <div>
              <h3 className="font-bold text-lg">Honesty Checkpoint</h3>
              <p className="text-sm opacity-90">Your integrity matters</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Task: {task.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Before marking this as complete, let's do a quick honesty check.
            </p>
          </div>

          {/* Honesty Question */}
          <div className="space-y-4">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              Did you honestly complete this task to the best of your ability?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => setHonestlyCompleted(true)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  honestlyCompleted === true
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`h-5 w-5 ${
                    honestlyCompleted === true ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Yes, I completed it honestly
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      I gave my best effort and met the requirements
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setHonestlyCompleted(false)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  honestlyCompleted === false
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`h-5 w-5 ${
                    honestlyCompleted === false ? 'text-orange-600' : 'text-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      I could have done better
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      I rushed through it or didn't meet my standards
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Optional Reflection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick reflection (optional):
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What went well? What could be improved next time?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 text-sm"
              rows={3}
            />
          </div>

          {/* Impact Message */}
          {honestlyCompleted !== null && (
            <div className={`p-3 rounded-lg ${
              honestlyCompleted 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'
            }`}>
              <p className="text-sm">
                {honestlyCompleted 
                  ? '🎉 Great job! Your integrity score will increase.'
                  : '💪 Thanks for being honest. This helps you improve and maintains your integrity.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between p-6 bg-gray-50 dark:bg-gray-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={honestlyCompleted === null}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default HonestyCheckModal;