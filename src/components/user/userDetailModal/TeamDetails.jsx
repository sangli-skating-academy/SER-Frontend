import React, { useState } from "react";
import Button from "../../ui/button";
import { apiFetch } from "../../../services/api";

const TeamDetails = ({
  team,
  onSave,
  selectedRegistration,
  setUserDetails,
  backendUrl,
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
      const res = await apiFetch(`/api/teams/${team.id}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members }),
      });
      setEditMode(false);
      if (onSave) onSave({ ...team, members });
      if (setUserDetails)
        setUserDetails((ud) => ({ ...ud, team: { ...team, members } }));
    } catch (err) {
      alert("Failed to save team members. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!team) return null;
  return (
    <div className="mb-6">
      <h3 className="font-bold text-lg text-blue-700 mb-2">Team Details</h3>
      <div className="mb-2">
        <b>Team Name:</b>{" "}
        <span className="text-pink-500 font-semibold">{team.name}</span>
      </div>
      <div>
        <b>Team Members:</b>
        <div className="overflow-x-auto rounded-lg shadow border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-pink-50 mt-2">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-pink-100">
                <th className="px-3 py-2 border-b font-semibold text-blue-900">
                  #
                </th>
                <th className="px-3 py-2 border-b font-semibold text-blue-900">
                  Full Name
                </th>
                <th className="px-3 py-2 border-b font-semibold text-blue-900">
                  Age
                </th>
                <th className="px-3 py-2 border-b font-semibold text-blue-900">
                  Gender
                </th>
                <th className="px-3 py-2 border-b font-semibold text-blue-900">
                  Experience
                </th>
                {editMode && selectedRegistration?.status !== "confirmed" && (
                  <th className="px-3 py-2 border-b"></th>
                )}
              </tr>
            </thead>
            <tbody>
              {members && members.length > 0 ? (
                members.map((member, idx) => (
                  <tr
                    key={idx}
                    className="even:bg-blue-50 hover:bg-pink-50 transition-colors"
                  >
                    <td className="px-3 py-2 border-b text-center font-bold text-pink-600">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2 border-b">
                      {editMode ? (
                        <input
                          type="text"
                          value={member.full_name}
                          onChange={(e) =>
                            handleMemberChange(idx, "full_name", e.target.value)
                          }
                          className="border rounded px-2 py-1 w-32 focus:ring-2 focus:ring-pink-300"
                        />
                      ) : (
                        <span className="text-blue-900 font-medium">
                          {member.full_name}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 border-b text-center">
                      {editMode ? (
                        <input
                          type="text"
                          value={member.age}
                          onChange={(e) =>
                            handleMemberChange(idx, "age", e.target.value)
                          }
                          className="border rounded px-2 py-1 w-14 focus:ring-2 focus:ring-pink-300"
                        />
                      ) : (
                        <span className="text-blue-800">{member.age}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 border-b text-center">
                      {editMode ? (
                        <select
                          value={member.gender}
                          onChange={(e) =>
                            handleMemberChange(idx, "gender", e.target.value)
                          }
                          className="border rounded px-2 py-1 w-24 focus:ring-2 focus:ring-pink-300 bg-white"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <span className="capitalize text-blue-800">
                          {member.gender}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 border-b text-center">
                      {editMode ? (
                        <select
                          value={member.experience}
                          onChange={(e) =>
                            handleMemberChange(
                              idx,
                              "experience",
                              e.target.value
                            )
                          }
                          className="border rounded px-2 py-1 w-28 focus:ring-2 focus:ring-pink-300 bg-white"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      ) : (
                        <span className="text-blue-800">
                          {member.experience}
                        </span>
                      )}
                    </td>
                    {editMode &&
                      selectedRegistration?.status !== "confirmed" && (
                        <td className="px-3 py-2 border-b"></td>
                      )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={editMode ? 6 : 5}
                    className="text-center py-4 text-gray-500"
                  >
                    No team members
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-2">
          {editMode ? (
            <Button
              className="bg-gradient-to-r from-blue-500 to-pink-400 text-white font-bold"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          ) : (
            selectedRegistration?.status !== "confirmed" && (
              <Button
                className="bg-gradient-to-r from-blue-500 to-pink-400 text-white font-bold"
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )
          )}
          {editMode && selectedRegistration?.status !== "confirmed" && (
            <Button
              variant="outline"
              onClick={() => {
                setEditMode(false);
                setMembers(team.members || []);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
