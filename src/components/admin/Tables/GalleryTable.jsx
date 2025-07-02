import { useState } from "react";
import Button from "../../ui/button";
import EditGallery from "../Modals/EditGallery";
import { apiFetch } from "../../../services/api";

export default function GalleryTable({
  data = [],
  rowLimit = 5,
  onRowClick,
  onRefresh,
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [editGallery, setEditGallery] = useState(null);
  const [deletePending, setDeletePending] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Sort data by uploaded_at descending (latest first)
  const sortedData = [...data].sort((a, b) => {
    const aTime = a.uploaded_at ? new Date(a.uploaded_at).getTime() : 0;
    const bTime = b.uploaded_at ? new Date(b.uploaded_at).getTime() : 0;
    return bTime - aTime;
  });

  // Save handler for edit modal
  const handleEditSave = async (formData, id) => {
    await apiFetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      body: formData,
    });
    if (onRefresh) onRefresh();
  };

  // Delete handler for gallery item
  const handleDelete = async (item) => {
    setDeleting(true);
    await apiFetch(`/api/admin/gallery/${item.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setDeletePending(null);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="bg-white/90 rounded-xl shadow-lg border overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 via-pink-50 to-blue-100">
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Event Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Uploaded At
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {(rowLimit ? sortedData.slice(0, rowLimit) : sortedData).map(
            (item, idx) => (
              <tr
                key={item.id || idx}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 transition-colors duration-200 cursor-pointer"
                onClick={() => onRowClick && onRowClick(item)}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <a
                    href={
                      item.image_url && !item.image_url.startsWith("http")
                        ? `$
                            {import.meta.env.VITE_API_URL || "http://localhost:3000"}${
                              item.image_url.startsWith("/") ? "" : "/"
                            }${item.image_url}`
                        : item.image_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={
                        item.image_url && !item.image_url.startsWith("http")
                          ? `$
                              {import.meta.env.VITE_API_URL || "http://localhost:3000"}${
                                item.image_url.startsWith("/") ? "" : "/"
                              }${item.image_url}`
                          : item.image_url
                      }
                      alt={item.title}
                      className="h-12 w-20 object-cover rounded shadow"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </a>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{item.title}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {item.event_name || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {item.date ? new Date(item.date).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {item.uploaded_at
                    ? new Date(item.uploaded_at).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 text-xs font-semibold shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditGallery(item);
                      setEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletePending(item);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <EditGallery
        open={editOpen}
        onClose={() => setEditOpen(false)}
        gallery={editGallery}
        onSave={handleEditSave}
      />
      {/* Custom Delete Confirmation Modal */}
      {deletePending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative animate-fade-in-up">
            <h2 className="text-lg font-bold mb-2 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletePending.title}</span>?
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-100 text-gray-700"
                onClick={() => setDeletePending(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-red-100 text-red-600"
                onClick={() => handleDelete(deletePending)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
