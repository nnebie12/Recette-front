
import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import RecipeFormFields from './RecipeFormFields';

const getInitialFormState = () => ({
  titre: '',
  description: '',
  cuisine: '',
  typeRecette: '',
  vegetarien: false,
  tempsPreparation: '',
  tempsCuisson: '',
  difficulte: 'FACILE',
  ingredients: [{ ingredientName: '', quantite: '' }],
  imageFile: null,
  imageUrl: null,
});

const RecipeCreate = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState(getInitialFormState);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('titre', form.titre);
      formData.append('description', form.description);
      formData.append('cuisine', form.cuisine);
      formData.append('typeRecette', form.typeRecette);
      formData.append('vegetarien', form.vegetarien);
      formData.append('tempsPreparation', form.tempsPreparation);
      formData.append('tempsCuisson', form.tempsCuisson);
      formData.append('difficulte', form.difficulte);
      formData.append('ingredients', JSON.stringify(form.ingredients));

      if (form.imageFile) {
        formData.append('file', form.imageFile);
      }

      await onCreated(formData);
      
      setForm(getInitialFormState());
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
        <RecipeFormFields
          form={form}
          setForm={setForm}
          renderExtraFields={({ form: currentForm, handleChange, selectClassName }) => (
            <>
              <select
                name="cuisine"
                value={currentForm.cuisine}
                onChange={handleChange}
                className={selectClassName}
              >
                <option value="">Sélectionnez une cuisine</option>
                <option value="francaise">🇫🇷 Française</option>
                <option value="italienne">🇮🇹 Italienne</option>
                <option value="japonaise">🇯🇵 Japonaise</option>
                <option value="mexicaine">🇲🇽 Mexicaine</option>
              </select>

              <select
                name="typeRecette"
                value={currentForm.typeRecette}
                onChange={handleChange}
                className={selectClassName}
              >
                <option value="">Type de plat</option>
                <option value="entree">Entrée</option>
                <option value="plat">Plat</option>
                <option value="dessert">Dessert</option>
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="vegetarien"
                  checked={currentForm.vegetarien}
                  onChange={handleChange}
                />
                Végétarien
              </label>
            </>
          )}
        />

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