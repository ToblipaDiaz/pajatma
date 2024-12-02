import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Task } from '../../types/project';
import { PROJECT_ROLES } from '../../types/roles';

interface TaskRowProps {
  task: Task;
  position: { start: number; duration: number };
  days: Date[];
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>, task: Task) => void;
  onEditClick: (task: Task) => void;
  onDeleteClick: (taskId: string) => void;
  getRoleColor: (roleId: string) => string;
  getRoleBorderColor: (roleId: string) => string;
  canUpdateProgress: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  position,
  days,
  onProgressClick,
  onEditClick,
  onDeleteClick,
  getRoleColor,
  getRoleBorderColor,
  canUpdateProgress,
  canEdit,
  canDelete,
}) => {
  return (
    <React.Fragment>
      {/* Task Info Column */}
      <div className="py-3 px-4 border-b border-gray-200 sticky left-0 bg-white z-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{task.name}</div>
            <div className="text-sm text-gray-500">
              {PROJECT_ROLES.find((role) => role.id === task.assignedRole)?.name}
              {task.assignee && ` - ${task.assignee}`}
            </div>
            <div className="text-xs text-gray-400">
              Progreso: {task.progress}%
            </div>
          </div>
          <div className="flex space-x-2">
            {canEdit && (
              <button
                onClick={() => onEditClick(task)}
                className="text-gray-400 hover:text-blue-500"
                title="Editar tarea"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDeleteClick(task.id)}
                className="text-gray-400 hover:text-red-500"
                title="Eliminar tarea"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task Timeline */}
      {Array.from({ length: days.length }).map((_, index) => (
        <div
          key={index}
          className={`border-b border-gray-200 ${
            index >= position.start && index < position.start + position.duration
              ? 'relative'
              : ''
          }`}
        >
          {index === position.start && (
            <div
              className={`absolute inset-y-0 flex items-center px-2 mx-1 ${
                canUpdateProgress ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              style={{
                width: `${position.duration * 100}%`,
                minWidth: '40px',
              }}
              onClick={(e) => canUpdateProgress && onProgressClick(e, task)}
            >
              <div className="relative w-full h-4">
                <div
                  className={`absolute inset-0 border-2 rounded-full ${getRoleBorderColor(
                    task.assignedRole
                  )}`}
                />
                <div
                  className={`absolute inset-y-0 left-0 ${getRoleColor(
                    task.assignedRole
                  )} rounded-full transition-all duration-200`}
                  style={{
                    width: `${task.progress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </React.Fragment>
  );
};