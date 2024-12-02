import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Project } from '../types/project';
import { exportToExcel } from '../utils/export/excelExport';

interface ExportButtonProps {
  project: Project;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ project }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportToExcel(project);
    } catch (error) {
      console.error('Error al exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
    >
      <Download className="h-5 w-5 mr-2" />
      {isExporting ? 'Exportando...' : 'Exportar Reporte'}
    </button>
  );
};