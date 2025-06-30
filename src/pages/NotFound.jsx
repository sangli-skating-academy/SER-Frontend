import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { faSadTear } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Sai Skating Academy</title>
        <meta
          name="description"
          content="Oops! The page you are looking for does not exist or has been moved."
        />
        <meta
          property="og:title"
          content="404 - Page Not Found | Sai Skating Academy"
        />
        <meta
          property="og:description"
          content="Oops! The page you are looking for does not exist or has been moved."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <div className="relative w-full max-w-lg mx-4 p-8 rounded-3xl shadow-2xl bg-white/90 border border-blue-100 animate-fade-in-up">
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-pink-400 to-blue-400 shadow-lg">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-white text-4xl drop-shadow-lg animate-pulse"
              />
            </span>
          </div>
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x mb-2">
            404
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2 animate-fade-in delay-100">
            <FontAwesomeIcon
              icon={faSadTear}
              className="text-blue-400 text-xl"
            />
            <span className="text-xl font-semibold text-gray-800">
              Page Not Found
            </span>
          </div>
          <p className="text-center text-gray-500 mb-6 animate-fade-in delay-200">
            Oops! The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex justify-center animate-fade-in delay-300">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-pink-400 text-white font-semibold shadow-lg hover:from-pink-500 hover:to-blue-500 transition-all "
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
