import { useEffect, useState, useRef } from "react";
import { useToast } from "../hooks/use-toasts";
import useAuth from "../hooks/useAuth";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import Button from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClipboardList,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import TeamDetails from "../components/user/userDetailModal/TeamDetails";
import UserDetailsGrid from "../components/user/userDetailModal/UserDetailsGrid";
import PaymentModal from "../components/user/Pay/PaymentModal";
import RegistrationsTab from "../components/user/RegistrationsTab";
import MyProfileTab from "../components/user/MyProfileTab";

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
  const [editDetails, setEditDetails] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    registrationId: null,
  });
  const cancelButtonRef = useRef();
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileEdit, setProfileEdit] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

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
    try {
      // Use the registration id to fetch user details by registration
      const details = await apiFetch(`/api/user-details/${registration.id}`);
      setUserDetails(details);
      setEditDetails(details);
    } catch (err) {
      setUserDetails(null);
    } finally {
      setDetailsLoading(false);
    }
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
        // Use the registration id for PATCH by registration
        url = `/api/user-details/by-registration/${selectedRegistration.id}`;
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
    e && e.preventDefault();
    setProfileLoading(true);
    try {
      const updated = await apiFetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileEdit),
      });
      if (auth && auth.setUser) auth.setUser(updated);
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
                  <RegistrationsTab
                    loading={loading}
                    registrations={registrations}
                    getEventName={getEventName}
                    handlePaymentClick={handlePaymentClick}
                    handleViewDetails={handleViewDetails}
                    handleCancelRegistration={handleCancelRegistration}
                    cancelButtonRef={cancelButtonRef}
                  />
                </TabsContent>
                <TabsContent value="profile">
                  <MyProfileTab
                    user={user}
                    profileEditMode={profileEditMode}
                    profileEdit={profileEdit}
                    profileLoading={profileLoading}
                    handleProfileEditClick={handleProfileEditClick}
                    handleProfileEditChange={handleProfileEditChange}
                    handleProfileSave={handleProfileSave}
                    setProfileEditMode={setProfileEditMode}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        <Footer />
        <PaymentModal
          selectedRegistration={selectedRegistration}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
        />
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
                  <TeamDetails team={userDetails.team} />
                  <UserDetailsGrid
                    userDetails={userDetails}
                    user={user}
                    setIsDetailsModalOpen={setIsDetailsModalOpen}
                    setEditMode={() => {}}
                    backendUrl={backendUrl}
                    selectedRegistration={selectedRegistration}
                    setUserDetails={setUserDetails}
                  />
                </div>
              ) : (
                <div>No details found.</div>
              )}
            </div>
          </div>
        )}
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
      </div>
    </>
  );
};

export default DashboardPage;
