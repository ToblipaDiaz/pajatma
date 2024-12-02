export enum ProjectRole {
  IMPLEMENTATION_LEADER = 'IMPLEMENTATION_LEADER',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TRAINING_LEADER = 'TRAINING_LEADER'
}

export interface RoleDefinition {
  id: ProjectRole;
  name: string;
  description: string;
}

export const PROJECT_ROLES: RoleDefinition[] = [
  {
    id: ProjectRole.IMPLEMENTATION_LEADER,
    name: 'Líder de Implementación',
    description: 'Responsable de la implementación técnica del proyecto'
  },
  {
    id: ProjectRole.PROJECT_MANAGER,
    name: 'Gerente de Proyecto',
    description: 'Responsable de la gestión general del proyecto'
  },
  {
    id: ProjectRole.TRAINING_LEADER,
    name: 'Líder de Capacitación',
    description: 'Responsable de la capacitación y documentación'
  }
];