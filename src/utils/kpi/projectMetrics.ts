import { Project } from '../../types/project';
import { differenceInDays } from 'date-fns';
import { calculateTaskStatus } from '../export/taskAnalytics';

export const calculateProjectMetrics = (project: Project) => {
  const today = new Date();
  const projectStart = new Date(project.startDate);
  const projectEnd = new Date(project.endDate);
  
  // Calculate expected progress based on timeline
  const totalDuration = differenceInDays(projectEnd, projectStart);
  const elapsed = differenceInDays(today, projectStart);
  const expectedProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  // Calculate actual progress
  const progress = project.tasks.length > 0
    ? project.tasks.reduce((acc, task) => acc + task.progress, 0) / project.tasks.length
    : 0;

  // Calculate task status distribution
  const tasksByStatus = project.tasks.reduce(
    (acc, task) => {
      const status = calculateTaskStatus(task);
      switch (status) {
        case 'En Tiempo':
          acc.onTime++;
          break;
        case 'Riesgo Medio':
          acc.mediumRisk++;
          break;
        case 'Riesgo Alto':
          acc.highRisk++;
          break;
        case 'Atrasada':
          acc.late++;
          break;
      }
      return acc;
    },
    { onTime: 0, mediumRisk: 0, highRisk: 0, late: 0 }
  );

  return {
    progress,
    expectedProgress,
    tasksByStatus,
    totalTasks: project.tasks.length,
    completedTasks: project.tasks.filter(task => task.progress === 100).length,
  };
};