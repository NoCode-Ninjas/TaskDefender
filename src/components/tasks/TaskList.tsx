import React from 'react';
import { Task } from '../../types';
import TaskItem from './TaskItem';
import { Target } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const groupedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    completed: tasks.filter(task => task.status === 'completed'),
  };

  if (tasks.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start by adding your first task using the quick capture above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Kanban View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                {status.replace('-', ' ')}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                status === 'todo' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' :
                status === 'in-progress' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {statusTasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {statusTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
              
              {statusTasks.length === 0 && (
                <div className="card p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No {status.replace('-', ' ')} tasks
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;