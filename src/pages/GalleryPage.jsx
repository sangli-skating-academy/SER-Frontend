import { useState, useEffect } from "react";
import Button from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import Input from "../components/ui/input";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faTimes,
  faSortAmountDown,
  faSortAmountUp,
  faCalendarAlt,
  faImages,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import { apiFetch } from "../services/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc"); // date-desc, date-asc, name-asc
  const [galleryImages, setGalleryImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch("/api/gallery/all")
      .then((res) => {
        const galleryFiltered = res.filter(
          (item) => item.image_location === "gallery"
        );
        setGalleryImages(galleryFiltered);
        setFilteredImages(galleryFiltered);
      })
      .catch(() => setGalleryImages([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    filterMedia();
    // eslint-disable-next-line
  }, [searchTerm, categoryFilter, yearFilter, sortBy, galleryImages]);

  const filterMedia = () => {
    let filtered = galleryImages;
    if (searchTerm) {
      filtered = filtered.filter((image) =>
        (image.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (image) =>
          (image.event_name || "").toLowerCase() ===
          categoryFilter.toLowerCase()
      );
    }
    if (yearFilter !== "all") {
      filtered = filtered.filter(
        (image) =>
          new Date(image.date).getFullYear().toString() ===
          yearFilter.toString()
      );
    }

    // Sort filtered images
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "name-asc":
          return (a.title || a.event_name || "").localeCompare(
            b.title || b.event_name || ""
          );
        default:
          return 0;
      }
    });

    setFilteredImages(filtered);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setYearFilter("all");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm !== "") count++;
    if (categoryFilter !== "all") count++;
    if (yearFilter !== "all") count++;
    return count;
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  // Get unique event titles and years for filters
  const eventTitles = [
    ...new Set(galleryImages.map((img) => img.event_name).filter(Boolean)),
  ];
  const years = [
    ...new Set(
      galleryImages
        .map((img) => img.date && new Date(img.date).getFullYear())
        .filter(Boolean)
    ),
  ];

  return (
    <>
      <Helmet>
        <title>Gallery | Sai Skating Academy</title>
        <meta
          name="description"
          content="View the gallery of skating events, awards, and training sessions at Sai Skating Academy."
        />
        <meta property="og:title" content="Gallery | Sai Skating Academy" />
        <meta
          property="og:description"
          content="View the gallery of skating events, awards, and training sessions at Sai Skating Academy."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-50 to-blue-50 animate-fade-in">
        <Header />
        <main className="flex-grow py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10 animate-fade-in-up">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-400 via-blue-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                Event Gallery
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Explore photos and videos from our past skating events
              </p>
            </div>

            {/* Enhanced Filters & Controls */}
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-100">
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                  />
                  <input
                    type="text"
                    placeholder="Search gallery by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Filter & Sort Controls */}
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-blue-100">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Filter Controls */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon
                          icon={faImages}
                          className="mr-2 text-blue-500"
                        />
                        Event
                      </label>
                      <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                      >
                        <SelectTrigger className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="All Events" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Events</SelectItem>
                          {eventTitles.map((title) => (
                            <SelectItem key={title} value={title}>
                              {title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="mr-2 text-green-500"
                        />
                        Year
                      </label>
                      <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger className="w-full border-gray-200 focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="All Years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Years</SelectItem>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Sort Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 lg:flex-col lg:gap-2">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={
                          sortBy.includes("desc")
                            ? faSortAmountDown
                            : faSortAmountUp
                        }
                        className="text-gray-500 h-4 w-4"
                      />
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40 border-gray-200 focus:ring-2 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date-desc">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="mr-2"
                            />
                            Newest First
                          </SelectItem>
                          <SelectItem value="date-asc">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="mr-2"
                            />
                            Oldest First
                          </SelectItem>
                          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Active Filters & Clear Button */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FontAwesomeIcon icon={faEye} className="text-blue-500" />
                    <span>
                      Showing {filteredImages.length} image
                      {filteredImages.length !== 1 ? "s" : ""}
                    </span>
                    {getActiveFilterCount() > 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {getActiveFilterCount()} filter
                        {getActiveFilterCount() !== 1 ? "s" : ""} active
                      </span>
                    )}
                  </div>

                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <FontAwesomeIcon
                        icon={faFilter}
                        className="mr-2 h-3 w-3"
                      />
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Tabs defaultValue="photos">
              <TabsList className="grid w-full grid-cols-1 mb-8 bg-blue-100/60 rounded-lg overflow-hidden">
                <TabsTrigger
                  value="photos"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-pink-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-lg font-semibold transition-all duration-200"
                >
                  Photos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="photos">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="text-center py-16 animate-fade-in">
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon
                          icon={faImages}
                          className="h-8 w-8 text-gray-400"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Images Found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        We couldn't find any images matching your current
                        filters.
                      </p>
                      {getActiveFilterCount() > 0 && (
                        <Button
                          onClick={clearAllFilters}
                          variant="outline"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                    {filteredImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm border border-blue-100 animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => openLightbox(image)}
                      >
                        <img
                          src={
                            image.image_url &&
                            !image.image_url.startsWith("http")
                              ? `${
                                  import.meta.env.VITE_API_URL ||
                                  "http://localhost:3000"
                                }${image.image_url.startsWith("/") ? "" : "/"}${
                                  image.image_url
                                }`
                              : image.image_url || "/placeholder.svg"
                          }
                          alt={
                            image.title || image.event_name || "Gallery image"
                          }
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-white font-semibold block text-sm mb-1">
                              {image.title || image.event_name}
                            </span>
                            <div className="flex items-center gap-2 text-gray-200 text-xs">
                              <FontAwesomeIcon
                                icon={faCalendarAlt}
                                className="h-3 w-3"
                              />
                              <span>
                                {new Date(image.date).toLocaleDateString()}
                              </span>
                              {image.event_name && image.title && (
                                <>
                                  <span>•</span>
                                  <span>{image.event_name}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                              <FontAwesomeIcon
                                icon={faEye}
                                className="h-4 w-4 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Lightbox */}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
                onClick={closeLightbox}
              >
                <div className="relative max-w-4xl w-full">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Lightbox Image */}
                    <img
                      src={
                        selectedImage.image_url &&
                        !selectedImage.image_url.startsWith("http")
                          ? `${
                              import.meta.env.VITE_API_URL ||
                              "http://localhost:3000"
                            }${
                              selectedImage.image_url.startsWith("/") ? "" : "/"
                            }${selectedImage.image_url}`
                          : selectedImage.image_url || "/placeholder.svg"
                      }
                      alt={
                        selectedImage.title ||
                        selectedImage.event_name ||
                        "Gallery image"
                      }
                      className="max-h-[80vh] max-w-full rounded-lg shadow-xl"
                      style={{ objectFit: "contain" }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      className="absolute top-4 right-4 text-white bg-black/60 rounded-full p-2 hover:bg-pink-500 transition-colors shadow-lg focus:outline-none z-20"
                      onClick={closeLightbox}
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="bg-black/50 p-4 text-white mt-2 rounded-b-xl">
                    <h3 className="text-xl font-medium">
                      {selectedImage.title || selectedImage.event_name}
                    </h3>
                    <p className="text-gray-300">
                      {selectedImage.event_name} •{" "}
                      {selectedImage.date
                        ? new Date(selectedImage.date).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
