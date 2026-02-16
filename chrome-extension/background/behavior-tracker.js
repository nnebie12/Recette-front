/**
 * BEHAVIOR TRACKER
 * Track et analyse le comportement utilisateur pour enrichir les données MongoDB
 */

export class BehaviorTracker {
  constructor(apiClient, storage) {
    this.api = apiClient;
    this.storage = storage;
    this.sessionData = {
      sitesVisited: [],
      timeSpent: {},
      recipeSitesVisited: [],
      searchQueries: [],
      sessionStart: Date.now()
    };
  }

  /**
   * TRACKING CROSS-SITE
   * Détecte quand l'utilisateur visite des sites de recettes
   */
  async trackNavigation(tabId, url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      // Sites de recettes à tracker
      const recipeSites = [
        'marmiton.org',
        '750g.com',
        'cuisineaz.com',
        'elle.fr',
        'femmeactuelle.fr',
        'ricardocuisine.com',
        'ptitchef.com'
      ];

      const isRecipeSite = recipeSites.some(site => hostname.includes(site));

      if (isRecipeSite) {
        const visitData = {
          url: url,
          hostname: hostname,
          timestamp: new Date().toISOString(),
          tabId: tabId
        };

        // Enregistrer visite en session
        this.sessionData.recipeSitesVisited.push(visitData);

        // Envoyer à MongoDB via API
        await this.sendBehaviorData({
          type: 'RECIPE_SITE_VISIT',
          site: hostname,
          url: url,
          timestamp: new Date().toISOString()
        });

        // Afficher badge sur l'icône
        chrome.action.setBadgeText({ text: '•' });
        chrome.action.setBadgeBackgroundColor({ color: '#FF6B6B' });

        console.log('📍 Visite site recette trackée:', hostname);
      }
    } catch (error) {
      console.error('Erreur tracking navigation:', error);
    }
  }

  /**
   * TRACKING TEMPS PASSÉ
   * Mesure combien de temps sur chaque site
   */
  async trackTimeSpent(tabId, url) {
    try {
      const hostname = new URL(url).hostname;
      
      if (!this.sessionData.timeSpent[hostname]) {
        this.sessionData.timeSpent[hostname] = {
          startTime: Date.now(),
          totalTime: 0,
          visits: 1
        };
      } else {
        this.sessionData.timeSpent[hostname].visits++;
      }

      // Calculer temps total après 30 secondes
      setTimeout(async () => {
        if (this.sessionData.timeSpent[hostname]) {
          const timeSpent = Date.now() - this.sessionData.timeSpent[hostname].startTime;
          this.sessionData.timeSpent[hostname].totalTime = timeSpent;

          // Si plus de 30 secondes sur un site de recettes, tracker
          if (timeSpent > 30000) {
            await this.sendBehaviorData({
              type: 'TIME_SPENT',
              site: hostname,
              duration: timeSpent,
              timestamp: new Date().toISOString()
            });
          }
        }
      }, 30000);

    } catch (error) {
      console.error('Erreur tracking temps:', error);
    }
  }

  /**
   * DÉTECTION CONTEXTE
   * Analyse l'heure et le site pour recommandations
   */
  async detectContext() {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const isWeekend = [0, 6].includes(day);

    try {
      // Récupérer tab active
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length === 0) return null;

      const currentUrl = tabs[0].url;
      const hostname = new URL(currentUrl).hostname;

      // Déterminer contexte
      const context = {
        hour,
        isWeekend,
        currentSite: hostname,
        mealTime: this.getMealTime(hour),
        activityType: this.getActivityType(hostname),
        dayOfWeek: day,
        timestamp: new Date().toISOString()
      };

      // Envoyer contexte à MongoDB
      await this.sendBehaviorData({
        type: 'CONTEXT_DETECTED',
        ...context
      });

      console.log('🎯 Contexte détecté:', context);

      return context;
    } catch (error) {
      console.error('Erreur détection contexte:', error);
      return null;
    }
  }

  /**
   * TRACKING RECHERCHES
   * Track les recherches effectuées
   */
  async trackSearch(query, resultsCount) {
    this.sessionData.searchQueries.push({
      query,
      resultsCount,
      timestamp: new Date().toISOString()
    });

    await this.sendBehaviorData({
      type: 'SEARCH_QUERY',
      query,
      resultsCount,
      timestamp: new Date().toISOString()
    });

    console.log('🔍 Recherche trackée:', query);
  }

  /**
   * TRACKING INTERACTIONS
   * Track clics, ajouts favoris, etc.
   */
  async trackInteraction(interactionType, data) {
    await this.sendBehaviorData({
      type: 'INTERACTION',
      interactionType,
      ...data,
      timestamp: new Date().toISOString()
    });

    console.log('👆 Interaction trackée:', interactionType);
  }

  /**
   * Détermine le moment du repas
   */
  getMealTime(hour) {
    if (hour >= 7 && hour < 10) return 'petit-dejeuner';
    if (hour >= 11 && hour < 14) return 'dejeuner';
    if (hour >= 16 && hour < 17) return 'gouter';
    if (hour >= 18 && hour < 21) return 'diner';
    return 'hors-repas';
  }

  /**
   * Détermine le type d'activité selon le site
   */
  getActivityType(hostname) {
    // Travail
    if (hostname.includes('linkedin') || 
        hostname.includes('gmail') || 
        hostname.includes('outlook') ||
        hostname.includes('slack') ||
        hostname.includes('teams')) {
      return 'travail';
    }

    // Loisirs
    if (hostname.includes('youtube') || 
        hostname.includes('netflix') ||
        hostname.includes('twitch') ||
        hostname.includes('spotify')) {
      return 'loisirs';
    }

    // Cuisine
    if (hostname.includes('marmiton') || 
        hostname.includes('750g') ||
        hostname.includes('cuisineaz')) {
      return 'cuisine';
    }

    // Shopping
    if (hostname.includes('amazon') ||
        hostname.includes('carrefour') ||
        hostname.includes('auchan')) {
      return 'shopping';
    }

    // Réseaux sociaux
    if (hostname.includes('facebook') ||
        hostname.includes('instagram') ||
        hostname.includes('twitter')) {
      return 'social';
    }

    return 'autre';
  }

  /**
   * ENVOYER DONNÉES À MONGODB
   * Via votre API Spring Boot
   */
  async sendBehaviorData(data) {
    try {
      const user = await this.storage.getCurrentUser();
      if (!user) {
        console.log('⚠️ Aucun utilisateur connecté, données non envoyées');
        return;
      }

      await this.api.post('v1/comportement-utilisateur/track', {
        userId: user.id,
        ...data
      });

      console.log('📊 Données comportementales envoyées:', data.type);
    } catch (error) {
      console.error('❌ Erreur envoi données:', error);
      // Sauvegarder en local pour retry plus tard
      await this.saveForRetry(data);
    }
  }

  /**
   * SAUVEGARDER POUR RETRY
   * Si l'envoi échoue, sauvegarder localement
   */
  async saveForRetry(data) {
    const pendingData = await this.storage.get('pending_behavior_data') || [];
    pendingData.push(data);
    await this.storage.set('pending_behavior_data', pendingData);
  }

  /**
   * RETRY ENVOI DONNÉES EN ATTENTE
   */
  async retryPendingData() {
    const pendingData = await this.storage.get('pending_behavior_data') || [];
    
    if (pendingData.length === 0) return;

    console.log(`🔄 Retry ${pendingData.length} données en attente...`);

    const failedData = [];

    for (const data of pendingData) {
      try {
        const user = await this.storage.getCurrentUser();
        if (user) {
          await this.api.post('v1/comportement-utilisateur/track', {
            userId: user.id,
            ...data
          });
          console.log('✅ Donnée envoyée:', data.type);
        }
      } catch (error) {
        failedData.push(data);
      }
    }

    // Mettre à jour les données en attente
    await this.storage.set('pending_behavior_data', failedData);
  }

  /**
   * ANALYSER PATTERNS
   * Envoie un résumé toutes les heures
   */
  async sendSessionSummary() {
    const user = await this.storage.getCurrentUser();
    if (!user) return;

    // Calculer statistiques de session
    const topSites = Object.keys(this.sessionData.timeSpent)
      .sort((a, b) => this.sessionData.timeSpent[b].totalTime - this.sessionData.timeSpent[a].totalTime)
      .slice(0, 5)
      .map(site => ({
        site,
        time: this.sessionData.timeSpent[site].totalTime,
        visits: this.sessionData.timeSpent[site].visits
      }));

    const summary = {
      recipeSitesVisited: this.sessionData.recipeSitesVisited.length,
      totalSearches: this.sessionData.searchQueries.length,
      topSites: topSites,
      sessionDuration: Date.now() - this.sessionData.sessionStart,
      timestamp: new Date().toISOString()
    };

    try {
      await this.api.post('v1/comportement-utilisateur/session-summary', {
        userId: user.id,
        ...summary
      });

      console.log('📋 Résumé de session envoyé:', summary);
    } catch (error) {
      console.error('Erreur envoi résumé:', error);
    }

    // Reset session
    this.resetSession();
  }

  /**
   * RESET SESSION
   */
  resetSession() {
    this.sessionData = {
      sitesVisited: [],
      timeSpent: {},
      recipeSitesVisited: [],
      searchQueries: [],
      sessionStart: Date.now()
    };

    console.log('🔄 Session réinitialisée');
  }

  /**
   * STATISTIQUES DE SESSION
   */
  getSessionStats() {
    return {
      recipeSitesVisited: this.sessionData.recipeSitesVisited.length,
      totalSearches: this.sessionData.searchQueries.length,
      sitesTracked: Object.keys(this.sessionData.timeSpent).length,
      sessionDuration: Date.now() - this.sessionData.sessionStart
    };
  }
}

export default BehaviorTracker;