import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { formatPrice, formatRating } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { 
  EyeIcon,
  EyeSlashIcon,
  ShoppingCartIcon,
  StarIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

function AdminSheets() {
  const [sheets, setSheets] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSheets();
  }, []);

  const loadSheets = async (customFilters = {}) => {
    setIsLoading(true);
    try {
      const params = { ...filters, ...customFilters };
      const data = await adminService.getAllSheetsAdmin(params);
      setSheets(data.sheets);
      setPagination(data.pagination);
      setFilters(params);
    } catch (err) {
      console.error('Load sheets error:', err);
      toast.error('Failed to load sheets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (sheetId) => {
    try {
      await adminService.toggleSheetStatus(sheetId);
      toast.success('Sheet status updated!');
      loadSheets();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Toggle failed');
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading sheets..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sheet Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sheets.map((sheet, index) => (
                <motion.tr 
                  key={sheet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-12 h-16 bg-linear-to-br from-indigo-100 to-purple-100 rounded flex items-center justify-center">
                        <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {sheet.title}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {sheet.subject}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {sheet.university}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sheet.seller?.sellerProfile?.shopName || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sheet.seller?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <EyeIcon className="w-4 h-4" />
                        <span>{sheet.viewCount} views</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <ShoppingCartIcon className="w-4 h-4" />
                        <span>{sheet.purchaseCount} sold</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span>{formatRating(sheet.averageRating)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-indigo-600">
                      {formatPrice(sheet.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sheet.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {sheet.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sheet.isActive ? (
                      <button
                        onClick={() => handleToggleStatus(sheet.id)}
                        className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                        title="Click to hide"
                      >
                        <EyeSlashIcon className="w-4 h-4" />
                        Hide
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(sheet.id)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                        title="Click to show"
                      >
                        <EyeIcon className="w-4 h-4" />
                        Show
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {sheets.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No sheets found</p>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 mb-8">
          <button
            onClick={() => loadSheets({ page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-indigo-300 transition-all font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
              let page;
              if (pagination.totalPages <= 7) {
                page = i + 1;
              } else if (pagination.page <= 4) {
                page = i + 1;
              } else if (pagination.page >= pagination.totalPages - 3) {
                page = pagination.totalPages - 6 + i;
              } else {
                page = pagination.page - 3 + i;
              }

              return (
                <button
                  key={page}
                  onClick={() => loadSheets({ page })}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    page === pagination.page
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-indigo-300'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => loadSheets({ page: pagination.page + 1 })}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-indigo-300 transition-all font-medium text-gray-700 flex items-center gap-2 cursor-pointer"
          >
            Next
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminSheets;