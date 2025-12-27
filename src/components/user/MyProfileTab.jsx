import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faUser,
  faEdit,
  faSave,
  faTimes,
  faUserCircle,
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Badge from "../ui/badge";
import Button from "../ui/button";

const MyProfileTab = ({
  user,
  profileEditMode,
  profileEdit,
  profileLoading,
  profileError,
  handleProfileEditClick,
  handleProfileEditChange,
  handleProfileSave,
  setProfileEditMode,
}) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-pink-50 rounded-2xl shadow-2xl border border-blue-100/50 animate-fade-in-up mb-30">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
      <div
        className="absolute -top-4 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>

    {/* Header Section */}
    <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 p-8 text-white">
      <div className="flex flex-col items-center space-y-4">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-4xl font-bold shadow-2xl">
            {user.username
              ? user.username
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : user.username?.slice(0, 2).toUpperCase() || "U"}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
            <FontAwesomeIcon icon={faCheck} className="text-white text-sm" />
          </div>
        </div>

        {/* Name */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">{user.username || "User"}</h1>
          <p className="text-blue-100 text-sm">Skating Academy Member</p>
        </div>
      </div>

      {/* Edit Toggle Button */}
      <button
        onClick={handleProfileEditClick}
        disabled={profileEditMode}
        className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 disabled:opacity-50"
      >
        <FontAwesomeIcon
          icon={profileEditMode ? faTimes : faEdit}
          className="text-lg"
        />
      </button>
    </div>

    {/* Content Section */}
    <div className="relative p-8">
      {profileEditMode ? (
        /* Edit Mode */
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleProfileSave();
          }}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Edit Profile
            </h2>
            <p className="text-gray-500 text-sm">
              Update your personal information
            </p>
          </div>
          {/* Error Alert */}
          {profileError && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 animate-fade-in">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="text-red-500 text-xl"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-1">
                    {profileError.includes("email") ||
                    profileError.includes("Email")
                      ? "Email Already Exists"
                      : profileError.includes("username") ||
                        profileError.includes("Username")
                      ? "Username Already Taken"
                      : "Update Failed"}
                  </h3>
                  <p className="text-sm text-red-700">{profileError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Username Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
                Username
              </label>
              <div className="relative">
                <input
                  name="username"
                  value={profileEdit.username}
                  onChange={handleProfileEditChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  placeholder="Enter your username"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className="text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mr-2 text-green-500"
                />
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={profileEdit.email}
                  onChange={handleProfileEditChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                    profileError &&
                    (profileError.includes("email") ||
                      profileError.includes("Email"))
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Enter your email address"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className={
                      profileError &&
                      (profileError.includes("email") ||
                        profileError.includes("Email"))
                        ? "text-red-400"
                        : "text-gray-400"
                    }
                  />
                </div>
              </div>
              {profileError &&
                (profileError.includes("email") ||
                  profileError.includes("Email")) && (
                  <p className="text-xs text-red-600 mt-1 ml-1 animate-fade-in">
                    This email address is already registered. Please use a
                    different email.
                  </p>
                )}
            </div>

            {/* Phone Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="mr-2 text-purple-500"
                />
                Phone Number
              </label>
              <div className="relative">
                <input
                  name="phone"
                  type="tel"
                  value={profileEdit.phone}
                  onChange={handleProfileEditChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                    profileError &&
                    (profileError.includes("phone") ||
                      profileError.includes("Phone"))
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className={
                      profileError &&
                      (profileError.includes("phone") ||
                        profileError.includes("Phone"))
                        ? "text-red-400"
                        : "text-gray-400"
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Enter 10-digit phone number
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              onClick={() => setProfileEditMode(false)}
              type="button"
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={profileLoading}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              <FontAwesomeIcon
                icon={profileLoading ? faUserCircle : faSave}
                className={`mr-2 ${profileLoading ? "animate-spin" : ""}`}
              />
              {profileLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Profile Information
            </h2>
            <p className="text-gray-500 text-sm">
              Your personal details and contact information
            </p>
          </div>

          <div className="grid gap-6">
            {/* Username */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-white text-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Username
                  </h3>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.username || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-white text-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Email Address
                  </h3>
                  <p className="text-lg font-semibold text-gray-800 break-all">
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-white text-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Phone Number
                  </h3>
                  <p className="text-lg font-semibold text-gray-800">
                    {user.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleProfileEditClick}
              disabled={profileEditMode}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default MyProfileTab;
