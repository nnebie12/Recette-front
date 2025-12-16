import React, { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Loading from '../common/Loading';
import Button from '../common/Button';
import ConfirmationModal from '../common/ConfirmationModal'; 
import UserEditModal from './UserEditModal';

const UserManagement = ({ adminService }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllUsers();
      console.log('Données reçues:', data); // Debug
      
      // Vérifier si data est un tableau, sinon essayer d'extraire le tableau
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.data)) {
        // Cas où le backend retourne { data: [...] }
        setUsers(data.data);
      } else if (data && Array.isArray(data.users)) {
        // Cas où le backend retourne { users: [...] }
        setUsers(data.users);
      } else {
        console.error('Format de données inattendu:', data);
        setUsers([]);
        setError("Format de données inattendu du serveur.");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs:", err);
      setError("Impossible de charger la liste des utilisateurs. Vérifiez la connexion au serveur.");
      setUsers([]); // Important: initialiser à un tableau vide
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id, updatedData) => {
    try {
      await adminService.updateUser(id, updatedData);
      await loadUsers(); // Recharger après modification
      setUserToEdit(null); 
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      alert("Erreur lors de la mise à jour de l'utilisateur.");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await adminService.deleteUser(userToDelete.id);
      await loadUsers(); // Recharger après suppression
      setUserToDelete(null); 
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  if (loading) return <Loading message="Chargement des utilisateurs..." />;
  
  if (error) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="text-red-600 p-4 bg-red-50 rounded-md">
          <p className="font-semibold">Erreur</p>
          <p>{error}</p>
          <button 
            onClick={loadUsers}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des Utilisateurs ({users.length})</h2>

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun utilisateur trouvé.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom & Prénom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{user.nom} {user.prenom}</div>
                    {user.recettesCount > 0 && (
                      <div className="text-xs text-gray-400">{user.recettesCount} recette(s)</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'ADMIN' || user.role === 'ADMINISTRATEUR' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => setUserToEdit(user)}
                        title="Modifier l'utilisateur"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => setUserToDelete(user)}
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UserEditModal
        isOpen={!!userToEdit}
        onClose={() => setUserToEdit(null)}
        user={userToEdit}
        onUpdate={handleUpdateUser}
      />
      
      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Supprimer un utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete?.nom} ${userToDelete?.prenom} (ID: ${userToDelete?.id}) ? Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        confirmVariant="danger"
      />
    </div>
  );
};

export default UserManagement;