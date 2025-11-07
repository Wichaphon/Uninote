import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSheetStore from '../store/useSheetStore';
import usePurchaseStore from '../store/usePurchaseStore';
import useAuthStore from '../store/useAuthStore';
import { reviewService } from '../services/reviewService';
import StarRating from '../components/sheets/StarRating';
import SheetPreview from '../components/sheets/SheetPreview';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatPrice } from '../lib/utils';
import { motion } from 'framer-motion';
import { 
  EyeIcon, 
  ShoppingCartIcon, 
  PencilSquareIcon, 
  CheckCircleIcon, 
  ArrowDownTrayIcon, 
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/20/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';


function SheetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentSheet, isLoading, fetchSheetById, clearError } = useSheetStore();
  const { createPurchase, checkPurchase, downloadSheet } = usePurchaseStore();
  
  const [purchased, setPurchased] = useState(false);
  const [purchaseChecking, setPurchaseChecking] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [pendingRating, setPendingRating] = useState(0);
  const [ratingStatus, setRatingStatus] = useState({ loading: false, error: null, success: null });

  useEffect(() => {
    if (id) {
      fetchSheetById(id);
    }
    
    return () => {
      clearError?.();
    };
  }, [id]);

  useEffect(() => {
    if (user && id && currentSheet) {
      checkPurchaseStatus();
      loadMyRating();
    } else {
      setPurchaseChecking(false);
    }
  }, [user, id, currentSheet?.id]);

  const checkPurchaseStatus = async () => {
    setPurchaseChecking(true);
    try {
      const data = await checkPurchase(id);
      setPurchased(data.purchased && data.status === 'COMPLETED');
    } catch (err) {
      console.error('Check purchase error:', err);
      setPurchased(false);
    } finally {
      setPurchaseChecking(false);
    }
  };

  const loadMyRating = async () => {
    try {
      const data = await reviewService.getMyReview(id);
      if (data.hasReviewed) {
        setMyRating(data.review.rating);
        setPendingRating(0);
      }
    } catch (err) {
      console.error('Load rating error:', err);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    try {
      await createPurchase(id);
    } catch (err) {
      alert(err.response?.data?.error || 'Purchase failed');
    }
  };

  const handleDownload = async () => {
    if (!purchased) {
      alert('Please purchase this sheet first');
      return;
    }

    setIsDownloading(true);
    try {
      await downloadSheet(id);
    } catch (err) {
      alert(err.response?.data?.error || 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!purchased) {
      setRatingStatus({ loading: false, error: 'You must purchase this sheet to rate it', success: null });
      return;
    }
    if (pendingRating === 0) {
      setRatingStatus({ loading: false, error: 'Please select a rating first', success: null });
      return;
    }

    setRatingStatus({ loading: true, error: null, success: null });
    try {
      await reviewService.rateSheet(id, pendingRating);
      setMyRating(pendingRating);
      setRatingStatus({ loading: false, error: null, success: 'Thank you for your review!' });
      setPendingRating(0);
      fetchSheetById(id);
    } catch (err) {
      setRatingStatus({ 
        loading: false, 
        error: err.response?.data?.error || 'Rating failed', 
        success: null 
      });
    }
  };

  if (isLoading && !currentSheet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading sheet..." />
      </div>
    );
  }

  if (!isLoading && !currentSheet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Sheet Not Found</h2>
          <p className="text-gray-600 mb-6">
            The sheet you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/explore')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30 cursor-pointer"
          >
            Browse Sheets
          </button>
        </div>
      </div>
    );
  }

  const sheet = currentSheet;
  const isOwner = user?.id === sheet.sellerId;

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          className="mb-6 text-sm text-gray-500 flex items-center gap-1.5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <HomeIcon className="w-4 h-4 text-gray-400" />
          <button onClick={() => navigate('/')} className="hover:text-indigo-600 font-medium cursor-pointer">
            Home
          </button>
          <ChevronRightIcon className="w-3 h-3 text-gray-400" />
          <button onClick={() => navigate('/explore')} className="hover:text-indigo-600 font-medium cursor-pointer">
            Explore
          </button>
          <ChevronRightIcon className="w-3 h-3 text-gray-400" />
          <span className="text-gray-700 font-semibold line-clamp-1">{sheet.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{sheet.title}</h1>
                  {isOwner && (
                    <button
                      onClick={() => navigate(`/seller/sheets/${sheet.id}/edit`)}
                      className="shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/30 cursor-pointer"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
                  <StarRating rating={sheet.averageRating} count={sheet.reviewCount} />
                  <span className="text-gray-300 hidden md:inline">•</span>
                  <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <EyeIcon className="w-4 h-4" /> {sheet.viewCount} views
                  </span>
                  <span className="text-gray-300 hidden md:inline">•</span>
                  <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <ShoppingCartIcon className="w-4 h-4" /> {sheet.purchaseCount} sold
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={sheet.seller.avatar}
                    alt="Seller"
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {sheet.seller.sellerProfile?.shopName || 
                       `${sheet.seller.firstName} ${sheet.seller.lastName}`}
                    </p>
                    <p className="text-sm text-gray-500">Seller</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 border-b border-gray-100">
                <h2 className="font-bold text-xl mb-3 text-gray-900">Description</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{sheet.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  {sheet.subject && (
                    <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      <p className="font-semibold text-gray-800">{sheet.subject}</p>
                    </div>
                  )}
                  {sheet.year && (
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-semibold text-gray-800">{sheet.year}</p>
                    </div>
                  )}
                  {sheet.faculty && (
                    <div>
                      <p className="text-sm text-gray-500">Faculty</p>
                      <p className="font-semibold text-gray-800">{sheet.faculty}</p>
                    </div>
                  )}
                  {sheet.university && (
                    <div>
                      <p className="text-sm text-gray-500">University</p>
                      <p className="font-semibold text-gray-800">{sheet.university}</p>
                    </div>
                  )}
                </div>
              </div>

              {sheet.previewUrl && (
                <div className="p-6 md:p-8">
                  <h2 className="font-bold text-xl mb-4 text-gray-900">Preview </h2>
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <SheetPreview 
                      fileUrl={sheet.previewUrl} 
                      maxPages={3}
                      isPurchased={purchased || isOwner}
                    />
                  </div>
                </div>
              )}

              {purchased && (
                <div className="p-6 md:p-8 border-t border-gray-100 bg-indigo-50/50">
                  <h3 className="font-bold text-lg mb-3 text-gray-900">
                    {myRating > 0 ? 'Update your rating' : 'Rate this sheet'}
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => {
                            setPendingRating(star);
                            setRatingStatus({ loading: false, error: null, success: null });
                          }}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="transition-transform hover:scale-110 cursor-pointer"
                        >
                          {(hoveredStar || pendingRating || myRating) >= star 
                            ? <SolidStarIcon className="w-8 h-8 text-yellow-400" /> 
                            : <OutlineStarIcon className="w-8 h-8 text-gray-300" />
                          }
                        </button>
                      ))}
                    </div>
                    
                    {pendingRating > 0 && pendingRating !== myRating && (
                      <button
                        onClick={handleSubmitRating}
                        disabled={ratingStatus.loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer w-full sm:w-auto disabled:opacity-50"
                      >
                        {ratingStatus.loading ? 'Submitting...' : `Submit ${pendingRating}-Star Rating`}
                      </button>
                    )}

                    {myRating > 0 && pendingRating === 0 && (
                       <p className="text-sm text-gray-600">
                         Your rating: {myRating} star{myRating > 1 ? 's' : ''}
                       </p>
                    )}

                    {ratingStatus.success && (
                      <p className="text-sm font-medium text-green-600">{ratingStatus.success}</p>
                    )}
                    {ratingStatus.error && (
                      <p className="text-sm font-medium text-red-600">{ratingStatus.error}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-1 z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-indigo-600 mb-2">
                  {formatPrice(sheet.price)}
                </p>
                <p className="text-sm text-gray-600">One-time payment</p>
              </div>

              {purchaseChecking ? (
                <div className="py-4">
                  <LoadingSpinner text="Checking status..." />
                </div>
              ) : purchased ? (
                <>
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold mb-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {isDownloading ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Download Full PDF
                      </>
                    )}
                  </button>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-800 text-sm font-medium flex items-center justify-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      You own this sheet
                    </p>
                  </div>
                </>
              ) : isOwner ? (
                <div className="py-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-center font-medium">
                  This is your sheet
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-lg shadow-indigo-500/30 cursor-pointer"
                >
                  Buy Now
                </button>
              )}

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>Lifetime access</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>Download PDF anytime</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span>Secure payment</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default SheetDetailPage;