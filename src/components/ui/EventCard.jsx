import React from "react";
import { Card, CardContent } from "./card";
import Badge from "./badge";
import Button from "./button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faUser,
  faUsers,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const EventCard = ({ event, className = "", style = {} }) => {
  if (!event) return null;
  return (
    <Card
      className={`w-80 md:w-auto rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group bg-white/70 backdrop-blur-lg border-0 relative animate-fade-in ${className}`}
      style={{
        border: "1.5px solid rgba(56,182,255,0.12)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        ...style,
      }}
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={event.image_url || "/images/default-event.jpg"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg ${
            event.is_team_event
              ? "bg-gradient-to-r from-orange-400 to-orange-300 text-black"
              : "bg-gradient-to-r from-blue-400 to-blue-400 text-white"
          }`}
        >
          <FontAwesomeIcon
            icon={event.is_team_event ? faUsers : faUser}
            className="mr-1"
          />
          {event.is_team_event ? "Team Event" : "Solo Event"}
        </div>
      </div>
      <CardContent className="p-6 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
            Gender:{" "}
            {event.gender?.charAt(0).toUpperCase() + event.gender?.slice(1)}
          </Badge>
          <Badge className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
            Age Group: {event.age_group}
          </Badge>
        </div>
        <h3 className="font-extrabold text-xl font-montserrat bg-gradient-to-r from-blue-500 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow">
          {event.title}
        </h3>
        <div className="text-gray-600 text-sm mb-2 line-clamp-2">
          {event.description}
        </div>
        <div className="flex items-center text-gray-500 text-s gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-pink-400" />
          <span className="truncate">{event.location}</span>
        </div>
        <div className="flex items-center text-gray-500 text-s gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400" />
          <span className="truncate">
            {event.start_date
              ? new Date(event.start_date).toLocaleDateString()
              : ""}
          </span>
        </div>
        {/* Event Time */}
        {event.start_time && (
          <div className="flex items-center text-gray-500 text-s mb-2 gap-2">
            <FontAwesomeIcon icon={faClock} className="text-yellow-400" />
            <span className="truncate">
              {new Date(`1970-01-01T${event.start_time}`).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </span>
          </div>
        )}
        {/* Hashtags */}
        {event.hashtags && event.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {event.hashtags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full text-xs font-semibold border border-pink-300 shadow-sm hover:bg-pink-200 transition-all cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-primary text-lg drop-shadow animate-fade-in">
            {event.is_team_event
              ? `Rs. ${parseFloat(
                  event.price_per_person * (event.max_team_size || 1)
                ).toFixed(2)}(Team)`
              : `Rs. ${parseFloat(
                  event.price_per_person * (event.max_team_size || 1)
                ).toFixed(2)}(Person)`}
          </span>
          <Button
            asChild
            variant="outline"
            className="px-4 py-2 border-primary text-primary rounded-full hover:bg-blue-500 hover:text-white transition-colors text-sm font-semibold shadow animate-fade-in"
          >
            <Link to={`/events/${event.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
