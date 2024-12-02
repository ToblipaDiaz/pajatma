import React, { useState } from 'react';
import { format, eachDayOfInterval, eachMonthOfInterval, isSameMonth, differenceInDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task } from '../types/project';
import { PROJECT_ROLES } from '../types/roles';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { TaskModal } from './TaskModal';
import { MonthHeader } from './GanttChart/MonthHeader';
import { TaskRow } from './GanttChart/TaskRow';
import { UserRole } from '../types/auth';

interface GanttChartProps {
  tasks: Task[];
  startDate: Date;
  endDate: Date;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  startDate,
  endDate,
}) => {
  const { updateTask, selectedProject, deleteTask } = useProjectStore();
  const { currentUser, can } = useAuthStore();
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const days = eachDayOfInterval({ start: startOfDay(new Date(startDate)), end: startOfDay(new Date(endDate)) });
  const months = eachMonthOfInterval({ start: startOfDay(new Date(startDate)), end: startOfDay(new Date(endDate)) });

  const getRoleColor = (roleId: string) => {
    const colors: Record<string, string> = {
      IMPLEMENTATION_LEADER: 'bg-blue-500',
      PROJECT_MANAGER: 'bg-green-500',
      TRAINING_LEADER: 'bg-purple-500',
    };
    return colors[roleId] || 'bg-gray-500';
  };

  const getRoleBorderColor = (roleId: string) => {
    const colors: Record<string, string> = {
      IMPLEMENTATION_LEADER: 'border-blue-500',
      PROJECT_MANAGER: 'border-green-500',
      TRAINING_LEADER: 'border-purple-500',
    };
    return colors[roleId] || 'border-gray-500';
  };

  const getTaskPosition = (task: Task) => {
    const taskStart = startOfDay(new Date(task.startDate));
    const taskEnd = startOfDay(new Date(task.endDate));
    const projectStart = startOfDay(new Date(startDate));
    
    const startDiff = differenceInDays(taskStart, projectStart);
    const duration = differenceInDays(taskEnd, taskStart) + 1;
    
    return {
      start: startDiff,
      duration: Math.max(1, duration)
    };
  };

  const canUpdateTaskProgress = (task: Task) => {
    if (!currentUser) return false;

    // Admin and Project Manager can update any task
    if ([UserRole.ADMIN, UserRole.PROJECT_MANAGER].includes(currentUser.role)) {
      return true;
    }

    // Other roles can only update their assigned tasks
    return task.assignee === currentUser.name;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>, task: Task) => {
    if (!canUpdateTaskProgress(task)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = Math.round((x / width) * 100);
    
    updateTask(selectedProject!.id, {
      ...task,
      progress: Math.max(0, Math.min(100, newProgress))
    });
  };

  const handleEditTask = (task: Task) => {
    if (!can('update', 'task', task.id, task.assignee)) return;
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskUpdate = (taskData: Omit<Task, 'id'>) => {
    if (selectedTask && selectedProject) {
      if (!can('update', 'task', selectedTask.id, selectedTask.assignee)) return;
      
      // For non-admin/PM users, only allow updating progress
      if (![UserRole.ADMIN, UserRole.PROJECT_MANAGER].includes(currentUser?.role || UserRole.ADMIN)) {
        taskData = {
          ...selectedTask,
          progress: taskData.progress
        };
      }

      updateTask(selectedProject.id, {
        ...taskData,
        id: selectedTask.id
      });
      setIsTaskModalOpen(false);
      setSelectedTask(undefined);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (!can('delete', 'task')) return;
    if (selectedProject && confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      deleteTask(selectedProject.id, taskId);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div
            className="grid gap-0"
            style={{
              gridTemplateColumns: `300px repeat(${days.length}, minmax(40px, 1fr))`,
            }}
          >
            {/* Month Headers */}
            <div className="bg-gray-50 border-b border-gray-200 sticky left-0 z-10"></div>
            <MonthHeader months={months} days={days} />

            {/* Day Headers */}
            <div className="py-2 px-4 font-semibold bg-gray-50 border-b border-gray-200 sticky left-0 z-10">
              Tarea
            </div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className="border-l border-gray-200 bg-gray-50 text-center text-sm py-2 border-b"
              >
                {format(day, 'd')}
              </div>
            ))}

            {/* Tasks */}
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                position={getTaskPosition(task)}
                days={days}
                onProgressClick={handleProgressClick}
                onEditClick={handleEditTask}
                onDeleteClick={handleDeleteTask}
                getRoleColor={getRoleColor}
                getRoleBorderColor={getRoleBorderColor}
                canUpdateProgress={canUpdateTaskProgress(task)}
                canEdit={can('update', 'task', task.id, task.assignee)}
                canDelete={can('delete', 'task')}
                projectEndDate={endDate}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-4 justify-end">
          {PROJECT_ROLES.map((role) => (
            <div key={role.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${getRoleColor(role.id)}`}></div>
              <span className="text-sm text-gray-600">{role.name}</span>
            </div>
          ))}
        </div>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(undefined);
        }}
        task={selectedTask}
        projectId={selectedProject?.id || ''}
        existingTasks={tasks}
        onSubmit={handleTaskUpdate}
        currentUser={currentUser}
      />
    </>
  );
};