import { Client } from 'figma-js';
import { figmaClient, FIGMA_FILE_ID } from '../config/figma';

export interface DesignToken {
  name: string;
  value: string;
  type: 'color' | 'spacing' | 'typography' | 'shadow';
}

export async function syncDesignTokens(): Promise<DesignToken[]> {
  try {
    const file = await figmaClient.file(FIGMA_FILE_ID);
    const styles = file.data.styles;
    
    return Object.values(styles).map(style => ({
      name: style.name,
      value: style.description,
      type: style.styleType.toLowerCase() as DesignToken['type']
    }));
  } catch (error) {
    console.error('Error syncing design tokens:', error);
    return [];
  }
}

export async function syncComponents() {
  try {
    const components = await figmaClient.fileComponents(FIGMA_FILE_ID);
    return components.data;
  } catch (error) {
    console.error('Error syncing components:', error);
    return null;
  }
}