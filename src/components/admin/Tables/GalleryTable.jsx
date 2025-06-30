import Button from "../../ui/button";
export default function GalleryTable({ data = [], rowLimit = 5, onRowClick }) {
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
              Event
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
          {(rowLimit ? data.slice(0, rowLimit) : data).map((item, idx) => (
            <tr
              key={item.id || idx}
              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 transition-colors duration-200 cursor-pointer"
              onClick={() => onRowClick && onRowClick(item)}
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <a
                  href={
                    item.image_url && !item.image_url.startsWith("http")
                      ? `${
                          import.meta.env.VITE_API_URL ||
                          "http://localhost:3000"
                        }${item.image_url.startsWith("/") ? "" : "/"}${
                          item.image_url
                        }`
                      : item.image_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={
                      item.image_url && !item.image_url.startsWith("http")
                        ? `${
                            import.meta.env.VITE_API_URL ||
                            "http://localhost:3000"
                          }${item.image_url.startsWith("/") ? "" : "/"}${
                            item.image_url
                          }`
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
                {item.event_title || "-"}
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
                    // TODO: Implement edit event logic
                    alert(`Edit event: ${event.title}`);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement delete event logic
                    alert(`Delete event: ${event.title}`);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
