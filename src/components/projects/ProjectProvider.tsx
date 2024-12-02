import React, { ReactNode } from 'react';
import { useProjectStore } from '../../store/projectStore';

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { projects } = useProjectStore();
  
  // Initialize any project-related state or listeners here
  
  return <>{children}</>;
};