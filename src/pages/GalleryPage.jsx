import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { faSearch, faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
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
  const [galleryImages, setGalleryImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch("/api/gallery/all")
      .then((res) => {
        setGalleryImages(res || []);
        setFilteredImages(res || []);
      })
      .catch(() => setGalleryImages([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    filterMedia();
    // eslint-disable-next-line
  }, [searchTerm, categoryFilter, yearFilter, galleryImages]);

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
          image.uploaded_at &&
          new Date(image.uploaded_at).getFullYear().toString() === yearFilter
      );
    }
    setFilteredImages(filtered);
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
        .map((img) =>
          img.uploaded_at
            ? new Date(img.uploaded_at).getFullYear().toString()
            : null
        )
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

            {/* Filters */}
            <div
              className="mb-8 bg-white/90 p-4 rounded-lg shadow-sm animate-fade-in-up"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-end w-full">
                <div className="flex-1 min-w-[160px]">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <Input
                      id="search"
                      placeholder="Search gallery..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 h-[40px]"
                    />
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Event
                  </label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-full">
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
                <div className="flex-1 min-w-[110px]">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Year
                  </label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-full">
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
                <div className="flex items-end w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className={`flex items-center gap-2 w-full sm:w-43 h-[40px] ${
                      searchTerm !== "" ||
                      categoryFilter !== "all" ||
                      yearFilter !== "all"
                        ? "border-red-300 bg-red-50 text-red-500"
                        : ""
                    }`}
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                      setYearFilter("all");
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />{" "}
                    Clear Filters
                  </Button>
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
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">Loading...</h3>
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">
                      No images found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your filters or search term
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  >
                    {filteredImages.map((image) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative overflow-hidden rounded-lg aspect-square group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
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
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <div>
                            <span className="text-white font-medium block">
                              {image.title || image.event_name}
                            </span>
                            <span className="text-gray-300 text-sm">
                              {image.event_name} •{" "}
                              {new Date(image.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
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
