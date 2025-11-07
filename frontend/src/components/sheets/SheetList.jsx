import { useNavigate } from 'react-router-dom';
import SheetThumbnail from './SheetThumbnail';
import StarRating from './StarRating';
import { formatPrice } from '../../lib/utils';
import { EyeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

function SheetCard({ sheet }) {
  const navigate = useNavigate();

  if (!sheet) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-md p-4 text-gray-500 text-sm">
        Missing sheet data
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/sheets/${sheet.id}`)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200"
    >
      <div className="relative">
        <SheetThumbnail sheet={sheet} className="w-full h-48 group-hover:scale-105 transition-transform duration-300" />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
          {sheet.title}
        </h3>

        <p className="text-sm text-gray-600 mb-1 font-medium">
          {sheet.subject} {sheet.university && `• ${sheet.university}`}
        </p>

        <p className="text-xs text-gray-500 mb-3">
          by {sheet.seller?.sellerProfile?.shopName || `${sheet.seller?.firstName || ''} ${sheet.seller?.lastName || ''}`}
        </p>

        <div className="mb-4">
          <StarRating
            rating={sheet.averageRating || 0}
            count={sheet.reviewCount || 0}
            size="sm"
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-2xl font-bold text-indigo-600">
            {formatPrice(sheet.price)}
          </span>

          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <EyeIcon className="w-4 h-4 text-gray-500" /> 
              <span className="font-medium">{sheet.viewCount || 0}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShoppingCartIcon className="w-4 h-4 text-gray-500" /> 
              <span className="font-medium">{sheet.purchaseCount || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SheetList({ sheets = [], isLoading = false, ...props }) {
  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner text="Loading sheets..." />
      </div>
    );
  }

  const safeSheets = Array.isArray(sheets) ? sheets.filter(Boolean) : [];

  if (Array.isArray(sheets) && safeSheets.length !== sheets.length) {
    console.warn('SheetList: filtered out invalid sheet entries', {
      originalLength: sheets.length,
      filteredLength: safeSheets.length,
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {safeSheets.map((sheet) => (
        <SheetCard key={sheet.id ?? sheet._id ?? Math.random()} sheet={sheet} />
      ))}
    </div>
  );
}

export default SheetList;