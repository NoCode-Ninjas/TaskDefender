import React from 'react';
import { Calendar, Clock, Target, TrendingUp, Award, Users } from 'lucide-react';
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
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Focus Time',
      value: `${Math.round(totalFocusTime / 60)}m`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Streak',
      value: `${user?.streak || 0} days`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Integrity Score',
      value: `${user?.integrityScore || 100}%`,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-green-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'Defender'}! 🛡️
        </h1>
        <p className="text-orange-100 text-lg">
          Ready to defend your productivity today?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
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
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
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
              <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
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
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
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
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
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
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.round((completedToday / Math.max(todayTasks.length, 1)) * 100)}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Task Completion Rate</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(averageFocusTime / 60)}m
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Focus Time</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
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