import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "../../ui/input";
import Button from "../../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { useToast } from "../../../hooks/use-toasts";
import { apiFetch } from "../../../services/api";

const initialForm = {
  title: "",
  description: "",
  start_date: "",
  start_time: "", // <-- add this field
  location: "",
  hashtags: [], // for category/tags (array)
  age_group: "",
  gender: "",
  price_per_person: "",
  price_per_team: "", // <-- add this field
  max_team_size: "",
  is_team_event: false,
  is_featured: false,
  file: null, // for image upload
};

const hashtagOptions = [
  "inline-skating",
  "roller-skating",
  "freestyle",
  "speed-skating",
  "youth",
  "adult",
  "team",
  // Add more as needed
];
const ageGroups = ["Under 10", "Under 12", "Under 18", "Adult", "All Ages"];
const genders = ["Male", "Female", "Mixed"];

// Helper to convert UTC/ISO date string to local yyyy-mm-dd for input type="date"
function toLocalYYYYMMDD(dateStringOrDate) {
  const d =
    typeof dateStringOrDate === "string"
      ? new Date(dateStringOrDate)
      : dateStringOrDate;
  if (isNaN(d)) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AddEvent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  // If coming from EventDetails, event data will be in location.state.event
  const eventToEdit = location.state?.event;

  // State
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [generalRules, setGeneralRules] = useState([""]);
  const [equipmentRequirements, setEquipmentRequirements] = useState([""]);
  const [customHashtagInput, setCustomHashtagInput] = useState("");

  // Populate form if editing
  useEffect(() => {
    if (eventToEdit) {
      setForm((prev) => {
        let start_date = eventToEdit.start_date;
        if (start_date) {
          start_date = toLocalYYYYMMDD(start_date);
        } else {
          start_date = "";
        }
        return {
          ...prev,
          ...eventToEdit,
          start_date: start_date,
          start_time: eventToEdit.start_time || "",
          file: null, // don't prefill file
          price_per_team:
            eventToEdit.price_per_team ||
            (eventToEdit.price_per_person && eventToEdit.max_team_size
              ? (
                  Number(eventToEdit.price_per_person) *
                  Number(eventToEdit.max_team_size)
                ).toFixed(2)
              : ""),
        };
      });
      setPreview(eventToEdit.image_url || "");
      // Rules & Guidelines
      setGeneralRules(
        eventToEdit.rules_and_guidelines?.general_rules?.length > 0
          ? eventToEdit.rules_and_guidelines.general_rules
          : [""]
      );
      setEquipmentRequirements(
        eventToEdit.rules_and_guidelines?.equipment_requirements?.length > 0
          ? eventToEdit.rules_and_guidelines.equipment_requirements
          : [""]
      );
    }
  }, [eventToEdit]);

  // Automatically calculate team fee when price_per_person or max_team_size changes
  const updateTeamFee = (person, teamSize) => {
    const fee =
      !isNaN(Number(person)) && !isNaN(Number(teamSize)) && teamSize > 0
        ? (Number(person) * Number(teamSize)).toFixed(2)
        : "";
    setForm((prev) => ({ ...prev, price_per_team: fee }));
  };

  // Capitalize first letter of every input value (except for checkboxes, files, and arrays)
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "file" && files && files[0]) {
      setForm((prev) => ({ ...prev, file: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => {
        let newValue = value;
        // Only capitalize for string fields, not arrays or numbers
        if (
          typeof newValue === "string" &&
          newValue.length > 0 &&
          name !== "hashtags" &&
          name !== "price_per_person" &&
          name !== "price_per_team" &&
          name !== "max_team_size"
        ) {
          newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1);
        }
        let updated = { ...prev, [name]: newValue };
        // If price_per_person or max_team_size changes, recalc team fee
        if (name === "price_per_person" || name === "max_team_size") {
          updateTeamFee(
            name === "price_per_person" ? newValue : prev.price_per_person,
            name === "max_team_size" ? newValue : prev.max_team_size
          );
        }
        // If max_team_size changes and is > 1, set is_team_event true
        if (name === "max_team_size") {
          const size = Number(newValue);
          if (!isNaN(size) && size > 1) {
            updated.is_team_event = true;
          } else if (!isNaN(size) && size <= 1) {
            updated.is_team_event = false;
          }
        }
        return updated;
      });
    }
  };

  // General Rules
  const handleGeneralRuleChange = (idx, value) => {
    // Capitalize first letter
    const capitalized =
      value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;
    setGeneralRules((rules) =>
      rules.map((r, i) => (i === idx ? capitalized : r))
    );
  };
  const addGeneralRule = () => setGeneralRules((r) => [...r, ""]);
  const removeGeneralRule = (idx) =>
    setGeneralRules((r) => (r.length > 1 ? r.filter((_, i) => i !== idx) : r));

  // Equipment Requirements
  const handleEquipmentChange = (idx, value) => {
    // Capitalize first letter
    const capitalized =
      value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;
    setEquipmentRequirements((eq) =>
      eq.map((e, i) => (i === idx ? capitalized : e))
    );
  };
  const addEquipment = () => setEquipmentRequirements((eq) => [...eq, ""]);
  const removeEquipment = (idx) =>
    setEquipmentRequirements((eq) =>
      eq.length > 1 ? eq.filter((_, i) => i !== idx) : eq
    );

  // Hashtags multi-select handler
  const handleHashtagsChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((f) => ({ ...f, hashtags: options }));
  };

  // Hashtag add handler
  const handleCustomHashtagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = customHashtagInput.trim().replace(/\s+/g, "-");
      if (tag && !form.hashtags.includes(tag)) {
        setForm((f) => ({ ...f, hashtags: [...f.hashtags, tag] }));
      }
      setCustomHashtagInput("");
    }
  };
  const handleRemoveCustomHashtag = (tag) => {
    setForm((f) => ({ ...f, hashtags: f.hashtags.filter((h) => h !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("start_date", form.start_date);
      formData.append("start_time", form.start_time);
      formData.append("gender", form.gender);
      formData.append("age_group", form.age_group);
      formData.append("is_team_event", form.is_team_event);
      formData.append("price_per_person", form.price_per_person);
      formData.append("price_per_team", form.price_per_team);
      formData.append("max_team_size", form.max_team_size);
      formData.append("is_featured", form.is_featured);
      if (form.file) formData.append("file", form.file);
      if (form.hashtags && form.hashtags.length > 0)
        formData.append("hashtags", JSON.stringify(form.hashtags));
      formData.append(
        "rules_and_guidelines",
        JSON.stringify({
          general_rules: generalRules.filter((r) => r.trim()),
          equipment_requirements: equipmentRequirements.filter((e) => e.trim()),
        })
      );

      if (eventToEdit && eventToEdit.id) {
        // PATCH for editing
        await apiFetch(`/api/admin/events/${eventToEdit.id}`, {
          method: "PATCH",
          body: formData,
        });
        toast({
          title: "Event Updated",
          description: "The event has been updated successfully!",
        });
      } else {
        // POST for new event
        await apiFetch("/api/admin/events", {
          method: "POST",
          body: formData,
        });
        toast({
          title: "Event Created",
          description: "The event has been created successfully!",
        });
      }
      navigate("/admin/events");
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
      <main className="flex-grow py-10 relative z-10">
        <div className="container mx-auto px-2 md:px-6">
          <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 animate-fade-in-up">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x mb-2">
              {eventToEdit ? "Edit Event" : "Create New Event"}
            </h1>
            <p className="text-gray-500 mb-8">
              {eventToEdit
                ? "Update the details and save changes to this skating event."
                : "Fill in the details to create a new skating event"}
            </p>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Event Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required
                />
                <Input
                  label="Event Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter event location"
                  required
                />
                <Input
                  label="Event Date"
                  name="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Start Time"
                  name="start_time"
                  type="time"
                  value={form.start_time || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-1 text-black">
                  Event Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter a detailed description of the event"
                  className="w-full min-h-24 rounded-md border px-3 py-2 text-black"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1 text-black">
                    Hashtags (select one or more)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {hashtagOptions.map((tag) => (
                      <label
                        key={tag}
                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={tag}
                          checked={form.hashtags.includes(tag)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setForm((f) => ({
                              ...f,
                              hashtags: checked
                                ? [...f.hashtags, tag]
                                : f.hashtags.filter((h) => h !== tag),
                            }));
                          }}
                          className="accent-blue-500"
                        />
                        <span className="text-xs">#{tag}</span>
                      </label>
                    ))}
                    {/* Custom hashtag chips */}
                    {form.hashtags
                      .filter((h) => !hashtagOptions.includes(h))
                      .map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-semibold shadow-sm border border-pink-200"
                        >
                          #{tag}
                          <button
                            type="button"
                            className="ml-1 text-pink-500 hover:text-pink-700"
                            onClick={() => handleRemoveCustomHashtag(tag)}
                            aria-label="Remove hashtag"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                  <input
                    type="text"
                    className="w-full mt-2 rounded-md border px-3 py-2 text-black"
                    placeholder="Type hashtag and press Enter or comma"
                    value={customHashtagInput}
                    onChange={(e) =>
                      setCustomHashtagInput(
                        e.target.value.replace(/[^\w-]/g, "")
                      )
                    }
                    onKeyDown={handleCustomHashtagKeyDown}
                  />
                  <span className="text-xs text-gray-400">
                    Tick to select hashtags. Type and press Enter or comma to
                    add custom hashtags. No spaces allowed in hashtags.
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-black">
                    Age Group
                  </label>
                  <Select
                    value={form.age_group}
                    onValueChange={(v) =>
                      handleChange({ target: { name: "age_group", value: v } })
                    }
                  >
                    <SelectTrigger className="w-full h-10 rounded-md border px-3 py-2 text-black">
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageGroups.map((ag) => (
                        <SelectItem key={ag} value={ag}>
                          {ag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-black">
                    Gender
                  </label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) =>
                      handleChange({ target: { name: "gender", value: v } })
                    }
                  >
                    <SelectTrigger className="w-full h-10 rounded-md border px-3 py-2 text-black bg-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  label="Individual Registration Fee (₹)"
                  name="price_per_person"
                  type="number"
                  value={form.price_per_person}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
                <Input
                  label="Team Registration Fee (₹)"
                  name="price_per_team"
                  type="number"
                  value={form.price_per_team}
                  onChange={handleChange}
                  placeholder=""
                  readOnly
                />
                <Input
                  label="Maximum Team Size"
                  name="max_team_size"
                  type="number"
                  value={form.max_team_size}
                  onChange={handleChange}
                  placeholder="1"
                  required
                />
                <div className="flex items-center gap-2 mt-2"></div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="is_team_event"
                    name="is_team_event"
                    checked={!!form.is_team_event}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="is_team_event"
                    className="text-sm font-medium"
                  >
                    Team Event
                  </label>
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={!!form.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium">
                    Featured Event
                  </label>
                </div>
              </div>
              {/* Rules & Regulations Section */}
              <div className="w-full">
                <h3 className="text-lg font-medium mb-4">
                  Rules & Regulations
                </h3>
                {/* General Rules */}
                <div className="mb-6 w-full">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold text-black mr-2">
                      General Rules
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={addGeneralRule}
                    >
                      ＋
                    </Button>
                  </div>
                  {generalRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 mb-2 w-full"
                    >
                      <Input
                        value={rule}
                        onChange={(e) =>
                          handleGeneralRuleChange(idx, e.target.value)
                        }
                        placeholder={`Rule #${idx + 1}`}
                        className="w-3xl"
                        style={{ minWidth: 0, flex: 1 }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeGeneralRule(idx)}
                        disabled={generalRules.length === 1}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
                {/* Equipment Requirements */}
                <div className="mb-6 w-full">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold text-black mr-2">
                      Equipment Requirements
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={addEquipment}
                    >
                      ＋
                    </Button>
                  </div>
                  {equipmentRequirements.map((eq, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 mb-2 w-full"
                    >
                      <Input
                        value={eq}
                        onChange={(e) =>
                          handleEquipmentChange(idx, e.target.value)
                        }
                        placeholder={`Requirement #${idx + 1}`}
                        className="w-3xl"
                        style={{ minWidth: 0, flex: 1 }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEquipment(idx)}
                        disabled={equipmentRequirements.length === 1}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Event Image Upload Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Event Image</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white/70">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Event Preview"
                      className="mx-auto mb-4 rounded-lg object-cover"
                      style={{ maxHeight: 180, maxWidth: "100%" }}
                    />
                  ) : (
                    <div className="h-8 w-8 mx-auto text-gray-400 text-3xl">
                      🖼️
                    </div>
                  )}
                  <p className="mt-2 text-sm text-gray-500">Click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Recommended size: 1200 x 600 pixels (16:9 ratio)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    id="event-image-upload"
                    name="file"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() =>
                      document.getElementById("event-image-upload").click()
                    }
                  >
                    Upload Image
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-md text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      className="opacity-75"
                      fill="none"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {eventToEdit ? "Update Event" : "Create Event"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
