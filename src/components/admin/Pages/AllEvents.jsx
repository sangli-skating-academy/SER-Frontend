import { useEffect, useState } from "react";
import { fetchEvents } from "../../../services/eventApi";
import AdminLayout from "../layouts/AdminLayout";
import Button from "../../ui/button";
import Skeleton from "../../ui/skeleton";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../services/api";
import EventsTable from "../Tables/EventsTable";
import EventDetails from "../Modals/EventDetails";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchEvents({ includePast: "true" }).then((res) => res.events || res),
      apiFetch("/api/admin/registrations/all").then(
        (res) => res.registrations || res
      ),
    ])
      .then(([eventsData, regsData]) => {
        // Sort: future events (soonest first), then past events (latest first)
        const now = new Date();
        const sortedEvents = eventsData.slice().sort((a, b) => {
          const aDate = new Date(a.start_date);
          const bDate = new Date(b.start_date);
          const aIsFuture = aDate >= now;
          const bIsFuture = bDate >= now;
          if (aIsFuture && !bIsFuture) return -1;
          if (!aIsFuture && bIsFuture) return 1;
          // Both future: soonest first; both past: latest first
          return aIsFuture ? aDate - bDate : bDate - aDate;
        });
        setEvents(sortedEvents);
        setRegistrations(regsData);
      })
      .catch(() => setError("Failed to load events or registrations"))
      .finally(() => setLoading(false));
  }, []);

  const refreshData = () => {
    setLoading(true);
    Promise.all([
      fetchEvents({ includePast: "true" }).then((res) => res.events || res),
      apiFetch("/api/admin/registrations/all").then(
        (res) => res.registrations || res
      ),
    ])
      .then(([eventsData, regsData]) => {
        // Sort: future events (soonest first), then past events (latest first)
        const now = new Date();
        const sortedEvents = eventsData.slice().sort((a, b) => {
          const aDate = new Date(a.start_date);
          const bDate = new Date(b.start_date);
          const aIsFuture = aDate >= now;
          const bIsFuture = bDate >= now;
          if (aIsFuture && !bIsFuture) return -1;
          if (!aIsFuture && bIsFuture) return 1;
          // Both future: soonest first; both past: latest first
          return aIsFuture ? aDate - bDate : bDate - aDate;
        });
        setEvents(sortedEvents);
        setRegistrations(regsData);
      })
      .catch(() => setError("Failed to load events or registrations"))
      .finally(() => setLoading(false));
  };

  // Split events into happening today, active, and closed
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const happeningToday = events.filter((e) => {
    if (!e.start_date) return false;
    const eventDate = new Date(e.start_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === now.getTime();
  });
  const activeEvents = events.filter((e) => {
    if (!e.start_date) return false;
    const eventDate = new Date(e.start_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() > now.getTime();
  });
  const closedEvents = events.filter((e) => {
    if (!e.start_date) return false;
    const eventDate = new Date(e.start_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() < now.getTime();
  });

  // Handler to update event in state after edit
  const handleEventUpdated = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
    setEventToEdit(null);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <main className="flex-grow py-10 relative z-10">
          <div className="container mx-auto px-2 md:px-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold shadow transition"
            >
              &larr; Back
            </button>
            <div className="flex items-center mb-6 gap-2">
              <h1 className="text-3xl font-bold mr-4">All Events</h1>
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="transition-all hover:scale-105 shadow"
              >
                <FontAwesomeIcon
                  icon={faSyncAlt}
                  spin={loading}
                  className="mr-2 h-4 w-4"
                />
                Refresh
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition-transform"
                onClick={() => navigate("/admin/addevent")}
              >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>
            {loading ? (
              <Skeleton className="w-full h-40" />
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <>
                {happeningToday.length > 0 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-2 mt-6">
                      Happening Today
                    </h2>
                    <EventsTable
                      data={happeningToday}
                      registrations={registrations}
                      label="Happening Today"
                      onEditEvent={setEventToEdit}
                    />
                  </>
                )}
                <h2 className="text-2xl font-semibold mb-2 mt-10">
                  Active Events
                </h2>
                <EventsTable
                  data={activeEvents}
                  registrations={registrations}
                  label="Upcoming Events"
                  onEditEvent={setEventToEdit}
                />
                <h2 className="text-2xl font-semibold mb-2 mt-10">
                  Closed Events
                </h2>
                <EventsTable
                  data={closedEvents}
                  registrations={registrations}
                  label="Closed Events"
                  onEditEvent={setEventToEdit}
                />
              </>
            )}
          </div>
        </main>
        {eventToEdit && (
          <EventDetails
            event={eventToEdit}
            onClose={() => setEventToEdit(null)}
            onEventUpdated={handleEventUpdated}
          />
        )}
      </div>
    </AdminLayout>
  );
}
