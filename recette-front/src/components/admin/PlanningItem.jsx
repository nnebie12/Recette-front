import React from 'react';

const PlanningItem = ({ time, title, color = 'from-orange-400 to-red-500' }) => (
  <div className="flex items-center space-x-3 mb-2 group hover:bg-gray-50 p-2 rounded-lg transition-all">
    <div className="text-gray-500 font-medium text-sm w-28">{time}</div>
    <div className={`flex-1 bg-gradient-to-r ${color} h-8 rounded-lg flex items-center px-3 shadow-sm`}>
      <span className="text-white text-xs font-medium">{title}</span>
    </div>
  </div>
);

export default PlanningItem;