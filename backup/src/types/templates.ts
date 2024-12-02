import { ProjectRole } from './roles';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  tasks: {
    name: string;
    duration: number; // in days
    dependencies: string[];
    assignedRole: string;
  }[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'implementation-template',
    name: 'Plantilla de Implementación Estándar',
    description: 'Plantilla con hitos principales para proyectos de implementación',
    tasks: [
      {
        name: 'Configuración inicial',
        duration: 14,
        dependencies: [],
        assignedRole: ProjectRole.IMPLEMENTATION_LEADER
      },
      {
        name: 'Pruebas de integración',
        duration: 21,
        dependencies: ['configuracion-inicial'],
        assignedRole: ProjectRole.IMPLEMENTATION_LEADER
      },
      {
        name: 'Capacitación final',
        duration: 7,
        dependencies: ['pruebas-integracion'],
        assignedRole: ProjectRole.TRAINING_LEADER
      }
    ]
  },
  {
    id: 'continuous-improvement',
    name: 'Mejora Continua',
    description: 'Plantilla para proyectos de mejora continua y optimización',
    tasks: [
      {
        name: 'Análisis de situación actual',
        duration: 7,
        dependencies: [],
        assignedRole: ProjectRole.PROJECT_MANAGER
      },
      {
        name: 'Identificación de oportunidades de mejora',
        duration: 10,
        dependencies: ['analisis-situacion-actual'],
        assignedRole: ProjectRole.IMPLEMENTATION_LEADER
      },
      {
        name: 'Desarrollo de propuestas de mejora',
        duration: 14,
        dependencies: ['identificacion-oportunidades-mejora'],
        assignedRole: ProjectRole.IMPLEMENTATION_LEADER
      },
      {
        name: 'Implementación de mejoras',
        duration: 21,
        dependencies: ['desarrollo-propuestas-mejora'],
        assignedRole: ProjectRole.IMPLEMENTATION_LEADER
      },
      {
        name: 'Capacitación en nuevos procesos',
        duration: 7,
        dependencies: ['implementacion-mejoras'],
        assignedRole: ProjectRole.TRAINING_LEADER
      },
      {
        name: 'Evaluación de resultados',
        duration: 7,
        dependencies: ['capacitacion-nuevos-procesos'],
        assignedRole: ProjectRole.PROJECT_MANAGER
      }
    ]
  }
];