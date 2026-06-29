import { useState, useEffect } from 'react';
import { getAutoImage } from '../../services/imageService';

const RecipeImage = ({
  recipe,
  className = 'w-full h-full object-cover',
  alt,
}) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [retried, setRetried] = useState(false);

  // ✅ Charger l'image au montage (asynchrone)
  useEffect(() => {
    if (!recipe) return;

    const loadImage = async () => {
      try {
        // ✅ Passer le TITRE, pas l'objet entier
        const imageUrl = await getAutoImage(recipe.titre);
        setImgSrc(imageUrl);
      } catch (error) {
        console.error('Erreur chargement image:', error);
        setImgSrc('https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80');
      }
    };

    loadImage();
  }, [recipe?.titre]); // ✅ Dépendre du titre, pas de l'objet entier

  const handleError = () => {
    if (!retried) {
      setRetried(true);
      // Dernier recours : image food générique
      const lock = recipe?.id || Math.floor(Math.random() * 100);
      setImgSrc(`https://loremflickr.com/400/300/food&lock=${lock}`);
    }
  };

  // Afficher un placeholder en attendant
  if (!imgSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
        <span className="text-6xl">⏳</span>
      </div>
    );
  }

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