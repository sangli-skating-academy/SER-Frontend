import React, { useState } from "react";
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
        <img
          src={aadhaarPreview}
          alt="Aadhaar Preview"
          className="max-h-[70vh] max-w-full rounded mb-4"
        />
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
  const [editMode, setEditMode] = useState(false);
  const [editDetails, setEditDetails] = useState(userDetails);
  const [saving, setSaving] = useState(false);

  // Update editDetails when userDetails changes (e.g., when modal opens for a new user)
  React.useEffect(() => {
    setEditDetails(userDetails);
  }, [userDetails]);

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

  const handleAadhaarPreview = (url) => {
    setLocalAadhaarPreview(url);
    if (setAadhaarPreview) setAadhaarPreview(url); // for backward compatibility
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
                Category
              </label>
              <Select
                name="category"
                value={editDetails?.category || ""}
                onValueChange={(value) =>
                  setEditDetails((prev) => ({ ...prev, category: value }))
                }
                className="border rounded px-2 py-1 w-full"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quad">Quad</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
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
                      className="text-blue-600 underline cursor-pointer"
                      onClick={() =>
                        handleAadhaarPreview(editDetails.aadhaar_image)
                      }
                    >
                      View
                    </span>
                  </div>
                )}
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
              <b>Category:</b>{" "}
              <span className="ml-1">{userDetails.category || "N/A"}</span>
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
                      className="text-blue-600 underline cursor-pointer"
                      onClick={() =>
                        handleAadhaarPreview(
                          `${backendUrl}/api/secure-file/${userDetails.aadhaar_image
                            .split("/")
                            .pop()}`
                        )
                      }
                    >
                      View
                    </span>
                  ) : userDetails.user_id === user.id ? (
                    <span
                      className="text-blue-600 underline cursor-pointer"
                      onClick={() =>
                        handleAadhaarPreview(
                          `${backendUrl}/api/secure-file/${userDetails.aadhaar_image
                            .split("/")
                            .pop()}`
                        )
                      }
                    >
                      View
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
