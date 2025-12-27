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
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketUserDetails, setTicketUserDetails] = useState(null);
  const [ticketPaymentDetails, setTicketPaymentDetails] = useState(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketError, setTicketError] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  // Fetch user and payment details when opening ticket modal
  const handleShowTicket = async (registration) => {
    setSelectedRegistration(registration);
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
    } catch (error) {
      console.error("Failed to fetch ticket details:", error);
      setTicketError("Failed to fetch ticket details.");
    } finally {
      setTicketLoading(false);
    }
  };

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
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-2xl border border-blue-100/50 animate-fade-in-up">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
          <div
            className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-white text-xl"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Event Registrations</h1>
              <p className="text-blue-100 text-sm">
                Manage your skating events and tickets
              </p>
            </div>
          </div>
        </div>

        <div className="relative p-6">
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
            <div className="space-y-8">
              {todayRegs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="text-white text-sm"
                      />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Happening Today
                    </h2>
                  </div>
                  <div className="space-y-4">
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
                        handleShowTicket={handleShowTicket}
                      />
                    ))}
                  </div>
                </div>
              )}
              {upcomingRegs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-white text-sm"
                      />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Upcoming Events
                    </h2>
                  </div>
                  <div className="space-y-4">
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
                        handleShowTicket={handleShowTicket}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="text-4xl text-blue-400"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  No Registrations Found
                </h3>
                <p className="text-gray-500 mb-6 text-lg max-w-md mx-auto">
                  You haven't registered for any events yet. Start your skating
                  journey today!
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <a href="/events">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    Browse Events
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal - Rendered at top level */}
      {showTicketModal && selectedRegistration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in px-4"
          onClick={() => setShowTicketModal(false)}
        >
          <div
            className="relative w-full max-w-lg transform transition-all duration-300 scale-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ticket Header with decorative elements */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              {/* Decorative top border */}
              <div className="h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>

              {/* Perforated edges effect */}
              <div className="absolute left-0 top-8 w-4 h-4 bg-gray-100 rounded-full transform -translate-x-2"></div>
              <div className="absolute right-0 top-8 w-4 h-4 bg-gray-100 rounded-full transform translate-x-2"></div>

              {/* Header Section */}
              <div className="px-6 py-8 bg-gradient-to-br from-green-50 to-blue-50">
                <div className="text-center">
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
                    EVENT TICKET
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 font-semibold tracking-wide uppercase">
                    Sangli Skating Academy
                  </p>
                </div>
              </div>

              {/* Ticket Content */}
              <div className="px-3 py-3 bg-white">
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
                        {ticketUserDetails
                          ? (
                              ticketUserDetails.first_name +
                              " " +
                              (ticketUserDetails.middle_name || "") +
                              " " +
                              ticketUserDetails.last_name
                            ).trim()
                          : "N/A"}
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
                          {getEventName(selectedRegistration.event_id)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-xs text-green-600 font-medium mb-1">
                            📅 DATE
                          </div>
                          <div className="font-bold text-green-800">
                            {events.find(
                              (e) => e.id === selectedRegistration.event_id
                            )?.start_date
                              ? new Date(
                                  events.find(
                                    (e) =>
                                      e.id === selectedRegistration.event_id
                                  ).start_date
                                ).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "TBD"}
                          </div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="text-xs text-purple-600 font-medium mb-1">
                            ⏰ TIME
                          </div>
                          <div className="font-bold text-purple-800">
                            {events.find(
                              (e) => e.id === selectedRegistration.event_id
                            )?.start_time || "TBD"}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="text-xs text-orange-600 font-medium mb-1">
                          📍 LOCATION
                        </div>
                        <div className="font-bold text-orange-800">
                          {events.find(
                            (e) => e.id === selectedRegistration.event_id
                          )?.location || "TBD"}
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    {ticketPaymentDetails && (
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
                            <span className="text-gray-600">
                              Payment Amount:
                            </span>
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
                    )}
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
  handleShowTicket,
}) => {
  // Payment closed if event is today or tomorrow
  const isPaymentClosed =
    event.start_date &&
    (isToday(event.start_date) || isTomorrow(event.start_date));

  return (
    <div
      className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-black/20 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0  rounded-2xl"></div>

      <div className="relative p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            {/* Event Title */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-white text-lg"
                />
              </div>
              <h3 className="font-bold text-xl text-gray-800 flex-1">
                {getEventName(registration.event_id)}
              </h3>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge
                variant={
                  registration.status === "confirmed" ? "success" : "warning"
                }
                className={
                  registration.status === "confirmed"
                    ? "bg-gradient-to-r from-green-400 to-green-600 text-white border-none shadow-md"
                    : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none shadow-md"
                }
              >
                <FontAwesomeIcon
                  icon={
                    registration.status === "confirmed"
                      ? faCheckCircle
                      : faMoneyBillWave
                  }
                  className="mr-2"
                />
                {registration.status === "confirmed"
                  ? "Confirmed & Paid"
                  : "Payment Pending"}
              </Badge>

              <Badge
                variant="outline"
                className="bg-white/60 backdrop-blur-sm border-blue-300 text-blue-700 shadow-sm"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
                {registration.is_team_event ? "Team Event" : "Solo Event"}
              </Badge>

              {event.start_date && (
                <Badge
                  variant="outline"
                  className="bg-white/60 backdrop-blur-sm border-purple-300 text-purple-700 shadow-sm"
                >
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="mr-2 text-purple-500"
                  />
                  {new Date(event.start_date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Badge>
              )}
            </div>

            {/* Registration Date */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faClock} className="text-gray-400" />
              <span>
                Registered on{" "}
                {new Date(registration.created_at).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            {registration.status === "confirmed" && (
              <Button
                variant="success"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex-1 lg:flex-none"
                onClick={() => handleShowTicket(registration)}
              >
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Show Ticket
              </Button>
            )}

            {registration.status !== "confirmed" &&
              (isPaymentClosed ? (
                <Button
                  variant="outline"
                  disabled
                  className="border-gray-300 text-gray-400 bg-gray-50 font-semibold px-6 py-3 rounded-xl cursor-not-allowed flex-1 lg:flex-none"
                >
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                  Payment Closed
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handlePaymentClick(registration)}
                  className="border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-600 font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex-1 lg:flex-none"
                >
                  <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                  Pay Now
                </Button>
              ))}

            <Button
              variant="outline"
              onClick={() => handleViewDetails(registration)}
              className="border-purple-500 text-purple-600 bg-purple-50 hover:bg-purple-100 hover:border-purple-600 font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex-1 lg:flex-none"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              View Details
            </Button>

            {registration.status !== "cancelled" &&
              !isPaymentClosed &&
              registration.status !== "confirmed" && (
                <Button
                  variant="outline"
                  onClick={() => handleCancelRegistration(registration.id)}
                  className="border-red-500 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-600 font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex-1 lg:flex-none"
                  ref={cancelButtonRef}
                >
                  <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                  Cancel
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationsTab;
