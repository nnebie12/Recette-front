// recette-front/src/components/recipe/RecipeCreate.jsx - MISE À JOUR

import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import ImageUpload from '../common/ImageUpload'; // 👈 IMPORT
import { DIFFICULTY_LEVELS } from '../../utils/constants';

const RecipeCreate = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    tempsPreparation: '',
    tempsCuisson: '',
    difficulte: 'MOYEN',
    ingredients: [{ ingredientName: '', quantite: '' }],
    imageFile: null, // 👈 NOUVEAU
    imageUrl: null, // 👈 NOUVEAU
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index, field) => {
    if (field === 'ingredients') {
      const updatedIngredients = [...form.ingredients];
      updatedIngredients[index][e.target.name] = e.target.value;
      setForm({ ...form, ingredients: updatedIngredients });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // 👇 NOUVEAU: Handler pour l'image
  const handleImageChange = (file, preview) => {
    setForm({ 
      ...form, 
      imageFile: file,
      imageUrl: preview 
    });
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
      const formData = new FormData();
    
    // 2. On ajoute les champs texte
    formData.append('titre', form.titre);
    formData.append('description', form.description);
    formData.append('tempsPreparation', form.tempsPreparation);
    formData.append('tempsCuisson', form.tempsCuisson);
    formData.append('difficulte', form.difficulte);
    
    // Pour les objets complexes comme les ingrédients, on les transforme en chaîne JSON
    formData.append('ingredients', JSON.stringify(form.ingredients));

    // 3. On ajoute le fichier image s'il existe
    if (form.imageFile) {
      formData.append('file', form.imageFile); // 'file' doit correspondre au @RequestParam du Back
    }

    // 4. On appelle onCreated avec le formData au lieu de l'objet simple
    await onCreated(formData);
      
      // Reset form
      setForm({
        titre: '',
        description: '',
        tempsPreparation: '',
        tempsCuisson: '',
        difficulte: 'MOYEN',
        ingredients: [{ ingredientName: '', quantite: '' }],
        imageFile: null,
        imageUrl: null,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer une recette" size="lg">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* 👇 NOUVEAU: Composant d'upload d'image */}
        <ImageUpload
          currentImage={form.imageUrl}
          onImageChange={handleImageChange}
          label="Image de la recette"
          maxSize={5}
        />

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

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Créer la recette
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RecipeCreate;