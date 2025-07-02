import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../ui/button";

const PaymentModal = ({ selectedRegistration, isOpen, onClose }) => {
  if (!selectedRegistration || !isOpen) return null;
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
        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            Close
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform"
            disabled
          >
            <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Pay (Coming
            Soon)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
