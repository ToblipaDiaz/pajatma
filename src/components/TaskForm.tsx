import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Task } from '../types/project';
import { PROJECT_ROLES, ProjectRole } from '../types/roles';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/auth';

interface TaskFormProps {
  projectId: string;
  existingTasks: Task[];
  initialData?: Task;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  onCancel: () => void;
  readOnlyMode?: boolean;
}

const roleMapping = {
  [ProjectRole.IMPLEMENTATION_LEADER]: UserRole.IMPLEMENTATION_LEADER,
  [ProjectRole.PROJECT_MANAGER]: UserRole.PROJECT_MANAGER,
  [ProjectRole.TRAINING_LEADER]: UserRole.TRAINING_LEADER,
};

export const TaskForm: React.FC<TaskFormProps> = ({
  existingTasks,
  initialData,
  onSubmit,
  onCancel,
  readOnlyMode = false,
}) => {
  const { users } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    progress: 0,
    dependencies: [] as string[],
    assignedRole: '' as ProjectRole,
    assignee: '',
    comments: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        startDate: format(new Date(initialData.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(initialData.endDate), 'yyyy-MM-dd'),
        progress: initialData.progress,
        dependencies: initialData.dependencies,
        assignedRole: initialData.assignedRole,
        assignee: initialData.assignee || '',
        comments: initialData.comments || '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      progress: Number(formData.progress),
    });
  };

  // Filter users based on selected role
  const availableUsers = users.filter(
    (user) => user.role === roleMapping[formData.assignedRole as ProjectRole]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la Tarea
        </label>
        <input
          type="text"
          required
          disabled={readOnlyMode}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Inicio
          </label>
          <div className="mt-1 relative">
            <input
              type="date"
              required
              disabled={readOnlyMode}
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <Calendar className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Fin
          </label>
          <div className="mt-1 relative">
            <input
              type="date"
              required
              disabled={readOnlyMode}
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
            <Calendar className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Progreso (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.progress}
          onChange={(e) =>
            setFormData({ ...formData, progress: Number(e.target.value) })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Rol Asignado
        </label>
        <select
          required
          disabled={readOnlyMode}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          value={formData.assignedRole}
          onChange={(e) =>
            setFormData({
              ...formData,
              assignedRole: e.target.value as ProjectRole,
              assignee: '', // Clear assignee when role changes
            })
          }
        >
          <option value="">Seleccionar rol</option>
          {PROJECT_ROLES.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Responsable
        </label>
        <select
          required
          disabled={!formData.assignedRole || readOnlyMode}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          value={formData.assignee}
          onChange={(e) =>
            setFormData({ ...formData, assignee: e.target.value })
          }
        >
          <option value="">Seleccionar responsable</option>
          {availableUsers.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Dependencias
        </label>
        <select
          multiple
          disabled={readOnlyMode}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          value={formData.dependencies}
          onChange={(e) =>
            setFormData({
              ...formData,
              dependencies: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            })
          }
        >
          {existingTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comentarios
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          placeholder="Agregar comentarios sobre la tarea..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData ? 'Actualizar Tarea' : 'Crear Tarea'}
        </button>
      </div>
    </form>
  );
};