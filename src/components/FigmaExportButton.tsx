import React, { useState } from 'react';
import { Share } from 'lucide-react';
import { createFigmaAPI } from '../utils/figmaApi';
import { Project } from '../types/project';

interface FigmaExportButtonProps {
  project: Project;
}

export const FigmaExportButton: React.FC<FigmaExportButtonProps> = ({ project }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const figmaApi = createFigmaAPI({
        accessToken: import.meta.env.VITE_FIGMA_ACCESS_TOKEN,
        fileId: import.meta.env.VITE_FIGMA_FILE_ID
      });

      // Simplificar los datos antes de enviarlos
      const projectData = {
        name: project.name,
        tasks: project.tasks.map(task => ({
          name: task.name,
          progress: task.progress
        }))
      };

      const result = await figmaApi.updateFrame(projectData);

      if (result.success) {
        setExportStatus('Proyecto exportado exitosamente');
      } else {
        setExportStatus(result.message || 'Error al exportar');
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      setExportStatus('Error al exportar a Figma');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
      >
        <Share className="h-5 w-5 mr-2" />
        {isExporting ? 'Exportando...' : 'Exportar a Figma'}
      </button>

      {exportStatus && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 p-2 rounded text-sm ${
            exportStatus.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {exportStatus}
        </div>
      )}
    </div>
  );
};