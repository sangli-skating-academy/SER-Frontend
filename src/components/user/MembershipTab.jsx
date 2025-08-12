import React, { useEffect, useState } from "react";
import axios from "axios";

const MembershipTab = ({ userId }) => {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios
      .get(`/api/club/membership/${userId}`)
      .then((res) => {
        // Expect a single object
        setMembership(
          res.data && typeof res.data === "object" ? res.data : null
        );
        setError(null);
      })
      .catch(() => {
        setError("Failed to fetch membership");
        setMembership(null);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading membership...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!membership) return <div>No membership found.</div>;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-bold text-lg mb-2">{membership.full_name}</h3>
        <div className="mb-1">Email: {membership.email}</div>
        <div className="mb-1">Phone: {membership.phone_number}</div>
        <div className="mb-1">Gender: {membership.gender}</div>
        <div className="mb-1">Age: {membership.age}</div>
        <div className="mb-1">
          Status:{" "}
          <span
            className={
              membership.status === "success"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {membership.status}
          </span>
        </div>
        <div className="mb-1">
          Issue Date:{" "}
          {membership.issue_date
            ? new Date(membership.issue_date).toLocaleDateString()
            : "-"}
        </div>
        <div className="mb-1">
          End Date:{" "}
          {membership.end_date
            ? new Date(membership.end_date).toLocaleDateString()
            : "-"}
        </div>
        <div className="mb-1">Amount: ₹{membership.amount}</div>
      </div>
    </div>
  );
};

export default MembershipTab;
