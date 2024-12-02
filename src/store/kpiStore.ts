import { create } from 'zustand';

interface CustomMetric {
  id: string;
  name: string;
  value: number;
  target?: number;
}

interface KPIState {
  customMetrics: CustomMetric[];
  addCustomMetric: (metric: CustomMetric) => void;
  updateCustomMetric: (id: string, updates: Partial<CustomMetric>) => void;
  deleteCustomMetric: (id: string) => void;
}

export const useKPIStore = create<KPIState>((set) => ({
  customMetrics: [],
  addCustomMetric: (metric) =>
    set((state) => ({
      customMetrics: [...state.customMetrics, metric],
    })),
  updateCustomMetric: (id, updates) =>
    set((state) => ({
      customMetrics: state.customMetrics.map((metric) =>
        metric.id === id ? { ...metric, ...updates } : metric
      ),
    })),
  deleteCustomMetric: (id) =>
    set((state) => ({
      customMetrics: state.customMetrics.filter((metric) => metric.id !== id),
    })),
}));