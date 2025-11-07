import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import { authService } from '../services/authService';
import DeleteAccountModal from '../components/common/DeleteAccountModal';
import {
  UserCircleIcon,
  PhotoIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpTrayIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

function DeleteAvatarModal({ isOpen, onClose, onConfirm }) {
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
            Remove Avatar
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to remove your profile picture?
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SuccessModal({ isOpen, onClose, message }) {
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            Success!
          </h3>
          <p className="text-gray-600 text-center mb-6">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            OK
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SettingsPage() {
  const { user, updateProfile, uploadAvatar, deleteAvatar } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'avatar', name: 'Avatar', icon: PhotoIcon },
    { id: 'password', name: 'Security', icon: KeyIcon },
    { id: 'danger', name: 'Account', icon: ExclamationTriangleIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/*Header*/}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/*Sidebar*/}
          <aside className="lg:w-64 shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/*Main Content*/}
          <main className="flex-1">
            {activeTab === 'profile' && <ProfileTab user={user} updateProfile={updateProfile} />}
            {activeTab === 'avatar' && <AvatarTab user={user} uploadAvatar={uploadAvatar} deleteAvatar={deleteAvatar} />}
            {activeTab === 'password' && <PasswordTab />}
            {activeTab === 'danger' && <DangerTab />}
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, updateProfile }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ firstName: '', lastName: '' });
  const [shakeFields, setShakeFields] = useState({ firstName: false, lastName: false });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFieldErrors({ ...fieldErrors, [field]: '' });
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = {
      firstName: !formData.firstName ? 'First name is required' : '',
      lastName: !formData.lastName ? 'Last name is required' : '',
    };
    setFieldErrors(errors);

    setShakeFields({
      firstName: !!errors.firstName,
      lastName: !!errors.lastName,
    });
    setTimeout(() => setShakeFields({ firstName: false, lastName: false }), 500);

    if (errors.firstName || errors.lastName) return;

    setIsLoading(true);
    setSuccess(false);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setFieldErrors({ ...fieldErrors, firstName: err.message || 'Update failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        <p className="text-sm text-gray-600 mt-1">Update your personal information</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm cursor-text ${
                fieldErrors.firstName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
              } ${shakeFields.firstName ? 'animate-shake' : ''}`}
              placeholder="Enter your first name"
            />
            {fieldErrors.firstName && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm cursor-text ${
                fieldErrors.lastName 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
              } ${shakeFields.lastName ? 'animate-shake' : ''}`}
              placeholder="Enter your last name"
            />
            {fieldErrors.lastName && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircleIcon className="w-5 h-5" />
              Profile updated successfully
            </div>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow text-sm flex items-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function AvatarTab({ user, uploadAvatar, deleteAvatar }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleFileChange = (file) => {
    if (!file) return;

    if (file.type !== 'image/png') {
      setError('Only PNG files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setAvatarFile(file);
    setError('');
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e) => {
    handleFileChange(e.target.files[0]);
    e.target.value = null;
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setAvatarFile(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!avatarFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await uploadAvatar(avatarFile);
      setSuccess('Avatar uploaded successfully!');
      setAvatarFile(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await deleteAvatar();
      setSuccess('Avatar removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Delete failed. Please try again.');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Profile Picture</h2>
          <p className="text-sm text-gray-600 mt-1">Upload or remove your profile picture</p>
        </div>
        
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg text-sm flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              {success}
            </div>
          )}

          <div className="flex items-center gap-6">
            <img 
              src={user?.avatar} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-md" 
            />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Current Avatar</h3>
              <p className="text-xs text-gray-500">PNG only. Max size 5MB.</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload New Avatar
            </label>
            <div
              className={`w-full border-2 rounded-lg p-6 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-50 scale-105' 
                  : 'border-dashed border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('avatarInput').click()}
            >
              {!avatarFile ? (
                <div className="flex flex-col items-center">
                  <ArrowUpTrayIcon className={`w-10 h-10 mb-2 transition-colors ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <p className="font-medium text-gray-600">
                    {isDragging ? 'Release to upload PNG' : 'Drag & drop PNG file here'}
                  </p>
                  <p className="text-sm text-gray-400">or click to browse</p>
                  <p className="text-xs text-gray-500 mt-2">PNG only • Max 5MB</p>
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <PhotoIcon className="w-8 h-8 text-indigo-500 shrink-0" />
                    <div>
                      <p className="text-gray-800 font-medium">{avatarFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(avatarFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 hover:scale-110 p-1 rounded-full transition-all cursor-pointer"
                    title="Remove file"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
            
            {avatarFile && (
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="mt-4 w-full px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow text-sm cursor-pointer"
              >
                {isLoading ? 'Uploading...' : 'Upload Avatar'}
              </button>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isLoading}
              className="px-5 py-2.5 bg-white text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm cursor-pointer"
            >
              Remove Avatar
            </button>
          </div>
        </div>
      </div>

      <DeleteAvatarModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

function PasswordTab() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [shakeFields, setShakeFields] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFieldErrors({ ...fieldErrors, [field]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      currentPassword: !formData.currentPassword ? 'Current password is required' : '',
      newPassword: !formData.newPassword 
        ? 'New password is required' 
        : formData.newPassword.length < 6 
        ? 'Password must be at least 6 characters' 
        : '',
      confirmPassword: !formData.confirmPassword 
        ? 'Please confirm your new password' 
        : formData.newPassword !== formData.confirmPassword 
        ? 'Passwords do not match' 
        : '',
    };
    setFieldErrors(errors);

    setShakeFields({
      currentPassword: !!errors.currentPassword,
      newPassword: !!errors.newPassword,
      confirmPassword: !!errors.confirmPassword,
    });
    setTimeout(() => setShakeFields({ currentPassword: false, newPassword: false, confirmPassword: false }), 500);

    if (errors.currentPassword || errors.newPassword || errors.confirmPassword) return;

    setIsLoading(true);
    try {
      await authService.changePassword(formData.currentPassword, formData.newPassword);
      setShowSuccessModal(true);
    } catch (err) {
      setFieldErrors({ 
        ...fieldErrors, 
        currentPassword: err.response?.data?.error || 'Change password failed. Please check your current password.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    window.location.href = '/login';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
          <p className="text-sm text-gray-600 mt-1">Update your password to keep your account secure</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm cursor-text ${
                fieldErrors.currentPassword 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
              } ${shakeFields.currentPassword ? 'animate-shake' : ''}`}
              placeholder="Enter your current password"
            />
            {fieldErrors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.currentPassword}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm cursor-text ${
                  fieldErrors.newPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                } ${shakeFields.newPassword ? 'animate-shake' : ''}`}
                placeholder="Enter new password"
              />
              {fieldErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.newPassword}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm cursor-text ${
                  fieldErrors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                } ${shakeFields.confirmPassword ? 'animate-shake' : ''}`}
                placeholder="Confirm new password"
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Password requirements:</strong> Use at least 6 characters.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow text-sm cursor-pointer"
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        message="Password changed successfully! Please login again."
      />
    </>
  );
}

function DangerTab() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError('');
    try {
      await authService.deleteAccount(password);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed. Please check your password.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Delete Account</h2>
          <p className="text-sm text-gray-600 mt-1">Permanently remove your account and all associated data</p>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <div className="flex gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Warning: This action is irreversible</h3>
                <ul className="text-sm text-red-800 space-y-1.5">
                  <li>• Your account will be permanently deleted</li>
                  <li>• All your uploaded sheets and content will be removed</li>
                  <li>• Your purchase history will be lost</li>
                  <li>• This action cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isLoading}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow text-sm cursor-pointer"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPassword('');
          setError('');
        }}
        onConfirm={handleDeleteConfirm}
        password={password}
        setPassword={setPassword}
        error={error}
        setError={setError}
      />
    </>
  );
}

export default SettingsPage;