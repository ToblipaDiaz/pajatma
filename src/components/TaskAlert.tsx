import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Task } from '../types/project';
import { useAlertStore } from '../store/alertStore';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/auth';

interface TaskAlertProps {
  task: Task;
  projectEndDate: Date;
}

export const TaskAlert: React.FC<TaskAlertProps> = ({ task, projectEndDate }) => {
  const { currentUser } = useAuthStore();
  const { addAlert, updateAlert, getAlertByTaskId } = useAlertStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const existingAlert = getAlertByTaskId(task.id);

  const getAlertType = () => {
    if (task.progress === 100) {
      return 'success';
    }

    if (task.progress === 0 && !existingAlert) {
      return 'help';
    }

    const today = new Date();
    const taskEnd = new Date(task.endDate);
    const daysLeft = Math.ceil((taskEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const totalDuration = Math.ceil((taskEnd.getTime() - new Date(task.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const expectedProgress = (totalDuration - daysLeft) / totalDuration * 100;

    if (today > taskEnd) {
      return 'danger';
    }
    if (task.progress < expectedProgress - 20) {
      return 'danger';
    }
    if (task.progress < expectedProgress - 10) {
      return 'warning';
    }
    return 'success';
  };

  const alertType = getAlertType();
  const alertColor = {
    danger: 'text-red-500',
    warning: 'text-yellow-500',
    success: 'text-green-500',
    help: 'text-gray-400'
  }[alertType];

  const canEditAlert = currentUser?.role === UserRole.ADMIN || 
                      currentUser?.role === UserRole.PROJECT_MANAGER ||
                      task.assignee === currentUser?.name;

  const handleSaveAlert = () => {
    if (!message.trim() || !currentUser) return;

    if (existingAlert) {
      updateAlert(existingAlert.id, message);
    } else {
      addAlert({
        taskId: task.id,
        message,
        createdBy: currentUser.name,
      });
    }
    setIsEditing(false);
  };

  const getIcon = () => {
    if (task.progress === 100) {
      return <CheckCircle2 className="h-4 w-4" />;
    }
    if (task.progress === 0 && !existingAlert) {
      return <HelpCircle className="h-4 w-4" />;
    }
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <div className="relative inline-block">
      <button
        className={`p-1 rounded-full hover:bg-gray-100 ${alertColor}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => canEditAlert && setIsEditing(true)}
        title={task.progress === 0 ? 'Tarea no iniciada' : undefined}
      >
        {getIcon()}
      </button>

      {(showTooltip || isEditing) && (
        <div 
          className="absolute z-50 w-64 p-2 mt-1 text-sm bg-white rounded-lg shadow-lg border border-gray-200"
          style={{
            left: '100%',
            marginLeft: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                className="w-full p-2 border rounded"
                value={message || existingAlert?.message || ''}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje de alerta..."
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAlert}
                  className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <div>
              {existingAlert ? (
                <>
                  <p className="font-medium mb-1">Alerta</p>
                  <p>{existingAlert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Por: {existingAlert.createdBy}
                  </p>
                </>
              ) : (
                <p>
                  {task.progress === 100
                    ? 'Tarea completada'
                    : task.progress === 0 && !existingAlert
                    ? 'Tarea sin iniciar'
                    : alertType === 'danger'
                    ? 'Tarea atrasada o en riesgo crítico'
                    : alertType === 'warning'
                    ? 'Tarea en riesgo de atraso'
                    : 'Tarea en tiempo'}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};