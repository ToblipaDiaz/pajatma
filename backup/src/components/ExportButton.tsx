import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Project } from '../types/project';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportButtonProps {
  project: Project;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ project }) => {
  const [isExporting, setIsExporting] = useState(false);

  const calculateTaskStatus = (task: any) => {
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

  const exportToExcel = async () => {
    try {
      setIsExporting(true);

      // Crear el libro de trabajo
      const wb = XLSX.utils.book_new();

      // Resumen Ejecutivo
      const summaryData = [
        ['RESUMEN EJECUTIVO DEL PROYECTO'],
        [''],
        ['Información General'],
        ['Nombre del Proyecto', project.name],
        ['Descripción', project.description],
        ['Fecha de Inicio', format(new Date(project.startDate), 'dd/MM/yyyy')],
        ['Fecha de Finalización', format(new Date(project.endDate), 'dd/MM/yyyy')],
        ['Duración Total (días)', differenceInDays(new Date(project.endDate), new Date(project.startDate))],
        [''],
        ['Métricas del Proyecto'],
        ['Total de Tareas', project.tasks.length],
        ['Progreso General', `${Math.round(project.tasks.reduce((acc, task) => acc + task.progress, 0) / project.tasks.length)}%`],
        ['']
      ];

      // Detalle de Tareas
      const taskDetails = [
        ['DETALLE DE TAREAS'],
        [''],
        [
          'Tarea',
          'Responsable',
          'Rol',
          'Fecha Inicio',
          'Fecha Fin',
          'Duración (días)',
          'Progreso',
          'Estado',
          'Días Restantes'
        ],
        ...project.tasks.map(task => {
          const daysLeft = differenceInDays(new Date(task.endDate), new Date());
          const duration = differenceInDays(new Date(task.endDate), new Date(task.startDate));
          return [
            task.name,
            task.assignee || 'Sin asignar',
            task.assignedRole,
            format(new Date(task.startDate), 'dd/MM/yyyy'),
            format(new Date(task.endDate), 'dd/MM/yyyy'),
            duration,
            `${task.progress}%`,
            calculateTaskStatus(task),
            daysLeft > 0 ? daysLeft : 'Vencida'
          ];
        })
      ];

      // Análisis de Estado
      const statusAnalysis = [
        [''],
        ['ANÁLISIS DE ESTADO'],
        [''],
        ['Estado', 'Cantidad', 'Porcentaje'],
        ...['Atrasada', 'Riesgo Alto', 'Riesgo Medio', 'En Tiempo'].map(status => {
          const tasksInStatus = project.tasks.filter(task => calculateTaskStatus(task) === status);
          return [
            status,
            tasksInStatus.length,
            `${Math.round((tasksInStatus.length / project.tasks.length) * 100)}%`
          ];
        })
      ];

      // Análisis por Rol
      const roleAnalysis = [
        [''],
        ['ANÁLISIS POR ROL'],
        [''],
        ['Rol', 'Tareas Asignadas', 'Progreso Promedio'],
        ...Array.from(new Set(project.tasks.map(task => task.assignedRole))).map(role => {
          const tasksForRole = project.tasks.filter(task => task.assignedRole === role);
          const avgProgress = tasksForRole.reduce((acc, task) => acc + task.progress, 0) / tasksForRole.length;
          return [
            role,
            tasksForRole.length,
            `${Math.round(avgProgress)}%`
          ];
        })
      ];

      // Crear las hojas de trabajo
      const wsResumen = XLSX.utils.aoa_to_sheet([...summaryData]);
      const wsTareas = XLSX.utils.aoa_to_sheet([...taskDetails]);
      const wsAnalisis = XLSX.utils.aoa_to_sheet([...statusAnalysis, ...roleAnalysis]);

      // Agregar las hojas al libro
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen Ejecutivo');
      XLSX.utils.book_append_sheet(wb, wsTareas, 'Detalle de Tareas');
      XLSX.utils.book_append_sheet(wb, wsAnalisis, 'Análisis');

      // Generar el archivo
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      
      // Guardar el archivo
      saveAs(blob, `reporte-${project.name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

    } catch (error) {
      console.error('Error al exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={isExporting}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
    >
      <Download className="h-5 w-5 mr-2" />
      {isExporting ? 'Exportando...' : 'Exportar Reporte'}
    </button>
  );
};