import React, { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";

const MembershipTab = ({ userId }) => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    apiFetch(`/api/club/membership/${userId}`)
      .then((res) => {
        if (Array.isArray(res)) {
          setMemberships(res);
        } else if (res && typeof res === "object") {
          setMemberships([res]);
        } else {
          setMemberships([]);
        }
        setError(null);
      })
      .catch(() => {
        setError("Failed to fetch memberships");
        setMemberships([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading memberships...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!memberships.length) return <div>No memberships found.</div>;

  return (
    <div className="max-w-md mx-auto grid gap-6">
      {memberships.map((membership) => (
        <div
          key={membership.id}
          className="bg-white border rounded-2xl bg-gradient-to-r from-blue-100 via-white to-pink-100 p-6 mb-4 relative"
        >
          <div className="absolute top-0 mt-1 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-pink-400 to-blue-500 shadow-lg flex items-center justify-center">
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-xl text-blue-700 mb-2 mt-11 text-center tracking-wide">
            {membership.full_name}
          </h3>
          <div className="flex flex-col gap-1 text-sm md:text-base text-gray-700 mb-2">
            <div className="flex justify-between">
              <span className="font-semibold">Email:</span>{" "}
              <span>{membership.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Phone:</span>{" "}
              <span>{membership.phone_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Gender:</span>{" "}
              <span>{membership.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Age:</span>{" "}
              <span>{membership.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={
                  membership.status === "success"
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {membership.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Issue Date:</span>{" "}
              <span>
                {membership.issue_date
                  ? new Date(membership.issue_date).toLocaleDateString()
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">End Date:</span>{" "}
              <span>
                {membership.end_date
                  ? new Date(membership.end_date).toLocaleDateString()
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Amount:</span>{" "}
              <span className="text-pink-600 font-bold">
                ₹{membership.amount}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembershipTab;
