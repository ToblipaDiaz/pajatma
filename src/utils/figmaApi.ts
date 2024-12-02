import axios from 'axios';

const FIGMA_API_BASE = 'https://api.figma.com/v1';

interface FigmaConfig {
  accessToken: string;
  fileId: string;
}

export class FigmaAPI {
  private config: FigmaConfig;

  constructor(config: FigmaConfig) {
    this.config = config;
  }

  private get headers() {
    return {
      'X-Figma-Token': this.config.accessToken,
      'Content-Type': 'application/json'
    };
  }

  async testConnection() {
    try {
      const response = await axios.get(
        `${FIGMA_API_BASE}/files/${this.config.fileId}`,
        { headers: this.headers }
      );
      
      return {
        success: true,
        message: 'Conexión exitosa con Figma'
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          return {
            success: false,
            message: 'No tienes permisos suficientes en el archivo'
          };
        }
        if (error.response?.status === 404) {
          return {
            success: false,
            message: 'Archivo no encontrado'
          };
        }
      }
      return {
        success: false,
        message: 'Error al conectar con Figma'
      };
    }
  }

  async updateFrame(projectData: any) {
    try {
      const frameId = import.meta.env.VITE_FIGMA_FRAME_ID;
      
      // Simplificar la estructura de datos para evitar problemas de serialización
      const frameContent = {
        name: projectData.name,
        type: "FRAME",
        children: [{
          type: "TEXT",
          characters: projectData.name,
          style: { fontSize: 24 }
        }]
      };

      // Agregar tareas como elementos de texto simples
      projectData.tasks.forEach((task: any, index: number) => {
        frameContent.children.push({
          type: "TEXT",
          characters: `${task.name} - ${task.progress}%`,
          style: { fontSize: 14 }
        });
      });

      const response = await axios.patch(
        `${FIGMA_API_BASE}/files/${this.config.fileId}/nodes/${frameId}`,
        { frameContent },
        { headers: this.headers }
      );

      return {
        success: true,
        message: 'Frame actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar frame:', error);
      return {
        success: false,
        message: 'Error al actualizar el frame'
      };
    }
  }
}

export const createFigmaAPI = (config: FigmaConfig) => new FigmaAPI(config);