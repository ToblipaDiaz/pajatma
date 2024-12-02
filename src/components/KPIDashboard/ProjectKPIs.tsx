import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { useProjectStore } from '../../store/projectStore';
import { useKPIStore } from '../../store/kpiStore';
import { calculateProjectMetrics } from '../../utils/kpi/projectMetrics';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProjectKPIsProps {
  canEdit: boolean;
}

export const ProjectKPIs: React.FC<ProjectKPIsProps> = ({ canEdit }) => {
  const { selectedProject } = useProjectStore();
  const { projectMetrics, updateProjectMetric } = useKPIStore();

  if (!selectedProject) {
    return null;
  }

  const metrics = calculateProjectMetrics(selectedProject);

  const progressData = {
    labels: ['Progreso General'],
    datasets: [
      {
        label: 'Progreso Real',
        data: [metrics.progress],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Progreso Esperado',
        data: [metrics.expectedProgress],
        backgroundColor: 'rgba(107, 114, 128, 0.5)',
      }
    ]
  };

  const taskStatusData = {
    labels: ['En Tiempo', 'Riesgo Medio', 'Riesgo Alto', 'Atrasadas'],
    datasets: [
      {
        label: 'Tareas por Estado',
        data: [
          metrics.tasksByStatus.onTime,
          metrics.tasksByStatus.mediumRisk,
          metrics.tasksByStatus.highRisk,
          metrics.tasksByStatus.late
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(249, 115, 22, 0.5)',
          'rgba(239, 68, 68, 0.5)'
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Progreso del Proyecto</h3>
        <Bar data={progressData} options={{
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }} />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Estado de Tareas</h3>
        <Bar data={taskStatusData} />
      </div>

      {canEdit && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Métricas Personalizadas</h3>
          {/* Add custom metric inputs here */}
        </div>
      )}
    </div>
  );
};