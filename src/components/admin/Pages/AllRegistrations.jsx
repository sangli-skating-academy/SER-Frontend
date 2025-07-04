import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../../../services/api";
import Button from "../../ui/button";
import { useNavigate } from "react-router-dom";
import UserDetailsModal from "../Modals/UserDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faSearch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import RegistrationsTable from "../Tables/RegistrationsTable";
import AdminLayout from "../layouts/AdminLayout";

export default function AllRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    apiFetch("/api/admin/registrations/all")
      .then((res) => setRegistrations(res.registrations || res))
      .catch(() => setError("Failed to load registrations"))
      .finally(() => setLoading(false));
  }, []);

  const refreshData = () => {
    setLoading(true);
    apiFetch("/api/admin/registrations/all")
      .then((res) => setRegistrations(res.registrations || res))
      .catch(() => setError("Failed to load registrations"))
      .finally(() => setLoading(false));
  };

  // Compute unique values for dropdowns
  const eventTitles = useMemo(
    () =>
      Array.from(
        new Set(registrations.map((r) => r.event_title).filter(Boolean))
      ),
    [registrations]
  );
  const types = useMemo(
    () =>
      Array.from(
        new Set(registrations.map((r) => r.registration_type).filter(Boolean))
      ),
    [registrations]
  );
  const statuses = useMemo(
    () =>
      Array.from(new Set(registrations.map((r) => r.status).filter(Boolean))),
    [registrations]
  );
  const roles = useMemo(
    () =>
      Array.from(
        new Set(registrations.map((r) => r.user_role).filter(Boolean))
      ),
    [registrations]
  );

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      // Search by user name (case-insensitive, partial)
      const userName = reg.username || "";
      const matchesSearch = userName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      // Event filter
      const matchesEvent =
        eventFilter === "all" || reg.event_title === eventFilter;
      // Type filter
      const matchesType =
        typeFilter === "all" || reg.registration_type === typeFilter;
      // Status filter
      const matchesStatus =
        statusFilter === "all" || reg.status === statusFilter;
      // Role filter
      const matchesRole = roleFilter === "all" || reg.user_role === roleFilter;
      return (
        matchesSearch &&
        matchesEvent &&
        matchesType &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [
    registrations,
    searchTerm,
    eventFilter,
    typeFilter,
    statusFilter,
    roleFilter,
  ]);

  return (
    <AdminLayout>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <main className="flex-grow py-10 relative z-10">
          <div className="container mx-auto px-2 md:px-6">
            {/* <div className="flex items-center mb-6 gap-2"> */}
            <button
              onClick={() => navigate(-1)}
              className="mr-4 px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold shadow transition mb-3"
            >
              &larr; Back
            </button>
            <div className="flex items-center mb-6 gap-2">
              <h1 className="text-3xl font-bold mr-4">All Registrations</h1>
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
            </div>
            {/* Filter Bar */}
            <div
              className="mb-8 bg-white/90 p-4 rounded-lg shadow-sm animate-fade-in-up"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-end w-full">
                <div className="flex-1 min-w-[160px]">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Search User
                  </label>
                  <div className="relative">
                    <input
                      id="search"
                      placeholder="Search by user name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 h-[40px] border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all text-base"
                    />
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label
                    htmlFor="event"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Event
                  </label>
                  <select
                    id="event"
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all text-base px-3 py-2 h-[40px]"
                  >
                    <option value="all">All Events</option>
                    {eventTitles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[110px]">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type
                  </label>
                  <select
                    id="type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all text-base px-3 py-2 h-[40px]"
                  >
                    <option value="all">All Types</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[110px]">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all text-base px-3 py-2 h-[40px]"
                  >
                    <option value="all">All Statuses</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[110px]">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all text-base px-3 py-2 h-[40px]"
                  >
                    <option value="all">All Roles</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-43 h-[40px]"
                    onClick={() => {
                      setSearchTerm("");
                      setEventFilter("all");
                      setTypeFilter("all");
                      setStatusFilter("all");
                      setRoleFilter("all");
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />{" "}
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
            {loading ? (
              <div className="w-full h-40 animate-pulse bg-gray-200 rounded-md" />
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <RegistrationsTable
                data={filteredRegistrations}
                onRowClick={(reg) => {
                  setSelectedReg(reg);
                  setModalOpen(true);
                }}
              />
            )}
          </div>
        </main>
      </div>
      <UserDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedReg={selectedReg}
      />
    </AdminLayout>
  );
}
