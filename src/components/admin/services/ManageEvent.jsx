import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import Input from "../../ui/input";
// import Select from "../ui/select";
import Button from "../../ui/button";
import { useToast } from "../../../hooks/use-toasts";

const initialForm = {
  title: "",
  description: "",
  date: "",
  registrationEndDate: "",
  location: "",
  category: "",
  ageGroup: "",
  gender: "",
  individualFee: "",
  maxTeamSize: "",
  rules: "",
  publishImmediately: true,
};

const categories = [
  "Inline Skating",
  "Roller Skating",
  "Freestyle",
  "Speed Skating",
];
const ageGroups = ["Under 12", "Under 18", "Adult", "All Ages"];
const genders = ["Male", "Female", "All"];

export default function AddEvent() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleItems, setScheduleItems] = useState([
    { time: "", activity: "" },
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addScheduleItem = () => {
    setScheduleItems([...scheduleItems, { time: "", activity: "" }]);
  };
  const removeScheduleItem = (index) => {
    if (scheduleItems.length === 1) return;
    setScheduleItems(scheduleItems.filter((_, i) => i !== index));
  };
  const updateScheduleItem = (index, field, value) => {
    setScheduleItems((items) =>
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1500));
      toast({
        title: "Event Created",
        description: "The event has been created successfully!",
      });
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
      <Header />
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
              Create New Event
            </h1>
            <p className="text-gray-500 mb-8">
              Fill in the details to create a new skating event
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
                  label="Event Date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Registration End Date"
                  name="registrationEndDate"
                  type="date"
                  value={form.registrationEndDate}
                  onChange={handleChange}
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
                <div>
                  <label className="block text-sm font-semibold mb-1 text-black">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border px-3 py-2 text-black"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-black">
                    Age Group
                  </label>
                  <select
                    name="ageGroup"
                    value={form.ageGroup}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border px-3 py-2 text-black"
                    required
                  >
                    <option value="">Select age group</option>
                    {ageGroups.map((ag) => (
                      <option key={ag} value={ag}>
                        {ag}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-black">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border px-3 py-2 text-black"
                    required
                  >
                    <option value="">Select gender</option>
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Individual Registration Fee ($)"
                  name="individualFee"
                  type="number"
                  value={form.individualFee}
                  onChange={handleChange}
                  placeholder=""
                  required
                />
                <Input
                  label="Maximum Team Size"
                  name="maxTeamSize"
                  type="number"
                  value={form.maxTeamSize}
                  onChange={handleChange}
                  placeholder="6"
                  required
                />
              </div>
              <div>
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
              <div>
                <label className="block text-sm font-semibold mb-1 text-black">
                  Rules & Regulations
                </label>
                <textarea
                  name="rules"
                  value={form.rules}
                  onChange={handleChange}
                  placeholder="Enter the rules and regulations for the event"
                  className="w-full min-h-24 rounded-md border px-3 py-2 text-black"
                  required
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Event Schedule</h3>
                <div className="space-y-4">
                  {scheduleItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-center gap-4"
                    >
                      <div className="flex-1 w-full">
                        <label
                          className={
                            index !== 0
                              ? "sr-only"
                              : "block text-sm font-semibold mb-1 text-black"
                          }
                        >
                          Time
                        </label>
                        <Input
                          type="time"
                          value={item.time}
                          onChange={(e) =>
                            updateScheduleItem(index, "time", e.target.value)
                          }
                          placeholder="Time"
                        />
                      </div>
                      <div className="flex-[3] w-full">
                        <label
                          className={
                            index !== 0
                              ? "sr-only"
                              : "block text-sm font-semibold mb-1 text-black"
                          }
                        >
                          Activity
                        </label>
                        <Input
                          value={item.activity}
                          onChange={(e) =>
                            updateScheduleItem(
                              index,
                              "activity",
                              e.target.value
                            )
                          }
                          placeholder="Activity description"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeScheduleItem(index)}
                          disabled={scheduleItems.length === 1}
                        >
                          ✕<span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addScheduleItem}
                  >
                    ＋ Add Schedule Item
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Event Image</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white/70">
                  <div className="h-8 w-8 mx-auto text-gray-400 text-3xl">
                    🖼️
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Drag and drop an image, or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Recommended size: 1200 x 600 pixels (16:9 ratio)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    Upload Image
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="publishImmediately"
                  name="publishImmediately"
                  checked={form.publishImmediately}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor="publishImmediately"
                  className="text-sm font-medium"
                >
                  Publish immediately
                </label>
                <span className="text-xs text-gray-400 ml-2">
                  If unchecked, the event will be saved as a draft
                </span>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition-transform"
                >
                  {isLoading ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
