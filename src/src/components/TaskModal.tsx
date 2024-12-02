import React from 'react';
import { X } from 'lucide-react';
import { Task } from '../types/project';
import { TaskForm } from './TaskForm';
import { User, UserRole } from '../types/auth';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  projectId: string;
  existingTasks: Task[];
  onSubmit: (task: Omit<Task, 'id'>) => void;
  currentUser: User | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  projectId,
  existingTasks,
  onSubmit,
  currentUser,
}) => {
  if (!isOpen) return null;

  const canEditAllFields = currentUser?.role === UserRole.ADMIN || 
                         currentUser?.role === UserRole.PROJECT_MANAGER;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg w-full max-w-2xl mx-auto shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">
              {canEditAllFields
                ? task
                  ? 'Editar Tarea'
                  : 'Nueva Tarea'
                : 'Actualizar Progreso'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            <TaskForm
              projectId={projectId}
              existingTasks={existingTasks.filter((t) => t.id !== task?.id)}
              initialData={task}
              onSubmit={onSubmit}
              onCancel={onClose}
              readOnlyMode={!canEditAllFields}
            />
          </div>
        </div>
      </div>
    </div>
  );
};