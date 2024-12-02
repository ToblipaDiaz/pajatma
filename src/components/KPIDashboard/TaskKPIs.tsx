import React from 'react';
import { Line } from 'react-chartjs-2';
import { useProjectStore } from '../../store/projectStore';
import { calculateTaskMetrics } from '../../utils/kpi/taskMetrics';

interface TaskKPIsProps {
  canEdit: boolean;
}

export const TaskKPIs: React.FC<TaskKPIsProps> = ({ canEdit }) => {
  const { selectedProject } = useProjectStore();

  if (!selectedProject) {
    return null;
  }

  const metrics = calculateTaskMetrics(selectedProject.tasks);

  const progressTrendData = {
    labels: metrics.dates,
    datasets: [
      {
        label: 'Tendencia de Progreso',
        data: metrics.progressTrend,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Tendencia de Progreso</h3>
        <Line data={progressTrendData} options={{
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }} />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Métricas por Rol</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.roleMetrics.map(metric => (
            <div key={metric.role} className="p-4 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-900">{metric.role}</h4>
              <p className="text-sm text-gray-500">Tareas: {metric.taskCount}</p>
              <p className="text-sm text-gray-500">Progreso Promedio: {metric.averageProgress}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};