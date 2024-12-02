import React, { useState } from 'react';
import { TestTube2 } from 'lucide-react';
import { createFigmaAPI } from '../utils/figmaApi';

export const FigmaTestButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const figmaApi = createFigmaAPI({
        accessToken: import.meta.env.VITE_FIGMA_ACCESS_TOKEN,
        fileId: import.meta.env.VITE_FIGMA_FILE_ID
      });

      const result = await figmaApi.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error al probar la conexión con Figma'
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleTest}
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        <TestTube2 className="h-5 w-5 mr-2" />
        {isLoading ? 'Probando...' : 'Probar Figma'}
      </button>

      {testResult && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 p-2 rounded text-sm ${
            testResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {testResult.message}
        </div>
      )}
    </div>
  );
};