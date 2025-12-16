import React, { useMemo } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import Card from '../common/Card';
import StatsCircle from './StatsCircle';
import PlanningItem from './PlanningItem';


const generateRandomScore = () => Math.floor(Math.random() * 40) + 40;


const AnalyticsColumn = ({ users }) => {
  
  // 💡 Calculer les scores une seule fois et les mémoriser
  const engagementData = useMemo(() => {
    return users.slice(0, 4).map(user => ({
      ...user,
      // 💡 Le score est calculé ici, une seule fois au montage
      score: generateRandomScore(), 
    }));
  }, [users]);
  return (
    <div className="flex-1 min-w-[320px] space-y-6">
      {/* Top Auteurs */}
      <Card>
        <h3 className="text-orange-500 font-bold uppercase text-sm mb-4 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Top Auteurs
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {users.slice(0, 4).map((user, idx) => {
            const colors = [
              'from-orange-400 to-red-500',
              'from-red-400 to-red-600',
              'from-orange-500 to-red-400',
              'from-yellow-400 to-orange-500'
            ];
            return (
              <StatsCircle 
                key={user.id}
                value={user.recettesCount || 0} 
                label={user.prenom} 
                color={colors[idx % 4]} 
              />
            );
          })}
        </div>
      </Card>

      {/* Engagement */}
      <Card>
        <h3 className="text-red-500 font-bold uppercase text-sm mb-4 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Engagement
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {engagementData.map((user, idx) => { // 💡 Utiliser les données mémorisées
            const colors = [
              'from-orange-500 to-orange-600',
              'from-red-500 to-red-600',
              'from-orange-600 to-red-500',
              'from-yellow-500 to-orange-600'
            ];
            return (
              <StatsCircle 
                key={user.id}
                value={user.score} // 💡 Utiliser le score stocké
                label={user.prenom} 
                color={colors[idx % 4]} 
              />
            );
          })}
        </div>
      </Card>
      {/* Planning */}
      <Card>
        <h3 className="text-gray-700 font-bold uppercase text-sm mb-4 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Activité Récente
        </h3>
        <div>
          <PlanningItem 
            time="Aujourd'hui" 
            title="Nouveaux utilisateurs" 
            color="from-orange-400 to-red-500" 
          />
          <PlanningItem 
            time="Cette semaine" 
            title="Recettes ajoutées" 
            color="from-red-400 to-red-600" 
          />
          <PlanningItem 
            time="Ce mois" 
            title="Commentaires" 
            color="from-orange-500 to-orange-600" 
          />
          <PlanningItem 
            time="Tendance" 
            title="Notes moyennes" 
            color="from-yellow-400 to-orange-500" 
          />
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsColumn;