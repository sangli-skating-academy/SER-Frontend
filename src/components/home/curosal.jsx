import React, { useState, useEffect, useRef } from "react";
import { apiFetch } from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlay,
  faPause,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [images, setImages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const timeoutRef = useRef(null);
  const delay = 4000;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    setIsLoading(true);
    apiFetch("/api/gallery/all")
      .then((data) => {
        const homeScreenImages = data
          .filter((item) => item.image_location === "home_screen")
          .map((item) => ({
            url: item.image_url,
            alt: item.title || "Gallery Image",
            title: item.title,
          }));
        setImages(homeScreenImages);
        // Preload first image
        if (homeScreenImages.length > 0) {
          const img = new Image();
          img.onload = () => setImageLoaded((prev) => ({ ...prev, 0: true }));
          img.src = homeScreenImages[0].url;
        }
      })
      .catch((err) =>
        console.error("Failed to fetch home screen gallery:", err)
      )
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isPlaying || isHovered || images.length <= 1) return;

    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, delay);
    return () => resetTimeout();
  }, [current, images.length, isPlaying, isHovered]);

  // Preload next image
  useEffect(() => {
    if (images.length > 0) {
      const nextIndex = (current + 1) % images.length;
      if (!imageLoaded[nextIndex]) {
        const img = new Image();
        img.onload = () =>
          setImageLoaded((prev) => ({ ...prev, [nextIndex]: true }));
        img.src = images[nextIndex].url;
      }
    }
  }, [current, images, imageLoaded]);

  const goToNext = React.useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = React.useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const togglePlayPause = React.useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      }
    },
    [goToNext, goToPrev, togglePlayPause]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading) {
    return (
      <div className="relative w-full max-w-8xl mx-auto overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-blue-50 via-pink-50 to-white">
        <div className="h-[300px] sm:h-[450px] md:h-[550px] lg:h-[650px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="relative w-full max-w-8xl mx-auto overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-blue-50 via-pink-50 to-white">
        <div className="h-[300px] sm:h-[450px] md:h-[550px] lg:h-[650px] flex items-center justify-center">
          <p className="text-slate-600 font-medium">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-8xl mx-auto overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-blue-50 via-pink-50 to-white group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Image carousel"
    >
      {/* Decorative Gradient Blurs */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-br from-blue-400/60 to-pink-300/50 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-16 w-40 h-40 bg-gradient-to-tr from-pink-400/60 to-blue-200/40 rounded-full blur-2xl animate-pulse" />

      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="w-full flex-shrink-0 relative h-[300px] sm:h-[450px] md:h-[550px] lg:h-[650px]"
          >
            <img
              src={img.url}
              alt={img.alt}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded[idx] ? "opacity-100" : "opacity-0"
              }`}
              loading={idx === 0 ? "eager" : "lazy"}
              onLoad={() =>
                setImageLoaded((prev) => ({ ...prev, [idx]: true }))
              }
            />
            {/* Loading placeholder */}
            {!imageLoaded[idx] && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            {/* Caption */}
            {img.title && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center text-white px-4 max-w-4xl">
                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-2xl animate-fade-in leading-tight">
                  {img.title}
                </h2>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous image"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next image"
          >
            <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Controls */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={togglePlayPause}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-2 px-4 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            <FontAwesomeIcon
              icon={isPlaying ? faPause : faPlay}
              className="w-4 h-4"
            />
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {images.length > 1 && isPlaying && (
        <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-100 ease-linear"
            style={{
              width: `${((Date.now() % delay) / delay) * 100}%`,
              animation: `progress ${delay}ms linear infinite`,
            }}
          />
        </div>
      )}

      {/* Dots/Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 w-full flex justify-center space-x-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full ${
                idx === current
                  ? "w-8 h-3 bg-white shadow-lg"
                  : "w-3 h-3 bg-white/50 hover:bg-white/70"
              }`}
            >
              {idx === current && (
                <div className="absolute inset-0 bg-gradient-to-r from-white-400 to-white-500 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {current + 1} / {images.length}
        </div>
      )}

      {/* CSS for progress bar animation */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
