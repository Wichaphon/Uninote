import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import { sellerService } from "../services/sellerService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { formatDate } from "../lib/utils";
import { motion } from "framer-motion";
import {
  LockClosedIcon,
  BanknotesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CheckIcon,
  ClockIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  XMarkIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

function BecomeSellerPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [sellerProfile, setSellerProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
    bankAccount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [shakeKey, setShakeKey] = useState(0); 

  useEffect(() => {
    if (user) {
      checkSellerProfile();
    } else {
      setIsLoadingProfile(false);
    }
  }, [user]);

  const checkSellerProfile = async () => {
    try {
      const data = await sellerService.getSellerProfile();
      setSellerProfile(data.sellerProfile);
    } catch (err) {
      console.log("No seller profile found");
    } finally {
      setIsLoadingProfile(false);
    }
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
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const cardListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LockClosedIcon className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to login before becoming a seller.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30 cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user.role === "SELLER" || user.role === "ADMIN") {
    navigate("/seller");
    return null;
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (sellerProfile && sellerProfile.status === "PENDING") {
    return <PendingApplicationView sellerProfile={sellerProfile} />;
  }

  if (sellerProfile && sellerProfile.status === "REJECTED") {
    return <RejectedApplicationView sellerProfile={sellerProfile} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    const newErrors = {};
    if (!formData.shopName.trim()) newErrors.shopName = true;
    if (!formData.description.trim()) newErrors.description = true;
    if (!formData.bankAccount.trim()) newErrors.bankAccount = true;

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      setShakeKey((prev) => prev + 1); 
      return;
    }

    setIsLoading(true);

    try {
      await sellerService.applySeller(formData);
      toast.success(
        "Application submitted successfully! Please wait for admin approval.",
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#10b981",
            color: "#fff",
            fontWeight: "500",
            padding: "16px",
          },
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Application failed");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Submitting application..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Become a Seller
          </motion.h1>
          <motion.p className="text-gray-600 text-lg" variants={itemVariants}>
            Share your knowledge and earn money by selling study materials
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          variants={cardListVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center transition-all hover:shadow-xl"
            variants={cardVariants}
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BanknotesIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="font-bold text-lg mb-1">Earn Money</h3>
            <p className="text-sm text-gray-600">Set your own prices</p>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center transition-all hover:shadow-xl"
            variants={cardVariants}
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="font-bold text-lg mb-1">Help Students</h3>
            <p className="text-sm text-gray-600">Share quality materials</p>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center transition-all hover:shadow-xl"
            variants={cardVariants}
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="font-bold text-lg mb-1">Grow Income</h3>
            <p className="text-sm text-gray-600">Unlimited potential</p>
          </motion.div>
        </motion.div>

        <motion.div
          key={shakeKey} 
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          animate={Object.keys(validationErrors).length > 0 ? "shake" : ""}
          variants={shakeVariants}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Seller Application
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 font-medium p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => {
                  setFormData({ ...formData, shopName: e.target.value });
                  if (validationErrors.shopName)
                    setValidationErrors({
                      ...validationErrors,
                      shopName: false,
                    });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-all ${
                  validationErrors.shopName
                    ? "border-red-500 ring-2 ring-red-200"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                placeholder="e.g., John's Study Materials"
                minLength={3}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                3-100 characters. This will be displayed to buyers.
              </p>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (validationErrors.description)
                    setValidationErrors({
                      ...validationErrors,
                      description: false,
                    });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-all ${
                  validationErrors.description
                    ? "border-red-500 ring-2 ring-red-200"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                rows="4"
                placeholder="Tell buyers about yourself and what materials you offer..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Describe your expertise and what students can expect from your
                materials.
              </p>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Bank Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => {
                  //Allow only numbers
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, bankAccount: value });
                  if (validationErrors.bankAccount)
                    setValidationErrors({
                      ...validationErrors,
                      bankAccount: false,
                    });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-all ${
                  validationErrors.bankAccount
                    ? "border-red-500 ring-2 ring-red-200"
                    : "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                placeholder="1234567890"
                maxLength={15}
                inputMode="numeric"
              />
              <p className="text-xs text-gray-500 mt-1">
                10-15 digits, numbers only. For receiving payments.
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-indigo-800">
                Before you apply:
              </h3>
              <ul className="text-sm text-indigo-700 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-indigo-600" />
                  <span>Your application will be reviewed by admin</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-indigo-600" />
                  <span>
                    You'll be notified once approved (usually within 24-48
                    hours)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-indigo-600" />
                  <span>
                    Once approved, you can start uploading and selling materials
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-indigo-600" />
                  <span>
                    You'll receive payments to the bank account provided
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/30 cursor-pointer"
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 w-full px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}


function PendingApplicationView({ sellerProfile }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Application Pending</h1>
                <p className="text-yellow-100">
                  Your seller application is being reviewed
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <InformationCircleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800 mb-1">
                    What happens next?
                  </p>
                  <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                    <li>Our admin team will review your application</li>
                    <li>Review typically takes 24-48 hours</li>
                    <li>You'll receive an email once approved</li>
                    <li>After approval, you can start uploading sheets</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Application Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                      {sellerProfile.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Shop Name
                  </label>
                  <p className="mt-1 text-gray-900 font-semibold">
                    {sellerProfile.shopName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <p className="mt-1 text-gray-900">
                    {sellerProfile.description}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Bank Account
                  </label>
                  <p className="mt-1 text-gray-900 font-mono">
                    {sellerProfile.bankAccount.replace(
                      /(\d{3})(\d{1})(\d{5})(\d)/,
                      "$1-$2-$3-$4"
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Submitted Date
                  </label>
                  <p className="mt-1 text-gray-900">
                    {formatDate(sellerProfile.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-gray-900">
                Application Timeline
              </h3>
              <ol className="relative border-l border-gray-200">
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                  </span>
                  <h3 className="font-medium text-gray-900">
                    Application Submitted
                  </h3>
                  <time className="text-sm text-gray-500">
                    {formatDate(sellerProfile.createdAt)}
                  </time>
                </li>
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full -left-3 ring-8 ring-white">
                    <ArrowPathIcon className="w-4 h-4 text-yellow-600 animate-spin" />
                  </span>
                  <h3 className="font-medium text-gray-900">Under Review</h3>
                  <p className="text-sm text-gray-500">
                    Waiting for admin approval
                  </p>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -left-3 ring-8 ring-white">
                    <CheckCircleIcon className="w-4 h-4 text-gray-400" />
                  </span>
                  <h3 className="font-medium text-gray-500">Approval</h3>
                  <p className="text-sm text-gray-400">
                    Pending admin decision
                  </p>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 font-medium transition-colors cursor-pointer"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate("/explore")}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-lg shadow-indigo-500/30 cursor-pointer"
              >
                Browse Sheets
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you have any questions about your application or the seller
            program, please contact us.
          </p>
          <button
            onClick={() =>
              (window.location.href = "mailto:support@uninote.com")
            }
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium cursor-pointer"
          >
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  );
}

function RejectedApplicationView({ sellerProfile }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <XCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  Application Rejected
                </h1>
                <p className="text-red-100">
                  Your seller application was not approved
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 mb-2">
                    Why was my application rejected?
                  </p>
                  <p className="text-sm text-red-700 mb-3">
                    Your application may have been rejected for one of the
                    following reasons:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    <li>Incomplete or inaccurate information</li>
                    <li>Invalid bank account details</li>
                    <li>Shop name violates our policies</li>
                    <li>Insufficient description of materials</li>
                    <li>Other policy violations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <LightBulbIcon className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-indigo-800 mb-2">
                    What should I do next?
                  </p>
                  <ol className="text-sm text-indigo-700 space-y-2">
                    <li className="flex gap-2">
                      <span className="font-semibold">1.</span>
                      <span>
                        Contact our support team to understand the specific
                        reason
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">2.</span>
                      <span>
                        Admin will review your case and may allow you to
                        reapply
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold">3.</span>
                      <span>
                        Fix the issues and submit a new application if approved
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Previous Application Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <div className="mt-1">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      {sellerProfile.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Shop Name
                  </label>
                  <p className="mt-1 text-gray-900 font-semibold">
                    {sellerProfile.shopName}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <p className="mt-1 text-gray-900">
                    {sellerProfile.description}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Bank Account
                  </label>
                  <p className="mt-1 text-gray-900 font-mono">
                    {sellerProfile.bankAccount.replace(
                      /(\d{3})(\d{1})(\d{5})(\d)/,
                      "$1-$2-$3-$4"
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Submitted
                    </label>
                    <p className="mt-1 text-gray-900 text-sm">
                      {formatDate(sellerProfile.createdAt)}
                    </p>
                  </div>
                  {sellerProfile.rejectedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Rejected
                      </label>
                      <p className="mt-1 text-gray-900 text-sm">
                        {formatDate(sellerProfile.rejectedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-gray-900">
                Application Timeline
              </h3>
              <ol className="relative border-l border-gray-200">
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                  </span>
                  <h3 className="font-medium text-gray-900">
                    Application Submitted
                  </h3>
                  <time className="text-sm text-gray-500">
                    {formatDate(sellerProfile.createdAt)}
                  </time>
                </li>
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-red-100 rounded-full -left-3 ring-8 ring-white">
                    <XMarkIcon className="w-4 h-4 text-red-600" />
                  </span>
                  <h3 className="font-medium text-red-600">
                    Application Rejected
                  </h3>
                  <time className="text-sm text-red-500">
                    {sellerProfile.rejectedAt
                      ? formatDate(sellerProfile.rejectedAt)
                      : "Recently"}
                  </time>
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-2">Need to Reapply?</h3>
              <p className="text-indigo-100 mb-4">
                Contact our support team to discuss your application and
                possibility of reapplying
              </p>
              <button
                onClick={() =>
                  (window.location.href =
                    "mailto:support@uninote.com?subject=Seller Application Rejected - Request to Reapply")
                }
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 font-semibold shadow-lg transition-all cursor-pointer"
              >
                <EnvelopeIcon className="w-5 h-5 inline-block mr-2" />
                Contact Support Team
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 font-medium transition-colors cursor-pointer"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate("/explore")}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-lg shadow-indigo-500/30 cursor-pointer"
              >
                Browse Sheets
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Support Information
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              <span>Email: support@uninote.com</span>
            </p>
            <p className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-gray-400" />
              <span>Response time: Usually within 24 hours</span>
            </p>
            <p className="flex items-center gap-2">
              <ChatBubbleLeftIcon className="w-5 h-5 text-gray-400" />
              <span>
                Include your application details when contacting us
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BecomeSellerPage;