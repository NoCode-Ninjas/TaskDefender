import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface PomodoroTimerProps {
  sessionType: 'pomodoro' | 'deep-work';
  taskId?: string;
  isActive: boolean;
  onSessionEnd: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ 
  sessionType, 
  taskId, 
  isActive, 
  onSessionEnd 
}) => {
  const { settings, endFocusSession, focusSessions } = useApp();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentSession = focusSessions.find(session => !session.completed);
  const initialTime = sessionType === 'pomodoro' 
    ? settings.focus.pomodoroLength * 60 
    : 60 * 60; // 1 hour for deep work

  useEffect(() => {
    if (isActive && !currentSession) {
      setTimeLeft(initialTime);
    }
  }, [isActive, initialTime, currentSession]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (currentSession) {
      endFocusSession(currentSession.id);
    }
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(initialTime);
    onSessionEnd();
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(initialTime);
  };

  const handleSessionComplete = () => {
    if (currentSession) {
      endFocusSession(currentSession.id);
    }
    setIsRunning(false);
    setIsPaused(false);
    onSessionEnd();
    
    // Show completion notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Session Complete!', {
        body: `Great job! You completed a ${sessionType} session.`,
        icon: '/favicon.ico'
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="text-center">
      {/* Timer Display */}
      <div className="relative mb-8">
        <div className="w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                sessionType === 'pomodoro' ? 'text-orange-500' : 'text-green-500'
              }`}
            />
          </svg>
          
          {/* Time text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {sessionType.replace('-', ' ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={timeLeft === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-5 w-5" />
            <span>{isPaused ? 'Resume' : 'Start'}</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Pause className="h-5 w-5" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={handleStop}
          disabled={!isRunning && !isPaused}
          className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Square className="h-5 w-5" />
          <span>Stop</span>
        </button>

        <button
          onClick={handleReset}
          disabled={isRunning}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Session Info */}
      {currentSession && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Session started at {new Date(currentSession.startTime).toLocaleTimeString()}
          </p>
          {currentSession.taskId && (
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              Focusing on: {/* Task title would be looked up here */}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;