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
    document.title = "Sai Skating Academy - Join the Skating Community";
  }, []);
  return (
    <>
      <Helmet>
        <title>Sai Skating Academy - Join the Skating Community</title>
        <meta
          name="description"
          content="Register for exciting skating events across all categories, age groups, and skill levels. Perfect for individuals and teams."
        />
        <meta property="og:title" content="Sai Skating Academy" />
        <meta
          property="og:description"
          content="Register for exciting skating events across all categories, age groups, and skill levels."
        />
        <meta property="og:type" content="website" />
        {/* Add more meta tags as needed */}
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
