import React from 'react';

const StatsCircle = ({ value, label, color }) => (
  <div className="text-center">
    <div className={`w-20 h-20 bg-gradient-to-br ${color} rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg`}>
      <span className="text-2xl font-bold text-white">{value}</span>
    </div>
    <div className="text-xs text-gray-600 font-medium">{label}</div>
  </div>
);

export default StatsCircle;