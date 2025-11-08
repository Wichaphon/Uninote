import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/useAuthStore";
import { ROUTES } from "./constants";

//Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";

//Common Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

//Pages
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
import SellerProfilePage from "./pages/SellerProfilePage";
import CreateSheetPage from "./pages/CreateSheetPage";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSheets from "./pages/admin/AdminSheets";
import AdminPurchases from "./pages/admin/AdminPurchases";
import AdminSellers from "./pages/admin/AdminSellers";

function App() {
  const { isAuthChecking, initializeAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  const hideFooterPaths = [ROUTES.LOGIN, ROUTES.SIGNUP];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />

      {/*Admin Routes แยก Layout */}
      {isAdminRoute ? (
        <Routes>
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout>
                  <Routes>
                    <Route index element={<AdminPanel />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="sheets" element={<AdminSheets />} />
                    <Route path="purchases" element={<AdminPurchases />} />
                    <Route path="sellers" element={<AdminSellers />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      ) : (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/*Public Routes*/}
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
              <Route path="/sheets/:id" element={<SheetDetailPage />} />
              <Route path="/become-seller" element={<BecomeSellerPage />} />

              {/*Protected Routes - Require Login*/}
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

              {/*Seller Routes - Require SELLER */}
              <Route
                path="/seller/profile"
                element={
                  <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]}>
                    <SellerProfilePage />
                  </ProtectedRoute>
                }
              />

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

              <Route
                path="/seller/sheets/create"
                element={
                  <ProtectedRoute allowedRoles={["SELLER", "ADMIN"]}>
                    <CreateSheetPage />
                  </ProtectedRoute>
                }
              />

              {/*404 - Redirect to Home */}
              <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
            </Routes>
          </main>

          {!shouldHideFooter && <Footer />}
        </div>
      )}
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
