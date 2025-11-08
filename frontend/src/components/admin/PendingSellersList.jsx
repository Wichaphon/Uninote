import { formatDate } from '../../lib/utils';
import LoadingSpinner from '../common/LoadingSpinner';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  BuildingStorefrontIcon,
  UserIcon,
  EnvelopeIcon,
  CreditCardIcon,
  CalendarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

function PendingSellersList({ sellers, isLoading, onApprove, onReject }) {
  if (isLoading) {
    return <LoadingSpinner text="Loading pending sellers..." />;
  }

  if (!sellers || sellers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
        <BuildingStorefrontIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-1">No pending applications</p>
        <p className="text-sm text-gray-500">All seller applications have been reviewed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sellers.map((seller, index) => (
        <motion.div
          key={seller.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <BuildingStorefrontIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{seller.shopName}</h3>
                <p className="text-sm text-indigo-100">New Seller Application</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-start gap-2 mb-2">
                <DocumentTextIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                  <p className="text-gray-600 leading-relaxed">{seller.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <UserIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {seller.user.firstName} {seller.user.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-semibold text-gray-900">{seller.user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CreditCardIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Account</p>
                  <p className="text-sm font-mono font-semibold text-gray-900">
                    {seller.bankAccount.replace(/(\d{3})(\d{1})(\d{5})(\d)/, '$1-$2-$3-$4')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CalendarIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(seller.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => onApprove(seller.id)}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-xl cursor-pointer"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Approve
              </button>
              <button
                onClick={() => onReject(seller.id)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-xl cursor-pointer"
              >
                <XCircleIcon className="w-5 h-5" />
                Reject
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default PendingSellersList;