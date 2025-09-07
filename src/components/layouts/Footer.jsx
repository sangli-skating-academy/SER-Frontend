import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-blue-900 via-blue-800 to-pink-900 text-white relative overflow-hidden">
      {/* Decorative Gradient Bar */}
      <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-blue-400 via-pink-300 to-blue-200 opacity-60 animate-gradient-x" />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
              Sai Skating Academy
            </h3>
            <p className="text-gray-300">
              The ultimate platform for skating competition registrations and
              event management.
            </p>
            <div className="flex items-center space-x-3 mt-4">
              <span className="text-gray-300 font-medium">Follow us on</span>
              <a
                href="https://www.youtube.com/@surajshinde8554"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sai Skating Academy YouTube Channel"
                className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg delay-300 text-2xl"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <span className="text-gray-300 font-medium hidden sm:inline">
                YouTube
              </span>
            </div>
          </div>
          <div className="animate-fade-in-up delay-100">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-fade-in-up delay-200">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/Refund"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Cancellation/ Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-fade-in-up delay-300">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">
              Contact Us
            </h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>
                Chatrapati Shivaji Stadium Skating Rink, Near Amrai Garden ,
                Sangli 416416{" "}
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto: saiskating2200@gmail.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  saiskating2200@gmail.com
                </a>
              </p>
              <p>
                Phone: <br />
                <a
                  href="tel:+9595893434"
                  className="hover:text-blue-400 transition-colors"
                >
                  +91 9595893434 (Mr. Suraj A. Shinde)
                </a>
                <br />
                <a
                  href="tel:+919595473434"
                  className="hover:text-blue-400 transition-colors"
                >
                  +91 9595473434 (Mrs. Parveen S. Shinde)
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="border-t border-black-800 mt-10 pt-8 text-center text-gray-400 animate-fade-in-up delay-500">
          <p>Made by Rakesh Yadav & Prabhu Badkar</p>
        </div>
      </div>
    </footer>
  );
}
