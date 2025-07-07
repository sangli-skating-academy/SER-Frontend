import Button from "../../ui/button";
import { useRef, useState } from "react";
import EventDetails from "../Modals/EventDetails";
import { apiFetch } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function EventsTable({
  data,
  rowLimit,
  registrations,
  onRowClick,
  label = "Upcoming Events",
  onEditEvent,
}) {
  const scrollRef = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    event: null,
  });
  const navigate = useNavigate();

  // Drag-to-scroll handlers
  const handleMouseDown = (e) => {
    isDown = true;
    scrollRef.current.classList.add("scrolling");
    startX = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft = scrollRef.current.scrollLeft;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll-fast
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleMouseUp = () => {
    isDown = false;
    scrollRef.current.classList.remove("scrolling");
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  // Open modal on row click
  const handleRowClick = (event) => {
    setSelectedEvent(event);
    if (onRowClick) onRowClick(event);
  };

  const handleDelete = async (event) => {
    setDeleteConfirm({ show: true, event });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.event) return;
    try {
      await apiFetch(`/api/admin/events/${deleteConfirm.event.id}`, {
        method: "DELETE",
      });
      setDeleteConfirm({ show: false, event: null });
      // Optionally, trigger a refresh or callback
      if (typeof onEditEvent === "function") onEditEvent();
    } catch (err) {
      setDeleteConfirm({ show: false, event: null });
      alert("Failed to delete event.");
    }
  };

  const cancelDelete = () => setDeleteConfirm({ show: false, event: null });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{label}</h2>
      <div
        ref={scrollRef}
        className="bg-white/90 rounded-xl shadow-lg border overflow-x-auto select-none cursor-grab"
        onMouseDown={handleMouseDown}
        style={{ userSelect: "none" }}
      >
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
                Rules & Guidelines
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Start Time
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
                  onClick={() => handleRowClick(event)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{event.title}</td>
                  <td className="px-4 py-4 whitespace-nowrap max-w-xs truncate">
                    {event.description}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap max-w-s truncate">
                    {event.rules_and_guidelines ? (
                      <span>
                        <div>
                          <strong>General Rule:</strong>{" "}
                          {(() => {
                            const arr =
                              event.rules_and_guidelines.general_rules;
                            if (!arr || arr.length === 0)
                              return <span className="text-gray-400">-</span>;
                            const first = arr[0];
                            if (!first)
                              return <span className="text-gray-400">-</span>;
                            const words = first.split(" ");
                            return words.length > 6
                              ? words.slice(0, 6).join(" ") + "..."
                              : first;
                          })()}
                        </div>
                        <div>
                          <strong>Equipment Rule:</strong>{" "}
                          {(() => {
                            const arr =
                              event.rules_and_guidelines.equipment_requirements;
                            if (!arr || arr.length === 0)
                              return <span className="text-gray-400">-</span>;
                            const first = arr[0];
                            if (!first)
                              return <span className="text-gray-400">-</span>;
                            const words = first.split(" ");
                            return words.length > 6
                              ? words.slice(0, 6).join(" ") + "..."
                              : first;
                          })()}
                        </div>
                        <div>
                          <strong>Scoring System:</strong>{" "}
                          {(() => {
                            const arr =
                              event.rules_and_guidelines.scoring_system;
                            if (!arr || arr.length === 0)
                              return <span className="text-gray-400">-</span>;
                            const first = arr[0];
                            if (!first || !first.title)
                              return <span className="text-gray-400">-</span>;
                            return first.title;
                          })()}
                        </div>
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
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
                    {event.start_time ? event.start_time : "-"}
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
                        navigate("/admin/addevent", { state: { event } });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event);
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
        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold text-red-600 mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {deleteConfirm.event?.title}
              </span>
              ?
            </p>
            <div className="flex gap-4">
              <Button className="bg-red-500 text-white" onClick={confirmDelete}>
                Delete
              </Button>
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
