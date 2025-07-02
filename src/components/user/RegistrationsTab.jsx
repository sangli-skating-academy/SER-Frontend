import React from "react";
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

const RegistrationsTab = ({
  loading,
  registrations,
  events = [], // add events prop
  getEventName,
  handlePaymentClick,
  handleViewDetails,
  handleCancelRegistration,
  cancelButtonRef,
}) => (
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
          <div className="space-y-6">
            {registrations.map((registration, idx) => {
              const event =
                events.find((e) => e.id === registration.event_id) || {};
              return (
                <div
                  key={registration.id}
                  className="p-6 border rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h3 className="font-bold text-xl mb-1 flex items-center gap-2 text-blue-900">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="text-pink-400"
                        />
                        {getEventName(registration.event_id)}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge
                          variant={
                            registration.payment_status === "paid"
                              ? "success"
                              : "warning"
                          }
                          className={
                            registration.payment_status === "paid"
                              ? "bg-green-100 text-green-800 border-green-300 animate-pulse"
                              : "bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse"
                          }
                        >
                          <FontAwesomeIcon
                            icon={
                              registration.payment_status === "paid"
                                ? faCheckCircle
                                : faMoneyBillWave
                            }
                            className="mr-1"
                          />
                          {registration.payment_status === "paid"
                            ? "Paid"
                            : "Unpaid"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-blue-300 text-blue-700 bg-blue-50"
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            className="mr-1 text-blue-400"
                          />
                          {registration.is_team_event
                            ? "Team Event"
                            : "Solo Event"}
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
                    <div className="flex flex-wrap gap-3">
                      {registration.payment_status !== "paid" && (
                        <Button
                          variant="outline"
                          onClick={() => handlePaymentClick(registration)}
                          className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-transform animate-fade-in-up"
                        >
                          <FontAwesomeIcon
                            icon={faCreditCard}
                            className="mr-2"
                          />{" "}
                          Pay Now
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => handleViewDetails(registration)}
                        className="border-blue-400 text-blue-400 hover:bg-blue-50 hover:text-blue-600 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-transform animate-fade-in-up"
                      >
                        <FontAwesomeIcon icon={faUser} className="mr-2" /> View
                        Details
                      </Button>
                      {registration.status !== "cancelled" && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleCancelRegistration(registration.id)
                          }
                          className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg cursor-pointer hover:scale-105 transition-transform animate-fade-in-up"
                          ref={cancelButtonRef}
                        >
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="mr-2"
                          />{" "}
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Browse
                Events
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  </>
);

export default RegistrationsTab;
