import React from "react";
import Button from "../../ui/button";
import { useNavigate } from "react-router-dom";

export default function EventDetails({ event, onClose }) {
  const navigate = useNavigate();
  if (!event) return null;

  const handleEdit = () => {
    // Navigate to ManageEvent page, passing event data as state
    navigate("/admin/addevent", { state: { event } });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2 backdrop-blur-sm mb-22"
      style={{ paddingTop: "4vh", paddingBottom: "4vh" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-0 relative animate-fade-in-up overflow-y-auto border border-blue-100"
        style={{ maxHeight: "85vh" }}
      >
        <div className="p-8 pt-6 flex flex-col gap-4 relative">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition"
            onClick={onClose}
            aria-label="Close"
            tabIndex={0}
          >
            &times;
          </button>
          <h2 className="text-3xl font-extrabold mb-2 text-blue-800 flex items-center gap-2 tracking-tight">
            {event.title}
          </h2>
          <div className="mb-2 text-gray-600 text-base leading-relaxed whitespace-pre-line">
            <span className="font-semibold text-gray-700">
              Event Description
            </span>
            <div>
              {event.description || (
                <span className="italic text-gray-400">
                  No description provided.
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-8">
              <div className="bg-white border border-blue-100 rounded-xl shadow p-4 mb-2 w-full">
                <span className="font-semibold text-gray-700 block mb-2">
                  Event Categories
                </span>
                <ul className="list-disc list-inside text-gray-800 ml-4">
                  {(() => {
                    const cat = event.event_category;
                    if (!cat) return [<li key="none">-</li>];
                    let obj = cat;
                    if (typeof obj === "string") {
                      try {
                        obj = JSON.parse(obj);
                      } catch {
                        return [<li key="str">{obj}</li>];
                      }
                    }
                    if (typeof obj === "object" && obj !== null) {
                      return Object.entries(obj).map(([key, arr]) => (
                        <li key={key}>
                          <span className="font-semibold">{key}:</span>{" "}
                          {Array.isArray(arr) ? arr.join(", ") : arr}
                        </li>
                      ));
                    }
                    return [<li key="none">-</li>];
                  })()}
                </ul>
              </div>
            </div>
            <div className="flex flex-row gap-8">
              <div className="bg-white border border-pink-100 rounded-xl shadow p-4 mb-2 w-full">
                <span className="font-semibold text-gray-700 block mb-2">
                  Skate Categories
                </span>
                <ul className="list-disc list-inside text-gray-800 ml-4">
                  {(() => {
                    let arr = event.skate_category;
                    if (!arr) return [<li key="none">-</li>];
                    if (Array.isArray(arr)) {
                      return arr.length > 0
                        ? arr.map((cat, i) => <li key={i}>{cat}</li>)
                        : [<li key="none">-</li>];
                    }
                    if (typeof arr === "string") {
                      try {
                        const parsed = JSON.parse(arr);
                        if (Array.isArray(parsed)) {
                          return parsed.length > 0
                            ? parsed.map((cat, i) => <li key={i}>{cat}</li>)
                            : [<li key="none">-</li>];
                        }
                        return [<li key="str">{arr}</li>];
                      } catch {
                        return [<li key="str">{arr}</li>];
                      }
                    }
                    return [<li key="none">-</li>];
                  })()}
                </ul>
              </div>
            </div>
          </div>
          {/* Event Image */}
          <div className="w-full flex justify-center">
            <div className="sm:w-72 w-full flex-shrink-0">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="rounded-xl shadow-lg w-full object-cover border border-blue-200"
                  style={{ minHeight: "180px", maxHeight: "260px" }}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-lg font-semibold border border-blue-100">
                  No Image
                </div>
              )}
            </div>
          </div>
          {/* Basic Info Row */}
          <div className="flex flex-col sm:flex-row gap-6 items-start mb-2 w-full">
            {/* Event Info - now takes full width on all screens */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700">Location</span>
                <span className="text-gray-800">{event.location || "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700">Type</span>
                <span className="text-blue-700 font-semibold">
                  {event.is_team_event ? "Team" : "Individual"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700">Gender</span>
                <span className="text-gray-800">{event.gender || "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700">Age Group</span>
                <span className="text-gray-800">
                  {Array.isArray(event.age_group)
                    ? event.age_group.join(", ")
                    : typeof event.age_group === "string"
                    ? event.age_group
                    : "-"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700">
                  Max Team Size
                </span>
                <span className="text-gray-800">
                  {event.max_team_size || "-"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700">Featured</span>
                <span
                  className={
                    event.is_featured
                      ? "text-green-600 font-bold"
                      : "text-gray-400"
                  }
                >
                  {event.is_featured ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700">
                  Price (per person)
                </span>
                <span className="text-gray-800">
                  {event.price_per_person
                    ? `₹${parseFloat(event.price_per_person).toFixed(2)}`
                    : "-"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700">
                  Total Team Fee
                </span>
                <span className="text-gray-800">
                  {event.price_per_person && event.max_team_size
                    ? `₹${parseFloat(
                        event.price_per_person * event.max_team_size
                      ).toFixed(2)}`
                    : "-"}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Start Date:</span>
                <span className="ml-2">
                  {event.start_date
                    ? new Date(event.start_date).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Start Time:</span>
                <span className="ml-2">
                  {event.start_time ? event.start_time : "-"}
                </span>
              </div>
            </div>
          </div>
          {/* Event Time */}

          {/* Hashtags */}
          {Array.isArray(event.hashtags) && event.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {event.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-blue-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {/* Rules & Guidelines */}
          <div className="mt-4">
            <label className="block font-bold text-blue-700 mb-2 text-lg">
              Rules & Guidelines
            </label>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">
                  General Rules:
                </span>
                <ul className="list-disc list-inside text-gray-700 ml-4 mt-1">
                  {(event.rules_and_guidelines?.general_rules?.length > 0
                    ? event.rules_and_guidelines.general_rules
                    : ["-"]
                  ).map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Equipment Requirements:
                </span>
                <ul className="list-disc list-inside text-gray-700 ml-4 mt-1">
                  {(event.rules_and_guidelines?.equipment_requirements?.length >
                  0
                    ? event.rules_and_guidelines.equipment_requirements
                    : ["-"]
                  ).map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="outline"
              className="font-semibold shadow bg-red-100 text-red-600 hover:bg-red-200 px-8 py-2 text-lg rounded-full transition"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="solid"
              className="font-semibold shadow bg-blue-500 text-white hover:bg-blue-600 px-8 py-2 text-lg rounded-full transition"
              onClick={handleEdit}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
