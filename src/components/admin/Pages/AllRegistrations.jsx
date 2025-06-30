import { useEffect, useState } from "react";
import { apiFetch } from "../../../services/api";
import Button from "../../ui/button";
import { useNavigate } from "react-router-dom";
import UserDetailsModal from "../Modals/UserDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import RegistrationsTable from "../Tables/RegistrationsTable";
import AdminLayout from "../layouts/AdminLayout";

export default function AllRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiFetch("/api/registrations/all")
      .then((res) => setRegistrations(res.registrations || res))
      .catch(() => setError("Failed to load registrations"))
      .finally(() => setLoading(false));
  }, []);

  const refreshData = () => {
    setLoading(true);
    apiFetch("/api/registrations/all")
      .then((res) => setRegistrations(res.registrations || res))
      .catch(() => setError("Failed to load registrations"))
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
            {loading ? (
              <div className="w-full h-40 animate-pulse bg-gray-200 rounded-md" />
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <RegistrationsTable
                data={registrations}
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
