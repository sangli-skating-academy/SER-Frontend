import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AdminLayout from "../components/admin/layouts/AdminLayout";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import Button from "../components/ui/button";
import Skeleton from "../components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCalendarAlt,
  faClipboardList,
  faMoneyBillWave,
  faSyncAlt,
  faPlusCircle,
  faMessage,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../services/api";
import { fetchEvents } from "../services/eventApi";
import UserDetailsModal from "../components/admin/Modals/UserDetailsModal";
import RegistrationsTable from "../components/admin/Tables/RegistrationsTable";
import EventsTable from "../components/admin/Tables/EventsTable";
import GalleryTable from "../components/admin/Tables/GalleryTable";

const AdminDasboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [contactMessages, setContactMessages] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        usersRes,
        eventsRes,
        regsRes,
        paymentsRes,
        contactRes,
        galleryRes,
      ] = await Promise.all([
        apiFetch("/api/admin/users"),
        fetchEvents({ includePast: "true" }), // Pass as string to match backend check
        apiFetch("/api/admin/registrations/all"),
        apiFetch("/api/payment").catch(() => []), // payments optional
        apiFetch("/api/admin/contact/all").catch(() => []), // contact messages
        apiFetch("/api/gallery/all").catch(() => []), // gallery items
      ]);
      setUsers(usersRes.users || usersRes);
      setEvents(eventsRes.events || eventsRes);
      setRegistrations(regsRes.registrations || regsRes);
      setPayments(paymentsRes.payments || paymentsRes);
      setContactMessages(contactRes.messages || contactRes || []);
      setGalleryItems(galleryRes || []);
    } catch (error) {
      // Optionally show toast
    } finally {
      setLoading(false);
    }
  };

  // Refresh handler
  const refreshData = () => {
    setIsLoading(true);
    fetchDashboardData().finally(() => setIsLoading(false));
  };

  // Add missing handleAddEvent
  const handleAddEvent = () => {
    navigate("/admin/addevent");
  };

  useEffect(() => {
    setMounted(true);
    if (!auth.loading && (!auth.user || auth.user.role !== "admin")) {
      navigate("/");
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (mounted && auth.user && auth.user.role === "admin")
      fetchDashboardData();
  }, [mounted, auth.user]);

  // Split events into 'happening today' and 'upcoming'
  const todayEventsDate = new Date();
  todayEventsDate.setHours(0, 0, 0, 0);
  const happeningToday = events.filter((e) => {
    if (!e.start_date) return false;
    const eventDate = new Date(e.start_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === todayEventsDate.getTime();
  });
  const upcomingEvents = events.filter((e) => {
    if (!e.start_date) return false;
    const eventDate = new Date(e.start_date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() > todayEventsDate.getTime();
  });

  // Calculate stats
  const totalUsers = users.length;
  const playerCount = users.filter((u) => u.role === "player").length;
  const coachCount = users.filter((u) => u.role === "coach").length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  // Only count live events for stats
  const liveEvents = events.filter((e) => e.live === true || e.live === "TRUE");
  const totalEvents = liveEvents.length;
  // Only payments for live events
  const liveEventIds = new Set(liveEvents.map((e) => e.id));
  const totalRegistrations = registrations.filter((r) =>
    liveEventIds.has(r.event_id)
  ).length;
  const totalRevenue = payments
    .filter((p) => liveEventIds.has(p.event_id))
    .reduce(
      (sum, p) => (p.status === "success" ? sum + Number(p.amount) : sum),
      0
    );
  const activeEvents = liveEvents.filter(
    (e) => !e.is_archived && new Date(e.start_date) >= new Date()
  ).length;
  const pendingRegistrations = registrations.filter(
    (r) => r.status === "pending" && liveEventIds.has(r.event_id)
  ).length;
  const overEvents = events.filter(
    (e) => new Date(e.start_date) < new Date()
  ).length;
  const happeningTodayCount = happeningToday.length;

  // Recent registrations (latest 5, payment status 'success', for live events only)
  const recentRegs = registrations
    .filter((r) => {
      if (r.payment_status !== "success") return false;
      const event = events.find((e) => e.id === r.event_id);
      return event && (event.live === true || event.live === "TRUE");
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map((r) => {
      const event = events.find((e) => e.id === r.event_id);
      return {
        id: r.id,
        userName: r.full_name || r.username || "-",
        userRole: r.user_role || "-",
        eventTitle: r.event_title || "-",
        registrationType: r.registration_type,
        registrationDate: r.created_at,
        amount: r.payment_amount || 0,
        status: r.status?.charAt(0).toUpperCase() + r.status?.slice(1),
        coachName: r.coach_name,
        clubName: r.club_name,
        ageGroup: r.age_group,
        live: true,
        details: r,
      };
    });

  // Upcoming events (latest 5, all event details mapped)
  const upcomingEvts = events
    .filter((e) => new Date(e.start_date) >= new Date())
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    .slice(0, 5)
    .map((e) => ({
      ...e,
      registrations: registrations.filter((r) => r.event_id === e.id).length,
      status: new Date(e.start_date) >= new Date() ? "Open" : "Closed",
    }));

  // Show only the latest 5 contact messages in dashboard
  const recentContactMessages = contactMessages.slice(0, 5);

  if (!mounted || auth.loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <Skeleton className="w-40 h-40" />
      </div>
    );

  return (
    <AdminLayout>
      {/* Decorative animated gradient overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-400 via-pink-300 to-blue-200 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-400 via-blue-200 to-blue-400 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>
      <main className="flex-grow py-10 relative z-10">
        <div className="container mx-auto px-2 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in-up">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-xl">
                Admin Dashboard
              </h1>
              <p className="text-gray-500  text-lg mt-2">
                Manage events, users, and registrations
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isLoading}
                className="transition-all hover:scale-105 shadow"
              >
                <FontAwesomeIcon
                  icon={faSyncAlt}
                  spin={isLoading}
                  className="mr-2 h-4 w-4"
                />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={handleAddEvent}
                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-semibold shadow hover:scale-105 transition-transform"
              >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-4 w-4" />
                New Event
              </Button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10 animate-fade-in-up">
            {(() => {
              // Only payments for live events
              const liveEventIds = new Set(liveEvents.map((e) => e.id));
              const livePayments = payments.filter((p) =>
                liveEventIds.has(p.event_id)
              );
              const totalLiveRevenue = livePayments.reduce(
                (sum, p) =>
                  p.status === "success" ? sum + Number(p.amount) : sum,
                0
              );
              const pendingLiveAmount = livePayments
                .filter((p) => p.status === "pending")
                .reduce((sum, p) => sum + Number(p.amount), 0);
              return [
                {
                  label: "Total Users",
                  value: totalUsers,
                  icon: faUsers,
                  color: "from-blue-400 to-blue-600",
                  sub: `Players: ${coachCount} | Admins: ${adminCount}`,
                },
                {
                  label: "Total Events",
                  value: totalEvents,
                  icon: faCalendarAlt,
                  color: "from-pink-400 to-pink-600",
                  sub: `${activeEvents} active | ${happeningTodayCount} today | ${overEvents} over`,
                },
                {
                  label: "Total Registrations",
                  value: totalRegistrations,
                  icon: faClipboardList,
                  color: "from-purple-400 to-blue-400",
                  sub: `${pendingRegistrations} pending | ${
                    totalRegistrations - pendingRegistrations
                  } completed`,
                },
                {
                  label: "Total Revenue",
                  value: `RS. ${totalLiveRevenue.toLocaleString()}`,
                  icon: faMoneyBillWave,
                  color: "from-green-400 to-blue-400",
                  sub: `${
                    pendingLiveAmount
                      ? "Rs." + pendingLiveAmount.toLocaleString() + " pending"
                      : "All paid"
                  }`,
                },
              ];
            })().map((stat, i) => (
              <Card
                key={stat.label}
                className={`group p-0 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white/90 backdrop-blur-md animate-fade-in-up`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`flex items-center gap-4 p-6 pb-2`}>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-tr ${stat.color} text-white text-2xl shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <FontAwesomeIcon icon={stat.icon} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-700">
                      {stat.label}
                    </CardTitle>
                    <div className="text-2xl font-bold mt-1">{stat.value}</div>
                  </div>
                </div>
                <CardContent className="pt-0 pb-4 px-6">
                  <p className="text-xs text-gray-500 ">{stat.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="registrations" className="animate-fade-in-up">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:w-auto md:inline-flex mb-4">
              <TabsTrigger
                value="registrations"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-pink-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-sm sm:text-lg font-semibold transition-all duration-200"
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />{" "}
                Registrations
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-pink-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-sm sm:text-lg font-semibold transition-all duration-200"
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Events
              </TabsTrigger>
              <TabsTrigger
                value="Contact-Messages"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-pink-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-sm sm:text-lg font-semibold transition-all duration-200"
              >
                <FontAwesomeIcon icon={faMessage} className="mr-2" /> Contact
                Messages
              </TabsTrigger>
            </TabsList>

            {/* Registrations Tab */}
            <TabsContent
              value="registrations"
              className="space-y-4 animate-fade-in-up"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Registrations</h2>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="transition-all hover:scale-105"
                >
                  <Link to="/admin/registrations">View All</Link>
                </Button>
              </div>
              <RegistrationsTable
                data={recentRegs}
                rowLimit={5}
                onRowClick={(reg) => {
                  setSelectedReg(reg.details || reg);
                  setModalOpen(true);
                }}
              />
              <UserDetailsModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                selectedReg={selectedReg}
              />
            </TabsContent>

            {/* Events Tab */}
            <TabsContent
              value="events"
              className="space-y-4 animate-fade-in-up"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Events</h2>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="transition-all hover:scale-105"
                >
                  <Link to="/admin/events">Manage Events</Link>
                </Button>
              </div>
              {/* Happening Today Table */}
              {happeningToday.length > 0 && (
                <EventsTable
                  data={happeningToday}
                  rowLimit={5}
                  registrations={registrations}
                  label="Happening Today"
                />
              )}
              {/* Upcoming Events Table */}
              <EventsTable
                data={upcomingEvents}
                rowLimit={5}
                registrations={registrations}
                label="Upcoming Events"
              />
            </TabsContent>

            {/* Contact Messages Tab */}
            <TabsContent
              value="Contact-Messages"
              className="space-y-4 animate-fade-in-up"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Contact Messages</h2>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="transition-all hover:scale-105"
                >
                  <Link to="/admin/allcontactmessages">View All</Link>
                </Button>
              </div>
              <div className="bg-white/90 rounded-xl shadow-lg border overflow-hidden animate-fade-in-up">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 via-pink-50 to-blue-100">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500  uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500  uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500  uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500  uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500  uppercase tracking-wider">
                          Message
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentContactMessages.map((message) => (
                        <tr key={message.id} className="border-b">
                          <td className="px-4 py-3 text-sm text-black">
                            {message.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-black">
                            {message.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-black">
                            {message.phone || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-black">
                            {message.subject}
                          </td>
                          <td className="px-4 py-3 text-sm text-black">
                            {message.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminDasboardPage;
