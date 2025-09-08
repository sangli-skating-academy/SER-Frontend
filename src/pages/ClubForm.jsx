// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import useAuth from "../hooks/useAuth";
import LoginModal from "../components/auth/LoginModal";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import Modal from "../components/ui/Modal";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

const FEE_AMOUNT = 500; // You can set this dynamically if needed

export default function ClubForm() {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const { auth } = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    phone_number: user?.phone || "",
    email: user?.email || "",
    age: "",
    gender: "",
    amount: FEE_AMOUNT,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [paymentId, setPaymentId] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasMembership, setHasMembership] = useState(false);
  const [membershipInfo, setMembershipInfo] = useState(null);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!user?.id) return;
    apiFetch(`/api/club/membership/${user.id}`)
      .then((res) => {
        // Check if res is an array with length > 0
        if (res && Array.isArray(res) && res.length > 0) {
          setHasMembership(true);
          setMembershipInfo(res);
          setShowMembershipModal(true);
        } else {
          setHasMembership(false);
          setMembershipInfo(null);
          setShowMembershipModal(false);
        }
      })
      .catch(() => {
        setHasMembership(false);
        setMembershipInfo(null);
        setShowMembershipModal(false);
      });
  }, [user]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    setPaymentSuccess(false);
    const res = await loadRazorpayScript();
    if (!res) {
      setError("Failed to load Razorpay SDK. Please try again.");
      setSubmitting(false);
      return;
    }
    try {
      // Create order on backend (club/class)
      const orderData = await apiFetch("/api/club/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: form.amount,
          name: form.full_name,
          email: form.email,
          phone: form.phone_number,
          receipt: `club_${Date.now()}`,
        }),
      });
      if (!orderData.order || !orderData.order.id)
        throw new Error("Order creation failed");
      setRazorpayOrder(orderData.order);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Sai Skating Academy",
        description: "Club/Class Registration Fee",
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            // First, submit registration to DB
            const issue_date = new Date().toISOString().slice(0, 10);
            const end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10);
            const payload = {
              ...form,
              user_id: user?.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              status: "success",
              issue_date,
              end_date,
            };
            // Register for class, get registrationId
            const regRes = await apiFetch("/api/club/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const registrationId = regRes?.registration?.id;
            if (!registrationId) throw new Error("Registration failed");
            // Now verify payment
            const verifyData = await apiFetch("/api/club/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                registrationId,
              }),
            });
            if (verifyData.success || verifyData.status === "success") {
              setPaymentSuccess(true);
              setPaymentId(response.razorpay_payment_id);
              setSuccess(true);
            } else {
              setError(verifyData.message || "Payment verification failed");
            }
          } catch (err) {
            setError(err.message || "Payment verification failed");
          }
          setSubmitting(false);
        },
        prefill: {
          name: form.full_name,
          email: form.email,
          contact: form.phone_number,
        },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      };
      setSubmitting(false);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
      setSubmitting(false);
    }
  };

  // Show login modal if needed
  {
    showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />;
  }

  // After successful payment and registration
  useEffect(() => {
    if (success) {
      navigate("/dashboard");
    }
  }, [success, navigate]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 right-1/3 w-36 h-36 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <div className="mb-6">
              <button
                type="button"
                className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                onClick={() => navigate(-1)}
              >
                <div className="p-1 rounded-full bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-md transition-all duration-200">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="transition-transform group-hover:-translate-x-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
                Back
              </button>
            </div>

            {/* Main Form Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 relative">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Join Academy
                </h2>
                <p className="text-slate-600">
                  Start your skating journey with us
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-red-500">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Success State */}
              {success ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    Registration Successful!
                  </h3>
                  <div className="space-y-2">
                    <p className="text-slate-600">Welcome to the academy!</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-sm text-green-600">
                        Payment ID:
                      </span>
                      <span className="text-sm font-mono text-green-700">
                        {paymentId}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form className="space-y-6" onSubmit={handlePayment}>
                  {/* Form Fields */}
                  <div className="space-y-5">
                    <Input
                      label="Full Name*"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter student's full name"
                      className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />

                    <Input
                      label="Phone Number*"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                      type="tel"
                      pattern="[0-9]{10,}"
                      className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />

                    <Input
                      label="Email*"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      type="email"
                      className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Age*"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        required
                        placeholder="Age"
                        type="number"
                        min={1}
                        className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />

                      <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700">
                          Gender*
                        </label>
                        <Select
                          name="gender"
                          value={form.gender}
                          onValueChange={(val) =>
                            setForm((f) => ({ ...f, gender: val }))
                          }
                          required
                        >
                          <SelectTrigger className="bg-white/50 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Fees Display */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Registration Fees
                          </label>
                          <p className="text-xs text-slate-500">
                            Monthly subscription
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                            ₹{form.amount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    {!isLoggedIn ? (
                      <Button
                        type="button"
                        className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-blue-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        onClick={() => setShowLoginModal(true)}
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Login to Continue
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-blue-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={submitting || paymentSuccess}
                      >
                        {submitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                            Pay & Register
                          </div>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Enhanced Membership Modal */}
      {showMembershipModal &&
        membershipInfo &&
        Array.isArray(membershipInfo) && (
          <Modal onClose={() => setShowMembershipModal(false)}>
            <div className="p-8 text-center">
              {/* Modal Header */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Active Memberships Found!
              </h3>
              <p className="text-slate-600 mb-6">
                You already have active memberships
              </p>

              {/* Membership Cards */}
              <div className="space-y-4 mb-8">
                {membershipInfo
                  .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))
                  .map((membership, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <p className="font-semibold text-slate-800">
                            {membership.full_name}
                          </p>
                          <p className="text-sm text-slate-600">
                            Expires:{" "}
                            {membership.end_date
                              ? new Date(
                                  membership.end_date
                                ).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                          Active
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    setShowMembershipModal(false);
                    navigate("/dashboard");
                  }}
                >
                  Go to Dashboard
                </Button>
                <Button
                  type="button"
                  className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                  onClick={() => {
                    setShowMembershipModal(false);
                    navigate("/joinacademy");
                  }}
                >
                  Enroll Another Student
                </Button>
              </div>
            </div>
          </Modal>
        )}
    </>
  );
}
