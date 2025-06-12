import React, { useState } from 'react';
import { Clock, Flag, MoreVertical, Play, Check, Edit, Trash2 } from 'lucide-react';
import { Task } from '../../types';
import { useApp } from '../../contexts/AppContext';
import HonestyCheckModal from './HonestyCheckModal';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask, completeTask, startFocusSession } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [showHonestyCheck, setShowHonestyCheck] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-50 dark:bg-green-900/10';
      case 'in-progress': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/10';
      default: return 'border-gray-200 dark:border-gray-700';
    }
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    if (newStatus === 'completed') {
      setShowHonestyCheck(true);
    } else {
      updateTask(task.id, { status: newStatus });
    }
  };

  const handleHonestyComplete = (honestlyCompleted: boolean) => {
    completeTask(task.id, honestlyCompleted);
    setShowHonestyCheck(false);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <>
      <div className={`card p-4 border-l-4 ${getStatusColor(task.status)} ${
        isOverdue ? 'ring-2 ring-red-200 dark:ring-red-800' : ''
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className={`font-medium text-gray-900 dark:text-gray-100 ${
                task.status === 'completed' ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h4>
              
              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              
              {isOverdue && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                  Overdue
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {task.description}
              </p>
            )}

            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              {task.dueDate && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {task.estimatedTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedTime}m estimated</span>
                </div>
              )}
            </div>

            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {/* Quick Actions */}
            {task.status !== 'completed' && (
              <>
                <button
                  onClick={() => startFocusSession(task.id)}
                  className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  title="Start focus session"
                >
                  <Play className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  title="Mark as complete"
                >
                  <Check className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        // Edit functionality would go here
                        setShowMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        deleteTask(task.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Selector */}
        <div className="mt-3 flex items-center space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Status:</span>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Honesty Check Modal */}
      {showHonestyCheck && (
        <HonestyCheckModal
          task={task}
          onComplete={handleHonestyComplete}
          onCancel={() => setShowHonestyCheck(false)}
        />
      )}
    </>
  );
};

export default TaskItem;