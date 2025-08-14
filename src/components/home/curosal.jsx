import React, { useState, useEffect, useRef } from "react";
import { apiFetch } from "../../services/api";

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [images, setImages] = useState([]);
  const timeoutRef = useRef(null);
  const delay = 5000;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    apiFetch("/api/gallery/all")
      .then((data) => {
        const homeScreenImages = data
          .filter((item) => item.image_location === "home_screen")
          .map((item) => ({
            url: item.image_url,
            alt: item.title,
          }));
        setImages(homeScreenImages);
      })
      .catch((err) =>
        console.error("Failed to fetch home screen gallery:", err)
      );
  }, []);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, delay);
    return () => resetTimeout();
  }, [current, images.length]);

  const getTransformStyle = () => {
    if (current === images.length - 1 && images.length > 1) {
      return `translateX(-${current * 100}%)`;
    }
    return `translateX(-${current * 100}%)`;
  };

  return (
    <div className="relative w-full max-w-8xl mx-auto overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-blue-50 via-pink-50 to-white">
      {/* Decorative Gradient Blurs */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-br from-blue-400/60 to-pink-300/50 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-16 w-40 h-40 bg-gradient-to-tr from-pink-400/60 to-blue-200/40 rounded-full blur-2xl animate-pulse" />

      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: getTransformStyle() }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="w-full flex-shrink-0 relative h-[300px] sm:h-[450px] md:h-[550px] lg:h-[650px]"
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            {/* Caption */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white px-4">
              <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg animate-fade-in">
                {img.title}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center space-x-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === current
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
