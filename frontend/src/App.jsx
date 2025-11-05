import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/useAuthStore";
import { ROUTES } from "./constants";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Common Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SheetDetailPage from "./pages/SheetDetailPage";
import MyPurchasesPage from "./pages/MyPurchasesPage";
import SellerDashboard from "./pages/SellerDashboard";
import AdminPanel from "./pages/AdminPanel";
import ExplorePage from "./pages/ExplorePage";
import BecomeSellerPage from "./pages/BecomeSellerPage";
import EditSheetPage from "./pages/EditSheetPage";

function App() {
  const { isAuthChecking, initializeAuth } = useAuthStore();
  const location = useLocation(); // ✅ ใช้เพื่อดู path ปัจจุบัน

  // ⭐ Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // ⭐ Show loading while checking auth
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  // ✅ ระบุ path ที่ไม่ต้องการแสดง Footer
  const hideFooterPaths = [ROUTES.LOGIN, ROUTES.SIGNUP];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-center" reverseOrder={true} /> {/* เพิ่ม Toaster ที่นี่ */}
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
          <Route path="/sheets/:id" element={<SheetDetailPage />} />
          <Route path="/become-seller" element={<BecomeSellerPage />} />

          {/* Protected Routes - Require Login */}
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SETTINGS}
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchases"
            element={
              <ProtectedRoute>
                <MyPurchasesPage />
              </ProtectedRoute>
            }
          />

          {/* Seller Routes - Require SELLER or ADMIN role */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/sheets/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]}>
                <EditSheetPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - Require ADMIN role */}
          <Route
            path={ROUTES.ADMIN}
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* 404 - Redirect to Home */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </main>

      {/* ✅ แสดง Footer เฉพาะเมื่อไม่อยู่ในหน้า Login / Signup */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

// ✅ ต้องห่อ App ด้วย BrowserRouter ด้านนอก (เช่นใน main.jsx)
function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
