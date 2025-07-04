import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import Button from "../../ui/button";
import Skeleton from "../../ui/skeleton";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../services/api";
import GalleryTable from "../Tables/GalleryTable";
import EditGallery from "../Modals/EditGallery";

export default function AllGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiFetch("/api/gallery/all")
      .then((res) => setGallery(res || []))
      .catch(() => setError("Failed to load gallery items"))
      .finally(() => setLoading(false));
  }, []);

  const refreshData = () => {
    setLoading(true);
    apiFetch("/api/gallery/all")
      .then((res) => setGallery(res || []))
      .catch(() => setError("Failed to load gallery items"))
      .finally(() => setLoading(false));
  };

  // Add handler for saving new gallery item
  const handleAddGallery = async (formData) => {
    await apiFetch("/api/admin/gallery/add", {
      method: "POST",
      body: formData,
      isFormData: true,
      credentials: "include",
    });
    refreshData();
  };

  // Filter states
  const [eventFilter, setEventFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Compute unique event names and years
  const eventNames = Array.from(
    new Set(gallery.map((g) => g.event_name).filter(Boolean))
  );
  const years = Array.from(
    new Set(
      gallery
        .map((g) => {
          // Try to get year from event_year, or from image date, or fallback to created_at
          if (g.event_year) return g.event_year;
          if (g.created_at) return new Date(g.created_at).getFullYear();
          if (g.date) return new Date(g.date).getFullYear();
          return null;
        })
        .filter(Boolean)
    )
  ).sort((a, b) => b - a);

  // Filtered gallery
  const filteredGallery = gallery.filter((g) => {
    const matchesEvent = eventFilter === "all" || g.event_name === eventFilter;
    let itemYear =
      g.event_year ||
      (g.created_at && new Date(g.created_at).getFullYear()) ||
      (g.date && new Date(g.date).getFullYear());
    const matchesYear =
      yearFilter === "all" || String(itemYear) === String(yearFilter);
    return matchesEvent && matchesYear;
  });

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
            {/* Filter Bar */}
            <div
              className="mb-8 bg-white/90 p-4 rounded-lg shadow-sm animate-fade-in-up"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-end w-full">
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
                    {eventNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[110px]">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Year
                  </label>
                  <select
                    id="year"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all text-base px-3 py-2 h-[40px]"
                  >
                    <option value="all">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-43 h-[40px]"
                    onClick={() => {
                      setEventFilter("all");
                      setYearFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center mb-6 gap-2">
              <h1 className="text-3xl font-bold mr-4">All Gallery Items</h1>
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
                onClick={() => setAddModalOpen(true)}
              >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-4 w-4" />
                Add Gallery Item
              </Button>
            </div>
            {loading ? (
              <Skeleton className="w-full h-40" />
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <GalleryTable
                data={filteredGallery}
                rowLimit={null}
                onRefresh={refreshData}
              />
            )}
          </div>
          {/* Add Gallery Modal */}
          <EditGallery
            open={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            gallery={{ title: "", event_name: "", image_url: "" }}
            onSave={async (formData) => {
              await handleAddGallery(formData);
              setAddModalOpen(false);
            }}
          />
        </main>
      </div>
    </AdminLayout>
  );
}
