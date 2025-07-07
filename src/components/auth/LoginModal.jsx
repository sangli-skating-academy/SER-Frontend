import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import useAuth from "../../hooks/useAuth";
import Button from "../ui/button";
import Input from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faUserPlus,
  faUser,
  faUserTag,
  faEnvelope,
  faLock,
  faUserShield,
  faUserFriends,
  faCheckCircle,
  faExclamationCircle,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

const LoginModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  // const { login } = useAuth();

  // Reset loading and error state when modal is closed
  const handleClose = () => {
    setIsLoading(false);
    setError("");
    onClose();
  };

  // Optionally, reset loading/error when switching tabs
  useEffect(() => {
    setIsLoading(false);
    setError("");
  }, [activeTab]);

  // Login form validation schema
  const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Register form validation schema
  const registerSchema = yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().matches(/^\d{10}$/, "Phone must be exactly 10 digits"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: yup
      .string()
      .oneOf(["player", "coach"], "Select a role")
      .required("Role is required"),
  });

  // Login form
  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
  });

  // Register form (updated to match RegisterModal)
  const registerForm = useForm({
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      role: "player",
    },
    resolver: yupResolver(registerSchema),
  });

  const onLoginSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Ensure cookies are sent
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Login failed");
        setIsLoading(false);
        return;
      }
      // No need to extract token or call login(token) since auth is now cookie-based
      window.location.reload(); // Reload to update auth state everywhere
      onClose();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Ensure cookies are sent
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: data.role,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Registration failed");
        setIsLoading(false);
        return;
      }
      // No need to extract token or call login(token) since auth is now cookie-based
      window.location.reload(); // Reload to update auth state everywhere
      onClose();
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for all inputs to suppress browser validation
  const suppressInvalid = (e) => e.preventDefault();

  // Helper for error display
  const renderFieldError = (errorMsg) =>
    errorMsg ? (
      <div className="flex items-center gap-1 mt-1 text-xs text-red-600 font-semibold animate-fade-in">
        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400" />
        <span>{errorMsg}</span>
      </div>
    ) : (
      <span className="block min-h-[1.2em] text-xs text-transparent">
        &nbsp;
      </span>
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
      {/* Overlay - now clickable to close modal */}
      <div
        className="fixed inset-0 bg-black/80 z-40"
        aria-label="Close modal overlay"
        onClick={handleClose}
      />
      {/* Modal Content */}
      <div
        className="relative z-50 w-full max-w-xs sm:max-w-sm md:max-w-md min-w-0 box-border mx-auto animate-fade-in max-h-[90vh] overflow-y-auto overflow-x-hidden p-2 sm:p-4 bg-white rounded-lg shadow-lg border border-blue-200"
        style={{ overscrollBehavior: "contain" }}
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing when clicking inside modal
      >
        {/* Close Button */}
        <button
          className="absolute right-2 top-2 sm:right-4 sm:top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-400 z-20"
          onClick={handleClose}
          aria-label="Close"
          type="button"
        >
          <svg
            className="h-5 w-5 text-blue-400"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
        {/* Background Accent Blur Circle */}
        <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-blue-600 to-blue-400 opacity-20 rounded-full blur-2xl animate-pulse pointer-events-none select-none" />

        {/* Title */}
        <div className="text-2xl sm:text-3xl font-extrabold text-center mb-2 text-blue-600 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faUserShield} className="text-blue-400" />
          {activeTab === "login" ? "Login" : "Sign Up"}
        </div>

        {/* Description */}
        <div className="text-center text-gray-600 mb-6 text-sm sm:text-base">
          {activeTab === "login"
            ? "Sign in to access your registrations and participate in events"
            : "Join our skating community to register for events and more"}
        </div>

        {/* Tabs */}
        <div className="flex w-full mb-6 border-b">
          <button
            className={`flex-1 py-2 font-semibold rounded-t-lg transition-all duration-200 text-sm sm:text-base ${
              activeTab === "login"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-600/10 shadow"
                : "hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("login")}
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold rounded-t-lg transition-all duration-200 text-sm sm:text-base ${
              activeTab === "register"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-600/10 shadow"
                : "hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("register")}
          >
            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" ? (
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className="space-y-4 sm:space-y-5 animate-fade-in"
          >
            {/* Email */}
            <div className="mb-2">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative group">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 text-lg transition-colors group-focus-within:text-blue-600 pointer-events-none"
                />
                <Input
                  id="login-email"
                  {...loginForm.register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="w-full min-w-0 pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
                />
              </div>
              <span className="block min-h-[1.2em] text-xs text-red-600 ml-2">
                {loginForm.formState.errors.email?.message || ""}
              </span>
            </div>

            {/* Password */}
            <div className="mb-2">
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative group">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 text-lg transition-colors group-focus-within:text-blue-600 pointer-events-none"
                />
                <Input
                  id="login-password"
                  {...loginForm.register("password")}
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full min-w-0 pl-10 pr-10 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  aria-label={
                    showLoginPassword ? "Hide password" : "Show password"
                  }
                >
                  <FontAwesomeIcon
                    icon={showLoginPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              <span className="block min-h-[1.2em] text-xs text-red-600 ml-2">
                {loginForm.formState.errors.password?.message || ""}
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-center mb-2 animate-fade-in">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-lg hover:from-blue-400 hover:to-blue-600 font-semibold text-center shadow-lg flex items-center justify-center gap-2 transition-all animate-fade-in disabled:opacity-60 disabled:cursor-not-allowed text-base sm:text-lg cursor-pointer"
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faSignInAlt} />
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* Switch to Register */}
            <div className="mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Don't have an account?
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 p-0 ml-1 font-semibold"
                  onClick={() => setActiveTab("register")}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                  Sign Up
                </Button>
              </p>
            </div>
          </form>
        ) : (
          // Registration Form (merged from RegisterModal)
          <form
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            className="space-y-4 sm:space-y-5 animate-fade-in"
          >
            {/* Username */}
            <div className="mb-2">
              <label
                htmlFor="register-username"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Username
              </label>
              <div className="relative group mb-2">
                <FontAwesomeIcon
                  icon={faUserTag}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors pointer-events-none"
                />
                <input
                  id="register-username"
                  {...registerForm.register("username")}
                  placeholder="Username"
                  className="w-full min-w-0 pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
                />
              </div>
              {renderFieldError(
                registerForm.formState.errors.username?.message
              )}
            </div>
            {/* Email */}
            <div className="mb-2">
              <label
                htmlFor="register-email"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative group">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors pointer-events-none"
                />
                <input
                  id="register-email"
                  {...registerForm.register("email")}
                  type="email"
                  placeholder="Email Address"
                  className="w-full min-w-0 pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
                />
              </div>
              {renderFieldError(registerForm.formState.errors.email?.message)}
            </div>
            {/* Phone Number */}
            <div className="mb-2">
              <label
                htmlFor="register-phone"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <div className="relative group">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors pointer-events-none"
                />
                <input
                  id="register-phone"
                  {...registerForm.register("phone")}
                  placeholder="Phone Number"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full min-w-0 pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
                />
              </div>
              {renderFieldError(registerForm.formState.errors.phone?.message)}
            </div>
            {/* Password */}
            <div className="mb-2">
              <label
                htmlFor="register-password"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative group">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors pointer-events-none"
                />
                <input
                  id="register-password"
                  {...registerForm.register("password")}
                  type={showRegPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full min-w-0 pl-10 pr-10 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none"
                  onClick={() => setShowRegPassword((v) => !v)}
                  aria-label={
                    showRegPassword ? "Hide password" : "Show password"
                  }
                >
                  <FontAwesomeIcon
                    icon={showRegPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              {renderFieldError(
                registerForm.formState.errors.password?.message
              )}
            </div>

            {/* Role Selection */}
            <div className="mb-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Role
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in w-full">
                <label className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform text-sm sm:text-base">
                  <input
                    type="radio"
                    name="role"
                    value="player"
                    checked={registerForm.watch("role") === "player"}
                    onChange={() => registerForm.setValue("role", "player")}
                    className="appearance-none w-4 h-4 rounded-full bg-white transition-all duration-200"
                  />
                  <span className="relative -ml-5 mr-1">
                    <span
                      className={`block w-4 h-4 rounded-full ${
                        registerForm.watch("role") === "player"
                          ? "bg-blue-500"
                          : "bg-white border border-blue-400"
                      }`}
                    ></span>
                  </span>
                  <FontAwesomeIcon
                    icon={faUserFriends}
                    className="text-blue-400"
                  />
                  <span>Parents/Students</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform text-sm sm:text-base">
                  <input
                    type="radio"
                    name="role"
                    value="coach"
                    checked={registerForm.watch("role") === "coach"}
                    onChange={() => registerForm.setValue("role", "coach")}
                    className="appearance-none w-4 h-4 rounded-full bg-white  transition-all duration-200"
                  />
                  <span className="relative -ml-5 mr-1">
                    <span
                      className={`block w-4 h-4 rounded-full ${
                        registerForm.watch("role") === "coach"
                          ? "bg-green-500"
                          : "bg-white border border-green-400"
                      }`}
                    ></span>
                  </span>
                  <FontAwesomeIcon
                    icon={faUserShield}
                    className="text-green-500"
                  />
                  <span>Coach</span>
                </label>
              </div>
              {renderFieldError(registerForm.formState.errors.role?.message)}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-center mb-2 animate-fade-in">
                {error}
              </div>
            )}
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg hover:from-blue-400 hover:to-blue-600 font-semibold text-center shadow-lg flex items-center justify-center gap-2 transition-all animate-fade-in disabled:opacity-60 disabled:cursor-not-allowed text-base sm:text-lg cursor-pointer"
              disabled={isLoading}
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                className={isLoading ? "animate-spin" : ""}
              />
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
            {/* Switch to Login */}
            <div className="mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Already have an account?
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 p-0 ml-1 font-semibold"
                  onClick={() => setActiveTab("login")}
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-1" />
                  Login
                </Button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
