import React from 'react';
import { Star } from 'lucide-react';

const RatingDisplay = ({ value = 0, total = 0, size = 'md', showCount = true }) => {
  const normalizedValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const roundedValue = Math.max(0, Math.min(5, normalizedValue));

  const starSizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = roundedValue >= star;
          const halfFilled = !filled && roundedValue >= star - 0.5;

          return (
            <span key={star} className="relative inline-flex">
              <Star className={`${starSizeClass} text-gray-300`} />
              {(filled || halfFilled) && (
                <span
                  className="absolute left-0 top-0 overflow-hidden"
                  style={{ width: filled ? '100%' : '50%' }}
                >
                  <Star className={`${starSizeClass} fill-yellow-400 text-yellow-400`} />
                </span>
              )}
            </span>
          );
        })}
      </div>

      <span className="text-sm font-semibold text-gray-700">{roundedValue.toFixed(1)} / 5</span>
      {showCount && <span className="text-sm text-gray-500">({total} avis)</span>}
    </div>
  );
};

export default RatingDisplay;
