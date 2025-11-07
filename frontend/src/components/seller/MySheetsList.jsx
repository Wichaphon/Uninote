import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../lib/utils';
import StarRating from '../sheets/StarRating';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  EyeIcon, 
  ShoppingCartIcon, 
  PencilSquareIcon, 
  TrashIcon,
  CheckBadgeIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline';

function MySheetsList({ sheets, isLoading, onDelete }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner text="Loading your sheets..." />
      </div>
    );
  }
  
  const activeSheets = sheets.filter(sheet => sheet.isActive);

  if (!activeSheets || activeSheets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {activeSheets.map((sheet) => (
        <div 
          key={sheet.id} 
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-start">
            
            <div className="flex-1 mb-4 sm:mb-0">
              <h3 
                className="text-xl font-bold mb-1 text-gray-900 cursor-pointer hover:text-indigo-600"
                onClick={() => navigate(`/sheets/${sheet.id}`)}
              >
                {sheet.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{sheet.subject}</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1.5">
                  <EyeIcon className="w-4 h-4" /> {sheet.viewCount} views
                </span>
                <span className="flex items-center gap-1.5">
                  <ShoppingCartIcon className="w-4 h-4" /> {sheet.purchaseCount} sold
                </span>
              </div>

              <StarRating rating={sheet.averageRating} count={sheet.reviewCount} />
            </div>

            <div className="text-left sm:text-right space-y-2 shrink-0 sm:ml-6">
              <p className="text-2xl font-bold text-indigo-600">{formatPrice(sheet.price)}</p>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                <CheckBadgeIcon className="w-4 h-4" />
                Active
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate(`/sheets/${sheet.id}`)}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 transition-colors font-medium text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <EyeIcon className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => navigate(`/seller/sheets/${sheet.id}/edit`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/30"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(sheet.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-1.5 cursor-pointer sm:ml-auto"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MySheetsList;