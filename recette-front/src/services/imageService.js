// Mapping de mots-clés français → termes anglais pour loremflickr
const KEYWORD_MAP = {
  // Légumes
  'chou-fleur': 'cauliflower',
  'chou':       'cabbage',
  'carotte':    'carrot',
  'tomate':     'tomato',
  'courgette':  'zucchini',
  'aubergine':  'eggplant',
  'poivron':    'pepper',
  'brocoli':    'broccoli',
  'epinard':    'spinach',
  'asperge':    'asparagus',
  'champignon': 'mushroom',
  'pomme de terre': 'potato',
  // Viandes & poissons
  'poulet':     'chicken',
  'boeuf':      'beef',
  'porc':       'pork',
  'agneau':     'lamb',
  'saumon':     'salmon',
  'thon':       'tuna',
  'crevette':   'shrimp',
  'crevettes':  'shrimp',
  // Plats génériques
  'soupe':      'soup',
  'veloute':    'soup',
  'salade':     'salad',
  'quiche':     'quiche',
  'pizza':      'pizza',
  'pates':      'pasta',
  'risotto':    'risotto',
  'curry':      'curry',
  'tajine':     'tagine',
  'tarte':      'pie',
  'gratin':     'gratin',
  'roulade':    'roulade',
  'feuillette': 'pastry',
  // Desserts
  'gateau':     'cake',
  'chocolat':   'chocolate',
  'mousse':     'mousse',
  'tiramisu':   'tiramisu',
  'creme':      'cream',
  'glace':      'icecream',
  // Fromages
  'chevre':     'goatcheese',
  'fromage':    'cheese',
  // Autres
  'crepe':      'crepe',
  'pancake':    'pancake',
  'omelette':   'omelette',
};

const CATEGORY_IMAGES = {
  dessert:   'https://loremflickr.com/400/300/dessert,cake',
  entree:    'https://loremflickr.com/400/300/salad,appetizer',
  plat:      'https://loremflickr.com/400/300/dinner,meal',
  soupe:     'https://loremflickr.com/400/300/soup,bowl',
  salade:    'https://loremflickr.com/400/300/salad,fresh',
  francaise: 'https://loremflickr.com/400/300/french,cuisine',
  italienne: 'https://loremflickr.com/400/300/italian,pasta',
  japonaise: 'https://loremflickr.com/400/300/japanese,sushi',
  mexicaine: 'https://loremflickr.com/400/300/mexican,tacos',
  default:   'https://loremflickr.com/400/300/food,cooking',
};

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function findKeyword(titre) {
  const t = normalize(titre);
  const sorted = Object.entries(KEYWORD_MAP).sort(
    ([a], [b]) => b.length - a.length
  );
  for (const [fr, en] of sorted) {
    if (t.includes(fr)) return en;
  }
  const words = t.split(/\s+/).filter((w) => w.length > 4);
  return words[0] || null;
}

export function getAutoImage(recipe) {
  if (recipe?.imageUrl && recipe.imageUrl.trim() !== '') {
    return recipe.imageUrl;
  }

  const keyword = findKeyword(recipe?.titre || '');
  if (keyword) {
    const lock = recipe?.id ? `&lock=${recipe.id}` : '';
    return `https://loremflickr.com/400/300/food,${keyword}${lock}`;
  }

  const cuisine = normalize(recipe?.cuisine || '');
  const type = normalize(recipe?.typeRecette || '');

  return (
    CATEGORY_IMAGES[cuisine] ||
    CATEGORY_IMAGES[type] ||
    CATEGORY_IMAGES.default
  );
}