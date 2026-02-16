import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, CheckCircle, ChefHat, Leaf, Ban, Heart } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import { isValidEmail, isValidPassword } from '../../utils/helpers';

const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    confirmPassword: '',
    preferenceAlimentaire: [], // Liste de préférences
    ingredientsApprecies: [],
    ingredientsEvites: [],
    contraintesAlimentaires: [],
    niveauCuisine: '',
    newsletter: false,
    acceptTerms: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Ingrédients suggérés pour autocomplétion
  const [currentIngredientApprecieName, setCurrentIngredientApprecieName] = useState('');
  const [currentIngredientEviteName, setCurrentIngredientEviteName] = useState('');

  // Options de préférences alimentaires
  const preferencesAlimentairesOptions = [
    { value: 'vegetarien', label: 'Végétarien', icon: '🥗' },
    { value: 'vegetalien', label: 'Végétalien/Vegan', icon: '🌱' },
    { value: 'sans-gluten', label: 'Sans gluten', icon: '🌾' },
    { value: 'sans-lactose', label: 'Sans lactose', icon: '🥛' },
    { value: 'halal', label: 'Halal', icon: '☪️' },
    { value: 'casher', label: 'Casher', icon: '✡️' },
    { value: 'paleo', label: 'Paléo', icon: '🦴' },
    { value: 'keto', label: 'Keto', icon: '🥓' },
    { value: 'pescetarien', label: 'Pescétarien', icon: '🐟' },
    { value: 'flexitarien', label: 'Flexitarien', icon: '🥗' },
  ];

  // Options de contraintes alimentaires
  const contraintesAlimentairesOptions = [
    'Allergie aux arachides',
    'Allergie aux fruits à coque',
    'Allergie aux œufs',
    'Allergie au poisson',
    'Allergie aux crustacés',
    'Allergie au soja',
    'Intolérance au lactose',
    'Maladie cœliaque',
    'Diabète',
    'Hypertension',
    'Cholestérol élevé',
  ];

  // Calculer la force du mot de passe
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Calculer la force du mot de passe
    if (name === 'motDePasse') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Gérer les préférences alimentaires (multi-sélection)
  const togglePreferenceAlimentaire = (preference) => {
    setFormData(prev => {
      const currentPreferences = prev.preferenceAlimentaire;
      const newPreferences = currentPreferences.includes(preference)
        ? currentPreferences.filter(p => p !== preference)
        : [...currentPreferences, preference];
      
      return {
        ...prev,
        preferenceAlimentaire: newPreferences
      };
    });
  };

  // Ajouter un ingrédient apprécié
  const addIngredientAppreciе = () => {
    if (currentIngredientApprecieName.trim() && !formData.ingredientsApprecies.includes(currentIngredientApprecieName.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredientsApprecies: [...prev.ingredientsApprecies, currentIngredientApprecieName.trim()]
      }));
      setCurrentIngredientApprecieName('');
    }
  };

  // Supprimer un ingrédient apprécié
  const removeIngredientAppreciе = (ingredient) => {
    setFormData(prev => ({
      ...prev,
      ingredientsApprecies: prev.ingredientsApprecies.filter(i => i !== ingredient)
    }));
  };

  // Ajouter un ingrédient évité
  const addIngredientEvite = () => {
    if (currentIngredientEviteName.trim() && !formData.ingredientsEvites.includes(currentIngredientEviteName.trim())) {
      setFormData(prev => ({
        ...prev,
        ingredientsEvites: [...prev.ingredientsEvites, currentIngredientEviteName.trim()]
      }));
      setCurrentIngredientEviteName('');
    }
  };

  // Supprimer un ingrédient évité
  const removeIngredientEvite = (ingredient) => {
    setFormData(prev => ({
      ...prev,
      ingredientsEvites: prev.ingredientsEvites.filter(i => i !== ingredient)
    }));
  };

  // Gérer les contraintes alimentaires (multi-sélection)
  const toggleContrainteAlimentaire = (contrainte) => {
    setFormData(prev => {
      const currentContraintes = prev.contraintesAlimentaires;
      const newContraintes = currentContraintes.includes(contrainte)
        ? currentContraintes.filter(c => c !== contrainte)
        : [...currentContraintes, contrainte];
      
      return {
        ...prev,
        contraintesAlimentaires: newContraintes
      };
    });
  };

  const validate = () => {
    const errors = {};

    // Validation nom
    if (!formData.nom.trim()) {
      errors.nom = 'Le nom est requis';
    } else if (formData.nom.length < 2) {
      errors.nom = 'Le nom doit contenir au moins 2 caractères';
    } else if (formData.nom.length > 100) {
      errors.nom = 'Le nom ne peut pas dépasser 100 caractères';
    }

    // Validation prénom
    if (!formData.prenom.trim()) {
      errors.prenom = 'Le prénom est requis';
    } else if (formData.prenom.length < 2) {
      errors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    } else if (formData.prenom.length > 100) {
      errors.prenom = 'Le prénom ne peut pas dépasser 100 caractères';
    }

    // Validation email
    if (!formData.email) {
      errors.email = 'L\'email est requis';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Format d\'email invalide';
    } else if (formData.email.length > 255) {
      errors.email = 'L\'email ne peut pas dépasser 255 caractères';
    }

    // Validation mot de passe
    if (!formData.motDePasse) {
      errors.motDePasse = 'Le mot de passe est requis';
    } else if (!isValidPassword(formData.motDePasse)) {
      errors.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (passwordStrength < 3) {
      errors.motDePasse = 'Mot de passe trop faible. Ajoutez des majuscules, chiffres et caractères spéciaux';
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (formData.motDePasse !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation conditions d'utilisation
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);
    try {
      const userData = { ...formData };
      await register(userData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Faible';
    if (passwordStrength <= 3) return 'Moyen';
    if (passwordStrength <= 4) return 'Fort';
    return 'Très fort';
  };

  return (
    <div className="w-full max-w-3xl">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-green-700">
            Inscription réussie ! Redirection vers la page de connexion...
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Informations personnelles */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Informations personnelles
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Prénom"
              label="Prénom"
              icon={User}
              error={formErrors.prenom}
              required
              maxLength={100}
            />

            <Input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom"
              label="Nom"
              icon={User}
              error={formErrors.nom}
              required
              maxLength={100}
            />
          </div>

          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            label="Adresse email"
            icon={Mail}
            error={formErrors.email}
            required
            maxLength={255}
          />
        </div>

        {/* Section Préférences culinaires */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-orange-500" />
            Préférences culinaires
          </h3>

          {/* Préférences alimentaires (multi-sélection) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Régimes alimentaires
              <span className="text-gray-500 text-xs ml-2">(plusieurs choix possibles)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {preferencesAlimentairesOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => togglePreferenceAlimentaire(option.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200 text-left
                    ${formData.preferenceAlimentaire.includes(option.value)
                      ? 'border-orange-500 bg-orange-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {formData.preferenceAlimentaire.length > 0 && (
              <p className="text-xs text-gray-600 mt-2">
                {formData.preferenceAlimentaire.length} régime(s) sélectionné(s)
              </p>
            )}
          </div>

          {/* Niveau en cuisine */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Niveau en cuisine
            </label>
            <select
              name="niveauCuisine"
              value={formData.niveauCuisine}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="">Sélectionnez votre niveau</option>
              <option value="debutant">🌱 Débutant - Je commence à peine</option>
              <option value="intermediaire">👨‍🍳 Intermédiaire - Je me débrouille bien</option>
              <option value="avance">🔥 Avancé - Je maîtrise les techniques</option>
              <option value="expert">⭐ Expert - Chef cuisinier</option>
            </select>
          </div>

          {/* Ingrédients appréciés */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Ingrédients que vous appréciez
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentIngredientApprecieName}
                onChange={(e) => setCurrentIngredientApprecieName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredientAppreciе())}
                placeholder="Ex: Tomates, Basilic, Poulet..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={addIngredientAppreciе}
                className="px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Ajouter
              </button>
            </div>
            {formData.ingredientsApprecies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.ingredientsApprecies.map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    <Heart className="w-3 h-3" />
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => removeIngredientAppreciе(ingredient)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Ingrédients évités */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Ban className="w-4 h-4 text-red-500" />
              Ingrédients à éviter
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentIngredientEviteName}
                onChange={(e) => setCurrentIngredientEviteName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredientEvite())}
                placeholder="Ex: Arachides, Gluten, Lactose..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={addIngredientEvite}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Ajouter
              </button>
            </div>
            {formData.ingredientsEvites.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.ingredientsEvites.map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    <Ban className="w-3 h-3" />
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => removeIngredientEvite(ingredient)}
                      className="ml-1 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Contraintes alimentaires */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-orange-500" />
              Contraintes alimentaires
              <span className="text-gray-500 text-xs ml-2">(allergies, intolérances)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg">
              {contraintesAlimentairesOptions.map((contrainte) => (
                <label
                  key={contrainte}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.contraintesAlimentaires.includes(contrainte)}
                    onChange={() => toggleContrainteAlimentaire(contrainte)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{contrainte}</span>
                </label>
              ))}
            </div>
            {formData.contraintesAlimentaires.length > 0 && (
              <p className="text-xs text-gray-600 mt-2">
                {formData.contraintesAlimentaires.length} contrainte(s) sélectionnée(s)
              </p>
            )}
          </div>
        </div>

        {/* Section Sécurité */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-500" />
            Sécurité
          </h3>

          <div className="space-y-2">
            <Input
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              placeholder="••••••••"
              label="Mot de passe"
              icon={Lock}
              error={formErrors.motDePasse}
              required
            />
            
            {formData.motDePasse && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Force du mot de passe:</span>
                  <span className={`font-medium ${
                    passwordStrength <= 2 ? 'text-red-600' :
                    passwordStrength <= 3 ? 'text-yellow-600' :
                    passwordStrength <= 4 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <ul className="text-xs text-gray-600 mt-2 space-y-1">
                  <li className={formData.motDePasse.length >= 8 ? 'text-green-600' : ''}>
                    ✓ Au moins 8 caractères
                  </li>
                  <li className={/[A-Z]/.test(formData.motDePasse) && /[a-z]/.test(formData.motDePasse) ? 'text-green-600' : ''}>
                    ✓ Majuscules et minuscules
                  </li>
                  <li className={/\d/.test(formData.motDePasse) ? 'text-green-600' : ''}>
                    ✓ Au moins un chiffre
                  </li>
                  <li className={/[^a-zA-Z0-9]/.test(formData.motDePasse) ? 'text-green-600' : ''}>
                    ✓ Caractère spécial (!@#$%...)
                  </li>
                </ul>
              </div>
            )}
          </div>

          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            label="Confirmer le mot de passe"
            icon={Lock}
            error={formErrors.confirmPassword}
            required
          />
        </div>

        {/* Section Conditions et Newsletter */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-start">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-1"
            />
            <label className="ml-2 text-sm text-gray-700">
              J'accepte les{' '}
              <Link to="/terms" className="text-orange-600 hover:text-orange-700 font-medium underline">
                conditions d'utilisation
              </Link>{' '}
              et la{' '}
              <Link to="/privacy" className="text-orange-600 hover:text-orange-700 font-medium underline">
                politique de confidentialité
              </Link>
              <span className="text-red-500 ml-1">*</span>
            </label>
          </div>
          {formErrors.acceptTerms && (
            <p className="text-sm text-red-600 ml-6">{formErrors.acceptTerms}</p>
          )}

          <div className="flex items-start">
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-1"
            />
            <label className="ml-2 text-sm text-gray-600">
              Je souhaite recevoir la newsletter avec des recettes, des astuces culinaires et des nouveautés
            </label>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={success}
        >
          {loading ? 'Inscription en cours...' : 'Créer mon compte'}
        </Button>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;