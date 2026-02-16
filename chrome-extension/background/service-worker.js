import { APIClient } from '../utils/api-client.js';
import { StorageManager } from '../utils/storage.js';
import { NotificationManager } from '../utils/notifications.js';
import { BehaviorTracker } from './behavior-tracker.js';


const API_BASE_URL = 'http://localhost:8080/api/v1';
const api = new APIClient(API_BASE_URL);
const storage = new StorageManager();
const notifications = new NotificationManager();

// Initialiser tracker
const tracker = new BehaviorTracker(api, storage);

// TRACKING NAVIGATION
chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.frameId === 0) { // Frame principal seulement
    await tracker.trackNavigation(details.tabId, details.url);
  }
});

// TRACKING TAB ACTIVE (temps passé)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    await tracker.trackTimeSpent(activeInfo.tabId, tab.url);
  }
});

// DÉTECTION CONTEXTE (toutes les 15 min)
chrome.alarms.create('context-detection', {
  periodInMinutes: 15
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'context-detection') {
    const context = await tracker.detectContext();
    
    // Si contexte pertinent, envoyer notification
    if (context && context.mealTime !== 'hors-repas') {
      await sendContextualNotification(context);
    }
  }
  
  // Session summary toutes les heures
  if (alarm.name === 'session-summary') {
    await tracker.sendSessionSummary();
  }
});

// Summary toutes les heures
chrome.alarms.create('session-summary', {
  periodInMinutes: 60
});

// Installation de l'extension
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('🎉 Extension installée');
    
    // Créer menu contextuel
    chrome.contextMenus.create({
      id: 'save-to-shopping-list',
      title: 'Ajouter à ma liste de courses',
      contexts: ['selection']
    });
    
    chrome.contextMenus.create({
      id: 'find-recipes',
      title: 'Trouver des recettes avec "%s"',
      contexts: ['selection']
    });
    
    // Ouvrir page d'accueil
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup/welcome.html')
    });
    
    // Configurer alarmes pour notifications
    setupNotificationAlarms();
  }
});

// Gestion des clics sur menu contextuel
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const selectedText = info.selectionText;
  
  if (info.menuItemId === 'save-to-shopping-list') {
    await addToShoppingList(selectedText);
    notifications.show({
      title: '✓ Ajouté à la liste',
      message: `"${selectedText}" ajouté à votre liste de courses`
    });
  }
  
  if (info.menuItemId === 'find-recipes') {
    await searchRecipes(selectedText);
  }
});

// Alarmes pour notifications contextuelles
function setupNotificationAlarms() {
  // Notification petit-déjeuner (8h00)
  chrome.alarms.create('breakfast-reminder', {
    when: getNextAlarmTime(8, 0),
    periodInMinutes: 1440 // 24h
  });
  
  // Notification déjeuner (12h00)
  chrome.alarms.create('lunch-reminder', {
    when: getNextAlarmTime(12, 0),
    periodInMinutes: 1440
  });
  
  // Notification dîner (19h00)
  chrome.alarms.create('dinner-reminder', {
    when: getNextAlarmTime(19, 0),
    periodInMinutes: 1440
  });
  
  // Check contexte toutes les 15 minutes
  chrome.alarms.create('context-check', {
    periodInMinutes: 15
  });
}

// Gestion des alarmes
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const user = await storage.getCurrentUser();
  if (!user) return;
  
  switch (alarm.name) {
    case 'breakfast-reminder':
      await sendMealRecommendation(user.id, 'petit-dejeuner');
      break;
    case 'lunch-reminder':
      await sendMealRecommendation(user.id, 'dejeuner');
      break;
    case 'dinner-reminder':
      await sendMealRecommendation(user.id, 'diner');
      break;
    case 'context-check':
      await checkContextAndNotify(user.id);
      break;
  }
});

// Envoyer recommandation de repas
async function sendMealRecommendation(userId, mealType) {
  try {
    const response = await api.get(`/recommendations/personalized/${userId}`);
    const recommendations = response.recommendations || [];
    
    if (recommendations.length > 0) {
      const recipe = recommendations[0];
      
      notifications.show({
        title: `🍽️ Suggestion pour votre ${mealType}`,
        message: recipe.titre,
        iconUrl: recipe.imageUrl || '../assets/icon-128.png',
        buttons: [
          { title: 'Voir la recette' },
          { title: 'Plus tard' }
        ],
        data: { recipeId: recipe.id, userId }
      });
    }
  } catch (error) {
    console.error('Erreur recommandation:', error);
  }
}

// Vérifier contexte et notifier
async function checkContextAndNotify(userId) {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length === 0) return;
    
    const currentUrl = new URL(tabs[0].url);
    const hour = new Date().getHours();
    
    // Déterminer contexte
    const context = {
      time: hour,
      currentSite: currentUrl.hostname,
      isWeekend: [0, 6].includes(new Date().getDay())
    };
    
    // Appeler API pour recommandations contextuelles
    const response = await api.post('/recommendations/contextual', context);
    
    if (response.shouldNotify && response.recommendation) {
      notifications.show({
        title: response.recommendation.title,
        message: response.recommendation.message,
        data: { recipeId: response.recommendation.recipeId, userId }
      });
    }
  } catch (error) {
    console.error('Erreur check contexte:', error);
  }
}

// Gestion des clics sur notifications
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
  const notification = await storage.get(`notification_${notificationId}`);
  
  if (buttonIndex === 0) { // "Voir la recette"
    chrome.tabs.create({
      url: `https://votre-site.com/recettes/${notification.data.recipeId}`
    });
  }
  
  chrome.notifications.clear(notificationId);
});

// Messages depuis content script ou popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case 'extract-recipe':
          const recipe = await extractRecipeFromPage(sender.tab.id);
          sendResponse({ success: true, recipe });
          break;
          
        case 'save-recipe':
          await saveRecipe(request.recipe, request.userId);
          sendResponse({ success: true });
          break;
          
        case 'get-recommendations':
          const recommendations = await api.get(
            `/recommendations/personalized/${request.userId}`
          );
          sendResponse({ success: true, recommendations });
          break;
          
        case 'search-semantic':
          const results = await api.post('/nlp/search/semantic', {
            query: request.query
          });
          sendResponse({ success: true, results });
          break;
          
        case 'get-shopping-list':
          const shoppingList = await storage.getShoppingList(request.userId);
          sendResponse({ success: true, shoppingList });
          break;
          
        case 'add-to-shopping-list':
          await addToShoppingList(request.item, request.userId);
          sendResponse({ success: true });
          break;
          
        default:
          sendResponse({ success: false, error: 'Action inconnue' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      sendResponse({ success: false, error: error.message });
    }
  })();
  
  return true; // Permet réponse asynchrone
});

// Extraire recette de la page courante
async function extractRecipeFromPage(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      // Cette fonction s'exécute dans le contexte de la page
      return {
        titre: document.querySelector('h1')?.innerText || '',
        description: document.querySelector('meta[name="description"]')?.content || '',
        image: document.querySelector('img[class*="recipe"]')?.src || '',
        url: window.location.href
      };
    }
  });
  
  return results[0]?.result || null;
}

// Sauvegarder recette
async function saveRecipe(recipe, userId) {
  try {
    // Enregistrer localement
    await storage.saveRecipe(recipe, userId);
    
    // Envoyer à l'API
    await api.post('/recettes/import-externe', {
      ...recipe,
      userId
    });
    
    // Notification
    notifications.show({
      title: '✓ Recette sauvegardée',
      message: recipe.titre
    });
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
    throw error;
  }
}

// Ajouter à la liste de courses
async function addToShoppingList(item, userId) {
  const currentList = await storage.getShoppingList(userId) || [];
  
  currentList.push({
    id: Date.now(),
    text: item,
    checked: false,
    addedAt: new Date().toISOString()
  });
  
  await storage.setShoppingList(currentList, userId);
  
  // Chercher recettes avec cet ingrédient
  try {
    const recipes = await api.post('/nlp/search/semantic', {
      query: item
    });
    
    if (recipes.results && recipes.results.length > 0) {
      // Notifier qu'il y a des recettes disponibles
      chrome.action.setBadgeText({ text: recipes.results.length.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
    }
  } catch (error) {
    console.error('Erreur recherche recettes:', error);
  }
}

// Rechercher recettes
async function searchRecipes(query) {
  try {
    const results = await api.post('/nlp/search/semantic', { query });
    
    // Ouvrir popup avec résultats
    await storage.set('last_search', { query, results: results.results });
    
    chrome.action.openPopup();
  } catch (error) {
    console.error('Erreur recherche:', error);
  }
}

// Calculer prochain déclenchement d'alarme
function getNextAlarmTime(hour, minute) {
  const now = new Date();
  const alarm = new Date();
  alarm.setHours(hour, minute, 0, 0);
  
  if (alarm <= now) {
    alarm.setDate(alarm.getDate() + 1);
  }
  
  return alarm.getTime();
}

/**
 * NOTIFICATIONS CONTEXTUELLES SELON SITE + HEURE
 */
async function sendContextualNotification(context) {
  const user = await storage.getCurrentUser();
  if (!user) return;

  let notification = null;

  // 10h - Sur site de travail
  if (context.hour === 10 && context.activityType === 'travail') {
    notification = {
      title: '☕ Pause café ?',
      message: '3 recettes de cookies rapides pour votre pause',
      icon: 'cookie'
    };
  }

  // 12h30 - Sur Gmail/LinkedIn
  if (context.hour >= 12 && context.hour < 13 && context.activityType === 'travail') {
    notification = {
      title: '🍽️ C\'est l\'heure du déjeuner !',
      message: '5 idées repas en moins de 20 minutes',
      icon: 'lunch'
    };
  }

  // 19h - Sur YouTube/Netflix
  if (context.hour === 19 && context.activityType === 'loisirs') {
    notification = {
      title: '🍷 Menu pour ce soir ?',
      message: 'Recettes parfaites pour un dîner détente',
      icon: 'dinner'
    };
  }

  // Weekend inactif
  if (context.isWeekend && context.hour >= 14) {
    notification = {
      title: '👨‍🍳 Défi cuisine du weekend !',
      message: 'Tentez une nouvelle recette ambitieuse',
      icon: 'challenge'
    };
  }

  if (notification) {
    // Récupérer recommandations de l'API
    try {
      const response = await api.get(`v1/recommendations/contextual/${user.id}?context=${context.mealTime}`);
      
      notifications.show({
        title: notification.title,
        message: notification.message,
        buttons: [
          { title: 'Voir les recettes' },
          { title: 'Plus tard' }
        ],
        data: { 
          recipes: response.recommendations,
          context: context
        }
      });
    } catch (error) {
      console.error('Erreur récupération recommandations:', error);
    }
  }
}

// Nettoyage périodique du cache
chrome.alarms.create('cleanup-cache', {
  periodInMinutes: 1440 // Tous les jours
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'cleanup-cache') {
    await storage.cleanupOldData();
    console.log('🧹 Cache nettoyé');
  }
});

console.log('🚀 Service Worker démarré');