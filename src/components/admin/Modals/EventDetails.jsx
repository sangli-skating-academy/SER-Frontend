import React from "react";
import Button from "../../ui/button";

export default function EventDetails({ event, onClose }) {
  if (!event) return null;
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
        <h2 className="text-2xl font-bold mb-4 text-blue-700">{event.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Description:</span>
              <div className="text-gray-800 whitespace-pre-line">
                {event.description || "-"}
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Location:</span>{" "}
              {event.location || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Date:</span>{" "}
              {event.start_date
                ? new Date(event.start_date).toLocaleDateString()
                : "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Gender:</span>{" "}
              {event.gender || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Age Group:</span>{" "}
              {event.age_group || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Type:</span>{" "}
              {event.is_team_event ? "Team" : "Individual"}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Price:</span>{" "}
              {event.price_per_person
                ? `₹${parseFloat(
                    event.price_per_person * (event.max_team_size || 1)
                  ).toFixed(2)}`
                : "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">
                Max Team Size:
              </span>{" "}
              {event.max_team_size || "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Featured:</span>{" "}
              {event.is_featured ? "Yes" : "No"}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="rounded-lg shadow w-full max-w-s object-cover mb-2"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-gray-600">
            Rules & Guidelines:
          </span>
          <div className="mt-2 space-y-2">
            <div>
              <span className="font-semibold">General Rules:</span>
              <ul className="list-disc list-inside text-gray-700">
                {(event.rules_and_guidelines?.general_rules?.length > 0
                  ? event.rules_and_guidelines.general_rules
                  : ["-"]
                ).map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold">Equipment Requirements:</span>
              <ul className="list-disc list-inside text-gray-700">
                {(event.rules_and_guidelines?.equipment_requirements?.length > 0
                  ? event.rules_and_guidelines.equipment_requirements
                  : ["-"]
                ).map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold">Scoring System:</span>
              <ul className="list-disc list-inside text-gray-700">
                {event.rules_and_guidelines?.scoring_system?.length > 0
                  ? event.rules_and_guidelines.scoring_system.map((s, i) => (
                      <li key={i}>
                        <span className="font-semibold">{s.title}:</span>{" "}
                        {s.desc}
                      </li>
                    ))
                  : ["-"]}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="solid"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold shadow"
            onClick={() => alert("Edit functionality coming soon!")}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            className="font-semibold shadow bg-red-100 text-red-600 hover:bg-red-200"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
