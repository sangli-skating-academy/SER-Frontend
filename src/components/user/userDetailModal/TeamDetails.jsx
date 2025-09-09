import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faEdit,
  faSave,
  faTimes,
  faSpinner,
  faUserFriends,
  faVenusMars,
  faBirthdayCake,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Button from "../../ui/button";
import { apiFetch } from "../../../services/api";

const TeamDetails = ({
  team,
  onSave,
  selectedRegistration,
  setUserDetails,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [members, setMembers] = useState(team?.members || []);
  const [saving, setSaving] = useState(false);

  const handleMemberChange = (idx, field, value) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // PATCH to backend to update team members for this registration's team
      await apiFetch(`/api/teams/${team.id}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members }),
      });
      setEditMode(false);
      if (onSave) onSave({ ...team, members });
      if (setUserDetails)
        setUserDetails((ud) => ({ ...ud, team: { ...team, members } }));

      // Show success notification
      if (window && window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: {
              title: "Team Updated",
              message: "Team members have been updated successfully.",
              variant: "success",
            },
          })
        );
      }
    } catch (error) {
      // Show error notification
      if (window && window.dispatchEvent) {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: {
              title: "Error",
              message:
                error.message ||
                "Failed to save team members. Please try again.",
              variant: "destructive",
            },
          })
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (!team) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-2 border border-blue-200 shadow-lg"
    >
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
          <FontAwesomeIcon icon={faUsers} className="text-white text-lg" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Team Details</h3>
          <p className="text-gray-600">Manage your team members</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 justify-center">
          <div>
            <p className="text-lg font-medium text-gray-700">Team Name</p>
            <p className="text-xl font-bold text-gray-800">{team.name}</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUsers} className="text-green-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">Team Members</p>
            <p className="text-sm text-gray-600">
              {members?.length || 0} members
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Sr No.
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-sm uppercase tracking-wider">
                    <FontAwesomeIcon icon={faBirthdayCake} className="mr-2" />
                    Age
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-sm uppercase tracking-wider">
                    <FontAwesomeIcon icon={faVenusMars} className="mr-2" />
                    Gender
                  </th>
                  {editMode && selectedRegistration?.status !== "confirmed" && (
                    <th className="px-6 py-4"></th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members && members.length > 0 ? (
                  members.map((member, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {idx + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editMode ? (
                          <input
                            type="text"
                            value={member.full_name}
                            onChange={(e) =>
                              handleMemberChange(
                                idx,
                                "full_name",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                            placeholder="Enter full name"
                          />
                        ) : (
                          <span className="text-gray-900 font-medium">
                            {member.full_name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editMode ? (
                          <input
                            type="number"
                            value={member.age}
                            onChange={(e) =>
                              handleMemberChange(idx, "age", e.target.value)
                            }
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-center"
                            placeholder="Age"
                            min="1"
                            max="99"
                          />
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {member.age}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editMode ? (
                          <select
                            value={member.gender}
                            onChange={(e) =>
                              handleMemberChange(idx, "gender", e.target.value)
                            }
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              member.gender === "male"
                                ? "bg-blue-100 text-blue-800"
                                : member.gender === "female"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {member.gender?.charAt(0).toUpperCase() +
                              member.gender?.slice(1)}
                          </span>
                        )}
                      </td>

                      {editMode &&
                        selectedRegistration?.status !== "confirmed" && (
                          <td className="px-6 py-4"></td>
                        )}
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={editMode ? 6 : 5}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FontAwesomeIcon
                            icon={faUsers}
                            className="text-2xl text-gray-400"
                          />
                        </div>
                        <p className="text-gray-500 font-medium">
                          No team members found
                        </p>
                        <p className="text-gray-400 text-sm">
                          Team members will appear here
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 flex gap-4 justify-end pt-6 border-t border-gray-200">
          {editMode ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEditMode(false);
                  setMembers(team.members || []);
                }}
                disabled={saving}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center shadow-sm disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center shadow-lg"
              >
                <FontAwesomeIcon
                  icon={saving ? faSpinner : faSave}
                  className={`mr-2 ${saving ? "animate-spin" : ""}`}
                />
                {saving ? "Saving..." : "Save"}
              </motion.button>
            </>
          ) : (
            selectedRegistration?.status !== "confirmed" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEditMode(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center shadow-lg"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit Team
              </motion.button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamDetails;
