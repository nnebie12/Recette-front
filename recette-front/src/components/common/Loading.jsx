import React from 'react';
import { ChefHat } from 'lucide-react';

const Loading = ({ fullScreen = false, message = 'Chargement...' }) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="inline-block animate-bounce mb-4">
          <ChefHat className="w-16 h-16 text-orange-500" />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;