import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faUser,
  faEnvelope,
  faPhone,
  faVenusMars,
  faBirthdayCake,
  faCheckCircle,
  faTimesCircle,
  faCalendarAlt,
  faMoneyBillWave,
  faCrown,
  faExclamationCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../services/api";
import Badge from "../ui/badge";
import Skeleton from "../ui/skeleton";

const MembershipTab = ({ userId }) => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    apiFetch(`/api/club/membership/${userId}`)
      .then((res) => {
        if (Array.isArray(res)) {
          setMemberships(res);
        } else if (res && typeof res === "object") {
          setMemberships([res]);
        } else {
          setMemberships([]);
        }
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch memberships:", err);
        // Provide more specific error messages
        if (err.message?.includes("404")) {
          setError("No memberships found for this user.");
        } else if (err.message?.includes("500")) {
          setError(
            "Server error while fetching memberships. Please try again later."
          );
        } else if (err.message?.includes("Failed to fetch")) {
          setError(
            "Network error. Please check your connection and try again."
          );
        } else {
          setError("Failed to load memberships. Please try again.");
        }
        setMemberships([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-2xl border border-blue-100/50 animate-fade-in-up">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
          <div
            className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-white text-xl animate-spin"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Loading Memberships</h1>
              <p className="text-blue-100 text-sm">
                Please wait while we fetch your membership details
              </p>
            </div>
          </div>
        </div>

        <div className="relative p-6">
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 animate-pulse"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-pink-50 rounded-2xl shadow-2xl border border-red-100/50 animate-fade-in-up">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-pink-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-white text-xl"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Error Loading Memberships</h1>
              <p className="text-red-100 text-sm">
                We encountered an issue while fetching your data
              </p>
            </div>
          </div>
        </div>

        <div className="relative p-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-4xl text-red-400"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Unable to Load Memberships
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!memberships.length) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-2xl border border-blue-100/50 animate-fade-in-up">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <FontAwesomeIcon icon={faIdCard} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Club Memberships</h1>
              <p className="text-blue-100 text-sm">
                Your skating club membership details
              </p>
            </div>
          </div>
        </div>

        <div className="relative p-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FontAwesomeIcon
                icon={faIdCard}
                className="text-4xl text-blue-400"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              No Active Memberships
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You don't have any active club memberships yet. Join our skating
              classes to become a member and unlock exclusive benefits!
            </p>
            {/* Button to join classes */}
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              {/* Take user to /joinacademy */}
              <Link to="/joinacademy">Join Classes</Link>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-2xl border border-blue-100/50 animate-fade-in-up">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div
          className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
            <FontAwesomeIcon icon={faIdCard} className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Club Memberships</h1>
            <p className="text-blue-100 text-sm">
              Your active skating club memberships
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-6">
        <div className="grid gap-6 max-w-4xl mx-auto">
          {memberships.map((membership, index) => (
            <MembershipCard
              key={membership.id}
              membership={membership}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Individual Membership Card Component
const MembershipCard = ({ membership, index }) => {
  const isActive = membership.status === "success";

  return (
    <div
      className={`relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border transition-all duration-300 hover:scale-[1.02] animate-fade-in-up ${
        isActive
          ? "border-green-200 hover:border-green-300"
          : "border-red-200 hover:border-red-300"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Status Banner */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isActive
            ? "bg-gradient-to-r from-green-400 to-green-600"
            : "bg-gradient-to-r from-red-400 to-red-600"
        }`}
      ></div>

      {/* Premium Badge */}
      <div className="absolute top-4 right-4">
        <Badge
          className={`${
            isActive
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-md"
              : "bg-gradient-to-r from-red-500 to-red-600 text-white border-none shadow-md"
          }`}
        >
          <FontAwesomeIcon
            icon={isActive ? faCheckCircle : faTimesCircle}
            className="mr-2"
          />
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="p-8">
        {/* Avatar and Name Section */}
        <div className="flex items-center space-x-6 mb-8">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${
              isActive
                ? "bg-gradient-to-br from-green-400 to-green-600"
                : "bg-gradient-to-br from-red-400 to-red-600"
            }`}
          >
            <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <FontAwesomeIcon
                icon={faCrown}
                className="text-yellow-500 text-lg"
              />
              <h3 className="text-2xl font-bold text-gray-800">
                {membership.full_name}
              </h3>
            </div>
            <p className="text-gray-600 font-medium">Club Member</p>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Contact Details
            </h4>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-white text-sm"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Email Address
                  </p>
                  <p className="font-medium text-gray-800 break-all">
                    {membership.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-white text-sm"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Phone Number
                  </p>
                  <p className="font-medium text-gray-800">
                    {membership.phone_number}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Personal Info
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-100">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <FontAwesomeIcon
                      icon={faVenusMars}
                      className="text-white text-xs"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Gender
                  </p>
                  <p className="font-medium text-gray-800">
                    {membership.gender}
                  </p>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-100">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <FontAwesomeIcon
                      icon={faBirthdayCake}
                      className="text-white text-xs"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Age
                  </p>
                  <p className="font-medium text-gray-800">
                    {membership.age} years
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Details */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Membership Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-white text-sm"
                />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Issue Date
              </p>
              <p className="font-medium text-gray-800">
                {membership.issue_date
                  ? new Date(membership.issue_date).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "Not Set"}
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-red-100 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-white text-sm"
                />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Expiry Date
              </p>
              <p className="font-medium text-gray-800">
                {membership.end_date
                  ? new Date(membership.end_date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Not Set"}
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-100 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  className="text-white text-sm"
                />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Amount Paid
              </p>
              <p className="font-bold text-green-600 text-lg">
                ₹{membership.amount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipTab;
