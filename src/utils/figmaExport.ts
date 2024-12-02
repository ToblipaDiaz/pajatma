import { Project } from '../types/project';
import axios from 'axios';

const FIGMA_API_BASE = 'https://api.figma.com/v1';

export async function exportProjectToFigma(project: Project) {
  try {
    const token = import.meta.env.VITE_FIGMA_ACCESS_TOKEN;
    const fileId = import.meta.env.VITE_FIGMA_FILE_ID;

    if (!token || !fileId) {
      throw new Error('Faltan credenciales de Figma');
    }

    // Crear un objeto simple y plano para evitar problemas de serialización
    const projectData = {
      name: project.name,
      description: project.description,
      tasks: project.tasks.map(task => ({
        name: task.name,
        startDate: task.startDate.toISOString().split('T')[0],
        endDate: task.endDate.toISOString().split('T')[0],
        progress: task.progress,
        assignee: task.assignee || 'Sin asignar'
      }))
    };

    // Crear la estructura del frame
    const frameData = {
      name: project.name,
      type: 'FRAME',
      children: [
        {
          name: 'Project Info',
          type: 'TEXT',
          characters: `${project.name}\n${project.description}`,
          style: { fontSize: 24 }
        },
        ...projectData.tasks.map((task, index) => ({
          name: task.name,
          type: 'TEXT',
          x: 0,
          y: 100 + (index * 50),
          characters: `${task.name} - Progreso: ${task.progress}%\nFecha: ${task.startDate} - ${task.endDate}\nResponsable: ${task.assignee}`,
          style: { fontSize: 14 }
        }))
      ]
    };

    const response = await axios.post(
      `${FIGMA_API_BASE}/files/${fileId}/nodes`,
      frameData,
      {
        headers: {
          'X-Figma-Token': token,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      message: 'Proyecto exportado exitosamente',
      data: response.data
    };

  } catch (error) {
    console.error('Error exportando a Figma:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        return {
          success: false,
          message: 'No tienes permisos suficientes en el archivo de Figma'
        };
      }
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'No se encontró el archivo de Figma'
        };
      }
    }
    
    return {
      success: false,
      message: 'Error al exportar a Figma'
    };
  }
}