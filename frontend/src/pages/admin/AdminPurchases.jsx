import { useEffect, useState, Fragment } from 'react';
import { adminService } from '../../services/adminService';
import { formatPrice, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { Listbox, Transition } from '@headlessui/react';
import { 
  CheckIcon,
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FAILED', label: 'Failed' },
];

const getLabel = (options, value) => {
  return options.find((opt) => opt.value === value)?.label || 'All Status';
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'COMPLETED':
      return {
        icon: CheckCircleIcon,
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: 'Completed',
      };
    case 'PENDING':
      return {
        icon: ClockIcon,
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        label: 'Pending',
      };
    case 'FAILED':
      return {
        icon: XCircleIcon,
        bg: 'bg-red-100',
        text: 'text-red-700',
        label: 'Failed',
      };
    default:
      return {
        icon: ClockIcon,
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        label: 'Unknown',
      };
  }
};

function AdminPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: 20, status: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async (customFilters = {}) => {
    setIsLoading(true);
    try {
      const params = { ...filters, ...customFilters };
      const data = await adminService.getAllPurchases(params);
      setPurchases(data.purchases);
      setPagination(data.pagination);
      setFilters(params);
    } catch (err) {
      console.error('Load purchases error:', err);
      toast.error('Failed to load purchases');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading purchases..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <ShoppingCartIcon className="w-6 h-6 text-indigo-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Filter by Status</h3>
            <p className="text-sm text-gray-500">Select transaction status</p>
          </div>
          <Listbox 
            value={filters.status} 
            onChange={(val) => {
              setFilters({ ...filters, status: val });
              loadPurchases({ status: val, page: 1 });
            }}
          >
            <div className="relative w-48">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm hover:border-gray-400 transition-colors">
                <span className="block truncate">{getLabel(statusOptions, filters.status)}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                  {statusOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'}`}
                      value={option.value}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>
                          {selected ? <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600"><CheckIcon className="h-5 w-5" aria-hidden="true" /></span> : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sheet
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {purchases.map((purchase, index) => {
                const statusConfig = getStatusConfig(purchase.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <motion.tr 
                    key={purchase.id}
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
                            {purchase.sheet.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {purchase.sheet.subject}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {purchase.user.firstName} {purchase.user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {purchase.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {purchase.sheet.seller?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-indigo-600">
                        {formatPrice(purchase.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs leading-5 font-semibold rounded-full ${statusConfig.bg} ${statusConfig.text}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(purchase.completedAt || purchase.purchasedAt)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {purchases.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No purchases found</p>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 mb-8">
          <button
            onClick={() => loadPurchases({ page: pagination.page - 1 })}
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
                  onClick={() => loadPurchases({ page })}
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
            onClick={() => loadPurchases({ page: pagination.page + 1 })}
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

export default AdminPurchases;