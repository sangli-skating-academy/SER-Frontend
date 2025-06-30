import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCalendarAlt,
  faClipboardList,
  faImage,
  faMessage,
  faChartBar,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const navLinks = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: faTachometerAlt,
  },
  {
    to: "/admin/events",
    label: "Events",
    icon: faCalendarAlt,
  },
  {
    to: "/admin/registrations",
    label: "Registrations",
    icon: faClipboardList,
  },
  {
    to: "/admin/gallery",
    label: "Gallery",
    icon: faImage,
  },
  {
    to: "/admin/allcontactmessages",
    label: "Contact Messages",
    icon: faMessage,
  },
  {
    to: "/admin/analytics",
    label: "Analytics",
    icon: faChartBar,
  },
  {
    to: "/admin/profile",
    label: "Profile",
    icon: faUser,
  },
];

export default function AdminPanel() {
  const location = useLocation();
  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 bg-white/90 border shadow-xl rounded-2xl p-2 md:p-3 animate-fade-in w-44 md:w-56 items-center transition-all duration-300 group">
      <div className="mb-2 text-center w-full">
        <h2 className="text-lg font-extrabold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
          Admin
        </h2>
      </div>
      <nav className="flex flex-col gap-2 w-full">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            title={link.label}
            className={`flex items-center gap-3 px-2 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-pink-100 transition-all duration-150 shadow-sm w-full ${
              location.pathname === link.to
                ? "bg-gradient-to-r from-blue-400 to-pink-400 text-white shadow-lg"
                : ""
            }`}
          >
            <FontAwesomeIcon icon={link.icon} className="w-6 h-6" />
            <span className="inline-block transition-all duration-200">
              {link.label}
            </span>
          </Link>
        ))}
      </nav>
      <div className="mt-2 w-full">
        <button
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-lg bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-all duration-150 shadow"
          title="Logout"
          onClick={() => {
            // TODO: Implement logout logic
            window.location.href = "/";
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-6 h-6" />
          <span className="inline-block transition-all duration-200">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
