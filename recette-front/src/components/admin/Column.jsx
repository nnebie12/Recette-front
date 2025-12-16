import React from 'react';

const Column = ({ title, color, children, count }) => (
  <div className="flex-1 min-w-[320px]">
    <div className="mb-4 flex items-center justify-between">
      <h3 className={`text-lg font-bold ${color} uppercase tracking-wide flex items-center`}>
        {title}
        {count !== undefined && (
          <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded-full text-gray-700">
            {count}
          </span>
        )}
      </h3>
    </div>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

export default Column;