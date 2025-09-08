import { useState, useEffect } from "react";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import { Card, CardContent } from "../components/ui/card";
import Skeleton from "../components/ui/skeleton";
import { fetchEvents } from "../services/eventApi";
import { Helmet } from "react-helmet-async";
import EventCard from "../components/ui/EventCard";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import Button from "../components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSearch,
  faSortAmountDown,
  faSortAmountUp,
  faCalendarAlt,
  faDollarSign,
  faUsers,
  faUser,
  faClock,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    hashtag: "all",
    ageGroup: "all",
    gender: "all",
    search: "",
  });
  const [sortBy, setSortBy] = useState("date-asc"); // date-asc, date-desc, price-asc, price-desc, name-asc
  const [hashtags, setHashtags] = useState([]);
  const [ageGroups, setAgeGroups] = useState(["all"]);
  const [genders, setGenders] = useState(["all"]);

  useEffect(() => {
    document.title = "Browse All Events";
    const fetchData = async () => {
      setIsLoading(true);
      // Always fetch all events, filtering client-side for now
      const data = await fetchEvents();
      const eventsArr = Array.isArray(data) ? data : data.events || [];
      // Only show events where live is true
      const liveEventsArr = eventsArr.filter(
        (ev) =>
          ev.live === true ||
          ev.live === "true" ||
          ev.is_live === true ||
          ev.is_live === "true"
      );
      setEvents(liveEventsArr);
      // Collect all unique hashtags
      const allTags = new Set();
      const allAgeGroups = new Set();
      const allGenders = new Set();
      eventsArr.forEach((ev) => {
        // Hashtags
        Array.isArray(ev.hashtags)
          ? ev.hashtags.forEach((tag) => allTags.add(tag))
          : null;
        // Age Groups (only add string/number, skip objects)
        if (Array.isArray(ev.age_group)) {
          ev.age_group.forEach((ag) => {
            if (typeof ag === "string" || typeof ag === "number")
              allAgeGroups.add(ag);
          });
        } else if (
          typeof ev.age_group === "string" ||
          typeof ev.age_group === "number"
        ) {
          allAgeGroups.add(ev.age_group);
        }
        // Genders
        if (ev.gender) allGenders.add(ev.gender);
      });
      // Remove any accidental "all" from event data
      allTags.delete("all");
      allAgeGroups.delete("all");
      allGenders.delete("all");
      setHashtags(["all", ...Array.from(allTags)]);
      setAgeGroups(["all", ...Array.from(allAgeGroups)]);
      setGenders(["all", ...Array.from(allGenders)]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = events.filter((event) => {
    // Only show events today or in the future
    if (event.start_date) {
      const eventDate = new Date(event.start_date);
      eventDate.setHours(0, 0, 0, 0);
      if (eventDate < today) return false;
    }
    // Hashtag filter
    if (
      filter.hashtag !== "all" &&
      (!Array.isArray(event.hashtags) ||
        !event.hashtags.includes(filter.hashtag))
    )
      return false;
    // Age group filter (API: event.age_group)
    if (
      filter.ageGroup !== "all" &&
      (!Array.isArray(event.age_group)
        ? event.age_group !== filter.ageGroup
        : !event.age_group.includes(filter.ageGroup))
    )
      return false;
    // Gender filter (API: event.gender)
    if (
      filter.gender !== "all" &&
      event.gender &&
      event.gender.toLowerCase() !== filter.gender.toLowerCase()
    )
      return false;
    // Search filter (API: event.title)
    if (
      filter.search &&
      !event.title?.toLowerCase().includes(filter.search.toLowerCase())
    )
      return false;
    return true;
  });

  // Sort filtered events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.start_date) - new Date(b.start_date);
      case "date-desc":
        return new Date(b.start_date) - new Date(a.start_date);
      case "price-asc":
        return (a.price_per_person || 0) - (b.price_per_person || 0);
      case "price-desc":
        return (b.price_per_person || 0) - (a.price_per_person || 0);
      case "name-asc":
        return (a.title || "").localeCompare(b.title || "");
      default:
        return 0;
    }
  });

  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
  };

  const clearAllFilters = () => {
    setFilter({
      hashtag: "all",
      ageGroup: "all",
      gender: "all",
      search: "",
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filter.hashtag !== "all") count++;
    if (filter.ageGroup !== "all") count++;
    if (filter.gender !== "all") count++;
    if (filter.search) count++;
    return count;
  };

  return (
    <>
      <Helmet>
        <title>Browse Events | Sai Skating Academy</title>
        <meta
          name="description"
          content="Browse all upcoming and past skating events at Sai Skating Academy."
        />
        <meta
          property="og:title"
          content="Browse Events | Sai Skating Academy"
        />
        <meta
          property="og:description"
          content="Browse all upcoming and past skating events at Sai Skating Academy."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <Header />
        <main className="flex-grow py-10">
          <div className="container mx-auto px-4">
            <div
              className="mb-8 text-center animate-fade-in-up"
              data-aos="fade-up"
            >
              <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-3 bg-gradient-to-r from-blue-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-xl">
                Browse All Events
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in">
                Discover and register for exciting skating events across all
                categories, age groups, and skill levels.
              </p>
            </div>
            {/* Enhanced Filters & Controls */}
            <div className="mb-8 space-y-4">
              {/* Filter & Sort Controls */}
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-100">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Filter Controls */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="mr-2 text-blue-500"
                        />
                        Category
                      </label>
                      <Select
                        value={filter.hashtag}
                        onValueChange={(v) => handleFilterChange("hashtag", v)}
                      >
                        <SelectTrigger className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {hashtags.map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag === "all" ? "All Categories" : `#${tag}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="mr-2 text-green-500"
                        />
                        Age Group
                      </label>
                      <Select
                        value={filter.ageGroup}
                        onValueChange={(v) => handleFilterChange("ageGroup", v)}
                      >
                        <SelectTrigger className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="All Ages" />
                        </SelectTrigger>
                        <SelectContent>
                          {ageGroups.map((group) => (
                            <SelectItem
                              key={String(group)}
                              value={String(group)}
                            >
                              {group === "all" ? "All Ages" : `${group} years`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="mr-2 text-purple-500"
                        />
                        Gender
                      </label>
                      <Select
                        value={filter.gender}
                        onValueChange={(v) => handleFilterChange("gender", v)}
                      >
                        <SelectTrigger className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="All Genders" />
                        </SelectTrigger>
                        <SelectContent>
                          {genders.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g === "all"
                                ? "All Genders"
                                : g.charAt(0).toUpperCase() + g.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Sort & View Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 lg:flex-col lg:gap-2">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={
                          sortBy.includes("desc")
                            ? faSortAmountDown
                            : faSortAmountUp
                        }
                        className="text-gray-500 h-4 w-4"
                      />
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40 border-gray-200 focus:ring-2 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date-asc">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="mr-2"
                            />
                            Date (Earliest)
                          </SelectItem>
                          <SelectItem value="date-desc">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="mr-2"
                            />
                            Date (Latest)
                          </SelectItem>
                          <SelectItem value="price-asc">
                            <FontAwesomeIcon
                              icon={faDollarSign}
                              className="mr-2"
                            />
                            Price (Low to High)
                          </SelectItem>
                          <SelectItem value="price-desc">
                            <FontAwesomeIcon
                              icon={faDollarSign}
                              className="mr-2"
                            />
                            Price (High to Low)
                          </SelectItem>
                          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Active Filters & Clear Button */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Showing {sortedEvents.length} events</span>
                    {getActiveFilterCount() > 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {getActiveFilterCount()} filter
                        {getActiveFilterCount() !== 1 ? "s" : ""} active
                      </span>
                    )}
                  </div>

                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <FontAwesomeIcon
                        icon={faFilter}
                        className="mr-2 h-3 w-3"
                      />
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-100">
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                  />
                  <input
                    type="text"
                    placeholder="Search events by name..."
                    value={filter.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {filter.search && (
                    <button
                      onClick={() => handleFilterChange("search", "")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* Enhanced Events Display */}
            <div
              className="animate-fade-in-up"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {isLoading ? (
                // Loading Skeleton
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-6">
                        <div className="flex justify-between mb-3">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-8 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-3" />
                        <Skeleton className="h-4 w-2/3 mb-5" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-10 w-28" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : sortedEvents && sortedEvents.length > 0 ? (
                // Events Display
                <>
                  {/* Desktop/Tablet Grid View */}
                  <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
                    {sortedEvents.map((event, index) => (
                      <div
                        key={event.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <EventCard event={event} />
                      </div>
                    ))}
                  </div>

                  {/* Mobile List View */}
                  <div className="md:hidden space-y-4">
                    {sortedEvents.map((event, index) => (
                      <div
                        key={event.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-4 hover:shadow-xl transition-all duration-300">
                          {/* Event Header */}
                          <div className="flex gap-4 mb-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  event.image_url || "/images/default-event.jpg"
                                }
                                alt={event.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-slate-800 line-clamp-2 leading-tight">
                                  {event.title}
                                </h3>
                                <div className="ml-2 flex-shrink-0">
                                  <span className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                                    ₹{event.price_per_person || 0}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    event.is_team_event
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  <FontAwesomeIcon
                                    icon={
                                      event.is_team_event ? faUsers : faUser
                                    }
                                    className="w-3 h-3 mr-1"
                                  />
                                  {event.is_team_event ? "Team" : "Solo"}
                                </span>
                                {Array.isArray(event.hashtags) &&
                                  event.hashtags.length > 0 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                      #{event.hashtags[0]}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="space-y-3">
                            {/* Date and Time */}
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                  icon={faCalendarAlt}
                                  className="w-4 h-4 text-blue-500"
                                />
                                <span>
                                  {event.start_date
                                    ? new Date(
                                        event.start_date
                                      ).toLocaleDateString()
                                    : "TBA"}
                                </span>
                              </div>
                              {event.start_time && (
                                <div className="flex items-center gap-2">
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="w-4 h-4 text-green-500"
                                  />
                                  <span>{event.start_time}</span>
                                </div>
                              )}
                            </div>

                            {/* Location */}
                            {event.location && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FontAwesomeIcon
                                  icon={faMapMarkerAlt}
                                  className="w-4 h-4 text-red-500"
                                />
                                <span className="line-clamp-1">
                                  {event.location}
                                </span>
                              </div>
                            )}

                            {/* Description */}
                            {event.description && (
                              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                {event.description}
                              </p>
                            )}

                            {/* Event Metadata */}
                            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                              {event.age_group && (
                                <span className="flex items-center gap-1">
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="w-3 h-3"
                                  />
                                  Age:{" "}
                                  {Array.isArray(event.age_group)
                                    ? event.age_group.join(", ")
                                    : event.age_group}
                                </span>
                              )}
                              {event.gender && (
                                <span>Gender: {event.gender}</span>
                              )}
                              {event.max_participants && (
                                <span className="flex items-center gap-1">
                                  <FontAwesomeIcon
                                    icon={faUsers}
                                    className="w-3 h-3"
                                  />
                                  Max: {event.max_participants}
                                </span>
                              )}
                            </div>

                            {/* Action Button */}
                            <div className="pt-2 border-t border-slate-200">
                              <Link
                                to={`/events/${event.id}`}
                                className="block"
                              >
                                <button className="w-full bg-gradient-to-r from-pink-400 to-blue-400 hover:from-blue-500 hover:to-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg">
                                  View Details & Register
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                // No Events Found
                <div className="text-center py-16 animate-fade-in">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="h-8 w-8 text-gray-400"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Events Found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      We couldn't find any events matching your current filters.
                    </p>
                    {getActiveFilterCount() > 0 && (
                      <Button
                        onClick={clearAllFilters}
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default EventsPage;
