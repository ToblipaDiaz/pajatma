import { create } from 'zustand';
import { Project, Task } from '../types/project';

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, project: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  selectProject: (projectId: string) => void;
  updateTask: (projectId: string, task: Task) => void;
  addTask: (projectId: string, task: Task) => void;
  deleteTask: (projectId: string, taskId: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProject: null,
  addProject: (project) =>
    set((state) => ({ 
      projects: [...state.projects, project],
      selectedProject: project
    })),
  updateProject: (projectId, updatedFields) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, ...updatedFields }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? { ...state.selectedProject, ...updatedFields }
        : state.selectedProject,
    })),
  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== projectId),
      selectedProject: state.selectedProject?.id === projectId ? null : state.selectedProject,
    })),
  selectProject: (projectId) =>
    set((state) => ({
      selectedProject: state.projects.find((p) => p.id === projectId) || null,
    })),
  updateTask: (projectId, updatedTask) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
              ),
            }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? {
            ...state.selectedProject,
            tasks: state.selectedProject.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          }
        : state.selectedProject,
    })),
  addTask: (projectId, task) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: [...project.tasks, task],
            }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? {
            ...state.selectedProject,
            tasks: [...state.selectedProject.tasks, task],
          }
        : state.selectedProject,
    })),
  deleteTask: (projectId, taskId) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            }
          : project
      ),
      selectedProject: state.selectedProject?.id === projectId
        ? {
            ...state.selectedProject,
            tasks: state.selectedProject.tasks.filter((task) => task.id !== taskId),
          }
        : state.selectedProject,
    })),
}));