import { Task } from '../../types/project';
import { format, eachDayOfInterval } from 'date-fns';

export const calculateTaskMetrics = (tasks: Task[]) => {
  // Calculate progress trend
  const allDates = tasks.flatMap(task => [
    new Date(task.startDate),
    new Date(task.endDate)
  ]).sort((a, b) => a.getTime() - b.getTime());

  const dateRange = eachDayOfInterval({
    start: allDates[0],
    end: allDates[allDates.length - 1]
  });

  const progressTrend = dateRange.map(date => {
    const activeTasks = tasks.filter(task => 
      new Date(task.startDate) <= date && new Date(task.endDate) >= date
    );
    return activeTasks.length > 0
      ? activeTasks.reduce((acc, task) => acc + task.progress, 0) / activeTasks.length
      : 0;
  });

  // Calculate metrics by role
  const roleMetrics = tasks.reduce((acc, task) => {
    const role = acc.find(r => r.role === task.assignedRole);
    if (role) {
      role.taskCount++;
      role.totalProgress += task.progress;
    } else {
      acc.push({
        role: task.assignedRole,
        taskCount: 1,
        totalProgress: task.progress
      });
    }
    return acc;
  }, [] as Array<{ role: string; taskCount: number; totalProgress: number }>)
  .map(role => ({
    ...role,
    averageProgress: Math.round(role.totalProgress / role.taskCount)
  }));

  return {
    dates: dateRange.map(date => format(date, 'dd/MM')),
    progressTrend,
    roleMetrics
  };
};