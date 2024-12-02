import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Project } from '../types/project';
import { PROJECT_TEMPLATES } from '../types/templates';
import { ProjectRole } from '../types/roles';
import { ClientType } from '../types/auth';

interface ProjectFormProps {
  onSubmit: (project: Omit<Project, 'id'>) => void;
  initialData?: Project;
  isEditing?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ 
  onSubmit, 
  initialData,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    templateId: '',
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    client: ClientType.SSMO,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        templateId: '',
        name: initialData.name,
        description: initialData.description,
        startDate: format(new Date(initialData.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(initialData.endDate), 'yyyy-MM-dd'),
        client: initialData.client,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date(formData.startDate);
    let tasks = initialData?.tasks || [];

    if (formData.templateId && !isEditing) {
      const template = PROJECT_TEMPLATES.find(t => t.id === formData.templateId);
      if (template) {
        let currentDate = startDate;
        tasks = template.tasks.map((templateTask) => {
          const taskStartDate = currentDate;
          const taskEndDate = new Date(currentDate);
          taskEndDate.setDate(taskEndDate.getDate() + templateTask.duration - 1);
          currentDate = new Date(taskEndDate);
          currentDate.setDate(currentDate.getDate() + 1);

          return {
            id: crypto.randomUUID(),
            name: templateTask.name,
            startDate: taskStartDate,
            endDate: taskEndDate,
            progress: 0,
            dependencies: templateTask.dependencies,
            assignedRole: templateTask.assignedRole as ProjectRole,
          };
        });
      }
    }

    onSubmit({
      name: formData.name,
      description: formData.description,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      client: formData.client,
      tasks,
      teamMembers: initialData?.teamMembers || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Plantilla
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.templateId}
            onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
          >
            <option value="">Sin plantilla</option>
            {PROJECT_TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          {formData.templateId && (
            <p className="mt-1 text-sm text-gray-500">
              {PROJECT_TEMPLATES.find(t => t.id === formData.templateId)?.description}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del Proyecto
        </label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cliente
        </label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value as ClientType })}
        >
          {Object.values(ClientType).map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
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
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
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
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
            <Calendar className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto'}
      </button>
    </form>
  );
};