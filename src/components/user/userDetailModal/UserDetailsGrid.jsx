import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faVenusMars,
  faBirthdayCake,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => setAadhaarPreview(null)}
    >
      <div
        className="bg-white rounded-lg p-4 shadow-lg max-w-lg w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {aadhaarPreview ? (
          <img
            src={aadhaarPreview}
            alt="Aadhaar Preview"
            className="max-h-[70vh] max-w-full rounded mb-4"
            onError={(e) => {
              console.error("Failed to load image:", e);
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        )}
        <Button variant="outline" onClick={() => setAadhaarPreview(null)}>
          Close
        </Button>
      </div>
    </div>
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
          backendUrl={backendUrl}
        />
      )}
      {editMode ? (
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                First Name
              </label>
              <input
                name="first_name"
                value={editDetails?.first_name || ""}
                onChange={handleEditDetailsChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Middle Name
              </label>
              <input
                name="middle_name"
                value={editDetails?.middle_name || ""}
                onChange={handleEditDetailsChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Last Name
              </label>
              <input
                name="last_name"
                value={editDetails?.last_name || ""}
                onChange={handleEditDetailsChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Coach Name
              </label>
              <input
                name="coach_name"
                value={editDetails?.coach_name || ""}
                onChange={handleEditDetailsChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Club Name
              </label>
              <input
                name="club_name"
                value={editDetails?.club_name || ""}
                onChange={handleEditDetailsChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Gender
              </label>
              <Select
                name="gender"
                value={editDetails?.gender || ""}
                onValueChange={(value) =>
                  setEditDetails((prev) => ({ ...prev, gender: value }))
                }
                className="border rounded px-2 py-1 w-full"
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
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Date of Birth
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
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Age Group
              </label>
              <input
                name="age_group"
                value={editDetails?.age_group || ""}
                onChange={handleEditDetailsChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                District
              </label>
              <input
                name="district"
                value={editDetails?.district || ""}
                onChange={handleEditDetailsChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Event Category
              </label>
              <Select
                name="event_category"
                value={editDetails?.event_category || ""}
                onValueChange={(value) =>
                  setEditDetails((prev) => ({ ...prev, event_category: value }))
                }
                className="border rounded px-2 py-1 w-full"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event category" />
                </SelectTrigger>
                <SelectContent>
                  {/* Dynamically fetch event category options from userDetails or fallback to eventCategoryOptions */}
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
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Skate Category
              </label>
              <Select
                name="skate_category"
                value={editDetails?.skate_category || ""}
                onValueChange={(value) =>
                  setEditDetails((prev) => ({ ...prev, skate_category: value }))
                }
                className="border rounded px-2 py-1 w-full"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select skate category" />
                </SelectTrigger>
                <SelectContent>
                  {/* Dynamically fetch skate category options from userDetails or fallback to skateCategoryOptions */}
                  {(Array.isArray(userDetails?.event_skate_category_options) &&
                  userDetails.event_skate_category_options.length > 0
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
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Aadhaar Number
              </label>
              <input
                name="aadhaar_number"
                value={editDetails?.aadhaar_number || ""}
                onChange={handleEditDetailsChange}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Aadhaar Image
              </label>
              <input
                type="file"
                accept="image/*"
                name="aadhaar_image"
                onChange={handleEditDetailsChange}
                className="border rounded px-2 py-1 w-full"
              />
              {editDetails?.aadhaar_image &&
                typeof editDetails.aadhaar_image === "string" && (
                  <div className="mt-1 text-xs text-gray-500">
                    Current:{" "}
                    <span
                      className={`text-blue-600 underline ${
                        aadhaarLoading
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                      onClick={() =>
                        !aadhaarLoading &&
                        handleAadhaarPreview(editDetails.aadhaar_image)
                      }
                    >
                      {aadhaarLoading ? "Loading..." : "View"}
                    </span>
                  </div>
                )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                State
              </label>
              <input
                name="state"
                value={editDetails.state || ""}
                onChange={handleEditDetailsChange}
                className="border rounded px-2 py-1 w-full"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <Button
              variant="outline"
              className="text-red-700 border-gray-300 hover:bg-red-100"
              onClick={() => setEditMode(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="bg-green-500 text-white hover:bg-green-600"
              onClick={handleSaveDetails}
              type="button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-blue-400" />
              <b>First Name:</b>{" "}
              <span className="ml-1">{userDetails.first_name || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-blue-400" />
              <b>Middle Name:</b>{" "}
              <span className="ml-1">{userDetails.middle_name || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-blue-400" />
              <b>Last Name:</b>{" "}
              <span className="ml-1">{userDetails.last_name || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-blue-400" />
              <b>Coach Name:</b>{" "}
              <span className="ml-1">{userDetails.coach_name || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-blue-400" />
              <b>Club Name:</b>{" "}
              <span className="ml-1">{userDetails.club_name || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faVenusMars} className="text-blue-400" />
              <b>Gender:</b>{" "}
              <span className="ml-1">{userDetails.gender || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faBirthdayCake}
                className="text-blue-400"
              />
              <b>Date of Birth:</b>{" "}
              <span className="ml-1">
                {userDetails.date_of_birth
                  ? new Date(userDetails.date_of_birth).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-blue-400"
              />
              <b>Age Group:</b>{" "}
              <span className="ml-1">{userDetails.age_group || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-blue-400"
              />
              <b>District:</b>{" "}
              <span className="ml-1">{userDetails.district || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-blue-400"
              />
              <b>Event Category:</b>{" "}
              <span className="ml-1">
                {userDetails.event_category || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-blue-400"
              />
              <b>Skate Category:</b>{" "}
              <span className="ml-1">
                {userDetails.skate_category || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-blue-400"
              />
              <b>State:</b>{" "}
              <span className="ml-1">{userDetails.state || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-blue-400"
              />
              <b>Aadhaar Number:</b>{" "}
              <span className="ml-1">
                {userDetails.aadhaar_number || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-blue-400"
              />
              <b>Aadhaar Image:</b>{" "}
              <span className="ml-1">
                {userDetails.aadhaar_image ? (
                  user.role === "admin" || user.role === "superadmin" ? (
                    <span
                      className={`text-blue-600 underline ${
                        aadhaarLoading
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                      onClick={() =>
                        !aadhaarLoading &&
                        handleAadhaarPreview(
                          `${backendUrl}/api/secure-file/${userDetails.aadhaar_image
                            .split("/")
                            .pop()}`
                        )
                      }
                    >
                      {aadhaarLoading ? "Loading..." : "View"}
                    </span>
                  ) : userDetails.user_id === user.id ? (
                    <span
                      className={`text-blue-600 underline ${
                        aadhaarLoading
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                      onClick={() =>
                        !aadhaarLoading &&
                        handleAadhaarPreview(
                          `${backendUrl}/api/secure-file/${userDetails.aadhaar_image
                            .split("/")
                            .pop()}`
                        )
                      }
                    >
                      {aadhaarLoading ? "Loading..." : "View"}
                    </span>
                  ) : (
                    "N/A"
                  )
                ) : (
                  "N/A"
                )}
              </span>
            </div>

            <div className="col-span-1 sm:col-span-2 flex gap-2 justify-end mt-4">
              <Button
                variant="outline"
                className="text-blue-700 border-gray-300 hover:bg-blue-100"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </Button>
              {selectedRegistration?.status !== "confirmed" && (
                <Button
                  variant="outline"
                  className="text-red-700 border-gray-300 hover:bg-red-100"
                  onClick={() => setEditMode(true)}
                >
                  Edit Details
                </Button>
              )}
            </div>
          </div>
        </>
      )}
      <AadhaarPreviewModal
        aadhaarPreview={aadhaarPreview}
        setAadhaarPreview={setLocalAadhaarPreview}
      />
    </>
  );
};

export default UserDetailsGrid;
