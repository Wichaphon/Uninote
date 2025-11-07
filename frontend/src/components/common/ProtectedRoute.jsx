import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthChecking } = useAuthStore();
  const location = useLocation();

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Checking authentication..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-red-700 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-red-600">
            Required role: {allowedRoles.join(' or ')}
          </p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;