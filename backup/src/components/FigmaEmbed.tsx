import React from 'react';

export const FigmaEmbed: React.FC = () => {
  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Diseño del Sistema</h2>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          className="w-full h-[450px] rounded-lg"
          style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
          src="https://embed.figma.com/design/A8RynchkoQOVHKfMGhC6Ly/Gestión-de-implementación---TrakCare?node-id=0-1&embed-host=share"
          allowFullScreen
        />
      </div>
    </div>
  );
};