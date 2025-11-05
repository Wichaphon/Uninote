import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaIdCard } from "react-icons/fa";
import { ROUTES } from "../constants";
import { authService } from "../services/authService";
import { toast } from "react-hot-toast";
import "../index.css";

function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [shakeFields, setShakeFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFieldErrors({ ...fieldErrors, [field]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      firstName: formData.firstName ? "" : "First name is required",
      lastName: formData.lastName ? "" : "Last name is required",
      email: !formData.email
        ? "Email is required"
        : !validateEmail(formData.email)
        ? "Please enter a valid email address"
        : "",
      password: !formData.password
        ? "Password is required"
        : formData.password.length < 6
        ? "Password must be at least 6 characters"
        : "",
    };

    setFieldErrors(errors);
    setShakeFields({
      firstName: !!errors.firstName,
      lastName: !!errors.lastName,
      email: !!errors.email,
      password: !!errors.password,
    });

    // reset การสั่นหลัง 500ms ทุกครั้ง เพื่อให้สั่นได้รอบต่อไป
    setTimeout(() => {
      setShakeFields({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
      });
    }, 500);

    if (Object.values(errors).some((e) => e)) return;

    setIsLoading(true);
    try {
      await authService.register(formData);
      toast.success("Registration successful! Please login");
      setTimeout(() => navigate(ROUTES.LOGIN), 50);
    } catch (err) {
      const backendError = err.response?.data?.error || "Registration failed";

      if (backendError.toLowerCase().includes("email")) {
        setFieldErrors((prev) => ({ ...prev, email: backendError }));
        setShakeFields((prev) => ({ ...prev, email: true }));

        setTimeout(() => {
          setShakeFields((prev) => ({ ...prev, email: false }));
        }, 500);
      }

      toast.error(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f9f9f9]">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center text-[#646cff] mb-8">Sign Up</h2>
        <p className="text-base text-center text-gray-500 mb-8">
          Create your new account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <div
              className={`flex items-center border rounded-lg px-4 py-3 transition ${
                fieldErrors.firstName ? "border-red-500" : "border-gray-300"
              } focus-within:ring-2 ${
                fieldErrors.firstName
                  ? "focus-within:ring-red-500"
                  : "focus-within:ring-[#646cff]"
              } ${shakeFields.firstName ? "animate-shake" : ""}`}
            >
              <FaIdCard className="text-gray-400 mr-3" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full focus:outline-none placeholder-gray-400"
                placeholder="First Name"
              />
            </div>
            {fieldErrors.firstName && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <div
              className={`flex items-center border rounded-lg px-4 py-3 transition ${
                fieldErrors.lastName ? "border-red-500" : "border-gray-300"
              } focus-within:ring-2 ${
                fieldErrors.lastName
                  ? "focus-within:ring-red-500"
                  : "focus-within:ring-[#646cff]"
              } ${shakeFields.lastName ? "animate-shake" : ""}`}
            >
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full focus:outline-none placeholder-gray-400"
                placeholder="Last Name"
              />
            </div>
            {fieldErrors.lastName && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
            )}
          </div>

          {/* Email */}
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
              <FaEnvelope className="text-gray-400 mr-3" />
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

          {/* Password */}
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
              <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#646cff] text-white py-3 rounded-lg font-medium hover:bg-[#4c56d9] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="text-[#646cff] hover:underline font-medium cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
export default SignUpPage;
