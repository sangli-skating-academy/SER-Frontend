import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faVenusMars,
  faBirthdayCake,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../ui/button";

const UserDetailsModal = ({
  detailsLoading,
  userDetails,
  selectedRegistration,
  user,
  setAadhaarPreview,
  setIsDetailsModalOpen,
  setEditMode,
  backendUrl,
  children,
}) => (
  <>
    {detailsLoading ? (
      <div>Loading...</div>
    ) : userDetails ? (
      <div>
        {selectedRegistration?.team_id && userDetails?.team && children}
      </div>
    ) : (
      <div>No details found.</div>
    )}
  </>
);

export default UserDetailsModal;
