import { ProjectRole } from './roles';
import { ClientType } from './auth';

export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  dependencies: string[];
  assignedRole: ProjectRole;
  assignee?: string;
  comments?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client: ClientType;
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