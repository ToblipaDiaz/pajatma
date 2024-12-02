import { Task } from '../../types/project';

export interface TaskExportData {
  name: string;
  assignee: string;
  role: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  status: string;
  daysLeft: number;
}

export interface ProjectExportData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalTasks: number;
  progress: number;
  tasks: TaskExportData[];
}

export interface StatusAnalysis {
  status: string;
  count: number;
  percentage: number;
}

export interface RoleAnalysis {
  role: string;
  tasksCount: number;
  averageProgress: number;
}