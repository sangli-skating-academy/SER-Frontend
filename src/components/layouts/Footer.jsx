import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
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
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-lg "
              >
                <FontAwesomeIcon icon={faFacebookF} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors shadow-lg  delay-100"
              >
                <FontAwesomeIcon icon={faTwitter} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white hover:bg-pink-500 transition-colors shadow-lg  delay-200"
              >
                <FontAwesomeIcon icon={faInstagram} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg  delay-300"
              >
                <FontAwesomeIcon icon={faYoutube} />
                <span className="sr-only">YouTube</span>
              </a>
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
                  to="/faq"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/rules"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Rules & Regulations
                </Link>
              </li>
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
            </ul>
          </div>
          <div className="animate-fade-in-up delay-300">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">
              Contact Us
            </h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>
                Shivaji Stadium Skating Rink, Near Ambrai Garden , Sangli 416416{" "}
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto: sangliskatingacademy@gmail.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  sangliskatingacademy@gmail.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+911234567890"
                  className="hover:text-blue-400 transition-colors"
                >
                  +91 9595893434
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="border-t border-black-800 mt-10 pt-8 text-center text-gray-400 animate-fade-in-up delay-500">
          <p>
            &copy; {new Date().getFullYear()} Sports Club Event Registration
            System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
