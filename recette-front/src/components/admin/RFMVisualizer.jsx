import React from 'react';
import { Target, TrendingUp, AlertTriangle, UserPlus } from 'lucide-react';

const RFMVisualizer = ({ stats }) => {
  const cards = [
    { label: 'Champions', val: stats.champions, color: 'text-green-600', bg: 'bg-green-50', icon: Target },
    { label: 'Fidèles', val: stats.fidele, color: 'text-blue-600', bg: 'bg-blue-50', icon: TrendingUp },
    { label: 'À Risque', val: stats.risque, color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
    { label: 'Nouveaux', val: stats.nouveau, color: 'text-orange-600', bg: 'bg-orange-50', icon: UserPlus },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <div key={i} className={`${card.bg} p-4 rounded-2xl border border-white shadow-sm transition-transform hover:scale-105`}>
          <div className="flex justify-between items-start">
            <card.icon className={card.color} size={20} />
            <span className={`text-xl font-black ${card.color}`}>{card.val}%</span>
          </div>
          <p className="text-sm font-bold text-gray-700 mt-2">{card.label}</p>
          <div className="w-full bg-white/50 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className={`h-full ${card.color.replace('text', 'bg')}`} style={{ width: `${card.val}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RFMVisualizer;