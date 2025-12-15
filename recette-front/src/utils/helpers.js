import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
};

// Format cooking time
export const formatCookingTime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

// Calculate average rating
export const calculateAverageRating = (notes) => {
  if (!notes || notes.length === 0) return 0;
  const sum = notes.reduce((acc, note) => acc + note.valeur, 0);
  return (sum / notes.length).toFixed(1);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
  const colors = {
    FACILE: 'bg-green-100 text-green-800',
    MOYEN: 'bg-yellow-100 text-yellow-800',
    DIFFICILE: 'bg-red-100 text-red-800'
  };
  return colors[difficulty] || colors.MOYEN;
};

// Get profile color
export const getProfileColor = (profile) => {
  const colors = {
    NOUVEAU: 'bg-blue-100 text-blue-800',
    DEBUTANT: 'bg-cyan-100 text-cyan-800',
    OCCASIONNEL: 'bg-yellow-100 text-yellow-800',
    ACTIF: 'bg-orange-100 text-orange-800',
    FIDELE: 'bg-green-100 text-green-800'
  };
  return colors[profile] || colors.NOUVEAU;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password (min 6 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Get current season
export const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'PRINTEMPS';
  if (month >= 6 && month <= 8) return 'ETE';
  if (month >= 9 && month <= 11) return 'AUTOMNE';
  return 'HIVER';
};

// Get current time slot
export const getCurrentTimeSlot = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) return 'PETIT_DEJEUNER';
  if (hour >= 11 && hour < 14) return 'DEJEUNER';
  if (hour >= 18 && hour < 21) return 'DINER';
  return null;
};

// Format number with spaces (1000 => 1 000)
export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate session ID
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get device type
export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Sort recipes
export const sortRecipes = (recipes, sortBy) => {
  const sorted = [...recipes];
  
  switch(sortBy) {
    case 'date_desc':
      return sorted.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
    case 'date_asc':
      return sorted.sort((a, b) => new Date(a.dateCreation) - new Date(b.dateCreation));
    case 'rating_desc':
      return sorted.sort((a, b) => (b.moyenneNotes || 0) - (a.moyenneNotes || 0));
    case 'rating_asc':
      return sorted.sort((a, b) => (a.moyenneNotes || 0) - (b.moyenneNotes || 0));
    case 'time_asc':
      return sorted.sort((a, b) => (a.tempsPreparation + a.tempsCuisson) - (b.tempsPreparation + b.tempsCuisson));
    case 'time_desc':
      return sorted.sort((a, b) => (b.tempsPreparation + b.tempsCuisson) - (a.tempsPreparation + a.tempsCuisson));
    default:
      return sorted;
  }
};

// Filter recipes
export const filterRecipes = (recipes, filters) => {
  let filtered = [...recipes];
  
  if (filters.difficulty) {
    filtered = filtered.filter(r => r.difficulte === filters.difficulty);
  }
  
  if (filters.maxTime) {
    filtered = filtered.filter(r => 
      (r.tempsPreparation + r.tempsCuisson) <= filters.maxTime
    );
  }
  
  if (filters.minRating) {
    filtered = filtered.filter(r => 
      (r.moyenneNotes || 0) >= filters.minRating
    );
  }
  
  return filtered;
};