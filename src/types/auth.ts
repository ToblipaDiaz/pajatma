export enum UserRole {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  IMPLEMENTATION_LEADER = 'IMPLEMENTATION_LEADER',
  TRAINING_LEADER = 'TRAINING_LEADER',
  VIEWER = 'VIEWER'
}

export enum ClientType {
  SSMO = 'SSMO',
  SSMS = 'SSMS',
  HOSMIL = 'HOSMIL',
  REDSALUD = 'REDSALUD',
  HRC = 'HRC'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  client: ClientType;
}

export interface Permission {
  action: 'create' | 'read' | 'update' | 'delete' | 'export';
  subject: 'project' | 'task' | 'comment' | 'progress' | 'user' | 'report';
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
    { action: 'export', subject: 'report' },
  ],
  [UserRole.PROJECT_MANAGER]: [
    { action: 'create', subject: 'project' },
    { action: 'read', subject: 'project' },
    { action: 'update', subject: 'project' },
    { action: 'delete', subject: 'project' },
    { action: 'create', subject: 'task' },
    { action: 'read', subject: 'task' },
    { action: 'update', subject: 'task' },
    { action: 'delete', subject: 'task' },
    { action: 'export', subject: 'report' },
  ],
  [UserRole.IMPLEMENTATION_LEADER]: [
    { action: 'read', subject: 'project' },
    { action: 'read', subject: 'task' },
    { action: 'update', subject: 'progress' },
    { action: 'create', subject: 'comment' },
    { action: 'read', subject: 'comment' },
    { action: 'export', subject: 'report' },
  ],
  [UserRole.TRAINING_LEADER]: [
    { action: 'read', subject: 'project' },
    { action: 'read', subject: 'task' },
    { action: 'update', subject: 'progress' },
    { action: 'create', subject: 'comment' },
    { action: 'read', subject: 'comment' },
    { action: 'export', subject: 'report' },
  ],
  [UserRole.VIEWER]: [
    { action: 'read', subject: 'project' },
    { action: 'read', subject: 'task' },
    { action: 'export', subject: 'report' },
  ],
};