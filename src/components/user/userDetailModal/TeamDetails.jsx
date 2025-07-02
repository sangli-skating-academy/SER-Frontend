import React from "react";

const TeamDetails = ({ team }) => {
  if (!team) return null;
  return (
    <div className="mb-6">
      <h3 className="font-bold text-lg text-blue-700 mb-2">Team Details</h3>
      <div className="mb-2">
        <b>Team Name:</b> {team.name}
      </div>
      <div>
        <b>Team Members:</b>
        <div className="overflow-x-auto">
          <table className="min-w-full border mt-2 text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-2 py-1 border">#</th>
                <th className="px-2 py-1 border">Full Name</th>
                <th className="px-2 py-1 border">Age</th>
                <th className="px-2 py-1 border">Gender</th>
                <th className="px-2 py-1 border">Experience</th>
              </tr>
            </thead>
            <tbody>
              {team.members && team.members.length > 0 ? (
                team.members.map((member, idx) => (
                  <tr key={idx} className="even:bg-gray-50">
                    <td className="px-2 py-1 border">{idx + 1}</td>
                    <td className="px-2 py-1 border">{member.full_name}</td>
                    <td className="px-2 py-1 border">{member.age}</td>
                    <td className="px-2 py-1 border">{member.gender}</td>
                    <td className="px-2 py-1 border">{member.experience}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-2">
                    No team members
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
