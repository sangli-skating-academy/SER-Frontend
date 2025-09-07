import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../../../services/api";
import AdminLayout from "../layouts/AdminLayout";
import Button from "../../ui/button";
import Skeleton from "../../ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faFileDownload,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import ClassRegistrationsTable from "../Tables/ClassRegistrationsTable";

export default function AllClassRegistrations() {
  const [classRegistrations, setClassRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const filteredRef = useRef(classRegistrations);
  filteredRef.current = classRegistrations;

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setLoading(true);
    apiFetch("/api/admin/class-registrations/all")
      .then((res) => {
        setClassRegistrations(res);
        setError(null);
      })
      .catch(() => {
        setError("Failed to fetch class registrations.");
        setClassRegistrations([]);
      })
      .finally(() => setLoading(false));
  };

  const exportToCSV = () => {
    const data = filteredRef.current;
    if (!data.length) return;
    // Get all unique keys from all objects (for wide tables)
    const allKeys = Array.from(
      data.reduce((set, row) => {
        Object.keys(row).forEach((k) => set.add(k));
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
      `class_registrations_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  if (error) return <div className="text-red-500">{error}</div>;

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
              <span className="text-32 sm:text-3xl font-bold mr-4">
                All Class Registrations
              </span>
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
                disabled={loading || !classRegistrations.length}
              >
                <FontAwesomeIcon
                  icon={faFileDownload}
                  className="mr-2 h-4 w-4"
                />
                Export CSV
              </Button>
            </div>
            {loading ? (
              <div className="w-full h-40 animate-pulse bg-gray-200 rounded-md" />
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <ClassRegistrationsTable
                data={classRegistrations}
                loading={false}
                onRowClick={(reg) => alert(`Viewing ${reg.id}`)}
              />
            )}
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}
