import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import Badge from "../components/ui/badge";
import Button from "../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Separator } from "../components/ui/seperator";
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
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EventDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchEventById(id)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setIsLoading(false));
  }, [id]);

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
          <div className="flex items-center space-x-2 mb-4">
            <Badge
              variant="outline"
              className="bg-blue-400/20 text-white border-blue-400/40 px-3 py-1 animate-fade-in"
            >
              {event.age_group}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-400/20 text-white border-blue-400/40 px-3 py-1 animate-fade-in"
            >
              {event.gender}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-400/20 text-white border-blue-400/40 px-3 py-1 animate-fade-in"
            >
              {event.is_team_event ? "Team Event" : "Solo Event"}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2 animate-gradient-x bg-gradient-to-r from-blue-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            {event.title}
          </h1>
          <div className="flex items-center text-white/90 mt-2 animate-fade-in">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-5 h-5 mr-2" />
            <span>{formatDate(event.start_date)}</span>
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
              <TabsTrigger value="rules">Rules & Guidelines</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <h2 className="text-2xl font-bold mb-4">Event Overview</h2>
              <p className="text-muted-foreground mb-6">{event.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FontAwesomeIcon
                        icon={faMedal}
                        className="w-5 h-5 mr-2 text-blue-400"
                      />
                      Competition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Challenge yourself against fellow sports enthusiasts in a
                      friendly but competitive environment.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="w-5 h-5 mr-2 text-blue-400"
                      />
                      Community
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Connect with others who share your passion and expand your
                      network.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="w-5 h-5 mr-2 text-blue-400"
                      />
                      Professional Timing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      All performances are timed using professional equipment
                      for accurate results.
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="w-5 h-5 mr-2 text-blue-400"
                      />
                      Expert Coaches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Qualified coaches will be present to provide guidance and
                      feedback.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
              <h3 className="text-xl font-bold mb-3">Event Highlights</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Medals and certificates for top performers</li>
                <li>Refreshments available throughout the event</li>
                <li>
                  Networking opportunities with coaches and other participants
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="rules">
              <h2 className="text-2xl font-bold mb-4">Rules & Guidelines</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <FontAwesomeIcon
                      icon={faScroll}
                      className="w-5 h-5 mr-2 text-blue-400"
                    />
                    General Rules
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>
                      All participants must arrive 30 minutes before the
                      scheduled start time
                    </li>
                    <li>
                      Participants must bring valid ID matching their
                      registration information
                    </li>
                    <li>Appropriate sports attire and gear are required</li>
                    <li>
                      Unsportsmanlike behavior will result in disqualification
                    </li>
                    <li>The decisions of the judges and referees are final</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    Equipment Requirements
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>
                      All participants must bring their own gear (specifics
                      depend on the sport)
                    </li>
                    <li>Equipment must meet safety standards</li>
                    <li>
                      Limited equipment may be available for rent (subject to
                      availability)
                    </li>
                    <li>Helmets are mandatory for all skating events</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="text-xl font-bold mb-3">Scoring System</h3>
                  <p className="text-muted-foreground mb-3">
                    Participants will be judged on the following criteria:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Technique</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          Proper form, execution of movements, and technical
                          precision.
                        </CardDescription>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Speed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          Time taken to complete the course or performance.
                        </CardDescription>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Creativity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          Unique elements, style, and artistic expression.
                        </CardDescription>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Difficulty</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          Level of challenge in the performed routines or
                          maneuvers.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="location">
              <h2 className="text-2xl font-bold mb-4">Event Location</h2>
              <p className="text-muted-foreground mb-6">{event.location}</p>
              <div className="rounded-lg overflow-hidden border h-[400px] mb-6 relative">
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Directions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        <strong>By Car:</strong> Parking available on-site.
                        Follow signs for event parking.
                      </li>
                      <li>
                        <strong>Public Transport:</strong> Bus routes 22, 34,
                        and 56 stop within a 5-minute walk.
                      </li>
                      <li>
                        <strong>Cycling:</strong> Bike racks available at the
                        entrance.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Venue Facilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        <strong>Restrooms:</strong> Located on each level of the
                        venue.
                      </li>
                      <li>
                        <strong>Food:</strong> Cafeteria and food stalls
                        available.
                      </li>
                      <li>
                        <strong>First Aid:</strong> Medical station near the
                        main entrance.
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
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Registration Fee</span>
                <span className="font-medium">
                  Rs. {event.price_per_person * (event.max_team_size || 1)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {formatDate(event.start_date)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{event.location}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Age Group</span>
                <span className="font-medium">{event.age_group}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-medium">{event.gender}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">
                  {event.is_team_event ? "Team" : "Individual"}
                </span>
              </div>
              <div className="pt-4 space-y-3">
                <Button size="lg" className="w-full" variant="outline">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                  <Link to={`/register/${event.id}`}>Register Now</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={handleShare}
                >
                  <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                  Share Event
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Have questions about this event? Contact the organizer
                  directly.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-20">Email:</span>
                    <span className="font-medium">scers@sportsclub.com</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-20">Phone:</span>
                    <span className="font-medium">(+91) 123-456-7890</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetailPage;
