import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faMoneyBillWave,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../ui/button";
import { apiFetch } from "../../../services/api";
import useAuth from "../../../hooks/useAuth";

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

const PaymentModal = ({ selectedRegistration, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { auth } = useAuth();
  const user = auth?.user;

  if (!selectedRegistration || !isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    const res = await loadRazorpayScript();
    if (!res) {
      setError("Failed to load Razorpay SDK. Please try again.");
      setLoading(false);
      return;
    }
    try {
      // Create order on backend
      const orderData = await apiFetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedRegistration.fee, // in paise
          registrationId: selectedRegistration.id, // use id, not _id
          eventName: selectedRegistration.eventName,
          phone: user?.phone,
          name: user?.full_name || user?.username,
          email: user?.email,
        }),
      });
      if (!orderData.order || !orderData.order.id)
        throw new Error(orderData.message || "Order creation failed");
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "SCERS Event Registration",
        description: `Payment for ${selectedRegistration.eventName}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          setLoading(true);
          // Verify payment on backend
          try {
            const verifyData = await apiFetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                registrationId: selectedRegistration.id, // use id, not _id
              }),
            });
            if (verifyData.success) {
              setSuccess(true);
              setError("");
            } else {
              setError(verifyData.message || "Payment verification failed");
            }
          } catch (err) {
            setError(err.message || "Payment verification failed");
          }
          setLoading(false);
        },
        prefill: {
          name: user?.full_name || user?.username,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };
      setLoading(false);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faCreditCard} className="text-pink-400" />
          Pay for {selectedRegistration.eventName}
        </h2>
        <p className="mb-4 text-lg text-gray-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-400" />
          Registration Fee: ₹{selectedRegistration.fee.toFixed(2)}
        </p>
        {error && (
          <div className="mb-4 text-red-600 flex items-center gap-2 animate-shake">
            <FontAwesomeIcon icon={faExclamationCircle} /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-600 flex items-center gap-2 animate-fade-in">
            <FontAwesomeIcon icon={faCheckCircle} /> Payment successful!
          </div>
        )}
        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-blue-50 hover:text-blue-600"
            disabled={loading}
          >
            Close
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform flex items-center gap-2"
            onClick={handlePayment}
            disabled={loading || success}
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            ) : (
              <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
            )}
            {success ? "Paid" : "Pay Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
