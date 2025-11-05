import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import useAuthStore from "../store/useAuthStore";
import { ROUTES } from "../constants";
import "../index.css"; 

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, fetchProfile, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [shakeFields, setShakeFields] = useState({ email: false, password: false });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFieldErrors({ ...fieldErrors, [field]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      email: !formData.email
        ? "Email is required"
        : !validateEmail(formData.email)
        ? "Please enter a valid email address"
        : "",
      password: formData.password ? "" : "Password is required",
    };
    setFieldErrors(errors);

    setShakeFields({
      email: !!errors.email,
      password: !!errors.password,
    });
    setTimeout(() => setShakeFields({ email: false, password: false }), 500);

    if (errors.email || errors.password) return;

    try {
      await login(formData.email, formData.password);
      await fetchProfile();
      const from = location.state?.from?.pathname || ROUTES.HOME;
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center text-[#646cff] mb-8">
          Login
        </h2>
        <p className="text-base text-center text-gray-500 mb-8">
          Access your account
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6 text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <div
              className={`flex items-center border rounded-lg px-4 py-3 transition ${
                fieldErrors.email ? "border-red-500" : "border-gray-300"
              } focus-within:ring-2 ${
                fieldErrors.email
                  ? "focus-within:ring-red-500"
                  : "focus-within:ring-[#646cff]"
              } ${shakeFields.email ? "animate-shake" : ""}`}
            >
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text" 
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full focus:outline-none placeholder-gray-400"
                placeholder="Email Address"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/*Password Input*/}
          <div>
            <div
              className={`flex items-center border rounded-lg px-4 py-3 transition ${
                fieldErrors.password ? "border-red-500" : "border-gray-300"
              } focus-within:ring-2 ${
                fieldErrors.password
                  ? "focus-within:ring-red-500"
                  : "focus-within:ring-[#646cff]"
              } ${shakeFields.password ? "animate-shake" : ""}`}
            >
              <FaLock className="text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full focus:outline-none placeholder-gray-400"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 ml-2 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/*Submit Button*/}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#646cff] text-white py-3 rounded-lg font-medium hover:bg-[#4c56d9] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate(ROUTES.SIGNUP)}
            className="text-[#646cff] hover:underline font-medium cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
