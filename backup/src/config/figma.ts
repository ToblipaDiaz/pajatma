import { Client } from 'figma-js';

// Get environment variables
const FIGMA_ACCESS_TOKEN = import.meta.env.VITE_FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_ID = import.meta.env.VITE_FIGMA_FILE_ID;

// Validación más estricta de las variables de entorno
if (!FIGMA_ACCESS_TOKEN || FIGMA_ACCESS_TOKEN === 'undefined') {
  console.error('Error: VITE_FIGMA_ACCESS_TOKEN no está configurado correctamente');
}

if (!FIGMA_FILE_ID || FIGMA_FILE_ID === 'undefined') {
  console.error('Error: VITE_FIGMA_FILE_ID no está configurado correctamente');
}

// Crear el cliente de Figma solo si tenemos las credenciales
export const figmaClient = FIGMA_ACCESS_TOKEN ? Client({
  accessToken: FIGMA_ACCESS_TOKEN
}) : null;

export { FIGMA_FILE_ID };