import React from 'react';
import { Calendar, Clock, Target, TrendingUp, Award, Users, Shield } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { user, tasks, focusSessions } = useApp();

  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    return taskDate && taskDate.toDateString() === today.toDateString();
  });

  const completedToday = todayTasks.filter(task => task.status === 'completed').length;
  const totalFocusTime = focusSessions.reduce((total, session) => total + session.duration, 0);
  const averageFocusTime = focusSessions.length > 0 ? totalFocusTime / focusSessions.length : 0;

  const stats = [
    {
      title: 'Tasks Today',
      value: `${completedToday}/${todayTasks.length}`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Focus Time',
      value: `${Math.round(totalFocusTime / 60)}m`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Streak',
      value: `${user?.streak || 0} days`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    {
      title: 'Integrity Score',
      value: `${user?.integrityScore || 100}%`,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-green-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name || 'Defender'}! 🛡️
            </h1>
            <p className="text-orange-100 text-lg">
              Your Last Line of Defense Against Procrastination is ready!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border ${stat.borderColor} ${stat.bgColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-white/50 dark:bg-gray-700/50`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Today's Tasks
            </h2>
            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          
          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No tasks scheduled for today</p>
              <button className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                Add Task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={`flex-1 ${
                    task.status === 'completed' 
                      ? 'text-gray-500 line-through' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {task.title}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
              {todayTasks.length > 5 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  +{todayTasks.length - 5} more tasks
                </p>
              )}
            </div>
          )}
        </div>

        {/* Recent Focus Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Focus Sessions
            </h2>
            <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          
          {focusSessions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No focus sessions yet</p>
              <button className="mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                Start Focus Session
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {focusSessions.slice(-5).reverse().map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      session.completed ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <span className="text-gray-900 dark:text-gray-100">
                      {session.type === 'pomodoro' ? 'Pomodoro' : 'Deep Work'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {Math.round(session.duration / 60)}m
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Productivity Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {Math.round((completedToday / Math.max(todayTasks.length, 1)) * 100)}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Task Completion Rate</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              {Math.round(averageFocusTime / 60)}m
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Focus Time</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
              {user?.streak || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;