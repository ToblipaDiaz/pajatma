export enum UserRole {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  IMPLEMENTATION_LEADER = 'IMPLEMENTATION_LEADER',
  TRAINING_LEADER = 'TRAINING_LEADER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete';
  subject: 'project' | 'task' | 'comment' | 'progress' | 'user';
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    { action: 'create', subject: 'user' },
    { action: 'read', subject: 'user' },
    { action: 'update', subject: 'user' },
    { action: 'delete', subject: 'user' },
    { action: 'create', subject: 'project' },
    { action: 'read', subject: 'project' },
    { action: 'update', subject: 'project' },
    { action: 'delete', subject: 'project' },
    { action: 'create', subject: 'task' },
    { action: 'read', subject: 'task' },
    { action: 'update', subject: 'task' },
    { action: 'delete', subject: 'task' },
  ],
  [UserRole.PROJECT_MANAGER]: [
    { action: 'create', subject: 'project' },
    { action: 'read', subject: 'project' },
    { action: 'update', subject: 'project' },
    { action: 'create', subject: 'task' },
    { action: 'read', subject: 'task' },
    { action: 'update', subject: 'task' },
    { action: 'delete', subject: 'task' },
  ],
  [UserRole.IMPLEMENTATION_LEADER]: [
    { action: 'read', subject: 'project' },
    { action: 'read', subject: 'task' },
    { action: 'update', subject: 'progress' },
    { action: 'create', subject: 'comment' },
    { action: 'read', subject: 'comment' },
  ],
  [UserRole.TRAINING_LEADER]: [
    { action: 'read', subject: 'project' },
    { action: 'read', subject: 'task' },
    { action: 'update', subject: 'progress' },
    { action: 'create', subject: 'comment' },
    { action: 'read', subject: 'comment' },
  ],
};