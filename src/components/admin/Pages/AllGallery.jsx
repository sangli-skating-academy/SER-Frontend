import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import Button from "../../ui/button";
import Skeleton from "../../ui/skeleton";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faPlusCircle,
  faFilter,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../services/api";
import GalleryTable from "../Tables/GalleryTable";
import EditGallery from "../Modals/EditGallery";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";

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

  const homeScreenGallery = gallery.filter(
    (g) => g.image_location === "home_screen"
  );
  const galleryItems = gallery.filter((g) => g.image_location === "gallery");

  return (
    <AdminLayout>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <main className="flex-grow py-10 relative z-10">
          <div className="container mx-auto px-2 md:px-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold shadow transition mb-3"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back
            </button>
            <div className="flex items-center mb-6 gap-2">
              <h1 className="text-32 sm:text-3xl font-bold mr-4">
                All Gallery Items
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
                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition-transform"
                onClick={() => setAddModalOpen(true)}
              >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-4 w-4" />
                Add Gallery Item
              </Button>
            </div>
            {/* Filter Bar moved below the title */}
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
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Events" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      {eventNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[110px]">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Year
                  </label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 w-full sm:w-43 h-[40px] ${
                      eventFilter !== "all" || yearFilter !== "all"
                        ? "border-red-300 bg-red-50 text-red-500"
                        : ""
                    }`}
                    onClick={() => {
                      setEventFilter("all");
                      setYearFilter("all");
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
            {loading ? (
              <Skeleton className="w-full h-40" />
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Home Screen Items
                </h2>
                <GalleryTable
                  data={homeScreenGallery}
                  rowLimit={null}
                  onRefresh={refreshData}
                />

                <h2 className="text-xl font-semibold mt-8 mb-4">
                  Gallery Items
                </h2>
                <GalleryTable
                  data={galleryItems}
                  rowLimit={null}
                  onRefresh={refreshData}
                />
              </>
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
