import axios from 'axios';

const FIGMA_API_BASE = 'https://api.figma.com/v1';

export async function testFigmaConnection() {
  try {
    const token = import.meta.env.VITE_FIGMA_ACCESS_TOKEN;
    const fileId = import.meta.env.VITE_FIGMA_FILE_ID;

    if (!token || !fileId) {
      return {
        success: false,
        message: 'Faltan credenciales de Figma'
      };
    }

    const response = await axios.get(
      `${FIGMA_API_BASE}/files/${fileId}`,
      {
        headers: {
          'X-Figma-Token': token
        }
      }
    );

    return {
      success: true,
      message: 'Conexión exitosa con Figma',
      fileInfo: {
        name: response.data.name,
        lastModified: response.data.lastModified
      }
    };

  } catch (error) {
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
      message: 'Error al conectar con Figma'
    };
  }
}