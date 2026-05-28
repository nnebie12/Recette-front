import React from 'react';
import ConfirmationModal from '../common/ConfirmationModal';
import UserEditModal from './UserEditModal';

const UserManagementModals = ({
  userToEdit,
  setUserToEdit,
  userToDelete,
  setUserToDelete,
  onUpdate,
  onConfirmDelete,
  deleteMessage,
  confirmText = 'Supprimer',
}) => {
  return (
    <>
      <UserEditModal
        isOpen={!!userToEdit}
        onClose={() => setUserToEdit(null)}
        user={userToEdit}
        onUpdate={onUpdate}
      />

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={onConfirmDelete}
        title="Supprimer un utilisateur"
        message={deleteMessage}
        confirmText={confirmText}
        confirmVariant="danger"
      />
    </>
  );
};

export default UserManagementModals;
