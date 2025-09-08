import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import Button from "../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import Skeleton from "../components/ui/skeleton";
import { useToast } from "../hooks/use-toasts";
import { fetchEventById } from "../services/eventApi";
import { formatDate } from "../utils/formatDate";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faClock,
  faInfoCircle,
  faMedal,
  faScroll,
  faShareAlt,
  faArrowLeft,
  faArrowRight,
  faEnvelope,
  faPhone,
  faCar,
  faBicycle,
  faRestroom,
  faUtensils,
  faFirstAid,
  faCheckCircle,
  faSkating,
  faTrophy,
  faMoneyCheck,
  faGenderless,
  faUser,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../hooks/useAuth";
import { apiFetch } from "../services/api";
import LoginModal from "../components/auth/LoginModal";

const EventDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const user = auth?.user;
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchEventById(id)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setIsLoading(false));
    // Check registration if user is player
    if (user && user.role === "player") {
      apiFetch(`/api/registrations/user/${user.id}`)
        .then((regs) => {
          setIsRegistered(regs.some((r) => r.event_id === Number(id)));
          // Find registration for this event
          const reg = regs.find((r) => r.event_id === Number(id));
          setRegistrationStatus(reg ? reg.status : null);
        })
        .catch(() => {
          setIsRegistered(false);
          setRegistrationStatus(null);
        });
    }
  }, [id, user]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event?.title,
          text: `Check out this event: ${event?.title}`,
          url: window.location.href,
        })
        .catch(() => {
          toast({
            title: "Error sharing",
            description: "There was an error sharing this event.",
          });
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Event link copied to clipboard!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Skeleton className="w-full max-w-2xl h-96" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Event Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Event Details | Sai Skating Academy</title>
        <meta
          name="description"
          content="View details for this skating event at Sai Skating Academy."
        />
        <meta
          property="og:title"
          content="Event Details | Sai Skating Academy"
        />
        <meta
          property="og:description"
          content="View details for this skating event at Sai Skating Academy."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <Header />
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center h-[45vh] flex items-end animate-fade-in-up"
          style={{
            backgroundImage: `url(${
              event.image_url || "/images/default-event.jpg"
            })`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="container mx-auto px-4 py-10 relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 animate-gradient-x bg-gradient-to-r from-blue-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              {event.title}
            </h1>
            <div className="flex items-center text-white/90 mt-2 animate-fade-in">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5 mr-2" />
              <span>{formatDate(event.start_date)}</span>
              {event.start_time && (
                <>
                  <FontAwesomeIcon
                    icon={faClock}
                    className="w-5 h-5 ml-6 mr-2"
                  />
                  <span>{event.start_time}</span>
                </>
              )}
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="w-5 h-5 ml-6 mr-2"
              />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <main className="container mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8 flex-grow">
          {/* Main Tabs */}
          <div
            className="w-full lg:w-2/3 animate-fade-in-up"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none mb-6 overflow-x-auto flex-nowrap">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="space-y-8">
                  {/* Event Categories */}
                  {event.event_category &&
                    Object.keys(event.event_category).length > 0 && (
                      <Card className="bg-gradient-to-tr from-green-50 via-white to-blue-50 border-0 shadow-lg animate-fade-in-up">
                        <CardHeader className="flex flex-row items-center gap-3 pb-2">
                          <span className="rounded-full bg-green-200 p-2">
                            <FontAwesomeIcon
                              icon={faTrophy}
                              className="w-6 h-6 text-green-600"
                            />
                          </span>
                          <CardTitle className="text-lg text-green-400">
                            Event Categories
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-none space-y-3 mt-2">
                            {Object.entries(event.event_category).map(
                              ([key, value], i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="mt-1 text-green-400">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                  </span>
                                  <span className="text-gray-700 font-semibold">
                                    {key}:
                                  </span>
                                  <span className="text-gray-700">
                                    {Array.isArray(value)
                                      ? value.join(", ")
                                      : value}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                  {Array.isArray(event.skate_category) &&
                    event.skate_category.length > 0 && (
                      <Card className="bg-gradient-to-tr from-pink-50 via-white to-blue-50 border-0 shadow-lg animate-fade-in-up mt-4">
                        <CardHeader className="flex flex-row items-center gap-3 pb-2">
                          <span className="rounded-full bg-pink-200 p-2">
                            <FontAwesomeIcon
                              icon={faSkating}
                              className="w-6 h-6 text-pink-600"
                            />
                          </span>
                          <CardTitle className="text-lg text-pink-600">
                            Skate Categories
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-none space-y-3 mt-2">
                            {event.skate_category.map((cat, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1 text-pink-400">
                                  <FontAwesomeIcon icon={faCheckCircle} />
                                </span>
                                <span className="text-gray-700 font-semibold">
                                  {cat}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  {/* General Rules */}
                  {event.rules_and_guidelines?.general_rules?.length > 0 && (
                    <Card className="bg-gradient-to-tr from-blue-50 via-white to-pink-50 border-0 shadow-lg animate-fade-in-up">
                      <CardHeader className="flex flex-row items-center gap-3 pb-2">
                        <span className="rounded-full bg-blue-200 p-2">
                          <FontAwesomeIcon
                            icon={faScroll}
                            className="w-6 h-6 text-blue-600"
                          />
                        </span>
                        <CardTitle className="text-lg">General Rules</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-none space-y-3 mt-2">
                          {event.rules_and_guidelines.general_rules.map(
                            (rule, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1 text-blue-400">
                                  <FontAwesomeIcon icon={faInfoCircle} />
                                </span>
                                <span className="text-gray-700">{rule}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  {/* Equipment Requirements */}
                  {event.rules_and_guidelines?.equipment_requirements?.length >
                    0 && (
                    <Card className="bg-gradient-to-tr from-pink-50 via-white to-blue-50 border-0 shadow-lg animate-fade-in-up delay-100">
                      <CardHeader className="flex flex-row items-center gap-3 pb-2">
                        <span className="rounded-full bg-pink-200 p-2">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="w-6 h-6 text-pink-600"
                          />
                        </span>
                        <CardTitle className="text-lg text-pink-600">
                          Equipment Requirements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-none space-y-3 mt-2">
                          {event.rules_and_guidelines.equipment_requirements.map(
                            (rule, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1 text-pink-400">
                                  <FontAwesomeIcon icon={faInfoCircle} />
                                </span>
                                <span className="text-gray-700">{rule}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  {/* Scoring System */}
                  {event.rules_and_guidelines?.scoring_system?.length > 0 && (
                    <Card className="bg-gradient-to-tr from-blue-50 via-white to-pink-50 border-0 shadow-lg animate-fade-in-up delay-200">
                      <CardHeader className="flex flex-row items-center gap-3 pb-2">
                        <span className="rounded-full bg-yellow-100 p-2">
                          <FontAwesomeIcon
                            icon={faMedal}
                            className="w-6 h-6 text-yellow-500"
                          />
                        </span>
                        <CardTitle className="text-lg text-yellow-500">
                          Scoring System
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-3">
                          Participants will be judged on the following criteria:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {event.rules_and_guidelines.scoring_system.map(
                            (item, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 bg-white/80 rounded-lg shadow p-4 animate-fade-in-up"
                              >
                                <span className="rounded-full bg-yellow-200 p-2">
                                  <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    className="w-6 h-6 text-yellow-600"
                                  />
                                </span>
                                <div>
                                  <div className="font-semibold text-gray-800">
                                    {item.title}
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    {item.desc}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="location">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-pink-500 w-7 h-7 animate-bounce-x"
                  />
                  Event Location
                </h2>

                <div className="rounded-2xl overflow-hidden border-2 border-blue-100 h-[400px] mb-8 shadow-xl animate-fade-in-up relative">
                  {!isMapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    </div>
                  )}
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      event.location
                    )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full"
                    onLoad={() => setIsMapLoaded(true)}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Event Location"
                  ></iframe>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-gradient-to-tr from-blue-50 via-white to-pink-50 border-0 shadow animate-fade-in-up">
                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                      <span className="rounded-full bg-blue-200 p-2">
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="w-5 h-5 text-blue-600"
                        />
                      </span>
                      <CardTitle className="text-lg">Directions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                          <FontAwesomeIcon
                            icon={faCar}
                            className="text-blue-400 mt-1"
                          />
                          <span>
                            <strong>By Car:</strong> Parking available on-site.
                            Follow signs for event parking.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FontAwesomeIcon
                            icon={faBicycle}
                            className="text-green-400 mt-1"
                          />
                          <span>
                            <strong>Cycling:</strong> Bike racks available at
                            the entrance.
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-tr from-pink-50 via-white to-blue-50 border-0 shadow animate-fade-in-up delay-100">
                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                      <span className="rounded-full bg-pink-200 p-2">
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="w-5 h-5 text-pink-600"
                        />
                      </span>
                      <CardTitle className="text-lg text-pink-600">
                        Venue Facilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-2">
                          <FontAwesomeIcon
                            icon={faRestroom}
                            className="text-blue-400 mt-1"
                          />
                          <span>
                            <strong>Restrooms:</strong> Located on each level of
                            the venue.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FontAwesomeIcon
                            icon={faUtensils}
                            className="text-pink-400 mt-1"
                          />
                          <span>
                            <strong>Food:</strong> Cafeteria and food stalls
                            available.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FontAwesomeIcon
                            icon={faFirstAid}
                            className="text-green-400 mt-1"
                          />
                          <span>
                            <strong>First Aid:</strong> Medical team on site.
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          {/* Sidebar */}
          <div
            className="w-full lg:w-1/3 space-y-6 animate-fade-in-up"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Card className="bg-gradient-to-tr from-blue-50 via-white to-pink-50 border-0 shadow-xl animate-fade-in-up">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <span className="rounded-full bg-blue-200 p-2">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="w-6 h-6 text-blue-600"
                  />
                </span>
                <CardTitle className="text-lg">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 bg-white/80 rounded-lg p-3 shadow animate-fade-in-up">
                    <span className="rounded-full bg-yellow-100 p-2">
                      <FontAwesomeIcon
                        icon={faMoneyCheck}
                        className="w-5 h-5 text-yellow-600"
                      />
                    </span>
                    <span className="text-muted-foreground flex-1">
                      Registration Fee
                    </span>
                    <span className="font-bold text-lg text-yellow-700">
                      Rs.{" "}
                      {parseFloat(
                        event.price_per_person * event.max_team_size
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white/80 rounded-lg p-3 shadow animate-fade-in-up delay-150">
                    <span className="rounded-full bg-green-100 p-2">
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="w-5 h-5 text-green-600"
                      />
                    </span>
                    <span className="text-muted-foreground flex-1">
                      Age Group
                    </span>
                    <span className="font-medium">
                      {Array.isArray(event.age_group)
                        ? event.age_group.join(", ")
                        : typeof event.age_group === "string"
                        ? event.age_group
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/80 rounded-lg p-3 shadow animate-fade-in-up delay-200">
                    <span className="rounded-full bg-purple-100 p-2">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="w-5 h-5 text-purple-600"
                      />
                    </span>
                    <span className="text-muted-foreground flex-1">Gender</span>
                    <span className="font-medium">{event.gender}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/80 rounded-lg p-3 shadow animate-fade-in-up delay-250">
                    <span className="rounded-full bg-orange-100 p-2">
                      <FontAwesomeIcon
                        icon={event.is_team_event ? faUsers : faMedal}
                        className="w-5 h-5 text-orange-600"
                      />
                    </span>
                    <span className="text-muted-foreground flex-1">Type</span>
                    <span className="font-medium">
                      {event.is_team_event ? "Team" : "Individual"}
                    </span>
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  {/* Registration button logic */}
                  {(() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const eventDate = event.start_date
                      ? new Date(event.start_date)
                      : null;
                    if (eventDate) eventDate.setHours(0, 0, 0, 0);
                    const isToday =
                      eventDate && eventDate.getTime() === today.getTime();

                    // If not logged in or not registered, show Registration Closed on event day
                    if (isToday && (!user || !isRegistered)) {
                      return (
                        <Button
                          size="lg"
                          className="w-full border-1 bg-gray-400 text-white cursor-not-allowed"
                          disabled
                        >
                          Registration Closed
                        </Button>
                      );
                    }
                    // If user is registered
                    if (user && isRegistered) {
                      // If registration is confirmed, show dashboard button
                      if (registrationStatus === "confirmed") {
                        return (
                          <Button
                            size="lg"
                            className="w-full border-1 bg-blue-500 text-white hover:bg-blue-600 transition-colors animate-fade-in-up"
                            onClick={() => navigate("/dashboard")}
                          >
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="mr-2"
                            />
                            Take me to Dashboard
                          </Button>
                        );
                      } else {
                        // Not confirmed, show Pay button
                        return (
                          <Button
                            size="lg"
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 border-0"
                            onClick={() => navigate("/dashboard")}
                          >
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="w-5 h-5 mr-2"
                            />
                            Complete Payment
                          </Button>
                        );
                      }
                    }
                    // Not logged in
                    if (!user) {
                      return (
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 border-0"
                          onClick={() => setIsLoginModalOpen(true)}
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            className="w-5 h-5 mr-2"
                          />
                          Login to Register
                        </Button>
                      );
                    }
                    // Default: show Register Now
                    return (
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 border-0"
                        asChild
                      >
                        <Link
                          to={`/register/${event.id}`}
                          className="flex items-center justify-center gap-2"
                        >
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="w-5 h-5"
                          />
                          Register Now
                        </Link>
                      </Button>
                    );
                  })()}

                  {/* Enhanced Share Button */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md"
                      onClick={handleShare}
                    >
                      <FontAwesomeIcon
                        icon={faShareAlt}
                        className="w-4 h-4 mr-2 text-blue-500"
                      />
                      Share Event
                    </Button>

                    {/* Quick Share Options */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 p-0 bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all duration-200"
                        onClick={() => {
                          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                            `Check out this skating event: ${event?.title} - ${window.location.href}`
                          )}`;
                          window.open(whatsappUrl, "_blank");
                        }}
                        title="Share on WhatsApp"
                      >
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-tr from-pink-50 via-white to-blue-50 border-0 shadow-xl animate-fade-in-up">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <span className="rounded-full bg-pink-200 p-2">
                  <FontAwesomeIcon
                    icon={faInbox}
                    className="w-6 h-6 text-pink-600"
                  />
                </span>
                <CardTitle className="text-lg text-pink-600">
                  Contact Organizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-base">
                    Have questions about this event? Contact the organizer
                    directly for more information or assistance.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 bg-white/80 rounded-lg p-3 shadow animate-fade-in-up">
                      <span className="rounded-full bg-blue-100 p-2">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="w-5 h-5 text-blue-600"
                        />
                      </span>
                      <span className="text-muted-foreground flex-1">
                        Email
                      </span>
                      <span className="font-medium break-all text-sm sm:text-base">
                        saiskating2200@gmail.com
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/80 rounded-lg p-3 shadow animate-fade-in-up delay-50">
                      <span className="rounded-full bg-green-100 p-2">
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="w-5 h-5 text-green-600"
                        />
                      </span>
                      <span className="text-muted-foreground flex-1">
                        Phone
                      </span>
                      <span className="font-medium">
                        +91 9595893434 (Suraj A. Shinde)
                        <br />
                        +91 9595473434 (Parvind Shinde)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
        {isLoginModalOpen && (
          <LoginModal onClose={() => setIsLoginModalOpen(false)} />
        )}
      </div>
    </>
  );
};

export default EventDetailPage;
