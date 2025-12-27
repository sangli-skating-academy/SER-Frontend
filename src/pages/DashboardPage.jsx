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
import { API_BASE_URL } from "../utils/apiConfig";

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
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    registrationId: null,
  });
  const cancelButtonRef = useRef();
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileEdit, setProfileEdit] = useState(user);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

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
    } catch {
      setUserDetails(null);
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
    setProfileError(null); // Clear previous errors
    setProfileEditMode(true);
  };

  const handleProfileEditChange = (e) => {
    setProfileEdit({ ...profileEdit, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (profileError) setProfileError(null);
  };

  const handleProfileSave = async (e) => {
    e && e.preventDefault();
    setProfileLoading(true);
    setProfileError(null); // Clear previous errors
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
      // Set error message for display in component
      const errorMessage =
        err.message || "Failed to update profile. Please try again.";
      setProfileError(errorMessage);

      // Also show toast
      toast({
        title: "Error",
        description: errorMessage,
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
        <main className="flex-grow bg-gradient-to-br from-blue-50 via-white to-pink-50 animate-fade-in">
          <div className="container mx-auto">
            <div className="max-w-5xl mx-auto">
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
               data-[state=active]:text-blue-600 data-[state=active]:font-bold text-gray-600 hover:text-blue-500"
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-110
                 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600
                 bg-gray-100 group-hover:bg-blue-100"
                    >
                      <FontAwesomeIcon
                        icon={faClipboardList}
                        className="w-5 h-5"
                      />
                    </div>
                    <span className="text-[12px] sm:text-sm font-medium data-[state=active]:font-bold transition-all duration-300">
                      My Registrations
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="memberships"
                    className="group flex flex-col items-center justify-center gap-2 px-2 py-1 sm:px-4 sm:py-2 
               rounded-xl transition-all duration-300 relative
               data-[state=active]:text-pink-600 data-[state=active]:font-bold text-gray-600 hover:text-pink-500"
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-110
                 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600
                 bg-gray-100 group-hover:bg-pink-100"
                    >
                      <FontAwesomeIcon icon={faIdCard} className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] sm:text-sm font-medium data-[state=active]:font-bold transition-all duration-300">
                      My Memberships
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    className="group flex flex-col items-center justify-center gap-2 px-2 py-1 sm:px-4 sm:py-2 
               rounded-xl transition-all duration-300 relative
               data-[state=active]:text-purple-600 data-[state=active]:font-bold text-gray-600 hover:text-purple-500"
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-110
                 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600
                 bg-gray-100 group-hover:bg-purple-100"
                    >
                      <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] sm:text-sm font-medium data-[state=active]:font-bold transition-all duration-300">
                      My Profile
                    </span>
                  </TabsTrigger>
                </TabsList>
                <div className="w-full max-w-4xl mx-auto sm:px-4 pb-16 sm:pb-0 mb-30">
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
                      profileError={profileError}
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
              className="bg-white rounded-lg p-2 sm:p-4 md:p-6 shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl animate-fade-in-up overflow-y-auto max-h-[90vh] mx-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-pink-400" />
                Registration Details
              </h2> */}
              {detailsLoading ? (
                <div>Loading...</div>
              ) : userDetails ? (
                <div>
                  <UserDetailsGrid
                    userDetails={userDetails}
                    user={user}
                    setIsDetailsModalOpen={setIsDetailsModalOpen}
                    setEditMode={() => {}}
                    backendUrl={API_BASE_URL}
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
