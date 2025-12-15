import React from 'react';
import { TrendingUp, Sparkles, Clock, Leaf } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatRelativeTime } from '../../utils/helpers';
import { TYPE_ICON_MAP } from '../../utils/constants';

const RecommendationCard = ({ recommendation, onMarkAsUsed }) => {
     

  const getTypeLabel = (type) => {
    const labels = {
      'PERSONNALISEE': 'Recommandation personnalisée',
      'SAISONNIERE': 'Recommandation saisonnière',
      'CRENEAU': 'Recommandation par créneau',
      'HABITUDES': 'Basée sur vos habitudes',
      'ENGAGEMENT': 'Pour votre engagement'
    };
    return labels[type] || 'Recommandation';
  };

const Icon = TYPE_ICON_MAP[recommendation.type] || TrendingUp;

  return (
    <Card className="border-l-4 border-orange-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Icon className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {getTypeLabel(recommendation.type)}
            </h3>
            <p className="text-sm text-gray-500">
              {formatRelativeTime(recommendation.dateRecommandation)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-orange-500">
            Score: {recommendation.score?.toFixed(1) || 'N/A'}
          </span>
        </div>
      </div>

      {recommendation.recommandation && recommendation.recommandation.length > 0 && (
        <div className="space-y-3 mb-4">
          {recommendation.recommandation.slice(0, 3).map((detail, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-1">
                {detail.titre}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {detail.description}
              </p>
              {detail.tags && detail.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {detail.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!recommendation.estUtilise && onMarkAsUsed && (
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => onMarkAsUsed(recommendation.id)}
        >
          Marquer comme utilisé
        </Button>
      )}

      {recommendation.estUtilise && (
        <div className="text-center py-2 bg-green-50 rounded-lg">
          <span className="text-sm text-green-700 font-medium">
            ✓ Recommandation utilisée
          </span>
        </div>
      )}
    </Card>
  );
};

export default RecommendationCard;