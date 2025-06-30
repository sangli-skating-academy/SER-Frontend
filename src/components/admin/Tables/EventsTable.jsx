import Button from "../../ui/button";

export default function EventsTable({
  data,
  rowLimit,
  registrations,
  onRowClick,
}) {
  return (
    <div className="bg-white/90 rounded-xl shadow-lg border overflow-x-auto">
      <table className="w-full min-w-[1600px]">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 via-pink-50 to-blue-100">
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Sr No.
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Gender
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Age Group
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Max Team Size
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Featured
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Registrations
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {(rowLimit ? data.slice(0, rowLimit) : data).map((event, idx) => {
            const regCount =
              registrations && event.id
                ? registrations.filter((r) => r.event_id === event.id).length
                : event.registrations;
            return (
              <tr
                key={event.id}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 transition-colors duration-200 cursor-pointer"
                onClick={() => onRowClick && onRowClick(event)}
              >
                <td className="px-4 py-4 whitespace-nowrap">{idx + 1}</td>
                <td className="px-4 py-4 whitespace-nowrap">{event.title}</td>
                <td
                  className="px-4 py-4 whitespace-nowrap max-w-xs truncate"
                  title={event.description}
                >
                  {event.description}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {event.location}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {event.start_date
                    ? new Date(event.start_date).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {event.gender || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {event.age_group || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {event.is_team_event ? "Team" : "Individual"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {event.price_per_person
                    ? `₹${parseFloat(
                        event.price_per_person * (event.max_team_size || 1)
                      ).toFixed(2)}`
                    : "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {event.max_team_size || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="h-10 w-16 object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {event.is_featured ? (
                    <span className="text-green-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{regCount}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-xs font-semibold shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement edit event logic
                      alert(`Edit event: ${event.title}`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement delete event logic
                      alert(`Delete event: ${event.title}`);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
