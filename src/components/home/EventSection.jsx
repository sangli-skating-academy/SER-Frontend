import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/button";
import Badge from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import Skeleton from "../ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faArrowRight,
  faUser,
  faUsers, // Add this for team icon
} from "@fortawesome/free-solid-svg-icons";
import { fetchEvents } from "../../services/eventApi";

const EventsSection = () => {
  const [filter, setFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Fetch events from backend
  useEffect(() => {
    setIsLoading(true);
    fetchEvents({ featured: true })
      .then((data) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Filtering logic: only filter among featured events
  const filteredEvents = events.filter((event) => {
    // Age group filter
    if (
      filter !== "all" &&
      ["Under 10", "Under 18", "Adults"].includes(filter) &&
      event.age_group !== filter
    ) {
      return false;
    }
    return true;
  });

  const handleFilterChange = (newFilter) => setFilter(newFilter);

  return (
    <>
      <section id="events" className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-3 animate-gradient-x bg-gradient-to-r from-blue-500 via-blue-300 to-pink-400 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in">
              Find the perfect skating events for you or your team. Filter by
              category, age group, and more.
            </p>
          </div>
          {/* Event Filters */}
          <div
            className="mb-3 flex flex-wrap gap-3 justify-center"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {[
              { label: "All Events", value: "all" },
              { label: "Under 10", value: "Under 10" },
              { label: "Under 18", value: "Under 18" },
              { label: "Adults", value: "Adults" },
            ].map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : ""}
                className={`px-5 py-2 rounded-full font-medium border-1 transition-all duration-200 ${
                  filter === f.value
                    ? "bg-blue-300 text-black shadow-lg border-0 scale-105"
                    : "bg-white hover:bg-gray-200"
                } animate-fade-in`}
                onClick={() => handleFilterChange(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
          {/* Event Cards */}
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
                    <Card
                      key={event.id}
                      className="w-72 md:w-auto rounded-xl overflow-hidden hover:shadow-2xl transition-shadow group animate-fade-in"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={event.image_url}
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {
                          <div
                            className={`absolute top-3 left-3 ${
                              event.is_team_event
                                ? "bg-orange-400"
                                : "bg-blue-400"
                            } text-dark font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1`}
                          >
                            <FontAwesomeIcon
                              icon={event.is_team_event ? faUsers : faUser}
                              className="text-black"
                            />
                            {event.is_team_event ? "Team Event" : "Solo Event"}
                          </div>
                        }
                      </div>
                      <CardContent className="p-5">
                        <div className="flex justify-between mb-3">
                          <Badge className="bg-[#38b6ff27] text-[#13a8ff] px-3 py-1 rounded-full text-xs font-semibold animate-fade-in">
                            {/* {event.category_id === 1
                            ? "Inline Skating"
                            : event.category_id === 2
                            ? "Roller Skating"
                            : "Other"} */}
                            Gender:{event.gender}
                          </Badge>
                          <Badge
                            variant=""
                            className="bg-gray-100 px-4 py-2 rounded-full text-xs font-semibold animate-fade-in"
                          >
                            {event.age_group}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-xl mb-2 font-montserrat animate-gradient-x bg-gradient-to-r from-blue-500 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-3 text-sm animate-fade-in">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="mr-2 text-blue-400"
                          />
                          <span>
                            {new Date(event.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-5 text-sm animate-fade-in">
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="mr-2 text-pink-400"
                          />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary text-lg animate-fade-in">
                            Rs.
                            {parseFloat(
                              event.price_per_person * event.max_team_size
                            ).toFixed(2)}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              asChild
                              variant="outline"
                              className="px-3 py-2 border-primary text-primary rounded-full hover:bg-primary hover:text-blue-400 transition-colors text-sm font-medium animate-fade-in"
                            >
                              <Link to={`/events/${event.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
          <div
            className="mt-10 text-center"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Link
              to="/events"
              className="inline-flex items-center font-medium text-primary hover:underline animate-fade-in"
            >
              View All Events
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-2 animate-bounce-x"
              />
            </Link>
          </div>
        </div>
        <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-blue-400 via-pink-300 to-blue-200 opacity-60 animate-gradient-x" />
      </section>
    </>
  );
};

export default EventsSection;
