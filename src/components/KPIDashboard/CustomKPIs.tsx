import React, { useState } from 'react';
import { useKPIStore } from '../../store/kpiStore';
import { Plus } from 'lucide-react';

export const CustomKPIs: React.FC = () => {
  const { customMetrics, addCustomMetric, updateCustomMetric } = useKPIStore();
  const [newMetric, setNewMetric] = useState({ name: '', value: '', target: '' });

  const handleAddMetric = () => {
    if (newMetric.name && newMetric.value) {
      addCustomMetric({
        id: crypto.randomUUID(),
        ...newMetric,
        value: parseFloat(newMetric.value),
        target: parseFloat(newMetric.target)
      });
      setNewMetric({ name: '', value: '', target: '' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">KPIs Personalizados</h3>
      
      <div className="space-y-4">
        {customMetrics.map(metric => (
          <div key={metric.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{metric.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Valor: {metric.value}</span>
                {metric.target && <span>Meta: {metric.target}</span>}
              </div>
            </div>
            <input
              type="number"
              className="w-24 px-2 py-1 border rounded"
              value={metric.value}
              onChange={(e) => updateCustomMetric(metric.id, { value: parseFloat(e.target.value) })}
            />
          </div>
        ))}

        <div className="flex gap-4 mt-4">
          <input
            type="text"
            placeholder="Nombre del KPI"
            className="flex-1 px-3 py-2 border rounded"
            value={newMetric.name}
            onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Valor"
            className="w-32 px-3 py-2 border rounded"
            value={newMetric.value}
            onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
          />
          <input
            type="number"
            placeholder="Meta (opcional)"
            className="w-32 px-3 py-2 border rounded"
            value={newMetric.target}
            onChange={(e) => setNewMetric({ ...newMetric, target: e.target.value })}
          />
          <button
            onClick={handleAddMetric}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};