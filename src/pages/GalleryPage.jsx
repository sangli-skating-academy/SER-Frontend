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

const galleryImages = [
  {
    id: 1,
    src: "/placeholder.svg?height=400&width=600",
    alt: "National Championship 2022",
    category: "Competition",
    year: "2022",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Award ceremony",
    category: "Awards",
    year: "2022",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Training session",
    category: "Training",
    year: "2023",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Team photo",
    category: "Teams",
    year: "2023",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Skating performance",
    category: "Performance",
    year: "2022",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Audience cheering",
    category: "Audience",
    year: "2023",
  },
];
const galleryVideos = [
  // ...existing mock data...
];

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [filteredImages, setFilteredImages] = useState(galleryImages);
  const [filteredVideos, setFilteredVideos] = useState(galleryVideos);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    filterMedia();
    // eslint-disable-next-line
  }, [searchTerm, categoryFilter, yearFilter]);

  const filterMedia = () => {
    let filtered = galleryImages;
    if (searchTerm) {
      filtered = filtered.filter((image) =>
        image.alt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter((image) => image.category === categoryFilter);
    }
    if (yearFilter !== "all") {
      filtered = filtered.filter((image) => image.year === yearFilter);
    }
    setFilteredImages(filtered);

    let filteredVids = galleryVideos;
    if (searchTerm) {
      filteredVids = filteredVids.filter((video) =>
        video.alt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== "all") {
      filteredVids = filteredVids.filter(
        (video) => video.category === categoryFilter
      );
    }
    if (yearFilter !== "all") {
      filteredVids = filteredVids.filter((video) => video.year === yearFilter);
    }
    setFilteredVideos(filteredVids);
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  return (
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search
                </label>
                <div className="relative">
                  <Input
                    id="search"
                    placeholder="Search gallery..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10"
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all text-base px-3 py-2"
                >
                  <option value="all">All Categories</option>
                  <option value="Competition">Competition</option>
                  <option value="Awards">Awards</option>
                  <option value="Training">Training</option>
                  <option value="Teams">Teams</option>
                  <option value="Performance">Performance</option>
                  <option value="Audience">Audience</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Year
                </label>
                <select
                  id="year"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:shadow-lg transition-all text-base px-3 py-2"
                >
                  <option value="all">All Years</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-43"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    setYearFilter("all");
                  }}
                >
                  <FontAwesomeIcon icon={faFilter} className="h-4 w-4" /> Clear
                  Filters
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="photos">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-blue-100/60 rounded-lg overflow-hidden">
              <TabsTrigger
                value="photos"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-pink-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-lg font-semibold transition-all duration-200"
              >
                Photos
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-pink-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-lg font-semibold transition-all duration-200"
              >
                Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photos">
              {filteredImages.length === 0 ? (
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
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div>
                          <span className="text-white font-medium block">
                            {image.alt}
                          </span>
                          <span className="text-gray-300 text-sm">
                            {image.category} • {image.year}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="videos">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">
                    No videos found
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
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {filteredVideos.map((video) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative overflow-hidden rounded-lg aspect-video group shadow-lg hover:shadow-2xl transition-shadow"
                    >
                      <img
                        src={video.src || "/placeholder.svg"}
                        alt={video.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                          <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 text-white ml-1"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 flex items-end p-4">
                        <div>
                          <span className="text-white font-medium block">
                            {video.alt}
                          </span>
                          <span className="text-gray-300 text-sm">
                            {video.category} • {video.year}
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
                <button
                  className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-pink-500 transition-colors"
                  onClick={closeLightbox}
                >
                  <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                </button>
                <img
                  src={selectedImage.src || "/placeholder.svg"}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="bg-black/50 p-4 text-white mt-2 rounded-b-xl">
                  <h3 className="text-xl font-medium">{selectedImage.alt}</h3>
                  <p className="text-gray-300">
                    {selectedImage.category} • {selectedImage.year}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
