import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/button";
import { apiFetch } from "../../../services/api";
import AdminLayout from "../layouts/AdminLayout";
import Skeleton from "../../ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";

export default function AllContactMessage() {
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
      setMessages([]);
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
              className="mr-4 px-4 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold shadow transition"
            >
              &larr; Back
            </button>
            <div className="flex items-center mb-6 gap-2">
              <h1 className="text-3xl font-bold mr-4">All Contact Messages</h1>
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
                      </tr>
                    ))}
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
