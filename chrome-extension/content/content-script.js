// content/content-script.js

/**
 * Content Script injecté sur les sites de recettes
 * Détecte et extrait automatiquement les recettes
 */

console.log('🔍 Recipe AI Assistant - Content Script actif');

// Configuration des sélecteurs par site
const SITE_CONFIGS = {
  'marmiton.org': {
    titre: 'h1.main-title',
    description: '.recipe-description',
    ingredients: '.ingredient-item',
    etapes: '.recipe-step-list li',
    image: '.recipe-media-viewer-main-picture img',
    temps: '.recipe-infos__timmings',
    difficulte: '.recipe-infos__level',
    personnes: '.recipe-infos__quantity'
  },
  '750g.com': {
    titre: 'h1.c-recipe-title',
    description: '.c-recipe-description',
    ingredients: '.c-recipe-ingredients li',
    etapes: '.c-recipe-steps li',
    image: '.c-recipe-image img'
  },
  'cuisineaz.com': {
    titre: 'h1[itemprop="name"]',
    description: '[itemprop="description"]',
    ingredients: '.ingredient',
    etapes: '.instruction',
    image: '[itemprop="image"]'
  }
};

// Détecter si on est sur une page de recette
function isRecipePage() {
  const hostname = window.location.hostname;
  const config = Object.keys(SITE_CONFIGS).find(site => hostname.includes(site));
  
  if (!config) return false;
  
  // Vérifier si les éléments clés existent
  const siteConfig = SITE_CONFIGS[config];
  return document.querySelector(siteConfig.titre) !== null;
}

// Extraire les données de la recette
function extractRecipeData() {
  const hostname = window.location.hostname;
  const configKey = Object.keys(SITE_CONFIGS).find(site => hostname.includes(site));
  
  if (!configKey) return null;
  
  const config = SITE_CONFIGS[configKey];
  
  try {
    // Titre
    const titre = document.querySelector(config.titre)?.innerText?.trim() || '';
    
    // Description
    const description = document.querySelector(config.description)?.innerText?.trim() || '';
    
    // Ingrédients
    const ingredients = Array.from(document.querySelectorAll(config.ingredients))
      .map(el => ({
        nom: el.innerText.trim(),
        quantite: extractQuantity(el.innerText)
      }))
      .filter(ing => ing.nom);
    
    // Étapes
    const etapes = Array.from(document.querySelectorAll(config.etapes))
      .map((el, idx) => ({
        numero: idx + 1,
        instruction: el.innerText.trim()
      }))
      .filter(step => step.instruction);
    
    // Image
    const imageEl = document.querySelector(config.image);
    const image = imageEl?.src || imageEl?.getAttribute('data-src') || '';
    
    // Métadonnées
    const temps = extractTemps(config.temps);
    const difficulte = extractDifficulte(config.difficulte);
    const personnes = extractPersonnes(config.personnes);
    
    return {
      titre,
      description,
      ingredients,
      etapes,
      imageUrl: image,
      url: window.location.href,
      source: hostname,
      tempsPreparation: temps.preparation,
      tempsCuisson: temps.cuisson,
      difficulte,
      nombrePersonnes: personnes,
      scrapedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erreur extraction recette:', error);
    return null;
  }
}

// Extraire quantité d'un texte d'ingrédient
function extractQuantity(text) {
  const match = text.match(/^([\d.,\/\s]+(?:g|kg|ml|cl|l|cuillère|c\.|càc|càs)?)/i);
  return match ? match[1].trim() : '';
}

// Extraire temps
function extractTemps(selector) {
  if (!selector) return { preparation: 0, cuisson: 0 };
  
  const tempsEl = document.querySelector(selector);
  if (!tempsEl) return { preparation: 0, cuisson: 0 };
  
  const text = tempsEl.innerText;
  
  const prepMatch = text.match(/préparation[:\s]*(\d+)/i);
  const cuissonMatch = text.match(/cuisson[:\s]*(\d+)/i);
  
  return {
    preparation: prepMatch ? parseInt(prepMatch[1]) : 0,
    cuisson: cuissonMatch ? parseInt(cuissonMatch[1]) : 0
  };
}

// Extraire difficulté
function extractDifficulte(selector) {
  if (!selector) return 'MOYEN';
  
  const diffEl = document.querySelector(selector);
  if (!diffEl) return 'MOYEN';
  
  const text = diffEl.innerText.toLowerCase();
  
  if (text.includes('facile') || text.includes('très facile')) return 'FACILE';
  if (text.includes('difficile')) return 'DIFFICILE';
  return 'MOYEN';
}

// Extraire nombre de personnes
function extractPersonnes(selector) {
  if (!selector) return 4;
  
  const persEl = document.querySelector(selector);
  if (!persEl) return 4;
  
  const match = persEl.innerText.match(/(\d+)/);
  return match ? parseInt(match[1]) : 4;
}

// Injecter bouton "Sauvegarder" sur la page
function injectSaveButton() {
  if (document.getElementById('recipe-ai-save-btn')) return;
  
  const button = document.createElement('button');
  button.id = 'recipe-ai-save-btn';
  button.className = 'recipe-ai-button';
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" stroke-width="2" 
                stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="7 3 7 8 15 8" stroke="currentColor" stroke-width="2" 
                stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>Sauvegarder dans Recipe AI</span>
  `;
  
  button.addEventListener('click', handleSaveClick);
  
  // Positionner le bouton
  document.body.appendChild(button);
}

// Injecter bandeau de comparaison
function injectComparisonBanner(currentRecipe, similarRecipes) {
  if (document.getElementById('recipe-ai-comparison')) return;
  if (!similarRecipes || similarRecipes.length === 0) return;
  
  const banner = document.createElement('div');
  banner.id = 'recipe-ai-comparison';
  banner.className = 'recipe-ai-banner';
  banner.innerHTML = `
    <div class="banner-content">
      <div class="banner-icon">💡</div>
      <div class="banner-text">
        <strong>Nous avons ${similarRecipes.length} recette(s) similaire(s) !</strong>
        <p>Découvrez nos versions optimisées de cette recette</p>
      </div>
      <button class="banner-btn" id="view-similar-btn">
        Voir les recettes
      </button>
      <button class="banner-close" id="close-banner-btn">×</button>
    </div>
  `;
  
  document.body.insertBefore(banner, document.body.firstChild);
  
  // Event listeners
  document.getElementById('view-similar-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'show-similar',
      recipes: similarRecipes
    });
  });
  
  document.getElementById('close-banner-btn').addEventListener('click', () => {
    banner.remove();
  });
}

// Gérer le clic sur "Sauvegarder"
async function handleSaveClick() {
  const button = document.getElementById('recipe-ai-save-btn');
  button.disabled = true;
  button.innerHTML = '<span>⏳ Sauvegarde...</span>';
  
  const recipe = extractRecipeData();
  
  if (!recipe) {
    button.innerHTML = '<span>❌ Erreur</span>';
    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = '<span>Sauvegarder dans Recipe AI</span>';
    }, 2000);
    return;
  }
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'save-recipe',
      recipe,
      userId: await getUserId()
    });
    
    if (response.success) {
      button.innerHTML = '<span>✓ Sauvegardée !</span>';
      button.style.background = '#4CAF50';
      
      // Montrer notification
      showToast('Recette sauvegardée avec succès !', 'success');
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
    button.innerHTML = '<span>❌ Erreur</span>';
    showToast('Erreur lors de la sauvegarde', 'error');
  }
  
  setTimeout(() => {
    button.disabled = false;
    button.innerHTML = '<span>Sauvegarder dans Recipe AI</span>';
    button.style.background = '';
  }, 3000);
}

// Récupérer l'ID utilisateur
async function getUserId() {
  const result = await chrome.storage.local.get(['currentUser']);
  return result.currentUser?.id || null;
}

// Afficher toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `recipe-ai-toast recipe-ai-toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Comparer avec nos recettes
async function compareWithOurRecipes() {
  const currentRecipe = extractRecipeData();
  if (!currentRecipe) return;
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'search-semantic',
      query: currentRecipe.titre
    });
    
    if (response.success && response.results.results.length > 0) {
      injectComparisonBanner(currentRecipe, response.results.results);
    }
  } catch (error) {
    console.error('Erreur comparaison:', error);
  }
}

// Initialisation
function init() {
  if (isRecipePage()) {
    console.log('📄 Page de recette détectée');
    
    // Injecter bouton de sauvegarde
    setTimeout(injectSaveButton, 1000);
    
    // Comparer avec nos recettes
    setTimeout(compareWithOurRecipes, 2000);
  }
}

// Observer les changements de page (SPA)
const observer = new MutationObserver((mutations) => {
  if (isRecipePage() && !document.getElementById('recipe-ai-save-btn')) {
    init();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Lancer au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Écouter messages du background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract-recipe') {
    const recipe = extractRecipeData();
    sendResponse({ recipe });
  }
  return true;
});