import { create } from 'zustand';
import { User, UserRole, Permission, ROLE_PERMISSIONS } from '../types/auth';

interface AuthState {
  currentUser: User | null;
  users: User[];
  login: (user: User) => void;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  can: (action: Permission['action'], subject: Permission['subject'], targetId?: string) => boolean;
}

// Create initial admin user
const initialAdmin: User = {
  id: crypto.randomUUID(),
  name: 'Administrador',
  email: 'admin@sistema.com',
  role: UserRole.ADMIN
};

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  users: [initialAdmin], // Initialize with admin user
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (userId, userData) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, ...userData } : user
      ),
      currentUser:
        state.currentUser?.id === userId
          ? { ...state.currentUser, ...userData }
          : state.currentUser,
    })),
  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    })),
  can: (action, subject, targetId?) => {
    const { currentUser } = get();
    if (!currentUser) return false;

    const userPermissions = ROLE_PERMISSIONS[currentUser.role];
    const hasPermission = userPermissions.some(
      (permission) =>
        permission.action === action && permission.subject === subject
    );

    if (!hasPermission) return false;

    // Additional checks for task-specific permissions
    if (subject === 'task' && targetId) {
      const { projects } = useProjectStore.getState();
      const task = projects
        .flatMap((p) => p.tasks)
        .find((t) => t.id === targetId);

      if (!task) return false;

      // Implementation and Training leaders can only update their assigned tasks
      if (
        [UserRole.IMPLEMENTATION_LEADER, UserRole.TRAINING_LEADER].includes(
          currentUser.role
        )
      ) {
        return task.assignee === currentUser.name;
      }
    }

    return true;
  },
}));