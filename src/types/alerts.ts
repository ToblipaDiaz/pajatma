export interface TaskAlert {
  type: 'danger' | 'warning' | 'success';
  message: string;
}

export interface AlertConfig {
  id: string;
  taskId: string;
  message: string;
  createdBy: string;
  createdAt: Date;
}