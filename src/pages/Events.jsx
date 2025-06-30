import { useState, useEffect } from "react";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import { Card, CardContent } from "../components/ui/card";
import Skeleton from "../components/ui/skeleton";
import { fetchEvents } from "../services/eventApi";
import { Helmet } from "react-helmet-async";
import EventCard from "../components/ui/EventCard";

const EventsPage = () => {
  const [filter, setFilter] = useState({
    hashtag: "all",
    ageGroup: "all",
    gender: "all",
  });
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {
    document.title = "Browse All Events";
    const fetchData = async () => {
      setIsLoading(true);
      // Always fetch all events, filtering client-side for now
      const data = await fetchEvents();
      const eventsArr = Array.isArray(data) ? data : data.events || [];
      setEvents(eventsArr);
      // Collect all unique hashtags
      const allTags = new Set();
      eventsArr.forEach((ev) =>
        Array.isArray(ev.hashtags)
          ? ev.hashtags.forEach((tag) => allTags.add(tag))
          : null
      );
      setHashtags(["all", ...Array.from(allTags)]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredEvents = events.filter((event) => {
    // Hashtag filter
    if (
      filter.hashtag !== "all" &&
      (!Array.isArray(event.hashtags) ||
        !event.hashtags.includes(filter.hashtag))
    )
      return false;
    // Age group filter (API: event.age_group)
    if (filter.ageGroup !== "all" && event.age_group !== filter.ageGroup)
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

  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
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
            {/* Filters */}
            <div
              className="mb-8 bg-white/90 p-4 rounded-lg shadow-sm animate-fade-in-up"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* <div>
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <Input
                      id="search"
                      placeholder="Search events..."
                      value={filter.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="w-full pl-10"
                    />
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"
                    />
                  </div>
                </div> */}
                <div>
                  <label
                    htmlFor="hashtag"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hashtag
                  </label>
                  <select
                    id="hashtag"
                    value={filter.hashtag}
                    onChange={(e) =>
                      handleFilterChange("hashtag", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all text-base px-3 py-2"
                  >
                    {hashtags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag === "all" ? "All Hashtags" : tag}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="ageGroup"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Age Group
                  </label>
                  <select
                    id="ageGroup"
                    value={filter.ageGroup}
                    onChange={(e) =>
                      handleFilterChange("ageGroup", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all text-base px-3 py-2"
                  >
                    <option value="all">All Age Groups</option>
                    <option value="Under 10">Under 10</option>
                    <option value="Under 18">Under 18</option>
                    <option value="Adults">Adults</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={filter.gender}
                    onChange={(e) =>
                      handleFilterChange("gender", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all text-base px-3 py-2"
                  >
                    <option value="all">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Events Grid */}
            <div className="overflow-x-scroll pb-3 md:p-8 h-viewport md:h-auto rounded-lg">
              {isLoading ? (
                <div className="flex gap-6 min-w-max md:min-w-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                  {[1, 2, 3].map((i) => (
                    <Card
                      key={i}
                      className="w-72 md:w-auto hover:shadow-xl transition-shadow"
                    >
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-5">
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
              ) : (
                <div className="flex gap-6 min-w-max md:min-w-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                  {filteredEvents && filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <div className="w-full col-span-3 text-center py-8 animate-fade-in">
                      <p className="text-gray-500">
                        No events found for the selected filter.
                      </p>
                    </div>
                  )}
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
