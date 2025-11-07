import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";
import LogoutModal from "../common/LogoutModal";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setShowDropdown(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
    toast.success("Successfully logged out! See you again soon.", {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#10b981",
        color: "#fff",
        fontWeight: "500",
      },
    });
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 text-2xl font-semibold text-indigo-600 hover:opacity-90 transition cursor-pointer shrink-0 group"
            >
              <img
                src="/box-svgrepo-com.svg"
                alt="logo"
                className="w-8 h-8 transition-transform duration-300 ease-in-out group-hover:rotate-360"
              />
              <span className="hidden sm:block">UniNote</span>
            </button>

            <form
              onSubmit={handleSearch}
              className="flex-1 hidden sm:block max-w-md lg:max-w-lg"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-[15px] mt-px">
              {!user || user.role === "USER" ? (
                <button
                  onClick={() => navigate(user ? "/become-seller" : "/signup")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                    isActive("/become-seller")
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Teach
                </button>
              ) : null}

              <button
                onClick={() => navigate("/explore")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                  isActive("/explore")
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Explore
              </button>

              {user && (
                <>
                  <button
                    onClick={() => navigate("/purchases")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                      isActive("/purchases")
                        ? "text-indigo-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    My Purchases
                  </button>

                  {(user.role === "SELLER" || user.role === "ADMIN") && (
                    <button
                      onClick={() => navigate("/seller")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                        isActive("/seller")
                          ? "text-indigo-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Dashboard
                    </button>
                  )}

                  {user.role === "ADMIN" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                        isActive("/admin")
                          ? "text-indigo-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Admin
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-60 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-200 bg-indigo-50 rounded-t-xl">
                        <p className="font-semibold text-gray-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full">
                          {user.role}
                        </span>
                      </div>

                      <div>
                        <button
                          onClick={() => handleNavigate("/profile")}
                          className="block w-full px-4 py-3 text-sm text-left text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                        >
                          My Profile
                        </button>

                        <button
                          onClick={() => handleNavigate("/settings")}
                          className="block w-full px-4 py-3 text-sm text-left text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                        >
                          Settings
                        </button>
                      </div>

                      {(user.role === "SELLER" || user.role === "ADMIN") && (
                        <div className="border-t border-gray-200">
                          <button
                            onClick={() => handleNavigate("/seller")}
                            className="block w-full px-4 py-3 text-sm text-left text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                          >
                            Dashboard
                          </button>
                          <button
                            onClick={() => handleNavigate("/seller/profile")}
                            className="block w-full px-4 py-3 text-sm text-left text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                          >
                            Shop Settings
                          </button>
                        </div>
                      )}

                      <div className="border-t border-gray-200">
                        <button
                          onClick={handleLogoutClick}
                          className="block w-full px-4 py-3 text-sm text-left text-red-600 font-medium hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

export default Navbar;