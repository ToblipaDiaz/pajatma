import React from 'react';
import { GanttChartIcon, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuthStore();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <GanttChartIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Gestor de Proyectos
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {currentUser?.name} ({currentUser?.role})
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};