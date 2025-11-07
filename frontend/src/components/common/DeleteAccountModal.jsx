import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function DeleteAccountModal({ isOpen, onClose, onConfirm, password, setPassword, error, setError }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Account
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <ul className="text-sm text-red-800 space-y-1.5">
              <li>• Your account will be permanently deleted</li>
              <li>• All your uploaded sheets will be removed</li>
              <li>• Your purchase history will be lost</li>
              <li>• This action cannot be undone</li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your password to confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm cursor-text ${
                error 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-red-500 focus:border-transparent'
              }`}
              placeholder="Enter your password"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!password}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Account
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default DeleteAccountModal;