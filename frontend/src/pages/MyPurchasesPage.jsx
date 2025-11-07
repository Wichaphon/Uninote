import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePurchaseStore from '../store/usePurchaseStore';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SheetThumbnail from '../components/sheets/SheetThumbnail';
import { formatPrice, formatDate } from '../lib/utils';
import { 
  ShoppingCartIcon, 
  ArrowDownTrayIcon, 
  ArrowPathIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

function MyPurchasesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { purchases, isLoading, fetchMyPurchases, downloadSheet } = usePurchaseStore();
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyPurchases();
    }
  }, [user]);

  const handleDownload = async (sheetId) => {
    setDownloadingId(sheetId);
    try {
      await downloadSheet(sheetId);
    } catch (err) {
      alert(err.response?.data?.error || 'Download failed');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleViewDetails = (sheetId) => {
    navigate(`/sheets/${sheetId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading your purchases..." />
      </div>
    );
  }

  const completedPurchases = purchases.filter(
    (purchase) => purchase.status === 'COMPLETED'
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-3 text-gray-900">My Purchases</h1>
          <p className="text-lg text-gray-600">
            Access and download all your purchased study materials
          </p>
        </motion.div>

        {completedPurchases.length === 0 ? (
          <motion.div 
            className="bg-white rounded-xl shadow-xl border border-gray-100 p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCartIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">No purchases yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't purchased any sheets yet.
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30 cursor-pointer"
            >
              Browse Sheets
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {completedPurchases.map((purchase) => {
              const seller = purchase.sheet?.seller;
              const sellerAvatar = seller?.avatar || `https://ui-avatars.com/api/?name=${seller?.firstName || 'U'}&background=4f46e5&color=fff`;
              const sellerName = seller?.sellerProfile?.shopName || 
                                 `${seller?.firstName || 'Unknown'} ${seller?.lastName || 'Seller'}`;

              return (
                <motion.div
                  key={purchase.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
                  variants={itemVariants}
                >
                  <SheetThumbnail 
                    sheet={purchase.sheet} 
                    className="w-full h-48"
                  />
                  
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-lg line-clamp-2 text-gray-900">
                      {purchase.sheet?.title || 'Untitled'}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <img
                        src={sellerAvatar}
                        alt={sellerName}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://ui-avatars.com/api/?name=U&background=4f46e5&color=fff';
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {sellerName}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Purchased:</span>
                        <span className="font-medium text-gray-700">
                          {formatDate(purchase.completedAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-medium text-green-600">
                          {formatPrice(purchase.price)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => handleViewDetails(purchase.sheet.id)}
                        className="flex-1 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 transition-colors font-medium text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View
                      </button>

                      <button
                        onClick={() => handleDownload(purchase.sheet.id)}
                        disabled={downloadingId === purchase.sheet.id}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm shadow-lg shadow-indigo-500/30"
                      >
                        {downloadingId === purchase.sheet.id ? (
                          <>
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MyPurchasesPage;