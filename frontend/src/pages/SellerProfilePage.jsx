import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useSellerStore from '../store/useSellerStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  PencilIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

function SellerProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sellerProfile, isLoading, fetchSellerProfile, updateSellerProfile } = useSellerStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    description: '',
    bankAccount: '',
  });
  const [fieldErrors, setFieldErrors] = useState({ shopName: '', description: '', bankAccount: '' });
  const [shakeFields, setShakeFields] = useState({ shopName: false, description: false, bankAccount: false });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.role === 'SELLER' || user?.role === 'ADMIN') {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const profile = await fetchSellerProfile();
      if (profile) {
        setFormData({
          shopName: profile.shopName || '',
          description: profile.description || '',
          bankAccount: profile.bankAccount || '',
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFieldErrors({ ...fieldErrors, [field]: '' });
    setSuccess(false);
  };

  const validateForm = () => {
    const errors = {
      shopName: !formData.shopName 
        ? 'Shop name is required' 
        : formData.shopName.length < 3 
        ? 'Shop name must be at least 3 characters' 
        : '',
      description: !formData.description ? 'Description is required' : '',
      bankAccount: !formData.bankAccount 
        ? 'Bank account is required' 
        : !/^[0-9]{10,15}$/.test(formData.bankAccount) 
        ? 'Bank account must be 10-15 digits' 
        : '',
    };
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFieldErrors(errors);

    setShakeFields({
      shopName: !!errors.shopName,
      description: !!errors.description,
      bankAccount: !!errors.bankAccount,
    });
    setTimeout(() => setShakeFields({ shopName: false, description: false, bankAccount: false }), 500);

    if (errors.shopName || errors.description || errors.bankAccount) return;

    try {
      const cleanData = {
        shopName: formData.shopName.trim(),
        description: formData.description.trim(),
        bankAccount: formData.bankAccount.replace(/\D/g, ''),
      };
      
      await updateSellerProfile(cleanData);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setFieldErrors({ 
        ...fieldErrors, 
        shopName: err.response?.data?.error || err.response?.data?.message || 'Update failed' 
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFieldErrors({ shopName: '', description: '', bankAccount: '' });
    if (sellerProfile) {
      setFormData({
        shopName: sellerProfile.shopName || '',
        description: sellerProfile.description || '',
        bankAccount: sellerProfile.bankAccount || '',
      });
    }
  };

  if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircleIcon className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only sellers can view this page</p>
          <button
            onClick={() => navigate('/become-seller')}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow cursor-pointer"
          >
            Become a Seller
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !sellerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner text="Loading profile..." />
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: CheckCircleIcon,
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          label: 'Approved',
        };
      case 'PENDING':
        return {
          icon: ClockIcon,
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          label: 'Pending',
        };
      default:
        return {
          icon: XCircleIcon,
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          label: 'Rejected',
        };
    }
  };

  const statusConfig = getStatusConfig(sellerProfile?.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <button
            onClick={() => navigate('/seller')}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-2 font-medium transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Seller Profile</h1>
          <p className="text-gray-600 mt-1">Manage your shop information and settings</p>
        </div>

        {success && !isEditing && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2 animate-fade-in">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="font-medium">Profile updated successfully!</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <BuildingStorefrontIcon className="w-10 h-10 text-indigo-600" />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold drop-shadow">
                    {sellerProfile?.shopName || 'Your Shop'}
                  </h2>
                  <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig.label}
                  </div>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 self-start md:self-auto cursor-pointer"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.shopName}
                    onChange={(e) => handleInputChange('shopName', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm cursor-text ${
                      fieldErrors.shopName 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    } ${shakeFields.shopName ? 'animate-shake' : ''}`}
                    placeholder="Enter your shop name"
                    minLength={3}
                    maxLength={100}
                  />
                  {fieldErrors.shopName && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.shopName}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">3-100 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm cursor-text resize-none ${
                      fieldErrors.description 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    } ${shakeFields.description ? 'animate-shake' : ''}`}
                    rows="5"
                    placeholder="Describe your shop and what you offer..."
                  />
                  {fieldErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm font-mono cursor-text ${
                      fieldErrors.bankAccount 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    } ${shakeFields.bankAccount ? 'animate-shake' : ''}`}
                    placeholder="1234567890"
                    maxLength={15}
                  />
                  {fieldErrors.bankAccount && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.bankAccount}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">10-15 digits, numbers only</p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <BuildingStorefrontIcon className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-medium text-gray-600">Shop Name</label>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 pl-7">
                      {sellerProfile?.shopName || 'N/A'}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-medium text-gray-600">Description</label>
                    </div>
                    <p className="text-gray-900 whitespace-pre-line pl-7 leading-relaxed">
                      {sellerProfile?.description || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BanknotesIcon className="w-5 h-5 text-gray-400" />
                      <label className="text-sm font-medium text-gray-600">Bank Account</label>
                    </div>
                    <p className="text-gray-900 font-mono text-base pl-7">
                      {sellerProfile?.bankAccount 
                        ? sellerProfile.bankAccount.replace(/(\d{3})(\d{1})(\d{5})(\d)/, '$1-$2-$3-$4')
                        : 'N/A'}
                    </p>
                  </div>

                  {sellerProfile?.createdAt && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                        <label className="text-sm font-medium text-gray-600">Member Since</label>
                      </div>
                      <p className="text-gray-900 pl-7">
                        {new Date(sellerProfile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Keep your shop information up to date to build trust with customers. Make sure your bank account details are correct to receive payments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerProfilePage;