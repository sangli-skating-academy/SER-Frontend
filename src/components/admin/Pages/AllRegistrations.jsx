import { useEffect, useState, useMemo, useRef } from "react";
import { apiFetch } from "../../../services/api";
import Button from "../../ui/button";
import { useNavigate } from "react-router-dom";
import UserDetailsModal from "../Modals/UserDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faSearch,
  faFilter,
  faFileDownload,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import RegistrationsTable from "../Tables/RegistrationsTable";
import AdminLayout from "../layouts/AdminLayout";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { saveAs } from "file-saver";

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
  const [statusFilter, setStatusFilter] = useState("confirmed");

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

  // Compute unique event titles for live events only
  const eventTitles = useMemo(() => {
    // Only include event titles where the event is live
    return Array.from(
      new Set(
        registrations
          .filter((r) => r.live === true || r.live === "TRUE")
          .map((r) => r.event_title)
          .filter(Boolean)
      )
    );
  }, [registrations]);
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

      return matchesSearch && matchesEvent && matchesType && matchesStatus;
    });
  }, [registrations, searchTerm, eventFilter, typeFilter, statusFilter]);

  const filteredRef = useRef(filteredRegistrations);
  filteredRef.current = filteredRegistrations;

  // CSV Export helper
  function exportToCSV() {
    const data = filteredRef.current;
    if (!data.length) return;

    // Fields to exclude from export
    const excludeFields = [
      "user_id",
      "team_id",
      "event_id",
      "user_details_id",
      "event_location",
      "event_start_date",
      "event_hashtags",
      "live",
      "user_role",
    ];

    // Get all unique keys from all objects and exclude unwanted fields
    const allKeys = Array.from(
      data.reduce((set, row) => {
        Object.keys(row).forEach((k) => {
          if (!excludeFields.includes(k)) {
            set.add(k);
          }
        });
        return set;
      }, new Set())
    );

    // CSV header
    const header = allKeys.join(",");

    // CSV rows
    const rows = data.map((row) =>
      allKeys
        .map((k) => {
          let val = row[k];
          if (val === null || val === undefined) return "";

          // Handle team members array properly
          if (k === "team_members" && Array.isArray(val)) {
            val = val
              .map((member, index) => {
                if (typeof member === "object" && member !== null) {
                  // Debug: Log the member structure (remove this in production)
                  if (index === 0) {
                    console.log("Team member structure:", Object.keys(member));
                    console.log("Sample member:", member);
                  }

                  // Try different possible field combinations
                  const name = `${
                    member.first_name || member.firstName || ""
                  } ${member.last_name || member.lastName || ""}`.trim();

                  const username = member.username || member.user_name || "";
                  const email = member.email || "";
                  const fullName = member.full_name || member.fullName || "";
                  const memberName = member.name || "";

                  // Return the first available meaningful value
                  return (
                    name ||
                    fullName ||
                    memberName ||
                    username ||
                    email ||
                    `Member ${member.id || member.user_id || index + 1}`
                  );
                }
                return String(member);
              })
              .join("; ");
          }
          // Handle other arrays
          else if (Array.isArray(val)) {
            val = val.join("; ");
          }
          // Handle objects
          else if (typeof val === "object" && val !== null) {
            val = JSON.stringify(val);
          }

          val = String(val).replace(/"/g, '""');
          if (val.includes(",") || val.includes("\n") || val.includes('"')) {
            return `"${val}"`;
          }
          return val;
        })
        .join(",")
    );

    const csv = [header, ...rows].join("\n");
    // Download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(
      blob,
      `registrations_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
  }

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
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back
            </button>
            <div className="flex items-center mb-6 gap-2">
              <h1 className="text-32 sm:text-3xl font-bold mr-4">
                All Registrations
              </h1>
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
                onClick={exportToCSV}
                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition-transform"
                disabled={loading || !filteredRegistrations.length}
              >
                <FontAwesomeIcon
                  icon={faFileDownload}
                  className="mr-2 h-4 w-4"
                />
                Export CSV
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
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Events" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      {eventTitles.map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[110px]">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type
                  </label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 w-full sm:w-43 h-[40px]
                    ${
                      searchTerm !== "" ||
                      eventFilter !== "all" ||
                      typeFilter !== "all"
                        ? "border-red-300 bg-red-50 text-red-500"
                        : ""
                    }
                    `}
                    onClick={() => {
                      setSearchTerm("");
                      setEventFilter("all");
                      setTypeFilter("all");
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
