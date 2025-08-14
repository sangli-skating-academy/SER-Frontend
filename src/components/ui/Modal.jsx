import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-2 sm:px-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in mx-2 sm:mx-0">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
