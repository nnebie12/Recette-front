import { useState } from 'react';
import { getAutoImage } from '../../services/imageService';

const RecipeImage = ({
  recipe,
  className = 'w-full h-full object-cover',
  alt,
}) => {
  const [imgSrc, setImgSrc] = useState(() => getAutoImage(recipe));
  const [retried, setRetried] = useState(false);

  const handleError = () => {
    if (!retried) {
      setRetried(true);
      // Dernier recours : image food générique avec lock sur l'id
      const lock = recipe?.id || Math.floor(Math.random() * 100);
      setImgSrc(`https://loremflickr.com/400/300/food&lock=${lock}`);
    }
  };

  if (retried && !imgSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
        <span className="text-6xl">🍳</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt || recipe?.titre || 'Recette'}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default RecipeImage;