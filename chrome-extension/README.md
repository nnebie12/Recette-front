# 🌐 EXTENSION CHROME - RECIPE AI ASSISTANT

## 📋 Description

Extension Chrome complète pour votre système de recommandations de recettes avec IA. Permet de sauvegarder des recettes depuis n'importe quel site, gérer une liste de courses intelligente, et recevoir des recommandations personnalisées directement dans le navigateur.

---

## ✨ Fonctionnalités

### 1. **Recipe Clipper**
- Sauvegarde automatique de recettes depuis Marmiton, 750g, CuisineAZ
- Extraction intelligente (titre, ingrédients, étapes, image)
- Synchronisation avec votre base de données

### 2. **Recherche Sémantique**
- Recherche en langage naturel ("plat léger pour l'été")
- Suggestions automatiques
- Recherche vocale intégrée

### 3. **Smart Shopping List**
- Liste de courses intelligente
- Suggestions de recettes basées sur les ingrédients
- Synchronisation temps réel

### 4. **Recommandations IA Contextuelles**
- Notifications aux heures de repas
- Analyse du comportement de navigation
- Suggestions personnalisées

### 5. **Comparaison Multi-sites**
- Détection automatique de recettes sur sites externes
- Comparaison avec votre catalogue
- Bandeau "Nous avons une version similaire"

---

## 📁 Structure du Projet

```
chrome-extension/
├── manifest.json                    # Configuration extension
├── background/
│   └── service-worker.js           # Service worker (alarmes, notifs)
├── content/
│   ├── content-script.js           # Injection dans pages recettes
│   └── content-styles.css          # Styles injectés
├── popup/
│   ├── popup.html                  # Interface principale
│   ├── popup.css                   # Styles popup
│   └── popup.js                    # Logique popup
├── utils/
│   ├── api-client.js               # Client API REST
│   ├── storage.js                  # Gestion cache/storage
│   └── notifications.js            # Système notifications
├── assets/
│   ├── icon-16.png
│   ├── icon-48.png
│   ├── icon-128.png
│   └── chef-avatar.png
└── README.md
```

---

## 🚀 Installation & Test

### Prérequis
- Google Chrome ou Chromium
- Votre API backend démarrée sur `localhost:8080`

### Étape 1: Préparer les Assets

Créez les icônes (ou utilisez des placeholders) :
- `assets/icon-16.png` (16x16px)
- `assets/icon-48.png` (48x48px)
- `assets/icon-128.png` (128x128px)
- `assets/chef-avatar.png` (100x100px)

### Étape 2: Charger l'Extension

1. Ouvrir Chrome
2. Aller à `chrome://extensions/`
3. Activer "Mode développeur" (en haut à droite)
4. Cliquer "Charger l'extension non empaquetée"
5. Sélectionner le dossier `chrome-extension/`

### Étape 3: Configuration API

Modifier dans `utils/api-client.js` :
```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1'; // Votre URL
```

### Étape 4: Tester

1. **Test Recipe Clipper:**
   - Aller sur https://www.marmiton.org/recettes/recette_pates-carbonara_11783.aspx
   - Cliquer sur l'icône de l'extension (ou bouton flottant)
   - Cliquer "Sauvegarder"
   - Vérifier dans MongoDB que la recette est sauvegardée

2. **Test Shopping List:**
   - Ouvrir popup (clic sur icône extension)
   - Aller dans onglet "Liste"
   - Ajouter "tomate, basilic, mozzarella"
   - Vérifier les suggestions de recettes

3. **Test Recherche:**
   - Dans popup, onglet "Recherche"
   - Taper "plat d'été léger"
   - Vérifier les résultats sémantiques

4. **Test Notifications:**
   - Attendre 12h00 ou 19h00
   - Vérifier notification de suggestion de recette
   - Ou déclencher manuellement depuis le service worker

---

## 🔧 Configuration Avancée

### Modifier l'URL de l'API

**Fichier:** `utils/api-client.js`
```javascript
const API_BASE_URL = 'https://votre-production-api.com/api/v1';
```

### Ajouter des Sites de Recettes

**Fichier:** `content/content-script.js`
```javascript
const SITE_CONFIGS = {
  // Ajouter votre config
  'monsite.com': {
    titre: 'h1.recipe-title',
    ingredients: '.ingredient-list li',
    etapes: '.step',
    image: '.recipe-img'
  }
};
```

### Personnaliser les Horaires de Notifications

**Fichier:** `background/service-worker.js`
```javascript
chrome.alarms.create('lunch-reminder', {
  when: getNextAlarmTime(12, 30), // 12h30 au lieu de 12h00
  periodInMinutes: 1440
});
```

### Activer/Désactiver des Fonctionnalités

**Fichier:** `manifest.json`
```json
{
  "permissions": [
    "storage",          // ✅ Requis
    "notifications",    // ⚠️ Optionnel si pas de notifs
    "contextMenus",     // ⚠️ Optionnel si pas de menu clic-droit
    "alarms"            // ⚠️ Optionnel si pas de notifs programmées
  ]
}
```

---

## 📊 Intégration avec Votre API

### Endpoints Utilisés

L'extension appelle ces endpoints de votre API :

```
# Recommandations
GET  /api/v1/recommendations/personalized/{userId}
POST /api/v1/recommendations/contextual

# NLP
POST /api/v1/nlp/search/semantic
GET  /api/v1/nlp/similar/{recipeId}

# Recettes
POST /api/v1/recettes/import-externe
GET  /api/v1/recettes/all

# Shopping List (à créer)
GET  /api/v1/shopping-list/{userId}
POST /api/v1/shopping-list/{userId}/items
PUT  /api/v1/shopping-list/{userId}/items/{itemId}
```

### Endpoint à Créer: Shopping List

Si vous n'avez pas encore d'endpoint pour la liste de courses :

```java
@RestController
@RequestMapping("/api/v1/shopping-list")
public class ShoppingListController {
    
    @GetMapping("/{userId}")
    public ResponseEntity<List<ShoppingItem>> getShoppingList(@PathVariable Long userId) {
        // Récupérer depuis MongoDB
        return ResponseEntity.ok(shoppingListService.getList(userId));
    }
    
    @PostMapping("/{userId}/items")
    public ResponseEntity<ShoppingItem> addItem(
        @PathVariable Long userId,
        @RequestBody ShoppingItem item
    ) {
        return ResponseEntity.ok(shoppingListService.addItem(userId, item));
    }
}
```

---

## 🎨 Personnalisation UI

### Modifier les Couleurs

**Fichier:** `popup/popup.css`
```css
:root {
  --primary-color: #667eea;      /* Couleur principale */
  --secondary-color: #764ba2;    /* Couleur secondaire */
  --success-color: #4CAF50;      /* Succès */
  --error-color: #f44336;        /* Erreur */
}
```

### Changer le Logo

Remplacer les fichiers dans `assets/` :
- `icon-16.png`
- `icon-48.png`
- `icon-128.png`

### Modifier les Messages

**Fichier:** `popup/popup.js`
```javascript
const MESSAGES = {
  welcome: 'Bienvenue !',           // Message d'accueil
  loading: 'Chargement...',         // Message de chargement
  empty: 'Aucun résultat',          // Liste vide
  success: 'Sauvegardé !'           // Succès
};
```

---

## 🐛 Débogage

### Afficher les Logs

1. **Service Worker:**
   - `chrome://extensions/`
   - Trouver votre extension
   - Cliquer "Inspecter les vues : service worker"
   - Console s'ouvre avec les logs

2. **Content Script:**
   - Aller sur une page de recette
   - F12 → Console
   - Filtrer par "Recipe AI"

3. **Popup:**
   - Clic droit sur icône extension
   - "Inspecter la fenêtre contextuelle"
   - Console s'ouvre

### Problèmes Courants

**❌ "Erreur de connexion à l'API"**
```bash
# Vérifier que l'API tourne
curl http://localhost:8080/api/v1/recettes/all

# Vérifier CORS dans Spring Boot
@CrossOrigin(origins = "*")
```

**❌ "Recette non extraite"**
```javascript
// Vérifier les sélecteurs dans content-script.js
console.log('Titre:', document.querySelector('h1')?.innerText);
console.log('Ingrédients:', document.querySelectorAll('.ingredient'));
```

**❌ "Notifications ne s'affichent pas"**
```javascript
// Vérifier permissions
chrome.permissions.contains({
  permissions: ['notifications']
}, (result) => {
  console.log('Notifications autorisées:', result);
});
```

---

## 📈 Métriques & Analytics

### Événements Trackés

L'extension track automatiquement :
- Nombre de recettes sauvegardées
- Recherches effectuées
- Clics sur recommandations
- Utilisation de la shopping list

### Consulter les Métriques

```javascript
// Dans le service worker
chrome.storage.local.get(['metrics'], (result) => {
  console.log('Métriques:', result.metrics);
});
```

### Envoyer à votre Backend

**Fichier:** `background/service-worker.js`
```javascript
async function trackEvent(eventName, data) {
  await api.post('/analytics/events', {
    eventName,
    data,
    timestamp: new Date().toISOString(),
    extensionVersion: chrome.runtime.getManifest().version
  });
}
```

---

## 🚢 Déploiement Chrome Web Store

### Préparer la Soumission

1. **Créer compte développeur:**
   - https://chrome.google.com/webstore/devconsole
   - Frais unique: $5

2. **Préparer assets:**
   - Icône 128x128px
   - Screenshots (1280x800px ou 640x400px)
   - Tile promo 440x280px
   - Video démo (optionnel mais recommandé)

3. **Remplir le manifest:**
```json
{
  "name": "Recipe AI Assistant",
  "short_name": "Recipe AI",
  "description": "Assistant intelligent pour découvrir, sauvegarder et planifier vos recettes avec l'IA",
  "version": "1.0.0",
  "author": "Votre Nom"
}
```

4. **Créer package:**
```bash
cd chrome-extension
zip -r ../recipe-ai-extension.zip .
```

5. **Soumettre:**
   - Upload ZIP sur Chrome Web Store
   - Remplir formulaire (description, catégorie, etc.)
   - Attendre review (2-3 jours généralement)

### Catégories Recommandées
- **Primary:** Shopping
- **Secondary:** Productivity

### Description Optimisée SEO

```
Recipe AI Assistant - Votre compagnon culinaire intelligent 🍳

Découvrez, sauvegardez et cuisinez vos recettes préférées avec l'aide de l'intelligence artificielle !

✨ FONCTIONNALITÉS PRINCIPALES :
• 🔖 Sauvegarde de recettes depuis n'importe quel site
• 🔍 Recherche sémantique intelligente
• 🛒 Liste de courses synchronisée
• 🎯 Recommandations personnalisées par IA
• 🔔 Notifications aux heures de repas
• 💡 Suggestions basées sur vos ingrédients

🎓 UTILISATION :
1. Installez l'extension
2. Visitez vos sites de recettes préférés
3. Cliquez sur le bouton "Sauvegarder"
4. Profitez de recommandations personnalisées !

🔒 CONFIDENTIALITÉ :
Vos données restent privées et sécurisées.

Mots-clés: recettes, cuisine, cooking, meal planning, shopping list, IA, AI
```

---

## 🔐 Sécurité & Permissions

### Permissions Expliquées

| Permission | Utilisation | Optionnel? |
|------------|-------------|------------|
| `storage` | Cache local | ❌ Requis |
| `notifications` | Alertes repas | ✅ Oui |
| `contextMenus` | Menu clic-droit | ✅ Oui |
| `alarms` | Notifs programmées | ✅ Oui |

### Données Collectées

- ✅ Recettes sauvegardées (local + API)
- ✅ Liste de courses (local uniquement)
- ✅ Préférences utilisateur
- ❌ Historique navigation (jamais collecté)
- ❌ Données personnelles sensibles

---

## 📚 Ressources

### Documentation Chrome
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/)
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Service Workers](https://developer.chrome.com/docs/extensions/mv3/service_workers/)

### Outils Utiles
- [Extension Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) - Recharge auto pendant dev
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) - Si vous ajoutez React

---

## 🆘 Support

**Problèmes avec l'extension ?**
1. Vérifier les logs (voir section Débogage)
2. Désinstaller et réinstaller
3. Vérifier que l'API backend fonctionne
4. Ouvrir une issue sur GitHub

---

## 🎯 Roadmap

### Version 1.1 (Prévu)
- [ ] Meal planning hebdomadaire
- [ ] Export PDF de recettes
- [ ] Mode hors-ligne
- [ ] Dark mode

### Version 1.2 (Prévu)
- [ ] Scan ingrédients (Vision AI)
- [ ] Commandes vocales
- [ ] Partage social
- [ ] Gamification (badges)

### Version 2.0 (Prévu)
- [ ] Assistant conversationnel
- [ ] Nutrition tracker
- [ ] Wine pairing
- [ ] Collaboration multi-utilisateurs

---

## 📄 Licence

MIT License - Voir fichier LICENSE

---

## 👏 Contributeurs

- Votre Nom - Développeur principal
- [Liste des contributeurs]

---

**Votre assistant culinaire intelligent, toujours à portée de clic ! 🍳✨**