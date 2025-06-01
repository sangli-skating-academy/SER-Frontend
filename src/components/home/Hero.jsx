import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkating } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/button";

const Hero = () => {
  return (
    <>
      <section
        className="relative h-[70vh] min-h-[400px] flex items-center justify-center text-dark bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(59,130,246,0.13) 0%, rgba(236,72,153,0.10) 60%, rgba(255,255,255,0.85) 100%)",
        }}
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        {/* Aesthetic Blurred Gradient Balls */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-blue-400/80 to-pink-300/80 rounded-full blur-3xl animate-pulse z-0" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tr from-pink-400/80 to-blue-200/60 rounded-full blur-2xl animate-pulse z-0" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-blue-200/90 to-pink-200/60 rounded-full blur-2xl animate-pulse z-0 -translate-x-1/2 -translate-y-1/2" />
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl z-0 border border-white/30 shadow-2xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-9xl flex flex-col items-center sm:items-start animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4 sm:justify-start justify-center w-full">
              <span className="inline-flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-tr from-blue-500 to-blue-300 shadow-lg animate-bounce-slow">
                <FontAwesomeIcon
                  icon={faSkating}
                  className="text-3xl text-white drop-shadow-xl animate-spin-slow"
                />
              </span>
              <span className="text-lg md:text-4xl font-semibold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x sm:text-left text-center">
                National Level Events
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-montserrat mb-4 tracking-tight animate-gradient-x bg-gradient-to-r from-blue-400 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow-xl sm:text-left text-center w-full">
              Join the{" "}
              <span className="text-blue-600 drop-shadow-lg">
                Sangli Miraj Kupwad Roller Skating Association, Sangli
              </span>{" "}
              Sai Skating Academy
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl text-gray-700 animate-fade-in delay-200 sm:text-left text-center w-full">
              Register for exciting skating events across all categories, age
              groups, and skill levels. Perfect for individuals and teams.
              Experience the thrill, the community, and the competition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full animate-fade-in-up delay-300 items-center sm:items-start">
              <Button
                size="lg"
                className="px-8 py-3 bg-gradient-to-r from-blue-400 to-pink-400 hover:from-pink-500 hover:to-blue-500 rounded-full font-bold font-montserrat shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in w-11/12 sm:w-auto mx-auto sm:mx-0"
              >
                <Link href="#events">
                  <span className="flex items-center gap-2 justify-center">
                    <FontAwesomeIcon
                      icon={faSkating}
                      className="text-lg md:text-xl"
                    />
                    Explore Events
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Subtle animated lines */}
        <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-blue-400 via-pink-300 to-blue-200 opacity-60 animate-gradient-x" />
      </section>
    </>
  );
};

export default Hero;
