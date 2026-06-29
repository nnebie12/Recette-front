/**
 * Service de gestion des images de recettes - VERSION 2 OPTIMISÉE
 * Stratégie : Titre complet → Ingrédients principaux → Catégorie générique → Fallback
 */

// ============ DICTIONNAIRE AMÉLIORÉ ============

const INGREDIENT_KEYWORDS = {
  // Viandes
  'poulet': 'chicken',
  'poulette': 'chicken',
  'poule': 'chicken',
  'canard': 'duck',
  'veau': 'veal',
  'beef': 'beef',
  'boeuf': 'beef',
  'agneau': 'lamb',
  'mouton': 'lamb',
  'porc': 'pork',
  'saucisse': 'sausage',
  'jambon': 'ham',
  'bacon': 'bacon',
  'foie': 'liver',
  'lapin': 'rabbit',
  'dinde': 'turkey',
  'dindon': 'turkey',
  'poisson': 'fish',
  'saumon': 'salmon',
  'truite': 'trout',
  'morue': 'cod',
  'fruit de mer': 'seafood',
  'crevette': 'shrimp',
  'homard': 'lobster',
  'huitre': 'oyster',
  'hachis': 'minced meat',
  'viande hachée': 'ground beef',

  // Légumes
  'tomate': 'tomato',
  'oignon': 'onion',
  'ail': 'garlic',
  'carotte': 'carrot',
  'courge': 'squash',
  'courgette': 'zucchini',
  'épinard': 'spinach',
  'brocoli': 'broccoli',
  'chou': 'cabbage',
  'poireau': 'leek',
  'champignon': 'mushroom',
  'concombre': 'cucumber',
  'poivron': 'bell pepper',
  'asperge': 'asparagus',
  'betterave': 'beet',
  'aubergine': 'eggplant',
  'patate': 'potato',
  'pomme de terre': 'potato',

  // Féculents & Pâtes
  'riz': 'rice',
  'pâtes': 'pasta',
  'risotto': 'risotto',
  'pain': 'bread',
  'pâte': 'dough pastry',
  'polenta': 'polenta',
  'couscous': 'couscous',

  // Produits laitiers
  'fromage': 'cheese',
  'chèvre': 'goat cheese',
  'lait': 'milk',
  'crème': 'cream',
  'yaourt': 'yogurt',
  'beurre': 'butter',

  // Plats/Styles
  'tajine': 'tagine moroccan',
  'curry': 'curry',
  'rougail': 'creole',
  'gratin': 'gratin baked',
  'soupe': 'soup',
  'salade': 'salad',
  'tarte': 'tart pie',
  'quiche': 'quiche',
  'omelette': 'omelet',
  'crêpe': 'crepe',
  'gâteau': 'cake',
  'carbonade': 'carbonnade beef',
  'cassoulet': 'cassoulet',
  'coq au vin': 'coq au vin',
  'blanquette': 'blanquette',
  'bouillabaisse': 'bouillabaisse',
  'ragoût': 'stew',
  'civet': 'stew',
  'feuilleté': 'puff pastry',

  'poulet rôti': 'roasted chicken',
  'roulade': 'roulade roll',
  'pâté': 'pâté',
  'foie gras': 'foie gras',
  'magret': 'duck breast',
  'confit': 'confit',
  'terrine': 'terrine',
  'flan': 'flan',
  'clafoutis': 'clafoutis',
  'soufflé': 'souffle',
  'pizza' : 'pizza',
  'champignons' : 'mushrooms',
  'lasagnes': 'lasagna'  
};

// ============ HELPERS ============

function getUnsplashKey() {
  // Vérification sécurisée pour Vite
  if (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_UNSPLASH_KEY) {
    return import.meta.env.VITE_UNSPLASH_KEY;
  }

  // Vérification sécurisée pour Create React App / Webpack traditionnel
  if (typeof window !== 'undefined' && window.REACT_APP_UNSPLASH_KEY) {
    return window.REACT_APP_UNSPLASH_KEY;
  }

  return null;
}

/**
 * Extrait les mots-clés du titre
 */
function extractKeywords(recipeName) {
  if (!recipeName) return [];

  const title = recipeName.toLowerCase().trim();
  const keywords = new Set();

  // 1. Chercher les ingrédients connus
  for (const [french, english] of Object.entries(INGREDIENT_KEYWORDS)) {
    if (title.includes(french)) {
      keywords.add(english);
    }
  }

  // 2. Si pas d'ingrédient, prendre mots clés du titre
  if (keywords.size === 0) {
    const words = title
      .split(/[\s,\-()]+/)
      .filter(w => w.length > 3 && !['avec', 'aux', 'pour', 'une', 'des', 'les', 'que'].includes(w))
      .slice(0, 2);
    words.forEach(w => keywords.add(w));
  }

  return Array.from(keywords);
}

/**
 * Génère les variantes de recherche Unsplash
 */
function generateSearchQueries(recipeName, keywords) {
  const queries = [];

  // 1. Titre complet d'abord (meilleur pour les recettes nommées)
  queries.push(`${recipeName} food dish`);
  queries.push(`${recipeName} recipe cooking`);

  // 2. Mots-clés + food
  if (keywords.length > 0) {
    queries.push(`${keywords.join(' ')} food dish`);
    queries.push(`${keywords[0]} food dish`);
  }

  // 3. Génériques
  queries.push('food dish cooking');
  queries.push('french cuisine');

  return queries;
}

// ============ API CALLS ============

/**
 * Recherche sur TheMealDB
 */
async function getMealDBImage(recipeName) {
  try {
    const response = await Promise.race([
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(recipeName)}`),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
    ]);

    if (!response.ok) return null;

    const data = await response.json();
    if (data.meals && data.meals.length > 0 && data.meals[0].strMealThumb) {
      console.log(`✅ TheMealDB: ${recipeName}`);
      return data.meals[0].strMealThumb;
    }
  } catch (error) {
    console.debug(`⏩ TheMealDB miss error: ${error.recipeName}`);
  }

  return null;
}

/**
 * Recherche sur Unsplash avec mots-clés et titre complet
 */
async function getUnsplashImage(recipeName) {
  const key = getUnsplashKey();
  if (!key) {
    console.warn('⚠️ Clé Unsplash manquante');
    return null;
  }

  try {
    const keywords = extractKeywords(recipeName);
    const queries = generateSearchQueries(recipeName, keywords);

    // Essayer chaque variante
    for (const query of queries) {
      console.log(`⏳ Unsplash: "${query}"`);

      const response = await Promise.race([
        fetch(
          `https://api.unsplash.com/search/photos?` +
          `query=${encodeURIComponent(query)} -person -people -portrait -face -selfie&` +
          `per_page=5&` +
          `order_by=relevant&` +
          `client_id=${key}`
        ),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);

      if (!response.ok) {
        if (response.status === 403) {
          console.warn('⚠️ Clé Unsplash invalide ou limitée');
          return null;
        }
        continue;
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Filtrer les bonnes images
        const goodImage = data.results.find(img => {
          // Rejeter les images trop petites
          if (img.height < 200 || img.width < 200) return false;

          // Rejeter les ratios étranges (portrait serré = personne)
          const ratio = img.width / img.height;
          if (ratio > 3 || ratio < 0.33) return false;

          // Éviter les images sombres (cuisine peut être sombre mais pas noir)
          if (img.color === '#000000') return false;

          return true;
        });

        if (goodImage) {
          console.log(`✅ Unsplash: "${query}" → ${recipeName}`);
          return goodImage.urls.regular;
        }
      }
    }

    console.debug(`⏩ Unsplash : pas de résultat valide`);
  } catch (error) {
    console.debug(`⏩ Unsplash error: ${error.message}`);
  }

  return null;
}

/**
 * Image par défaut intelligente basée sur la catégorie
 */
function getFallbackImage(recipeName) {
  const title = recipeName.toLowerCase();

  // Mapper vers des images thématiques
  if (title.includes('dessert') || title.includes('gâteau') || title.includes('tarte')) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'; // Dessert
  }
  if (title.includes('soupe') || title.includes('velouté')) {
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80'; // Soupe
  }
  if (title.includes('salade')) {
    return 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80'; // Salade
  }
  if (title.includes('poisson') || title.includes('saumon') || title.includes('poisson')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'; // Poisson
  }
  if (title.includes('viande') || title.includes('boeuf') || title.includes('poulet')) {
    return 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80'; // Viande
  }

  // Fallback générique - food
  return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80';
}

// ============ MAIN EXPORT ============

/**
 * Récupère une image pour une recette
 * Priorité : TheMealDB → Unsplash (titre + ingrédients) → Fallback intelligent
 */
export async function getAutoImage(recipeName) {
  if (!recipeName || typeof recipeName !== 'string') {
    return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80';
  }

  try {
    // 1️⃣ TheMealDB (anglophone, peu utile pour recettes françaises)
    console.log(`🔍 Recherche image: "${recipeName}"`);
    let imageUrl = await getMealDBImage(recipeName);
    if (imageUrl) return imageUrl;

    // 2️⃣ Unsplash (titre complet + ingrédients)
    imageUrl = await getUnsplashImage(recipeName);
    if (imageUrl) return imageUrl;

    // 3️⃣ Fallback intelligent basé sur la catégorie
    console.log(`🍳 Fallback intelligent: ${recipeName}`);
    return getFallbackImage(recipeName);

  } catch (error) {
    console.error('❌ Erreur getAutoImage:', error);
    return getFallbackImage(recipeName);
  }
}

export default { getAutoImage };