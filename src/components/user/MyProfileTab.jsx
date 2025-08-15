import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import Badge from "../ui/badge";
import Button from "../ui/button";

const MyProfileTab = ({
  user,
  profileEditMode,
  profileEdit,
  profileLoading,
  handleProfileEditClick,
  handleProfileEditChange,
  handleProfileSave,
  setProfileEditMode,
}) => (
  <div className="shadow-2xl border-2 border-blue-900 bg-white/80 rounded-3xl animate-fade-in-up">
    <div className="flex flex-col items-center gap-2 pb-0 p-6">
      <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-200 via-pink-100 to-blue-100 flex items-center justify-center text-5xl font-extrabold text-blue-600 border-4 border-blue-300 mb-2 animate-fade-in-up shadow-lg">
        {user.username
          ? user.username
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
          : user.username?.slice(0, 2).toUpperCase() || "U"}
      </div>
    </div>
    <div className="p-6">
      <div className="grid gap-8 mt-2">
        {profileEditMode ? (
          <form
            className="space-y-4 max-w-xl mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              handleProfileSave();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Username
                </label>
                <input
                  name="username"
                  value={profileEdit.username}
                  onChange={handleProfileEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={profileEdit.email}
                  onChange={handleProfileEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={profileEdit.phone}
                  onChange={handleProfileEditChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => setProfileEditMode(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={profileLoading}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Save
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-blue-400 text-xl"
              />
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
                  Username
                </h3>
                <p className="font-medium text-gray-800">
                  {user.username || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-blue-400 text-xl"
              />
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
                  Email
                </h3>
                <p className="font-medium text-gray-800">
                  {user.email || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-blue-400 text-xl"
              />
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
                  Phone
                </h3>
                <p className="font-medium text-gray-800">
                  {user.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <Button
          variant="default"
          className="bg-gradient-to-r from-blue-400 to-pink-400 hover:from-pink-400 hover:to-blue-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform animate-fade-in-up"
          onClick={handleProfileEditClick}
          disabled={profileEditMode}
        >
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          {profileEditMode ? "Editing..." : "Edit Profile"}
        </Button>
      </div>
    </div>
  </div>
);

export default MyProfileTab;
