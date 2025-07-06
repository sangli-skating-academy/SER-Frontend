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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in px-2"
          onClick={() => setShowTicketModal(false)}
        >
          <div
            className="relative bg-gradient-to-br from-green-50 via-white to-blue-100 rounded-3xl p-0 shadow-2xl w-full max-w-md flex flex-col items-center border-0 ticket-modal overflow-hidden sm:min-w-[350px] min-w-0"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 400 }}
          >
            {/* Ticket content */}
            <div className="w-full flex flex-col items-center px-3 sm:px-8 py-6">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 text-4xl sm:text-5xl mb-2 animate-bounce-in drop-shadow-lg"
              />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-green-700 mb-1 tracking-tight text-center">
                Event Ticket
              </h2>
              <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-pink-400 rounded-full mb-4" />
              {ticketLoading ? (
                <div className="py-8 text-center text-blue-500 text-base sm:text-lg font-semibold">
                  Loading ticket details...
                </div>
              ) : ticketError ? (
                <div className="py-8 text-center text-red-500 text-base sm:text-lg font-semibold">
                  {ticketError}
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3 mb-4 text-base sm:text-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Name:</span>
                    <span className="text-blue-800 font-bold text-right break-words max-w-[60%]">
                      {ticketUserDetails.first_name +
                        " " +
                        ticketUserDetails.middle_name +
                        " " +
                        ticketUserDetails.last_name || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Event:</span>
                    <span className="text-blue-800 font-bold text-right break-words max-w-[60%]">
                      {getEventName(registration.event_id)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Date:</span>
                    <span className="text-blue-800 font-bold text-right">
                      {event.start_date
                        ? new Date(event.start_date).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Time:</span>
                    <span className="text-blue-800 font-bold text-right">
                      {event.start_time || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">
                      Location:
                    </span>
                    <span className="text-blue-800 font-bold text-right break-words max-w-[60%]">
                      {event.location || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">
                      Payment ID:
                    </span>
                    <span className="text-blue-800 font-mono text-right break-words max-w-[60%]">
                      {ticketPaymentDetails.razorpay_payment_id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">
                      Registration ID:
                    </span>
                    <span className="text-blue-800 font-mono text-right break-words max-w-[60%]">
                      {ticketPaymentDetails.registration_id}
                    </span>
                  </div>
                </div>
              )}
              <Button
                className="bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold px-6 sm:px-8 py-2 rounded-xl shadow hover:scale-105 transition-transform mt-2 text-base sm:text-lg w-full sm:w-auto"
                onClick={() => setShowTicketModal(false)}
              >
                Close
              </Button>
              <span className="absolute top-3 right-4 sm:right-6 text-xs text-gray-400 select-none">
                Show this ticket at entry
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsTab;
