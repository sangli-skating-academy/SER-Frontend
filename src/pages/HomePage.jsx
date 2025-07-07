import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/layouts/Header";
import Hero from "../components/home/Hero";
import EventsSection from "../components/home/EventSection";
import TimelineSection from "../components/home/TimelineSection";
import ContactSection from "../components/home/ContactSection";
import Footer from "../components/layouts/Footer";

const HomePage = () => {
  // Update page title for SEO
  useEffect(() => {
    document.title = "Sangli Skating";
  }, []);
  return (
    <>
      <Helmet>
        <title>Sangli Skating</title>
        <meta
          name="description"
          content="Register for exciting skating events across all categories, age groups, and skill levels. Perfect for individuals and teams."
        />
        <meta property="og:title" content="Sangli Skating" />
        <meta
          property="og:description"
          content="Register for exciting skating events across all categories, age groups, and skill levels."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <EventsSection />
          <TimelineSection />
          <ContactSection />
          {/* 
          <GallerySection />
          */}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
