// recette-front/src/components/recommendation/AIRecommendationCard.jsx

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Leaf, 
  Calendar,
  Coffee,
  Target,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatRelativeTime } from '../../utils/helpers';

const AIRecommendationCard = ({ recommendation, onMarkAsUsed }) => {
  const [expanded, setExpanded] = useState(false);

  const getTypeConfig = (type) => {
    const configs = {
      'PERSONNALISEE': {
        icon: Sparkles,
        label: 'Personnalisée',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        gradient: 'from-purple-500 to-pink-500'
      },
      'SAISONNIERE': {
        icon: Leaf,
        label: 'Saisonnière',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        gradient: 'from-green-500 to-teal-500'
      },
      'CRENEAU_ACTUEL': {
        icon: Clock,
        label: 'Par Créneau',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        gradient: 'from-blue-500 to-cyan-500'
      },
      'HABITUDES': {
        icon: TrendingUp,
        label: 'Vos Habitudes',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        gradient: 'from-orange-500 to-red-500'
      },
      'ENGAGEMENT': {
        icon: Target,
        label: 'Engagement',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
        gradient: 'from-indigo-500 to-purple-500'
      }
    };
    return configs[type] || configs['PERSONNALISEE'];
  };

  const config = getTypeConfig(recommendation.type);
  const Icon = config.icon;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-orange-500 hover:shadow-xl transition-shadow">
      {/* Header avec gradient */}
      <div className={`bg-gradient-to-r ${config.gradient} p-4 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {config.label}
              </h3>
              <p className="text-sm text-white/80">
                Générée par IA • {formatRelativeTime(recommendation.dateRecommandation)}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full ${getScoreColor(recommendation.score)} font-semibold text-sm`}>
            {recommendation.score?.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Profil et métriques */}
        {(recommendation.profilUtilisateurCible || recommendation.scoreEngagementReference) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recommendation.profilUtilisateurCible && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                👤 {recommendation.profilUtilisateurCible}
              </span>
            )}
            {recommendation.scoreEngagementReference && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                📊 Engagement: {recommendation.scoreEngagementReference}%
              </span>
            )}
            {recommendation.creneauCible && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                ⏰ {recommendation.creneauCible}
              </span>
            )}
          </div>
        )}

        {/* Recommandations détaillées */}
        {recommendation.recommandation && recommendation.recommandation.length > 0 && (
          <div className="space-y-3">
            {/* Première recommandation toujours visible */}
            {recommendation.recommandation.slice(0, 1).map((detail, index) => (
              <RecommendationDetail key={index} detail={detail} index={index} />
            ))}

            {/* Recommandations supplémentaires pliables */}
            {recommendation.recommandation.length > 1 && (
              <>
                {expanded && recommendation.recommandation.slice(1).map((detail, index) => (
                  <RecommendationDetail key={index + 1} detail={detail} index={index + 1} />
                ))}
                
                {recommendation.recommandation.length > 1 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {expanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Voir moins
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Voir {recommendation.recommandation.length - 1} autre(s) recommandation(s)
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Catégories recommandées */}
        {recommendation.categoriesRecommandees && recommendation.categoriesRecommandees.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-600 mb-2">Catégories suggérées:</p>
            <div className="flex flex-wrap gap-2">
              {recommendation.categoriesRecommandees.map((cat, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          {!recommendation.estUtilise && onMarkAsUsed ? (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => onMarkAsUsed(recommendation.id)}
              icon={CheckCircle}
            >
              Marquer comme utilisé
            </Button>
          ) : (
            <div className="text-center py-2 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700 font-medium flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Recommandation utilisée
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Composant pour afficher un détail de recommandation
const RecommendationDetail = ({ detail, index }) => {
  return (
    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-orange-300 transition-all">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full">
            {index + 1}
          </span>
          {detail.titre}
        </h4>
      </div>
      
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
        {detail.description}
      </p>

      {/* Raison de la recommandation */}
      {detail.raison && (
        <div className="mb-3 p-2 bg-blue-50 rounded border-l-2 border-blue-400">
          <p className="text-xs text-blue-800">
            💡 <strong>Pourquoi?</strong> {detail.raison}
          </p>
        </div>
      )}

      {/* Tags */}
      {detail.tags && detail.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {detail.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Lien */}
      {detail.lien && (
        <a
          href={detail.lien}
          className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Découvrir
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};

export default AIRecommendationCard;