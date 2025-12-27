import { useState, useEffect } from "react";
import { Dialog } from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { API_BASE_URL } from "../../../utils/apiConfig";

export default function UserDetailsModal({ open, onOpenChange, selectedReg }) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [blobImageUrl, setBlobImageUrl] = useState("");

  const aadhaarImageUrl = selectedReg?.aadhaar_image
    ? selectedReg.aadhaar_image.startsWith("http")
      ? selectedReg.aadhaar_image
      : `${API_BASE_URL}/api/admin/secure-file/${selectedReg.aadhaar_image
          .split("/")
          .pop()}`
    : null;

  // Function to fetch secure image with authentication
  const fetchSecureImage = async (url) => {
    try {
      if (url.startsWith("blob:") || url.startsWith("data:")) {
        setBlobImageUrl(url);
        return;
      }

      if (
        url.includes("/api/admin/secure-file/") ||
        url.includes("/api/secure-file/")
      ) {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(url, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setBlobImageUrl(blobUrl);
        } else {
          console.error("Failed to fetch secure image:", response.status);
        }
      } else {
        setBlobImageUrl(url);
      }
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (blobImageUrl && blobImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(blobImageUrl);
      }
    };
  }, [blobImageUrl]);

  const handleImageClick = () => {
    fetchSecureImage(aadhaarImageUrl);
    setImageModalOpen(true);
  };

  if (!open || !selectedReg) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="relative p-4 w-full max-w-lg mb-22">
        {/* Cross button */}
        <button
          aria-label="Close"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full transition"
          onClick={() => onOpenChange(false)}
          tabIndex={0}
          type="button"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Registration Details</h2>
        <Tabs
          defaultValue={selectedReg.is_team_event ? "team" : "user"}
          className="w-full"
        >
          <TabsList
            className={`mb-4 w-full grid ${
              selectedReg.registration_type === "team"
                ? "grid-cols-4"
                : "grid-cols-3"
            }`}
          >
            <TabsTrigger value="user">User Details</TabsTrigger>
            <TabsTrigger value="player">Player Details</TabsTrigger>
            {selectedReg.registration_type === "team" && (
              <TabsTrigger value="team">Team Details</TabsTrigger>
            )}
            <TabsTrigger value="payment">Payment Details</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            <div className="space-y-2">
              <div>
                <b>Name:</b> {selectedReg.full_name || selectedReg.username}
              </div>
              <div>
                <b>Role:</b> {selectedReg.user_role}
              </div>
              <div>
                <b>Email:</b> {selectedReg.email}
              </div>
              <div>
                <b>Phone:</b> {selectedReg.phone}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="player">
            <div className="space-y-2">
              <div>
                <b>Name:</b>{" "}
                {[
                  selectedReg.first_name,
                  selectedReg.middle_name,
                  selectedReg.last_name,
                ]
                  .filter(Boolean)
                  .join(" ") || "-"}
              </div>
              <div>
                <b>Gender:</b> {selectedReg.details_gender || "-"}
              </div>
              <div>
                <b>Date of Birth:</b>{" "}
                {selectedReg.details_dob
                  ? new Date(selectedReg.details_dob).toLocaleDateString()
                  : "-"}
              </div>
              <div>
                <b>Coach Name:</b> {selectedReg.coach_name || "-"}
              </div>
              <div>
                <b>District:</b> {selectedReg.district || "-"}
              </div>
              <div>
                <b>State:</b> {selectedReg.state || "-"}
              </div>
              <div>
                <b>Club Name:</b> {selectedReg.club_name || "-"}
              </div>
              <div>
                <b>Age Group:</b> {selectedReg.age_group || "-"}
              </div>
              <div>
                <b>Category:</b> {selectedReg.details_category || "-"}
              </div>
              <div>
                <b>Aadhaar Number:</b> {selectedReg.aadhaar_number || "-"}
              </div>
              <div>
                <b>Aadhaar Image:</b>{" "}
                {aadhaarImageUrl ? (
                  <button
                    className="inline-block ml-2 text-blue-600 underline cursor-pointer"
                    onClick={handleImageClick}
                    type="button"
                  >
                    View Image
                  </button>
                ) : (
                  "-"
                )}
              </div>
              <div>
                <b>Event:</b> {selectedReg.event_title}
              </div>
              <div>
                <b>Type:</b> {selectedReg.registration_type}
              </div>
              <div>
                <b>Status:</b> {selectedReg.status}
              </div>
            </div>
          </TabsContent>
          {selectedReg.registration_type === "team" && (
            <TabsContent value="team">
              <div className="space-y-2">
                <div>
                  <b>Team Name:</b> {selectedReg.team_name || "-"}
                </div>
                <div>
                  <b>Team Members:</b>
                  {Array.isArray(selectedReg.team_members) &&
                  selectedReg.team_members.length > 0 ? (
                    <ul className="list-disc ml-6">
                      {selectedReg.team_members.map((member, idx) => (
                        <li key={idx}>
                          {member.full_name ||
                            member.name ||
                            member.username ||
                            member.email ||
                            "-"}{" "}
                          (Age: {member.age || "-"}, Gender:{" "}
                          {member.gender || "-"}, Experience:{" "}
                          {member.experience || "-"})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span> - </span>
                  )}
                </div>
              </div>
            </TabsContent>
          )}
          <TabsContent value="payment">
            <div className="space-y-2">
              <div>
                <b>Payment Status:</b> {selectedReg.payment_status || "-"}
              </div>
              <div>
                <b>Amount:</b>{" "}
                {selectedReg.payment_amount
                  ? `Rs ${selectedReg.payment_amount}`
                  : "-"}
              </div>
              <div>
                <b>Payment ID:</b> {selectedReg.razorpay_payment_id || "-"}
              </div>
              <div>
                <b>Payment Date:</b>{" "}
                {selectedReg.payment_created_at
                  ? new Date(selectedReg.payment_created_at).toLocaleString()
                  : "-"}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {/* Aadhaar Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-xl w-full relative animate-fade-in-up">
            <button
              aria-label="Close"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full transition"
              onClick={() => setImageModalOpen(false)}
              tabIndex={0}
              type="button"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-2">Aadhaar Image</h3>
            {blobImageUrl ? (
              <img
                src={blobImageUrl}
                alt="Aadhaar"
                className="w-full max-h-[32rem] object-contain rounded border shadow"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded border shadow flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
