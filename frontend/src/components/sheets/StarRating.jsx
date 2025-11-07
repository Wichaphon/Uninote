import { formatRating } from '../../lib/utils';
import { StarIcon as SolidStarIcon } from '@heroicons/react/20/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';

function StarRating({ rating = 0, count = 0, size = 'md' }) {
  const safeRating = parseFloat(rating) || 0; 
  const fullStars = Math.floor(safeRating);
  const decimal = safeRating - fullStars;

  const starSizeClasses = {
    sm: 'w-4 h-4', 
    md: 'w-5 h-5',
    lg: 'w-6 h-6', 
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex items-center gap-2 ${textSizeClasses[size]}`}>
      {/*Stars*/}
      <div className="flex items-center relative">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <div key={starIndex} className="relative">
            <OutlineStarIcon className={`${starSizeClasses[size]} text-gray-300`} />
            {starIndex <= fullStars ? (
              <SolidStarIcon className={`absolute top-0 left-0 ${starSizeClasses[size]} text-yellow-500`} />
            ) : starIndex === fullStars + 1 && decimal > 0 ? (
              <div
                className={`absolute top-0 left-0 overflow-hidden`}
                style={{ width: `${decimal * 100}%` }}
              >
                <SolidStarIcon className={`${starSizeClasses[size]} text-yellow-500`} />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/*Rating number and count*/}
      <div className="flex items-center gap-1 text-gray-700">
        <span className="font-semibold text-indigo-700">
          {formatRating(safeRating)}
        </span>
        {count > 0 && (
          <span className="text-sm text-gray-500">({count} reviews)</span>
        )}
      </div>
    </div>
  );
}

export default StarRating;