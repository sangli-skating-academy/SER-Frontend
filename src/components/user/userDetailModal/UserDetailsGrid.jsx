import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faVenusMars,
  faBirthdayCake,
  faClipboardList,
  faEdit,
  faCalendarAlt,
  faMapMarkerAlt,
  faFlag,
  faIdCard,
  faUserTie,
  faTimes,
  faSave,
  faSpinner,
  faFileImage,
} from "@fortawesome/free-solid-svg-icons";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Button from "../../ui/button";
import { apiFetch } from "../../../services/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import TeamDetails from "./TeamDetails";

const AadhaarPreviewModal = ({ aadhaarPreview, setAadhaarPreview }) => {
  if (!aadhaarPreview) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={() => setAadhaarPreview(null)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Aadhaar Document</h3>
          <button
            onClick={() => setAadhaarPreview(null)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
          </button>
        </div>
        {aadhaarPreview ? (
          <div className="w-full bg-gray-50 rounded-xl p-4 mb-4">
            <img
              src={aadhaarPreview}
              alt="Aadhaar Preview"
              className="max-h-[70vh] max-w-full rounded-lg shadow-lg mx-auto"
              onError={(e) => {
                console.error("Failed to load image:", e);
                e.target.style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
            <div className="text-center">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-3xl text-gray-400 animate-spin mb-2"
              />
              <span className="text-gray-500">Loading...</span>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          onClick={() => setAadhaarPreview(null)}
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          Close
        </Button>
      </motion.div>
    </motion.div>
  );
};

const UserDetailsGrid = ({
  userDetails,
  user,
  setAadhaarPreview,
  setIsDetailsModalOpen,
  backendUrl,
  selectedRegistration,
  setUserDetails,
}) => {
  const [aadhaarPreview, setLocalAadhaarPreview] = useState(null);
  const [aadhaarLoading, setAadhaarLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDetails, setEditDetails] = useState(userDetails);
  const [saving, setSaving] = useState(false);
  const [eventCategoryOptions, setEventCategoryOptions] = useState([]);
  const [skateCategoryOptions, setSkateCategoryOptions] = useState([]);

  // Update editDetails and fetch event/skate category options if missing
  React.useEffect(() => {
    setEditDetails(userDetails);
    // If options missing, fetch from event DB (assume userDetails.event_id available)
    async function fetchEventOptions() {
      if (userDetails.event_id) {
        try {
          const res = await apiFetch(`/api/events/${userDetails.event_id}`);
          // Event category
          let catOpts = [];
          if (res.event_category && typeof res.event_category === "object") {
            catOpts = Object.values(res.event_category).flat();
          }
          setEventCategoryOptions(catOpts);
          // Skate category
          let skateOpts = [];
          if (Array.isArray(res.skate_category)) {
            skateOpts = res.skate_category;
          }
          setSkateCategoryOptions(skateOpts);
        } catch (error) {
          console.error("Failed to fetch event options:", error);
        }
      }
    }
    if (
      !userDetails.event_category_options ||
      userDetails.event_category_options.length === 0 ||
      !userDetails.event_skate_category_options ||
      userDetails.event_skate_category_options.length === 0
    ) {
      fetchEventOptions();
    }
  }, [userDetails]);

  // Cleanup blob URLs when component unmounts or aadhaarPreview changes
  useEffect(() => {
    return () => {
      if (aadhaarPreview && aadhaarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(aadhaarPreview);
      }
    };
  }, [aadhaarPreview]);

  const handleEditDetailsChange = (e) => {
    const { name, value, type, files } = e.target;
    setEditDetails((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      let body, headers, method, url;
      const shouldPatch =
        userDetails &&
        userDetails.id &&
        editDetails &&
        userDetails.id === editDetails.id;

      // Compute changed fields only for PATCH
      let changedFields = {};
      if (shouldPatch) {
        Object.keys(editDetails).forEach((key) => {
          // Aadhaar image: if a new file is selected or user clears the file input
          if (key === "aadhaar_image") {
            if (editDetails[key] instanceof File) {
              changedFields[key] = editDetails[key];
            } else if (
              (!editDetails[key] && userDetails[key]) ||
              (typeof editDetails[key] === "string" &&
                editDetails[key] !== userDetails[key])
            ) {
              changedFields[key] = null; // send null to remove
            }
          } else if (
            key === "category" &&
            (editDetails[key] !== userDetails[key] ||
              (editDetails[key] === "" && userDetails[key] !== ""))
          ) {
            changedFields[key] = editDetails[key];
          } else if (
            key === "gender" &&
            (editDetails[key] !== userDetails[key] ||
              (editDetails[key] === "" && userDetails[key] !== ""))
          ) {
            changedFields[key] = editDetails[key];
          } else if (
            editDetails[key] !== userDetails[key] &&
            !(editDetails[key] === undefined && userDetails[key] === null)
          ) {
            changedFields[key] = editDetails[key];
          }
        });
      }

      if (shouldPatch && Object.keys(changedFields).length === 0) {
        // Show error toast if nothing changed
        if (window && window.dispatchEvent) {
          window.dispatchEvent(
            new CustomEvent("show-toast", {
              detail: {
                title: "No Changes",
                message: "No fields were changed.",
                variant: "destructive",
              },
            })
          );
        }
        setSaving(false);
        return;
      }

      // Use FormData if aadhaar_image is being uploaded, else JSON
      const useFormData =
        (shouldPatch && changedFields.aadhaar_image instanceof File) ||
        (!shouldPatch && editDetails.aadhaar_image instanceof File);

      if (useFormData) {
        body = new FormData();
        const fieldsToSend = shouldPatch ? changedFields : editDetails;
        Object.entries(fieldsToSend).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // Use 'aadhaarImage' for file upload to match registration and multer config
            if (key === "aadhaar_image" && value instanceof File) {
              body.append("aadhaar_image", value);
            } else {
              body.append(key, value);
            }
          }
        });
        // Always include registration_id for POST
        if (!shouldPatch && selectedRegistration?.id) {
          body.append("registration_id", selectedRegistration.id);
        }
        headers = undefined;
      } else {
        body = JSON.stringify(
          shouldPatch
            ? changedFields
            : {
                ...editDetails,
                ...(shouldPatch
                  ? {}
                  : { registration_id: selectedRegistration?.id }),
              }
        );
        headers = { "Content-Type": "application/json" };
      }
      if (shouldPatch) {
        method = "PATCH";
        url = `/api/user-details/${selectedRegistration.id}`;
      } else {
        method = "POST";
        url = "/api/user-details";
      }
      const updated = await apiFetch(url, {
        method,
        headers,
        body,
      });
      if (setUserDetails) setUserDetails(updated);
      setEditMode(false);
      // Custom popup instead of alert
      if (window && window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: {
              title: "Details Updated",
              message: "Your details have been updated successfully.",
              variant: "success",
            },
          })
        );
      }
    } catch (err) {
      // Custom popup for error
      if (window && window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: {
              title: "Error",
              message: err.message || "Failed to save details",
              variant: "destructive",
            },
          })
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAadhaarPreview = async (url) => {
    try {
      setAadhaarLoading(true);

      // If it's already a blob URL or data URL, use it directly
      if (url.startsWith("blob:") || url.startsWith("data:")) {
        setLocalAadhaarPreview(url);
        if (setAadhaarPreview) setAadhaarPreview(url);
        return;
      }

      // For secure file URLs, fetch with authentication
      if (
        url.includes("/api/secure-file/") ||
        url.includes("/api/admin/secure-file/")
      ) {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(url, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setLocalAadhaarPreview(blobUrl);
          if (setAadhaarPreview) setAadhaarPreview(blobUrl);
        } else {
          console.error("Failed to fetch secure image:", response.status);
        }
      } else {
        // For regular URLs, use directly
        setLocalAadhaarPreview(url);
        if (setAadhaarPreview) setAadhaarPreview(url);
      }
    } catch (error) {
      console.error("Error loading image:", error);
    } finally {
      setAadhaarLoading(false);
    }
  };

  return (
    <>
      {/* Render TeamDetails and pass selectedRegistration */}
      {userDetails.team && (
        <TeamDetails
          team={userDetails.team}
          selectedRegistration={selectedRegistration}
          setUserDetails={setUserDetails}
        />
      )}
      {editMode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-2 border border-blue-100 shadow-xl"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <FontAwesomeIcon icon={faEdit} className="text-white text-lg" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Edit Details</h3>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2 text-blue-500"
                  />
                  First Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="first_name"
                  value={editDetails?.first_name || ""}
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter first name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2 text-blue-500"
                  />
                  Middle Name
                </label>
                <input
                  name="middle_name"
                  value={editDetails?.middle_name || ""}
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter middle name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-2 text-blue-500"
                  />
                  Last Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="last_name"
                  value={editDetails?.last_name || ""}
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter last name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faUserTie}
                    className="mr-2 text-blue-500"
                  />
                  Coach Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="coach_name"
                  value={editDetails?.coach_name || ""}
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter coach name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faFlag}
                    className="mr-2 text-blue-500"
                  />
                  Club Name
                </label>
                <input
                  name="club_name"
                  value={editDetails?.club_name || ""}
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter club name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faVenusMars}
                    className="mr-2 text-blue-500"
                  />
                  Gender <span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  name="gender"
                  value={editDetails?.gender || ""}
                  onValueChange={(value) =>
                    setEditDetails((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="mr-2 text-blue-500"
                  />
                  Date of Birth <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={
                    editDetails?.date_of_birth
                      ? editDetails.date_of_birth.slice(0, 10)
                      : ""
                  }
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faBirthdayCake}
                    className="mr-2 text-blue-500"
                  />
                  Age Group
                </label>
                <input
                  name="age_group"
                  value={editDetails?.age_group || ""}
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter age group"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mr-2 text-blue-500"
                  />
                  District <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="district"
                  value={editDetails?.district || ""}
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter district"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mr-2 text-blue-500"
                  />
                  District <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="district"
                  value={editDetails?.district || ""}
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter district"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faFlag}
                    className="mr-2 text-blue-500"
                  />
                  State <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="state"
                  value={editDetails.state || ""}
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter state"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="mr-2 text-blue-500"
                  />
                  Event Category <span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  name="event_category"
                  value={editDetails?.event_category || ""}
                  onValueChange={(value) =>
                    setEditDetails((prev) => ({
                      ...prev,
                      event_category: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md">
                    <SelectValue placeholder="Select event category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Array.isArray(userDetails?.event_category_options) &&
                    userDetails.event_category_options.length > 0
                      ? userDetails.event_category_options
                      : eventCategoryOptions
                    ).length > 0 ? (
                      (userDetails.event_category_options &&
                      userDetails.event_category_options.length > 0
                        ? userDetails.event_category_options
                        : eventCategoryOptions
                      ).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-event-category" disabled>
                        No event categories
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="mr-2 text-blue-500"
                  />
                  Skate Category <span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  name="skate_category"
                  value={editDetails?.skate_category || ""}
                  onValueChange={(value) =>
                    setEditDetails((prev) => ({
                      ...prev,
                      skate_category: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md">
                    <SelectValue placeholder="Select skate category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Array.isArray(
                      userDetails?.event_skate_category_options
                    ) && userDetails.event_skate_category_options.length > 0
                      ? userDetails.event_skate_category_options
                      : skateCategoryOptions
                    ).length > 0 ? (
                      (userDetails.event_skate_category_options &&
                      userDetails.event_skate_category_options.length > 0
                        ? userDetails.event_skate_category_options
                        : skateCategoryOptions
                      ).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-skate-category" disabled>
                        No skate categories
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faIdCard}
                    className="mr-2 text-blue-500"
                  />
                  Aadhaar Number <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="aadhaar_number"
                  value={editDetails?.aadhaar_number || ""}
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter Aadhaar number"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FontAwesomeIcon
                    icon={faFileImage}
                    className="mr-2 text-blue-500"
                  />
                  Aadhaar Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="aadhaar_image"
                  onChange={handleEditDetailsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {editDetails?.aadhaar_image &&
                  typeof editDetails.aadhaar_image === "string" && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 mb-1">
                        Current Document:
                      </p>
                      <span
                        className={`text-blue-600 underline cursor-pointer hover:text-blue-800 font-medium ${
                          aadhaarLoading ? "opacity-60 pointer-events-none" : ""
                        }`}
                        onClick={() =>
                          !aadhaarLoading &&
                          handleAadhaarPreview(editDetails.aadhaar_image)
                        }
                      >
                        {aadhaarLoading
                          ? "Loading..."
                          : "View Current Document"}
                      </span>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setEditMode(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center shadow-sm"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSaveDetails}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-600 transition-all duration-200 flex items-center shadow-lg"
              >
                <FontAwesomeIcon
                  icon={saving ? faSpinner : faSave}
                  className={`mr-2 ${saving ? "animate-spin" : ""}`}
                />
                {saving ? "Saving..." : "Save"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl p-2 border border-gray-200 shadow-lg"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <FontAwesomeIcon icon={faUser} className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                Player Details
              </h3>
              <p className="text-gray-600">Manage your details</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">First Name</p>
                <p className="text-gray-800 font-semibold">
                  {userDetails.first_name || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Middle Name</p>
                <p className="text-gray-800 font-semibold">
                  {userDetails.middle_name || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Name</p>
                <p className="text-gray-800 font-semibold">
                  {userDetails.last_name || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUserTie} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Coach Name</p>
                <p className="text-gray-800 font-semibold">
                  {userDetails.coach_name || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faFlag} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Club Name</p>
                <p className="text-gray-800 font-semibold">
                  {userDetails.club_name || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faVenusMars} className="text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="text-gray-800 font-semibold capitalize">
                  {userDetails.gender || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faBirthdayCake}
                  className="text-orange-600"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Date of Birth
                </p>
                <p className="text-gray-800 font-semibold">
                  {userDetails.date_of_birth
                    ? new Date(userDetails.date_of_birth).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faBirthdayCake}
                  className="text-indigo-600"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Age Group</p>
                <p className="text-gray-800 font-semibold">
                  {userDetails.age_group || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-teal-600"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">District</p>
                <p className="text-gray-800 font-semibold">
                  {userDetails.district || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="text-cyan-600"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Event Category
                </p>
                <p className="text-gray-800 font-semibold">
                  {userDetails.event_category || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="text-emerald-600"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Skate Category
                </p>
                <p className="text-gray-800 font-semibold">
                  {userDetails.skate_category || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faFlag} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">State</p>
                <p className="text-gray-800 font-semibold">
                  {userDetails.state || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faIdCard} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Aadhaar Number
                </p>
                <p className="text-gray-800 font-semibold font-mono">
                  {userDetails.aadhaar_number || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faFileImage} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Aadhaar Document
                </p>
                <div className="text-gray-800 font-semibold">
                  {userDetails.aadhaar_image ? (
                    user.role === "admin" || user.role === "superadmin" ? (
                      <button
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          aadhaarLoading
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                        }`}
                        onClick={() =>
                          !aadhaarLoading &&
                          handleAadhaarPreview(
                            `${backendUrl}/api/secure-file/${userDetails.aadhaar_image
                              .split("/")
                              .pop()}`
                          )
                        }
                        disabled={aadhaarLoading}
                      >
                        <FontAwesomeIcon
                          icon={aadhaarLoading ? faSpinner : faFileImage}
                          className={`mr-2 ${
                            aadhaarLoading ? "animate-spin" : ""
                          }`}
                        />
                        {aadhaarLoading ? "Loading..." : "View Document"}
                      </button>
                    ) : userDetails.user_id === user.id ? (
                      <button
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          aadhaarLoading
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                        }`}
                        onClick={() =>
                          !aadhaarLoading &&
                          handleAadhaarPreview(
                            `${backendUrl}/api/secure-file/${userDetails.aadhaar_image
                              .split("/")
                              .pop()}`
                          )
                        }
                        disabled={aadhaarLoading}
                      >
                        <FontAwesomeIcon
                          icon={aadhaarLoading ? faSpinner : faFileImage}
                          className={`mr-2 ${
                            aadhaarLoading ? "animate-spin" : ""
                          }`}
                        />
                        {aadhaarLoading ? "Loading..." : "View Document"}
                      </button>
                    ) : (
                      <span className="text-gray-500 italic">
                        Not Available
                      </span>
                    )
                  ) : (
                    <span className="text-gray-500 italic">Not Uploaded</span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 flex gap-4 justify-end mt-6 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-6 py-3 border-2 border-blue-200 text-blue-700 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 flex items-center shadow-sm"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Close
              </motion.button>
              {selectedRegistration?.status !== "confirmed" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditMode(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center shadow-lg"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}
      <AadhaarPreviewModal
        aadhaarPreview={aadhaarPreview}
        setAadhaarPreview={setLocalAadhaarPreview}
      />
    </>
  );
};

export default UserDetailsGrid;
