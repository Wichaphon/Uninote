import { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { motion } from 'framer-motion';
import { 
  NoSymbolIcon, 
  CheckIcon,
  LockClosedIcon 
} from '@heroicons/react/24/outline';

function UserManagement({ users, isLoading, onToggleStatus }) {

  if (isLoading) {
    return <LoadingSpinner text="Loading users..." />;
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
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
              {users.map((user, index) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-10 w-10 rounded-full ring-2 ring-gray-200"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        {user.sellerProfile && (
                          <div className="text-xs text-indigo-600 font-medium">
                            Shop: {user.sellerProfile.shopName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'SELLER'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === 'ADMIN' ? (
                      <button
                        className="px-3 py-1.5 bg-gray-200 text-gray-500 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-not-allowed"
                        disabled
                      >
                        <LockClosedIcon className="w-4 h-4" />
                        (Admin)
                      </button>
                    ) : user.isActive ? (
                      <button
                        onClick={() => onToggleStatus(user.id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                        title="Click to suspend"
                      >
                        <NoSymbolIcon className="w-4 h-4" />
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatus(user.id)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                        title="Click to activate"
                      >
                        <CheckIcon className="w-4 h-4" />
                        Activate
                      </button>
                    )}
                  </td>
                  
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No users found</p>
          </div>
        )}
      </div>
    </>
  );
}

export default UserManagement;