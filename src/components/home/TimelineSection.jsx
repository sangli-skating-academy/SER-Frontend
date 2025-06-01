import React, { useState, useEffect } from "react";
import Skeleton from "../ui/skeleton";
import { fetchEvents } from "../../services/eventApi";
const TimelineSection = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      setIsLoading(true);
      const data = await fetchEvents();
      setEvents(data);
      setIsLoading(false);
    };
    getEvents();
  }, []);

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-3">
              Event Timeline
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Important dates for the upcoming skating season
            </p>
          </div>

          <div
            className="relative max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {/* Timeline Line */}
            <div className="absolute h-full w-1 bg-gray-200 left-1/2 transform -translate-x-1/2"></div>

            {isLoading ? (
              <div className="flex flex-col gap-16">
                {[1, 2].map((i) => (
                  <div key={i} className="relative mb-16 flex">
                    {/* Circle Skeleton */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200 border-4 border-white z-10"></div>
                    {/* Card Skeleton */}
                    <div className="relative z-0 bg-white rounded-lg shadow-md p-6 md:w-5/12 md:ml-auto md:mr-8">
                      <Skeleton className="h-6 w-32 mb-3 rounded-full" />
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-2/3 mb-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : events && events.length > 0 ? (
              events.map((event, idx) => {
                // Color palette for alternating colors
                const colors = [
                  { circle: "bg-pink-300", title: "bg-pink-300 text-black" },
                  { circle: "bg-[#FFD600]", title: "bg-[#FFD600] text-black" },
                  { circle: "bg-blue-300", title: "bg-blue-300 text-white" },
                  { circle: "bg-green-300", title: "bg-green-300 text-black" },
                  {
                    circle: "bg-purple-300",
                    title: "bg-purple-300 text-black",
                  },
                ];
                const color = colors[idx % colors.length];
                const isLeft = idx % 2 !== 0;
                return (
                  <div
                    key={event.id || idx}
                    className={`relative mb-16 flex ${
                      isLeft ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Circle */}
                    <div
                      className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-white z-10 ${color.circle}`}
                    ></div>
                    {/* Card */}
                    <div
                      className={`relative z-0 bg-white rounded-lg shadow-md p-6 md:w-5/12 ${
                        isLeft ? "md:mr-auto md:ml-8" : "md:ml-auto md:mr-8"
                      }`}
                    >
                      <div
                        className={`font-bold text-sm inline-block px-3 py-1 rounded-full mb-3 truncate max-w-[180px] ${color.title}`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                      <h3 className="font-bold text-lg mb-2">
                        {new Date(event.start_date).toLocaleDateString()}
                      </h3>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500">
                <p>No events found. Please check back later.</p>
              </div>
            )}

            {/* Time End */}
            {/* <div className="absolute left-0 mt-9 bottom-0 w-full h-1 bg-gradient-to-r from-blue-400 via-pink-300 to-blue-200 opacity-60 animate-gradient-x"></div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default TimelineSection;
