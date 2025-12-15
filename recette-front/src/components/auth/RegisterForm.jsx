import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
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
    preferenceAlimentaire: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.nom) {
      errors.nom = 'Le nom est requis';
    }

    if (!formData.prenom) {
      errors.prenom = 'Le prénom est requis';
    }

    if (!formData.email) {
      errors.email = 'L\'email est requis';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Email invalide';
    }

    if (!formData.motDePasse) {
      errors.motDePasse = 'Le mot de passe est requis';
    } else if (!isValidPassword(formData.motDePasse)) {
      errors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (formData.motDePasse !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
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
      const { _confirmPassword, ...userData } = formData;
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

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Inscription</h2>
        <p className="mt-2 text-gray-600">
          Créez votre compte pour commencer
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-green-700">
            Inscription réussie ! Redirection vers la page de connexion...
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
          />
        </div>

        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="votre@email.com"
          label="Email"
          icon={Mail}
          error={formErrors.email}
          required
        />

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

        <Input
          type="text"
          name="preferenceAlimentaire"
          value={formData.preferenceAlimentaire}
          onChange={handleChange}
          placeholder="Ex: Végétarien, Sans gluten..."
          label="Préférences alimentaires (optionnel)"
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            required
            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-1"
          />
          <label className="ml-2 text-sm text-gray-600">
            J'accepte les{' '}
            <Link to="/terms" className="text-orange-500 hover:text-orange-600">
              conditions d'utilisation
            </Link>{' '}
            et la{' '}
            <Link to="/privacy" className="text-orange-500 hover:text-orange-600">
              politique de confidentialité
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={success}
        >
          S'inscrire
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;