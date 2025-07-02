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

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Split events into active and closed
  const now = new Date();
  const activeEvents = events.filter((e) => new Date(e.start_date) >= now);
  const closedEvents = events.filter((e) => new Date(e.start_date) < now);

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
                <h2 className="text-2xl font-semibold mb-2 mt-6">
                  Active Events
                </h2>
                <EventsTable
                  data={activeEvents}
                  registrations={registrations}
                />
                <h2 className="text-2xl font-semibold mb-2 mt-10">
                  Closed Events
                </h2>
                <EventsTable
                  data={closedEvents}
                  registrations={registrations}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}
