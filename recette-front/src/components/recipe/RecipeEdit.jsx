import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { DIFFICULTY_LEVELS } from '../../utils/constants';

const RecipeEdit = ({ recipe, isOpen, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    tempsPreparation: '',
    tempsCuisson: '',
    difficulte: 'MOYEN',
    ingredients: [{ ingredientName: '', quantite: '' }],
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
      });
    }
  }, [recipe, isOpen]);

  const handleChange = (e, index, field) => {
    if (field === 'ingredients') {
      const updatedIngredients = [...form.ingredients];
      updatedIngredients[index][e.target.name] = e.target.value;
      setForm({ ...form, ingredients: updatedIngredients });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addIngredient = () => {
    setForm({ ...form, ingredients: [...form.ingredients, { ingredientName: '', quantite: '' }] });
  };

  const removeIngredient = (index) => {
    const updatedIngredients = form.ingredients.filter((_, i) => i !== index);
    setForm({ ...form, ingredients: updatedIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(form);
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
        <Input
          label="Titre"
          name="titre"
          value={form.titre}
          onChange={handleChange}
          required
        />
        <Input
          label="Description"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Temps de préparation (min)"
            name="tempsPreparation"
            type="number"
            value={form.tempsPreparation}
            onChange={handleChange}
          />
          <Input
            label="Temps de cuisson (min)"
            name="tempsCuisson"
            type="number"
            value={form.tempsCuisson}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté</label>
          <select
            name="difficulte"
            value={form.difficulte}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {Object.keys(DIFFICULTY_LEVELS).map((key) => (
            <option key={key} value={key}>
            {DIFFICULTY_LEVELS[key].label}
            </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ingrédients</label>
          {form.ingredients.map((ingredient, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <Input
                placeholder="Nom"
                name="ingredientName"
                value={ingredient.ingredientName}
                onChange={(e) => handleChange(e, index, 'ingredients')}
                required
              />
              <Input
                placeholder="Quantité"
                name="quantite"
                value={ingredient.quantite}
                onChange={(e) => handleChange(e, index, 'ingredients')}
                required
              />
              {form.ingredients.length > 1 && (
                <Button type="button" variant="danger" onClick={() => removeIngredient(index)}>
                  Supprimer
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addIngredient}>
            Ajouter un ingrédient
          </Button>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" loading={loading}>
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RecipeEdit;
