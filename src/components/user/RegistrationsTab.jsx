import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faCheckCircle,
  faMoneyBillWave,
  faClock,
  faUser,
  faTimesCircle,
  faExclamationCircle,
  faCreditCard,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import Badge from "../ui/badge";
import Button from "../ui/button";
import Skeleton from "../ui/skeleton";
import { apiFetch } from "../../services/api";

const RegistrationsTab = ({
  loading,
  registrations,
  events = [], // add events prop
  getEventName,
  handlePaymentClick,
  handleViewDetails,
  handleCancelRegistration,
  cancelButtonRef,
}) => {
  // Today's and upcoming events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };
  const isTomorrow = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === tomorrow.getTime();
  };
  const isUpcoming = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime() > today.getTime();
  };
  const registrationsWithEvent = registrations.map((registration) => {
    const event = events.find((e) => e.id === registration.event_id) || {};
    return { registration, event };
  });
  const todayRegs = registrationsWithEvent.filter(({ event }) =>
    isToday(event.start_date)
  );
  const upcomingRegs = registrationsWithEvent.filter(({ event }) =>
    isUpcoming(event.start_date)
  );

  return (
    <>
      <div className="shadow-xl border-2 border-blue-200 bg-white/90 rounded-2xl animate-fade-in-up">
        <div className="flex items-center gap-2 text-blue-800 p-6 border-b">
          <FontAwesomeIcon icon={faClipboardList} className="text-pink-400" />
          <span className="font-bold text-xl">Your Event Registrations</span>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 border rounded-lg animate-pulse bg-gradient-to-r from-blue-100 via-white to-pink-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div>
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : registrations && registrations.length > 0 ? (
            <div className="space-y-10">
              {todayRegs.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-2 text-blue-700">
                    Happening Today
                  </h2>
                  <div className="space-y-6">
                    {todayRegs.map(({ registration, event }, idx) => (
                      <RegistrationCard
                        key={registration.id}
                        registration={registration}
                        event={event}
                        idx={idx}
                        getEventName={getEventName}
                        handlePaymentClick={handlePaymentClick}
                        handleViewDetails={handleViewDetails}
                        handleCancelRegistration={handleCancelRegistration}
                        cancelButtonRef={cancelButtonRef}
                        isToday={isToday}
                        isTomorrow={isTomorrow}
                      />
                    ))}
                  </div>
                </div>
              )}
              {upcomingRegs.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-2 text-pink-700">
                    Upcoming Events
                  </h2>
                  <div className="space-y-6">
                    {upcomingRegs.map(({ registration, event }, idx) => (
                      <RegistrationCard
                        key={registration.id}
                        registration={registration}
                        event={event}
                        idx={idx}
                        getEventName={getEventName}
                        handlePaymentClick={handlePaymentClick}
                        handleViewDetails={handleViewDetails}
                        handleCancelRegistration={handleCancelRegistration}
                        cancelButtonRef={cancelButtonRef}
                        isToday={isToday}
                        isTomorrow={isTomorrow}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 animate-fade-in-up">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="text-4xl text-blue-300 mb-4 "
              />
              <p className="text-gray-500 mb-4 text-lg">
                You haven't registered for any events yet.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition-transform animate-fade-in-up"
              >
                <a href="/events">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />{" "}
                  Browse Events
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Card component for reuse
const RegistrationCard = ({
  registration,
  event,
  idx,
  getEventName,
  handlePaymentClick,
  handleViewDetails,
  handleCancelRegistration,
  cancelButtonRef,
  isToday,
  isTomorrow,
}) => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketUserDetails, setTicketUserDetails] = useState(null);
  const [ticketPaymentDetails, setTicketPaymentDetails] = useState(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketError, setTicketError] = useState("");

  // Payment closed if event is today or tomorrow
  const isPaymentClosed =
    event.start_date &&
    (isToday(event.start_date) || isTomorrow(event.start_date));

  // Fetch user and payment details when opening ticket modal
  const handleShowTicket = async () => {
    setShowTicketModal(true);
    setTicketLoading(true);
    setTicketError("");
    try {
      const userRes = await apiFetch(`/api/user-details/${registration.id}`);
      const paymentRes = await apiFetch(
        `/api/payment/by-registration/${registration.id}`
      );
      setTicketUserDetails(userRes);
      setTicketPaymentDetails(paymentRes.payment);
    } catch (err) {
      setTicketError("Failed to fetch ticket details.");
    } finally {
      setTicketLoading(false);
    }
  };

  return (
    <div
      className="p-6 border rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="font-bold text-xl mb-1 flex items-center gap-2 text-blue-900">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-pink-400" />
            {getEventName(registration.event_id)}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge
              variant={
                registration.status === "confirmed" ? "success" : "warning"
              }
              className={
                registration.status === "confirmed"
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-yellow-100 text-yellow-800 border-yellow-300"
              }
            >
              <FontAwesomeIcon
                icon={
                  registration.status === "confirmed"
                    ? faCheckCircle
                    : faMoneyBillWave
                }
                className="mr-1"
              />
              {registration.status === "confirmed" ? "Paid" : "Unpaid"}
            </Badge>
            <Badge
              variant="outline"
              className="border-blue-300 text-blue-700 bg-blue-50"
            >
              <FontAwesomeIcon icon={faUser} className="mr-1 text-blue-400" />
              {registration.is_team_event ? "Team Event" : "Solo Event"}
            </Badge>
            {event.start_date && (
              <Badge
                variant="outline"
                className="border-pink-300 text-pink-700 bg-pink-50"
              >
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="mr-1 text-pink-400"
                />
                {new Date(event.start_date).toLocaleDateString()}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} /> Registered on:{" "}
            {new Date(registration.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center sm:flex-row flex-col w-full sm:w-auto">
          {registration.status === "confirmed" && (
            <Button
              variant="success"
              className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg shadow flex items-center gap-2 hover:scale-105 transition-transform animate-fade-in-up w-full sm:w-auto"
              onClick={handleShowTicket}
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="mr-2 text-white"
              />
              Show Ticket
            </Button>
          )}
          {registration.status !== "confirmed" &&
            (isPaymentClosed ? (
              <Button
                variant="outline"
                disabled
                className="border-gray-400 text-gray-400 font-semibold px-4 py-2 rounded-lg shadow cursor-not-allowed animate-fade-in-up w-full sm:w-auto"
              >
                <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Payment
                Closed
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => handlePaymentClick(registration)}
                className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-transform animate-fade-in-up w-full sm:w-auto"
              >
                <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Pay Now
              </Button>
            ))}
          <Button
            variant="outline"
            onClick={() => handleViewDetails(registration)}
            className="border-blue-400 text-blue-400 hover:bg-blue-50 hover:text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-transform animate-fade-in-up w-full sm:w-auto"
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" /> View Details
          </Button>
          {registration.status !== "cancelled" &&
            !isPaymentClosed &&
            registration.status !== "confirmed" && (
              <Button
                variant="outline"
                onClick={() => handleCancelRegistration(registration.id)}
                className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-transform animate-fade-in-up w-full sm:w-auto"
                ref={cancelButtonRef}
              >
                <FontAwesomeIcon icon={faTimesCircle} className="mr-2" /> Cancel
              </Button>
            )}
        </div>
      </div>
      {showTicketModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in px-4"
          onClick={() => setShowTicketModal(false)}
        >
          <div
            className="relative w-full max-w-lg transform transition-all duration-300 scale-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ticket Header with decorative elements */}
            <div className="relative bg-white mx-6 my-6 rounded-2xl overflow-hidden shadow-lg">
              {/* Decorative top border */}
              <div className="h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>

              {/* Perforated edges effect */}
              <div className="absolute left-0 top-8 w-4 h-4 bg-gray-100 rounded-full transform -translate-x-2"></div>
              <div className="absolute right-0 top-8 w-4 h-4 bg-gray-100 rounded-full transform translate-x-2"></div>

              {/* Header Section */}
              <div className="px-6 py-8 bg-gradient-to-br from-green-50 to-blue-50">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-500 text-5xl mb-3 animate-pulse drop-shadow-lg"
                  />
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
                    🎟️ EVENT TICKET
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">
                    Sangli Skating Academy
                  </p>
                </div>
              </div>

              {/* Ticket Content */}
              <div className="px-6 py-6 bg-white">
                {ticketLoading ? (
                  <div className="py-12 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-blue-600 font-semibold">
                      Loading ticket details...
                    </p>
                  </div>
                ) : ticketError ? (
                  <div className="py-12 text-center">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="text-red-500 text-4xl mb-4"
                    />
                    <p className="text-red-600 font-semibold">{ticketError}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Participant Name - Featured */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-l-4 border-blue-500">
                      <div className="text-sm text-gray-600 font-medium mb-1">
                        🏷️ PARTICIPANT
                      </div>
                      <div className="text-xl font-bold text-gray-800">
                        {(
                          ticketUserDetails.first_name +
                          " " +
                          (ticketUserDetails.middle_name || "") +
                          " " +
                          ticketUserDetails.last_name
                        ).trim() || "N/A"}
                      </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="text-blue-500"
                          />
                          <span className="font-medium text-gray-700">
                            Event
                          </span>
                        </div>
                        <span className="font-bold text-gray-800 text-right max-w-[60%] break-words">
                          {getEventName(registration.event_id)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-xs text-green-600 font-medium mb-1">
                            📅 DATE
                          </div>
                          <div className="font-bold text-green-800">
                            {event.start_date
                              ? new Date(event.start_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "TBD"}
                          </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="text-xs text-purple-600 font-medium mb-1">
                            ⏰ TIME
                          </div>
                          <div className="font-bold text-purple-800">
                            {event.start_time || "TBD"}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="text-xs text-orange-600 font-medium mb-1">
                          📍 LOCATION
                        </div>
                        <div className="font-bold text-orange-800">
                          {event.location || "TBD"}
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-6">
                      <div className="text-xs text-gray-500 font-medium mb-3 text-center uppercase tracking-wide">
                        Payment Details
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Payment ID:</span>
                          <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {ticketPaymentDetails.razorpay_payment_id}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Payment ID:</span>
                          <span className="font-mono text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                            {ticketPaymentDetails.amount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Registration ID:
                          </span>
                          <span className="font-mono text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            #{ticketPaymentDetails.registration_id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ticket Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Valid for event entry</span>
                  <span>www.sangliskating.com</span>
                </div>
              </div>
            </div>

            {/* Close button (X) in top right */}
            <button
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-800 transition-colors shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsTab;
