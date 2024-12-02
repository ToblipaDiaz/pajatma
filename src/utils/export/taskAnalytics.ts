import { differenceInDays } from 'date-fns';
import { Task } from '../../types/project';

export const calculateTaskStatus = (task: Task): string => {
  const today = new Date();
  const taskEnd = new Date(task.endDate);
  const daysLeft = differenceInDays(taskEnd, today);
  const totalDuration = differenceInDays(taskEnd, new Date(task.startDate));
  const expectedProgress = ((totalDuration - daysLeft) / totalDuration) * 100;

  if (today > taskEnd) return 'Atrasada';
  if (task.progress < expectedProgress - 20) return 'Riesgo Alto';
  if (task.progress < expectedProgress - 10) return 'Riesgo Medio';
  return 'En Tiempo';
};

export const getDaysLeft = (task: Task): number => {
  return differenceInDays(new Date(task.endDate), new Date());
};

export const calculateDuration = (task: Task): number => {
  return differenceInDays(new Date(task.endDate), new Date(task.startDate));
};