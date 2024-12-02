import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { User } from '../types/auth';

export const UserProfile: React.FC = () => {
  const { currentUser, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== currentUser.password) {
      setError('La contraseña actual es incorrecta');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    updateUser(currentUser.id, {
      ...currentUser,
      password: newPassword
    });

    setSuccess('Contraseña actualizada exitosamente');
    setIsEditing(false);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6">Mi Perfil</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <p className="mt-1 text-gray-900">{currentUser.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-gray-900">{currentUser.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <p className="mt-1 text-gray-900">{currentUser.role}</p>
        </div>
      </div>

      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cambiar Contraseña
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña Actual
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nueva Contraseña
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {success && (
            <p className="text-sm text-green-600">{success}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError('');
                setSuccess('');
                setPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};