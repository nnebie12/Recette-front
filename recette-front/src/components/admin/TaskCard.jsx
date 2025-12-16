import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const TaskCard = ({ title, subtitle, icon: Icon, color, stats, onEdit, onDelete }) => (
  <div className={`bg-gradient-to-br ${color} rounded-lg p-4 mb-3 shadow-md hover:shadow-xl transition-all group relative`}>
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm">{title}</h4>
          {subtitle && <p className="text-white text-xs opacity-80">{subtitle}</p>}
        </div>
      </div>
      <div className="flex space-x-1">
        {onEdit && (
          <button 
            onClick={onEdit} 
            className="text-white opacity-70 hover:opacity-100 p-1 transition-opacity"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button 
            onClick={onDelete} 
            className="text-white opacity-70 hover:opacity-100 p-1 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
    
    {stats && stats.length > 0 && (
      <div className="flex items-center space-x-3 mt-3 text-white text-xs">
        {stats.map((stat, idx) => (
          <span 
            key={idx} 
            className="flex items-center bg-white bg-opacity-10 px-2 py-1 rounded backdrop-blur-sm"
          >
            {stat.icon && <stat.icon className="w-3 h-3 mr-1" />}
            {stat.value}
          </span>
        ))}
      </div>
    )}
  </div>
);

export default TaskCard;