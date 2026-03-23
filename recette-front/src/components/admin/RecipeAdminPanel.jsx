import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import ConfirmationModal from '../common/ConfirmationModal';
import BulkImageUpdater from './Bulkimageupdater';

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
      await adminService.deleteRecipe(parseInt(recipeIdToDelete));
      setSuccess(`Recette ID ${recipeIdToDelete} supprimée avec succès.`);
      setRecipeIdToDelete('');
    } catch (err) {
      setError(err.message || `Erreur : impossible de supprimer la recette ID ${recipeIdToDelete}.`);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Section images automatiques ── */}
      <BulkImageUpdater />

      {/* ── Section suppression ── */}
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Suppression de recette</h2>
        <p className="text-gray-600 mb-6">
          Supprimez définitivement une recette en utilisant son identifiant.
        </p>

        {success && (
          <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        {error && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex space-x-3 items-end">
          <div className="flex-grow">
            <label
              htmlFor="recipe-id-delete"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID de la recette à supprimer
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
      </div>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDeleteRecipe}
        title="Confirmation de suppression"
        message={`Voulez-vous vraiment supprimer la recette ID ${recipeIdToDelete} ? Cette action est irréversible.`}
        confirmText="Confirmer la suppression"
        confirmVariant="danger"
      />
    </div>
  );
};

export default RecipeAdminPanel;