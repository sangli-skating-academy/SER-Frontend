import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Skeleton from "../ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { fetchEvents } from "../../services/eventApi";
import EventCard from "../ui/EventCard";

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
      ["Female", "Male", "Mixed"].includes(filter) &&
      event.gender !== filter
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
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Mixed", value: "Mixed" },
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
