import React from 'react';
import { ChefHat, Users, Star } from 'lucide-react';
import Column from './Column';
import TaskCard from './TaskCard';

const RecipeManagementColumn = ({ users }) => {
  const adminUsers = users.filter(u => 
    u.role === 'ADMIN' || u.role === 'ADMINISTRATEUR'
  );

  return (
    <Column title="Administrateurs" color="text-red-500" count={adminUsers.length}>
      {adminUsers.map(user => (
        <TaskCard
          key={user.id}
          title={`${user.prenom} ${user.nom}`}
          subtitle={user.email}
          icon={Users}
          color="from-red-400 to-red-600"
          stats={[
            { icon: ChefHat, value: `${user.recettesCount || 0} recettes` },
            { icon: Star, value: 'ADMIN' }
          ]}
        />
      ))}
      {adminUsers.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucun administrateur</p>
        </div>
      )}
    </Column>
  );
};

export default RecipeManagementColumn;