import React, { useState } from 'react';
import { Plus, GanttChartIcon, Edit, LogOut, Trash2, BarChart2, UserCircle } from 'lucide-react';
import { ProjectForm } from './components/ProjectForm';
import { TaskForm } from './components/TaskForm';
import { GanttChart } from './components/GanttChart';
import { UserManagement } from './components/UserManagement';
import { Login } from './components/Login';
import { useProjectStore } from './store/projectStore';
import { useAuthStore } from './store/authStore';
import { UserRole } from './types/auth';
import { ExportButton } from './components/ExportButton';
import { KPIDashboard } from './components/KPIDashboard';
import { UserProfile } from './components/UserProfile';

function App() {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showKPIs, setShowKPIs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { projects, selectedProject, addProject, selectProject, addTask, updateProject, deleteProject } = useProjectStore();
  const { currentUser, logout, can } = useAuthStore();

  const handleCreateProject = (projectData: any) => {
    if (!can('create', 'project')) return;

    if (isEditing && selectedProject) {
      updateProject(selectedProject.id, projectData);
    } else {
      addProject({
        ...projectData,
        id: crypto.randomUUID(),
      });
    }
    setShowProjectForm(false);
    setIsEditing(false);
  };

  const handleCreateTask = (taskData: any) => {
    if (!can('create', 'task')) return;

    if (selectedProject) {
      addTask(selectedProject.id, {
        ...taskData,
        id: crypto.randomUUID(),
      });
      setShowTaskForm(false);
    }
  };

  const handleEditProject = () => {
    if (!can('update', 'project')) return;
    setIsEditing(true);
    setShowProjectForm(true);
  };

  const handleDeleteProject = () => {
    if (!selectedProject || !can('delete', 'project')) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      deleteProject(selectedProject.id);
      selectProject('');
    }
  };

  // Filter tasks based on user role and assignments
  const filteredTasks = selectedProject?.tasks.filter(task => {
    if ([UserRole.ADMIN, UserRole.PROJECT_MANAGER].includes(currentUser?.role || UserRole.ADMIN)) {
      return true;
    }
    return task.assignedRole === currentUser?.role || task.assignee === currentUser?.name;
  }) || [];

  const canViewKPIs = currentUser?.role === UserRole.ADMIN || 
                      currentUser?.role === UserRole.PROJECT_MANAGER;

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                {currentUser.name} ({currentUser.role})
              </div>
              {can('create', 'project') && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setShowProjectForm(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nuevo Proyecto
                </button>
              )}
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <UserCircle className="h-5 w-5 mr-2" />
                Mi Perfil
              </button>
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

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {showProfile ? (
          <UserProfile />
        ) : (
          <>
            {currentUser.role === UserRole.ADMIN && <UserManagement />}

            {showProjectForm ? (
              <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mt-6">
                <h2 className="text-xl font-semibold mb-4">
                  {isEditing ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
                </h2>
                <ProjectForm 
                  onSubmit={handleCreateProject} 
                  initialData={isEditing ? selectedProject : undefined}
                  isEditing={isEditing}
                />
              </div>
            ) : showTaskForm && selectedProject ? (
              <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mt-6">
                <h2 className="text-xl font-semibold mb-4">Agregar Nueva Tarea</h2>
                <TaskForm
                  projectId={selectedProject.id}
                  existingTasks={selectedProject.tasks}
                  onSubmit={handleCreateTask}
                  onCancel={() => setShowTaskForm(false)}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <GanttChartIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      No hay proyectos
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {can('create', 'project')
                        ? 'Comienza creando tu primer proyecto.'
                        : 'No hay proyectos disponibles.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                          <select
                            className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={selectedProject?.id || ''}
                            onChange={(e) => selectProject(e.target.value)}
                          >
                            <option value="">Seleccionar proyecto</option>
                            {projects.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.name}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            {selectedProject && can('update', 'project') && (
                              <button
                                onClick={handleEditProject}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <Edit className="h-5 w-5 mr-2" />
                                Editar Proyecto
                              </button>
                            )}
                            {selectedProject && can('delete', 'project') && (
                              <button
                                onClick={handleDeleteProject}
                                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                              >
                                <Trash2 className="h-5 w-5 mr-2" />
                                Eliminar Proyecto
                              </button>
                            )}
                            {selectedProject && can('create', 'task') && (
                              <button
                                onClick={() => setShowTaskForm(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="h-5 w-5 mr-2" />
                                Nueva Tarea
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedProject && (
                      <div className="bg-white rounded-lg shadow">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="mb-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h2 className="text-lg font-medium text-gray-900">
                                  {selectedProject.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                  {selectedProject.description}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Cliente: {selectedProject.client}
                                </p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <ExportButton project={selectedProject} />
                                {canViewKPIs && (
                                  <button
                                    onClick={() => setShowKPIs(!showKPIs)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                  >
                                    <BarChart2 className="h-5 w-5 mr-2" />
                                    {showKPIs ? 'Vista de Gantt' : 'Vista de KPIs'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          {showKPIs ? (
                            <KPIDashboard />
                          ) : (
                            <GanttChart
                              tasks={filteredTasks}
                              startDate={selectedProject.startDate}
                              endDate={selectedProject.endDate}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;