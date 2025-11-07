import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../lib/utils';
import { motion } from 'framer-motion';
import { 
  PencilSquareIcon, 
  ShoppingCartIcon, 
  UserCircleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const RoleBadge = ({ role }) => {
  const styles = {
    ADMIN: 'bg-indigo-100 text-indigo-800',
    SELLER: 'bg-indigo-100 text-indigo-800',
    USER: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${styles[role] || styles.USER}`}>
      {role}
    </span>
  );
};

function ProfilePage() {
  const navigate = useNavigate();
  const { user, isLoading, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ArrowLeftOnRectangleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Please Login</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your profile.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30 cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=4f46e5&color=fff`}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=4f46e5&color=fff`;
                }}
              />
              <div>
                <h1 className="text-3xl font-bold mb-2 text-center sm:text-left">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-indigo-100 text-center sm:text-left">{user.email}</p>
                <div className="mt-4 text-center sm:text-left">
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Profile Details
            </h2>
            <dl className="divide-y divide-gray-100">
              <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">First Name</dt>
                <dd className="text-lg text-gray-900 font-semibold md:col-span-2">{user.firstName}</dd>
              </div>
              <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                <dd className="text-lg text-gray-900 font-semibold md:col-span-2">{user.lastName}</dd>
              </div>
              <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                <dd className="text-lg text-gray-900 md:col-span-2">{user.email}</dd>
              </div>
              <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="text-lg text-gray-900 md:col-span-2">{user.role}</dd>
              </div>
              <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                <dd className="text-lg text-gray-900 md:col-span-2">{formatDate(user.createdAt)}</dd>
              </div>
            </dl>

            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/settings')}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <PencilSquareIcon className="w-5 h-5" />
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/purchases')}
                className="flex-1 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                My Purchases
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfilePage;