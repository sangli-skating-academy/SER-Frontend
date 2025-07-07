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
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const EventsPage = () => {
  const [filter, setFilter] = useState({
    hashtag: "all",
    ageGroup: "all",
    gender: "all",
  });
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setEvents(eventsArr);
      // Collect all unique hashtags
      const allTags = new Set();
      const allAgeGroups = new Set();
      const allGenders = new Set();
      eventsArr.forEach((ev) => {
        // Hashtags
        Array.isArray(ev.hashtags)
          ? ev.hashtags.forEach((tag) => allTags.add(tag))
          : null;
        // Age Groups
        if (ev.age_group) allAgeGroups.add(ev.age_group);
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
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1 min-w-[140px]">
                  <label
                    htmlFor="hashtag"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hashtag
                  </label>
                  <Select
                    value={filter.hashtag}
                    onValueChange={(v) => handleFilterChange("hashtag", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Hashtags" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {hashtags.map((tag) => (
                        <SelectItem
                          key={tag}
                          value={tag}
                          className="overflow-scroll overflow-x-auto"
                        >
                          {tag === "all" ? "All Hashtags" : tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label
                    htmlFor="ageGroup"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Age Group
                  </label>
                  <Select
                    value={filter.ageGroup}
                    onValueChange={(v) => handleFilterChange("ageGroup", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Age Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group === "all" ? "All Age Groups" : group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Gender
                  </label>
                  <Select
                    value={filter.gender}
                    onValueChange={(v) => handleFilterChange("gender", v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g === "all"
                            ? "All"
                            : g.charAt(0).toUpperCase() + g.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  {/* Change color of filter button when filter are active */}
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 w-full sm:w-43 h-[40px] ${
                      filter.hashtag !== "all" ||
                      filter.ageGroup !== "all" ||
                      filter.gender !== "all"
                        ? "border-red-300 bg-red-50 text-red-500"
                        : ""
                    }`}
                    onClick={() =>
                      setFilter({
                        hashtag: "all",
                        ageGroup: "all",
                        gender: "all",
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />{" "}
                    Clear Filters
                  </Button>
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
