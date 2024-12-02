import { format, differenceInDays } from 'date-fns';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Project, Task } from '../../types/project';
import { calculateTaskStatus, getDaysLeft, calculateDuration } from './taskAnalytics';
import { ProjectExportData, TaskExportData, StatusAnalysis, RoleAnalysis } from './types';

const prepareTaskData = (task: Task): TaskExportData => {
  return {
    name: task.name,
    assignee: task.assignee || 'Sin asignar',
    role: task.assignedRole,
    startDate: format(new Date(task.startDate), 'dd/MM/yyyy'),
    endDate: format(new Date(task.endDate), 'dd/MM/yyyy'),
    duration: calculateDuration(task),
    progress: task.progress,
    status: calculateTaskStatus(task),
    daysLeft: getDaysLeft(task)
  };
};

const prepareProjectData = (project: Project): ProjectExportData => {
  return {
    name: project.name,
    description: project.description,
    startDate: format(new Date(project.startDate), 'dd/MM/yyyy'),
    endDate: format(new Date(project.endDate), 'dd/MM/yyyy'),
    duration: differenceInDays(new Date(project.endDate), new Date(project.startDate)),
    totalTasks: project.tasks.length,
    progress: Math.round(project.tasks.reduce((acc, task) => acc + task.progress, 0) / project.tasks.length),
    tasks: project.tasks.map(prepareTaskData)
  };
};

const analyzeTaskStatuses = (tasks: TaskExportData[]): StatusAnalysis[] => {
  const statuses = ['Atrasada', 'Riesgo Alto', 'Riesgo Medio', 'En Tiempo'];
  return statuses.map(status => {
    const tasksInStatus = tasks.filter(task => task.status === status);
    return {
      status,
      count: tasksInStatus.length,
      percentage: Math.round((tasksInStatus.length / tasks.length) * 100)
    };
  });
};

const analyzeRoles = (tasks: Task[]): RoleAnalysis[] => {
  const roleMap = new Map<string, { count: number; totalProgress: number }>();
  
  tasks.forEach(task => {
    const current = roleMap.get(task.assignedRole) || { count: 0, totalProgress: 0 };
    roleMap.set(task.assignedRole, {
      count: current.count + 1,
      totalProgress: current.totalProgress + task.progress
    });
  });

  return Array.from(roleMap.entries()).map(([role, data]) => ({
    role,
    tasksCount: data.count,
    averageProgress: Math.round(data.totalProgress / data.count)
  }));
};

export const exportToExcel = async (project: Project) => {
  const projectData = prepareProjectData(project);
  const statusAnalysis = analyzeTaskStatuses(projectData.tasks);
  const roleAnalysis = analyzeRoles(project.tasks);

  const wb = XLSX.utils.book_new();

  // Resumen Ejecutivo
  const summaryData = [
    ['RESUMEN EJECUTIVO DEL PROYECTO'],
    [''],
    ['Información General'],
    ['Nombre del Proyecto', projectData.name],
    ['Descripción', projectData.description],
    ['Fecha de Inicio', projectData.startDate],
    ['Fecha de Finalización', projectData.endDate],
    ['Duración Total (días)', projectData.duration],
    [''],
    ['Métricas del Proyecto'],
    ['Total de Tareas', projectData.totalTasks],
    ['Progreso General', `${projectData.progress}%`],
    ['']
  ];

  // Detalle de Tareas
  const taskDetails = [
    ['DETALLE DE TAREAS'],
    [''],
    ['Tarea', 'Responsable', 'Rol', 'Fecha Inicio', 'Fecha Fin', 'Duración (días)', 'Progreso', 'Estado', 'Días Restantes'],
    ...projectData.tasks.map(task => [
      task.name,
      task.assignee,
      task.role,
      task.startDate,
      task.endDate,
      task.duration,
      `${task.progress}%`,
      task.status,
      task.daysLeft > 0 ? task.daysLeft : 'Vencida'
    ])
  ];

  // Análisis
  const analysisData = [
    ['ANÁLISIS DE ESTADO'],
    [''],
    ['Estado', 'Cantidad', 'Porcentaje'],
    ...statusAnalysis.map(status => [
      status.status,
      status.count,
      `${status.percentage}%`
    ]),
    [''],
    ['ANÁLISIS POR ROL'],
    [''],
    ['Rol', 'Tareas Asignadas', 'Progreso Promedio'],
    ...roleAnalysis.map(role => [
      role.role,
      role.tasksCount,
      `${role.averageProgress}%`
    ])
  ];

  // Crear las hojas
  const wsResumen = XLSX.utils.aoa_to_sheet(summaryData);
  const wsTareas = XLSX.utils.aoa_to_sheet(taskDetails);
  const wsAnalisis = XLSX.utils.aoa_to_sheet(analysisData);

  // Agregar las hojas al libro
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Ejecutivo');
  XLSX.utils.book_append_sheet(wb, wsTareas, 'Detalle de Tareas');
  XLSX.utils.book_append_sheet(wb, wsAnalisis, 'Análisis');

  // Generar y guardar el archivo
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `reporte-${project.name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};