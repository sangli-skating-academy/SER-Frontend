import { useEffect, useState } from "react";
import Button from "../../ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../../ui/select";

export default function EditGallery({ open, onClose, gallery, onSave }) {
  const [form, setForm] = useState({
    title: "",
    event_name: "",
    image_url: "",
    date: "",
    file: null,
    image_location: "",
  });
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (gallery) {
      setForm({
        title: gallery.title || "",
        event_name: gallery.event_name || "",
        image_url: gallery.image_url || "",
        date: gallery.date ? gallery.date.slice(0, 10) : "",
        file: null,
        image_location: gallery.image_location || "",
      });
      setPreview(gallery.image_url || "");
    }
  }, [gallery, open]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file" && files[0]) {
      setForm((f) => ({ ...f, file: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("event_name", form.event_name);
      formData.append("date", form.date);
      formData.append("image_location", form.image_location);
      if (form.file) formData.append("file", form.file);
      // Use /api/admin/gallery/:id for PATCH
      await onSave(formData, gallery.id);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in-up">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Gallery Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Event Name
            </label>
            <input
              type="text"
              name="event_name"
              value={form.event_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter event name (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Image</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="h-24 mt-2 rounded shadow border"
              />
            )}
            {form.image_url && !form.file && (
              <div className="text-xs text-gray-500 mt-1">
                Current image shown above
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Image Location
            </label>
            <Select
              value={form.image_location || ""}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, image_location: value }))
              }
            >
              <SelectTrigger className="w-full border rounded px-3 py-2">
                <span>{form.image_location || "Select location"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home_screen">Home Screen</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              className="text-red-500 bg-red-100"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-green-500 bg-green-100"
              variant="outline"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
