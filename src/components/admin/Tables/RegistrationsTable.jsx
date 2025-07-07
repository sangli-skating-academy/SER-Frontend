import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faHourglassHalf,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import Badge from "../../ui/badge";

const statusIcon = (status) => {
  if (!status) return null;
  const normalized = status.toLowerCase();
  if (
    normalized === "confirmed" ||
    normalized === "success" ||
    normalized === "approved"
  )
    return (
      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />
    );
  if (
    normalized === "pending" ||
    normalized === "in progress" ||
    normalized === "processing"
  )
    return (
      <FontAwesomeIcon
        icon={faHourglassHalf}
        className="text-yellow-500 mr-1"
      />
    );
  if (
    normalized === "cancelled" ||
    normalized === "rejected" ||
    normalized === "failed"
  )
    return (
      <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-1" />
    );
  // Default: show hourglass for unknown/other statuses
  return (
    <FontAwesomeIcon icon={faHourglassHalf} className="text-gray-400 mr-1" />
  );
};

export default function RegistrationsTable({ data, rowLimit, onRowClick }) {
  // Filter out registrations for events that have already started
  const today = new Date();
  const filteredData = data.filter((reg) => {
    const eventStart = reg.event_start_date || reg.eventStartDate;
    if (!eventStart) return true; // If no date, include by default
    return new Date(eventStart) >= today.setHours(0, 0, 0, 0);
  });
  return (
    <div className="bg-white/90 rounded-xl shadow-lg border overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 via-pink-50 to-blue-100">
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Sr No.
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Event
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Amount Paid
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Coach
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Club
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Age Group
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {(rowLimit ? filteredData.slice(0, rowLimit) : filteredData).map(
            (reg, idx) => (
              <tr
                key={reg.id}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 transition-colors duration-200 cursor-pointer"
                onClick={() => onRowClick && onRowClick(reg)}
              >
                <td className="px-4 py-4 whitespace-nowrap">{idx + 1}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {reg.userName || reg.full_name || reg.username}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {reg.userRole || reg.user_role}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {reg.eventTitle || reg.event_title}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {reg.registrationType || reg.registration_type}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {reg.registrationDate
                    ? new Date(reg.registrationDate).toLocaleDateString()
                    : reg.created_at
                    ? new Date(reg.created_at).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge className="flex items-center">
                    {statusIcon(reg.status)}
                    {reg.status}
                  </Badge>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {reg.payment_amount || reg.amount || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {reg.coachName || reg.coach_name || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {reg.clubName || reg.club_name || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {reg.ageGroup || reg.age_group || "-"}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
