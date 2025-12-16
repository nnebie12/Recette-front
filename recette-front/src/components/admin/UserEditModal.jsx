// src/components/admin/UserEditModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

// Simuler les rôles de votre backend (UserEntity)
const ROLES = ['USER', 'ADMIN']; 

const UserEditModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'USER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 💡 Initialisation du formulaire lors de l'ouverture du modal avec l'objet user
  useEffect(() => {
    if (user) {
      setForm({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        // Assurez-vous que la propriété 'role' est correcte dans l'objet UserEntity
        role: user.role || 'USER', 
      });
      setError(null);
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Le backend (AdminController) s'attend à recevoir UserEntity
    const dataToSend = {
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      // Seul le rôle est mis à jour ici, mais on envoie toute l'entité UserEntity pour le PUT
      role: form.role,
      // ⚠️ Important : Conserver les propriétés non modifiables si le backend les exige
      // Par exemple, si vous ne pouvez pas modifier le mot de passe ici, ne l'incluez pas.
    };

    try {
      // 💡 Appel à la fonction onUpdate (qui appelle adminService.updateUser(id, data))
      await onUpdate(user.id, dataToSend);
      onClose();
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
      setError("Erreur lors de la sauvegarde. Vérifiez les données ou le backend.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Ne rien rendre si aucun utilisateur n'est passé

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Modifier l'utilisateur : ${user.email}`} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <Input
          label="Nom"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          required
        />
        <Input
          label="Prénom"
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          // Optionnel : Désactiver si le backend n'autorise pas la modification de l'email
        />

        {/* Sélecteur de Rôle (le plus important pour l'admin) */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rôle</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserEditModal;