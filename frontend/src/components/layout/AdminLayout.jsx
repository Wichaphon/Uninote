import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import LogoutModal from '../common/LogoutModal';
import {
  UserGroupIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: ChartBarIcon, path: '/admin' },
    { name: 'Users', icon: UserGroupIcon, path: '/admin/users' },
    { name: 'Sheets', icon: DocumentTextIcon, path: '/admin/sheets' },
    { name: 'Purchases', icon: ShoppingCartIcon, path: '/admin/purchases' },
    { name: 'Sellers', icon: UserGroupIcon, path: '/admin/sellers' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-linear-to-b from-gray-900 via-gray-900 to-indigo-950 text-white flex flex-col shadow-2xl fixed h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">UniNote Admin</h1>
              <p className="text-xs text-indigo-300">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Menu - Scrollable */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                window.location.pathname === item.path
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800/50 space-y-2 bg-linear-to-b from-gray-900 to-indigo-950">
          <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl">
            <img
              src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff'}
              alt="Admin"
              className="w-10 h-10 rounded-full ring-2 ring-indigo-500"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-indigo-300">Administrator</p>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-lg shadow-red-600/30 cursor-pointer"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto ml-72">
        {/* Top Bar */}
        <header className="bg-white shadow-md border-b border-gray-200 px-8 py-5 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => item.path === window.location.pathname)?.name || 'Admin Panel'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage your platform efficiently
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default AdminLayout;