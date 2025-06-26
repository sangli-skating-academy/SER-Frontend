import { useEffect, useState } from "react";
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
    document.title = "Dashboard | SCERS";
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

  const handleCancelRegistration = async (registrationId) => {
    if (window.confirm("Are you sure you want to cancel this registration?")) {
      try {
        await apiFetch(`/api/registrations/${registrationId}/cancel`, {
          method: "PATCH",
        });
        setRegistrations((registrations) =>
          registrations.filter((r) => r.id !== registrationId)
        );
        toast({
          title: "Registration Cancelled",
          description: "Your registration has been cancelled successfully",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            error.message || "Failed to cancel registration. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getEventName = (eventId) => {
    return (
      events.find((event) => event.id === eventId)?.title || "Unknown Event"
    );
  };

  if (!user) return null;

  return (
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
                  <FontAwesomeIcon icon={faClipboardList} className="mr-2" /> My
                  Registrations
                </TabsTrigger>
                <TabsTrigger value="profile">
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> My Profile
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
                                  <FontAwesomeIcon icon={faClock} /> Registered
                                  on:{" "}
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
                                {registration.status !== "cancelled" && (
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleCancelRegistration(registration.id)
                                    }
                                    className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-transform animate-fade-in-up"
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
                      <div className="flex justify-center mt-6">
                        <Button
                          variant="default"
                          className="bg-gradient-to-r from-blue-400 to-pink-400 hover:from-pink-400 hover:to-blue-400 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform animate-fade-in-up"
                        >
                          <FontAwesomeIcon icon={faUser} className="mr-2" />{" "}
                          Edit Profile
                        </Button>
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
              <FontAwesomeIcon icon={faCreditCard} className="text-pink-400" />
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
    </div>
  );
};

export default DashboardPage;
