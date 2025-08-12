import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById } from "../services/eventApi";
import { apiFetch } from "../services/api";
import useAuth from "../hooks/useAuth";
import { useToast } from "../hooks/use-toasts";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Skeleton from "../components/ui/skeleton";
// import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { AnimatePresence } from "framer-motion";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faHashtag,
  faPaperPlane,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Hash } from "lucide-react";
import { Helmet } from "react-helmet-async";

const initialForm = {
  coach_name: "",
  club_name: "",
  gender: "",
  age_group: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  date_of_birth: "",
  district: "",
  state: "",
  // category: "",
  skate_category: "",
  aadhaar_number: "",
  team_name: "",
  team_members: [{ full_name: "", age: "", gender: "" }],
  event_categories: [],
};

const RegistrationPage = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const user = auth?.user;
  const { toast } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [ageGroupOptions, setAgeGroupOptions] = useState([]);
  const [eventCategoryOptions, setEventCategoryOptions] = useState([]);
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredDetails, setRegisteredDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Event Registration | SSAS";
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const evt = await fetchEventById(id);
        setEvent(evt);
        // Age group options from event
        let agOpts = [];
        if (Array.isArray(evt.age_group)) {
          agOpts = evt.age_group.filter(
            (ag) => typeof ag === "string" || typeof ag === "number"
          );
        } else if (
          typeof evt.age_group === "string" ||
          typeof evt.age_group === "number"
        ) {
          agOpts = [evt.age_group];
        }
        setAgeGroupOptions(agOpts);
        // Extract event categories from event.event_category (object format)
        let catOpts = [];
        if (evt.event_category && typeof evt.event_category === "object") {
          // Flatten all values into a single array for dropdown
          catOpts = Object.values(evt.event_category).flat();
        }
        setEventCategoryOptions(catOpts);
        setForm((f) => ({
          ...f,
          age_group: agOpts.length > 0 ? agOpts[0] : "",
          gender: evt.gender || "",
          event_categories: [],
          team_members:
            evt.is_team_event && evt.max_team_size
              ? Array.from({ length: evt.max_team_size }, () => ({
                  full_name: "",
                  age: "",
                  gender: "",
                }))
              : f.team_members,
        }));
      } catch {
        setError("Event not found");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchEvent();
    } else {
      setLoading(false);
      setError("No event selected");
    }
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "event_categories") {
      setForm((f) => {
        let updated = f.event_categories;
        if (checked) {
          updated = [...updated, value];
        } else {
          updated = updated.filter((v) => v !== value);
        }
        return { ...f, event_categories: updated };
      });
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Handle Aadhaar image
  const handleAadhaarChange = (e) => {
    const file = e.target.files[0];
    setAadhaarImage(file);
  };

  // Team member change
  const handleTeamMemberChange = (idx, field, value) => {
    setForm((f) => {
      const members = [...f.team_members];
      members[idx][field] = value;
      return { ...f, team_members: members };
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // Prevent double submit
    setSubmitting(true);
    setError("");
    // Team event: validate all team members
    if (event.is_team_event) {
      for (let i = 0; i < form.team_members.length; i++) {
        const m = form.team_members[i];
        if (!m.full_name || !m.age || !m.gender) {
          setError(`Please fill all fields for team member ${i + 1}`);
          setSubmitting(false);
          return;
        }
      }
    }
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to register.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }
    try {
      // Block duplicate registration for non-coach users (both individual and team events)
      if (user.role !== "coach") {
        const regs = await apiFetch(`/api/registrations/user/${user.id}`);
        if (regs.some((r) => r.event_id === event.id)) {
          setError("You have already registered for this event.");
          setSubmitting(false);
          return;
        }
      }
      // Prepare form data
      const fd = new FormData();
      // Ensure event_category is sent as array
      const formToSend = {
        ...form,
        event_category: form.event_category_select
          ? [form.event_category_select]
          : form.event_categories || [],
      };
      Object.entries(formToSend).forEach(([k, v]) => {
        if (
          k === "team_members" ||
          k === "event_categories" ||
          k === "event_category"
        ) {
          fd.append(k, JSON.stringify(v));
        } else if (k === "skate_category") {
          fd.append("skate_category", v);
        } else if (k === "category") {
          // Do not send old category field
        } else {
          fd.append(k, v);
        }
      });
      fd.append("eventId", event.id);
      fd.append(
        "registrationType",
        event.is_team_event ? "team" : "individual"
      );
      if (aadhaarImage) fd.append("aadhaarImage", aadhaarImage);
      await apiFetch("/api/registrations", { method: "POST", body: fd });
      setRegisteredDetails({
        coach_name: form.coach_name,
        club_name: form.club_name,
        gender: form.gender,
        age_group: form.age_group,
        first_name: form.first_name,
        middle_name: form.middle_name,
        last_name: form.last_name,
        district: form.district,
        state: form.state,
        date_of_birth: form.date_of_birth,
        category: form.category,
        aadhaar_number: form.aadhaar_number,
        team_name: form.team_name,
      });
      setShowSuccessModal(true);
      setSuccess(true);
      toast({
        title: "Registration Successful",
        description: "You have registered successfully!",
        variant: "default",
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-2/3 mb-4" />
            <Skeleton className="h-6 w-full mb-8" />
            <Card>
              <CardHeader>
                <Skeleton className="h-10 w-40 mb-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );

  if (error && !success)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-red-100 text-red-700 p-6 rounded-lg text-center mt-10">
              {error}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );

  if (success && showSuccessModal && registeredDetails)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white border border-green-300 p-8 rounded-lg text-center mt-10 shadow-lg">
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                Registration Successful!
              </h2>
              <div className="text-left text-gray-700 space-y-2 mb-6">
                <div>
                  <b>Player Name:</b> {registeredDetails.first_name}{" "}
                  {registeredDetails.middle_name} {registeredDetails.last_name}
                </div>
                <div>
                  <b>District:</b> {registeredDetails.district}
                </div>
                <div>
                  <b>State:</b> {registeredDetails.state}
                </div>
                <div>
                  <b>Coach Name:</b> {registeredDetails.coach_name}
                </div>
                <div>
                  <b>Age Group:</b> {registeredDetails.age_group}
                </div>
                <div>
                  <b>Category:</b> {registeredDetails.category}
                </div>
                {event.is_team_event && (
                  <div>
                    <b>Team Name:</b> {registeredDetails.team_name}
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-6">
                Thank you for registering! Please proceed to payment. If any
                data is incorrect you can correct it in your dashboard.
              </p>
              <Button
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
                onClick={() => navigate("/dashboard")}
              >
                Continue to Pay
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Event Registration | Sai Skating Academy</title>
        <meta
          name="description"
          content="Register for skating events at Sai Skating Academy. Open to all age groups and skill levels."
        />
        <meta
          property="og:title"
          content="Event Registration | Sai Skating Academy"
        />
        <meta
          property="og:description"
          content="Register for skating events at Sai Skating Academy. Open to all age groups and skill levels."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-3 flex items-center justify-center gap-2">
                <span>Event Registration</span>
                <span className="text-primary animate-bounce">
                  <i className="fas fa-skating"></i>
                </span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Register for{" "}
                <span className="font-semibold text-primary">
                  {event.title}
                </span>
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {event.is_team_event
                      ? "Team Registration"
                      : "Individual Registration"}
                  </CardTitle>
                  {event && (
                    <div className="p-4 bg-gray-50 rounded-lg mt-4">
                      <h3 className="font-bold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-2">{event.description}</p>
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          <FontAwesomeIcon
                            icon={faHashtag}
                            className="text-blue-500 mr-1"
                          />
                          {event.age_group}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          <FontAwesomeIcon
                            icon={faHashtag}
                            className="text-blue-500 mr-1"
                          />
                          {event.gender}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="w-5 h-5 mr-2"
                          />
                          {event.start_date
                            ? new Date(event.start_date).toLocaleDateString()
                            : ""}
                        </p>
                        <p>
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="w-5 h-5 mr-2"
                          />
                          {event.location}
                        </p>
                        <p className="font-bold text-blue-600 mt-2">
                          Price: ₹{" "}
                          {parseFloat(
                            event.price_per_person * event.max_team_size
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    encType="multipart/form-data"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                      {eventCategoryOptions &&
                        Object.keys(eventCategoryOptions).length > 0 && (
                          <div>
                            <label
                              htmlFor="event_category_select"
                              className="block text-sm font-semibold mb-1 text-black"
                            >
                              Event Category*
                            </label>
                            <Select
                              name="event_category_select"
                              placeholder="Select category"
                              aria-label="Event Category"
                              value={form.event_category_select || ""}
                              onValueChange={(val) =>
                                setForm((f) => ({
                                  ...f,
                                  event_category_select: val,
                                }))
                              }
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {eventCategoryOptions.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                      {/* {eventCategoryOptions.length > 0 && (
                        <div>
                          <label className="block text-sm font-semibold mb-1 text-black">
                            Event Categories*
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {eventCategoryOptions.map((cat) => (
                              <label
                                key={cat}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  name="event_categories"
                                  value={cat}
                                  checked={form.event_categories.includes(cat)}
                                  onChange={handleChange}
                                />
                                <span>{cat}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )} */}
                      <Input
                        label="First Name*"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter first name"
                      />
                      <Input
                        label="Middle Name"
                        name="middle_name"
                        value={form.middle_name}
                        onChange={handleChange}
                        placeholder="Enter middle name (optional)"
                      />
                      <Input
                        label="Last Name*"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter last name"
                      />
                      <Input
                        label="Date of Birth*"
                        name="date_of_birth"
                        type="date"
                        value={form.date_of_birth}
                        onChange={handleChange}
                        required
                        placeholder="YYYY-MM-DD"
                      />

                      <div>
                        <label
                          htmlFor="age_group"
                          className="block text-sm font-semibold mb-1 text-black"
                        >
                          Age Group*
                        </label>
                        <Select
                          name="age_group"
                          placeholder="Select age group"
                          aria-label="Age Group"
                          value={form.age_group}
                          onValueChange={(val) =>
                            setForm((f) => ({ ...f, age_group: val }))
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                          <SelectContent>
                            {ageGroupOptions.length > 0 ? (
                              ageGroupOptions.map((ag) => (
                                <SelectItem key={String(ag)} value={String(ag)}>
                                  {String(ag)}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="">No age groups</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label
                          htmlFor="gender"
                          className="block text-sm font-semibold mb-1 text-black"
                        >
                          Gender*
                        </label>
                        <Select
                          name="gender"
                          aria-label="Gender"
                          value={form.gender}
                          onValueChange={(val) =>
                            setForm((f) => ({ ...f, gender: val }))
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        label="District*"
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        required
                        placeholder="Enter district"
                      />
                      <Input
                        label="State*"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                        placeholder="Enter state"
                      />
                      <Input
                        label="Coach Name*"
                        name="coach_name"
                        value={form.coach_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter coach name"
                      />
                      <Input
                        label="Club Name*"
                        name="club_name"
                        value={form.club_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter club name"
                      />
                      <div>
                        <label
                          htmlFor="skate_category"
                          className="block text-sm font-semibold mb-1 text-black"
                        >
                          Skate Category*
                        </label>
                        <Select
                          name="skate_category"
                          aria-label="Skate Category"
                          value={form.skate_category}
                          onValueChange={(val) =>
                            setForm((f) => ({ ...f, skate_category: val }))
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select skate category" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(event?.skate_category) &&
                            event.skate_category.length > 0 ? (
                              event.skate_category.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-skate-category" disabled>
                                No skate categories
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        label="Aadhaar Number*"
                        name="aadhaar_number"
                        type="number"
                        minLength={12}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={form.aadhaar_number}
                        onChange={handleChange}
                        required
                        placeholder="Enter Aadhaar number"
                      />
                      <div>
                        <label className="block font-medium mb-1">
                          Aadhaar Image*
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAadhaarChange}
                          required
                          className="block w-full border-1 border-gray-300 rounded-md p-2 text-sm file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        {aadhaarImage && (
                          <img
                            src={URL.createObjectURL(aadhaarImage)}
                            alt="Aadhaar Preview"
                            className="mt-2 h-20 rounded shadow"
                          />
                        )}
                      </div>
                    </div>

                    {event.is_team_event && (
                      <>
                        <Input
                          label="Team Name*"
                          name="team_name"
                          value={form.team_name}
                          onChange={handleChange}
                          required
                          placeholder="Enter team name"
                        />
                        <div className="space-y-4">
                          <h3 className="font-bold">Team Members</h3>
                          <AnimatePresence>
                            {form.team_members.map((member, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3 }}
                                className="p-4 bg-gray-50 rounded-lg"
                              >
                                <div className="flex justify-between mb-3">
                                  <h4 className="font-medium">
                                    Team Member {idx + 1}
                                  </h4>
                                  {idx > 0 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 h-8 px-2"
                                    >
                                      <i className="fas fa-times"></i>
                                    </Button>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input
                                    label="Full Name*"
                                    value={member.full_name}
                                    onChange={(e) =>
                                      handleTeamMemberChange(
                                        idx,
                                        "full_name",
                                        e.target.value
                                      )
                                    }
                                    required
                                    placeholder="Enter member's full name"
                                  />
                                  <Input
                                    label="Age*"
                                    type="number"
                                    min="5"
                                    max="99"
                                    value={member.age}
                                    onChange={(e) =>
                                      handleTeamMemberChange(
                                        idx,
                                        "age",
                                        e.target.value
                                      )
                                    }
                                    required
                                    placeholder="Enter age"
                                  />
                                  <Select
                                    value={member.gender}
                                    onValueChange={(val) =>
                                      handleTeamMemberChange(idx, "gender", val)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="male">Male</SelectItem>
                                      <SelectItem value="female">
                                        Female
                                      </SelectItem>
                                      <SelectItem value="other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </>
                    )}
                    <Button
                      type="submit"
                      className="w-full py-3 bg-primary text-blue-400 border-2 rounded-lg hover:bg-opacity-90 transition-colors font-medium text-center cursor-pointer hover:text-blue-600 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 mt-4"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            className="mr-2"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faPaperPlane}
                            className="mr-2"
                          />
                          Submit Registration
                        </>
                      )}
                    </Button>
                    {error && (
                      <div className="text-red-600 text-center mt-2">
                        {error}
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default RegistrationPage;
