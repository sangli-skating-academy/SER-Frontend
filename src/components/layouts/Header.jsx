import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCalendarAlt,
  faImages,
  faInfoCircle,
  faEnvelope,
  faUserCircle,
  faSignOutAlt,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import LoginModal from "../auth/LoginModal";
import Button from "../ui/button.jsx";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { auth, logout } = useAuth();
  const user = auth?.user;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogoutClick = async () => {
    await logout();
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white/10 backdrop-blur-md ${
          isScrolled ? "shadow-lg" : ""
        } transition-shadow duration-300 animate-fade-in`}
      >
        <div className="flex flex-row items-center justify-between py-3 px-5 mx-auto w-full gap-2">
          {/* Logo and Name always visible, now in a single row */}
          <Link to="/" className="flex flex-row items-center group space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 animate-spin-slow">
                <img
                  className="rounded-full h-12 w-18"
                  src="/logo.jpg"
                  alt="Sai Skating Academy"
                  loading="lazy"
                />
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 animate-spin-slow">
                <img
                  className="rounded-full h-12 w-12"
                  src="/logo2.jpeg"
                  alt="Sai Skating Academy"
                  loading="lazy"
                />
              </div>
            </div>
            <span className="hidden sm:inline text-sm md:text-base font-montserrat text-dark text-left tracking-tight group-hover:text-primary transition-colors duration-300 animate-gradient-x whitespace-nowrap">
              Sai Skating Academy, Sangli
            </span>
          </Link>
          {/* Desktop Navigation - centered */}
          <nav className="hidden md:flex flex-1 justify-center space-x-8 items-center">
            <Link
              to="/"
              className={`flex items-center gap-2 transition-colors duration-200 animate-fade-in ${
                location.pathname === "/"
                  ? "text-pink-400 font-bold"
                  : "hover:text-blue-400"
              }`}
            >
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
            <Link
              to="/events"
              className={`flex items-center gap-2 transition-colors duration-200 animate-fade-in ${
                location.pathname === "/events"
                  ? "text-pink-400 font-bold"
                  : "hover:text-blue-400"
              }`}
            >
              <FontAwesomeIcon icon={faCalendarAlt} /> Events
            </Link>
            <Link
              to="/gallery"
              className={`flex items-center gap-2 transition-colors duration-200 animate-fade-in ${
                location.pathname === "/gallery"
                  ? "text-pink-400 font-bold"
                  : "hover:text-blue-400"
              }`}
            >
              <FontAwesomeIcon icon={faImages} /> Gallery
            </Link>
            <Link
              to="/about"
              className={`flex items-center gap-2 transition-colors duration-200 animate-fade-in ${
                location.pathname === "/about"
                  ? "text-pink-400 font-bold"
                  : "hover:text-blue-400"
              }`}
            >
              <FontAwesomeIcon icon={faInfoCircle} /> About Us
            </Link>
            <Link
              to="/contact"
              className={`flex items-center gap-2 transition-colors duration-200 animate-fade-in ${
                location.pathname === "/contact"
                  ? "text-pink-400 font-bold"
                  : "hover:text-blue-400"
              }`}
            >
              <FontAwesomeIcon icon={faEnvelope} /> Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {/* Dashboard/Login button */}
            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ minWidth: 110 }}
                  className={
                    location.pathname === "/dashboard"
                      ? "text-pink-400 font-bold"
                      : ""
                  }
                >
                  <Button
                    variant="outline"
                    className={`px-4 py-2 border-primary text-primary hover:bg-primary hover:text-blue-400 flex items-center gap-2 shadow-md hover:scale-105 transition-transform duration-200 animate-fade-in "${
                      location.pathname === "/dashboard"
                        ? "border-blue-400 bg-blue-50 text-blue-500"
                        : ""
                    }`}
                  >
                    <FontAwesomeIcon icon={faUserCircle} /> Dashboard
                  </Button>
                </Link>
              </>
            )}
            {!user && (
              <Button
                variant="outline"
                className="px-4 py-2 text-blue-400 flex items-center gap-2 shadow-md hover:scale-105 transition-transform duration-200 animate-fade-in"
                onClick={handleLoginClick}
              >
                <FontAwesomeIcon icon={faSignInAlt} /> Login
              </Button>
            )}
            {/* Hamburger always at end in row */}
            <button
              aria-label="Toggle menu"
              className="md:hidden text-dark focus:outline-none hover:text-primary transition-colors duration-200 animate-fade-in w-10 h-10 flex items-center justify-center"
              onClick={toggleMobileMenu}
            >
              <div className="w-8 h-7 flex flex-col justify-center items-center relative">
                <span
                  className={`block absolute h-1 w-7 bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 rounded transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen
                      ? "rotate-45 top-4 bg-pink-500 shadow-lg"
                      : "-translate-y-2 top-2"
                  }`}
                ></span>
                <span
                  className={`block absolute h-1 w-7 bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 rounded transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100 top-3"
                  }`}
                ></span>
                <span
                  className={`block absolute h-1 w-7 bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 rounded transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen
                      ? "-rotate-45 top-4 bg-pink-500 shadow-lg"
                      : "translate-y-2 top-4"
                  }`}
                ></span>
              </div>
            </button>
            {/* Desktop only: Dashboard and Logout side by side */}
            {user && (
              <div className="hidden md:flex flex-row gap-4">
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-gray-600 hover:text-primary flex items-center gap-2 hover:text-red-400 hover:scale-105 border-1 transition-colors duration-200 animate-fade-in"
                  onClick={handleLogoutClick}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Glassmorphism Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-200/60 via-white/60 to-pink-200/60 transition-opacity duration-500 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          {/* Centered Menu */}
          <div className="relative z-10 flex flex-col items-center justify-center w-[90vw] max-w-md h-[80vh] rounded-3xl shadow-2xl border border-white/40 backdrop-blur-2xl p-10 animate-fade-in">
            {/* Decorative Top Line */}
            <div className="h-1 w-2/3 bg-gradient-to-r from-blue-400 via-blue-300 to-pink-200 rounded-full mb-8 animate-pulse"></div>
            <nav className="flex flex-col items-center space-y-8 text-xl font-semibold">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 active:text-pink-500 transition-colors py-2 animate-fade-in drop-shadow-lg ${
                  location.pathname === "/" ? "text-pink-400 font-bold" : ""
                }`}
              >
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
              <Link
                to="/events"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 active:text-pink-500 transition-colors py-2 animate-fade-in drop-shadow-lg ${
                  location.pathname === "/events"
                    ? "text-pink-400 font-bold"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faCalendarAlt} /> Events
              </Link>
              <Link
                to="/gallery"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 active:text-pink-500 transition-colors py-2 animate-fade-in drop-shadow-lg ${
                  location.pathname === "/gallery"
                    ? "text-pink-400 font-bold"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faImages} /> Gallery
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 active:text-pink-500 transition-colors py-2 animate-fade-in drop-shadow-lg ${
                  location.pathname === "/about"
                    ? "text-pink-400 font-bold"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} /> About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 active:text-pink-500 transition-colors py-2 animate-fade-in drop-shadow-lg ${
                  location.pathname === "/contact"
                    ? "text-pink-400 font-bold"
                    : ""
                }`}
              >
                <FontAwesomeIcon icon={faEnvelope} /> Contact
              </Link>
              {/* {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 hover:text-pink-500 transition-colors py-2 animate-fade-in drop-shadow-lg md:hidden"
                >
                  <FontAwesomeIcon icon={faUserCircle} /> Dashboard
                </Link>
              )} */}
            </nav>
            {/* Decorative Bottom Line */}
            <div className="h-1 w-2/3 bg-gradient-to-l from-blue-400 via-blue-300 to-pink-200 rounded-full  animate-pulse"></div>
            {/* Mobile only: Dashboard and Logout at bottom */}
            {user && (
              <div className="w-full flex flex-col items-center mt-8 md:hidden">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-center gap-3 mb-3 font-semibold border-1 rounded-md transition-colors py-2 animate-fade-in drop-shadow-lg ${
                    location.pathname === "/dashboard"
                      ? "text-pink-400 font-bold bg-pink-50"
                      : "text-primary hover:text-pink-500"
                  }`}
                >
                  <FontAwesomeIcon icon={faUserCircle} /> Dashboard
                </Link>
                <Button
                  variant="ghost"
                  className="w-full px-4 py-2 text-gray-600 hover:text-red-400 font-semibold flex items-center justify-center gap-2 hover:scale-105 border-1 transition-colors duration-200 animate-fade-in"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogoutClick();
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </>
  );
};

export default Header;
