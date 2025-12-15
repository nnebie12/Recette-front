import React from 'react';
import RecommendationCard from './RecommendationCard';
import Loading from '../common/Loading';

const RecommendationList = ({ recommendations, loading, onMarkAsUsed }) => {
  if (loading) {
    return <Loading message="Chargement des recommandations..." />;
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aucune recommandation disponible
        </h3>
        <p className="text-gray-500">
          Continuez à utiliser l'application pour recevoir des recommandations personnalisées
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((recommendation) => (
        <RecommendationCard
          key={recommendation.id}
          recommendation={recommendation}
          onMarkAsUsed={onMarkAsUsed}
        />
      ))}
    </div>
  );
};

export default RecommendationList;