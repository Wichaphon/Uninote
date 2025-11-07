import { useEffect, useState, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import useSheetStore from '../store/useSheetStore';
import usePurchaseStore from '../store/usePurchaseStore';
import useAuthStore from '../store/useAuthStore';
import { sellerService } from '../services/sellerService';
import { formatPrice, formatDate } from '../lib/utils';
import MySheetsList from '../components/seller/MySheetsList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { 
  Cog6ToothIcon, 
  PlusIcon, 
  LockClosedIcon, 
  ClockIcon, 
  DocumentPlusIcon,
  RocketLaunchIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Listbox, Transition } from '@headlessui/react';
import DeleteSheetModal from '../components/common/DeleteSheetModal';
import { toast } from 'react-hot-toast';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
};
const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const processSalesData = (sales, viewMode, date) => {
  const completedSales = sales.filter(s => s.status === 'COMPLETED');
  
  if (viewMode === 'year') {
    const year = date.getFullYear();
    const chartData = months.map(name => ({ name, revenue: 0 }));
    let totalRevenue = 0;
    let totalSales = 0;

    completedSales.forEach(sale => {
      const saleDate = new Date(sale.completedAt);
      if (saleDate.getFullYear() === year) {
        const monthIndex = saleDate.getMonth();
        chartData[monthIndex].revenue += parseFloat(sale.price);
        totalRevenue += parseFloat(sale.price);
        totalSales++;
      }
    });
    return { chartData, totalRevenue, totalSales, title: `Revenue for ${year}` };
  }

  if (viewMode === 'month') {
    const year = date.getFullYear();
    const month = date.getMonth();
    const numDays = getDaysInMonth(date);
    const chartData = Array.from({ length: numDays }, (_, i) => ({
      name: (i + 1).toString(),
      revenue: 0,
    }));
    let totalRevenue = 0;
    let totalSales = 0;

    completedSales.forEach(sale => {
      const saleDate = new Date(sale.completedAt);
      if (saleDate.getFullYear() === year && saleDate.getMonth() === month) {
        const dayIndex = saleDate.getDate() - 1;
        chartData[dayIndex].revenue += parseFloat(sale.price);
        totalRevenue += parseFloat(sale.price);
        totalSales++;
      }
    });
    return { chartData, totalRevenue, totalSales, title: `Revenue for ${months[month]} ${year}` };
  }

  if (viewMode === 'week') {
    const startOfWeek = startOfDay(getStartOfWeek(date));
    const chartData = days.map(name => ({ name, revenue: 0 }));
    let totalRevenue = 0;
    let totalSales = 0;

    completedSales.forEach(sale => {
      const saleDate = startOfDay(new Date(sale.completedAt));
      const diffTime = saleDate.getTime() - startOfWeek.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < 7) {
        const dayIndex = saleDate.getDay();
        chartData[dayIndex].revenue += parseFloat(sale.price);
        totalRevenue += parseFloat(sale.price);
        totalSales++;
      }
    });
    return { chartData, totalRevenue, totalSales, title: `Revenue for Week of ${startOfWeek.toLocaleDateString('en-US')}` };
  }

  return { chartData: [], totalRevenue: 0, totalSales: 0, title: '' };
};


function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { mySheets, isLoading, fetchMySheets, deleteSheet } = useSheetStore();
  const { sales, fetchMySales } = usePurchaseStore();

  const [sellerProfile, setSellerProfile] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sheetToDeleteId, setSheetToDeleteId] = useState(null);

  useEffect(() => {
    if (user?.role === 'SELLER' || user?.role === 'ADMIN') {
      loadSellerProfile();
      fetchMySheets();
      fetchMySales();
    }
  }, [user]);

  const loadSellerProfile = async () => {
    try {
      const data = await sellerService.getSellerProfile();
      setSellerProfile(data.sellerProfile);
    } catch (err) {
      console.error('Load seller profile error:', err);
    }
  };

  const handleDeleteSheet = (sheetId) => {
    setSheetToDeleteId(sheetId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sheetToDeleteId) return;
    
    try {
      await deleteSheet(sheetToDeleteId);
      toast.success('Sheet deleted successfully!');
    } catch (err) {
      toast.error('Delete failed: ' + err.message);
    } finally {
      setIsDeleteModalOpen(false);
      setSheetToDeleteId(null);
    }
  };
  
  const availableYears = useMemo(() => {
    if (sales.length === 0) return [new Date().getFullYear()];
    const years = new Set(sales.map(s => new Date(s.completedAt).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [sales]);

  const { chartData, totalRevenue: totalRevenueForPeriod, totalSales: totalSalesForPeriod, title: chartTitle } = useMemo(
    () => processSalesData(sales, viewMode, currentDate),
    [sales, viewMode, currentDate]
  );
  
  const totalRevenueAllTime = useMemo(() => {
    return sales
      .filter(s => s.status === 'COMPLETED')
      .reduce((sum, sale) => sum + parseFloat(sale.price), 0);
  }, [sales]);

  const handleDateChange = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (viewMode === 'week') {
        newDate.setDate(newDate.getDate() + (direction * 7));
      } else if (viewMode === 'month') {
        newDate.setMonth(newDate.getMonth() + direction);
      }
      return newDate;
    });
  };

  if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LockClosedIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Seller Access Only</h2>
          <p className="text-gray-600 mb-6">
            You need to be a seller to access this page.
          </p>
          <button
            onClick={() => navigate('/become-seller')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30 cursor-pointer"
          >
            Become a Seller
          </button>
        </div>
      </div>
    );
  }

  if (sellerProfile?.status === 'PENDING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClockIcon className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Application Pending</h2>
          <p className="text-gray-600 mb-6">
            Your seller application is waiting for admin approval. This usually takes 24-48 hours.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30 cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !sellerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-indigo-50 py-12">
      <div className="container mx-auto p-4 md:p-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between md:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Seller Dashboard</h1>
            {sellerProfile && (
              <p className="text-lg text-gray-600 mt-1">
                Welcome back, {sellerProfile.shopName}
              </p>
            )}
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate('/seller/profile')}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 transition-colors font-medium text-sm flex items-center gap-2 cursor-pointer"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              Shop Settings
            </button>
            <button
              onClick={() => navigate('/seller/sheets/create')}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-indigo-500/30 cursor-pointer"
            >
              <PlusIcon className="w-5 h-5" />
              Create Sheet
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="lg:col-span-2 bg-white rounded-xl shadow-xl border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-1 text-gray-900">{chartTitle}</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {formatPrice(totalRevenueForPeriod)}
                </p>
              </div>
              
              <div className="shrink-0 mt-4 sm:mt-0">
                <div className="inline-flex rounded-lg shadow-sm">
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1.5 rounded-l-lg border border-gray-300 transition-colors text-sm font-medium cursor-pointer ${
                      viewMode === 'week' ? 'bg-indigo-600 text-white border-indigo-600 z-10' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1.5 border-t border-b border-gray-300 transition-colors text-sm font-medium cursor-pointer ${
                      viewMode === 'month' ? 'bg-indigo-600 text-white border-indigo-600 z-10' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setViewMode('year')}
                    className={`px-3 py-1.5 rounded-r-lg border border-gray-300 transition-colors text-sm font-medium cursor-pointer ${
                      viewMode === 'year' ? 'bg-indigo-600 text-white border-indigo-600 z-10' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Year
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center items-center gap-4 mb-4">
              {viewMode !== 'year' && (
                <button 
                  onClick={() => handleDateChange(-1)} 
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
              )}
              
              {viewMode === 'year' && (
                <Listbox value={currentDate.getFullYear()} onChange={(year) => setCurrentDate(new Date(year, 0, 1))}>
                  <div className="relative z-10 w-36">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm hover:border-gray-400">
                      <span className="block truncate font-medium">{currentDate.getFullYear()}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {availableYears.map((year) => (
                          <Listbox.Option
                            key={year}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                              }`
                            }
                            value={year}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {year}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              )}

              {viewMode !== 'year' && (
                <button 
                  onClick={() => handleDateChange(1)} 
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" fontSize={12} stroke="#6b7280" />
                  <YAxis fontSize={12} stroke="#6b7280" tickFormatter={(value) => `฿${value}`} />
                  <Tooltip
                    cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
                    formatter={(value) => [formatPrice(value), 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <BanknotesIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue (All Time)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(totalRevenueAllTime)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <ShoppingCartIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sales ({viewMode})</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSalesForPeriod}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <DocumentDuplicateIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Sheets</p>
                  <p className="text-2xl font-bold text-gray-900">{mySheets.length}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">My Sheets</h2>
            {mySheets.length > 0 && (
              <p className="text-gray-600">
                <span className="font-medium text-green-600">{mySheets.filter(s => s.isActive).length}</span> active, <span className="font-medium text-gray-500">{mySheets.filter(s => !s.isActive).length}</span> hidden
              </p>
            )}
          </div>

          <MySheetsList
            sheets={mySheets}
            isLoading={isLoading}
            onDelete={handleDeleteSheet}
          />
        </motion.div>

        {sales.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Recent Sales</h2>
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sheet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buyer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {sales.filter(s => s.status === 'COMPLETED').slice(0, 10).map((sale) => (
                      <tr key={sale.id} className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {sale.sheet.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {sale.sheet.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {sale.user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-green-600">
                            {formatPrice(sale.price)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(sale.completedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sales.filter(s => s.status === 'COMPLETED').length > 10 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm text-gray-600 text-center">
                    Showing 10 of {sales.filter(s => s.status === 'COMPLETED').length} completed sales
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {sales.filter(s => s.status === 'COMPLETED').length === 0 && mySheets.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <RocketLaunchIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold text-blue-800 mb-2">No sales yet</h3>
            <p className="text-blue-600 text-sm">
              Your sheets are published. Sales will appear here once students start purchasing!
            </p>
          </div>
        )}

        {mySheets.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <DocumentPlusIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No sheets yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first study sheet to sell
            </p>
            <button
              onClick={() => navigate('/seller/sheets/create')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold cursor-pointer shadow-lg shadow-indigo-500/30"
            >
              Create Your First Sheet
            </button>
          </div>
        )}

        <DeleteSheetModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
        
      </div>
    </div>
  );
}

export default SellerDashboard;