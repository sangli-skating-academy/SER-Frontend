import React, { useState } from "react";
import Button from "../../ui/button";
import { apiFetch } from "../../../services/api";

export default function EventDetails({ event, onClose, onEventUpdated }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(event || {});
  const [saving, setSaving] = useState(false);

  if (!event) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiFetch(`/api/admin/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditMode(false);
      if (onEventUpdated) onEventUpdated(res.event);
    } catch (err) {
      // Optionally handle error UI here
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2"
      style={{ paddingTop: "4vh", paddingBottom: "4vh" }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full p-8 relative animate-fade-in-up overflow-y-auto"
        style={{ maxHeight: "80vh" }}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
          {editMode ? (
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="border-b border-blue-400 px-2 py-1 w-full font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              placeholder="Event Title"
              autoFocus
            />
          ) : (
            event.title
          )}
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-600 mb-1">
                Description
              </label>
              {editMode ? (
                <textarea
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  rows={3}
                  placeholder="Event description..."
                />
              ) : (
                <div className="text-gray-800 whitespace-pre-line min-h-[2.5rem]">
                  {event.description || "-"}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block font-semibold text-gray-600 mb-1">
                  Location
                </label>
                {editMode ? (
                  <input
                    name="location"
                    value={form.location || ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="Location"
                  />
                ) : (
                  <span>{event.location || "-"}</span>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-gray-600 mb-1">
                  Date
                </label>
                {editMode ? (
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date ? form.start_date.slice(0, 10) : ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  />
                ) : event.start_date ? (
                  <span>{new Date(event.start_date).toLocaleDateString()}</span>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block font-semibold text-gray-600 mb-1">
                  Gender
                </label>
                {editMode ? (
                  <select
                    name="gender"
                    value={form.gender || ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span>{event.gender || "-"}</span>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-gray-600 mb-1">
                  Age Group
                </label>
                {editMode ? (
                  <input
                    name="age_group"
                    value={form.age_group || ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="Age group"
                  />
                ) : (
                  <span>{event.age_group || "-"}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block font-semibold text-gray-600 mb-1">
                  Type
                </label>
                {editMode ? (
                  <select
                    name="is_team_event"
                    value={form.is_team_event ? "true" : "false"}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        is_team_event: e.target.value === "true",
                      }))
                    }
                    className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <option value="false">Individual</option>
                    <option value="true">Team</option>
                  </select>
                ) : event.is_team_event ? (
                  <span>Team</span>
                ) : (
                  <span>Individual</span>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-gray-600 mb-1">
                  Price (per person)
                </label>
                {editMode ? (
                  <input
                    type="number"
                    name="price_per_person"
                    value={form.price_per_person || ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="₹"
                  />
                ) : event.price_per_person ? (
                  <span>
                    {`₹${parseFloat(
                      event.price_per_person * (event.max_team_size || 1)
                    ).toFixed(2)}`}
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block font-semibold text-gray-600 mb-1">
                  Max Team Size
                </label>
                {editMode ? (
                  <input
                    type="number"
                    name="max_team_size"
                    value={form.max_team_size || ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    placeholder="Max team size"
                  />
                ) : (
                  <span>{event.max_team_size || "-"}</span>
                )}
              </div>
              <div className="flex-1 flex items-center gap-2 mt-6">
                <label className="font-semibold text-gray-600">Featured</label>
                {editMode ? (
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={!!form.is_featured}
                    onChange={handleChange}
                    className="accent-blue-500 h-5 w-5"
                  />
                ) : event.is_featured ? (
                  <span className="text-green-600 font-bold">Yes</span>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <label className="block font-semibold text-gray-600 mb-1">
              Image
            </label>
            {editMode ? (
              <input
                name="image_url"
                value={form.image_url || ""}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Image URL"
              />
            ) : event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="rounded-lg shadow w-full max-w-xs object-cover mb-2"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <div className="mt-4">
              <label className="block font-semibold text-gray-600 mb-1">
                Rules & Guidelines
              </label>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">General Rules:</span>
                  {editMode ? (
                    <textarea
                      name="rules_and_guidelines.general_rules"
                      value={
                        form.rules_and_guidelines?.general_rules?.join("\n") ||
                        ""
                      }
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          rules_and_guidelines: {
                            ...f.rules_and_guidelines,
                            general_rules: e.target.value.split("\n"),
                          },
                        }))
                      }
                      className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                      rows={2}
                      placeholder="One rule per line"
                    />
                  ) : (
                    <ul className="list-disc list-inside text-gray-700">
                      {(event.rules_and_guidelines?.general_rules?.length > 0
                        ? event.rules_and_guidelines.general_rules
                        : ["-"]
                      ).map((rule, i) => (
                        <li key={i}>{rule}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <span className="font-semibold">Equipment Requirements:</span>
                  {editMode ? (
                    <textarea
                      name="rules_and_guidelines.equipment_requirements"
                      value={
                        form.rules_and_guidelines?.equipment_requirements?.join(
                          "\n"
                        ) || ""
                      }
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          rules_and_guidelines: {
                            ...f.rules_and_guidelines,
                            equipment_requirements: e.target.value.split("\n"),
                          },
                        }))
                      }
                      className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                      rows={2}
                      placeholder="One requirement per line"
                    />
                  ) : (
                    <ul className="list-disc list-inside text-gray-700">
                      {(event.rules_and_guidelines?.equipment_requirements
                        ?.length > 0
                        ? event.rules_and_guidelines.equipment_requirements
                        : ["-"]
                      ).map((rule, i) => (
                        <li key={i}>{rule}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <span className="font-semibold">Scoring System:</span>
                  {editMode ? (
                    <textarea
                      name="rules_and_guidelines.scoring_system"
                      value={
                        form.rules_and_guidelines?.scoring_system
                          ?.map((s) => `${s.title}: ${s.desc}`)
                          .join("\n") || ""
                      }
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          rules_and_guidelines: {
                            ...f.rules_and_guidelines,
                            scoring_system: e.target.value
                              .split("\n")
                              .map((line) => {
                                const [title, ...desc] = line.split(":");
                                return {
                                  title: title?.trim() || "",
                                  desc: desc.join(":").trim(),
                                };
                              }),
                          },
                        }))
                      }
                      className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                      rows={2}
                      placeholder="Format: Title: Description"
                    />
                  ) : (
                    <ul className="list-disc list-inside text-gray-700">
                      {event.rules_and_guidelines?.scoring_system?.length > 0
                        ? event.rules_and_guidelines.scoring_system.map(
                            (s, i) => (
                              <li key={i}>
                                <span className="font-semibold">
                                  {s.title}:
                                </span>{" "}
                                {s.desc}
                              </li>
                            )
                          )
                        : ["-"]}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-4 mt-6">
          {editMode ? (
            <>
              <Button
                variant="solid"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold shadow px-6 py-2 text-lg"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                className="font-semibold shadow bg-gray-100 text-gray-600 hover:bg-gray-200 px-6 py-2 text-lg"
                onClick={() => {
                  setEditMode(false);
                  setForm(event);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="solid"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold shadow px-6 py-2 text-lg"
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          )}
          <Button
            variant="outline"
            className="font-semibold shadow bg-red-100 text-red-600 hover:bg-red-200 px-6 py-2 text-lg"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
