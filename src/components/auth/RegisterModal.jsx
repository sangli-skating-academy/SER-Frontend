import { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { API_BASE_URL } from "../../utils/apiConfig";
import Dialog, {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import Button from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserTag,
  faEnvelope,
  faLock,
  faCheckCircle,
  faUserShield,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";

const RegisterModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  // Register form
  const form = useForm({
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      date_of_birth: "",
      gender: "",
      role: "player",
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    setError("");
    if (!data.terms) {
      setError("You must accept the Terms & Conditions.");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          full_name: data.fullName,
          email: data.email,
          password: data.password,
          phone: data.phone,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          role: data.role,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Registration failed");
        setIsLoading(false);
        return;
      }
      const { token } = await res.json();
      login(token);
      onClose();
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-gradient-to-br from-blue-100/80 via-white/80 to-blue-200/80 backdrop-blur-sm">
        <div className="relative bg-white/90 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4 border border-gray-200 animate-fade-in max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-lg animate-gradient-x flex items-center justify-center gap-2">
              <FontAwesomeIcon
                icon={faUserShield}
                className="mr-2 text-blue-400 animate-bounce"
              />
              Create an Account
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mb-4 text-sm sm:text-base">
              Join our skating community to register for events and more
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="text-red-600 text-center mb-2 animate-fade-in">
              {error}
            </div>
          )}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5 mt-2"
          >
            {/* Full Name */}
            <div className="relative group">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
              />
              <input
                {...form.register("fullName")}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
            {/* Username */}
            <div className="relative group">
              <FontAwesomeIcon
                icon={faUserTag}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
              />
              <input
                {...form.register("username")}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
            {/* Email */}
            <div className="relative group">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
              />
              <input
                {...form.register("email")}
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
            {/* Password */}
            <div className="relative group">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
              />
              <input
                {...form.register("password")}
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
            {/* Confirm Password */}
            <div className="relative group">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
              />
              <input
                {...form.register("confirmPassword")}
                type="password"
                placeholder="Confirm Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
            {/* Phone Number */}
            <div className="relative group">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
              />
              <input
                {...form.register("phone")}
                placeholder="Phone Number"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
            {/* Date of Birth */}
            <div className="relative group">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
              />
              <input
                {...form.register("date_of_birth")}
                type="date"
                placeholder="Date of Birth"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
              />
            </div>
            {/* Gender Selection */}
            <div className="relative group">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600 transition-colors"
              />
              <select
                {...form.register("gender")}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:shadow-lg transition-all placeholder:text-gray-400 text-sm sm:text-base"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* Role Selection */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in">
              <label className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform text-sm sm:text-base">
                <input
                  type="radio"
                  name="role"
                  value="player"
                  checked={form.watch("role") === "player"}
                  onChange={() => form.setValue("role", "player")}
                  className="appearance-none w-4 h-4 rounded-full bg-white checked:bg-blue-500 transition-all duration-200"
                />
                <span className="relative -ml-5 mr-1">
                  <span
                    className={`block w-4 h-4 rounded-full ${
                      form.watch("role") === "player"
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
                  checked={form.watch("role") === "coach"}
                  onChange={() => form.setValue("role", "coach")}
                  className="appearance-none w-4 h-4 rounded-full bg-white  transition-all duration-200"
                />
                <span className="relative -ml-5 mr-1">
                  <span
                    className={`block w-4 h-4 rounded-full ${
                      form.watch("role") === "coach"
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
            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2 mt-2 sm:mt-4 animate-fade-in">
              <input
                type="checkbox"
                checked={form.watch("terms")}
                onChange={(e) => form.setValue("terms", e.target.checked)}
                className="mt-1 accent-blue-600 focus:ring-2 focus:ring-blue-600 transition-all"
              />
              <span className="text-xs sm:text-sm text-gray-600">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline transition-colors"
                >
                  Terms & Conditions
                </a>{" "}
                and acknowledge the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:underline transition-colors"
                >
                  Privacy Policy
                </a>
              </span>
            </div>
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg hover:from-blue-400 hover:to-blue-600 font-semibold text-center shadow-lg flex items-center justify-center gap-2 transition-all animate-fade-in disabled:opacity-60 disabled:cursor-not-allowed text-base sm:text-lg cursor-pointer"
              disabled={isLoading}
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                className={isLoading ? "animate-spin" : "animate-bounce"}
              />
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default RegisterModal;
