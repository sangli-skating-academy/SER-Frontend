import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import Button from "../../ui/button";
import Skeleton from "../../ui/skeleton";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../services/api";
import GalleryTable from "../Tables/GalleryTable";

export default function AllGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
                onClick={() => navigate("/admin/addgallery")}
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
              <GalleryTable data={gallery} rowLimit={null} />
            )}
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}
