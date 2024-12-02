import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { ProjectKPIs } from './ProjectKPIs';
import { TaskKPIs } from './TaskKPIs';
import { CustomKPIs } from './CustomKPIs';
import { UserRole } from '../../types/auth';

export const KPIDashboard: React.FC = () => {
  const { currentUser } = useAuthStore();
  const canEditKPIs = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.PROJECT_MANAGER;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard de KPIs</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectKPIs canEdit={canEditKPIs} />
        <TaskKPIs canEdit={canEditKPIs} />
      </div>

      {canEditKPIs && (
        <div className="mt-8">
          <CustomKPIs />
        </div>
      )}
    </div>
  );
};