import { create } from 'zustand';
import { AlertConfig } from '../types/alerts';

interface AlertState {
  alerts: AlertConfig[];
  addAlert: (alert: Omit<AlertConfig, 'id' | 'createdAt'>) => void;
  updateAlert: (alertId: string, message: string) => void;
  deleteAlert: (alertId: string) => void;
  getAlertByTaskId: (taskId: string) => AlertConfig | undefined;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [],
  addAlert: (alert) =>
    set((state) => ({
      alerts: [
        ...state.alerts,
        {
          ...alert,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        },
      ],
    })),
  updateAlert: (alertId, message) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, message } : alert
      ),
    })),
  deleteAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== alertId),
    })),
  getAlertByTaskId: (taskId) => get().alerts.find((alert) => alert.taskId === taskId),
}));