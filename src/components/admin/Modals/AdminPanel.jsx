import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCalendarAlt,
  faClipboardList,
  faImage,
  faMessage,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const navLinks = [
  { to: "/admin", label: "Dashboard", icon: faTachometerAlt },
  { to: "/admin/events", label: "Events", icon: faCalendarAlt },
  { to: "/admin/registrations", label: "Registrations", icon: faClipboardList },
  { to: "/admin/gallery", label: "Gallery", icon: faImage },
  { to: "/admin/allcontactmessages", label: "Messages", icon: faMessage },
];

export default function AdminPanel() {
  const location = useLocation();

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center 
                 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-xl 
                 rounded-t-3xl px-2 sm:px-4 py-2 transition-all duration-300"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        WebkitPaddingBottom: "env(safe-area-inset-bottom)",
      }}
      role="navigation"
      aria-label="Admin Navigation"
    >
      <nav className="flex flex-1 justify-evenly max-w-3xl">
        {navLinks.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              title={link.label}
              className={`group flex flex-col items-center justify-center gap-1 px-2 py-1 sm:px-4 sm:py-2 
                         rounded-xl transition-all duration-300 relative
                         ${
                           active
                             ? "text-blue-600"
                             : "text-gray-600 hover:text-blue-500"
                         }`}
              aria-current={active ? "page" : undefined}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                ${
                  active
                    ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg scale-110"
                    : "bg-gray-100 group-hover:bg-blue-100"
                }`}
              >
                <FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] sm:text-xs font-medium transition-all duration-300 ${
                  active ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          className="group flex flex-col items-center justify-center gap-1 px-2 py-1 sm:px-4 sm:py-2
                     rounded-xl transition-all duration-300 text-red-500 hover:text-red-600"
          title="Logout"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 group-hover:bg-red-200 transition-all duration-300">
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
          </div>
          <span className="text-[11px] sm:text-xs font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  );
}
