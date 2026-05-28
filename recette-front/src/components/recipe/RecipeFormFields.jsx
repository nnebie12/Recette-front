import React from 'react';
import Button from '../common/Button';
import ImageUpload from '../common/ImageUpload';
import Input from '../common/Input';
import { DIFFICULTY_LEVELS } from '../../utils/constants';

const baseInputClassName =
  'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500';

const RecipeFormFields = ({
  form,
  setForm,
  renderExtraFields,
}) => {
  const handleChange = (e, index, field) => {
    if (field === 'ingredients') {
      const updatedIngredients = [...form.ingredients];
      updatedIngredients[index][e.target.name] = e.target.value;
      setForm((prev) => ({ ...prev, ingredients: updatedIngredients }));
      return;
    }

    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (file, preview) => {
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imageUrl: preview,
    }));
  };

  const addIngredient = () => {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredientName: '', quantite: '' }],
    }));
  };

  const removeIngredient = (index) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
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

      {typeof renderExtraFields === 'function'
        ? renderExtraFields({ form, handleChange, setForm, selectClassName: baseInputClassName })
        : null}

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
          className={baseInputClassName}
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
    </>
  );
};

export default RecipeFormFields;
