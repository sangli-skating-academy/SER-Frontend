// Profile to be added
import React from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Profile() {
  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Profile Page
          </h1>
          <p className="text-gray-600">This is the profile page content.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
