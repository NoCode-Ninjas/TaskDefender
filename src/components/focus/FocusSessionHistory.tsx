import React from 'react';
import { Clock, Target, AlertTriangle, Calendar } from 'lucide-react';
import { FocusSession } from '../../types';

interface FocusSessionHistoryProps {
  sessions: FocusSession[];
}

const FocusSessionHistory: React.FC<FocusSessionHistoryProps> = ({ sessions }) => {
  const completedSessions = sessions.filter(session => session.completed);
  
  if (completedSessions.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Focus Sessions Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete your first focus session to see your history here
        </p>
      </div>
    );
  }

  const totalFocusTime = completedSessions.reduce((total, session) => total + session.duration, 0);
  const averageSession = totalFocusTime / completedSessions.length;
  const totalDistractions = completedSessions.reduce((total, session) => total + session.distractions.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Focus Session History
        </h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {completedSessions.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
        </div>

        <div className="card p-4 text-center">
          <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(totalFocusTime / 60)}m
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Focus Time</p>
        </div>

        <div className="card p-4 text-center">
          <Calendar className="h-6 w-6 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(averageSession / 60)}m
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Session</p>
        </div>

        <div className="card p-4 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalDistractions}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Distractions</p>
        </div>
      </div>

      {/* Session List */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Sessions
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {completedSessions.slice(-10).reverse().map((session) => (
            <div key={session.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    session.type === 'pomodoro' 
                      ? 'bg-orange-100 dark:bg-orange-900/20' 
                      : 'bg-green-100 dark:bg-green-900/20'
                  }`}>
                    {session.type === 'pomodoro' ? (
                      <Clock className={`h-5 w-5 ${
                        session.type === 'pomodoro' ? 'text-orange-600' : 'text-green-600'
                      }`} />
                    ) : (
                      <Target className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {session.type.replace('-', ' ')} Session
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(session.startTime).toLocaleDateString()} at{' '}
                      {new Date(session.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {Math.round(session.duration / 60)} minutes
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {session.distractions.length} distractions
                  </p>
                </div>
              </div>

              {session.distractions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {session.distractions.slice(0, 3).map((distraction, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-xs"
                    >
                      {distraction.source || distraction.type}
                    </span>
                  ))}
                  {session.distractions.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                      +{session.distractions.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FocusSessionHistory;