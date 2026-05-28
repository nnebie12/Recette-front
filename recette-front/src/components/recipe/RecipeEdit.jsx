// recette-front/src/components/recipe/RecipeEdit.jsx - MISE À JOUR

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import RecipeFormFields from './RecipeFormFields';

const RecipeEdit = ({ recipe, isOpen, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    tempsPreparation: '',
    tempsCuisson: '',
    difficulte: 'MOYEN',
    ingredients: [{ ingredientName: '', quantite: '' }],
    imageFile: null, 
    imageUrl: null, 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipe && isOpen) {
      setForm({
        titre: recipe.titre || '',
        description: recipe.description || '',
        tempsPreparation: recipe.tempsPreparation || '',
        tempsCuisson: recipe.tempsCuisson || '',
        difficulte: recipe.difficulte || 'MOYEN',
        ingredients:
          recipe.ingredients && recipe.ingredients.length > 0
            ? recipe.ingredients.map((i) => ({ ingredientName: i.ingredientName, quantite: i.quantite }))
            : [{ ingredientName: '', quantite: '' }],
        imageFile: null,
        imageUrl: recipe.imageUrl || null,
      });
    }
  }, [recipe, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const recipeData = {
        titre: form.titre,
        description: form.description,
        tempsPreparation: form.tempsPreparation,
        tempsCuisson: form.tempsCuisson,
        difficulte: form.difficulte,
        ingredients: form.ingredients,
        imageUrl: form.imageUrl, 
      };

      await onUpdate(recipeData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier la recette" size="lg">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <RecipeFormFields form={form} setForm={setForm} />

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RecipeEdit;