import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import LoginModal from "../components/auth/LoginModal";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faHashtag,
  faPaperPlane,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Hash } from "lucide-react";

const initialForm = {
  coach_name: "",
  club_name: "",
  gender: "",
  age_group: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  dob: "",
  district: "",
  category: "",
  aadhaar_number: "",
  team_name: "",
  team_members: [
    { full_name: "", age: "", gender: "", experience: "beginner" },
  ],
};

const RegistrationPage = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const user = auth?.user;
  const { toast } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Event Registration | SCERS";
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const evt = await fetchEventById(id);
        setEvent(evt);
        setForm((f) => ({
          ...f,
          age_group: evt.age_group || "",
          gender: evt.gender || "",
          team_members:
            evt.is_team_event && evt.max_team_size
              ? Array.from({ length: evt.max_team_size }, () => ({
                  full_name: "",
                  age: "",
                  gender: "",
                  experience: "beginner",
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
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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

  // Add/remove team member
  const addTeamMember = () => {
    setForm((f) => ({
      ...f,
      team_members: [
        ...f.team_members,
        { full_name: "", age: "", gender: "", experience: "beginner" },
      ],
    }));
  };
  const removeTeamMember = (idx) => {
    setForm((f) => ({
      ...f,
      team_members: f.team_members.filter((_, i) => i !== idx),
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to register.",
        variant: "destructive",
      });
      setIsLoginModalOpen(true);
      setSubmitting(false);
      return;
    }
    try {
      // Check duplicate for individual
      if (!event.is_team_event) {
        const regs = await apiFetch(`/api/registrations/user/${user.id}`);
        if (regs.some((r) => r.event_id === event.id)) {
          setError("You have already registered for this event.");
          setSubmitting(false);
          return;
        }
      }
      // Prepare form data
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "team_members") {
          fd.append(k, JSON.stringify(v));
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
      setSuccess(true);
      toast({
        title: "Registration Successful",
        description: "You have registered successfully!",
        variant: "default",
      });
    } catch (e) {
      setError(e.message || "Registration failed");
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

  if (success)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-green-100 text-green-700 p-6 rounded-lg text-center mt-10">
              Registration successful! Check your dashboard for updates.
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );

  return (
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
              <span className="font-semibold text-primary">{event.title}</span>
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
                      name="dob"
                      type="date"
                      value={form.dob}
                      onChange={handleChange}
                      required
                      placeholder="YYYY-MM-DD"
                    />
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-semibold mb-1 text-black"
                      >
                        Gender*
                      </label>
                      <Select
                        name="gender"
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
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-semibold mb-1 text-black"
                      >
                        Category*
                      </label>
                      <Select
                        name="category"
                        value={form.category}
                        onValueChange={(val) =>
                          setForm((f) => ({ ...f, category: val }))
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quad">Quad</SelectItem>
                          <SelectItem value="inline">Inline</SelectItem>
                          <SelectItem value="beginner">Beginner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-semibold mb-1 text-black"
                      >
                        Experience*
                      </label>
                      <Select
                        name="experience"
                        value={form.experience || "beginner"}
                        onValueChange={(val) =>
                          setForm((f) => ({ ...f, experience: val }))
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">
                            Beginner (0-1 years)
                          </SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate (1-3 years)
                          </SelectItem>
                          <SelectItem value="pro">Pro (3+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      label="Aadhaar Number*"
                      name="aadhaar_number"
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
                  <Input
                    label="Coach Name"
                    name="coach_name"
                    value={form.coach_name}
                    onChange={handleChange}
                    placeholder="Enter coach name (optional)"
                  />
                  <Input
                    label="Club Name"
                    name="club_name"
                    value={form.club_name}
                    onChange={handleChange}
                    placeholder="Enter club name (optional)"
                  />
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
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold">Team Members</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addTeamMember}
                            className="flex items-center"
                          >
                            <i className="fas fa-plus-circle mr-2"></i> Add
                            Member
                          </Button>
                        </div>
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
                                    onClick={() => removeTeamMember(idx)}
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
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select
                                  value={member.experience}
                                  onValueChange={(val) =>
                                    handleTeamMemberChange(
                                      idx,
                                      "experience",
                                      val
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select experience" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="beginner">
                                      Beginner (0-1 years)
                                    </SelectItem>
                                    <SelectItem value="intermediate">
                                      Intermediate (1-3 years)
                                    </SelectItem>
                                    <SelectItem value="advanced">
                                      Advanced (3+ years)
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
                        <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                        Submit Registration
                      </>
                    )}
                  </Button>
                  {error && (
                    <div className="text-red-600 text-center mt-2">{error}</div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </div>
  );
};

export default RegistrationPage;
