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
        if (res) {
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

  const handleSubmit = async (razorpay_order_id, razorpay_payment_id) => {
    setSubmitting(true);
    setError("");
    try {
      // Calculate issue and end date
      const issue_date = new Date().toISOString().slice(0, 10);
      const end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const payload = {
        ...form,
        user_id: user?.id,
        razorpay_order_id,
        razorpay_payment_id,
        status: "success",
        issue_date,
        end_date,
      };
      const res = await apiFetch("/api/club/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.registration) {
        setSuccess(true);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8 mt-8">
          <div className="mb-4">
            <button
              type="button"
              className="flex items-center gap-2 text-blue-600 hover:underline"
              onClick={() => navigate(-1)}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
            Join Academy / Classes
          </h2>
          {error && (
            <div className="text-red-600 mb-4 text-center">{error}</div>
          )}
          {success ? (
            <div className="text-green-700 text-center font-bold text-lg">
              Registration successful!
              <br />
              Payment ID: {paymentId}
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handlePayment}>
              <Input
                label="Full Name*"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                placeholder="Enter Student full name"
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
              />
              <Input
                label="Email*"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                type="email"
              />
              <Input
                label="Age*"
                name="age"
                value={form.age}
                onChange={handleChange}
                required
                placeholder="Enter your age"
                type="number"
                min={1}
              />
              <div>
                <label className="block text-sm font-semibold mb-1 text-black">
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                label="Fees (₹)"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                type="number"
                min={0}
                disabled
              />
              {!isLoggedIn ? (
                <Button
                  type="button"
                  className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform w-full"
                  onClick={() => setShowLoginModal(true)}
                >
                  Login First
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform w-full"
                  disabled={submitting || paymentSuccess}
                >
                  {submitting ? "Processing..." : "Pay & Register"}
                </Button>
              )}
            </form>
          )}
        </div>
      </div>
      <Footer />
      {showMembershipModal && membershipInfo && (
        <Modal onClose={() => setShowMembershipModal(false)}>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              You have an active membership!
            </h3>
            <div className="mb-4 text-gray-700">
              Your membership expires on{" "}
              <span className="font-semibold text-pink-600">
                {membershipInfo.end_date
                  ? new Date(membershipInfo.end_date).toLocaleDateString()
                  : "-"}
              </span>{" "}
              <span>
                for student{" "}
                <span className="font-bold text-blue-400">
                  {membershipInfo.full_name}
                </span>
              </span>
            </div>
            <div className="flex gap-4 justify-center mt-6 flex-col">
              <Button
                type="button"
                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform"
                onClick={() => {
                  setShowMembershipModal(false);
                  navigate("/dashboard");
                }}
              >
                Go to Dashboard
              </Button>
              <Button
                type="button"
                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform"
                onClick={() => {
                  setShowMembershipModal(false);
                  navigate("/joinacademy");
                }}
              >
                Join for another student
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
