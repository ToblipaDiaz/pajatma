import { ProjectRole } from './roles';

export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  dependencies: string[];
  assignedRole: ProjectRole;
  assignee?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  startDate: Date;
  endDate: Date;
  teamMembers: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: ProjectRole;
}