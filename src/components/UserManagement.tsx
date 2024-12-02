import React, { useState } from 'react';
import { UserRole, ClientType } from '../types/auth';
import { useAuthStore } from '../store/authStore';
import { Edit, Trash2 } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.IMPLEMENTATION_LEADER,
    client: ClientType.SSMO
  });

  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      updateUser(editingUserId, {
        ...formData,
        id: editingUserId
      });
    } else {
      addUser({
        id: crypto.randomUUID(),
        ...formData,
      });
    }
    setShowForm(false);
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: UserRole.IMPLEMENTATION_LEADER,
      client: ClientType.SSMO
    });
  };

  const handleEdit = (user: any) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      client: user.client
    });
    setEditingUserId(user.id);
    setShowForm(true);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingUserId(null);
            setFormData({
              name: '',
              email: '',
              password: '',
              role: UserRole.IMPLEMENTATION_LEADER,
              client: ClientType.SSMO
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nuevo Usuario
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              required={!editingUserId}
              minLength={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {editingUserId && (
              <p className="mt-1 text-sm text-gray-500">
                Dejar en blanco para mantener la contraseña actual
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.client}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  client: e.target.value as ClientType,
                })
              }
            >
              {Object.values(ClientType).map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as UserRole,
                })
              }
            >
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingUserId(null);
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  role: UserRole.IMPLEMENTATION_LEADER,
                  client: ClientType.SSMO
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingUserId ? 'Actualizar Usuario' : 'Guardar Usuario'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.client}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};