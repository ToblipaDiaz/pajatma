import { create } from 'zustand';
import { User, UserRole, Permission, ROLE_PERMISSIONS } from '../types/auth';

interface AuthState {
  currentUser: User | null;
  users: User[];
  login: (userId: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  can: (action: Permission['action'], subject: Permission['subject'], targetId?: string, assignee?: string) => boolean;
}

// Create initial users with password
const initialUsers: User[] = [
  {
    id: crypto.randomUUID(),
    name: 'Administrador',
    email: 'admin@sistema.com',
    role: UserRole.ADMIN,
    password: 'demo'
  },
  {
    id: crypto.randomUUID(),
    name: 'Gerente de Proyecto',
    email: 'pm@sistema.com',
    role: UserRole.PROJECT_MANAGER,
    password: 'demo'
  },
  {
    id: crypto.randomUUID(),
    name: 'Líder de Implementación',
    email: 'impl@sistema.com',
    role: UserRole.IMPLEMENTATION_LEADER,
    password: 'demo'
  },
  {
    id: crypto.randomUUID(),
    name: 'Líder de Capacitación',
    email: 'training@sistema.com',
    role: UserRole.TRAINING_LEADER,
    password: 'demo'
  },
  {
    id: crypto.randomUUID(),
    name: 'Visualizador',
    email: 'viewer@sistema.com',
    role: UserRole.VIEWER,
    password: 'demo'
  }
];

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  users: initialUsers,
  login: (userId, password) => {
    const user = get().users.find(u => u.id === userId);
    if (user && user.password === password) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },
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
  can: (action, subject, targetId?, assignee?) => {
    const { currentUser } = get();
    if (!currentUser) return false;

    const userPermissions = ROLE_PERMISSIONS[currentUser.role];
    const hasPermission = userPermissions.some(
      (permission) =>
        permission.action === action && permission.subject === subject
    );

    if (!hasPermission) return false;

    // Implementation and Training leaders can only update their assigned tasks
    if (subject === 'task' && assignee && 
        [UserRole.IMPLEMENTATION_LEADER, UserRole.TRAINING_LEADER].includes(currentUser.role)) {
      return assignee === currentUser.name;
    }

    return true;
  },
}));