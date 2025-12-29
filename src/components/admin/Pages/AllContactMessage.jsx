import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/button";
import { apiFetch } from "../../../services/api";
import AdminLayout from "../layouts/AdminLayout";
import Skeleton from "../../ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function AllContactMessage() {
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    message: null,
  });

  const handleDelete = (message) => {
    setDeleteConfirm({ show: true, message });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.message) return;
    try {
      await apiFetch(`/api/admin/contact/${deleteConfirm.message.id}`, {
        method: "DELETE",
      });
      setDeleteConfirm({ show: false, message: null });
      fetchMessages();
    } catch {
      setDeleteConfirm({ show: false, message: null });
      alert("Failed to delete message.");
    }
  };

  const cancelDelete = () => setDeleteConfirm({ show: false, message: null });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/admin/contact/all");
      setMessages(res.messages || res || []);
    } catch (err) {
      setMessages([err.message]);
      setError("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

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
                All Contact Messages
              </h1>
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={fetchMessages}
                disabled={loading}
                className="transition-all hover:scale-105 shadow"
              >
                <FontAwesomeIcon
                  icon={faSyncAlt}
                  spin={loading}
                  className="mr-2 h-4 w-4"
                />
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
            {loading ? (
              <Skeleton className="w-full h-40" />
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="bg-white/90 rounded-xl shadow-lg border overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 via-pink-50 to-blue-100">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((message) => (
                      <tr key={message.id} className="border-b">
                        <td className="px-4 py-3 text-sm text-black">
                          {message.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          {message.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          {message.phone || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          {message.subject}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          {message.message}
                        </td>
                        <td className="px-4 py-3 text-sm text-black">
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                            onClick={() => handleDelete(message)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {deleteConfirm.show && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center gap-4">
                          <h3 className="text-lg font-bold text-red-600 mb-2">
                            Confirm Delete
                          </h3>
                          <p className="text-gray-700 mb-4">
                            Are you sure you want to delete this message?
                          </p>
                          <div className="flex gap-4">
                            <Button
                              className="bg-red-500 text-white"
                              onClick={confirmDelete}
                            >
                              Delete
                            </Button>
                            <Button variant="outline" onClick={cancelDelete}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}
