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

// DetailRow component for better organization
const DetailRow = ({ label, value, icon }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
  >
    <span className="text-xl mr-3">{icon}</span>
    <div className="flex-1">
      <span className="text-sm font-medium text-gray-500 block">{label}</span>
      <span className="text-gray-800 font-semibold">{value}</span>
    </div>
  </motion.div>
);

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
  const [aadhaarImageError, setAadhaarImageError] = useState("");
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
    const { name, value, checked } = e.target;
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

  // Handle Aadhaar image with size validation
  const handleAadhaarChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setAadhaarImage(null);
      setAadhaarImageError("");
      return;
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setAadhaarImageError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(
          2
        )}MB). Maximum size is 5MB.`
      );
      setAadhaarImage(null);
      e.target.value = ""; // Clear the file input
      return;
    }

    // File is valid
    setAadhaarImageError("");
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

    // Check if Aadhaar image has validation error
    if (aadhaarImageError) {
      toast({
        title: "Invalid File",
        description: aadhaarImageError,
        variant: "destructive",
      });
      return;
    }

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
        event_category: form.event_category_select,
        skate_category: form.skate_category,
        aadhaar_number: form.aadhaar_number,
        team_name: form.team_name,
      });
      setShowSuccessModal(true);
      setSuccess(true);

      // Auto-scroll to top when registration is successful
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      toast({
        title: "Registration Successful",
        description: "You have registered successfully!",
        variant: "default",
      });
    } catch (err) {
      // Handle error - show user-friendly message
      let errorMessage = "Registration failed. Please try again later.";

      if (err.response && err.response.data) {
        // Use the message field first, then error field
        errorMessage =
          err.response.data.message || err.response.data.error || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      // Also show toast for visibility
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Scroll to top to show error message
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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
        <main className="flex-grow py-10 bg-gradient-to-br from-green-50 via-blue-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              {/* Registration Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-8"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <FontAwesomeIcon icon={faHashtag} className="mr-3" />
                    Registration Details
                  </h2>
                  <p className="text-green-100 mt-2">
                    Please review your information below
                  </p>
                </div>

                {/* Details Grid */}
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Player Information */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Player Information
                      </h3>

                      <div className="space-y-3">
                        <DetailRow
                          label="Full Name"
                          value={`${registeredDetails.first_name} ${registeredDetails.middle_name} ${registeredDetails.last_name}`}
                          icon="👤"
                        />
                        <DetailRow
                          label="District"
                          value={registeredDetails.district}
                          icon="📍"
                        />
                        <DetailRow
                          label="State"
                          value={registeredDetails.state}
                          icon="🏛️"
                        />
                        <DetailRow
                          label="Age Group"
                          value={registeredDetails.age_group}
                          icon="🎂"
                        />
                        <DetailRow
                          label="Event Category"
                          value={registeredDetails.event_category}
                          icon="🏆"
                        />
                        <DetailRow
                          label="Skate Category"
                          value={registeredDetails.skate_category}
                          icon="⛸️"
                        />
                      </div>
                    </motion.div>

                    {/* Coach & Team Information */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Coach & Team Details
                      </h3>

                      <div className="space-y-3">
                        <DetailRow
                          label="Coach Name"
                          value={registeredDetails.coach_name}
                          icon="👨‍🏫"
                        />
                        {event.is_team_event && (
                          <DetailRow
                            label="Team Name"
                            value={registeredDetails.team_name}
                            icon="👥"
                          />
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Action Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    What's Next?
                  </h3>
                  <p className="text-gray-600 max-w-3xl mx-auto">
                    Your registration is complete! Please proceed to payment to
                    secure your spot. You can review and edit your details in
                    your dashboard if needed.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => navigate("/dashboard")}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                      Continue to Payment
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8 text-center"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    💡 Important Notes
                  </h4>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>
                      • Payment must be completed within 24 hours to secure your
                      registration
                    </li>
                    <li>
                      • You can modify your details in the dashboard before
                      payment
                    </li>
                    <li>
                      • Contact support if you face any issues during payment
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
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
                          Aadhaar Image* (Max 5MB)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAadhaarChange}
                          required
                          className={`block w-full border-1 rounded-md p-2 text-sm file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            aadhaarImageError
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {aadhaarImageError && (
                          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                            <span>⚠️</span>
                            {aadhaarImageError}
                          </p>
                        )}
                        {aadhaarImage && !aadhaarImageError && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(aadhaarImage)}
                              alt="Aadhaar Preview"
                              className="h-20 rounded shadow"
                            />
                            <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                              <span>✓</span>
                              File size:{" "}
                              {(aadhaarImage.size / (1024 * 1024)).toFixed(2)}MB
                            </p>
                          </div>
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
                      className="w-full py-3 bg-primary text-blue-400 border-2 rounded-lg hover:bg-opacity-90 transition-colors font-medium text-center cursor-pointer hover:text-blue-600 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={submitting || aadhaarImageError}
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
