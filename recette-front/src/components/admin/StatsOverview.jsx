import { Users, ChefHat, MessageSquare, Star } from 'lucide-react';
import StatCard from './StatCard';

const StatsOverview = ({ data }) => {
  const stats = [
    {
      title: 'Total Utilisateurs',
      value: data.totalUsers,
      Icon: Users,
      gradient: 'from-orange-400 to-red-500'
    },
    {
      title: 'Recettes Actives',
      value: data.activeRecipes,
      Icon: ChefHat,
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Commentaires',
      value: data.totalComments,
      Icon: MessageSquare,
      gradient: 'from-red-400 to-red-500'
    },
    {
      title: 'Note Moyenne',
      value: data.avgRating,
      Icon: Star,
      gradient: 'from-yellow-400 to-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};

export default StatsOverview;