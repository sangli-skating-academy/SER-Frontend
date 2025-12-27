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
  faTimes,
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faDollarSign,
  faCheckCircle,
  faCreditCard,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import ClassRegistrationsTable from "../Tables/ClassRegistrationsTable";

export default function AllClassRegistrations() {
  const [classRegistrations, setClassRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                onRowClick={handleStudentClick}
              />
            )}
          </div>
        </main>

        {/* Student Details Modal */}
        {showModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 mb-22">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in scrollbar-hide">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-pink-500 text-white p-6 rounded-t-2xl relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-3" />
                  Student Details
                </h2>
                <p className="text-sm mt-1 opacity-90">
                  Registration ID: #{selectedStudent.id}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-blue-500 mt-1 mr-3 w-5"
                      />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-semibold text-gray-900">
                          {selectedStudent.full_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-blue-500 mt-1 mr-3 w-5"
                      />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900 break-all">
                          {selectedStudent.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-blue-500 mt-1 mr-3 w-5"
                      />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-semibold text-gray-900">
                          {selectedStudent.phone_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FontAwesomeIcon
                        icon={faIdCard}
                        className="text-blue-500 mt-1 mr-3 w-5"
                      />
                      <div>
                        <p className="text-sm text-gray-600">Age & Gender</p>
                        <p className="font-semibold text-gray-900">
                          {selectedStudent.age} years • {selectedStudent.gender}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Information */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">
                    Membership Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="text-green-500 mt-1 mr-3 w-5"
                      />
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(selectedStudent.issue_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="text-green-500 mt-1 mr-3 w-5"
                      />
                      <div>
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(selectedStudent.end_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="text-green-500 mt-1 mr-3 w-5"
                      />
                      <div>
                        <p className="text-sm text-gray-600">Amount Paid</p>
                        <p className="font-bold text-green-600 text-xl">
                          ₹{selectedStudent.amount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-500 mt-1 mr-3 w-5"
                      />
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                            selectedStudent.status === "success"
                              ? "bg-green-100 text-green-800"
                              : selectedStudent.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedStudent.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">
                    Payment Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FontAwesomeIcon
                        icon={faCreditCard}
                        className="text-purple-500 mt-1 mr-3 w-5"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Payment ID</p>
                        <p className="font-mono text-sm text-gray-900 break-all">
                          {selectedStudent.razorpay_payment_id || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FontAwesomeIcon
                        icon={faCreditCard}
                        className="text-purple-500 mt-1 mr-3 w-5"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-mono text-sm text-gray-900 break-all">
                          {selectedStudent.razorpay_order_id || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="text-purple-500 mt-1 mr-3 w-5"
                      />
                      <div>
                        <p className="text-sm text-gray-600">
                          Registration Date
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(selectedStudent.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Associated User */}
                {selectedStudent.user_name && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">
                      Associated User Account
                    </h3>
                    <p className="text-gray-700">
                      <span className="font-semibold">Username:</span>{" "}
                      {selectedStudent.user_name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
