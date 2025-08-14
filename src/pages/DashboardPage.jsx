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
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import TeamDetails from "../components/user/userDetailModal/TeamDetails";
import UserDetailsGrid from "../components/user/userDetailModal/UserDetailsGrid";
import PaymentModal from "../components/user/Pay/PaymentModal";
import RegistrationsTab from "../components/user/RegistrationsTab";
import MyProfileTab from "../components/user/MyProfileTab";
import MembershipTab from "../components/user/MembershipTab";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { auth, setUser } = useAuth();
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
  const [profileEdit, setProfileEdit] = useState(user);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
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

  const fetchUser = async () => {
    const data = await apiFetch("/api/users/me", { credentials: "include" });
    setUser(data.user);
    setProfileEdit(data.user); // Optionally update edit state too
  };

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
      toast({ title: "Profile Updated", variant: "success" });
      setProfileEditMode(false);
      window.location.reload(); // Reload the page after successful save
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
                  Manage your event registrations, Membership details, and
                  profile
                </p>
              </div>
              <Tabs
                defaultValue="registrations"
                className="w-full animate-fade-in-up delay-200"
              >
                {/* Beautiful bottom nav bar for mobile, styled like admin panel */}
                <TabsList
                  className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-xl rounded-t-3xl px-2 sm:px-4 py-2 transition-all duration-300 h-23 "
                  style={{
                    paddingBottom: "env(safe-area-inset-bottom)",
                    WebkitPaddingBottom: "env(safe-area-inset-bottom)",
                  }}
                  role="navigation"
                  aria-label="User Navigation"
                >
                  <TabsTrigger
                    value="registrations"
                    className="group flex flex-col items-center justify-center gap-2 px-2 py-1 sm:px-4 sm:py-2 
               rounded-xl transition-all duration-300 relative
               data-[state=active]:text-blue-600 text-gray-600 hover:text-blue-500"
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-110
                 bg-gray-100 group-hover:bg-blue-100"
                    >
                      <FontAwesomeIcon
                        icon={faClipboardList}
                        className="w-5 h-5"
                      />
                    </div>
                    <span className="text-[12px] sm:text-sm font-medium transition-all duration-300">
                      My Registrations
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="memberships"
                    className="group flex flex-col items-center justify-center gap-2 px-2 py-1 sm:px-4 sm:py-2 
               rounded-xl transition-all duration-300 relative
               data-[state=active]:text-pink-600 text-gray-600 hover:text-pink-500"
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-110
                 bg-gray-100 group-hover:bg-pink-100"
                    >
                      <FontAwesomeIcon icon={faIdCard} className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] sm:text-sm font-medium transition-all duration-300">
                      My Memberships
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    className="group flex flex-col items-center justify-center gap-2 px-2 py-1 sm:px-4 sm:py-2 
               rounded-xl transition-all duration-300 relative
               data-[state=active]:text-purple-600 text-gray-600 hover:text-purple-500"
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-110
                 bg-gray-100 group-hover:bg-purple-100"
                    >
                      <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] sm:text-sm font-medium transition-all duration-300">
                      My Profile
                    </span>
                  </TabsTrigger>
                </TabsList>
                <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 pb-16 sm:pb-0 overflow-x-auto">
                  <TabsContent value="registrations">
                    <RegistrationsTab
                      loading={loading}
                      registrations={registrations}
                      events={events}
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
                  <TabsContent value="memberships">
                    <MembershipTab userId={user?.id} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </main>

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
