import { useEffect, useState, useRef } from "react";
import { useToast } from "../hooks/use-toasts";
import useAuth from "../hooks/useAuth";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import Badge from "../components/ui/badge";
import Button from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import Skeleton from "../components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faBirthdayCake,
  faVenusMars,
  faCheckCircle,
  faTimesCircle,
  faCreditCard,
  faMoneyBillWave,
  faCalendarAlt,
  faClipboardList,
  faClock,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const user = auth.user;
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editDetails, setEditDetails] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    registrationId: null,
  });
  const cancelButtonRef = useRef();
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileEdit, setProfileEdit] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
      toast({
        title: "Authentication required",
        description: "Please login to access the dashboard",
        variant: "destructive",
      });
      return;
    }
    document.title = "Dashboard | SSAS";
    const fetchData = async () => {
      setLoading(true);
      try {
        const regs = await apiFetch("/api/registrations");
        const evs = await apiFetch("/api/events");
        setRegistrations(regs);
        setEvents(evs);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate, toast]);

  const handlePaymentClick = (registration) => {
    const event = events.find((e) => e.id === registration.event_id);
    if (!event) return;
    setSelectedRegistration({
      id: registration.id,
      eventName: event.title,
      fee: parseFloat(event.price_per_person * event.max_team_size || 0),
    });
    setIsPaymentModalOpen(true);
  };

  const handleCancelRegistration = (registrationId) => {
    setConfirmModal({ open: true, registrationId });
  };

  const confirmCancelRegistration = async () => {
    const registrationId = confirmModal.registrationId;
    setConfirmModal({ open: false, registrationId: null });
    try {
      await apiFetch(`/api/registrations/${registrationId}`, {
        method: "DELETE",
      });
      setRegistrations((registrations) =>
        registrations.filter((r) => r.id !== registrationId)
      );
      toast({
        title: "Registration Deleted",
        description: "Your registration has been deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getEventName = (eventId) => {
    return (
      events.find((event) => event.id === eventId)?.title || "Unknown Event"
    );
  };

  const handleViewDetails = async (registration) => {
    setSelectedRegistration(registration);
    setDetailsLoading(true);
    setIsDetailsModalOpen(true);
    setEditMode(false);
    try {
      const details = await apiFetch(`/api/user-details/${registration.id}`);
      setUserDetails(details);
      setEditDetails(details);
    } catch (err) {
      setUserDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleEditDetailsChange = (e) => {
    setEditDetails({ ...editDetails, [e.target.name]: e.target.value });
  };

  const handleSaveDetails = async () => {
    setDetailsLoading(true);
    try {
      let body, headers, method, url;
      if (
        editDetails.aadhaar_image &&
        editDetails.aadhaar_image instanceof File
      ) {
        body = new FormData();
        Object.entries(editDetails).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            body.append(key, value);
          }
        });
        // Always include registration_id for POST
        if (!userDetails?.id && selectedRegistration?.id) {
          body.append("registration_id", selectedRegistration.id);
        }
        headers = undefined; // Let browser set multipart/form-data
      } else {
        body = JSON.stringify({
          ...editDetails,
          // Always include registration_id for POST
          ...(userDetails?.id
            ? {}
            : { registration_id: selectedRegistration?.id }),
        });
        headers = { "Content-Type": "application/json" };
      }
      if (userDetails?.id) {
        method = "PATCH";
        url = `/api/user-details/${selectedRegistration.id}`;
      } else {
        method = "POST";
        url = "/api/user-details";
      }
      const updated = await apiFetch(url, {
        method,
        headers,
        body,
      });
      setUserDetails(updated);
      setEditMode(false);
      toast({ title: "Details Updated", variant: "success" });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Edit Profile handlers
  const handleProfileEditClick = () => {
    setProfileEdit({
      full_name: user.full_name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      date_of_birth: user.date_of_birth ? user.date_of_birth.slice(0, 10) : "",
      gender: user.gender || "",
    });
    setProfileEditMode(true);
  };

  const handleProfileEditChange = (e) => {
    setProfileEdit({ ...profileEdit, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e && e.preventDefault(); // Prevent default form submission if called from form
    setProfileLoading(true);
    try {
      const updated = await apiFetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileEdit),
      });
      // Update auth context (if needed)
      if (auth && auth.setUser) auth.setUser(updated);
      // reload window
      window.location.reload();
      toast({ title: "Profile Updated", variant: "success" });
      setProfileEditMode(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>User Dashboard | Sai Skating Academy</title>
        <meta
          name="description"
          content="User dashboard for managing your skating event registrations and profile at Sai Skating Academy."
        />
        <meta
          property="og:title"
          content="User Dashboard | Sai Skating Academy"
        />
        <meta
          property="og:description"
          content="User dashboard for managing your skating event registrations and profile at Sai Skating Academy."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-10 bg-gradient-to-br from-blue-50 via-white to-pink-50 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 text-center animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold font-montserrat mb-2 text-blue-900 drop-shadow-lg tracking-tight">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="mr-2 text-pink-400 "
                  />
                  Your Dashboard
                </h1>
                <p className="text-gray-600 text-lg animate-fade-in-up delay-100">
                  Manage your event registrations and profile
                </p>
              </div>
              <Tabs
                defaultValue="registrations"
                className="w-full animate-fade-in-up delay-200"
              >
                <TabsList className="mb-6 justify-center bg-white/70 shadow rounded-xl p-2">
                  <TabsTrigger value="registrations">
                    <FontAwesomeIcon icon={faClipboardList} className="mr-2" />{" "}
                    My Registrations
                  </TabsTrigger>
                  <TabsTrigger value="profile">
                    <FontAwesomeIcon icon={faUser} className="mr-2" /> My
                    Profile
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="registrations">
                  <Card className="shadow-xl border-2 border-blue-200 bg-white/90 rounded-2xl animate-fade-in-up">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-800">
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          className="text-pink-400"
                        />
                        Your Event Registrations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="p-4 border rounded-lg animate-pulse bg-gradient-to-r from-blue-100 via-white to-pink-100"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <Skeleton className="h-6 w-48 mb-2" />
                                  <Skeleton className="h-4 w-24 mb-1" />
                                  <Skeleton className="h-4 w-32" />
                                </div>
                                <div>
                                  <Skeleton className="h-10 w-24" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : registrations && registrations.length > 0 ? (
                        <div className="space-y-6">
                          {registrations.map((registration, idx) => (
                            <div
                              key={registration.id}
                              className="p-6 border rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up"
                              style={{ animationDelay: `${idx * 60}ms` }}
                            >
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                  <h3 className="font-bold text-xl mb-1 flex items-center gap-2 text-blue-900">
                                    <FontAwesomeIcon
                                      icon={faCalendarAlt}
                                      className="text-pink-400"
                                    />
                                    {getEventName(registration.event_id)}
                                  </h3>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge
                                      variant={
                                        registration.payment_status === "paid"
                                          ? "success"
                                          : "warning"
                                      }
                                      className={
                                        registration.payment_status === "paid"
                                          ? "bg-green-100 text-green-800 border-green-300 animate-pulse"
                                          : "bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse"
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={
                                          registration.payment_status === "paid"
                                            ? faCheckCircle
                                            : faMoneyBillWave
                                        }
                                        className="mr-1"
                                      />
                                      {registration.payment_status === "paid"
                                        ? "Paid"
                                        : "Unpaid"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faClock} />{" "}
                                    Registered on:{" "}
                                    {new Date(
                                      registration.created_at
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                  {registration.payment_status !== "paid" && (
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        handlePaymentClick(registration)
                                      }
                                      className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-transform animate-fade-in-up"
                                    >
                                      <FontAwesomeIcon
                                        icon={faCreditCard}
                                        className="mr-2"
                                      />{" "}
                                      Pay Now
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleViewDetails(registration)
                                    }
                                    className="border-blue-400 text-blue-400 hover:bg-blue-50 hover:text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-transform animate-fade-in-up"
                                  >
                                    <FontAwesomeIcon
                                      icon={faUser}
                                      className="mr-2"
                                    />{" "}
                                    View Details
                                  </Button>
                                  {registration.status !== "cancelled" && (
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        handleCancelRegistration(
                                          registration.id
                                        )
                                      }
                                      className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-transform animate-fade-in-up"
                                      ref={cancelButtonRef}
                                    >
                                      <FontAwesomeIcon
                                        icon={faTimesCircle}
                                        className="mr-2"
                                      />{" "}
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 animate-fade-in-up">
                          <FontAwesomeIcon
                            icon={faExclamationCircle}
                            className="text-4xl text-blue-300 mb-4 "
                          />
                          <p className="text-gray-500 mb-4 text-lg">
                            You haven't registered for any events yet.
                          </p>
                          <Button
                            asChild
                            className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform animate-fade-in-up"
                          >
                            <a href="/events">
                              <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="mr-2"
                              />{" "}
                              Browse Events
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="profile">
                  <Card className="shadow-2xl border-2 border-blue-900 bg-white/80 rounded-3xl animate-fade-in-up">
                    <CardHeader className="flex flex-col items-center gap-2 pb-0">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-200 via-pink-100 to-blue-100 flex items-center justify-center text-5xl font-extrabold text-blue-600 border-4 border-blue-300 mb-2 animate-fade-in-up shadow-lg">
                        {user.full_name
                          ? user.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : user.username?.slice(0, 2).toUpperCase() || "U"}
                      </div>
                      <CardTitle className="text-3xl font-extrabold text-blue-700 animate-fade-in-up">
                        {user.full_name || "N/A"}
                      </CardTitle>
                      <p className="text-gray-500 text-lg animate-fade-in-up">
                        @{user.username || "N/A"}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-8 mt-2">
                        {profileEditMode ? (
                          <form
                            className="space-y-4 max-w-xl mx-auto"
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleProfileSave();
                            }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                  Full Name
                                </label>
                                <input
                                  name="full_name"
                                  value={profileEdit.full_name}
                                  onChange={handleProfileEditChange}
                                  className="border rounded px-2 py-1 w-full"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                  Username
                                </label>
                                <input
                                  name="username"
                                  value={profileEdit.username}
                                  onChange={handleProfileEditChange}
                                  className="border rounded px-2 py-1 w-full"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                  Email
                                </label>
                                <input
                                  name="email"
                                  type="email"
                                  value={profileEdit.email}
                                  onChange={handleProfileEditChange}
                                  className="border rounded px-2 py-1 w-full"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                  Phone
                                </label>
                                <input
                                  name="phone"
                                  value={profileEdit.phone}
                                  onChange={handleProfileEditChange}
                                  className="border rounded px-2 py-1 w-full"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                  Date of Birth
                                </label>
                                <input
                                  name="date_of_birth"
                                  type="date"
                                  value={profileEdit.date_of_birth}
                                  onChange={handleProfileEditChange}
                                  className="border rounded px-2 py-1 w-full"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                  Gender
                                </label>
                                <select
                                  name="gender"
                                  value={profileEdit.gender}
                                  onChange={handleProfileEditChange}
                                  className="border rounded px-2 py-1 w-full"
                                  required
                                >
                                  <option value="">Select</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end mt-6">
                              <Button
                                variant="outline"
                                onClick={() => setProfileEditMode(false)}
                                type="button"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={profileLoading}
                                className="bg-green-500 text-white hover:bg-green-600"
                              >
                                Save
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-center gap-3">
                              <FontAwesomeIcon
                                icon={faEnvelope}
                                className="text-blue-400 text-xl"
                              />
                              <div>
                                <h3 className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
                                  Email
                                </h3>
                                <p className="font-medium text-gray-800">
                                  {user.email || "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <FontAwesomeIcon
                                icon={faPhone}
                                className="text-blue-400 text-xl"
                              />
                              <div>
                                <h3 className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
                                  Phone
                                </h3>
                                <p className="font-medium text-gray-800">
                                  {user.phone || "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <FontAwesomeIcon
                                icon={faBirthdayCake}
                                className="text-blue-400 text-xl"
                              />
                              <div>
                                <h3 className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
                                  Date of Birth
                                </h3>
                                <p className="font-medium text-gray-800">
                                  {user.date_of_birth
                                    ? new Date(
                                        user.date_of_birth
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <FontAwesomeIcon
                                icon={faVenusMars}
                                className="text-blue-400 text-xl"
                              />
                              <div>
                                <h3 className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
                                  Gender
                                </h3>
                                <p className="font-medium text-gray-800">
                                  {user.gender || "N/A"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon
                                icon={faUser}
                                className="text-blue-400 text-xl"
                              />
                              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">
                                Role:
                              </span>
                              <Badge className="capitalize bg-blue-300 text-blue-900 px-3 py-1 text-sm animate-fade-in-up">
                                {user.role || "N/A"}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Add Edit Profile button below profile info, always visible */}
                      <div className="flex justify-center mt-6">
                        <Button
                          variant="default"
                          className="bg-gradient-to-r from-blue-400 to-pink-400 hover:from-pink-400 hover:to-blue-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform animate-fade-in-up"
                          onClick={handleProfileEditClick}
                          disabled={profileEditMode}
                        >
                          <FontAwesomeIcon icon={faUser} className="mr-2" />
                          {profileEditMode ? "Editing..." : "Edit Profile"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        <Footer />
        {/* Payment Modal placeholder for Razorpay integration */}
        {selectedRegistration && isPaymentModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
            onClick={() => setIsPaymentModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="text-pink-400"
                />
                Pay for {selectedRegistration.eventName}
              </h2>
              <p className="mb-4 text-lg text-gray-700 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  className="text-green-400"
                />
                Registration Fee: ₹{selectedRegistration.fee.toFixed(2)}
              </p>
              <div className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="hover:bg-blue-50 hover:text-blue-600"
                >
                  Close
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform"
                  disabled
                >
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Pay
                  (Coming Soon)
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* User Details Modal */}
        {selectedRegistration && isDetailsModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
            onClick={() => setIsDetailsModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-4 sm:p-6 md:p-8 shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl animate-fade-in-up overflow-y-auto max-h-[90vh] mx-2"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-pink-400" />
                Registration Details
              </h2>
              {detailsLoading ? (
                <div>Loading...</div>
              ) : userDetails ? (
                <div>
                  {editMode ? (
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-blue-400"
                            />{" "}
                            First Name
                          </label>
                          <input
                            name="first_name"
                            value={editDetails.first_name || ""}
                            onChange={handleEditDetailsChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-blue-400"
                            />{" "}
                            Middle Name
                          </label>
                          <input
                            name="middle_name"
                            value={editDetails.middle_name || ""}
                            onChange={handleEditDetailsChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-blue-400"
                            />{" "}
                            Last Name
                          </label>
                          <input
                            name="last_name"
                            value={editDetails.last_name || ""}
                            onChange={handleEditDetailsChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-blue-400"
                            />{" "}
                            Coach Name
                          </label>
                          <input
                            name="coach_name"
                            value={editDetails.coach_name || ""}
                            onChange={handleEditDetailsChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-blue-400"
                            />{" "}
                            Club Name
                          </label>
                          <input
                            name="club_name"
                            value={editDetails.club_name || ""}
                            onChange={handleEditDetailsChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faVenusMars}
                              className="text-blue-400"
                            />{" "}
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={editDetails.gender || ""}
                            onChange={handleEditDetailsChange}
                            className="border rounded px-2 py-1 w-full"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faBirthdayCake}
                              className="text-blue-400"
                            />{" "}
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="date_of_birth"
                            value={
                              editDetails.date_of_birth
                                ? editDetails.date_of_birth.slice(0, 10)
                                : ""
                            }
                            onChange={handleEditDetailsChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faClipboardList}
                              className="text-blue-400"
                            />{" "}
                            Age Group
                          </label>
                          <input
                            name="age_group"
                            value={editDetails.age_group || ""}
                            onChange={handleEditDetailsChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faClipboardList}
                              className="text-blue-400"
                            />{" "}
                            District
                          </label>
                          <input
                            name="district"
                            value={editDetails.district || ""}
                            onChange={handleEditDetailsChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faClipboardList}
                              className="text-blue-400"
                            />{" "}
                            Category
                          </label>
                          <select
                            name="category"
                            value={editDetails.category || ""}
                            onChange={handleEditDetailsChange}
                            className="border rounded px-2 py-1 w-full"
                          >
                            <option value="">Select</option>
                            <option value="quad">Quad</option>
                            <option value="inline">Inline</option>
                            <option value="beginner">Beginner</option>
                          </select>
                        </div>
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faClipboardList}
                              className="text-blue-400"
                            />{" "}
                            Aadhaar Number
                          </label>
                          <input
                            name="aadhaar_number"
                            value={editDetails.aadhaar_number || ""}
                            onChange={handleEditDetailsChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </div>
                        <div>
                          <label className="flex text-xs font-semibold text-gray-500 mb-1 items-center gap-2">
                            <FontAwesomeIcon
                              icon={faClipboardList}
                              className="text-blue-400"
                            />{" "}
                            Aadhaar Image
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            name="aadhaar_image"
                            onChange={(e) =>
                              handleEditDetailsChange({
                                target: {
                                  name: "aadhaar_image",
                                  value: e.target.files[0],
                                },
                              })
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                          {editDetails.aadhaar_image &&
                            typeof editDetails.aadhaar_image === "string" && (
                              <div className="mt-1 text-xs text-gray-500">
                                Current:{" "}
                                <span
                                  className="text-blue-600 underline cursor-pointer"
                                  onClick={() =>
                                    setAadhaarPreview(editDetails.aadhaar_image)
                                  }
                                >
                                  View
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end mt-6">
                        <Button
                          variant="outline"
                          className="text-red-700 border-gray-300 hover:bg-red-100"
                          onClick={() => setEditMode(false)}
                          type="button"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-green-500 text-white hover:bg-green-600"
                          onClick={handleSaveDetails}
                          type="button"
                          disabled={detailsLoading}
                        >
                          Save
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-blue-400"
                        />
                        <b>First Name:</b>{" "}
                        <span className="ml-1">
                          {userDetails.first_name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-blue-400"
                        />
                        <b>Middle Name:</b>{" "}
                        <span className="ml-1">
                          {userDetails.middle_name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-blue-400"
                        />
                        <b>Last Name:</b>{" "}
                        <span className="ml-1">
                          {userDetails.last_name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-blue-400"
                        />
                        <b>Coach Name:</b>{" "}
                        <span className="ml-1">
                          {userDetails.coach_name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-blue-400"
                        />
                        <b>Club Name:</b>{" "}
                        <span className="ml-1">
                          {userDetails.club_name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faVenusMars}
                          className="text-blue-400"
                        />
                        <b>Gender:</b>{" "}
                        <span className="ml-1">
                          {userDetails.gender || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faBirthdayCake}
                          className="text-blue-400"
                        />
                        <b>Date of Birth:</b>{" "}
                        <span className="ml-1">
                          {userDetails.date_of_birth
                            ? new Date(
                                userDetails.date_of_birth
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          className="text-blue-400"
                        />
                        <b>Age Group:</b>{" "}
                        <span className="ml-1">
                          {userDetails.age_group || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          className="text-blue-400"
                        />
                        <b>District:</b>{" "}
                        <span className="ml-1">
                          {userDetails.district || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          className="text-blue-400"
                        />
                        <b>Category:</b>{" "}
                        <span className="ml-1">
                          {userDetails.category || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          className="text-blue-400"
                        />
                        <b>Aadhaar Number:</b>{" "}
                        <span className="ml-1">
                          {userDetails.aadhaar_number || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          className="text-blue-400"
                        />
                        <b>Aadhaar Image:</b>{" "}
                        <span className="ml-1">
                          {userDetails.aadhaar_image ? (
                            user.role === "admin" ||
                            user.role === "superadmin" ? (
                              <span
                                className="text-blue-600 underline cursor-pointer"
                                onClick={() =>
                                  setAadhaarPreview(
                                    `${backendUrl}/api/secure-file/${userDetails.aadhaar_image
                                      .split("/")
                                      .pop()}`
                                  )
                                }
                              >
                                View
                              </span>
                            ) : // Only allow user to view their own Aadhaar image
                            userDetails.user_id === user.id ? (
                              <span
                                className="text-blue-600 underline cursor-pointer"
                                onClick={() =>
                                  setAadhaarPreview(
                                    `${backendUrl}/api/secure-file/${userDetails.aadhaar_image
                                      .split("/")
                                      .pop()}`
                                  )
                                }
                              >
                                View
                              </span>
                            ) : (
                              "N/A"
                            )
                          ) : (
                            "N/A"
                          )}
                        </span>
                      </div>
                      <div className="col-span-2 flex gap-2 justify-end mt-4">
                        <Button
                          variant="outline"
                          className="text-blue-700 border-gray-300 hover:bg-blue-100"
                          onClick={() => setIsDetailsModalOpen(false)}
                        >
                          Close
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-700 border-gray-300 hover:bg-red-100"
                          onClick={() => setEditMode(true)}
                        >
                          Edit Details
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>No details found.</div>
              )}
            </div>
          </div>
        )}
        {/* Custom Confirmation Modal */}
        {confirmModal.open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in"
            onClick={() =>
              setConfirmModal({ open: false, registrationId: null })
            }
          >
            <div
              className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-red-700 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  className="text-red-400"
                />
                Confirm Cancellation
              </h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to <b>delete</b> this registration? This
                action cannot be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  className="text-gray-700 border-gray-300 hover:bg-gray-100"
                  onClick={() =>
                    setConfirmModal({ open: false, registrationId: null })
                  }
                >
                  No, Keep
                </Button>
                <Button
                  className="bg-gradient-to-r from-red-400 to-pink-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform"
                  onClick={confirmCancelRegistration}
                >
                  Yes, Delete
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Aadhaar Image Preview Modal */}
        {aadhaarPreview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setAadhaarPreview(null)}
          >
            <div
              className="bg-white rounded-lg p-4 shadow-lg max-w-lg w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={aadhaarPreview}
                alt="Aadhaar Preview"
                className="max-h-[70vh] max-w-full rounded mb-4"
              />
              <Button variant="outline" onClick={() => setAadhaarPreview(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
