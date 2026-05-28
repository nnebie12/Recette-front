# RecipeApp - Application de Recettes avec IA

Application web moderne de gestion de recettes avec recommandations personnalisées basées sur l'intelligence artificielle.

## 🚀 Fonctionnalités

### Pour tous les utilisateurs
- ✅ Parcourir et rechercher des recettes
- ✅ Filtrer par difficulté, temps de préparation et note
- ✅ Voir les détails complets des recettes
- ✅ Consulter les commentaires et notes

### Pour les utilisateurs connectés
- ✅ Créer et gérer ses propres recettes
- ✅ Ajouter des recettes aux favoris
- ✅ Commenter et noter les recettes
- ✅ Recevoir des recommandations personnalisées IA
- ✅ Suivre son profil et ses statistiques

### Recommandations IA
- 🤖 Recommandations personnalisées basées sur les préférences
- 🍂 Recommandations saisonnières
- ⏰ Recommandations par créneau horaire
- 📊 Recommandations basées sur les habitudes
- 🎯 Recommandations d'engagement

## 🛠️ Technologies

- **Frontend**: React 19
- **Build tool**: Vite 7
- **Routing**: React Router 7
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📦 Installation

### Prérequis
- Node.js >= 18
- npm
- Backend API en cours d'exécution sur `http://localhost:8080`

### Installation des dépendances

```bash
npm install
```

### Configuration

Créez un fichier `.env` à la racine du projet:

```env
VITE_API_URL=http://localhost:8080/api
```

Fichiers d'environnement fournis:

- `.env.development` pour le développement local
- `.env.test` pour l'exécution des tests
- `.env.production` pour le build de production
- `.env.example` comme modèle minimal

### Lancement en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
```

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── common/         # Composants de base (Button, Input, Card...)
│   ├── layout/         # Layout (Navbar, Footer)
│   ├── auth/           # Authentification (Login, Register)
│   ├── recipe/         # Composants recettes
│   ├── comment/        # Composants commentaires
│   ├── rating/         # Composants notation
│   └── recommendation/ # Composants recommandations
├── pages/              # Pages de l'application
├── services/           # Services API
├── context/            # Context React (Auth)
├── utils/              # Utilitaires et helpers
├── App.jsx             # Composant principal
└── main.jsx            # Point d'entrée
```

## 🔌 API Endpoints utilisés

### Authentification
- `POST /v1/auth/login` - Connexion
- `POST /v1/auth/register` - Inscription
- `GET /v1/auth/me` - Utilisateur actuel

### Recettes
- `GET /v1/recettes/all` - Toutes les recettes
- `GET /v1/recettes/{id}` - Détails d'une recette
- `POST /v1/recettes/user/{userId}` - Créer une recette
- `PUT /v1/recettes/{id}` - Modifier une recette
- `DELETE /v1/recettes/{id}` - Supprimer une recette

### Favoris
- `GET /favoris/{userId}` - Favoris de l'utilisateur
- `POST /favoris/{userId}/{recetteId}` - Ajouter aux favoris
- `DELETE /favoris/{userId}/{recetteId}` - Retirer des favoris

### Recommandations
- `GET /v1/recommandations/user/{userId}` - Recommandations utilisateur
- `POST /ai-recommendations/generate/personalized/{userId}` - Générer recommandation personnalisée
- `POST /ai-recommendations/generate/seasonal/{userId}` - Générer recommandation saisonnière
- `PUT /v1/recommandations/{id}/utilise` - Marquer comme utilisée

### Commentaires & Notes
- `POST /v1/recettes/{recetteId}/commentaires/user/{userId}` - Ajouter un commentaire
- `POST /v1/recettes/{recetteId}/notes/user/{userId}` - Ajouter une note

## 🎨 Personnalisation

### Couleurs
Les couleurs principales peuvent être modifiées dans `tailwind.config.js`:

```javascript
colors: {
  orange: {
    500: '#f97316', // Couleur principale
    // ...
  }
}
```

### Logo & Branding
Modifiez le logo dans les composants `Navbar` et `Footer`.

## 🔐 Authentification

L'application utilise JWT pour l'authentification:
- Token stocké dans `localStorage`
- Intercepteur Axios pour ajouter le token aux requêtes
- Routes protégées avec composant `ProtectedRoute`

## 📱 Responsive Design

L'application est entièrement responsive avec des breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🧪 Scripts disponibles

```bash
npm run dev        # Développement
npm run build      # Build de production
npm run lint       # Vérification ESLint
npm run test       # Tests en mode watch
npm run test:run   # Exécution unique des tests
npm run preview    # Prévisualisation du build
```

## 🐛 Dépannage

### Erreur de connexion API
Vérifiez que:
1. Le backend est lancé sur `http://localhost:8080`
2. Les CORS sont configurés côté backend
3. L'URL de l'API est correcte dans `.env`

### Problèmes d'authentification
1. Vider le localStorage: `localStorage.clear()`
2. Recharger la page
3. Se reconnecter

## 📄 Licence

MIT

## 👥 Contributeurs

Votre équipe de développement

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.