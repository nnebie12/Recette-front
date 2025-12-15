// API Configuration
export const API_BASE_URL = 'http://localhost:8080/api';

// Routes
export const ROUTES = {
  HOME: '/',
  RECIPES: '/recipes',
  RECIPE_DETAIL: '/recipes/:id',
  FAVORITES: '/favorites',
  RECOMMENDATIONS: '/recommendations',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register'
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  FACILE: { label: 'Facile', color: 'green' },
  MOYEN: { label: 'Moyen', color: 'yellow' },
  DIFFICILE: { label: 'Difficile', color: 'red' }
};

// User Roles
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

// Interaction Types
export const INTERACTION_TYPES = {
  VIEW: 'CONSULTATION',
  LIKE: 'LIKE',
  COMMENT: 'COMMENTAIRE',
  RATING: 'NOTE',
  SHARE: 'PARTAGE',
  SAVE: 'SAUVEGARDE'
};

// Recommendation Types
export const RECOMMENDATION_TYPES = {
  PERSONALIZED: 'PERSONNALISEE',
  SEASONAL: 'SAISONNIERE',
  TIMESLOT: 'CRENEAU',
  HABIT_BASED: 'HABITUDES',
  ENGAGEMENT: 'ENGAGEMENT'
};

// User Profiles
export const USER_PROFILES = {
  NOUVEAU: { label: 'Nouveau', color: 'blue' },
  DEBUTANT: { label: 'Débutant', color: 'cyan' },
  OCCASIONNEL: { label: 'Occasionnel', color: 'yellow' },
  ACTIF: { label: 'Actif', color: 'orange' },
  FIDELE: { label: 'Fidèle', color: 'green' }
};

// Seasons
export const SEASONS = {
  PRINTEMPS: 'Printemps',
  ETE: 'Été',
  AUTOMNE: 'Automne',
  HIVER: 'Hiver'
};

// Time Slots
export const TIME_SLOTS = {
  PETIT_DEJEUNER: { label: 'Petit-déjeuner', start: '06:00', end: '10:00' },
  DEJEUNER: { label: 'Déjeuner', start: '11:00', end: '14:00' },
  DINER: { label: 'Dîner', start: '18:00', end: '21:00' }
};

// Pagination
export const ITEMS_PER_PAGE = 12;

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie !',
  LOGIN_ERROR: 'Erreur de connexion',
  REGISTER_SUCCESS: 'Inscription réussie !',
  REGISTER_ERROR: 'Erreur lors de l\'inscription',
  RECIPE_CREATED: 'Recette créée avec succès !',
  RECIPE_UPDATED: 'Recette mise à jour !',
  RECIPE_DELETED: 'Recette supprimée',
  FAVORITE_ADDED: 'Ajouté aux favoris',
  FAVORITE_REMOVED: 'Retiré des favoris',
  COMMENT_ADDED: 'Commentaire ajouté',
  RATING_ADDED: 'Note ajoutée'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'current_user',
  THEME: 'app_theme'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  UNAUTHORIZED: 'Vous devez être connecté',
  FORBIDDEN: 'Accès non autorisé',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur',
  VALIDATION_ERROR: 'Données invalides'
};

export const TYPE_ICON_MAP = {
  PERSONNALISEE: 'Sparkles',
  SAISONNIERE: 'Leaf',
  CRENEAU: 'Clock',
  HABITUDES: 'TrendingUp',
  ENGAGEMENT: 'TrendingUp',
};
