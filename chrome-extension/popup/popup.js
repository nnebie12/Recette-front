// popup/popup.js

/**
 * POPUP - Recipe AI Assistant
 * Gestion de l'interface principale de l'extension
 */

console.log('🚀 Popup chargé');

// État global
let currentTab = 'home';
let currentUser = null;
let shoppingList = [];
let savedRecipes = [];

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', async () => {
  await init();
});

/**
 * INITIALISATION
 */
async function init() {
  console.log('🔧 Initialisation du popup...');
  
  // Charger l'utilisateur
  await loadUser();
  
  // Setup navigation
  setupTabs();
  
  // Setup boutons d'action
  setupActionButtons();
  
  // Setup recherche
  setupSearch();
  
  // Setup shopping list
  setupShoppingList();
  
  // Charger données initiales
  await loadRecommendations();
  await loadShoppingList();
  await loadSavedRecipes();
  
  // Mettre à jour greeting
  updateGreeting();
  
  console.log('✅ Popup initialisé');
}

/**
 * CHARGER UTILISATEUR
 */
async function loadUser() {
  const result = await chrome.storage.local.get(['currentUser']);
  currentUser = result.currentUser || { id: 1, nom: 'Utilisateur' };
  
  // Mettre à jour UI
  const greetingText = document.getElementById('greetingText');
  if (greetingText && currentUser.nom) {
    greetingText.textContent = `Bonjour ${currentUser.nom} !`;
  }
}

/**
 * SETUP NAVIGATION TABS
 */
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });
}

/**
 * CHANGER D'ONGLET
 */
function switchTab(tabName) {
  // Désactiver tous les onglets
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  // Activer l'onglet sélectionné
  const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
  const selectedContent = document.getElementById(`${tabName}Tab`);
  
  if (selectedTab) selectedTab.classList.add('active');
  if (selectedContent) selectedContent.classList.add('active');
  
  currentTab = tabName;
  
  // Charger données spécifiques à l'onglet
  switch(tabName) {
    case 'home':
      loadRecommendations();
      break;
    case 'shopping':
      loadShoppingList();
      break;
    case 'saved':
      loadSavedRecipes();
      break;
  }
}

/**
 * SETUP BOUTONS D'ACTION
 */
function setupActionButtons() {
  // Bouton recette rapide
  const quickRecipeBtn = document.getElementById('quickRecipeBtn');
  if (quickRecipeBtn) {
    quickRecipeBtn.addEventListener('click', () => {
      searchQuickRecipes();
    });
  }
  
  // Bouton surprise
  const surpriseMeBtn = document.getElementById('surpriseMeBtn');
  if (surpriseMeBtn) {
    surpriseMeBtn.addEventListener('click', () => {
      getSurpriseRecipe();
    });
  }
  
  // Bouton rafraîchir recommandations
  const refreshBtn = document.getElementById('refreshRecommendations');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadRecommendations(true);
    });
  }
  
  // Bouton ouvrir app
  const openAppBtn = document.getElementById('openWebApp');
  if (openAppBtn) {
    openAppBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:5374' });
    });
  }
  
  // Bouton paramètres
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      // TODO: Ouvrir page paramètres
      alert('Paramètres - À implémenter');
    });
  }
}

/**
 * CHARGER RECOMMANDATIONS
 */
async function loadRecommendations(forceRefresh = false) {
  const listContainer = document.getElementById('recommendationsList');
  if (!listContainer) return;
  
  // Afficher loading
  listContainer.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Chargement des recommandations...</p>
    </div>
  `;
  
  try {
    // Envoyer message au background script
    const response = await chrome.runtime.sendMessage({
      action: 'get-recommendations',
      userId: currentUser.id
    });
    
    if (response.success && response.recommendations) {
      const recipes = response.recommendations.recommendations || [];
      displayRecommendations(recipes);
      
      // Charger tendances
      await loadTrending();
    } else {
      listContainer.innerHTML = `
        <div class="empty-state">
          <p>Aucune recommandation pour le moment</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Erreur chargement recommandations:', error);
    listContainer.innerHTML = `
      <div class="error-state">
        <p>❌ Erreur de chargement</p>
        <button onclick="loadRecommendations()">Réessayer</button>
      </div>
    `;
  }
}

/**
 * AFFICHER RECOMMANDATIONS
 */
function displayRecommendations(recipes) {
  const listContainer = document.getElementById('recommendationsList');
  if (!listContainer) return;
  
  if (recipes.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <p>Aucune recommandation disponible</p>
      </div>
    `;
    return;
  }
  
  listContainer.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
}

/**
 * CRÉER CARTE RECETTE
 */
function createRecipeCard(recipe) {
  return `
    <div class="recipe-card" data-recipe-id="${recipe.id}">
      ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.titre}" class="recipe-image">` : ''}
      <div class="recipe-info">
        <h4 class="recipe-title">${recipe.titre}</h4>
        <p class="recipe-desc">${truncate(recipe.description, 80)}</p>
        <div class="recipe-meta">
          <span class="meta-item">⏱ ${recipe.tempsPreparation || 30}min</span>
          <span class="meta-item">📊 ${recipe.difficulte || 'Moyen'}</span>
        </div>
        <button class="btn-view-recipe" onclick="viewRecipe(${recipe.id})">
          Voir la recette
        </button>
      </div>
    </div>
  `;
}

/**
 * CHARGER TENDANCES
 */
async function loadTrending() {
  const trendingContainer = document.getElementById('trendingList');
  if (!trendingContainer) return;
  
  // Pour l'instant, afficher des suggestions statiques
  // TODO: Récupérer vraies tendances de l'API
  const trending = [
    { name: 'Recettes d\'été', icon: '☀️' },
    { name: 'Plats italiens', icon: '🍝' },
    { name: 'Desserts rapides', icon: '🍰' }
  ];
  
  trendingContainer.innerHTML = trending.map(trend => `
    <div class="trending-item" onclick="searchTrending('${trend.name}')">
      <span class="trending-icon">${trend.icon}</span>
      <span class="trending-name">${trend.name}</span>
    </div>
  `).join('');
}

/**
 * SETUP RECHERCHE
 */
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const voiceBtn = document.getElementById('voiceSearchBtn');
  
  if (searchInput) {
    // Recherche en temps réel
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (e.target.value.length >= 3) {
          performSearch(e.target.value);
        }
      }, 500);
    });
    
    // Recherche au Enter
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        performSearch(e.target.value);
      }
    });
  }
  
  // Recherche vocale
  if (voiceBtn) {
    voiceBtn.addEventListener('click', startVoiceSearch);
  }
  
  // Filtres
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      const filter = chip.dataset.filter;
      applyFilter(filter);
    });
  });
  
  // Suggestions
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      searchInput.value = chip.textContent;
      performSearch(chip.textContent);
    });
  });
}

/**
 * EFFECTUER RECHERCHE
 */
async function performSearch(query) {
  const resultsContainer = document.getElementById('searchResults');
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Recherche en cours...</p>
    </div>
  `;
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'search-semantic',
      query: query
    });
    
    if (response.success && response.results) {
      const recipes = response.results.results || [];
      displaySearchResults(recipes);
    }
  } catch (error) {
    console.error('Erreur recherche:', error);
    resultsContainer.innerHTML = `
      <div class="error-state">
        <p>❌ Erreur de recherche</p>
      </div>
    `;
  }
}

/**
 * AFFICHER RÉSULTATS RECHERCHE
 */
function displaySearchResults(recipes) {
  const resultsContainer = document.getElementById('searchResults');
  if (!resultsContainer) return;
  
  if (recipes.length === 0) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Aucun résultat trouvé</p>
      </div>
    `;
    return;
  }
  
  resultsContainer.innerHTML = `
    <div class="search-results-list">
      ${recipes.map(recipe => createRecipeCard(recipe)).join('')}
    </div>
  `;
}

/**
 * RECHERCHE VOCALE
 */
function startVoiceSearch() {
  // Vérifier compatibilité
  if (!('webkitSpeechRecognition' in window)) {
    alert('La recherche vocale n\'est pas supportée par votre navigateur');
    return;
  }
  
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'fr-FR';
  recognition.continuous = false;
  recognition.interimResults = false;
  
  recognition.onstart = () => {
    document.getElementById('voiceSearchBtn').classList.add('recording');
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('searchInput').value = transcript;
    performSearch(transcript);
  };
  
  recognition.onerror = (event) => {
    console.error('Erreur reconnaissance vocale:', event.error);
  };
  
  recognition.onend = () => {
    document.getElementById('voiceSearchBtn').classList.remove('recording');
  };
  
  recognition.start();
}

/**
 * SETUP SHOPPING LIST
 */
function setupShoppingList() {
  const addItemInput = document.getElementById('addItemInput');
  const addItemBtn = document.getElementById('addItemBtn');
  const clearBtn = document.getElementById('clearCheckedBtn');
  
  // Ajouter item
  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      const text = addItemInput.value.trim();
      if (text) {
        addShoppingItem(text);
        addItemInput.value = '';
      }
    });
  }
  
  // Ajouter au Enter
  if (addItemInput) {
    addItemInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const text = e.target.value.trim();
        if (text) {
          addShoppingItem(text);
          e.target.value = '';
        }
      }
    });
  }
  
  // Effacer cochés
  if (clearBtn) {
    clearBtn.addEventListener('click', clearCheckedItems);
  }
}

/**
 * CHARGER LISTE DE COURSES
 */
async function loadShoppingList() {
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'get-shopping-list',
      userId: currentUser.id
    });
    
    if (response.success) {
      shoppingList = response.shoppingList || [];
      displayShoppingList();
      updateShoppingStats();
    }
  } catch (error) {
    console.error('Erreur chargement liste:', error);
  }
}

/**
 * AFFICHER LISTE DE COURSES
 */
function displayShoppingList() {
  const listContainer = document.getElementById('shoppingList');
  if (!listContainer) return;
  
  if (shoppingList.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <p>Votre liste de courses est vide</p>
      </div>
    `;
    return;
  }
  
  listContainer.innerHTML = shoppingList.map((item, index) => `
    <div class="shopping-item ${item.checked ? 'checked' : ''}" data-index="${index}">
      <input 
        type="checkbox" 
        ${item.checked ? 'checked' : ''} 
        onchange="toggleShoppingItem(${index})"
      >
      <span class="item-text">${item.text}</span>
      <button class="delete-btn" onclick="deleteShoppingItem(${index})">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  `).join('');
}

/**
 * AJOUTER ITEM À LA LISTE
 */
async function addShoppingItem(text) {
  const newItem = {
    id: Date.now(),
    text: text,
    checked: false,
    addedAt: new Date().toISOString()
  };
  
  shoppingList.push(newItem);
  
  // Sauvegarder
  await chrome.runtime.sendMessage({
    action: 'add-to-shopping-list',
    item: text,
    userId: currentUser.id
  });
  
  displayShoppingList();
  updateShoppingStats();
}

/**
 * TOGGLE ITEM
 */
function toggleShoppingItem(index) {
  shoppingList[index].checked = !shoppingList[index].checked;
  displayShoppingList();
  updateShoppingStats();
  saveShoppingList();
}

/**
 * SUPPRIMER ITEM
 */
function deleteShoppingItem(index) {
  shoppingList.splice(index, 1);
  displayShoppingList();
  updateShoppingStats();
  saveShoppingList();
}

/**
 * EFFACER ITEMS COCHÉS
 */
function clearCheckedItems() {
  shoppingList = shoppingList.filter(item => !item.checked);
  displayShoppingList();
  updateShoppingStats();
  saveShoppingList();
}

/**
 * SAUVEGARDER LISTE
 */
async function saveShoppingList() {
  await chrome.storage.local.set({
    [`shopping_list_${currentUser.id}`]: shoppingList
  });
}

/**
 * METTRE À JOUR STATS
 */
function updateShoppingStats() {
  const totalEl = document.getElementById('totalItems');
  const checkedEl = document.getElementById('checkedItems');
  const badgeEl = document.getElementById('shoppingBadge');
  
  const total = shoppingList.length;
  const checked = shoppingList.filter(item => item.checked).length;
  
  if (totalEl) totalEl.textContent = total;
  if (checkedEl) checkedEl.textContent = checked;
  if (badgeEl) badgeEl.textContent = total;
}

/**
 * CHARGER RECETTES SAUVEGARDÉES
 */
async function loadSavedRecipes() {
  const listContainer = document.getElementById('savedList');
  if (!listContainer) return;
  
  listContainer.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>
  `;
  
  try {
    const result = await chrome.storage.local.get([`saved_recipes_${currentUser.id}`]);
    savedRecipes = result[`saved_recipes_${currentUser.id}`] || [];
    
    displaySavedRecipes();
  } catch (error) {
    console.error('Erreur chargement recettes sauvegardées:', error);
  }
}

/**
 * AFFICHER RECETTES SAUVEGARDÉES
 */
function displaySavedRecipes() {
  const listContainer = document.getElementById('savedList');
  if (!listContainer) return;
  
  if (savedRecipes.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💾</div>
        <p>Aucune recette sauvegardée</p>
        <small>Visitez Marmiton, 750g ou CuisineAZ et cliquez sur "Sauvegarder"</small>
      </div>
    `;
    return;
  }
  
  listContainer.innerHTML = savedRecipes.map(recipe => createRecipeCard(recipe)).join('');
}

/**
 * UTILITAIRES
 */
function truncate(str, length) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}

function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Bonjour';
  
  if (hour < 12) greeting = 'Bon matin';
  else if (hour < 18) greeting = 'Bon après-midi';
  else greeting = 'Bonsoir';
  
  const greetingEl = document.getElementById('greetingText');
  if (greetingEl && currentUser) {
    greetingEl.textContent = `${greeting} ${currentUser.nom || ''} !`;
  }
}

/**
 * FONCTIONS GLOBALES (appelées depuis HTML)
 */
window.viewRecipe = function(recipeId) {
  chrome.tabs.create({
    url: `http://localhost:3000/recettes/${recipeId}`
  });
};

window.searchQuickRecipes = function() {
  switchTab('search');
  document.getElementById('searchInput').value = 'recettes rapides moins de 30 minutes';
  performSearch('recettes rapides moins de 30 minutes');
};

window.getSurpriseRecipe = async function() {
  // TODO: Implémenter surprise aléatoire
  alert('Fonctionnalité surprise - À implémenter');
};

window.searchTrending = function(query) {
  switchTab('search');
  document.getElementById('searchInput').value = query;
  performSearch(query);
};

window.applyFilter = function(filter) {
  // TODO: Implémenter filtres
  console.log('Filtre appliqué:', filter);
};

window.toggleShoppingItem = toggleShoppingItem;
window.deleteShoppingItem = deleteShoppingItem;

console.log('✅ popup.js chargé et prêt');