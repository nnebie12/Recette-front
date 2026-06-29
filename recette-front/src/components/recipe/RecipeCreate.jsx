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
  // ✅ CHAMPS MANQUANTS AJOUTÉS
  categorie: 'AUTRE',
  saison: 'TOUTE_ANNEE',
  typeCuisine: '',
  ingredients: [{ ingredientName: '', quantite: '' }],
  imageFile: null,
});

const RecipeCreate = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState(getInitialFormState());
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...form.ingredients];
    newIngredients[index][field] = value;
    setForm(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setForm(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredientName: '', quantite: '' }]
    }));
  };

  const removeIngredient = (index) => {
    setForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm(prev => ({
        ...prev,
        imageFile: e.target.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ CRÉER UN OBJET JSON CONFORME AU BACKEND
      const recetteData = {
        titre: form.titre,
        description: form.description,
        cuisine: form.cuisine,
        typeRecette: form.typeRecette,
        vegetarien: form.vegetarien,
        tempsPreparation: parseInt(form.tempsPreparation) || 0,
        tempsCuisson: parseInt(form.tempsCuisson) || 0,
        difficulte: form.difficulte,
        categorie: form.categorie,      // ✅ NOUVEAU
        saison: form.saison,            // ✅ NOUVEAU
        typeCuisine: form.typeCuisine,  // ✅ NOUVEAU
        // imageUrl n'est pas envoyé ici, il sera géré par l'upload d'image
      };

      // Si l'utilisateur a ajouté une image, l'upload sera fait séparément
      // ou on peut envoyer une FormData mixte
      if (form.imageFile) {
        const formData = new FormData();
        formData.append('recetteData', JSON.stringify(recetteData));
        formData.append('file', form.imageFile);
        
        await onCreated(formData);
      } else {
        // Envoyer juste les données JSON si pas d'image
        await onCreated(recetteData);
      }
      
      setForm(getInitialFormState());
      onClose();
    } catch (error) {
      console.error('Erreur création recette:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer une recette" size="lg">
      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium mb-1">Titre *</label>
          <input
            type="text"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            rows="3"
          />
        </div>

        {/* Temps Préparation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Temps préparation (min)</label>
            <input
              type="number"
              name="tempsPreparation"
              value={form.tempsPreparation}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temps cuisson (min)</label>
            <input
              type="number"
              name="tempsCuisson"
              value={form.tempsCuisson}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Difficulté */}
        <div>
          <label className="block text-sm font-medium mb-1">Difficulté</label>
          <select
            name="difficulte"
            value={form.difficulte}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="FACILE">Facile</option>
            <option value="MOYEN">Moyen</option>
            <option value="DIFFICILE">Difficile</option>
          </select>
        </div>

        {/* Cuisine */}
        <div>
          <label className="block text-sm font-medium mb-1">Cuisine</label>
          <select
            name="cuisine"
            value={form.cuisine}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Sélectionnez une cuisine</option>
            <option value="francaise">🇫🇷 Française</option>
            <option value="italienne">🇮🇹 Italienne</option>
            <option value="japonaise">🇯🇵 Japonaise</option>
            <option value="mexicaine">🇲🇽 Mexicaine</option>
            <option value="asiatique">🌏 Asiatique</option>
            <option value="indienne">🇮🇳 Indienne</option>
          </select>
        </div>

        {/* Type de Cuisine (NOUVEAU) */}
        <div>
          <label className="block text-sm font-medium mb-1">Type de Cuisine</label>
          <input
            type="text"
            name="typeCuisine"
            value={form.typeCuisine}
            onChange={handleChange}
            placeholder="ex: Méditerranéenne, Asiatique..."
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Type de Recette */}
        <div>
          <label className="block text-sm font-medium mb-1">Type de plat</label>
          <select
            name="typeRecette"
            value={form.typeRecette}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Sélectionnez un type</option>
            <option value="entree">Entrée</option>
            <option value="plat">Plat</option>
            <option value="dessert">Dessert</option>
            <option value="accompagnement">Accompagnement</option>
            <option value="sauce">Sauce</option>
          </select>
        </div>

        {/* Catégorie (NOUVEAU) */}
        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <select
            name="categorie"
            value={form.categorie}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="APPETIZERS">Appetizers</option>
            <option value="MAINS">Plats principaux</option>
            <option value="DESSERTS">Desserts</option>
            <option value="SOUPS">Soupes</option>
            <option value="SALADS">Salades</option>
            <option value="BEVERAGES">Boissons</option>
            <option value="AUTRE">Autre</option>
          </select>
        </div>

        {/* Saison (NOUVEAU) */}
        <div>
          <label className="block text-sm font-medium mb-1">Saison</label>
          <select
            name="saison"
            value={form.saison}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="PRINTEMPS">Printemps</option>
            <option value="ETE">Été</option>
            <option value="AUTOMNE">Automne</option>
            <option value="HIVER">Hiver</option>
            <option value="TOUTE_ANNEE">Toute l'année</option>
          </select>
        </div>

        {/* Végétarien */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="vegetarien"
            checked={form.vegetarien}
            onChange={handleChange}
          />
          <span className="text-sm font-medium">Végétarien</span>
        </label>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            name="imageFile"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Ingrédients */}
        <div>
          <label className="block text-sm font-medium mb-2">Ingrédients</label>
          {form.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nom ingrédient"
                value={ingredient.ingredientName}
                onChange={(e) => handleIngredientChange(index, 'ingredientName', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Quantité (ex: 200g, 2 tasses)"
                value={ingredient.quantite}
                onChange={(e) => handleIngredientChange(index, 'quantite', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              {form.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + Ajouter ingrédient
          </button>
        </div>

        {/* Boutons */}
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