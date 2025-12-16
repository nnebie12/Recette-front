// src/components/admin/RecipeAdminPanel.jsx

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import ConfirmationModal from '../common/ConfirmationModal';

const RecipeAdminPanel = ({ adminService }) => {
  const [recipeIdToDelete, setRecipeIdToDelete] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleOpenConfirm = () => {
    setError(null);
    setSuccess(null);
    if (recipeIdToDelete) {
      setShowConfirm(true);
    } else {
      setError("Veuillez entrer l'ID de la recette à supprimer.");
    }
  };

  const handleDeleteRecipe = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 💡 Appel à adminService.deleteRecipe qui appelle /api/administrateur/recettes/{id}
      await adminService.deleteRecipe(parseInt(recipeIdToDelete));
      
      setSuccess(`Recette ID ${recipeIdToDelete} supprimée avec succès.`);
      setRecipeIdToDelete('');
    } catch (err) {
      console.error("Erreur de suppression:", err);
      // Gérer l'erreur 404 du backend si la recette n'existe pas
      setError(`Erreur : Impossible de supprimer la recette ID ${recipeIdToDelete}. Elle n'existe peut-être pas ou une erreur est survenue.`);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des Recettes (Suppression)</h2>
      <p className="text-gray-600 mb-6">
        Supprimez définitivement une recette en utilisant son identifiant.
      </p>

      {success && (
        <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-md">{success}</div>
      )}
      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <div className="flex space-x-3 items-end">
        <div className="flex-grow">
          <label htmlFor="recipe-id-delete" className="block text-sm font-medium text-gray-700 mb-1">
            ID de la Recette à Supprimer
          </label>
          <Input
            id="recipe-id-delete"
            type="number"
            value={recipeIdToDelete}
            onChange={(e) => setRecipeIdToDelete(e.target.value)}
            placeholder="Ex: 45"
            required
          />
        </div>
        <Button 
          variant="danger" 
          onClick={handleOpenConfirm} 
          loading={loading}
          disabled={loading || !recipeIdToDelete}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Supprimer
        </Button>
      </div>

      {/* Modal de Confirmation */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDeleteRecipe}
        title="Confirmation de Suppression de Recette"
        message={`Voulez-vous vraiment supprimer la recette ID ${recipeIdToDelete} ? Cette action est irréversible et supprime toutes les données associées.`}
        confirmText="Confirmer la Suppression"
        confirmVariant="danger"
      />
    </div>
  );
};

export default RecipeAdminPanel;