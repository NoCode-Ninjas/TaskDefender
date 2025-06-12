import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, Target, Zap } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import PomodoroTimer from './PomodoroTimer';
import FocusSessionHistory from './FocusSessionHistory';
import DistractionTracker from './DistractionTracker';

const FocusMode: React.FC = () => {
  const { tasks, focusSessions, settings, startFocusSession } = useApp();
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [sessionType, setSessionType] = useState<'pomodoro' | 'deep-work'>('pomodoro');
  const [isActive, setIsActive] = useState(false);

  const activeTasks = tasks.filter(task => task.status !== 'completed');
  const currentSession = focusSessions.find(session => !session.completed);

  const handleStartSession = () => {
    if (selectedTask || sessionType === 'deep-work') {
      startFocusSession(selectedTask || undefined, sessionType);
      setIsActive(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Focus Mode
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Deep work sessions with distraction tracking
        </p>
      </div>

      {/* Main Focus Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timer Section */}
        <div className="space-y-6">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Focus Timer
                </h2>
              </div>
              
              {/* Session Type Selector */}
              <div className="flex justify-center space-x-2 mb-6">
                <button
                  onClick={() => setSessionType('pomodoro')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    sessionType === 'pomodoro'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Pomodoro ({settings.focus.pomodoroLength}m)
                </button>
                <button
                  onClick={() => setSessionType('deep-work')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    sessionType === 'deep-work'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Deep Work
                </button>
              </div>

              {/* Task Selector */}
              {sessionType === 'pomodoro' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Focus on task (optional):
                  </label>
                  <select
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">General focus session</option>
                    {activeTasks.map(task => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Timer Component */}
            <PomodoroTimer
              sessionType={sessionType}
              taskId={selectedTask}
              isActive={isActive}
              onSessionEnd={() => setIsActive(false)}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(focusSessions.reduce((total, session) => total + session.duration, 0) / 60)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Minutes</p>
            </div>
            
            <div className="card p-4 text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {focusSessions.filter(s => s.completed).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</p>
            </div>
          </div>
        </div>

        {/* Distraction Tracker */}
        <div className="space-y-6">
          <DistractionTracker currentSession={currentSession} />
          
          {/* Focus Tips */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Focus Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Turn off notifications on your devices</li>
              <li>• Keep a glass of water nearby</li>
              <li>• Use noise-canceling headphones</li>
              <li>• Take notes of distracting thoughts</li>
              <li>• Reward yourself after each session</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Session History */}
      <FocusSessionHistory sessions={focusSessions} />
    </div>
  );
};

export default FocusMode;