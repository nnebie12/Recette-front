import React, { useState } from 'react';
import { Users, ChefHat, Star, Edit, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import TaskCard from './TaskCard';
import Column from './Column';
import { isAdminRole } from '../../utils/helpers';
import UserManagementModals from './UserManagementModals';

const UserManagementColumn = ({ users, onReload }) => {
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleUpdateUser = async (id, updatedData) => {
    try {
      await adminService.updateUser(id, updatedData);
      await onReload();
      setUserToEdit(null);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await adminService.deleteUser(userToDelete.id);
      await onReload();
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const activeUsers = users.filter((u) => !isAdminRole(u.role));

  return (
    <>
      <Column title="Utilisateurs" color="text-orange-500" count={activeUsers.length}>
        {activeUsers.slice(0, 6).map(user => (
          <TaskCard
            key={user.id}
            title={`${user.prenom} ${user.nom}`}
            subtitle={user.email}
            icon={Users}
            color="from-orange-400 to-red-500"
            stats={[
              { icon: ChefHat, value: `${user.recettesCount || 0} recettes` },
              { icon: Star, value: user.role }
            ]}
            onEdit={() => setUserToEdit(user)}
            onDelete={() => setUserToDelete(user)}
          />
        ))}
        {activeUsers.length > 6 && (
          <div className="text-center py-3 text-gray-500 text-sm">
            +{activeUsers.length - 6} autres utilisateurs
          </div>
        )}
      </Column>

      <UserManagementModals
        userToEdit={userToEdit}
        setUserToEdit={setUserToEdit}
        userToDelete={userToDelete}
        setUserToDelete={setUserToDelete}
        onUpdate={handleUpdateUser}
        onConfirmDelete={handleDeleteUser}
        deleteMessage={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete?.nom} ${userToDelete?.prenom} ?`}
      />
    </>
  );
};

export default UserManagementColumn;